import { Component, Input, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { SoftLabelConfigurationModel } from "../../dependencies/models/softLabels-model";
import { TeamMembersListModel } from "../../dependencies/models/line-mangaers-model";
import { StatusreportService } from "../../dependencies/services/statusreport.service";
import { CustomTagsModel } from "../../dependencies/models/customTagsModel";
import { UserStoryTypesModel } from "../../dependencies/models/userStoryTypesModel";
import { LoadBugPriorityTypesTriggered } from "../../dependencies/store/actions/bug-priority.actions";
import { LoadUserStoryTypesTriggered } from "../../dependencies/store/actions/user-story-types.action";
import { LoadUserStoryStatusTriggered } from "../../dependencies/store/actions/userStoryStatus.action";
import { ProjectList } from "../../dependencies/models/projectlist";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { GoogleAnalyticsService } from "../../dependencies/services/google-analytics.service";
import { DashboardFilterModel } from "../../dependencies/models/dashboardFilterModel";
import { DragedWidget } from "../../dependencies/models/dragedWidget";
import { DynamicDashboardFilterModel } from "../../dependencies/models/dynamicDashboardFilerModel";
import { WorkspaceList } from "../../dependencies/models/workspaceList";
import { WidgetService } from "../../dependencies/services/widget.service";
import { State } from "../../dependencies/store/reducers/index";
import { GenericFormSubmitted } from "../../dependencies/models/generic-form-submitted.model";
import { DatePipe } from "@angular/common";
import { EntityDropDownModel } from "../../dependencies/models/entity-dropdown.module";
import { HrBranchModel } from "../../dependencies/models/HrBranchModel";
import { DesignationModel } from "../../dependencies/models/designation-model";
import { RoleModel } from "../../dependencies/models/role-model";
import { DepartmentModel } from "../../dependencies/models/department-model";
import { Title } from "@angular/platform-browser";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap'
import { BusinessUnitDropDownModel } from '../../dependencies/models/businessunitmodel';
import { GenericFormService } from "../../dependencies/services/generic-form.service";
import { Router } from "@angular/router";

/** @dynamic */

@Component({
    selector: "app-filters-listview",
    templateUrl: "apps-filters-listview.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilteredListviewComponent extends CustomAppBaseComponent implements OnDestroy {

    dashboardFilter: DashboardFilterModel;
    selected = new FormControl(0);
    rolesDropDown: any[];
    selectedWorkspaceforFilter: DynamicDashboardFilterModel;
    timeStamp: any;
    appTagSearchText: "";
    workspaceForm: FormGroup;
    workspaceSelect: FormGroup;
    selectedLabelId: string;

    workspacesList$: Observable<WorkspaceList[]>;
    anyOperationInProgress$: Observable<boolean>;
    upsertWorkspaceloading$: Observable<boolean>;
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
    disableWorkspace = false;
    disableWorkspaceDelete = false;
    disableWorkspacehide = false;
    disableDuplicateDashboard = false;
    loadingCompleted = false;
    dashboardUpdateInProgress = false;
    workspaces: WorkspaceList[];
    workspacelist: WorkspaceList;
    selectedRoleIds: string[] = [];
    selectedWorkspace: any;
    softLabels: SoftLabelConfigurationModel[];
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    selectedFormId: string;
    selectedFormName: string = null;
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
    filtersLoaded: boolean = false;
    listView: boolean;
    departmentList: DepartmentModel[];
    selectedYearDate: string;
    fromSelect: boolean;
    allBusinessUnits: BusinessUnitDropDownModel[] = [];
    businessUnitsList: BusinessUnitDropDownModel[] = [];
    selectedBusinessUnitId: any;
    dashboardName: string;
    selectedUser: string;
    isForLoggedinUserOnly: boolean;
    dateFilterApplied: boolean = false;
    isFilterEnable: boolean = false;

    @Input("dashboardName")
    set _dashboardName(data: string) {
        this.dashboardName = data;
        this.cdRef.detectChanges();
    }
    @Input("selectedWorkspaceId")
    set _selectedWorkspaceId(data: string) {
        this.selectedWorkspaceId = data;
        this.cdRef.detectChanges();
    }

    constructor(
        private store: Store<State>, private widgetService: WidgetService,
        private toastr: ToastrService,
        private translateService: TranslateService, public dialog: MatDialog, private statusreportService: StatusreportService,
        public googleAnalyticsService: GoogleAnalyticsService, private genericFormService: GenericFormService, private cdRef: ChangeDetectorRef, private datePipe: DatePipe, private router: Router,
        private titleService: Title) {
        super();
        this.initializeworkspaceForm();
        this.workspaceSelect = new FormGroup({
            selected: new FormControl(null, [])
        });
        // this.GetFilters();
        this.selectedWorkspaceforFilter = new DynamicDashboardFilterModel();
        this.selectedWorkspaceforFilter.dashboardId = this.selectedWorkspaceId;
        if (this.router.url.includes('/productivity/dashboard/')) {
            this.dateFilterApplied = true;
        }
    }


    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.getSubmittedFormData();
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

    changeViewType() {
        this.listView = !this.listView;
        this.selectedAppForListView = this.selectedApps = null;
        this.cdRef.detectChanges();
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
    refreshDashboard(workspaceId) {
        if (this.selectedWorkspaceId === workspaceId) {
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
            this.reloadDashboard = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
        }
    }
    customfilterApplied(dynamicFilters) {
        this.dashboardFilter = dynamicFilters;
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
        // this.filterApplied = "filterapplied" + possible.charAt(Math.floor(Math.random() * possible.length));
    }
    dashboardFilterEnable(isFilterEnable) {
        this.isFilterEnable = isFilterEnable
    }
    GetProjects() {
        this.widgetService
            .GetProjects()
            .subscribe((responseData: any) => {
                console.log(responseData);
                this.projectsList = responseData.data;
                this.dashboardGlobalData.projectsList = this.projectsList;
                this.GetUsers();
            });
    }
    loding(data) {
        this.filtersLoaded = data;
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
                this.cdRef.detectChanges();
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.filtersLoaded = true;
                this.cdRef.detectChanges();
            }
            // this.modifyBreadCrumb();
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

            const userIndex = dynamicFilters.findIndex((p) => p.filterKey === "User" && p.isSystemFilter === true);
            if (userIndex > -1 && this.usersList && this.usersList.length > 0) {
                const index = this.usersList.findIndex((p) => p.teamMemberId === dynamicFilters[userIndex].filterValue);
                if (index > -1) {
                    this.selectedUserId = dynamicFilters[userIndex].filterValue;
                }
            }

            const dateIndex = dynamicFilters.findIndex((p) => p.filterKey === "Date" && p.isSystemFilter === true);
            if (dateIndex > -1) {
                this.date = dynamicFilters[dateIndex].filterValue;
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
        this.dashboardFilter.dateFrom = this.dateFrom;
        this.dashboardFilter.dateTo = this.dateTo;
        this.dashboardFilter.date = this.singleDate;
        this.date = null;
        this.cdRef.detectChanges();
    }

    // modifyBreadCrumb() {
    //     this.workspacesList$.subscribe((result) => {
    //         const selectedindex = result.findIndex((p) => p.workspaceId == this.selectedWorkspaceId);
    //         if (selectedindex > -1) {
    //             this.titleService.setTitle("Dashboard - " + this.selectedWorkspace.workspaceName);
    //         }
    //     });
    // }

    initializeworkspaceForm() {
        this.workspaceForm = new FormGroup({
            workspaceName: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)]))
        });
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



    ngOnDestroy() {

    }
}

