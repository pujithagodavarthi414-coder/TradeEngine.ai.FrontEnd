import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatOption } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'underscore';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { WebAppUsageSearchModel } from '../models/web-app-usage-search-model';
import { TimeUsageService } from '../services/time-usage.service';
import { AppUsageReportModel } from '../models/app-usage-report-model';
import { WebAppUsageModel } from '../models/web-app-usage-model';
import { EmployeeOfRoleModel } from '../models/employee-of-role-model';
import { EmployeeModel } from '../models/employee-model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';


import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChildren, ViewChild, ElementRef, Input, ChangeDetectorRef, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { ActivityTrackerService } from '../services/activitytracker-services';
import { FetchSizedAndCachedImagePipe } from '../../globaldependencies/pipes/fetchSizedAndCachedImage.pipe';
import { FileSizePipe } from '../../globaldependencies/pipes/filesize-pipe';
import { RolesModel } from '../models/role-model';
import { GetAppUrlsModel } from '../models/get-app-urls-model';
import { AddAppUrlModel } from '../models/add-app-url-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CookieService } from 'ngx-cookie-service';
import * as introJs from 'intro.js/intro.js';
import { CreateAppCategoryDialogComponent } from "./app-category/applicaton-category-dialog.component";
import { ApplicationCategoryModel } from '../models/application-category.model';

// export const MY_FORMATS = {
//     parse: {
//       dateInput: 'LL',
//     },
//     display: {
//       dateInput: 'LL',
//       monthYearLabel: 'MMM YYYY',
//       dateA11yLabel: 'LL',
//       monthYearA11yLabel: 'MMMM YYYY',
//     }
//   };

// tslint:disable-next-line: max-classes-per-file
@Component({
    selector: 'app-fm-component-app-usage-report',
    templateUrl: `app-usage-report.component.html`,
    // providers: [
    //     {
    //       provide: DateAdapter,
    //       useClass: MomentDateAdapter,
    //       deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    //     },
    //     {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
    // ]
})

export class AppUsageReportComponent extends CustomAppBaseComponent {
    @ViewChild("allBranchesSelected") private allBranchesSelected: MatOption;
    @ViewChild("allRolesSelected") private allRolesSelected: MatOption;

    @ViewChildren("addIsProductivePopup") upsertIsProductivePopover;
    @ViewChild("productiveFormDirective") productiveFormDirective: FormGroupDirective;
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("unproductiveSelected") private unproductiveSelected: MatOption;
    @ViewChild('fileDropzone') fileDropzone: any;

    @Input("webAppUsageSearch")
    set _webAppUsageSearch(data: any) {
        if (data) {
            this.webAppUsageSearch = data;
            this.dateFrom = this.webAppUsageSearch.dateFrom;
            this.dateTo = this.webAppUsageSearch.dateTo;
            this.searchText = this.webAppUsageSearch.searchText;
            this.getActTrackerAppReportUsageProductive();
            this.getActTrackerAppReportUsageUnProductive();
            this.getActTrackerAppReportUsage();
        }
    }

    @Input("roleData")
    set _roleData(data: any) {
      if(data) {
        this.Roles = data;
      }
    }

    @ViewChild("AppCatogoryDialogComponent", { static: true }) private appCategoryComponent: TemplateRef<any>;
    rowData: any[];
    Roles: RolesModel[];
    productiveRoles: any;
    unProductiveRoles: any;
    selectedFiles: File[] = [];
    validationMessage: string;
    appUrlLogoFormData = new FormData();
    addProductiveAppForm: FormGroup;
    type: boolean;
    productive: boolean = false;
    application: string;
    imageUrl: string;
    isRequired: boolean = true;
    isChecked: boolean = false;
    saveOrUpdate: string;
    appUrlNameId: string;
    selectedRoleIds: string[] = [];
    selectedRoleIdsUnproductive: string[] = [];
    isDropzone: boolean = true;
    isSelectAll: boolean = false;
    isSelectAllUnproductive: boolean = false;
    savingInProgress: boolean = false;
    screenImg: string;
    temp: any;
    productiveRequired: boolean = true;
    unproductiveRequired: boolean = true;


    employeesDropDown: any;
    webAppUsageSearch: WebAppUsageSearchModel = new WebAppUsageSearchModel();
    employeeOfRoleModel: EmployeeOfRoleModel = new EmployeeOfRoleModel();
    webAppUsage: WebAppUsageModel[];
    rolesDropDown: any[];
    branchesList: any[];
    appUsageReport: AppUsageReportModel[];
    appUsageProductiveReport: AppUsageReportModel[];
    appUsageUnProductiveReport: AppUsageReportModel[];
    isOpen: boolean = true;
    searchText: string = '';
    dateFrom: Date = new Date();
    dateTo: Date = new Date();
    fromDate: Date = new Date();
    toDate: Date = new Date();
    maxDate = new Date();
    minDate: Date;
    days: number;
    branchId: any;
    roleId: any;
    userId: any;
    selectBranchFilterIsActive: boolean = false;
    selectRoleFilterIsActive: boolean = false;
    selectUserFilterIsActive: boolean = false;
    monthFilterActive: boolean = false;
    searchIsActive: boolean = false;
    selectedUser: string;
    selectedBranch: string;
    selectedRole: string;
    loading: boolean = false;
    productiveLoading: boolean = false;
    unProductiveLoading: boolean = false;
    neutralLoading: boolean = false;
    productiveLenght: boolean = false;
    unproductiveLenght: boolean = false;
    neutralLenght: boolean = false;
    totalCountProductive: number = 0;
    totalCountUnProductive: number = 0;
    totalCount: number = 0;
    loggedUser: string;
    isSelectAllRoles: boolean = false;
    isSelectAllBranches: boolean = false;
    pageSizeOptionsProductive: number[] = [25, 50, 100, 150, 200];
    pageSizeProductive: number = 25;
    pageNumberProductive: number = 1;
    pageIndexProductive: number = 0;
    pageSizeOptionsUnProductive: number[] = [25, 50, 100, 150, 200];
    pageSizeUnProductive: number = 25;
    pageNumberUnProductive: number = 1;
    pageIndexUnProductive: number = 0;
    pageSizeOptions: number[] = [25, 50, 100, 150, 200];
    pageSize: number = 25;
    pageNumber: number = 1;
    pageIndex: number = 0;
    isTrailExpired: boolean = false;
    minDateOnTrailExpired: Date = null;
    introJS = new introJs();
    applicationCategories: ApplicationCategoryModel[] = [];

    constructor(private timeUsageService: TimeUsageService,
        private cdRef: ChangeDetectorRef, private translateService: TranslateService, private activitytracker: ActivityTrackerService, private toastr: ToastrService, private imagePipe: FetchSizedAndCachedImagePipe, private cookieService: CookieService,
        private filesize: FileSizePipe, private dialog: MatDialog) {

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
        this.formValidate();
        this.branchId = null;
        this.roleId = null;
        this.userId = null;
        this.searchText = '';
        this.setFromDate(this.fromDate);
        this.setToDate(this.fromDate);
        // this.getAllBranches();
        // this.getAllRoles();
        // this.getAllEmployees();
        // this.getLoggedInUser();
        this.minDate = new Date();
        this.cdRef.detectChanges();
        //this.getActTrackerAppReportUsageProductive();
        //this.getActTrackerAppReportUsageUnProductive();
        //this.getActTrackerAppReportUsage();
        this.getAllApplicationCategories();
    }

    getAllApplicationCategories() {
        var genericApplicationCategoryModel = new ApplicationCategoryModel();
        genericApplicationCategoryModel.isArchived = false;
        this.activitytracker.getAllApplicationCategories(genericApplicationCategoryModel).subscribe((response: any) => {
            if (response.success == true) {
                this.applicationCategories = response.data;
                this.cdRef.detectChanges();
            }
        });
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
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.pageIndexProductive = 0;
        this.pageNumberProductive = 1;
        this.pageIndexUnProductive = 0;
        this.pageNumberUnProductive = 1;
        this.getActTrackerAppReportUsageProductive();
        this.getActTrackerAppReportUsageUnProductive();
        this.getActTrackerAppReportUsage();
    }

    resetAllFilters() {
        this.setFromDate(new Date());
        this.setToDate(new Date());
        this.selectBranchFilterIsActive = false;
        this.selectedRole = null;
        this.selectedUser = null;
        this.selectedBranch = null;
        this.branchId = null;
        this.roleId = null;
        this.userId = null;
        this.searchText = '';
        this.webAppUsageSearch.userId = null;
        this.webAppUsageSearch.roleId = null;
        this.webAppUsageSearch.branchId = null;
        this.webAppUsageSearch.searchText = '';
        this.employeeOfRoleModel.branchId = null;
        this.employeeOfRoleModel.roleId = null;
        this.getAllEmployees();
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.pageIndexProductive = 0;
        this.pageNumberProductive = 1;
        this.pageIndexUnProductive = 0;
        this.pageNumberUnProductive = 1;
        this.getActTrackerAppReportUsageProductive();
        this.getActTrackerAppReportUsageUnProductive();
        this.getActTrackerAppReportUsage();
        // this.getLoggedInUser();
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
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.pageIndexProductive = 0;
        this.pageNumberProductive = 1;
        this.pageIndexUnProductive = 0;
        this.pageNumberUnProductive = 1;
        this.getActTrackerAppReportUsageProductive();
        this.getActTrackerAppReportUsageUnProductive();
        this.getActTrackerAppReportUsage();
    }

    changeBranch(value) {
        if (value === "0") {
            this.selectBranchFilterIsActive = false;
        }
        if (value == "") {
            this.selectBranchFilterIsActive = false;
            // this.employeeOfRoleModel.branchId = value.branchId;
            // this.webAppUsageSearch.branchId = value.branchId;
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
        this.selectedUser = null;
        this.userId = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.pageIndexProductive = 0;
        this.pageNumberProductive = 1;
        this.pageIndexUnProductive = 0;
        this.pageNumberUnProductive = 1;
        this.getActTrackerAppReportUsageProductive();
        this.getActTrackerAppReportUsageUnProductive();
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
        this.employeeOfRoleModel.roleId = [];
        this.getAllEmployees();
        this.webAppUsageSearch.roleId = [];
        this.selectedUser = null;
        this.selectUserFilterIsActive = false;
        this.webAppUsageSearch.userId = [];
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.pageIndexProductive = 0;
        this.pageNumberProductive = 1;
        this.pageIndexUnProductive = 0;
        this.pageNumberUnProductive = 1;
        this.getActTrackerAppReportUsageProductive();
        this.getActTrackerAppReportUsageUnProductive();
        this.getActTrackerAppReportUsage();
    }

    toggleRolesPerOne() {
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.pageIndexProductive = 0;
        this.pageNumberProductive = 1;
        this.pageIndexUnProductive = 0;
        this.pageNumberUnProductive = 1;
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
            this.getActTrackerAppReportUsageProductive();
            this.getActTrackerAppReportUsageUnProductive();
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
        this.getActTrackerAppReportUsageProductive();
        this.getActTrackerAppReportUsageUnProductive();
        this.getActTrackerAppReportUsage();
    }

    toggleAllRolesSelected() {
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.pageIndexProductive = 0;
        this.pageNumberProductive = 1;
        this.pageIndexUnProductive = 0;
        this.pageNumberUnProductive = 1;
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
        this.getActTrackerAppReportUsageProductive();
        this.getActTrackerAppReportUsageUnProductive();
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
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.pageIndexProductive = 0;
        this.pageNumberProductive = 1;
        this.pageIndexUnProductive = 0;
        this.pageNumberUnProductive = 1;
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
            this.getActTrackerAppReportUsageProductive();
            this.getActTrackerAppReportUsageUnProductive();
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
        this.getActTrackerAppReportUsageProductive();
        this.getActTrackerAppReportUsageUnProductive();
        this.getActTrackerAppReportUsage();
    }

    toggleAllBranchesSelected() {
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.pageIndexProductive = 0;
        this.pageNumberProductive = 1;
        this.pageIndexUnProductive = 0;
        this.pageNumberUnProductive = 1;
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
        this.getActTrackerAppReportUsageProductive();
        this.getActTrackerAppReportUsageUnProductive();
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

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.target.value;
        this.minDate = this.fromDate;
        //this.days = this.toDate.getDate() - this.minDate.getDate();
        if (this.toDate < this.fromDate) {
            this.toDate = this.fromDate;
        }
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.pageIndexProductive = 0;
        this.pageNumberProductive = 1;
        this.pageIndexUnProductive = 0;
        this.pageNumberUnProductive = 1;
        this.setDateFrom(this.minDate);
        this.setToDate(this.toDate);
        this.getActTrackerAppReportUsageProductive();
        this.getActTrackerAppReportUsageUnProductive();
        this.getActTrackerAppReportUsage();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value;
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.pageIndexProductive = 0;
        this.pageNumberProductive = 1;
        this.pageIndexUnProductive = 0;
        this.pageNumberUnProductive = 1;
        //this.days = this.toDate.getDate() - this.minDate.getDate();
        this.setDateFrom(this.minDate);
        this.setDateTo(this.toDate);
        this.getActTrackerAppReportUsageProductive();
        this.getActTrackerAppReportUsageUnProductive();
        this.getActTrackerAppReportUsage();
    }

    setDateFrom(date) {
        var day = date._i["date"];
        const month = 0 + (date._i["month"] + 1);
        const year = date._i["year"];
        var newDate = day + '/' + month + '/' + year;
        this.fromDate = this.parse(newDate);
        // day += 1;
        // newDate = day + '/' + month + '/' + year;
        // this.dateFrom = this.parse(newDate);
        this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
    }

    setDateTo(date) {
        var day = date._i["date"];
        const month = 0 + (date._i["month"] + 1);
        const year = date._i["year"];
        var newDate = day + '/' + month + '/' + year;
        this.toDate = this.parse(newDate);
        // day += 1;
        // newDate = day + '/' + month + '/' + year;
        // this.dateTo = this.parse(newDate);
        this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
    }

    setFromDate(date) {
        var day = date.getDate();
        const month = 0 + (date.getMonth() + 1);
        const year = date.getFullYear();
        var newDate = day + '/' + month + '/' + year;
        this.fromDate = this.parse(newDate);
        // day += 1;
        // newDate = day + '/' + month + '/' + year;
        // this.dateFrom = this.parse(newDate);
        this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
    }

    setToDate(date) {
        var day = date.getDate();
        const month = 0 + (date.getMonth() + 1);
        const year = date.getFullYear();
        var newDate = day + '/' + month + '/' + year;
        this.toDate = this.parse(newDate);
        // day += 1;
        // newDate = day + '/' + month + '/' + year;
        // this.dateTo = this.parse(newDate);
        this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
    }

    closeSearch() {
        this.searchText = '';
        this.webAppUsageSearch.searchText = '';
        this.getActTrackerAppReportUsage();
        this.getActTrackerAppReportUsageProductive();
        this.getActTrackerAppReportUsageUnProductive();
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

    isProductive(applicationTypeName, applicationName) {
        if (applicationTypeName == 'Productive' && applicationName != null) {
            this.productiveLenght = true;
            return true;
        }
        return false;
    }

    isUnproductive(applicationTypeName, applicationName) {
        if (applicationTypeName == 'UnProductive' && applicationName != null) {
            this.unproductiveLenght = true;
            return true;
        }
        return false;
    }

    isNeutral(applicationTypeName, applicationName) {
        if ((applicationTypeName == 'Neutral' || applicationTypeName == null) && applicationName != null) {
            this.neutralLenght = true;
            return true;
        }
        return false;
    }

    getAllBranches() {
        this.timeUsageService.getBranchesList().subscribe((responseData: any) => {
            this.branchesList = responseData.data;
        })
    }

    getAllRoles() {
        this.timeUsageService.getAllRoles().subscribe((responseData: any) => {
            this.rolesDropDown = responseData.data;
            this.Roles = responseData.data;
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
        this.neutralLoading = true;
        this.totalCount = 0;
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
        webAppUsageSearchModel.pageSize = this.pageSize;
        webAppUsageSearchModel.pageNumber = this.pageNumber;
        webAppUsageSearchModel.applicationType = "Neutral";
        webAppUsageSearchModel.isIdleNotRequired = true;
        this.timeUsageService.getActTrackerAppReportUsage(webAppUsageSearchModel).subscribe((response: any) => {
            if (response.success && response.data.length > 0) {
                this.appUsageReport = response.data;
                this.neutralLenght = true;
                this.totalCount = response.data[0].totalCount;
            } else {
                this.appUsageReport = [];
                this.neutralLenght = false;
                this.totalCount = 0;
            }
            this.neutralLoading = false;
            this.cdRef.detectChanges();
        });
    }

    getLoggedInUser() {
        this.timeUsageService.getLoggedInUser().subscribe((responseData: any) => {
            this.loggedUser = responseData.data.id;
            this.userId = this.loggedUser;
            this.selectedUser = responseData.data.fullName;
            if (this.employeesDropDown != null && this.employeesDropDown != undefined) {
                var employeesDropdown = this.employeesDropDown;
                var value = this.userId;
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
        })
    }

    getProductiveAppList(pageEvent) {
        if (pageEvent.pageSize != this.pageSize) {
            this.pageNumberProductive = 1;
        }
        else {
            this.pageNumberProductive = pageEvent.pageIndex + 1;
        }
        this.pageIndexProductive = this.pageNumberProductive - 1;
        this.pageSizeProductive = pageEvent.pageSize;
        this.getActTrackerAppReportUsageProductive();
    }

    getActTrackerAppReportUsageProductive() {
        this.productiveLoading = true;
        this.totalCountProductive = 0;
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
        webAppUsageSearchModel.pageSize = this.pageSizeProductive;
        webAppUsageSearchModel.pageNumber = this.pageNumberProductive;
        webAppUsageSearchModel.applicationType = "Productive";
        this.timeUsageService.getActTrackerAppReportUsage(webAppUsageSearchModel).subscribe((response: any) => {
            if (response.success && response.data.length > 0) {
                this.appUsageProductiveReport = response.data;
                this.productiveLenght = true;
                this.totalCountProductive = response.data[0].totalCount;
            } else {
                this.appUsageProductiveReport = [];
                this.productiveLenght = false;
                this.totalCountProductive = 0;
            }
            this.productiveLoading = false;
            this.cdRef.detectChanges();
        });
    }

    getUnProductiveAppList(pageEvent) {
        if (pageEvent.pageSize != this.pageSize) {
            this.pageNumberUnProductive = 1;
        }
        else {
            this.pageNumberUnProductive = pageEvent.pageIndex + 1;
        }
        this.pageIndexUnProductive = this.pageNumberUnProductive - 1;
        this.pageSizeUnProductive = pageEvent.pageSize;
        this.getActTrackerAppReportUsageUnProductive();
    }

    getActTrackerAppReportUsageUnProductive() {
        this.unProductiveLoading = true;
        this.totalCountUnProductive = 0;
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
        webAppUsageSearchModel.pageSize = this.pageSizeUnProductive;
        webAppUsageSearchModel.pageNumber = this.pageNumberUnProductive;
        webAppUsageSearchModel.applicationType = "UnProductive";
        this.timeUsageService.getActTrackerAppReportUsage(webAppUsageSearchModel).subscribe((response: any) => {
            if (response.success && response.data.length > 0) {
                this.appUsageUnProductiveReport = response.data;
                this.unproductiveLenght = true;
                this.totalCountUnProductive = response.data[0].totalCount;
            } else {
                this.appUsageUnProductiveReport = [];
                this.unproductiveLenght = false;
                this.totalCountUnProductive = 0;
            }
            this.unProductiveLoading = false;
            this.cdRef.detectChanges();
        });
    }

    getAppList(pageEvent) {
        if (pageEvent.pageSize != this.pageSize) {
            this.pageNumber = 1;
        }
        else {
            this.pageNumber = pageEvent.pageIndex + 1;
        }
        this.pageIndex = this.pageNumber - 1;
        this.pageSize = pageEvent.pageSize;
        this.getActTrackerAppReportUsage();
    }


    /* EDIT PRODUCTIVE APP POPUP */
    formValidate() {
        this.appUrlLogoFormData = new FormData();
        this.resetFiles();
        this.productive = false;
        this.isRequired = false;
        this.isChecked = false;
        this.addProductiveAppForm = new FormGroup({
            appUrlName: new FormControl('',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            applicationCategoryId: new FormControl('', null
            ),
            productiveRoleIds: new FormControl('',
                Validators.compose([
                    Validators.required
                ])
            ),
            unproductiveRoleIds: new FormControl('',
                Validators.compose([
                    Validators.required
                ])
            ),

        })
    }

    createAppCategory() {
        let dialogId = "application-category-dailog";
        const dialogRef = this.dialog.open(this.appCategoryComponent, {
            minWidth: "85vw",
            minHeight: "85vh",
            height: "70%",
            id: dialogId,
            data: { formPhysicalId: dialogId }
        });

        dialogRef.afterClosed().subscribe(() => {
            this.getAllApplicationCategories();
        });
    }


    onFilesAdded(files: File[]) {
        if (files.length >= 2) {
            this.resetFiles();
            this.toastr.error("more than 1 logo can't be uploaded");
        } else {
            this.selectedFiles = files;
        }
    }

    onSelect(event) {
        if (event.addedFiles.length > 0) {
            if (this.selectedFiles.length == 0) {
                this.selectedFiles.push(...event.addedFiles);
            } else {
                this.toastr.error("", this.translateService.instant('ACTIVITYAPPS.CANNOTUPLOADMORETHAN1LOGO'));
            }
        } else {
            if (event.rejectedFiles[0].size > 5514432) {
                this.toastr.error("", this.translateService.instant('ACTIVITYAPPS.APPICONSHOULDNOTEXCEED') + " " +
                    this.filesize.transform(5514432));
            }
        }
    }

    onRemove(event) {
        console.log(event);
        this.selectedFiles.splice(this.selectedFiles.indexOf(event), 1);
        this.selectedFiles = [];
    }

    closeProductiveForm(productiveFormDirective: FormGroupDirective) {
        productiveFormDirective.resetForm();
        this.resetFiles();

        this.isRequired = false;
        this.isChecked = false;
        setTimeout(() => this.productiveFormDirective.resetForm(), 0)
        this.addProductiveAppForm.clearValidators();
        this.upsertIsProductivePopover.forEach((p) => p.closePopover());
    }

    resetFiles() {
        this.selectedFiles = [];
        this.fileDropzone = null;
    }

    editAppUrl(row, appUrlsPopup) {
        if (this.canAccess_feature_ManageAppsAndUrls) {
            this.loading = true;
            if (row.applicationId) {
                this.saveOrUpdate = this.translateService.instant('ACTIVITYTRACKER.UPDATE');
                let getAppUrlsModel = new GetAppUrlsModel();
                getAppUrlsModel.AppUrlsId = row.applicationId;

                this.activitytracker.getActTrackerAppUrls(getAppUrlsModel).subscribe((response: any) => {
                    if (response.success) {
                        this.loading = false;
                        var rowDetails = response.data[0];
                        this.editAppUrls(rowDetails, appUrlsPopup);
                    }

                });
            } else {
                this.saveOrUpdate = this.translateService.instant('ASSETS.ADD');
                var applicationTitle = row.applicationName;
                if (row.applicationName.includes('>')) {
                    var titles = row.applicationName.split('>');
                    applicationTitle = titles[0].trim();
                } else if (row.applicationName.includes('|')) {
                    var titles = row.applicationName.split('|');
                    applicationTitle = titles[0].trim();
                }
                const newApp = {
                    appUrlNameId: null,
                    appUrlImage: null,
                    appUrlName: applicationTitle.substring(0, 49),
                    productiveRoleIds: null,
                    unproductiveRoleIds: null
                }
                this.editAppUrls(newApp, appUrlsPopup);
            }
        }
    }

    editAppUrls(rowDetails, appUrlsPopup) {
        this.loading = true;
        this.resetFiles();
        this.productiveRoles = this.Roles;
        this.unProductiveRoles = this.Roles;
        this.addProductiveAppForm.patchValue(rowDetails);

        this.isRequired = false;
        this.isChecked = true;
        this.appUrlNameId = rowDetails.appUrlNameId;
        this.isDropzone = true;
        this.imageUrl = rowDetails.appUrlImage;
        if (this.imageUrl != null) {
            this.isDropzone = false;
        }

        this.application = this.translateService.instant('ACTIVITYTRACKER.EDITAPPLIACTION');
        let productiveRoleIds = this.addProductiveAppForm.get("productiveRoleIds").value;
        let unProductiveRoleIds = this.addProductiveAppForm.get("unproductiveRoleIds").value;
        if (this.addProductiveAppForm.get("productiveRoleIds").value != null && this.Roles && productiveRoleIds.length === this.Roles.length) {
            this.allSelected.select();
            this.isSelectAll = true;
            this.unproductiveRequired = false;
            this.productiveRequired = true;
            this.unProductiveRoles = [];
            this.changeValidators(1, false);
            this.changeValidators(2, true);
        } else if (this.addProductiveAppForm.get("productiveRoleIds").value != null && productiveRoleIds.length > 0) {
            this.allSelected.deselect();
            this.isSelectAll = false;
            if (this.addProductiveAppForm.value.productiveRoleIds) {
                var sRoles = this.addProductiveAppForm.value.productiveRoleIds;
                if (sRoles.length > 0) {
                    this.unProductiveRoles = this.Roles ? this.Roles.filter(f => !sRoles.includes(f.roleId)) : [];
                } else {
                    this.unProductiveRoles = this.Roles;
                }
            }
            if ((this.addProductiveAppForm.get("productiveRoleIds").value != null && this.Roles && productiveRoleIds.length < this.Roles.length)
                || (this.addProductiveAppForm.get("productiveRoleIds").value == null &&
                    this.addProductiveAppForm.get("unproductiveRoleIds").value != null && this.Roles && unProductiveRoleIds.length < this.Roles.length)) {
                this.unproductiveRequired = true;
            }
            this.changeValidators(1, false);
            this.changeValidators(2, false);
        }

        if (this.addProductiveAppForm.get("unproductiveRoleIds").value != null && this.Roles && unProductiveRoleIds.length === this.Roles.length) {
            this.unproductiveSelected.select();
            this.isSelectAllUnproductive = true;
            this.unproductiveRequired = true;
            this.productiveRequired = false;
            this.productiveRoles = [];
            this.changeValidators(1, true);
            this.changeValidators(2, false);
        } else if (this.addProductiveAppForm.get("unproductiveRoleIds").value != null && unProductiveRoleIds.length > 0) {
            this.unproductiveSelected.deselect();
            this.isSelectAllUnproductive = false;
            if (this.addProductiveAppForm.value.unproductiveRoleIds != null) {
                var sRoles = this.addProductiveAppForm.value.unproductiveRoleIds;
                if (sRoles.length > 0) {
                    this.productiveRoles = this.Roles ? this.Roles.filter(f => !sRoles.includes(f.roleId)) : [];
                } else {
                    this.productiveRoles = this.Roles;
                }
            }
            if ((this.addProductiveAppForm.get("unproductiveRoleIds").value != null && this.Roles && unProductiveRoleIds.length < this.Roles.length)
                || (this.addProductiveAppForm.get("unproductiveRoleIds").value == null &&
                    this.addProductiveAppForm.get("productiveRoleIds").value != null && this.Roles && productiveRoleIds.length < this.Roles.length)) {
                this.productiveRequired = true;
            }
            this.changeValidators(1, false);
            this.changeValidators(2, false);
        }
        this.loading = false;
        appUrlsPopup.openPopover();
        this.cdRef.detectChanges();
    }

    enableDropZone() {
        this.isDropzone = true;
        this.imageUrl = null;
    }

    addProductiveApp(formDirective: FormGroupDirective) {
        if (this.addProductiveAppForm.valid) {
            this.upsertFileForAppUrl(formDirective);
        }
        else {
            if (this.isChecked == false) {
                this.isRequired = true;
            }
        }
    }

    toggleRoleProductive() {
        this.unproductiveSelected.deselect();
        this.isSelectAllUnproductive = false;
        if (this.addProductiveAppForm.value.unproductiveRoleIds != null && this.addProductiveAppForm.value.unproductiveRoleIds.length > 0) {
            var index = this.addProductiveAppForm.value.unproductiveRoleIds.indexOf(0);
            if (index > -1) {
                var roles = this.addProductiveAppForm.value.unproductiveRoleIds;
                roles.splice(index, 1);
                this.addProductiveAppForm.get("unproductiveRoleIds").patchValue([]);
                this.addProductiveAppForm.get("unproductiveRoleIds").patchValue(roles);
            }
        }

        if (this.allSelected.selected) {
            this.allSelected.deselect();
            this.isSelectAll = false;
            var index = this.addProductiveAppForm.value.productiveRoleIds.indexOf(0);
            if (index > -1) {
                var roles = this.addProductiveAppForm.value.productiveRoleIds;
                roles.splice(index, 1);
                this.addProductiveAppForm.get("productiveRoleIds").patchValue([]);
                this.addProductiveAppForm.get("productiveRoleIds").patchValue(roles);
            }

            var sRoles = this.addProductiveAppForm.value.productiveRoleIds;
            if (sRoles.length > 0) {
                this.unProductiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
            } else {
                this.unProductiveRoles = this.Roles;
            }
            this.changeValidators(1, false);
            this.changeValidators(2, false);
            this.cdRef.detectChanges();
            return false;
        }
        if (
            this.addProductiveAppForm.get("productiveRoleIds").value.length === this.productiveRoles.length
        ) {
            this.allSelected.select();
            this.isSelectAll = true;
            if (this.productiveRoles.length == this.Roles.length) {
                this.unProductiveRoles = [];
                this.changeValidators(1, false);
                this.changeValidators(2, true);
            } else {
                var sRoles = this.addProductiveAppForm.value.productiveRoleIds;
                if (sRoles.length > 0) {
                    this.unProductiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
                } else {
                    this.unProductiveRoles = this.Roles;
                }
                this.changeValidators(1, false);
                this.changeValidators(2, false);
            }
            this.cdRef.detectChanges();
        } else if (this.addProductiveAppForm.get("productiveRoleIds").value.length < this.productiveRoles.length &&
            this.addProductiveAppForm.get("productiveRoleIds").value.length < this.Roles.length) {
            this.isSelectAll = false;
            var sRoles = this.addProductiveAppForm.value.productiveRoleIds;
            if (sRoles.length > 0) {
                this.unProductiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
            } else {
                this.unProductiveRoles = this.Roles;
            }
            this.cdRef.detectChanges();
        }
    }

    toggleAllRolesProductive() {
        if (this.allSelected.selected && this.isSelectAll == false) {
            this.addProductiveAppForm.get("productiveRoleIds").patchValue([
                ...this.productiveRoles.map((item) => item.roleId),
                0
            ]);
            this.selectedRoleIds = this.productiveRoles.map((item) => item.roleId);
            this.isSelectAll = true;
            var sRoles = this.addProductiveAppForm.value.productiveRoleIds;
            if (this.productiveRoles.length == this.Roles.length) {
                this.unProductiveRoles = [];
                this.changeValidators(1, false);
                this.changeValidators(2, true);
            } else {
                if (sRoles.length > 0) {
                    this.unProductiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
                } else {
                    this.unProductiveRoles = this.Roles;
                }
                this.changeValidators(1, false);
                this.changeValidators(2, false);
            }
            this.cdRef.detectChanges();
        } else {
            this.addProductiveAppForm.get("productiveRoleIds").patchValue([]);
            this.isSelectAll = false;
            this.unProductiveRoles = this.Roles;
            this.changeValidators(1, false);
            this.changeValidators(2, false);
            this.cdRef.detectChanges();
        }
    }

    changeValidators(n, set) {
        if (set) {
            if (n == 1) {
                // this.addProductiveAppForm.controls['productiveRoleIds'].clearValidators();
                this.addProductiveAppForm.controls["productiveRoleIds"].clearValidators();
                this.addProductiveAppForm.get("productiveRoleIds").updateValueAndValidity();
                this.productiveRequired = false;
            } else {
                // this.addProductiveAppForm.controls['unproductiveRoleIds'].clearValidators();
                this.addProductiveAppForm.controls["unproductiveRoleIds"].clearValidators();
                this.addProductiveAppForm.get("unproductiveRoleIds").updateValueAndValidity();
                this.unproductiveRequired = false;
            }
        } else {
            if (n == 1) {
                this.addProductiveAppForm.controls['productiveRoleIds'].setValidators([Validators.required]);
                this.productiveRequired = true;
            } else {
                this.addProductiveAppForm.controls['unproductiveRoleIds'].setValidators([Validators.required]);
                this.unproductiveRequired = true;
            }
        }
        this.addProductiveAppForm.updateValueAndValidity();
        this.cdRef.detectChanges();
    }

    toggleRoleUnproductive() {
        this.allSelected.deselect();
        this.isSelectAll = false;
        if (this.addProductiveAppForm.value.productiveRoleIds != null && this.addProductiveAppForm.value.productiveRoleIds.length > 0) {
            var index = this.addProductiveAppForm.value.productiveRoleIds.indexOf(0);
            if (index > -1) {
                var roles = this.addProductiveAppForm.value.productiveRoleIds;
                roles.splice(index, 1);
                this.addProductiveAppForm.get("productiveRoleIds").patchValue([]);
                this.addProductiveAppForm.get("productiveRoleIds").patchValue(roles);
            }
        }

        if (this.unproductiveSelected.selected) {
            this.unproductiveSelected.deselect();
            this.isSelectAllUnproductive = false;
            var index = this.addProductiveAppForm.value.unproductiveRoleIds.indexOf(0);
            if (index > -1) {
                var roles = this.addProductiveAppForm.value.unproductiveRoleIds;
                roles.splice(index, 1);
                this.addProductiveAppForm.get("unproductiveRoleIds").patchValue([]);
                this.addProductiveAppForm.get("unproductiveRoleIds").patchValue(roles);
            }

            var sRoles = this.addProductiveAppForm.value.unproductiveRoleIds;
            if (sRoles.length > 0) {
                this.productiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
            } else {
                this.productiveRoles = this.Roles;
            }
            this.changeValidators(1, false);
            this.changeValidators(2, false);
            this.cdRef.detectChanges();
            return false;
        }
        if (
            this.addProductiveAppForm.get("unproductiveRoleIds").value.length === this.unProductiveRoles.length
        ) {
            this.unproductiveSelected.select();
            this.isSelectAllUnproductive = true;
            var sRoles = this.addProductiveAppForm.value.unproductiveRoleIds;
            if (sRoles.length == this.Roles.length) {
                this.productiveRoles = [];
                this.changeValidators(1, true);
                this.changeValidators(2, false);
            } else {
                if (sRoles.length > 0) {
                    this.productiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
                } else {
                    this.productiveRoles = this.Roles;
                }
                this.changeValidators(1, false);
                this.changeValidators(2, false);
            }
            this.cdRef.detectChanges();
        } else if (this.addProductiveAppForm.get("unproductiveRoleIds").value.length < this.unProductiveRoles.length &&
            this.addProductiveAppForm.get("unproductiveRoleIds").value.length < this.Roles.length) {
            this.isSelectAllUnproductive = false;
            var sRoles = this.addProductiveAppForm.value.unproductiveRoleIds;
            if (sRoles.length > 0) {
                this.productiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
            } else {
                this.productiveRoles = this.Roles;
            }
            this.changeValidators(1, false);
            this.changeValidators(2, false);
            this.cdRef.detectChanges();
        }
    }

    toggleAllRolesUnproductive() {
        if (this.unproductiveSelected.selected && this.isSelectAllUnproductive == false) {
            this.addProductiveAppForm.get("unproductiveRoleIds").patchValue([
                ...this.unProductiveRoles.map((item) => item.roleId),
                0
            ]);
            this.selectedRoleIdsUnproductive = this.unProductiveRoles.map((item) => item.roleId);
            this.isSelectAllUnproductive = true;
            if (this.unProductiveRoles.length == this.Roles.length) {
                this.productiveRoles = [];
                this.changeValidators(1, true);
                this.changeValidators(2, false);
            } else {
                var sRoles = this.addProductiveAppForm.value.unproductiveRoleIds;
                if (sRoles.length > 0) {
                    this.productiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
                } else {
                    this.productiveRoles = this.Roles;
                }
                this.changeValidators(1, false);
                this.changeValidators(2, false);
            }
        } else {
            this.addProductiveAppForm.get("unproductiveRoleIds").patchValue([]);
            this.isSelectAllUnproductive = false;
            this.productiveRoles = this.Roles;
            this.changeValidators(1, true);
            this.changeValidators(2, false);
        }
        this.cdRef.detectChanges();
    }

    upsertFileForAppUrl(formDirective: FormGroupDirective) {
        this.savingInProgress = true;
        var moduleTypeId = 5;
        if (this.selectedFiles.length == 0) {
            this.selectedFiles = [];
            this.upsertAppUrl(formDirective);
        }
        else {
            Array.from(this.selectedFiles).forEach(f => {
                let fileKeyName = "file";
                this.appUrlLogoFormData.append(fileKeyName, f)
            });
            this.activitytracker.UploadFile(this.appUrlLogoFormData, moduleTypeId).subscribe((response: any) => {
                if (response.success) {
                    var localimage = response.data[0].filePath;
                    this.imageUrl = localimage;
                    this.upsertAppUrl(formDirective);
                }
            });
        }
    }

    upsertAppUrl(formDirective: FormGroupDirective) {
        this.loading = true;
        let appProductive = new AddAppUrlModel();
        appProductive.AppUrlImage = this.imageUrl;
        appProductive.AppUrlName = this.addProductiveAppForm.value.appUrlName;
        appProductive.IsApp = this.type;
        appProductive.AppUrlNameId = this.appUrlNameId;
        appProductive.applicationCategoryId = this.addProductiveAppForm.value.applicationCategoryId;
        appProductive.ProductiveRoleIds = this.addProductiveAppForm.value.productiveRoleIds;
        appProductive.UnproductiveRoleIds = this.addProductiveAppForm.value.unproductiveRoleIds;
        this.activitytracker.upsertActTrackerAppUrls(appProductive).subscribe((response: any) => {
            if (response.success) {
                this.savingInProgress = false;
                formDirective.resetForm();
                this.resetFiles();
                this.formValidate();
                this.upsertIsProductivePopover.forEach((p) => p.closePopover());
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.savingInProgress = false;
                this.toastr.error(response.apiResponseMessages[0].message);
            }
            this.imageUrl = null;
            this.loading = false;
        });
    }
    /* EDIT PRODUCTIVE APP POPUP */


}