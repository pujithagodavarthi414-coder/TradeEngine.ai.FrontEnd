import { Component, EventEmitter, Input, Output, ViewChildren, ChangeDetectorRef, ViewChild } from "@angular/core";
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

//import { State } from "@thetradeengineorg1/snova-hrmangement";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment_ from 'moment';
const moment = moment_
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import * as _ from 'underscore';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'DD MMM YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: "listview-filter",
    templateUrl: "list-view-filter.component.html",
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class ListViewFilterComponent extends CustomAppBaseComponent {
    isAnyOperationIsInprogress: boolean;
     selectedBusinessUnitId: any ;;
    isForLoggedinUserOnly: boolean = false;
    dateFilterApplied: boolean;
    isMongoQuery: boolean;
    collectionName : string;

    @Input("isMongoQuery")
    set _isMongoQuery(data: boolean) {
        this.isMongoQuery = data;
    }

    @Input("collectionName")
    set _collectionName(data: string) {
        this.collectionName = data;
    }
    

    @Input("workspaceId")
    set _workspaceId(data: string) {
        this.selectedWorkspaceId = data;
        this.getFilterKeys(false);
    }

    @Input("displayLocation")
    set _displayLocation(data: number) {
        this.displayLocation = data;
    }

    @Input("dashboardGlobalData")
    set _dashboardGlobalData(data: any) {
        this.dashboardGlobalData = data;
    }

    @Input("selectedFormName")
    set _selectedFormName(data: string) {
        this.selectedFormName = data;
    }

    @Input("dateFilterApplied")

    set _dateFilterApplied(data: boolean) {
        this.dateFilterApplied = data;
        if (this.dateFilterApplied) {
            this.selectedFilterValue = "2";
            this.dateValue = 'thisMonth';
            this.selectedDynamicFilter = new FilterKeyValueModel();
            this.selectedDynamicFilter.filterKey = "Date";
            this.selectedDynamicFilter.filterName = "Date"
            this.applyDashboardFilters();
        }
        this.cdRef.detectChanges();

    }


    @ViewChildren("userFilterPopover") userFilterPopovers;
    @Output() loding = new EventEmitter<boolean>();
    @Output() applyFilters = new EventEmitter<boolean>();
    @Output() customfilterApplied = new EventEmitter<DashboardFilterModel>();
    loggedUserFilter: FilterKeyValueModel;
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
    usersList: TeamMembersListModel[];
    customFilterValue: string = null;
    tempSelectedUserName: string;
    filterSearchText: string = "";
    selectedWorkspaceId: string;
    selectedAppId: string = null;
    validationMessage: string;
    selectedProjectName: string = null;
    selectedUserName: string = null;
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
    tempMonthDate: string;
    tempYearDate: string;
    isDashboard: boolean;
    dashboardGlobalData: any;
    customApplicationTagKeys: any;
    dateForm = new FormControl();
    @ViewChild(MatDatepicker) picker;
    monthDate: string;
    fromDate: string;
    dummyDate: Date = new Date();
    year: number = this.dummyDate.getFullYear();
    selectedYearDate: string = this.year.toString() + "-01-01";
    filtersCall: boolean = false;
    selectedAuditId: string;
    selectedEntityId: string;
    selectedBranchId: string;
    selectedDesignationId: string;
    selectedRoleId: string;
    selectedDepartmentId: string;
    selectedFinancial: string = "false";
    selectedActiveEmployee: string = "false";
    constructor(
        private widgetService: WidgetService, private toastr: ToastrService,
        private statusreportService: StatusreportService, private cdRef: ChangeDetectorRef, private datePipe: DatePipe, private cookieService: CookieService, private router: Router,
    ) {
        super();
        if(this.router.url.includes('/dashboard/myproductivity')){
            this.isForLoggedinUserOnly = true;
          }
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
    openFilterPopover(filterPopover) {
        if (!this.filtersCall) {
            this.GetProjects();
            this.GetUsers();
        }
        filterPopover.openPopover();
        this.getFilterKeys(false);
        this.filtersCall = true;
        this.selectedFilterValue = null;
        this.selectedUserId = null;
        this.selectedProjectId = null;
        this.customFilterValue = null;
        this.filterValueRequired = false;
        this.tempSelectedUserName = null;
        this.monthDate = null;
        this.selectedYearDate = null;
        this.year = new Date().getFullYear();
        this.selectedYearDate = this.year.toString() + "-01-01";
        this.dateForm.patchValue(null);
        this.filterSearchText = "";
        this.filteredTags = [];
        this.cdRef.detectChanges();
    }
    getFilterKeys(isEmitRequired) {
        const dashboardDynamicFilters = new DynamicDashboardFilterModel();
        dashboardDynamicFilters.dashboardId = this.selectedWorkspaceId;
        dashboardDynamicFilters.dashboardAppId = this.selectedAppId;
        dashboardDynamicFilters.collectionName = this.collectionName;
        dashboardDynamicFilters.isMongoQuery = this.isMongoQuery;
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
        const userTag = new FilterKeyValueModel();
        userTag.filterKey = "User";
        userTag.filterName = "User";
        userTag.isSystemFilter = true;
        const dateTag = new FilterKeyValueModel();
        dateTag.filterKey = "Date";
        dateTag.filterName = "Date";
        dateTag.isSystemFilter = true;
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
                        this.dashboardFilter.dateFrom = this.dateFrom;
                        this.dashboardFilter.dateTo = this.dateTo;
                        this.dashboardFilter.date = this.dynamicFilters[dateIndex].filterValue;
                    }
                }
                else if (this.date) {
                    let obj = JSON.parse(this.date);
                    this.dateFrom = obj.dateFrom;
                    this.tempDateFrom = obj.dateFrom;
                    this.dateTo = obj.dateTo;
                    this.tempDateTo = obj.dateTo;
                    this.singleDate = obj.date;
                    this.dateType = this.singleDate != null ? 'date' : (this.dateFrom && this.dateTo) ? 'dateRange' : '';
                    if(this.dateType == 'date') {
                        this.tempSingleDate = obj.date;
                    }
                    if (this.dateFrom && this.dateTo) {
                        this.startDate();
                    }
                    if (this.dashboardFilter && isEmiteRequired) {
                        if(this.dateType == 'date') {
                            this.dashboardFilter.date = this.singleDate;
                        } else {
                            this.dashboardFilter.dateFrom = this.tempDateFrom;
                            this.dashboardFilter.dateTo = this.tempDateTo;
                        }
                    }
                }
                this.cdRef.detectChanges();
            }
        }
        if (isEmiteRequired) {
            this.customfilterApplied.emit(this.dashboardFilter);
        }
        this.customTags.push(projectTag);
        this.customTags.push(userTag);
        this.customTags.push(dateTag);
        this.setTags(this.customApplicationTagKeys);
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
        this.customTags.forEach((item: any) => {
            if (this.isForLoggedinUserOnly) {
                if (item.filterName != "User") {
                    if (item && item.filterName.toLowerCase().indexOf(tagText.toLowerCase().trim()) != -1) {
                        this.filteredTags.push(item);
                    }
                }
            }
            else {
                if (item && item.filterName.toLowerCase().indexOf(tagText.toLowerCase().trim()) != -1) {
                    this.filteredTags.push(item);
                }
            }
        });
        if (this.filteredTags.length === 0) {
            this.selectedFilterValue = null;
            this.selectedDynamicFilter = null;
        }

        this.tagsLoadingInProgress = false;
    }
    onChangeTag(selectedValue) {
        if (selectedValue.filterKey === "Project" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "0";
            this.selectedDynamicFilter = selectedValue;
        }
        else if (selectedValue.filterKey === "User" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "1";
            this.selectedDynamicFilter = selectedValue;
        } else if (selectedValue.filterKey === "Date" && selectedValue.isSystemFilter === true) {
            this.selectedFilterValue = "2";
            this.selectedDynamicFilter = selectedValue;
            this.dateType = null;
        }
    }
    displayFn(tagtext) {
        if (tagtext != null) {
            return tagtext.filterName;
        }
        return "";
    }
    monthSelected(normalizedYear: Moment) {
        this.dateForm.setValue(normalizedYear);
        this.fromDate = moment(normalizedYear.toDate()).format("YYYY-MM").toString();
        this.monthDate = this.fromDate.toString() + '-01';
        this.picker.close();
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
                let obj ;
                if(this.dateType == "date") {
                    obj = { dateFrom: this.dateFrom, dateTo: this.dateTo, date: moment(this.singleDate).format('YYYY-MM-DD')};
                } else {
                    this.tempSingleDate = null;
                    let dateFrom = moment(this.dateFrom).format('YYYY-MM-DD')
                    let dateTo = moment(this.dateTo).format('YYYY-MM-DD')
                 
                    obj = { dateFrom: dateFrom, dateTo: dateTo};
                }
                
                this.selectedDynamicFilter.filterValue = JSON.stringify(obj);
            }
        }
        if (this.filterValueRequired === false) {
            const filterindex = this.dynamicFilters.findIndex((p) => p.filterKey === this.selectedDynamicFilter.filterKey
                && p.isSystemFilter === this.selectedDynamicFilter.isSystemFilter);
            if (filterindex > -1) {
                this.dynamicFilters[filterindex].filterValue = this.selectedDynamicFilter.filterValue;
            } else {
                this.dynamicFilters.push(this.selectedDynamicFilter);
            }
            if(this.userFilterPopovers){
                this.userFilterPopovers.forEach((p) => p.closePopover());
            }
            this.loding.emit(true);
            this.cdRef.detectChanges();
            this.upsertDynamicFilters();
        }
    }
    upsertDynamicFilters() {
        const dashboardDynamicFilters = new DynamicDashboardFilterModel();
        dashboardDynamicFilters.referenceId = this.selectedWorkspaceId;
        dashboardDynamicFilters.filters = this.dynamicFilters;
        dashboardDynamicFilters.collectionName = this.collectionName;
        dashboardDynamicFilters.isMongoQuery = this.isMongoQuery;
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
                this.dashboardFilter.dateFrom = this.dateFrom;
                this.dashboardFilter.dateTo = this.dateTo;
                this.dashboardFilter.isMongoQuery = this.isMongoQuery;
                this.dashboardFilter.collectionName = this.collectionName;
                this.getFilterKeys(true);
                this.applyFilters.emit(true);
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        });
        // this.applyFilters.emit(true);
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
        if (this.dashboardGlobalData && this.dashboardGlobalData.usersList) {
            this.usersList = this.dashboardGlobalData.usersList;
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
}
