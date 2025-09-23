import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { MatOption } from "@angular/material/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { Router, NavigationExtras } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import * as d3 from "d3";
import { CookieService } from "ngx-cookie-service";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { AppUsageReportModel } from "../models/app-usage-report-model";
import { EmployeeOfRoleModel } from "../models/employee-of-role-model";
import { Page } from "../models/Page";
import { WebAppUsageModel } from "../models/web-app-usage-model";
import { WebAppUsageSearchModel } from "../models/web-app-usage-search-model";
import { TimeUsageService } from "../services/time-usage.service";
import * as introJs from 'intro.js/intro.js';
import * as _ from "underscore";

@Component({
    selector: 'app-summary-mainpage',
    templateUrl: `summary-mainpage.component.html`,

})
export class SummaryMainPageComponent extends CustomAppBaseComponent {
    @ViewChild("allBranchesSelected") private allBranchesSelected: MatOption;
    @ViewChild("allRolesSelected") private allRolesSelected: MatOption;
    @Output() showTeamDashboard = new EventEmitter<any>();

    @Input("startIntrojs")
    set _startIntrojs(data: boolean) {
        if (data) {
            this.isStartEnable = data;
            this.introStart();
        }
        else {
            this.isStartEnable = false;
        }
    }

    @Input("employeeData")
    set _employeeData(data: any) {
      if (data) {
        this.employeesDropDown = data;
      }
    }
  
    @Input("branchData")
    set _branchData(data: any) {
      if(data) {
        this.branchesList = data;
      }
    }
  
    @Input("roleData")
    set _roleData(data: any) {
      if(data) {
        this.rolesDropDown = data;
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
    selectedUser: string;
    selectedBranch: string;
    selectedRole: string;
    totalCount: number = 0;
    loggedUser: string;
    isSelectAllRoles: boolean = false;
    isSelectAllBranches: boolean = false;
    minDateOnTrailExpired: Date = null;
    isTrailExpired: boolean = false;

    introJS = new introJs();
    isStartEnable: boolean = false;
    // isInitialLoad: boolean = false;

    //public data = { a: 9, b: 20, c: 30, d: 8, e: 12 };

    constructor(private timeUsageService: TimeUsageService, private translateService: TranslateService, private cookieService: CookieService, private router: Router, private cdRef: ChangeDetectorRef) {
        super();
        this.branchId = null;
        this.roleId = null;
        this.loggedUser = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.userId = null;
        // this.userId = this.loggedUser;
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
        this.loggedUser = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        // this.isInitialLoad = true;
        this.page.size = 5;
        this.page.pageNumber = 0;
        this.branchId = [];
        this.roleId = [];
        this.userId = null;
        // this.userId = this.loggedUser;
        // this.webAppUsageSearch.userId = [this.userId];
        this.searchText = '';
        this.setFromDate(this.fromDate);
        this.setToDate(this.fromDate);
        this.getAllBranches();
        this.getAllRoles();
        this.getAllEmployees();
        this.applyFilters();
    }

    ngAfterViewInit() {
        if (this.canAccess_feature_ViewActivityDashboard && this.canAccess_feature_ViewApplicationUsageReports) {
            this.introJS.setOptions({
                steps: [
                    {
                        element: '#step1-2',
                        intro: "It will filter the data.",
                        position: 'bottom'
                    },
                    {
                        element: '#step1-1',
                        intro: "It will displays top five websites, application or anything which is tracked.",
                        position: 'bottom'
                    },


                    // {
                    //     element: '#step2-1',
                    //     intro: "It will displays productivity details.",
                    //     position: 'bottom'
                    // },
                    // {
                    //     element: '#step2-2',
                    //     intro: "It will filter the data.",
                    //     position: 'bottom'
                    // },

                    {
                        element: '#step2-3',
                        intro: "It will displays Productivity apps details.",
                        position: 'bottom'
                    },
                    {
                        element: '#step2-4',
                        intro: "It will displays Unproductivity apps details.",
                        position: 'bottom'
                    },
                    {
                        element: '#step2-5',
                        intro: "It will displays Neutral apps details.",
                        position: 'bottom'
                    },

                ]
            });
        }

        else if (this.canAccess_feature_ViewActivityDashboard) {
            this.introJS.setOptions({
                steps: [
                    {
                        element: '#step1-2',
                        intro: "It will filter the data.",
                        position: 'bottom'
                    },
                    {
                        element: '#step1-1',
                        intro: "It will displays top five websites, application or anything which is tracked.",
                        position: 'bottom'
                    }
                ]
            });
        }

        else if (this.canAccess_feature_ViewApplicationUsageReports) {
            this.introJS.setOptions({
                steps: [
                    {
                        element: '#step1-2',
                        intro: "It will filter the data.",
                        position: 'bottom'
                    },
                    // {
                    //     element: '#step2-1',
                    //     intro: "It will displays productivity details.",
                    //     position: 'bottom'
                    // },

                    {
                        element: '#step2-3',
                        intro: "It will displays Productivity apps details.",
                        position: 'bottom'
                    },
                    {
                        element: '#step2-4',
                        intro: "It will displays Unproductivity apps details.",
                        position: 'bottom'
                    },
                    {
                        element: '#step2-5',
                        intro: "It will displays Neutral apps details.",
                        position: 'bottom'
                    },

                ]
            });
        }

        // this.introJS.start();
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
        this.applyFilters();
    }

    resetAllFilters() {
        this.setFromDate(new Date());
        this.setToDate(new Date());
        this.branchId = null;
        this.roleId = null;
        this.userId = null;
        // this.userId = this.loggedUser;
        // var index = this.employeesDropDown.findIndex((p) => p.teamMemberId.toLowerCase() == this.userId.toLowerCase());
        // if (index > -1) {
        //     this.selectedUser = this.employeesDropDown[index].teamMemberName;
        // }
        this.searchText = '';
        this.selectedBranch = null;
        this.selectedRole = null;
        this.selectedUser = null;
        this.webAppUsageSearch.userId = null;
        // this.webAppUsageSearch.userId = [];
        // this.webAppUsageSearch.userId.push(this.userId);
        this.webAppUsageSearch.roleId = null;
        this.webAppUsageSearch.branchId = null;
        this.webAppUsageSearch.searchText = '';
        this.employeeOfRoleModel.branchId = null;
        this.employeeOfRoleModel.roleId = null;
        ////this.getAllEmployees();
        this.loadingIndicator = true;
        this.applyFilters();
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
        this.loadingIndicator = true;
        this.applyFilters();
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
        ////this.getAllEmployees();
        this.webAppUsageSearch.branchId = [];
        this.userId = null;
        this.selectedUser = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.loadingIndicator = true;
        this.applyFilters();
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
        //this.getAllEmployees();
        this.webAppUsageSearch.roleId = [];
        this.userId = null;
        this.selectedUser = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.applyFilters();
    }

    toggleRolesPerOne() {
        if (this.allRolesSelected.selected) {
            this.allRolesSelected.deselect();
            this.isSelectAllRoles = false;
            this.employeeOfRoleModel.roleId = [];
            //this.getAllEmployees();
            this.roleSelected();
            this.userId = null;
            this.selectedUser = null;
            this.selectUserFilterIsActive = false;
            this.webAppUsageSearch.userId = [];
            this.webAppUsageSearch.roleId = this.roleId;
            this.applyFilters();
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
        //this.getAllEmployees();
        this.roleSelected();
        this.webAppUsageSearch.roleId = this.roleId;
        this.userId = null;
        this.selectedUser = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.applyFilters();
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
        //this.getAllEmployees();
        this.userId = null;
        this.selectedUser = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.webAppUsageSearch.roleId = this.roleId;
        this.applyFilters();
    }

    roleSelected() {
        const branchLst = this.rolesDropDown;
        const selected = this.roleId;
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
            //this.getAllEmployees();
            this.userId = null;
            this.selectedUser = null;
            this.selectUserFilterIsActive = false;
            this.webAppUsageSearch.userId = [];
            this.webAppUsageSearch.branchId = this.branchId;
            this.applyFilters();
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
        //this.getAllEmployees();
        this.userId = null;
        this.selectedUser = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.webAppUsageSearch.branchId = this.branchId;
        this.applyFilters();
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
        //this.getAllEmployees();
        this.userId = null;
        this.selectedUser = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.webAppUsageSearch.branchId = this.branchId;
        this.applyFilters();
    }

    branchSelected() {
        const branchLst = this.branchesList;
        const selected = this.branchId;
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
        this.applyFilters();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value;
        //this.days = this.toDate.getDate() - this.minDate.getDate();
        this.setDateFrom(this.minDate);
        this.setDateTo(this.toDate);
        this.loadingIndicator = true;
        this.applyFilters();
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
        this.applyFilters();
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

    getAllBranches() {
        // this.timeUsageService.getBranchesList().subscribe((responseData: any) => {
        //     this.branchesList = responseData.data;
        // })
    }

    getAllRoles() {
        // this.timeUsageService.getAllRoles().subscribe((responseData: any) => {
        //     this.rolesDropDown = responseData.data;
        // })
    }

    getAllEmployees() {
        // var teamMemberModel;
        // teamMemberModel = {
        //     isForTracker: true
        // }
        // teamMemberModel.isArchived = false;
        // this.timeUsageService.getTeamLeadsList(teamMemberModel).subscribe((responseData: any) => {
        //     this.employeesDropDown = responseData.data;
        //     if (this.employeesDropDown && this.employeesDropDown.length > 1) {
        //         this.showTeamDashboard.emit(true);
        //     }
        //     else {
        //         this.showTeamDashboard.emit(false);
        //     }
        // })
    }

    applyFilters() {
        this.webAppUsageSearch.dateFrom = this.dateFrom;
        this.webAppUsageSearch.dateTo = this.dateTo;
        this.webAppUsageSearch.searchText = this.searchText;
        var webAppUsageSearch = new WebAppUsageSearchModel();
        webAppUsageSearch.applicationType = this.webAppUsageSearch.applicationType;
        webAppUsageSearch.branchId = this.webAppUsageSearch.branchId;
        webAppUsageSearch.dateFrom = this.webAppUsageSearch.dateFrom;
        webAppUsageSearch.dateTo = this.webAppUsageSearch.dateTo;
        webAppUsageSearch.roleId = this.webAppUsageSearch.roleId;
        webAppUsageSearch.searchText = this.webAppUsageSearch.searchText;
        webAppUsageSearch.userId = this.webAppUsageSearch.userId;
        this.inputModel = webAppUsageSearch;
        this.cdRef.detectChanges();
    }

    introStart() {
        this.isStartEnable = false;
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
            // preserveQueryParams: true
        }

        this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
            if (this.canAccess_feature_ViewEmployeeActivityTimeUsage) {
                this.router.navigate(["activitytracker/activitydashboard/productivity"], navigationExtras);
            }
            else if (this.canAccess_feature_ViewEmployeeAppTrackerCompleteReport) {
                this.router.navigate(["activitytracker/activitydashboard/timeline"], navigationExtras);
            }
            else if (this.canAccess_feature_ViewActivityScreenshots) {
                this.router.navigate(["activitytracker/activitydashboard/screenshots"], navigationExtras);
            }
            else if (this.canAccess_feature_ViewEmployeeWebAppUsage) {
                this.router.navigate(["activitytracker/activitydashboard/detailedusage"], navigationExtras);
            }
            else if (this.canAccess_feature_ManageActivityConfig) {
                this.router.navigate(["activitytracker/activitydashboard/configuration"], navigationExtras);
            }
            else if (this.canAccess_feature_ManageActivityConfig) {
                this.router.navigate(["activitytracker/activitydashboard/configurationHistory"], navigationExtras);
            }
        });
    }
}