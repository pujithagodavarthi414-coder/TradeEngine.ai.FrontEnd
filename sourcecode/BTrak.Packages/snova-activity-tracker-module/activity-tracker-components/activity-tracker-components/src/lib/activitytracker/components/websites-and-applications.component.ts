import { Component, OnInit, ViewChildren, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatOption } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as d3 from 'd3';
import { arc, color } from 'd3';
import { Observable } from "rxjs";

import * as _ from "underscore";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { TimeUsageService } from '../services/time-usage.service';
import { WebAppUsageSearchModel } from '../models/web-app-usage-search-model';
import { Page } from '../models/Page';
import { EmployeeModel } from '../models/employee-model';
import { EmployeeOfRoleModel } from '../models/employee-of-role-model';
import { WebAppUsageModel } from '../models/web-app-usage-model';
import { AppUsageReportModel } from '../models/app-usage-report-model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import * as introJs from 'intro.js/intro.js';
import { NavigationExtras, Router } from '@angular/router';
import { ActivityTimeFilterPipe } from '../../globaldependencies/pipes/activityTimeConversion.pipe';
import { SeriesLabels } from '@progress/kendo-angular-charts';
import { AccumulationChart, ChartTheme, IAccTextRenderEventArgs, ILoadedEventArgs } from '@syncfusion/ej2-charts';
import { AccumulationChartComponent } from '@syncfusion/ej2-angular-charts';

// export const MY_FORMATS = {
//     parse: {
//         dateInput: 'LL',
//     },
//     display: {
//         dateInput: 'LL',
//         monthYearLabel: 'MMM YYYY',
//         dateA11yLabel: 'LL',
//         monthYearA11yLabel: 'MMMM YYYY',
//     }
// };

// tslint:disable-next-line: max-classes-per-file
@Component({
    selector: 'app-fm-component-websites-and-applications',
    templateUrl: `websites-and-applications.component.html`,
    // providers: [
    //     {
    //         provide: DateAdapter,
    //         useClass: MomentDateAdapter,
    //         deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    //     },
    //     { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    // ]
})

export class WebsitesAndApplicationsComponent extends CustomAppBaseComponent {
    @ViewChild("allBranchesSelected") private allBranchesSelected: MatOption;
    @ViewChild("allRolesSelected") private allRolesSelected: MatOption;
    @ViewChild('syncpie')
    public syncpie: AccumulationChartComponent | AccumulationChart;
    @Input("webAppUsageSearch")
    set _webAppUsageSearch(data: any) {
        if (data) {
            this.webAppUsageSearch = data;
            this.dateFrom = this.webAppUsageSearch.dateFrom;
            this.dateTo = this.webAppUsageSearch.dateTo;
            this.searchText = this.webAppUsageSearch.searchText;
            var webAppUsageSearch = new WebAppUsageSearchModel();
            webAppUsageSearch.userId = this.webAppUsageSearch.userId;
            webAppUsageSearch.branchId = this.webAppUsageSearch.branchId;
            webAppUsageSearch.roleId = this.webAppUsageSearch.roleId;
            webAppUsageSearch.searchText = this.webAppUsageSearch.searchText;
            webAppUsageSearch.dateFrom = this.webAppUsageSearch.dateFrom;
            webAppUsageSearch.dateTo = this.webAppUsageSearch.dateTo;
            this.inputModel = webAppUsageSearch;
            this.getActTrackerAppReportUsage();
        }
    }

    page = new Page();
    employeesDropDown: any;
    webAppUsageSearch: WebAppUsageSearchModel = new WebAppUsageSearchModel();
    inputModel: WebAppUsageSearchModel;
    employeeOfRoleModel: EmployeeOfRoleModel = new EmployeeOfRoleModel();
    webAppUsage: WebAppUsageModel[];
    rolesDropDown: any[];
    branchesList: any[];
    appUsageReport: AppUsageReportModel[];
    webAppsReport: AppUsageReportModel[];
    emptyModel: AppUsageReportModel[];
    isOpen: boolean = true;
    searchText: string = '';
    dateFrom: Date = new Date();
    dateTo: Date = new Date();
    fromDate: Date = new Date();
    toDate: Date = new Date();
    maxDate = new Date();
    minDate: Date;
    days: number;
    selectBranchFilterIsActive: boolean = false;
    selectRoleFilterIsActive: boolean = false;
    selectUserFilterIsActive: boolean = false;
    monthFilterActive: boolean = false;
    searchIsActive: boolean = false;
    loadingIndicator: boolean;
    branchId: any;
    roleId: any;
    userId: string;
    width = 300
    height = 300
    margin = 40
    radius;
    svg;
    color;
    pie;
    data_ready;
    selectedUser: string;
    selectedBranch: string;
    selectedRole: string;
    loading: boolean = false;
    totalCount: number = 0;
    loggedUser: string;
    isSelectAllRoles: boolean = false;
    isSelectAllBranches: boolean = false;
    minDateOnTrailExpired: Date = null;
    isTrailExpired: boolean = false;

    introJS = new introJs();
    isStartEnable: boolean = false;

    chartsData: any;
    cursor = 'default';
    public seriesLabels: SeriesLabels = {
        visible: false, // Note that visible defaults to false
        padding: 3,
        font: "bold 16px Arial, sans-serif"
    };

    public startAngle: number = 0;
    public endAngle: number = 360;

    public legendSettings: Object;

    public donutTooltip: Object;

    public onTextRender(args: IAccTextRenderEventArgs): void {
        args.series.dataLabel.font.size = this.getFontSize(this.syncpie.initialClipRect.width);
        args.text = args.text;
    }

    public dataLabel: Object;

    public load(args: ILoadedEventArgs): void {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
    };

    chartLoad: boolean = false;

    heightSync: string = "346px";

    widthSync: string = "936px"

    //public data = { a: 9, b: 20, c: 30, d: 8, e: 12 };

    constructor(private timeUsageService: TimeUsageService,
        private translateService: TranslateService,
        private cookieService: CookieService,
        private router: Router,
        private cdRef: ChangeDetectorRef,
        private activityTimeFilter: ActivityTimeFilterPipe) {
        super();
        this.branchId = null;
        this.roleId = null;
        this.userId = null;
        this.searchText = '';
        var response = JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails));
        if (response && (response.trailDays > 0 || response.noOfPurchasedLicences > 0)) {
            this.isTrailExpired = false;
        }
        else {
            this.isTrailExpired = true;
        }

        if (this.isTrailExpired) {
            var today = new Date();
            var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
            // var month;
            // var year;
            // if (endDate.getDate() > today.getDate()) {
            //     month = today.getMonth() != 0 ? today.getMonth() - 1 : 11;
            //     if (month == 11) {
            //         year = today.getFullYear() - 1;
            //     }
            //     year = today.getFullYear();
            // }
            // else {
            //     month = today.getMonth();
            //     year = today.getFullYear();
            // }
            this.minDateOnTrailExpired = endDate;
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.loading = true;
        this.page.size = 5;
        this.page.pageNumber = 0;
        this.branchId = [];
        this.roleId = [];
        this.userId = null;
        this.searchText = '';
        this.setFromDate(this.fromDate);
        this.setToDate(this.fromDate);
        // this.getAllBranches();
        // this.getAllRoles();
        // this.getAllEmployees();
        // this.getLoggedInUser();
        this.loadingIndicator = true;
        //this.getActTrackerAppReportUsage();
    }

    search() {
        if (this.searchText) {
            this.searchIsActive = true;
        }
        else {
            this.searchIsActive = false;
        }
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.trim();
            if (this.searchText.length <= 0) return;
        }
        this.loadingIndicator = true;
        this.getActTrackerAppReportUsage();
    }

    resetAllFilters() {
        this.setFromDate(new Date());
        this.setToDate(new Date());
        this.branchId = null;
        this.roleId = null;
        this.userId = null;
        this.searchText = '';
        this.selectedBranch = null;
        this.selectedRole = null;
        this.selectedUser = null;
        this.webAppUsageSearch.userId = null;
        this.webAppUsageSearch.roleId = null;
        this.webAppUsageSearch.branchId = null;
        this.webAppUsageSearch.searchText = '';
        this.employeeOfRoleModel.branchId = null;
        this.employeeOfRoleModel.roleId = null;
        this.getAllEmployees();
        this.loadingIndicator = true;
        this.getActTrackerAppReportUsage();
        // this.getLoggedInUser();
    }

    filterStatus() {
        if (this.userId ||
            this.roleId ||
            this.branchId ||
            this.webAppUsageSearch.searchText != '' ||
            this.fromDate || this.toDate)
            return true;
        else
            return false;
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    changeUser(value) {
        this.webAppUsageSearch.userId = [];
        if (value === "0") {
            this.selectUserFilterIsActive = false;
        }
        if (value == "") {
            // this.webAppUsageSearch.userId = null;
            this.selectedUser = null;
            this.selectUserFilterIsActive = false;
            this.userId = null;
        }
        else {
            this.webAppUsageSearch.userId.push(value.toString());
            var employeesDropdown = this.employeesDropDown;
            var selectedEmployees = _.filter(employeesDropdown, function (employee) {
                return value.toString().includes(employee['teamMemberId']);
            })
            this.selectedUser = selectedEmployees.map(x => x['teamMemberName']).toString();
            this.selectUserFilterIsActive = true;
        }
        // this.webAppUsageSearch.userId = value;
        this.loadingIndicator = true;
        this.getActTrackerAppReportUsage();
    }

    changeBranch(value) {
        if (value === "0") {
            this.selectBranchFilterIsActive = false;
        }
        if (value == "") {
            this.selectBranchFilterIsActive = false;
            this.branchId = null;
            this.selectedBranch = null;
        }
        else {
            this.selectBranchFilterIsActive = true;
            var branch = this.branchesList;
            var selectedBranches = _.filter(branch, function (branch) {
                return value.toString().includes(branch.branchId);
            })
            this.selectedBranch = selectedBranches.map(x => x.branchName).toString();
        }
        this.employeeOfRoleModel.branchId = [];
        this.getAllEmployees();
        this.webAppUsageSearch.branchId = [];
        this.userId = null;
        this.selectedUser = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.loadingIndicator = true;
        this.getActTrackerAppReportUsage();
    }

    changeRole(value) {
        if (value === "0") {
            this.selectRoleFilterIsActive = false;
        }
        if (value == "") {
            this.selectRoleFilterIsActive = false;
            this.roleId = null;
            this.selectedRole = null;
        }
        else {
            this.selectRoleFilterIsActive = true;
            var roles = this.rolesDropDown;
            var selectedRoles = _.filter(roles, function (role) {
                return value.toString().includes(role.roleId)
            })
            this.selectedRole = selectedRoles.map(z => z.roleName).toString();
        }
        this.loadingIndicator = true;
        this.employeeOfRoleModel.roleId = [];
        this.getAllEmployees();
        this.webAppUsageSearch.roleId = [];
        this.userId = null;
        this.selectedUser = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.getActTrackerAppReportUsage();
    }

    toggleRolesPerOne() {
        if (this.allRolesSelected.selected) {
            this.allRolesSelected.deselect();
            this.isSelectAllRoles = false;
            this.employeeOfRoleModel.roleId = [];
            this.getAllEmployees();
            this.roleSelected();
            this.userId = null;
            this.selectedUser = null;
            this.selectUserFilterIsActive = false;
            this.webAppUsageSearch.userId = [];
            this.webAppUsageSearch.roleId = this.roleId;
            this.getActTrackerAppReportUsage();
            return false;
        }
        if (this.roleId.length === this.rolesDropDown.length) {
            this.allRolesSelected.select();
            this.isSelectAllRoles = true;
        }
        if (this.roleId.length < this.rolesDropDown.length) {
            this.allRolesSelected.deselect();
            this.isSelectAllRoles = false;
        }
        this.employeeOfRoleModel.roleId = this.roleId;
        this.getAllEmployees();
        this.roleSelected();
        this.webAppUsageSearch.roleId = this.roleId;
        this.userId = null;
        this.selectedUser = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.getActTrackerAppReportUsage();
    }

    toggleAllRolesSelected() {
        if (this.allRolesSelected.selected && this.isSelectAllRoles == false) {
            this.roleId = []
            var role = this.rolesDropDown.map((item) => item.roleId);
            role.push(0);
            this.roleId = role;
            this.isSelectAllRoles = true;
        } else {
            this.roleId = [];
            this.isSelectAllRoles = false;
        }
        this.roleSelected();
        this.employeeOfRoleModel.roleId = this.roleId;
        this.getAllEmployees();
        this.userId = null;
        this.selectedUser = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.webAppUsageSearch.roleId = this.roleId;
        this.getActTrackerAppReportUsage();
    }

    roleSelected() {
        const branchLst = this.rolesDropDown;
        const selected = this.roleId;
        // tslint:disable-next-line: only-arrow-functions
        const filteredList = _.filter(branchLst, function (member) {
            return selected.toString().includes(member.roleId);
        })
        const role = filteredList.map((x) => x.roleName);
        this.selectedRole = role.toString();
    }

    toggleBranchesPerOne() {
        if (this.allBranchesSelected.selected) {
            this.allBranchesSelected.deselect();
            this.isSelectAllBranches = false;
            this.employeeOfRoleModel.branchId = this.branchId;
            this.getAllEmployees();
            this.userId = null;
            this.selectedUser = null;
            this.selectUserFilterIsActive = false;
            this.webAppUsageSearch.userId = [];
            this.webAppUsageSearch.branchId = this.branchId;
            this.getActTrackerAppReportUsage();
            return false;
        }
        if (this.branchId.length === this.branchesList.length) {
            this.allBranchesSelected.select();
            this.isSelectAllBranches = true;
        }
        if (this.branchId.length < this.branchesList.length) {
            this.allBranchesSelected.deselect();
            this.isSelectAllBranches = false;
        }
        this.branchSelected();
        this.employeeOfRoleModel.branchId = this.branchId;
        this.getAllEmployees();
        this.userId = null;
        this.selectedUser = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.webAppUsageSearch.branchId = this.branchId;
        this.getActTrackerAppReportUsage();
    }

    toggleAllBranchesSelected() {
        if (this.allBranchesSelected.selected && this.isSelectAllBranches == false) {
            this.branchId = []
            var branch = this.branchesList.map((item) => item.branchId);
            branch.push(0);
            this.branchId = branch;
            this.isSelectAllBranches = true;
        } else {
            this.branchId = [];
            this.isSelectAllBranches = false;
        }
        this.branchSelected();
        this.employeeOfRoleModel.branchId = this.branchId;
        this.getAllEmployees();
        this.userId = null;
        this.selectedUser = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.webAppUsageSearch.branchId = this.branchId;
        this.getActTrackerAppReportUsage();
    }

    branchSelected() {
        const branchLst = this.branchesList;
        const selected = this.branchId;
        // tslint:disable-next-line: only-arrow-functions
        const filteredList = _.filter(branchLst, function (member) {
            return selected.toString().includes(member.branchId);
        })
        const branch = filteredList.map((x) => x.branchName);
        this.selectedBranch = branch.toString();
    }

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.target.value;
        this.minDate = this.fromDate;
        //this.days = this.toDate.getDate() - this.minDate.getDate();
        if (this.toDate < this.fromDate) {
            this.toDate = this.fromDate;
        }
        this.setDateFrom(this.minDate);
        this.setToDate(this.toDate);
        this.loadingIndicator = true;
        this.getActTrackerAppReportUsage();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value;
        //this.days = this.toDate.getDate() - this.minDate.getDate();
        this.setDateFrom(this.minDate);
        this.setDateTo(this.toDate);
        this.loadingIndicator = true;
        this.getActTrackerAppReportUsage();
    }

    setDateFrom(date) {
        // var day = date._i["date"];
        // const month = 0 + (date._i["month"]+ 1);
        // const year = date._i["year"];
        // var newDate = day + '/' + month + '/' + year;
        // this.fromDate = this.parse(newDate);
        // day += 1;
        // newDate = day + '/' + month + '/' + year;
        // this.dateFrom = this.parse(newDate);
        var day = date._i["date"];
        const month = 0 + (date._i["month"] + 1);
        const year = date._i["year"];
        var newDate = day + '/' + month + '/' + year;
        this.fromDate = this.parse(newDate);
        // day += 1;
        // newDate = day + '/' + month + '/' + year;
        // var offSet = date.getTimezoneOffset();
        // this.dateFrom = new Date(Date.UTC(year, (month - 1), day, (offSet / 60), (offSet % 60), 0));//this.parse(newDate);
        this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
    }

    setDateTo(date) {
        // var day = date._i["date"];
        // const month = 0 + (date._i["month"]+ 1);
        // const year = date._i["year"];
        // var newDate = day + '/' + month + '/' + year;
        // this.toDate = this.parse(newDate);
        // day += 1;
        // newDate = day + '/' + month + '/' + year;
        // this.dateTo = this.parse(newDate);
        var day = date._i["date"];
        const month = 0 + (date._i["month"] + 1);
        const year = date._i["year"];
        var newDate = day + '/' + month + '/' + year;
        this.toDate = this.parse(newDate);
        // day += 1;
        // newDate = day + '/' + month + '/' + year;
        // var offSet = date.getTimezoneOffset();
        // this.dateTo = new Date(Date.UTC(year, (month - 1), day, (offSet / 60), (offSet % 60), 0));//this.parse(newDate);
        this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
    }

    setFromDate(date) {
        // // var day = date.getDate();
        // // const month = 0 + (date.getMonth() + 1);
        // // const year = date.getFullYear();
        // // var newDate = day + '/' + month + '/' + year;
        // // this.fromDate = this.parse(newDate);
        // // day += 1;
        // // newDate = day + '/' + month + '/' + year;
        // // this.dateFrom = this.parse(newDate);
        // this.dateFrom = date;
        var day = date.getDate();
        const month = 0 + (date.getMonth() + 1);
        const year = date.getFullYear();
        var newDate = day + '/' + month + '/' + year;
        this.fromDate = this.parse(newDate);
        // day += 1;
        // newDate = day + '/' + month + '/' + year;
        // var offSet = date.getTimezoneOffset();
        // this.dateFrom = new Date(Date.UTC(year, (month - 1), day, (offSet / 60), (offSet % 60), 0));
        this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
    }

    setToDate(date) {
        // // var day = date.getDate();
        // // const month = 0 + (date.getMonth() + 1);
        // // const year = date.getFullYear();
        // // var newDate = day + '/' + month + '/' + year;
        // // this.toDate = this.parse(newDate);
        // // day += 1;
        // // newDate = day + '/' + month + '/' + year;
        // // this.dateTo = this.parse(newDate);
        // this.dateTo = date;
        var day = date.getDate();
        const month = 0 + (date.getMonth() + 1);
        const year = date.getFullYear();
        var newDate = day + '/' + month + '/' + year;
        this.toDate = this.parse(newDate);
        // day += 1;
        // newDate = day + '/' + month + '/' + year;
        // var offSet = date.getTimezoneOffset();
        // this.dateTo = new Date(Date.UTC(year, (month - 1), day, (offSet / 60), (offSet % 60), 0));//this.parse(newDate);
        // var dat = new Date(newDate);
        this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
    }

    closeSearch() {
        this.searchText = '';
        this.webAppUsageSearch.searchText = '';
        this.loadingIndicator = true;
        this.getActTrackerAppReportUsage();
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

    isProductive(applicationTypeName) {
        if (applicationTypeName == 'Productive') {
            return true;
        }
        return false;
    }

    isUnproductive(applicationTypeName) {
        if (applicationTypeName == 'UnProductive') {
            return true;
        }
        return false;
    }

    isNeutral(applicationTypeName) {
        if (applicationTypeName == 'Neutral' || applicationTypeName == null) {
            return true;
        }
        return false;
    }

    getLoggedInUser() {
        this.timeUsageService.getLoggedInUser().subscribe((responseData: any) => {
            this.loggedUser = responseData.data.id;
            this.userId = this.loggedUser;
            this.selectedUser = responseData.data.fullName;
            if (this.employeesDropDown != null && this.employeesDropDown != undefined) {
                var value = this.userId;
                var employeesDropdown = this.employeesDropDown;
                var selectedEmployees = _.filter(employeesDropdown, function (employee) {
                    return value.toString().includes(employee['teamMemberId']);
                })
                if (selectedEmployees.length > 0) {
                    this.changeUser(this.loggedUser);
                } else {
                    this.changeUser(this.employeesDropDown[0].teamMemberId);
                }
            } else {
                this.changeUser(this.loggedUser);
            }
            // this.changeUser(this.loggedUser);
        })
    }

    getAllBranches() {
        this.timeUsageService.getBranchesList().subscribe((responseData: any) => {
            this.branchesList = responseData.data;
        })
    }

    getAllRoles() {
        this.timeUsageService.getAllRoles().subscribe((responseData: any) => {
            this.rolesDropDown = responseData.data;
        })
    }

    getAllEmployees() {
        var teamMemberModel;
        // if (this.canAccess_feature_ViewActivityReportsForAllEmployee) {
        //     teamMemberModel = {
        //         isAllUsers: true
        //     }
        // }
        // else {
        //     teamMemberModel = {
        //         isAllUsers: false
        //     }
        // }
        teamMemberModel = {
            isForTracker: true
        }
        teamMemberModel.isArchived = false;
        this.timeUsageService.getTeamLeadsList(teamMemberModel).subscribe((responseData: any) => {
            this.employeesDropDown = responseData.data;
        })
    }

    getActTrackerAppReportUsage() {
        this.loading = true;
        this.loadingIndicator = true;
        this.totalCount = 0;
        this.chartLoad = false;
        this.webAppsReport = this.emptyModel;
        this.webAppUsageSearch.dateFrom = this.dateFrom;
        this.webAppUsageSearch.dateTo = this.dateTo;
        this.webAppUsageSearch.searchText = this.searchText;
        let webAppUsageSearchModel = new WebAppUsageSearchModel();
        webAppUsageSearchModel.dateFrom = this.webAppUsageSearch.dateFrom;
        webAppUsageSearchModel.dateTo = this.webAppUsageSearch.dateTo;
        webAppUsageSearchModel.userId = this.webAppUsageSearch.userId;
        webAppUsageSearchModel.roleId = this.webAppUsageSearch.roleId;
        webAppUsageSearchModel.branchId = this.webAppUsageSearch.branchId;
        webAppUsageSearchModel.searchText = this.webAppUsageSearch.searchText;
        this.timeUsageService.getActTrackerAppReportUsageForChart(webAppUsageSearchModel).subscribe((response: any) => {
            if (response.success) {
                this.appUsageReport = response.data;
                if (this.appUsageReport.length >= 5) {
                    var temp = this.appUsageReport;
                    this.webAppsReport = temp.splice(0, 5);
                    this.page.totalElements = this.webAppsReport.length;
                    this.totalCount = this.webAppsReport.length;
                    this.chart();
                    this.chartsDataObject(this.webAppsReport);
                } else if (this.appUsageReport.length > 0 && this.appUsageReport.length < 5) {
                    var temp = this.appUsageReport;
                    this.webAppsReport = temp.splice(0, this.appUsageReport.length);
                    this.page.totalElements = this.webAppsReport.length;
                    this.totalCount = this.webAppsReport.length;
                    this.chart();
                    this.chartsDataObject(this.webAppsReport);
                } else {
                    d3.select("#chart").select('svg').remove();
                    this.webAppsReport = [];
                    this.page.totalElements = 0;
                    this.totalCount = 0;
                }
            }
            this.loading = false;
        });
        this.loadingIndicator = false;
    }

    chart() {
        if (this.appUsageReport == null || this.webAppsReport.length == 0) {

            d3.select("#chart").select('svg').remove();
            this.webAppsReport = this.emptyModel;
        }

        else {

            d3.select("#chart").select('svg').remove();


            this.radius = Math.min(this.width, this.height) / 2 - this.margin

            this.svg = d3.selectAll("#chart")
                .append("svg")
                .attr("width", this.width)
                .attr("height", this.height)
                .append("g")
                .attr("transform", "translate(" + this.width / 2 + "," +
                    this.height / 2 + ")");

            var fillColor = ["#eb4e29", "#d01010", "#ab2feb", "#4e2feb", "#36d2ba"];
            var chartcolor = [];
            var data = {};
            for (var i = 0; i < this.webAppsReport.length; i++) {
                data[i] = this.webAppsReport[i].spentValue;
                this.webAppsReport[i].color = fillColor[i];
                chartcolor[i] = fillColor[i];
            }

            this.color = d3.scaleOrdinal()
                .domain(Object.keys(data))
                .range(chartcolor);

            this.pie = d3.pie()
                .value(function (d: any) { return d.value })

            this.data_ready = this.pie(d3.entries(data))
            var arcs = this.svg
                .selectAll('whatever')
                .data(this.data_ready)
                .enter()
                .append('path')
                .attr('d', d3.arc()
                    .innerRadius(50)
                    .outerRadius(this.radius))
                .attr('fill', (d) => { return (this.color(d.data.key)) })
                .attr("stroke", "white")
                .style("stroke-width", "1.75px")
                .style("opacity", 0.7)
                .on("mouseover", function (d) {
                    let dummyVar = d.value;
                    d3.select("#tooltip")
                        .style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY + "px")
                        .style("opacity", 1)
                        .select("#value")
                        .attr("text-anchor", "middle")
                        .text((d) => {
                            let totalTimeSeconds = Math.floor(dummyVar % 60);

                            let totalTimeMinutes = (dummyVar / 60);

                            let totalTimeHours = Math.floor(totalTimeMinutes / 60);

                            totalTimeMinutes = Math.floor(totalTimeMinutes % 60);

                            if (dummyVar == 0) {
                                return this.translateService.instant('NOTIME');
                            }

                            else if (totalTimeHours == 0) {
                                if (totalTimeMinutes == 0) {
                                    return totalTimeSeconds + 's';
                                }
                                else {
                                    return totalTimeMinutes + 'm ' + totalTimeSeconds + 's';
                                }
                            }

                            else if (totalTimeMinutes == 0) {
                                if (totalTimeHours > 0) {
                                    return totalTimeHours + 'h ' + totalTimeMinutes + 'm ' + totalTimeSeconds + 's';
                                }
                                else {
                                    return totalTimeSeconds + 's';
                                }
                            }

                            return totalTimeHours + 'h ' + totalTimeMinutes + 'm ' + totalTimeSeconds + 's';
                        });
                })
                .on("mouseout", function () {
                    d3.select("#tooltip")
                        .style("opacity", 0);
                });
            // arcs.append("path")
            //     .attr("fill", function (d, i) {
            //         return this.color;
            //     })
            //     .attr("d", arc);

            // // Labels
            // arcs.append("text")
            //     // .attr("transform", function (d) {
            //     //     return "translate(" + ${arc.centroid(d)} + ")";
            //     // })`
            //     .attr("transform", d => `translate(${arc.centroid(d)})`)
            //     .attr("text-anchor", "middle")
            //     .text(function (d) {
            //         return d.value;
            //     });

        }
    }


    chartsDataObject(data) {
        this.chartsData = [];
        data.forEach(element => {
            this.chartsData.push({ x: element.applicationName + ' ' + this.activityTimeFilter.transform(element.spentValue), y: element.spentValue });
        });

        this.legendSettings = {
            visible: true,
            toggleVisibility: false,
            position: 'Right',
            height: '28%',
            width: '44%'
        };
        this.donutTooltip = {
            enable: false
        };
        this.dataLabel = {
            visible: false, position: 'Inside',
            name: 'text',
            font: {
                color: 'white',
                fontWeight: 'Bold',
                size: '14px'
            }
        };
        this.chartLoad = true;
    }

    public getFontSize(width: number): string {
        if (width > 300) {
            return '13px';
        } else if (width > 250) {
            return '8px';
        } else {
            return '6px';
        }
    };

}