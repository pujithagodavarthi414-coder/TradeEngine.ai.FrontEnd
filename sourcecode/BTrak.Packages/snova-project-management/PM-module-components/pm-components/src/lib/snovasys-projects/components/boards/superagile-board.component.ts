import {
  ChangeDetectionStrategy, ChangeDetectorRef, Compiler, Component, ComponentFactoryResolver, ElementRef, EventEmitter,
  HostListener, Inject, Input, NgModuleFactory, NgModuleFactoryLoader, NgModuleRef, OnInit, Output, Type, ViewChild, ViewContainerRef
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatOption } from "@angular/material/core";
import { MatMenu } from "@angular/material/menu";
import { ActivatedRoute, Router } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { take, takeUntil, tap } from "rxjs/operators";
import * as _ from "underscore";
import { BugPriorityDropDownData } from "../../models/bugPriorityDropDown";
import { GoalModel } from "../../models/GoalModel";
import { GoalReplan } from "../../models/goalReplan";
import { GoalReplanModel } from "../../models/goalReplanModel";
import { ProjectFeature } from "../../models/projectFeature";
import { ProjectMember } from "../../models/projectMember";
import { UserStory } from "../../models/userStory";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { WorkflowStatus } from "../../models/workflowStatus";
import { LoadBugPriorityTypesTriggered } from "../../store/actions/bug-priority.action";
import { InsertGoalReplanTriggered, LoadGoalReplanActionsTriggered } from "../../store/actions/goal-replan-types.action";
import { CreateGoalTriggered, GoalActionTypes, GetGoalByIdTriggered } from "../../store/actions/goal.actions";
import { LoadFeatureProjectsTriggered } from "../../store/actions/project-features.actions";
import { LoadUserStoryTypesTriggered } from "../../store/actions/user-story-types.action";
import { UserStoryActionTypes } from "../../store/actions/userStory.actions";
import * as userStoryActions from "../../store/actions/userStory.actions";
import { LoadworkflowStatusCompleted, LoadWorkflowStatusListTriggered, LoadworkflowStatusTriggered, workFlowStatusActionTypes } from "../../store/actions/work-flow-status.action";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { ProjectGoalsService } from "../../services/goals.service";
import * as FileSaver from 'file-saver';
import * as  moment from 'moment'
import * as XLSX from "xlsx";
import { WorkItemUploadPopupComponent } from "../dialogs/work-item-upload.component";
import { SprintModel } from "../../models/sprints-model";
import { UpsertSprintsTriggered } from "../../store/actions/sprints.action";
import { Project } from "../../models/project";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { SoftLabelConfigurationModel, WorkspaceDashboardFilterDropdown, WorkspaceDashboardFilterModel } from '../../../globaldependencies/models/softlabels-models';
import { GoogleAnalyticsService } from '../../../globaldependencies/services/google-analytics.service';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { WidgetService } from '../../services/widget.service';
import { FeatureIds } from '../../../globaldependencies/constants/feature-ids';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { LoadMemberProjectsTriggered } from "../../store/actions/project-members.actions";
import "../../../globaldependencies/helpers/fontawesome-icons";
import { ProjectSummaryTriggered } from '../../store/actions/project-summary.action';
import { ProjectModulesService } from '../../services/project.modules.service';
import { WorkFlowService } from '../../services/workFlow.Services';
import { WorkFlowStatusTransitionTableData } from '../../models/workFlowStatusTransitionTableData';
import { LoadworkflowStatusTransitionTriggered } from "../../store/actions/work-flow-status-transitions.action";
import { LoadUsersTriggered } from '../../store/actions/users.actions';
import { User } from '../../models/user';
import { LoadUserStoryStatusTriggered } from '../../store/actions/userStoryStatus.action';
import { StatusesModel } from '../../models/workflowStatusesModel';
import { WorkFlowManagementPageComponent } from "@snovasys/snova-admin-module";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };



@Component({
  selector: "app-pm-component-superagile-board",
  templateUrl: "superagile-board.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(document:click)": "onClick($event)"
  }
})
export class SuperagileBoardComponent extends AppFeatureBaseComponent
  implements OnInit {
  goal;
  goalUniqueDetailPage: boolean;
  highLightMenu: boolean;
  @Input("goal")
  set _goal(goal: GoalModel) {
    this.goal = goal;
    this.goalId = this.goal.goalId;
    this.isBugFilters = this.goal.isBugBoard;
    // this.getBoardTypesFilter();
    this.checkGoalPermissions();
    this.isListView = this.goal.isSuperAgileBoard ? true : false;
    this.projectId = this.goal.projectId;
    if (this.goal.goalName === this.goal.goalShortName) {
      this.showGoalName = true;
    } else {
      this.showGoalName = false;
    }
    if ((this.goal.goalShortName === "Backlog" && this.goal.goalName === "Backlog") && this.goal.goalStatusId === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
      this.isBacklogIssues = true;
      this.store.dispatch(new LoadMemberProjectsTriggered(this.goal.projectId));
    } else {
      this.isBacklogIssues = false;
    }
    this.setBulkUpdatePermissions();
    this.checkBoardType();
    this.isSelected = [];
    this.isUnassigned = null;
    this.selectedNames = [];
    this.isSelectedMembers = [];
    this.selectedAssigneelist = [];
    this.ownerUserId = null;
    this.selectedComponentId = null;
    this.selectedBugPriorityId = null;
    this.versionNamesearchText = null;
    this.searchTags = null;
    this.searchText = null;
    this.userNames = null;
    this.selectedWorkflowStatus = null;
    this.orderByOption = null;
    this.selectedUserStoryType = null;
    this.selectedProjectFeature = null;
    this.searchTextWithGoalName = null;
    this.selectedBugPriority = null;
    this.selectUserStoryStatus = this.fb.group({
      userStoryStatus: new FormControl("")
    });

    this.selectBugPriority = this.fb.group({
      bugPriority: new FormControl("")
    });

    this.selectUserStoryTypeForm = new FormGroup({
      userStoryTypeId: new FormControl("", [])
    });

    this.selectComponent = this.fb.group({
      componentName: new FormControl("")
    });
    this.isFiltersShow = false;
    this.isApproved = this.goal.isApproved;
    this.isLocked = this.goal.isLocked;
    this.isSprintsConfiguration = this.goal.isSprintsConfiguration;
    if (this.goal.boardTypeUiId === BoardTypeIds.BoardViewKey.toLowerCase() && !this.goal.isBugBoard) {
      if (this.goal.isSuperagileBoard) {
        this.isSuperagileBoard = true;
      } else {
        this.KanbanForm = true;
      }
    }
    if (this.goal.boardTypeUiId === BoardTypeIds.ListViewKey.toLowerCase() && !this.goal.isBugBoard) {
      if (this.goal.isSuperagileBoard) {
        this.isSuperagileBoard = true;
      } else {
        this.KanbanForm = true;
      }
    }
    if (this.goal.isBugBoard) {
      this.KanbanForm = false;
      this.isBoardLayout = true;
      this.LoadProjectFeature();
      this.store.dispatch(new LoadBugPriorityTypesTriggered());
      this.isSuperagileBoard = false;
    }
    const workflowStatus = new WorkflowStatus();
    if (this.goal && this.goal.workflowId && this.goal.goalId != '00000000-0000-0000-0000-000000000000') {
      workflowStatus.workFlowId = this.goal.workflowId;
      this.workflowId = this.goal.workflowId;
      this.workflowStatus$ = this.store.pipe(
        select(projectModuleReducer.getworkflowStatusAllByWorkflowId, { workflowId: workflowStatus.workFlowId })
      );
      this.workflowStatus$
        .subscribe((s) => (this.workflowStatusList = s));
      if (this.workflowStatusList && this.workflowStatusList.length === 0) {
        this.store.dispatch(new LoadworkflowStatusTriggered(workflowStatus));
      } else {
        this.workflowName = this.workflowStatusList[0].workflowName;
      }

      this.clearAssigneeForm();
      this.clearEstimatedTimeForm();
      this.clearStatusForm();
      this.clearSortByOptionsForm();
    }
    if (this.goal.goalId == '00000000-0000-0000-0000-000000000000') {
      this.store.dispatch(new LoadUserStoryStatusTriggered());
      this.store.dispatch(new LoadUsersTriggered());

    }
  }
  isTheBoardLayoutKanban;
  @Input("isTheBoardLayoutKanban")
  set _isTheBoardLayoutKanban(isTheBoardLayoutKanban: boolean) {
    this.isTheBoardLayoutKanban = isTheBoardLayoutKanban;
  }

  allUserStorieSelected;
  @Input("allUserStorieSelected")
  set _alluserstorieselected(data: boolean) {
    this.allUserStorieSelected = data;
    this.userCheckedAll = this.allUserStorieSelected;
  }

  isReportsPage;
  @Input("isReportsPage")
  set _isReportsPage(isReportsPage: boolean) {
    this.isReportsPage = isReportsPage;
    if (this.isReportsPage) {
      this.isCalenderView = false;
      this.isDocument = false;
      this.isEmployeeTaskBoardPage = false;
    }
  }

  isCalenderView;
  @Input("isCalenderView")
  set _isCalenderView(isCalenderView: boolean) {
    this.isCalenderView = isCalenderView;
    if (this.isCalenderView) {
      this.isReportsPage = false;
      this.isDocument = false;
      this.isEmployeeTaskBoardPage = false;
    }
  }

  @Input("isDocument")
  set _isDocument(isDocument: boolean) {
    this.isDocument = isDocument;
    if (this.isDocument) {
      this.isReportsPage = false;
      this.isCalenderView = false;
      this.isEmployeeTaskBoardPage = false;
    }
  }

  @Input("highLightMenu")
  set _highLightMenu(highLightMenu: boolean) {
    this.highLightMenu = highLightMenu;
  }

  @Input("isEmployeeTaskBoardPage")
  set _isEmployeeTaskBoardPage(data: boolean) {
    if (data || data == false) {
      this.isEmployeeTaskBoardPage = data;
      if (this.isEmployeeTaskBoardPage) {
        this.isReportsPage = false;
        this.isCalenderView = false;
        this.isDocument = false;
      }
    }
    else {
      this.isEmployeeTaskBoardPage = false;
    }
  }

  @Input("ownerUserId")
  set _ownerUserId(ownerUserId: string) {
    if (ownerUserId) {
      this.isSelectedMembers.push(ownerUserId);
    }
  }

  isAllGoalsPage;
  @Input("isAllGoalsPage")
  set _isAllGoalsPage(isAllGoalsPage: boolean) {
    this.isAllGoalsPage = isAllGoalsPage;
    if (this.isAllGoalsPage && this.goal.goalId != '00000000-0000-0000-0000-000000000000') {
      this.setEnableRolePermissions(this.goal.projectId);
    }
  }

  showHeader;
  @Input("showHeader")
  set _showHeader(header: boolean) {
    this.showHeader = header;
    this.clearFormValue = true;
  }

  @Input("goalUniqueDetailPage")
  set _goalUniqueDetailPage(data: boolean) {
    this.goalUniqueDetailPage = data;
    if (this.goalUniqueDetailPage && this.goal.goalId != '00000000-0000-0000-0000-000000000000') {
      this.setEnableRolePermissions(this.goal.projectId);
    }
  }

  @Input("userStorySearchCriteria")
  set _userStorySearchCriteria(data: any) {
    this.userStorySearchCriteriaModel = data;
  }

  @ViewChild("editThreeDotsPopover") threeDotsPopOver: SatPopover;
  @ViewChild("workFlowPopover") workflowPopover: SatPopover;
  @Output() eventClicked = new EventEmitter<any>();
  @Output() showDeadlineOnHover = new EventEmitter<boolean>();
  @Output() goalReplanId = new EventEmitter<string>();
  @Output() searchUserStoriesBasedOnUserStoryName = new EventEmitter<string>();
  @Output() searchUserStoriesBasedOnVersionName = new EventEmitter<string>();
  @Output() amendUserStoryDeadlineConfigurations = new EventEmitter<UserStory>();
  @Output() selectedUserStoryStatus = new EventEmitter<string>();
  @Output() selectedComponent = new EventEmitter<string>();
  @Output() saveMultipleUserStories = new EventEmitter<UserStory>();
  @Output() saveTransitionForMultipleUserStories = new EventEmitter<UserStory>();
  @Output() selectedOwnerUserId = new EventEmitter<string>();
  @Output() getChartDetails = new EventEmitter<string>();
  @Output() getDocumentDetails = new EventEmitter<string>();
  @Output() getCalanderView = new EventEmitter<string>();
  @Output() selectedUserStoriesAll = new EventEmitter<boolean>();
  @Output() selectedSortByOption = new EventEmitter<string>();
  @Output() selectedBugPriorityIds = new EventEmitter<string>();
  @Output() searchUserStoriesBasedOnTags = new EventEmitter<string>();
  @Output() searchUserStoriesBasedOnGoalName = new EventEmitter<string>();
  @Output() selectedUserStoryTypeList = new EventEmitter<string>();
  @Output() saveAsDefaultPersistance = new EventEmitter<string>();
  @Output() resetToDefaultDashboardPersistance = new EventEmitter<string>();
  @Output() refreshDashboard = new EventEmitter<string>();
  @Output() getGoalEmployeeTaskBoard = new EventEmitter<string>();
  @Output() openAppsSettings = new EventEmitter<boolean>();
  @Output() taskBoardViewToggle = new EventEmitter<boolean>();
  @Output() taskBoardViewPrint = new EventEmitter<any>();
  @Output() emitAppListView = new EventEmitter<boolean>();
  @ViewChild("filterThreeDotsPopover") filterthreeDotsPopOver: MatMenu;
  @ViewChild("updateAssigneePopover") closeAssigneePopUp: SatPopover;
  @ViewChild("updateEstimatedTimePopover") closeEstimatedTimePopUp: SatPopover;
  @ViewChild("updateUserStoryStatusPopover") closeUserStoryStatusPopUp: SatPopover;
  @ViewChild("updateDeadlineDatePopover") closeDeadlineDatePopUp: SatPopover;
  @ViewChild("allSelected") private allSelected: MatOption;
  @ViewChild("allSelected1") private allSelected1: MatOption;
  @ViewChild("allUserStoryStatusSelected") private allUserStoryStatusSelected: MatOption;
  @ViewChild("allUserStoryStatusSelected1") private allUserStoryStatusSelected1: MatOption;
  @ViewChild("allUserStoryTypesSelected") private allUserStoryTypesSelected: MatOption;
  @ViewChild("allUserStoryTypesSelected1") private allUserStoryTypesSelected1: MatOption;
  @ViewChild("allProjectFeaturesSelected") private allProjectFeaturesSelected: MatOption;
  @ViewChild("allProjectFeaturesSelectedOption") private allProjectFeaturesSelectedOption: MatOption;
  @ViewChild("allStatusSelected") private allStatusSelected: MatOption;
  @ViewChild("fileInput") fileInput: ElementRef;

  entityRolePermisisons$: Observable<EntityRoleFeatureModel[]>;
  entityRolePermisisons: EntityRoleFeatureModel[];
  projectMembers$: Observable<ProjectMember[]>;
  projectMembers: ProjectMember[];
  workflowStatus$: Observable<WorkflowStatus[]>;
  workflowStatusList: WorkflowStatus[];
  workflowStatusComponentList: WorkflowStatus[];
  workflowStatusTransitions: WorkFlowStatusTransitionTableData[];
  anyOperationInProgress$: Observable<boolean>;
  amendDeadlineDateIsInProgress$: Observable<boolean>;
  bugPriorities$: Observable<BugPriorityDropDownData[]>;
  goalReplanModel$: Observable<GoalReplanModel[]>;
  projectFeature$: Observable<ProjectFeature[]>;
  projectFeatures: ProjectFeature[];
  userStories$: Observable<UserStory[]>;
  updatedGoal$: Observable<GoalModel[]>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  userStoryStatus$: Observable<StatusesModel[]>;
  projectResponsiblePersons$: Observable<User[]>;
  UsersList: User[];
  userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
  accessPublishBoard$: Boolean;
  accessDragApps$: Boolean;
  accessUploadIcons$: Boolean;
  canAccessWorkflow: boolean;
  project$: Observable<Project>;
  softLabels: SoftLabelConfigurationModel[];
  userStories: UserStory[];
  userStoryTypes$: Observable<UserStoryTypesModel[]>;
  userStoryTypes: UserStoryTypesModel[];
  userStoryStatusList: StatusesModel[];
  ownerName: string;
  workflowName: string;
  workflowId: string;
  showDropDown: boolean;
  isOperationInProgress: boolean;
  isEnableSprints: boolean;
  isDocument: boolean;
  isEmployeeTaskBoardPage: boolean;
  goalCreationInProgress$: Observable<boolean>;
  sprintCreationInProgress$: Observable<boolean>;
  disabled: boolean;
  userStorySearchCriteria: UserStorySearchCriteriaInputModel;
  bugPriorities: BugPriorityDropDownData[];
  workspaceFilterModel = new WorkspaceDashboardFilterDropdown();
  tab: string;
  searchTextWithGoalName: string;
  isActiveGoalStatusId: boolean;
  isBacklogGoalStatusId: boolean;
  isReplanGoalStatusId: boolean;
  isDeadlineDisplay: boolean = true;
  showFirst = false;
  isSprintsConfiguration: boolean;
  isFiltersShow: boolean;
  showApproveIcon = false;
  selectedProjectMember = true;
  showReplanDropdown: boolean;
  isBacklogIssues: boolean;
  AssigneeForm: FormGroup;
  EstimatedTimeForm: FormGroup;
  deadLineDateForm: FormGroup;
  StatusTransitionForm: FormGroup;
  selectSortByForm: FormGroup;
  selectUserStoryTypeForm: FormGroup;
  selectedReplanId: string;
  workspaceDashboardFilterId: string;
  selectedItem: boolean;
  checkReplan: boolean;
  userCheckedAll: boolean;
  searchText: string;
  versionNamesearchText: string;
  isAssigneeDialog: boolean;
  isEstimatedTimeDialog: boolean;
  isUserStoryStatusDialog: boolean;
  isDeadlineDateDialog: boolean;
  projectId: string;
  isDisabled = true;
  estimatedTime: string;
  isCheckBox: boolean;
  isSuperagileBoard: boolean;
  KanbanForm: boolean;
  isReportsTab: boolean;
  ownerId: string;
  searchTags: string;
  defaultName: string = "N/A"
  selectedBugPriorityId: string;
  selectedUserStoryStatusId: string;
  selectedComponentId: string;
  isBoardLayout: boolean;
  goalModel: GoalModel;
  isApproved: boolean;
  isLocked: boolean;
  clearFormValue: boolean;
  ownerUserId: string;
  ArchivedGoalUserStory = false;
  ParkedGoalUserStory = false;
  isSelected: any[] = [];
  isSelectedMembers: any[] = [];
  selectBugPriority: FormGroup;
  selectUserStoryStatus: FormGroup;
  selectComponent: FormGroup;
  selectedAssigneelist = [];
  public ngDestroyed$ = new Subject();
  public showUsersList = false;
  projectMember = true;
  divActivate = false;
  isActiveGoalsTabEnabled = false;
  userStoryCount: number;
  showEstimatedTime: boolean;
  showDeadlineDate: boolean;
  showStatusDropdown: boolean;
  updatePersistanceInprogress: boolean = false;
  showGoalName: boolean;
  selectedMember: string;
  goalId: string;
  selectedWorkflowStatus: string;
  selectedBugPriority: string;
  selectedProjectFeature: string;
  selectedUserStoryType: string;
  selectedUserStoryTypeIds: string;
  isCurrentUrl: boolean
  isBugFilters: boolean;
  downloadInProgress: boolean = false;
  isListView: boolean;
  listView: boolean = true;
  // tslint:disable-next-line:ban-types
  isPermissionForGoalLevelReports: Boolean;
  isPermissionForCanAccessGoalLevelReports: boolean;
  goalLabel: string;
  workItemLabel: string;
  projectLabel: string;
  orderByOption: string;
  isReOrderInProgress: boolean;
  selectedNames: string[] = [];
  userNames: string;
  taskBoardView: boolean = false;
  defaultProfilePicture: string = 'assets/images/faces/18.png';
  isShowTemplateIcons: boolean = false;
  userStoryDetails: UserStory;
  unAssignedUser: any;
  isUnassigned: boolean;
  injector: any;
  workflowStatusComponent: any;
  workflowStatusTransitionComponent: any;
  isPermissionForViewUserStories: boolean;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private actionUpdates$: Actions,
    private router: Router,
    private dialog: MatDialog,
    private factoryResolver: ComponentFactoryResolver,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _el: ElementRef,
    private translateService: TranslateService,
    public googleAnalyticsService: GoogleAnalyticsService,
    private softLabelPipe: SoftLabelPipe,
    private widgetService: WidgetService,
    private ProjectGoalsService: ProjectGoalsService,
    @Inject('ProjectModuleLoader') public projectModulesService: any,
    private ngModuleRef: NgModuleRef<any>,
    private vcr: ViewContainerRef,
    private workflowService: WorkFlowService, private compiler: Compiler
  ) {
    super();
    this.injector = this.vcr.injector;
    var variable: any;
    variable = moment;

    this.isSelected = [];
    this.isSelectedMembers = [];
    this.isPermissionForViewUserStories=true;
    this.clearAssigneeForm();
    this.clearEstimatedTimeForm();
    this.clearDeadlineDateForm();
    this.clearStatusForm();
    this.clearUserStoryTypeForm();
    this.clearSortByOptionsForm();
    this.route.params.subscribe((params) => {
      this.tab = params["tab"];
      if (this.router.url.toString().includes("goal")) {
        this.tab = "xde";
      }
    });

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryActionTypes.CreateMultipleUserStoriesCompleted),
        tap(() => {
          this.userCheckedAll = false;
          this.showHeader = false;
          if (this.isAssigneeDialog) {
            this.closeAssigneeDialog();
          } else if (this.isEstimatedTimeDialog) {
            this.closeEstimatedTimeDialog();
          } else if (this.isUserStoryStatusDialog) {
            this.closeUserStoryStatusDialog();
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryActionTypes.AmendUserStoriesDeadlineFailed),
        tap(() => {
          this.userCheckedAll = false;
          this.showHeader = false;
          this.closeDeadlineDateDialog();
        })
      )
      .subscribe();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActionTypes.ApproveGoalCompleted),
        tap(() => {
          if (this.goalUniqueDetailPage) {
            this.router.navigate([
              "projects/projectstatus",
              this.goal.projectId,
              "active-goals"
            ]);
          } else {
            this.store.dispatch(new ProjectSummaryTriggered(this.goal.projectId))
            this.router.navigate([
              "projects/projectstatus",
              this.projectId,
              "active-goals"
            ]);
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActionTypes.ReplanGoalCompleted),
        tap(() => {
          if (this.goalUniqueDetailPage) {
            this.router.navigate([
              "projects/projectstatus",
              this.goal.projectId,
              "replan-goals"
            ]);
          } else {
            this.store.dispatch(new ProjectSummaryTriggered(this.goal.projectId))
            this.router.navigate([
              "projects/projectstatus",
              this.projectId,
              "replan-goals"
            ]);
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(workFlowStatusActionTypes.LoadworkflowStatusCompleted),
        tap(() => {
          if (this.goal.workflowId && this.goal.goalId != '00000000-0000-0000-0000-000000000000') {
            this.workflowStatus$ = this.store.pipe(
              select(projectModuleReducer.getworkflowStatusAllByWorkflowId, { workflowId: this.goal.workflowId })
            );
            this.workflowStatus$
              .subscribe((s) => (this.workflowStatusList = s));
            if (this.workflowStatusList.length > 0) {
              this.workflowName = this.workflowStatusList[0].workflowName;
            }
          } else {
            this.workflowStatus$ = this.store.pipe(select(projectModuleReducer.getworkflowStatusAll))
            this.workflowStatus$
              .subscribe((s) => (this.workflowStatusList = s));
          }

        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryActionTypes.SearchUserStoriesComplete),
        tap(() => {
          this.userStories$ = this.store.pipe(
            select(projectModuleReducer.getAllUserStories))
          this.userStories$.subscribe((x => this.userStories = x));
          if (this.userStories.length > 0) {
            var userStories = this.userStories;
            this.userStoryCount = this.userStories[0].totalCount;
            this.unAssignedUser = userStories.filter(item => (item.ownerUserId == null || item.ownerUserId == '')).length;
            userStories.forEach((userStory) => {
              var subUserStories = userStory.subUserStoriesList;
              if (subUserStories && subUserStories.length > 0) {
                subUserStories = subUserStories.filter(function (userStory) {
                  return userStory.ownerUserId == null
                })
                if (subUserStories.length > 0) {
                  this.unAssignedUser = subUserStories.length;
                }
              }
            })
          } else {
            this.userStoryCount = 0;
            this.unAssignedUser = 0;
          }
          this.cdRef.detectChanges();
        })
      )
      .subscribe();

      this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryActionTypes.RefreshMultipleUserStoriesList),
        tap(() => {
          this.userStories$ = this.store.pipe(
            select(projectModuleReducer.getAllUserStories))
          this.userStories$.subscribe((x => this.userStories = x));
          if (this.userStories.length > 0) {
            var userStories = this.userStories;
            this.userStoryCount = this.userStories[0].totalCount;
            this.unAssignedUser = userStories.filter(item => (item.ownerUserId == null || item.ownerUserId == '')).length;
            userStories.forEach((userStory) => {
              var subUserStories = userStory.subUserStoriesList;
              if (subUserStories && subUserStories.length > 0) {
                subUserStories = subUserStories.filter(function (userStory) {
                  return userStory.ownerUserId == null
                })
                if (subUserStories.length > 0) {
                  this.unAssignedUser = subUserStories.length;
                }
              }
            })
          } else {
            this.userStoryCount = 0;
            this.unAssignedUser = 0;
          }
          this.cdRef.detectChanges();
        })
      )
      .subscribe();



    this.projectResponsiblePersons$ = this.store.pipe(
      select(projectModuleReducer.getUsersAll),
      tap((user) => {
        this.UsersList = user;
      })
    );
  }

  ngOnInit() {
    // //TODO: Commented the code as being triggered before the need.
    this.getSoftLabels();
    this.getCompanySettings();
    super.ngOnInit();
    this.searchUserStoryTypes();
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.isPermissionForGoalLevelReports = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_GoalLevelReports.toString().toLowerCase(); }) != null;
    this.canAccessWorkflow = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_WorkflowManagement.toString().toLowerCase(); }) != null;

    this.goalReplanModel$ = this.store.pipe(
      select(projectModuleReducer.getGoalReplanTypesAll)
    );
    this.accessDragApps$ = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_DragApps.toString().toLowerCase(); }) != null;
    this.accessUploadIcons$ = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_WorkItemUpload.toString().toLowerCase(); }) != null;
    this.project$ = this.store.select(projectModuleReducer.EditProjectById);

    this.sprintCreationInProgress$ = this.store.pipe(
      select(projectModuleReducer.upsertSprintsLoading)
    );

    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.createUserStoryLoading)
    );
    this.goalCreationInProgress$ = this.store.pipe(
      select(projectModuleReducer.createGoalLoading)
    );
    this.accessPublishBoard$ = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_PublishAsDefault.toString().toLowerCase(); }) != null;

    this.amendDeadlineDateIsInProgress$ = this.store.pipe(
      select(projectModuleReducer.anyOperationInProgress)
    );
    this.bugPriorities$ = this.store.pipe(
      select(projectModuleReducer.getBugPriorityAll),
      tap((priority) => {
        this.bugPriorities = priority;
      })
    );

    this.userStoryStatus$ = this.store.pipe(
      select(projectModuleReducer.getUserStoryStatusAll),
      tap((userStoryStatus) => {
        this.userStoryStatusList = userStoryStatus;
      })
    );

    this.userStoryTypes$ = this.store.pipe(select(projectModuleReducer.getUserStoryTypesAll),
      tap((types) => {
        this.userStoryTypes = types;
      })
    );

    this.userStories$ = this.store.pipe(
      select(projectModuleReducer.getAllUserStories),
      tap((userStories) => {
        this.userStories = userStories;
        if (this.userStories.length > 0) {
          this.userStoryCount = this.userStories[0].totalCount;
          this.unAssignedUser = userStories.filter(item => (item.ownerUserId == null || item.ownerUserId == '')).length;
          userStories.forEach((userStory) => {
            var subUserStories = userStory.subUserStoriesList;
            if (subUserStories && subUserStories.length > 0) {
              subUserStories = subUserStories.filter(function (userStory) {
                return userStory.ownerUserId == null
              })
              if (subUserStories.length > 0) {
                this.unAssignedUser = subUserStories.length;
              }
            }
          })
        } else {
          this.userStoryCount = 0;
          this.unAssignedUser = 0;
        }
      }));

    this.projectMembers$ = this.store.pipe(
      select(projectModuleReducer.getProjectMembersAll),
      tap((members) => {
        this.projectMembers = members;
      })
    );
    if (window.matchMedia("(max-width: 1440px)").matches) {
      this.isFiltersShow = true;
    }
  }

  getCompanySettings() {
    let companySettingsModel: any[] = [];
    companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
    if (companySettingsModel && companySettingsModel.length > 0) {
      let sprintResult = companySettingsModel.filter(item => item.key.trim() == "EnableSprints");
      if (sprintResult.length > 0) {
        this.isEnableSprints = sprintResult[0].value == "1" ? true : false;
        this.cdRef.detectChanges();
      }
    }
  }

  emitAppView() {
    this.listView = !this.listView
    this.emitAppListView.emit(this.listView);
  }

  searchUserStoryTypes() {
    const userStoryTypesModel = new UserStoryTypesModel();
    userStoryTypesModel.isArchived = false;
    this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel))
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    if (this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
      this.goalLabel = this.softLabels[0].goalLabel;
      this.workItemLabel = this.softLabels[0].userStoryLabel;
      this.cdRef.markForCheck();
    }
  }

  setBulkUpdatePermissions() {
    if (this.goal.goalStatusId === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
      this.isActiveGoalStatusId = true;
      this.showApproveIcon = false;
      this.showReplanDropdown = false;
      this.showEstimatedTime = false;
      this.showStatusDropdown = true;
      this.ArchivedGoalUserStory = false;
      this.ParkedGoalUserStory = false;
      this.showFirst = true;
      this.isActiveGoalsTabEnabled = true;
      this.isReportsTab = true;
    } else if (this.goal.goalStatusId === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
      this.isBacklogGoalStatusId = true;
      this.showApproveIcon = true;
      this.showFirst = false;
      this.showReplanDropdown = false;
      this.showEstimatedTime = true;
      this.showStatusDropdown = false;
      this.ArchivedGoalUserStory = false;
      this.ParkedGoalUserStory = false;
      this.isActiveGoalsTabEnabled = true;
      this.isReportsTab = false;
    } else if (this.goal.goalStatusId === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
      this.isReplanGoalStatusId = true;
      this.showReplanDropdown = true;
      this.showApproveIcon = true;
      this.showEstimatedTime = false;
      this.showStatusDropdown = false;
      this.ArchivedGoalUserStory = false;
      this.ParkedGoalUserStory = false;
      this.isActiveGoalsTabEnabled = true;
      this.isReportsTab = true;
      this.store.dispatch(new LoadGoalReplanActionsTriggered());
    } else {
      this.isActiveGoalStatusId = false;
      this.isBacklogGoalStatusId = false;
      this.isReplanGoalStatusId = false;
      this.isReportsTab = false;
    }
  }

  closeMenuPopover() {
    this.threeDotsPopOver.close();
  }

  downloadTasks() {
    this.downloadInProgress = true;
    var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
    if (this.goal.goalId == "00000000-0000-0000-0000-000000000000") {
      userStorySearchCriteria = this.userStorySearchCriteriaModel;
      userStorySearchCriteria.pageSize = 500;
      userStorySearchCriteria.pageNumber = 1;
      userStorySearchCriteria.goalId == "00000000-0000-0000-0000-000000000000";
     
    } else {
      userStorySearchCriteria.goalId = this.goal.goalId;
      userStorySearchCriteria.isUserStoryArchived = false;
      userStorySearchCriteria.isUserStoryParked = false;
      
    }
    userStorySearchCriteria.excelColumnList = this.getExcelColumnList();
    this.ProjectGoalsService.DownloadUserStories(userStorySearchCriteria).subscribe((responseData: any) => {
      if (responseData.success == true) {
        let filePath = responseData.data;
        if (filePath.blobUrl) {
          const parts = filePath.blobUrl.split(".");
          const fileExtension = parts.pop();

          if (fileExtension == 'pdf') {
          } else {
            const downloadLink = document.createElement("a");
            downloadLink.href = filePath.blobUrl;
            downloadLink.download = filePath.fileName
            downloadLink.click();
          }
        }
      } else {
        this.toastr.warning("", responseData.apiResponseMessages[0].message);
      }
      this.downloadInProgress = false;
      this.closeMenuPopover();
    });
  }

  LoadProjectFeature() {
    const projectFeature = new ProjectFeature();
    projectFeature.projectId = this.projectId;
    projectFeature.IsDelete = false;
    this.store.dispatch(new LoadFeatureProjectsTriggered(projectFeature));
    this.projectFeature$ = this.store.pipe(
      select(projectModuleReducer.getProjectFeaturesAll),
      // tslint:disable-next-line: no-shadowed-variable
      tap((projectFeature) => {
        this.projectFeatures = projectFeature;
      })
    );
  }

  clearAssigneeForm() {
    this.selectedMember = null;
    this.AssigneeForm = new FormGroup({
      ownerUserId: new FormControl("", [])
    });
  }

  clearEstimatedTimeForm() {
    this.estimatedTime = null;
    this.clearFormValue = true;
    this.EstimatedTimeForm = new FormGroup({
      EstimatedTime: new FormControl("", [])
    });
  }

  clearDeadlineDateForm() {
    this.deadLineDateForm = new FormGroup({
      amendedDaysCount: new FormControl("", Validators.compose([
        Validators.required
      ])
      )
    });
  }

  clearSortByOptionsForm() {
    this.selectSortByForm = new FormGroup({
      sortByOption: new FormControl("", [])
    });
  }

  clearEstimatedTime() {
    this.clearFormValue = false;
  }

  clearStatusForm() {
    this.StatusTransitionForm = new FormGroup({
      userStoryStatusId: new FormControl("", [])
    });
  }

  clearUserStoryTypeForm() {
    this.selectUserStoryTypeForm = new FormGroup({
      userStoryTypeId: new FormControl("", [])
    });
  }

  closeEstimatedTimeForm() {
    this.closeEstimatedTimePopUp.close();
    this.clearEstimatedTimeForm();
  }

  onClickFromSuperagile(layout) {
    if (this.goal.goalId !== "00000000-0000-0000-0000-000000000000") {
      this.selectedItem = layout;
      this.isSelectedMembers = [];
      this.isReportsPage = false;
      this.isCalenderView = false;
      this.isEmployeeTaskBoardPage = false;
      this.isDocument = false;
      this.workspaceFilterModel.isCalenderView = this.isCalenderView;
      this.workspaceFilterModel.isEmployeeTaskBoardPage = this.isEmployeeTaskBoardPage;
      this.workspaceFilterModel.isReportsPage = this.isReportsPage;
      this.workspaceFilterModel.isTheBoardLayoutKanban = this.isTheBoardLayoutKanban;
      this.workspaceFilterModel.selectedItem = this.selectedItem;
      this.workspaceFilterModel.isDocumentsView = this.isDocument;
      this.updateBoardTypesFilter();
      this.cdRef.detectChanges();
      this.eventClicked.emit(this.selectedItem);
    }
  }

  SetReplanOption() {
    this.checkReplan = true;
  }

  setColorForBugPriorityTypes(color) {
    const styles = {
      color
    };
    return styles;
  }

  getAssigneeValue(selectedEvent) {
    const projectMembers = this.projectMembers;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.find(projectMembers, function (member) {
      return member.projectMember.id === selectedEvent;
    })
    if (filteredList) {
      this.selectedMember = filteredList.projectMember.name;
    }
  }

  searchUserStories() {
    this.searchUserStoriesBasedOnUserStoryName.emit(this.searchText);
  }

  searchUserStoriesWithGoalName() {
    this.searchUserStoriesBasedOnGoalName.emit(this.searchTextWithGoalName);
  }

  versionNamesearchUserStories() {
    this.searchUserStoriesBasedOnVersionName.emit(this.versionNamesearchText);
  }

  searchTagsForUserStories() {
    this.searchUserStoriesBasedOnTags.emit(this.searchTags);
  }

  getUserStoriesOrderBy() {
    this.orderByOption = this.selectSortByForm.get("sortByOption").value;
    this.selectedSortByOption.emit(this.orderByOption);
  }

  toggleUsers() {
    this.showUsersList = !this.showUsersList;
  }

  clickEvent(event) {
    this.divActivate = !this.divActivate;
    this.toggleUsers();
  }

  closeSearch() {
    this.searchText = "";
    this.searchUserStories();
  }

  closeSearchText() {
    this.searchTextWithGoalName = "";
    this.searchUserStoriesWithGoalName();
  }

  closeUserStoryTags() {
    this.searchTags = "";
    this.searchTagsForUserStories();
  }

  closeVersionNameSearch() {
    this.versionNamesearchText = "";
    this.versionNamesearchUserStories();
  }

  toggleAllBugPrioritySelection() {
    if (this.allSelected.selected) {
      this.selectBugPriority.controls.bugPriority.patchValue([
        ...this.bugPriorities.map((item) => item.bugPriorityId),
        0
      ]);
    } else {
      this.selectBugPriority.controls.bugPriority.patchValue([]);
    }
    this.getUserStorieslistByBugPriorities();
  }

  toggleAllBugPrioritySelection1() {
    if (this.allSelected1.selected) {
      this.selectBugPriority.controls.bugPriority.patchValue([
        ...this.bugPriorities.map((item) => item.bugPriorityId),
        0
      ]);
    } else {
      this.selectBugPriority.controls.bugPriority.patchValue([]);
    }
    this.getUserStorieslistByBugPriorities();
  }

  toggleAllUserStoryTypesSelection() {
    if (this.allUserStoryTypesSelected.selected) {
      this.selectUserStoryTypeForm.controls.userStoryTypeId.patchValue([
        ...this.userStoryTypes.map((item) => item.userStoryTypeId),
        0
      ]);
    } else {
      this.selectUserStoryTypeForm.controls.userStoryTypeId.patchValue([]);
    }
    this.getUserStorieslistByUserStoryTypes();
  }

  toggleAllUserStoryTypesSelection1() {
    if (this.allUserStoryTypesSelected1.selected) {
      this.selectUserStoryTypeForm.controls.userStoryTypeId.patchValue([
        ...this.userStoryTypes.map((item) => item.userStoryTypeId),
        0
      ]);
    } else {
      this.selectUserStoryTypeForm.controls.userStoryTypeId.patchValue([]);
    }
    this.getUserStorieslistByUserStoryTypes();
  }

  toggleAllUserStoryStatusSelection() {
    if (this.allUserStoryStatusSelected.selected) {
      if (this.goal.goalId == '00000000-0000-0000-0000-000000000000') {
        this.selectUserStoryStatus.controls.userStoryStatus.patchValue([
          ...this.userStoryStatusList.map((item) => item.userStoryStatusId),
          0
        ]);
      } else {
        this.selectUserStoryStatus.controls.userStoryStatus.patchValue([
          ...this.workflowStatusList.map((item) => item.userStoryStatusId),
          0
        ]);
      }

    } else {
      this.selectUserStoryStatus.controls.userStoryStatus.patchValue([]);
    }
    this.getUserStorieslistByUserStoryStatus();
  }

  toggleAllUserStoryStatusSelection1() {
    if (this.allUserStoryStatusSelected1.selected) {
      if (this.goal.goalId == '00000000-0000-0000-0000-000000000000') {
        this.selectUserStoryStatus.controls.userStoryStatus.patchValue([
          ...this.userStoryStatusList.map((item) => item.userStoryStatusId),
          0
        ]);
      } else {
        this.selectUserStoryStatus.controls.userStoryStatus.patchValue([
          ...this.workflowStatusList.map((item) => item.userStoryStatusId),
          0
        ]);
      }

    } else {
      this.selectUserStoryStatus.controls.userStoryStatus.patchValue([]);
    }
    this.getUserStorieslistByUserStoryStatus();
  }

  clearUserStoryFilters() {
    this.searchText = null;
    this.searchTags = null;
    this.versionNamesearchText = null;
    this.selectUserStoryStatus.reset();
    this.selectBugPriority.reset();
    this.selectSortByForm.reset();
    this.selectComponent.reset();
    this.selectUserStoryTypeForm.reset();
    this.ownerUserId = "";
    this.selectedAssigneelist = [];
    this.selectedBugPriority = null;
    this.selectedProjectFeature = null;
    this.selectedUserStoryStatusId = null;
    this.selectedUserStoryType = null;
    this.selectedUserStoryTypeIds = null;
    this.searchTextWithGoalName = null;
    this.searchUserStories();
    this.searchTagsForUserStories();
    this.versionNamesearchUserStories();
    this.isSelected = [];
    this.isSelectedMembers = [];
    this.selectedAssigneelist = [];
    this.userNames = null;
    this.selectedProjectMember = true;
    this.selectedUserStoryStatus.emit("");
    this.selectedComponent.emit("");
    this.selectedSortByOption.emit("");
    this.selectedBugPriorityIds.emit("");
    this.selectedUserStoryTypeList.emit("");
    this.searchUserStoriesBasedOnGoalName.emit("");
    this.selectedOwnerUserId.emit(this.ownerUserId);
    this.orderByOption = null;
    this.selectedSortByOption.emit("");
    this.selectedWorkflowStatus = null;
    this.userNames = null;
    this.isUnassigned = null;
  }

  closeAssigneeDropdown() {
    this.showUsersList = false;
  }

  onClick(event) {
    if (!this._el.nativeElement.contains(event.target)) { // similar checks
      this.closeAssigneeDropdown();
    }
    // this.isSelected = [];
  }

  public LockGoal() {
    this.isLocked = false;
    this.isApproved = null;
    this.saveGoal();
    const goalLabel = this.softLabelPipe.transform("Goal", this.softLabels);
    this.googleAnalyticsService.eventEmitter(goalLabel, "Replanned " + goalLabel + "", this.goal.goalName, 1);
  }

  public ApproveGoal() {
    this.isLocked = null;
    if (this.isListView) {
      if (this.userStoryCount > 0) {
        this.isApproved = true;
        this.saveGoal();
        const goalLabel = this.softLabelPipe.transform("Goal", this.softLabels);
        this.googleAnalyticsService.eventEmitter(goalLabel, "Approved " + goalLabel + "", this.goal.goalName, 1);
      } else {
        this.toastr.error("", this.translateService.instant(ConstantVariables.UserStoriesCountForGoalApproval));
      }
    } else {
      this.isApproved = true;
      this.saveGoal();
    }
  }

  SaveGoalReplan(replanId) {
    this.dialog.closeAll();
    this.selectedReplanId = replanId;
    this.goalReplanId.emit(replanId);
    const goalReplan = new GoalReplan();
    goalReplan.goalId = this.goal.goalId;
    goalReplan.goalReplanTypeId = replanId;
    this.store.dispatch(new InsertGoalReplanTriggered(goalReplan));
  }

  saveGoal() {
    this.updatedGoal$ = this.store.pipe(select(projectModuleReducer.getGoalDetailsByGoalId, { goalId: this.goal.goalId }));
    let goalsList: GoalModel[];
    this.updatedGoal$.subscribe((x) => goalsList = x);
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
    goalmodel.isArchived = null;
    goalmodel.version = this.goal.version;
    goalmodel.isParked = null;
    goalmodel.goalResponsibleUserId = this.goal.goalResponsibleUserId;
    goalmodel.testSuiteId = this.goal.testSuiteId;
    goalmodel.isLocked = this.isLocked;
    goalmodel.isApproved = this.isApproved;
    goalmodel.timeStamp = goalsList[0].timeStamp;
    goalmodel.description = this.goal.description;
    goalmodel.goalLabel = this.goalLabel;
    goalmodel.goalEstimateTime = this.goal.goalEstimateTime;
    goalmodel.endDate = this.goal.endDate;
    this.goalModel = goalmodel;
    this.store.dispatch(new CreateGoalTriggered(goalmodel));
  }

  CheckAllUserStories(checked) {
    this.selectedUserStoriesAll.emit(checked);
  }

  UpdateAssigneeForMultipleUserStories() {
    this.isAssigneeDialog = true;
    this.isEstimatedTimeDialog = false;
    this.isUserStoryStatusDialog = false;
    this.isDeadlineDateDialog = false;
    let userStoryModel = new UserStory();
    userStoryModel = this.AssigneeForm.value;
    userStoryModel.goalId = this.goal.goalId;
    this.saveMultipleUserStories.emit(userStoryModel);
  }

  UpdateDeadlineDateForMultipleUserStories() {
    let userStoryModel = new UserStory();
    userStoryModel = this.deadLineDateForm.value;
    userStoryModel.goalId = this.goal.goalId;
    this.amendUserStoryDeadlineConfigurations.emit(userStoryModel);
  }

  changeEstimatedTime(estimatedTime) {
    if (estimatedTime == null || estimatedTime === "null") {
      this.disabled = true;
    } else {
      this.estimatedTime = estimatedTime;
      this.disabled = false;
    }
  }

  UpdateEstimatedTimeForMultipleUserStories(event) {
    console.log(event);
    this.isAssigneeDialog = false;
    this.isEstimatedTimeDialog = true;
    this.isUserStoryStatusDialog = false;
    this.isDeadlineDateDialog = false;
    let userStoryModel = new UserStory();
    userStoryModel = this.EstimatedTimeForm.value;
    userStoryModel.estimatedTime = Number(this.estimatedTime);
    userStoryModel.goalId = this.goal.goalId;
    this.saveMultipleUserStories.emit(userStoryModel);
  }

  UpdateStatusTransitionsForMultipleUserStories() {
    this.isAssigneeDialog = false;
    this.isEstimatedTimeDialog = false;
    this.isUserStoryStatusDialog = true;
    let userStoryModel = new UserStory();
    userStoryModel = this.StatusTransitionForm.value;
    userStoryModel.goalId = this.goal.goalId;
    this.saveTransitionForMultipleUserStories.emit(userStoryModel);
  }

  closeAssigneeDialog() {
    const popover = this.closeAssigneePopUp;
    if (popover) { popover.close(); }
  }

  closeEstimatedTimeDialog() {
    const popover = this.closeEstimatedTimePopUp;
    if (popover) { popover.close(); }
  }

  closeUserStoryStatusDialog() {
    const popover = this.closeUserStoryStatusPopUp;
    if (popover) { popover.close(); }
  }

  closeDeadlineDateDialog() {
    const popover = this.closeDeadlineDatePopUp;
    if (popover) { popover.close(); }
  }

  GetAssigne(userId, isChecked, selectedIndex, userName) {
    if (isChecked) {
      this.selectedAssigneelist.push(userId);
      this.selectedNames.push(userName);
      this.isSelected[selectedIndex] = true;
    } else {
      const index = this.selectedAssigneelist.indexOf(userId);
      this.selectedAssigneelist.splice(index, 1);
      this.selectedNames.splice(index, 1);
      this.isSelected[selectedIndex] = false;
    }
    this.userNames = this.selectedNames.toString();
    this.ownerId = this.selectedAssigneelist.toString();
    this.selectedOwnerUserId.emit(this.ownerId);
  }

  getSelectedMember(userId, selectedIndex, userName) {
    const index = this.selectedAssigneelist.indexOf(userId);
    if (index > -1) {
      this.selectedAssigneelist.splice(index, 1);
      this.selectedNames.splice(index, 1);
      this.isSelectedMembers[selectedIndex] = false;
    } else {
      this.selectedAssigneelist.push(userId);
      this.selectedNames.push(userName);
      this.isSelectedMembers[selectedIndex] = true;
    }
    let isResult = this.selectedNames.filter((x) => x == "N/A");
    if (isResult.length > 0) {
      this.isUnassigned = true;
    } else {
      this.isUnassigned = false;
    }
    this.userNames = this.selectedNames.toString();
    this.ownerId = this.selectedAssigneelist.toString();
    this.selectedOwnerUserId.emit(this.ownerId);
  }

  getUserStorieslistByUser(userId) {
    if (userId === 0) {
      this.ownerId = null;
    } else {
      this.ownerId = userId;
    }
    this.selectedOwnerUserId.emit(this.ownerId);
  }

  getFilterUserStoriesList() {
    const userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteria.goalId = this.goal.goalId;
    userStorySearchCriteria.ownerUserId = this.ownerId;
    userStorySearchCriteria.bugPriorityIds = this.selectedBugPriorityId;
    userStorySearchCriteria.sortBy = this.selectSortByForm.get("sortByOption").value;
    userStorySearchCriteria.isUserStoryParked = false;
    userStorySearchCriteria.isUserStoryArchived = false;
    this.userStorySearchCriteria = userStorySearchCriteria;
    this.store.dispatch(
      new userStoryActions.SearchUserStories(this.userStorySearchCriteria)
    );
  }

  getUserStorieslistByBugPriorities() {
    const bugPriority = this.selectBugPriority.value.bugPriority;
    const index = bugPriority.indexOf(0);
    if (index > -1) {
      bugPriority.splice(index, 1);
    }

    this.selectedBugPriorityId = bugPriority.toString();
    const bugPriorities = this.bugPriorities;
    // tslint:disable-next-line: only-arrow-functions
    const bugPriorityList = _.filter(bugPriorities, function (priority) {
      return bugPriority.toString().includes(priority.bugPriorityId);
    })
    const bugPriorityNames = bugPriorityList.map((x) => x.description);
    this.selectedBugPriority = bugPriorityNames.toString();
    this.selectedBugPriorityIds.emit(this.selectedBugPriorityId);
  }

  getUserStorieslistByUserStoryTypes() {
    const selectedTypes = this.selectUserStoryTypeForm.value.userStoryTypeId;
    const index = selectedTypes.indexOf(0);
    if (index > -1) {
      selectedTypes.splice(index, 1);
    }

    this.selectedUserStoryTypeIds = selectedTypes.toString();
    const bugPriorities = this.userStoryTypes;
    // tslint:disable-next-line: only-arrow-functions
    const userStoryTypeList = _.filter(bugPriorities, function (priority) {
      return selectedTypes.toString().includes(priority.userStoryTypeId);
    })
    const bugPriorityNames = userStoryTypeList.map((x) => x.userStoryTypeName);
    this.selectedUserStoryType = bugPriorityNames.toString();
    this.selectedUserStoryTypeList.emit(this.selectedUserStoryTypeIds);
  }

  getUserStorieslistByUserStoryStatus() {
    const userStoryStatus = this.selectUserStoryStatus.value.userStoryStatus;
    const index = userStoryStatus.indexOf(0);
    let workflowStatusList = [];
    if (index > -1) {
      userStoryStatus.splice(index, 1);
    }

    this.selectedUserStoryStatusId = userStoryStatus.toString();
    if (this.goal.goalId == '00000000-0000-0000-0000-000000000000') {
      workflowStatusList = this.userStoryStatusList;
    } else {
      workflowStatusList = this.workflowStatusList;
    }
    // tslint:disable-next-line: only-arrow-functions
    const workflowStatus = _.filter(workflowStatusList, function (status) {
      return userStoryStatus.toString().includes(status.userStoryStatusId);
    })
    const workflowStatusNames = workflowStatus.map((x) => x.userStoryStatusName);
    this.selectedWorkflowStatus = workflowStatusNames.toString();
    this.selectedUserStoryStatus.emit(this.selectedUserStoryStatusId);
  }

  toggleUserStoryStatusPerOne(all) {
    if (this.allUserStoryStatusSelected.selected) {
      this.allUserStoryStatusSelected.deselect();
      return false;
    }
    if (this.goal.goalId == '00000000-0000-0000-0000-000000000000') {
      if (
        this.selectUserStoryStatus.controls.userStoryStatus.value.length ===
        this.userStoryStatusList.length
      ) {
        this.allUserStoryStatusSelected.select();
      }
    } else {
      if (
        this.selectUserStoryStatus.controls.userStoryStatus.value.length ===
        this.workflowStatusList.length
      ) {
        this.allUserStoryStatusSelected.select();
      }
    }

  }

  toggleUserStoryStatusOnMediaPerOne() {
    if (this.allUserStoryStatusSelected1.selected) {
      this.allUserStoryStatusSelected1.deselect();
      return false;
    }
    if (this.goal.goalId == '00000000-0000-0000-0000-000000000000') {
      if (
        this.selectUserStoryStatus.controls.userStoryStatus.value.length ===
        this.userStoryStatusList.length
      ) {
        this.allUserStoryStatusSelected1.select();
      }
    } else {
      if (
        this.selectUserStoryStatus.controls.userStoryStatus.value.length ===
        this.workflowStatusList.length
      ) {
        this.allUserStoryStatusSelected1.select();
      }
    }

  }

  getUserStorieslistByStatus() {
    const userStoryStatus = this.selectUserStoryStatus.value.userStoryStatus;
    const index = userStoryStatus.indexOf(0);
    if (index > -1) {
      userStoryStatus.splice(index, 1);
    }

    this.selectedUserStoryStatusId = userStoryStatus.toString();
    const workflowStatusList = this.userStoryStatusList;
    // tslint:disable-next-line: only-arrow-functions
    const workflowStatus = _.filter(workflowStatusList, function (status) {
      return userStoryStatus.toString().includes(status.userStoryStatusId);
    })
    const workflowStatusNames = workflowStatus.map((x) => x.userStoryStatusName);
    this.selectedWorkflowStatus = workflowStatusNames.toString();
    this.selectedUserStoryStatus.emit(this.selectedUserStoryStatusId);
  }

  toggleBugPrioritySelectionPerOne(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (
      this.selectBugPriority.controls.bugPriority.value.length ===
      this.bugPriorities.length
    ) {
      this.allSelected.select();
    }
  }

  toggleUsrStoryTypesSelectionPerOne(all) {
    if (this.allUserStoryTypesSelected.selected) {
      this.allUserStoryTypesSelected.deselect();
      return false;
    }
    if (
      this.selectUserStoryTypeForm.controls.userStoryTypeId.value.length ===
      this.userStoryTypes.length
    ) {
      this.allUserStoryTypesSelected.select();
    }
  }

  toggleUsrStoryTypesSelectionPerOne1(all) {
    if (this.allUserStoryTypesSelected1.selected) {
      this.allUserStoryTypesSelected1.deselect();
      return false;
    }
    if (
      this.selectUserStoryTypeForm.controls.userStoryTypeId.value.length ===
      this.userStoryTypes.length
    ) {
      this.allUserStoryTypesSelected1.select();
    }
  }

  toggleBugPrioritySelectionOnMediaPerOne(all) {
    if (this.allSelected1.selected) {
      this.allSelected1.deselect();
      return false;
    }
    if (
      this.selectBugPriority.controls.bugPriority.value.length ===
      this.bugPriorities.length
    ) {
      this.allSelected1.select();
    }
  }

  toggleAllProjectFeaturesSelection() {
    if (this.allProjectFeaturesSelected.selected) {
      this.selectComponent.controls.componentName.patchValue([
        ...this.projectFeatures.map((item) => item.projectFeatureId),
        0
      ]);
    } else {
      this.selectComponent.controls.componentName.patchValue([]);
    }
    this.getFilterUserStoriesListByComponent();
  }

  toggleAllProjectFeaturesSelection1() {
    if (this.allProjectFeaturesSelectedOption.selected) {
      this.selectComponent.controls.componentName.patchValue([
        ...this.projectFeatures.map((item) => item.projectFeatureId),
        0
      ]);
    } else {
      this.selectComponent.controls.componentName.patchValue([]);
    }
    this.getFilterUserStoriesListByComponent();
  }

  getFilterUserStoriesListByComponent() {
    const component = this.selectComponent.value.componentName;
    const index = component.indexOf(0);
    if (index > -1) {
      component.splice(index, 1);
    }

    this.selectedComponentId = component.toString();
    const projectFeatures = this.projectFeatures;
    // tslint:disable-next-line: only-arrow-functions
    const projectFeaturesList = _.filter(projectFeatures, function (feature) {
      return component.toString().includes(feature.projectFeatureId);
    })
    const projectFeatureNames = projectFeaturesList.map((x) => x.projectFeatureName);
    this.selectedProjectFeature = projectFeatureNames.toString();
    this.selectedComponent.emit(this.selectedComponentId);
  }

  toggleProjectFeaturesSelectionPerOne(all) {
    if (this.allProjectFeaturesSelected.selected) {
      this.allProjectFeaturesSelected.deselect();
      return false;
    }
    if (
      this.selectComponent.controls.componentName.value.length ===
      this.projectFeatures.length
    ) {
      this.allProjectFeaturesSelected.select();
    }
  }

  toggleProjectFeaturesSelectionOnMediaPerOne() {
    if (this.allProjectFeaturesSelectedOption.selected) {
      this.allProjectFeaturesSelectedOption.deselect();
      return false;
    }
    if (
      this.selectComponent.controls.componentName.value.length ===
      this.projectFeatures.length
    ) {
      this.allProjectFeaturesSelectedOption.select();
    }
  }

  checkPermissionForBulkUpdateEstimatedTime(isActivePermission, isBacklogPermissison) {
    if ((this.isActiveGoalStatusId && !isActivePermission) || (this.isBacklogGoalStatusId && !isBacklogPermissison)) {
      return false;
    } else {
      return true;
    }
  }

  checkPermissionForBulkUpdateDeadlineDate(isActivePermission, isBacklogPermissison, isReplanPermission) {
    if ((this.isActiveGoalStatusId && !isActivePermission) || (this.isBacklogGoalStatusId && !isBacklogPermissison) ||
      (this.isReplanGoalStatusId && !isReplanPermission)) {
      return false;
    } else {
      return true;
    }
  }

  checkPermissionsForAssignee(isActiveAssignee, isBacklogAssignee, isReplanAssignee) {
    if (this.isActiveGoalStatusId && !isActiveAssignee) {
      return false;
    } else if (this.isBacklogGoalStatusId && !isBacklogAssignee) {
      return false;
    } else if (this.isReplanGoalStatusId && !isReplanAssignee) {
      return false;
    } else {
      return true;
    }
  }

  checkVisibilityOfUserStoryStatusFilter() {
    if ((!this.goalUniqueDetailPage && !this.isReportsPage
      && this.tab !== "backlog-goals" && this.tab !== "replan-goals" && this.goal.goalId != '00000000-0000-0000-0000-000000000000')) {
      return true;
    } else if (this.goalUniqueDetailPage && this.isActiveGoalStatusId && this.goal.goalId != '00000000-0000-0000-0000-000000000000') {
      return true;
    } else {
      return false;
    }
  }
  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  // Reports

  hideFilters() {
    this.isReportsPage = true;
    this.isCalenderView = false;
    this.isEmployeeTaskBoardPage = false;
    this.cdRef.detectChanges();
  }

  getBurnDownCharts() {
    this.isTheBoardLayoutKanban = false;
    this.isReportsPage = true;
    this.isEmployeeTaskBoardPage = false;
    this.isCalenderView = false;
    this.selectedItem = false;
    this.isDocument = false;
    this.workspaceFilterModel.isCalenderView = this.isCalenderView;
    this.workspaceFilterModel.isEmployeeTaskBoardPage = this.isEmployeeTaskBoardPage;
    this.workspaceFilterModel.isReportsPage = this.isReportsPage;
    this.workspaceFilterModel.isTheBoardLayoutKanban = this.isTheBoardLayoutKanban;
    this.workspaceFilterModel.selectedItem = this.selectedItem;
    this.workspaceFilterModel.isDocumentsView = this.isDocument;
    this.updateBoardTypesFilter();
    this.cdRef.detectChanges();
    this.getChartDetails.emit("");
  }

  getDocuments() {
    this.isTheBoardLayoutKanban = false;
    this.isReportsPage = false;
    this.isEmployeeTaskBoardPage = false;
    this.isCalenderView = false;
    this.selectedItem = false;
    this.isDocument = true;
    this.workspaceFilterModel.isCalenderView = this.isCalenderView;
    this.workspaceFilterModel.isEmployeeTaskBoardPage = this.isEmployeeTaskBoardPage;
    this.workspaceFilterModel.isReportsPage = this.isReportsPage;
    this.workspaceFilterModel.isTheBoardLayoutKanban = this.isTheBoardLayoutKanban;
    this.workspaceFilterModel.selectedItem = this.selectedItem;
    this.workspaceFilterModel.isDocumentsView = this.isDocument;
    this.updateBoardTypesFilter();
    this.cdRef.detectChanges();
    this.getDocumentDetails.emit("");
  }

  goalCalanderView() {
    this.isTheBoardLayoutKanban = false;
    this.isReportsPage = false;
    this.isEmployeeTaskBoardPage = false;
    this.isCalenderView = true;
    this.selectedItem = false;
    this.isDocument = false;
    this.workspaceFilterModel.isCalenderView = this.isCalenderView;
    this.workspaceFilterModel.isEmployeeTaskBoardPage = this.isEmployeeTaskBoardPage;
    this.workspaceFilterModel.isReportsPage = this.isReportsPage;
    this.workspaceFilterModel.isTheBoardLayoutKanban = this.isTheBoardLayoutKanban;
    this.workspaceFilterModel.selectedItem = this.selectedItem;
    this.workspaceFilterModel.isDocumentsView = this.isDocument;
    this.updateBoardTypesFilter();
    this.cdRef.detectChanges();
    this.getCalanderView.emit("");
  }

  getEmployeeTaskBoard() {
    this.isTheBoardLayoutKanban = false;
    this.isReportsPage = false;
    this.isCalenderView = false;
    this.isEmployeeTaskBoardPage = true;
    this.selectedItem = false;
    this.isDocument = false;
    this.workspaceFilterModel.isCalenderView = this.isCalenderView;
    this.workspaceFilterModel.isEmployeeTaskBoardPage = this.isEmployeeTaskBoardPage;
    this.workspaceFilterModel.isReportsPage = this.isReportsPage;
    this.workspaceFilterModel.isTheBoardLayoutKanban = this.isTheBoardLayoutKanban;
    this.workspaceFilterModel.selectedItem = this.selectedItem;
    this.workspaceFilterModel.isDocumentsView = this.isDocument;
    this.updateBoardTypesFilter();
    this.cdRef.detectChanges();
    this.getGoalEmployeeTaskBoard.emit("");
  }

  applyHighlightedTheme() {
    if (this.isCalenderView) {
      return "highlight-calender"
    }
  }

  applyHighlightedThemeForDocuments() {
    if (this.isDocument && !this.isCalenderView && !this.isReportsPage) {
      return "highlight-calender"
    }
  }

  applyThemeForReports() {
    if (this.isReportsPage && !this.isCalenderView && !this.isDocument) {
      return "highlight-calender"
    }
  }

  applyHighlightedThemeForEmployeeTaskBoard() {
    if (this.isEmployeeTaskBoardPage && !this.isReportsPage && !this.isCalenderView && !this.isDocument) {
      return "highlight-calender"
    }
  }

  checkPermissionsForReports() {
    if (this.isReportsTab && !this.goalUniqueDetailPage) {
      if (this.isAllGoalsPage && this.isPermissionForCanAccessGoalLevelReports) {
        return true;
      } else if (this.isPermissionForGoalLevelReports && !this.isAllGoalsPage) {
        return true;
      } else {
        return false;
      }
    } else if (this.isReportsTab && this.goalUniqueDetailPage) {
      if (this.isPermissionForCanAccessGoalLevelReports) {
        return true;
      } else {
        return false;
      }
    }

  }

  setEnableRolePermissions(projectId) {
    let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
    if (entityRolefeatures) {
      this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
        return role.projectId == projectId
      })
      const entityTypeFeatureForGoalReports = EntityTypeFeatureIds.EntityTypeFeature_CanAccessGoalLevelReports.toString().toLowerCase();
      let featurePermissions = [];
      featurePermissions = this.entityRolePermisisons;
      // tslint:disable-next-line: only-arrow-functions
      const viewGoalLevelPermisisonsList = _.filter(featurePermissions, function (permission) {
        return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForGoalReports)
      })
      if (viewGoalLevelPermisisonsList.length > 0) {
        this.isPermissionForCanAccessGoalLevelReports = true;
      } else {
        this.isPermissionForCanAccessGoalLevelReports = false;
      }
      const entityTypeFeatureForViewUserStories = EntityTypeFeatureIds.EntityTypeFeature_ViewWorkItem.toString().toLowerCase();
      // tslint:disable-next-line: only-arrow-functions
      const viewUserStoriesPermisisonsList = _.filter(featurePermissions, function (permission) {
        return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForViewUserStories)
      })
      if (viewUserStoriesPermisisonsList.length > 0) {
        this.isPermissionForViewUserStories = true;
      } else {
        this.isPermissionForViewUserStories = false;
      }
    }
  }

  checkGoalPermissions() {
    if (this.goal.goalStatusId === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
      this.showApproveIcon = false;
      this.showReplanDropdown = false;
      this.showEstimatedTime = true;
      this.showStatusDropdown = true;
      this.showDeadlineDate = false;
      this.showFirst = true;
      this.isActiveGoalsTabEnabled = true;
    } else if (this.goal.goalStatusId === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
      this.showReplanDropdown = true;
      this.showApproveIcon = true;
      this.showEstimatedTime = false;
      this.showDeadlineDate = false;
      this.showStatusDropdown = false;
      this.isActiveGoalsTabEnabled = true;
      this.store.dispatch(new LoadGoalReplanActionsTriggered());
    } else if (this.goal.goalStatusId === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
      this.showApproveIcon = true;
      this.showFirst = false;
      this.showReplanDropdown = false;
      this.showEstimatedTime = true;
      this.showDeadlineDate = true;
      this.showStatusDropdown = false;
      this.isActiveGoalsTabEnabled = true;
    }
  }

  deadlineDispaly() {
    let event;
    event = !event;
    this.isDeadlineDisplay = !this.isDeadlineDisplay;
    this.showDeadlineOnHover.emit(event);

  }

  showFilters() {
    this.isFiltersShow = !this.isFiltersShow;
  }

  @HostListener("window:resize", ["$event"])
  sizeChange(event) {
    if (window.matchMedia("(max-width: 1440px)").matches) {
      this.isFiltersShow = true;
    }
  }

  filter() {
    if (this.selectedWorkflowStatus || this.searchText || this.versionNamesearchText || this.searchTags || this.orderByOption || this.selectedProjectFeature || this.selectedBugPriority || this.selectedUserStoryType || this.userNames || this.searchTextWithGoalName) {
      return true;
    }
    else {
      return false;
    }
  }

  clearAssigneeFilter() {
    this.ownerUserId = "";
    this.selectedAssigneelist = [];
    this.isSelected = [];
    this.isSelectedMembers = [];
    this.selectedNames = [];
    this.userNames = null;
    this.isUnassigned = null;
    this.selectedOwnerUserId.emit(this.ownerUserId);
  }

  clearWorkFlowStatus() {
    this.selectedUserStoryStatusId = null;
    this.selectedWorkflowStatus = null;
    this.selectUserStoryStatus.reset();
    this.selectedUserStoryStatus.emit("");
  }

  clearOrderByoption() {
    this.orderByOption = null;
    this.selectSortByForm.reset();
    this.selectedSortByOption.emit(this.orderByOption);
  }

  clearProjectFeature() {
    this.selectedComponentId = null;
    this.selectedProjectFeature = null;
    this.selectComponent.reset();
    this.selectedComponent.emit(this.selectedComponentId);
  }

  clearSelectedBugPriority() {
    this.selectedBugPriority = null;
    this.selectBugPriority.reset();
    this.selectedBugPriorityId = null;
    this.selectedBugPriorityIds.emit(this.selectedBugPriorityId);
  }

  clearUserStoryType() {
    this.selectedUserStoryType = null;
    this.selectedUserStoryTypeIds = null;
    this.selectUserStoryTypeForm.reset();
    this.selectedUserStoryTypeList.emit(this.selectedUserStoryTypeIds);
  }

  saveAsDefaultDashboardPersistance() {
    this.saveAsDefaultPersistance.emit("");
    //this.filterthreeDotsPopOver.close();
  }

  resetToDefaultPersistance() {
    this.resetToDefaultDashboardPersistance.emit("");
    //this.filterthreeDotsPopOver.close();
  }

  refreshReportsDashboard() {
    this.refreshDashboard.emit("");
    // this.filterthreeDotsPopOver.close();
  }

  openReportAppsSettings() {
    this.openAppsSettings.emit(false);
    //this.filterthreeDotsPopOver.close();
  }

  changePaddingForGoal() {
    let styles;
    if (this.isBacklogIssues) {
      styles = {
        'padding': '0.46rem 0.5rem 2.2rem 0',
        'height': '20px',
      };
    }
    return styles;
  }

  createSprint() {
    var sprintModel = new SprintModel();
    sprintModel.projectId = this.goal.projectId;
    this.store.dispatch(new UpsertSprintsTriggered(sprintModel));
  }

  taskBoardViewChange() {
    this.taskBoardView = !this.taskBoardView;
    this.taskBoardViewToggle.emit(this.taskBoardView);
  }

  printTaskboardView() {
    this.taskBoardViewPrint.emit();
  }

  updateBoardTypesFilter() {
    this.updatePersistanceInprogress = true;
    let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
    workspaceDashboardFilterModel.workspaceDashboardId = this.goalId;
    workspaceDashboardFilterModel.workspaceDashboardFilterId = this.workspaceDashboardFilterId;
    workspaceDashboardFilterModel.filterJson = JSON.stringify(this.workspaceFilterModel);
    this.widgetService.updateworkspaceDashboardFilter(workspaceDashboardFilterModel)
      .subscribe((responseData: any) => {
        if (responseData.success) {
          this.workspaceDashboardFilterId = responseData.data;
          this.updatePersistanceInprogress = false;
          this.cdRef.detectChanges();
        } else {
          this.toastr.warning("", responseData.apiResponseMessages[0].message);
          this.updatePersistanceInprogress = false;
          this.cdRef.markForCheck();
        }
      });
  }

  // getBoardTypesFilter() {
  //   let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
  //   workspaceDashboardFilterModel.workspaceDashboardId = this.goalId;
  //   this.widgetService.getWorkspaceDashboardFilter(workspaceDashboardFilterModel)
  //     .subscribe((responseData: any) => {
  //       if (responseData.success) {
  //         if (responseData.data && responseData.data.length > 0) {
  //           let dashboardFilters = responseData.data[0];
  //           this.workspaceDashboardFilterId = dashboardFilters.workspaceDashboardFilterId;
  //           let filters = JSON.parse(dashboardFilters.filterJson);
  //           this.isCalenderView = filters.isCalenderView;
  //           this.isEmployeeTaskBoardPage = filters.isEmployeeTaskBoardPage;
  //           this.isReportsPage = filters.isReportsPage;
  //           this.isTheBoardLayoutKanban = filters.isTheBoardLayoutKanban;
  //           this.selectedItem = filters.selectedItem;
  //           if (this.isCalenderView) {
  //             this.getCalanderView.emit("");
  //           } else if (this.isEmployeeTaskBoardPage) {
  //             this.getGoalEmployeeTaskBoard.emit("");
  //           } else if (this.isReportsPage) {
  //             this.getChartDetails.emit("");
  //           } else if (filters.selectedItem != null) {
  //             this.eventClicked.emit(this.selectedItem);
  //           }
  //           this.cdRef.detectChanges();
  //         }
  //       }
  //     });
  // }
  checkBoardType() {
    if ((this.goal.goalStatusId === ConstantVariables.BacklogGoalStatusId.toLowerCase()) || (this.isBugFilters && this.goal.goalStatusId === ConstantVariables.ActiveGoalStatusId.toLowerCase())) {
      this.isShowTemplateIcons = true;
    } else {
      this.isShowTemplateIcons = false;
    }
  }

  downloadFile() {
    this.ProjectGoalsService.WorkItemUploadTemplate(false, this.isBugFilters).subscribe((response: any) => {
      var blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      FileSaver.saveAs(blob, "WorkItemUploadTemplate.xlsx");
    },
      function (error) {
        this.toastr.error("Template download failed.");
      });
  }

  uploadEventHandler(file, event) {

    if (file != null) {

      var reader = new FileReader();
      //var XLSX = require('xlsx');

      let allProjectMembers = this.projectMembers;
      let allUserStoryTypes = this.userStoryTypes;
      let allBugPriorityTypes = this.bugPriorities;
      let allProjectFeatures = this.projectFeatures;
      let isBugFilters = this.isBugFilters;
      let dialog = this.dialog;
      let goalId = this.goal.goalId
      let projectId = this.goal.projectId;
      let fileTemInput = this.fileInput;
      let store = this.store;
      reader.onload = function (e: any) {

        let uploadedData = [];
        var bstr = (e != undefined && e.target != undefined) ? e.target.result : "";
        var workBook = XLSX.read(bstr, { type: 'binary' });
        var shtData = workBook.Sheets[workBook.SheetNames[0]];
        var sheetData;
        if (isBugFilters) {
          sheetData = XLSX.utils.sheet_to_json(shtData, {
            header: ["WorkItem", "Assignee", "WorkItemType", "EstimatedTime", "Deadline", "BugPriority", "ProjectComponent", "BugCausedUser", "Version"], raw: false, defval: ''
          });
        } else {
          sheetData = XLSX.utils.sheet_to_json(shtData, {
            header: ["WorkItem", "Assignee", "WorkItemType", "EstimatedTime", "Deadline"], raw: false, defval: ''
          });
        }


        sheetData.forEach(function (item: any, index) {

          if (index > 0) {

            var isAssigneeValid, isValidDate, isItemTypeValid, isBugPriorityTypeValid, isProjectFeatureValid, isBugCausedUserValid;

            var errorMessage = [];
            var warningMessage = [];
            var isWorkitemValid = true;

            if (item.WorkItem.trim() == "") {
              errorMessage.push(" The Work item is required.");
              isWorkitemValid = false;
            }

            if (item.WorkItem.length > 800) {
              errorMessage.push("Work item name cannot exceed 800 characters");
              isWorkitemValid = false;
            }

            // Check for Assignee
            if (item.Assignee) {
              isAssigneeValid = _.find(allProjectMembers, function (member) {
                return member.projectMember.name.toLowerCase().trim().replace(/\s/g, '') == item.Assignee.toLowerCase().trim().replace(/\s/g, '')
              });
              if (isAssigneeValid == undefined) {
                warningMessage.push(" Given assignee is invalid.");
              }
            } else {
              warningMessage.push(" Assignee is not given.");
              isWorkitemValid = true;
            }

            if (item.WorkItemType.trim() == "") {
              errorMessage.push(" The Work item type is required.");
              isWorkitemValid = false;
            }
            else {
              // Check for work item type
              isItemTypeValid = _.find(allUserStoryTypes, function (itemtype) {
                return itemtype.userStoryTypeName.toLowerCase().trim().replace(/\s/g, '') == item.WorkItemType.toLowerCase().trim().replace(/\s/g, '')
              });
              if (isItemTypeValid == undefined) {
                errorMessage.push(" Given Work item type is invalid.");
                isWorkitemValid = false;
              }
            }

            // Check for bug priority
            if (item.BugPriority && isBugFilters) {
              isBugPriorityTypeValid = _.find(allBugPriorityTypes, function (itemtype) {
                return itemtype.priorityName.toLowerCase().trim().replace(/\s/g, '') == item.BugPriority.toLowerCase().trim().replace(/\s/g, '')
              });
              if (isBugPriorityTypeValid == undefined) {
                warningMessage.push(" Given bug priority is invalid.");

              }
            }
            // Check for project feature
            if (item.ProjectComponent && isBugFilters) {
              isProjectFeatureValid = _.find(allProjectFeatures, function (itemtype) {
                return itemtype.projectFeatureName.toLowerCase().trim().replace(/\s/g, '') == item.ProjectComponent.toLowerCase().trim().replace(/\s/g, '')
              });
              if (isProjectFeatureValid == undefined) {
                warningMessage.push(" Given project component is invalid.");

              }
            }

            // Check for bug caused user
            if (item.BugCausedUser && isBugFilters) {
              isBugCausedUserValid = _.find(allProjectMembers, function (member) {
                return member.projectMember.name.toLowerCase().trim().replace(/\s/g, '') == item.BugCausedUser.toLowerCase().trim().replace(/\s/g, '')
              });
              if (isBugCausedUserValid == undefined) {
                warningMessage.push(" Given bug caused user is invalid.");

              }
            }
            // Check for Version
            if (item.Version && item.Version.trim() && isBugFilters) {
            }

            if (isNaN(Number(item.EstimatedTime.trim()))) {
              warningMessage.push(" The estimated time is in wrong format.");
            }
            else
              item.EstimatedTime = Number(item.EstimatedTime.trim());


            // Deadline Check 
            if (item.Deadline.trim()) {
              item.Deadline = item.Deadline.trim();
              item.Deadline = new Date(item.Deadline);
              const moment_ = moment;

              isValidDate = moment_(item.Deadline, ["DD-M-YY", "DD.M.YY", "M-DD-YY", "MM-DD-YY", "M-DD-YYYY", "D.M.YYYY", "DD.MM.YYYY", "MM-DD-YYYY", "DD-MM-YYYY", "YYYY-MM-DD", "DD-MMMM-YYYY", "DD-MM-YY", "dddd-MMMM-DD-YYYY", "dddd-DD-MMMM-YYYY"]).format("YYYY-MM-DDT00:00:00");
              if (isValidDate.toLowerCase() == "invalid date" || isValidDate.match("01-01-0") || isValidDate.match("0000-01-01")) {
                errorMessage.push("Deadline is not in correct format.");
                isValidDate = '01-01-0000T00:00:00'
                item.Deadline = null;
              }
            } else {
              item.Deadline = null;
            }

            if (errorMessage.length > 0) {
              isWorkitemValid = false;
            } else {
              isWorkitemValid = true;
            }



            var workItemObj = {
              isWorkitemValid: isWorkitemValid,
              userStoryName: item.WorkItem.trim(),
              goalId: goalId,
              projectId: projectId,
              ownerUserId: isAssigneeValid != undefined ? isAssigneeValid.projectMember.id : "",
              userStoryTypeId: isItemTypeValid != undefined ? isItemTypeValid.userStoryTypeId : "",
              bugCausedUserId: isBugCausedUserValid != undefined ? isBugCausedUserValid.projectMember.id : "",
              projectFeatureId: isProjectFeatureValid != undefined ? isProjectFeatureValid.projectFeatureId : "",
              bugPriorityId: isBugPriorityTypeValid != undefined ? isBugPriorityTypeValid.bugPriorityId : "",
              ownerName: item.Assignee,
              userStoryType: item.WorkItemType,
              estimatedTime: item.EstimatedTime,
              deadLineDate: item.Deadline,
              bugPriority: item.BugPriority,
              projectComponent: item.ProjectComponent,
              bugCausedUser: item.BugCausedUser,
              versionName: item.Version,
              isActive: true,
              messages: errorMessage.join(', '),
              warningMessages: warningMessage.join(', '),
              RowNumber: item.__rowNum__
            }
            uploadedData.push(workItemObj);
          }
        });
        fileTemInput.nativeElement.value = "";
        const dialogRef = dialog.open(WorkItemUploadPopupComponent, {
          width: "90%",
          direction: 'ltr',
          data: { uploadedData, isBugFilters },
          disableClose: true
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result.success) {

          }
          store.dispatch(new GetGoalByIdTriggered(goalId))
        });
      };
      if (event.target != undefined)
        reader.readAsBinaryString(event.target.files[0]);
    }
  }

  getGoalWorkflow() {
    var loader = this.projectModulesService["modules"];
    var component = "Workflow management";
    var transitionComponent = "Workflow status transition component";
    var modules = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modules, function(module: any) { return module.modulePackageName == 'AdminPackageModule' });

    if (!module) {
      console.error("No module found for AdminPackageModule");
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
          elementInArray.name.toLowerCase() === component.toLowerCase()
        );
        this.workflowStatusComponent = {};
        this.workflowStatusComponent.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        this.workflowStatusComponent.inputs = {
          workflowId: this.goal.workflowId,
          isGoalsPage: true
        };
        this.workflowStatusComponent.outputs = {
          changeReorder: event => this.reOrderInProgress(event)

        }

        // var componentDetails = allComponentsInModule.find(elementInArray =>
        //   elementInArray.name.toLowerCase() === transitionComponent.toLowerCase()
        // );
        // this.workflowStatusTransitionComponent = {};
        // this.workflowStatusTransitionComponent.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        // this.workflowStatusTransitionComponent.inputs = {
        //   workflowId: this.workflowId,
        //   isGoalsPage: true,
        //   workFlowStatuses: this.workflowStatusList
        // };
        // this.workflowStatusTransitionComponent.outputs = {
        //   getStatusTransitionsList: event => this.getTransitionsList(event)

        // }
        this.cdRef.detectChanges();
      })
  }

  getTransitionsList(event) {
    this.workflowStatusTransitions = event;
    this.workflowStatusComponent.inputs.workFlowStatusTransitionTableDataDetails = this.workflowStatusTransitions;
    this.cdRef.detectChanges();
  }

  reOrderInProgress(event) {
    this.isReOrderInProgress = true;
    var workflowStatus = new WorkflowStatus();
    workflowStatus.workFlowId = this.goal.workflowId;
    this.workflowService.GetAllWorkFlowStatus(workflowStatus).subscribe((x: any) => {
      if (x.success) {
        this.workflowStatusComponentList = x.data;
        this.workflowStatusComponentList = this.workflowStatusComponentList.sort((a, b) => {
          return a.orderId - b.orderId
        });
        this.workflowStatusTransitionComponent.inputs.workFlowStatuses = this.workflowStatusComponentList;
        this.workflowStatusComponent.inputs.workFlowStatuses = this.workflowStatusComponentList;
        this.cdRef.detectChanges();
      }
    })
  }

  closeBugPopover() {
    this.workflowPopover.close();
    if (this.isReOrderInProgress) {
      this.isReOrderInProgress = false;
      this.store.dispatch(new LoadworkflowStatusCompleted(this.workflowStatusComponentList));
      const workflowTransitionTransitionFetchInput = new WorkFlowStatusTransitionTableData();
      workflowTransitionTransitionFetchInput.goalId = this.goal.goalId;
      this.store.dispatch(
        new LoadworkflowStatusTransitionTriggered(
          workflowTransitionTransitionFetchInput
        )
      );
    }
  }

  getExcelColumnList(){
    var returnList = [];
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Goal name', this.softLabels), ExcelField: "ProjectName"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Parent Unique Id', this.softLabels), ExcelField: "GoalName"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Unique Id', this.softLabels), ExcelField: "SprintName"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Work item type', this.softLabels), ExcelField: "UserStoryName"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Work item title', this.softLabels), ExcelField: "EstimatedTime"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Owner', this.softLabels), ExcelField: "SheetDeadLineDate"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Current status', this.softLabels), ExcelField: "SheetDeadLineDate"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Estimated Time', this.softLabels), ExcelField: "SheetDeadLineDate"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Spent so far', this.softLabels), ExcelField: "SheetDeadLineDate"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Created on date', this.softLabels), ExcelField: "SheetDeadLineDate"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Deadline date', this.softLabels), ExcelField: "SheetDeadLineDate"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Linked bugs count', this.softLabels), ExcelField: "SheetDeadLineDate"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Component', this.softLabels), ExcelField: "SheetDeadLineDate"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Version number', this.softLabels), ExcelField: "SheetDeadLineDate"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Bug priority', this.softLabels), ExcelField: "SheetDeadLineDate"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Dependency user', this.softLabels), ExcelField: "SheetDeadLineDate"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Bug caused user', this.softLabels), ExcelField: "SheetDeadLineDate"});
      returnList.push({ExcelColumn : this.softLabelPipe.transform('Project name', this.softLabels), ExcelField: "SheetDeadLineDate"});
      return returnList;
  }
  getSelectedHoverStyle(board){
    if(board==this.highLightMenu){
      return "background: aliceblue;"
    } 
    // else if(board=='kanban'&&this.isSuperagileBoard==false){
    //   return "background: aliceblue;"
    // } else if(board=='calendar'&&this.isCalenderView){
    //   return "background: aliceblue;"
    // } else if(board=='reports'&&this.isReportsPage){
    //   return "background: aliceblue;"
    // } else if(board=='documents'&&this.isDocument){
    //   return "background: aliceblue;"
    // } else if(board=='tasks'&&this.isEmployeeTaskBoardPage){
    //   return "background: aliceblue;"
    // } 
    else{
      return "background: white;"
    }
  }
}