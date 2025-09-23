import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output,
  QueryList, TemplateRef, ViewChild, ViewChildren
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import * as _ from "underscore";
import { GoalModel } from "../../models/GoalModel";
import { UserStory } from "../../models/userStory";
import { WorkflowStatus } from "../../models/workflowStatus";
import { State } from "../../store/reducers/index";
import { SprintModel } from "../../models/sprints-model";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { UserStoryLogTimeModel } from '../../models/userStoryLogTimeModel';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import * as projectModuleReducer from "../../store/reducers/index";
import { InsertLogTimeTriggered } from '../../store/actions/userStory-logTime.action';
import { ProjectGoalsService } from '../../services/goals.service';
import { FeatureIds } from '../../../globaldependencies/constants/feature-ids';

@Component({
  selector: "app-pm-component-kanban-view-summary",
  templateUrl: "kanban-view-summary.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .profile-icon-style {
      position: relative;
      left: -5px;
    }  

    @media only screen and (max-width: 1440px) {
      .unique-badge-number {
        padding: 3px 5px;
      }
    }
  `],
  host: {
    "(document:click)": "onClick($event)"
  }
})

export class KanbanViewSummaryComponent extends AppFeatureBaseComponent implements OnInit {
  currentUserStory: boolean;
  CanAccess_Company_IsStartEnabled$: Observable<Boolean>;
  @Output() updateAutoLog = new EventEmitter<any>();
  @ViewChild("screenShotComponent") private screenShotComponent: TemplateRef<any>;

  @Input("isLoading")
  set _isLoading(data: boolean) {
    if (data == false) {
      this.currentUserStory = false;
    }
  }
  @Input("userStory")
  set _userStory(data: UserStory) {
    this.userStory = data;
    if (this.userStory) {
      this.autoLog = this.userStory.autoLog;
    }
    if (this.userStory.userStoryArchivedDateTime) {
      this.ArchivedGoalUserStory = true;
    } else if (this.userStory.userStoryParkedDateTime) {
      this.ParkedGoalUserStory = true;
    } else {
      this.ArchivedGoalUserStory = false;
      this.ParkedGoalUserStory = false;
    }
    if (this.userStory.tag) {
      this.userStoryInputTags = this.userStory.tag.split(",");
      this.cdRef.markForCheck();
    } else {
      this.userStoryInputTags = [];
    }
    
    this.getSoftLabelConfigurations();
  }

  @Input("workflow")
  set _workflow(data) {
    this.workflow = data;
    if (!this.maxOrderId) {
      this.maxOrderId = this.workflow.maxOrder;
    }
  }

  @Input("goal")
  set _goal(data) {
    this.goal = data;
    if (this.goal) {
      this.isFromSprint = false;
      this.projectId = this.goal.projectId;
      this.setGoalParams();
    }
  }

  @Input("sprint")
  set _sprint(data: SprintModel) {
    this.sprint = data;
    if (this.sprint) {
      this.isFromSprint = true;
      this.projectId = this.sprint.projectId;
     if(this.sprint.isComplete) {
       this.isComplete = true;
     } else {
       this.isComplete = false;
     }  
      this.setSprintParams();
    }
  }

  @Input("isGoalsPage")
  set _isGoalsPage(data) {
    this.isGoalsPage = data;
    this.checkPermissionsForUserStory();

  }

  @Input('notFromAudits')
  set _notFromAudits(data: boolean) {
    if (data || data == false) {
      this.notFromAudits = data;
    }
    else
      this.notFromAudits = true;
  }
  @Input("goalReplanId")
  set _goalReplanId(data: string) {
    this.goalReplanId = data;
  }

  userStoryLogTime = new UserStoryLogTimeModel();
  autoLog: boolean;
  @Output() highLightUserStory = new EventEmitter<string>();
  @Output() openUniquePage = new EventEmitter<any>();
  @ViewChildren("addKanbanUserStoryPopover") addUserStoryPopUp;
  @ViewChild("archiveUserStoryPopover") archiveUserStory: SatPopover;
  @ViewChild("parkUserStoryPopover") parkUserStory: SatPopover;
  @ViewChildren("kanbanUserStoryTagsPopOver") userStorytagsPopUps;
  @ViewChildren("parkKanbanUserStoryPopOver") parkUserStoryPopups;
  @ViewChildren("archiveKanbanUserStoryPopOver") archiveUserStoryPopups;
  @ViewChildren("createKanbanSubTaskPopover") createUserStoryPopups;
  @ViewChildren("inLineEditUserStoryPopup") inLineEditPopUps;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  entityRolePermisisons$: Observable<EntityRoleFeatureModel[]>;
  entityRolePermisisons: EntityRoleFeatureModel[];
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  anyOperationInProgress$: Observable<boolean>;
  userStoryIsInProgress$: Observable<boolean>;
  createUserstoryLoading$: Observable<boolean>;
  contextMenuPosition = { x: "0px", y: "0px" };
  goal: GoalModel;
  sprint: SprintModel;
  userStory: UserStory;
  userStoryDetail: UserStory = new UserStory();
  workflow: WorkflowStatus;
  titleText: string;
  projectId: string;
  defaultProfileImage = "assets/images/faces/18.png";
  defaultToolTip = "Owner";
  selectedUserStoryId: string;
  goalReplanId: string;
  userStoryId: string;
  isTagsPopUp: boolean;
  isListViewType: boolean;
  isBugBoard: boolean;
  isActiveGoalStatusId: boolean;
  isComplete: boolean;
  isAnyOperationIsInprogress: boolean;
  isPermissionForUserStory: boolean;
  isPermissionForParkUserStory: boolean;
  isPermissionForArchiveUserStory: boolean;
  isPermissionForAddUserStory: boolean;
  ArchivedGoalUserStory = false;
  ParkedGoalUserStory = false;
  isInlineEdit: boolean;
  isFromSprint: boolean;
  parentUserStoryName: string;
  isInlineEditForEstimatedTime: boolean;
  isInlineEditForUserStoryStatus: boolean;
  isInlineEditForUserStoryOwner: boolean;
  isInlineEditForSprintEstimatedTime: boolean;
  isInlineEditForUserStoryOwnerInActive: boolean;
  isInlineEditForUserStoryOwnerInBacklog: boolean;
  isInlineEditForUserStoryOwnerInReplan: boolean;
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
  isParkUserStory: boolean;
  isArchiveUserStory: boolean;
  isUserStoryArchived: boolean;
  isUserStoryParked: boolean;
  addUserStory: boolean;
  isUserStorySelected: boolean;
  KanbanForm: boolean;
  isSuperagileBoard: boolean;
  isGoalUserStory: boolean;
  notFromAudits: boolean = true;
  isGoalsPage: boolean;
  uniqueNumberUrl: string;
  maxOrderId: number;
  verificationCompletedTaskStatusId: string;
  inProgressTaskStatusId: string;
  doneTaskStatusId: string;
  isCreateSubTask: boolean;
  userStoryInputTags: string[] = [];
  show: boolean;
  isActivePermission: Boolean;
  isBacklogPermission: Boolean;
  isReplanPermission: Boolean;
  isActiveGoalsPage: boolean;
  backlogGoalUserStory: boolean;
  replanGoalStatusId: boolean;
  canAccess_feature_ViewActivityScreenshots: boolean;

  constructor(
    private store: Store<State>,
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private snackbar: MatSnackBar,
    private translateService: TranslateService,
    private softLabelsPipe: SoftLabelPipe,
    private router: Router,
    private datePipe: DatePipe,public dialog: MatDialog,
    private goalService: ProjectGoalsService) {
    super();
    let roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_ViewActivityScreenshots = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewActivityScreenshots.toString().toLowerCase(); }) != null;
  }

  ngOnInit() {
    super.ngOnInit();
    // this.CanAccess_Company_IsStartEnabled$ = this.sharedStore.pipe(select(sharedModuleReducers.getIsStartEnabled));
    this.isActivePermission = this.canAccess_entityType_feature_EditActiveGoalAssignee;
    this.isBacklogPermission = this.canAccess_entityType_feature_EditBacklogGoalAssignee;
    this.isReplanPermission = this.canAccess_entityType_feature_EditReplanGoalAssignee;
    this.isActivePermissionForEstimatedTime = this.canAccess_entityType_feature_EditActiveGoalEstimatedTime;
    this.isBacklogPermissionForEstimatedTime = this.canAccess_entityType_feature_EditBacklogGoalEstimatedTime;
    this.isReplanPermissionForEstimatedTime = this.canAccess_entityType_feature_EditReplanGoalEstimatedTime;
    this.isActivePermissionForDeadLineDate = this.canAccess_entityType_feature_EditActiveGoalDeadlineDate;
    this.isBacklogPermissionForDeadLineDate = this.canAccess_entityType_feature_EditBacklogGoalDeadlineDate;
    this.isReplanPermissionForDeadLineDate = this.canAccess_entityType_feature_EditReplanGoalDeadlineDate;

    this.router.url.includes('/backlog-goals') || this.router.url.includes('/replan-goals') ? this.show = false : this.show = true;
    this.verificationCompletedTaskStatusId = BoardTypeIds.VerificationCompletedTaskStatusId.toLowerCase();
    this.inProgressTaskStatusId = BoardTypeIds.InProgressTaskStatusId.toLowerCase();
    this.doneTaskStatusId = BoardTypeIds.DoneTaskStatusId.toLowerCase();
    this.userStoryIsInProgress$ = this.store.pipe(
      select(projectModuleReducer.getUniqueUserStoryById)
    );
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  openContextMenu(event: MouseEvent, userStoryId) {
    this.isUserStorySelected = false;
    event.preventDefault();
    const contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      console.log(event);
      this.contextMenuPosition.x = (event.clientX) + "px";
      this.contextMenuPosition.y = (event.clientY - 30) + "px";
      contextMenu.openMenu();
      this.cdRef.detectChanges();
      this.highLightUserStory.emit(userStoryId);
    }
  }

  setColorForBugPriorityTypes(color) {
    const styles = {
      // tslint:disable-next-line: object-literal-key-quotes
      "color": color
    };
    return styles;
  }

  showEstimatedTimeDeadlineDate(userStoryStatusId) {
    if (this.workflow.orderId === 1) {
      return true;
    } else {
      return false;
    }
  }

  checkIsArchived(isArchived) {
    if (isArchived) {
      this.isUserStoryArchived = false;
    } else {
      this.isUserStoryArchived = true;
    }
    return this.isUserStoryArchived;
  }

  checkIsParked(isParked) {
    if (isParked) {
      this.isUserStoryParked = false;
    } else {
      this.isUserStoryParked = true;
    }
    return this.isUserStoryParked;
  }

  closeUserStoryDialog() {
    this.addUserStoryPopUp.forEach((p) => p.closePopover());
    this.addUserStory = false;
    // tslint:disable-next-line: prefer-const
    let contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
  }

  closeUserStoryArchivePopup() {
    this.isArchiveUserStory = false;
    this.archiveUserStoryPopups.forEach((p) => p.closePopover());
    const contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
  }

  closeUserStoryParkPopup() {
    this.isParkUserStory = false;
    this.parkUserStoryPopups.forEach((p) => p.closePopover());
    const contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
  }

  closeTagsDialog() {
    this.isTagsPopUp = false;
    this.userStorytagsPopUps.forEach((p) => p.closePopover());
    const contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
  }

  setGoalParams() {
    this.isBugBoard = this.goal.isBugBoard;
    if(this.goal.isBugBoard) {
      this.KanbanForm = true;
    } else if(this.goal.isSuperAgileBoard) {
      this.isSuperagileBoard = true;
    } else {
      this.isSuperagileBoard = false;
    }
    // if (!this.goal.isBugBoard && this.goal.boardTypeUiId === BoardTypeIds.BoardViewKey.toLowerCase()) {
    //   this.KanbanForm = true;
    //   this.isSuperagileBoard = false;
    // } else if (this.goal.isBugBoard && this.goal.boardTypeUiId === BoardTypeIds.BoardViewKey.toLowerCase()) {
    //   this.KanbanForm = false;
    //   this.isSuperagileBoard = false;
    // } else {
    //   this.isSuperagileBoard = true;
    // }

    if (this.goal.inActiveDateTime || this.goal.parkedDateTime) {
      this.isGoalUserStory = false;
    } else {
      this.isGoalUserStory = true;
    }
    this.isListViewType = this.goal.isSuperAgileBoard ? true : false;
    if (this.goal.goalStatusId === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
      this.isActiveGoalStatusId = true;
    } else if (this.goal.goalStatusId === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
      this.backlogGoalUserStory = true;
    } else if(this.goal.goalStatusId === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
      this.replanGoalStatusId = true;
    }
  }

  setSprintParams() {
    this.isBugBoard = this.sprint.isBugBoard;
    if(this.sprint.isBugBoard) {
      this.KanbanForm = true;
    } else if(this.sprint.isSuperAgileBoard) {
      this.isSuperagileBoard = true;
    } else {
      this.isSuperagileBoard = false;
    }

    if (this.sprint.inActiveDateTime || this.sprint.isComplete) {
      this.isGoalUserStory = false;
    } else {
      this.isGoalUserStory = true;
    }
    this.isListViewType = (this.sprint.isSuperAgileBoard) ? true : false;
    if (this.sprint.sprintStartDate && !this.sprint.isReplan) {
      this.isActiveGoalStatusId = true;
    } else if (!this.sprint.sprintStartDate) {
      this.backlogGoalUserStory = false;
    } else if(this.sprint.isReplan) {
      this.replanGoalStatusId = true;
    }
  }

  saveDeadlineDate(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStoryId) {
    if (this.isGoalsPage) {
      if ((this.isActiveGoalStatusId && this.isInlineEditForUserStoryDeadLineDateInActive && !this.isSuperagileBoard) || (this.backlogGoalUserStory && this.isInlineEditForUserStoryDeadLineDateInBacklog) || (this.replanGoalStatusId && this.isInlineEditForUserStoryDeadLineDateInReplan)) {
        this.openDeadlineDatePopUp(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStoryId);
      }

    } else {
      if ((this.isActiveGoalStatusId && this.isActivePermissionForDeadLineDate && !this.isSuperagileBoard) || (this.backlogGoalUserStory && this.isBacklogPermissionForDeadLineDate) || (this.replanGoalStatusId && this.isReplanPermissionForDeadLineDate)) {
        this.openDeadlineDatePopUp(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStoryId);
      }
    }
  }

  openDeadlineDatePopUp(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStory) {
    this.userStory = userStory;
    if (this.ArchivedGoalUserStory || this.ParkedGoalUserStory) {
      if (this.ArchivedGoalUserStory) {
        // tslint:disable-next-line:max-line-length
        const message = this.softLabelsPipe.transform(this.translateService.instant("USERSTORY.PLEASEUNARCHIVETHISUSERSTORY"), this.softLabels);
        this.toastr.warning("", message);
      }
      if (this.ParkedGoalUserStory) {
        // tslint:disable-next-line:max-line-length
        const message = this.softLabelsPipe.transform(this.translateService.instant("USERSTORY.PLEASERESUMETHISUSERSTORY"), this.softLabels);
        this.toastr.warning("", message);
      }
    } else {
        this.titleText = "Edit deadline date";
        this.isInlineEdit = true;
        this.isInlineEditForEstimatedTime = false;
        this.isInlineEditForUserStoryStatus = false;
        this.isInlineEditForUserStoryOwner = false;
        this.isInlineEditForSprintEstimatedTime = false;
        inLineEditUserStoryPopup.openPopover();
    }
  }

  saveEstimatedTime(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStoryId) {
    if (this.isGoalsPage) {
      if ((this.isActiveGoalStatusId && this.isInlineEditForUserStoryEstimatedTimeInActive && !this.isSuperagileBoard) || (this.backlogGoalUserStory && this.isInlineEditForUserStoryEstimatedTimeInBacklog) || (this.replanGoalStatusId && this.isInlineEditForUserStoryEstimatedTimeInReplan)) {
        this.openEstimatedTimePopUp(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStoryId);
      }

    } else {
      if ((this.isActiveGoalStatusId && this.isActivePermissionForEstimatedTime && !this.isSuperagileBoard) || (this.backlogGoalUserStory && this.isBacklogPermissionForEstimatedTime) || (this.replanGoalStatusId && this.isReplanPermissionForEstimatedTime)) {
        this.openEstimatedTimePopUp(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStoryId);
      }
    }
  }

  openEstimatedTimePopUp(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStory) {
    this.userStory = userStory;
    if (this.ArchivedGoalUserStory || this.ParkedGoalUserStory) {
      if (this.ArchivedGoalUserStory) {
        // tslint:disable-next-line:max-line-length
        const message = this.softLabelsPipe.transform(this.translateService.instant("USERSTORY.PLEASEUNARCHIVETHISUSERSTORY"), this.softLabels);
        this.toastr.warning("", message);
      }
      if (this.ParkedGoalUserStory) {
        // tslint:disable-next-line:max-line-length
        const message = this.softLabelsPipe.transform(this.translateService.instant("USERSTORY.PLEASERESUMETHISUSERSTORY"), this.softLabels);
        this.toastr.warning("", message);
      }
    } else {
        this.titleText = this.translateService.instant('USERSTORY.EDITESTIMATEDTIME');
        this.isInlineEdit = false;
        this.isInlineEditForEstimatedTime = true;
        this.isInlineEditForUserStoryStatus = false;
        this.isInlineEditForUserStoryOwner = false;
        this.isInlineEditForSprintEstimatedTime = false;
        inLineEditUserStoryPopup.openPopover();
    }
  }

  saveEstimatedTimeInSp(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStoryId) {
    if (this.isGoalsPage) {
      if ((this.isActiveGoalStatusId && this.isInlineEditForUserStoryEstimatedTimeInActive && !this.isSuperagileBoard) || (this.backlogGoalUserStory && this.isInlineEditForUserStoryEstimatedTimeInBacklog) || (this.replanGoalStatusId && this.isInlineEditForUserStoryEstimatedTimeInReplan)) {
        this.openEstimatedTimeInSpPopUp(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStoryId);
      }

    } else {
      if ((this.isActiveGoalStatusId && this.isActivePermissionForEstimatedTime && !this.isSuperagileBoard) || (this.backlogGoalUserStory && this.isBacklogPermissionForEstimatedTime) ||  (this.replanGoalStatusId && this.isReplanPermissionForEstimatedTime)) {
        this.openEstimatedTimeInSpPopUp(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStoryId);
      }
    }
  }

  openEstimatedTimeInSpPopUp(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStory) {
    this.userStory = userStory;
    if (this.ArchivedGoalUserStory || this.ParkedGoalUserStory) {
      if (this.ArchivedGoalUserStory) {
        // tslint:disable-next-line:max-line-length
        const message = this.softLabelsPipe.transform(this.translateService.instant("USERSTORY.PLEASEUNARCHIVETHISUSERSTORY"), this.softLabels);
        this.toastr.warning("", message);
      }
      if (this.ParkedGoalUserStory) {
        // tslint:disable-next-line:max-line-length
        const message = this.softLabelsPipe.transform(this.translateService.instant("USERSTORY.PLEASERESUMETHISUSERSTORY"), this.softLabels);
        this.toastr.warning("", message);
      }
    } else {
        this.titleText = this.translateService.instant('USERSTORY.EDITSPRINTESTIMATEDTIME');
        this.isInlineEdit = false;
        this.isInlineEditForEstimatedTime = false;
        this.isInlineEditForUserStoryStatus = false;
        this.isInlineEditForUserStoryOwner = false;
        this.isInlineEditForSprintEstimatedTime = true;
        inLineEditUserStoryPopup.openPopover();
    }
  }


  saveAssignee(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStoryId) {
    if (this.isGoalsPage) {
      if ((this.isActiveGoalStatusId && this.isInlineEditForUserStoryOwnerInActive) || (this.backlogGoalUserStory && this.isInlineEditForUserStoryOwnerInBacklog) || (this.replanGoalStatusId && this.isInlineEditForUserStoryOwnerInReplan)) {
        this.openAssigneePopUp(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStoryId);
      }

    } else {
      if ((this.isActiveGoalStatusId && this.isActivePermission) || (this.backlogGoalUserStory && this.isBacklogPermission) || (this.replanGoalStatusId && this.isReplanPermission)) {
        this.openAssigneePopUp(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStoryId);
      }
    }

  }

  openAssigneePopUp(userStoryStatusId, inLineEditUserStoryPopup, isPermitted, userStory) {
    this.userStory = userStory;
    if (this.ArchivedGoalUserStory || this.ParkedGoalUserStory) {
      if (this.ArchivedGoalUserStory) {
        // tslint:disable-next-line:max-line-length
        const message = this.softLabelsPipe.transform(this.translateService.instant("USERSTORY.PLEASEUNARCHIVETHISUSERSTORY"), this.softLabels);
        this.toastr.warning("", message);
      }
      if (this.ParkedGoalUserStory) {
        // tslint:disable-next-line:max-line-length
        const message = this.softLabelsPipe.transform(this.translateService.instant("USERSTORY.PLEASERESUMETHISUSERSTORY"), this.softLabels);
        this.toastr.warning("", message);
      }
    } else {
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
  }

  closeUserStoryDialogWindow() {
    this.isInlineEdit = false;
    this.isInlineEditForEstimatedTime = false;
    this.isInlineEditForUserStoryStatus = false;
    this.isInlineEditForUserStoryOwner = false;
    this.inLineEditPopUps.forEach((p) => p.closePopover());
  }

  archiveUserStoryNew(userStory, archiveKanbanUserStoryPopOver) {
    this.isArchiveUserStory = true;
    this.userStoryDetail = userStory;
    archiveKanbanUserStoryPopOver.openPopover();
  }

  parkUserStoryNew(userStory, parkKanbanUserStoryPopOver) {
    this.isParkUserStory = true;
    this.userStoryDetail = userStory;
    parkKanbanUserStoryPopOver.openPopover();
  }

  createSubTaskNew(userStory, createSubTaskPopover) {
    this.isCreateSubTask = true;
    this.userStoryDetail = userStory;
    createSubTaskPopover.openPopover();
  }

  closeUserStoryDetailWindow() {
    this.isCreateSubTask = false;
    this.createUserStoryPopups.forEach((p) => p.closePopover());
    const contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
  }

  openTagsPopUp(userStory, createTagsPopover) {
    this.isTagsPopUp = true;
    this.userStoryDetail = userStory;
    createTagsPopover.openPopover();
  }

  editUserStoryById(list, addKanbanUserStoryPopoverOpen) {
    if (this.ArchivedGoalUserStory || this.ParkedGoalUserStory) {
      if (this.ArchivedGoalUserStory) {
        // tslint:disable-next-line:max-line-length
        const message = this.softLabelsPipe.transform(this.translateService.instant("USERSTORY.PLEASEUNARCHIVETHISUSERSTORY"), this.softLabels);
        this.toastr.warning("", message);
      }
      if (this.ParkedGoalUserStory) {
        // tslint:disable-next-line:max-line-length
        const message = this.softLabelsPipe.transform(this.translateService.instant("USERSTORY.PLEASERESUMETHISUSERSTORY"), this.softLabels);
        this.toastr.warning("", message);
      }
    } else {
      addKanbanUserStoryPopoverOpen.openPopover();
      this.addUserStory = true;
      this.userStory = list;
    }
  }

  onClick(event) {
    if (this.isUserStorySelected === false) {
      this.selectedUserStoryId = null;
      this.highLightUserStory.emit(null);
    }
  }

  checkPermissionsForUserStory() {
    if (!this.isFromSprint && this.goal && this.goal.goalId === "00000000-0000-0000-0000-000000000000") {
      return false;
    } else {
      if (this.isGoalsPage && this.projectId) {
        let projectId = this.projectId;
        let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
        if (entityRolefeatures && entityRolefeatures.length > 0) {
          this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
            return role.projectId == projectId.toLowerCase()
          })
          let featurePermissions = [];
          featurePermissions = this.entityRolePermisisons;
          if (featurePermissions.length > 0) {
            const entityTypeFeatureForAddOrUpdateUpdateUserStory = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateWorkItem.toString().
              toLowerCase();
            // tslint:disable-next-line: prefer-const
            // tslint:disable-next-line: only-arrow-functions
            const addOrUpdateUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
              return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForAddOrUpdateUpdateUserStory)
            })
            if (addOrUpdateUserStoryPermisisonsList.length > 0) {
              this.isPermissionForAddUserStory = true;
            } else {
              this.isPermissionForAddUserStory = false;
            }
  
            // Permission For Archive userstory
            const entityTypeFeatureForArchiveUserStory = EntityTypeFeatureIds.EntityTypeFeature_ArchiveWorkItem.toString().toLowerCase();
            // tslint:disable-next-line: only-arrow-functions
            const archiveUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
              return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForArchiveUserStory)
            })
            if (archiveUserStoryPermisisonsList.length > 0) {
              this.isPermissionForArchiveUserStory = true;
            } else {
              this.isPermissionForArchiveUserStory = false;
            }
  
            // Permission For Park UserStory
            const entityTypeFeatureForParkUserStory = EntityTypeFeatureIds.EntityTypeFeature_ParkWorkItem.toString().toLowerCase();
            // tslint:disable-next-line: only-arrow-functions
            const parkUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
              return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForParkUserStory)
            })
            if (parkUserStoryPermisisonsList.length > 0) {
              this.isPermissionForParkUserStory = true;
            } else {
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
  }

  navigateToUserStoriesPage(userStoryId) {
    if (!this.ArchivedGoalUserStory && !this.ParkedGoalUserStory && this.isGoalUserStory && this.notFromAudits) {
      if (this.isFromSprint) {
        this.router.navigate([
          "projects/sprint-workitem",
          userStoryId
        ]);
      } else {
        this.router.navigate([
          "projects/workitem",
          userStoryId
        ]);
      }
    }
    else if (!this.notFromAudits) {
      this.openUniquePage.emit({ userStory: this.userStory });
    }
  }

  copyLink() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, "");
    if (this.isFromSprint) {
      this.uniqueNumberUrl = this.uniqueNumberUrl + "/projects/sprint-workitem/" + this.userStory.userStoryId;
    }
    else if (!this.notFromAudits) {
      this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/action/' + this.userStory.userStoryId;
    }
    else {
      this.uniqueNumberUrl = this.uniqueNumberUrl + "/projects/workitem/" + this.userStory.userStoryId;
    }
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = this.uniqueNumberUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    // tslint:disable-next-line: max-line-length
    this.snackbar.open(this.translateService.instant("USERSTORY.LINKCOPIEDSUCCESSFULLY"), this.translateService.instant(ConstantVariables.success), { duration: 3000 });
  }

  openInNewTab() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, "");
    if (this.isFromSprint) {
      this.uniqueNumberUrl = this.uniqueNumberUrl + "/projects/sprint-workitem/" + this.userStory.userStoryId;
    }
    else if (!this.notFromAudits) {
      this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/action/' + this.userStory.userStoryId;
    }
    else {
      this.uniqueNumberUrl = this.uniqueNumberUrl + "/projects/workitem/" + this.userStory.userStoryId;
    }
    window.open(this.uniqueNumberUrl, "_blank");
  }

  configureDeadlineDateDisplay(deadLineDate, isConfigureDate) {
    if (isConfigureDate) {
      return this.datePipe.transform(deadLineDate, "dd MMM yyyy, h:mm a");
    } else {
      return this.datePipe.transform(deadLineDate, "dd MMM yyyy");
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

    // this.autoLog = !userStory.autoLog;
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
    this.userStoryLogTime.isFromSprint = this.isFromSprint;
    this.updateAutoLog.emit({ userStoryLogTime: this.userStoryLogTime });
    //this.close.emit(true);
    //this.store.dispatch(new InsertLogTimeTriggered(this.userStoryLogTime));
  }

  getParentUserStoryData(userStoryId) {
    this.goalService.GetUserStoryById(userStoryId).subscribe((x : any)=> {
      if(x.success) {
        let userStoryData = x.data;
        this.parentUserStoryName = userStoryData.userStoryName;
        this.cdRef.detectChanges();
      }
    })
  }

  openScreenShotsDialog() {
    let dialogId = "app-activity-tracker-screenshot-kanban";
    const activityScreenshotDialog = this.dialog.open(this.screenShotComponent, {
        width: "79%",
        minHeight: "85vh",
        id: dialogId,
        data: {
            dialogId: dialogId, 
                userId: this.userStory.userId, dateFrom: this.datePipe.transform(this.userStory.createdDate,"yyyy-MM-dd"), dateTo: this.datePipe.transform(new Date(),"yyyy-MM-dd"),
                userStoryId: this.userStory.userStoryId,userStoryName: this.userStory.userStoryName
            
        },
    });
    activityScreenshotDialog.afterClosed().subscribe((result) => {

    });
}
}
