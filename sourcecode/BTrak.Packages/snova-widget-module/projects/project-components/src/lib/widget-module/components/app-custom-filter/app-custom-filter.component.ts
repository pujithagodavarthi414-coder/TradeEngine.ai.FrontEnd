import { Component, EventEmitter, Input, Output, ViewChildren, ChangeDetectorRef, SimpleChanges, ViewChild } from "@angular/core";
import { TeamMembersListModel } from "../../dependencies/models/line-mangaers-model";

import { StatusreportService } from "../../dependencies/services/statusreport.service";
import { CustomTagsModel } from "../../dependencies/models/customTagsModel";
import { ProjectList } from "../../dependencies/models/projectlist";

import { ToastrService } from "ngx-toastr";
import { DashboardFilterModel } from "../../dependencies/models/dashboardFilterModel";
import { DynamicDashboardFilterModel } from "../../dependencies/models/dynamicDashboardFilerModel";
import { FilterKeyValueModel } from "../../dependencies/models/filterKeyValueModel";

import { WidgetService } from "../../dependencies/services/widget.service";

import { DatePipe } from "@angular/common";

import { ProductivityDashboardService } from "../../dependencies/services/productivity-dashboard.service";
import { EntityDropDownModel } from "../../dependencies/models/entity-dropdown.module";
import { HRManagementService } from "../../dependencies/services/hrmanagement.service";
import { HrBranchModel } from "../../dependencies/models/hrBranchModel";
import { DesignationModel } from "../../dependencies/models/designation-model";
//import { State } from "@thetradeengineorg1/snova-hrmangement";
import { Observable } from "rxjs";
import { RoleModel } from "../../dependencies/models/role-model";
import { DepartmentModel } from "../../dependencies/models/department-model";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter, MatOption } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment_ from 'moment';
const moment = moment_
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { AuditCompliance } from '../../dependencies/models/audit-compliance.model';
import { BusinessUnitDropDownModel } from '../../dependencies/models/businessunitmodel';
import * as _ from 'underscore';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CookieService } from 'ngx-cookie-service';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'MMM YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: "app-cutom-tag-filter",
    templateUrl: "app-custom-filter.component.html",
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class CustomAppFilterComponent extends CustomAppBaseComponent {
    isAnyOperationIsInprogress: boolean;
    selectedBusinessUnitId: any;
    selectedBusinessUnit: string;

    @Input("selectedWorkspace")
    set _selectedWorkspace(data: DynamicDashboardFilterModel) {
        if (data != null && data !== undefined) {
            this.selectedWorkspaceId = data.dashboardId;
            this.selectedAppId = data.dashboardAppId;
            // this.GetProjects();
            // this.GetUsers();
            // this.getEntityDropDown();
            // this.getDesignationList();
            // this.getBranches();
            // this.getRoles();
            // this.getDepartment();
            this.getFilterKeys(false);
        }
    }

    @Input("workspaceId")
    set _workspaceId(data: string) {
        this.selectedWorkspaceId = data;
    }

    @Input("displayLocation")
    set _displayLocation(data: number) {
        this.displayLocation = data;
    }

    @Input("dashboardGlobalData")
    set _dashboardGlobalData(data: any) {
        this.dashboardGlobalData = data;
    }

    // @Input("isDashboard")
    // set _isDashboard(data: boolean) {
    //     this.isDashboard = data;
    // if(this.isDashboard){
    //     this.GetProjects();
    //     this.GetUsers();
    //     this.getFilterKeys(false);
    // }
    // }
    @Input("currentLoggedUser")
    set _currentLoggedUser(data: string) {
        this.selectedUserId = data;
        // this.selectedFilterValue = "1";
        // this.applyDashboardFilters()
    }
    @Input("selectedFormName")
    set _selectedFormName(data: string) {
        this.selectedFormName = data;
    }

    @ViewChildren("userFilterPopover") userFilterPopovers;

    @Output() customfilterApplied = new EventEmitter<DashboardFilterModel>();
    dynamicFilters: FilterKeyValueModel[] = [];
    filterValueRequired = false;
    tagsLoadingInProgress = false;
    displayLocation: number;
    customTags: FilterKeyValueModel[];
    filteredTags: FilterKeyValueModel[];
    filterValues: CustomTagsModel[] = [];
    selectedFilterValue: string = null;
    dashboardFilter: DashboardFilterModel;
    selectedUserId: string;
    selectedFormName: string = null;
    selectedProjectId: string;
    projectsList: ProjectList[];
    selectedAuditId: string;
    auditList: any;
    selectedAuditName: string = null;
    usersList: TeamMembersListModel[];
    customFilterValue: string = null;
    tempSelectedUserName: string;
    filterSearchText: string = null;
    selectedWorkspaceId: string;
    selectedAppId: string = null;
    validationMessage: string;
    selectedProjectName: string = null;
    selectedUserName: string = null;
    selectedEntityName: string = null;
    selectedBranchName: string = null;
    selectedDepartmentName: string = null;
    selectedDynamicFilter: FilterKeyValueModel;
    date: string = null;
    dateValue: string;
    dateFrom: string;
    dateTo: string;
    dateType: string;
    singleDate: string;
    maxDate = new Date();
    minDate = new Date(1753, 0, 1);
    minDateForEndDate = new Date();
    endDateBool: boolean = true;
    tempDateFrom: string;
    tempDateTo: string;
    tempSingleDate: string;
    tempSelectedFinancial: string;
    tempSelectedActiveEmployee: string;
    tempMonthDate: string;
    tempYearDate: string;
    entities: EntityDropDownModel[];
    selectedEntityId: string;
    branches: HrBranchModel[];
    selectedBranchId: string;
    designationList$: Observable<DesignationModel[]>;
    designationList: DesignationModel[];
    selectedDesignationName: string;
    selectedDesignationId: string;
    selectedRoleId: string;
    selectedRoleName: string;
    rolesList: RoleModel[];
    isDashboard: boolean;
    dashboardGlobalData: any;
    customApplicationTagKeys: any;
    departmentList: DepartmentModel[];
    selectedDepartmentId: string;
    selectedFinancial: string = "false";
    isFinancialYear: boolean = false;
    selectedActiveEmployee: string = "false";
    isActiveEmployeesOnly: boolean = false;
    dateForm = new FormControl();
    @ViewChild(MatDatepicker) picker;
    monthDate: string;
    fromDate: string;
    dummyDate: Date = new Date();
    year: number = this.dummyDate.getFullYear();
    selectedYearDate: string = this.year.toString() + "-01-01";
    filtersCall: boolean = false;
    businessUnitsList: BusinessUnitDropDownModel[] = [];
    isDefaultfilter: boolean = true;
    curDate=new Date();

    constructor(
        private cookieService: CookieService,
        private widgetService: WidgetService, private toastr: ToastrService,
        private statusreportService: StatusreportService, private cdRef: ChangeDetectorRef, private datePipe: DatePipe,
        private productivityDashboardService: ProductivityDashboardService, private branchService: HRManagementService,
        //private store: Store<State>
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    GetProjects() {
        this.widgetService
            .GetProjects()
            .subscribe((responseData: any) => {
                console.log(responseData);
                this.projectsList = responseData.data;
                if (this.dynamicFilters.length > 0) {
                    const projectIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Project" && p.isSystemFilter === true);
                    if (projectIndex > -1 && this.projectsList && this.projectsList.length > 0) {
                        const index = this.projectsList.findIndex((p) => p.projectId === this.dynamicFilters[projectIndex].filterValue);
                        if (index > -1) {
                            this.selectedProjectName = this.projectsList[index].projectName;
                            this.cdRef.detectChanges();
                        }
                    }
                }
            });
    }

    GetAudits() {
        const audit = new AuditCompliance();
        audit.isForFilter = true;
        this.widgetService
          .searchAudits(audit)
            .subscribe((res: any) => {
              this.auditList = res.data;
              if (this.dynamicFilters.length > 0) {
                const projectIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Audit" && p.isSystemFilter === true);
                if (projectIndex > -1 && this.auditList && this.auditList.length > 0) {
                    const index = this.auditList.findIndex((p) => p.auditId === this.dynamicFilters[projectIndex].filterValue);
                    if (index > -1) {
                        this.selectedAuditName = this.auditList[index].auditName;
                        this.cdRef.detectChanges();
                    }
                }
            }
            });
      }

    SetProjects() {
        if (this.dynamicFilters.length > 0) {
            const projectIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Project" && p.isSystemFilter === true);
            if (projectIndex > -1 && this.projectsList && this.projectsList.length > 0) {
                const index = this.projectsList.findIndex((p) => p.projectId === this.dynamicFilters[projectIndex].filterValue);
                if (index > -1) {
                    this.selectedProjectName = this.projectsList[index].projectName;
                    this.cdRef.detectChanges();
                }
            }
        }
    }

     SetAudits() {
        if (this.dynamicFilters.length > 0) {
            const projectIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Audit" && p.isSystemFilter === true);
            if (projectIndex > -1 && this.auditList && this.auditList.length > 0) {
                const index = this.auditList.findIndex((p) => p.auditId === this.dynamicFilters[projectIndex].filterValue);
                if (index > -1) {
                    this.selectedAuditName = this.auditList[index].auditName;
                    this.cdRef.detectChanges();
                }
            }
        }
    }

    GetUsers() {
        this.statusreportService.getTeamLeadsList().subscribe((response: any) => {
            this.usersList = response.data;
            if (this.dynamicFilters.length > 0) {
                const userIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "User" && p.isSystemFilter === true);
                if (userIndex > -1 && this.usersList && this.usersList.length > 0) {
                    const index = this.usersList.findIndex((p) => p.teamMemberId === this.dynamicFilters[userIndex].filterValue);
                    if (index > -1) {
                        this.selectedUserName = this.usersList[index].teamMemberName;
                        this.cdRef.detectChanges();
                    }
                }
            }
        });
    }

    getEntityDropDown() {
        let searchText = "";
        this.productivityDashboardService.getEntityDropDown(searchText).subscribe((responseData: any) => {
            if (responseData.success === false) {
                this.toastr.error(responseData.apiResponseMessages[0].message);
            }
            else {
                this.entities = responseData.data;
                if (this.dynamicFilters.length > 0) {
                    const userIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Entity" && p.isSystemFilter === true);
                    if (userIndex > -1 && this.entities && this.entities.length > 0) {
                        const index = this.entities.findIndex((p) => p.id === this.dynamicFilters[userIndex].filterValue);
                        if (index > -1) {
                            this.selectedEntityName = this.usersList[index].teamMemberName;
                            this.cdRef.detectChanges();
                        }
                    }
                }
            }
        });
    }

    setEntity() {
        if (this.dynamicFilters.length > 0) {
            const userIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Entity" && p.isSystemFilter === true);
            if (userIndex > -1 && this.entities && this.entities.length > 0) {
                const index = this.entities.findIndex((p) => p.id === this.dynamicFilters[userIndex].filterValue);
                if (index > -1) {
                    this.selectedEntityName = this.usersList[index].teamMemberName;
                    this.cdRef.detectChanges();
                }
            }
        }
    }

    getBranches() {
        var hrBranchModel = new HrBranchModel();
        hrBranchModel.isArchived = false;
        this.branchService.getBranches(hrBranchModel).subscribe((response: any) => {
            this.branches = response.data;
            if (this.dynamicFilters.length > 0) {
                const branchIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Branch" && p.isSystemFilter === true);
                if (branchIndex > -1 && this.branches && this.branches.length > 0) {
                    const index = this.branches.findIndex((p) => p.branchId === this.dynamicFilters[branchIndex].filterValue);
                    if (index > -1) {
                        this.selectedBranchName = this.branches[index].branchName;
                        this.cdRef.detectChanges();
                    }
                }
            }
        })
    }

    setBranch() {
        if (this.dynamicFilters.length > 0) {
            const branchIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Branch" && p.isSystemFilter === true);
            if (branchIndex > -1 && this.branches && this.branches.length > 0) {
                const index = this.branches.findIndex((p) => p.branchId === this.dynamicFilters[branchIndex].filterValue);
                if (index > -1) {
                    this.selectedBranchName = this.branches[index].branchName;
                    this.cdRef.detectChanges();
                }
            }
        }
    }

    getDesignationList() {
        var designationSearchModel = new DesignationModel();
        designationSearchModel.isArchived = false;
        this.widgetService.getAllDesignations(designationSearchModel).subscribe((response: any) => {
            this.designationList = response.data;
            if (this.dynamicFilters.length > 0) {
                const designationIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Designation" && p.isSystemFilter === true);
                if (designationIndex > -1 && this.designationList && this.designationList.length > 0) {
                    const index = this.designationList.findIndex((p) => p.designationId === this.dynamicFilters[designationIndex].filterValue);
                    if (index > -1) {
                        this.selectedDesignationName = this.designationList[index].designationName;
                        this.cdRef.detectChanges();
                    }
                }
            }
        })
    }

    setDesignation() {
        if (this.dynamicFilters.length > 0) {
            const designationIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Designation" && p.isSystemFilter === true);
            if (designationIndex > -1 && this.designationList && this.designationList.length > 0) {
                const index = this.designationList.findIndex((p) => p.designationId === this.dynamicFilters[designationIndex].filterValue);
                if (index > -1) {
                    this.selectedDesignationName = this.designationList[index].designationName;
                    this.cdRef.detectChanges();
                }
            }
        }
    }

    getRoles() {
        var roleModel = new RoleModel();
        roleModel.isArchived = false;
        this.widgetService.getAllRoles(roleModel).subscribe((response: any) => {
            this.rolesList = response.data;
            if (this.dynamicFilters.length > 0) {
                const roleIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Role" && p.isSystemFilter === true);
                if (roleIndex > -1 && this.rolesList && this.rolesList.length > 0) {
                    const index = this.rolesList.findIndex((p) => p.roleId === this.dynamicFilters[roleIndex].filterValue);
                    if (index > -1) {
                        this.selectedRoleName = this.rolesList[index].roleName;
                        this.cdRef.detectChanges();
                    }
                }
            }
        })
    }

    setRole() {
        if (this.dynamicFilters.length > 0) {
            const roleIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Role" && p.isSystemFilter === true);
            if (roleIndex > -1 && this.rolesList && this.rolesList.length > 0) {
                const index = this.rolesList.findIndex((p) => p.roleId === this.dynamicFilters[roleIndex].filterValue);
                if (index > -1) {
                    this.selectedRoleName = this.rolesList[index].roleName;
                    this.cdRef.detectChanges();
                }
            }
        }
    }

    SetUsers() {
        if (this.dynamicFilters.length > 0) {
            const userIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "User" && p.isSystemFilter === true);
            if (userIndex > -1 && this.usersList && this.usersList.length > 0) {
                const index = this.usersList.findIndex((p) => p.teamMemberId === this.dynamicFilters[userIndex].filterValue);
                if (index > -1) {
                    this.selectedUserName = this.usersList[index].teamMemberName;
                    this.cdRef.detectChanges();
                }
            }
        }
    }

    getDepartment() {
        var departmentModel = new DepartmentModel();
        departmentModel.isArchived = false;
        this.widgetService.getAllDepartments(departmentModel).subscribe((response: any) => {
            this.departmentList = response.data;
            if (this.dynamicFilters.length > 0) {
                const departmentIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Department" && p.isSystemFilter === true);
                if (departmentIndex > -1 && this.departmentList && this.departmentList.length > 0) {
                    const index = this.departmentList.findIndex((p) => p.departmentId === this.dynamicFilters[departmentIndex].filterValue);
                    if (index > -1) {
                        this.selectedDepartmentName = this.departmentList[index].departmentName;
                        this.cdRef.detectChanges();
                    }
                }
            }
        })
    }

    setDepartment() {
        if (this.dynamicFilters.length > 0) {
            const departmentIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Department" && p.isSystemFilter === true);
            if (departmentIndex > -1 && this.departmentList && this.departmentList.length > 0) {
                const index = this.departmentList.findIndex((p) => p.departmentId === this.dynamicFilters[departmentIndex].filterValue);
                if (index > -1) {
                    this.selectedDepartmentName = this.departmentList[index].departmentName;
                    this.cdRef.detectChanges();
                }
            }
        }
    }

    openFilterPopover(filterPopover) {
        if (!this.filtersCall) {
            this.GetAudits();
            this.GetProjects();
            this.getBusinessUnits();
            this.GetUsers();
            this.getEntityDropDown();
            this.getDesignationList();
            this.getBranches();
            this.getRoles();
            this.getDepartment();
        }
        this.getFilterKeys(false);
        this.filtersCall = true;
        this.selectedFilterValue = null;
        this.selectedUserId = null;
        this.selectedProjectId = null;
        this.customFilterValue = null;
        this.filterValueRequired = false;
        this.selectedRoleId = null;
        this.selectedDesignationId = null;
        this.selectedEntityId = null;
        this.selectedBranchId = null;
        this.selectedDepartmentId = null;
        this.tempSelectedUserName = null;
        this.selectedFinancial = "false";
        this.isFinancialYear = null;
        this.selectedActiveEmployee = "false";
        this.isActiveEmployeesOnly = null;
        this.monthDate = null;
        this.selectedYearDate = null;
        this.year = new Date().getFullYear();
        this.selectedYearDate = this.year.toString() + "-01-01";
        this.dateForm.patchValue(null);
        this.filterSearchText = "";
        this.filteredTags = [];
        this.cdRef.detectChanges();
        filterPopover.openPopover();
    }

    getFilterKeys(isEmitRequired) {
        const dashboardDynamicFilters = new DynamicDashboardFilterModel();
        dashboardDynamicFilters.dashboardId = this.selectedWorkspaceId;
        dashboardDynamicFilters.dashboardAppId = this.selectedAppId;
        this.widgetService.GetCustomDashboardFilters(dashboardDynamicFilters).subscribe((result: any) => {
            if (result.success === true) {
                this.dynamicFilters = result.data;
                this.searchCustomTags(isEmitRequired);
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        });
    }

    setFilterKeys() {
        this.searchCustomTags(false);
    }

    searchCustomTags(isEmiteRequired) {
        this.customTags = [];
        const projectTag = new FilterKeyValueModel();
        projectTag.filterKey = "Project";
        projectTag.filterName = "Project";
        projectTag.isSystemFilter = true;
        const auditTag = new FilterKeyValueModel();
        auditTag.filterKey = "Audit";
        auditTag.filterName = "Audit";
        auditTag.isSystemFilter = true;
        const businessUnitTag = new FilterKeyValueModel();
        businessUnitTag.filterKey = "BusinessUnit";
        businessUnitTag.filterName = "Business unit";
        businessUnitTag.isSystemFilter = true;
        const userTag = new FilterKeyValueModel();
        userTag.filterKey = "User";
        userTag.filterName = "User";
        userTag.isSystemFilter = true;
        const dateTag = new FilterKeyValueModel();
        dateTag.filterKey = "Date";
        dateTag.filterName = "Date";
        dateTag.isSystemFilter = true;
        const entityTag = new FilterKeyValueModel();
        entityTag.filterKey = "Entity";
        entityTag.filterName = "Entity";
        entityTag.isSystemFilter = true;
        const branchTag = new FilterKeyValueModel();
        branchTag.filterKey = "Branch";
        branchTag.filterName = "Branch";
        branchTag.isSystemFilter = true;
        const designationTag = new FilterKeyValueModel();
        designationTag.filterKey = "Designation";
        designationTag.filterName = "Designation";
        designationTag.isSystemFilter = true;
        const roleTag = new FilterKeyValueModel();
        roleTag.filterKey = "Role";
        roleTag.filterName = "Role";
        roleTag.isSystemFilter = true;
        const departmentTag = new FilterKeyValueModel();
        departmentTag.filterKey = "Department";
        departmentTag.filterName = "Department";
        departmentTag.isSystemFilter = true;
        const financialYearTag = new FilterKeyValueModel();
        financialYearTag.filterKey = "FinancialYear";
        financialYearTag.filterName = "FinancialYear";
        financialYearTag.isSystemFilter = true;
        const activeEmployeeTag = new FilterKeyValueModel();
        activeEmployeeTag.filterKey = "ActiveEmployees";
        activeEmployeeTag.filterName = "ActiveEmployees";
        activeEmployeeTag.isSystemFilter = true;
        const monthTag = new FilterKeyValueModel();
        monthTag.filterKey = "Month";
        monthTag.filterName = "Month";
        monthTag.isSystemFilter = true;
        const yearTag = new FilterKeyValueModel();
        yearTag.filterKey = "Year";
        yearTag.filterName = "Year";
        yearTag.isSystemFilter = true;
        if (this.dynamicFilters.length > 0) {
            const projectIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Project" && p.isSystemFilter === true);
            if (projectIndex > -1 && this.projectsList && this.projectsList.length > 0) {
                const index = this.projectsList.findIndex((p) => p.projectId === this.dynamicFilters[projectIndex].filterValue);
                if (index > -1) {
                    this.selectedProjectName = this.projectsList[index].projectName;
                    projectTag.filterId = this.dynamicFilters[projectIndex].filterId;
                    projectTag.filterValue = this.dynamicFilters[projectIndex].filterValue;
                    this.selectedProjectId = this.dynamicFilters[projectIndex].filterValue;
                    this.cdRef.detectChanges();
                } else {
                    this.selectedProjectName = null;
                    this.selectedProjectId = null;
                }
            }
            const auditIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Audit" && p.isSystemFilter === true);
            if (auditIndex > -1 && this.auditList && this.auditList.length > 0) {
                const index = this.auditList.findIndex((p) => p.auditId === this.dynamicFilters[auditIndex].filterValue);
                if (index > -1) {
                    this.selectedAuditName = this.auditList[index].auditName;
                    projectTag.filterId = this.dynamicFilters[auditIndex].filterId;
                    projectTag.filterValue = this.dynamicFilters[auditIndex].filterValue;
                    this.selectedAuditId = this.dynamicFilters[auditIndex].filterValue;
                    this.cdRef.detectChanges();
                } else {
                    this.selectedAuditName = null;
                    this.selectedAuditId = null;
                }
            }

            const businessUnitIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "BusinessUnit" && p.isSystemFilter === true);
            if (businessUnitIndex > -1 && this.businessUnitsList && this.businessUnitsList.length > 0) {
                const index = this.businessUnitsList.findIndex((p) => p.businessUnitId === this.dynamicFilters[businessUnitIndex].filterValue);

                if (index> -1) {
                    this.selectedBusinessUnit = this.businessUnitsList[index].businessUnitName;
                    businessUnitTag.filterId = this.dynamicFilters[businessUnitIndex].filterId;
                    businessUnitTag.filterValue = this.dynamicFilters[businessUnitIndex].filterValue;
                    this.selectedBusinessUnitId = this.dynamicFilters[businessUnitIndex].filterValue;
                    this.cdRef.detectChanges();
                } else {
                    this.selectedBusinessUnit = null;
                    this.selectedBusinessUnitId = null;
                }
            }

            const userIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "User" && p.isSystemFilter === true);
            if (userIndex > -1 && this.usersList && this.usersList.length > 0) {
                const index = this.usersList.findIndex((p) => p.teamMemberId === this.dynamicFilters[userIndex].filterValue);
                if (index > -1) {
                    this.selectedUserName = this.usersList[index].teamMemberName;
                    userTag.filterId = this.dynamicFilters[userIndex].filterId;
                    userTag.filterValue = this.dynamicFilters[userIndex].filterValue;
                    this.selectedUserId = this.dynamicFilters[userIndex].filterValue;
                    this.cdRef.detectChanges();
                } else {
                    this.selectedUserName = null;
                    this.selectedUserId = null;
                }
            }

            const entityIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Entity" && p.isSystemFilter === true);
            if (entityIndex > -1 && this.entities && this.entities.length > 0) {
                const index = this.entities.findIndex((p) => p.id === this.dynamicFilters[entityIndex].filterValue);
                if (index > -1) {
                    this.selectedEntityName = this.entities[index].name;
                    entityTag.filterId = this.dynamicFilters[entityIndex].filterId;
                    entityTag.filterValue = this.dynamicFilters[entityIndex].filterValue;
                    this.selectedEntityId = this.dynamicFilters[entityIndex].filterValue;
                    this.cdRef.detectChanges();
                } else {
                    this.selectedEntityName = null;
                    this.selectedEntityId = null;
                }
            }

            const branchIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Branch" && p.isSystemFilter === true);
            if (branchIndex > -1 && this.usersList && this.usersList.length > 0) {
                const index = this.branches.findIndex((p) => p.branchId === this.dynamicFilters[branchIndex].filterValue);
                if (index > -1) {
                    this.selectedBranchName = this.branches[index].branchName;
                    branchTag.filterId = this.dynamicFilters[branchIndex].filterId;
                    branchTag.filterValue = this.dynamicFilters[branchIndex].filterValue;
                    this.selectedBranchId = this.dynamicFilters[branchIndex].filterValue;
                    this.cdRef.detectChanges();
                } else {
                    this.selectedBranchName = null;
                    this.selectedBranchId = null;
                }
            }

            const designationIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Designation" && p.isSystemFilter === true);
            if (designationIndex > -1 && this.designationList && this.designationList.length > 0) {
                const index = this.designationList.findIndex((p) => p.designationId === this.dynamicFilters[designationIndex].filterValue);
                if (index > -1) {
                    this.selectedDesignationName = this.designationList[index].designationName;
                    designationTag.filterId = this.dynamicFilters[designationIndex].filterId;
                    designationTag.filterValue = this.dynamicFilters[designationIndex].filterValue;
                    this.selectedDesignationId = this.dynamicFilters[designationIndex].filterValue;
                    this.cdRef.detectChanges();
                } else {
                    this.selectedDesignationName = null;
                    this.selectedDesignationId = null;
                }
            }

            const roleIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Role" && p.isSystemFilter === true);
            if (roleIndex > -1 && this.rolesList && this.rolesList.length > 0) {
                const index = this.rolesList.findIndex((p) => p.roleId === this.dynamicFilters[roleIndex].filterValue);
                if (index > -1) {
                    this.selectedRoleName = this.rolesList[index].roleName;
                    roleTag.filterId = this.dynamicFilters[roleIndex].filterId;
                    roleTag.filterValue = this.dynamicFilters[roleIndex].filterValue;
                    this.selectedRoleId = this.dynamicFilters[roleIndex].filterValue;
                    this.cdRef.detectChanges();
                } else {
                    this.selectedRoleName = null;
                    this.selectedRoleId = null;
                }
            }

            const departmentIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Department" && p.isSystemFilter === true);
            if (departmentIndex > -1 && this.departmentList && this.departmentList.length > 0) {
                const index = this.departmentList.findIndex((p) => p.departmentId === this.dynamicFilters[departmentIndex].filterValue);
                if (index > -1) {
                    this.selectedDepartmentName = this.departmentList[index].departmentName;
                    departmentTag.filterId = this.dynamicFilters[departmentIndex].filterId;
                    departmentTag.filterValue = this.dynamicFilters[departmentIndex].filterValue;
                    this.selectedDepartmentId = this.dynamicFilters[departmentIndex].filterValue;
                    this.cdRef.detectChanges();
                } else {
                    this.selectedDepartmentName = null;
                    this.selectedDepartmentId = null;
                }
            }

            const financialIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "FinancialYear" && p.isSystemFilter === true);
            if (financialIndex > -1) {
                financialYearTag.filterId = this.dynamicFilters[financialIndex].filterId;
                financialYearTag.filterValue = this.dynamicFilters[financialIndex].filterValue;
                this.selectedFinancial = this.dynamicFilters[financialIndex].filterValue;
                this.tempSelectedFinancial = this.dynamicFilters[financialIndex].filterValue;
            }

            const activeEmployeeIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "ActiveEmployees" && p.isSystemFilter === true);
            if (activeEmployeeIndex > -1) {
                financialYearTag.filterId = this.dynamicFilters[activeEmployeeIndex].filterId;
                financialYearTag.filterValue = this.dynamicFilters[activeEmployeeIndex].filterValue;
                this.selectedActiveEmployee = this.dynamicFilters[activeEmployeeIndex].filterValue;
                this.tempSelectedActiveEmployee = this.dynamicFilters[activeEmployeeIndex].filterValue;
            }

            const monthIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Month" && p.isSystemFilter === true);
            if (monthIndex > -1) {
                monthTag.filterId = this.dynamicFilters[monthIndex].filterId;
                monthTag.filterValue = this.dynamicFilters[monthIndex].filterValue;
                this.monthDate = this.dynamicFilters[monthIndex].filterValue;
                this.tempMonthDate = this.dynamicFilters[monthIndex].filterValue;
            }

            const yearIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Year" && p.isSystemFilter === true);
            if (yearIndex > -1) {
                yearTag.filterId = this.dynamicFilters[yearIndex].filterId;
                yearTag.filterValue = this.dynamicFilters[yearIndex].filterValue;
                this.selectedYearDate = this.dynamicFilters[yearIndex].filterValue;
                this.tempYearDate = this.dynamicFilters[yearIndex].filterValue;
            }

            const dateIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Date" && p.isSystemFilter === true);
            if (dateIndex > -1) {
                dateTag.filterId = this.dynamicFilters[dateIndex].filterId;
                dateTag.filterValue = this.dynamicFilters[dateIndex].filterValue;
                this.date = this.dynamicFilters[dateIndex].filterValue;
                if (this.date == 'lastWeek' || this.date == 'nextWeek' || this.date == 'thisMonth' || this.date == 'lastMonth') {
                    this.getDates(this.date);
                    this.date = null;
                    this.singleDate = null;
                    this.tempSingleDate = null;
                    if (this.dashboardFilter && isEmiteRequired) {
                        this.dashboardFilter.dateFrom =  moment(this.dateFrom).format("YYYY-MM-DD").toString();
                        this.dashboardFilter.dateTo = moment(this.dateTo).format("YYYY-MM-DD").toString();
                       
                    }
                }
                else if (this.date) {
                    let obj = JSON.parse(this.date);
                    this.dateFrom = obj.dateFrom;
                    this.tempDateFrom = obj.dateFrom;
                    this.dateTo = obj.dateTo;
                    this.tempDateTo = obj.dateTo;
                    this.singleDate = obj.date;
                    this.tempSingleDate = obj.date;
                    if (this.dateFrom && this.dateTo) {
                        this.startDate();
                    }
                    if (this.dashboardFilter && isEmiteRequired) {
                        this.dashboardFilter.date = this.singleDate;
                    }
                }
                else if(this.date==null && this.isDefaultfilter == true) {
                //Apply default filter
                  
                  const dateIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "Date" && p.isSystemFilter === true);
                     if (dateIndex > -1) {
                      dateTag.filterId = this.dynamicFilters[dateIndex].filterId;
                      dateTag.filterValue = "{\"dateFrom\":\"2021-01-01T01:30:00.000Z\",\"dateTo\":\""+this.curDate+"\"}";
                      //this.dynamicFilters[dateIndex].filterValue = "{\"dateFrom\":\"2021-01-01T01:30:00.000Z\",\"dateTo\":\""+this.curDate+"\"}";//"{\"dateFrom\":\"2021-01-01T01:30:00.000Z\",\"dateTo\":\"2021-12-31T01:30:00.000Z\"}";
                      this.dynamicFilters[dateIndex].filterValue = "{\"dateFrom\":\"2021-01-01\",\"dateTo\":\""+moment(this.curDate).format("YYYY-MM-DD").toString()+"\"}";
                      }
                  this.date =  "{\"dateFrom\":\"2021-01-01T01:30:00.000Z\",\"dateTo\":\""+this.curDate+"\"}"; //"{\"dateFrom\":\"2021-01-01T01:30:00.000Z\",\"dateTo\":\"2021-12-31T01:30:00.000Z\"}";
                  let obj = JSON.parse(this.date);
                  this.dateFrom = obj.dateFrom;
                  this.tempDateFrom = obj.dateFrom;
                  this.dateTo = obj.dateTo;
                  this.tempDateTo = obj.dateTo;
                  this.singleDate = obj.date;
                  this.tempSingleDate = obj.date;
                  
                  if (this.dateFrom && this.dateTo) {
                      this.startDate();
                  }
                  if (this.dashboardFilter && isEmiteRequired) {
                      this.dashboardFilter.date = this.singleDate;
                  }
                  this.upsertDynamicFilters();
                }
                this.cdRef.detectChanges();
            }
        }
        if (isEmiteRequired) {
            this.customfilterApplied.emit(this.dashboardFilter);
        }
        this.customTags.push(projectTag);
        this.customTags.push(auditTag);
        this.customTags.push(businessUnitTag);
        this.customTags.push(userTag);
        this.customTags.push(dateTag);
        this.customTags.push(entityTag);
        this.customTags.push(branchTag);
        this.customTags.push(designationTag);
        this.customTags.push(roleTag);
        this.customTags.push(departmentTag);
        this.customTags.push(financialYearTag);
        this.customTags.push(activeEmployeeTag);
        this.customTags.push(monthTag);
        this.customTags.push(yearTag);
        // if(this.isDashboard){
        //     this.widgetService.GetCustomApplicationTagKeys(customTagModel).subscribe((result: any) => {
        //         if (result.success === true) {
        //             this.setTags(result.data);
        //         } else {
        //             this.validationMessage = result.apiResponseMessages[0].message;
        //             this.toastr.error(this.validationMessage);
        //         }
        //     });
        // }else{
        this.setTags(this.customApplicationTagKeys);
        // }
    }

    auditSelected(auidtId) {
        this.selectedAuditId = auidtId;
    }

    businessUnitSelected(businessUnitId) {
        this.selectedBusinessUnitId = businessUnitId;
    }


    setTags(customTags: any) {
        if (customTags && customTags.length > 0) {
            customTags.forEach((param) => {
                if (!this.customTags.find((p) => p.filterName === param.filterName && p.isSystemFilter === false)) {
                    const index = this.dynamicFilters.findIndex((p) =>
                        p.filterKey === param.filterKey && p.isSystemFilter === false);
                    if (index > -1) {
                        param.filterId = this.dynamicFilters[index].filterId;
                        param.filterValue = this.dynamicFilters[index].filterValue;
                    }
                    this.customTags.push(param);
                    this.cdRef.detectChanges();
                }
            });
        }
    }

    searchFilter() {
        this.filterValueRequired = false;
        this.tagsLoadingInProgress = true;
        this.filteredTags = [];
        const tagText = this.filterSearchText;
        if (!tagText) {
            this.filteredTags = this.customTags;
        } else {
            this.customTags.forEach((item: any) => {
                if (item && item.filterName.toLowerCase().indexOf(tagText.toLowerCase().trim()) != -1) {
                    this.filteredTags.push(item);
                }
            });
            if (this.filteredTags.length === 0) {
                this.selectedFilterValue = null;
                this.selectedDynamicFilter = null;
            }
        }
        this.tagsLoadingInProgress = false;
    }

    onChangeTag(selectedValue) {
        if (selectedValue.filterKey === "Project" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "0";
            this.selectedDynamicFilter = selectedValue;
        } else if (selectedValue.filterKey === "Audit" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "13";
            this.selectedDynamicFilter = selectedValue;
        } else if (selectedValue.filterKey === "BusinessUnit" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "14";
            this.selectedDynamicFilter = selectedValue;
        }
        else if (selectedValue.filterKey === "User" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "1";
            this.selectedDynamicFilter = selectedValue;
        } else if (selectedValue.filterKey === "Date" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "2";
            this.selectedDynamicFilter = selectedValue;
            this.dateType = null;
        } else if (selectedValue.filterKey === "Entity" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "3";
            this.selectedDynamicFilter = selectedValue;
        } else if (selectedValue.filterKey === "Branch" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "4";
            this.selectedDynamicFilter = selectedValue;
        } else if (selectedValue.filterKey === "Designation" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "5";
            this.selectedDynamicFilter = selectedValue;
        } else if (selectedValue.filterKey === "Role" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "6";
            this.selectedDynamicFilter = selectedValue;
        } else if (selectedValue.filterKey && selectedValue.isSystemFilter === false) {
            this.selectedFilterValue = "7";
            this.selectedDynamicFilter = selectedValue;
        } else if (selectedValue.filterKey === "Department" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "8";
            this.selectedDynamicFilter = selectedValue;
        } else if (selectedValue.filterKey === "FinancialYear" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "9";
            this.selectedDynamicFilter = selectedValue;
        } else if (selectedValue.filterKey === "ActiveEmployees" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "10";
            this.selectedDynamicFilter = selectedValue;
        } else if (selectedValue.filterKey === "Month" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "11";
            this.selectedDynamicFilter = selectedValue;
        } else if (selectedValue.filterKey === "Year" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "12";
            this.selectedDynamicFilter = selectedValue;
        }
    }

    displayFn(tagtext) {
        if (tagtext != null) {
            return tagtext.filterName;
        }
        return "";
    }

    entitySelected(id) {
        this.selectedEntityId = id;
    }

    financialSelected() {
        if (this.isFinancialYear) {
            this.selectedFinancial = "true";
        } else {
            this.selectedFinancial = "false";
        }
    }

    activeEmployeeSelected() {
        if (this.isActiveEmployeesOnly) {
            this.selectedActiveEmployee = "true";
        } else {
            this.selectedActiveEmployee = "false";
        }
    }

    monthSelected(normalizedYear: Moment) {
        this.dateForm.setValue(normalizedYear);
        this.fromDate = moment(normalizedYear.toDate()).format("YYYY-MM").toString();
        this.monthDate = this.fromDate.toString() + '-01';
        this.picker.close();
    }

    departmentSelected(id) {
        this.selectedDepartmentId = id;
    }

    roleSelected(id) {
        this.selectedRoleId = id;
    }

    branchSelected(id) {
        this.selectedBranchId = id;
    }

    designationSelected(id) {
        this.selectedDesignationId = id;
    }

    projectselected(projectId) {
        this.selectedProjectId = projectId;
    }

    userselected(userId) {
        this.selectedUserId = userId;
        const userIndex = this.usersList.findIndex((p) => p.teamMemberId === this.selectedUserId);
        if (userIndex > -1) {
            this.tempSelectedUserName = this.usersList[userIndex].teamMemberName;
        } else {
            this.tempSelectedUserName = null;
        }
    }

    removedynamicfilter(filter, isFrom) {
        if (isFrom === "Project") {
            this.selectedProjectId = null;
        }
        if (isFrom === "Audit") {
            this.selectedAuditId = null;
        }
        if (isFrom === "BusinessUnit") {
            this.selectedBusinessUnitId = null;
        }
        if (isFrom === "User") {
            this.selectedUserId = null;
        }
        if (isFrom === "Date") {
            this.date = null;
            this.dateFrom = null;
            this.dateTo = null;
            this.dateValue = null;
            this.singleDate = null;
            this.dateType = null;
            this.isDefaultfilter = false;
            this.tempDateFrom = null;
            this.tempDateTo = null;
        }
        if (isFrom === "Entity") {
            this.selectedEntityId = null;
        }

        if (isFrom === "Branch") {
            this.selectedBranchId = null;
        }

        if (isFrom === "Designation") {
            this.selectedDesignationId = null;
        }

        if (isFrom === "Role") {
            this.selectedRoleId = null;
        }

        if (isFrom === "Department") {
            this.selectedDepartmentId = null;
        }

        if (isFrom === "FinancialYear") {
            this.selectedFinancial = "false";
            this.isFinancialYear = false;
        }

        if (isFrom === "ActiveEmployees") {
            this.selectedActiveEmployee = "false";
            this.isActiveEmployeesOnly = false;
        }

        if (isFrom === "Month") {
            this.monthDate = null;
        }

        if (isFrom === "Year") {
            this.year = null;
            this.selectedYearDate = null;
        }


        const index = this.dynamicFilters.findIndex((p) => p.filterKey === filter.filterKey && p.isSystemFilter === filter.isSystemFilter);
        if (index > -1) {
            this.dynamicFilters[index].filterValue = null;
            this.upsertDynamicFilters();
        }
    }

    applyDashboardFilters() {
        this.filterValueRequired = false;
        if (this.selectedFilterValue === "0" && this.selectedProjectId === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "0") {
            const index = this.projectsList.findIndex((p) => p.projectId === this.selectedProjectId);
            if (index > -1) {
                this.selectedProjectName = this.projectsList[index].projectName;
                this.selectedDynamicFilter.isSystemFilter = true;
                this.selectedDynamicFilter.filterValue = this.selectedProjectId;
            } else {
                this.selectedProjectName = null;
            }
        }
        if (this.selectedFilterValue === "13" && this.selectedAuditId === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "13") {
            const index = this.auditList.findIndex((p) => p.auditId === this.selectedAuditId);
            if (index > -1) {
                this.selectedAuditName = this.auditList[index].auditName;
                this.selectedDynamicFilter.isSystemFilter = true;
                this.selectedDynamicFilter.filterValue = this.selectedAuditId;
            } else {
                this.selectedAuditName = null;
            }
        }
        if (this.selectedFilterValue === "14" && this.selectedBusinessUnitId === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "14") {
            const index = this.businessUnitsList.findIndex((p) => p.businessUnitId === this.selectedBusinessUnitId);
            if (index > -1) {
                this.selectedBusinessUnit = this.businessUnitsList[index].businessUnitName;
                this.selectedDynamicFilter.isSystemFilter = true;
                this.selectedDynamicFilter.filterValue = this.selectedBusinessUnitId;
            } else {
                this.selectedBusinessUnit = null;
            }
        }
        if (this.selectedFilterValue === "1" && this.selectedUserId === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "1") {
            const userIndex = this.usersList.findIndex((p) => p.teamMemberId === this.selectedUserId);
            if (userIndex > -1) {
                this.selectedUserName = this.usersList[userIndex].teamMemberName;
                this.selectedDynamicFilter.isSystemFilter = true;
                this.selectedDynamicFilter.filterValue = this.selectedUserId
            } else {
                this.selectedUserName = null;
            }
        }
        if (this.selectedFilterValue === "2" && (this.dateFrom == null && this.dateTo == null && this.singleDate == null && this.dateValue == null)) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "2") {
            this.selectedDynamicFilter.isSystemFilter = true;
            if (this.dateValue == 'lastWeek' || this.dateValue == 'nextWeek' || this.dateValue == 'thisMonth' || this.dateValue == 'lastMonth') {
                this.getDates(this.dateValue);
                this.date = this.dateValue;
                this.selectedDynamicFilter.filterValue = this.date;
            }
            else {
            
                let obj = { dateFrom: moment(this.dateFrom).format("YYYY-MM-DD").toString(), dateTo: moment(this.dateTo).format("YYYY-MM-DD").toString(), date: this.singleDate };
                //let obj = { dateFrom: this.dateFrom, dateTo: this.dateTo, date: this.singleDate };
                this.selectedDynamicFilter.filterValue = JSON.stringify(obj);
            }
        }

        if (this.selectedFilterValue === "3" && this.selectedEntityId === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "3") {
            const entityIndex = this.entities.findIndex((p) => p.id === this.selectedEntityId);
            if (entityIndex > -1) {
                this.selectedEntityName = this.entities[entityIndex].name;
                this.selectedDynamicFilter.isSystemFilter = true;
                this.selectedDynamicFilter.filterValue = this.selectedEntityId;
            } else {
                this.selectedEntityName = null;
            }
        }

        if (this.selectedFilterValue === "4" && this.selectedBranchId === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "4") {
            const branchIndex = this.branches.findIndex((p) => p.branchId === this.selectedBranchId);
            if (branchIndex > -1) {
                this.selectedBranchName = this.branches[branchIndex].branchName;
                this.selectedDynamicFilter.isSystemFilter = true;
                this.selectedDynamicFilter.filterValue = this.selectedBranchId;
            } else {
                this.selectedBranchName = null;
            }
        }

        if (this.selectedFilterValue === "5" && this.selectedDesignationId === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "5") {
            const designationIndex = this.designationList.findIndex((p) => p.designationId === this.selectedDesignationId);
            if (designationIndex > -1) {
                this.selectedDesignationName = this.designationList[designationIndex].designationName;
                this.selectedDynamicFilter.isSystemFilter = true;
                this.selectedDynamicFilter.filterValue = this.selectedDesignationId;
            } else {
                this.selectedDesignationName = null;
            }
        }

        if (this.selectedFilterValue === "6" && this.selectedRoleId === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "6") {
            const roleIndex = this.rolesList.findIndex((p) => p.roleId === this.selectedRoleId);
            if (roleIndex > -1) {
                this.selectedRoleName = this.rolesList[roleIndex].roleName;
                this.selectedDynamicFilter.isSystemFilter = true;
                this.selectedDynamicFilter.filterValue = this.selectedRoleId;
            } else {
                this.selectedRoleName = null;
            }
        }

        if (this.selectedFilterValue === "8" && this.selectedDepartmentId === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "8") {
            const departmentIndex = this.departmentList.findIndex((p) => p.departmentId === this.selectedDepartmentId);
            if (departmentIndex > -1) {
                this.selectedDepartmentName = this.departmentList[departmentIndex].departmentName;
                this.selectedDynamicFilter.isSystemFilter = true;
                this.selectedDynamicFilter.filterValue = this.selectedDepartmentId;
            } else {
                this.selectedDepartmentName = null;
            }
        }

        if (this.selectedFilterValue === "9" && this.selectedFinancial === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "9") {
            this.selectedDynamicFilter.isSystemFilter = true;
            this.selectedDynamicFilter.filterValue = this.selectedFinancial;
        }

        if (this.selectedFilterValue === "10" && this.selectedActiveEmployee === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "10") {
            this.selectedDynamicFilter.isSystemFilter = true;
            this.selectedDynamicFilter.filterValue = this.selectedActiveEmployee;
        }
        if (this.selectedFilterValue === "11" && this.monthDate === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "11") {
            this.selectedDynamicFilter.isSystemFilter = true;
            this.selectedDynamicFilter.filterValue = this.monthDate;
        }
        if (this.selectedFilterValue === "12" && this.selectedYearDate === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "12") {
            this.selectedDynamicFilter.isSystemFilter = true;
            this.selectedDynamicFilter.filterValue = this.selectedYearDate;
        }

        if (this.selectedFilterValue === "7" && this.customFilterValue === null) {
            this.filterValueRequired = true;
        } else if (this.selectedFilterValue === "7") {
            this.selectedDynamicFilter.filterValue = this.customFilterValue;
        }
        if (this.filterValueRequired === false) {
            const filterindex = this.dynamicFilters.findIndex((p) => p.filterKey === this.selectedDynamicFilter.filterKey
                && p.isSystemFilter === this.selectedDynamicFilter.isSystemFilter);
            if (filterindex > -1) {
                this.dynamicFilters[filterindex].filterValue = this.selectedDynamicFilter.filterValue;
            } else {
                this.dynamicFilters.push(this.selectedDynamicFilter);
            }
            this.userFilterPopovers.forEach((p) => p.closePopover());
            this.upsertDynamicFilters();
        }
    }

    upsertDynamicFilters() {
        const dashboardDynamicFilters = new DynamicDashboardFilterModel();     
        dashboardDynamicFilters.referenceId =  this.selectedWorkspaceId ;
        dashboardDynamicFilters.filters = this.dynamicFilters;
        this.widgetService.UpsertCustomDashboardFilter(dashboardDynamicFilters).subscribe((result: any) => {
            if (result.success === true) {
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
                this.dashboardFilter.date = this.date;
                // this.date = null;
                this.dashboardFilter.dateFrom =  moment(this.dateFrom).format("YYYY-MM-DD").toString();
                this.dashboardFilter.dateTo = moment(this.dateTo).format("YYYY-MM-DD").toString();
                this.getFilterKeys(true);
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        });
    }

    getDates(dateValue) {
        if (dateValue == 'lastMonth') {
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
            this.dateFrom = firstDay.toString();
            this.dateTo = lastDay.toString();
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
            this.dateFrom = startDate.toString();
            this.dateTo = endDate.toString();
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
            this.dateFrom = startDate.toString();
            this.dateTo = endDate.toString();
        }
        this.tempDateFrom = this.dateFrom;
        this.tempDateTo = this.dateTo;
    }

    dateChanged() {
        this.dateValue = null;
    }

    onChange() {
        this.dateFrom = null;
        this.dateTo = null;
    }

    onDateTypeChange() {
        if (this.dateType == 'date') {
            this.dateFrom = null;
            this.dateTo = null;
        } else if (this.dateType == 'dateRange') {
            this.date = null;
        }
    }

    startDate() {
        if (this.dateFrom) {
            this.minDateForEndDate = new Date(this.dateFrom);
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.dateTo = null;
        }
    }

    ngOnChanges(): void {
        if (this.dashboardGlobalData && this.dashboardGlobalData.projectsList) {
            this.projectsList = this.dashboardGlobalData.projectsList;
        }

        if (this.dashboardGlobalData && this.dashboardGlobalData.auditList) {
            this.auditList = this.dashboardGlobalData.auditList;
        }

        if (this.dashboardGlobalData && this.dashboardGlobalData.businessUnitsList) {
            this.businessUnitsList = this.dashboardGlobalData.businessUnitsList;
        }

        if (this.dashboardGlobalData && this.dashboardGlobalData.usersList) {
            this.usersList = this.dashboardGlobalData.usersList;
        }

        if (this.dashboardGlobalData && this.dashboardGlobalData.entityList) {
            this.entities = this.dashboardGlobalData.entityList;
        }

        if (this.dashboardGlobalData && this.dashboardGlobalData.branchList) {
            this.branches = this.dashboardGlobalData.branchList;
        }

        if (this.dashboardGlobalData && this.dashboardGlobalData.designationList) {
            this.designationList = this.dashboardGlobalData.designationList;
        }

        if (this.dashboardGlobalData && this.dashboardGlobalData.rolesList) {
            this.rolesList = this.dashboardGlobalData.rolesList;
        }

        if (this.dashboardGlobalData && this.dashboardGlobalData.departmentList) {
            this.departmentList = this.dashboardGlobalData.departmentList;
        }

        if (this.dashboardGlobalData && this.dashboardGlobalData.customApplicationTagKeys) {
            this.customApplicationTagKeys = this.dashboardGlobalData.customApplicationTagKeys;
        }

        if (this.dashboardGlobalData && this.dashboardGlobalData.workspaceFilters) {
            this.dynamicFilters = [];
            for (var i = 0; i < this.dashboardGlobalData.workspaceFilters.length; i++) {
                if (this.dashboardGlobalData.workspaceFilters[i].dashboardAppId == this.selectedAppId && this.selectedAppId != null) { // for custom apps
                    this.dynamicFilters.push(this.dashboardGlobalData.workspaceFilters[i]);
                } else if (this.selectedAppId == null && this.dashboardGlobalData.workspaceFilters[i].dashboardAppId == this.dashboardGlobalData.workspaceFilters[i].dashboardId) { // for dashboard filter persistance
                    this.dynamicFilters.push(this.dashboardGlobalData.workspaceFilters[i]);
                }
            }
            // this.setFilterKeys();
            // this.SetProjects();
            // this.SetUsers();
            // this.setEntity();
            // this.setBranch();
            // this.setDesignation();
            // this.setRole();
            // this.setDepartment();
        }
    }

    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        } else if ((typeof value === 'string') && value === '') {
            return new Date();
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    getYearDate(direction) {
        if (direction === 'left') {
            const day = 1;
            const month = 1;
            this.year = this.dummyDate.getFullYear() - 1;
            const newDate = day + '/' + month + '/' + this.year;
            this.dummyDate = this.parse(newDate);
            this.selectedYearDate = this.datePipe.transform(this.dummyDate, 'yyyy-MM-dd');
        } else {
            const day = 1;
            const month = 1;
            this.year = 0 + this.dummyDate.getFullYear() + 1;
            const newDate = day + '/' + month + '/' + this.year;
            this.dummyDate = this.parse(newDate);
            this.selectedYearDate = this.datePipe.transform(this.dummyDate, 'yyyy-MM-dd');
        }
    }

    getBusinessUnits() {
        this.isAnyOperationIsInprogress = true;
        var businessUnitDropDownModel = new BusinessUnitDropDownModel();
        businessUnitDropDownModel.isArchived = false;
        businessUnitDropDownModel.isFromHR = false ;
        this.widgetService.getBusinessUnits(businessUnitDropDownModel).subscribe((response: any) => {
            if (response.success == true) {
                this.businessUnitsList = response.data;
                if (this.dynamicFilters.length > 0) {
                    const businessUnitIndex = this.dynamicFilters.findIndex((p) => p.filterKey === "BusinessUnit" && p.isSystemFilter === true);
                    if (businessUnitIndex > -1 && this.businessUnitsList && this.businessUnitsList.length > 0) {
                        const index = this.businessUnitsList.findIndex((p) => p.businessUnitId === this.dynamicFilters[businessUnitIndex].filterValue);
                        if (index > -1) {
                            this.selectedBusinessUnit = this.businessUnitsList[index].businessUnitName;
                            this.cdRef.detectChanges();
                        }
                    }
                }
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
      }
}
