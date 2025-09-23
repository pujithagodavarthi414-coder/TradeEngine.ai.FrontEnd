import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, ViewChildren, NgModuleRef, NgModuleFactoryLoader, NgModuleFactory, Type, ViewContainerRef, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
import * as _ from "underscore";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Store, select } from "@ngrx/store";
import { Subject, combineLatest, of, empty } from "rxjs";
import { tap, take, takeUntil, map } from "rxjs/operators";
import { ofType, Actions } from "@ngrx/effects";
import { MatDialog } from "@angular/material/dialog";
import { SatPopover } from "@ncstate/sat-popover";
import { TabStripComponent } from "@progress/kendo-angular-layout";

import { TranslateService } from "@ngx-translate/core";
import { BugPriorityDropDownData } from "../../models/bugPriorityDropDown";
import { GoalModel } from "../../models/GoalModel";
import { GoalSearchCriteriaInputModel } from "../../models/GoalSearchCriteriaInputModel";
import { ProjectFeature } from "../../models/projectFeature";
import { ProjectMember } from "../../models/projectMember";
import { UserStory } from "../../models/userStory";
import { UserStoryReplanModel } from "../../models/userStoryReplanModel";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { WorkflowStatus } from "../../models/workflowStatus";
import { ProjectGoalsService } from "../../services/goals.service";
import { LoadBugPriorityTypesTriggered } from "../../store/actions/bug-priority.action";
import { GoalActionTypes } from "../../store/actions/goal.actions";
import { LoadFeatureProjectsTriggered } from "../../store/actions/project-features.actions";
import { LoadMemberProjectsTriggered, ProjectMembersActionTypes } from "../../store/actions/project-members.actions";
import { ProjectSummaryTriggered } from "../../store/actions/project-summary.action";
import { LoadUserStoryTypesTriggered, UserStoryTypesActionTypes } from "../../store/actions/user-story-types.action";
import * as userStoryActions from "../../store/actions/userStory.actions";
import { GetUniqueUserStoryByIdTriggered } from "../../store/actions/userStory.actions";
import { LoadworkflowStatusTriggered, workFlowStatusActionTypes } from "../../store/actions/work-flow-status.action";
import * as projectModuleReducers from "../../store/reducers/index";
import { GetUniqueSprintWorkItemByIdTriggered, SprintWorkItemActionTypes, UpsertSprintWorkItemTriggered, InsertSprintWorkItemReplanTriggered, UpdateSprintSubTaskUserStoryTriggered, MoveGoalUserStoryToSprintTriggered, UpdateUserStorySprintTriggered, GetSprintWorkItemByIdTriggered } from "../../store/actions/sprint-userstories.action";

//for initializing component model
import { ComponentModel } from '@snovasys/snova-comments';
import { CookieService } from 'ngx-cookie-service';
import { SprintModel } from "../../models/sprints-model";
import { SprintService } from "../../services/sprints.service";
import cronstrue from 'cronstrue';
import { Validators, FormControl } from "@angular/forms";
import { State } from "../../store/reducers/index";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { LoadLinksCountByUserStoryIdTriggered, LoadCommentsCountTriggered, CommentsActionTypes, LoadBugsCountByUserStoryIdTriggered } from '../../store/actions/comments.actions';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { TestCaseDropdownList, TestSuiteSectionEditComponent } from '@snovasys/snova-testrepo';
import { CronOptions } from 'cron-editor';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { GoogleAnalyticsService } from '../../../globaldependencies/services/google-analytics.service';
import { FeatureIds } from '../../../globaldependencies/constants/feature-ids';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { LoadTestCaseSectionListTriggered } from "@snovasys/snova-testrepo";
import * as testRailmoduleReducers from "@snovasys/snova-testrepo";
import { TestCase } from '@snovasys/snova-testrepo';
import { CronExpressionModel, RecurringCronExpressionModel } from '../../models/cron-expression-model';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { CustomFormFieldModel } from '../../models/custom-fileds-model';
import { ProjectModulesService } from '../../services/project.modules.service';
import { ProjectSearchResult } from '../../models/ProjectSearchResult';
import { ProjectSearchCriteriaInputModel } from '../../models/ProjectSearchCriteriaInputModel';
import { ProjectService } from '../../services/projects.service';
import { DatePipe } from "@angular/common";
import * as moment_ from 'moment';
import { CustomFieldsComponent } from "@snovasys/snova-custom-fields";
const moment = moment_;
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };


const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
@Component({
  // tslint:disable-next-line:component-selector
  selector: "gc-userstory-detail",
  templateUrl: "userstory-detail.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStoryDetailComponent extends AppFeatureBaseComponent implements OnInit {
  @ViewChildren("addCronExpressionPopUp") addCronExpressionPopUp;
  testSuitSectionEdit: any = {};
  replanStartDate: Date;

  @Input("userStoryId")
  set _userStoryId(data: any) {
    if (data) {
      this.userStoryId = data.userStoryId;
      this.userStoryData = data;
      this.order = data.order;
      if (this.userStoryData.subUserStories) {
        this.subUserStoriesCount = this.userStoryData.subUserStoriesList.length;
      } else {
        this.subUserStoriesCount = 0;
      }

      this.customFields$ = empty();
      if (this.tabstrip) {
        Promise.resolve(null).then(() => this.tabstrip.selectTab(0));
      }
      if (this.userStoryData.isFromSprints) {
        this.store.dispatch(new GetUniqueSprintWorkItemByIdTriggered(this.userStoryId));
      } else {
        this.store.dispatch(new GetUniqueUserStoryByIdTriggered(this.userStoryId));
      }

      //Getting links Count
      this.store.dispatch(new LoadLinksCountByUserStoryIdTriggered(this.userStoryId, this.userStoryData.isFromSprint));

      // Getting userstory details
      this.store.dispatch(new LoadCommentsCountTriggered(this.userStoryId));
      this.componentModel.commentsCount = null;

      // Getting Comments Count
      this.loadBugsCount();
      this.searchProjects();
    }
  }

  goalReplanId;
  @Input("goalReplanId")
  set _goalReplanId(data: string) {
    this.goalReplanId = data;
  }

  selectedTab;
  @Input("selectedTab")
  set _selectedTab(data: string) {

    this.selectedTab = data;
    if (this.selectedTab === 'backlog-goals' || this.selectedTab === 'replan-goals' || this.selectedTab === 'archived-goals' || this.selectedTab === 'parked-goals') {
      this.isUserStoryStatus = true;
    }
    else {
      this.isUserStoryStatus = false;
    }
  }

  @Input("isSprintUserStories")
  set _isSprintUserStories(data: boolean) {
    this.isSprintUserStories = data;
    if (this.isSprintUserStories) {
      this.referenceTypeId = ConstantVariables.SprintUserStoryReferenceId;
      this.userStories$ = this.store.pipe(select(projectModuleReducers.getSprintWorkItemsAll));
      this.userStories$.subscribe((x) => this.userStories = x);
    } else {
      this.referenceTypeId = ConstantVariables.UserStoryReferenceTypeId;
      this.userStories$ = this.store.pipe(select(projectModuleReducers.getAllUserStories));
      this.userStories$.subscribe((x) => this.userStories = x);
    }
  }


  @Input() isUserStoriesPage: boolean;

  isAllGoalsPage;
  @Input('isAllGoalsPage')
  set _isAllGoalsPage(data: boolean) {
    this.isAllGoalsPage = data;
  }

  @Input() isGoalUniquePage: boolean;
  set setisGoalUniquePage(isGoalUniquePage: boolean) {
    this.isGoalUniquePage = isGoalUniquePage;
  }
  @Input("isGoalChange")
  set _isGoalChange(data: boolean) {
    this.isGoalChange = data;
  }
  @Input("selectedGoalId")
  set _selectedGoalId(data: string) {
    this.selectedGoalId = data;
  }
  @Input("enableSprints")
  set _enableSprints(data: boolean) {
    this.enableSprints = data;
  }
 
  @Output() userStoryCloseClicked = new EventEmitter<any>();
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @ViewChild("projectMemberPopover") projectMemberPopUp: SatPopover;
  @ViewChildren("addSection") addSectionsPopover;
  @ViewChild("addSection") addSectionPopover: SatPopover;
  @ViewChild('fileUpload') fileUploadExample: ElementRef;
  @ViewChildren("FileUploadPopup") FileUploadPopup;
  @ViewChild('showAssignee') showAssignee;
  isSprintsView: boolean;
  timeStamp: any;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  userStoryTypes$: Observable<UserStoryTypesModel[]>;
  projectMembers$: Observable<ProjectMember[]>;
  projectMembers: ProjectMember[];
  workflowStatus$: Observable<WorkflowStatus[]>;
  userStories$: Observable<UserStory[]>;
  projectsList: ProjectSearchResult[];
  userStories: UserStory[];
  bugPriorities$: Observable<BugPriorityDropDownData[]>;
  entityRolePermisisons$: Observable<EntityRoleFeatureModel[]>;
  sectionsList$: Observable<TestCaseDropdownList[]>;
  entityRolePermisisons: EntityRoleFeatureModel[];
  upsertOperationInProgress$: Observable<boolean>;
  anyOperationInProgress$: Observable<boolean>;
  customFieldsInProgress$: Observable<boolean>;
  goals$: Observable<GoalModel[]>;
  userStory$: Observable<UserStory>;
  projectFeatures$: Observable<ProjectFeature[]>;
  commentsCount$: Observable<number>;
  formReferenceTypeId: string;
  isLoading: boolean;
  enableSprints: boolean;
  userStoryLinksCount$: Observable<number>;
  bugsCount$: Observable<number>;
  userStoryIsInProgress$: Observable<boolean>;
  updateUserStoryGoalIsInProgress$: Observable<boolean>;
  submitCustomFieldsInPM$: Boolean;
  // uploadedFiles$: Observable<FileInputModel[]>;
  customFields$: Observable<CustomFormFieldModel[]>;
  filesUploaded: any;
  position: any;
  isLoadingGoals: boolean;
  isLoadingSprints: boolean;
  userStoryTypes: UserStoryTypesModel[];
  bugUserStoryTypeModel: UserStoryTypesModel;
  userStoryTypeModel: UserStoryTypesModel;
  workflowStatus: WorkflowStatus[];
  userStory: UserStory;
  versionName: string;
  parentUserStoryGoalId: string;
  isSprintsConfiguration: boolean;
  isReplan: boolean;
  tag: string;
  none: string = "none";
  selectedGoalId: string;
  parentUserStoryId: string;
  validationForVersionName: boolean = false;
  isUserStoryStatusDisabledForActive: boolean;
  isRecurringWorkItem: boolean = false;
  isEditScheduling: boolean = false;
  goalsList: GoalModel[];
  sprintsList: SprintModel[];
  bugPriorityId: string;
  userStoryReplanTypeId: string;
  projectFeatureId: string;
  isPermissionForUserStory: boolean;
  isEnableTestRepo: boolean;
  bugCausedUserId: string;
  entityFeatureIds: string[] = [];
  isFileUpload: boolean;
  estimatedTimeSet: any;
  isGoalChange: boolean;
  isPermissionForFileUpload: boolean;
  isUserStoryStatusDisabled: boolean;
  isPermisisontoChangeGoal: boolean;
  isPermissionToAddOrUpdateForm: boolean;
  isPermissionToDeleteForm: boolean;
  isStatusChanged: boolean;
  isNewUserStory: boolean;
  isUserStoryStatus: boolean;
  subUserStoriesCount: number;
  replanOwnerUserId: string;
  sprintEstimatedTime: any;
  replanDeadlineDate: Date;
  replanDependencyUserId: string;
  replanEstimatedTime: any;
  userStoryTypeId: string;
  projectId: string;
  userStoryInputTags: string[] = [];
  isEditUserStory: boolean = true;
  userStoryName: string;
  selectedIndex: string = "GENERAL";
  isKanbanBoard: boolean;
  isSuperagileBoard: boolean;
  ProjectId: string;
  userStoryStatusId: string;
  isDateTimeConfiguration: boolean;
  assignee: string;
  estimatedTime: any;
  isSprintUserStories: boolean;
  userStoryUniqueName: string;
  deadlineDate: Date;
  dependancyUserId: string;
  goalId: string;
  order: number;
  bugsCount: number = 0;
  description: string;
  projectMember: ProjectMember;
  workFlowId: string;
  isThereAnError: boolean;
  validationmessage: string;
  isPermissionsForUserStoryComments: boolean;
  isGoalChanged: boolean;
  tab: string;
  loadprojectMember: boolean;
  clearProjectMemberForm: boolean;
  isHistoryTab: boolean = false;
  boardTypeId: string;
  isForQa: boolean;
  userStoryId: string;
  selectedStoreId: null;
  moduleTypeId: number = 4;
  referenceTypeId: string;
  isButtonVisible: boolean = true;
  userStoryData: any;
  isQaRequired: boolean;
  isLogTimeRequired: boolean;
  onBoardProcessDate: Date;
  isInlineEditForEstimatedTimeInActive: boolean;
  isInlineEditForUserStoryDeadlineDateInActive: boolean;
  isInlineEditForUserStoryOwnerInActive: boolean;
  isInlineEditForEstimatedTimeBacklog: boolean;
  isInlineEditForUserStoryDeadlineDateInBacklog: boolean;
  isInlineEditForUserStoryOwnerInBacklog: boolean;
  isInlineEditForEstimatedTimeInReplan: boolean;
  isInlineEditForUserStoryDeadlineDateInReplan: boolean;
  isInlineEditForUserStoryOwnerInReplan: boolean;
  isInlineEditForBugCausedUserInActive: boolean;
  isInlineEditForBugCausedUserInBacklog: boolean;
  isInlineEditForProjectFeatureInActive: boolean;
  isInlineEditForProjectFeatureInBacklog: boolean;
  isInlineEditForBugPriorityInActive: boolean;
  isInlineEditForBugPriorityInBacklog: boolean;
  isInlineEditForUserStoryNameInActive: boolean;
  isInlineEditForUserStoryNameInBacklog: boolean;
  isInlineEditForUserStoryNameInReplan: boolean;
  isInlineEditForDependencyPersonInActive: boolean;
  isInlineEditForDependencyPersonInBacklog: boolean;
  isInlineEditForDependencyPersonInReplan: boolean;
  isPermissionForViewSubLinks: boolean;
  isPermissionForCreatingSubLinks: boolean;
  isPermissionForMovingUserStoryTask: boolean;
  isPermissionsForArchiveUserStoryLink: boolean;
  canEditUserStoryInSuperagileGoal: boolean;
  isActiveGoalStatusId: boolean;
  isBacklogGoalStatusId: boolean;
  isReplanGoalStatusId: boolean;
  selectedMember: string;
  selectedBugCausedUser: string;
  selectedDependencyPerson: string;
  isBugBoard: boolean;
  testSuiteId: string;
  sprintId: string;
  sectionId: string;
  sectionEdit: string = ConstantVariables.SectionNotEditable;
  activeGoalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
  loadSection: boolean;
  showSectionsDropDown: boolean = false;
  showGoalField: boolean = false;
  showEstimatedTime: boolean = false;
  showDeadlineDate: boolean = false;
  ShowDependency: boolean = false;
  ShowStatus: boolean = false;
  descriptionSlug: any;
  isEditorVisible: boolean = false;
  ShowSectionField: boolean = false;
  ShowVersionName: boolean = false;
  ShowbugCausedUser: boolean = false;
  ShowBugPriority: boolean = false;
  ShowComponent: boolean = false;
  userStoryStatusColor: string;
  replanSprintEstimatedTime: any;
  panelOpenState: boolean = false;
  expansionIcon: boolean = false;
  defaultProfileImage: string = "assets/images/faces/18.png";
  profileImage: string;
  projectLabel: string;
  goalLabel: string;
  workItemLabel: string;
  ragStatus: string;
  isMainUSApproved: boolean;
  isEnableBugBoards: boolean;
  componentModel: ComponentModel = new ComponentModel();
  ragColors: any[] = [];
  minDate = new Date();
  isValidation: boolean;
  endDate = new FormControl('', Validators.compose([Validators.required]));
  scheduleType = new FormControl('', Validators.compose([]));
  isExtension: boolean = false;
  public ngDestroyed$ = new Subject();
  cronExpressionId: string;
  cronTimeStamp: string;
  jobId: string;
  public cronExpression = "0 10 1/1 * ?";
  isPaused: boolean = false;
  selectedSchedulingType: string;
  cronExpressionDescription: string;
  public isCronDisabled = false;
  public cronExpressionModel: CronExpressionModel;
  injector: any;
  customFieldComponent: any;
  customFieldModuleLoaded: boolean;
  startDate: Date;

  public cronOptions: CronOptions = {
    formInputClass: "form-control cron-editor-input",
    formSelectClass: "form-control cron-editor-select",
    formRadioClass: "cron-editor-radio",
    formCheckboxClass: "cron-editor-checkbox",
    defaultTime: "10:00:00",
    use24HourTime: true,
    hideMinutesTab: true,
    hideHourlyTab: true,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: true,
    hideSeconds: true,
    removeSeconds: true,
    removeYears: true
  };

  public initSettings = {
    selector: '.dfree-header',
    menubar: false,
    inline: true,
    theme: 'inlite',
    insert_toolbar: 'undo redo',
    selection_toolbar: 'bold italic | h2 h3 | blockquote quicklink'
  };

  public schedulingEnds = [{ endType: 'Never', code: 1 },
  { endType: 'ON', code: 2 }
  ]

  public initSettings1 = {
    plugins: "paste lists advlist",
    branding: false,
    //powerpaste_allow_local_images: false,
    //powerpaste_word_import: 'prompt',
    //powerpaste_html_import: 'prompt',
    toolbar: 'link image code'
  };

  constructor(
    private store: Store<State>,
    private goalService: ProjectGoalsService,
    private projectService: ProjectService,
    private testRailStore: Store<testRailmoduleReducers.State>,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private actionUpdates$: Actions,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private softLabelsPipe: SoftLabelPipe,
    public googleAnalyticsService: GoogleAnalyticsService,
    private softLabelPipe: SoftLabelPipe,
    private cookieService: CookieService,
    private sprintsService: SprintService,
    private masterDataManagementService: MasterDataManagementService,
    @Inject('ProjectModuleLoader') public projectModulesService: any,
    private ngModuleRef: NgModuleRef<any>,
    private vcr: ViewContainerRef,
    private datePipe: DatePipe, private compiler: Compiler
  ) {
    super();
    this.injector = this.vcr.injector;
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.CreateUserStoryCompleted),
        tap(() => {
          this.isEditUserStory = true;
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.MoveGoalUserStoryToSprintCompleted),
        tap(() => {
          this.closeUserStoryDetailWindow();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.GetUniqueUserStoryByIdCompleted),
        tap(() => {
          this.userStory$ = this.store.pipe(select(projectModuleReducers.getUserStoryById));
          this.userStory$.subscribe(x => this.userStory = x);
          this.userStoryData = this.userStory;
          this.isEnableTestRepo = this.userStoryData.isEnableTestRepo;
          this.isEnableBugBoards = this.userStoryData.isEnableBugBoards;
          this.formReferenceTypeId = this.userStoryData.userStoryTypeId;
          this.projectId = this.userStoryData.projectId;
          this.loadCustomFieldModule();
          if (this.userStoryData.goalStatusId == ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
            this.isActiveGoalStatusId = true;
          } else if (this.userStoryData.goalStatusId == ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
            this.isBacklogGoalStatusId = true;
          } else if (this.userStoryData.goalStatusId == ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
            this.isReplanGoalStatusId = true;
          }
          this.loadProjectFeature();

          this.getGoalsList();
          this.getSprintsList();
          //Load ProjectMembers    
          if (this.isAllGoalsPage) {
            this.store.dispatch(new LoadMemberProjectsTriggered(this.userStory.projectId));
          }
          //Load sections to assign for an user story
          this.loadSections();

          //Load WorkflowStatus
          this.loadWorkflowStatus();

          this.loadBoardTypeUi();

          //Check Permissions
          this.checkPermissionForUserStory();
          this.cdRef.markForCheck();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.GetUniqueSprintWorkItemByIdCompleted),
        tap(() => {
          this.userStory$ = this.store.pipe(select(projectModuleReducers.getUniqueSprintWorkItem));
          this.userStory$.subscribe(x => this.userStory = x);
          this.userStoryData = this.userStory;
          this.formReferenceTypeId = this.userStoryData.userStoryTypeId;
          this.isEnableTestRepo = this.userStoryData.isEnableTestRepo;
          this.isEnableBugBoards = this.userStoryData.isEnableBugBoards;
          this.projectId = this.userStoryData.projectId;
          this.loadCustomFieldModule();
          if (this.userStoryData.sprintStartDate && this.userStoryData.isReplan) {
            this.isReplanGoalStatusId = true;
          } else if (this.userStoryData.sprintStartDate && !this.userStoryData.isReplan) {
            this.isActiveGoalStatusId = true;
          } else {
            this.isBacklogGoalStatusId = true;
          }
          this.loadProjectFeature();
          this.getGoalsList();
          this.getSprintsList();
          this.store.dispatch(new LoadMemberProjectsTriggered(this.userStory.projectId));
          //Load WorkflowStatus
          this.loadWorkflowStatus();

          //Load sections to assign for an user story
          this.loadSections();

          this.loadBoardTypeUi();
          this.cdRef.markForCheck();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActionTypes.CreateGoalCompleted),
        tap(() => {
          this.store.dispatch(new GetUniqueUserStoryByIdTriggered(this.userStoryId));
          this.loadBugsCount();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.CreateUserStoryFailed),
        tap(() => {
          if (this.userStory) {
            this.userStoryStatusId = this.userStory.userStoryStatusId;
            this.cdRef.detectChanges();
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpdateUserStoryGoaalFailed),
        tap(() => {
          this.loadUserStoryData();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.MoveGoalUserStoryToSprintFailed),
        tap(() => {
          this.loadUserStoryData();
        })
      )
      .subscribe();


    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpsertSprintWorkItemFailed),
        tap(() => {
          if (this.userStory) {
            this.userStoryStatusId = this.userStory.userStoryStatusId;
            this.cdRef.detectChanges();
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpdateUserStoryGoalCompleted),
        tap(() => {
          this.userStoryCloseClicked.emit();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpdateSubTaskUserStoryCompleted),
        tap(() => {
          this.userStoryCloseClicked.emit();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.GetUserStoryByIdCompleted),
        tap(() => {
          this.userStory$ = this.store.pipe(select(projectModuleReducers.getUserStoryById));
          this.userStory$.subscribe(x => this.userStory = x);
          this.isEnableTestRepo = this.userStoryData.isEnableTestRepo;
          this.isEnableBugBoards = this.userStoryData.isEnableBugBoards;
          this.timeStamp = this.userStory.timeStamp;
          if (this.userStoryData.userStoryTypeId != this.userStoryTypeId) {
            this.loadCustomFieldModule();
          }
          this.isEditorVisible = false;
          this.userStoryData = this.userStory;
          this.loadBugsCount();
          this.loadWorkflowStatus();
          this.loadUserStoryData();
          this.cdRef.markForCheck();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.GetSprintWorkItemByIdCompleted),
        tap(() => {
          this.userStory$ = this.store.pipe(select(projectModuleReducers.getSprintWorkItemById));
          this.userStory$.subscribe(x => this.userStory = x);
          this.isEnableTestRepo = this.userStory.isEnableTestRepo;
          this.isEnableBugBoards = this.userStoryData.isEnableBugBoards;
          this.timeStamp = this.userStory.timeStamp;
          if (this.userStoryData.userStoryTypeId != this.userStoryTypeId) {
            this.loadCustomFieldModule();
          }
          this.isEditorVisible = false;
          this.userStoryData = this.userStory;
          this.loadBugsCount();
          this.loadUserStoryData();
          this.cdRef.markForCheck();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpdateMultipleUserStories),
        tap(() => {
          if(!localStorage.getItem("archivedUserStory")) {
            this.store.dispatch(new userStoryActions.GetUserStoryByIdTriggered(this.userStoryId));
          } else {
            localStorage.removeItem("archivedUserStory");
            this.closeUserStoryDetailWindow();
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpdateUniqueUserStories),
        tap((data: any) => {
          var userStoryDetails = data.userStoryUpdatesMultiple.userStoryUpdateMultiple[0].changes;
          if(userStoryDetails) {
            if(this.userStoryId == userStoryDetails.userStoryId) {
              this.userStory = userStoryDetails;
              this.loadUserStoryData();
              if(this.isEditorVisible) {
                this.isEditorVisible = !this.isEditorVisible;
              }
            }
          }

          this.loadBugsCount();
        })
      ) 
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpdateMultipleSprintWorkItemField),
        tap(() => {
          this.store.dispatch(new GetUniqueSprintWorkItemByIdTriggered(this.userStoryId));
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpdateSingleUserStoryForBugsCompleted),
        tap((result: any) => {
          if (result && result.userStoryUpdates.userStoryUpdate.changes) {
            // this.store.dispatch(new GetUniqueUserStoryByIdTriggered(this.userStoryId));
            this.userStory = result.userStoryUpdates.userStoryUpdate.changes;
            this.loadUserStoryData();
            this.loadBugsCount();
            this.cdRef.markForCheck();
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpdateSprintWorkItemField),
        tap((result: any) => {

          this.loadBugsCount();
          this.cdRef.markForCheck();

        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectMembersActionTypes.LoadProjectMembersCompleted),
        tap(() => {
          this.bindAssigneeValues();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpdateSprintSubTaskUserStoryCompleted),
        tap(() => {
          this.closeUserStoryDetailWindow();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpdateUserStorySprintCompleted),
        tap(() => {
          this.closeUserStoryDetailWindow();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpdateUserStorySprintFailed),
        tap(() => {
          this.loadUserStoryData();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(CommentsActionTypes.LoadCommentsCountCompleted),
        tap(() => {

        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(workFlowStatusActionTypes.LoadworkflowStatusCompleted),
        tap(() => {
          this.workflowStatus$ = this.store.pipe(select(projectModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: this.userStory.workFlowId }));
          this.workflowStatus$
            .subscribe(s => {
              this.workflowStatus = s;
              if (this.workflowStatus.length > 0) {
                this.loadUserStoryData();
              }
            });
          this.loadUserStoryData();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryTypesActionTypes.LoadUserStoryTypesCompleted),
        tap(() => {
          this.userStoryTypes$ = this.store.pipe(select(projectModuleReducers.getUserStoryTypesAll));
          this.userStoryTypes$.subscribe(x => this.userStoryTypes = x);
          this.bugUserStoryTypeModel = this.userStoryTypes.find(x => x.isBug);
          this.userStoryTypeModel = this.userStoryTypes.find(x => x.isUserStory);
          this.loadBoardTypeUi();
        })
      )
      .subscribe();

  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.searchUserStoryTypes();
    this.goals$ = this.store.pipe(select(projectModuleReducers.getgoalsAll));
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.submitCustomFieldsInPM$ = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_CanSubmitCustomFieldsForProjectManagement.toString().toLowerCase(); }) != null;

    this.upsertOperationInProgress$ = this.store.pipe(
      select(projectModuleReducers.createUserStoryLoading)
    );

    this.ragColors = [
      {
        name: "RED",
        value: "#FF0000"
      },
      {
        name: "AMBER",
        value: "#FFBF00"
      },
      {
        name: "GREEN",
        value: "#00FF00"
      },
    ]

    const anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducers.createUserStoryLoading)
    );

    const userStoryIsInProgress$ = this.store.pipe(
      select(projectModuleReducers.getUserStoryByIdLoading)
    );

    const updateUserStoryGoalIsInProgress$ = this.store.pipe(
      select(projectModuleReducers.updateUserStoryGoalInProgress)
    );

    const sprintUserStoryIsInProgress$ = this.store.pipe(
      select(projectModuleReducers.upsertSprintworkItemsLoading)
    );

    const sprintmoveUserStoryIsInProgress$ = this.store.pipe(
      select(projectModuleReducers.loadingUserStorySprint)
    );



    this.anyOperationInProgress$ = combineLatest(
      updateUserStoryGoalIsInProgress$,
      sprintUserStoryIsInProgress$,
      anyOperationInProgress$,
      userStoryIsInProgress$,
      sprintmoveUserStoryIsInProgress$

    ).pipe(
      map(
        ([
          updateUserStoryGoalInProgress,
          upsertSprintworkItemsLoading,
          createuserStoryLoading,
          getUserStoryByIdLoading,
          loadingUserStorySprint

        ]) =>
          updateUserStoryGoalInProgress ||
          upsertSprintworkItemsLoading ||
          createuserStoryLoading ||
          getUserStoryByIdLoading ||
          loadingUserStorySprint
      )
    );
    this.commentsCount$ = this.store.pipe(select(projectModuleReducers.getCommentsCount));
    this.userStoryLinksCount$ = this.store.pipe(select(projectModuleReducers.getUserStoryLinksCount));

    this.bugsCount$ = this.store.pipe(select(projectModuleReducers.getBugsCountByUserStoryId),
      tap(result => {
        if (result != null && result != undefined) {
          this.bugsCount = result;
          this.cdRef.markForCheck();
        }
      }));

    this.bugPriorities$ = this.store.pipe(
      select(projectModuleReducers.getBugPriorityAll)
    );

    this.projectFeatures$ = this.store.pipe(
      select(projectModuleReducers.getProjectFeaturesAll)
    );

    // setting component model to pass default variable values
    this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
    this.componentModel.backendApi = environment.apiURL;
    this.componentModel.parentComponent = this;
    this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  getGoalsList() {
   
    this.isLoadingGoals = true;
    var goalSearchCriteriaModel = new GoalSearchCriteriaInputModel();
    if(this.isActiveGoalStatusId) {
      goalSearchCriteriaModel.goalStatusId = ConstantVariables.ActiveGoalStatusId;
    } else if(this.isBacklogGoalStatusId) {
      goalSearchCriteriaModel.goalStatusId = ConstantVariables.BacklogGoalStatusId;
    } else {
      goalSearchCriteriaModel.goalStatusId = ConstantVariables.ReplanGoalStatusId;
    }
    goalSearchCriteriaModel.projectId = this.projectId;
    goalSearchCriteriaModel.isArchived = false;
    goalSearchCriteriaModel.isParked = false;
    this.goalService.searchGoals(goalSearchCriteriaModel).subscribe((responseData: any) => {
      this.isLoadingGoals = false;
      this.goalsList = responseData.data;
      this.cdRef.detectChanges();
    });
  }

  loadProjectFeature() {
    const projectFeature = new ProjectFeature();
    projectFeature.projectId = this.projectId;
    projectFeature.IsDelete = false;
    this.store.dispatch(new LoadFeatureProjectsTriggered(projectFeature));
  }

  getSprintsList() {
    this.isLoadingSprints = true;
    var sprintsModel = new SprintModel();
    sprintsModel.projectId = this.projectId;
    if (this.isActiveGoalStatusId) {
      sprintsModel.isBacklog = false;
    } else if (this.isBacklogGoalStatusId) {
      sprintsModel.isBacklog = true;
    } else {
      sprintsModel.isBacklog = null;
    }
    this.sprintsService.searchSprints(sprintsModel).subscribe((responseData: any) => {
      this.isLoadingSprints = false;
      this.sprintsList = responseData.data;
      this.cdRef.markForCheck();
    });
  }

  setRagStatus(value) {
    this.ragStatus = value;
    this.saveUserStory();
  }

  closeUserStoryDetailWindow() {
    this.userStory = null;
    this.goalReplanId = null;
    this.userStoryCloseClicked.emit();
  }

  bindAssigneeValues() {
    this.projectMembers$ = this.store.pipe(
      select(projectModuleReducers.getProjectMembersAll)
    );
    this.projectMembers$
      .subscribe(s => (this.projectMembers = s));
    var assignee = this.assignee;
    var dependencyUserId = this.dependancyUserId;
    var bugCausedUserId = this.bugCausedUserId;
    var projectMembers = this.projectMembers;

    if (this.userStory && this.userStory.ownerUserId) {
      var ownerFilteredList = _.find(projectMembers, function (member) {
        return member.projectMember.id == assignee;
      })
      if (ownerFilteredList) {
        this.selectedMember = ownerFilteredList.projectMember.name;
      }
      else {
        this.selectedMember = null;
      }
    }
    else {
      this.selectedMember = null;

    }

    if (this.userStory.dependencyUserId) {
      var ownerFilteredList = _.find(projectMembers, function (member) {
        return member.projectMember.id == dependencyUserId;
      })
      if (ownerFilteredList) {
        this.selectedDependencyPerson = ownerFilteredList.projectMember.name;
      }
      else {
        this.selectedDependencyPerson = null;
      }
    }
    else {
      this.selectedDependencyPerson = null;
    }

    if (this.userStory.bugCausedUserId) {
      var ownerFilteredList = _.find(projectMembers, function (member) {
        return member.projectMember.id == bugCausedUserId;
      })
      if (ownerFilteredList) {
        this.selectedBugCausedUser = ownerFilteredList.projectMember.name;
      }
      else {
        this.selectedBugCausedUser = null;
      }
    }
    else {
      this.selectedBugCausedUser = null;
    }
  }

  saveEstimatedTime() {
    if (this.sprintEstimatedTime > 99) {
      this.isValidation = true;
    } else {
      this.isValidation = false;
      if (((!this.isSprintUserStories && this.userStory.goalStatusId ===
        ConstantVariables.ReplanGoalStatusId.toLowerCase()) || (this.isSprintUserStories && this.isReplanGoalStatusId)) && (!this.goalReplanId)
      ) {
        this.toastr.error("", ConstantVariables.ValidationForEstimatedTimeReplanType);
        this.sprintEstimatedTime = this.userStory.sprintEstimatedTime;
      } else if (this.goalReplanId) {
        this.userStoryReplanTypeId = ConstantVariables.UserStoryReplanTypeIdForEstimatedTimeInSP;
        this.replanSprintEstimatedTime = this.sprintEstimatedTime;
        this.replanDeadlineDate = null;
        this.replanOwnerUserId = null;
        this.replanDependencyUserId = null;
        this.replanEstimatedTime = null;
        this.replanStartDate = null;
        this.saveReplanUserStory();
      } else {
        this.saveUserStory();
      }
    }
  }

  saveUserStory() {
    let deadline = null;
    let startDate = null;

    if(this.isDateTimeConfiguration){
      if(this.deadlineDate){
        deadline = new Date(this.deadlineDate);
      }
      if(this.startDate){
        startDate = new Date(this.startDate);
      }
  
      if(startDate > deadline && deadline != null && startDate != null){
        this.toastr.error(this.translateService.instant("GOALS.STARTDATEANDDEADLINEMESSAGE"));
        return;
      }
    }
    else{
      if(this.deadlineDate){
        deadline = moment(moment(this.deadlineDate).format('MM/DD/yyyy')).toDate();
      }
      if(this.startDate){
        startDate = moment(moment(this.startDate).format('MM/DD/yyyy')).toDate();
      }
  
      if(startDate > deadline && deadline != null && startDate != null){
        this.toastr.error(this.translateService.instant("GOALS.STARTDATEANDDEADLINEMESSAGE"));
        return;
      }
    }
    
    const userStory = new UserStory();
    userStory.goalId = this.goalId;
    userStory.projectId = this.userStory.projectId;
    userStory.userStory = this.userStoryName;
    userStory.versionName = this.versionName;
    userStory.userStoryUniqueName = this.userStoryUniqueName;
    userStory.userStoryId = this.userStory.userStoryId;
    userStory.oldOwnerUserId = this.userStory.ownerUserId;
    userStory.ownerUserId = this.assignee;
    userStory.userStoryStatusId = this.userStoryStatusId;
    userStory.estimatedTime = this.estimatedTimeSet;
    userStory.deadLineDate = this.deadlineDate;
    if(this.isDateTimeConfiguration){
    userStory.deadLine =this.covertTimeIntoUtcTime(this.deadlineDate);
    }
    else{
      userStory.deadLine =this.covertTimeIntoUtcTimes(this.deadlineDate);
    }
    userStory.timeZoneOffSet = (-(new Date(this.deadlineDate).getTimezoneOffset()));
    userStory.userStoryName = this.userStoryName;
    userStory.dependencyUserId = this.dependancyUserId;
    userStory.isNewUserStory = this.isNewUserStory;
    userStory.isGoalChanged = this.isGoalChanged;
    userStory.description = this.description;
    userStory.projectFeatureId = this.projectFeatureId;
    userStory.bugPriorityId = this.bugPriorityId;
    userStory.bugCausedUserId = this.bugCausedUserId;
    userStory.userStoryTypeId = this.userStoryTypeId;
    userStory.isStatusChanged = this.isStatusChanged;
    userStory.rAGStatus = this.ragStatus;
    userStory.parentUserStoryId = this.parentUserStoryId;
    userStory.parentUserStoryGoalId = this.userStory ? this.userStory.parentUserStoryGoalId : null;
    userStory.testCaseId = this.userStory ? this.userStory.testCaseId : null;
    userStory.testSuiteSectionId = this.sectionId;
    userStory.timeStamp = this.timeStamp;
    userStory.isForQa = this.isForQa;
    userStory.order = this.order;
    userStory.tag = this.userStory.tag;
    userStory.isBugBoard = this.userStory.isBugBoard;
    userStory.userStoryStatusColor = this.userStory.userStoryStatusColor;
    userStory.ownerProfileImage = this.userStory.ownerProfileImage;
    userStory.sprintId = this.userStory.sprintId;
    userStory.sprintEstimatedTime = this.sprintEstimatedTime;
    userStory.isGoalsPage = this.isAllGoalsPage;
    userStory.userStoryStartDate = this.startDate;
    // userStory.isBug = (this.userStoryTypeId == this.bugUserStoryTypeModel.userStoryTypeId) ? true : false;
    if (this.isSprintUserStories) {
      this.store.dispatch(
        new UpsertSprintWorkItemTriggered(userStory)
      );
    } else {
      this.store.dispatch(
        new userStoryActions.CreateUserStoryTriggered(userStory)
      );
    }

    let workItemLabel = this.softLabelPipe.transform("Work Item", this.softLabels);
    this.googleAnalyticsService.eventEmitter(workItemLabel, "Updated " + workItemLabel + "", userStory.userStoryName, 1);
  }

  saveReplanUserStory() {

    let deadline = null;
    let startDate = null;

    if(this.isDateTimeConfiguration){
      if(this.deadlineDate){
        deadline = new Date(this.deadlineDate);
      }
      if(this.startDate){
        startDate = new Date(this.startDate);
      }
  
      if(startDate > deadline && deadline != null && startDate != null){
        this.toastr.error(this.translateService.instant("GOALS.STARTDATEANDDEADLINEMESSAGE"));
        return;
      }
    }
    else{
      if(this.deadlineDate){
        deadline = moment(moment(this.deadlineDate).format('MM/DD/yyyy')).toDate();
      }
      if(this.startDate){
        startDate = moment(moment(this.startDate).format('MM/DD/yyyy')).toDate();
      }
  
      if(startDate > deadline && deadline != null && startDate != null){
        this.toastr.error(this.translateService.instant("GOALS.STARTDATEANDDEADLINEMESSAGE"));
        return;
      }
    }
    const userStoryReplan = new UserStoryReplanModel();
    userStoryReplan.userStoryId = this.userStory.userStoryId;
    userStoryReplan.goalReplanId = this.goalReplanId;
    userStoryReplan.userStoryName = null;
    userStoryReplan.userStoryReplanTypeId = this.userStoryReplanTypeId;
    userStoryReplan.userStoryDeadLine = this.replanDeadlineDate;
    if(this.isDateTimeConfiguration){
    userStoryReplan.deadLine=this.covertTimeIntoUtcTime(this.replanDeadlineDate);
    }
    else{
      userStoryReplan.deadLine = this.covertTimeIntoUtcTimes(this.replanDeadlineDate);
    }
    userStoryReplan.timeZoneOffSet = (-(new Date(this.replanDeadlineDate).getTimezoneOffset()));
    userStoryReplan.userStoryDependencyId = this.replanDependencyUserId;
    userStoryReplan.userStoryOwnerId = this.replanOwnerUserId;
    userStoryReplan.estimatedTime = this.replanEstimatedTime;
    userStoryReplan.sprintEstimatedTime = this.replanSprintEstimatedTime;
    userStoryReplan.goalId = this.userStory.goalId;
    userStoryReplan.userStoryStartDate = this.replanStartDate;
    userStoryReplan.timeStamp = this.timeStamp;
    userStoryReplan.parentUserStoryId = this.userStory.parentUserStoryId;
    if (this.isSprintUserStories) {
      userStoryReplan.sprintId = this.userStory.sprintId;
      userStoryReplan.isFromSprint = true;
      this.store.dispatch(
        new InsertSprintWorkItemReplanTriggered(userStoryReplan)
      );
    } else {
      this.store.dispatch(
        new userStoryActions.InsertUserStoryReplanTriggered(userStoryReplan)
      );
    }
  }

  getUserStoryStatusChange(event) {
    if (
      this.userStory.taskStatusId.toLowerCase() == BoardTypeIds.VerificationCompletedTaskStatusId.toLowerCase()
      || this.userStory.taskStatusId.toLowerCase() == BoardTypeIds.DoneTaskStatusId.toLowerCase()) {
      this.cdRef.detectChanges();
    }
    else {
      this.cdRef.detectChanges();
    }

    let selectedStatus = this.workflowStatus.find(x => x.userStoryStatusId == this.userStoryStatusId);
    let taskStatusId = selectedStatus.taskStatusId;

      if (taskStatusId == BoardTypeIds.DoneTaskStatusId.toLowerCase() || taskStatusId == BoardTypeIds.VerificationCompletedTaskStatusId.toLowerCase()) {
        if (this.isMainUSApproved) {
          this.userStoryStatusId = event;
          this.isStatusChanged = false;
          this.isGoalChanged = false;
          this.saveUserStory();
        } else {
          this.userStoryStatusId = this.userStory.userStoryStatusId;
          this.toastr.warning('', this.softLabelPipe.transform(this.translateService.instant('USERDETAIL.PLEASEAPPROVESUBTASKSS'), this.softLabels));
        }
      } else {
        this.userStoryStatusId = event;
        this.isStatusChanged = false;
        this.isGoalChanged = false;
        this.saveUserStory();
      }
  }

  changeAssignee(event) {
    this.loadprojectMember = true;
    if (event === -1) {
      this.projectMemberPopUp.open();

    }
    else {
      if (event === 0) {
        event = null;
      }
      this.assignee = event;
      if (!this.assignee) {
        this.userStoryStatusId = this.userStory.userStoryStatusId;
        this.selectedMember = null;
        this.assignee = null;
        
      } else {
        var projectMembers = this.projectMembers;
        var filteredList = _.find(projectMembers, function (member) {
          return member.projectMember.id == event;
        })
        if (filteredList) {
          this.selectedMember = filteredList.projectMember.name;
        }
      }
      this.isGoalChanged = false;
      this.isStatusChanged = true;
      this.saveUserStory();
    }


  }

  changeEstimatedTime(estimatedTime) {
    if (estimatedTime === 'null') {
      this.estimatedTimeSet = null;
    }
    else {
      this.estimatedTimeSet = estimatedTime;
    }
    if (this.estimatedTimeSet != null) {
      this.estimatedTimeSet = estimatedTime;
      this.isGoalChanged = false;
      this.isStatusChanged = false;
      if (((!this.isSprintUserStories && this.userStory.goalStatusId ===
        ConstantVariables.ReplanGoalStatusId.toLowerCase()) || (this.isSprintUserStories && this.isReplanGoalStatusId)) && (!this.goalReplanId)
      ) {
        this.toastr.error("", ConstantVariables.ValidationForEstimatedTimeReplanType);
        this.estimatedTimeSet = this.userStory.estimatedTime;
      } else if (this.goalReplanId) {
        this.userStoryReplanTypeId = ConstantVariables.UserStoryReplanTypeIdForEstimatedTime;
        this.replanEstimatedTime = this.estimatedTimeSet;
        this.replanDeadlineDate = null;
        this.replanOwnerUserId = null;
        this.replanSprintEstimatedTime = null;
        this.replanDependencyUserId = null;
        this.replanStartDate = null;
        this.saveReplanUserStory();
      } else {
        this.saveUserStory();
      }
    }
  }

  getGoalChange(goalId) {
    var goalList = this.goalsList;
    this.goalId = goalId;
    var userStoryModel = new UserStory();
    userStoryModel.userStoryId = this.userStory.userStoryId;
    userStoryModel.userStoryName = this.userStory.userStoryName;
    userStoryModel.goalId = goalId;
    userStoryModel.timeStamp = this.timeStamp;
    userStoryModel.userStoryUniqueName = this.userStoryUniqueName;
    userStoryModel.oldGoalId = this.userStory.goalId;
    userStoryModel.isFromSprint = this.isSprintUserStories;
    userStoryModel.isGoalUniquePage = this.isGoalUniquePage;
    const filteredList = _.filter(goalList, function (s) {
      return goalId.includes(s.goalId);
    });

    if (this.isGoalChange) {
      if (this.isSprintUserStories) {

        if (this.userStory.boardTypeId == filteredList[0].boardTypeId) {
          this.saveUserStory();
        } else {
          this.toastr.warning('', this.translateService.instant('USERDETAIL.PLEASESELECTGOALWITHSAMEBOARDTYPE'));
        }
      } else {
        if (this.userStory.sprintId) {
          if (this.userStory.boardTypeId == filteredList[0].boardTypeId) {
            this.store.dispatch(new userStoryActions.UpdateUserStoryGoalTriggred(userStoryModel));
          } else {
            this.toastr.warning('', this.translateService.instant('USERDETAIL.PLEASESELECTGOALWITHSAMEBOARDTYPE'));
          }
        } else {
          this.store.dispatch(new userStoryActions.UpdateUserStoryGoalTriggred(userStoryModel));
        }
      }
    } else {
      if (this.userStory.projectId != this.projectId) {
        if(this.isSprintUserStories) {
          if (this.userStory.boardTypeId == filteredList[0].boardTypeId) {
            this.saveUserStory();
          } else {
            this.toastr.warning('', this.translateService.instant('USERDETAIL.PLEASESELECTGOALWITHSAMEBOARDTYPE'));
          }
        } else {
          this.store.dispatch(new userStoryActions.UpdateUserStoryGoalTriggred(userStoryModel));
        }
      } else {
        this.getUserStoryChangeToAnotherGoal();
      }
    }
  }

  getUserStoryChangeToAnotherGoal() {
    this.isLoading = true;
    var userStoryModel = new UserStory();
    userStoryModel.userStoryId = this.userStory.userStoryId;
    userStoryModel.userStoryName = this.userStory.userStoryName;
    userStoryModel.goalId = this.goalId;
    userStoryModel.timeStamp = this.timeStamp;
    userStoryModel.userStoryUniqueName = this.userStoryUniqueName;
    userStoryModel.oldGoalId = this.userStory.goalId;
    userStoryModel.isFromSprint = this.isSprintUserStories;
    this.goalService.updateUserStoryGoal(userStoryModel).subscribe((x: any) => {
      this.isLoading = false;
      if (x.success) {
        this.store.dispatch(new userStoryActions.GetUserStoryByIdTriggered(this.userStory.userStoryId));
      } else {
        this.toastr.error('', x.apiResponseMessages[0].message)
      }
    })
  }

  moveUserStoryToSprint(sprintId) {
    let projectChange;
    var sprintsList = this.sprintsList;
    const filteredList = _.filter(sprintsList, function (s) {
      return sprintId.includes(s.sprintId);
    });
    if(this.userStory.projectId != this.projectId) {
      projectChange = true;
    } else {
      projectChange = false;
    }
    if (this.userStory.boardTypeId == filteredList[0].boardTypeId) {
      this.store.dispatch(new MoveGoalUserStoryToSprintTriggered(this.userStory.userStoryId, sprintId, projectChange));
    } else {
      this.toastr.warning('', this.translateService.instant('USERDETAIL.PLEASESELECTSPRINTWITHSAMEBOARDTYPE'));
    }
  }

  getSprintChange(sprintId) {
    var sprintsList = this.sprintsList;
    this.sprintId = sprintId;
    var userStoryModel = new UserStory();
    userStoryModel.userStoryId = this.userStory.userStoryId;
    userStoryModel.timeStamp = this.timeStamp;
    userStoryModel.userStoryUniqueName = this.userStoryUniqueName;
    userStoryModel.oldSprintId = this.userStory.sprintId;
    userStoryModel.isFromSprint = this.isSprintUserStories;
    userStoryModel.sprintId = this.sprintId;
    const filteredList = _.filter(sprintsList, function (s) {
      return sprintId.includes(s.sprintId);
    });
    if (this.userStory.goalId) {
      if (this.userStory.boardTypeId == filteredList[0].boardTypeId) {
        this.store.dispatch(new UpdateUserStorySprintTriggered(userStoryModel));
      } else {
        this.toastr.warning('', this.translateService.instant('USERDETAIL.PLEASESELECTSPRINTWITHSAMEBOARDTYPE'));
      }
    } else {
      this.store.dispatch(new UpdateUserStorySprintTriggered(userStoryModel));
    }
  }

  showMatFormField() {
    this.isEditUserStory = false;
  }

  updateUserStoryName() {
    if (this.userStoryName) {
      this.saveUserStory();
    }
    else {
      const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASEENTERUSERSTORYNAME'), this.softLabels);
      this.toastr.warning("", message);
    }
  }

  updateVersionName() {
    if (this.versionName.length > 250) {
      this.validationForVersionName = true;
      this.cdRef.detectChanges();
    }
    else {
      this.validationForVersionName = false;
      this.saveUserStory();
    }
  }

  updateProjectFeature(projectFeatureId) {
    if(projectFeatureId == 0) {
      projectFeatureId = null;
    }
    this.projectFeatureId = projectFeatureId;
    this.saveUserStory();
  }

  updateBugCausedPerson(bugCausedUserId) {
    if (bugCausedUserId === 0) {
      bugCausedUserId = null;
    }
    this.bugCausedUserId = bugCausedUserId;
    if (this.bugCausedUserId) {
      var projectMembers = this.projectMembers;
      var filteredList = _.find(projectMembers, function (member) {
        return member.projectMember.id == bugCausedUserId;
      })
      if (filteredList) {
        this.selectedBugCausedUser = filteredList.projectMember.name;
      }
    }

    this.saveUserStory();
  }

  updateBugPrioity(bugPriorityId) {
    if (bugPriorityId == 0) {
      bugPriorityId = null;
    }
    this.bugPriorityId = bugPriorityId;
    this.saveUserStory();
  }

  setColorForBugPriorityTypes(color) {
    let styles = {
      "color": color
    };
    return styles;
  }

  changeDeadline() {
    // tslint:disable-next-line:prefer-const
    let date = new Date(this.deadlineDate);
    this.isGoalChanged = false;
    this.isNewUserStory = false;
    if (
      this.userStory.goalStatusId ===
      ConstantVariables.ReplanGoalStatusId.toLowerCase() &&
      (this.goalReplanId === null || this.goalReplanId === undefined)
    ) {
      this.toastr.error(
        "",
        ConstantVariables.ValidationForDeadlineDateReplanType
      );
      this.deadlineDate = this.userStory.deadLineDate;
    } else if (
      this.userStory.goalStatusId ===
      ConstantVariables.ReplanGoalStatusId.toLowerCase() &&
      (this.goalReplanId !== null || this.goalReplanId !== undefined)
    ) {
      this.userStoryReplanTypeId =
        ConstantVariables.UserStoryReplanTypeIdForDeadlineDate;
      this.replanDeadlineDate = this.deadlineDate;
      this.replanOwnerUserId = null;
      this.replanEstimatedTime = null;
      this.replanDependencyUserId = null;
      this.replanSprintEstimatedTime = null;
      this.replanStartDate = null;
      this.saveReplanUserStory();
    } else {
      this.saveUserStory();
    }
  }

  changeStartDate(){

     // tslint:disable-next-line:prefer-const
     let date = new Date(this.startDate);
     this.isGoalChanged = false;
     this.isNewUserStory = false;
     if (
       this.userStory.goalStatusId ===
       ConstantVariables.ReplanGoalStatusId.toLowerCase() &&
       (this.goalReplanId === null || this.goalReplanId === undefined)
     ) {
       this.toastr.error(
         "",
         ConstantVariables.ValidationForStartDateReplanType
       );
       this.startDate = this.userStory.userStoryStartDate;
     } else if (
       this.userStory.goalStatusId ===
       ConstantVariables.ReplanGoalStatusId.toLowerCase() &&
       (this.goalReplanId !== null || this.goalReplanId !== undefined)
     ) {
       this.userStoryReplanTypeId =
         ConstantVariables.UserStoryReplanTypeIdForStartDate;
       this.replanStartDate = this.startDate;
       this.replanOwnerUserId = null;
       this.replanEstimatedTime = null;
       this.replanDependencyUserId = null;
       this.replanSprintEstimatedTime = null;
       this.replanDeadlineDate = null;
       this.saveReplanUserStory();
     } else {
       this.saveUserStory();
     }
  }

  changeUserStoryType(userStoryTypeId) {
    this.userStoryTypeId = userStoryTypeId;
    this.saveUserStory();
  }

  changeDependancy(event) {
    if (event === 0) {
      event = null;
      this.userStoryStatusId = this.userStory.userStoryStatusId;
      this.cdRef.detectChanges();
    }
    if (event) {
      var projectMembers = this.projectMembers;
      var filteredList = _.find(projectMembers, function (member) {
        return member.projectMember.id == event;
      })
      if (filteredList) {
        
        this.selectedDependencyPerson = filteredList.projectMember.name;
      }
      this.saveUserStory();
    }

    else {
      this.dependancyUserId = event;
      this.isGoalChanged = false;
      this.isNewUserStory = false;
      this.saveUserStory();
    }
  }

  searchUserStoryTypes() {
    var userStoryTypesModel = new UserStoryTypesModel();
    userStoryTypesModel.isArchived = false;
    this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel));

  }

  handleDescriptionEvent(event) {
    this.saveDescription();
  }

  saveDescription() {
    this.saveUserStory();
  }

  createProjectMember() {
    this.loadprojectMember = true;
    this.clearProjectMemberForm = true;
  }

  closeProjectMemberDialog() {
    let popover = this.projectMemberPopUp;
    if (popover) {
      popover.close();
    }
  }

  getProjectMembersCount() {
    this.store.dispatch(new ProjectSummaryTriggered(this.userStory.projectId));
  }

  checkPermissionForUserStory() {
    let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
    let projectId = this.userStory.projectId;
    if (entityRolefeatures) {
      this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
        return role.projectId == projectId
      })
    }
    if (this.userStory.goalId != "00000000-0000-0000-0000-000000000000") {
      let featurePermissions = [];
      featurePermissions = this.entityRolePermisisons;
      this.entityFeatureIds = featurePermissions.map(x => x.entityFeatureId);
      if (featurePermissions.length > 0) {
        let entityTypeFeatureForAddOrUpdateUserStory = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateWorkItem.toString().toLowerCase();
        var addOrUpdateUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForAddOrUpdateUserStory)
        })
        if (addOrUpdateUserStoryPermisisonsList.length > 0) {
          this.isPermissionForUserStory = true;
        }
        else {
          this.isPermissionForUserStory = false;
        }

        // File Upload permissions
        let entityTypeFeatureForUserStoryFileUpload = EntityTypeFeatureIds.EntityTypeFeature_WorkItemFileUpload.toString().toLowerCase();
        var userStoryFileUploadPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryFileUpload)
        })
        if (userStoryFileUploadPermisisonsList.length > 0) {
          this.isPermissionForFileUpload = true;
        }
        else {
          this.isPermissionForFileUpload = false;
        }

        // Change userstory goal permissions
        let entityTypeFeatureForUserStoryGoal = EntityTypeFeatureIds.EntityTypeFeature_CanMoveWorkItemToAnotherGoal.toString().toLowerCase();
        var userStoryChangeGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryGoal)
        })
        if (userStoryChangeGoalPermisisonsList.length > 0) {
          this.isPermisisontoChangeGoal = true;
        }
        else {
          this.isPermisisontoChangeGoal = false;
        }

        // Change user story subtask

        let entityTypeFeatureForUserStorySubTask = EntityTypeFeatureIds.EntityTypeFeature_CanMoveSubtaskFromOneWorkItemToAnother.toString().toLowerCase();
        var subTaskChangeUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStorySubTask)
        })
        if (subTaskChangeUserStoryPermisisonsList.length > 0) {
          this.isPermissionForMovingUserStoryTask = true;
        }
        else {
          this.isPermissionForMovingUserStoryTask = false;
        }

        // View user story links

        let entityTypeFeatureForUserStoryLinks = EntityTypeFeatureIds.EntityTypeFeature_ViewWorkItemLinks.toString().toLowerCase();
        var viewUserStoriesLinkPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryLinks)
        })
        if (viewUserStoriesLinkPermisisonsList.length > 0) {
          this.isPermissionForViewSubLinks = true;
        }
        else {
          this.isPermissionForViewSubLinks = false;
        }

        // Add user story links
        let entityTypeFeatureForCreateUserStoryLinks = EntityTypeFeatureIds.EntityTypeFeature_CreateWorkItemLinks.toString().toLowerCase();
        var createUserStoriesLinkPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForCreateUserStoryLinks)
        })
        if (createUserStoriesLinkPermisisonsList.length > 0) {
          this.isPermissionForCreatingSubLinks = true;
        }
        else {
          this.isPermissionForCreatingSubLinks = false;
        }

        // Archive user story links

        let entityTypeFeatureForArchiveUserStoryLinks = EntityTypeFeatureIds.EntityTypeFeature_ArchiveWorkItemLink.toString().toLowerCase();
        var archiveUserStoryLinkPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForArchiveUserStoryLinks)
        })
        if (archiveUserStoryLinkPermisisonsList.length > 0) {
          this.isPermissionsForArchiveUserStoryLink = true;
        }
        else {
          this.isPermissionsForArchiveUserStoryLink = false;
        }

        // UserStory Comments Permisison
        let entityTypeFeatureForUserStoryComments = EntityTypeFeatureIds.EntityTypeFeature_WorkItemComments.toString().toLowerCase();
        var userStoryCommentsPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryComments)
        })
        if (userStoryCommentsPermisisonsList.length > 0) {
          this.isPermissionsForUserStoryComments = true;
        }
        else {
          this.isPermissionsForUserStoryComments = false;
        }

        //For Estimated Time
        //In Active
        let entityTypeFeatureForEstimatedTimeInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalEstimatedTime.toString().toLowerCase();
        var editEstimatedTimePermisisonsListInActive = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForEstimatedTimeInActive)
        })
        if (editEstimatedTimePermisisonsListInActive.length > 0) {
          this.isInlineEditForEstimatedTimeInActive = true;
        }
        else {
          this.isInlineEditForEstimatedTimeInActive = false;
        }
        //In Backlog
        let entityTypeFeatureForEstimatedTimeInBacklog = EntityTypeFeatureIds.EntityTypeFeature_EditBacklogGoalEstimatedTime.toString().toLowerCase();
        var editEstimatedTimePermisisonsListInBacklog = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForEstimatedTimeInBacklog)
        })
        if (editEstimatedTimePermisisonsListInBacklog.length > 0) {
          this.isInlineEditForEstimatedTimeBacklog = true;
        }
        else {
          this.isInlineEditForEstimatedTimeBacklog = false;
        }
        //In Replan
        let entityTypeFeatureForEstimatedTimeInReplan = EntityTypeFeatureIds.EntityTypeFeature_EditReplanGoalEstimatedTime.toString().toLowerCase();
        var editEstimatedTimePermisisonsListInReplan = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForEstimatedTimeInReplan)
        })
        if (editEstimatedTimePermisisonsListInReplan.length > 0) {
          this.isInlineEditForEstimatedTimeInReplan = true;
        }
        else {
          this.isInlineEditForEstimatedTimeInReplan = false;
        }

        //For Deadline Date 
        //In Active
        let entityTypeFeatureForDeadlineDateInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalDeadlineDate.toString().toLowerCase();
        var editDeadlineDatePermisisonsListInActive = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDeadlineDateInActive)
        })
        if (editDeadlineDatePermisisonsListInActive.length > 0) {
          this.isInlineEditForUserStoryDeadlineDateInActive = true;
        }
        else {
          this.isInlineEditForUserStoryDeadlineDateInActive = false;
        }
        //In Backlog
        let entityTypeFeatureForDeadlineDateInBacklog = EntityTypeFeatureIds.EntityTypeFeature_EditBacklogGoalDeadlineDate.toString().toLowerCase();
        var editDeadlineDatePermisisonsListInBacklog = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDeadlineDateInBacklog)
        })
        if (editDeadlineDatePermisisonsListInBacklog.length > 0) {
          this.isInlineEditForUserStoryDeadlineDateInBacklog = true;
        }
        else {
          this.isInlineEditForUserStoryDeadlineDateInBacklog = false;
        }
        //In Replan
        let entityTypeFeatureForDeadlineDateInReplan = EntityTypeFeatureIds.EntityTypeFeature_EditReplanGoalDeadlineDate.toString().toLowerCase();
        var editDeadlineDatePermisisonsListInReplan = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDeadlineDateInReplan)
        })
        if (editDeadlineDatePermisisonsListInReplan.length > 0) {
          this.isInlineEditForUserStoryDeadlineDateInReplan = true;
        }
        else {
          this.isInlineEditForUserStoryDeadlineDateInReplan = false;
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
        var editUserStoryOwnerPermisisonsListInBacklog = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryOwnerInBacklog)
        })
        if (editUserStoryOwnerPermisisonsListInBacklog.length > 0) {
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

        //For UserStory Name
        //In Active
        let entityTypeFeatureForUserStoryNameInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalWorkItemName.toString().toLowerCase();
        var editUserStoryNamePermisisonsListInActive = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryNameInActive)
        })
        if (editUserStoryNamePermisisonsListInActive.length > 0) {
          this.isInlineEditForUserStoryNameInActive = true;
        }
        else {
          this.isInlineEditForUserStoryNameInActive = false;
        }
        //In Backlog
        let entityTypeFeatureForUserStoryNameInBacklog = EntityTypeFeatureIds.EntityTypeFeature_EditBacklogGoalWorkItemName.toString().toLowerCase();
        var editUserStoryNamePermisisonsListInBacklog = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryNameInBacklog)
        })
        if (editUserStoryNamePermisisonsListInBacklog.length > 0) {
          this.isInlineEditForUserStoryNameInBacklog = true;
        }
        else {
          this.isInlineEditForUserStoryNameInBacklog = false;
        }
        //In Replan
        let entityTypeFeatureForUserStoryNameInReplan = EntityTypeFeatureIds.EntityTypeFeature_EditReplanGoalWorkItemName.toString().toLowerCase();
        var editUserStoryNamePermisisonsListInReplan = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryNameInReplan)
        })
        if (editUserStoryNamePermisisonsListInReplan.length > 0) {
          this.isInlineEditForUserStoryNameInReplan = true;
        }
        else {
          this.isInlineEditForUserStoryNameInReplan = false;
        }

        //For ProjectFeature
        //In Active
        let entityTypeFeatureForProjectFeatureInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalProjectFeature.toString().toLowerCase();
        var editProjectFeaturePermisisonsListInActive = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForProjectFeatureInActive)
        })
        if (editProjectFeaturePermisisonsListInActive.length > 0) {
          this.isInlineEditForProjectFeatureInActive = true;
        }
        else {
          this.isInlineEditForProjectFeatureInActive = false;
        }
        //In Backlog
        let entityTypeFeatureForProjectFeatureInBacklog = EntityTypeFeatureIds.EntityTypeFeature_EditBacklogGoalProjectFeature.toString().toLowerCase();
        var editProjectFeaturePermisisonsListInBacklog = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForProjectFeatureInBacklog)
        })
        if (editProjectFeaturePermisisonsListInBacklog.length > 0) {
          this.isInlineEditForProjectFeatureInBacklog = true;
        }
        else {
          this.isInlineEditForProjectFeatureInBacklog = false;
        }

        //For BugPriority
        //In Active
        let entityTypeFeatureForBugPriorityInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalBugPriority.toString().toLowerCase();
        var editBugPriorityPermisisonsListInActive = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForBugPriorityInActive)
        })
        if (editBugPriorityPermisisonsListInActive.length > 0) {
          this.isInlineEditForBugPriorityInActive = true;
        }
        else {
          this.isInlineEditForBugPriorityInActive = false;
        }
        //In Backlog
        let entityTypeFeatureForBugPriorityInBacklog = EntityTypeFeatureIds.EntityTypeFeature_EditBacklogGoalBugPriority.toString().toLowerCase();
        var editBugPriorityPermisisonsListInBacklog = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForBugPriorityInBacklog)
        })
        if (editBugPriorityPermisisonsListInBacklog.length > 0) {
          this.isInlineEditForBugPriorityInBacklog = true;
        }
        else {
          this.isInlineEditForBugPriorityInBacklog = false;
        }

        //For Bug Caused User
        //In Active
        let entityTypeFeatureForBugCausedUserInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalBugCausedUser.toString().toLowerCase();
        var editBugCausedUserPermisisonsListInActive = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForBugCausedUserInActive)
        })
        if (editBugCausedUserPermisisonsListInActive.length > 0) {
          this.isInlineEditForBugCausedUserInActive = true;
        }
        else {
          this.isInlineEditForBugCausedUserInActive = false;
        }
        //In Backlog
        let entityTypeFeatureForBugCausedUserInBacklog = EntityTypeFeatureIds.EntityTypeFeature_EditBacklogGoalBugCausedUser.toString().toLowerCase();
        var editBugCausedUserPermisisonsListInBacklog = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForBugCausedUserInBacklog)
        })
        if (editBugCausedUserPermisisonsListInBacklog.length > 0) {
          this.isInlineEditForBugCausedUserInBacklog = true;
        }
        else {
          this.isInlineEditForBugCausedUserInBacklog = false;
        }

        //For Dependency Person
        //In Active
        let entityTypeFeatureForDependencyPersonInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalDependency.toString().toLowerCase();
        var editEstimatedTimeDependencyPersonInActive = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDependencyPersonInActive)
        })
        if (editEstimatedTimeDependencyPersonInActive.length > 0) {
          this.isInlineEditForDependencyPersonInActive = true;
        }
        else {
          this.isInlineEditForDependencyPersonInActive = false;
        }
        //In Backlog
        let entityTypeFeatureForDependencyPersonInBacklog = EntityTypeFeatureIds.EntityTypeFeature_EditBacklogGoalDependency.toString().toLowerCase();
        var editEstimatedTimePermisisonsListInBacklog = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDependencyPersonInBacklog)
        })
        if (entityTypeFeatureForDependencyPersonInBacklog.length > 0) {
          this.isInlineEditForDependencyPersonInBacklog = true;
        }
        else {
          this.isInlineEditForDependencyPersonInBacklog = false;
        }
        //In Replan
        let entityTypeFeatureForDependencyPersonInReplan = EntityTypeFeatureIds.EntityTypeFeature_EditReplanGoalDependency.toString().toLowerCase();
        var editDependencyPersonPermisisonsListInReplan = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDependencyPersonInReplan)
        })
        if (editDependencyPersonPermisisonsListInReplan.length > 0) {
          this.isInlineEditForDependencyPersonInReplan = true;
        }
        else {
          this.isInlineEditForDependencyPersonInReplan = false;
        }


      }
    }
  }

  loadWorkflowStatus() {
    if (this.userStory && this.userStory.workFlowId != undefined) {
      var workflowStatus = new WorkflowStatus();
      workflowStatus.workFlowId = this.userStory.workFlowId;
      if (workflowStatus.workFlowId) {
        this.workflowStatus$ = this.store.pipe(select(projectModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: workflowStatus.workFlowId }));
        this.workflowStatus$.subscribe(s => {
          this.workflowStatus = s;
          if (this.workflowStatus.length > 0) {
            this.loadUserStoryData();
          }
        });
        if (this.workflowStatus.length <= 0) {
          this.store.dispatch(new LoadworkflowStatusTriggered(workflowStatus));
        }
      }
    }
  }

  loadUserStoryData() {
    this.isEditUserStory = true;
    this.cronExpression = "0 10 1/1 * ?";
    if (this.userStory) {
      this.userStoryStatusId = this.userStory.userStoryStatusId;
      this.userStoryName = this.userStory.userStoryName;
      this.versionName = this.userStory.versionName;
      this.userStoryUniqueName = this.userStory.userStoryUniqueName;
      this.assignee = this.userStory.ownerUserId;
      this.deadlineDate = this.userStory.deadLineDate;
      this.estimatedTime = this.userStory.estimatedTime;
      this.estimatedTimeSet = this.estimatedTime;
      this.dependancyUserId = this.userStory.dependencyUserId;
      this.goalId = this.userStory.goalId;
      this.isSprintsConfiguration = this.userStory.isSprintsConfiguration;
     // this.order = this.userStory.order;
      this.projectId = this.userStory.projectId;
      this.description = this.userStory.description;
      this.bugCausedUserId = this.userStory.bugCausedUserId;
      this.bugPriorityId = this.userStory.bugPriorityId;
      this.projectFeatureId = this.userStory.projectFeatureId;
      this.onBoardProcessDate = this.userStory.onboardProcessDate;
      this.timeStamp = this.userStory.timeStamp;
      this.isForQa = this.userStory.isForQa;
      this.isBugBoard = this.userStory.isBugBoard;
      this.sprintId = this.userStory.sprintId;
      this.parentUserStoryId = this.userStory.parentUserStoryId;
      this.formReferenceTypeId = this.userStoryData.userStoryTypeId;
      this.userStoryTypeId = this.userStoryData.userStoryTypeId;
      this.isLogTimeRequired = this.userStoryData.isLogTimeRequired;
      this.isQaRequired = this.userStoryData.isQaRequired;
      this.isDateTimeConfiguration = this.userStoryData.isDateTimeConfiguration;
      this.sprintEstimatedTime = this.userStoryData.sprintEstimatedTime;
      this.isReplan = this.userStoryData.isReplan;
      this.ragStatus = this.userStoryData.ragStatus;
      this.cronExpression = this.userStory.cronExpression != null ? this.userStory.cronExpression : this.cronExpression;
      this.cronExpressionDescription = (this.userStory != null && this.userStory.cronExpression != null) ? cronstrue.toString(this.userStory.cronExpression) : null;
      this.isRecurringWorkItem = this.userStory.cronExpression != null ? true : false;
      this.isEditScheduling = this.cronExpressionId != null ? true : false;
      this.cronExpressionId = this.userStory.cronExpressionId;
      this.cronTimeStamp = this.userStory.cronExpressionTimeStamp;
      this.jobId = this.userStory.jobId;
      this.isPaused = this.userStory.isPaused;
      this.parentUserStoryGoalId = this.userStory.parentUserStoryGoalId;
      this.userStory.scheduleEndDate == null ? this.scheduleType.setValue("1") : this.scheduleType.setValue("2");
      this.startDate = this.userStory.userStoryStartDate;

      this.endDate.setValue(this.userStory.scheduleEndDate);
      if (this.userStoryData.subUserStories) {
        this.subUserStoriesCount = this.userStoryData.subUserStoriesList.length;
      } else {
        this.subUserStoriesCount = 0;
      }
      if (this.userStory.tag) {
        this.userStoryInputTags = this.userStory.tag.split(',');
        this.cdRef.markForCheck();
      }
      else {
        this.userStoryInputTags = [];
      }
     
      if (!this.isSprintUserStories) {
        if (this.userStory.goalStatusId && this.userStory.goalStatusId.toLowerCase() === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
          this.isActiveGoalStatusId = true;
          this.isUserStoryStatusDisabledForActive = true;
          this.isUserStoryStatusDisabled = false;
        }
        else if (this.userStory.goalStatusId && this.userStory.goalStatusId.toLowerCase() === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
          this.isBacklogGoalStatusId = true;
          this.isUserStoryStatusDisabledForActive = false;
          this.isUserStoryStatusDisabled = true;
        }
        else if (this.userStory.goalStatusId && this.userStory.goalStatusId.toLowerCase() === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
          this.isReplanGoalStatusId = true;
          this.isUserStoryStatusDisabledForActive = false;
          this.isUserStoryStatusDisabled = true;
        }

      } else {
        if (!this.userStory.isReplan && this.userStory.sprintStartDate) {
          this.isActiveGoalStatusId = true;
          this.isUserStoryStatusDisabled = false;
        } else if (!this.userStory.isReplan && !this.userStory.sprintStartDate) {
          this.isBacklogGoalStatusId = true;
          this.isUserStoryStatusDisabled = true;
        } else {
          this.isReplanGoalStatusId = true;
          this.isUserStoryStatusDisabled = true;
        }
      }
      this.estimatedTime = this.userStory.estimatedTime;
      this.checkMainUsIsQAApproved(this.userStory.subUserStoriesList);
      this.bindAssigneeValues();
      this.cdRef.markForCheck();
    }
  }

  checkMainUsIsQAApproved(subUserStories) {
    if (subUserStories.length > 0) {
      var filteredUserstories = subUserStories.filter(function (userStory) {
        return (userStory.taskStatusOrder == 4 || userStory.taskStatusOrder == 6)
      })
      if (filteredUserstories.length == subUserStories.length) {
        this.isMainUSApproved = true;
      } else {
        this.isMainUSApproved = false;
      }
    } else {
      this.isMainUSApproved = true;
    }
  }

  loadBoardTypeUi() {
    if (this.userStory && this.userStory.isBugBoard) {
      this.isKanbanBoard = true;
      this.isSuperagileBoard = false;
      this.store.dispatch(new LoadBugPriorityTypesTriggered());
      const projectFeature = new ProjectFeature();
      projectFeature.projectId = this.userStory.projectId;
      projectFeature.IsDelete = false;
      this.store.dispatch(new LoadFeatureProjectsTriggered(projectFeature));
      this.userStoryTypeId = this.bugUserStoryTypeModel != null ? this.bugUserStoryTypeModel.userStoryTypeId : null;
    }
    else if (this.userStory && this.userStory.isSuperAgileBoard) {
      this.isSuperagileBoard = true;
    }
  }


  getUserStoryChange(userStoryId) {
    let parentUserStoryIds = [];
    parentUserStoryIds.push(userStoryId);
    parentUserStoryIds.push(this.userStory.parentUserStoryId);
    var userStory = new UserStory();
    userStory.goalId = this.userStory.goalId;
    userStory.parentUserStoryId = userStoryId;
    userStory.parentUserStoryIds = parentUserStoryIds;
    userStory.timeStamp = this.userStory.timeStamp;
    userStory.userStoryId = this.userStoryId;
    userStory.goalId = this.userStory.goalId;
    userStory.sprintId = this.userStory.sprintId;
    userStory.isFromSprint = this.isSprintUserStories;
    if (this.isSprintUserStories) {
      this.store.dispatch(new UpdateSprintSubTaskUserStoryTriggered(userStory));
    } else {
      this.store.dispatch(new userStoryActions.UpdateSubTaskUserStoryTriggered(userStory));
    }
  }

  checkPermissionForAddLinks(addPermission) {
    if (this.isAllGoalsPage && this.isPermissionForCreatingSubLinks) {
      return true;
    }
    else if (!this.isAllGoalsPage && addPermission) {
      return true;
    }
    else {
      return false;
    }
  }

  checkPermissionForArchiveLinks(archivePermission) {
    if (this.isAllGoalsPage && this.isPermissionsForArchiveUserStoryLink) {
      return true;
    }
    else if (!this.isAllGoalsPage && archivePermission) {
      return true;
    }
    else {
      return false;
    }
  }

  checkDeadlineDateIsDisabled(activeDeadlineDate, backlogDeadlineDate, replanDeadlineDate) {
    if (this.isAllGoalsPage) {
      if (this.isInlineEditForUserStoryDeadlineDateInActive && this.isSuperagileBoard && this.isActiveGoalStatusId) {
        return true;
      }
      else if (this.isInlineEditForUserStoryDeadlineDateInActive && !this.isSuperagileBoard) {
        return false;
      }
      else if ((this.isInlineEditForUserStoryDeadlineDateInBacklog && this.isBacklogGoalStatusId) || (this.isInlineEditForUserStoryDeadlineDateInReplan && this.isReplanGoalStatusId)) {
        return false;
      }
      else {
        return true;
      }

    }
    else {
      if (activeDeadlineDate && this.isActiveGoalStatusId) {
        if (this.isSuperagileBoard) {
          return true;
        }
        else if (!this.isSuperagileBoard) {
          return false;
        }
      }
      else if ((backlogDeadlineDate && this.isBacklogGoalStatusId) || (replanDeadlineDate && this.isReplanGoalStatusId)) {
        return false;
      }
      else {
        return true;
      }
    }
  }

  checkUserStoryAssigneeIsDisabled(activeUserStoryAssignee, backloUserStoryAssignee, replanUserStoryAssignee) {
    if (this.isAllGoalsPage) {
      if ((this.isActiveGoalStatusId && this.isInlineEditForUserStoryOwnerInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForUserStoryOwnerInBacklog) || (this.isReplanGoalStatusId && this.isInlineEditForUserStoryOwnerInReplan)) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      if (this.isActiveGoalStatusId && !activeUserStoryAssignee) {
        return true;
      }
      else if (this.isBacklogGoalStatusId && !backloUserStoryAssignee) {
        return true;
      }
      else if (this.isReplanGoalStatusId && !replanUserStoryAssignee) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  checkUserStoryEstimatedIsDisabled(activeEstimatedTime, backlogEstimatedTime, replanEstimatedTime) {
    if (this.isAllGoalsPage) {
      if (this.isInlineEditForEstimatedTimeInActive && this.isSuperagileBoard && this.isActiveGoalStatusId) {
        return true;
      }
      else if (this.isInlineEditForEstimatedTimeInActive && !this.isSuperagileBoard) {
        return false;
      }

      else if ((this.isInlineEditForEstimatedTimeBacklog && this.isBacklogGoalStatusId) || (this.isInlineEditForEstimatedTimeInReplan && this.isReplanGoalStatusId)) {
        return false;
      }
      else {
        return true;
      }

    }
    else {
      if (activeEstimatedTime && this.isActiveGoalStatusId) {
        if (this.isSuperagileBoard) {
          return true;
        }
        else if (!this.isSuperagileBoard) {
          return false;
        }
        else {
          return true;
        }
      }
      else if ((backlogEstimatedTime && this.isBacklogGoalStatusId) || (replanEstimatedTime && this.isReplanGoalStatusId)) {
        return false;
      }
      else {
        return true;
      }
    }
  }

  checkUserStoryNameIsDisabled(activeUserStoryName, backlogUserStoryName, replanUserStoryName) {
    if (this.isAllGoalsPage) {
      if ((this.isActiveGoalStatusId && this.isInlineEditForUserStoryNameInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForUserStoryNameInBacklog) || (this.isReplanGoalStatusId && this.isInlineEditForUserStoryNameInReplan)) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      if (((this.isActiveGoalStatusId && !activeUserStoryName) || (this.isBacklogGoalStatusId && !backlogUserStoryName) || (this.isReplanGoalStatusId && !replanUserStoryName))) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  checkUserStoryDependencyIsDisabled(activeUserStoryDependency, backlogUserStoryDependency, replanUserStoryDependency) {
    if (this.isAllGoalsPage) {
      if ((this.isActiveGoalStatusId && this.isInlineEditForDependencyPersonInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForDependencyPersonInBacklog) || (this.isReplanGoalStatusId && this.isInlineEditForDependencyPersonInReplan)) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      if (this.isActiveGoalStatusId && !activeUserStoryDependency) {
        return true;
      }
      else if (this.isBacklogGoalStatusId && !backlogUserStoryDependency) {
        return true;
      }
      else if (this.isReplanGoalStatusId && !replanUserStoryDependency) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  checkProjectFeatureIsDisabled(activeProjectFeature, backlogProjectFeature) {
    if (this.isAllGoalsPage) {
      if ((this.isActiveGoalStatusId && this.isInlineEditForProjectFeatureInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForProjectFeatureInBacklog)) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      if ((this.isActiveGoalStatusId && !activeProjectFeature) || ((this.isBacklogGoalStatusId && !backlogProjectFeature))) {
        return true;
      }
      else {
        return false;
      }
    }
  }
  checkBugCausedUserIsDisabled(activeBugCausedUser, backlogBugCausedUser) {
    if (this.isAllGoalsPage) {
      if ((this.isActiveGoalStatusId && this.isInlineEditForBugCausedUserInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForBugCausedUserInBacklog)) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      if ((this.isActiveGoalStatusId && !activeBugCausedUser) || ((this.isBacklogGoalStatusId && !backlogBugCausedUser))) {
        return true;
      }
      else {
        return false;
      }
    }
  }
  checkBugPriorityIsDisabled(activeBugPriority, backlogBugPriority) {
    if (this.isAllGoalsPage) {
      if ((this.isActiveGoalStatusId && this.isInlineEditForBugPriorityInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForBugPriorityInBacklog)) {
        if (this.isActiveGoalStatusId) {
          return false;
        } else if (!this.isActiveGoalStatusId) {
          return false;
        }
        else {
          return true;
        }
      }
      else {
        return true;
      }
    }
    else {
      if ((this.isActiveGoalStatusId && !activeBugPriority) || ((this.isBacklogGoalStatusId && !backlogBugPriority))) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  openFileUpload() {
    this.isFileUpload = false;
    this.isExtension = false;
  }



  loadSections() {
    if (this.userStory && this.userStory.testSuiteId) {
      this.showSectionsDropDown = true;
      this.testSuiteId = this.userStory.testSuiteId;
      this.sectionId = this.userStory.testSuiteSectionId;
      this.testRailStore.dispatch(new LoadTestCaseSectionListTriggered(this.userStory.testSuiteId));
      this.sectionsList$ = this.testRailStore.pipe(select(testRailmoduleReducers.getTestCaseSectionAll));
    }
    else
      this.showSectionsDropDown = false;
  }

  loadBugsCount() {
    let bugsCountsModel = new TestCase();
    bugsCountsModel.userStoryId = this.userStoryId;
    bugsCountsModel.isSprintUserStories = this.isSprintUserStories;
    this.store.dispatch(new LoadBugsCountByUserStoryIdTriggered(bugsCountsModel));
  }

  updateSection(sectionId) {
    if (sectionId == 0) {
      sectionId = null;
    }
    this.sectionId = sectionId;
    this.saveUserStory();
  }

  openSectionPopover(sectionPopover) {
    var loader = this.projectModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modules, function (module: any) { return module.modulePackageName == 'TestRepoPackageModule' });

    if (!module) {
      console.error("No module found for TestRepoPackageModule");
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
          elementInArray.name.toLocaleLowerCase() === "Test Suite Section Edit".toLocaleLowerCase()
        );
        this.testSuitSectionEdit = {};
        this.testSuitSectionEdit.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        this.testSuitSectionEdit.inputs = {
          testSuiteId: this.testSuiteId,
          editingSection: this.sectionEdit
        };

        this.testSuitSectionEdit.outputs = {
          closeSection: param => this.closeSectionPopover()
        }

        this.loadSection = true;
        sectionPopover.openPopover();

        this.cdRef.detectChanges();
      });
  }

  closeSectionPopover() {
    this.loadSection = false;
    let popOver = this.addSectionPopover;
    if (popOver) popOver.close();
    // this.addSectionsPopover.forEach((p) => p.closePopover());
  }

  checkIsDraggable() {
    if (this.isSuperagileBoard) {
      if (this.isBacklogGoalStatusId || this.isReplanGoalStatusId || !this.isSprintUserStories) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (this.isActiveGoalStatusId || this.isBacklogGoalStatusId) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  // tslint:disable-next-line:member-ordering
  // public position = 'left';
  public onTabSelect(tabIndex) {
    if (tabIndex.index === 0) {
      this.projectId = this.userStory.projectId;
      this.goalId = this.userStory.goalId;
      this.sprintId = this.userStory.sprintId;
      this.getGoalsList();
      this.getSprintsList();
      this.isEditorVisible = false;
      this.selectedIndex = 'GENERAL';
    }
    else {
      this.selectedIndex = '';
    }
  }



  openCustomForm() {
    // const formsDialog = this.dialog.open(CustomFormsComponent, {
    //   height: '62%',
    //   width: '60%',
    //   hasBackdrop: true,
    //   direction: "ltr",
    //   data: { moduleTypeId: this.moduleTypeId, referenceId: this.userStoryId, referenceTypeId: this.projectId, customFieldComponent: null },
    //   disableClose: true,
    //   panelClass: 'custom-modal-box'
    // });
    // formsDialog.componentInstance.closeMatDialog.subscribe((result) => {
    //   this.dialog.closeAll();
    // });

  }

  checkIsDeletePermission(isDelete) {
    if (this.isAllGoalsPage && this.isPermissionToDeleteForm) {
      return true;
    } else if (!this.isAllGoalsPage && isDelete) {
      return true;
    } else {
      return false;
    }
  }

  checkIsAddPermission(isAdd) {
    if (this.isAllGoalsPage && this.isPermissionToAddOrUpdateForm) {
      return true;
    } else if (!this.isAllGoalsPage && isAdd) {
      return true;
    } else {
      return false;
    }
  }

  checkIsEditPermission(isUserStory) {
    if (this.isAllGoalsPage && this.isPermissionForUserStory) {
      return true;
    } else if (!this.isAllGoalsPage && isUserStory) {
      return true;
    } else {
      return false;
    }
  }

  openStatus() {
    this.ShowStatus = !this.ShowStatus;
  }

  openGoalField() {
    this.showGoalField = !this.showGoalField;
  }

  openAssignee() {
    this.showAssignee.open();
  }
  openEstimatedTime() {
    this.showEstimatedTime = !this.showEstimatedTime;
  }
  openDeadlineDate() {
    this.showDeadlineDate = !this.showDeadlineDate;
  }

  openFileUploadPopover(FileUploadPopup) {
    FileUploadPopup.openPopover();
  }


  closeFileUploadPopover() {
    this.FileUploadPopup.forEach((p) => p.closePopover());
  }

  openDependency() {
    this.ShowDependency = !this.ShowDependency;
  }

  enableEditor() {
    this.isEditorVisible = true;
  }


  openSectionField() {
    this.ShowSectionField = !this.ShowSectionField;
  }



  openVersionName() {
    this.ShowVersionName = !this.ShowVersionName;
  }

  openbugCausedUser() {
    this.ShowbugCausedUser = !this.ShowbugCausedUser;
  }

  openBugPriority() {
    this.ShowBugPriority = !this.ShowBugPriority;
  }

  openComponent() {
    this.ShowComponent = !this.ShowComponent;
  }

  togglePanel() {
    this.panelOpenState = !this.panelOpenState;
    this.expansionIcon = !this.expansionIcon;
  }

  recurringWorkItem(addCronExpressionPopUp) {
    if (this.isRecurringWorkItem) {
      addCronExpressionPopUp.openPopover();
      this.isEditScheduling = true;
    }
    else {
      this.isEditScheduling = false;
      this.upsertCronExpression(true);
    }
  }

  editCronExpression() {
    this.isEditScheduling = true;
    this.isRecurringWorkItem = true;
  }

  upsertCronExpression(isRecurringRemoved: boolean) {
    let recurringUserStoryModel = new UserStory();
    let cronExpressionDetails = new RecurringCronExpressionModel();
    cronExpressionDetails.isRecurringWorkItem = this.isRecurringWorkItem;
    cronExpressionDetails.customWidgetId = this.userStoryId;
    cronExpressionDetails.cronExpression = this.cronExpression;
    cronExpressionDetails.cronExpressionDescription = cronstrue.toString(this.cronExpression);
    cronExpressionDetails.cronExpressionId = this.cronExpressionId;
    cronExpressionDetails.cronExpressionTimeStamp = this.cronTimeStamp;
    cronExpressionDetails.jobId = this.jobId;
    cronExpressionDetails.isArchived = isRecurringRemoved;
    cronExpressionDetails.scheduleEndDate = this.scheduleType.value == 2 ? this.endDate.value : null;
    cronExpressionDetails.isPaused = this.isPaused;
    recurringUserStoryModel = Object.assign(recurringUserStoryModel, this.userStory);
    recurringUserStoryModel = Object.assign(recurringUserStoryModel, cronExpressionDetails);
    this.masterDataManagementService.UpsertRecurringUserStory(recurringUserStoryModel).subscribe((response: any) => {
      if (response.success === true) {
        this.closeCronExpressionPopUp();
        this.store.dispatch(new userStoryActions.GetUserStoryByIdTriggered(this.userStoryId));
        this.cronExpressionDescription = cronstrue.toString(response.data.cronExpression);
      } else {
        this.toastr.error(response.apiResponseMessages[0].message);
      }
    });
  }

  editCronExpressionPopup(addCronExpressionPopUp) {
    addCronExpressionPopUp.openPopover();
  }

  closeCronExpressionPopUp() {
    this.addCronExpressionPopUp.forEach((p) => p.closePopover());
    this.cronExpressionDescription = cronstrue.toString(this.cronExpression);
    this.userStory.scheduleEndDate == null ? this.scheduleType.setValue(1) : this.scheduleType.setValue(2);
    this.userStory.scheduleEndDate == null ? this.selectedSchedulingType = "1" : this.selectedSchedulingType = "2";
    this.endDate.setValue(this.userStory.scheduleEndDate);
  }

  cancelCronExpressionPopUp() {
    this.addCronExpressionPopUp.forEach((p) => p.closePopover());
    this.cronExpression = "0 10 1/1 * ?";
    this.cronExpression = this.userStory.cronExpression != null ? this.userStory.cronExpression : this.cronExpression;
    this.cronExpressionDescription = (this.userStory != null && this.userStory.cronExpression != null) ? cronstrue.toString(this.userStory.cronExpression) : null;
    this.isRecurringWorkItem = this.userStory.cronExpression != null ? true : false;
    this.isEditScheduling = this.cronExpressionId != null ? true : false;
    this.cronExpressionId = this.userStory.cronExpressionId;
    this.cronTimeStamp = this.userStory.cronExpressionTimeStamp;
    this.jobId = this.userStory.jobId;
    this.isPaused = this.userStory.isPaused;
    this.userStory.scheduleEndDate == null ? this.scheduleType.setValue("1") : this.scheduleType.setValue("2");
    this.endDate.setValue(this.userStory.scheduleEndDate);
    this.selectedSchedulingType = this.userStory.scheduleEndDate == null ? "1" : "2";
  }

  onEndTypeChanged(event) {
    this.selectedSchedulingType = event.value;
    if (this.selectedSchedulingType == "1") {
      this.endDate.setValue(null);
    } else if (this.selectedSchedulingType == "2") {
      this.endDate.setValue(this.minDate);
    }
  }

  loadCustomFieldModule() {
    var loader = this.projectModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modules, function (module: any) { return module.modulePackageName == 'CustomFieldsPackageModule' });

    if (!module) {
      console.error("No module found for CustomFieldsPackageModule");
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
          elementInArray.name.toLocaleLowerCase() === "Custom field comp".toLocaleLowerCase()
        );
        this.customFieldComponent = {};
        this.customFieldComponent.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        this.customFieldComponent.inputs = {
          moduleTypeId: this.moduleTypeId,
          referenceTypeId: this.formReferenceTypeId,
          referenceId: this.userStoryId,
          isEditFieldPermission: this.submitCustomFieldsInPM$
        };

        this.customFieldComponent.outputs = {
          refreshUserStory: app => {
            if (this.isSprintUserStories) {
              this.store.dispatch(new GetSprintWorkItemByIdTriggered(this.userStoryId, true))
            } else {
              this.store.dispatch(new userStoryActions.GetUserStoryByIdTriggered(this.userStoryId))
            }
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
            let isreload = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
            this.customFieldComponent.inputs = {
              moduleTypeId: this.moduleTypeId,
              referenceTypeId: this.formReferenceTypeId,
              referenceId: this.userStoryId,
              isEditFieldPermission: this.submitCustomFieldsInPM$,
              reload: isreload
            };
          }
        };
        this.customFieldModuleLoaded = true;

        this.cdRef.detectChanges();
      });
  }

  setStylesForAllGoals() {
    if (this.isAllGoalsPage) {
      let styles = {
        "max-height": "80vh"
      };
      return styles;
    }
  }

  getProjectChange(projectId) {
    this.projectId = projectId;
    this.getGoalsList();
    this.getSprintsList();
  }

  descriptionReset() {
    this.description = this.userStory.description;
    this.descriptionSlug = this.description;
  }

  cancelDescription() {
    this.descriptionSlug = this.description;
    this.description = this.userStory.description;
    this.isEditorVisible = false;
  }


  searchProjects() {
    var projectSearchResult = new ProjectSearchCriteriaInputModel();
    this.goalId = null;
    projectSearchResult.isArchived = false;
    this.projectService.searchProjects(projectSearchResult).subscribe((x: any) => {
      if (x.success) {
        this.projectsList = x.data;
      }
    })
  }

  setHeight() {
    if (this.isAllGoalsPage && this.isGoalUniquePage) {
      return 'all-goals_uniquepage';
    } else if (this.isAllGoalsPage && !this.isGoalUniquePage) {
      return 'all-goals_userstory';
    }
    else {
      return 'details_userstory';
    }
  }
  covertTimeIntoUtcTime(inputTime): string {
    if (inputTime == null || inputTime == "")
      return null;
    return this.datePipe.transform(inputTime, "yyyy-MM-dd HH:mm")
  }
  covertTimeIntoUtcTimes(inputTime): string {
    if (inputTime == null || inputTime == "")
      return null;
    return this.datePipe.transform(inputTime, "yyyy-MM-dd")
  }
}
