import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, Input, EventEmitter, Output, ViewChildren, Type, NgModuleRef, NgModuleFactoryLoader, NgModuleFactory, ViewContainerRef, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { FileRestrictions } from "@progress/kendo-angular-upload";
import { Observable, Subject, combineLatest } from "rxjs";
import { ofType, Actions } from "@ngrx/effects";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'underscore';
import * as projectModuleReducer from "../../store/reducers/index";
import { State } from "../../store/reducers/index";
import { tap, takeUntil, take, map } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ViewEncapsulation } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'


import { UserStory } from "../../models/userStory";
import { StatusesModel } from "../../models/workflowStatusesModel";

import { GetUniqueUserStoryByIdTriggered, GetUniqueUserStoryByUniqueIdTriggered, UserStoryActionTypes, UpdateSubTaskInUniquePageCompleted } from "../../store/actions/userStory.actions";
import { WorkflowStatus } from "../../models/workflowStatus";
import { LoadworkflowStatusTriggered } from "../../store/actions/work-flow-status.action";
import * as userStoryActions from "../../store/actions/userStory.actions";
import { LoadBugPriorityTypesTriggered, BugPriorityActionTypes } from "../../store/actions/bug-priority.action";
import { BugPriorityDropDownData } from "../../models/bugPriorityDropDown";
import { ProjectGoalsService } from "../../services/goals.service";
import { ProjectSummaryTriggered } from "../../store/actions/project-summary.action";
import { LoadUserStoryTypesTriggered, UserStoryTypesActionTypes } from "../../store/actions/user-story-types.action";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { ProjectMember } from "../../models/projectMember";
import { ProjectFeature } from "../../models/projectFeature";
import { GoalModel } from "../../models/GoalModel";
import { GoalSearchCriteriaInputModel } from "../../models/GoalSearchCriteriaInputModel";
import { CookieService } from 'ngx-cookie-service';
import { ComponentModel } from '@snovasys/snova-comments';
import { SprintWorkItemActionTypes, UpsertSprintWorkItemTriggered, GetUniqueSprintWorkItemByIdTriggered, MoveGoalUserStoryToSprintTriggered, UpdateUserStorySprintTriggered, GetUniqueSprintWorkItemByUniqueIdTriggered } from "../../store/actions/sprint-userstories.action";
import { ProjectMembersActionTypes, LoadMemberProjectsTriggered } from "../../store/actions/project-members.actions";
import { SprintModel } from "../../models/sprints-model";
import { SprintService } from "../../services/sprints.service";
import { CronOptions } from "cron-editor";
import cronstrue from 'cronstrue';
import { FormControl, Validators } from "@angular/forms";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { EntityRoleModel } from '../../models/entity-role-model';
import { CronExpressionModel, RecurringCronExpressionModel } from '../../models/cron-expression-model';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { FeatureIds } from '../../../globaldependencies/constants/feature-ids';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { EmployeeListModel } from '../../models/employee-model';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { CustomFormFieldModel } from '../../models/custom-fileds-model';
import { GetCustomFieldsTriggered, CustomFieldsActionTypes, CustomFieldsComponent } from "@snovasys/snova-custom-fields";
import { CustomFormsComponent } from "@snovasys/snova-custom-fields";
import * as customFieldReducers from "@snovasys/snova-custom-fields";
import { MenuItemService } from '../../services/feature.service';
import { TestCaseDropdownList, TestSuiteSectionEditComponent, TestSuitesViewComponent } from '@snovasys/snova-testrepo';
import { LoadTestCaseSectionListTriggered } from '@snovasys/snova-testrepo';
import * as testRailmoduleReducers from "@snovasys/snova-testrepo";
import { LoadUserstoryHistoryTriggered } from '../../store/actions/userstory-history.action';
import { WorkItemDialogComponent } from './work-item-dailogue.component';
import { ProjectModulesService } from '../../services/project.modules.service';
import { ProjectSearchCriteriaInputModel } from '../../models/ProjectSearchCriteriaInputModel';
import { ProjectService } from '../../services/projects.service';
import { ProjectSearchResult } from '../../models/ProjectSearchResult';
import { WorkFlowService } from '../../services/workFlow.Services';
import { LoadFeatureProjectsTriggered } from '../../store/actions/project-features.actions';
import { ActionCategory } from '../../models/action-category.model';
import { DatePipe } from "@angular/common";
import * as moment_ from 'moment';
const moment = moment_;
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

@Component({
  selector: "app-userstory-unique-detail",
  templateUrl: "userstory-unique-detail.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
   @media only screen and (max-width: 1440px) {
    .goal-create-height {
      max-height: 245px;
      overflow-x: hidden !important;
    }
  }
  `]
})
export class UserStoryUniqueDetailComponent extends AppFeatureBaseComponent implements OnInit {
  testSuitSectionEdit: any = {};
  questions: any = [];
  isQuestioinLoading: boolean;
  latestChangedQuestionId: any;
  questionName: string;
  loadingUserStory: boolean;
  @Input("userStoryId")
  set _userStoryId(data: string) {
    if (data) {
      this.userStoryId = data;
      let userStoryTypesModel = new UserStoryTypesModel();
      userStoryTypesModel.isArchived = false;
      this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel));
      this.isFromRouteParams = true;
    }
  }


  @Input("Ids")
  set _Ids(Ids) {
    this.userStoryId = Ids;
    this.setDataForApp();
  }

  isFromBugsCount
  @Input("isFromBugsCount")
  set _isFromBugsCount(data: any) {
    this.isFromBugsCount = data;
  }
  @Input("isUniqueFromProjects")
  set _isUniqueFromProjects(data: boolean) {
    if (data === false) {
      this.isUniqueFromProjects = false
      this.isUserStoriesPage = true;
    }
    else {
      this.isUniqueFromProjects = true;
      this.isUserStoriesPage = true;
    }
  }

  @Input("isFromSprints")
  set _isFromSprints(data: boolean) {
    this.isSprintUserStories = data;
    this.isUserStoriesPage = true;
    this.getEntityRoleFeatures();
    this.store.dispatch(new LoadBugPriorityTypesTriggered());
    this.GetUserStoryDetails(this.isSprintUserStories);
    this.selectedTab = 'History';
    let userStoryTypesModel = new UserStoryTypesModel();
    userStoryTypesModel.isArchived = false;
    localStorage.setItem("isUniquePage", 'true');
    if (this.isSprintUserStories) {
      this.referenceTypeId = ConstantVariables.SprintUserStoryReferenceId;
    } else {
      this.referenceTypeId = ConstantVariables.UserStoryReferenceTypeId;
    }
  }

  @Input('notFromAudits')
  set _notFromAudits(data: boolean) {
    if (data || data == false) {
      this.notFromAudits = data;
      if (!this.notFromAudits) {
        this.getUserList();
      }
    }
    else
      this.notFromAudits = true;
  }

  @Input("isFromUrl")
  set _isFromUrl(data: boolean) {
    if (data || data == false) {
      this.isFromUrl = data;
    } else {
      this.isFromUrl = true;
    }
  }

  @ViewChild('fileUpload') fileUploadExample: ElementRef;
  fileRestrictions: FileRestrictions = {
    allowedExtensions: environment.fileExtensions,
    maxFileSize: environment.maxFileSize
  };
  @ViewChild("archiveUserStoryPopover") archiveUserStory: SatPopover;
  @ViewChild("parkUserStoryPopover") parkUserStoryPopUp: SatPopover;
  @ViewChild("editUserstoryPopover") editUserStoryPopUp: SatPopover;
  @ViewChild("editUserStoryMenuPopover") editUserStoryMenuPopover: SatPopover;
  @ViewChild("userstoryTagsPopover") userStorytagsPopUp: SatPopover;
  @ViewChild("createSubTaskPopover") createSubTaskPopUp: SatPopover;
  @ViewChild("projectMemberPopover") projectMemberPopUp: SatPopover;
  @ViewChildren("addCronExpressionPopUp") addCronExpressionPopUp;
  @ViewChildren("addSection") addSectionsPopover;
  @ViewChild("addSection") addSectionPopover: SatPopover;

  @Output() toggleUserStory = new EventEmitter<string>();
  @Output() closeUniqueUserStory = new EventEmitter<string>();
  @Output() closeReportsSheetPopup = new EventEmitter<any>();
  canAccess_feature_ViewProjects$: Observable<Boolean>;
  accessViewProjects: Boolean;
  isFromRouteParams: boolean;
  isFromUrl: boolean = true;
  isLoadingGoals: boolean;
  isLoadingSprints: boolean;
  canAccess_feature_ViewAuditActions: boolean;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  customFields$: Observable<CustomFormFieldModel[]>;
  customFieldsInProgress$: Observable<boolean>;
  softLabels: SoftLabelConfigurationModel[];
  entityRolePermisisons$: Observable<EntityRoleModel[]>;
  sectionsList$: Observable<TestCaseDropdownList[]>;
  entityRolePermisisons: EntityRoleModel[];
  projectsList: ProjectSearchResult[];
  showSectionsDropDown: boolean;
  isPermissionForSection: boolean;
  loadSection: boolean;
  isProjectChange: boolean;
  testSuiteId: string;
  sectionEdit: string = ConstantVariables.SectionNotEditable;
  sectionId: string;
  userStoryDetails$: Observable<UserStory>;
  descriptionLoading$: Observable<boolean>;
  userStoryStatus$: Observable<StatusesModel[]>;
  userStoryStatusList: StatusesModel[];
  userstoryid: string;
  parentUserStoryGoalId: string;
  isTestrailLoaded: boolean;
  userStoryDetails: UserStory = new UserStory();
  userStoryName: string;
  userStoryNameDuplicate: string;
  selectedTab: string;
  public ngDestroyed$ = new Subject();
  injector: any;
  customFieldComponent: any;
  testSuitView: any;
  customFieldModuleLoaded: boolean;
  actionCategories = [];

  public initSettings = {
    plugins: "paste lists advlist",
    branding: false,
    //powerpaste_allow_local_images: true,
    //powerpaste_word_import: 'prompt',
    //powerpaste_html_import: 'prompt',
    toolbar: 'link image code'
  };

  public schedulingEnds = [{ endType: 'Never', code: 1 },
  { endType: 'ON', code: 2 }
  ]
  questionReferenceTypeId = ConstantVariables.AuditQuestionsReferenceTypeId;
  workflowStatus$: Observable<WorkflowStatus[]>;
  workflowStatus: WorkflowStatus[];
  projectMembers$: Observable<ProjectMember[]>;
  projectFeatures$: Observable<ProjectFeature[]>;
  bugPriorities$: Observable<BugPriorityDropDownData[]>;
  //uploadedFiles$: Observable<FileInputModel[]>;
  anyOperationInProgress$: Observable<any>;
  loadingEntityFeatures$: Observable<boolean>;
  goals: GoalModel[];
  projectMembers: ProjectMember[];
  bugPriorities: BugPriorityDropDownData[];
  userStoryTypes$: Observable<UserStoryTypesModel[]>;
  userStoryTypes: UserStoryTypesModel[];
  sprintsList: SprintModel[];
  bugUserStoryTypeModel: UserStoryTypesModel;
  userStoryTypeModel: UserStoryTypesModel;
  userStories: UserStory[];
  showassignee: boolean;
  dropdowns: any[];
  isDateTimeConfiguration: boolean;
  isUniqueFromProjects: boolean = true;
  notFromAudits: boolean = true;
  userStoryId: string;
  isReplan: boolean;
  isUserStoriesPage: any;
  userStoryStatusId: string;
  actionCategoryId: string;
  userStoryUniqueName: string;
  estimatedTimeSet: string;
  assignee: string;
  estimatedTime: any;
  deadLineDate: Date;
  dependencyUserId: string;
  selectedSchedulingType: string;
  goalId: string;
  projectId: string;
  isTagsPopUp: boolean;
  description: any;
  descriptionSlug: any;
  bugCausedUserId: string;
  bugPriorityId: string;
  projectFeatureId: string;
  parentUserStoryId: string;
  isQaRequired: boolean;
  isLogTimeRequired: boolean;
  userStoryStatusColor: string;
  tag: string;
  timeStamp: any;
  isForQa: boolean;
  userStoryTypeId: string;
  isLogTimeTab: boolean;
  isStatusChanged: boolean;
  isGoalChanged: boolean;
  isNewUserStory: boolean;
  entityFeatureIds: any;
  filesUploaded: any;
  isPermissionsForUserStoryComments: boolean = true;
  isPermissionForFileUpload: boolean;
  isPermissionForUserStory: boolean;
  isPermissionForVersionName: boolean;
  goalStatusId: any;
  isUserStoryStatus: boolean;
  isSuperagileBoard: boolean;
  isKanbanBoard: boolean;
  onboardProcessDate: any;
  isEditUserStoryName: boolean = false;
  isUniqueDetailsPage: boolean;
  isPermisisontoChangeGoal: boolean;
  isPermissionForProjectFeature: boolean;
  isPermissionForBugPriority: boolean;
  isPermisisonForBugCausedUser: boolean;
  isPermissionForEstimatedTime: boolean;
  isPermissionForDeadlineDate: boolean;
  isPermissionForUserStoryStatus: boolean;
  isPermissionForUserStoryOwner: boolean;
  isPermissionForBugCausedUser: boolean;
  isPermissionForDependencyPerson: boolean;
  isPermissionForViewUserStories: boolean = true;
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
  canEditUserStoryInSuperagileGoal: boolean;
  isPermissionForViewSubLinks: boolean;
  isPermisisontoChangeSprint: boolean;
  isPermissionForCreatingSubLinks: boolean;
  isPermissionForMovingUserStoryTask: boolean;
  isPermissionsForArchiveUserStoryLink: boolean;
  isPermissionToAddOrUpdateForm: boolean;
  isPermissionToDeleteForm: boolean;
  isActiveGoalStatusId: boolean;
  isBacklogGoalStatusId: boolean;
  isReplanGoalStatusId: boolean;
  isBugBoard: boolean;
  isFileUpload: boolean;
  isSprintsConfiguration: boolean;
  isPermissionForArchiveUserStory: boolean;
  isPermissionForParkUserStory: boolean;
  isArchived: boolean;
  isParked: boolean;
  userstoryUniquePage: boolean;
  versionName: string;
  sprintEstimatedTime: any;
  validationForVersionName: boolean;
  archiveButtonToolTip: string;
  sprintId: string;
  parkButtonToolTip: string;
  isExtension: boolean = false;
  isSprintUserStories: boolean;
  actionButtonEnable: boolean;
  isEditorVisible: boolean = false;
  loadprojectMember: boolean;
  clearProjectMemberForm: boolean;
  isAllGoalsPage: boolean = false;
  isCreateSubTask: boolean;
  count: any = 0;
  userStoryInputTags: any[] = [];
  userList = [];
  isCreatingUserStoryTags: boolean;
  isCreatingSubTask: boolean;
  selectedStoreId: null;
  moduleTypeId: number = 4;
  formReferenceTypeId: string;
  isValidation: boolean;
  referenceTypeId: string;
  isProjectRole: boolean = true;
  ragStatus: string;
  isButtonVisible: boolean = true;
  componentModel: ComponentModel = new ComponentModel();
  isRecurringWorkItem: boolean = false;
  isEditScheduling: boolean = false;
  cronExpressionId: string;
  cronTimeStamp: string;
  jobId: string;
  public cronExpression = "0 10 1/1 * ?";
  minDate = new Date();
  endDate = new FormControl('', Validators.compose([Validators.required]));
  scheduleType = new FormControl('', Validators.compose([]));
  cronExpressionDescription: string;
  public isCronDisabled = false;
  isPaused: boolean = false;
  startDate: Date;

  public cronExpressionModel: CronExpressionModel;
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
  isEditWIName = false;
  ragColors: any[] = [];
  isMainUSApproved: boolean;
  isSavingInProgress: boolean = false;
  canAccess_feature_CanSubmitCustomFieldsForProjectManagement: Boolean;
  myControl = new FormControl();
  @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;

  constructor(
    private store: Store<State>,
    private testRailStore: Store<testRailmoduleReducers.State>,
    private goalService: ProjectGoalsService,
    private route: ActivatedRoute,
    private actionUpdates$: Actions,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
    private softLabelsPipe: SoftLabelPipe,
    private cookieService: CookieService,
    private sprintsService: SprintService,
    private masterDataManagementService: MasterDataManagementService,
    private featureService: MenuItemService,
    private ngModuleRef: NgModuleRef<any>,
    private vcr: ViewContainerRef,
    private ps: ProjectModulesService,
    private projectService: ProjectService,
    private workflowService: WorkFlowService,
    private datePipe: DatePipe, private compiler: Compiler,
    @Inject('ProjectModuleLoader') public projectModulesService: any
  ) {
    super();
    this.injector = this.vcr.injector;
    this.isPermissionForViewUserStories = true;
    this.dropdowns = [
      {
        name: 'Comment',
        value: 'Comment'
      },
      {
        name: 'Worklog',
        value: 'Worklog'
      },
      {
        name: 'History',
        value: 'History'
      },
      {
        name: 'Sub tasks',
        value: 'Sub tasks'
      },
      {
        name: 'Link work items',
        value: 'Link work items'
      },
      {
        name: 'Bugs',
        value: 'Bugs'
      },
      {
        name: 'Test cases',
        value: 'Test cases'
      },
      {
        name: 'Scenario history',
        value: 'Scenario history'
      },
      {
        name: 'Custom field history',
        value: 'Custom field history'
      }
    ];
    this.searchProjects();
    this.getActionCategories();
    this.loadTestRepoModule();
    let roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.accessViewProjects = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjects.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAuditActions = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAuditActions.toString().toLowerCase(); }) != null;
    //this.userStoryDetails = new UserStory();
    if (this.router.url.includes('dashboard') || this.router.url.includes('goal') || this.router.url.includes('audits') || this.router.url.includes('action') || this.router.url.includes('projectstatus')) {
      this.isUniqueFromProjects = false;
      this.isUserStoriesPage = true;
    }
    else {
      if (this.router.url.includes('sprint')) {
        this.isSprintUserStories = true;
        this.referenceTypeId = ConstantVariables.SprintUserStoryReferenceId;
      } else {
        this.isSprintUserStories = false;
        this.referenceTypeId = ConstantVariables.UserStoryReferenceTypeId;
      }

      combineLatest(this.route.params, this.route.fragment)
        .pipe(map(results => ({ params: results[0], fragment: results[1] })))
        .subscribe(results => {
          if (results.fragment) {
            if (!this.isFromRouteParams) {
              this.getEntityRoleFeaturesByUserId();
              this.store.dispatch(new LoadBugPriorityTypesTriggered());
              this.store.dispatch(new GetUniqueUserStoryByUniqueIdTriggered(results.params.id));
            }
          } else {
            this.userStoryId = results.params.id;
            if (!this.isFromRouteParams && this.userStoryId) {
              this.getEntityRoleFeaturesByUserId();
              this.store.dispatch(new LoadBugPriorityTypesTriggered());
              if (this.isSprintUserStories) {
                this.store.dispatch(new GetUniqueSprintWorkItemByIdTriggered(this.userStoryId));
              } else {
                this.store.dispatch(new GetUniqueUserStoryByIdTriggered(this.userStoryId));
              }
            }
          }
        });

    }
    if (this.router.url.includes('dashboard') || this.router.url.includes('audits') || this.router.url.includes('action') || this.router.url.includes('projectstatus') || this.router.url.includes('workitem')) {
      this.isUserStoriesPage = true;
    }
    else if (this.router.url.includes('action')) {
      this.notFromAudits = false;
      this.cdRef.markForCheck();
    }
    this.isUniqueFromProjects = true;
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryTypesActionTypes.LoadUserStoryTypesCompleted),
        tap(() => {
          this.userStoryTypes$ = this.store.pipe(select(projectModuleReducer.getUserStoryTypesAll));
          this.userStoryTypes$.subscribe(x => {
            this.userStoryTypes = x;
            this.cdRef.markForCheck();
          });
          this.bugUserStoryTypeModel = this.userStoryTypes.find(x => x.isBug);
          this.userStoryTypeModel = this.userStoryTypes.find(x => x.isUserStory);
          this.loadBoardTypeUi();
        })
      )
      .subscribe();


    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryActionTypes.GetUniqueUserStoryByIdCompleted),
        tap(() => {
          this.isPermissionForViewUserStories = true;
          this.userStoryDetails$ = this.store.pipe(select(projectModuleReducer.getUserStoryById));
          this.userStoryDetails$.subscribe(x => this.userStoryDetails = x);
          if (this.userStoryDetails.auditConductQuestionId) {
            this.setConductValueValue();
          }
          this.projectId = this.userStoryDetails.projectId;
          this.userStoryId = this.userStoryDetails.userStoryId;
          this.selectedTab = "History";
          this.loadSections();
          if (this.userStoryDetails.isFromSprints) {
            this.isSprintUserStories = true;
            this.referenceTypeId = ConstantVariables.SprintUserStoryReferenceId;
            if (this.userStoryDetails.sprintStartDate && !this.userStoryDetails.isReplan) {
              this.isActiveGoalStatusId = true;
              this.isBacklogGoalStatusId = false;
              this.isUserStoryStatus = false;
            } else if (!this.userStoryDetails.isReplan && !this.userStoryDetails.sprintStartDate) {
              this.isBacklogGoalStatusId = true;
              this.isActiveGoalStatusId = false;
              this.isUserStoryStatus = true;
            }
          } else {
            this.isSprintUserStories = false;
            this.referenceTypeId = ConstantVariables.UserStoryReferenceTypeId;
            if (this.userStoryDetails && this.userStoryDetails.goalStatusId && this.userStoryDetails.goalStatusId.toLowerCase() === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
              this.isActiveGoalStatusId = true;
              this.isUserStoryStatus = false;
            }
            else if (this.userStoryDetails && this.userStoryDetails.goalStatusId && this.userStoryDetails.goalStatusId.toLowerCase() === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
              this.isBacklogGoalStatusId = true;
              this.isUserStoryStatus = true;
            }
            else if (this.userStoryDetails && this.userStoryDetails.goalStatusId && this.userStoryDetails.goalStatusId.toLowerCase() === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
              this.isReplanGoalStatusId = true;
              this.isUserStoryStatus = true;
            }
          }
          this.formReferenceTypeId = this.userStoryDetails.userStoryTypeId;
          this.loadCustomFieldModule();

          this.getGoalsList();
          this.getSprintsList();
          this.getUserStoriesList();
          this.loadBoardTypeUi();
          this.userStoryDetailsBinding();
          this.workflowid();
          this.checkPermissionForUserStory();
          // this.getProjectMembersCount();
          this.cdRef.markForCheck();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpdateUserStoryGoaalFailed),
        tap(() => {
          this.userStoryDetailsBinding();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpdateUserStorySprintFailed),
        tap(() => {
          this.userStoryDetailsBinding();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.GetUniqueSprintWorkItemByIdCompleted),
        tap(() => {
          this.isPermissionForViewUserStories = true;
          this.userStoryDetails$ = this.store.pipe(select(projectModuleReducer.getUniqueSprintWorkItem));
          this.userStoryDetails$.subscribe(x => this.userStoryDetails = x);
          this.projectId = this.userStoryDetails.projectId;
          this.userStoryId = this.userStoryDetails.userStoryId;
          this.selectedTab = "History";
          this.store.dispatch(new LoadMemberProjectsTriggered(this.userStoryDetails.projectId));
          this.loadSections();
          this.formReferenceTypeId = this.userStoryDetails.userStoryTypeId;
          this.loadCustomFieldModule();
          if (this.userStoryDetails.sprintStartDate && !this.userStoryDetails.isReplan) {
            this.isActiveGoalStatusId = true;
            this.isBacklogGoalStatusId = false;
            this.isUserStoryStatus = false;
          } else if (!this.userStoryDetails.isReplan && !this.userStoryDetails.sprintStartDate) {
            this.isBacklogGoalStatusId = true;
            this.isActiveGoalStatusId = false;
            this.isUserStoryStatus = true;
          }
          this.getGoalsList();
          this.getSprintsList();
          this.getUserStoriesList();
          // this.getProjectMembersCount();
          this.userStoryDetailsBinding();
          this.loadBoardTypeUi();
          this.workflowid();
          this.checkPermissionForUserStory();
          this.cdRef.markForCheck();
        })
      )
      .subscribe();


    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryActionTypes.CreateUserStoryFailed),
        tap(() => {
          this.userStoryDetailsBinding();
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpsertSprintWorkItemFailed),
        tap(() => {
          this.userStoryDetailsBinding();
        })
      ).subscribe();


    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.GetUserStoryByIdCompleted),
        tap(() => {
          this.userStoryDetails$ = this.store.pipe(select(projectModuleReducer.getUserStoryById));
          this.userStoryDetails$.subscribe(x => this.userStoryDetails = x);
          if (this.userStoryDetails.userStoryTypeId != this.userStoryTypeId) {
            this.loadCustomFieldModule();
          }
          this.timeStamp = this.userStoryDetails.timeStamp;
          this.isEditorVisible = false;
          this.userStoryDetailsBinding();
          this.store.dispatch(new LoadUserstoryHistoryTriggered(this.userStoryDetails.userStoryId))
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.GetSprintWorkItemByIdCompleted),
        tap(() => {
          this.userStoryDetails$ = this.store.pipe(select(projectModuleReducer.getSprintWorkItemById));
          this.userStoryDetails$.subscribe(x => this.userStoryDetails = x);
          if (this.userStoryDetails.userStoryTypeId != this.userStoryTypeId) {
            this.loadCustomFieldModule();
          }
          this.timeStamp = this.userStoryDetails.timeStamp;
          this.isEditorVisible = false;
          this.userStoryDetailsBinding();
          this.store.dispatch(new LoadUserstoryHistoryTriggered(this.userStoryDetails.userStoryId))
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpdateUserStoryGoalCompleted),
        tap(() => {
          if (!this.isFromRouteParams) {
            this.store.dispatch(new GetUniqueUserStoryByIdTriggered(this.userStoryId));
          } else {
            this.GetUserStoryDetails(this.isSprintUserStories);
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpdateSubTaskUserStoryCompleted),
        tap(() => {
          if (!this.isFromRouteParams) {
            this.store.dispatch(new GetUniqueUserStoryByIdTriggered(this.userStoryId));
          } else {
            this.GetUserStoryDetails(this.isSprintUserStories);
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpdateMultipleUserStories),
        tap(() => {
          this.store.dispatch(new GetUniqueUserStoryByIdTriggered(this.userStoryId));
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectMembersActionTypes.LoadProjectMembersCompleted),
        tap(() => {
          let projectMembers = [];
          this.projectMembers$ = this.store.pipe(
            select(projectModuleReducer.getProjectMembersAll)
          );
          this.projectMembers$.subscribe(result => {
            this.projectMembers = result;
            projectMembers = this.projectMembers;
            let currentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
            if (currentUserId) {
              let filteredList = projectMembers.filter(function (member) {
                return member.projectMember.id == currentUserId
              })
              if (filteredList.length > 0) {
                this.isProjectRole = true;
              } else {
                this.isProjectRole = false;
              }
            }
            this.cdRef.markForCheck();
          });
          this.userStoryDetailsBinding();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(BugPriorityActionTypes.LoadBugPriorityTypesCompleted),
        tap(() => {
          this.bugPriorities$ = this.store.pipe(select(projectModuleReducer.getBugPriorityAll));
          this.bugPriorities$.subscribe(result => {
            this.bugPriorities = result;
            this.cdRef.markForCheck();
          });
          this.userStoryDetailsBinding();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpdateMultipleSprintWorkItemField),
        tap(() => {
          if (!this.isFromRouteParams) {
            this.store.dispatch(new GetUniqueSprintWorkItemByIdTriggered(this.userStoryId));
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpdateUserStorySprintCompleted),
        tap(() => {
          if (!this.isFromRouteParams) {
            this.store.dispatch(new GetUniqueSprintWorkItemByIdTriggered(this.userStoryId));
          }
        })
      )
      .subscribe();
    let userStoryTypesModel = new UserStoryTypesModel();
    userStoryTypesModel.isArchived = false;
    this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel));
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    let roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures))
    this.canAccess_feature_CanSubmitCustomFieldsForProjectManagement = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_CanSubmitCustomFieldsForProjectManagement.toString().toLowerCase(); }) != null;

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
      }
    ]
    // this.loadingEntityFeatures$ = this.store.pipe(select(sharedModuleReducers.getUserEntityFeaturesLoading));
    const userStoryIsInProgress$ = this.store.pipe(
      select(projectModuleReducer.getUniqueUserStoryById)
    );
    const sprintUserStoryIsInProgress$ = this.store.pipe(
      select(projectModuleReducer.getUniqueSprintWorkItemsLoading)
    );
    const sprintOperationIsInProgress$ = this.store.pipe(
      select(projectModuleReducer.upsertSprintworkItemsLoading)
    );

    const anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.createUserStoryLoading)
    );

    const getUserStoryByIdLoading$ = this.store.pipe(
      select(projectModuleReducer.getUniqueUserStoryById)
    );

    const updateUserStoryGoalIsInProgress$ = this.store.pipe(
      select(projectModuleReducer.updateUserStoryGoalInProgress)
    );


    const descriptionLoading$ = this.store.pipe(
      select(projectModuleReducer.createUserStoryLoading)
    );

    const archiveUserStoryIsInProgress$ = this.store.pipe(
      select(projectModuleReducer.archiveUserStoryIsInProgress)
    );

    const parkUserStoryIsInProgress$ = this.store.pipe(
      select(projectModuleReducer.parkUserStoryInProgress)
    );

    this.anyOperationInProgress$ = combineLatest(
      getUserStoryByIdLoading$,
      updateUserStoryGoalIsInProgress$,
      sprintUserStoryIsInProgress$,
      sprintOperationIsInProgress$,
      anyOperationInProgress$,
      descriptionLoading$,
      archiveUserStoryIsInProgress$,
      parkUserStoryIsInProgress$

    ).pipe(
      map(
        ([
          getUniqueUserStoryById,
          updateUserStoryGoalInProgress,
          getUniqueSprintWorkItemsLoading,
          upsertSprintworkItemsLoading,
          createuserStoryLoading,
          archiveUserStoryIsInProgress,
          parkUserStoryInProgress

        ]) =>
          getUniqueUserStoryById ||
          updateUserStoryGoalInProgress ||
          getUniqueSprintWorkItemsLoading ||
          upsertSprintworkItemsLoading ||
          createuserStoryLoading ||
          archiveUserStoryIsInProgress ||
          parkUserStoryInProgress
      )
    );
    this.dropdowns = [
      {
        name: 'Comment',
        value: 'Comment'
      },
      {
        name: 'Worklog',
        value: 'Worklog'
      },
      {
        name: 'History',
        value: 'History'
      },
      {
        name: 'Sub tasks',
        value: 'Sub tasks'
      },
      {
        name: 'Link work items',
        value: 'Link work items'
      },
      {
        name: 'Bugs',
        value: 'Bugs'
      },
      {
        name: 'Test cases',
        value: 'Test cases'
      },
      {
        name: 'Scenario history',
        value: 'Scenario history'
      },
      {
        name: 'Custom field history',
        value: 'Custom field history'
      }
    ];

    // setting component model to pass default variable values
    this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
    this.componentModel.backendApi = environment.apiURL;
    this.componentModel.parentComponent = this;
    this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
  }


  getEntityRoleFeaturesByUserId() {
    this.featureService.getAllPermittedEntityRoleFeaturesByUserId().subscribe((features: any) => {
      if (features.success == true) {
        localStorage.setItem(LocalStorageProperties.UserRoleFeatures, JSON.stringify(features.data));
      }
    })
  }

  getEntityRoleFeatures() {
    this.featureService.getAllPermittedEntityRoleFeaturesByUserId().subscribe((features: any) => {
      if (features.success == true) {
        localStorage.setItem(LocalStorageProperties.UserRoleFeatures, JSON.stringify(features.data));
      }
    })
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  getUserList() {
    let userModel = new EmployeeListModel();
    userModel.isArchived = false;
    this.masterDataManagementService.getAllEmployees(userModel).subscribe((response: any) => {
      this.userList = response.data;
      // this.userStoryDetailsBinding();
      this.cdRef.markForCheck();
    });
  }

  loadBoardTypeUi() {
    if (this.userStoryDetails && this.userStoryDetails.isBugBoard) {
      this.isKanbanBoard = false;
      this.isSuperagileBoard = false
    }
    else if (this.userStoryDetails && this.userStoryDetails.isSuperAgileBoard) {
      this.isSuperagileBoard = true;
    } else {
      this.isKanbanBoard = true;
    }
  }


  setRagStatus(value) {
    this.ragStatus = value;
    this.saveUserStory();
  }


  getSprintChange(sprintId) {
    var sprintsList = this.sprintsList;
    this.sprintId = sprintId;
    var userStoryModel = new UserStory();
    userStoryModel.userStoryId = this.userStoryDetails.userStoryId;
    userStoryModel.timeStamp = this.timeStamp;
    userStoryModel.userStoryUniqueName = this.userStoryUniqueName;
    userStoryModel.oldSprintId = this.userStoryDetails.sprintId;
    userStoryModel.isFromSprint = this.isSprintUserStories;
    userStoryModel.sprintId = this.sprintId;
    const filteredList = _.filter(sprintsList, function (s) {
      return sprintId.includes(s.sprintId);
    });
    if (this.userStoryDetails.goalId) {
      if (this.userStoryDetails.boardTypeId == filteredList[0].boardTypeId) {
        this.store.dispatch(new UpdateUserStorySprintTriggered(userStoryModel));
      } else {
        this.toastr.error('', this.translateService.instant('USERDETAIL.PLEASESELECTSPRINTWITHSAMEBOARDTYPE'));
      }
    } else {
      this.store.dispatch(new UpdateUserStorySprintTriggered(userStoryModel));
    }
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
      this.isLoadingSprints = false;;
      this.sprintsList = responseData.data;
      this.cdRef.markForCheck();
    });

  }

  setDataForApp() {
    this.isUniqueFromProjects = false
    this.isUserStoriesPage = true;
    this.isSprintUserStories = false;
    this.isUserStoriesPage = true;
    //this.store.dispatch(new EntityRolesByUserIdFetchTriggered(this.userStoryId, 'userStory', this.isSprintUserStories));
    this.selectedTab = 'History';
    let userStoryTypesModel = new UserStoryTypesModel();
    userStoryTypesModel.isArchived = false;
    this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel));
    localStorage.setItem("isUniquePage", 'true');
    this.store.dispatch(new GetUniqueUserStoryByIdTriggered(this.userStoryId));
    if (this.isSprintUserStories) {
      this.referenceTypeId = ConstantVariables.SprintUserStoryReferenceId;
    } else {
      this.referenceTypeId = ConstantVariables.UserStoryReferenceTypeId;
    }
  }

  checkIsSubTasks() {
    if (!this.parentUserStoryId && this.userStoryDetails.subUserStories && (!this.isSuperagileBoard && this.isKanbanBoard)) {
      return false;
    }
    else {
      return true;
    }
  }

  userStoryDetailsBinding() {
    if (this.userStoryDetails) {
      this.userStoryId = this.userStoryDetails.userStoryId;
      this.userStoryStatusId = this.workflowStatus != undefined && this.workflowStatus.length > 0 ? this.userStoryDetails.userStoryStatusId : null;
      this.actionCategoryId = this.actionCategories != undefined && this.actionCategories.length > 0 ? this.userStoryDetails.actionCategoryId : null;
      this.userStoryName = this.userStoryDetails.userStoryName;
      this.userStoryUniqueName = this.userStoryDetails.userStoryUniqueName;
      this.assignee = ((this.notFromAudits && this.projectMembers && this.projectMembers.length > 0) || (!this.notFromAudits && this.userList && this.userList.length > 0)) ? this.userStoryDetails.ownerUserId : null;
      this.estimatedTime = this.userStoryDetails.estimatedTime;
      this.estimatedTimeSet = this.estimatedTime;
      this.deadLineDate = this.userStoryDetails.deadLineDate;
      this.dependencyUserId = this.userStoryDetails.dependencyUserId;
      this.goalId = this.goals && this.goals.length > 0 ? this.userStoryDetails.goalId : null;
      this.projectId = this.userStoryDetails.projectId;
      this.goalStatusId = this.userStoryDetails.goalStatusId;
      this.description = this.userStoryDetails.description;
      this.descriptionSlug = this.userStoryDetails.description;
      this.bugCausedUserId = this.userStoryDetails.bugCausedUserId;
      this.isSprintsConfiguration = this.userStoryDetails.isSprintsConfiguration;
      this.bugPriorityId = (this.bugPriorities && this.bugPriorities.length > 0) ? this.userStoryDetails.bugPriorityId : null;
      this.projectFeatureId = this.userStoryDetails.projectFeatureId;
      this.ragStatus = this.userStoryDetails.ragStatus;
      this.timeStamp = this.userStoryDetails.timeStamp;
      this.isBugBoard = this.userStoryDetails.isBugBoard;
      this.versionName = this.userStoryDetails.versionName;
      this.isDateTimeConfiguration = this.userStoryDetails.isDateTimeConfiguration;
      this.isForQa = this.userStoryDetails.isForQa;
      this.isReplan = this.userStoryDetails.isReplan;
      this.userStoryStatusColor = this.workflowStatus != undefined && this.workflowStatus.length > 0 ? this.userStoryDetails.userStoryStatusColor : '';
      this.userStoryTypeId = (this.userStoryTypes && this.userStoryTypes.length > 0) ? this.userStoryDetails.userStoryTypeId : null;
      this.parentUserStoryId = this.userStoryDetails.parentUserStoryId;
      this.onboardProcessDate = this.userStoryDetails.onboardProcessDate;
      this.isLogTimeRequired = this.userStoryDetails.isLogTimeRequired;
      this.isQaRequired = this.userStoryDetails.isQaRequired;
      this.sprintEstimatedTime = this.userStoryDetails.sprintEstimatedTime;
      this.sprintId = this.userStoryDetails.sprintId;
      this.cronExpression = this.userStoryDetails.cronExpression != null ? this.userStoryDetails.cronExpression : this.cronExpression;
      this.cronExpressionDescription = (this.userStoryDetails != null && this.userStoryDetails.cronExpression != null) ? cronstrue.toString(this.userStoryDetails.cronExpression) : null;
      this.isRecurringWorkItem = this.userStoryDetails.cronExpression != null ? true : false;
      this.isEditScheduling = this.cronExpressionId != null ? true : false;
      this.cronExpressionId = this.userStoryDetails.cronExpressionId;
      this.cronTimeStamp = this.userStoryDetails.cronExpressionTimeStamp;
      this.jobId = this.userStoryDetails.jobId;
      this.isPaused = this.userStoryDetails.isPaused;
      this.parentUserStoryGoalId = this.userStoryDetails.parentUserStoryGoalId;
      this.userStoryDetails.scheduleEndDate == null ? this.scheduleType.setValue(1) : this.scheduleType.setValue(2);
      this.startDate = this.userStoryDetails.userStoryStartDate;

      this.endDate.setValue(this.userStoryDetails.scheduleEndDate);
      if (this.userStoryDetails.tag) {
        this.userStoryInputTags = this.userStoryDetails.tag.split(",");
        this.cdRef.markForCheck();
      } else {
        this.userStoryInputTags = [];
      }
      if (!this.isSuperagileBoard && !this.isKanbanBoard) {
        this.archiveButtonToolTip = this.translateService.instant('GOALS.ARCHIVEBUG');
        this.parkButtonToolTip = this.translateService.instant('GOALS.PARKBUG');
      }
      else {
        this.archiveButtonToolTip = this.translateService.instant('USERSTORY.ARCHIVEUSERSTORY');
        this.parkButtonToolTip = this.translateService.instant('USERSTORY.PARKUSERSTORY');
      }
      if (this.userStoryDetails.userStoryArchivedDateTime) {
        this.isArchived = false;
      } else {
        this.isArchived = true;
      }
      if (this.userStoryDetails.userStoryParkedDateTime) {
        this.isParked = false;
      } else {
        this.isParked = true;
      }
      if (this.userStoryDetails && this.userStoryDetails.goalStatusId && this.userStoryDetails.goalStatusId.toLowerCase() === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
        this.isActiveGoalStatusId = true;
        this.isUserStoryStatus = false;
      }
      else if (this.userStoryDetails && this.userStoryDetails.goalStatusId && this.userStoryDetails.goalStatusId.toLowerCase() === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
        this.isBacklogGoalStatusId = true;
        this.isUserStoryStatus = true;
      }
      else if (this.userStoryDetails && this.userStoryDetails.goalStatusId && this.userStoryDetails.goalStatusId.toLowerCase() === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
        this.isReplanGoalStatusId = true;
        this.isUserStoryStatus = true;
      }
      if (this.isLogTimeRequired) {
        let dummyDropDownList;
        dummyDropDownList = this.dropdowns.find(x => x.name == 'Worklog');
        if ((dummyDropDownList == null) || (dummyDropDownList == undefined))
          this.dropdowns.push({
            name: 'Worklog',
            value: 'Worklog'
          })
      } else {
        this.dropdowns = this.dropdowns.filter(items => items.name !== 'Worklog');
      }
      if (this.userStoryDetails.parentUserStoryId) {
        this.dropdowns = this.dropdowns.filter(items => items.name !== 'Sub tasks');
      }
      else {
        let dummyDropDownList;
        dummyDropDownList = this.dropdowns.find(x => x.name == 'Sub tasks');
        if ((dummyDropDownList == null) || (dummyDropDownList == undefined))
          this.dropdowns.push({
            name: 'Sub tasks',
            value: 'Sub tasks'
          })
      }


      if (!this.notFromAudits) {
        this.dropdowns = this.dropdowns.filter(items => items.name !== 'Sub tasks' && items.name !== 'Link work items' && items.name !== 'Custom field history');
      }

      if (this.userStoryDetails.isBugBoard || !this.userStoryDetails.isEnableTestRepo || !this.userStoryDetails.isQaRequired) {
        this.dropdowns = this.dropdowns.filter(items => items.name != 'Bugs');
        this.dropdowns = this.dropdowns.filter(items => items.name != 'Test cases');
        this.dropdowns = this.dropdowns.filter(items => items.name != 'Scenario history');
      }
      else {
        let dummyDropDownList;
        dummyDropDownList = this.dropdowns.find(x => x.name == 'Bugs');
        if ((dummyDropDownList == null) || (dummyDropDownList == undefined))
          this.dropdowns.push({
            name: 'Bugs',
            value: 'Bugs'
          })
        let testCasesdummyDropDownList;
        testCasesdummyDropDownList = this.dropdowns.find(x => x.name == 'Test cases');
        if ((testCasesdummyDropDownList == null) || (testCasesdummyDropDownList == undefined))
          this.dropdowns.push({
            name: 'Test cases',
            value: 'Test cases'
          })
        let ScenariodummyDropDownList;
        ScenariodummyDropDownList = this.dropdowns.find(x => x.name == 'Scenario history');
        if ((ScenariodummyDropDownList == null) || (ScenariodummyDropDownList == undefined))
          this.dropdowns.push({
            name: 'Scenario history',
            value: 'Scenario history'
          })
      }
      if (this.userStoryDetails.isBugBoard || !this.userStoryDetails.testSuiteId) {
        this.dropdowns = this.dropdowns.filter(items => items.name != 'Test cases');
        this.dropdowns = this.dropdowns.filter(items => items.name != 'Scenario history');
      }
      else {
        let testCasesdummyDropDownList;
        testCasesdummyDropDownList = this.dropdowns.find(x => x.name == 'Test cases');
        if ((testCasesdummyDropDownList == null) || (testCasesdummyDropDownList == undefined))
          this.dropdowns.push({
            name: 'Test cases',
            value: 'Test cases'
          })
        let ScenariodummyDropDownList;
        ScenariodummyDropDownList = this.dropdowns.find(x => x.name == 'Scenario history');
        if ((ScenariodummyDropDownList == null) || (ScenariodummyDropDownList == undefined))
          this.dropdowns.push({
            name: 'Scenario history',
            value: 'Scenario history'
          })
      }

      this.dropdowns = _.uniq(this.dropdowns);



      if (this.userStoryDetails.taskStatusId && (this.userStoryDetails.taskStatusId.toLowerCase() == BoardTypeIds.TodoTaskStatusId.toLowerCase())) {
        this.isCreatingSubTask = true;
      }
      else {
        this.isCreatingSubTask = false;
      }

      // tslint:disable-next-line: max-line-length
      if (!this.isSprintUserStories) {
        if (this.userStoryDetails.goalStatusId && this.userStoryDetails.goalStatusId.toLowerCase() === ConstantVariables.BacklogGoalStatusId.toLowerCase() || this.userStoryDetails.goalStatusId === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
          this.isUserStoryStatus = true;
        }
        else {
          this.isUserStoryStatus = false;
        }
      } else {
        if (this.userStoryDetails.sprintStartDate && !this.isReplan) {
          this.isActiveGoalStatusId = true;
          this.isBacklogGoalStatusId = false;
          this.isUserStoryStatus = false;
        } else if (!this.isReplan && !this.userStoryDetails.sprintStartDate) {
          this.isBacklogGoalStatusId = true;
          this.isActiveGoalStatusId = false;
          this.isUserStoryStatus = true;
        }
      }
      this.checkMainUsIsQAApproved(this.userStoryDetails.subUserStoriesList);

      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    }
  }
  checkMainUsIsQAApproved(subUserStories) {
    if (subUserStories != undefined && subUserStories.length > 0) {
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

  workflowid() {
    if (this.userStoryDetails.workFlowId != undefined) {
      var workflowStatus = new WorkflowStatus();
      workflowStatus.workFlowId = this.userStoryDetails.workFlowId;
      if (workflowStatus.workFlowId) {
        // this.workflowStatus$ = this.store.pipe(
        //   select(projectModuleReducer.getworkflowStatusAllByWorkflowId, { workflowId: workflowStatus.workFlowId })
        // );
        // this.workflowStatus$.subscribe(s => {
        //   this.workflowStatus = s;
        //   if (this.workflowStatus.length > 0) {
        //     this.userStoryDetailsBinding();
        //   }
        // });
        // if (this.workflowStatus.length <= 0) {
        //   this.store.dispatch(new LoadworkflowStatusTriggered(workflowStatus));
        // }
        var workflowStatus = new WorkflowStatus();
        workflowStatus.workFlowId = this.userStoryDetails.workFlowId;
        this.workflowService.GetAllWorkFlowStatus(workflowStatus).subscribe((status: any) => {
          if (status.success) {
            this.workflowStatus = status.data;
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
            this.userStoryDetailsBinding();
          }
        })
      }
    }


    this.projectMembers$ = this.store.pipe(
      select(projectModuleReducer.getProjectMembersAll)
    );

    this.projectFeatures$ = this.store.pipe(
      select(projectModuleReducer.getProjectFeaturesAll)
    );

    this.bugPriorities$ = this.store.pipe(
      select(projectModuleReducer.getBugPriorityAll)
    );

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

  redirectPage() {
    if (!this.isUniqueFromProjects) {
      this.closeUniqueUserStory.emit();
    }
    this.cookieService.set("selectedProjectsTab", "active-goals");
    this.router.navigate([
      "projects/projectstatus",
      this.userStoryDetails.projectId,
      "active-goals"
    ]);
  }

  redirect404() {
    this.router.navigate([
      "sessions/404"
    ]);
  }

  navigateToGoalDetailsPage() {
    if (!this.isUniqueFromProjects) {
      this.closeUniqueUserStory.emit();
      this.closeReportsSheetPopup.emit();
      this.closeReportsSheetPopup.emit(true);
    }

    if (!this.isSprintUserStories) {
      this.router.navigate([
        "projects/goal",
        this.userStoryDetails.goalId
      ]);
    } else {
      this.router.navigate([
        "projects/sprint",
        this.userStoryDetails.sprintId
      ]);
    }
    this.closeReportsSheetPopup.emit();
  }

  descriptionReset() {
    this.description = this.userStoryDetails.description;
    this.descriptionSlug = this.description;
  }

  cancelDescription() {
    this.descriptionSlug = this.description;
    this.description = this.userStoryDetails.description;
    this.isEditorVisible = false;
  }

  selectchange(value) {
    this.selectedTab = value;
  }

  editUserStoryName() {
    this.userStoryNameDuplicate = this.userStoryName;
  }

  updateUserStoryName() {
    if (this.userStoryNameDuplicate) {
      this.userStoryName = this.userStoryNameDuplicate;
      this.saveUserStory();
      this.isEditUserStoryName = false;
      this.isEditWIName = false;
    }
    else {
      const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASEENTERUSERSTORYNAME'), this.softLabels);
      this.toastr.warning("", message);
    }
  }

  getUserStoryStatusChange(event) {

    if (this.userStoryDetails.taskStatusId.toLowerCase() == BoardTypeIds.VerificationCompletedTaskStatusId.toLowerCase()
      || this.userStoryDetails.taskStatusId.toLowerCase() == BoardTypeIds.DoneTaskStatusId.toLowerCase()) {
      this.isLogTimeTab = false;
      this.cdRef.detectChanges();
    }
    else {
      this.isLogTimeTab = true;
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
        this.userStoryStatusId = this.userStoryDetails.userStoryStatusId;
        this.toastr.warning('', this.softLabelsPipe.transform(this.translateService.instant('USERDETAIL.PLEASEAPPROVESUBTASKSS'), this.softLabels));
      }
    } else {
      this.userStoryStatusId = event;
      this.isStatusChanged = false;
      this.isGoalChanged = false;
      this.saveUserStory();
    }
  }

  getUserStoryTypeChange(userStoryTypeId) {
    this.userStoryTypeId = userStoryTypeId;
    this.saveUserStory();
  }

  getGoalsList() {
    this.isLoadingGoals = true;
    var goalSearchCriteriaModel = new GoalSearchCriteriaInputModel();
    goalSearchCriteriaModel.projectId = this.projectId;
    goalSearchCriteriaModel.goalStatusId = this.userStoryDetails.goalStatusId;
    goalSearchCriteriaModel.isArchived = false;
    goalSearchCriteriaModel.isParked = false;
    this.goalService.searchGoals(goalSearchCriteriaModel).subscribe((responseData: any) => {
      this.isLoadingGoals = false;
      this.goals = responseData.data;
      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
      if (!this.isProjectChange) {
        this.userStoryDetailsBinding();
      }
    });
  }

  getUserStoriesList() {
    var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteria.goalId = this.userStoryDetails.goalId;
    userStorySearchCriteria.isUserStoryArchived = false;
    userStorySearchCriteria.isUserStoryParked = false;
    userStorySearchCriteria.isForUserStoryoverview = true;
    if (this.isSprintUserStories) {
      this.goalService.searchSprintUserStories(userStorySearchCriteria).subscribe((responseData: any) => {
        this.userStories = responseData.data;
        this.userStoryDetailsBinding();
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
    } else {
      this.goalService.searchUserStories(userStorySearchCriteria).subscribe((responseData: any) => {
        this.userStories = responseData.data;
        this.userStoryDetailsBinding();
      });
    }
  }

  saveUserStory() {
    let deadline = null;
    let startDate = null;

    if (this.isDateTimeConfiguration) {
      if (this.deadLineDate) {
        deadline = new Date(this.deadLineDate);
      }
      if (this.startDate) {
        startDate = new Date(this.startDate);
      }

      if (startDate > deadline && deadline != null && startDate != null) {
        this.toastr.error(this.translateService.instant("GOALS.STARTDATEANDDEADLINEMESSAGE"));
        return;
      }
    }
    else {
      if (this.deadLineDate) {
        deadline = moment(moment(this.deadLineDate).format('MM/DD/yyyy')).toDate();
      }
      if (this.startDate) {
        startDate = moment(moment(this.startDate).format('MM/DD/yyyy')).toDate();
      }

      if (startDate > deadline && deadline != null && startDate != null) {
        this.toastr.error(this.translateService.instant("GOALS.STARTDATEANDDEADLINEMESSAGE"));
        return;
      }
    }

    localStorage.setItem("isUniquePage", 'true')
    const userStory = new UserStory();
    userStory.goalId = this.goalId;
    userStory.projectId = this.userStoryDetails.projectId;
    userStory.auditProjectId = this.userStoryDetails.projectId;
    userStory.actionCategoryId = this.actionCategoryId;
    userStory.userStory = this.userStoryName;
    userStory.userStoryId = this.userStoryDetails.userStoryId;
    userStory.oldOwnerUserId = this.userStoryDetails.ownerUserId;
    userStory.ownerUserId = this.assignee;
    userStory.userStoryStatusId = this.userStoryStatusId;
    userStory.estimatedTime = this.estimatedTimeSet;
    userStory.deadLineDate = this.deadLineDate;
    if (this.questions.length > 0 && this.myControl.value) {
      const questionDetails = this.questions.find((question) => question.conductQuestionId === this.myControl.value);
      userStory.conductId = questionDetails.conductId;
      userStory.questionId = questionDetails.questionId;
      userStory.auditConductQuestionId = questionDetails.conductQuestionId;
      userStory.questionName = questionDetails.questionName;
    }
    if (this.isDateTimeConfiguration) {
      userStory.deadLine = this.covertTimeIntoUtcTime(this.deadLineDate);
    }
    else {
      userStory.deadLine = this.covertTimeIntoUtcTimes(this.deadLineDate);
    }
    userStory.timeZoneOffSet = (-(new Date(this.deadLineDate).getTimezoneOffset()));
    userStory.userStoryName = this.userStoryName;
    userStory.userStoryUniqueName = this.userStoryUniqueName;
    userStory.dependencyUserId = this.dependencyUserId;
    userStory.isNewUserStory = this.isNewUserStory;
    userStory.isGoalChanged = this.isGoalChanged;
    userStory.description = this.description;
    userStory.projectFeatureId = this.projectFeatureId;
    userStory.bugPriorityId = this.bugPriorityId;
    userStory.bugCausedUserId = this.bugCausedUserId;
    userStory.userStoryTypeId = this.userStoryTypeId;
    userStory.isStatusChanged = this.isStatusChanged;
    userStory.timeStamp = this.timeStamp;
    userStory.versionName = this.versionName;
    userStory.isForQa = this.isForQa;
    userStory.tag = this.userStoryDetails.tag;
    userStory.parentUserStoryId = this.parentUserStoryId;
    userStory.isUniqueDetailsPage = true;
    userStory.sprintId = this.userStoryDetails.sprintId;
    userStory.isBugBoard = this.userStoryDetails.isBugBoard;
    userStory.testCaseId = this.userStoryDetails ? this.userStoryDetails.testCaseId : null;
    userStory.testSuiteSectionId = this.sectionId;
    userStory.sprintEstimatedTime = this.sprintEstimatedTime;
    userStory.rAGStatus = this.ragStatus;
    userStory.userStoryStartDate = this.startDate;

    if (!this.isFromBugsCount && !this.isUniqueFromProjects) {
      if (this.isSprintUserStories) {
        this.store.dispatch(
          new UpsertSprintWorkItemTriggered(userStory)
        );
      } else {
        this.store.dispatch(
          new userStoryActions.CreateUserStoryTriggered(userStory)
        );
      }
      this.cancelDescription();
    }
    else {
      this.isSavingInProgress = true;
      this.goalService.UpsertUserStory(userStory).subscribe((result: any) => {
        if (this.isSprintUserStories) {
          this.getSprintUserStoryById(userStory);
          this.store.dispatch(new LoadUserstoryHistoryTriggered(userStory.userStoryId));
        }
        else {
          this.getUserStoryById(userStory);
          this.store.dispatch(new LoadUserstoryHistoryTriggered(userStory.userStoryId));
        }

      });
      this.cancelDescription();
    }

  }

  getSprintUserStoryById(userStory) {
    this.goalService.searchSprintUserStoryById(userStory.userStoryId, null).subscribe((result: any) => {
      if (result != undefined && result.data != undefined) {
        this.isSavingInProgress = false;
        this.userStoryDetails = result.data;
        this.projectId = this.userStoryDetails.projectId;
        this.getGoalsList();
        this.getSprintsList();
        this.getUserStoriesList();
        this.formReferenceTypeId = this.userStoryDetails.userStoryTypeId
        this.loadCustomFieldModule();
        this.timeStamp = this.userStoryDetails.timeStamp;
        this.userStoryDetailsBinding();
      }
    });
  }
  getUserStoryById(userStory) {
    this.loadingUserStory = true;
    this.goalService.GetUserStoryById(userStory.userStoryId).subscribe((result: any) => {
      this.loadingUserStory = false;
      if (result != undefined && result.data != undefined) {
        this.isSavingInProgress = false;
        this.userStoryDetails = result.data;
        if (this.userStoryDetails.auditConductQuestionId) {
          this.setConductValueValue();
        }
        this.projectId = this.userStoryDetails.projectId;
        this.getGoalsList();
        this.getSprintsList();
        this.getUserStoriesList();
        this.formReferenceTypeId = this.userStoryDetails.userStoryTypeId
        this.loadCustomFieldModule();
        this.timeStamp = this.userStoryDetails.timeStamp;
        this.userStoryDetailsBinding();
      }

    });
  }

  getGoalChange(goalId) {
    this.goalId = goalId;
    var userStoryModel = new UserStory();
    userStoryModel.userStoryId = this.userStoryDetails.userStoryId;
    userStoryModel.userStoryName = this.userStoryDetails.userStoryName;
    userStoryModel.goalId = goalId;
    userStoryModel.timeStamp = this.timeStamp;
    userStoryModel.userStoryUniqueName = this.userStoryUniqueName;
    userStoryModel.oldGoalId = this.userStoryDetails.goalId;
    if (this.isSprintUserStories) {
      var boardTypeId = this.goals.find((x) => x.goalId = goalId).boardTypeId;
      if (this.userStoryDetails.boardTypeId == boardTypeId) {
        this.saveUserStory();
      } else {
        this.toastr.error('', this.translateService.instant('USERDETAIL.PLEASESELECTGOALWITHSAMEBOARDTYPE'));
      }
    } else {
      this.store.dispatch(new userStoryActions.UpdateUserStoryGoalTriggred(userStoryModel));
    }
  }

  searchProjects() {
    var projectSearchResult = new ProjectSearchCriteriaInputModel();
    this.goalId = null;
    projectSearchResult.isArchived = false;
    this.projectService.searchProjects(projectSearchResult).subscribe((x: any) => {
      if (x.success) {
        this.projectsList = x.data;
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      }
    })
  }

  getActionCategories() {
    let category = new ActionCategory();
    category.isArchived = false;
    this.projectService.getActionCategories(category).subscribe((result: any) => {
      if (result.success) {
        if (result.data && result.data.length > 0) {
          this.actionCategories = result.data;
          this.userStoryDetailsBinding();
          this.cdRef.detectChanges();
        }
        else {
          this.actionCategories = [];
          this.cdRef.markForCheck();
        }
      }
      else {
        this.actionCategories = [];
        this.cdRef.markForCheck();
      }
    })
  }

  saveEstimatedTime() {
    if (this.sprintEstimatedTime > 99) {
      this.isValidation = true;
    } else {
      this.isValidation = false;
      this.saveUserStory();
    }
  }

  getUserStoryChange(userStoryId) {
    let parentUserStoryIds = [];
    parentUserStoryIds.push(userStoryId);
    parentUserStoryIds.push(this.userStoryDetails.parentUserStoryId);
    var userStory = new UserStory();
    userStory.goalId = this.userStoryDetails.goalId;
    userStory.parentUserStoryId = userStoryId;
    userStory.parentUserStoryIds = parentUserStoryIds;
    userStory.timeStamp = this.timeStamp;
    userStory.userStoryId = this.userStoryId;
    userStory.sprintId = this.userStoryDetails.sprintId;
    userStory.isFromSprint = this.isSprintUserStories;
    if (this.isSprintUserStories) {
      this.store.dispatch(new UpdateSubTaskInUniquePageCompleted(userStory));
    } else {
      this.store.dispatch(new userStoryActions.UpdateSubTaskUserStoryTriggered(userStory));
    }
  }

  handleDescriptionEvent() {
    this.description = this.descriptionSlug;
    this.saveUserStory();
  }

  // uploadEventHandler(event) {
  //   this.isFileUpload = true;
  //   var moduleTypeId = 4;
  //   const fileModellist = new fileModel();
  //   var file = event.target.files[0];
  //   var formData = new FormData();
  //   if (file) {
  //     if (this.fileTypes.includes(file.type)) {
  //       formData.append("file", file);
  //       this.fileUploadService.UploadFile(formData, moduleTypeId).subscribe((response: any) => {
  //         this.isFileUpload = false;
  //         this.filesUploaded = response.data;
  //         this.isExtension = false;
  //         this.fileUploadExample.nativeElement.value = "";
  //         if (
  //           this.filesUploaded[0].fileUrl !== null ||
  //           this.filesUploaded[0].fileUrl !== undefined
  //         ) {
  //           fileModellist.userStoryId = this.userStoryDetails.userStoryId;
  //           fileModellist.filePath = this.filesUploaded[0].fileUrl;
  //           fileModellist.fileName = this.filesUploaded[0].fileName;
  //           this.store.dispatch(new FileUploadTriggered(fileModellist));
  //         }
  //       });
  //       this.cdRef.detectChanges();
  //     }
  //     else {
  //       this.isExtension = true;
  //       this.isFileUpload = false;
  //       this.cdRef.detectChanges();
  //     }
  //   }
  //   else {
  //     this.isExtension = false;
  //     this.isFileUpload = false;
  //     this.cdRef.detectChanges();
  //   }
  // }

  changeAssignee(event) {
    if (event === 0) {
      event = null;
    }
    this.assignee = event;
    if (this.assignee == null) {
      this.userStoryStatusId = this.userStoryDetails.userStoryStatusId;
    }
    this.isGoalChanged = false;
    this.isStatusChanged = true;
    this.saveUserStory();
  }

  changeDependancy(event) {
    if (event === 0) {
      event = null;
    }
    this.dependencyUserId = event;
    if (this.dependencyUserId === null || this.assignee === null) {
      this.userStoryStatusId = this.userStoryDetails.userStoryStatusId;
    }
    this.isGoalChanged = false;
    this.isNewUserStory = false;
    this.saveUserStory();
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
      this.saveUserStory();
    }
  }

  changeDeadline() {
    this.isGoalChanged = false;
    this.isNewUserStory = false;
    this.saveUserStory();
  }

  changeStartDate() {
    this.isGoalChanged = false;
    this.isNewUserStory = false;
    this.saveUserStory();
  }

  updateProjectFeature(projectFeatureId) {
    this.projectFeatureId = projectFeatureId;
    this.saveUserStory();
  }

  updateBugCausedPerson(bugCausedUserId) {
    this.bugCausedUserId = bugCausedUserId;
    this.saveUserStory();
  }

  updateBugPrioity(bugPriorityId) {
    if (bugPriorityId === 0) {
      bugPriorityId = null;
    }
    this.bugPriorityId = bugPriorityId;
    this.saveUserStory();
  }

  updateActionCategory(categoryId) {
    if (categoryId === 0) {
      categoryId = null;
    }
    this.actionCategoryId = categoryId;
    this.cdRef.markForCheck();
    this.saveUserStory();
  }

  setColorForBugPriorityTypes(color) {
    let styles = {
      "color": color
    };
    return styles;
  }

  openArchivePopUp() {
    this.userstoryUniquePage = true;
  }

  openParkPopUp() {
    this.userstoryUniquePage = true;
  }

  closeArchivePopUp(value) {
    this.userstoryUniquePage = false;
    let popover = this.archiveUserStory;
    if (popover) popover.close();
    let editMenuPopOver = this.editUserStoryMenuPopover;
    if (editMenuPopOver) editMenuPopOver.close();
    if (value == 'yes') {
      this.toggleUserStory.emit('yes');
    }
    else if (value == 'no') {
      this.toggleUserStory.emit('no');
    }
    if (this.isSprintUserStories) {
      this.router.navigate([
        "projects/projectstatus",
        this.userStoryDetails.projectId,
        "active-goals"
      ]);
    }
  }

  closeParkPopUp(value) {
    this.userstoryUniquePage = false;
    let popover = this.parkUserStoryPopUp;
    if (popover) popover.close();
    let editMenuPopOver = this.editUserStoryMenuPopover;
    if (editMenuPopOver) editMenuPopOver.close();
    if (value == 'yes') {
      this.toggleUserStory.emit('yes');
    }
    else if (value == 'no') {
      this.toggleUserStory.emit('no');
    }
    if (this.isSprintUserStories) {
      this.router.navigate([
        "projects/projectstatus",
        this.userStoryDetails.projectId,
        "active-goals"
      ]);
    }
  }


  closeTagsDialog(closePoPup) {
    this.isTagsPopUp = false;
    let editMenuPopOver = this.editUserStoryMenuPopover;
    if (editMenuPopOver) editMenuPopOver.close();
    this.toggleUserStory.emit('no');
  }

  submitclosePopup(value) {
    if (this.isUniqueFromProjects) {
      localStorage.setItem("isUniquePage", 'true')
      this.router.navigate([
        "projects/projectstatus",
        this.userStoryDetails.projectId,
        "active-goals"
      ]);
    }
    else {
      if (value == 'yes') {
        this.toggleUserStory.emit('yes');
      }
    }
  }

  openTagsPopUp() {
    this.isTagsPopUp = true;
  }

  checkPermissionForUserStory() {
    let projectId = this.projectId;
    let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
    this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
      return role.projectId == projectId
    })

    let featurePermissions = [];
    featurePermissions = this.entityRolePermisisons;
    this.entityFeatureIds = featurePermissions.map(x => x.entityFeatureId);
    if (featurePermissions.length > 0) {
      if (this.notFromAudits) {
        let entityTypeFeatureForAddOrUpdateUserStory = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateWorkItem.toString().toLowerCase();
        var addOrUpdateUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForAddOrUpdateUserStory)
        })
        if (addOrUpdateUserStoryPermisisonsList.length > 0) {
          this.isPermissionForUserStory = true;
          this.isPermissionForVersionName = true;
        }
      }

      else if (!this.notFromAudits) {
        let entityTypeFeatureForAddOrUpdateUserStory = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateAction.toString().toLowerCase();
        var addOrUpdateUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForAddOrUpdateUserStory)
        })
        if (addOrUpdateUserStoryPermisisonsList.length > 0) {
          this.isPermissionForUserStory = true;
          this.isPermissionForVersionName = true;
        }
      }
      else {
        this.isPermissionForUserStory = false;
        this.isPermissionForVersionName = false;
      }
      // View userstory permissions
      if(this.notFromAudits) {
        let entityTypeFeatureForViewUserStory = EntityTypeFeatureIds.EntityTypeFeature_ViewWorkItem.toString().toLowerCase();
        var viewUserStoriesPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForViewUserStory)
        })
        if (viewUserStoriesPermisisonsList.length > 0) {
          this.isPermissionForViewUserStories = true;
        }
      } else if(!this.notFromAudits) {
        let entityTypeFeatureForViewUserStory = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateAction.toString().toLowerCase();
      var viewUserStoriesPermisisonsList = _.filter(featurePermissions, function (permission) {
        return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForViewUserStory)
      })
      if (viewUserStoriesPermisisonsList.length > 0) {
        this.isPermissionForViewUserStories = true;
      }
      }
      else {
        this.isPermissionForViewUserStories = false;
      }

      //File Upload permissions
      let entityTypeFeatureForUserStoryFileUpload = EntityTypeFeatureIds.EntityTypeFeature_WorkItemFileUpload.toString().toLowerCase();
      var userStoryFileUploadPermisisonsList = _.filter(featurePermissions, function (permission) {
        return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryFileUpload)
      })
      if (userStoryFileUploadPermisisonsList.length > 0) {
        this.isPermissionForFileUpload = true;
      }
      else {
        this.isPermissionForFileUpload = false;
        this.dropdowns = this.dropdowns.filter(items => items.name !== 'File upload');
      }

      //Change userstory goal permissions
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

      //Change userstory sprint permissions
      let entityTypeFeatureForUserStorySprint = EntityTypeFeatureIds.EntityTypeFeature_CanMoveSprintWorkitemIntoAnotherSprint.toString().toLowerCase();
      var userStoryChangeSprintPermisisonsList = _.filter(featurePermissions, function (permission) {
        return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStorySprint)
      })
      if (userStoryChangeSprintPermisisonsList.length > 0) {
        this.isPermisisontoChangeSprint = true;
      }
      else {
        this.isPermisisontoChangeSprint = false;
      }
      // Move user story subtask permissions
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

      // Move user story subtask permissions
      let entityTypeFeatureForSection = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateScenarioSection.toString().toLowerCase();
      var sectionserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
        return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForSection)
      })
      if (sectionserStoryPermisisonsList.length > 0) {
        this.isPermissionForSection = true;
      }
      else {
        this.isPermissionForSection = false;
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
        this.dropdowns = this.dropdowns.filter(items => items.name !== 'Link work items');
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
      if (userStoryCommentsPermisisonsList.length > 0 || !this.notFromAudits) {
        this.isPermissionsForUserStoryComments = true;
      }
      else {
        this.isPermissionsForUserStoryComments = false;
        this.dropdowns = this.dropdowns.filter(items => items.name !== 'Comment');
      }

      //Permission For Archive userstory
      if (this.notFromAudits) {
        let entityTypeFeatureForArchiveUserStory = EntityTypeFeatureIds.EntityTypeFeature_ArchiveWorkItem.toString().toLowerCase();
        var archiveUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForArchiveUserStory)
        })
        if (archiveUserStoryPermisisonsList.length > 0) {
          this.isPermissionForArchiveUserStory = true;
        }
      } else if(!this.notFromAudits) {
        let entityTypeFeatureForArchiveUserStory = EntityTypeFeatureIds.EntityTypeFeature_ArchiveAction.toString().toLowerCase();
        var archiveUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForArchiveUserStory)
        })
        if (archiveUserStoryPermisisonsList.length > 0) {
          this.isPermissionForArchiveUserStory = true;
        }
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
      if (this.notFromAudits) {
        let entityTypeFeatureForDeadlineDateInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalDeadlineDate.toString().toLowerCase();
        var editDeadlineDatePermisisonsListInActive = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDeadlineDateInActive)
        })
        if (editDeadlineDatePermisisonsListInActive.length > 0) {
          this.isInlineEditForUserStoryDeadlineDateInActive = true;
        }
      }
      else if (!this.notFromAudits) {
        let entityTypeFeatureForDeadlineDateInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActionDeadlineDate.toString().toLowerCase();
        var editDeadlineDatePermisisonsListInActive = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDeadlineDateInActive)
        })
        if (editDeadlineDatePermisisonsListInActive.length > 0) {
          this.isInlineEditForUserStoryDeadlineDateInActive = true;
        }
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
      if (this.notFromAudits) {
        let entityTypeFeatureForUserStoryOwnerInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalAssignee.toString().toLowerCase();
        var editUserStoryOwnerPermisisonsListInActive = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryOwnerInActive)
        })
        if (editUserStoryOwnerPermisisonsListInActive.length > 0) {
          this.isInlineEditForUserStoryOwnerInActive = true;
        }
      } else if (!this.notFromAudits) {
        let entityTypeFeatureForUserStoryOwnerInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActionAssignee.toString().toLowerCase();
        var editUserStoryOwnerPermisisonsListInActive = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryOwnerInActive)
        })
        if (editUserStoryOwnerPermisisonsListInActive.length > 0) {
          this.isInlineEditForUserStoryOwnerInActive = true;
        }
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
      if (this.notFromAudits) {
        let entityTypeFeatureForUserStoryNameInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalWorkItemName.toString().toLowerCase();
        var editUserStoryNamePermisisonsListInActive = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryNameInActive)
        })
        if (editUserStoryNamePermisisonsListInActive.length > 0) {
          this.isInlineEditForUserStoryNameInActive = true;
        }
      }
      else if (!this.notFromAudits) {
        let entityTypeFeatureForUserStoryNameInActive = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateAction.toString().toLowerCase();
        var editUserStoryNamePermisisonsListInActive = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryNameInActive)
        })
        if (editUserStoryNamePermisisonsListInActive.length > 0) {
          this.isInlineEditForUserStoryNameInActive = true;
        }
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
      var editEntityTypeFeatureForDependencyPersonInBacklog = _.filter(featurePermissions, function (permission) {
        return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDependencyPersonInBacklog)
      })
      if (editEntityTypeFeatureForDependencyPersonInBacklog.length > 0) {
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



      this.enableAndDisablePermissions();
    }

  }


  enableAndDisablePermissions() {
    //check Permissions for userstoryname
    if ((this.isActiveGoalStatusId && this.isInlineEditForUserStoryNameInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForUserStoryNameInActive)) {
      this.isPermissionForUserStory = true;
    }
    else if (this.isSuperagileBoard && ((this.isActiveGoalStatusId && this.isInlineEditForUserStoryNameInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForUserStoryNameInBacklog) || (this.isReplanGoalStatusId && this.isInlineEditForUserStoryNameInReplan))) {
      this.isPermissionForUserStory = true;
    }
    else {
      this.isPermissionForUserStory = false;
    }

    //check BugPriority
    if ((this.isActiveGoalStatusId && this.isInlineEditForBugPriorityInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForBugPriorityInBacklog)) {
      this.isPermissionForBugPriority = true;

    }
    else {
      this.isPermissionForBugPriority = true;
    }
    //check ProjectFeature
    if ((this.isActiveGoalStatusId && this.isInlineEditForProjectFeatureInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForProjectFeatureInBacklog)) {
      this.isPermissionForProjectFeature = true;
    }
    else {
      this.isPermissionForProjectFeature = false;
    }

    //check BugCaused user
    if ((this.isActiveGoalStatusId && this.isInlineEditForBugCausedUserInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForBugCausedUserInBacklog)) {
      this.isPermissionForBugCausedUser = true;
    }
    else {
      this.isPermissionForBugCausedUser = true;
    }
    //check estimated time
    if ((this.isActiveGoalStatusId && !this.isInlineEditForEstimatedTimeInActive) || (this.isBacklogGoalStatusId && !this.isInlineEditForEstimatedTimeBacklog)) {
      this.isPermissionForEstimatedTime = true;
    }
    else {
      if (this.isActiveGoalStatusId) {
        if (this.isSuperagileBoard) {
          this.isPermissionForEstimatedTime = true;
        }
        else if (!this.isSuperagileBoard) {
          this.isPermissionForEstimatedTime = false;
        }
      }
      else {
        this.isPermissionForEstimatedTime = false;
      }
    }

    //check userstoryowner

    if ((this.isActiveGoalStatusId && this.isInlineEditForUserStoryOwnerInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForUserStoryOwnerInBacklog) || (this.isReplanGoalStatusId && this.isInlineEditForUserStoryOwnerInReplan)) {
      this.isPermissionForUserStoryOwner = false;
    }
    else {
      this.isPermissionForUserStoryOwner = true;
    }

    //check deadline date

    if ((this.isActiveGoalStatusId && !this.isInlineEditForUserStoryDeadlineDateInActive) || (this.isBacklogGoalStatusId && !this.isInlineEditForUserStoryDeadlineDateInBacklog)) {
      this.isPermissionForDeadlineDate = true;
    }
    else {
      if (this.isActiveGoalStatusId) {
        if (this.isSuperagileBoard) {
          this.isPermissionForDeadlineDate = true;
        }
        else if (!this.isSuperagileBoard) {
          this.isPermissionForDeadlineDate = false;
        }
      }
      else {
        this.isPermissionForDeadlineDate = false;
      }
    }


    //check dependency person
    if ((this.isActiveGoalStatusId && this.isInlineEditForDependencyPersonInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForDependencyPersonInBacklog) || (this.isReplanGoalStatusId && this.isInlineEditForDependencyPersonInReplan)) {
      this.isPermissionForDependencyPerson = false;
    }
    else {
      this.isPermissionForDependencyPerson = true;
    }
    let featurePermissions = [];
    featurePermissions = this.entityRolePermisisons;
    this.entityFeatureIds = featurePermissions.map(x => x.entityFeatureId);
    if (featurePermissions.length > 0) {
    if (!this.notFromAudits) {
      let entityTypeFeatureForUserStoryNameInActive = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateAction.toString().toLowerCase();
      var editEstimatedTimePermisisonsListInActive = _.filter(featurePermissions, function (permission) {
        return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryNameInActive)
      })
      if (editEstimatedTimePermisisonsListInActive.length > 0) {
        this.isPermissionForEstimatedTime = true;
      }
    }
  }

    this.cdRef.markForCheck();
  }


  checkPermissionForAddLinks() {
    if (this.isPermissionForCreatingSubLinks) {
      return true;
    }
    else {
      return false;
    }
  }


  checkPermissionForArchiveLinks() {
    if (this.isPermissionsForArchiveUserStoryLink) {
      return true;
    }
    else {
      return false;
    }
  }

  enableEditor() {
    this.isEditorVisible = true;
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
    this.store.dispatch(new ProjectSummaryTriggered(this.userStoryDetails.projectId));
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

  createSubTaskNew() {
    this.isCreateSubTask = true;
    this.createSubTaskPopUp.open();
  }

  closeUserStoryDetailWindow() {
    this.isCreateSubTask = false;
    let popover = this.createSubTaskPopUp;
    if (popover) popover.close();
    let editMenuPopOver = this.editUserStoryMenuPopover;
    if (editMenuPopOver) editMenuPopOver.close();
  }

  checkToggleButton() {
    if ((!this.userStoryDetails.userStoryParkedDateTime && this.isPermissionForArchiveUserStory) ||
      (!this.userStoryDetails.userStoryArchivedDateTime && this.isPermissionForParkUserStory) || this.isPermissionForViewUserStories) {
      return true;
    }
    else {
      return false;
    }
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

  checkUserStoryEditPermisison() {
    if (this.isPermissionForUserStory) {
      return true;
    }
    else {
      return false;
    }
  }

  openCustomFieldComponent() {
    const formsDialog = this.dialog.open(CustomFormsComponent, {
      height: '62%',
      width: '60%',
      hasBackdrop: true,
      direction: "ltr",
      data: { moduleTypeId: this.moduleTypeId, referenceId: this.userStoryId, referenceTypeId: this.projectId, customFieldComponent: null },
      disableClose: true,
      panelClass: 'custom-modal-box'
    });
    formsDialog.componentInstance.closeMatDialog.subscribe(() => {
      this.dialog.closeAll();
      let editMenuPopOver = this.editUserStoryMenuPopover;
      if (editMenuPopOver) editMenuPopOver.close();
    });
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
    recurringUserStoryModel = Object.assign(recurringUserStoryModel, this.userStoryDetails);
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
    this.userStoryDetails.scheduleEndDate == null ? this.scheduleType.setValue(1) : this.scheduleType.setValue(2);
    this.endDate.setValue(this.userStoryDetails.scheduleEndDate);
    this.userStoryDetails.scheduleEndDate == null ? this.selectedSchedulingType = "1" : this.selectedSchedulingType = "2";
  }

  cancelCronExpressionPopUp() {
    this.addCronExpressionPopUp.forEach((p) => p.closePopover());
    this.cronExpression = "0 10 1/1 * ?";
    this.cronExpression = this.userStoryDetails.cronExpression != null ? this.userStoryDetails.cronExpression : this.cronExpression;
    this.cronExpressionDescription = (this.userStoryDetails != null && this.userStoryDetails.cronExpression != null) ? cronstrue.toString(this.userStoryDetails.cronExpression) : null;
    this.isRecurringWorkItem = this.userStoryDetails.cronExpression != null ? true : false;
    this.isEditScheduling = this.cronExpressionId != null ? true : false;
    this.cronExpressionId = this.userStoryDetails.cronExpressionId;
    this.cronTimeStamp = this.userStoryDetails.cronExpressionTimeStamp;
    this.jobId = this.userStoryDetails.jobId;
    this.isPaused = this.userStoryDetails.isPaused;
    this.userStoryDetails.scheduleEndDate == null ? this.scheduleType.setValue("1") : this.scheduleType.setValue("2");
    this.endDate.setValue(this.userStoryDetails.scheduleEndDate);
    this.selectedSchedulingType = this.userStoryDetails.scheduleEndDate == null ? "1" : "2";
  }

  showMatFormField() {
    this.userStoryNameDuplicate = this.userStoryName;
    this.isEditWIName = true;
  }

  GetUserStoryDetails(isFromSprint) {
    if (isFromSprint) {
      this.goalService.searchSprintUserStoryById(this.userStoryId, null).subscribe((result: any) => {
        this.FillUserStoryDetails(result.data)
      });
    }
    else {
      this.loadingUserStory = true;
      this.goalService.GetUserStoryById(this.userStoryId).subscribe((result: any) => {
        this.loadingUserStory = false;
        this.FillUserStoryDetails(result.data)
      });
    }
  }

  FillUserStoryDetails(userStory) {
    this.isPermissionForViewUserStories = true;
    this.userStoryDetails = userStory;
    if (this.userStoryDetails) {
      if (this.userStoryDetails.auditConductQuestionId) {
        this.setConductValueValue();
      }
      this.projectId = this.userStoryDetails.projectId;
      this.store.dispatch(new LoadMemberProjectsTriggered(this.userStoryDetails.projectId));
      if (this.userStoryDetails.isFromSprints) {
        this.isSprintUserStories = true;
        this.referenceTypeId = ConstantVariables.SprintUserStoryReferenceId;
        if (this.userStoryDetails.sprintStartDate && !this.userStoryDetails.isReplan) {
          this.isActiveGoalStatusId = true;
          this.isUserStoryStatus = false;
        } else if (!this.userStoryDetails.isReplan && !this.userStoryDetails.sprintStartDate) {
          this.isBacklogGoalStatusId = true;
          this.isActiveGoalStatusId = false;
          this.isUserStoryStatus = true;
        }
      } else {
        this.isSprintUserStories = false;
        this.referenceTypeId = ConstantVariables.UserStoryReferenceTypeId;
        if (this.userStoryDetails && this.userStoryDetails.goalStatusId && this.userStoryDetails.goalStatusId.toLowerCase() === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
          this.isActiveGoalStatusId = true;
          this.isUserStoryStatus = false;
        }
        else if (this.userStoryDetails && this.userStoryDetails.goalStatusId && this.userStoryDetails.goalStatusId.toLowerCase() === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
          this.isBacklogGoalStatusId = true;
          this.isUserStoryStatus = true;
        }
        else if (this.userStoryDetails && this.userStoryDetails.goalStatusId && this.userStoryDetails.goalStatusId.toLowerCase() === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
          this.isReplanGoalStatusId = true;
          this.isUserStoryStatus = true;
        }
      }
      this.formReferenceTypeId = this.userStoryDetails.userStoryTypeId;
    }

    this.checkPermissionForUserStory();
    this.userStoryDetailsBinding();
    this.workflowid();
    this.getGoalsList();
    this.getSprintsList();
    this.getUserStoriesList();
    this.loadBoardTypeUi();
    this.loadProjectFeature();
    this.loadCustomFieldModule();
    // this.getProjectMembersCount();
    this.cdRef.markForCheck();

  }


  loadProjectFeature() {
    const projectFeature = new ProjectFeature();
    projectFeature.projectId = this.projectId;
    projectFeature.IsDelete = false;
    this.store.dispatch(new LoadFeatureProjectsTriggered(projectFeature));
  }

  getProjectChange(projectId) {
    this.projectId = projectId;
    if (this.userStoryDetails.projectId != this.projectId) {
      this.goalId = null;
      this.isProjectChange = true;
    } else {
      this.isProjectChange = false;
    }
    this.cdRef.detectChanges();
    this.getGoalsList();
  }

  setConductValueValue() {
    //    this.myControl.setValue(this.userStoryDetails.auditConductQuestionId);
    this.questions = [];
    this.questions.push({
      conductId: this.userStoryDetails.conductId,
      questionId: this.userStoryDetails.questionId,
      conductQuestionId: this.userStoryDetails.auditConductQuestionId,
      projectId: this.userStoryDetails.projectId,
      questionName: this.userStoryDetails.questionName
    });
    this.myControl.setValue(this.questions[0].conductQuestionId);
  }

  loadSections() {
    if (this.userStoryDetails && this.userStoryDetails.testSuiteId) {
      this.showSectionsDropDown = true;
      this.testSuiteId = this.userStoryDetails.testSuiteId;
      this.sectionId = this.userStoryDetails.testSuiteSectionId;
      this.testRailStore.dispatch(new LoadTestCaseSectionListTriggered(this.userStoryDetails.testSuiteId));
      this.sectionsList$ = this.testRailStore.pipe(select(testRailmoduleReducers.getTestCaseSectionAll));
    }
    else
      this.showSectionsDropDown = false;
  }

  updateSection(sectionId) {
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

  reloadUserStory() {
    this.store.dispatch(new LoadUserstoryHistoryTriggered(this.userStoryDetails.userStoryId))
    if (this.isSprintUserStories)
      this.getSprintUserStoryById(this.userStoryDetails);
    else
      this.getUserStoryById(this.userStoryDetails);
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
    var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
    if (!moduleJson || moduleJson == 'null') {
      console.error(`No modules found`);
      return;
    }
    var modules = JSON.parse(moduleJson);
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
          isEditFieldPermission: this.canAccess_feature_CanSubmitCustomFieldsForProjectManagement
        };

        this.customFieldComponent.outputs = {};
        this.customFieldModuleLoaded = true;

        this.cdRef.detectChanges();
      });
  }

  loadTestRepoModule() {
    var loader = this.projectModulesService["modules"];
    var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
    if (!moduleJson || moduleJson == 'null') {
      console.error(`No modules found`);
      return;
    }
    var modules = JSON.parse(moduleJson);
    //var modules = this.projectModulesService["modules"];

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
          elementInArray.name.toLocaleLowerCase() === "Test Suites View".toLocaleLowerCase()
        );
        this.testSuitView = {};
        this.testSuitView.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        this.testSuitView.inputs = {};
        this.isTestrailLoaded = true;
        this.cdRef.detectChanges();
      });
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

  searchQuestions(questionName) {
    this.isQuestioinLoading = true;
    const searchText = this.myControl.value;
    this.questionName = searchText;
    this.masterDataManagementService.getConductQuestionsforActionLinking(this.projectId, this.questionName)
      .subscribe((res: any) => {
        this.isQuestioinLoading = false;
        this.questions = res.data;
        this.cdRef.markForCheck();
      })
  }

  onChangeQuestion(linkconductQuestionId) {
    this.saveUserStory();
  }

  closeSearchQuestions() {
    this.questionName = "";
    this.myControl.setValue("");
    //this.formGroupDirective.reset();
    this.searchQuestions(this.questionName);
  }

  displayFn(conductQuestionId) {
    if (!conductQuestionId) {
      return "";
    } else if (this.questions.length > 0) {
      const questionDetails = this.questions.find((question) => question.conductQuestionId === conductQuestionId);
      return questionDetails.questionName;
    }
  }

  checkCtrl() {
    if (this.isPermissionForUserStory) {
      this.myControl.enable();
      return false;
    } else {
      this.myControl.disable();
      return true;
    }
  }
}
