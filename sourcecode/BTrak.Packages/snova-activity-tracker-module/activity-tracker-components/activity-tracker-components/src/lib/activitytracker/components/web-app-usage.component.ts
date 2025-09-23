import { Component, ViewEncapsulation, ViewChild, Input } from "@angular/core";
import { Location, formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOption, DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';


import { EmployeeModel } from "../models/employee-model";
import { WebAppUsageSearchModel } from "../models/web-app-usage-search-model";
import { WebAppUsageModel } from "../models/web-app-usage-model";
import { EmployeeOfRoleModel } from "../models/employee-of-role-model";

import { TranslateService } from "@ngx-translate/core";
import { TimeUsageService } from "../services/time-usage.service";

import { Observable } from "rxjs";
import * as _ from 'underscore';
import * as _moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ActivityTimeFilterPipe } from '../../globaldependencies/pipes/activityTimeConversion.pipe';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import * as introJs from 'intro.js/intro.js';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DetailedViewComponent } from "./detailed-view.component";
import { StringHelper } from "@snovasys/snova-timeline-viewer";

// const moment = _rollupMoment || _moment;

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'LL',
//   },
//   display: {
//     dateInput: 'LL',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   }
// };


// tslint:disable-next-line: max-classes-per-file
@Component({
  selector: "app-view-activitytracker-component-web-app-usage",
  templateUrl: "web-app-usage.component.html",
  encapsulation: ViewEncapsulation.None,
  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },
  //   {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  // ]
})

export class WebAppUsageComponent extends CustomAppBaseComponent {
  @ViewChild("allBranchesSelected") private allBranchesSelected: MatOption;
  @ViewChild("allRolesSelected") private allRolesSelected: MatOption;
  @ViewChild("allUsersSelected") private allUsersSelected: MatOption;

  @Input("employeeData")
  set _employeeData(data: any) {
    if (data) {
      this.employeesDropDown = data;
      this.originalEmployees = data;
      if (this.employeesDropDown && this.employeesDropDown.length > 1) {
        this.userLength = true;
      } else {
        this.userLength = false;
      }
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

  employeesDropDown: any;
  originalEmployees: any;
  webAppUsageSearch: WebAppUsageSearchModel = new WebAppUsageSearchModel();
  employeeOfRoleModel: EmployeeOfRoleModel = new EmployeeOfRoleModel();
  webAppUsage: WebAppUsageModel[];
  rolesDropDown: any[];
  branchesList: any[];
  rows = [];
  date: Date = new Date();
  weekDate: Date = new Date();
  monthDate: Date = new Date();
  selectedDate: string = this.date.toISOString();
  selectedWeek: string = this.date.toISOString();
  selectedMonth: string = this.date.toISOString();
  dateFrom: Date = new Date();
  dateTo: Date = new Date();
  fromDate: Date = new Date();
  toDate: Date = new Date();
  todayDate: Date = new Date();
  rangeFrom: boolean;
  maxDate = new Date();
  minDate = new Date();
  weekNumber: number;
  days: number;
  totalTime: number;
  time: number = 28800;
  pageSize: number = 15;
  pageNumber: number = 0;
  totalCount: number = 0;
  direction: any;
  searchText: string = '';
  sortBy: string = null;
  type: string = ConstantVariables.Month;
  primaryDay: string = "primary";
  primaryWeek: string;
  primaryMonth: string;
  primaryDateRange: string;
  primaryAllColor: string = "primary";
  primaryWebsitesColor: string;
  primaryApplicationsColor: string;
  loggedUser: string;
  validationMessage: string;
  selectedBranch: string;
  selectedRole: string;
  selectedUser: string;
  day: boolean = true;
  week: boolean;
  month: boolean;
  dateRange: boolean;
  loadingIndicator: boolean;
  scrollbarH: boolean = false;
  sortDirectionAsc: boolean = false;
  isSelectAllBranches: boolean = false;
  isSelectAllRoles: boolean = false;
  isSelectAllUsers: boolean = false;
  dispalyForward: boolean = false;
  selectFilter: FormGroup;

  softLabels: SoftLabelConfigurationModel[];
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  branchId: string;
  roleId: string;
  userId: string;
  loading: boolean = false;
  userLength: boolean = false;
  minDateOnTrailExpired: Date = null;
  isTrailExpired: boolean = false;
  isDay: any = 0;
  dayCount: any = 7;
  isNextDisable: boolean = true;
  isPreviousDisable: boolean = false;
  introJS = new introJs();
  multiPage: string = null;
  isDetailedView: boolean = false;
  weekVisible: boolean = true;
  weekCount: number = 0;
  selectionType: string = 'day';
  constructor(private _location: Location, private activityTime: ActivityTimeFilterPipe, private cookieService: CookieService,
    private timeUsageService: TimeUsageService, private translateService: TranslateService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog) {
    super();
    this.route.queryParams.subscribe(params => {
      if (!this.multiPage) {
        this.multiPage = params['multipage'];
      }
    });
    var response = JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails));
    if (response && (response.trailDays > 0 || response.noOfPurchasedLicences > 0)) {
      this.isTrailExpired = false;
    }
    else {
      this.isTrailExpired = true;
    }
    if (this.isTrailExpired) {
      var today = new Date();
      var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
      // var month;
      // var year;
      // if (endDate.getDate() > today.getDate()) {
      //   month = today.getMonth() != 0 ? today.getMonth() - 1 : 11;
      //   if (month == 11) {
      //     year = today.getFullYear() - 1;
      //   }
      //   year = today.getFullYear();
      // }
      // else {
      //   month = today.getMonth();
      //   year = today.getFullYear();
      // }
      this.minDateOnTrailExpired = endDate;
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.loading = true;
    this.getSoftLabels();
    this.pageNumber = 0;
    this.pageSize = 15;
    this.days = 1;
    this.rangeFrom = false;
    this.formValidate();
    this.getAllEmployees();
    this.getAllBranches();
    this.getAllRoles();
    // this.getAllEmployees();
    this.getLoggedInUser();
    this.setDateFrom(this.fromDate);
    this.setDateTo(this.fromDate);
    this.minDate = new Date();
    this.webAppUsageSearch.isApp = null;
    this.sortBy = "name";
    this.sortDirectionAsc = true;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }
  ngAfterViewInit() {
    this.introJS.setOptions({
      steps: [
        {
          element: '#DV-1',
          intro: "It will diplay detailed view of the tracking system by using apps and websites that opened in the system with loggedin time and productivity bar.",
          position: 'top'
        },
        {
          element: '#DV-2',
          intro: "Here it shows the filtering details with branch, role and user along with day, week and data range buttons to get the filtered data.",
          position: 'bottom'
        },
        {
          element: '#DV-3',
          intro: "Here we can select any of the buttons All, Websites, Applications to get the detailed view of apps and websites opened in the system.",
          position: 'bottom'
        }

      ]
    });
    //this.introJS.start();
  }


  getSoftLabels() {
    if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }
  }

  backClicked() {
    this._location.back();
  }

  setPage(data) {
    this.searchText = this.searchText;
    this.pageNumber = data.offset;
    this.pageSize = 15;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }

  onSort(event) {
    const sort = event.column.prop;
    this.sortBy = sort;
    this.pageNumber = 0;
    if (event.newValue === 'asc')
      this.sortDirectionAsc = true;
    else
      this.sortDirectionAsc = false;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }

  timeSheetDetailsForDay(clickType, buttonType) {
    this.todayDate = new Date(this.todayDate);
    if (clickType == "backward") {
      this.todayDate = this.parse(this.todayDate.setDate(buttonType == "week" ? this.todayDate.getDate() - 6 : this.todayDate.getDate() - 1));
      this.sortBy = null;
      this.pageNumber = 0;
      if (buttonType == "week") {
        this.isDay = 8;
        if (!this.isDetailedView) {
          this.isPreviousDisable = true;
        }
        this.dayCount = 1;
        this.isNextDisable = false;
        this.isPreviousDisable = true;
      }
    }
    else {
      this.todayDate = this.parse(this.todayDate.setDate(buttonType == "week" ? this.todayDate.getDate() + 6 : this.todayDate.getDate() + 1));
      this.sortBy = null;
      this.pageNumber = 0;
      if (buttonType == "week") {
        this.isDay = 0;
        if (!this.isDetailedView) {
          this.dayCount = 7;
        }
        else {
          this.dayCount = 30;
        }
        this.isNextDisable = true;
        this.isPreviousDisable = false;
      }
    }
    if (this.todayDate <= this.maxDate) {
      if (this.maxDate.toLocaleDateString() == this.todayDate.toLocaleDateString()) {
        this.dispalyForward = false;
      } else {
        this.dispalyForward = true;
      }
      this.setDateFrom(this.todayDate);
      this.setDateTo(this.todayDate);
      this.loadingIndicator = true;
      this.getWebAppTimeusage();
    }
    else {
      this.dispalyForward = false;
      this.todayDate = this.maxDate;
      this.dateFrom = this.todayDate;
      this.dateTo = this.todayDate;
      this.loadingIndicator = true;
      this.getWebAppTimeusage();
    }
  }

  dayTypeForTimeUsage(clickType) {
    this.isDay = 0;
    this.selectionType = clickType;
    if (!this.isDetailedView) {
      this.dayCount = 7;
    }
    else {
      this.dayCount = 30;
    }
    this.isNextDisable = true;
    this.isPreviousDisable = false;
    if (clickType == "day") {
      this.primaryDay = "primary";
      this.primaryWeek = "";
      this.primaryMonth = "";
      this.primaryDateRange = "";
      this.days = 1;
      this.day = true;
      this.month = false;
      this.week = false;
      this.dateRange = false;
      this.todayDate = new Date();
      this.dateFrom = this.todayDate;
      this.dateTo = this.todayDate;
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
    }
    else if (clickType == "week") {
      this.primaryDay = "";
      this.primaryWeek = "primary";
      this.primaryMonth = "";
      this.primaryDateRange = "";
      this.days = 6;
      this.day = false;
      this.week = true;
      this.month = false;
      this.dateRange = false;
      this.weekDate = new Date();
      var dateLocal = new Date();
      var first = this.weekDate.getDate() - this.weekDate.getDay();
      var last = first + 6;
      this.dateFrom = new Date(this.weekDate.setDate(first));
      this.dateTo = new Date(dateLocal.setDate(last));
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
      this.weekNumber = this.getWeekNumber(this.weekDate);
    }
    else if (clickType == "month") {
      this.primaryDay = "";
      this.primaryWeek = "";
      this.primaryMonth = "primary";
      this.primaryDateRange = "";
      this.day = false;
      this.week = false;
      this.dateRange = false;
      this.month = true;
      const month = 0 + (this.monthDate.getMonth() + 1);
      const year = this.monthDate.getFullYear();
      this.days = new Date(year, month, 0).getDate() - 4;
      this.monthDate = new Date();
      this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
      this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
      this.selectedMonth = this.date.toISOString();
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
    }
    else {
      this.primaryDay = "";
      this.primaryWeek = "";
      this.primaryMonth = "";
      this.primaryDateRange = "primary";
      this.day = false;
      this.week = false;
      this.month = false;
      this.dateRange = true;
      this.fromDate = new Date();
      this.toDate = new Date();
      this.dateFrom = this.fromDate;
      this.dateTo = this.fromDate;
      this.setDateFrom(new Date());
      this.setDateTo(new Date());
      this.rangeFrom = true;
      var diffInTime = this.dateTo.getTime() - this.dateFrom.getTime();
      this.days = (diffInTime / (1000 * 3600 * 24)) + 1;
    }
    this.dispalyForward = false;
    this.pageNumber = 0;
    this.pageSize = 15;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }

  formValidate() {

    this.selectFilter = new FormGroup({
      branchIds: new FormControl('',
        Validators.compose([
        ])
      ),
      roleIds: new FormControl('',
        Validators.compose([
        ])
      ),
      userIds: new FormControl('',
        Validators.compose([
        ])
      )
    })
  }

  getProductiveToolTip(row) {
    if (row.applicationTypeName == 'Productive') {
      return this.activityTime.transform(row.spentValue) + ' (' + this.translateService.instant('ACTIVITYTRACKER.PRODUCTIVE') + ')';
    } else if (row.applicationTypeName == 'UnProductive') {
      return this.activityTime.transform(row.spentValue) + ' (' + this.translateService.instant('ACTIVITYTRACKER.UNPRODUCTIVE') + ')';
    } else {
      return this.activityTime.transform(row.spentValue) + ' (' + this.translateService.instant('ACTIVITYTRACKER.NEUTRAL') + ')';
    }
  }
  // {{row?.spentValue | activityTimeFilter}} - {{ row?.applicationTypeName}}

  typeOfApplication(clickType) {
    if (clickType == "All") {
      this.primaryAllColor = "primary";
      this.primaryApplicationsColor = "";
      this.primaryWebsitesColor = "";
      this.webAppUsageSearch.isApp = null;
    }
    else if (clickType == "Websites") {
      this.primaryAllColor = "";
      this.primaryApplicationsColor = "";
      this.primaryWebsitesColor = "primary";
      this.webAppUsageSearch.isApp = false;
    }
    else {
      this.primaryAllColor = "";
      this.primaryApplicationsColor = "primary";
      this.primaryWebsitesColor = "";
      this.webAppUsageSearch.isApp = true;
    }
    this.pageNumber = 0;
    this.pageSize = 15;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
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

  getDevQualityBasedOnDate(direction) {
    this.direction = direction;
    var monthValue;
    if (direction === 'right') {
      const day = this.monthDate.getDate();
      const month = 0 + (this.monthDate.getMonth() + 1) + 1;
      const year = this.monthDate.getFullYear();
      const newDate = day + '/' + month + '/' + year;
      this.monthDate = this.parse(newDate);
      this.selectedMonth = this.monthDate.toISOString();
      this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
      this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
      monthValue = this.monthDate.getMonth() + 1;
    } else {
      const day = this.monthDate.getDate();
      const month = (this.monthDate.getMonth() + 1) - 1;
      const year = 0 + this.monthDate.getFullYear();
      const newDate = day + '/' + month + '/' + year;
      this.monthDate = this.parse(newDate);
      this.selectedMonth = this.monthDate.toISOString();
      this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
      this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
      monthValue = this.monthDate.getMonth() + 1;
    }
    if (this.dateFrom <= this.maxDate) {
      if ((this.maxDate.getMonth() + 1) == monthValue) {
        this.dispalyForward = false;
      } else {
        this.dispalyForward = true;
      }
      this.sortBy = null;
      this.pageNumber = 0;
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
      this.loadingIndicator = true;
      this.getWebAppTimeusage();
    }
    else {
      this.dispalyForward = false;
      this.selectedMonth = this.maxDate.toISOString();
      this.dateFrom = this.maxDate;
    }
  }

  getWeekNumber(selectedWeek) {
    const currentDate = selectedWeek.getDate();
    const monthStartDay = (new Date(this.weekDate.getFullYear(), this.weekDate.getMonth(), 1)).getDay();
    const weekNumber = (selectedWeek.getDate() + monthStartDay) / 7;
    const week = (selectedWeek.getDate() + monthStartDay) % 7;
    this.selectedWeek = selectedWeek.toISOString();
    if (week !== 0) {
      return Math.ceil(weekNumber);
    } else {
      return weekNumber;
    }
  }

  getWeekBasedOnDate(direction) {
    this.direction = direction;
    if (direction === 'right') {
      this.weekCount = this.weekCount - 1;
      const day = this.weekDate.getDate() + 7;
      const month = 0 + (this.weekDate.getMonth() + 1);
      const year = this.weekDate.getFullYear();
      const newDate = day + '/' + month + '/' + year;
      this.weekDate = this.parse(newDate);
      this.weekNumber = this.getWeekNumber(this.weekDate);
      var first = this.weekDate.getDate() - this.weekDate.getDay();
      var last = first + 6;
      if (first <= 0) {
        first = 1;
        this.dateFrom = new Date(this.parse(newDate).setDate(first));
        this.dateTo = new Date(this.parse(newDate).setDate(last));
      } else {
        this.dateFrom = new Date(this.weekDate.setDate(first));
        this.dateTo = new Date(this.parse(newDate).setDate(last));
      }
    }
    else {
      this.weekCount = this.weekCount + 1;
      const day = this.weekDate.getDate() - 7;
      const month = 0 + (this.weekDate.getMonth() + 1);
      const year = this.weekDate.getFullYear();
      const newDate = day + '/' + month + '/' + year;
      this.weekDate = this.parse(newDate);
      this.weekNumber = this.getWeekNumber(this.weekDate);
      var first = this.weekDate.getDate() - this.weekDate.getDay();
      var last = first + 6;
      if (first <= 0) {
        first = 1;
        this.dateFrom = new Date(this.parse(newDate).setDate(first));
        this.dateTo = new Date(this.parse(newDate).setDate(last));
      } else {
        this.dateFrom = new Date(this.weekDate.setDate(first));
        this.dateTo = new Date(this.parse(newDate).setDate(last));
      }
    }

    if (this.dateFrom <= this.maxDate) {
      if (this.dateTo >= this.maxDate) {
        this.dispalyForward = false;
      } else {
        this.dispalyForward = true;
      }
      this.sortBy = null;
      this.pageNumber = 0;
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
      this.loadingIndicator = true;
      this.getWebAppTimeusage();
    }
    else {
      this.dispalyForward = false;
      this.weekDate = this.parse(this.maxDate);
      this.weekNumber = this.getWeekNumber(this.weekDate);
      this.dateFrom = this.maxDate;
    }
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.todayDate = event.target.value;
    this.todayDate = event.target.value;
    this.setFromDate(this.todayDate);
    this.setToDate(this.todayDate);
    this.days = 1;
    this.pageNumber = 0;
    this.pageSize = 15;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }

  dateFromChanged(event: MatDatepickerInputEvent<Date>) {
    this.fromDate = event.target.value;
    this.minDate = this.fromDate;
    this.setFromDate(this.minDate);
    if (this.toDate < this.fromDate) {
      this.toDate = this.fromDate;
    }
    if (this.rangeFrom) {
      this.setDateTo(this.toDate);
    } else {
      this.setToDate(this.toDate);
    }
    var diffInTime = this.dateTo.getTime() - this.dateFrom.getTime();
    this.days = diffInTime / (1000 * 3600 * 24) + 1;
    this.pageNumber = 0;
    this.pageSize = 15;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }

  dateToChanged(event: MatDatepickerInputEvent<Date>) {
    this.toDate = event.target.value;
    this.setFromDate(this.minDate);
    this.setToDate(this.toDate);
    this.rangeFrom = false;
    var diffInTime = this.dateTo.getTime() - this.dateFrom.getTime();
    this.days = diffInTime / (1000 * 3600 * 24) + 1;
    this.pageNumber = 0;
    this.pageSize = 15;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }

  changeUser(value) {
    if (value == "") {
      this.selectedUser = null;
      this.userId = null;
    }
    else {
      var employeesDropdown = this.employeesDropDown;
      var selectedEmployees = _.filter(employeesDropdown, function (employee) {
        return value.toString().includes(employee['teamMemberId']);
      })
      this.selectedUser = selectedEmployees.map(x => x['teamMemberName']).toString();
    }
  }

  changeBranch(value) {
    if (value == "") {
      this.employeeOfRoleModel.branchId = value.branchId;
      this.branchId = null;
      this.selectedBranch = null;
    }
    else {
      this.employeeOfRoleModel.branchId = value.branchId;
      var branch = this.branchesList;
      var selectedBranches = _.filter(branch, function (branch) {
        return value.toString().includes(branch.branchId);
      })
      this.selectedBranch = selectedBranches.map(x => x.branchName).toString();
    }
  }

  changeRole(value) {
    if (value == "") {
      this.employeeOfRoleModel.roleId = null;
      this.roleId = null;
      this.selectedRole = null;
    }
    else {
      this.employeeOfRoleModel.roleId = value.toString();
      var roles = this.rolesDropDown;
      var selectedRoles = _.filter(roles, function (role) {
        return value.toString().includes(role.roleId)
      })
      this.selectedRole = selectedRoles.map(z => z.roleName).toString();
    }
  }

  resetUser() {
    this.webAppUsageSearch.userId = null;
    this.selectedUser = null;
    this.userId = null;
    this.pageNumber = 0;
    this.pageSize = 15;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }

  resetBranch() {

    this.employeeOfRoleModel.branchId = null;
    this.webAppUsageSearch.branchId = null;
    this.branchId = null;
    this.selectedBranch = null;
    this.getEmployees();
    this.pageNumber = 0;
    this.pageSize = 15;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }

  resetRole() {
    this.employeeOfRoleModel.roleId = null;
    this.webAppUsageSearch.roleId = null;
    this.roleId = null;
    this.selectedRole = null;
    this.getEmployees();
    this.pageNumber = 0;
    this.pageSize = 15;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }

  toggleBranchesPerOne() {
    if (this.allBranchesSelected.selected) {
      this.allBranchesSelected.deselect();
      this.isSelectAllBranches = false;
      this.employeeOfRoleModel.branchId = this.selectFilter.value.branchIds;
      this.getEmployees();
      this.webAppUsageSearch.branchId = this.selectFilter.value.branchIds;
      this.pageNumber = 0;
      this.pageSize = 15;
      this.loadingIndicator = true;
      this.getWebAppTimeusage();
      return false;
    }
    if (this.selectFilter.get("branchIds").value.length === this.branchesList.length) {
      this.allBranchesSelected.select();
      this.isSelectAllBranches = true;
      this.employeeOfRoleModel.branchId = this.selectFilter.value.branchIds;
      this.getEmployees();
      this.webAppUsageSearch.branchId = this.selectFilter.value.branchIds;
      this.pageNumber = 0;
      this.pageSize = 15;
      this.loadingIndicator = true;
      this.getWebAppTimeusage();
    }
    if (this.selectFilter.get("branchIds").value.length < this.branchesList.length) {
      this.allBranchesSelected.deselect();
      this.isSelectAllBranches = false;
      this.employeeOfRoleModel.branchId = this.selectFilter.value.branchIds;
      this.getEmployees();
      this.webAppUsageSearch.branchId = this.selectFilter.value.branchIds;
      this.pageNumber = 0;
      this.pageSize = 15;
      this.loadingIndicator = true;
      this.getWebAppTimeusage();
    }
  }

  branchSelected() {
    const branchLst = this.branchesList;
    const selected = this.selectFilter.value.branchIds;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.filter(branchLst, function (member) {
      return selected.toString().includes(member.branchId);
    })
    const branch = filteredList.map((x) => x.branchName);
    this.selectedBranch = branch.toString();
  }

  toggleAllBranchesSelected() {
    if (this.allBranchesSelected.selected && this.isSelectAllBranches == false) {
      this.selectFilter.get("branchIds").patchValue([
        ...this.branchesList.map((item) => item.branchId),
        0
      ]);
      // this.selectedBranchIds = this.branchesList.map((item) => item.branchId);
      this.isSelectAllBranches = true;
    } else {
      this.selectFilter.get("branchIds").patchValue([]);
      this.isSelectAllBranches = false;
    }
    this.branchSelected();
    this.employeeOfRoleModel.branchId = this.selectFilter.value.branchIds;
    this.getEmployees();
    this.webAppUsageSearch.branchId = this.selectFilter.value.branchIds;
    this.pageNumber = 0;
    this.pageSize = 15;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }

  toggleRolesPerOne() {
    if (this.allRolesSelected.selected) {
      this.allRolesSelected.deselect();
      this.isSelectAllRoles = false;
      this.employeeOfRoleModel.roleId = this.selectFilter.value.roleIds;
      this.getEmployees();
      this.webAppUsageSearch.roleId = this.selectFilter.value.roleIds;
      this.pageNumber = 0;
      this.pageSize = 15;
      this.loadingIndicator = true;
      this.getWebAppTimeusage();
      return false;
    }
    if (this.selectFilter.get("roleIds").value.length === this.rolesDropDown.length) {
      this.allRolesSelected.select();
      this.isSelectAllRoles = true;
      this.employeeOfRoleModel.roleId = this.selectFilter.value.roleIds;
      this.getEmployees();
      this.webAppUsageSearch.roleId = this.selectFilter.value.roleIds;
      this.pageNumber = 0;
      this.pageSize = 15;
      this.loadingIndicator = true;
      this.getWebAppTimeusage();
    }
    if (this.selectFilter.get("roleIds").value.length < this.rolesDropDown.length) {
      this.allRolesSelected.deselect();
      this.isSelectAllRoles = false;
      this.employeeOfRoleModel.roleId = this.selectFilter.value.roleIds;
      this.getEmployees();
      this.webAppUsageSearch.roleId = this.selectFilter.value.roleIds;
      this.pageNumber = 0;
      this.pageSize = 15;
      this.loadingIndicator = true;
      this.getWebAppTimeusage();
    }
  }

  toggleAllRolesSelected() {
    if (this.allRolesSelected.selected && this.isSelectAllRoles == false) {
      this.selectFilter.get("roleIds").patchValue([
        ...this.rolesDropDown.map((item) => item.roleId),
        0
      ]);
      // this.selectedBranchIds = this.branchesList.map((item) => item.branchId);
      this.isSelectAllRoles = true;
    } else {
      this.selectFilter.get("roleIds").patchValue([]);
      this.isSelectAllRoles = false;
    }
    this.roleSelected();
    this.employeeOfRoleModel.roleId = this.selectFilter.value.roleIds;
    this.getEmployees();
    this.webAppUsageSearch.roleId = this.selectFilter.value.roleIds;
    this.pageNumber = 0;
    this.pageSize = 15;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }

  toggleUsersPerOne() {
    if (this.allUsersSelected.selected) {
      this.allUsersSelected.deselect();
      this.isSelectAllUsers = false;
      this.webAppUsageSearch.userId = this.selectFilter.value.userIds;
      this.pageNumber = 0;
      this.pageSize = 15;
      this.loadingIndicator = true;
      this.getWebAppTimeusage();
      return false;
    }
    if (this.selectFilter.get("userIds").value.length === this.employeesDropDown.length) {
      this.allUsersSelected.select();
      this.isSelectAllUsers = true;
      this.webAppUsageSearch.userId = this.selectFilter.value.userIds;
      this.pageNumber = 0;
      this.pageSize = 15;
      this.loadingIndicator = true;
      this.getWebAppTimeusage();
    }
    if (this.selectFilter.get("userIds").value.length < this.employeesDropDown.length) {
      this.allUsersSelected.deselect();
      this.isSelectAllUsers = false;
      this.webAppUsageSearch.userId = this.selectFilter.value.userIds;
      this.pageNumber = 0;
      this.pageSize = 15;
      this.loadingIndicator = true;
      this.getWebAppTimeusage();
    }
  }

  toggleAllUsersSelected() {
    if (this.allUsersSelected.selected && this.isSelectAllUsers == false) {
      this.selectFilter.get("userIds").patchValue([
        ...this.employeesDropDown.map((item) => item.teamMemberId),
        0
      ]);
      // this.selectedBranchIds = this.branchesList.map((item) => item.branchId);
      this.isSelectAllUsers = true;
    } else {
      this.selectFilter.get("userIds").patchValue([]);
      this.isSelectAllUsers = false;
    }
    this.userSelected();
    this.webAppUsageSearch.userId = this.selectFilter.value.userIds;
    this.pageNumber = 0;
    this.pageSize = 15;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }

  roleSelected() {
    const roleLst = this.rolesDropDown;
    const selected = this.selectFilter.value.roleIds;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.filter(roleLst, function (member) {
      return selected.toString().includes(member.roleId);
    })
    const role = filteredList.map((x) => x.roleName);
    this.selectedRole = role.toString();
  }

  userSelected() {
    const userLst = this.employeesDropDown;
    const selected = this.selectFilter.value.userIds;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.filter(userLst, function (member) {
      return selected.toString().includes(member['teamMemberId']);
    })
    const user = filteredList.map((x) => x['teamMemberName']);
    this.selectedUser = user.toString();
  }

  search() {
    if (this.searchText.length > 0) {
      this.searchText = this.searchText.trim();
      if (this.searchText.length <= 0) return;
    }
    this.pageNumber = 0;
    this.pageSize = 15;
    this.loadingIndicator = true;
    this.getWebAppTimeusage();
  }

  closeSearch() {
    this.searchText = '';
    this.search();
  }

  setDateFrom(date) {
    var day = date.getDate();
    const month = 0 + (date.getMonth() + 1);
    const year = date.getFullYear();
    var newDate = day + '/' + month + '/' + year;
    // day += 1;
    // newDate = day + '/' + month + '/' + year;
    // this.dateFrom = this.parse(newDate);
    this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
  }

  setDateTo(date) {
    var day = date.getDate();
    const month = 0 + (date.getMonth() + 1);
    const year = date.getFullYear();
    var newDate = day + '/' + month + '/' + year;
    // day += 1;
    // newDate = day + '/' + month + '/' + year;
    // this.dateTo = this.parse(newDate);
    this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
  }

  setFromDate(date) {
    var day = date._i["date"];
    const month = 0 + (date._i["month"] + 1);
    const year = date._i["year"];
    var newDate = day + '/' + month + '/' + year;
    // day += 1;
    // newDate = day + '/' + month + '/' + year;
    // this.dateFrom = this.parse(newDate);
    this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
  }

  setToDate(date) {
    var day = date._i["date"];
    const month = 0 + (date._i["month"] + 1);
    const year = date._i["year"];
    var newDate = day + '/' + month + '/' + year;
    // day += 1;
    // newDate = day + '/' + month + '/' + year;
    // this.dateTo = this.parse(newDate);
    this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
  }

  getAllBranches() {
    // this.timeUsageService.getBranchesList().subscribe((responseData: any) => {
    //   this.branchesList = responseData.data;
    // })
  }

  getAllRoles() {
    // this.timeUsageService.getAllRoles().subscribe((responseData: any) => {
    //   this.rolesDropDown = responseData.data;
    // })
  }

  getLoggedInUser() {
    this.timeUsageService.getLoggedInUser().subscribe((responseData: any) => {
      this.loggedUser = responseData.data.id;
      // var employeesDropdown = this.employeesDropDown;
      // var selectedEmployees = _.filter(employeesDropdown, function (employee) {
      //     return this.loggedUser.toString().includes(employee.userId);
      // })
    })
  }

  getEmployees() {
    this.selectedUser = "";
    this.selectFilter.get("userIds").patchValue([]);
    if (this.allUsersSelected.selected) {
      this.allUsersSelected.deselect();
    }

    this.employeesDropDown = this.originalEmployees;
    let temp = [];
    if ((this.employeeOfRoleModel.branchId && this.employeeOfRoleModel.branchId.length > 0) || (this.employeeOfRoleModel.roleId && this.employeeOfRoleModel.roleId.length > 0)) {
      this.employeesDropDown.forEach(element => {
        if (this.employeeOfRoleModel.branchId && this.employeeOfRoleModel.branchId.length > 0) {
          this.employeeOfRoleModel.branchId.forEach(branchId => {
            if (element.branchId == branchId) {
              let index;
              index = temp.findIndex((x) => x.teamMemberId == element.teamMemberId);
              if(index == -1)
              temp.push(element)
            }
          })
        }

        if (this.employeeOfRoleModel.roleId && this.employeeOfRoleModel.roleId.length > 0) {
          this.employeeOfRoleModel.roleId.forEach(roleId => {
            if (element.roleIds.includes(roleId)) {
              let index;
              index = temp.findIndex((x) => x.teamMemberId == element.teamMemberId);
              if(index == -1)
              temp.push(element)
            }
          })
        }
      });
      this.employeesDropDown = temp;
    }

    // this.timeUsageService.getAllEmployee(this.employeeOfRoleModel).subscribe((responseData: any) => {
    //   this.employeesDropDown = responseData.data;
    // })
    this.webAppUsageSearch.userId = this.selectFilter.value.userIds;
  }

  getAllEmployees() {
    // var teamMemberModel;
    // teamMemberModel = {
    //   isForTracker: true
    // }
    // teamMemberModel.isArchived = false;
    // this.timeUsageService.getTeamLeadsList(teamMemberModel).subscribe((responseData: any) => {
    //   this.employeesDropDown = responseData.data;
    //   this.originalEmployees = responseData.data;
    //   if (this.employeesDropDown && this.employeesDropDown.length > 1) {
    //     this.userLength = true;
    //   } else {
    //     this.userLength = false;
    //   }
    // })
  }

  filterStatus() {
    // if (this.userId ||
    //   this.roleId ||
    //   this.branchId ||
    //   this.searchText != '' ||
    //   this.fromDate || this.toDate)
    if ((this.fromDate && this.dateRange) || (this.toDate && this.dateRange) || (this.selectedBranch) || (this.selectedRole) || (this.selectedUser) || (this.searchText))
      return true;
    else
      return false;
  }

  getWebAppTimeusage() {
    this.loading = true;
    this.webAppUsageSearch.dateFrom = this.dateFrom;
    this.webAppUsageSearch.dateTo = this.dateTo;
    this.webAppUsageSearch.searchText = this.searchText;
    let WebAppUsageModel = new WebAppUsageSearchModel();
    WebAppUsageModel.pageSize = this.pageSize;
    WebAppUsageModel.pageNumber = this.pageNumber + 1;
    WebAppUsageModel.dateFrom = this.webAppUsageSearch.dateFrom;
    WebAppUsageModel.dateTo = this.webAppUsageSearch.dateTo;
    WebAppUsageModel.userId = this.webAppUsageSearch.userId;
    WebAppUsageModel.roleId = this.webAppUsageSearch.roleId;
    WebAppUsageModel.branchId = this.webAppUsageSearch.branchId;
    WebAppUsageModel.searchText = this.webAppUsageSearch.searchText;
    WebAppUsageModel.sortBy = this.sortBy;
    WebAppUsageModel.sortDirectionAsc = this.sortDirectionAsc;
    WebAppUsageModel.isApp = this.webAppUsageSearch.isApp;
    if (this.isDetailedView) {
      WebAppUsageModel.isDetailedView = true;
    }
    this.totalTime = this.time * this.days;
    this.timeUsageService.getWebAppTimeUsage(WebAppUsageModel).subscribe((responseData: any) => {
      if (responseData.success == false) {
        // this.validationMessage = responseData.apiResponseMessages[0].message;
        this.webAppUsage = [];
        this.loadingIndicator = false;
        this.totalCount = 0;
        if (this.multiPage == "true") {
          this.introStart();
          this.multiPage = null;
        }
      }
      if (responseData.data == null) {
        this.webAppUsage = [];
        this.loadingIndicator = false;
        this.totalCount = 0;
        if (this.multiPage == "true") {
          this.introStart();
          this.multiPage = null;
        }
      } else {
        this.webAppUsage = responseData.data;
        var response = this.webAppUsage;
        for (var i = 0; i < this.webAppUsage.length; i++) {
          this.webAppUsage[i].timeValue = Math.round((this.webAppUsage[i].spentValue / this.totalTime) * 100);
          if (this.webAppUsage[i].timeValue == 0) {
            this.webAppUsage[i].timeValue = 1;
          }
        }
        this.loadingIndicator = false;
        this.totalCount = this.webAppUsage[0].totalCount;
        if (this.multiPage == "true") {
          this.introStart();
          this.multiPage = null;
        }
      }
      this.loading = false;
    })
  }

  previous() {
    if ((!this.isDetailedView && this.dayCount == 7) || (this.isDetailedView && this.dayCount == 30)) {
      this.isNextDisable = false;
    }
    this.isDay = this.isDay + 1;
    this.dayCount = this.dayCount - 1;
    if (this.dayCount == 1) {
      this.isPreviousDisable = true;
    } else {
      this.isPreviousDisable = false;
    }
  }

  next() {
    if (this.dayCount == 1) {
      this.isPreviousDisable = false;
    }
    this.dayCount = this.dayCount + 1;
    this.isDay = this.isDay + 1;
    if (this.dayCount == 7) {
      this.isNextDisable = true;
    } else {
      this.isNextDisable = false;
    }
  }

  introStart() {
    const navigationExtras: NavigationExtras = {
      queryParams: { multipage: true },
      queryParamsHandling: 'merge',
      // preserveQueryParams: true
    }

    this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
      if (this.canAccess_feature_ManageActivityConfig) {
        this.router.navigate(["activitytracker/activitydashboard/configuration"], navigationExtras);
      }
      else if (this.canAccess_feature_ManageActivityConfig) {
        this.router.navigate(["activitytracker/activitydashboard/configurationHistory"], navigationExtras);
      }
    });
  }

  getDetailedView() {
    let date2 = this.webAppUsageSearch.dateFrom;
    let date1;
    this.pageNumber = 0;
    if (this.selectionType == 'day') {
      date1 = new Date();
    }
    else {
      date1 = this.webAppUsageSearch.dateTo;
    }

    var diff = Math.abs(new Date(date2).getTime() - new Date(date1).getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    if ((diffDays > 30 && this.isDetailedView) || (this.isDetailedView && this.selectionType == 'week' && this.weekCount > 4)) {
      this.fromDate = new Date();
      this.toDate = new Date();
      this.dateFrom = new Date();
      this.dateTo = new Date();
      this.webAppUsageSearch.dateFrom = this.fromDate;
      this.webAppUsageSearch.dateTo = this.toDate;
      this.todayDate = new Date();
      this.dispalyForward = false;
      this.dayTypeForTimeUsage(this.selectionType);
    }

    if (this.isTrailExpired)
      this.isPreviousDisable = false;
    if (this.isDetailedView) {
      if(diffDays > 30)
      this.dayCount = 30;
      else
      this.dayCount = 30 + 1 - diffDays;
      if (!this.isTrailExpired) {
        var today = new Date();
        var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
        this.minDateOnTrailExpired = endDate;
      }
      else {
        if(diffDays > 30)
        this.dayCount = 7;
        else
        this.dayCount = 7 + 1 - diffDays;;
      }
    }
    else {
      if(diffDays > 30)
      this.dayCount = 7;
      else
      this.dayCount = 7 + 1 - diffDays;
      if (this.isTrailExpired) {
        var today = new Date();
        var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        this.minDateOnTrailExpired = endDate;
      }
      else {
        this.minDateOnTrailExpired = null;
      }
    }
    this.getWebAppTimeusage();
  }


  getEnableOrDisable() {
    if (this.isTrailExpired) {
      return false;
    }
    else {
      if (this.isDetailedView) {
        if (this.weekCount != 4)
          return true;
        else
          return false;
      }
      else {
        return true;
      }
    }
  }
}