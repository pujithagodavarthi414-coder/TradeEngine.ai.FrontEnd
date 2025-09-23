import {
  Component, ElementRef, EventEmitter, Inject, Output, ViewChild,
  Type, NgModuleFactoryLoader, NgModuleFactory, NgModuleRef,
  ViewContainerRef, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, Input, AfterViewInit, ViewChildren, QueryList, ComponentFactoryResolver, Compiler
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTabChangeEvent, MatTabGroup } from "@angular/material/tabs";
import { ActivatedRoute, Router } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { ProjectList, ReportsViewComponent, TestrailMileStoneBaseComponent, TestRunsViewComponent, TestSuitesViewComponent } from "@snovasys/snova-testrepo";
import { LoadProjectRelatedCountsTriggered } from "@snovasys/snova-testrepo";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { _finally } from "rxjs-compat/operator/finally";
import { takeUntil, tap } from "rxjs/operators";
import * as _ from "underscore";
import * as testRailModucers from "@snovasys/snova-testrepo";
import { ProjectsDialogComponent } from "../components/dialogs/projects-dialog.component";
import { ConfigurationSettingModel } from "../models/configurationType";
import { GoalModel } from "../models/GoalModel";
import { GoalSearchCriteriaInputModel } from "../models/GoalSearchCriteriaInputModel";
import { Project } from "../models/project";
import { ProjectSearchResult } from "../models/ProjectSearchResult";
import { GoalActionTypes } from "../store/actions/goal.actions";
import { ProjectSummaryTriggered } from "../store/actions/project-summary.action";
import { EditProjectTriggered, ProjectActionTypes } from "../store/actions/project.actions";
import * as userStoryActions from "../store/actions/userStory.actions";
import { State } from "../store/reducers/index";
import * as projectModuleReducer from "../store/reducers/index";
import { SprintModel } from "../models/sprints-model";
import { CookieService } from "ngx-cookie-service";
import { SoftLabelConfigurationModel } from '../../globaldependencies/models/softlabels-models';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { BoardTypeIds } from '../../globaldependencies/constants/board-types';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { DashboardFilterModel } from "../models/dashboardFilterModel";
import { DashboardList } from "../Models/dashboardList";
import { FeatureIds } from "../../globaldependencies/constants/feature-ids";
import { WidgetService } from "../services/widget.service";
import "../../globaldependencies/helpers/fontawesome-icons"
import { DocumentStoreComponent, FileElement } from '@snovasys/snova-document-management';
import { DragedWidget } from '../models/dragedWidget';
import { AppStoreDialogComponent } from '../components/dialogs/app-store-dialog.component';
import { ProjectModulesService } from '../services/project.modules.service';
import { AddAuditActionsViewComponent, AddAuditActivityViewComponent, AuditConductsViewComponent, AuditConductTimelineView, AuditDetailsComponent, AuditNonComplainceComponent, AuditReportsViewComponent, AuditsViewComponent, ConductQuestionActionComponent, LoadAuditRelatedCountsTriggered } from "@snovasys/snova-audits-module";
import * as auditModuleReducer from "@snovasys/snova-audits-module";
import { SoftLabelPipe } from '../../globaldependencies/pipes/softlabels.pipes';
import { CustomAppsListViewComponent, WidgetsgridsterComponent } from "@snovasys/snova-widget-module";

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
  selector: "app-pm-page-projectstatus",
  templateUrl: "projectStatus.page.template.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
 
  @media only screen and (max-width: 780px) {
     .tab-class {
        position: absolute !important;
        left: 19% !important;
        max-width: 53% !important;
     }

     .audit-tab-class {
        max-width: 63% !important;
     }
   }

   @media only screen and (max-width: 1440px) and (min-width: 781px){
    .tab-class {
       position: absolute !important;
       left: 14% !important;
       max-width: 70% !important;
    }

    .audit-tab-class {
       max-width: 80% !important;
    }
  }

  @media only screen and (max-width: 1620px) and (min-width: 1441px){
    .tab-class {
       position: absolute !important;
       left: 10% !important;
       max-width: 70% !important;
    }

    .audit-tab-class {
       max-width: 80% !important;
    }
  }

  `]
})
export class ProjectStatusPageComponent extends AppFeatureBaseComponent implements AfterViewInit, OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @ViewChildren("addActionPopover") addActionPopover;
  @ViewChild("editProjectPopover") editProjectPopover: SatPopover;
  @ViewChildren("addGoalPopover") addGoalPopovers;
  @ViewChild("archivePopover") archivePopover: SatPopover;
  @ViewChild("enterUserstoryPopover") addUserStoryPopOver: SatPopover;
  @ViewChild("projectMemberPopover") projectMemberPopUp: SatPopover;
  @ViewChild("projectFeaturePopover") projectFeaturePopUp: SatPopover;
  @ViewChild("editThreeDotsPopover") threeDotsPopOver: SatPopover;
  @ViewChild("filterThreeDotsPopover") filterthreeDotsPopOver;
  @ViewChild("uploadCSVPopover") uploadCSVPopup: SatPopover;
  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;

  loadingEntityFeaturesinProgress$: Observable<boolean>;
  loadingRoleFeaturesinProgress$: Observable<boolean>;
  projectSummaryViewLoading$: Observable<boolean>;
  project$: Observable<Project>;
  companySettingsModel$: Observable<any[]>;
  anyOperationInProgress$: Observable<boolean>;
  addOperationInProgress$: Observable<boolean>;
  underReplanGoalsCount$: Observable<number>;
  activeGoalsCount$: Observable<number>;
  backLogGoalsCount$: Observable<number>;
  archivedGoalsCount$: Observable<number>;
  parkedGoalsCount$: Observable<number>;
  projectMemberCount$: Observable<number>;
  projectFeatureCount$: Observable<number>;
  activeSprintsCount$: Observable<number>;
  replanSprintsCount$: Observable<number>;
  completedSprintsCount$: Observable<number>;
  projectSearchResults$: Observable<ProjectSearchResult[]>;
  configurationList$: Observable<ConfigurationSettingModel[]>;
  // FileResultModel$: Observable<FileResultModel[]>;
  projectViewStatusViewLoading$: Observable<boolean>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  projectRelatedData$: Observable<ProjectList>;
  testSuitesCount$: Observable<number>;
  testRunsCount$: Observable<number>;
  testMilestonesCount$: Observable<number>;
  reportsCount$: Observable<number>;

  activeAuditsCount$: Observable<number>;
  activeAuditConductsCount$: Observable<number>;
  activeAuditReportsCount$: Observable<number>;
  actionsCount$: Observable<number>;

  softLabels: SoftLabelConfigurationModel[];

  // This is external variable because, this is totally constucted here and passed in as Input to sub components
  activeGoalsSearchCriteria: GoalSearchCriteriaInputModel;
  backlogGoalsSearchCriteria: GoalSearchCriteriaInputModel;
  replanGoalsSearchCriteria: GoalSearchCriteriaInputModel;
  archivedGoalsSearchCriteria: GoalSearchCriteriaInputModel;
  parkedGoalsSearchCriteria: GoalSearchCriteriaInputModel;
  sprintSearchCriteriaModel: SprintModel;
  configurationList: ConfigurationSettingModel[];

  // Router Parameters
  projectId: string;
  selectedTab: string;
  previousTab: string;
  selectedTabIndex: number;

  // TODO: To be explained further
  project: Project; // TODO: Something wrong
  clearCreateForm = true;
  openGoalForm = false;
  goalStatusId: string;
  goalsTabFilter: string;
  goal: GoalModel;
  errorMessage: boolean;
  isSprint: boolean;
  validationMessage: string;
  userStoryReferenceTypeId = ConstantVariables.UserStoryReferenceTypeId.toLowerCase();
  projectReferenceTypeId = ConstantVariables.ProjectReferenceTypeId.toLowerCase();
  userStoryName: string;
  userStoryNamesList: string[];
  myFiles: any[];
  isAddUserStory: boolean;
  accessTestRepo$: Boolean;
  accessAudits$: Boolean;
  accessDragApps$: Boolean;
  accessViewProjects$: Boolean;
  accessPublishBoard$: Boolean;
  accessTestRepo: boolean;
  accessAudits: boolean;
  isEditProject = false;
  loadprojectMember: boolean;
  clearProjectMemberForm = true;
  loadprojectFeature: boolean;
  clearProjectFeatureForm = true;
  isFileUpload: boolean;
  // FileResultModel: FileResultModel[];
  isArchiveProject: boolean;
  isComponentArchived: boolean = false; testSuitView: any;
  testRunView: any = {};
  testMileStone: any = {};
  testReportsView: any = {};
  isDisabledButton = true;
  // userStoryTypes: UserstoryTypeModel[];
  // bugUserStoryTypeModel: UserstoryTypeModel;
  // userStoryTypeModel: UserstoryTypeModel;
  public ngDestroyed$ = new Subject();
  tabisActive = false;
  visibleLabel = true;
  selectedApps: DragedWidget;
  selectedWorkspaceId: string = null;
  reloadDashboard: string = null;
  dashboardFilter: DashboardFilterModel;
  appTagSearchText = "Projects";
  fileElement: FileElement;
  isComponentRefresh: boolean;
  isMat_Tab_Loaded: boolean = true;
  accessViewProject: Boolean = false;
  loadAction: Boolean = false;
  loadActionModule: string;
  selectedAppForListView: any;
  listView: boolean = false;
  isSprintsEnable: boolean;
  isTestrailEnable: boolean;
  isTestrailLoaded: boolean;
  isAuditsEnable: boolean;
  isAuditsLoaded: boolean;
  auditView: any = {};
  conductView: any = {};
  timelineView: any = {};
  actionView: any = {};
  addActionView: any = {};
  auditReportView: any = {};
  auditActivityView: any = {};
  auditAnalyticView: any = {};
  isSprintsShow: boolean;
  isHavingPermissions: any;
  canAccess_feature_ViewTestrepoReports: Boolean;
  selectedActivityWorkspaceId: string = null;
  injector: any;
  dashboard: any;
  isAnyAppSelected: boolean;
  loaded: boolean;
  documentStoreComponent: any;
  documentsModuleLoaded: boolean;
  // companyStoreId: string;
  fromAuditMenu: boolean;
  constructor(
    //sharedStore: Store<SharedState.State>,
    // private commonStore: Store<SharedState.State>,
    //  private documentManagementStore: Store<DocumentManagementState.State>,
    private route: ActivatedRoute,
    private store: Store<State>,
    private router: Router,
    private actionUpdates$: Actions,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    //private projectsService: ProjectsService,
    private widgetService: WidgetService,
    private translateService: TranslateService,
    private snackbar: MatSnackBar,
    private toastr: ToastrService,
    private testRailStore: Store<testRailModucers.State>,
    private auditStore: Store<auditModuleReducer.State>,
    @Inject('ProjectModuleLoader') public projectModulesService: any,
    //private masterSettings: MaterSettingService,
    private cookieService: CookieService, private compiler: Compiler,
    private vcr: ViewContainerRef,
    private ngModuleRef: NgModuleRef<any>,
    private softLabelPipe: SoftLabelPipe
  ) {

    super();
    this.injector = this.vcr.injector;
    if (this.router.url.includes("/audit/")) {
      this.fromAuditMenu = true;
    }
    let roleFeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures))
    this.accessTestRepo$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_AccessTestrepo.toString().toLowerCase(); }) != null;
    this.accessPublishBoard$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_PublishAsDefault.toString().toLowerCase(); }) != null;
    this.accessDragApps$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_DragApps.toString().toLowerCase(); }) != null;
    if (!this.fromAuditMenu) { 
      this.accessAudits$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_AccessAudits.toString().toLowerCase(); }) != null;
      this.accessViewProjects$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjects.toString().toLowerCase(); }) != null;
    }
    else if (this.fromAuditMenu) { 
      this.accessAudits$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAudits.toString().toLowerCase(); }) != null;
      this.accessViewProjects$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjectsInAudits.toString().toLowerCase(); }) != null;
    }
    this.subscribeToRouteChangeAndInitializeTheEntirePage();
    this.route.fragment
      .subscribe(f => {
        if (f == 'audits') {
          this.fromAuditMenu = true;
        }
      })
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectActionTypes.EditProjectsCompleted),
        tap(() => {
          this.project$ = this.store.pipe(select(projectModuleReducer.EditProjectById))
          this.project$.subscribe((project) => this.project = project);
          this.isSprintsShow = this.project.isSprintsConfiguration;
          this.cdRef.detectChanges();
          this.dialog.closeAll();
        })
      )
      .subscribe();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(
          userStoryActions.UserStoryActionTypes
            .CreateMultipleUserStoriesSplitCompleted
        ),
        tap(() => {
          this.userStoryName = "";
          const popover = this.addUserStoryPopOver;
          if (popover) { popover.close(); }

        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(
          ProjectActionTypes.ArchiveProjectCompleted
        ),
        tap(() => {
          this.closeArchiveDialog("");
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.MultipleUserStoriesUsingFileCompleted),
        tap(() => {
          this.closeFileUploadDialog();

        })
      )
      .subscribe();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActionTypes.CreateGoalCompleted),
        tap(() => {
          this.store.dispatch(new ProjectSummaryTriggered(this.projectId));
        })
      )
      .subscribe();

  }

  ngAfterViewInit(): void {
    super.ngOnInit()
    let roleFeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures))
    this.accessTestRepo$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_AccessTestrepo.toString().toLowerCase(); }) != null;
    this.accessPublishBoard$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_PublishAsDefault.toString().toLowerCase(); }) != null;
    this.accessDragApps$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_DragApps.toString().toLowerCase(); }) != null;
    if (!this.fromAuditMenu) { 
      this.accessAudits$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_AccessAudits.toString().toLowerCase(); }) != null;
      this.accessViewProjects$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjects.toString().toLowerCase(); }) != null;
    }
    else if (this.fromAuditMenu) { 
      this.accessAudits$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAudits.toString().toLowerCase(); }) != null;
      this.accessViewProjects$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjectsInAudits.toString().toLowerCase(); }) != null;
    }

    this.subscribeToRouteChangeAndInitializeTheEntirePage();
  }

  // ngAfterViewChecked(): void {

  //   if (this.isMat_Tab_Loaded)
  //     this.subscribeToRouteChangeAndInitializeTheEntirePage();
  //  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.createProjectLoading)
    );
    // this.loadingEntityFeaturesinProgress$ = this.store.pipe(select(sharedModuleReducers.getEntityFeaturesLoading))
    // this.loadingRoleFeaturesinProgress$ = this.store.pipe(select(sharedModuleReducers.getRoleFeaturesLoading))

    this.projectSummaryViewLoading$ = this.store.pipe(
      select(projectModuleReducer.getProjectViewStatusLoading)
    );

    this.projectSearchResults$ = this.store.pipe(
      select(projectModuleReducer.getProjectsAll)
    );
    this.activeGoalsCount$ = this.store.pipe(
      select(projectModuleReducer.getCurrentActiveGoalsCount)
    );
    this.backLogGoalsCount$ = this.store.pipe(
      select(projectModuleReducer.getBackLogGoalsCount)
    );
    this.underReplanGoalsCount$ = this.store.pipe(
      select(projectModuleReducer.getUnderReplanGoalsCount)
    );
    this.archivedGoalsCount$ = this.store.pipe(
      select(projectModuleReducer.getArchivedGoalsCount)
    );
    this.projectMemberCount$ = this.store.pipe(
      select(projectModuleReducer.getProjectMemberCount)
    );
    this.projectFeatureCount$ = this.store.pipe(
      select(projectModuleReducer.getProjectFeatureCount)
    );
    this.parkedGoalsCount$ = this.store.pipe(
      select(projectModuleReducer.getParkedGoalsCount)
    );
    this.activeSprintsCount$ = this.store.pipe(
      select(projectModuleReducer.activeSprintsCount)
    );
    this.replanSprintsCount$ = this.store.pipe(
      select(projectModuleReducer.replanSprintsCount)
    );
    this.completedSprintsCount$ = this.store.pipe(
      select(projectModuleReducer.completedSprintsCount)
    );

    // this.FileResultModel$ = this.store.pipe(
    //   select(commonModuleReducers.getFileUploadAll)
    // );
    // this.addOperationInProgress$ = this.store.pipe(
    //   select(commonModuleReducers.createuserStoryLoading)
    // );

    this.projectViewStatusViewLoading$ = this.store.pipe(
      select(projectModuleReducer.getProjectViewStatusLoading)
    );
    if (this.selectedTab === "project-members" || this.selectedTab === "templates" || this.selectedTab === "project-features" ||
      this.selectedTab === "project-settings") {
      this.tabisActive = true;
      this.isComponentArchived = false;
    }

    // this.canAccess_entityType_feature_ViewGoals$.subscribe((y) => {

    //   this.accessViewProject = y;
    //   // if (!y)
    //   //   this.selectedTabIndex = this.getTabIndex("documents");
    // })

    this.isHavingPermissions =
      this.canAccess_entityType_feature_ViewProjectFeatures || this.canAccess_entityType_feature_ViewTemplates ||
      this.canAccess_entityType_feature_ViewProjectMembers || this.canAccess_entityType_feature_ViewProjectSettings ||
      this.canAccess_entityType_feature_ViewGoals || this.canAccess_entityType_feature_AddOrUpdateVersion ||
      this.canAccess_entityType_feature_ViewAuditProjectMembers
  }
  translateCode(code) {
    return this.softLabelPipe.transform(this.translateService.instant(code), this.softLabels);
  }
  getCompanySettings() {
    let companySettingsModel: any[] = [];
    companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
    if (companySettingsModel && companySettingsModel.length > 0) {
      let companyResult = companySettingsModel.filter(item => item.key.trim() == "EnableSprints");
      if (companyResult.length > 0) {
        this.isSprintsEnable = companyResult[0].value == "1" ? true : false;
      }
      let testRailResult = companySettingsModel.filter(item => item.key.trim() == "EnableTestcaseManagement");
      if (testRailResult.length > 0) {
        this.isTestrailEnable = testRailResult[0].value == "1" ? true : false;
      }
      let auditResult = companySettingsModel.filter(item => item.key.trim() == "EnableAuditManagement");
      if (auditResult.length > 0) {
        this.isAuditsEnable = auditResult[0].value == "1" ? true : false;
      }
    }
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  GetCustomizedDashboardId() {
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "Project";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceId = result.data;
        this.selectedApps = null;
        this.reloadDashboard = null;
        this.listView = true;
        this.loadWidgetModule("Custom apps view");
      }
    });
  }


  GetCustomizedDashboardIdForActivity() {
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "ProjectActivity";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedApps = null;
        this.reloadDashboard = null;
        this.selectedActivityWorkspaceId = result.data;
        this.listView = false;
        this.loadWidgetModule("Custom apps view");
      }
    });
  }

  clearGoalForm() {
    this.openGoalForm = !this.openGoalForm;
    this.clearCreateForm = !this.clearCreateForm;
  }

  closeProjectDialog() {
    const popover = this.editProjectPopover;
    if (popover) { popover.close(); }
    this.isEditProject = false;
  }

  closeGoalDialog() {
    this.openGoalForm = !this.openGoalForm;
    this.addGoalPopovers.forEach((p: { closePopover: () => void; }) => p.closePopover());
  }

  closeArchiveDialog(event) {
    const popover = this.archivePopover;
    if (popover) { popover.close(); }
  }

  openArchiveDialog() {
    this.isArchiveProject = true;
  }

  closeFileUploadDialog() {
    const popover = this.uploadCSVPopup;
    if (popover) { popover.close(); }
  }

  editProject() {
    this.editProjectPopover.open();
    this.isEditProject = true;
  }

  goToBacklog() {
    if(!this.fromAuditMenu) {
      this.router.navigate(["projectstatus", this.projectId, "backlog-goals"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "backlog-goals");
    }
  }

  ClearAllUploads() {
    this.myFiles = [];
  }

  // uploadEventHandler(event) {
  //   var moduleTypeId = 4;
  //   var file = event.target.files[0];
  //   var formData = new FormData();
  //   formData.append("file", file);
  //   this.store.dispatch(new FileUploadActionTriggered(formData,moduleTypeId));
  // }



  createProjectMember() {
    this.loadprojectMember = true;
    this.clearProjectMemberForm = !this.clearProjectMemberForm;
    this.projectMemberPopUp.open();
  }

  closeProjectMemberDialog() {
    this.projectMemberPopUp.close();
  }

  createProjectFeature() {
    this.loadprojectFeature = true;
    this.clearProjectFeatureForm = !this.clearProjectFeatureForm;
    this.projectFeaturePopUp.open();
  }

  closeProjectFeatureDialog() {
    this.projectFeaturePopUp.close();
  }

  // searchUserStoryTypes() {
  //   const userStoryType = new UserstoryTypeModel();
  //   userStoryType.isArchived = false;
  //   this.projectsService.SearchUserStoryTypes(userStoryType).subscribe((result: any) => {
  //     if (result.success) {
  //       this.userStoryTypes = result.data;
  //       this.bugUserStoryTypeModel = this.userStoryTypes.find((x) => x.isBug);
  //       this.userStoryTypeModel = this.userStoryTypes.find((x) => x.isUserStory);
  //     }
  //   })
  // }

  getProjectMembersCount() {
    this.store.dispatch(new ProjectSummaryTriggered(this.projectId));
  }

  onTabClick(event: MatTabChangeEvent) {
    // tslint:disable-next-line:prefer-const
    this.dialog.closeAll();
    if(!this.fromAuditMenu) {
    if (event.tab.textLabel.includes("Active")) {
      this.selectedTab = "active-goals";
      localStorage.removeItem('reportTestRunName');
      // tslint:disable-next-line:prefer-const
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    } else if (event.tab.textLabel.includes("Backlog")) {
      this.selectedTab = "backlog-goals";
      localStorage.removeItem('reportTestRunName');
      // tslint:disable-next-line:prefer-const
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    } else if (event.tab.textLabel.includes("Under")) {
      this.selectedTab = "replan-goals";
      localStorage.removeItem('reportTestRunName');
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    } else if (event.tab.textLabel.includes("Reporting")) {
      this.selectedTab = "reporting-members";
      localStorage.removeItem('reportTestRunName');
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    }
    else if (event.tab.textLabel.includes("Reports")) {
      this.selectedApps = null;
      this.selectedTab = "reports";
      localStorage.removeItem('reportTestRunName');
      this.dashboardFilter = new DashboardFilterModel();
      this.dashboardFilter.projectId = this.projectId;
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    } else if (event.tab.textLabel.includes("Activity")) {
      this.selectedApps = null;
      this.selectedTab = "activity";
      localStorage.removeItem('reportTestRunName');
      this.dashboardFilter = new DashboardFilterModel();
      this.dashboardFilter.projectId = this.projectId;
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    }
    // else if (event.tab.textLabel.includes("Members")) {
    //   this.selectedTab = "project-members";
    //   this.router.navigate([
    //     "projectstatus",
    //     this.projectId,
    //     this.selectedTab
    //   ]);
    // }
    // tslint:disable-next-line: one-line
    else if (event.tab.textLabel.includes("Archived")) {
      this.selectedTab = "archived-goals";
      localStorage.removeItem('reportTestRunName');
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    } else if (event.tab.textLabel.includes("Parked")) {
      this.selectedTab = "parked-goals";
      localStorage.removeItem('reportTestRunName');
      // tslint:disable-next-line:prefer-const
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    } else if (event.tab.textLabel.includes("Scenarios")) {
      this.selectedTab = "scenarios";
      this.loadTestRepoModule();
      localStorage.removeItem('reportTestRunName');
      // tslint:disable-next-line:prefer-const
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    } else if (event.tab.textLabel.includes("Runs")) {
      this.selectedTab = "runs";
      this.loadTestRepoModule();
      // tslint:disable-next-line:prefer-const
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    } else if (event.tab.textLabel.includes("Milestones")) {
      this.selectedTab = "versions";
      // tslint:disable-next-line:prefer-const
      localStorage.removeItem('reportTestRunName');
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    }
    else if (event.tab.textLabel.includes("reports")) {
      this.selectedApps = null;
      this.selectedTab = "test-reports";
      localStorage.removeItem('reportTestRunName');
      // tslint:disable-next-line:prefer-const
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    } else if (event.tab.textLabel.includes("Documents")) {
      this.selectedTab = ConstantVariables.DocumentManagementRouteConstant;
      this.loadDocumentManagementModule();
      // tslint:disable-next-line:prefer-const
      localStorage.removeItem('reportTestRunName');
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    }
    else if (event.tab.textLabel.includes("Audits")) {
      this.selectedTab = "audits";
      localStorage.removeItem('ConductedAudit');
      localStorage.removeItem('reportTestRunName');
      this.loadAuditsModule();
      // tslint:disable-next-line:prefer-const
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    }
    else if (event.tab.textLabel.includes("Conducts")) {
      this.selectedTab = "conducts";
      localStorage.removeItem('reportTestRunName');
      this.loadAuditsModule();
      // tslint:disable-next-line:prefer-const
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    }
    else if (event.tab.textLabel.includes("Timeline")) {
      this.selectedTab = "timeline";
      localStorage.removeItem('ConductedAudit');
      localStorage.removeItem('reportTestRunName');
      this.loadAuditsModule();
      // tslint:disable-next-line:prefer-const
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    }
    else if (event.tab.textLabel.includes("Actions")) {
      this.selectedTab = "actions";
      localStorage.removeItem('ConductedAudit');
      localStorage.removeItem('reportTestRunName');
      this.loadAuditsModule();
      // tslint:disable-next-line:prefer-const
      this.router.navigate([
        "projects/projectstatus",
        this.projectId,
        this.selectedTab
      ]);
    }
  } else {
    this.openRoute(event);
  }
  }

  openRoute(event: MatTabChangeEvent) {
    if (event.tab.textLabel.includes("Active")) {
      this.selectedTab = "active-goals";
      localStorage.removeItem('reportTestRunName');
      // tslint:disable-next-line:prefer-const
      this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    } else if (event.tab.textLabel.includes("Backlog")) {
      this.selectedTab = "backlog-goals";
      localStorage.removeItem('reportTestRunName');
      // tslint:disable-next-line:prefer-const
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    } else if (event.tab.textLabel.includes("Under")) {
      this.selectedTab = "replan-goals";
      localStorage.removeItem('reportTestRunName');
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    } else if (event.tab.textLabel.includes("Reporting")) {
      this.selectedTab = "reporting-members";
      localStorage.removeItem('reportTestRunName');
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    }
    else if (event.tab.textLabel.includes("Reports")) {
      this.selectedApps = null;
      this.selectedTab = "reports";
      localStorage.removeItem('reportTestRunName');
      this.dashboardFilter = new DashboardFilterModel();
      this.dashboardFilter.projectId = this.projectId;
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    } else if (event.tab.textLabel.includes("Activity")) {
      this.selectedApps = null;
      this.selectedTab = "activity";
      localStorage.removeItem('reportTestRunName');
      this.dashboardFilter = new DashboardFilterModel();
      this.dashboardFilter.projectId = this.projectId;
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    }
    // else if (event.tab.textLabel.includes("Members")) {
    //   this.selectedTab = "project-members";
    //   this.router.navigate([
    //     "projectstatus",
    //     this.projectId,
    //     this.selectedTab
    //   ]);
    // }
    // tslint:disable-next-line: one-line
    else if (event.tab.textLabel.includes("Archived")) {
      this.selectedTab = "archived-goals";
      localStorage.removeItem('reportTestRunName');
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    } else if (event.tab.textLabel.includes("Parked")) {
      this.selectedTab = "parked-goals";
      localStorage.removeItem('reportTestRunName');
      // tslint:disable-next-line:prefer-const
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    } else if (event.tab.textLabel.includes("Scenarios")) {
      this.selectedTab = "scenarios";
      this.loadTestRepoModule();
      localStorage.removeItem('reportTestRunName');
      // tslint:disable-next-line:prefer-const
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    } else if (event.tab.textLabel.includes("Runs")) {
      this.selectedTab = "runs";
      this.loadTestRepoModule();
      // tslint:disable-next-line:prefer-const
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    } else if (event.tab.textLabel.includes("Milestones")) {
      this.selectedTab = "versions";
      // tslint:disable-next-line:prefer-const
      localStorage.removeItem('reportTestRunName');
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    }
    else if (event.tab.textLabel.includes("reports")) {
      this.selectedApps = null;
      this.selectedTab = "test-reports";
      localStorage.removeItem('reportTestRunName');
      // tslint:disable-next-line:prefer-const
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    } else if (event.tab.textLabel.includes("Documents")) {
      this.selectedTab = ConstantVariables.DocumentManagementRouteConstant;
      this.loadDocumentManagementModule();
      // tslint:disable-next-line:prefer-const
      localStorage.removeItem('reportTestRunName');
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    }
    else if (event.tab.textLabel.includes("Audits")) {
      this.selectedTab = "audits";
      localStorage.removeItem('ConductedAudit');
      localStorage.removeItem('reportTestRunName');
      this.loadAuditsModule();
      // tslint:disable-next-line:prefer-const
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    }
    else if (event.tab.textLabel.includes("Conducts")) {
      this.selectedTab = "conducts";
      localStorage.removeItem('reportTestRunName');
      this.loadAuditsModule();
      // tslint:disable-next-line:prefer-const
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    }
    else if (event.tab.textLabel.includes("Timeline")) {
      this.selectedTab = "timeline";
      localStorage.removeItem('ConductedAudit');
      localStorage.removeItem('reportTestRunName');
      this.loadAuditsModule();
      // tslint:disable-next-line:prefer-const
     this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    }
    else if (event.tab.textLabel.includes("Actions")) {
      this.selectedTab = "actions";
      localStorage.removeItem('ConductedAudit');
      localStorage.removeItem('reportTestRunName');
      this.loadAuditsModule();
      // tslint:disable-next-line:prefer-const
      this.router.navigateByUrl(
        "projects/projectstatus/" +
        this.projectId + "/audit/" +
        this.selectedTab
      );
    }
  }

  openProjectsDialog() {
    const projectDialog = this.dialog.open(ProjectsDialogComponent, {
      minWidth: "85vw",
      minHeight: "85vh",
      disableClose: true,
      data: { projectId: this.projectId, fromAuditMenu: this.fromAuditMenu }
    });

    projectDialog.afterClosed().subscribe(() => {
    });

  }

  getGoalsBasedOnProject(event) {
    const projectId = event.projectId;
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", projectId, "active-goals"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "active-goals");
    }
  }

  checkSelectedTab() {
    if (this.selectedTab == "archived-goals") {
      return false;
    } else if (this.selectedTab == "parked-goals") {
      return false;
    } else {
      return true;
    }
  }

  SelectedGoal(goal) {
    this.goal = goal.goal;
    const boardTypeUIId = this.goal.boardTypeUiId;
    if (this.goal.isBugBoard && boardTypeUIId === BoardTypeIds.BoardViewKey) {
      this.isAddUserStory = false;
      this.isFileUpload = true;
      this.cdRef.detectChanges();
    } else if (!this.goal.isBugBoard && boardTypeUIId === BoardTypeIds.BoardViewKey) {
      this.isAddUserStory = false;
      this.isFileUpload = false;
      this.cdRef.detectChanges();
    } else {
      this.isFileUpload = false;
      this.isAddUserStory = true;
      this.cdRef.detectChanges();
    }
  }

  getTabIndex(tabName: string) {
    if (this.matTabGroup != null && this.matTabGroup != undefined) {

      this.isMat_Tab_Loaded = false;
      const matTabs = this.matTabGroup._tabs.toArray();

      let index = 0;

      for (const matTab of matTabs) {
        if (matTab.textLabel === "Active goals" && tabName === "active-goals") {
          return index;
        }
        if (matTab.textLabel === "Backlog" && tabName === "backlog-goals") {
          return index;
        }
        if (matTab.textLabel === "Under replan" && tabName === "replan-goals") {
          return index;
        }
        if (matTab.textLabel === "Archived goals" && tabName === "archived-goals") {
          return index;
        }
        if (matTab.textLabel === "Parked goals" && tabName === "parked-goals") {
          return index;
        }
        if (matTab.textLabel === "Scenarios" && tabName === "scenarios") {
          return index;
        }
        if (matTab.textLabel === "Reports" && tabName === "reports") {
          return index;
        }
        if (matTab.textLabel === "Activity" && tabName === "activity") {
          return index;
        }
        if (matTab.textLabel === "Runs" && tabName === "runs") {
          return index;
        }
        if (matTab.textLabel === "Documents" && tabName === "documents") {
          return index;
        }
        if (matTab.textLabel === "Milestones" && tabName === "versions") {
          return index;
        }
        if (matTab.textLabel === "Test reports" && tabName === "test-reports") {
          return index;
        }
        if (matTab.textLabel === "Audits" && tabName === "audits") {
          return index;
        }
        if (matTab.textLabel === "Conducts" && tabName === "conducts") {
          return index;
        }
        if (matTab.textLabel === "Timeline" && tabName === "timeline") {
          return index;
        }
        if (matTab.textLabel === "Actions" && tabName === "actions") {
          return index;
        }
        index++;
      }

      return index;
    }
  }

  subscribeToRouteChangeAndInitializeTheEntirePage() {

    this.dialog.closeAll();
    this.getCompanySettings();
    this.route.params.subscribe((params) => {
      if (this.router.url.includes("/audit/")) {
        this.fromAuditMenu = true;
      }
      if (params["id"] !== this.projectId) {
        this.projectId = params["id"];
        this.store.dispatch(new EditProjectTriggered(this.projectId));
        this.store.dispatch(new ProjectSummaryTriggered(this.projectId));
        if (this.accessTestRepo$) {
          setTimeout(() => {
            this.loadTestRepoModule();
          }, 3000);
        }
        if (this.accessAudits$) {
          setTimeout(() => {
            this.loadAuditsModule();
          }, 500);
        }
      }
      this.projectId = params["id"];
      if (this.fromAuditMenu) {
        if(!this.selectedTab) {
          this.selectedTab = params["tab"].substring(params["tab"].indexOf("/"));
          this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + this.selectedTab);
           //return;
        } else {
          this.selectedTab = params["tab"].substring(params["tab"].indexOf("/"));
          this.selectTab();
          return;
        }       
      } else {
        this.selectedTab = params["tab"];
      }
     this.selectTab();

    });
  }

  selectTab() {
    if (this.selectedTab === "audit-analytics") {
      this.selectedWorkspaceId = this.loaded = null;
      this.selectedAppForListView = null;
      this.selectedApps = null;
      this.reloadDashboard = null;
      this.getCustomizedAuditDashboardId();
    }
    if (this.selectedTab != "conducts") {
      localStorage.removeItem('ConductedAudit');
    }
    if (this.selectedTab != "runs") {
      localStorage.removeItem('reportTestRunName');
    }
    this.isComponentArchived = false;
    this.dashboardFilter = new DashboardFilterModel();
    this.dashboardFilter.projectId = this.projectId;
    this.selectedWorkspaceId = null;
    this.selectedApps = null;
    this.reloadDashboard = null;
    if (this.selectedTab == "scenarios") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "documents") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "runs") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "reports") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "activity") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "audits") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "conducts") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "timeline") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "actions") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else {
      this.selectedTabIndex = 0;
    }

    if (!this.matTabGroup) {
      return;
    }


    this.isHavingPermissions =
      this.canAccess_entityType_feature_ViewProjectFeatures || this.canAccess_entityType_feature_ViewTemplates ||
      this.canAccess_entityType_feature_ViewProjectMembers || this.canAccess_entityType_feature_ViewProjectSettings ||
      this.canAccess_entityType_feature_ViewGoals || this.canAccess_entityType_feature_AddOrUpdateVersion ||
      this.canAccess_entityType_feature_ViewAuditProjectMembers

    let previousValue = this.cookieService.get("selectedProjectsTab");
    if (previousValue) {
      this.previousTab = previousValue;
    }
    else {
      this.previousTab = "active-goals";
    }
    // tslint:disable-next-line: prefer-const
    let goalSearchCriteriaTemp = new GoalSearchCriteriaInputModel();
    goalSearchCriteriaTemp.projectId = this.projectId;
    goalSearchCriteriaTemp.goalStatusId = this.goalStatusId;
    goalSearchCriteriaTemp.isArchived = false;
    goalSearchCriteriaTemp.isParked = false;
    goalSearchCriteriaTemp.isGoalsPage = false;
    goalSearchCriteriaTemp.isAdvancedSearch = false;
    goalSearchCriteriaTemp.sortBy = null;
    if (this.selectedTab == "scenarios") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "documents") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "runs") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "reports") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "activity") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "audits") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "conducts") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "timeline") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else if (this.selectedTab === "actions") {
      this.selectedTabIndex = this.getTabIndex(this.selectedTab);
    } else {
      this.selectedTabIndex = 0;
    }
    if (this.selectedTab == "reports") {
      this.selectedApps = null;
      this.reloadDashboard = null;
      this.GetCustomizedDashboardId();

    } else if (this.selectedTab == "activity") {
      this.selectedApps = null;
      this.reloadDashboard = null;
      this.GetCustomizedDashboardIdForActivity();
    }
    if (this.selectedTab === "active-goals") {
      this.selectedTabIndex = 0;
      goalSearchCriteriaTemp.goalStatusId =
        ConstantVariables.ActiveGoalStatusId;
      goalSearchCriteriaTemp.isArchived = false;
      goalSearchCriteriaTemp.isParked = false;
      goalSearchCriteriaTemp.sortBy = null;
      this.activeGoalsSearchCriteria = goalSearchCriteriaTemp;
    } else if (this.selectedTab === "backlog-goals") {
      this.selectedTabIndex = 0;
      goalSearchCriteriaTemp.goalStatusId =
        ConstantVariables.BacklogGoalStatusId;
      goalSearchCriteriaTemp.isArchived = false;
      goalSearchCriteriaTemp.isParked = false;
      goalSearchCriteriaTemp.sortBy = null;
      this.backlogGoalsSearchCriteria = goalSearchCriteriaTemp;
    } else if (this.selectedTab === "replan-goals") {
      this.selectedTabIndex = 0;
      goalSearchCriteriaTemp.goalStatusId =
        ConstantVariables.ReplanGoalStatusId;
      goalSearchCriteriaTemp.isArchived = false;
      goalSearchCriteriaTemp.isParked = false;
      goalSearchCriteriaTemp.sortBy = null;
      this.replanGoalsSearchCriteria = goalSearchCriteriaTemp;
      this.isMat_Tab_Loaded = false;
    } else if (this.selectedTab === "archived-goals") {
      this.selectedTabIndex = 0;
      goalSearchCriteriaTemp.goalStatusId = null;
      goalSearchCriteriaTemp.isArchived = true;
      goalSearchCriteriaTemp.isParked = false;
      goalSearchCriteriaTemp.sortBy = null;
      this.archivedGoalsSearchCriteria = goalSearchCriteriaTemp;
      this.isMat_Tab_Loaded = false;
    } else if (this.selectedTab === "parked-goals") {
      this.selectedTabIndex = 0;
      goalSearchCriteriaTemp.goalStatusId = null;
      goalSearchCriteriaTemp.isArchived = false;
      goalSearchCriteriaTemp.isParked = true;
      goalSearchCriteriaTemp.sortBy = null;
      this.parkedGoalsSearchCriteria = goalSearchCriteriaTemp;
      this.isMat_Tab_Loaded = false;
    } else if (this.selectedTab === "completed-sprints") {
      this.selectedTabIndex = 0;
      var activeSearchCriteriaTemp = new SprintModel();
      activeSearchCriteriaTemp.projectId = this.projectId;
      activeSearchCriteriaTemp.isComplete = true;
      activeSearchCriteriaTemp.pageNumber = 1;
      activeSearchCriteriaTemp.pageSize = 5000;
      this.sprintSearchCriteriaModel = activeSearchCriteriaTemp;
      this.isMat_Tab_Loaded = false;
    } else if (this.selectedTab === "replan-sprints") {
      this.selectedTabIndex = 0;
      var replanSearchCriteriaTemp = new SprintModel();
      replanSearchCriteriaTemp.projectId = this.projectId;
      replanSearchCriteriaTemp.isReplan = true;
      replanSearchCriteriaTemp.pageNumber = 1;
      replanSearchCriteriaTemp.pageSize = 5000;
      this.sprintSearchCriteriaModel = replanSearchCriteriaTemp;
      this.isMat_Tab_Loaded = false;
    } else if (this.selectedTab === ConstantVariables.DocumentManagementRouteConstant) {
      const fileElement = new FileElement();
      if (this.projectId) {
        fileElement.folderReferenceId = this.projectId;
      } else {
        fileElement.folderReferenceId = null;
      }
      fileElement.folderReferenceTypeId = ConstantVariables.ProjectReferenceTypeId.toLowerCase();
      fileElement.isEnabled = true;
      this.fileElement = fileElement;
      this.isComponentRefresh = !this.isComponentRefresh;
    }
  }

  getProjectRelatedCounts(projectId) {
    this.testRailStore.dispatch(new LoadProjectRelatedCountsTriggered(projectId));
    this.testSuitesCount$ = this.testRailStore.pipe(select(testRailModucers.getTestSuitesCount));
    this.testRunsCount$ = this.testRailStore.pipe(select(testRailModucers.getTestRunsCount));
    this.testMilestonesCount$ = this.testRailStore.pipe(select(testRailModucers.getMilestonesCount));
    this.reportsCount$ = this.testRailStore.pipe(select(testRailModucers.getReportsCount));
  }

  getAuditRelatedCounts(projectId) {
    this.store.dispatch(new LoadAuditRelatedCountsTriggered(projectId));
    this.activeAuditsCount$ = this.auditStore.pipe(select(auditModuleReducer.getActiveAuditsCount));
    this.activeAuditConductsCount$ = this.auditStore.pipe(select(auditModuleReducer.getActiveAuditConductsCount));
    this.activeAuditReportsCount$ = this.auditStore.pipe(select(auditModuleReducer.getActiveAuditReportsCount));
    this.actionsCount$ = this.auditStore.pipe(select(auditModuleReducer.getActionsCount));
  }

  CancelUserStory() {
    this.userStoryName = "";
    const popover = this.addUserStoryPopOver;
    if (popover) { popover.close(); }
  }

  keyUp() {
    this.errorMessage = false;
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  hideAddComponentButton(isArchived) {
    this.isComponentArchived = isArchived;
  }

  onChangeGoalsTabFilter(value) {
    if(!this.fromAuditMenu) {
      if (value === "active-goals") {
        this.router.navigate(["projects/projectstatus", this.projectId, "active-goals"]);
      } else if (value === "backlog-goals") {
        this.router.navigate(["projects/projectstatus", this.projectId, "backlog-goals"]);
      } else if (value === "replan-goals") {
        this.router.navigate(["projects/projectstatus", this.projectId, "replan-goals"]);
      } else if (value == "archived-goals") {
        this.router.navigate(["projects/projectstatus", this.projectId, "archived-goals"]);
      } else if (value == "parked-goals") {
        this.router.navigate(["projects/projectstatus", this.projectId, "parked-goals"]);
      } else {
        this.selectedTabIndex = 0;
        this.cdRef.markForCheck();
      }
    } else {
      if (value === "active-goals") {
        this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "active-goals");
      } else if (value === "backlog-goals") {
        this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "backlog-goals");
      } else if (value === "replan-goals") {
        this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "replan-goals");
      } else if (value == "archived-goals") {
        this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "archived-goals");
      } else if (value == "parked-goals") {
        this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "parked-goals");
      } else {
        this.selectedTabIndex = 0;
        this.cdRef.markForCheck();
      }
    }
    
    this.cookieService.set("selectedProjectsTab", value);
    this.visibleLabel = true;
    this.cdRef.markForCheck();
  }

  checkLabel() {
    this.visibleLabel = false;
    this.cdRef.markForCheck();
  }

  checkLabelBlur() {
    this.visibleLabel = true;
    this.cdRef.markForCheck();
  }

  openMembersTab() {
    this.selectedTab = "project-members";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "project-members"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "project-members");
    }
    
    this.threeDotsPopOver.close();
    //this.filterthreeDotsPopOver.close();
  }

  openComponentsTab() {
    this.selectedTab = "project-features";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "project-features"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "project-features");
    }
    this.threeDotsPopOver.close();
    //this.filterthreeDotsPopOver.close();
  }

  openTemplatesTab() {
    this.selectedTab = "templates";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "templates"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "templates");
    }
    this.threeDotsPopOver.close();
    //this.filterthreeDotsPopOver.close();
  }

  openArchivedTab() {
    this.selectedTab = "archived-goals";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "archived-goals"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "archived-goals");
    }
    this.threeDotsPopOver.close();
    //this.filterthreeDotsPopOver.close();
  }

  openParkedTab() {
    this.selectedTab = "parked-goals";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "parked-goals"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "parked-goals");
    }
    this.threeDotsPopOver.close();
  }

  openVersionsTab() {
    localStorage.removeItem('reportTestRunName');
    this.loadTestRepoModule();
    this.selectedTab = "versions";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "versions"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "versions");
    }
    this.threeDotsPopOver.close();
    // this.filterthreeDotsPopOver.close();
  }

  openTestReportsTab() {
    localStorage.removeItem('reportTestRunName');
    debugger;
    this.loadTestRepoModule();
    this.selectedTab = "test-reports";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "test-reports"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "test-reports");
    }
    this.threeDotsPopOver.close();
    //this.filterthreeDotsPopOver.close();
  }

  openProjectSettingsTab() {
    this.selectedTab = "project-settings";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "project-settings"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "project-settings");
    }
    this.threeDotsPopOver.close();
    // this.filterthreeDotsPopOver.close();
  }

  openAuditReportsTab() {
    localStorage.removeItem('ConductedAudit');
    this.loadAuditsModule();
    this.selectedTab = "audit-reports";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "audit-reports"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "audit-reports");
    }
    this.threeDotsPopOver.close();
  }

  openAuditActivityTab() {
    localStorage.removeItem('ConductedAudit');
    this.loadAuditsModule();
    this.selectedTab = "audit-activity";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "audit-activity"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "audit-activity");
    }
    this.threeDotsPopOver.close();
  }

  openAuditAnalyticsTab() {
    localStorage.removeItem('ConductedAudit');
    //this.getCustomizedAuditDashboardId();
    this.selectedTab = "audit-analytics";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "audit-analytics"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "audit-analytics");
    }
    this.threeDotsPopOver.close();
  }

  openAppsSettings(isfromdashboards) {
    var appTagSearchText = this.selectedTab == 'reports' ? 'Projects' : this.selectedTab == 'activity' ? 'Activity' : this.selectedTab == 'audit-analytics' ? 'Audit analytics' : null;
    const dialogRef = this.dialog.open(AppStoreDialogComponent, {
      minWidth: "80vw",
      minHeight: "50vh",
      data: { workspaces: [], isfromdashboards, appTagSearchText: appTagSearchText }
    });
    dialogRef.componentInstance.closeMatDialog.subscribe((app: any) => {
      this.selectedApps = app;
      this.selectedAppForListView = app;
      this.dashboard.inputs.reloadDashboard = null;
      this.dashboard.inputs.selectedApps = this.selectedApps;
      if (this.selectedTab == 'audit-analytics') {
        this.upsertQuestionHistory({ eventCode: 'InstalledApp', appName: app.name });
      }
      this.cdRef.detectChanges();
    });
    dialogRef.componentInstance.closePopUp.subscribe((app) => {
      this.dialog.closeAll();
    })
  }

  SaveAsDefaultPersistance() {
    let workSpaceId;
    if (this.selectedTab == "reports") {
      workSpaceId = this.selectedWorkspaceId;
    } else {
      workSpaceId = this.selectedActivityWorkspaceId;
    }
    this.widgetService.SetAsDefaultDashboardPersistance(workSpaceId).subscribe((response: any) => {
      if (response.success === true) {
        this.snackbar.open(this.translateService.instant("APP.DASHBOARDPUBLISHEDSUCCESSFULLY"), "Ok", { duration: 3000 });
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
      // this.filterthreeDotsPopOver.close();
    });
  }

  ResetToDefaultDashboardPersistance() {
    let workSpaceId;
    if (this.selectedTab == "reports") {
      workSpaceId = this.selectedWorkspaceId;
    } else {
      workSpaceId = this.selectedActivityWorkspaceId;
    }
    this.widgetService.ResetToDefaultDashboardPersistance(workSpaceId).subscribe((response: any) => {
      if (response.success === true) {
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
        this.reloadDashboard = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
        this.dashboard.inputs.reloadDashboard = this.reloadDashboard;
        this.dashboard.inputs.selectedApps = null;
        this.cdRef.detectChanges();


      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
      //this.filterthreeDotsPopOver.close();
    });
  }

  refreshDashboard() {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    this.reloadDashboard = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));;
    this.dashboard.inputs.reloadDashboard = this.reloadDashboard;
    this.dashboard.inputs.selectedApps = null;

    // this.filterthreeDotsPopOver.close();
  }

  openActiveSprintsTab() {
    this.selectedTab = "active-sprints";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "active-sprints"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "active-sprints");
    }
    this.threeDotsPopOver.close();
  }

  openCompleteSprintsTab() {
    this.selectedTab = "completed-sprints";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "completed-sprints"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "completed-sprints");
    }
    this.threeDotsPopOver.close();
  }

  openReplanSprintsTab() {
    this.selectedTab = "replan-sprints";
    if(!this.fromAuditMenu) {
      this.router.navigate(["projects/projectstatus", this.projectId, "replan-sprints"]);
    } else {
      this.router.navigateByUrl("projects/projectstatus/" + this.projectId + "/audit/" + "replan-sprints");
    }
    this.threeDotsPopOver.close();
  }

  openAppsView() {
    this.listView = !this.listView;
    this.selectedApps = null;
    this.selectedAppForListView = null;
    this.reloadDashboard = null;
    if (this.listView) {
      this.loadWidgetModule("Custom apps view");
    } else {
      this.loadWidgetModule("Custom Widget");
    }
  }

  loadWidgetModule(component) {
    var loader = this.projectModulesService["modules"];
    var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
    if (!moduleJson || moduleJson == 'null') {
      console.error(`No modules found`);
      return;
    }
    var modules = JSON.parse(moduleJson);

    var modules = JSON.parse(localStorage.getItem("Modules"));

    var module = _.find(modules, function (module: any) {
      var widget = _.find(module.apps, function (app: any) { return app.displayName.toLowerCase() == component.toLowerCase() });
      if (widget) {
        return true;
      }
      return false;
    })
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

        // var componentDetails = allComponentsInModule.find(elementInArray =>
        //   elementInArray.name === "custom component"
        // );
        let workSpaceId;

        if (this.selectedTab == "reports") {
          workSpaceId = this.selectedWorkspaceId;
        }
        else if (this.selectedTab == "audit-analytics") {
          this.selectedApps = this.selectedAppForListView = null;
          workSpaceId = this.projectId;
        }
        else {
          this.listView = false;
          workSpaceId = this.selectedActivityWorkspaceId;
        }
        let factory;
        if (!this.listView) {
          factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(allComponentsInModule[0].componentTypeObject);
        } else {
          factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(allComponentsInModule[1].componentTypeObject);
        }

        this.dashboard = {};
        this.dashboard.component = factory;
        this.dashboard.inputs = {
          isWidget: true,
          selectedWorkspaceId: workSpaceId,
          selectedApps: this.selectedApps,
          dashboardFilters: this.dashboardFilter,
          reloadDashboard: this.reloadDashboard,
          selectedAppForListView: this.selectedAppForListView
        }
        this.loaded = true;
        this.cdRef.detectChanges();
      })
  }

  outputs = {
    appsSelected: app => {
      this.isAnyAppSelected = true;
    },
    description: data => {
      this.upsertQuestionHistory(data);
    }
  }

  loadTestRepoModule() {
    if (this.isTestrailEnable) {
      var loader = this.projectModulesService["modules"];
      // var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
      // if (!moduleJson || moduleJson == 'null') {
      //   console.error(`No modules found`);
      //   return;
      // }
      // var modules = JSON.parse(moduleJson);

       //var modules = this.projectModulesService["modules"];

      // var module = _.find(modules, function (module: any) { return module.modulePackageName == 'TestRepoPackageModule' });
      
    // var loader = this.projectModulesService["modules"];
    // var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
    // var module = _.find(modules, function (module: any) { return module.modulePackageName == 'TestRepoPackageModule' });


      //var modules = this.projectModulesService["modules"];
      var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
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

          componentDetails = allComponentsInModule.find(elementInArray =>
            elementInArray.name.toLocaleLowerCase() === "Test Runs View".toLocaleLowerCase()
          );
          this.testRunView = {};
          this.testRunView.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
          this.testRunView.inputs = {};

          componentDetails = allComponentsInModule.find(elementInArray =>
            elementInArray.name.toLocaleLowerCase() === "Test Milestone".toLocaleLowerCase()
          );
          this.testMileStone = {};
          this.testMileStone.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
          this.testMileStone.inputs = {};

          componentDetails = allComponentsInModule.find(elementInArray =>
            elementInArray.name.toLocaleLowerCase() === "Test Reports View".toLocaleLowerCase()
          );
          this.testReportsView = {};
          this.testReportsView.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
          this.testReportsView.inputs = {};
          this.getProjectRelatedCounts(this.projectId);
          this.isTestrailLoaded = true;
          this.cdRef.detectChanges();
        });
    }
  }

  loadDocumentManagementModule() {
    var loader = this.projectModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modules, function (module: any) { return module.modulePackageName == 'DocumentManagementPackageModule' });

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
          fileElement: this.fileElement,
          isComponentRefresh: this.isComponentRefresh
        };

        this.documentStoreComponent.outputs = {}
        this.documentsModuleLoaded = true;
        this.cdRef.detectChanges();
      });
  }

  loadAuditsModule() {
    if (this.isAuditsEnable) {
      var loader = this.projectModulesService["modules"];
      // var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
      // if (!moduleJson || moduleJson == 'null') {
      //   console.error(`No modules found`);
      //   return;
      // }
      // var modules = JSON.parse(moduleJson);

      // // var modules = this.projectModulesService["modules"];

      // var module = _.find(modules, function (module: any) { return module.modulePackageName == 'AuditsPackageModule' });
      var modules = JSON.parse(localStorage.getItem("Modules"));
      var module = _.find(modules, function (module: any) { return module.modulePackageName == 'AuditsPackageModule' });
      if (!module) {
        console.error("No module found for AuditsPackageModule");
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
            elementInArray.name.toLocaleLowerCase() === "Audits".toLocaleLowerCase()
          );

          this.auditView = {};
          this.auditView.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
          this.auditView.inputs = {};
          this.auditView.outputs = {};

          componentDetails = allComponentsInModule.find(elementInArray =>
            elementInArray.name.toLocaleLowerCase() === "Conducts".toLocaleLowerCase()
          );

          this.conductView = {};
          this.conductView.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
          this.conductView.inputs = {};
          this.conductView.outputs = {};

          componentDetails = allComponentsInModule.find(elementInArray =>
            elementInArray.name.toLocaleLowerCase() === "Audit conduct timeline view".toLocaleLowerCase()
          );

          this.timelineView = {};
          this.timelineView.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
          this.timelineView.inputs = {};
          this.timelineView.outputs = {};

          componentDetails = allComponentsInModule.find(elementInArray =>
            elementInArray.name.toLocaleLowerCase() === "Actions".toLocaleLowerCase()
          );

          this.actionView = {};
          this.actionView.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
          this.actionView.inputs = {
            loadProjectModule: this.loadActionModule
          };
          this.actionView.outputs = {};

          componentDetails = allComponentsInModule.find(elementInArray =>
            elementInArray.name.toLocaleLowerCase() === "Audit reports".toLocaleLowerCase()
          );

          this.auditReportView = {};
          this.auditReportView.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
          this.auditReportView.inputs = {};
          this.auditReportView.outputs = {};

          componentDetails = allComponentsInModule.find(elementInArray =>
            elementInArray.name.toLocaleLowerCase() === "Audit activity".toLocaleLowerCase()
          );

          this.auditActivityView = {};
          this.auditActivityView.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
          this.auditActivityView.inputs = {};
          this.auditActivityView.outputs = {};

          componentDetails = allComponentsInModule.find(elementInArray =>
            elementInArray.name.toLocaleLowerCase() === "Add action".toLocaleLowerCase()
          );

          this.addActionView = {};
          this.addActionView.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
          this.addActionView.inputs = {
            loadBugs: false
          };
          this.addActionView.outputs = {
            closeAction: event => {
              this.closeActionPopover();
            }
          };

          this.getAuditRelatedCounts(this.projectId);

          this.isAuditsLoaded = true;
          this.cdRef.detectChanges();
        });
    }
  }

  openAddActionPopover(addActionPopover) {
    this.loadAction = true;
    this.loadActionModule = null;
    addActionPopover.openPopover();
  }

  closeActionPopover() {
    this.addActionPopover.forEach((p) => p.closePopover());
    this.loadAction = false;
    this.loadActionModule = 'true';
    this.loadAuditsModule();
  }

  getCustomizedAuditDashboardId() {
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "Audits";
        this.selectedWorkspaceId = this.projectId;
        this.selectedApps = null;
        this.selectedAppForListView = null;
        this.reloadDashboard = null;
        this.listView = true;
        this.loadWidgetModule("Custom apps view");
    // this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
    //   if (result.success) {
    //     this.selectedWorkspaceId = result.data;
    //     this.selectedApps = null;
    //     this.selectedAppForListView = null;
    //     this.reloadDashboard = null;
    //     this.listView = true;
    //     this.loadWidgetModule("Custom apps view");
    //   }
    // });
  }

  upsertQuestionHistory(data) {
    if (this.selectedTab == 'audit-analytics') {
      let questionHistoryModel = { description: null, oldValue: null };
      questionHistoryModel.description = data.eventCode;
      questionHistoryModel.oldValue = data.appName;
      this.widgetService.upsertAuditQuestionHistory(questionHistoryModel)
        .subscribe(data => { console.log(data) });
    }
  }
}