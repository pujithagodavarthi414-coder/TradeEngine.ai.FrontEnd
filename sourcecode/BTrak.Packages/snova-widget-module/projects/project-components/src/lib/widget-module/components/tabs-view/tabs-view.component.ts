import { Component, EventEmitter, Input, Output, ViewChild, ViewChildren, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy, Inject, ElementRef, TemplateRef } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";
import { SoftLabelConfigurationModel } from "../../dependencies/models/softLabels-model";
import { TeamMembersListModel } from "../../dependencies/models/line-mangaers-model";
import { StatusreportService } from "../../dependencies/services/statusreport.service";
import { GenericFormSubmitted } from "../../dependencies/models/generic-form-submitted.model";
import { GenericFormService } from "../../dependencies/services/generic-form.service";
import { DashboardConfiguration } from "../../dependencies/models/dashboard.configuration";
import { CustomTagsModel } from "../../dependencies/models/customTagsModel";
import { UserStoryTypesModel } from "../../dependencies/models/userStoryTypesModel";
import { LoadBugPriorityTypesTriggered } from "../../dependencies/store/actions/bug-priority.actions";
import { LoadUserStoryTypesTriggered } from "../../dependencies/store/actions/user-story-types.action";
import { LoadUserStoryStatusTriggered } from "../../dependencies/store/actions/userStoryStatus.action";
import { ProjectList } from "../../dependencies/models/projectlist";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject, Subscription } from "rxjs";
import { filter, map, startWith, takeUntil, tap } from "rxjs/operators";
import { GoogleAnalyticsService } from "../../dependencies/services/google-analytics.service";
//import { ConfigurationTypeService } from "snova-project-management";
import { DashboardFilterModel } from "../../dependencies/models/dashboardFilterModel";
import { DragedWidget } from "../../dependencies/models/dragedWidget";
import { DuplicateDashboardModel } from "../../dependencies/models/duplicateDashboardModel";
import { DynamicDashboardFilterModel } from "../../dependencies/models/dynamicDashboardFilerModel";
import { WorkspaceList } from "../../dependencies/models/workspaceList";
import { WidgetService } from "../../dependencies/services/widget.service";
import { LoadWorkspaceDeleteTriggered, LoadWorkspacesListTriggered, LoadWorkspacesTriggered, WorkspacesActionTypes, LoadWorkspacesListCompleted, LoadChildWorkspacesTriggered } from "../../dependencies/store/actions/workspacelist.action";
import { State } from "../../dependencies/store/reducers/index";
import * as workspaceModuleReducer from "../../dependencies/store/reducers/index";
import { AppDialogComponent } from "../app-dialog/app-dialog.component";
import * as moment_ from 'moment';
const moment = moment_
import { DatePipe } from "@angular/common";
import { EntityDropDownModel } from "../../dependencies/models/entity-dropdown.module";
import { ProductivityDashboardService } from "../../dependencies/services/productivity-dashboard.service";
import { HRManagementService } from "../../dependencies/services/hrmanagement.service";
import { HrBranchModel } from "../../dependencies/models/HrBranchModel";
import { DesignationModel } from "../../dependencies/models/designation-model";
import { RoleModel } from "../../dependencies/models/role-model";
import { DepartmentModel } from "../../dependencies/models/department-model";
import { Title } from "@angular/platform-browser";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap'
import { AuditCompliance } from '../../dependencies/models/audit-compliance.model';
import { WINDOW } from '../../../globaldependencies/helpers/window.helper';
import { BusinessUnitDropDownModel } from '../../dependencies/models/businessunitmodel';
import { RelatedWorkspaceList } from "../../dependencies/models/relatedWorkspaceList";
import * as _ from "underscore";
import { MatChipInputEvent, MatChipList } from "@angular/material/chips";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { SearchFilterPipe } from "@thetradeengineorg1/snova-app-builder-creation-components";


/** @dynamic */

@Component({
  selector: "app-tabs-view",
  templateUrl: "./tabs-view.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      ::ng-deep .mat-optgroup .mat-option {
           display: none;           
        }
      ::ng-deep .mat-optgroup:hover .mat-option {
          display: flex !important;
      }      
    `
  ]
})

export class TabsViewComponent extends CustomAppBaseComponent implements OnDestroy {
  @ViewChildren("deleteWorkspacePopover") deleteWorkspacePopovers;
  @ViewChildren("publishWorkspacePopover") publishWorkspacePopovers;
  @ViewChildren("hideWorkspacePopover") hideWorkspacePopovers;
  @ViewChildren("duplicateDashboardPopover") duplicateDashboardPopovers;
  @ViewChildren("workspacePopup") addWorkspacePopover;
  @ViewChildren("hiddenworkspacePopup") hiddenworkspacePopover;
  @ViewChildren("shareWidgetsPopover") shareWidgetsPopUp;
  @Output() closeWorkspace = new EventEmitter<string>();
  @Output() openWidget = new EventEmitter<boolean>();
  @Output() updatedId = new EventEmitter<string>();
  @Output() deleteId = new EventEmitter<string>();
  @ViewChild("formDirective") formgroupDirective: FormGroupDirective;
  @ViewChild("workspaceFormDirective") workspaceFormDirective: FormGroupDirective;
  @ViewChildren("workspacePopup") upsertWorkspacePopover;
  @ViewChild("emailConfigurationTemplate") emailTemplate: TemplateRef<any>;
  @ViewChild('chipList') rolesChipList: MatChipList;
  @ViewChild('userChipList') toChipList: MatChipList;
  @ViewChild('rolesInput') rolesInput: ElementRef<HTMLInputElement>;
  @ViewChild('userToInput') toUserInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('toAuto') toMatAutocomplete: MatAutocomplete;
  @ViewChild('autocompleteTrigger') matACTrigger: MatAutocompleteTrigger;
  @ViewChild('userAutocompleteTrigger') matUserACTrigger: MatAutocompleteTrigger;
  filesList: any[] = [];
  dashboardFilter: DashboardFilterModel;
  selected = new FormControl(0);
  rolesDropDown: any[];
  selectedRoles: any[];
  widgetsList: any[];
  originalList: any[];
  selectedList: any[] = [];
  selectedWorkspaceforFilter: DynamicDashboardFilterModel;
  timeStamp: any;
  appTagSearchText: "";
  workspaceForm: FormGroup;
  workspaceSelect: FormGroup;
  selectedLabelId: string;
  duplicateForm: FormGroup;
  isLoading: boolean;
  workspacesList$: Observable<WorkspaceList[]>;
  anyOperationInProgress$: Observable<boolean>;
  upsertWorkspaceloading$: Observable<boolean>;
  observableStoreObject$: Observable<any>;

  anyOperationInProgress: boolean;
  public ngDestroyed$ = new Subject();
  workspace: WorkspaceList;
  staticevent: any;
  showText: boolean = false;
  workspaceData: WorkspaceList;
  selectedApps: DragedWidget;
  selectedAppForListView: DragedWidget;
  workItemText: string = " You are not started any work item. Please start your work!!"
  selectedProjectId: string = null;
  selectedAuditId: string = null;
  selectedUserId: string = null;
  isAppsInDraft: boolean = false;
  disableWorkspacePublish = false
  selectedEntityId: string = null;
  selectedBranchId: string = null;
  selectedDesignationId: string = null;
  selectedRoleId: string = null;
  selectedDepartmentId: string = null;
  selectedFinancial: string = null;
  selectedActiveEmployee: string = null;
  monthDate: string = null;
  date: string = null;
  workspaceId: string;
  routeWorkspaceId: string;
  validationMessage: string;
  selectedWorkspaceId: string = null;
  workspaceIdFromUrl: string = null;
  editWorkspace = false;
  reloadDashboard: string = null;
  workspaceDelete = false;
  disableWorkspaceDelete = false;
  disableWorkspacehide = false;
  disableDuplicateDashboard = false;
  loadingCompleted = false;
  dashboardUpdateInProgress = false;
  workspaces: WorkspaceList[];
  workspacelist: WorkspaceList;
  relatedWorkspaces: RelatedWorkspaceList[];
  selectedRoleIds: string[] = [];
  selectedWorkspace: any;
  softLabels: SoftLabelConfigurationModel[];
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  selectedFormId: string;
  selectedFormName: string = null;
  isChildSelected: boolean = false;
  formDirective: FormGroupDirective;
  filterApplied: string;
  projectsList: ProjectList[];
  auditList: any;
  usersList: TeamMembersListModel[];
  dateFrom: string;
  dateTo: string;
  singleDate: string;
  entities: EntityDropDownModel[];
  branches: HrBranchModel[];
  designationList$: Observable<DesignationModel[]>;
  designationList: DesignationModel[];
  rolesList: RoleModel[];
  dashboardGlobalData: any = {};
  workspaceFilters: any;
  message: string;
  filtersLoaded: boolean = false;
  roleIds: any[] = [];
  private sub: Subscription;
  listView: boolean;
  departmentList: DepartmentModel[];
  selectedYearDate: string;
  fromSelect: boolean;
  allBusinessUnits: BusinessUnitDropDownModel[] = [];
  businessUnitsList: BusinessUnitDropDownModel[] = [];
  selectedBusinessUnitId: any;
  isImageConvert: boolean;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  matData: any;
  docForm: FormGroup;
  userDropdown: any[] = [];
  selectedEmailRoleIds: any[] = [];
  selectedEmailRoles: any[] = [];
  selectedToUsers: any[] = [];
  selectedUserIds: any[] = [];
  filteredRoles$: Observable<any[]>;
  filteredToUsers$: Observable<any[]>;
  removable: boolean = true;
  selectable: boolean;
  isValidate: boolean;
  config = {
    plugins: 'link, table, preview, advlist, image, searchreplace, code, autolink, lists, autoresize, media',
    default_link_target: '_blank',
    toolbar: 'formatselect | bold italic strikethrough | link image table lists | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code preview',
    height: 450,
    branding: false,
    table_responsive_width: true,
    image_advtab: true,
    autoresize_bottom_margin: 20,
    relative_urls: 0,
    remove_script_host: 0
  }

  constructor(
    private store: Store<State>, private widgetService: WidgetService,
    private toastr: ToastrService,
    private actionUpdates$: Actions, private routes: Router,
    private translateService: TranslateService, private cookieService: CookieService,
    private route: ActivatedRoute, public dialog: MatDialog,
    private snackbar: MatSnackBar, private statusreportService: StatusreportService,
    public googleAnalyticsService: GoogleAnalyticsService,
    private cdRef: ChangeDetectorRef, private datePipe: DatePipe,
    private productivityDashboardService: ProductivityDashboardService,
    private branchService: HRManagementService, private titleService: Title,
    private genericFormService: GenericFormService,
    private searchFilterPipe: SearchFilterPipe,
    @Inject(WINDOW) private window: Window) {
    super();
    this.initializeworkspaceForm();
    this.workspaceSelect = new FormGroup({
      selected: new FormControl(null, [])
    });

    if (!(this.cookieService.check(LocalStorageProperties.SearchClick) &&
      JSON.parse(this.cookieService.get(LocalStorageProperties.SearchClick)) == true) && this.fromSelect == false) {
      this.loadAllWorkspaces();
    } else {
      this.loadWorkspacesList();
    }
    this.anyOperationInProgress$ = this.store.pipe(select(workspaceModuleReducer.getWorkspacesListLoading));
    this.upsertWorkspaceloading$ = this.store.pipe(select(workspaceModuleReducer.getWorkspacesLoading))
    this.anyOperationInProgress$.subscribe(data => this.anyOperationInProgress = data);
    this.route.params.subscribe((params) => {
      if (params["id"] != null && params["id"] !== undefined) {
        this.selectedWorkspaceId = params["id"];
        this.listView = false;
        this.widgetService.selectedWorkspace.next(this.selectedWorkspaceId);
        this.GetFilters()
        this.selectedWorkspaceforFilter = new DynamicDashboardFilterModel();
        this.selectedWorkspaceforFilter.dashboardId = this.selectedWorkspaceId;
        this.selectedWorkspaceforFilter.dashboardAppId = null;
      }
      if (params["formid"] != null && params["formid"] !== undefined) {
        this.selectedFormId = params["formid"];
      }
      this.routeWorkspaceId = this.selectedWorkspaceId;
      if ((this.cookieService.check(LocalStorageProperties.ReloadDashboards) &&
        JSON.parse(this.cookieService.get(LocalStorageProperties.ReloadDashboards)) == true)
        || (!(this.cookieService.check(LocalStorageProperties.SearchClick)
          && JSON.parse(this.cookieService.get(LocalStorageProperties.SearchClick)) == true) && this.fromSelect == false)) {
        this.loadAllWorkspaces();
      }
      this.getWorkspacesList(null);
    });


    if (this.routes.url == "/dashboard-management") {
      const defaultDashboardIdForLoggedInUser = this.cookieService.check("DefaultDashboard") ? JSON.parse(this.cookieService.get("DefaultDashboard")) : null;
      if (defaultDashboardIdForLoggedInUser) {
        this.selectedWorkspaceId = defaultDashboardIdForLoggedInUser;
        this.listView = false;
        this.isAppsInDraft = false;
        this.selectedWorkspaceforFilter = new DynamicDashboardFilterModel();
        this.selectedWorkspaceforFilter.dashboardId = this.selectedWorkspaceId;
        this.selectedWorkspaceforFilter.dashboardAppId = null;
        const userReference = localStorage.getItem(LocalStorageProperties.UserReferenceId);
        if (userReference != "null" && userReference != null) {
          this.routes.navigateByUrl("dashboard-management/dashboard/" + defaultDashboardIdForLoggedInUser + "/form/" + userReference);
        } else {
          this.routes.navigateByUrl("dashboard-management/dashboard/" + defaultDashboardIdForLoggedInUser);
        }
      }
    }

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(WorkspacesActionTypes.LoadWorkspaceByIdCompleted),
        tap(() => {
          this.dashboardUpdateInProgress = false;
          this.closeAddWorkspaceDialog(this.workspaceFormDirective);
          this.cdRef.detectChanges();
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(WorkspacesActionTypes.LoadChildWorkspacesCompleted),
        tap(() => {
          this.dashboardUpdateInProgress = false;
          this.closeAddWorkspaceDialog(this.workspaceFormDirective);
          this.cdRef.detectChanges();
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(WorkspacesActionTypes.LoadWorkspacesCompletedIfNoId),
        tap(() => {
          this.dashboardUpdateInProgress = false;
          this.closeAddWorkspaceDialog(this.workspaceFormDirective);
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(WorkspacesActionTypes.LoadWorkspaceDeleteCompleted),
        tap(() => {
          this.dashboardUpdateInProgress = false;
          this.closeDeleteWorkspacePopover();
          this.closePublishWorkspacePopover();
          this.disableWorkspaceDelete = false;
          this.disableWorkspacehide = false;
          this.closeHideWorkspacePopover(true);
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(WorkspacesActionTypes.WorkspaceFailed),
        tap(() => {
          this.dashboardUpdateInProgress = false;
          this.disableWorkspacehide = false;
          this.disableWorkspaceDelete = false;
        })
      ).subscribe();
    this.getAllUsers();
    this.clearDocForm();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.getSubmittedFormData();
    this.clearForm();
    this.loadAllWorkspaces();
  }

  loadRequiredDataForFilters() {
    this.store.dispatch(new LoadUserStoryStatusTriggered());
    const userStoryTypesModel = new UserStoryTypesModel();
    userStoryTypesModel.isArchived = false;
    this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel));
    this.store.dispatch(new LoadBugPriorityTypesTriggered());
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
  }

  loadWorkspacesList() {
    var dashboards = localStorage.getItem(LocalStorageProperties.Dashboards);
    if (dashboards && dashboards != "null") {
      this.store.dispatch(new LoadWorkspacesListCompleted(JSON.parse(dashboards)));
    } else {
      this.workspacelist = new WorkspaceList();
      this.workspacelist.workspaceId = "null";
      this.workspacelist.isHidden = false;
      this.store.dispatch(new LoadWorkspacesListTriggered(this.workspacelist));
    }
  };

  createRelatedWorkspaces() {
    this.relatedWorkspaces = [];
    this.workspaces.map((item) => {
      var children = this.workspaces.filter(w => w.parentId === item.workspaceId);
      //relatedWorkspaceList.Id = item.Id;
      //relatedWorkspaceList.workspacename = item.workspaceName;
      if (children && children.length > 0) {
        const obj = new RelatedWorkspaceList();
        obj.workspaceId = item.workspaceId;
        obj.workspaceName = item.workspaceName;
        obj.children = children;
        this.relatedWorkspaces.push(obj);
      }
    });
  }

  getWorkspacesList(duplicatedashboardName) {
    this.workspaceIdFromUrl = this.selectedWorkspaceId;
    this.workspacesList$ = this.store.pipe(select(workspaceModuleReducer.getWorkspaceAll));

    this.workspacesList$
      .do(() => { })
      .switchMap((s: any) => {
        this.workspaces = s;
        this.createRelatedWorkspaces();
        if (this.workspaces) {
          localStorage.setItem(LocalStorageProperties.Dashboards, JSON.stringify(this.workspaces));
        }
        const selectedIndex = this.workspaces.findIndex((p) => p.workspaceId === this.selectedWorkspaceId);
        this.selectedWorkspace = this.workspaces[selectedIndex];
        this.listView = (this.selectedWorkspace != undefined && this.selectedWorkspace != null) ? this.selectedWorkspace.isListView : false;
        this.isAppsInDraft = (this.selectedWorkspace != undefined && this.selectedWorkspace != null) ? this.selectedWorkspace.isAppsInDraft : false;
        if (duplicatedashboardName) {
          const index = this.workspaces.findIndex((p) => p.workspaceName === duplicatedashboardName);
          if (index > -1) {
            this.selectedMatTab(null, this.workspaces[index].workspaceId, false);
          }
        }
        return this.workspaces;
      })
      .subscribe();
  }

  closeAddWorkspaceDialog(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.addWorkspacePopover.forEach((p) => p.closePopover());
    this.clearForm();
    this.workspaceSelect = new FormGroup({
      selected: new FormControl(null, [])
    });
    this.workspaceSelect.get("selected").patchValue(this.routeWorkspaceId);
  }

  GetAllRoles() {
    this.genericFormService
      .getAllRoles()
      .subscribe((responseData: any) => {
        this.rolesDropDown = responseData.data;
        this.roleIds = this.rolesDropDown.map(x => x.roleId);
      });
  }

  GetProjects() {
    this.widgetService
      .GetProjects()
      .subscribe((responseData: any) => {
        this.projectsList = responseData.data;
        this.dashboardGlobalData.projectsList = this.projectsList;
        this.GetUsers();
      });
  }

  GetAudits() {
    const audit = new AuditCompliance();
    this.widgetService
      .searchAudits(audit)
      .subscribe((res: any) => {
        this.auditList = res.data;
        this.dashboardGlobalData.auditList = this.auditList;
      });
  }


  getBusinessUnits() {
    var businessUnitDropDownModel = new BusinessUnitDropDownModel();
    businessUnitDropDownModel.isArchived = false;
    businessUnitDropDownModel.isFromHR = false;
    this.widgetService.getBusinessUnits(businessUnitDropDownModel).subscribe((response: any) => {
      if (response.success == true) {
        this.allBusinessUnits = response.data;
        this.businessUnitsList = this.allBusinessUnits;
      }
      else {
        this.validationMessage = response.apiResponseMessages[0].message;
      }
    });
  }

  GetFilters() {
    this.filtersLoaded = false;
    var workspaceFilterInputModel = {};

    const getTestrailProjectsInputModel = new ProjectList();
    getTestrailProjectsInputModel.isArchived = false;
    workspaceFilterInputModel["SearchCriteriaInputModel"] = getTestrailProjectsInputModel;

    const dashboardDynamicFilters = new DynamicDashboardFilterModel();
    dashboardDynamicFilters.dashboardId = this.selectedWorkspaceId;
    workspaceFilterInputModel["DashboardFilterModel"] = dashboardDynamicFilters;

    const customTagModel = new CustomTagsModel();
    workspaceFilterInputModel["GetCustomApplicationTagInpuModel"] = customTagModel;

    this.widgetService.GetWorkSpaceFilters(workspaceFilterInputModel).subscribe((result: any) => {
      if (result.success === true) {

        this.projectsList = result.data.projectsList;
        this.dashboardGlobalData.projectsList = result.data.projectsList;

        this.auditList = result.data.AuditList;
        this.dashboardGlobalData.auditList = result.data.auditList;

        this.businessUnitsList = result.data.businessUnitsList;
        this.dashboardGlobalData.businessUnitsList = result.data.businessUnitsList;

        this.dashboardGlobalData.customApplicationTagKeys = result.data.customApplicationTagKeys;

        this.usersList = result.data.usersList;
        this.dashboardGlobalData.usersList = result.data.usersList;

        this.entities = result.data.entityList;
        this.dashboardGlobalData.entityList = result.data.entityList;

        this.branches = result.data.branchList;
        this.dashboardGlobalData.branchList = result.data.branchList;

        this.designationList = result.data.designationList;
        this.dashboardGlobalData.designationList = result.data.designationList;

        this.rolesList = result.data.rolesList;
        this.dashboardGlobalData.rolesList = result.data.rolesList;

        this.departmentList = result.data.departmentList;
        this.dashboardGlobalData.departmentList = result.data.departmentList;

        this.dashboardGlobalData.workspaceFilters = result.data.workspaceFilters;
        this.workspaceFilters = result.data.workspaceFilters;
        this.setFilterKeys();

        this.filtersLoaded = true;
      } else {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
        this.filtersLoaded = true;
      }
      this.modifyBreadCrumb();
    });
  }

  GetCustomApplicationTagKeys() {
    const customTagModel = new CustomTagsModel();
    this.widgetService.GetCustomApplicationTagKeys(customTagModel).subscribe((result: any) => {
      if (result.success === true) {
        this.dashboardGlobalData.customApplicationTagKeys = result.data;
      } else {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
    });
  }

  GetUsers() {
    this.statusreportService.getTeamLeadsList().subscribe((response: any) => {
      this.usersList = response.data;
      this.dashboardGlobalData.usersList = this.usersList;
      this.getFilterKeys();
    });
  }

  getEntityDropDown() {
    let searchText = "";
    this.productivityDashboardService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success) {
        this.entities = responseData.data;
        this.getFilterKeys();
      }
      else {
        this.toastr.error(responseData.apiResponseMessages[0].message);
      }
    });
  }

  getBranches() {
    var hrBranchModel = new HrBranchModel();
    hrBranchModel.isArchived = false;
    this.branchService.getBranches(hrBranchModel).subscribe((response: any) => {
      if (response.success) {
        this.branches = response.data;
        this.getFilterKeys();
      }
      else {
        this.toastr.error(response.apiResponseMessages[0].message);
      }
    })
  }

  getDesignationList() {
    var designationSearchModel = new DesignationModel();
    designationSearchModel.isArchived = false;
    this.widgetService.getAllDesignations(designationSearchModel).subscribe((response: any) => {
      if (response.success) {
        this.designationList = response.data;
        this.getFilterKeys();
      }
      else {
        this.toastr.error(response.apiResponseMessages[0].message);
      }
    })
  }

  getRoles() {
    var roleModel = new RoleModel();
    roleModel.isArchived = false;
    this.widgetService.getAllRoles(roleModel).subscribe((response: any) => {
      if (response.success) {
        this.rolesList = response.data;
        this.filteredRoles$ = this.docForm.get('rolesInput').valueChanges.pipe(
          startWith(null),
          map((role: string | null) => role ? this._filter(role) : this.rolesList.slice()));
        this.getFilterKeys();
      }
      else {
        this.toastr.error(response.apiResponseMessages[0].message);
      }
    })
  }

  getFilterKeys() {
    const dashboardDynamicFilters = new DynamicDashboardFilterModel();
    dashboardDynamicFilters.dashboardId = this.selectedWorkspaceId;
    this.selectedProjectId = null;
    this.selectedUserId = null;
    this.widgetService.GetAllCustomDashboardFilters(dashboardDynamicFilters).subscribe((result: any) => {
      if (result.success === true) {

        this.workspaceFilters = result.data;
        this.dashboardGlobalData.workspaceFilters = this.workspaceFilters;
        this.setFilterKeys();
      }
    });
  }

  setFilterKeys() {
    this.selectedProjectId = null;
    this.selectedAuditId = null;
    this.selectedBusinessUnitId = null;
    this.selectedUserId = null;
    this.selectedBranchId = null;
    this.selectedDesignationId = null;
    this.selectedEntityId = null;
    this.selectedRoleId = null;
    this.selectedDepartmentId = null;
    this.selectedActiveEmployee = null;
    this.selectedFinancial = null;
    this.selectedYearDate = null;
    this.monthDate = null;
    this.dashboardGlobalData.workspaceFilters = this.workspaceFilters;
    var data = [];
    if (this.workspaceFilters && this.workspaceFilters.length > 0) {
      for (var i = 0; i < this.workspaceFilters.length; i++) {
        if (this.workspaceFilters[i].dashboardAppId == this.selectedWorkspaceId) {
          data.push(this.workspaceFilters[i]);
        }
      }
    }

    const dynamicFilters = data;
    if (dynamicFilters.length > 0) {
      const projectIndex = dynamicFilters.findIndex((p) => p.filterKey === "Project" && p.isSystemFilter === true);
      if (projectIndex > -1 && this.projectsList && this.projectsList.length > 0) {
        const index = this.projectsList.findIndex((p) => p.projectId === dynamicFilters[projectIndex].filterValue);
        if (index > -1) {
          this.selectedProjectId = dynamicFilters[projectIndex].filterValue;
        }
      }
      const auditIndex = dynamicFilters.findIndex((p) => p.filterKey === "Audit" && p.isSystemFilter === true);
      if (auditIndex > -1 && this.projectsList && this.projectsList.length > 0) {
        const index = this.projectsList.findIndex((p) => p.projectId === dynamicFilters[auditIndex].filterValue);
        if (index > -1) {
          this.selectedAuditId = dynamicFilters[auditIndex].filterValue;
        }
      }

      const businessUnitIndex = dynamicFilters.findIndex((p) => p.filterKey === "BusinessUnit" && p.isSystemFilter === true);
      if (businessUnitIndex > -1 && this.businessUnitsList && this.businessUnitsList.length > 0) {
        const list = this.businessUnitsList.findIndex((p) => p.businessUnitId === dynamicFilters[businessUnitIndex].filterValue);
        if (list > -1) {
          this.selectedBusinessUnitId = dynamicFilters[businessUnitIndex].filterValue;
        }
      }

      const userIndex = dynamicFilters.findIndex((p) => p.filterKey === "User" && p.isSystemFilter === true);
      if (userIndex > -1 && this.usersList && this.usersList.length > 0) {
        const index = this.usersList.findIndex((p) => p.teamMemberId === dynamicFilters[userIndex].filterValue);
        if (index > -1) {
          this.selectedUserId = dynamicFilters[userIndex].filterValue;
        }
      }
      const entityIndex = dynamicFilters.findIndex((p) => p.filterKey === "Entity" && p.isSystemFilter === true);
      if (entityIndex > -1 && this.entities && this.entities.length > 0) {
        const index = this.entities.findIndex((p) => p.id === dynamicFilters[entityIndex].filterValue);
        if (index > -1) {
          this.selectedEntityId = dynamicFilters[entityIndex].filterValue;
        }
      }
      const branchIndex = dynamicFilters.findIndex((p) => p.filterKey === "Branch" && p.isSystemFilter === true);
      if (branchIndex > -1 && this.branches && this.branches.length > 0) {
        const index = this.branches.findIndex((p) => p.branchId === dynamicFilters[branchIndex].filterValue);
        if (index > -1) {
          this.selectedBranchId = dynamicFilters[branchIndex].filterValue;
        }
      }
      const designationIndex = dynamicFilters.findIndex((p) => p.filterKey === "Designation" && p.isSystemFilter === true);
      if (designationIndex > -1 && this.designationList && this.designationList.length > 0) {
        const index = this.designationList.findIndex((p) => p.designationId === dynamicFilters[designationIndex].filterValue);
        if (index > -1) {
          this.selectedDesignationId = dynamicFilters[designationIndex].filterValue;
        }
      }
      const roleIndex = dynamicFilters.findIndex((p) => p.filterKey === "Role" && p.isSystemFilter === true);
      if (roleIndex > -1 && this.rolesList && this.rolesList.length > 0) {
        const index = this.rolesList.findIndex((p) => p.roleId === dynamicFilters[roleIndex].filterValue);
        if (index > -1) {
          this.selectedRoleId = dynamicFilters[roleIndex].filterValue;
        }
      }
      const departmentIndex = dynamicFilters.findIndex((p) => p.filterKey === "Department" && p.isSystemFilter === true);
      if (departmentIndex > -1 && this.rolesList && this.rolesList.length > 0) {
        const index = this.departmentList.findIndex((p) => p.departmentName === dynamicFilters[departmentIndex].filterValue);
        if (index > -1) {
          this.selectedDepartmentId = dynamicFilters[departmentIndex].filterValue;
        }
      }
      const dateIndex = dynamicFilters.findIndex((p) => p.filterKey === "Date" && p.isSystemFilter === true);
      if (dateIndex > -1) {
        this.date = dynamicFilters[dateIndex].filterValue;
      }

      const financialIndex = dynamicFilters.findIndex((p) => p.filterKey === "FinancialYear" && p.isSystemFilter === true);
      if (financialIndex > -1) {
        this.selectedFinancial = dynamicFilters[financialIndex].filterValue;
      }

      const activeEmployeeIndex = dynamicFilters.findIndex((p) => p.filterKey === "ActiveEmployees" && p.isSystemFilter === true);
      if (activeEmployeeIndex > -1) {
        this.selectedActiveEmployee = dynamicFilters[activeEmployeeIndex].filterValue;
      }
      const monthIndex = dynamicFilters.findIndex((p) => p.filterKey === "Month" && p.isSystemFilter === true);
      if (monthIndex > -1) {
        this.monthDate = dynamicFilters[monthIndex].filterValue;
      }
      const yearIndex = dynamicFilters.findIndex((p) => p.filterKey === "Year" && p.isSystemFilter === true);
      if (yearIndex > -1) {
        this.selectedYearDate = dynamicFilters[yearIndex].filterValue;
      }
    }
    this.dashboardFilter = new DashboardFilterModel();
    this.dashboardFilter.projectId = this.selectedProjectId;
    this.dashboardFilter.auditId = this.selectedAuditId;
    this.dashboardFilter.businessUnitId = this.selectedBusinessUnitId;
    this.dashboardFilter.userId = this.selectedUserId;
    this.dashboardFilter.entityId = this.selectedEntityId;
    this.dashboardFilter.branchId = this.selectedBranchId;
    this.dashboardFilter.designationId = this.selectedDesignationId;
    this.dashboardFilter.roleId = this.selectedRoleId;
    this.dashboardFilter.departmentId = this.selectedDepartmentId;
    this.dashboardFilter.isFinancialYear = this.selectedFinancial;
    this.dashboardFilter.isActiveEmployeesOnly = this.selectedActiveEmployee;
    this.dashboardFilter.monthDate = this.monthDate;
    this.dashboardFilter.yearDate = this.selectedYearDate;
    if (this.date == 'lastWeek' || this.date == 'nextWeek' || this.date == 'thisMonth' || this.date == 'lastMonth') {
      this.getDates(this.date);
    } else if (this.date) {
      let obj = JSON.parse(this.date);
      this.dateFrom = obj.dateFrom;
      this.dateTo = obj.dateTo;
      this.singleDate = obj.date;
    }
    this.dashboardFilter.dateFrom = moment(this.dateFrom).format("YYYY-MM-DD").toString();
    this.dashboardFilter.dateFrom = moment(this.dateTo).format("YYYY-MM-DD").toString();
    this.dashboardFilter.dateFrom = moment(this.singleDate).format("YYYY-MM-DD").toString();
    this.date = null;
    this.cdRef.detectChanges();
  }

  clearForm() {
    this.workspaceId = null;
    this.timeStamp = null;
    this.selectedRoleIds = null;
    this.disableWorkspacehide = false;
    this.disableDuplicateDashboard = false;
    this.workspaceForm = new FormGroup({
      workspaceName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      selectedRoles: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      description: new FormControl(null,
        Validators.compose([
          Validators.maxLength(1000)
        ])
      ),
      editRoleIds: new FormControl(null, []),
      deleteRoleIds: new FormControl(null, []),
      defaultView: new FormControl(null, [])
    });
    this.duplicateForm = new FormGroup({
      dashboardName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      )
    });
    if (this.formgroupDirective != null) {
      this.formgroupDirective.resetForm();
    }
  }

  getSubmittedFormData() {
    if (this.selectedFormId) {
      const genericFormSubmitted = new GenericFormSubmitted();
      genericFormSubmitted.genericFormSubmittedId = this.selectedFormId;
      genericFormSubmitted.isArchived = false;
      this.genericFormService.getSubmittedReportByFormReportId(genericFormSubmitted).subscribe((responses: any) => {
        this.selectedFormName = responses.data[0].formName;
      });
    }
  }

  closeUpsertWorkspacePopup() {
    this.upsertWorkspacePopover.forEach((p) => p.closePopover());
    this.clearForm();
  }

  upsertWorkspace(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.dashboardUpdateInProgress == true) {
      return;
    }
    this.dashboardUpdateInProgress = true;
    const workspaceModel = new WorkspaceList();
    workspaceModel.workspaceName = this.workspaceForm.get("workspaceName").value;
    workspaceModel.description = this.workspaceForm.get("description").value;
    workspaceModel.workspaceId = this.workspaceId;
    workspaceModel.timeStamp = this.timeStamp;
    workspaceModel.isListView = this.workspaceForm.get("defaultView").value;
    let selectedRoleIds = this.workspaceForm.get("selectedRoles").value;

    let configurationModel = new DashboardConfiguration();
    configurationModel = this.workspaceForm.value;

    let editRoles = configurationModel.editRoleIds;
    let deleteRoles = configurationModel.deleteRoleIds;

    if (editRoles) {
      if (selectedRoleIds == null || selectedRoleIds.length === 0) {
        selectedRoleIds = editRoles;
      } else {
        editRoles.forEach((item) => {
          if (selectedRoleIds && (selectedRoleIds.indexOf(item) === -1)) {
            selectedRoleIds.push(item);
          }
        });
      }
    }

    if (deleteRoles) {
      if (selectedRoleIds == null || selectedRoleIds.length === 0) {
        selectedRoleIds = deleteRoles;
      } else {
        deleteRoles.forEach((item) => {
          if (selectedRoleIds && (selectedRoleIds.indexOf(item) === -1)) {
            selectedRoleIds.push(item);
          }
        });
      }
    }

    if (this.workspaceId == null) {
      try {
        this.googleAnalyticsService.eventEmitter("Dashboard", "Created New Dashboard", workspaceModel.workspaceName, 1);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        this.googleAnalyticsService.eventEmitter("Dashboard", "Updated Dashboard", workspaceModel.workspaceName, 1);
      } catch (error) {
        console.error(error);
      }
    }

    workspaceModel.selectedRoleIds = selectedRoleIds.toString();
    workspaceModel.editRoleIds = editRoles === null ? null : editRoles.toString();
    workspaceModel.deleteRoleIds = deleteRoles === null ? null : deleteRoles.toString();

    if (!this.isChildSelected) {
      this.store.dispatch(new LoadWorkspacesTriggered(workspaceModel));
    } else {
      workspaceModel.parentId = this.selectedWorkspaceId;
      this.store.dispatch(new LoadChildWorkspacesTriggered(workspaceModel));
    }

    this.getWorkspacesList(workspaceModel.workspaceName);

  }

  openEditWorkspacePopover(workspace, widgetPopupOpen) {
    this.genericFormService.getAllRoles().subscribe((responseData: any) => {
      this.rolesDropDown = responseData.data;
      this.roleIds = this.rolesDropDown.map(x => x.roleId);
      this.appendEditData(workspace);
    });

    this.workspaceId = workspace.workspaceId;
    this.timeStamp = workspace.timeStamp;
    const configurationModel = new DashboardConfiguration();
    configurationModel.dashboardConfigurationId = null;
    configurationModel.dashboardId = workspace.workspaceId;
    this.workspaceForm.get("workspaceName").patchValue(workspace.workspaceName);
    this.workspaceForm.get("description").patchValue(workspace.description);
    this.workspaceForm.get("defaultView").patchValue(workspace.isListView);
    widgetPopupOpen.openPopover();
  }

  appendEditData(workspace) {

    const editRoles = (workspace.editRoleIds != null && workspace.editRoleIds != "") ? workspace.editRoleIds.split(',') : [];
    const deleteRoles = (workspace.deleteRoleIds != null && workspace.deleteRoleIds != "") ?
      workspace.deleteRoleIds.split(',') : [];
    this.workspaceForm.get("selectedRoles").patchValue([]);
    if (workspace.roleIds != null) {
      const roleIds = workspace.roleIds.toLowerCase().split(",");
      this.workspaceForm.get("selectedRoles").patchValue(roleIds);
    }

    this.workspaceForm.get("editRoleIds").patchValue(editRoles);
    this.workspaceForm.get("deleteRoleIds").patchValue(deleteRoles);

    // if (this.workspaceForm.get("selectedRoles").value.length === this.rolesDropDown.length) {
    //   this.workspaceForm.get("selectedRoles").patchValue([
    //     ...this.rolesDropDown.map((item) => item.roleId),
    //     0
    //   ]);
    // }
    // if (this.workspaceForm.get("editRoleIds").value.length === this.rolesDropDown.length) {
    //   this.workspaceForm.get("editRoleIds").patchValue([
    //     ...this.rolesDropDown.map((item) => item.roleId),
    //     0
    //   ]);
    // }
    // if (this.workspaceForm.get("deleteRoleIds").value.length === this.rolesDropDown.length) {
    //   this.workspaceForm.get("deleteRoleIds").patchValue([
    //     ...this.rolesDropDown.map((item) => item.roleId),
    //     0
    //   ]);
    // }
  }

  appInserted(data) {
    this.isAppsInDraft = data;
  }

  SaveAsDefaultPersistance(workspaceId) {
    this.disableWorkspacePublish = true;
    const workspaceModel = new WorkspaceList();
    workspaceModel.workspaceId = workspaceId;
    workspaceModel.isListView = this.listView;
    this.widgetService.SetAsDefaultDashboardPersistance(workspaceModel).subscribe((response: any) => {
      if (response.success === true) {
        this.isAppsInDraft = false;
        this.loadAllWorkspaces();
        this.snackbar.open(this.translateService.instant("APP.DASHBOARDPUBLISHEDSUCCESSFULLY"), "Ok", { duration: 3000 });
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
      this.disableWorkspacePublish = false;
    });
  }

  ResetToDefaultDashboardPersistance(workspaceId) {
    this.widgetService.ResetToDefaultDashboardPersistance(workspaceId).subscribe((response: any) => {
      if (response.success === true) {
        this.isAppsInDraft = false;
        if (this.selectedWorkspaceId === workspaceId) {
          const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
          this.reloadDashboard = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
          if (this.listView == true) {
            this.listView = false;
            this.selectedAppForListView = null;
            this.cdRef.detectChanges();
          }

        }
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
    });
  }

  refreshDashboard(workspaceId) {
    if (this.selectedWorkspaceId === workspaceId) {
      const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
      this.reloadDashboard = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
    }
  }

  SetDashboardAsDefault(workspaceId, isDefaultforAll) {
    const dashboardModel = new DuplicateDashboardModel();
    dashboardModel.workspaceId = workspaceId;
    dashboardModel.isDefaultforAll = isDefaultforAll;
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.widgetService.SetAsUserDefaultDashboard(dashboardModel).subscribe((response: any) => {
      this.cookieService.set("DefaultDashboard", workspaceId ? JSON.stringify(workspaceId) : null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
      if (response.success === true) {
        const index = this.workspaces.findIndex((p) => p.workspaceId === workspaceId);
        this.snackbar.open(this.workspaces[index].workspaceName + " " + this.translateService.instant("APP.DASHBOARDSETSUCCESSFULLY"),
          "Ok", { duration: 3000 });
        this.loadAllWorkspaces();
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
    });
  }

  createWorkspace(workspacePopup) {
    workspacePopup.openPopover();
  }

  showWorkspaces(hiddenworkspacePopup) {
    hiddenworkspacePopup.openPopover();
  };

  closehiddendashboard() {
    this.hiddenworkspacePopover.forEach((p) => p.closePopover());
  }

  openDeleteWorkspacePopover(deletePopover, workspace) {
    deletePopover.openPopover();
    this.workspaceData = new WorkspaceList();
    this.workspaceData.workspaceId = workspace.workspaceId;
    this.workspaceData.workspaceName = workspace.workspaceName;
    this.workspaceData.timeStamp = workspace.timeStamp;
    this.workspaceData.description = workspace.description;
    this.workspaceData.selectedRoleIds = workspace.roleIds.toString();
    this.workspaceData.editRoleIds = workspace.editRoleIds;
    this.workspaceData.deleteRoleIds = workspace.deleteRoleIds;
    this.workspaceData.description = workspace.description;
  }

  openPublishWorkspacePopover(publishPopover) {
    this.disableWorkspacePublish = false;
    publishPopover.openPopover();
  }

  closeDeleteWorkspacePopover() {
    this.deleteWorkspacePopovers.forEach((p) => p.closePopover());
  }

  closePublishWorkspacePopover() {
    this.publishWorkspacePopovers.forEach((p) => p.closePopover());
  }

  deleteSelectedWorkspace() {
    this.disableWorkspaceDelete = true;
    this.workspace = new WorkspaceList();
    this.workspace.workspaceId = this.workspaceData.workspaceId;
    this.workspace.workspaceName = this.workspaceData.workspaceName;
    this.workspace.description = this.workspaceData.description;
    this.workspace.editRoleIds = this.workspaceData.editRoleIds;
    this.workspace.selectedRoleIds = this.workspaceData.selectedRoleIds;
    this.workspace.deleteRoleIds = this.workspaceData.deleteRoleIds;
    this.workspace.timeStamp = this.workspaceData.timeStamp;
    this.store.dispatch(new LoadWorkspaceDeleteTriggered(this.workspace));
    this.deleteId.emit(this.workspaceData.workspaceId);
    this.googleAnalyticsService.eventEmitter("Dashboard", "Deleted Dashboard", this.workspace.workspaceName, 1);
  }

  openHideWorkspacePopover(hidePopover, workspace) {
    this.workspaceData = new WorkspaceList();
    this.workspaceData.workspaceId = workspace.workspaceId;
    this.workspaceData.workspaceName = workspace.workspaceName;
    this.workspaceData.description = workspace.description;
    this.workspaceData.isHidden = workspace.isHidden;
    this.workspaceData.selectedRoleIds = workspace.roleIds.toString();
    this.workspaceData.editRoleIds = workspace.editRoleIds;
    this.workspaceData.deleteRoleIds = workspace.deleteRoleIds;
    this.workspaceData.timeStamp = workspace.timeStamp;
    this.workspaceData.roleIds = workspace.roleIds;
    this.disableWorkspacehide = false;
    hidePopover.openPopover();
  }

  openDuplicateDashboardPopover(duplicateDashboardPopover) {
    duplicateDashboardPopover.openPopover();
  }

  insertDuplicateDashboard() {
    this.disableDuplicateDashboard = true;
    const duplicatedashboardName = this.duplicateForm.get("dashboardName").value;
    const dashboardModel = new DuplicateDashboardModel()
    dashboardModel.workspaceName = this.duplicateForm.get("dashboardName").value;
    dashboardModel.workspaceId = this.selectedWorkspaceId;
    this.widgetService.InsertDuplicateDashboard(dashboardModel).subscribe((response: any) => {
      if (response.success === true) {
        this.disableDuplicateDashboard = false;
        this.closeDuplicateDashbaordDialog();
        //this.loadWorkspacesList();
        this.loadAllWorkspaces();
        this.getWorkspacesList(duplicatedashboardName);
        this.clearForm();
        this.snackbar.open(this.translateService.instant(ConstantVariables.DashboardDuplicatedSuccessfully), "Ok", { duration: 3000 });
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
        this.disableDuplicateDashboard = false;
      }
    });
  }

  closeDuplicateDashbaordDialog() {
    this.duplicateDashboardPopovers.forEach((p) => p.closePopover());
    this.clearForm();
  }

  closeHideWorkspacePopover(reload: boolean) {
    this.hideWorkspacePopovers.forEach((p) => p.closePopover());
    if (reload === true) {
      this.selectedMatTab(null, this.workspaces[0].workspaceId, false);
    }
  }

  hideSelectedWorkspace() {
    this.disableWorkspacehide = true;
    const workspaceModel = new WorkspaceList();
    workspaceModel.workspaceName = this.workspaceData.workspaceName;
    workspaceModel.workspaceId = this.workspaceData.workspaceId;
    workspaceModel.description = this.workspaceData.description;
    workspaceModel.editRoleIds = this.workspaceData.editRoleIds;
    workspaceModel.deleteRoleIds = this.workspaceData.deleteRoleIds;
    workspaceModel.timeStamp = this.workspaceData.timeStamp;
    workspaceModel.selectedRoleIds = this.workspaceData.selectedRoleIds;
    workspaceModel.isHidden = !(this.workspaceData.isHidden);
    this.store.dispatch(new LoadWorkspacesTriggered(workspaceModel));
    this.deleteId.emit(this.workspaceData.workspaceId);
    this.googleAnalyticsService.eventEmitter("Dashboard", "Hide Dashboard", this.workspaceData.workspaceName, 1);
  }

  modifyBreadCrumb() {
    this.workspacesList$.subscribe((result) => {
      const selectedindex = result.findIndex((p) => p.workspaceId == this.selectedWorkspaceId);
      if (selectedindex > -1) {
        this.titleService.setTitle("Dashboard - " + this.selectedWorkspace.workspaceName);
      }
    });
  }

  changeViewType() {
    this.listView = !this.listView;
    this.selectedAppForListView = this.selectedApps = null;
    this.cdRef.detectChanges();
  }

  selectedMatTab(addWorkspace, workspaceId, isFromSelection) {
    this.filesList = [];
    this.selectedList = [];
    this.isChildSelected = false;
    if (isFromSelection) {
      this.selectedFormId = null;
    }
    if (workspaceId === "0") {
      this.workspaceSelect = new FormGroup({
        selected: new FormControl(null, [])
      });
      this.workspaceSelect.get("selected").patchValue(this.routeWorkspaceId);
      this.selectedWorkspaceId = this.routeWorkspaceId;
      this.selectedWorkspaceforFilter = new DynamicDashboardFilterModel();
      this.selectedWorkspaceforFilter.dashboardId = this.selectedWorkspaceId;
      this.selectedWorkspaceforFilter.dashboardAppId = null;

      this.openSettings(true);
    } else if (workspaceId === "1") {
      this.workspaceSelect = new FormGroup({
        selected: new FormControl(null, [])
      });
      this.workspaceSelect.get("selected").patchValue(this.routeWorkspaceId);
      this.selectedWorkspaceId = this.routeWorkspaceId;
      this.selectedWorkspaceforFilter = new DynamicDashboardFilterModel();
      this.selectedWorkspaceforFilter.dashboardId = this.selectedWorkspaceId;
      this.selectedWorkspaceforFilter.dashboardAppId = null;
      this.GetAllRoles();
      addWorkspace.openPopover();
    } else if (workspaceId === "2") {
      this.isChildSelected = true;
      this.workspaceSelect = new FormGroup({
        selected: new FormControl(null, [])
      });
      this.workspaceSelect.get("selected").patchValue(this.routeWorkspaceId);
      this.selectedWorkspaceId = this.routeWorkspaceId;
      this.selectedWorkspaceforFilter = new DynamicDashboardFilterModel();
      this.selectedWorkspaceforFilter.dashboardId = this.selectedWorkspaceId;
      this.selectedWorkspaceforFilter.dashboardAppId = null;
      this.GetAllRoles();
      addWorkspace.openPopover();
    } else if (workspaceId !== undefined) {
      if (isFromSelection) {
        this.selectedFormId = null;
      }
      const selectedIndex = this.workspaces.findIndex((p) => p.workspaceId === workspaceId);
      this.selectedWorkspace = this.workspaces[selectedIndex];
      this.listView = (this.selectedWorkspace != undefined && this.selectedWorkspace != null) ? this.selectedWorkspace.isListView : false;
      this.isAppsInDraft = (this.selectedWorkspace != undefined && this.selectedWorkspace != null) ? this.selectedWorkspace.isAppsInDraft : false;
      this.routeWorkspaceId = workspaceId;
      this.fromSelect = true;
      const userReference = localStorage.getItem(LocalStorageProperties.UserReferenceId);
      this.workspaceSelect.get("selected").patchValue(this.routeWorkspaceId);
      if (!this.selectedFormId && userReference != "null" && userReference != null) {
        this.routes.navigateByUrl("dashboard-management/dashboard/" + this.routeWorkspaceId + "/form/" + userReference);
      } else if (!this.selectedFormId) {
        this.routes.navigateByUrl("dashboard-management/dashboard/" + this.routeWorkspaceId);
      } else if (this.selectedFormId) {
        this.routes.navigateByUrl("dashboard-management/dashboard/" + this.selectedWorkspaceId + "/form/" + this.selectedFormId);
      }
    }
  }

  initializeworkspaceForm() {
    this.workspaceForm = new FormGroup({
      workspaceName: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)]))
    });
  }

  openSettings(isfromdashboards) {
    const dialogRef = this.dialog.open(AppDialogComponent, {
      minWidth: "80vw",
      minHeight: "50vh",
      data: { workspaces: this.workspaces, isfromdashboards, appTagSearchText: null }
    });
    dialogRef.componentInstance.closeMatDialog.subscribe((app: any) => { this.selectedApps = app; this.selectedAppForListView = app; this.cdRef.detectChanges(); });
    dialogRef.componentInstance.dashboardSelect.subscribe((workspaceId) => {
      if (workspaceId) {
        this.selectedMatTab(null, workspaceId, false);
      }
    });
  }

  customfilterApplied(dynamicFilters) {
    this.dashboardFilter = dynamicFilters;
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    this.filterApplied = "filterapplied" + possible.charAt(Math.floor(Math.random() * possible.length));
  }

  getDates(dateValue) {
    if (dateValue == 'lastMonth') {
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
      this.dateFrom = this.datePipe.transform(firstDay, 'dd-MM-yyyy');
      this.dateTo = this.datePipe.transform(lastDay, 'dd-MM-yyyy');
    }

    if (dateValue == 'thisMonth') {
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      this.dateFrom = firstDay.toString();
      this.dateTo = date.toString();
    }

    if (dateValue == 'lastWeek') {
      var today = new Date();
      var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      var month;
      if (endDate.getDate() - 6 > today.getDate()) {
        month = today.getMonth() - 1;
      }
      else {
        month = today.getMonth();
      }
      var startDate = new Date(today.getFullYear(), month, endDate.getDate() - 6);
      this.dateFrom = this.datePipe.transform(startDate, 'dd-MM-yyyy');
      this.dateTo = this.datePipe.transform(endDate, 'dd-MM-yyyy');
    }

    if (dateValue == 'nextWeek') {
      var today = new Date();
      var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (8 - today.getDay()));
      var month;
      if (startDate.getDate() + 6 < startDate.getDate()) {
        month = today.getMonth() + 1;
      }
      else {
        month = today.getMonth();
      }
      var endDate = new Date(today.getFullYear(), month, startDate.getDate() + 6);
      this.dateFrom = this.datePipe.transform(startDate, 'dd-MM-yyyy');
      this.dateTo = this.datePipe.transform(endDate, 'dd-MM-yyyy');
    }
  }

  loadLazyStyles() {
    this.loadLazyStyleSheets('app-bootstrap-styles');
    this.loadLazyStyleSheets('app-lightbox-styles');
    this.loadLazyStyleSheets('app-properties-styles');
    this.loadLazyStyleSheets('app-animate-styles');
    this.loadLazyStyleSheets('app-owl-carousel-styles');
    this.loadLazyStyleSheets('app-owl-default-styles');
    this.loadLazyStyleSheets('app-scheduler-material-styles');
  }

  loadLazyStyleSheets(file) {
    const lazyStyleElement = document.createElement('link');
    lazyStyleElement.rel = 'stylesheet';
    lazyStyleElement.href = file + '.css';
    document.body.appendChild(lazyStyleElement);
  }

  ngOnDestroy() {
  }

  setAsDefaultDashboardView(selectedWorkspaceId) {
    this.workspacelist = new WorkspaceList();
    this.workspacelist.workspaceId = selectedWorkspaceId;
    this.workspacelist.isListView = this.listView;
    this.widgetService.SetAsDefaultDashboarView(this.workspacelist).subscribe((response: any) => {
      if (response.success === true) {
        this.loadAllWorkspaces();
        this.snackbar.open(this.translateService.instant("Dashboard view published successfully"), "Ok", { duration: 3000 });
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
    });
  }

  async convertToJPEG() {
    this.isImageConvert = !this.isImageConvert;
    this.cdRef.detectChanges();
  }

  convertImages() {
    this.isImageConvert = !this.isImageConvert;
    this.cdRef.detectChanges();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async combineChunks(chunkDataUrls: string[], width: number, height: number): Promise<string> {
    // Create a canvas to combine the captured chunks
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    // Draw each chunk onto the canvas
    let yOffset = 0;
    for (const dataUrl of chunkDataUrls) {
      const img = await this.loadImage(dataUrl);
      context.drawImage(img, 0, yOffset);
      yOffset += img.height;
    }

    // Convert the canvas to a data URL representing the JPEG image
    return canvas.toDataURL('image/jpeg');
  }

  loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  download(dataUrl: string, filename: string) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }

  emitEvent(event) {
    if(event.isSystemWidget == true) {
      let selectedwidgets = this.originalList;
      let filteredList = _.filter(selectedwidgets, function(filter){
        return filter.name == event.widgetName
      })
      if(filteredList.length > 0) {
        event.customWidgetId = filteredList[0].customWidgetId;
      }
    }
    let filesList = this.filesList;
    let filteredList = _.filter(filesList, function (filter) {
      return filter.customWidgetId == event.customWidgetId
    })
    if (filteredList.length > 0) {
      let index = filesList.indexOf(filteredList[0]);
      filesList[index] = event;
    } else {
      filesList.push(event);
    }
    this.filesList = filesList;
    console.log(this.filesList);
  }

  loadAllWorkspaces() {
    this.workspacelist = new WorkspaceList();
    this.workspacelist.workspaceId = "null";
    this.workspacelist.isHidden = false;
    this.store.dispatch(new LoadWorkspacesListTriggered(this.workspacelist));

    this.workspacesList$.subscribe((s: any) => {
      this.workspaces = s;
      this.createRelatedWorkspaces();
      if (this.workspaces) {
        localStorage.setItem(LocalStorageProperties.Dashboards, JSON.stringify(this.workspaces));
      }
    })
  }

  openEmailConfigurationPopUp() {
    this.closeSharePopUp();
    let dialogId = "email-component-popup";
    const dialogRef = this.dialog.open(this.emailTemplate, {
      height: "90%",
      width: "60%",
      id: dialogId,
      data: {}
    });
    dialogRef.afterClosed().subscribe((response) => {
      console.log(response.data);
    });
  }

  clearDocForm() {
    this.docForm = new FormGroup({
      roleIds: new FormControl('', Validators.compose([Validators.required
      ])),
      rolesInput: new FormControl('', this.validateRoles),
      toUsers: new FormControl('', Validators.compose([Validators.required])),
      toInput: new FormControl('', this.validateToUsers),
      subject: new FormControl('', Validators.compose([Validators.required])),
      message: new FormControl('', Validators.compose([Validators.required]))
    })
    this.selectedEmailRoleIds = [];
    this.selectedEmailRoles = [];
    this.selectedToUsers = [];
    this.filteredRoles$ = this.docForm.get('rolesInput').valueChanges.pipe(
      startWith(null),
      map((role: string | null) => role ? this._filter(role) : this.rolesList.slice()));

    this.filteredToUsers$ = this.docForm.get('toInput').valueChanges.pipe(
      startWith(null),
      map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));

    this.docForm.get('roleIds').statusChanges.subscribe(
      status => this.rolesChipList.errorState = status === 'INVALID'
    );
    this.docForm.get('toUsers').statusChanges.subscribe(
      status => this.toChipList.errorState = status === 'INVALID'
    );
  }

  private validateRoles(roles: FormControl) {
    if ((roles.value && roles.value.length === 0)) {
      return {
        validateRolesArray: { valid: false }
      };
    }
    return null;
  }

  private validateToUsers(users: FormControl) {
    if ((users.value && users.value.length === 0)) {
      return {
        validatUsersArray: { valid: false }
      };
    }

    return null;
  }

  _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.rolesList.filter(role => role.roleName.toLowerCase().indexOf(filterValue) >= 0);
  }

  _filterUser(value: string) {
    const filterValue = value.toLowerCase();
    return this.userDropdown.filter(user => user.email.toLowerCase().indexOf(filterValue) >= 0);
  }

  getAllUsers() {
    var searchModel: any = {};
    searchModel.isArchived = false;
    this.genericFormService.GetAllUsers(searchModel).subscribe((response: any) => {
      let usersDropdown = response.data;
      usersDropdown.forEach((user) => {
        if (user.roleIds) {
          user.roleIdsArray = user.roleIds.split(",");
        }
      })
      this.userDropdown = usersDropdown;
      this.filteredToUsers$ = this.docForm.get('toInput').valueChanges.pipe(
        startWith(null),
        map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));
    })
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      let filteredList = this.rolesList.filter(role => role.roleName.toLowerCase().indexOf(value) >= 0);
      let filteredSelectedRoles = this.selectedEmailRoles.filter(role => role.roleName.toLowerCase().indexOf(value) >= 0);
      if (filteredSelectedRoles.length == 0) {
        this.selectedEmailRoles.push(filteredList[0]);
      }
      requestAnimationFrame(() => {
        this.openAuto(this.matACTrigger);
      })
      let roleIds = this.selectedEmailRoles.map(x => x.roleId);
      this.selectedEmailRoleIds = roleIds;
      this.docForm.get('roleIds').setValue(roleIds);
      this.docForm.get('rolesInput').setValue('');
      let usersList = this.searchFilterPipe.transform(this.userDropdown, this.selectedEmailRoleIds);
      if (usersList.length > 0) {
        let userNames = usersList.map(x => x.email);
        let userNamesArray = userNames.join(",");
        this.bindToUserNames(userNamesArray);
      }
    }
    if (input) {
      input.value = '';
    }

  }

  selectedRole(options) {
    let usersList = [];
    let rolesDropdown = this.rolesList;
    let filteredList = _.filter(rolesDropdown, function (role) {
      return role.roleId == options
    })
    if (filteredList.length > 0) {
      let selectedRoles = this.selectedEmailRoles;
      let filteredRole = _.filter(selectedRoles, function (filter) {
        return filter.roleId == options;
      })
      if (filteredRole.length > 0) {
        let index = this.selectedEmailRoles.indexOf(filteredRole[0]);
        if (index > -1) {
          this.selectedEmailRoles.splice(index, 1);
        }
      } else {
        this.selectedEmailRoles.push(filteredList[0])
      }
      this.rolesInput.nativeElement.value = '';
      requestAnimationFrame(() => {
        this.openAuto(this.matACTrigger);
      })
      let roleIds = this.selectedEmailRoles.map(x => x.roleId);
      this.selectedEmailRoleIds = roleIds;
      this.docForm.get('roleIds').setValue(roleIds);
      this.docForm.get('rolesInput').setValue('');
      usersList = this.searchFilterPipe.transform(this.userDropdown, this.selectedEmailRoleIds);

    }
    if (usersList.length > 0) {
      let userNames = usersList.map(x => x.email);
      let userNamesArray = userNames.join(",");
      this.bindToUserNames(userNamesArray);
    }
  }

  addToUser(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      let filteredList = this.userDropdown.filter(user => user.email.toLowerCase().indexOf(value) >= 0);
      if (filteredList.length > 0) {
        let filteredSelectedUsers = this.selectedToUsers.filter(user => user.email.toLowerCase().indexOf(value) >= 0);
        if (filteredSelectedUsers.length == 0) {
          this.selectedToUsers.push(filteredList[0]);
        }
        if (input) {
          input.value = '';
        }
      } else {
        let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var validate = regex.test(value);
        if (validate) {
          var emailModel: any = {};
          emailModel.email = value;
          this.selectedToUsers.push(emailModel);
          this.isValidate = false;
          // Reset the input value
          if (input) {
            input.value = '';
          }
        } else {
          this.isValidate = true;
        }
      }
      let userIds = this.selectedToUsers.map(x => x.email);
      this.docForm.get('toUsers').setValue(userIds);
      this.docForm.get('toInput').setValue('');
      requestAnimationFrame(() => {
        this.openUserAuto(this.matUserACTrigger);
      })
    } else {
      this.isValidate = false;
    }
  }

  selectedTo(options) {
    let userDropdown = this.userDropdown;
    let filteredList = _.filter(userDropdown, function (user) {
      return user.userId == options
    })
    if (filteredList.length > 0) {
      let selectedUsers = this.selectedToUsers;
      let filteredSelectedUsers = _.filter(selectedUsers, function (user) {
        return user.userId == options;
      })
      if (filteredSelectedUsers.length > 0) {
        let index = this.selectedToUsers.indexOf(filteredSelectedUsers[0]);
        if (index > -1) {
          this.selectedToUsers.splice(index, 1);
        }
      } else {
        this.selectedToUsers.push(filteredList[0]);
      }
      this.toUserInput.nativeElement.value = '';
      let userIds = this.selectedToUsers.map(x => x.email);
      this.docForm.get('toUsers').setValue(userIds);
      this.docForm.get('toInput').setValue('');

    }

    requestAnimationFrame(() => {
      this.openUserAuto(this.matUserACTrigger);
    })

  }

  openAuto(trigger: MatAutocompleteTrigger) {
    trigger.openPanel();
    this.rolesInput.nativeElement.focus();
  }
  openUserAuto(trigger: MatAutocompleteTrigger) {
    trigger.openPanel();
    this.toUserInput.nativeElement.focus();
  }

  bindToUserNames(users) {
    let userDropdown = this.userDropdown;
    let userArray = users.split(",");
    let filteredList = [];
    userArray.forEach((user) => {
      let filteredList = _.filter(userDropdown, function (user1) {
        return user == user1.email
      })
      if (filteredList.length > 0) {
        let index = this.selectedToUsers.indexOf(filteredList[0]);
        if (index == -1) {
          this.selectedToUsers.push(filteredList[0]);
        }
      } else {
        var userModel: any = {};
        userModel.email = user;
        this.selectedToUsers.push(userModel);
      }
    })
    let userIds = this.selectedToUsers.map(x => x.email);
    this.selectedUserIds = this.selectedToUsers.map(x => x.userId);
    this.docForm.get('toUsers').setValue(userIds);
    this.docForm.get('toInput').setValue('');

    this.cdRef.detectChanges();
  }

  bindRoleNames(roles) {
    let rolesDropdown = this.rolesList;
    let rolesArray = roles.split(",");
    let filteredList = [];
    rolesArray.forEach((role) => {
      let filteredList = _.filter(rolesDropdown, function (role1) {
        return role == role1.roleId
      })
      if (filteredList.length > 0) {
        let index = this.selectedEmailRoleIds.indexOf(filteredList[0]);
        if (index == -1) {
          this.selectedEmailRoleIds.push(filteredList[0]);
        }
      }
    })
  }

  removeSelectedRole(role) {
    let index = this.selectedEmailRoles.indexOf(role);
    this.selectedEmailRoles.splice(index, 1);
    let roleIds = this.selectedEmailRoles.map(x => x.roleId);
    this.selectedEmailRoleIds = roleIds;
    this.docForm.get('roleIds').setValue(roleIds);
    this.docForm.get('rolesInput').setValue('');
  }

  removeSelectedUser(user) {
    let index = this.selectedToUsers.indexOf(user);
    this.selectedToUsers.splice(index, 1);
    let userIds = this.selectedToUsers.map(x => x.email);
    this.docForm.get('toUsers').setValue(userIds);
    this.docForm.get('toInput').setValue('');
  }

  onNoClickShareEmail() {
    this.dialog.closeAll();
  }

  shareWidgetsPopUpOpen(popUp) {
    this.selectedList = [];
    this.cdRef.detectChanges();
    popUp.openPopover();
  }

  closeSharePopUp() {
    this.shareWidgetsPopUp.forEach((p) => p.closePopover());
  }

  selectedWidgetsList(list) {
    this.originalList = list;
    this.widgetsList = list;
    this.cdRef.detectChanges();
  }

  getSelectWidgetForDashboard(events) {
    this.selectedList = events;
  }

  shareDashboard() {
    this.isLoading = true;
    var model = this.docForm.value;
    let configureDetails: any = {};
    configureDetails.subject = model.subject;
    configureDetails.message = model.message;
    if (this.selectedEmailRoleIds) {
      configureDetails.toRoleIds = this.selectedEmailRoleIds.toString();
    }
    if (this.selectedToUsers) {
      configureDetails.toAddresses = model.toUsers;
    }
    configureDetails.fileBytes = [];
    let filesList = this.filesList;
    let selectedFilesList = [];
    let widgetList = this.selectedList;
    widgetList.forEach((id) => {
      let filteredList = _.filter(filesList, function (filter) {
        return filter.customWidgetId == id
      })
      if (filteredList.length > 0) {
        selectedFilesList.push(filteredList[0]);
      }
    })
    selectedFilesList.forEach((file) => {
      var fileModel: any = {};
      fileModel.visualizationName = file.visualisationName;
      fileModel.fileByteStrings = file.fileBytes;
      fileModel.fileType = file.fileType;
      configureDetails.fileBytes.push(fileModel);
    })

    configureDetails.dashboardName = this.selectedWorkspace?.workspaceName;
    this.widgetService.shareDashboardAsPdf(configureDetails).subscribe((response: any) => {
      if (response.success) {
        this.isLoading = false;
        this.selectedList = [];
        this.dialog.closeAll();
        this.clearDocForm();
        this.toastr.success("Dashboard shared successfully");
      } else {
        this.toastr.error("", response.apiResponseMessages[0].message);
      }
    })

  }
}
