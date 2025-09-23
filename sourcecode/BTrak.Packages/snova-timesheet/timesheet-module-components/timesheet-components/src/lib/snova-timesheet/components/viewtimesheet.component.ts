import { DatePipe } from "@angular/common"
import { ChangeDetectorRef, Component, ElementRef, ViewChild, ViewChildren, Input, OnInit, TemplateRef } from "@angular/core";
import {  MatDialog, MatDialogRef} from "@angular/material/dialog";
import {  MatButton} from "@angular/material/button";
import {  MatDatepickerInputEvent} from "@angular/material/datepicker";
import { DateAdapter,  MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { Router } from "@angular/router";
import { BranchModel, TimeSheetManagementSearchInputModel } from "../models/timesheet-model";
import { TimeSheetService } from "../services/timesheet.service";
import { ToastrService } from "ngx-toastr";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { viewTimeSheetMonthlyComponent } from './timesheet-monthly.component';
import "../../globaldependencies/helpers/fontawesome-icons";
import { GridSettings } from '../models/grid-settings.model';
import { GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from "@progress/kendo-data-query";
import { Persistance } from '../models/persistance.model';
import { PersistanceService } from '../services/persistance.service';
import { CustomQueryHeadersModel } from '../models/custom-query-headers.model';
import { TranslateService } from '@ngx-translate/core';
import { BreakTimeDisplayComponent } from './break-timings-dialog.component';
import { TimeZoneDataPipe } from '../../globaldependencies/pipes/timeZoneData.pipe';
import * as moment_ from "moment";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
const moment = moment_;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: "app-hr-component-viewtimesheet",
  templateUrl: "viewtimesheet.component.html",
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class ViewTimeSheetComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren("feedTimeSheetpopup") feedTimeSheetPopover;
  @ViewChildren("absentpopup") absentPopover;
  @ViewChildren("permissionpopup") permissionPopover;
  @ViewChild("removeAllBtn") removeAllBtn: ElementRef<MatButton>;
  @ViewChild('openBreakDialogComponent') openBreakDialogComponent: TemplateRef<any>;
  @ViewChild('openMonthlyTimesheetDialogComponent') openMonthlyTimesheetDialogComponent: TemplateRef<any>;
  @ViewChild("activityTrackerDialog") private activityTrackerDialogComponent: TemplateRef<any>;
  @ViewChild("workDrillDownDialog") private workDrillDownDialog: TemplateRef<any>;
  downloadExcel: boolean;

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  public gridSettings: GridSettings = {
    state: {
      skip: 0,
      take: 30,

      filter: {
        logic: "and",
        filters: []
      }
    },
    gridData: { data: [], total: 0 },
    selectedTimeZoneType: 0,
    columnsConfig: []
  };

  dashboardFilters: DashboardFilterModel;
  timeSheetDetails: any[] = [];
  branchDetails: BranchModel[];
  cursor = 'default';
  scrollbarH: boolean;
  sortBy: string = 'employeeName';
  onLoadEmployeeNameSorting = true;
  customAppPersistance: any[] = [];
  sortDirection = true;
  branchId = "";
  referenceId: string = 'D362607E-D77E-4FA7-B458-5022735E0DB8';
  showFilters = false;
  public grid: GridComponent;
  selectedUserId: string
  searchText = "";
  latestInsertedTrackerDate: any;
  dateFrom2: Date = new Date();
  dateFormat: string;
  timeSheetLoading = false;
  pagedatahigh = false;
  feedtimesheetpopupdata: any;
  feedtimesheeteditpopup: boolean;
  absentpopupdata: any;
  absentpopup: boolean;
  permissionpopupdata: any;
  permissionpopup: boolean;
  isEditForPermissionFeedTimeSheet: boolean;
  isEditForAbsentFeedTimeSheet: boolean;
  isEditForFeedTimeSheet: boolean;
  userId: string;
  softLabels: SoftLabelConfigurationModel[];
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  breakDetails: any[] = [];
  open = true;
  dialogClose: boolean = false;
  downloadInProgress: boolean = false;
  columns: CustomQueryHeadersModel[] = [
    {
      field: 'employeeName',
      hidden: false,
      filter: '',
      orderIndex: 0,
      maxLength: 1000,
      width: 100,
      title: 'TIMESHEET.EMPLOYEENAME'
    }
    ,
    {
      field: 'inTime',
      hidden: false,
      filter: '',
      orderIndex: 1,
      maxLength: 1000,
      width: 80,
      title: 'TIMESHEET.STARTTIME'
    },
    {
      field: 'outTime',
      hidden: false,
      filter: '',
      orderIndex: 2,
      maxLength: 1000,
      width: 80,
      title: 'TIMESHEET.FINISHTIME'
    },
    {
      field: 'spentTimeDiff',
      hidden: false,
      filter: '',
      orderIndex: 3,
      maxLength: 1000,
      width: 100,
      title: 'ACTIVITYTRACKER.TOTALTIME'
    },
    {
      field: 'lunchBreakDiff',
      hidden: true,
      filter: '',
      orderIndex: 4,
      maxLength: 1000,
      width: 80,
      title: 'ACTIVITYTRACKER.PUNCHCARDLUNCH'
    },
    {
      field: 'userBreaks',
      hidden: true,
      filter: '',
      orderIndex: 5,
      maxLength: 1000,
      width: 80,
      title: 'ACTIVITYTRACKER.PUNCHCARDBREAK'
    },
    // {
    //   field: 'activitygroup',
    //   hidden: false,
    //   filter: '',
    //   orderIndex: 6,
    //   maxLength: 1000,
    //   width: 100,
    //   title: 'ACTIVITYTRACKER.ACTIVITYTRACKER'
    // },
    // {
    //   field: 'totalActiveTimeInMin',
    //   hidden: false,
    //   filter: '',
    //   orderIndex: 10,
    //   maxLength: 1000,
    //   width: 100,
    //   title: 'ACTIVITYTRACKER.TOTALTIME'
    // },
    {
      field: 'activeTimeInMin',
      hidden: false,
      filter: '',
      orderIndex: 6,
      maxLength: 1000,
      width: 100,
      title: 'ACTIVITYTRACKER.SYSTEMUSAGETIME'
    },
    {
      field: 'totalIdleTime',
      hidden: false,
      filter: '',
      orderIndex: 7,
      maxLength: 1000,
      width: 100,
      title: 'ACTIVITYTRACKER.SYSTEMIDLETIME'
    },
    {
      field: 'productiveTimeInMin',
      hidden: false,
      filter: '',
      orderIndex: 8,
      maxLength: 1000,
      width: 100,
      title: 'ACTIVITYTRACKER.SYSTEMPRODUCTIVETIME'
    },
    {
      field: 'screenshots',
      hidden: false,
      filter: '',
      orderIndex: 9,
      maxLength: 1000,
      width: 100,
      title: 'ACTIVITYTRACKER.NOOFSCREENSHOTS'
    },
    {
      field: 'loggedTime',
      hidden: false,
      filter: '',
      orderIndex: 10,
      maxLength: 1000,
      width: 150,
      title: 'ACTIVITYTRACKER.TIMESPENTONONWORKITEM'
    },
    {
      field: 'leaveTypeName',
      hidden: false,
      filter: '',
      orderIndex: 12,
      maxLength: 1000,
      width: 100,
      title: 'LEAVETYPES.LEAVETYPESTITLE'
    },
    {
      field: 'leaveSessionName',
      hidden: false,
      filter: '',
      orderIndex: 13,
      maxLength: 1000,
      width: 100,
      title: 'WIDGETNAMES.Leave session'
    },
    {
      field: 'statusName',
      hidden: false,
      filter: '',
      orderIndex: 14,
      maxLength: 1000,
      width: 140,
      title: 'TIMESHEET.SUBMISSIONSTATUS'
    }
    // {
    //   field: 'createdDateTime',
    //   hidden: false,
    //   filter: '',
    //   orderIndex: 9,
    //   maxLength: 1000,
    //   width: 100,
    //   title: 'TIMESHEET.FEEDEDTIME'
    // },
  ];
  defaultColumns: CustomQueryHeadersModel[] = [
    {
      field: 'employeeName',
      hidden: false,
      filter: '',
      orderIndex: 0,
      maxLength: 1000,
      width: 100,
      title: 'TIMESHEET.EMPLOYEENAME'
    }
    ,
    {
      field: 'inTime',
      hidden: false,
      filter: '',
      orderIndex: 1,
      maxLength: 1000,
      width: 80,
      title: 'TIMESHEET.STARTTIME'
    },
    {
      field: 'outTime',
      hidden: false,
      filter: '',
      orderIndex: 2,
      maxLength: 1000,
      width: 80,
      title: 'TIMESHEET.FINISHTIME'
    },
    {
      field: 'spentTimeDiff',
      hidden: false,
      filter: '',
      orderIndex: 3,
      maxLength: 1000,
      width: 100,
      title: 'ACTIVITYTRACKER.TOTALTIME'
    },
    {
      field: 'lunchBreakDiff',
      hidden: true,
      filter: '',
      orderIndex: 4,
      maxLength: 1000,
      width: 80,
      title: 'ACTIVITYTRACKER.PUNCHCARDLUNCH'
    },
    {
      field: 'userBreaks',
      hidden: true,
      filter: '',
      orderIndex: 5,
      maxLength: 1000,
      width: 80,
      title: 'ACTIVITYTRACKER.PUNCHCARDBREAK'
    },
    // {
    //   field: 'activitygroup',
    //   hidden: false,
    //   filter: '',
    //   orderIndex: 6,
    //   maxLength: 1000,
    //   width: 100,
    //   title: 'ACTIVITYTRACKER.ACTIVITYTRACKER'
    // },
    // {
    //   field: 'totalActiveTimeInMin',
    //   hidden: false,
    //   filter: '',
    //   orderIndex: 10,
    //   maxLength: 1000,
    //   width: 100,
    //   title: 'ACTIVITYTRACKER.TOTALTIME'
    // },
    {
      field: 'activeTimeInMin',
      hidden: false,
      filter: '',
      orderIndex: 6,
      maxLength: 1000,
      width: 100,
      title: 'ACTIVITYTRACKER.SYSTEMUSAGETIME'
    },
    {
      field: 'totalIdleTime',
      hidden: false,
      filter: '',
      orderIndex: 7,
      maxLength: 1000,
      width: 100,
      title: 'ACTIVITYTRACKER.SYSTEMIDLETIME'
    },
    {
      field: 'productiveTimeInMin',
      hidden: false,
      filter: '',
      orderIndex: 8,
      maxLength: 1000,
      width: 100,
      title: 'ACTIVITYTRACKER.SYSTEMPRODUCTIVETIME'
    },
    {
      field: 'screenshots',
      hidden: false,
      filter: '',
      orderIndex: 9,
      maxLength: 1000,
      width: 100,
      title: 'ACTIVITYTRACKER.NOOFSCREENSHOTS'
    },
    {
      field: 'loggedTime',
      hidden: false,
      filter: '',
      orderIndex: 10,
      maxLength: 1000,
      width: 150,
      title: 'ACTIVITYTRACKER.TIMESPENTONONWORKITEM'
    },
    {
      field: 'leaveTypeName',
      hidden: false,
      filter: '',
      orderIndex: 12,
      maxLength: 1000,
      width: 100,
      title: 'LEAVETYPE.LEAVETYPENAME'
    },
    {
      field: 'leaveSessionName',
      hidden: false,
      filter: '',
      orderIndex: 13,
      maxLength: 1000,
      width: 100,
      title: 'LEAVESESSION.LEAVESESSIONNAME'
    },
    {
      field: 'statusName',
      hidden: false,
      filter: '',
      orderIndex: 14,
      maxLength: 1000,
      width: 140,
      title: 'TIMESHEET.SUBMISSIONSTATUS'
    }
    // {
    //   field: 'createdDateTime',
    //   hidden: false,
    //   filter: '',
    //   orderIndex: 9,
    //   maxLength: 1000,
    //   width: 100,
    //   title: 'TIMESHEET.FEEDEDTIME'
    // },
  ];
  lunchToolTipValue: string;
  showLunchBreakTooltip = false;
  isPersistanceLoaded = false;
  totalCount: number = 0;
  downloadfromDate: Date = new Date();
  downloadtoDate: Date = new Date();

  /* DAY / WEEK / MONTH FILTER */
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
  days: number[] = [1];
  direction: any;
  type: string = ConstantVariables.Month;
  primaryDay: string = "primary";
  primaryWeek: string;
  primaryMonth: string;
  primaryDateRange: string;
  day: boolean = true;
  week: boolean;
  month: boolean;
  dateRange: boolean;
  rangeFrom: boolean;
  dispalyForward: boolean = false;
  /* DAY / WEEK / MONTH FILTER */
  fullHeight: boolean = false;
  currentUserTimeZoneName: string = null;
  currentUserTimeZoneOffset: string = null;
  currentUserTimeZoneAbbr: string = null;
  selectedTimeZoneType: number = 0;

  constructor(
    private router: Router, private persistanceService: PersistanceService, private timeSheetService: TimeSheetService,
    private cdRef: ChangeDetectorRef, private timZonePipe: TimeZoneDataPipe, private datePipe: DatePipe,
    public dialogRef: MatDialogRef<viewTimeSheetMonthlyComponent>, public dialog: MatDialog,
    private translateService: TranslateService, private toaster: ToastrService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    // this.getAllBranches();
    this.getEntityDropDown();
    this.getAllTimeSheetDetails();
    if (this.router.url.includes('/activitytracker/activitydashboard/timesheet')) {
      this.fullHeight = true;
    }
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  absentPopupOpen(row, absentPopover) {
    this.absentpopupdata = row;
    this.absentpopup = true;
    this.isEditForAbsentFeedTimeSheet = true;
    absentPopover.openPopover();
  }

  permissionPopupOpen(row, permissionpopup) {
    this.permissionpopupdata = row;
    this.permissionpopup = true;
    this.isEditForPermissionFeedTimeSheet = true;
    permissionpopup.openPopover();
  }

  getUserCurrentTimeZone(value) {
    if (value == 0) {
      this.currentUserTimeZoneName = null;
      this.currentUserTimeZoneOffset = null;
      this.currentUserTimeZoneAbbr = null;

    } else if (value == 1) {
      var userModel = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
      this.currentUserTimeZoneName = userModel.currentTimeZoneName;
      this.currentUserTimeZoneOffset = userModel.currentTimeZoneOffset;
      this.currentUserTimeZoneAbbr = userModel.currentTimeZoneAbbr;
    }
    this.saveGridSettings();
    this.cdRef.detectChanges();
  }

  continueWithActualTimeZone() {
    this.currentUserTimeZoneName = null;
    this.currentUserTimeZoneOffset = null;
    this.currentUserTimeZoneAbbr = null;
    this.cdRef.detectChanges();
  }


  openDialog(dataItem) {
    let dialogId = 'monthly-timings-user';
    const dialogRef = this.dialog.open(this.openMonthlyTimesheetDialogComponent, {
      height: 'auto',
      width: '1420px',
      disableClose: false,
      id: dialogId,
      data: {
        userId: dataItem.userId,
        ofYear: new Date(this.dateFrom2).getFullYear(),
        onMonth: new Date(this.dateFrom2).getMonth(),
        employeeName: dataItem.employeeName,
        profileImage: dataItem.userProfileImage,
        currentUserTimeZoneName: this.currentUserTimeZoneName,
        currentUserTimeZoneAbbr: this.currentUserTimeZoneAbbr,
        currentUserTimeZoneOffset: this.currentUserTimeZoneOffset,
        list: this.timeSheetDetails,
        dialogId: dialogId
      },
    });
  }

  getAllBranches() {
    this.timeSheetService.getAllBranches(new BranchModel()).subscribe((responseData: any) => {
      this.branchDetails = responseData.data;
      this.cdRef.markForCheck();
    });
  }

  checkLunchBreakTooltip(row) {
    this.lunchToolTipValue = "";
    this.showLunchBreakTooltip = false;
    if ((row.lunchBreakStartTime != null) && (row.lunchBreakEndTime != null)) {
      var startAbbr = (this.currentUserTimeZoneName && this.currentUserTimeZoneName != null && this.currentUserTimeZoneName != 'null') ? "" : row.lunchStartAbbreviation;
      var endAbbr = (this.currentUserTimeZoneName && this.currentUserTimeZoneName != null && this.currentUserTimeZoneName != 'null') ? "" : row.lunchEndAbbreviation;
      this.lunchToolTipValue = "(" + this.timZonePipe.transform(row.lunchBreakStartTime, "HH:mm", this.currentUserTimeZoneOffset ) + " " + startAbbr + " - " + this.timZonePipe.transform(row.lunchBreakEndTime, "HH:mm", this.currentUserTimeZoneOffset) + " " + endAbbr + ")";
      this.showLunchBreakTooltip = true;
    } else if (row.lunchBreakStartTime != null) {
      this.lunchToolTipValue = this.translateService.instant('TIMESHEET.LUNCHSTARTON');
      this.showLunchBreakTooltip = true;
    }
  }

  viewUserBreakDetails(dataItem) {
    this.breakDetails = [];
    if (dataItem.userBreaksCount > 0) {
      const breakDetails = JSON.parse(dataItem.userBreaks);
      this.breakDetails = breakDetails.Breaks;
      let dialogId = 'break-timings-user';
      const dialogRef = this.dialog.open(this.openBreakDialogComponent, {
        width: "25vw",
        maxHeight: "50vh",
        disableClose: false,
        id: dialogId,
        data: {
          breakDetails: dataItem.userBreaks, dialogId: dialogId,
          currentUserTimeZoneName: this.currentUserTimeZoneName,
          currentUserTimeZoneAbbr: this.currentUserTimeZoneAbbr,
          currentUserTimeZoneOffset: this.currentUserTimeZoneOffset
        }
      });
    }
  }

  removeHandler() { }

  search() {
    if (this.searchText && this.searchText.trim().length <= 0) { return; }
    this.searchText = this.searchText.trim();
    this.getAllTimeSheetDetails();
  }

  closeSearch() {
    this.searchText = "";
    this.getAllTimeSheetDetails();
  }

  onDateChange2(event: MatDatepickerInputEvent<Date>) {
    this.dateFrom2 = event.target.value;
    this.getAllTimeSheetDetails();
  }

  timeSheetDetailsForDay(clickType, buttonType) {
    this.dateFrom2 = new Date(this.dateFrom2);
    if (clickType === "backward") {
      this.dateFrom2 = this.parse(this.dateFrom2.setDate(buttonType === "week" ? this.dateFrom2.getDate() - 7 : this.dateFrom2.getDate() - 1));
    } else {
      this.dateFrom2 = this.parse(this.dateFrom2.setDate(buttonType === "week" ? this.dateFrom2.getDate() + 7 : this.dateFrom2.getDate() + 1));
    }
    this.getAllTimeSheetDetails();
  }

  parse(value: any): Date | null {
    if ((typeof value === "string") && (value.indexOf("/") > -1)) {
      const str = value.split("/");
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    } else if ((typeof value === "string") && value === "") {
      return new Date();
    }
    const timestamp = typeof value === "number" ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  getAllTimeSheetDetails() {
    this.dateFormat = this.datePipe.transform(this.dateFrom2, "yyyy-MMMM-dd");
    this.timeSheetLoading = true;
    const timeSheetManagementSearchInputModel = new TimeSheetManagementSearchInputModel();
    timeSheetManagementSearchInputModel.sortBy = this.gridSettings ? this.gridSettings.state ? this.gridSettings.state ? this.gridSettings.state.sort ? this.gridSettings.state.sort[0] ?  this.gridSettings.state.sort[0].field : this.sortBy : this.sortBy : this.sortBy : this.sortBy : this.sortBy;
    timeSheetManagementSearchInputModel.sortDirectionAsc = this.gridSettings ? this.gridSettings.state ? this.gridSettings.state ? this.gridSettings.state.sort ?  this.gridSettings.state.sort[0] ? this.gridSettings.state.sort[0].dir == 'asc' ? true : false : this.sortDirection : this.sortDirection : this.sortDirection : this.sortDirection : this.sortDirection;
    timeSheetManagementSearchInputModel.employeeSearchText = this.searchText;
    timeSheetManagementSearchInputModel.entityId = this.selectedEntity;
    timeSheetManagementSearchInputModel.dateFrom = this.dateFormat;
    timeSheetManagementSearchInputModel.dateTo = this.dateFormat;
    timeSheetManagementSearchInputModel.includeEmptyRecords = true;
    this.timeSheetService.getTimeSheetDetails(timeSheetManagementSearchInputModel).subscribe((responseData: any) => {
      this.timeSheetLoading = false;
      this.timeSheetDetails = responseData.data != null && responseData.data != undefined ? responseData.data : [];
      this.totalCount = this.timeSheetDetails.length > 0 ? this.timeSheetDetails[0].totalCount : 0;
      this.latestInsertedTrackerDate = this.totalCount > 0 ? this.timeSheetDetails[0].latestInsertedTrackerDate : null;
      if (!this.isPersistanceLoaded) {
        this.isPersistanceLoaded = true;
        this.getPersistance();
      } else {
        this.gridSettings.state.skip = 0;
        this.gridSettings.state.take = 30;
        this.gridSettings.state.filter = {
          logic: "and",
          filters: []
        };
        this.gridSettings.gridData = { data: [], total: 0 };
        this.loadData(this.gridSettings.state);
      }
      this.cdRef.markForCheck();
    });
  }

  submitcloseFeedTimeSheetPopover() {
    this.closeFeedTimeSheetPopover();
    this.getAllTimeSheetDetails();
  }

  editFeedTimeSheetPopupOpen(row, feedTimeSheetpopup) {
    this.isEditForFeedTimeSheet = true;
    this.feedtimesheeteditpopup = true;
    this.feedtimesheetpopupdata = row;
    feedTimeSheetpopup.openPopover();
  }

  closeabsentPopover() {
    this.absentPopover.forEach((p) => p.closePopover());
    this.absentPopover = false;
    this.absentpopupdata = "";
    this.isEditForAbsentFeedTimeSheet = false;
  }
  closeFeedTimeSheetPopover() {
    this.feedTimeSheetPopover.forEach((p) => p.closePopover());
    this.feedtimesheeteditpopup = false;
    this.feedtimesheetpopupdata = "";
    this.isEditForPermissionFeedTimeSheet = false;
  }
  submitcloseabsentPopover() {
    this.closeabsentPopover();
    this.getAllTimeSheetDetails();
  }

  closepermissionPopover() {
    this.permissionPopover.forEach((p) => p.closePopover());
    this.permissionpopup = false;
    this.permissionpopupdata = "";
    this.isEditForPermissionFeedTimeSheet = false;
  }

  goToProfile(url) {
    this.router.navigateByUrl("dashboard/profile/" + url);
  }

  getEntityDropDown() {
    let searchText = "";
    this.timeSheetService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      else {
        this.entities = responseData.data;
      }
    });
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.getAllTimeSheetDetails();
  }

  filterClick() {
    this.open = !this.open;
  }

  refreshData() {
    this.selectedEntity = "";
    this.searchText = "";
    this.gridSettings.state.skip = 0;
    this.gridSettings.state.take = 30;
    this.gridSettings.state.filter = {
      logic: "and",
      filters: []
    };
    this.cdRef.detectChanges();
    this.saveGridSettings();
    this.getAllTimeSheetDetails();
  }

  getTodaysData() {
    this.selectedEntity = "";
    this.searchText = "";
    this.dateFrom2 = new Date();
    this.gridSettings.state.skip = 0;
    this.gridSettings.state.take = 30;
    this.gridSettings.state.filter = {
      logic: "and",
      filters: []
    };
    this.cdRef.detectChanges();
    this.saveGridSettings();
    this.getAllTimeSheetDetails();
  }

  pageChange({ skip, take }: PageChangeEvent): void {
    this.gridSettings.state.skip = skip;
    this.gridSettings.state.take = take;
    this.loadData(this.gridSettings.state);
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.gridSettings.gridData = process(this.timeSheetDetails, state);
    this.saveGridSettings();
  }

  public onReorder(e: any): void {
    const reorderedColumn = this.gridSettings.columnsConfig.splice(e.oldIndex, 1);
    this.gridSettings.columnsConfig.splice(e.newIndex, 0, ...reorderedColumn);
    this.gridSettings.columnsConfig.forEach((column, i) => {
      column.orderIndex = i;
    });
    this.saveGridSettings();
  }

  public onResize(e: any): void {
    e.forEach((item) => {
      this.gridSettings.columnsConfig.find((col) => col.field === item.column.field).width = item.newWidth;
    });
    this.saveGridSettings();
  }

  public onVisibilityChange(e: any): void {
    e.columns.forEach((column) => {
      this.gridSettings.columnsConfig.find((col) => col.field === column.field).hidden = column.hidden;
    });
    this.saveGridSettings();
  }

  public saveGridSettings(): void {
    if (this.referenceId) {
      const persistance = new Persistance();
      persistance.referenceId = this.referenceId;
      persistance.isUserLevel = true;
      this.gridSettings.selectedTimeZoneType = this.selectedTimeZoneType;
      persistance.persistanceJson = JSON.stringify(this.gridSettings);
      this.persistanceService.UpsertPersistance(persistance).subscribe(() => {
      });
    }
  }

  getPersistance() {
    if (this.referenceId) {
      this.timeSheetLoading = true;
      const persistance = new Persistance();
      persistance.referenceId = this.referenceId;
      persistance.isUserLevel = true;
      this.persistanceService.GetPersistance(persistance).subscribe((response: any) => {
        if (response.success) {
          const data = response.data;
          if (data && data.persistanceJson) {
            this.timeSheetLoading = false;
            this.gridSettings = this.mapGridSettings(JSON.parse(data.persistanceJson));
            this.selectedTimeZoneType = this.gridSettings.selectedTimeZoneType ? this.gridSettings.selectedTimeZoneType : 0;
            // this.columns = this.gridSettings.columnsConfig;
            this.cdRef.detectChanges();
            this.getUserCurrentTimeZone(this.selectedTimeZoneType);
            this.loadData(this.gridSettings.state);
          } else {
            this.timeSheetLoading = false;
            this.selectedTimeZoneType = 0;
            this.gridSettings = this.mapGridSettings(null);
            this.getUserCurrentTimeZone(this.selectedTimeZoneType);
            this.loadData(this.gridSettings.state);
          }
        } else {
          this.selectedTimeZoneType = 0;
          this.timeSheetLoading = false;
          this.getUserCurrentTimeZone(this.selectedTimeZoneType);
          this.cdRef.detectChanges();
        }
      });
    } else {
      this.selectedTimeZoneType = 0;
      this.gridSettings = this.mapGridSettings(null);
      this.getUserCurrentTimeZone(this.selectedTimeZoneType);
      this.cdRef.detectChanges();
      this.loadData(this.gridSettings.state);

    }
  }

  public mapGridSettings(gridSetting: any) {
    if (gridSetting) {
      const state = gridSetting.state;
      if (gridSetting.state) {
        this.mapDateFilter(state.filter);
      }
      let gridSettignsNew = new GridSettings();
      gridSettignsNew.selectedTimeZoneType = gridSetting.selectedTimeZoneType;
      gridSettignsNew.state = state;
      gridSettignsNew.columnsConfig = gridSetting.columnsConfig ? gridSetting.columnsConfig.sort((a, b) => a.orderIndex - b.orderIndex) : null;
      gridSettignsNew.gridData = state ? process(this.timeSheetDetails, state) : null;
      return gridSettignsNew;
    } else {
      let gridSettignsNew = new GridSettings();
      gridSettignsNew.state = {
        skip: 0,
        take: 30,
        filter: {
          logic: "and",
          filters: []
        }
      }
      const state = gridSettignsNew.state;
      if (gridSettignsNew.state) {
        this.mapDateFilter(state.filter);
      }
      gridSettignsNew.columnsConfig = [...this.columns];
      gridSettignsNew.selectedTimeZoneType = 0;
      gridSettignsNew.gridData = state ? process(this.timeSheetDetails, state) : null;
      return gridSettignsNew;
    }
  }

  private mapDateFilter = (descriptor: any) => {
    const filters = descriptor.filters || [];

    filters.forEach((filter) => {
      if (filter.filters) {
        this.mapDateFilter(filter);
      }
    });
  }

  private loadData(state: State): void {
    this.gridSettings.gridData = process(this.timeSheetDetails, state);
    if (this.gridSettings.columnsConfig.length == 0) {
      this.gridSettings.columnsConfig = [...this.columns];
    }
    this.timeSheetLoading = false;
    this.cdRef.detectChanges();
  }
  checkVisibility(fieldName) {
    let index =this.gridSettings.columnsConfig.findIndex(x => x.field == fieldName);
    if (index != -1) {
      return this.gridSettings.columnsConfig[index].hidden;
    }
    else {
      return false;
    }
  }

  openActivityTrackerDetails(dataItem, type) {
    let dialogId = "app-activity-tracker-dialog";
    const activityDialog = this.dialog.open(this.activityTrackerDialogComponent, {
      width: "79%",
      minHeight: "85vh",
      id: dialogId,
      data: {
        dialogId: dialogId, trackerParameters: {
          userId: dataItem.userId, dateFrom: dataItem.date, dateTo: dataItem.date,
          profileImage: dataItem.userProfileImage, totalTime: dataItem.totalActiveTimeInMin,
          usageTime: dataItem.activeTimeInMin, employeeName: dataItem.employeeName, type: type, rowData: dataItem
        }
      },
    });
    activityDialog.afterClosed().subscribe((result) => {

    });
  }

  openWorkDrillDown(dataItem) {
    let dialogId = "work-drilldown-dialogue";
    const dialog = this.dialog.open(this.workDrillDownDialog, {
      width: "50%",
      maxHeight: "85vh",
      id: dialogId,
      data: {
        dialogId: dialogId, trackerParameters: {
          userId: dataItem.userId, dateFrom: dataItem.date, dateTo: dataItem.date
        }
      },
    });
    dialog.afterClosed().subscribe((result) => {
      this.cdRef.detectChanges();
    });
  }

  downloadFile() {
    this.downloadInProgress = true;

    this.downloadfromDate = this.dateFrom;
    this.downloadtoDate = this.dateTo;

    var fromdate = this.datePipe.transform(this.downloadfromDate, "yyyy-MM-dd");
    var toDate = this.datePipe.transform(this.downloadtoDate, "yyyy-MM-dd");
    var startDate = moment(this.downloadfromDate, "DD.MM.YYYY");
    var endDate = moment(this.downloadtoDate, "DD.MM.YYYY");
    var dayDiff = endDate.diff(startDate, 'days') + 1;
    this.downloadExcel = true;
    const timeSheetManagementSearchInputModel = new TimeSheetManagementSearchInputModel();
    // if (this.onLoadEmployeeNameSorting) {
    timeSheetManagementSearchInputModel.sortBy = "Date";
    // } else {
    //   timeSheetManagementSearchInputModel.sortBy = this.sortBy;
    // }
    timeSheetManagementSearchInputModel.employeeSearchText = this.searchText;
    timeSheetManagementSearchInputModel.sortDirectionAsc = this.sortDirection;
    timeSheetManagementSearchInputModel.entityId = this.selectedEntity;
    timeSheetManagementSearchInputModel.dateFrom = fromdate;
    timeSheetManagementSearchInputModel.dateTo = toDate;
    timeSheetManagementSearchInputModel.includeEmptyRecords = true;
    timeSheetManagementSearchInputModel.pageNumber = 1;
    timeSheetManagementSearchInputModel.pageSize = this.totalCount * dayDiff;
    var d = new Date();
    timeSheetManagementSearchInputModel.timeZone = d.getTimezoneOffset();
    this.timeSheetService.downloadTimesheet(timeSheetManagementSearchInputModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        let filePath = responseData.data;
        this.downloadExcel = false;
        this.cdRef.detectChanges();
        if (filePath.blobUrl) {
          const parts = filePath.blobUrl.split(".");
          const fileExtension = parts.pop();

          if (fileExtension == 'pdf') {
          } else {
            const downloadLink = document.createElement("a");
            downloadLink.href = filePath.blobUrl;
            downloadLink.download = filePath.fileName
            downloadLink.click();
          }
        }
      } else {
        this.cdRef.detectChanges();
        this.downloadExcel = false;
      }
      this.downloadInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  /* DAY / WEEK / MONTH FILTER */
  navigateTo(clickType, buttonType) {
    this.dateToday = new Date(this.dateToday);
    if (clickType == "backward") {
      this.dateToday = this.parse(this.dateToday.setDate(buttonType == "week" ? this.dateToday.getDate() - 7 : this.dateToday.getDate() - 1));
    }
    else {
      this.dateToday = this.parse(this.dateToday.setDate(buttonType == "week" ? this.dateToday.getDate() + 7 : this.dateToday.getDate() + 1));
    }

    this.dateFrom = this.dateToday;
    this.dateTo = this.dateToday;
  }

  dateFilterType(clickType) {
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

      //this.dateToday = new Date();
      this.dateToday = new Date(this.dateFrom2);

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

      // this.weekDate = new Date();
      // var dateLocal = new Date();

      this.weekDate = new Date(this.dateFrom2);
      var dateLocal = new Date(this.dateFrom2);

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

      // this.fromDate = new Date();
      // this.toDate = new Date();

      this.fromDate = new Date(this.dateFrom2);
      this.toDate = new Date(this.dateFrom2);

      this.dateFrom = this.fromDate;
      this.dateTo = this.fromDate;

      this.setDateFrom(this.dateFrom);
      this.setDateTo(this.dateTo);

      this.rangeFrom = true;
    }
    this.dispalyForward = false;
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

    this.setDateFrom(this.dateFrom);
    this.setDateTo(this.dateTo);
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

    this.setDateFrom(this.dateFrom);
    this.setDateTo(this.dateTo);
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
  }

  dateToChanged(event: MatDatepickerInputEvent<Date>) {
    this.toDate = event.target.value;
    //this.setFromDate(this.minDate);
    this.setToDate(this.toDate);
    this.rangeFrom = false;
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

  setFromDate(date) {
    var day = date._i["date"];
    const month = 0 + (date._i["month"] + 1);
    const year = date._i["year"];
    var newDate = day + '/' + month + '/' + year;
    this.fromDate = this.parse(newDate);
    this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
  }

  setToDate(date) {
    var day = date._i["date"];
    const month = 0 + (date._i["month"] + 1);
    const year = date._i["year"];
    var newDate = day + '/' + month + '/' + year;
    this.toDate = this.parse(newDate);
    this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
  }
  /* DAY / WEEK / MONTH FILTER */


}
