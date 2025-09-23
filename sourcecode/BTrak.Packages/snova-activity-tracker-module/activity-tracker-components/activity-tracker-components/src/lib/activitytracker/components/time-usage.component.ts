import { Component, Input, TemplateRef, ViewChild } from "@angular/core";
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOption, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EmployeeOfRoleModel } from "../models/employee-of-role-model";
import { EmployeeModel } from "../models/employee-model";
import { TimeSheetSearchModel } from "../models/time-sheet-search-model";

import { TranslateService } from "@ngx-translate/core";
import { TimeUsageService } from "../services/time-usage.service";

import * as _ from 'underscore';
import { TimeUsageDrillDownModel } from "../models/time-usage-drill-down-model";
import { TimeUsageDrillDownComponent } from "./time-usage-drilldown.component";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { Page } from '../models/Page';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import * as _moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import * as introJs from 'intro.js/intro.js';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
const moment = _moment;

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
  selector: "app-view-activitytracker-component-time-usage",
  templateUrl: "time-usage.component.html",
  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },
  //   {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  // ]
})

export class TimeUsageComponent extends CustomAppBaseComponent {
  @ViewChild("allBranchesSelected") private allBranchesSelected: MatOption;
  @ViewChild("allRolesSelected") private allRolesSelected: MatOption;
  @ViewChild("allUsersSelected") private allUsersSelected: MatOption;
  @ViewChild("activityTrackerDialog", { static: true }) private activityTrackerDialogComponent: TemplateRef<any>;

  @Input("employeeData")
  set _employeeData(data: any) {
    if (data) {
      this.employeesDropDown = data;
      this.originalEmployees = data;
    }
  }

  @Input("branchData")
  set _branchData(data: any) {
    if (data) {
      this.branchesList = data;
    }
  }

  @Input("roleData")
  set _roleData(data: any) {
    if (data) {
      this.rolesDropDown = data;
    }
  }

  employeesDropDown: any;
  originalEmployees: any;
  timeSheetSearch: TimeSheetSearchModel = new TimeSheetSearchModel();
  employeeOfRoleModel: EmployeeOfRoleModel = new EmployeeOfRoleModel();
  //rows = [];
  page = new Page();
  date: Date = new Date();
  weekDate: Date = new Date();
  monthDate: Date = new Date();
  dateFrom: Date = new Date();
  fromDate: Date = new Date();
  toDate: Date = new Date();
  dateTo: Date = new Date();
  dateToday: Date = new Date();
  rangeDate: Date = new Date();
  selectedWeek: string = this.date.toISOString();
  selectedMonth: string = this.date.toISOString();
  dateFromSelected: Date;
  dateToSelected: Date;
  maxDate = new Date();
  minDate = new Date();
  weekNumber: number;
  maxTotal: number = 0;
  neutralTotal: number = 0;
  pageSize: number = 500;
  pageNumber: number = 0;
  totalCount: number = 0;
  days: number[] = [1];
  direction: any;
  type: string = ConstantVariables.Month;
  primaryDay: string = "primary";
  primaryWeek: string;
  primaryMonth: string;
  primaryDateRange: string;
  loggedUser: string;
  displayUi: string;
  sortBy: string = null;
  selectedBranch: string;
  selectedRole: string;
  selectedUser: string;
  day: boolean = true;
  week: boolean;
  month: boolean;
  dateRange: boolean;
  rangeFrom: boolean;
  dates: any[];
  timeUsage: any[] = [];
  branchesList: any[];
  rolesDropDown: any[];
  sortDirectionAsc: boolean = false;
  softLabels: SoftLabelConfigurationModel[];
  branchId: string;
  roleId: string;
  userId: string;
  isSelectAllBranches: boolean = false;
  isSelectAllRoles: boolean = false;
  isSelectAllUsers: boolean = false;
  dispalyForward: boolean = false;
  selectFilter: FormGroup;
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
  isIdleView: boolean = false;

  constructor(private _location: Location, private cookieService: CookieService,
    private timeUsageService: TimeUsageService, private translateService: TranslateService, private router: Router,
    public dialog: MatDialog, private route: ActivatedRoute) {
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
      var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
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
    this.formValidate();
    this.page.size = 10;
    this.page.pageNumber = 0;
    this.pageNumber = 0;
    this.pageSize = 500;
    this.rangeFrom = false;
    this.getLoggedInUser();
    this.getAllBranches();
    this.getAllRoles();
    this.getAllEmployees();
    this.setDateFrom(this.fromDate);
    this.setDateTo(this.fromDate);
    this.sortBy = "name";
    this.sortDirectionAsc = true;
    this.dayTypeForTimeUsage('week');
  }

  ngAfterViewInit() {
    this.introJS.setOptions({
      steps: [
        {
          element: '#productivity-1',
          intro: "It will displays user productivity details with progress bar by showing spent time and idle time.",
          position: 'bottom'
        },
        {
          element: '#productivity-2',
          intro: "Here we can select the branch, role and user for filtering the data.",
          position: 'bottom'
        },
        {
          element: '#productivity-3',
          intro: "Here we can select any of the buttons Day, Week, data range to get the productivity details of respected dates.",
          position: 'bottom'
        }

      ]
    });
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
    this.pageNumber = data.offset;
    this.pageSize = 500;
    this.getTotalTimeSpentApplications();
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    this.pageNumber = 0;
    if (sort.dir === 'asc')
      this.sortDirectionAsc = true;
    else
      this.sortDirectionAsc = false;
    this.getTotalTimeSpentApplications();
  }


  timeSheetDetailsForDay(clickType, buttonType) {
    this.dateToday = new Date(this.dateToday);
    if (clickType == "backward") {
      this.dateToday = this.parse(this.dateToday.setDate(buttonType == "week" ? this.dateToday.getDate() - 7 : this.dateToday.getDate() - 1));
      if (buttonType == "week") {
        this.isDay = 8;
        this.dayCount = 1;
        this.isNextDisable = false;
        this.isPreviousDisable = true;
      }
    }
    else {
      this.dateToday = this.parse(this.dateToday.setDate(buttonType == "week" ? this.dateToday.getDate() + 7 : this.dateToday.getDate() + 1));
      if (buttonType == "week") {
        this.isDay = 0;
        this.dayCount = 7;
        this.isNextDisable = true;
        this.isPreviousDisable = false;
      }
    }
    if (this.dateToday <= this.maxDate) {
      if (this.maxDate.toLocaleDateString() == this.dateToday.toLocaleDateString()) {
        this.dispalyForward = false;
      } else {
        this.dispalyForward = true;
      }
      this.dateFrom = this.dateToday;
      this.dateTo = this.dateToday;
      this.getTotalTimeSpentApplications();
    }
    else {
      this.dispalyForward = false;
      this.dateToday = this.maxDate;
      this.dateFrom = this.dateToday;
      this.dateTo = this.dateToday;
      this.getTotalTimeSpentApplications();
    }
  }

  dayTypeForTimeUsage(clickType) {
    this.isDay = 0;
    this.dayCount = 7;
    this.isNextDisable = true;
    this.isPreviousDisable = false;
    if (clickType == "day") {
      this.primaryDay = "primary";
      this.primaryWeek = "";
      this.primaryMonth = "";
      this.primaryDateRange = "";
      this.day = true;
      this.week = false;
      this.month = false;
      this.dateRange = false;
      this.days = Array(1).fill(1).map((x, i) => i);
      this.dateToday = new Date();
      this.dateFrom = this.dateToday;
      this.dateTo = this.dateToday;
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
    }
    else if (clickType == "week") {
      this.primaryDay = "";
      this.primaryWeek = "primary";
      this.primaryMonth = "";
      this.primaryDateRange = "";
      this.day = false;
      this.week = true;
      this.month = false;
      this.dateRange = false;
      this.type = "Week";
      this.days = Array(7).fill(1).map((x, i) => i);
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
      this.month = true;
      this.dateRange = false;
      this.type = "Month";
      const month = 0 + (this.date.getMonth() + 1);
      const year = this.date.getFullYear();
      var num = new Date(year, month, 0).getDate();
      this.days = Array(num).fill(num).map((x, i) => i);
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
      // if (this.fromDate) {
      //   this.setFromDate(this.dateFrom);
      //   this.setToDate(this.dateTo);
      // }
      // else {
      this.setDateFrom(new Date());
      this.setDateTo(new Date());
      this.rangeFrom = true;
      // }
    }
    this.dispalyForward = false;
    this.getTotalTimeSpentApplications();
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

  getMonthBasedOnDate(direction) {
    this.direction = direction;
    var monthValue;
    if (direction === 'right') {
      const day = this.monthDate.getDate();
      const month = 0 + (this.monthDate.getMonth() + 1) + 1;
      const year = this.monthDate.getFullYear();
      const newDate = day + '/' + month + '/' + year;
      this.monthDate = this.parse(newDate);
      this.selectedMonth = this.monthDate.toISOString();
      this.days = Array(num).fill(num).map((x, i) => i);
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
      var num = new Date(year, month, 0).getDate();
      this.days = Array(num).fill(num).map((x, i) => i);
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
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
      this.getTotalTimeSpentApplications();
    }
    else {
      this.dispalyForward = false;
      this.selectedMonth = this.maxDate.toISOString();
      this.dateFrom = this.maxDate;
    }
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

  getWeekBasedOnDate(direction) {
    this.direction = direction;
    if (direction === 'right') {
      const day = this.weekDate.getDate() + 7;
      const month = 0 + (this.weekDate.getMonth() + 1);
      const year = this.weekDate.getFullYear();
      const newDate = day + '/' + month + '/' + year;
      this.weekDate = this.parse(newDate);
      this.weekNumber = this.getWeekNumber(this.weekDate);
      let first = this.weekDate.getDate() - this.weekDate.getDay();
      let last = first + 6;
      if (first <= 0) {
        first = 1;
        this.dateFrom = new Date(this.parse(newDate).setDate(first));
        this.dateTo = new Date(this.parse(newDate).setDate(last));
      } else {
        this.dateFrom = new Date(this.weekDate.setDate(first));
        this.dateTo = new Date(this.parse(newDate).setDate(last));
      }
    } else {
      const day = this.weekDate.getDate() - 7;
      const month = 0 + (this.weekDate.getMonth() + 1);
      const year = this.weekDate.getFullYear();
      let newDate = day + '/' + month + '/' + year;
      this.weekDate = this.parse(newDate);
      this.weekNumber = this.getWeekNumber(this.parse(newDate));
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
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
      this.getTotalTimeSpentApplications();
    } else {
      this.dispalyForward = false;
      this.weekDate = this.parse(this.maxDate);
      this.weekNumber = this.getWeekNumber(this.weekDate);
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

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.dateToday = event.target.value;
    this.dateFrom = event.target.value;
    this.dateTo = event.target.value;
    this.setFromDate(this.dateFrom);
    this.setToDate(this.dateTo);
    this.getTotalTimeSpentApplications();
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
    this.getTotalTimeSpentApplications();
  }

  dateToChanged(event: MatDatepickerInputEvent<Date>) {
    this.toDate = event.target.value;
    this.setFromDate(this.minDate);
    this.setToDate(this.toDate);
    this.rangeFrom = false;
    this.getTotalTimeSpentApplications();
  }

  setDateFrom(date) {
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
    // this.dateFrom = date;
  }

  setDateTo(date) {

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
    // this.dateTo = date;
  }

  setFromDate(date) {
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
    // this.dateFrom = date;
  }

  setToDate(date) {
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
    // this.dateTo = date;
  }

  display(date1: string, date2: string) {
    if (date1.substring(0, 10) === date2.substring(0, 10)) {
      this.displayUi = 'block';
    }
    else {
      this.displayUi = 'none';
    }
  }

  getMyDate(date: any) {
    if (date)
      return date.substring(0, 10);
  }

  changeUser(value) {
    if (value == "") {
      // this.timeSheetSearch.userId = null;
      this.selectedUser = null;
      this.userId = null;
    }
    else {
      // this.timeSheetSearch.userId = value.toString();
      var employeesDropdown = this.employeesDropDown;
      var selectedEmployees = _.filter(employeesDropdown, function (employee) {
        return value.toString().includes(employee['teamMemberId']);
      })
      this.selectedUser = selectedEmployees.map(x => x['teamMemberName']).toString();
    }
    // this.getTotalTimeSpentApplications();
  }

  changeBranch(value) {
    if (value == "") {
      this.employeeOfRoleModel.branchId = value.branchId;
      // this.timeSheetSearch.branchId = value.branchId;
      this.branchId = null;
      this.selectedBranch = null;
    }
    else {
      this.employeeOfRoleModel.branchId = value.branchId;
      var branch = this.branchesList;
      var selectedBranches = _.filter(branch, function (branch) {
        return value.toString().includes(branch.branchId);
      })
      // this.timeSheetSearch.branchId = value.branchId;
      this.selectedBranch = selectedBranches.map(x => x.branchName).toString();
    }
    // this.getEmployees();
    // this.getTotalTimeSpentApplications();
  }

  changeRole(value) {
    if (value == "") {
      this.employeeOfRoleModel.roleId = null;
      // this.timeSheetSearch.roleId = null;
      this.roleId = null;
      this.selectedRole = null;
    }
    else {
      this.employeeOfRoleModel.roleId = value.toString();
      // this.timeSheetSearch.roleId = value.toString();
      var roles = this.rolesDropDown;
      var selectedRoles = _.filter(roles, function (role) {
        return value.toString().includes(role.roleId)
      })
      this.selectedRole = selectedRoles.map(z => z.roleName).toString();
    }
    // this.getEmployees();
    // this.getTotalTimeSpentApplications();
  }

  resetUser() {
    this.timeSheetSearch.userId = null;
    this.selectedUser = null;
    this.userId = null;
    this.getTotalTimeSpentApplications();
  }

  resetBranch() {
    this.employeeOfRoleModel.branchId = null;
    this.timeSheetSearch.branchId = null;
    this.branchId = null;
    this.selectedBranch = null;
    this.getEmployees();
    this.getTotalTimeSpentApplications();
  }

  resetRole() {
    this.employeeOfRoleModel.roleId = null;
    this.timeSheetSearch.roleId = null;
    this.roleId = null;
    this.selectedRole = null;
    this.getEmployees();
    this.getTotalTimeSpentApplications();
  }

  filterStatus() {
    // if (this.userId ||
    //   this.roleId ||
    //   this.branchId ||
    //   this.fromDate || this.toDate)
    if ((this.fromDate && this.dateRange) || (this.toDate && this.dateRange) || (this.selectedBranch) || (this.selectedRole) || (this.selectedUser))
      return true;
    else
      return false;
  }

  toggleBranchesPerOne() {
    if (this.allBranchesSelected.selected) {
      this.allBranchesSelected.deselect();
      this.isSelectAllBranches = false;
      this.employeeOfRoleModel.branchId = this.selectFilter.value.branchIds;
      this.getEmployees();
      this.timeSheetSearch.branchId = this.selectFilter.value.branchIds;
      this.getTotalTimeSpentApplications();
      return false;
    }
    if (this.selectFilter.get("branchIds").value.length === this.branchesList.length) {
      this.allBranchesSelected.select();
      this.isSelectAllBranches = true;
      this.employeeOfRoleModel.branchId = this.selectFilter.value.branchIds;
      this.getEmployees();
      this.timeSheetSearch.branchId = this.selectFilter.value.branchIds;
      this.getTotalTimeSpentApplications();
    }
    if (this.selectFilter.get("branchIds").value.length < this.branchesList.length) {
      this.allBranchesSelected.deselect();
      this.isSelectAllBranches = false;
      this.employeeOfRoleModel.branchId = this.selectFilter.value.branchIds;
      this.getEmployees();
      this.timeSheetSearch.branchId = this.selectFilter.value.branchIds;
      this.getTotalTimeSpentApplications();
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
    this.timeSheetSearch.branchId = this.selectFilter.value.branchIds;
    this.getTotalTimeSpentApplications();
  }

  toggleRolesPerOne() {
    if (this.allRolesSelected.selected) {
      this.allRolesSelected.deselect();
      this.isSelectAllRoles = false;
      this.employeeOfRoleModel.roleId = this.selectFilter.value.roleIds;
      this.getEmployees();
      this.timeSheetSearch.roleId = this.selectFilter.value.roleIds;
      this.getTotalTimeSpentApplications();
      return false;
    }
    if (this.selectFilter.get("roleIds").value.length === this.rolesDropDown.length) {
      this.allRolesSelected.select();
      this.isSelectAllRoles = true;
      this.employeeOfRoleModel.roleId = this.selectFilter.value.roleIds;
      this.getEmployees();
      this.timeSheetSearch.roleId = this.selectFilter.value.roleIds;
      this.getTotalTimeSpentApplications();
    }
    if (this.selectFilter.get("roleIds").value.length < this.rolesDropDown.length) {
      this.allRolesSelected.deselect();
      this.isSelectAllRoles = false;
      this.employeeOfRoleModel.roleId = this.selectFilter.value.roleIds;
      this.getEmployees();
      this.timeSheetSearch.roleId = this.selectFilter.value.roleIds;
      this.getTotalTimeSpentApplications();
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
    this.timeSheetSearch.roleId = this.selectFilter.value.roleIds;
    this.getTotalTimeSpentApplications();
  }

  toggleUsersPerOne() {
    if (this.allUsersSelected.selected) {
      this.allUsersSelected.deselect();
      this.isSelectAllUsers = false;
      this.timeSheetSearch.userId = this.selectFilter.value.userIds;
      this.getTotalTimeSpentApplications();
      return false;
    }
    if (this.selectFilter.get("userIds").value.length === this.employeesDropDown.length) {
      this.allUsersSelected.select();
      this.isSelectAllUsers = true;
      this.timeSheetSearch.userId = this.selectFilter.value.userIds;
      this.getTotalTimeSpentApplications();
    }
    if (this.selectFilter.get("userIds").value.length < this.employeesDropDown.length) {
      this.allUsersSelected.deselect();
      this.isSelectAllUsers = false;
      this.timeSheetSearch.userId = this.selectFilter.value.userIds;
      this.getTotalTimeSpentApplications();
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
    this.timeSheetSearch.userId = this.selectFilter.value.userIds;
    this.getTotalTimeSpentApplications();
  }

  roleSelected() {
    const branchLst = this.rolesDropDown;
    const selected = this.selectFilter.value.roleIds;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.filter(branchLst, function (member) {
      return selected.toString().includes(member.roleId);
    })
    const role = filteredList.map((x) => x.roleName);
    this.selectedRole = role.toString();
  }

  userSelected() {
    const branchLst = this.employeesDropDown;
    const selected = this.selectFilter.value.userIds;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.filter(branchLst, function (member) {
      return selected.toString().includes(member['teamMemberId']);
    })
    const user = filteredList.map((x) => x['teamMemberName']);
    this.selectedUser = user.toString();
  }

  getLoggedInUser() {
    this.timeUsageService.getLoggedInUser().subscribe((responseData: any) => {
      this.loggedUser = responseData.data.id;
    })
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
              if (index == -1)
                temp.push(element)
            }
          })
        }

        if (this.employeeOfRoleModel.roleId && this.employeeOfRoleModel.roleId.length > 0) {
          this.employeeOfRoleModel.roleId.forEach(roleId => {
            if (element.roleIds.includes(roleId)) {
              let index;
              index = temp.findIndex((x) => x.teamMemberId == element.teamMemberId);
              if (index == -1)
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
    this.timeSheetSearch.userId = this.selectFilter.value.userIds;
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

  getTotalTimeSpentApplications() {
    this.loading = true;
    this.timeSheetSearch.dateFrom = this.dateFrom;
    this.timeSheetSearch.dateTo = this.dateTo;
    let timeSheet = new TimeSheetSearchModel();
    timeSheet.userId = this.timeSheetSearch.userId;
    timeSheet.roleId = this.timeSheetSearch.roleId;
    timeSheet.branchId = this.timeSheetSearch.branchId;
    timeSheet.dateFrom = this.timeSheetSearch.dateFrom;
    timeSheet.dateTo = this.dateTo;
    timeSheet.isForDashboard = true;
    timeSheet.pageSize = this.pageSize;
    timeSheet.pageNumber = this.pageNumber + 1;
    timeSheet.sortBy = this.sortBy;
    timeSheet.sortDirectionAsc = this.sortDirectionAsc;
    this.timeUsageService.getTotalTimeSpentApplications(timeSheet).subscribe((responseData: any) => {
      if (responseData.success == true && responseData.data && responseData.data.length > 0) {
        this.timeUsage = responseData.data;
        this.dates = responseData.data[0].dates;
        this.maxTotal = responseData.data[0].totalTime;
        this.neutralTotal = responseData.data[0].neutral;
        this.totalCount = responseData.data[0].totalCount
      }
      else {
        this.timeUsage = [];
        this.dates = [];
        this.totalCount = 0;
        this.maxTotal = 0;
        this.neutralTotal = 0;
      }
      if (this.multiPage == "true") {
        this.introStart();
        this.multiPage = null;
      }
      this.loading = false;
    })
  }

  drillDown(selectedDate, user, type) {
    // alert(selectedDate + " " + user + " " + type);
    let timeUsage = new TimeUsageDrillDownModel();
    timeUsage.userId = user;
    timeUsage.dateFrom = selectedDate;
    timeUsage.dateTo = selectedDate;
    timeUsage.applicationType = type;
    const dialogRef = this.dialog.open(TimeUsageDrillDownComponent, {
      height: "75%",
      width: "45%",
      hasBackdrop: true,
      direction: "ltr",
      data: { user: timeUsage.userId, dateFrom: timeUsage.dateFrom, dateTo: timeUsage.dateTo, applicationType: timeUsage.applicationType },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log("The dialog was closed");
    });
  }

  openActivityTrackerDetails(selectedDate, row, type, timeUsage) {
    let dialogId = "activity-tracker-dialog";
    let totalTimeInMin = timeUsage.totalTime;
    let usageTime = timeUsage.totalTime - timeUsage.idleTime;

    if (timeUsage.totalTime) {
      totalTimeInMin = timeUsage.totalTime / 60;
      totalTimeInMin = Math.floor(totalTimeInMin);
    }

    if (usageTime) {
      usageTime = usageTime / 60;
      usageTime = Math.floor(usageTime);
    }

    const activityDialog = this.dialog.open(this.activityTrackerDialogComponent, {
      width: "79%",
      minHeight: "85vh",
      id: dialogId,
      data: {
        dialogId: dialogId,
        trackerParameters: {
          userId: row.userId, dateFrom: selectedDate, dateTo: selectedDate,
          profileImage: row.profileImage, totalTime: totalTimeInMin, usageTime: usageTime, employeeName: row.name, type: type
        }
      },
    });
    activityDialog.afterClosed().subscribe((result) => {

    });
  }

  covertTimeIntoUtcTime(inputTime) {
    if (inputTime == null || inputTime == "")
      return null;

    let dateNow = moment(inputTime);
    if (dateNow.isValid() && typeof (inputTime) != "string") {
      return moment.utc(dateNow)
    }
    if (typeof (inputTime) === "string") {
      var current = new Date();
      var timeSplit = inputTime.toString().split(":");
      current.setHours(+timeSplit[0], +timeSplit[1], null, null);
      return moment.utc(current)
    }
  }

  convertUtcToLocal(inputTime) {
    if (inputTime == null || inputTime == "")
      return null;

    let dateNow = moment(inputTime);
    if (dateNow.isValid() && typeof (inputTime) != "string") {
      let formatted = dateNow.format('YYYY-MM-DD HH:mm:ss');
      return moment(moment.utc(formatted).format()).local()
    }
    if (typeof (inputTime) === "string") {
      var current = new Date();
      var timeSplit = inputTime.toString().split(":");
      current.setHours(+timeSplit[0], +timeSplit[1], null, null);
      let formatted = moment(current).format('YYYY-MM-DD HH:mm:ss');
      return moment(moment.utc(formatted).format()).local()
    }
  }

  previous() {
    if (this.dayCount == 7) {
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
      if (this.canAccess_feature_ViewEmployeeAppTrackerCompleteReport) {
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

  calculateWidth(details, type) {
    if(this.isIdleView && details) {
      let productive = details.productiveTime && details.productiveTime != 0  ? details.productiveTime : 0;
      let unProductive = details.unProductiveTime && details.unProductiveTime != 0  ? details.unProductiveTime : 0;
      let neutral = details.neutralTime && details.neutralTime != 0  ? details.neutralTime : 0;
      let idle = details.idleTime && details.idleTime != 0  ? details.idleTime : 0;
      let total = productive + unProductive + neutral + idle;
      if(type == 'productive') {
        return (productive/total)*100;
      }
      if(type == 'unProductive') {
        return (unProductive/total)*100;
      }
      if(type == 'neutral') {
        return (neutral/total)*100;
      }
      if(type == 'idle') {
        return (idle/total)*100;
      }

    }
    else if(!this.isIdleView && details) {
      let productive = details.productiveTime && details.productiveTime != 0  ? details.productiveTime : 0;
      let unProductive = details.unProductiveTime && details.unProductiveTime != 0  ? details.unProductiveTime : 0;
      let neutral = details.neutralTime && details.neutralTime != 0  ? details.neutralTime : 0;
      let total = productive + unProductive + neutral;
      if(type == 'productive') {
        return (productive/total)*100;
      }
      if(type == 'unProductive') {
        return (unProductive/total)*100;
      }
      if(type == 'neutral') {
        return (neutral/total)*100;
      }
    }
    else {
      return 0;
    }
  }

  totalTime(details) {
    if(this.isIdleView && details) {
      return details.totalTime;
    } else if(!this.isIdleView && details) {
      let idleTime = details.idleTime && details.idleTime != 0  ? details.idleTime : 0
      let withoutIdle = details.totalTime - idleTime;
      return withoutIdle;
    }
  }
}
