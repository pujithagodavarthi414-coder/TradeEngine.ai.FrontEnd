// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren, Input, NgModuleFactory, Type, NgModuleRef, NgModuleFactoryLoader, ViewContainerRef, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { MatMenuTrigger } from "@angular/material/menu";
// tslint:disable-next-line: ordered-imports
import { ActivatedRoute, Router } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
// tslint:disable-next-line: ordered-imports
import { Guid } from "guid-typescript";
import { Observable, Subject, combineLatest } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { take, takeUntil, tap, map } from "rxjs/operators";
import * as _ from "underscore";

// tslint:disable-next-line: ordered-imports
import { CreateUniqueGoalTriggered, GetUniqueGoalByIdTriggered, GoalActionTypes, GetUniqueGoalByUniqueIdTriggered } from "../../store/actions/goal.actions";
import { UserStoryActionTypes } from "../../store/actions/userStory.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducers from "../../store/reducers/index";

import { GoalModel } from "../../models/GoalModel";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { ProjectGoalsService } from "../../services/goals.service";
import { CookieService } from 'ngx-cookie-service';
import { ComponentModel } from '@snovasys/snova-comments';
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { FeatureIds } from '../../../globaldependencies/constants/feature-ids';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { MenuItemService } from '../../services/feature.service';
import { LoadMemberProjectsTriggered } from "../../store/actions/project-members.actions";
import { FileElement } from '../../models/file-element-model';
import { UserStory } from '../../models/userStory';
import { ProjectModulesService } from '../../services/project.modules.service';
import { DocumentStoreComponent } from "@snovasys/snova-document-management";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

const environent = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
@Component({
  selector: "app-goal-unique-detail",
  templateUrl: "goal-unique-detail.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalUniqueDetailComponent extends AppFeatureBaseComponent implements OnInit {

  fromCustomApp: boolean;
  @Input("Ids")
  set _Ids(Ids) {
    if (Ids) {
      this.fromCustomApp = true;
      this.goalId = Ids;
      this.getEntityRoleFeaturesByUserId();
      // this.store.dispatch(new EntityRolesByUserIdFetchTriggered(Ids.split(","), "goal", false));
    }
  }

  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @ViewChild("editgoalPopover") editgoalPopover: SatPopover;
  @ViewChild("editGoalMenuPopover") editGoalMenuPopover: SatPopover;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  public ngDestroyed$ = new Subject();

  public initSettings = {
    plugins: "paste lists advlist",
    branding: false,
    //powerpaste_allow_local_images: true,
    //powerpaste_word_import: 'prompt',
    //powerpaste_html_import: 'prompt',
    toolbar: 'link image code'
  };

  goalId: any;
  getGoalByIdLoading$: Observable<boolean>;
  anyOperationInProgress$: Observable<boolean>;
  descriptionLoading$: Observable<boolean>;
  userStories$: Observable<UserStory[]>;
  goalDetails$: Observable<GoalModel>;
  goalDetails: GoalModel = new GoalModel();
  isKanbanBoard: boolean;
  isSuperagileBoard: boolean;
  userStoryTypeId: string;
  goalName: string;
  entityRolePermisisons$: Observable<EntityRoleFeatureModel[]>;
  goalTagsOperationIsInProgress$: Observable<boolean>;
  goalOperationInProgress$: Observable<boolean>;
  entityRolePermisisons: EntityRoleFeatureModel[];
  goalInputTags: string[] = [];
  entityFeatureIds: any[];
  isArchived: boolean;
  isEdit: boolean;
  isableToSeeMatMenu: boolean;
  kanbanBoard = BoardTypeIds.KanbanKey;
  entityFeatureIdForArchiveGoal: Guid = EntityTypeFeatureIds.EntityTypeFeature_ArchiveGoal;
  entityFeatureIdForParkGoal: Guid = EntityTypeFeatureIds.EntityTypeFeature_ParkGoal;
  entityFeatureIdForEditGoal: Guid = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateGoal;
  isTagsPopUp: boolean;
  editMenu: boolean;
  isArchivedGoal: boolean;
  isParkedGoal: boolean;
  isParked: boolean;
  editGoalForm: boolean;
  isTheBoardLayoutKanban: boolean;
  isBoardTypeForApi: boolean;
  goal: GoalModel;
  selectedUserStory: any;
  goalReplanId: string;
  isGoal = false;
  projectId: string;
  description: string;
  selectedTab: string;
  updatedGoal$: Observable<GoalModel>;
  updatedGoal: GoalModel;
  selectedGoal: any;
  sortBy: any;
  isGoalRefresh: boolean;
  goalUniqueDetailPage = true;
  refreshUserStoriesCall = true;
  isPermissionForViewUserstories: boolean;
  isPermissionForViewGoals: boolean;
  userStorySearchCriteria: UserStorySearchCriteriaInputModel;
  isTheBoardLayoutReports: boolean;
  goalslist: GoalModel[];
  isGoalUniquePage: boolean;
  selectedGoalTab = "Description";
  dropdowns: any[];
  isEditorVisible = false
  showReportsBoard: boolean;
  showCalendarView: boolean;
  projectLabel: string;
  goalLabel: string;
  componentModel: ComponentModel = new ComponentModel();
  showDocuments: boolean;
  canAccess_feature_ViewProjects$: Observable<Boolean>;
  accessViewProjects: Boolean;
  showEmployeeTaskBoard: boolean;
  isComponentRefresh: boolean;
  fileElement: FileElement;
  injector: any;
  documentStoreComponent: any;
  documentManagementLoaded: boolean;


  constructor(
    private store: Store<State>,
    private translateService: TranslateService,
    private goalService: ProjectGoalsService,
    private route: ActivatedRoute,
    private actionUpdates$: Actions,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private cookieService: CookieService,
    @Inject('ProjectModuleLoader') public projectModulesService: any,
    private ngModuleRef: NgModuleRef<any>,
    private compiler: Compiler,
    private vcr: ViewContainerRef,
    private featureService: MenuItemService) {
    super();
    this.injector = this.vcr.injector;
    this.isPermissionForViewUserstories=true;
    let roleFeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.accessViewProjects = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjects.toString().toLowerCase(); }) != null;
    localStorage.setItem("goalUniquePage", "true");
    combineLatest(this.route.params, this.route.fragment)
    .pipe(map(results => ({params: results[0], fragment: results[1]})))
    .subscribe(results => {
      if (!this.fromCustomApp && this.goalId != results.params.id) {
        if(results.fragment){
            this.getEntityRoleFeaturesByUserId(true, results.params.id);  
        } else {
          this.goalId = results.params.id;
          this.getEntityRoleFeaturesByUserId();      
        }
        // this.store.dispatch(new EntityRolesByUserIdFetchTriggered(this.goalId, "goal", false));
      }
    });

    // this.route.params.subscribe((params) => {
    //   if (!this.fromCustomApp) {
    //     this.goalId = params["id"];
    //     this.route.fragment.subscribe((fragment) => {
    //       if(fragment) {
    //         this.getEntityRoleFeaturesByUserId();
    //       }
    //       else {
    //         this.getEntityRoleFeaturesByUserId();
    //       }
    //     }) 
        
    //     // this.store.dispatch(new EntityRolesByUserIdFetchTriggered(this.goalId, "goal", false));
    //   }
    // });

    this.dropdowns = [
      {
        name: "Description",
        value: "Description"
      },
      {
        name: "Comment",
        value: "Comment"
      }
    ];

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryActionTypes.CreateUserStoryCompleted),
        tap(() => {
          this.refreshUserStoriesCall = false;
          this.isGoalRefresh = false;
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActionTypes.GetUniqueGoalByIdCompleted),

        tap(() => {
          this.goalDetails$ = this.store.pipe(select(projectModuleReducers.getUpdatedGoal));
          this.goalDetails$.subscribe((x) => {
            this.goalDetails = x; if (this.goalDetails && this.goalDetails.tag) {
              this.goalInputTags = this.goalDetails.tag.split(",");
              this.cdRef.detectChanges();
            } else {
              this.goalInputTags = [];
            }
          });
          // this.store.dispatch(new EntityRolesFetchTriggered(this.goalDetails.projectId));
          this.store.dispatch(new LoadMemberProjectsTriggered(this.goalDetails.projectId));
          this.goal = this.goalDetails;
          this.checkPermissionsForGoals();
          if (!this.isTagsPopUp) {
            this.refreshGoal();
          }

        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActionTypes.GetGoalByIdCompleted),
        tap(() => {
          this.goalDetails$ = this.store.pipe(select(projectModuleReducers.getUpdatedGoal));
          this.goalDetails$.subscribe((x) => {
            this.goalDetails = x; if (this.goalDetails && this.goalDetails.tag) {
              this.goalInputTags = this.goalDetails.tag.split(",");
              this.cdRef.detectChanges();
            } else {
              this.goalInputTags = [];
            }
          });
          this.goal = this.goalDetails;
          if (this.isGoalRefresh) {
            this.refreshGoal();
          }
        })
      )
      .subscribe();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActionTypes.CreateUniqueGoalCompleted),
        tap(() => {
          this.isEditorVisible = false;
        })
      ).subscribe();


    this.userStories$ = this.store.pipe(select(projectModuleReducers.getAllUserStories));


  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.goalTagsOperationIsInProgress$ = this.store.pipe(select(projectModuleReducers.goalTagsLoading));
    this.goalOperationInProgress$ = this.store.pipe(select(projectModuleReducers.getUniqueGoalByIdLoading));
    // setting component model to pass default variable values
    this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
    this.componentModel.backendApi = environent.apiURL;
    this.componentModel.parentComponent = this;
    this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
  }

  getEntityRoleFeaturesByUserId(isUnique: boolean = false, uniqueId: string = null) {
    this.featureService.getAllPermittedEntityRoleFeaturesByUserId().subscribe((features: any) => {
      if (features.success == true) {
        localStorage.setItem(LocalStorageProperties.UserRoleFeatures, JSON.stringify(features.data));
        if(isUnique) {
          this.store.dispatch(new GetUniqueGoalByUniqueIdTriggered(uniqueId));  
        } else {
        this.store.dispatch(new GetUniqueGoalByIdTriggered(this.goalId));
        }
      }
    })
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  goalDetailsBinding() {
    this.goalName = this.goalDetails.goalName;
    this.cdRef.markForCheck();
  }

  refreshGoal() {
    this.description = this.goal.description;
    this.selectGoal();
    this.cdRef.markForCheck();
    if (this.goalDetails.projectId) {
      this.getEntityRolePermissions();
    }
    if (this.goalDetails.goalStatusId === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
      this.selectedTab = "active-goals";
    } else if (this.goalDetails.goalStatusId === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
      this.selectedTab = "backlog-goals";
    } else if (this.goalDetails.goalStatusId === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
      this.selectedTab = "replan-goals";
    }
    if (this.goalDetails.inActiveDateTime) {
      this.selectedUserStory = null;
      this.isArchived = true;
      this.isParked = false;
      this.isEdit = false;
      this.isArchivedGoal = this.isArchived;
      this.isParkedGoal = this.isParked;
    } else if (this.goalDetails.parkedDateTime) {
      this.selectedUserStory = null;
      this.isArchived = false;
      this.isParked = true;
      this.isEdit = false;
      this.isArchivedGoal = this.isArchived;
      this.isParkedGoal = this.isParked;
    } else {
      this.isArchived = true;
      this.isParked = true;
      this.isEdit = true;
      this.isArchivedGoal = false;
      this.isParkedGoal = false;
    }
    if (this.goalDetails.boardTypeUiId === ConstantVariables.BoardTypeuiIdForKanbanBugs.toLowerCase()) {
      this.isKanbanBoard = false;
      this.isSuperagileBoard = false;
      this.userStoryTypeId = ConstantVariables.UserStoryTypeIdForBug;
    } else if (this.goalDetails.boardTypeUiId === ConstantVariables.BoardTypeUiIdForKanban.toLowerCase()) {
      this.isKanbanBoard = true;
      this.isSuperagileBoard = false;
      this.userStoryTypeId = ConstantVariables.UserStoryTypeIdForUserStory;
    } else {
      this.isSuperagileBoard = true;
      this.isKanbanBoard = false;
      this.userStoryTypeId = ConstantVariables.UserStoryTypeIdForUserStory;
    }
    this.goalDetailsBinding();
    this.initializeData();
    if (this.goalDetails.tag) {
      this.goalInputTags = this.goalDetails.tag.split(",");
      this.cdRef.detectChanges();
    } else {
      this.goalInputTags = [];
    }
    this.cdRef.markForCheck();
  }

  initializeData() {
    this.getGoalByIdLoading$ = this.store.pipe(
      select(projectModuleReducers.getUniqueGoalByIdLoading)
    );

    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducers.createUserStoryLoading)
    );

    this.descriptionLoading$ = this.store.pipe(select(projectModuleReducers.getGoalUniqueDescriptionLoading));
  }

  selectchange(value) {
    this.selectedGoalTab = value;
  }

  editGoal() {
    this.editGoalForm = true;
  }

  editGoalMenuPopupOpen() {
    this.isGoalUniquePage = true;
  }

  redirectPage() {
    this.isGoalRefresh = true;
    this.refreshUserStoriesCall = false;
    //  this.refreshGoal();
    this.cookieService.set("selectedProjectsTab", "active-goals");
    this.router.navigate([
      "projects/projectstatus",
      this.goalDetails.projectId,
      "active-goals"
    ]);
  }

  redirect404() {
    this.router.navigate([
      "sessions/404"
    ]);
  }

  navigateToGoalDetailsPage() {
    this.router.navigate([
      "projects/goal",
      this.goalDetails.goalId
    ]);
  }

  descriptionReset() {
    this.description = this.goal.description;
  }

  cancelDescription() {
    this.description = this.goal.description;
    this.isEditorVisible = false;
  }

  closeMenu() {
    const popover = this.editGoalMenuPopover;
    if (popover) { popover.close(); }
    this.isGoalUniquePage = false;
  }

  submitCloseGoalPopup(event) {
    this.closeGoalPopup();
    if (localStorage.getItem("boardtypeChanged") === "true") {
      this.selectedUserStory = null;
      this.refreshUserStoriesCall = true;
      this.isGoalRefresh = true;
      localStorage.removeItem("boardtypeChanged");
    } else {
      localStorage.removeItem("boardtypeChanged");
      this.refreshUserStoriesCall = false;
      this.isGoalRefresh = true;
    }
    if (!event) {
      this.store.dispatch(new GetUniqueGoalByIdTriggered(this.goalDetails.goalId));
    }
  }

  closeGoalPopup() {
    const popover = this.editgoalPopover;
    if (popover) { popover.close(); }
    this.editGoalForm = false;
  }

  getEntityRolePermissions() {
    let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
    let projectId = this.goalDetails.projectId;
    this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
      return role.projectId == projectId
    })

    this.checkPermissionsForViewUserStories();

  }

  selectGoal() {
    this.isTheBoardLayoutKanban = (this.goal.boardTypeUiId === "e3f924e2-9858-4b8d-bb30-16c64860bbd8") ? true : false;

    this.goalId = this.goal.goalId;
    const fileElement = new FileElement();
    if (this.goal) {
      fileElement.folderReferenceId = this.goal.goalId;
    } else {
      fileElement.folderReferenceId = null;
    }
    fileElement.folderReferenceTypeId = ConstantVariables.GoalReferenceTypeId.toLowerCase();
    fileElement.isEnabled = true;
    this.fileElement = fileElement;
    this.isComponentRefresh = !this.isComponentRefresh;

    const userStorySearchCriteriaTemp = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteriaTemp.goalId = this.goal.goalId;
    userStorySearchCriteriaTemp.workflowId = this.goal.workflowId;
    userStorySearchCriteriaTemp.isUserStoryParked = false;
    userStorySearchCriteriaTemp.isUserStoryArchived = false;
    userStorySearchCriteriaTemp.isStatusMultiselect = false;
    userStorySearchCriteriaTemp.pageNumber = 1;
    userStorySearchCriteriaTemp.refreshUserStoriesCall = this.refreshUserStoriesCall;
    userStorySearchCriteriaTemp.sortBy = this.sortBy;
    userStorySearchCriteriaTemp.isForUserStoryoverview = true;
    userStorySearchCriteriaTemp.isGoalsPage = true;
    this.userStorySearchCriteria = userStorySearchCriteriaTemp;
    this.cdRef.markForCheck();
  }

  reportsAfterClicked(event) {
    this.isTheBoardLayoutReports = true;
  }

  afterClicked(event) {
    this.isTheBoardLayoutKanban = !this.isTheBoardLayoutKanban;
    this.isTheBoardLayoutReports = false;
    this.showReportsBoard = false;
    this.showCalendarView = false;
    this.showEmployeeTaskBoard = false;
    this.showDocuments = false;
    this.isGoal = event;
    const userStorySearchCriteriaTemp = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteriaTemp.goalId = this.goal.goalId;
    userStorySearchCriteriaTemp.workflowId = this.goal.workflowId;
    userStorySearchCriteriaTemp.isUserStoryParked = false;
    userStorySearchCriteriaTemp.isUserStoryArchived = false;
    userStorySearchCriteriaTemp.pageNumber = 1;
    userStorySearchCriteriaTemp.refreshUserStoriesCall = true;
    this.userStorySearchCriteria = userStorySearchCriteriaTemp;
  }

  selectGoalReplanId(replanId) {
    this.selectedUserStory = null;
    this.goalReplanId = replanId;
  }

  userStoryCloseClicked() {
    this.selectedUserStory = null;
  }

  selectUserStory(event) {
    if (this.goal.inActiveDateTime || this.goal.parkedDateTime || event.userStoryArchivedDateTime || event.userStoryParkedDateTime) {

    } else {
      this.selectedUserStory = event;
    }
  }

  checkPermissionsForMatMenu
    () {
    if (this.goalDetails.goalId !== "00000000-0000-0000-0000-000000000000") {

      let featurePermissions = [];
      if (this.entityRolePermisisons.length > 0) {
        featurePermissions = this.entityRolePermisisons;
        let entityFeatureIds: any[];
        entityFeatureIds = featurePermissions.map((x) => x.entityFeatureId);
        if (featurePermissions.length > 0) {
          const entityTypeFeatureForArchiveGoal = this.entityFeatureIdForArchiveGoal.toString().toLowerCase();
          const entityTypeFeatureForParkGoal = this.entityFeatureIdForParkGoal.toString().toLowerCase();
          const entityFeatureIdForEditGoal = this.entityFeatureIdForEditGoal.toString().toLowerCase();
          const entityFeatureIdForViewGoal = EntityTypeFeatureIds.EntityTypeFeature_ViewGoals.toString().toLowerCase();

          // tslint:disable-next-line: only-arrow-functions
          const archivedGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForArchiveGoal)
          })
          // tslint:disable-next-line: prefer-const
          // tslint:disable-next-line: only-arrow-functions
          const parkedGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForParkGoal)
          })
          // tslint:disable-next-line: only-arrow-functions
          const editGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityFeatureIdForEditGoal)
          })

          // tslint:disable-next-line: only-arrow-functions
          // tslint:disable-next-line: only-arrow-functions
          const viewGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityFeatureIdForViewGoal)
          })

          // tslint:disable-next-line: max-line-length
          if (archivedGoalPermisisonsList.length > 0 || parkedGoalPermisisonsList.length > 0 || editGoalPermisisonsList.length > 0 || viewGoalPermisisonsList.length > 0) {
            return true;
          }
        }
        return false;
      }
    }
  }

  checkPermissionForArchiveGoal() {
    if (this.goalDetails.goalId !== "00000000-0000-0000-0000-000000000000") {
      let featurePermissions = [];
      if (this.entityRolePermisisons.length > 0) {
        featurePermissions = this.entityRolePermisisons;
        this.entityFeatureIds = featurePermissions.map((x) => x.entityFeatureId);
        if (featurePermissions.length > 0) {
          const entityTypeFeatureForArchiveGoal = this.entityFeatureIdForArchiveGoal.toString().toLowerCase();
          // tslint:disable-next-line: only-arrow-functions
          const archivedGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForArchiveGoal)
          })
          if (archivedGoalPermisisonsList.length) {
            return true;
          }
        }
      }
    }
  }

  checkPermissionForParkGoal() {
    if (this.goalDetails.goalId !== "00000000-0000-0000-0000-000000000000") {
      let featurePermissions = [];
      if (this.entityRolePermisisons.length > 0) {
        featurePermissions = this.entityRolePermisisons;
        this.entityFeatureIds = featurePermissions.map((x) => x.entityFeatureId);
        if (featurePermissions.length > 0) {
          const entityTypeFeatureForParkGoal = this.entityFeatureIdForParkGoal.toString().toLowerCase();
          // tslint:disable-next-line: prefer-const
          // tslint:disable-next-line: only-arrow-functions
          const parkedGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForParkGoal)
          })
          if (parkedGoalPermisisonsList.length) {
            return true;
          }
        }
      }
    }
  }

  checkPermissionForEditGoal() {
    if (this.goalDetails.goalId !== "00000000-0000-0000-0000-000000000000") {
      let featurePermissions = [];
      if (this.entityRolePermisisons.length > 0) {
        featurePermissions = this.entityRolePermisisons;
        this.entityFeatureIds = featurePermissions.map((x) => x.entityFeatureId);
        if (featurePermissions.length > 0) {
          const entityFeatureIdForEditGoal = this.entityFeatureIdForEditGoal.toString().toLowerCase();
          // tslint:disable-next-line: only-arrow-functions
          const editGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityFeatureIdForEditGoal)
          })
          if (editGoalPermisisonsList.length) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  }

  checkPermissionsForEditActiveGoal(activePermission, inactivePermission) {
    if (this.goalDetails.goalStatusId === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
      if (activePermission) {
        return true;
      } else {
        return false;
      }
    } else {
      if (inactivePermission) {
        return true;
      } else {
        return false;
      }
    }
  }

  checkPermissionsForViewUserStories() {
    let projectId = this.goalDetails.projectId
    let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
    this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
      return role.projectId == projectId
    })
    const entityTypeFeatureForViewUserStories = EntityTypeFeatureIds.EntityTypeFeature_ViewWorkItem.toString().toLowerCase();
    let featurePermissions = [];
    featurePermissions = this.entityRolePermisisons;
    // tslint:disable-next-line: only-arrow-functions
    const viewUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
      return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForViewUserStories)
    })
    if (viewUserStoryPermisisonsList.length > 0) {
      this.isPermissionForViewUserstories = true;
    } else {
      this.isPermissionForViewUserstories = false;
    }
  }

  checkPermissionsForGoals() {
    let projectId = this.goalDetails.projectId
    let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
    this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
      return role.projectId == projectId
    })
    const entityTypeFeatureForViewGoals = EntityTypeFeatureIds.EntityTypeFeature_ViewGoals.toString().toLowerCase();
    let featurePermissions = [];
    featurePermissions = this.entityRolePermisisons;
    // tslint:disable-next-line: only-arrow-functions
    const viewGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
      return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForViewGoals)
    })
    if (viewGoalPermisisonsList.length > 0) {
      this.isPermissionForViewGoals = true;
    } else {
      this.isPermissionForViewGoals = false;
    }
  }

  handleDescriptionEvent(event) {
    const goalmodel = new GoalModel();
    goalmodel.goalId = this.goal.goalId;
    goalmodel.goalName = this.goal.goalName;
    goalmodel.goalShortName = this.goal.goalShortName;
    goalmodel.projectId = this.goal.projectId;
    goalmodel.boardTypeId = this.goal.boardTypeId;
    goalmodel.boardTypeApiId = this.goal.boardTypeApiId;
    goalmodel.configurationId = this.goal.configurationId;
    goalmodel.considerEstimatedHoursId = this.goal.considerEstimatedHoursId;
    goalmodel.isProductiveBoard = this.goal.isProductiveBoard;
    goalmodel.onboardProcessDate = this.goal.onboardProcessDate;
    goalmodel.isToBeTracked = this.goal.isToBeTracked;
    goalmodel.goalStatusColor = this.goal.goalStatusColor;
    goalmodel.version = this.goal.version;
    goalmodel.goalResponsibleUserId = this.goal.goalResponsibleUserId;
    goalmodel.isLocked = this.goal.isLocked;
    goalmodel.isApproved = this.goal.isApproved;
    goalmodel.timeStamp = this.goal.timeStamp;
    goalmodel.description = this.description;
    goalmodel.isEdit = true;
    this.refreshUserStoriesCall = false;
    this.store.dispatch(new CreateUniqueGoalTriggered(goalmodel));
  }

  enableEditor() {
    if (!this.goalDetails.inActiveDateTime && !this.goalDetails.parkedDateTime) {
      this.isEditorVisible = true;
    }
  }
  openTagsPopUp() {
    this.isTagsPopUp = true;
  }

  closeTagsDialog() {
    this.isTagsPopUp = false;
    const popover = this.editGoalMenuPopover;
    if (popover) { popover.close(); }
  }

  getGoalRelatedCharts(event) {
    this.selectedUserStory = null;
    this.showReportsBoard = true;
    this.showCalendarView = false;
    this.showDocuments = false;
    this.showEmployeeTaskBoard = false;
    this.cdRef.detectChanges();
  }

  getGoalRelatedCalenderView(event) {
    this.selectedUserStory = null;
    this.showCalendarView = true;
    this.showReportsBoard = false;
    this.showDocuments = false;
    this.showEmployeeTaskBoard = false;
    this.cdRef.detectChanges();
  }

  getDocumentStore(event) {
    var loader = this.projectModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modules, function(module: any){ return module.modulePackageName == 'DocumentManagementPackageModule' });

    if(!module){
        console.error("No module found for DocumentManagementPackageModule");
    }

    var path = loader[module.modulePackageName];

        (path() as Promise<NgModuleFactory<any> | Type<any>>)
            .then(elementModuleOrFactory => {
                if (elementModuleOrFactory instanceof NgModuleFactory) {
                    // if ViewEngine
                    return elementModuleOrFactory;
                } else {
                    try {
                        // if Ivy
                        return this.compiler.compileModuleAsync(elementModuleOrFactory);
                    } catch (err) {
                        throw err;
                    }
                }
            })
      .then((moduleFactory: NgModuleFactory<any>) => {

        const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        var allComponentsInModule = (<any>componentService).components;

        this.ngModuleRef = moduleFactory.create(this.injector);

        var componentDetails = allComponentsInModule.find(elementInArray =>
            elementInArray.name.toLocaleLowerCase() === "Document Store".toLocaleLowerCase()
        );
        this.documentStoreComponent = {};
        this.documentStoreComponent.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        this.documentStoreComponent.inputs = {
          goal: this.goal,
          fileElement: this.fileElement,
          isComponentRefresh: this.isComponentRefresh
        };

        this.documentStoreComponent.outputs = {
          getDocumentStore: event => this.getDocumentStore(event),
          getGoalRelatedBurnDownCharts: event => this.getGoalRelatedCharts(event),
          eventClicked: event => this.afterClicked(event),
          getGoalCalenderView: event => this.getGoalRelatedCalenderView(event),
          getGoalEmployeeTaskBoard: event => this.getEmployeeTaskBoard(event)
        }

        this.selectedUserStory = null;
        this.showCalendarView = false;
        this.showReportsBoard = false;
        this.showDocuments = true;
        this.showEmployeeTaskBoard = false;
        this.documentManagementLoaded = true;
        this.cdRef.detectChanges();
      });
  }


  getEmployeeTaskBoard(event) {
    this.selectedUserStory = null;
    this.showCalendarView = false;
    this.showReportsBoard = false;
    this.showDocuments = false;
    this.showEmployeeTaskBoard = true;
    this.isTheBoardLayoutKanban = false;
    this.cdRef.detectChanges();
  }


  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }

}
