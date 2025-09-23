import { Component, ChangeDetectorRef, ChangeDetectionStrategy, Inject, ViewChildren, EventEmitter, Output, ViewChild, ElementRef, Input, OnInit, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA , MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Page } from '../models/Page';
import { TimeSheetService } from '../services/timesheet.service';
import { TimeSheetManagementSearchInputModel } from '../models/timesheet-model';
import "../../globaldependencies/helpers/fontawesome-icons";
import { CustomQueryHeadersModel } from '../models/custom-query-headers.model';
import { TranslateService } from '@ngx-translate/core';
import { GridSettings } from '../models/grid-settings.model';
import { process, State } from "@progress/kendo-data-query";
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { BreakTimeDisplayComponent } from './break-timings-dialog.component'
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { Persistance } from '../models/persistance.model';
import { PersistanceService } from '../services/persistance.service';
import { TimeZoneDataPipe } from '../../globaldependencies/pipes/timeZoneData.pipe';
import * as _ from "underscore";

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


export interface DialogData {
  userId: string;
  employeeName: string;
  profileImage: string;
  list: any[];
}


@Component({
  selector: 'timesheet-monthly-component-viewTimeSheetMonthly',
  templateUrl: `timesheet-monthly.component.html`,
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class viewTimeSheetMonthlyComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChild('removeAllBtn') removeAllBtn: ElementRef<MatButton>;
  @ViewChildren("feedTimeSheetpopup") feedTimeSheetPopover;
  @ViewChildren("absentpopup") absentPopover;
  @ViewChildren("permissionpopup") permissionPopover;
  @ViewChild('openBreakDialogComponent') openBreakDialogComponent: TemplateRef<any>;
  @Output() closetimesheetMonthlyPopup = new EventEmitter<string>();
  @Output() closefeedtimesheetPopup = new EventEmitter<string>();
  @Output() submitclosefeedtimesheetPopup = new EventEmitter<string>();
  @Output() closeabsentPopup = new EventEmitter<string>();
  @Output() submitcloseabsentPopup = new EventEmitter<string>();
  @Output() closepermissionPopup = new EventEmitter<string>();
  @ViewChild("activityTrackerDialog") private activityTrackerDialogComponent: TemplateRef<any>;
  @ViewChild("workDrillDownDialog") private workDrillDownDialog: TemplateRef<any>;
  @Input("data")
  set _data(data: any) {
    if (data && data !== undefined) {
      this.currentDialogId = data[0].dialogId;
      this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
      let timeSheetdata = data[0];
      this.selectedUserId = timeSheetdata.userId;
      this.selectedEmployeeId = timeSheetdata.userId;
      this.employeeName = timeSheetdata.employeeName;
      this.userName = timeSheetdata.employeeName;
      this.profileImage = timeSheetdata.profileImage;
      this.currentUserTimeZoneName = data[0].currentUserTimeZoneName;
      this.currentUserTimeZoneOffset = data[0].currentUserTimeZoneOffset;
      this.currentUserTimeZoneAbbr = data[0].currentUserTimeZoneAbbr;
      this.list = timeSheetdata.list;
      this.onMonth = timeSheetdata.onMonth;
      this.ofYear = timeSheetdata.ofYear;
      this.timeSheetList = timeSheetdata.list;
      this.dateTo = new Date() > new Date(this.ofYear, this.onMonth + 1, 0) ? new Date(this.ofYear, this.onMonth + 1, 0) : new Date();
      this.dateFrom = new Date(this.dateTo.getFullYear(), this.dateTo.getMonth(), 1);
      this.minDate = this.dateFrom;
      this.getViewTimeSheet();
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
  dateTo = new Date();
  currentUserTimeZoneName: string = null;
  currentUserTimeZoneOffset: string = null;
  currentUserTimeZoneAbbr: string = null;
  onMonth: any;
  ofYear: any;
  dateFrom = new Date(this.dateTo.getFullYear(), this.dateTo.getMonth(), 1);
  maxDate = new Date();
  timeSheetDetails: any[];
  list: any[];
  currentDialog: any;
  currentDialogId: any;
  minDate = this.dateFrom;
  dateFromValue: Date;
  dateToValue: Date;
  userId: string;
  userName: string;
  employeeName: string = null;
  profileImage: string = null;
  referenceId: string = 'DEB11B68-78B4-4F23-98A9-923C7EB6DFA7';
  Date: any;
  isAnyOperationIsInprogress: boolean;
  sortBy: string;
  sortDirection: boolean;
  validationMessage: string;
  cursor = 'default';
  softLabels: SoftLabelConfigurationModel[];
  dateFromSelected: Date;
  dateToSelected: Date;
  isEditForPermissionFeedTimeSheet: boolean;
  feedtimesheetpopupdata: any;
  feedtimesheeteditpopup: boolean;
  isEditForFeedTimeSheet: boolean;
  absentpopupdata: any;
  absentpopup: boolean;
  isPersistanceLoaded = false;
  isEditForAbsentFeedTimeSheet: boolean;
  permissionpopupdata: any;
  permissionpopup: boolean;
  selectedUserId: string;
  selectedEmployeeId: string;
  downloadInProgress: boolean = false;
  timeSheetList: any[];
  columns: CustomQueryHeadersModel[] = [
    {
      field: 'date',
      hidden: false,
      filter: '',
      orderIndex: 0,
      maxLength: 1000,
      width: 80,
      title: 'VIEWTIMESHEET.DATE'
    },
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
      width: 130,
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
      field: 'leaveReason',
      hidden: true,
      filter: '',
      orderIndex: 11,
      maxLength: 1000,
      width: 100,
      title: 'TIMESHEETSUBMISSION.ISONLEAVE'
    },
    {
      field: 'statusName',
      hidden: false,
      filter: '',
      orderIndex: 12,
      maxLength: 1000,
      width: 140,
      title: 'TIMESHEET.SUBMISSIONSTATUS'
    }
  ];
  lunchToolTipValue: string;
  showLunchBreakTooltip = false;

  constructor(
    private datePipe: DatePipe, private timeSheetService: TimeSheetService, private cdRef: ChangeDetectorRef,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, public dialogRef: MatDialogRef<viewTimeSheetMonthlyComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, public dialog: MatDialog, private timeZoneData: TimeZoneDataPipe,
    private translateService: TranslateService, private persistanceService: PersistanceService) {
    super();
    this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
    this.activatedRoute.params.subscribe(routeParams => {
      this.userId = routeParams.id;
    });
    this.selectedUserId = data.userId;
    this.selectedEmployeeId = data.userId;
    this.employeeName = data.employeeName;
    this.userName = data.employeeName;
    this.profileImage = data.profileImage;
    this.list = data.list;
    this.timeSheetList = data.list;

  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  closeFeedTimeSheetPopover() {
    this.feedTimeSheetPopover.forEach((p) => p.closePopover());
    this.feedtimesheeteditpopup = false;
    this.feedtimesheetpopupdata = '';
    this.isEditForPermissionFeedTimeSheet = false;
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

  closeabsentPopover() {
    this.absentPopover.forEach((p) => p.closePopover());
    this.absentPopover = false;
    this.absentpopupdata = '';
    this.isEditForAbsentFeedTimeSheet = false;
  }

  closepermissionPopover() {
    this.permissionPopover.forEach((p) => p.closePopover());
    this.permissionpopup = false;
    this.permissionpopupdata = '';
    this.isEditForPermissionFeedTimeSheet = false;
  }

  submitcloseabsentPopover() {
    this.closeabsentPopover();
    this.getViewTimeSheet();
  }

  submitcloseFeedTimeSheetPopover() {
    this.closeFeedTimeSheetPopover();
    this.getViewTimeSheet();

  }

  dateFromChanged(event: MatDatepickerInputEvent<Date>) {
    this.dateFromSelected = event.target.value;
    this.minDate = this.dateFrom;
    this.getViewTimeSheet();
  }

  dateToChanged(event: MatDatepickerInputEvent<Date>) {
    this.dateToSelected = event.target.value;
    this.getViewTimeSheet();
  }

  onNoClick(): void {
    this.currentDialog.close();
    if (this.feedtimesheeteditpopup) {
      this.closetimesheetMonthlyPopup.emit("");
    }
    if (this.absentpopup) {
      this.closeabsentPopup.emit("");
    }
    if (this.permissionpopup) {
      this.closepermissionPopup.emit("");
    }
  }

  closetimesheetPopup() {
    this.feedtimesheeteditpopup = false;
  }

  editFeedTimeSheetPopupOpen(row, feedTimeSheetpopup) {
    this.isEditForFeedTimeSheet = true;
    this.feedtimesheeteditpopup = true;
    this.feedtimesheetpopupdata = row;
    feedTimeSheetpopup.openPopover();
  }

  getViewTimeSheet() {
    this.isAnyOperationIsInprogress = true;
    let dateFromValue = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd');
    let dateToValue = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd');
    var timeSheetDetailsInputModel = new TimeSheetManagementSearchInputModel();
    timeSheetDetailsInputModel.dateFrom = dateFromValue;
    timeSheetDetailsInputModel.dateTo = dateToValue;
    timeSheetDetailsInputModel.sortBy = this.sortBy;
    timeSheetDetailsInputModel.sortDirectionAsc = this.sortDirection;
    timeSheetDetailsInputModel.includeEmptyRecords = true;
    timeSheetDetailsInputModel.userId = this.selectedUserId;
    this.timeSheetService.getTimeSheetDetails(timeSheetDetailsInputModel).subscribe((responseData: any) => {
      if (responseData.success === true) {
        this.timeSheetDetails = responseData.data != null && responseData.data != undefined ? responseData.data : [];
        this.isAnyOperationIsInprogress = false;
        if (!this.isPersistanceLoaded) {
          this.isPersistanceLoaded = true;
          this.getPersistance();
        }
        this.gridSettings = new GridSettings();
        this.gridSettings = {
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
          columnsConfig: [...this.columns]
        };
        this.gridSettings.state.sort = [{ field: 'date', dir: 'desc' }];
        this.loadData(this.gridSettings.state);
        this.cdRef.detectChanges();
      }
      else {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
    })
  }

  reset() {
    this.dateTo = new Date() > new Date(this.ofYear, this.onMonth + 1, 0) ? new Date(this.ofYear, this.onMonth + 1, 0) : new Date();
    // this.dateTo = new Date();
    this.dateFrom = new Date(this.dateTo.getFullYear(), this.dateTo.getMonth(), 1);
    this.minDate = this.dateFrom;
    this.gridSettings = new GridSettings();
    this.gridSettings = {
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
      columnsConfig: [...this.columns]
    };
    this.gridSettings.state.sort = [{ field: 'date', dir: 'desc' }];
    this.saveGridSettings();
    this.getViewTimeSheet();
  }

  checkLunchBreakTooltip(row) {
    this.lunchToolTipValue = "";
    this.showLunchBreakTooltip = false;
    if ((row.lunchBreakStartTime != null) && (row.lunchBreakEndTime != null)) {
      var startAbbr = (this.currentUserTimeZoneName && this.currentUserTimeZoneName != null && this.currentUserTimeZoneName != 'null') ? "" : row.lunchStartAbbreviation;
      var endAbbr = (this.currentUserTimeZoneName && this.currentUserTimeZoneName != null && this.currentUserTimeZoneName != 'null') ? "" : row.lunchEndAbbreviation;
      this.lunchToolTipValue = "(" + this.timeZoneData.transform(row.lunchBreakStartTime, "HH:mm", this.currentUserTimeZoneOffset) + " " + startAbbr + " - " + this.timeZoneData.transform(row.lunchBreakEndTime, "HH:mm", this.currentUserTimeZoneOffset) + " " + endAbbr + ")";
      this.showLunchBreakTooltip = true;
    } else if (row.lunchBreakStartTime != null) {
      this.lunchToolTipValue = this.translateService.instant('TIMESHEET.LUNCHSTARTON');
      this.showLunchBreakTooltip = true;
    }
  }

  viewUserBreakDetails(dataItem) {
    if (dataItem.userBreaksCount > 0) {
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

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.dateFrom = event.target.value;
    this.getViewTimeSheet();
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

  public onVisibilityChange(e: any): void {
    e.columns.forEach((column) => {
      if (column.field == 'actions') { column.hidden = false }
      this.gridSettings.columnsConfig.find((col) => col.field === column.field).hidden = column.hidden;
    });
    this.saveGridSettings();
  }

  public onResize(e: any): void {
    e.forEach((item) => {
      this.gridSettings.columnsConfig.find((col) => col.field === item.column.field).width = item.newWidth;
    });
    this.saveGridSettings();
  }

  private loadData(state: State): void {
    this.gridSettings.gridData = process(this.timeSheetDetails, state);
    if (this.gridSettings.columnsConfig.length == 0) {
      this.gridSettings.columnsConfig = [...this.columns];
    }
    this.isAnyOperationIsInprogress = false;
    this.cdRef.detectChanges();
  }

  public saveGridSettings(): void {
    if (this.referenceId) {
      const persistance = new Persistance();
      persistance.referenceId = this.referenceId;
      persistance.isUserLevel = true;
      persistance.persistanceJson = JSON.stringify(this.gridSettings);
      this.persistanceService.UpsertPersistance(persistance).subscribe(() => {
      });
    }
  }

  getPersistance() {
    if (this.referenceId) {
      this.isAnyOperationIsInprogress = true;
      const persistance = new Persistance();
      persistance.referenceId = this.referenceId;
      persistance.isUserLevel = true;
      this.persistanceService.GetPersistance(persistance).subscribe((response: any) => {
        if (response.success) {
          const data = response.data;
          if (data && data.persistanceJson) {
            this.isAnyOperationIsInprogress = false;
            this.gridSettings = this.mapGridSettings(JSON.parse(data.persistanceJson));
            this.columns = this.gridSettings.columnsConfig;
            if (this.gridSettings.columnsConfig.find((col) => col.field === 'actions')) {
              this.gridSettings.columnsConfig.find((col) => col.field === 'actions').hidden = false;
            }
            this.cdRef.detectChanges();
            this.loadData(this.gridSettings.state);
          } else {
            this.isAnyOperationIsInprogress = false;
            this.gridSettings = this.mapGridSettings(null);
            this.loadData(this.gridSettings.state);
          }
        } else {
          this.isAnyOperationIsInprogress = false;
          this.cdRef.detectChanges();
        }
      });
    } else {
      this.gridSettings = this.mapGridSettings(null);
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
      gridSettignsNew.state = state;
      gridSettignsNew.state.skip = 0;
      gridSettignsNew.state.take = 30;
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

  openActivityTrackerDetails(dataItem, type) {
    let dialogId = "app-activity-tracker-monthly-dialog";
    const activityDialog = this.dialog.open(this.activityTrackerDialogComponent, {
      width: "79%",
      minHeight: "85vh",
      id: dialogId,
      data: {
        dialogId: dialogId, trackerParameters: {
          userId: dataItem.userId, dateFrom: dataItem.date, dateTo: dataItem.date,
          profileImage: dataItem.userProfileImage, totalTime: dataItem.totalActiveTimeInMin, usageTime: dataItem.activeTimeInMin, employeeName: dataItem.employeeName, type: type
        }
      },
    });
    activityDialog.afterClosed().subscribe((result) => {

    });
  }

  openWorkDrillDown(dataItem) {
    let dialogId = "work-drilldown-monthly-dialogue";
    const dialog = this.dialog.open(this.workDrillDownDialog, {
      width: "50%",
      minHeight: "85vh",
      id: dialogId,
      data: { dialogId: dialogId, trackerParameters: { userId: dataItem.userId, dateFrom: dataItem.date, dateTo: dataItem.date } },
    });
    dialog.afterClosed().subscribe((result) => {

    });
  }

  downloadFile() {
    this.downloadInProgress = true;
    let dateFromValue = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd');
    let dateToValue = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd');
    const timeSheetManagementSearchInputModel = new TimeSheetManagementSearchInputModel();
    timeSheetManagementSearchInputModel.dateFrom = dateFromValue;
    timeSheetManagementSearchInputModel.dateTo = dateToValue;
    timeSheetManagementSearchInputModel.sortBy = this.sortBy;
    timeSheetManagementSearchInputModel.sortDirectionAsc = this.sortDirection;
    timeSheetManagementSearchInputModel.includeEmptyRecords = true;
    timeSheetManagementSearchInputModel.userId = this.selectedUserId;
    var d = new Date();
    timeSheetManagementSearchInputModel.timeZone = d.getTimezoneOffset();
    this.timeSheetService.downloadTimesheet(timeSheetManagementSearchInputModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        let filePath = responseData.data;
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

      }
      this.downloadInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  fetchTimeSheetDetails(value) {

    var row = _.find(this.list, function (x) { return x.userId == value; });

    this.selectedUserId = row.userId;
    this.employeeName = row.employeeName;
    this.profileImage = row.userProfileImage;

    this.getViewTimeSheet();
  }

  getTimeSheetDetails() {
    var timesheetDetails = this.timeSheetList;
    var inputText = this.selectedUserId;
    inputText = inputText.trim();
    if (inputText) {
      this.list = timesheetDetails.filter((x: any) => {
        return x.employeeName.toLowerCase().includes(inputText.toLowerCase().trim())
      }
      );
    } else {
      this.list = [];
      this.list = this.timeSheetList;
    }

    this.cdRef.detectChanges();
  }

  clearTimeSheetDetails() {
    this.selectedUserId = this.selectedEmployeeId;
    this.list = this.timeSheetList;
    this.fetchTimeSheetDetails(this.selectedUserId);

  }


  displayFn(userId) {
    if (!userId) {
      return "";
    } else {
      const userDetails = this.list.find((user) => user.userId === userId);
      return userDetails.employeeName;
    }
  }

}


