// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, NgModuleRef, NgModuleFactoryLoader, Type, NgModuleFactory, ViewContainerRef, ViewChildren, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { take, takeUntil, tap } from "rxjs/operators";
import * as _ from "underscore";
import { GoalModel } from "../../models/GoalModel";
import { GoalSearchCriteriaInputModel } from "../../models/GoalSearchCriteriaInputModel";
import { UserStory } from "../../models/userStory";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { GetUserStoryByIdTriggered, UpdateUserStoryGoalTriggred, UserStoryActionTypes } from "../../store/actions/userStory.actions";
import { State } from "../../store/reducers/index";
import * as projectReducer from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { SprintModel } from "../../models/sprints-model";
import { Project } from "../../models/project";
import { ToastrService } from "ngx-toastr";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel, WorkspaceDashboardFilterModel } from '../../../globaldependencies/models/softlabels-models';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { WidgetService } from '../../services/widget.service';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { FileElement } from '../../models/file-element-model';
import { ProjectModulesService } from '../../services/project.modules.service';
import { ProjectSummaryActionTypes } from '../../store/actions/project-summary.action';
import { DocumentStoreComponent } from "@snovasys/snova-document-management";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
  selector: "app-pm-goal-browse-board",
  templateUrl: "goals-browse-board.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalsBrowseBoardComponent extends AppFeatureBaseComponent implements OnInit {
  @Input("goalSearchCriteria")
  set _setGoalSearchCriteria(goalSearchCriteria: GoalSearchCriteriaInputModel) {
    this.goal = null;
    this.goalSearchCriteria = goalSearchCriteria;
    this.goalsCount = 1;
    this.userStoriesCount = 0;
    if (localStorage.getItem("isSprints")) {
      localStorage.removeItem("isSprints");
      this.getSprintsList();
    } else {
      this.isSprintsBoard = false;
      if(this.goalSearchCriteria.isGoalsPage) {
        this.isGoal = true;
      } else {
        this.isGoal = false;
      }
      this.isSprint = true;
      this.fromCustomApp = false;
    }
  }

  @Input("isSprintsEnable")
  set _isSprintsEnable(data: boolean) {
    this.isSprintsEnable = data;
  }

  @Input("Ids")
  set _Ids(Ids) {
    this.fromCustomApp = true;
    this.Idsforgoals = Ids;
    if (Ids) {
      this.goal = null;
      this.goalSearchCriteria = new GoalSearchCriteriaInputModel();
      this.goalSearchCriteria.isFromSubquery = true;
      this.goalsCount = 1;
      this.isSprintsBoard = false;
      this.isGoal = false;
      this.isSprint = true;
      this.cdref.detectChanges();
    }

  }

  @Input("isInput")
  set _isInput(data: boolean) {
    this.isInput = data;
    if (this.isInput != null) {
      if (localStorage.getItem("goalSearchCriteria")) {
        this.getCompanySettings();
        this.goalSearchCriteria = JSON.parse(localStorage.getItem("goalSearchCriteria"));
        localStorage.removeItem("goalSearchCriteria");
        this.isSprintsBoard = false;
        if (this.goalSearchCriteria.isGoalsPage) {
          this.isGoal = true;
          this.isSprint = false;
        } else {
          this.isGoal = false;
          this.isSprint = true;
        }
        this.fromCustomApp = false;
      }
    }
  }

  @Input('isTestrailEnable')
  set _isTestrailEnable(data: boolean) {
    this.isTestrailEnable = data;
  }

  @Input("isFiltersVisible")
  set _isFiltersVisible(data: boolean) {
    if (data || data == false) {
      this.isFiltersVisible = data;
    }
  }

  // tslint:disable-next-line: ban-types
  @Output() selectedGoalId = new EventEmitter<Object>();
  @Output() getAllGoalsCount = new EventEmitter<string>();
  @Output() getSprintsData = new EventEmitter<string>();
  @Output() emitSprintsView = new EventEmitter<boolean>();
  @ViewChildren("addGoalPopover") addGoalPopovers;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  project$: Observable<Project>;
  softLabels: SoftLabelConfigurationModel[];
  activeSprintsCount$: Observable<number>;
  replanSprintsCount$: Observable<number>;
  activeGoalsCount$: Observable<number>;
  replanGoalsCount$: Observable<number>;
  selectedGoalFromState$: Observable<projectReducer.State>;
  userStoryIsInProgress$: Observable<boolean>;
  anyOperationInProgress$: Observable<boolean>;
  userStoryLoadingOperationInProgress$: Observable<boolean>;
  projectSummaryLoading$: Observable<boolean>;
  entityRolePermisisons$: Observable<EntityRoleFeatureModel[]>;
  userStories$: Observable<UserStory[]>;
  entityRolePermissions: EntityRoleFeatureModel[];
  goalSearchCriteria: GoalSearchCriteriaInputModel;
  Idsforgoals: string;
  openGoalForm: boolean;
  isInput: boolean;
  clearCreateForm: boolean;
  userStoriesCount: number;
  fromCustomApp: boolean = false;
  isFiltersVisible: boolean = false;
  userStorySearchCriteria: UserStorySearchCriteriaInputModel;
  sprintSearchCriteriaModel: SprintModel;
  isTheBoardLayoutReports: boolean;
  isTheBoardLayoutKanban: boolean;
  isBoardTypeForApi: boolean;
  isSprintsEnable: boolean;
  isCompanyLevelEnable: boolean;
  showDiv: boolean;
  selectedGoalIdDetails: string;
  goalId: string;
  goal: GoalModel;
  selectedUserStory: any;
  goalReplanId: string;
  goalsCount: number;
  isSprintsBoard: boolean;
  isSprintsView: boolean;
  isTestrailEnable: boolean;
  isSprintUserStories: boolean;
  isSprint = true;
  isGoal = false;
  isBacklog: any;
  projectId: string;
  selectedTab: string;
  workspaceDashboardFilterId: string;
  filters: any;
  updatedGoal$: Observable<GoalModel>;
  updatedGoal: GoalModel;
  selectedGoal: any;
  showReportsBoard: boolean;
  sortBy: any;
  selectedUserStoryId: string;
  refreshUserStoriesCall = true;
  isPermissionForViewUserstories: boolean;
  newGoalId: string;
  userStory: UserStory;
  projectLabel: string;
  goalLabel: string;
  showCalendarView: boolean;
  showDocuments: boolean;
  showEmployeeTaskBoard: boolean;
  fileElement: FileElement;
  isComponentRefresh: boolean;
  injector: any;
  isGoalChange: boolean;
  documentStoreComponent: any;
  documentStoreLoaded: boolean;
  UserstoryLoader = Array;
  UserstoryLoaderCount: number = 3;
  documents:string="documents";

  public ngDestroyed$ = new Subject();

  constructor(public dialog: MatDialog, private route: ActivatedRoute,
    private store: Store<State>, private cdref: ChangeDetectorRef, private router: Router
    , private widgetService: WidgetService,
    @Inject('ProjectModuleLoader') public projectModulesService: any,
    private ngModuleRef: NgModuleRef<any>,
    private compiler: Compiler,
    private vcr: ViewContainerRef,
    private actionUpdates$: Actions) {
    super();
    this.getCompanySettings();
    this.injector = this.vcr.injector;
    this.isPermissionForViewUserstories=true;
    this.route.params.subscribe((params) => {
      this.projectId = params["id"];
      this.selectedTab = params["tab"];
      if (this.selectedTab === "active-goals" || this.selectedTab === undefined) {
        //this.sortBy = "deadLinedate";
        this.isBacklog = false;
      } else {
        //this.sortBy = "order";
        this.isBacklog = null;
      }
    });

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryActionTypes.UpdateUserStoryGoalCompleted),
        tap(() => {
          this.userStory = null;
        })
      )
      .subscribe();


    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryActionTypes.UpdateUserStoryGoaalFailed),
        tap(() => {
          this.userStory = null;
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectSummaryActionTypes.ProjectSummaryCompleted),
        tap(() => {
          this.activeGoalsCount$ = this.store.pipe(select(projectReducer.getCurrentActiveGoalsCount));
          if (this.selectedTab == 'active-goals') {
            this.activeGoalsCount$.subscribe((x => this.goalsCount = x))
            this.cdref.detectChanges();
          }
        })
      )
      .subscribe();


    this.userStories$ = this.store.pipe(select(projectModuleReducer.getAllUserStories));
    this.project$ = this.store.select(projectModuleReducer.EditProjectById)
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.userStoryIsInProgress$ = this.store.pipe(
      select(projectModuleReducer.getUniqueUserStoryById)
    );
    if (window.matchMedia("(min-width: 768px)").matches) {
      this.showDiv = true;
    }
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.goalsLoadingInProgress)
    );
    this.userStoryLoadingOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.userStoriesLoading)
    );
    this.projectSummaryLoading$ = this.store.pipe(
      select(projectModuleReducer.getProjectViewStatusLoading)
    );

    this.project$ = this.store.select(projectReducer.EditProjectById)

    this.activeSprintsCount$ = this.store.pipe(select(projectReducer.activeSprintsCount));
    this.replanSprintsCount$ = this.store.pipe(select(projectReducer.replanSprintsCount));
    this.activeGoalsCount$ = this.store.pipe(select(projectReducer.getCurrentActiveGoalsCount));
    this.replanGoalsCount$ = this.store.pipe(select(projectReducer.getUnderReplanGoalsCount));
  }

  showBrowseBoard() {

  }

  getCompanySettings() {
    let companySettingsModel: any[] = [];
    companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
    if (companySettingsModel && companySettingsModel.length > 0) {
      let sprintResult = companySettingsModel.filter(item => item.key.trim() == "EnableSprints");
      if (sprintResult.length > 0) {
        this.isCompanyLevelEnable = sprintResult[0].value == "1" ? true : false;
      }
    }
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    if (this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
      this.goalLabel = this.softLabels[0].goalLabel;
      this.cdref.markForCheck();
    }
  }

  selectGoal(goalSelected) {
    this.goal = goalSelected.goal;
    this.getBoardTypesFilter(goalSelected);
    this.selectedGoal = goalSelected.goal;
    this.showReportsBoard = false;
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
    userStorySearchCriteriaTemp.isGoalsPage = this.goalSearchCriteria.isFromSubquery ? this.goalSearchCriteria.isFromSubquery : this.goalSearchCriteria.isGoalsPage;
    if (this.goalSearchCriteria.isGoalsPage) {
      userStorySearchCriteriaTemp.isStatusMultiselect = true;
    } else {
      userStorySearchCriteriaTemp.isStatusMultiselect = false;
    }
    if (this.goal.goalId === "00000000-0000-0000-0000-000000000000") {
      this.isSprintsView = false;
    } else if ((this.goal.goalShortName === "Backlog" && this.goal.goalName === "Backlog") && this.goal.goalStatusId) {
      this.isSprintsView = true;
      userStorySearchCriteriaTemp.goalStatusId = this.goal.goalStatusId;
      userStorySearchCriteriaTemp.projectId = this.goal.projectId;
      userStorySearchCriteriaTemp.isGoalsPage = true;
      userStorySearchCriteriaTemp.goalId = null;

    } else {
      userStorySearchCriteriaTemp.goalStatusId = null;
      userStorySearchCriteriaTemp.projectId = null;

      this.isSprintsView = false;
    }
    userStorySearchCriteriaTemp.userStoryStatusIds = this.goalSearchCriteria.userStoryStatusId;
    userStorySearchCriteriaTemp.ownerUserIds = this.goalSearchCriteria.ownerUserId;
    userStorySearchCriteriaTemp.deadLineDateFrom = this.goalSearchCriteria.deadLineDateFrom;
    userStorySearchCriteriaTemp.deadLineDateTo = this.goalSearchCriteria.deadLineDateTo;
    userStorySearchCriteriaTemp.ownerUserId = this.goalSearchCriteria.ownerUserId;
    userStorySearchCriteriaTemp.sortBy = this.goalSearchCriteria.sortBy;
    userStorySearchCriteriaTemp.sortDirection = this.goalSearchCriteria.sortDirection;
    userStorySearchCriteriaTemp.includeArchive = this.goalSearchCriteria.isIncludedArchive;
    userStorySearchCriteriaTemp.includePark = this.goalSearchCriteria.isIncludedPark;
    userStorySearchCriteriaTemp.userStoryTags = this.goalSearchCriteria.workItemTags;
    if (this.goalSearchCriteria.isGoalsPage) {
      userStorySearchCriteriaTemp.tags = this.goalSearchCriteria.tags;
      userStorySearchCriteriaTemp.goalName = this.goalSearchCriteria.goalName;
      userStorySearchCriteriaTemp.projectIds = this.goalSearchCriteria.projectId;
      userStorySearchCriteriaTemp.goalResponsiblePersonIds = this.goalSearchCriteria.goalResponsiblePersonId;
      userStorySearchCriteriaTemp.goalStatusIds = this.goalSearchCriteria.goalStatusId;
      userStorySearchCriteriaTemp.isTracked = this.goalSearchCriteria.isTracked;
      userStorySearchCriteriaTemp.isOnTrack = this.goalSearchCriteria.isOnTrack;
      userStorySearchCriteriaTemp.isNotOnTrack = this.goalSearchCriteria.isNotOnTrack;
      userStorySearchCriteriaTemp.isProductive = this.goalSearchCriteria.isProductive;
      userStorySearchCriteriaTemp.dependencyUserIds = this.goalSearchCriteria.dependencyUserIds;
      userStorySearchCriteriaTemp.bugCausedUserIds = this.goalSearchCriteria.bugCausedUserIds;
      userStorySearchCriteriaTemp.versionName = this.goalSearchCriteria.versionName;
      userStorySearchCriteriaTemp.projectFeatureIds = this.goalSearchCriteria.projectFeatureIds;
      userStorySearchCriteriaTemp.createdDateFrom = this.goalSearchCriteria.createdDateFrom;
      userStorySearchCriteriaTemp.createdDateTo = this.goalSearchCriteria.createdDateTo;
      userStorySearchCriteriaTemp.updatedDateFrom = this.goalSearchCriteria.updatedDateFrom;
      userStorySearchCriteriaTemp.updatedDateTo = this.goalSearchCriteria.updatedDateTo;
      userStorySearchCriteriaTemp.userStoryTypeIds = this.goalSearchCriteria.userStoryTypeIds;
      userStorySearchCriteriaTemp.userStoryName = this.goalSearchCriteria.userStoryName;
      userStorySearchCriteriaTemp.bugPriorityIds = this.goalSearchCriteria.bugPriorityIds;
      userStorySearchCriteriaTemp.sortBy = this.goalSearchCriteria.sortBy;
      userStorySearchCriteriaTemp.isForFilters = true;
    }
    userStorySearchCriteriaTemp.pageNumber = 1;
    userStorySearchCriteriaTemp.refreshUserStoriesCall = this.refreshUserStoriesCall;
    //userStorySearchCriteriaTemp.sortBy = this.sortBy;
    userStorySearchCriteriaTemp.isForUserStoryoverview = true;
    const userStoryArchive = JSON.stringify(this.goalSearchCriteria.isIncludedArchive);
    const userStoryPark = JSON.stringify(this.goalSearchCriteria.isIncludedPark);
    localStorage.setItem("includeArchive", userStoryArchive);
    localStorage.setItem("includePark", userStoryPark);
    if (!this.goalSearchCriteria.isIncludedPark) {
      userStorySearchCriteriaTemp.isUserStoryParked = false;
    }
    if (!this.goalSearchCriteria.isIncludedArchive) {
      userStorySearchCriteriaTemp.isUserStoryArchived = false;
    }
    if (this.refreshUserStoriesCall) {
      this.selectedUserStory = null;
    }
    this.userStorySearchCriteria = userStorySearchCriteriaTemp;
  }

  goalDetailsBinding(goalSelected) {
    this.refreshUserStoriesCall = goalSelected.checked;
    // this.isPermissionForViewUserstories = this.checkPermissionForViewUserStories();
    this.showEmployeeTaskBoard = this.filters ? this.filters.isEmployeeTaskBoardPage : false;
    if (goalSelected.goal.goalId !== this.goalId) {
      this.selectedUserStory = null;
      this.showReportsBoard = this.filters ? this.filters.isReportsPage : false;
      this.showCalendarView = this.filters ? this.filters.isCalenderView : false;
      this.showDocuments = this.filters ? this.filters.isDocumentsView : false;
    } else if (this.goalSearchCriteria.isAdvancedSearch && this.refreshUserStoriesCall) {
      this.refreshUserStoriesCall = true;
      this.showReportsBoard = this.filters ? this.filters.isReportsPage : false;
      this.showCalendarView = this.filters ? this.filters.isCalenderView : false;
      this.showDocuments = this.filters ? this.filters.isDocumentsView : false;
    }
    if (this.showReportsBoard) {
      this.showReportsBoard = this.filters ? this.filters.isReportsPage : false;
      this.showCalendarView = this.filters ? this.filters.isCalenderView : false;
      this.refreshUserStoriesCall = true;
      this.showDocuments = this.filters ? this.filters.isDocumentsView : false;
    } else {
      this.showReportsBoard = this.filters ? this.filters.isReportsPage : false;
      this.showCalendarView = this.filters ? this.filters.isCalenderView : false;
      this.showDocuments = this.filters ? this.filters.isDocumentsView : false;
      // this.refreshUserStoriesCall = false;
    }
    if (localStorage.getItem("archiveUserStoryId")) {
      localStorage.removeItem("archiveUserStoryId");
      this.selectedUserStory = null;
    }
    this.isTheBoardLayoutKanban = this.filters ? this.filters.selectedItem : ((goalSelected.goal.boardTypeUiId === "e3f924e2-9858-4b8d-bb30-16c64860bbd8") ? true : false);
    this.goal = goalSelected.goal;
    this.cdref.detectChanges();
    this.goalId = this.goal.goalId;
    if (this.goal.goalId == "00000000-0000-0000-0000-000000000000") {
      this.isTheBoardLayoutKanban = false;
      this.isBoardTypeForApi = false;
      this.showReportsBoard = false;
      this.showCalendarView = false;
      this.showDocuments = false;
      this.showEmployeeTaskBoard = false;
    }
    if (localStorage.getItem("userStoryUniquePage")) {
      this.refreshUserStoriesCall = true;
      localStorage.removeItem("userStoryUniquePage");
    }

    if (this.showDocuments) {
      this.getDocumentStore(null);
    }
    if (localStorage.getItem("archivedUserStory")) {
      localStorage.removeItem("archivedUserStory");
      var userStoryId = localStorage.getItem("archivedUserStory");
      if (userStoryId.toLowerCase() == this.selectedUserStoryId.toLowerCase()) {
        this.selectedUserStory = null;
      }
    }
    this.cdref.detectChanges();
  }

  selectUserStory(event) {
    if (event) {
      if (this.goal.goalName == "Backlog") {
        this.isGoalChange = false;
      } else {
        this.isGoalChange = true;
      }
      if (this.goal.inActiveDateTime || this.goal.parkedDateTime || event.userStoryArchivedDateTime || event.userStoryParkedDateTime) {
        this.selectedUserStory = null;
      } else {
        this.selectedUserStoryId = event.userStoryId;
        this.selectedUserStory = event;
        this.isSprintUserStories = event.isFromSprints;
      }
      if (window.matchMedia("(max-width: 768px)").matches) {
        this.showDiv = false;
      } else {
        this.showDiv = true;
      }
    } else {
      this.selectedUserStory = null;
    }
    if (this.isSprintsView) {
      this.selectedGoalIdDetails = "00000000-0000-0000-0000-000000000000";
      if (window.matchMedia("(max-width: 1440px)").matches) {
        this.isGoal = true;
      }
    } else {
      this.selectedGoalIdDetails = this.goal.goalId;
      if (window.matchMedia("(min-width: 1024px) and (max-width: 1260px)").matches) {
        this.isGoal = true;
      }
    }

  }

  checkIsSprintUserstories() {
    return false;
  }

  getGoalsCount(event) {
    this.goalsCount = event;
  }

  clearGoalSelectionHandler() {
    this.selectedUserStory = null;
    this.userStorySearchCriteria = null;
    this.goalReplanId = null;
    this.selectedGoalFromState$ = null;
    this.goal = null;
    this.goalsCount = -1;
    this.cdref.detectChanges();
    this.dialog.closeAll();
  }

  reportsafterClicked(event) {
    this.isTheBoardLayoutReports = true;
  }

  afterClicked(event) {
    this.isTheBoardLayoutKanban = event;
    this.isTheBoardLayoutReports = false;
    this.showDocuments = false;
    this.showReportsBoard = false;
    this.showCalendarView = false;
    this.showEmployeeTaskBoard = false;
    this.selectedUserStory = null;
    this.isGoal = event;
    const userStorySearchCriteriaTemp = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteriaTemp.goalId = this.goal.goalId;

    if (this.goalSearchCriteria.isGoalsPage) {
      userStorySearchCriteriaTemp.isUserStoryParked = this.goalSearchCriteria.isParkedGoal;
      userStorySearchCriteriaTemp.isUserStoryArchived = this.goalSearchCriteria.isArchivedGoal;
    } else {
      userStorySearchCriteriaTemp.isUserStoryParked = false;
      userStorySearchCriteriaTemp.isUserStoryArchived = false;
    }
    if (this.goalSearchCriteria.isGoalsPage) {
      userStorySearchCriteriaTemp.tags = this.goalSearchCriteria.tags;
      userStorySearchCriteriaTemp.goalName = this.goalSearchCriteria.goalName;
      userStorySearchCriteriaTemp.projectIds = this.goalSearchCriteria.projectId;
      userStorySearchCriteriaTemp.goalResponsiblePersonIds = this.goalSearchCriteria.goalResponsiblePersonId;
      userStorySearchCriteriaTemp.goalStatusIds = this.goalSearchCriteria.goalStatusId;
      userStorySearchCriteriaTemp.isTracked = this.goalSearchCriteria.isTracked;
      userStorySearchCriteriaTemp.isOnTrack = this.goalSearchCriteria.isOnTrack;
      userStorySearchCriteriaTemp.isNotOnTrack = this.goalSearchCriteria.isNotOnTrack;
      userStorySearchCriteriaTemp.isProductive = this.goalSearchCriteria.isProductive;
      userStorySearchCriteriaTemp.dependencyUserIds = this.goalSearchCriteria.dependencyUserIds;
      userStorySearchCriteriaTemp.bugCausedUserIds = this.goalSearchCriteria.bugCausedUserIds;
      userStorySearchCriteriaTemp.versionName = this.goalSearchCriteria.versionName;
      userStorySearchCriteriaTemp.projectFeatureIds = this.goalSearchCriteria.projectFeatureIds;
      userStorySearchCriteriaTemp.createdDateFrom = this.goalSearchCriteria.createdDateFrom;
      userStorySearchCriteriaTemp.createdDateTo = this.goalSearchCriteria.createdDateTo;
      userStorySearchCriteriaTemp.updatedDateFrom = this.goalSearchCriteria.updatedDateFrom;
      userStorySearchCriteriaTemp.updatedDateTo = this.goalSearchCriteria.updatedDateTo;
      userStorySearchCriteriaTemp.userStoryTypeIds = this.goalSearchCriteria.userStoryTypeIds;
      userStorySearchCriteriaTemp.userStoryName = this.goalSearchCriteria.userStoryName;
      userStorySearchCriteriaTemp.bugPriorityIds = this.goalSearchCriteria.bugPriorityIds;
      userStorySearchCriteriaTemp.sortBy = this.goalSearchCriteria.sortBy;
      userStorySearchCriteriaTemp.isForFilters = true;
    }
    userStorySearchCriteriaTemp.userStoryStatusId = this.goalSearchCriteria.userStoryStatusId;
    userStorySearchCriteriaTemp.deadLineDateFrom = this.goalSearchCriteria.deadLineDateFrom;
    userStorySearchCriteriaTemp.deadLineDateTo = this.goalSearchCriteria.deadLineDateTo;
    userStorySearchCriteriaTemp.ownerUserId = this.goalSearchCriteria.ownerUserId;
    userStorySearchCriteriaTemp.sortBy = this.goalSearchCriteria.sortBy;
    userStorySearchCriteriaTemp.sortDirection = this.goalSearchCriteria.sortDirection;
    userStorySearchCriteriaTemp.includeArchive = this.goalSearchCriteria.isIncludedArchive;
    userStorySearchCriteriaTemp.includePark = this.goalSearchCriteria.isIncludedPark;
    userStorySearchCriteriaTemp.isGoalsPage = this.goalSearchCriteria.isGoalsPage;
    userStorySearchCriteriaTemp.isForUserStoryoverview = true;
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
    this.selectedUserStoryId = null;
  }

  checkPermissionForViewUserStories() {
    if (this.goal.goalId !== "00000000-0000-0000-0000-000000000000" && this.goalSearchCriteria.isGoalsPage) {
      let entityRolefeatures = JSON.parse(LocalStorageProperties.UserRoleFeatures);
      this.entityRolePermissions = entityRolefeatures.filter(function (role: any) {
        return role.projectId == this.goal.projectId
      })
      let featurePermissions = [];
      featurePermissions = this.entityRolePermissions;
      if (featurePermissions.length > 0) {
        const entityTypeFeatureForViewUserStories = EntityTypeFeatureIds.EntityTypeFeature_ViewWorkItem.toString().toLowerCase();
        // tslint:disable-next-line: prefer-const
        // tslint:disable-next-line: only-arrow-functions
        const viewUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForViewUserStories)
        })
        if (viewUserStoryPermisisonsList.length > 0) {
          return true;
        } else {
          return false;
        }
      }
    } else if (this.goal.goalId === "00000000-0000-0000-0000-000000000000") {
      return true;
    }
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }

  @HostListener("window:resize", [])
  sizeChange() {
    if (window.matchMedia("(max-width: 768px)").matches) {
      this.showDiv = false;
    } else {
      this.showDiv = true;
    }
  }

  getGoalRelatedCharts(event) {
    this.selectedUserStory = null;
    this.showReportsBoard = true;
    this.showCalendarView = false;
    this.showDocuments = false;
    this.showEmployeeTaskBoard = false;
    this.cdref.detectChanges();
  }

  getGoalRelatedCalenderView(event) {
    this.selectedUserStory = null;
    this.showCalendarView = true;
    this.showReportsBoard = false;
    this.showDocuments = false;
    this.showEmployeeTaskBoard = false;
    this.cdref.detectChanges();
  }

  getDocumentStore(event) {
    var loader = this.projectModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modules, function(module: any) { return module.modulePackageName == 'DocumentManagementPackageModule' });

    if (!module) {
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
        this.documentStoreLoaded = true;
        this.cdref.detectChanges();
      });
  }

  getEmployeeTaskBoard(event) {
    this.selectedUserStory = null;
    this.showCalendarView = false;
    this.showReportsBoard = false;
    this.showDocuments = false;
    this.showEmployeeTaskBoard = true;
    this.isTheBoardLayoutKanban = false;
    this.cdref.detectChanges();
  }

  changeUserStoryGoal(goalId) {
    if (this.userStory) {
      // tslint:disable-next-line: triple-equals
      if (goalId != this.userStory.goalId) {
        this.newGoalId = goalId;
        this.userStory.goalId = this.newGoalId;
        this.store.dispatch(new UpdateUserStoryGoalTriggred(this.userStory));
      } else {
        this.store.dispatch(new GetUserStoryByIdTriggered(this.userStory.userStoryId));
      }
    }
  }

  getSprintsList() {
    this.isSprintsBoard = true;
    this.emitSprintsView.emit(this.isSprintsBoard);
    this.isSprint = !this.isSprint;
    this.goal = null;
    if (this.goalSearchCriteria.isGoalsPage) {
      this.isGoal = false;
      localStorage.setItem("isAllGoals", "sprints")
    } else {
      localStorage.setItem("isAllGoals", "goals")
      this.isGoal = true;
    }
    var sprintSearchCriteriaModel = new SprintModel();
    sprintSearchCriteriaModel.projectId = this.projectId;
    sprintSearchCriteriaModel.isBacklog = false;
    sprintSearchCriteriaModel.pageNumber = 1;
    sprintSearchCriteriaModel.pageSize = 5000;
    sprintSearchCriteriaModel.isBacklog = this.isBacklog;
    sprintSearchCriteriaModel.sprintStatusIds = this.goalSearchCriteria.sprintStatusId;
    sprintSearchCriteriaModel.sprintStartDate = this.goalSearchCriteria.sprintStartDate;
    sprintSearchCriteriaModel.sprintEndDate = this.goalSearchCriteria.sprintEndDate;
    sprintSearchCriteriaModel.sprintResponsiblePersonIds = this.goalSearchCriteria.sprintResponsiblePersonId;
    sprintSearchCriteriaModel.projectIds = this.goalSearchCriteria.projectId;
    sprintSearchCriteriaModel.ownerUserIds = this.goalSearchCriteria.ownerUserId;
    sprintSearchCriteriaModel.userStoryStatusIds = this.goalSearchCriteria.userStoryStatusId;
    sprintSearchCriteriaModel.deadLineDateFrom = this.goalSearchCriteria.deadLineDateFrom;
    sprintSearchCriteriaModel.deadLineDateTo = this.goalSearchCriteria.deadLineDateTo;
    sprintSearchCriteriaModel.projectFeatureIds = this.goalSearchCriteria.projectFeatureIds;
    sprintSearchCriteriaModel.bugPriorityIds = this.goalSearchCriteria.bugPriorityIds;
    sprintSearchCriteriaModel.dependencyUserIds = this.goalSearchCriteria.dependencyUserIds;
    sprintSearchCriteriaModel.bugCausedUserIds = this.goalSearchCriteria.bugCausedUserIds;
    sprintSearchCriteriaModel.userStoryTypeIds = this.goalSearchCriteria.userStoryTypeIds;
    sprintSearchCriteriaModel.versionName = this.goalSearchCriteria.versionName;
    sprintSearchCriteriaModel.userStoryName = this.goalSearchCriteria.userStoryName;
    sprintSearchCriteriaModel.workItemTags = this.goalSearchCriteria.workItemTags;
    sprintSearchCriteriaModel.includeArchived = this.goalSearchCriteria.isIncludedArchive;
    sprintSearchCriteriaModel.versionName = this.goalSearchCriteria.versionName;
    sprintSearchCriteriaModel.userStoryName = this.goalSearchCriteria.userStoryName;
    sprintSearchCriteriaModel.includeArchived = this.goalSearchCriteria.isIncludedArchive;
    sprintSearchCriteriaModel.versionName = this.goalSearchCriteria.versionName;
    sprintSearchCriteriaModel.userStoryName = this.goalSearchCriteria.userStoryName;
    sprintSearchCriteriaModel.deadLineDate = this.goalSearchCriteria.deadLineDateFrom;
    sprintSearchCriteriaModel.updatedDateFrom = this.goalSearchCriteria.updatedDateFrom;
    sprintSearchCriteriaModel.updatedDateTo = this.goalSearchCriteria.updatedDateTo;
    sprintSearchCriteriaModel.createdDateFrom = this.goalSearchCriteria.createdDateFrom;
    sprintSearchCriteriaModel.createdDateTo = this.goalSearchCriteria.createdDateTo;
    sprintSearchCriteriaModel.isGoalsPage = this.goalSearchCriteria.isGoalsPage;
    sprintSearchCriteriaModel.isActiveSprints = this.goalSearchCriteria.isActiveSprints;
    sprintSearchCriteriaModel.isBacklogSprints = this.goalSearchCriteria.isBacklogSprints;
    sprintSearchCriteriaModel.isReplanSprints = this.goalSearchCriteria.isReplanSprints;
    sprintSearchCriteriaModel.isDeleteSprints = this.goalSearchCriteria.isDeleteSprints;
    sprintSearchCriteriaModel.isCompletedSprints = this.goalSearchCriteria.isCompletedSprints;
    sprintSearchCriteriaModel.sprintName = this.goalSearchCriteria.sprintName;
    this.sprintSearchCriteriaModel = sprintSearchCriteriaModel;
  }

  getGoalsView() {
    this.isGoal = !this.isGoal;
    this.isSprintsBoard = false;
    if (this.goalSearchCriteria.isGoalsPage) {
      localStorage.setItem("isAllGoals", "goals")
      this.isSprint = false;
    } else {
      localStorage.setItem("isAllGoals", "sprints")
      this.isSprint = true;
    }
  }

  goToBacklog() {
    this.router.navigate(["projects/projectstatus", this.projectId, "backlog-goals"]);
  }

  goToActive() {
    this.router.navigate(["projects/projectstatus", this.projectId, "active-goals"]);
  }


  updateUserStoryGoalEvent(userStory) {
    this.userStory = userStory;
  }

  getBoardTypesFilter(goalSelected) {
    this.filters = null;
    let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
    workspaceDashboardFilterModel.workspaceDashboardId = this.goal.goalId;
    this.widgetService.getWorkspaceDashboardFilter(workspaceDashboardFilterModel)
      .subscribe((responseData: any) => {
        if (responseData.success) {
          if (responseData.data && responseData.data.length > 0) {
            let dashboardFilters = responseData.data[0];
            this.workspaceDashboardFilterId = dashboardFilters.workspaceDashboardFilterId;
            this.filters = JSON.parse(dashboardFilters.filterJson);
            this.goalDetailsBinding(goalSelected);
            this.cdref.detectChanges();
          }
          else {
            this.goalDetailsBinding(goalSelected);
          }
        }
      });
  }

  emitUserStoriesCount(count) {
    if (this.goal.goalId === "00000000-0000-0000-0000-000000000000") {
      this.userStoriesCount = count;
      this.cdref.detectChanges();
    }
  }


  clearGoalForm() {
    this.openGoalForm = !this.openGoalForm;
    this.clearCreateForm = !this.clearCreateForm;
  }

  closeGoalDialog() {
    this.openGoalForm = !this.openGoalForm;
    this.addGoalPopovers.forEach((p: { closePopover: () => void; }) => p.closePopover());
  }

  setHeights() {
    if (!this.isFiltersVisible && this.goalSearchCriteria && this.goalSearchCriteria.isGoalsPage) {
      let styles = {
        height: 'calc(100vh - 165px)'
      }
      return styles;
    }
    else if (this.isFiltersVisible && this.goalSearchCriteria && this.goalSearchCriteria.isGoalsPage) {
      let styles = {
        height: 'calc(100vh - 188px)'
      }
      return styles;
    }
  }
}