import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Router } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
import { HRManagementService } from '../../services/hr-management.service';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { GetProductivityDetails } from '../../models/productivity-models/getProductivityDetails.models';
import { ProductivityService } from '../../services/productivity.service';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { Productivityfilters } from '../../models/productivity-dashboard-filters.model';
import * as moment_ from 'moment';
const moment = moment_
import { Moment } from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-productivity-dashboard-container',
  templateUrl: './productivity-dashboard-container.component.html',
  styleUrls: ['./productivity-dashboard-container.component.css']
})

export class ProductivityDashboardContainerComponent extends CustomAppBaseComponent {
  @Output() getResults = new EventEmitter<any>();
  @ViewChild('filterMenuTrigger') filterMenuTrigger: MatMenuTrigger;
  productivityDashboardFilter: DashboardFilterModel;
  filterApplied: any;
  userProfileImage: any;
  username: any;
  isAnyOperationInProgress: boolean = true;
  userDetails: any;
  productivityAndQualityStats: any;
  capacityHours: any;
  plannedHours: any;
  deliveredHours: any;
  totalSpentHours: any;
  isAnyOprationInProgress: boolean = true;
  productivityStats; any;
  isMyProductivityDashboard: boolean;
  primaryDay: string;
  primaryWeek: string;
  primaryMonth: string = "primary";
  primaryDateRange: string;
  primaryYear: string;
  primaryQuarter: string;
  dateToday: Date;
  dateFrom: Date = new Date();
  dateTo: Date = new Date();
  maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1);
  datestring: string;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  isNextDisable: boolean;
  isDay: number;
  dayCount: number;
  isPreviousDisable: boolean;
  day: boolean;
  week: boolean;
  month: boolean;
  dateRange: boolean;
  days: number[] = [1];
  type: string;
  weekDate: Date = new Date();
  date: Date = new Date();
  weekNumber: number;
  monthDate: Date = new Date();
  yearDate: Date = new Date();
  selectedMonth: any;
  rangeFrom: boolean;
  dispalyForward: boolean = false;
  selectedWeek: any;
  direction: any;
  filterType: any = null;
  minDate = new Date();
  year: boolean;
  selectedYear: any;
  quarterNo: number;
  selectedQuarterYear: string;
  quarterYear: boolean;
  Quarterno: number;
  quarterDate: Date;
  productivityfilters: Productivityfilters;
  linemanagerForm: FormGroup;
  linemanagersList: any;
  isBranchProductivityDashboard: boolean;
  lineManagerId: any = null;
  isOpen: boolean = true;
  lineManagerFilter: any;
  lineManagerSelection: boolean;
  isCompanyProductivityDashboard: boolean;
  employeesDropDown: any;
  userId: any = null;
  isTeamProductivityDashboard: boolean;
  branchesList: any[];
  branchId: any = null;
  lineManagerProfileImage: any;
  lineManagerName: any;
  userFiltername: any;
  branchName: any;
  today: Date;
  loadingCompelete: any = false;
  insightsloadingCompelete: any;
  statsloadingCompelete: any;
  DashboardFilter: DashboardFilterModel;
  singleDate: string = null;
  branchMembersList: any
  fromDatemoment: Date;
  userProfile: any = null;
  clearEnable: boolean = false;
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.DashboardFilter = data;
    }
  };

  constructor(private router: Router, private cdRef: ChangeDetectorRef, private productivityService: ProductivityService, private translateService: TranslateService, @Inject(MAT_DATE_FORMATS) private dateFormats) {
    super();
    this.maxDate.setHours(this.maxDate.getHours() + 5);
    this.maxDate.setMinutes(this.maxDate.getMinutes() + 30);
  }

  ngOnInit() {
    this.userId = null
    this.dateFormats.display.dateInput = "DD MMM YYYY";
    if (this.router.url.includes('productivity/dashboard/myproductivity')) {
      this.isMyProductivityDashboard = true;
      this.isBranchProductivityDashboard = false;
      this.isTeamProductivityDashboard = false;
      this.isCompanyProductivityDashboard = false;
      this.filterType = 'Individual';
    }
    else if (this.router.url.includes('productivity/dashboard/myteamproductivity')) {
      this.isMyProductivityDashboard = false;
      this.isBranchProductivityDashboard = false;
      this.isTeamProductivityDashboard = true;
      this.isCompanyProductivityDashboard = false;
      this.filterType = 'Team';
    }
    else if (this.router.url.includes('productivity/dashboard/companyproductivity')) {
      this.isMyProductivityDashboard = false;
      this.isBranchProductivityDashboard = false;
      this.isCompanyProductivityDashboard = true;
      this.isTeamProductivityDashboard = false;
      this.filterType = 'Company';
    }
    else if (this.router.url.includes('productivity/dashboard/branchproductivity')) {
      this.isMyProductivityDashboard = false;
      this.isBranchProductivityDashboard = true;
      this.isTeamProductivityDashboard = false;
      this.isCompanyProductivityDashboard = false;
      this.filterType = 'Branch';
    }
    this.getLineManagers();
    this.getAllEmployees();
    this.getAllBranches();
    this.getBranchMembers();
    this.userDetails = JSON.parse(localStorage.getItem('UserModel'));
    this.userProfileImage = this.userDetails.profileImage;
    this.username = this.userDetails.fullName;
    if ((this.DashboardFilter.dateFrom || this.DashboardFilter.dateTo || this.DashboardFilter.date) && this.DashboardFilter.date != 'thisMonth') {
      if ((this.DashboardFilter.dateFrom && this.DashboardFilter.dateTo) || this.DashboardFilter.date) {
        this.primaryDay = "";
        this.primaryWeek = "";
        this.primaryMonth = "";
        this.primaryDateRange = "primary";
        this.primaryYear = "";
        this.primaryQuarter = "";
        this.day = false;
        this.week = false;
        this.month = false;
        this.dateRange = true;
        this.year = false;
        this.quarterYear = false;
        this.rangeFrom = true
        if (this.DashboardFilter.date) {
          this.singleDate = this.DashboardFilter.date.includes('-') ? this.DashboardFilter.date : null
        }
        this.dateFrom = new Date(this.singleDate ? this.singleDate : this.DashboardFilter.dateFrom);
        this.dateTo = new Date(this.singleDate ? this.singleDate : this.DashboardFilter.dateTo);
        this.setDateFrom(this.dateFrom);
        this.setDateTo(this.dateTo);
        // this.minDate = this.dateFrom;
      }
      this.functionForResults();
    }
    else if ((this.DashboardFilter && this.DashboardFilter.date == 'thisMonth') || !this.DashboardFilter) {
      this.dayTypeForTimeUsage("month");
    }
    else {
      this.dayTypeForTimeUsage("month");
    }
    this.cdRef.detectChanges();
  }


  changeLineManager(event) {
    if (event.value) {
      this.lineManagerId = event.value;
      var index = this.linemanagersList.findIndex(x => x.userId == this.lineManagerId);
      this.lineManagerProfileImage = this.linemanagersList[index].profileImage;
      this.lineManagerName = this.linemanagersList[index].userName;
      this.filterType = 'Team';
      this.userId = null;
      this.branchId = null;
      this.filterMenuTrigger.closeMenu();
      // this.userFiltername = null;
      // this.branchName = null;
      this.functionForResults();
      this.cdRef.detectChanges();
    }
  }

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  removeFilter() {
    this.clearEnable = false;
    if (this.isTeamProductivityDashboard) {
      this.filterType = 'Team';
    }
    else if (this.isBranchProductivityDashboard) {
      this.filterType = 'Branch';
    }
    else if (this.isCompanyProductivityDashboard) {
      this.filterType = 'Company'
    }
    this.lineManagerId = null;
    this.userId = null;
    this.branchId = null;
    this.lineManagerName = null;
    this.userFiltername = null;
    this.branchName = null;
    this.functionForResults();
    this.cdRef.detectChanges();
  }

  getLineManagers() {
    var searchText = '';
    this.productivityService.getLineManagers(searchText).subscribe((res: any) => {
      if (res.success == true) {
        this.linemanagersList = res.data;
      }
      this.cdRef.detectChanges();
    });
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.dateToday = event.target.value;
    this.datestring = moment(this.dateToday).format('DD-MMM-YYYY')
    this.dateFrom = event.target.value;
    this.dateTo = event.target.value;
    this.setFromDate(this.dateFrom);
    this.setToDate(this.dateTo);
    var maxDatestring: Date = new Date(this.maxDate.toLocaleDateString());
    if (this.dateFrom < maxDatestring) {
      this.dateRange = false;
      this.dispalyForward = true;
    }
    else {
      this.dispalyForward = false;
    }
    this.functionForResults();
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
  getbackwordToolTip() {
    var tooltip = '';
    if (this.day) {
      tooltip = this.translateService.instant("TIMESHEET.ONEDAYBACKWARD");
    }
    else if (this.week) {
      tooltip = this.translateService.instant("TIMESHEET.ONEWEEKBACKWARD");
    }
    else if (this.month) {
      tooltip = this.translateService.instant("PRODUCTIVITY.MONTHBACKWORD")
    }
    else if (this.year) {
      tooltip = this.translateService.instant("PRODUCTIVITY.YEARBACKWORD")
    }
    else if (this.quarterYear) {
      tooltip = this.translateService.instant("PRODUCTIVITY.QUARTERYEARBACKWORD")
    }
    return tooltip;
  }
  getforwordToolTip() {
    var tooltip = '';
    if (this.day) {
      tooltip = this.translateService.instant("TIMESHEET.ONEDAYFORWARD");
    }
    else if (this.week) {
      tooltip = this.translateService.instant("TIMESHEET.ONEWEEKFORWARD");
    }
    else if (this.month) {
      tooltip = this.translateService.instant("PRODUCTIVITY.MONTHFORWORD")
    }
    else if (this.year) {
      tooltip = this.translateService.instant("PRODUCTIVITY.YEARFORWORD")
    }
    else if (this.quarterYear) {
      tooltip = this.translateService.instant("PRODUCTIVITY.QUARTERYEARFORWORD")
    }
    return tooltip;
  }
  dayTypeForTimeUsage(clickType) {
    this.isDay = 0;
    this.dayCount = 7;
    this.isNextDisable = true;
    this.isPreviousDisable = false;
    if (clickType == "day") {
      this.primaryDay = "primary";
      this.primaryQuarter = "";
      this.primaryWeek = "";
      this.primaryMonth = "";
      this.primaryYear = "";
      this.primaryDateRange = "";
      this.day = true;
      this.week = false;
      this.month = false;
      this.dateRange = false;
      this.quarterYear = false;
      this.year = false;
      ////this.days = Array(1).fill(1).map((x, i) => i);
      this.dateToday = new Date();
      this.dateToday.setDate(this.dateToday.getDate() - 1);
      this.datestring = moment(this.dateToday).format('DD-MMM-YYYY')
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
      this.primaryQuarter = "";
      this.primaryYear = "";
      this.day = false;
      this.week = true;
      this.month = false;
      this.dateRange = false;
      this.year = false;
      this.quarterYear = false;
      this.type = "Week";
      //this.days = Array(7).fill(1).map((x, i) => i);
      this.weekDate = new Date();
      this.weekDate.setDate(this.weekDate.getDate() - 1);
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
      this.primaryQuarter = "";
      this.primaryYear = "";
      this.day = false;
      this.week = false;
      this.month = true;
      this.dateRange = false;
      this.year = false;
      this.quarterYear = false;
      this.type = "Month";
      // const month = 0 + (this.date.getMonth() + 1);
      // const year = this.date.getFullYear();
      //var num = new Date(year, month, 0).getDate();
      //this.days = Array(num).fill(num).map((x, i) => i);
      this.monthDate = new Date();
      this.monthDate.setDate(this.monthDate.getDate() - 1);
      this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
      this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
      this.selectedMonth = this.monthDate.toISOString();
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
    }
    else if (clickType == "quarter") {
      this.primaryDay = "";
      this.primaryWeek = "";
      this.primaryMonth = "";
      this.primaryQuarter = "primary";
      this.primaryDateRange = "";
      this.primaryYear = "";
      this.day = false;
      this.week = false;
      this.month = false;
      this.dateRange = false;
      this.quarterYear = true;
      this.year = false;
      this.type = "Month";
      // const month = 0 + (this.date.getMonth() + 1);
      // const year = this.date.getFullYear();
      //var num = new Date(year, month, 0).getDate();
      //this.days = Array(num).fill(num).map((x, i) => i);
      this.quarterDate = new Date();
      this.quarterDate.setDate(this.quarterDate.getDate() - 1);
      this.quarterNo = (this.quarterDate.getMonth() + 1) / 3;
      this.dateTo = this.QuarterEnddate(this.quarterDate, Math.ceil(this.quarterNo));
      this.dateFrom = this.QuarterStartdate(this.dateTo);
      this.selectedQuarterYear = this.dateFrom.toISOString();
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
      this.Quarterno = Math.ceil(this.quarterNo)
    }
    else if (clickType == "year") {
      this.primaryDay = "";
      this.primaryWeek = "";
      this.primaryMonth = "";
      this.primaryYear = "primary";
      this.primaryDateRange = "";
      this.primaryQuarter = "";
      this.day = false;
      this.week = false;
      this.month = false;
      this.dateRange = false;
      this.quarterYear = false;
      this.year = true;
      this.type = "Year";
      //const year = this.date.getFullYear();
      // var num = new Date(year, 0, 0).getDate();
      //this.days = Array(num).fill(num).map((x, i) => i);
      this.yearDate = new Date();
      this.yearDate.setDate(this.yearDate.getDate() - 1);
      this.dateFrom = new Date(this.yearDate.getFullYear(), 0, 1);
      this.dateTo = new Date(this.yearDate.getFullYear() + 1, 0, 0);
      this.selectedYear = this.yearDate.toISOString();
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
    }
    else {
      this.primaryDay = "";
      this.primaryWeek = "";
      this.primaryMonth = "";
      this.primaryDateRange = "primary";
      this.primaryYear = "";
      this.primaryQuarter = "";
      this.day = false;
      this.week = false;
      this.month = false;
      this.dateRange = true;
      this.year = false;
      this.quarterYear = false;
      this.fromDate = new Date();
      this.fromDate.setDate(this.fromDate.getDate() - 1);
      this.toDate = new Date();
      this.toDate.setDate(this.toDate.getDate() - 1);
      this.dateFrom = this.fromDate;
      this.dateTo = this.toDate;
      this.rangeFrom = true
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
    }
    this.dispalyForward = false;
    this.functionForResults();
  }
  setDateFrom(date) {
    var day = date.getDate();
    const month = 0 + (date.getMonth() + 1);
    const year = date.getFullYear();
    var newDate = day + '/' + month + '/' + year;
    this.fromDate = this.parse(newDate);
    this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
  }

  setDateTo(date) {
    var day = date.getDate();
    const month = 0 + (date.getMonth() + 1);
    const year = date.getFullYear();
    var newDate = day + '/' + month + '/' + year;
    this.toDate = this.parse(newDate);
    this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
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
      this.functionForResults();
    }
    else {
      this.dispalyForward = false;
      this.dateToday = this.maxDate;
      this.dateFrom = this.dateToday;
      this.dateTo = this.dateToday;
      this.functionForResults();
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
      this.functionForResults();
    } else {
      this.dispalyForward = false;
      this.weekDate = this.parse(this.maxDate);
      this.weekNumber = this.getWeekNumber(this.weekDate);
      this.dateFrom = this.maxDate;
    }
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
      //this.days = Array(num).fill(num).map((x, i) => i);
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
      //this.days = Array(num).fill(num).map((x, i) => i);
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
      this.functionForResults();
    }
    else {
      this.dispalyForward = false;
      this.selectedMonth = this.maxDate.toISOString();
      this.dateFrom = this.maxDate;
    }
  }
  getYearBasedOnDate(direction) {
    this.direction = direction;
    var yearValue;
    if (direction === 'right') {
      const day = this.yearDate.getDate();
      const month = 0 + (this.yearDate.getMonth() + 1);
      const year = this.yearDate.getFullYear() + 1;
      const newDate = day + '/' + month + '/' + year;
      this.yearDate = this.parse(newDate);
      this.selectedYear = this.yearDate.toISOString();
      //this.days = Array(num).fill(num).map((x, i) => i);
      this.dateFrom = new Date(this.yearDate.getFullYear(), 0, 1);
      this.dateTo = new Date(this.yearDate.getFullYear() + 1, 0, 0);
      yearValue = this.yearDate.getFullYear();
    } else {
      const day = this.yearDate.getDate();
      const month = (this.yearDate.getMonth() + 1);
      const year = 0 + this.yearDate.getFullYear() - 1;
      const newDate = day + '/' + month + '/' + year;
      this.yearDate = this.parse(newDate);
      this.selectedYear = this.yearDate.toISOString();
      var num = new Date(year, month, 0).getDate();
      //this.days = Array(num).fill(num).map((x, i) => i);
      this.dateFrom = new Date(this.yearDate.getFullYear(), 0, 1);
      this.dateTo = new Date(this.yearDate.getFullYear() + 1, 0, 0);
      yearValue = this.yearDate.getFullYear();
    }
    if (this.dateFrom <= this.maxDate) {
      if ((this.maxDate.getFullYear()) == yearValue) {
        this.dispalyForward = false;
      } else {
        this.dispalyForward = true;
      }
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
      this.functionForResults();
    }
    else {
      this.dispalyForward = false;
      this.selectedMonth = this.maxDate.toISOString();
      this.dateFrom = this.maxDate;
    }
  }
  getQuarterBasedOnDate(direction) {
    this.direction = direction;
    var yearValue;
    if (direction === 'right') {
      const day = this.quarterDate.getDate();
      const month = 0 + (this.quarterDate.getMonth() + 1) + 3;
      const year = this.quarterDate.getFullYear();
      const newDate = day + '/' + month + '/' + year;
      this.quarterDate = this.parse(newDate);
      this.selectedQuarterYear = this.quarterDate.toISOString();
      //this.days = Array(num).fill(num).map((x, i) => i);
      this.quarterNo = (this.quarterDate.getMonth() + 1) / 3;
      this.dateTo = this.QuarterEnddate(this.quarterDate, Math.ceil(this.quarterNo))
      this.dateFrom = this.QuarterStartdate(this.dateTo);
      this.Quarterno = Math.ceil(this.quarterNo)
      yearValue = this.quarterDate.getFullYear();
    } else {
      const day = this.quarterDate.getDate();
      const month = (this.quarterDate.getMonth() + 1) - 3;
      const year = 0 + this.quarterDate.getFullYear();
      const newDate = day + '/' + month + '/' + year;
      this.quarterDate = this.parse(newDate);
      this.selectedQuarterYear = this.quarterDate.toISOString();
      var num = new Date(year, month, 0).getDate();
      //this.days = Array(num).fill(num).map((x, i) => i);
      this.quarterNo = (this.quarterDate.getMonth() + 1) / 3;
      this.dateTo = this.QuarterEnddate(this.quarterDate, Math.ceil(this.quarterNo))
      this.dateFrom = this.QuarterStartdate(this.dateTo);
      this.Quarterno = Math.ceil(this.quarterNo)
      yearValue = this.quarterDate.getFullYear();
    }
    if (this.dateFrom <= this.maxDate) {
      var presentDay = new Date();
      presentDay.setDate(presentDay.getDate() - 1);
      var presentQuarter = Math.ceil((presentDay.getMonth() + 1) / 3);
      var presentYear = this.maxDate.getFullYear();
      if (presentYear == yearValue && presentQuarter == this.Quarterno) {
        this.dispalyForward = false;
      } else {
        this.dispalyForward = true;
      }
      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);
      this.functionForResults();
    }
    else {
      this.dispalyForward = false;
      this.selectedMonth = this.maxDate.toISOString();
      this.dateFrom = this.maxDate;
    }
  }
  getForwordValues() {
    if (this.day) {
      this.timeSheetDetailsForDay('forward', 'day');
      this.next();
    }
    else if (this.week) {
      this.getWeekBasedOnDate('right')
    }
    else if (this.month) {
      this.getMonthBasedOnDate('right')
    }
    else if (this.year) {
      this.getYearBasedOnDate('right')
    }
    else if (this.quarterYear) {
      this.getQuarterBasedOnDate('right')
    }
  }
  getBackwordValues() {
    if (this.day) {
      this.timeSheetDetailsForDay('backward', 'day');
      this.previous()
    }
    else if (this.week) {
      this.getWeekBasedOnDate('left')
    }
    else if (this.month) {
      this.getMonthBasedOnDate('left')
    }
    else if (this.year) {
      this.getYearBasedOnDate('left')
    }
    else if (this.quarterYear) {
      this.getQuarterBasedOnDate('left')
    }
  }
  dateFromChanged(event: MatDatepickerInputEvent<Date>) {
    this.fromDate = event.target.value;
    this.fromDatemoment = event.target.value
    this.minDate = this.fromDate;
    this.setFromDate(this.fromDate);
    if (this.toDate < this.fromDate) {
      this.toDate = this.fromDate;
    }
    // if (this.rangeFrom) {
    this.setDateTo(this.toDate);
    // } else {
    //   this.setToDate(this.toDate);
    // }
    this.functionForResults();
  }

  dateToChanged(event: MatDatepickerInputEvent<Date>) {
    this.toDate = event.target.value;
    this.setFromDate(this.fromDatemoment);
    this.setToDate(this.toDate);
    // this.rangeFrom = false;
    this.functionForResults();
  }

  public QuarterEnddate(curDate: Date, whichQtr: number) {
    const month = whichQtr * 3;
    const toDate = new Date(curDate.getFullYear(), month, 0);
    return toDate;
  }
  public QuarterStartdate(quarterEnddate: Date) {
    const fromDate = new Date(quarterEnddate.getFullYear(), quarterEnddate.getMonth() + 1 - 3, 1);
    return fromDate;
  }
  functionForResults() {
    this.productivityfilters = new Productivityfilters();
    //this.productivityfilters.dateFrom = this.dateFrom;
    var hereDateFrom = new Date(this.dateFrom);
    this.today = new Date(new Date().toISOString().slice(0, 10));
    if (hereDateFrom >= this.today) {
      this.today.setDate(this.today.getDate() - 1);
      this.dateFrom = new Date(this.today.toISOString().slice(0, 10));
    }
    var hereDateTo = new Date(this.dateTo);
    this.today = new Date(new Date().toISOString().slice(0, 10));
    if (hereDateTo >= this.today) {
      this.today.setDate(this.today.getDate() - 1);
      this.dateTo = new Date(this.today.toISOString().slice(0, 10));
    }
    this.productivityfilters.dateFrom = this.dateFrom;
    this.productivityfilters.dateTo = this.dateTo;
    this.productivityfilters.lineManagerId = this.lineManagerId;
    this.productivityfilters.filterType = this.filterType;
    this.productivityfilters.userId = this.userId;
    this.productivityfilters.branchId = this.branchId;
    this.minDate = this.dateFrom;
    this.fromDate = this.dateFrom
    this.toDate = this.dateTo;
    this.getResults.emit(this.productivityfilters);
  }
  getAllEmployees() {
    var teamMemberModel;
    if (this.isCompanyProductivityDashboard) {
      teamMemberModel = {
        isForTracker: true
      }
    }
    else {
      teamMemberModel = {
        isForTracker: false
      }
    }
    teamMemberModel.isArchived = false;
    this.productivityService.getTeamLeadsList(teamMemberModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.employeesDropDown = responseData.data;
      }
      if (this.DashboardFilter && this.DashboardFilter.userId) {
        //this.userId = this.DashboardFilter.userId;
        this.setUser(this.DashboardFilter.userId);
      }
      else {
        this.userId = null;
      }
      this.cdRef.detectChanges();
    })
  }
  getAllBranches() {
    this.productivityService.getBranchesList().subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.branchesList = responseData.data;
      }
      this.cdRef.detectChanges();
    })
  }
  getBranchMembers() {
    var branchIdModel;
    branchIdModel = {
      branchId: null
    }
    this.productivityService.getBranchMembers(branchIdModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.branchMembersList = responseData.data;
      }
      this.cdRef.detectChanges();
    })
  }
  changeUser(event) {
    if (event.value) {
      this.userId = event.value;
      var index = this.employeesDropDown.findIndex(x => x.teamMemberId == this.userId);
      this.userFiltername = this.employeesDropDown[index].teamMemberName;
      this.userProfile = this.employeesDropDown[index].profileImage;
      this.filterType = 'Individual';
      this.lineManagerId = null;
      this.branchId = null;
      // this.lineManagerName = null;
      // this.branchName = null;
      this.filterMenuTrigger.closeMenu();
      this.functionForResults();
      this.cdRef.detectChanges();
    }
  }
  changeBranchUser(event) {
    if (event.value) {
      this.userId = event.value;
      var index = this.branchMembersList.findIndex(x => x.userId == this.userId);
      this.userFiltername = this.branchMembersList[index].userName;
      this.userProfile = this.branchMembersList[index].profileImage;
      this.filterType = 'Individual';
      this.lineManagerId = null;
      this.branchId = null;
      // this.lineManagerName = null;
      // this.branchName = null;
      this.filterMenuTrigger.closeMenu();
      this.functionForResults();
      this.cdRef.detectChanges();
    }
  }
  setUser(userId) {
    this.userId = userId ? userId : null;
    var index = this.employeesDropDown.findIndex(x => x.teamMemberId == this.userId);
    this.userFiltername = this.employeesDropDown[index].teamMemberName;
    this.userProfile = this.employeesDropDown[index].profileImage;
    this.filterType = 'Individual';
    this.lineManagerId = null;
    this.branchId = null;
    // this.lineManagerName = null;
    // this.branchName = null;
    this.filterMenuTrigger.closeMenu();
    this.functionForResults();
    this.cdRef.detectChanges();
  }
  changeBranch(event) {
    if (event.value) {
      this.branchId = event.value;
      this.branchName = this.branchesList.find(x => x.branchId == this.branchId).branchName;
      this.filterType = 'Branch';
      this.lineManagerId = null;
      this.userId = null;
      this.filterMenuTrigger.closeMenu();
      // this.lineManagerName = null;
      // this.userFiltername = null;
      this.functionForResults();
      this.cdRef.detectChanges();
    }
  }
  getDateFormat(ev: any) {
    this.toDate = ev
  }
  insightsloadComplete(IsLoadComplete) {
    this.insightsloadingCompelete = IsLoadComplete;
    if (this.insightsloadingCompelete && this.statsloadingCompelete) {
      this.loadingCompelete = true;
    }
  }
  statsloadComplete(IsLoadComplete) {
    this.statsloadingCompelete = IsLoadComplete;
    if (this.insightsloadingCompelete && this.statsloadingCompelete) {
      this.loadingCompelete = true;
    }
  }
}
