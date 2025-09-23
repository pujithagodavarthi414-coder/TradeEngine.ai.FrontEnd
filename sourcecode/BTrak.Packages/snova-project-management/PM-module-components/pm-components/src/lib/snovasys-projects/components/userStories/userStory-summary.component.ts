import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ChangeDetectionStrategy, ViewChildren, QueryList, ChangeDetectorRef, TemplateRef } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { Observable } from "rxjs/internal/Observable";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { ActivatedRoute, Router } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import * as _ from 'underscore';
import { Actions, ofType } from "@ngrx/effects";
import { Subject } from "rxjs";
import { combineLatest } from "rxjs/index";
import { map } from "rxjs/operators";
import { take, takeUntil, tap } from "rxjs/operators";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { UserStory } from "../../models/userStory";
import { TranslateService } from "@ngx-translate/core";
import { ConfigurationSettingModel } from "../../models/configurationType";
import { DatePipe } from "@angular/common";
import { InsertLogTimeTriggered, UserStoryLogTimeActionTypes } from "../../store/actions/userStory-logTime.action";
import { UserStoryLogTimeModel } from "../../models/userStoryLogTimeModel";
import { Location } from "@angular/common";
import * as userStoryActions from "../../store/actions/userStory.actions";
import * as projectModuleReducers from "../../store/reducers/index";
import * as testRailModuleReducers from "@snovasys/snova-testrepo"
import { SprintWorkItemActionTypes, GetSprintWorkItemByIdTriggered } from "../../store/actions/sprint-userstories.action";
import { UniqueUserstoryDialogComponent } from "./unique-userstory-dialog.component";
import { ProjectGoalsService } from "../../services/goals.service";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { TestCase } from '@snovasys/snova-testrepo';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { LoadBugsCountByUserStoryIdTriggered } from '../../store/actions/comments.actions';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { TestCaseActionTypes, LoadBugsByGoalIdTriggered, LoadBugsByUserStoryIdTriggered } from '@snovasys/snova-testrepo';
import "../../../globaldependencies/helpers/fontawesome-icons"
import { FeatureIds } from '../../../globaldependencies/constants/feature-ids';

@Component({
  selector: "gc-userstory-summary",
  templateUrl: "userStory-summary.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
  .deadline-date {
    top: 5px;
    position: relative;
  }

  .deadline-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media only screen and (max-width: 1226px) {
    .estimate-class {
      display: inline !important;
    }
  }
  @media only screen  (max-width: 1336px) {
    .estimate-class {
      display: none !important;
    }
  }
  `],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class UserStorySummaryComponent extends AppFeatureBaseComponent implements OnInit {

  currentUserStory: boolean;
  @ViewChildren('userStoryBugsPopover') userStoryBugPopover;
  @Output() completeUserStory = new EventEmitter<any>();
  @Output() removeUserStory = new EventEmitter<any>();
  @Output() openUniquePage = new EventEmitter<any>();
  @Output() updateAutoLog = new EventEmitter<any>();
  @ViewChild("screenShotComponent") private screenShotComponent: TemplateRef<any>;

  //  anyOperationInProgressForAutoLogging$: Observable<boolean>;
  @Input("isLoading")
  set _isLoading(data: boolean) {
    if (data == false) {
      this.currentUserStory = false;
    }
  }

  @Input() fromApp: boolean;

  @Input() page: boolean;
  autoLog: boolean;
  @Input("isEditFromProjects")
  set _isEditFromProjects(data: boolean) {
    if (data === false) {
      this.isEditFromProjects = false;
    }
    else {
      this.isEditFromProjects = true;
    }
  }

  @Input("loggedUser") loggedUserId: string;

  userStory;
  @Input("userStory")
  set _userStory(data: UserStory) {
    this.userStory = data;
    if (this.userStory) {
      this.autoLog = this.userStory.autoLog;
      this.getSoftLabelConfigurations();
      this.checkToggleForSprints(this.userStory.subUserStories);

      this.estimatedTime = this.userStory.estimatedTime;
      this.totalEstimatedTime = this.userStory.totalEstimatedTime;
      if (this.userStory.userStoryArchivedDateTime) {
        this.isArchived = false;
      } else {
        this.isArchived = true;
      }
      if (this.userStory.userStoryParkedDateTime) {
        this.isParked = false;
      } else {
        this.isParked = true;
      }

      if (this.userStory.isBacklog == true) {
        this.isActiveGoalsPage = false;
      } else {
        if (this.userStory.goalStatusId) {
          this.checkGoalStatus();
        } else {
          if (this.userStory.sprintStartDate && !this.userStory.isReplan && !this.userStory.sprintInActiveDateTime && !this.userStory.isComplete) {
            this.isActiveGoalsPage = true;
          } else if (this.userStory.sprintStartDate && this.userStory.isReplan && !this.userStory.sprintInActiveDateTime && !this.userStory.isComplete) {
            this.replanGoalUserStory = true;
          } else if (!this.userStory.sprintStartDate) {
            this.isActiveGoalsPage = false;
            this.backlogGoalUserStory = true;
          } else if (this.userStory.sprintInActiveDateTime || this.userStory.isComplete) {
            this.archivedGoalUserStory = true;
          }

          this.showIcons = true;
        }

        if (this.userStory.isBugBoard) {
          this.isSuperagileBoard = false;

        }
        else if (this.userStory.isSuperAgileBoard) {
          this.isSuperagileBoard = true;

        } else {
          this.isSuperagileBoard = false;
        }
      }
    }

    if (this.userStory.tag) {
      this.userStoryInputTags = this.userStory.tag.split(",");
      this.cdRef.detectChanges();
    } else {
      this.userStoryInputTags = [];
    }
  }

  goalReplanId;
  @Input("goalReplanId")
  set _goalReplanId(data: string) {
    this.goalReplanId = data;
  }

  isUserStoriesPage;
  @Input("isUserStoriesPage")
  set _isUserStoriesPage(data: boolean) {
    this.isUserStoriesPage = data;
  }


  isAllGoalsPage;
  @Input('isAllGoalsPage')
  set _isAllGoalsPage(data: boolean) {
    this.isAllGoalsPage = data;
    this.setRolePermissionsForUserStory();
  }

  userStoryChecked;
  @Input('userStoryChecked')
  set _userStoryChecked(data: boolean) {
    this.userStoryChecked = data;
    this.selectedUserStories = [];
  }


  allUserStorieSelected;
  @Input('allUserStorieSelected')
  set _allUserStorieSelected(data: boolean) {
    this.allUserStorieSelected = data;
    if (this.allUserStorieSelected) {
      this.userStoryChecked = true;
    }
  }
  isSubTasksPage
  @Input('isSubTasksPage')
  set _isSubTaksPage(data: boolean) {
    this.isSubTasksPage = data;
  }

  @Input('treeStructure')
  set _treeStructure(data: boolean) {
    this.treeStructure = data;
    
  }
  @Input('userStorySelected') userStorySelected: boolean;
  @Input('isArchivedGoal') isArchivedGoal: boolean;
  @Input('isSprintView') isSprintView: boolean;

  @Input("isDeadlinedispaly")
  set _isDeadlinedispaly(data: boolean) {
    this.isDeadlinedispaly = data;
  }


  isShow;
  @Input("isShow")
  set _isShow(data: boolean) {
    this.isShow = data;
  }

  @Input("isSprintUserStories")
  set _isSprintUserStories(data: boolean) {
    this.isSprintUserStories = data;
  }

  @Input('notFromAudits')
  set _notFromAudits(data: boolean) {
    if (data || data == false) {
      this.notFromAudits = data;
    }
    else
      this.notFromAudits = true;
  }

  @Input("isAddUserStory")
  set _isAddUserStory(data: boolean) {
    this.isAddUserStory = data;
  }

  CanAccess_Company_IsStartEnabled$: Observable<Boolean>;
  @Output() close = new EventEmitter<any>();
  @Output() highLightUserStory = new EventEmitter<string>();
  @Output() selectUserStory = new EventEmitter<object>();
  @Output() selectSprintUserStory = new EventEmitter<object>();
  // @Output() completeUserStory = new EventEmitter<any>();
  // @Output() removeUserStory = new EventEmitter<any>();
  // @Output() openUniquePage = new EventEmitter<any>();
  @Output() UserStorylist = new EventEmitter<object>();
  @Output() selectShiftButtonUserStorylist = new EventEmitter<string>();
  @Output() selectShiftButtonSubUserStorylist = new EventEmitter<string>();
  @Output() selectedToggleEvent = new EventEmitter<string>();
  @Output() selectedSprintToggleEvent = new EventEmitter<string>();
  @Output() emitUserStoryCount = new EventEmitter<any>();
  // @ViewChildren('userStoryBugsPopover') userStoryBugPopover;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @ViewChild("archiveUserStoryPopover") archiveUserStory: SatPopover;
  @ViewChild("parkUserStoryPopover") parkUserStoryPopUp: SatPopover;
  @ViewChild("userstoryTagsPopover") userStorytagsPopUp: SatPopover;
  @ViewChildren("inLineEditUserStoryPopup") inLineEditPopUps;
  @ViewChildren("archivePopOver") archivePopUps
  contextMenuPosition = { x: '0px', y: '0px' };
  anyOperationInProgress$: Observable<any>;
  configurationList$: Observable<ConfigurationSettingModel[]>;
  entityRolePermisisons$: Observable<EntityRoleFeatureModel[]>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  scenarioBugs$: Observable<TestCase[]>;
  scenarioBugs: TestCase[];
  entityRolePermisisons: EntityRoleFeatureModel[];
  userStoryIds = [];
  userStoryModel: UserStory;
  parkUserStory: UserStory;
  showIcons: boolean;
  archiveStory: UserStory;
  isAddUserStory: boolean;
  isArchiveUserStory: boolean;
  isParkUserStory: boolean;
  userStoryPermissions$: Observable<UserStory>;
  showUserStoryStatusName: boolean;
  isLoadBugs: boolean;
  userStoryPermission: any;
  tab: string;
  isSuperagileBoard: boolean;
  selectedUserStoryId: string;
  isUserStorySelected: boolean;
  selectedUserStories: string[] = [];
  isActiveGoalsPage: boolean;
  titleText: string;
  estimatedTime: string;
  totalEstimatedTime: string;
  isArchived: boolean;
  isDeadlinedispaly: boolean;
  archivedGoalUserStory: boolean = false;
  replanGoalUserStory: boolean;
  backlogGoalUserStory: boolean;
  isParked: boolean;
  isSprintUserStories: boolean;
  ParkedGoalUserStory: boolean = false;
  workItemInProgress: boolean = false;
  isInlineEdit: boolean;
  isSubTask: boolean;
  isSubTasksShow: boolean;
  treeStructure: boolean = true;
  isEditFromProjects: boolean = true;
  notFromAudits: boolean = true;
  isInlineEditForEstimatedTime: boolean;
  isInlineEditForUserStoryStatus: boolean;
  isInlineEditForUserStoryOwner: boolean;
  isInlineEditForSprintEstimatedTime: boolean;
  isPermissionForAddUserStory: boolean;
  isPermissionForArchiveUserStory: boolean;
  isPermissionForParkUserStory: boolean;
  isPermissionForViewUserStories: boolean;
  isPermissionForBulkUpdate: boolean;
  isPermissionForBulkUpdateUserStory: Boolean;
  isInlineEditForUserStoryOwnerInActive: boolean;
  isInlineEditForUserStoryOwnerInBacklog: boolean;
  isInlineEditForUserStoryOwnerInReplan: boolean;
  isActivePermission: Boolean;
  isBacklogPermission: Boolean;
  isReplanPermission: Boolean;
  isInlineEditForUserStoryEstimatedTimeInActive: boolean;
  isInlineEditForUserStoryEstimatedTimeInBacklog: boolean;
  isInlineEditForUserStoryEstimatedTimeInReplan: boolean;
  isActivePermissionForEstimatedTime: Boolean;
  isBacklogPermissionForEstimatedTime: Boolean;
  isReplanPermissionForEstimatedTime: Boolean;
  isInlineEditForUserStoryDeadLineDateInActive: boolean;
  isInlineEditForUserStoryDeadLineDateInBacklog: boolean;
  isInlineEditForUserStoryDeadLineDateInReplan: boolean;
  isActivePermissionForDeadLineDate: Boolean;
  isBacklogPermissionForDeadLineDate: Boolean;
  isReplanPermissionForDeadLineDate: Boolean;
  userStoryInputTags: string[] = [];
  isTagsPopUp: boolean;
  uniqueNumberUrl: string;
  profileImage: string;
  isEnableToggle: boolean;
  defaultProfileImage: string = "assets/images/faces/18.png";
  public ngDestroyed$ = new Subject();
  loggedUser: string;
  userStoryLogTime = new UserStoryLogTimeModel();
  show: boolean;
  inLineUserStory: UserStory;
  isFromBugsCount: boolean;
  userStoryBugsInProgress$: Observable<boolean>;
  canAccess_feature_ViewActivityScreenshots:boolean;
  constructor(location: Location,
    private toastr: ToastrService,
    private store: Store<State>,
    private testRailStore: Store<testRailModuleReducers.State>,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private actionUpdates$: Actions,
    private cdRef: ChangeDetectorRef,
    private softLabelsPipe: SoftLabelPipe,
    private datePipe: DatePipe,
    private router: Router,
    public dialog: MatDialog,
    private goalService: ProjectGoalsService) {
    super();
    this.isPermissionForViewUserStories=true;
    let roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_ViewActivityScreenshots = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewActivityScreenshots.toString().toLowerCase(); }) != null;
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryLogTimeActionTypes.InsertLogTimeCompleted)
      )

      .subscribe();
   

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestCaseActionTypes.LoadBugsByGoalIdCompleted),
        tap(() => {
          this.scenarioBugs$ = this.testRailStore.pipe(select(testRailModuleReducers.getBugsByGoalId));
          this.scenarioBugs$.subscribe(x =>
            this.scenarioBugs = x
          );
          this.cdRef.detectChanges();
        })
      )
      .subscribe();

    this.route.params.subscribe(params => {
      this.tab = params["tab"];

    });
  }

  ngOnInit() {
    super.ngOnInit();
    //this.CanAccess_Company_IsStartEnabled$ = this.sharedStore.pipe(select(sharedModuleReducers.getIsStartEnabled));
    this.isActivePermission = this.canAccess_entityType_feature_EditActiveGoalAssignee;
    this.isBacklogPermission = this.canAccess_entityType_feature_EditBacklogGoalAssignee
    this.isReplanPermission = this.canAccess_entityType_feature_EditReplanGoalAssignee;
    this.isActivePermissionForEstimatedTime = this.canAccess_entityType_feature_EditActiveGoalEstimatedTime;
    this.isBacklogPermissionForEstimatedTime = this.canAccess_entityType_feature_EditBacklogGoalEstimatedTime;
    this.isReplanPermissionForEstimatedTime = this.canAccess_entityType_feature_EditReplanGoalEstimatedTime;
    this.isActivePermissionForDeadLineDate = this.canAccess_entityType_feature_EditActiveGoalDeadlineDate;
    this.isBacklogPermissionForDeadLineDate = this.canAccess_entityType_feature_EditBacklogGoalDeadlineDate;
    this.isReplanPermissionForDeadLineDate = this.canAccess_entityType_feature_EditReplanGoalDeadlineDate;
    this.router.url.includes('/backlog-goals') || this.router.url.includes('/replan-goals') ? this.show = false : this.show = true;
    //this.route.url.subscribe(url=> { var u = url.toString(); u.includes('/backlog-goals') || u.includes('/replan-goals') ? this.show = false : this.show = true; })
    this.router.url.includes('/backlog-goals') || this.router.url.includes('/replan-goals') ? this.show = false : this.show = true;
    //this.route.url.subscribe(url=> { var u = url.toString(); u.includes('/backlog-goals') || u.includes('/replan-goals') ? this.show = false : this.show = true; })
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducers.createUserStoryLoading)
    );

    this.userStoryBugsInProgress$ = this.testRailStore.pipe(
      select(testRailModuleReducers.getBugsByGoalIdLoading)
    );
    const userStoryIsInProgress$ = this.store.pipe(
      select(projectModuleReducers.getUniqueUserStoryById)
    );
    const userStoryBugsInProgress$ = this.testRailStore.pipe(
      select(testRailModuleReducers.getBugsByGoalIdLoading)
    );
    const sprintOperationIsInProgress$ = this.store.pipe(select(projectModuleReducers.getUniqueSprintWorkItemsLoading))
    const sprintEditIsInProgress$ = this.store.pipe(select(projectModuleReducers.upsertSprintworkItemsLoading))

    this.anyOperationInProgress$ = combineLatest(
      userStoryIsInProgress$,
      userStoryBugsInProgress$,
      sprintOperationIsInProgress$,
      sprintEditIsInProgress$,
      this.anyOperationInProgress$

    ).pipe(
      map(
        ([
          getUniqueUserStoryById,
          getBugsByGoalIdLoading,
          getUniqueSprintWorkItemsLoading,
          upsertSprintworkItemsLoading,
          createuserStoryLoading

        ]) =>
          getUniqueUserStoryById ||
          getBugsByGoalIdLoading ||
          getUniqueSprintWorkItemsLoading ||
          upsertSprintworkItemsLoading ||
          createuserStoryLoading

      )
    );

    this.isPermissionForBulkUpdateUserStory = this.canAccess_entityType_feature_BulkUpdateWorkItem
  }



  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  getSelectedUserStory(userstory, event) {
    if(userstory.userStoryUniqueName != undefined && userstory.userStoryUniqueName == 'Document') {

    } else {
      if (event.ctrlKey) {
        if (!this.isAllGoalsPage && this.isPermissionForBulkUpdateUserStory && !this.archivedGoalUserStory && !this.ParkedGoalUserStory && this.isUserStoriesPage) {
          this.selectedUserStories.push(userstory.userStoryId);
          this.UserStorylist.emit({ userStory: userstory });
        }
      }
      else if (event.shiftKey) {
        if (!this.isAllGoalsPage && this.isPermissionForBulkUpdateUserStory && !this.archivedGoalUserStory && !this.ParkedGoalUserStory && this.isUserStoriesPage) {
          this.selectedUserStories.push(userstory.userStoryId);
          if (this.userStory.parentUserStoryId) {
            this.selectShiftButtonSubUserStorylist.emit(userstory);
          }
          else {
            this.selectShiftButtonUserStorylist.emit(userstory);
          }
        }
      }
      else {
        this.selectedUserStories = [];
        this.isUserStorySelected = true;
        if (this.isEditFromProjects) {
          if (this.isSprintUserStories) {
            this.selectSprintUserStory.emit({ userStory: userstory, isEmit: true });
          } else {
            this.selectUserStory.emit({ userStory: userstory, isEmit: true });
          }
  
        }
        else {
          this.openUniquePage.emit({ userStory: this.userStory, isUniqueFromProjects: true });
        }
      }
    }
  }

  closeArchivePopUp(value) {
    this.selectedUserStoryId = null;
    this.archiveStory = null;
    this.isArchiveUserStory = false;
    this.archivePopUps.forEach((p) => p.closePopover());
    var contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
    if (value == 'yes') {
      this.emitUserStoryCount.emit('');
      this.removeUserStory.emit(this.userStory.userStoryId);
    }
    else if (value == 'no') {
      this.completeUserStory.emit(this.userStory.userStoryId);
    }
  }

  closeParkPopUp(value) {
    let popover = this.parkUserStoryPopUp;
    this.selectedUserStoryId = null;
    this.isParkUserStory = false;
    if (popover) popover.close();
    var contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
    if (value == 'yes') {
      this.emitUserStoryCount.emit('');
      this.removeUserStory.emit(this.userStory.userStoryId);
    }
    else if (value == 'no') {
      this.completeUserStory.emit(this.userStory.userStoryId);
    }
  }

  setRolePermissionsForUserStory() {
    if (this.userStory.projectId) {
      let projectId = this.userStory.projectId;
      let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
      if (entityRolefeatures) {
        if(projectId) {
          this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
            return role.projectId == projectId.toLowerCase()
          })
        }
        this.checkPermissionsForUserStory();
      }
    }
  }

  checkGoalStatus() {
    if (this.userStory.goalStatusId.toLowerCase() == ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
      this.showIcons = true;
      this.isActiveGoalsPage = true;
      this.replanGoalUserStory = false;
      this.isSubTasksShow = true;
      this.archivedGoalUserStory = false;
      this.ParkedGoalUserStory = false;
    }
    else if (this.userStory.goalStatusId.toLowerCase() == ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
      this.showIcons = true;
      this.isActiveGoalsPage = false;
      this.replanGoalUserStory = false;
      this.isSubTasksShow = true;
      this.archivedGoalUserStory = false;
      this.ParkedGoalUserStory = false;
      this.backlogGoalUserStory = true;
    }
    else if (this.userStory.goalStatusId.toLowerCase() == ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
      this.showIcons = true;
      this.replanGoalUserStory = true;
      this.isActiveGoalsPage = false;
      this.isSubTasksShow = true;
      this.archivedGoalUserStory = false;
      this.ParkedGoalUserStory = false;
    }
    else if (this.userStory.goalStatusId.toLowerCase() === ConstantVariables.ArchivedGoalStatusId.toLowerCase()) {
      this.showIcons = false;
      this.isActiveGoalsPage = true;
      this.replanGoalUserStory = false;
      this.archivedGoalUserStory = true;
      this.ParkedGoalUserStory = false;
    } else if (this.userStory.goalStatusId.toLowerCase() === ConstantVariables.ParkedGoalStatusId.toLowerCase()) {
      this.showIcons = false;
      this.isActiveGoalsPage = true;
      this.replanGoalUserStory = false;
      this.archivedGoalUserStory = false;
      this.ParkedGoalUserStory = true;
    }
  }

  checkToggleForSprints(subTasks) {
    if (this.userStory.goalShortName === "Backlog" && this.userStory.goalName === "Backlog") {
      this.isEnableToggle = true;
      this.cdRef.detectChanges();

    } else {
      if (subTasks) {
        this.isEnableToggle = true;
        this.cdRef.detectChanges();

      } else {
        this.isEnableToggle = false;
        this.cdRef.detectChanges();
      }
    }
  }

  navigateToUserStoriesPage() {
    if (!this.archivedGoalUserStory && !this.ParkedGoalUserStory && this.isArchived && this.isParked && !this.replanGoalUserStory) {
      if (this.isEditFromProjects) {
        if (this.isUserStoriesPage) {
          if (this.isSprintUserStories) {
            this.router.navigate([
              "projects/sprint-workitem",
              this.userStory.userStoryId
            ]);
          } else {
            this.router.navigate([
              "projects/workitem",
              this.userStory.userStoryId
            ]);
          }

        }
        else {
          if (this.isSprintUserStories) {
            this.router.navigate([
              "projects/sprint-my-work",
              this.userStory.userStoryId
            ]);
          } else {
            this.router.navigate([
              "projects/my-work",
              this.userStory.userStoryId
            ]);
          }
        }
      }
      else {
        if (this.userStory.isSprintUserStory == true) {
          this.isSprintUserStories = true;
        } else {
          this.isSprintUserStories = false;
        }
        this.openUniquePage.emit({ userStory: this.userStory });
      }
    }

  }

  checkPermissionsForUserStory() {
    if (this.userStory.goalId == "00000000-0000-0000-0000-000000000000") {
      return false;
    }
    else {
      let featurePermissions = [];
      if (this.entityRolePermisisons.length > 0) {
        featurePermissions = this.entityRolePermisisons;
        if (featurePermissions.length > 0) {

          //Permission For Bulk Update userstory
          let entityTypeFeatureForBulkUpdateUserStory = EntityTypeFeatureIds.EntityTypeFeature_BulkUpdateWorkItem.toString().toLowerCase();
          var bulkUpdateUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForBulkUpdateUserStory)
          })
          if (bulkUpdateUserStoryPermisisonsList.length > 0) {
            this.isPermissionForBulkUpdate = true;
          }
          else {
            this.isPermissionForBulkUpdate = false;
          }

          //Permission For Bulk Update userstory
          let entityTypeFeatureForViewUserStories = EntityTypeFeatureIds.EntityTypeFeature_ViewWorkItem.toString().toLowerCase();
          var viewUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForViewUserStories)
          })
          if (bulkUpdateUserStoryPermisisonsList.length > 0) {
            this.isPermissionForViewUserStories = true;
          }
          else {
            this.isPermissionForViewUserStories = false;
          }

          //Permission For Archive userstory
          let entityTypeFeatureForArchiveUserStory = EntityTypeFeatureIds.EntityTypeFeature_ArchiveWorkItem.toString().toLowerCase();
          var archiveUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForArchiveUserStory)
          })
          if (archiveUserStoryPermisisonsList.length > 0) {
            this.isPermissionForArchiveUserStory = true;
          }
          else {
            this.isPermissionForArchiveUserStory = false;
          }

          //Permission For Park UserStory
          let entityTypeFeatureForParkUserStory = EntityTypeFeatureIds.EntityTypeFeature_ParkWorkItem.toString().toLowerCase();
          var parkUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForParkUserStory)
          })
          if (parkUserStoryPermisisonsList.length > 0) {
            this.isPermissionForParkUserStory = true;
          }
          else {
            this.isPermissionForParkUserStory = false;
          }

          //For UserStory owner
          //In Active
          let entityTypeFeatureForUserStoryOwnerInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalAssignee.toString().toLowerCase();
          var editUserStoryOwnerPermisisonsListInActive = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryOwnerInActive)
          })
          if (editUserStoryOwnerPermisisonsListInActive.length > 0) {
            this.isInlineEditForUserStoryOwnerInActive = true;
          }
          else {
            this.isInlineEditForUserStoryOwnerInActive = false;
          }
          //In Backlog
          let entityTypeFeatureForUserStoryOwnerInBacklog = EntityTypeFeatureIds.EntityTypeFeature_EditBacklogGoalAssignee.toString().toLowerCase();
          var editDeadlineDatePermisisonsListInBacklog = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryOwnerInBacklog)
          })
          if (editDeadlineDatePermisisonsListInBacklog.length > 0) {
            this.isInlineEditForUserStoryOwnerInBacklog = true;
          }
          else {
            this.isInlineEditForUserStoryOwnerInBacklog = false;
          }
          //In Replan
          let entityTypeFeatureForUserStoryOwnerInReplan = EntityTypeFeatureIds.EntityTypeFeature_EditReplanGoalAssignee.toString().toLowerCase();
          var editUserStoryOwnerPermisisonsListInReplan = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryOwnerInReplan)
          })
          if (editUserStoryOwnerPermisisonsListInReplan.length > 0) {
            this.isInlineEditForUserStoryOwnerInReplan = true;
          }
          else {
            this.isInlineEditForUserStoryOwnerInReplan = false;
          }
          //For Estimated Time
          //In Active
          let entityTypeFeatureForEstimatedTimeInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalEstimatedTime.toString().toLowerCase();
          var editEstimatedTimePermisisonsListInActive = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForEstimatedTimeInActive)
          })
          if (editEstimatedTimePermisisonsListInActive.length > 0) {
            this.isInlineEditForUserStoryEstimatedTimeInActive = true;
          }
          else {
            this.isInlineEditForUserStoryEstimatedTimeInActive = false;
          }
          //In Backlog
          let entityTypeFeatureForEstimatedTimeInBacklog = EntityTypeFeatureIds.EntityTypeFeature_EditBacklogGoalEstimatedTime.toString().toLowerCase();
          var editEstimatedTimePermisisonsListInBacklog = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForEstimatedTimeInBacklog)
          })
          if (editEstimatedTimePermisisonsListInBacklog.length > 0) {
            this.isInlineEditForUserStoryEstimatedTimeInBacklog = true;
          }
          else {
            this.isInlineEditForUserStoryEstimatedTimeInBacklog = false;
          }
          //In Replan
          let entityTypeFeatureForEstimatedTimeInReplan = EntityTypeFeatureIds.EntityTypeFeature_EditReplanGoalEstimatedTime.toString().toLowerCase();
          var editEstimatedTimePermisisonsListInReplan = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForEstimatedTimeInReplan)
          })
          if (editEstimatedTimePermisisonsListInReplan.length > 0) {
            this.isInlineEditForUserStoryEstimatedTimeInReplan = true;
          }
          else {
            this.isInlineEditForUserStoryEstimatedTimeInReplan = false;
          }

          //For Deadline Date 
          //In Active
          let entityTypeFeatureForDeadlineDateInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalDeadlineDate.toString().toLowerCase();
          var editDeadlineDatePermisisonsListInActive = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDeadlineDateInActive)
          })
          if (editDeadlineDatePermisisonsListInActive.length > 0) {
            this.isInlineEditForUserStoryDeadLineDateInActive = true;
          }
          else {
            this.isInlineEditForUserStoryDeadLineDateInActive = false;
          }
          //In Backlog
          let entityTypeFeatureForDeadlineDateInBacklog = EntityTypeFeatureIds.EntityTypeFeature_EditBacklogGoalDeadlineDate.toString().toLowerCase();
          var editDeadlineDatePermisisonsListInBacklog = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDeadlineDateInBacklog)
          })
          if (editDeadlineDatePermisisonsListInBacklog.length > 0) {
            this.isInlineEditForUserStoryDeadLineDateInBacklog = true;
          }
          else {
            this.isInlineEditForUserStoryDeadLineDateInBacklog = false;
          }
          //In Replan
          let entityTypeFeatureForDeadlineDateInReplan = EntityTypeFeatureIds.EntityTypeFeature_EditReplanGoalDeadlineDate.toString().toLowerCase();
          var editDeadlineDatePermisisonsListInReplan = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDeadlineDateInReplan)
          })
          if (editDeadlineDatePermisisonsListInReplan.length > 0) {
            this.isInlineEditForUserStoryDeadLineDateInReplan = true;
          }
          else {
            this.isInlineEditForUserStoryDeadLineDateInReplan = false;
          }
        }
      }
    }

  }


  //Inline Editing Components
  saveDeadlineDate(inLineEditUserStoryPopup, isPermission) {
    if (this.isAllGoalsPage) {
      if ((this.isActiveGoalsPage && this.isInlineEditForUserStoryDeadLineDateInActive && (!this.isSuperagileBoard)) || (this.backlogGoalUserStory && this.isInlineEditForUserStoryDeadLineDateInBacklog) || (this.replanGoalUserStory && this.isInlineEditForUserStoryDeadLineDateInReplan)) {
        this.openDeadlineDatePopUp(inLineEditUserStoryPopup);
      }

    } else {
      if ((this.isActiveGoalsPage && this.isActivePermissionForDeadLineDate && (!this.isSuperagileBoard)) || (this.backlogGoalUserStory && this.isBacklogPermissionForDeadLineDate) || (this.replanGoalUserStory && this.isReplanPermissionForDeadLineDate)) {
        this.openDeadlineDatePopUp(inLineEditUserStoryPopup);
      }
    }
  }

  openDeadlineDatePopUp(inLineEditUserStoryPopup) {
    if (this.archivedGoalUserStory || this.ParkedGoalUserStory || !this.isArchived || !this.isParked) {
      if (this.archivedGoalUserStory) {
        const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASEUNARCHIVETHISUSERSTORY'), this.softLabels);
        this.toastr.warning("", message);
      }
      if (this.ParkedGoalUserStory) {
        const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASERESUMETHISUSERSTORY'), this.softLabels);
        this.toastr.warning("", message);
      }
    }
    else {

      if (this.isUserStoriesPage && !this.isSubTasksPage) {
        this.inLineUserStory = this.userStory;
        this.titleText = this.translateService.instant('USERSTORY.EDITDEADLINEDATE');
        this.isInlineEdit = true;
        this.isInlineEditForEstimatedTime = false;
        this.isInlineEditForUserStoryStatus = false;
        this.isInlineEditForUserStoryOwner = false;
        this.isInlineEditForSprintEstimatedTime = false;
        inLineEditUserStoryPopup.openPopover();
      }
    }
  }

  saveEstimatedTime(inLineEditUserStoryPopup, isPermission) {
    if (this.isAllGoalsPage) {
      if ((this.isActiveGoalsPage && this.isInlineEditForUserStoryEstimatedTimeInActive && (!this.isSuperagileBoard)) || (this.backlogGoalUserStory && this.isInlineEditForUserStoryEstimatedTimeInBacklog) || (this.replanGoalUserStory && this.isInlineEditForUserStoryEstimatedTimeInReplan)) {
        this.openEstimatedTimePopUp(inLineEditUserStoryPopup);
      }

    } else {
      if ((this.isActiveGoalsPage && this.isActivePermissionForEstimatedTime && (!this.isSuperagileBoard)) || (this.backlogGoalUserStory && this.isBacklogPermission) || (this.replanGoalUserStory && this.isReplanPermission)) {
        this.openEstimatedTimePopUp(inLineEditUserStoryPopup);
      }
    }
  }

  openEstimatedTimePopUp(inLineEditUserStoryPopup) {
    if (this.archivedGoalUserStory || this.ParkedGoalUserStory || !this.isArchived || !this.isParked) {
      if (this.archivedGoalUserStory) {
        const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASEUNARCHIVETHISUSERSTORY'), this.softLabels);
        this.toastr.warning("", message);
      }
      if (this.ParkedGoalUserStory) {
        const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASERESUMETHISUSERSTORY'), this.softLabels);
        this.toastr.warning("", message);
      }
    }
    else {

      if (this.isUserStoriesPage && !this.isSubTasksPage) {
        this.inLineUserStory = this.userStory;
        this.titleText = this.translateService.instant('USERSTORY.EDITESTIMATEDTIME');
        this.isInlineEdit = false;
        this.isInlineEditForEstimatedTime = true;
        this.isInlineEditForUserStoryStatus = false;
        this.isInlineEditForUserStoryOwner = false;
        this.isInlineEditForSprintEstimatedTime = false;
        inLineEditUserStoryPopup.openPopover();
      }
    }
  }

  saveSprintEstimatedTime(inLineEditUserStoryPopup, isPermission) {
    if (this.isAllGoalsPage) {
      if ((this.isActiveGoalsPage && this.isInlineEditForUserStoryEstimatedTimeInActive && (!this.isSuperagileBoard)) || (this.backlogGoalUserStory && this.isInlineEditForUserStoryEstimatedTimeInBacklog) || (this.replanGoalUserStory && this.isInlineEditForUserStoryEstimatedTimeInReplan)) {
        this.openSprintEstimatedTimePopUp(inLineEditUserStoryPopup);
      }

    } else {
      if ((this.isActiveGoalsPage && this.isActivePermissionForEstimatedTime && (!this.isSuperagileBoard)) || (this.backlogGoalUserStory && this.isBacklogPermissionForEstimatedTime) || (this.replanGoalUserStory && this.isReplanPermissionForEstimatedTime)) {
        this.openSprintEstimatedTimePopUp(inLineEditUserStoryPopup);
      }
    }
  }

  openSprintEstimatedTimePopUp(inLineEditUserStoryPopup) {
    if (this.archivedGoalUserStory || this.ParkedGoalUserStory || !this.isArchived || !this.isParked) {
      if (this.archivedGoalUserStory) {
        const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASEUNARCHIVETHISUSERSTORY'), this.softLabels);
        this.toastr.warning("", message);
      }
      if (this.ParkedGoalUserStory) {
        const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASERESUMETHISUSERSTORY'), this.softLabels);
        this.toastr.warning("", message);
      }
    }
    else {

      if (this.isUserStoriesPage && !this.isSubTasksPage) {
        this.inLineUserStory = this.userStory;
        this.titleText = this.translateService.instant('USERSTORY.EDITSPRINTESTIMATEDTIME');
        this.isInlineEdit = false;
        this.isInlineEditForEstimatedTime = false;
        this.isInlineEditForUserStoryStatus = false;
        this.isInlineEditForUserStoryOwner = false;
        this.isInlineEditForSprintEstimatedTime = true;
        inLineEditUserStoryPopup.openPopover();
      }
    }
  }

  saveUserStoryStatus(inLineEditUserStoryPopup, bug) {
    if (this.isActiveGoalsPage) {
      if (this.archivedGoalUserStory || this.ParkedGoalUserStory || !this.isArchived || !this.isParked) {
        if (this.archivedGoalUserStory) {
          const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASEUNARCHIVETHISUSERSTORY'), this.softLabels);
          this.toastr.warning("", message);
        }
        if (this.ParkedGoalUserStory) {
          const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASERESUMETHISUSERSTORY'), this.softLabels);
          this.toastr.warning("", message);
        }
      }
      else if (!this.isSubTasksPage) {
        this.titleText = this.translateService.instant('USERSTORY.EDITUSERSTORYSTATUS');
        this.isInlineEdit = false;
        this.isInlineEditForEstimatedTime = false;
        this.isInlineEditForUserStoryStatus = true;
        this.isInlineEditForUserStoryOwner = false;
        this.isInlineEditForSprintEstimatedTime = false;
        if (bug != undefined) {
          this.inLineUserStory = bug;
          this.isFromBugsCount = true;
        }
        else {
          this.inLineUserStory = this.userStory;
          this.isFromBugsCount = false;
        }
        inLineEditUserStoryPopup.openPopover();
      }
    }
  }

  saveAssignee(inLineEditUserStoryPopup) {
    if (this.isAllGoalsPage) {
      if ((this.isActiveGoalsPage && this.isInlineEditForUserStoryOwnerInActive) || (this.backlogGoalUserStory && this.isInlineEditForUserStoryOwnerInBacklog) || (this.replanGoalUserStory && this.isInlineEditForUserStoryOwnerInReplan)) {
        this.openAssigneePopUp(inLineEditUserStoryPopup);
      }

    } else {
      if ((this.isActiveGoalsPage && this.isActivePermission) || (this.backlogGoalUserStory && this.isBacklogPermission) || (this.replanGoalUserStory && this.isReplanPermission)) {
        this.openAssigneePopUp(inLineEditUserStoryPopup);
      }
    }
  }

  openAssigneePopUp(inLineEditUserStoryPopup) {
    if (this.archivedGoalUserStory || this.ParkedGoalUserStory || !this.isArchived || !this.isParked) {
      if (this.archivedGoalUserStory) {
        const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASEUNARCHIVETHISUSERSTORY'), this.softLabels);
        this.toastr.warning("", message);
      }
      if (this.ParkedGoalUserStory) {
        const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASERESUMETHISUSERSTORY'), this.softLabels);
        this.toastr.warning("", message);
      }
    }
    else if (!this.isSubTasksPage) {
      this.inLineUserStory = this.userStory;
      if (this.notFromAudits)
        this.titleText = this.translateService.instant('USERSTORY.EDITUSERSTORYOWNER');
      else if (!this.notFromAudits)
        this.titleText = this.translateService.instant('USERSTORY.EDITACTIONOWNER');
      this.isInlineEdit = false;
      this.isInlineEditForEstimatedTime = false;
      this.isInlineEditForUserStoryStatus = false;
      this.isInlineEditForUserStoryOwner = true;
      this.isInlineEditForSprintEstimatedTime = false;
      inLineEditUserStoryPopup.openPopover();
    }
  }

  getStableState(event) {
    this.isInlineEdit = false;
    this.isInlineEditForEstimatedTime = false;
    this.isInlineEditForUserStoryStatus = false;
    this.isInlineEditForUserStoryOwner = false;
    this.inLineEditPopUps.forEach((p) => p.closePopover());
    this.workItemInProgress = false;
    this.completeUserStory.emit(this.userStory.userStoryId);
  }

  getWorkItemsLoader(value) {
    this.workItemInProgress = true;
    this.cdRef.markForCheck();
  }

  getStopLoader(value) {
    this.workItemInProgress = false;
    this.cdRef.markForCheck();
  }

  closeUserStoryDialogWindow() {
    this.isInlineEdit = false;
    this.isInlineEditForEstimatedTime = false;
    this.isInlineEditForUserStoryStatus = false;
    this.isInlineEditForUserStoryOwner = false;
    this.inLineEditPopUps.forEach((p) => p.closePopover());
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }


  openContextMenu(event: MouseEvent, userStory) {
    if (this.selectedUserStories.length === 0) {
      this.selectedUserStoryId = userStory.userStoryId;
      this.isUserStorySelected = false;
      event.preventDefault();
      var contextMenu = this.triggers.toArray()[0];
      if (contextMenu) {
        if (this.isEditFromProjects) {
          this.contextMenuPosition.x = (event.clientX) + 'px';
          this.contextMenuPosition.y = (event.clientY - 30) + 'px';
        }
        else {
          this.contextMenuPosition.x = (event.clientX) + 'px';
          this.contextMenuPosition.y = (event.clientY - 30) + 'px';
        }
        this.cdRef.detectChanges();
        contextMenu.openMenu();
        this.selectUserStory.emit({ userStory: userStory, isEmit: false });
      }
    }
  }

  onClick(event) {
    if (this.isUserStorySelected === false) {
      this.isUserStorySelected = true;
      this.highLightUserStory.emit(null);
    }
  }

  copyLink() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, '');
    if (this.isUserStoriesPage) {
      if (this.isSprintUserStories) {
        this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/sprint-workitem/' + this.userStory.userStoryId;
      }
      else if (!this.notFromAudits) {
        this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/action/' + this.userStory.userStoryId;
      }
      else {
        this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/workitem/' + this.userStory.userStoryId;
      }
    }
    else {
      this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/my-work/' + this.userStory.userStoryId;
    }
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.uniqueNumberUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackbar.open(this.translateService.instant('USERSTORY.LINKCOPIEDSUCCESSFULLY'), this.translateService.instant(ConstantVariables.success), { duration: 3000 });
  }

  openInNewTab() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, '');
    if (this.isUserStoriesPage) {
      if (this.isSprintUserStories) {
        this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/sprint-workitem/' + this.userStory.userStoryId;
      }
      else if (!this.notFromAudits) {
        this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/action/' + this.userStory.userStoryId;
      }
      else {
        this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/workitem/' + this.userStory.userStoryId;
      }
    }
    else {
      this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/my-work/' + this.userStory.userStoryId;
    }
    window.open(this.uniqueNumberUrl, "_blank");
  }

  toggleSubChilds($event, userStoryId) {
    if (this.isSprintUserStories) {
      this.treeStructure = !this.treeStructure;
      this.cdRef.detectChanges();
      this.selectedSprintToggleEvent.emit(userStoryId);
    } else {
      this.treeStructure = !this.treeStructure;
      this.cdRef.detectChanges();
      this.selectedToggleEvent.emit(userStoryId);
    }

  }

  openTagsPopUp() {
    this.isTagsPopUp = true;
  }
  getTags(stringTag) {
    this.isTagsPopUp = false;
    this.userStoryInputTags = stringTag.split(",");
    this.cdRef.detectChanges();
  }
  closeTagsDialog() {
    this.isTagsPopUp = false;
    let popover = this.userStorytagsPopUp;
    this.selectedUserStoryId = null;
    if (popover) popover.close();
    var contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
    this.completeUserStory.emit(this.userStory.userStoryId);
  }

  loadBugs() {
    let testCaseSearch = new TestCase();
    testCaseSearch.parentUserStoryId = this.userStory.userStoryId;
    testCaseSearch.isArchived = false;
    this.testRailStore.dispatch(new LoadBugsByGoalIdTriggered(testCaseSearch));
    this.scenarioBugs$ = this.store.pipe(select(testRailModuleReducers.getBugsByGoalId));
    this.scenarioBugs$.subscribe(x =>
      this.scenarioBugs = x
    );
  }

  openBugsPopover(bugPopover, userStory) {
    this.userStoryModel = userStory;
    this.isLoadBugs = !this.isLoadBugs;
    bugPopover.openPopover();
  }

  setColorForBugPriorityTypes(color) {
    let styles = {
      "color": color
    };
    return styles;
  }

  closeBugPopover() {
    this.isLoadBugs = !this.isLoadBugs;
    this.userStoryBugPopover.forEach((p) => p.closePopover());
    if (this.userStory.userStoryId && this.isSprintUserStories) {
      this.store.dispatch(new GetSprintWorkItemByIdTriggered(this.userStory.userStoryId, true));
  }
  else
      this.store.dispatch(new userStoryActions.UpdateSingleUserStoryForBugsTriggered(this.userStory.userStoryId));
  }

  configureDeadlineDateDisplay(deadLineDate, isConfigureDate) {
    if (isConfigureDate) {
      return this.datePipe.transform(deadLineDate, 'dd MMM yyyy, h:mm a');
    } else {
      return this.datePipe.transform(deadLineDate, 'dd MMM yyyy');
    }
  }

  applyClassForUniqueName(userStoryTypeColor) {
    if (userStoryTypeColor) {
      return "asset-badge"
    } else {
      return "userstory-unique"
    }
  }

  LogAction(userStory) {

    if (this.userStory.userStoryId == userStory.userStoryId) {
      this.currentUserStory = true;
    }
    if (userStory.autoLog == false || userStory.autoLog == 0) {
      this.userStoryLogTime.startTime = userStory.startTime;   // log ending
      this.userStoryLogTime.endTime = new Date();
    }
    else {
      this.userStoryLogTime.startTime = new Date();     // log starting
    }
    this.userStoryLogTime.parentUserStoryId = userStory.parentUserStoryId;
    this.userStoryLogTime.userStoryId = userStory.userStoryId;
    this.userStoryLogTime.userStorySpentTimeId = userStory.userStorySpentTimeId;
    this.userStoryLogTime.isFromSprint = userStory.isFromSprints;
    this.updateAutoLog.emit({ userStoryLogTime: this.userStoryLogTime });
    this.close.emit(true);
  }

  getSelectedBugUserStory(userstory) {
    let dialogId = "unique-userstory-dialog";
    const dialogRef = this.dialog.open(UniqueUserstoryDialogComponent, {
      height: "90vh",
      width: "70%",
      direction: 'ltr',
      id: dialogId,
      data: { userStory: userstory, isFromBugsCount: true, dialogId: dialogId },
      disableClose: true,
      panelClass: 'userstory-dialog-scroll'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadBugs();
      this.loadLinkedBugs();
    });
  }

  unlinkBug(bug) {
    this.goalService.deleteLinkedBugs(bug.userStoryId).subscribe((result: any) => {
      this.loadBugs();
      let bugsCountsModel = new TestCase();
      bugsCountsModel.userStoryId = this.userStory.userStoryId;
      this.store.dispatch(new LoadBugsCountByUserStoryIdTriggered(bugsCountsModel));

      if (this.userStory.userStoryId && this.userStory.isFromSprint) {
        this.store.dispatch(new GetSprintWorkItemByIdTriggered(this.userStory.userStoryId, true));
      }
      else
        this.store.dispatch(new userStoryActions.UpdateSingleUserStoryForBugsTriggered(this.userStory.userStoryId));
      this.loadLinkedBugs();
    });
  }

  loadLinkedBugs() {
    let testCaseSearch = new TestCase();
    testCaseSearch.userStoryId = this.userStory.userStoryId;
    testCaseSearch.isSprintUserStories = this.isSprintUserStories;
    testCaseSearch.isArchived = false;
    this.testRailStore.dispatch(new LoadBugsByUserStoryIdTriggered(testCaseSearch));
  }

  closeUserStoryDialog() {
    this.closeUserStoryDialogWindow();
  }

  openArchiveUserStory() {
    this.isArchiveUserStory = true;
    this.archiveStory = this.userStory;
  }
  openParkUserStory() {
    this.isParkUserStory = true;
    this.parkUserStory = this.userStory;
  }

  setAlignmentForpopUp() {
    if(this.isSprintUserStories ) {
       return "above"
    } else {
      if(this.userStory.order < 5) {
        return "center"
      } else {
        return "above"
      }
    }
  }

  openScreenShotsDialog() {
    let dialogId = "app-activity-tracker-screenshot-agile";
    let createdDate = this.userStory.createdDate ? this.userStory.createdDate : this.userStory.createdDateTime
    const activityScreenshotDialog = this.dialog.open(this.screenShotComponent, {
        width: "79%",
        minHeight: "85vh",
        id: dialogId,
        data: {
            dialogId: dialogId, 
                userId: this.userStory.userId, dateFrom: this.datePipe.transform(createdDate,"yyyy-MM-dd"), dateTo: this.datePipe.transform(new Date(),"yyyy-MM-dd"),
                userStoryId: this.userStory.userStoryId,userStoryName: this.userStory.userStoryName
            
        },
    });
    activityScreenshotDialog.afterClosed().subscribe((result) => {

    });
}
}