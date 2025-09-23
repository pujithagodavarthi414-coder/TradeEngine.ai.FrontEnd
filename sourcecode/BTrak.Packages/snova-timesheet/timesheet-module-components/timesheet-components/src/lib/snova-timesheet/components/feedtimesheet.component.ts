import { Component, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy, ViewChildren, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SatPopover } from "@ncstate/sat-popover";
import { Store, select } from "@ngrx/store";
import { State } from "../store/reducers/index";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from '@angular/common'

import "../../globaldependencies/helpers/fontawesome-icons";

import { TimeSheetModel } from "../models/time-sheet-model";
import { PermissionReasonModel } from "../models/permission-reason-model";
import { TimeSheetManagementPermissionModel } from "../models/time-sheet-management-permission-model";
import { EmployeeLeaveModel } from "../models/employee-leave-model";
import { PermissionReasons, TimeZoneModel } from "../models/leavesession-model";

import { TimeSheetService } from "../services/timesheet.service";

import { TranslateService } from "@ngx-translate/core";
import { LoadFeedTimeSheetUsersTriggered, FeedTimeSheetUsersActionTypes } from "../store/actions/feedtimesheet.action";
import { Observable, Subject, Subscription } from "rxjs";

import * as timeSheetModuleReducer from '../store/reducers/index';

import { tap, takeUntil } from "rxjs/operators";
import { Actions, ofType } from "@ngrx/effects";
import { BreakModel } from "../models/break-model";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LeaveTypeModel } from '../models/leave-type-model';
import { LeaveSessionModel } from '../models/leave-session-model';
import { Page } from '../models/Page';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { UserModel } from '../models/user';
import { TimeSheetPermissionsInputModel } from '../models/timesheet-model';
import * as moment_ from 'moment';
import { OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

const moment = moment_;

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'YYYY',
//   },
//   display: {
//     dateInput: 'DD-MMM-YYYY',
//     monthYearLabel: 'DD-MMM-YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };
export const MY_CUSTOM_FORMATS = {
  fullPickerInput: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' },
  datePickerInput: { year: 'numeric', month: 'short', day: 'numeric' },
  timePickerInput: { hour: 'numeric', minute: 'numeric' },
  monthYearLabel: { year: 'numeric', month: 'short' },
  dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
  monthYearA11yLabel: { year: 'numeric', month: 'long' },
};

@Component({
  selector: "app-ts-component-feedtimesheet",
  templateUrl: "feedtimesheet.component.html",
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
  ],
})

export class FeedTimeSheetComponent extends CustomAppBaseComponent implements OnInit {
  @Input("feedtimesheetpopupdata")
  set _feedtimesheetpopupdata(data) {
    this.feedtimesheetpopupdata = data;
  }

  @Input("feedtimesheeteditpopup")
  set _feedtimesheeteditpopup(data: boolean) {
    this.feedtimesheeteditpopup = data;
    this.feedtimesheetpopupdatabinding();
  }

  @Input("absentpopupdata")
  set _absentpopupdata(data) {
    this.absentpopupdata = data;
  }

  @Input("absentpopup")
  set _absentpopup(data: boolean) {
    this.absentpopup = data;
    if (this.absentpopup) {
      this.absentpopupdatabinding();
    }

  }

  @Input("permissionpopupdata")
  set _permissionpopupdata(data) {
    this.permissionpopupdata = data;
    this.userId = data.userId;
    this.dateFrom = data.date;
    this.dateTo = data.date;
  }

  @Input("permissionpopup")
  set _permissionpopup(data: boolean) {
    this.permissionpopup = data;
    this.permisisonpopupdatabinding();
    this.pagePermission.size = 10;
    this.pagePermission.pageNumber = 0;
    this.getPermissionDetails();
  }

  @ViewChild("addPermissionPopover") addPermissionPopover: SatPopover;
  @ViewChild('formDirective') formGroupDirective: FormGroupDirective;
  @ViewChildren("upsertBreakPopUp") upsertBreakPopover;

  @Output() closefeedtimesheetPopup = new EventEmitter<string>();
  @Output() submitclosefeedtimesheetPopup = new EventEmitter<string>();
  @Output() closeabsentPopup = new EventEmitter<string>();
  @Output() submitcloseabsentPopup = new EventEmitter<string>();
  @Output() closepermissionPopup = new EventEmitter<string>();

  feedtimesheetpopupdata: any;
  feedtimesheeteditpopup: boolean;
  absentpopup: boolean;
  absentpopupdata: any;
  permissionpopupdata: any;
  permissionpopup: boolean;
  subscription: Subscription;
  employeeList: UserModel[];
  leaveTypeModelList: LeaveTypeModel[];
  leaveSessionsList: LeaveSessionModel[];
  permissionReasonList: PermissionReasons[];// To Do model should be changed
  selectedDate;
  minDateTime: any;
  timeSheetModel: TimeSheetModel;
  employeeLeaveModel: EmployeeLeaveModel;
  timeSheetPermissionsModel: TimeSheetManagementPermissionModel;
  timeSheetPermissionReason: PermissionReasonModel;

  timeSheetForm: FormGroup;
  permissionReasonForm: FormGroup;
  breakForm: FormGroup;

  maxDate = new Date();
  validationMessage: string;
  isAbsent: boolean = false;
  isPresent: boolean = false;
  showFeedTimeSheetPage: boolean = true;
  savePermissionInProgress: boolean = false;
  savingTimeSheetInProgress: boolean;
  intimepicker: any;
  durationTimepicker: any;
  lunchstarttimepicker: any;
  lunchendtimepicker: any;
  breakstarttimepicker: any;
  breakendtimepicker: any;
  finishtimepicker: any;
  searchLineManager: string = '';
  operationInProgress: boolean;
  permissionReasonValidationMessage: string;
  searchEmployee: string = '';
  employeeSelectedValue: boolean = false;
  employeeList$: Observable<UserModel[]>;
  employeeLoading$: Observable<boolean>;
  public ngDestroyed$ = new Subject();
  breaks: any;
  isAnyOperationIsInprogress: boolean = false;
  breakEdit: string;
  page = new Page();
  pagePermission = new Page();
  breakId: string;
  isVisible: boolean = false;
  sortDirection: boolean;
  sortBy: string;
  nextDay: boolean;
  timeZoneId: string = null;
  softLabels: SoftLabelConfigurationModel[];
  permissionListdata: any;
  timeZones: TimeZoneModel[] = [];
  filteredTimeZones: TimeZoneModel[] = [];
  userId: string;
  dateFrom: Date;
  dateTo: Date;

  constructor(private store: Store<State>, private toastr: ToastrService, private timeSheetService: TimeSheetService,
    private snackbar: MatSnackBar, private translateService: TranslateService, private cdRef: ChangeDetectorRef,
    private actionUpdates$: Actions, private datePipe: DatePipe,
    public googleAnalyticsService: GoogleAnalyticsService) {
    super();
    if (!this.feedtimesheeteditpopup && !this.absentpopup && !this.permissionpopup) {
      this.initializeTimeSheetForm();
    }
    this.initializePermissionReasonForm();
    //this.getAllLeaveTypes();
    //this.getAllAbsentSessions();
    this.getAllPermissionReasons();
    this.getTimeZones();
    this.clearForm();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(FeedTimeSheetUsersActionTypes.LoadFeedTimeSheetUsersCompleted),
        tap(() => {
          this.employeeList$ = this.store.pipe(select(timeSheetModuleReducer.getEmployeeAll), tap(employees => {
            this.employeeList = employees;
          }));
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.employeeLoading$ = this.store.pipe(select(timeSheetModuleReducer.getEmployeeLoading));
    this.page.size = 15;
    this.page.pageNumber = 0;
  }

  getTimeZones() {
    const timeZoneModel = new TimeZoneModel();
    timeZoneModel.isArchived = false;
    this.timeSheetService.getAllTimeZones(timeZoneModel).subscribe((responseData: any) => {
      this.timeZones = responseData.data;
      this.filteredTimeZones = responseData.data;
      this.cdRef.detectChanges();
    });
  }


  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  searchTimeZone(value) {
    if (value != null) {
      value = value.toLowerCase();
      value = value.trim();
    }
    else {
      value = "";
    }

    const temp = this.timeZones.filter((timeZone => (timeZone.timeZoneTitle.toLowerCase().indexOf(value) > -1)));
    this.filteredTimeZones = temp;
  }

  displayTimeZoneFn(value: TimeZoneModel): string {
    return value.timeZoneTitle;
  }

  feedtimesheetpopupdatabinding() {
    this.getTimeZones();
    if (this.feedtimesheeteditpopup && this.feedtimesheetpopupdata) {
      this.isAbsent = false;
      this.isPresent = false;
      this.showFeedTimeSheetPage = true;
      this.searchEmployee = this.feedtimesheetpopupdata.employeeName;
      this.selectedDate = this.getFormatedTime(this.feedtimesheetpopupdata.date, 'yyyy-MM-dd');
      this.minDateTime = this.feedtimesheetpopupdata.date;
      this.employeeSelectedValue = true;
      this.nextDay = false;
      this.timeZoneId = null;
      this.tableVisible();
      if (this.feedtimesheetpopupdata.inTime) {
        this.intimepicker = new Date(this.getFormatedTime(this.feedtimesheetpopupdata.inTime, 'yyyy-MM-dd HH:mm'));
      }
      if (this.feedtimesheetpopupdata.lunchBreakStartTime) {
        this.lunchstarttimepicker = new Date(this.getFormatedTime(this.feedtimesheetpopupdata.lunchBreakStartTime, 'yyyy-MM-dd HH:mm'));
      }
      if (this.feedtimesheetpopupdata.lunchBreakEndTime) {
        this.lunchendtimepicker = new Date(this.getFormatedTime(this.feedtimesheetpopupdata.lunchBreakEndTime, 'yyyy-MM-dd HH:mm'));
      }
      if (this.feedtimesheetpopupdata.outTime) {
        this.finishtimepicker = new Date(this.getFormatedTime(this.feedtimesheetpopupdata.outTime, 'yyyy-MM-dd HH:mm'));
      }
      // if (this.feedtimesheetpopupdata.isNextDay) {
      //   this.nextDay = this.feedtimesheetpopupdata.isNextDay;
      // }
      if (this.feedtimesheetpopupdata.timeZoneId) {
        this.timeZoneId = this.feedtimesheetpopupdata.timeZoneId;
      }
      if (this.feedtimesheetpopupdata.duration) {
        this.durationTimepicker = this.getFormatedTime(this.feedtimesheetpopupdata.duration, 'HH:mm');
      }

      this.popUpInitialize();
    }
  }

  onStartChange(data) {
    var value = data;
    if (data != null && data != "") {
      this.intimepicker = new Date(this.getFormatedTime(data, 'yyyy-MM-dd HH:mm'));
    }
  }

  // timeZoneSelected(data) {
  //   this.timeZoneId = data.option.value.timeZoneId;
  //   if (this.timeSheetForm) {
  //     this.timeSheetForm.get('timeZoneId').setValue(this.timeZoneId);
  //   }
  // }
  timeZoneSelected(data) {
    this.timeZoneId = data;
  }

  checkDisabled() {
    if (this.timeZoneId) {
      return (this.savingTimeSheetInProgress);
    } else {
      return true;
    }
  }

  checkPermissionDisabled() {
    return (this.timeSheetForm.value.permissionReasonId == '' || this.durationTimepicker == '');
  }

  getFormatedTime(utcDate, format) {
    const zone = utcDate.toString()
    const incomingTimeZone = zone.substring(utcDate.length - 6, utcDate.length);
    const timeZoneforPipe = incomingTimeZone.replace(':', '');
    return this.datePipe.transform(utcDate, format, timeZoneforPipe);
  }

  absentpopupdatabinding() {
    if (this.absentpopup && this.absentpopupdata) {
      this.isAbsent = true;
      this.isPresent = false;
      this.showFeedTimeSheetPage = false;
      this.searchEmployee = this.absentpopupdata.employeeName;
      this.selectedDate = this.datePipe.transform(this.absentpopupdata.date, 'yyyy-MM-dd');
      this.minDateTime = this.absentpopupdata.date;
      this.employeeSelectedValue = true;
      this.popUpInitialize();
      // this.setMandatoryFields();
    }
  }

  permisisonpopupdatabinding() {
    if (this.permissionpopup && this.permissionpopupdata) {
      this.isAbsent = false;
      this.isPresent = true;
      this.showFeedTimeSheetPage = false;
      this.searchEmployee = this.permissionpopupdata.employeeName;
      this.selectedDate = this.datePipe.transform(this.permissionpopupdata.date, 'yyyy-MM-dd');
      this.minDateTime = this.permissionpopupdata.date;
      this.employeeSelectedValue = true;
      this.popUpInitialize();
      // this.setMandatoryFields();
    }
  }

  getAllLeaveTypes() {
    let leaveTypeModel = new LeaveTypeModel();
    this.timeSheetService.getAllLeaveTypes(leaveTypeModel)
      .subscribe((responseData: any) => {
        this.leaveTypeModelList = responseData.data;
      });
  }

  getAllAbsentSessions() {
    this.timeSheetService.getAllAbsentSessions(new LeaveSessionModel())
      .subscribe((responseData: any) => {
        this.leaveSessionsList = responseData.data;
      });
  }

  getAllPermissionReasons() {
    this.timeSheetService.getAllPermissionReasons()
      .subscribe((responseData: any) => {
        this.permissionReasonList = responseData.data;
      });
  }

  initializeTimeSheetForm() {
    this.savingTimeSheetInProgress = false;
    this.employeeSelectedValue = false;
    this.intimepicker = '';
    this.durationTimepicker = '';
    this.lunchstarttimepicker = '';
    this.lunchendtimepicker = '';
    this.breakendtimepicker = '';
    this.breakstarttimepicker = '';
    this.finishtimepicker = '';
    this.searchEmployee = '';
    this.employeeSelectedValue = false;
    this.timeSheetForm = new FormGroup({
      userId: new FormControl("", Validators.compose([Validators.required])),
      date: new FormControl("", Validators.compose([Validators.required])),
      inTime: new FormControl("", []),
      lunchBreakStartTime: new FormControl("", []),
      lunchBreakEndTime: new FormControl("", []),
      //breakInTime: new FormControl("", []),
      //breakOutTime: new FormControl("", []),
      outTime: new FormControl("", []),
      isNextDay: new FormControl("", []),
      timeZoneId: new FormControl("", Validators.compose([Validators.required])),
      leaveTypeId: new FormControl("", []),
      leaveSessionId: new FormControl("", []),
      reasonForAbsent: new FormControl("", []),
      duration: new FormControl("", []),
      permissionReasonId: new FormControl("", []),
      isMorning: new FormControl("", [])
    });
    this.setMandatoryFields();
    this.tableVisible();
  }

  popUpInitialize() {
    if (this.feedtimesheeteditpopup) {
      this.timeSheetForm = new FormGroup({
        userId: new FormControl(this.feedtimesheetpopupdata.userId),
        date: new FormControl(this.selectedDate),
        inTime: new FormControl(this.intimepicker),
        lunchBreakStartTime: new FormControl(this.lunchstarttimepicker),
        lunchBreakEndTime: new FormControl(this.lunchendtimepicker),
        outTime: new FormControl(this.finishtimepicker),
        isNextDay: new FormControl(this.nextDay),
        timeZoneId: new FormControl(this.timeZoneId, Validators.compose([Validators.required])),
        leaveTypeId: new FormControl("", []),
        leaveSessionId: new FormControl("", []),
        reasonForAbsent: new FormControl("", []),
        permissionReasonId: new FormControl("", []),
        isMorning: new FormControl("", []),
        duration: new FormControl(this.durationTimepicker)
      });
    }
    if (this.absentpopup) {
      this.timeSheetForm = new FormGroup({
        userId: new FormControl(this.absentpopupdata.userId),
        date: new FormControl(this.selectedDate),
        inTime: new FormControl("", []),
        lunchBreakStartTime: new FormControl("", []),
        lunchBreakEndTime: new FormControl("", []),
        outTime: new FormControl("", []),
        isNextDay: new FormControl("", []),
        timeZoneId: new FormControl("", Validators.compose([Validators.required])),
        leaveTypeId: new FormControl("", Validators.compose([Validators.required])),
        leaveSessionId: new FormControl("", Validators.compose([Validators.required])),
        reasonForAbsent: new FormControl("", Validators.compose([Validators.required])),
        duration: new FormControl("", []),
        permissionReasonId: new FormControl("", []),
        isMorning: new FormControl("", [])
      });
    }
    if (this.permissionpopup) {
      this.timeSheetForm = new FormGroup({
        userId: new FormControl(this.permissionpopupdata.userId),
        date: new FormControl(this.selectedDate),
        inTime: new FormControl("", []),
        lunchBreakStartTime: new FormControl("", []),
        lunchBreakEndTime: new FormControl("", []),
        outTime: new FormControl("", []),
        isNextDay: new FormControl("", []),
        timeZoneId: new FormControl("", Validators.compose([Validators.required])),
        leaveTypeId: new FormControl("", []),
        leaveSessionId: new FormControl("", []),
        reasonForAbsent: new FormControl("", []),
        duration: new FormControl("", Validators.compose([Validators.required])),
        permissionReasonId: new FormControl("", Validators.compose([Validators.required])),
        isMorning: new FormControl("", [])
      });
    }
  }

  closepopup() {
    if (this.feedtimesheeteditpopup) {
      // this.feedtimesheeteditpopup = false;
      this.closefeedtimesheetPopup.emit("");
    }
    if (this.absentpopup) {
      // this.absentpopup = false;
      this.closeabsentPopup.emit("");
    }
    if (this.permissionpopup) {
      // this.permissionpopup = false;
      this.closepermissionPopup.emit("");
    }
  }

  clearForm() {
    this.breakstarttimepicker = '';
    this.breakendtimepicker = '';
    this.breakId = '';
    this.breakForm = new FormGroup({
      breakInTime: new FormControl("", []),
      breakOutTime: new FormControl("", []),
      timeZoneId: new FormControl(this.timeZoneId, Validators.compose([Validators.required]))
    });
    this.breakForm.markAsUntouched();
    this.setMandatoryFields();
  }

  createBreakPopupOpen(upsertBreakPopUp) {
    upsertBreakPopUp.openPopover();
    this.breakEdit = this.translateService.instant('FEEDTIMESHEET.ADDBREAKDETAILS');
  }

  editBreakDetails(row, upsertBreakPopUp) {
    this.breakForm = new FormGroup({
      breakInTime: new FormControl("", []),
      breakOutTime: new FormControl("", []),
      timeZoneId: new FormControl(row.breakInTimeZoneId == null ? this.timeZoneId : row.breakInTimeZoneId, Validators.compose([Validators.required]))
    });
    this.breakForm.markAsUntouched();
    this.breakstarttimepicker = '';
    this.breakendtimepicker = '';
    this.breakEdit = this.translateService.instant('FEEDTIMESHEET.EDITBREAKDETAILS')
    if (row.dateFrom)
      this.breakstarttimepicker = new Date(this.getFormatedTime(row.dateFrom, 'yyyy-MM-dd HH:mm'));
    if (row.dateTo)
      this.breakendtimepicker = new Date(this.getFormatedTime(row.dateTo, 'yyyy-MM-dd HH:mm'));
    this.breakId = row.breakId;
    this.cdRef.detectChanges();
    upsertBreakPopUp.openPopover();
  }

  utcToLocal(date) {
    const localDate = moment.utc(date).local().format();
    return localDate;
  }

  tableVisible() {
    if (this.employeeSelectedValue && ((this.timeSheetForm.value.date && !this.feedtimesheeteditpopup) || (this.feedtimesheeteditpopup && this.feedtimesheetpopupdata.date)) && this.showFeedTimeSheetPage) {
      this.isVisible = true;
      this.getBreakDetails();
    }
    else {
      this.isVisible = false;
    }
  }

  upsertBreakDetails() {
    this.isAnyOperationIsInprogress = true;
    var breakModel = new BreakModel();
    breakModel.breakId = this.breakId;
    breakModel.dateFrom = this.covertTimeIntoUtcTime(this.breakForm.value.breakInTime);
    breakModel.dateTo = this.covertTimeIntoUtcTime(this.breakForm.value.breakOutTime);
    breakModel.timeZoneOffset = this.timeZones.find((p) => p.timeZoneId == this.breakForm.value.timeZoneId).timeZoneOffset;
    breakModel.timeZone = this.timeZones.find((p) => p.timeZoneId == this.breakForm.value.timeZoneId).timeZone;
    breakModel.userId = this.timeSheetForm.value.userId;
    breakModel.date = this.timeSheetForm.value.date;
    this.timeSheetService.upsertBreakDetails(breakModel).subscribe((response: any) => {
      if (response.success == true) {
        this.upsertBreakPopover.forEach((p) => p.closePopover());
        this.clearForm();
        this.submitclosefeedtimesheetPopup.emit("");
        this.getBreakDetails();
        this.isAnyOperationIsInprogress = false;
        this.initializeTimeSheetForm();
      }
      else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
        this.isAnyOperationIsInprogress = false;
        this.resetTimeFieldValues();
      }
    })
  }

  getBreakDetails() {
    this.isAnyOperationIsInprogress = true;
    var breakModel = new BreakModel();
    if (this.feedtimesheeteditpopup) {
      breakModel.dateFrom = this.feedtimesheetpopupdata.date;
      breakModel.userId = this.feedtimesheetpopupdata.userId;
      this.page.size = 15;
      this.page.pageNumber = 0;
      breakModel.pageSize = this.page.size;
    }
    else {
      breakModel.dateFrom = this.timeSheetForm.value.date;
      breakModel.userId = this.timeSheetForm.value.userId;
      breakModel.pageSize = this.page.size;
    }
    breakModel.sortBy = this.sortBy;
    breakModel.sortDirectionAsc = this.sortDirection;
    breakModel.pageNumber = this.page.pageNumber + 1;
    this.timeSheetService.getAllBreaks(breakModel).subscribe((response: any) => {
      if (response.success == true) {
        this.breaks = response.data;
        this.page.totalElements = this.breaks.length > 0 ? this.breaks[0].totalCount : 0;
        this.page.totalPages = this.page.totalElements / this.page.size;
        this.closePopover();
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      }
      else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getBreakDetails();
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    if (sort.dir === 'asc')
      this.sortDirection = true;
    else
      this.sortDirection = false;
    this.page.size = 15;
    this.page.pageNumber = 0;
    this.getBreakDetails();
  }

  closePopover() {
    this.clearForm();
    this.upsertBreakPopover.forEach((p) => p.closePopover());
  }

  setMandatoryFields() {
    if (this.isAbsent) {
      this.timeSheetForm.controls["leaveTypeId"].setValidators([Validators.required]);
      this.timeSheetForm.get("leaveTypeId").updateValueAndValidity();

      this.timeSheetForm.controls["leaveSessionId"].setValidators([Validators.required]);
      this.timeSheetForm.get("leaveSessionId").updateValueAndValidity();

      this.timeSheetForm.controls["reasonForAbsent"].setValidators([Validators.required]);
      this.timeSheetForm.get("reasonForAbsent").updateValueAndValidity();

      this.timeSheetForm.controls["duration"].clearValidators();
      this.timeSheetForm.get("duration").updateValueAndValidity();

      this.timeSheetForm.controls["permissionReasonId"].clearValidators();
      this.timeSheetForm.get("permissionReasonId").updateValueAndValidity();
    }
    else if (this.isPresent) {
      this.timeSheetForm.controls["leaveTypeId"].clearValidators();
      this.timeSheetForm.get("leaveTypeId").updateValueAndValidity();

      this.timeSheetForm.controls["leaveSessionId"].clearValidators();
      this.timeSheetForm.get("leaveSessionId").updateValueAndValidity();

      this.timeSheetForm.controls["reasonForAbsent"].clearValidators();
      this.timeSheetForm.get("reasonForAbsent").updateValueAndValidity();

      this.timeSheetForm.controls["duration"].setValidators([Validators.required]);
      this.timeSheetForm.get("duration").updateValueAndValidity();

      this.timeSheetForm.controls["permissionReasonId"].setValidators([Validators.required]);
      this.timeSheetForm.get("permissionReasonId").updateValueAndValidity();
    }
    else {
      this.timeSheetForm.controls["leaveTypeId"].clearValidators();
      this.timeSheetForm.get("leaveTypeId").updateValueAndValidity();

      this.timeSheetForm.controls["leaveSessionId"].clearValidators();
      this.timeSheetForm.get("leaveSessionId").updateValueAndValidity();

      this.timeSheetForm.controls["duration"].clearValidators();
      this.timeSheetForm.get("duration").updateValueAndValidity();

      this.timeSheetForm.controls["reasonForAbsent"].clearValidators();
      this.timeSheetForm.get("reasonForAbsent").updateValueAndValidity();

      this.timeSheetForm.controls["permissionReasonId"].clearValidators();
      this.timeSheetForm.get("permissionReasonId").updateValueAndValidity();
    }
  }

  initializePermissionReasonForm() {
    this.permissionReasonForm = new FormGroup({
      permissionReason: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(800)]))
    });
  }

  clickIsAbsent() {
    if (this.isAbsent === true) {
      this.showFeedTimeSheetPage = false;
    } else {
      this.showFeedTimeSheetPage = true;
    }
    this.isPresent = false;
    this.tableVisible();
    this.setMandatoryFields();
  }

  clickPermission() {
    if (this.isPresent === true) {
      this.showFeedTimeSheetPage = false;
    } else {
      this.showFeedTimeSheetPage = true;
    }
    this.isAbsent = false;
    this.tableVisible();
    this.setMandatoryFields();
  }

  saveTimeSheet() {
    this.savingTimeSheetInProgress = true;
    if (this.isPresent) {
      this.upsertIsPermission();
    } else if (this.isAbsent) {
      this.upsertIsAbsent();
    } else {
      this.upsertTimeSheet();
    }

  }

  upsertIsPermission() {
    this.timeSheetPermissionsModel = this.timeSheetForm.value;
    this.googleAnalyticsService.eventEmitter("Time Sheet", "Updated Time Sheet - Permission", this.timeSheetForm.value.userId, 1);
    this.timeSheetService.saveTimeSheetPermission(this.timeSheetPermissionsModel)
      .subscribe((responseData: any) => {
        let success = responseData.success;
        this.savingTimeSheetInProgress = false;
        if (success) {
          this.snackbar.open(this.translateService.instant(ConstantVariables.TimeSheetSavedSuccessfully), "", { duration: 3000 });
          this.initializeTimeSheetForm();
          this.closepermissionPopup.emit("");
          this.formGroupDirective.resetForm();
          this.getPermissionDetails();
        } else {
          this.validationMessage = responseData.apiResponseMessages[0].message;
          this.closepermissionPopup.emit("");
          this.toastr.error("", this.validationMessage);
        }
      });
  }

  upsertIsAbsent() {
    this.employeeLeaveModel = this.timeSheetForm.value;
    this.googleAnalyticsService.eventEmitter("Time Sheet", "Updated Time Sheet - Absent", this.timeSheetForm.value.userId, 1);
    this.timeSheetService.saveTimeSheetAbsent(this.employeeLeaveModel)
      .subscribe((responseData: any) => {
        let success = responseData.success;
        this.savingTimeSheetInProgress = false;
        if (success) {
          this.snackbar.open(this.translateService.instant(ConstantVariables.TimeSheetSavedSuccessfully), "", { duration: 3000 });
          this.submitcloseabsentPopup.emit("");
          this.initializeTimeSheetForm();
          this.formGroupDirective.resetForm();
        } else {
          this.validationMessage = responseData.apiResponseMessages[0].message;
          this.closeabsentPopup.emit("");
          this.toastr.error("", this.validationMessage);
        }
      });
  }

  covertTimeIntoUtcTime(inputTime): string {
    if (inputTime == null || inputTime == "")
      return null;

    // var dateNow = new Date(inputTime);
    // var timeSplit = inputTime.toString().split(":");
    // dateNow.setHours(+timeSplit[0], +timeSplit[1], null, null);
    return this.datePipe.transform(inputTime, "yyyy-MM-dd HH:mm")
  }

  upsertTimeSheet() {
    this.timeSheetModel = this.timeSheetForm.value;
    this.googleAnalyticsService.eventEmitter("Time Sheet", "Updated Time Sheet", this.timeSheetForm.value.userId, 1);
    this.timeSheetModel.inTime = this.covertTimeIntoUtcTime(this.timeSheetModel.inTime);
    this.timeSheetModel.outTime = this.covertTimeIntoUtcTime(this.timeSheetModel.outTime);
    this.timeSheetModel.lunchBreakEndTime = this.covertTimeIntoUtcTime(this.timeSheetModel.lunchBreakEndTime);
    this.timeSheetModel.lunchBreakStartTime = this.covertTimeIntoUtcTime(this.timeSheetModel.lunchBreakStartTime);
    this.timeSheetModel.timeZoneOffset = this.timeZones.find((p) => p.timeZoneId == this.timeZoneId).timeZoneOffset;
    this.timeSheetModel.timeZone = this.timeZones.find((p) => p.timeZoneId == this.timeZoneId).timeZone;
    this.timeSheetModel.isFeed = true;
    this.timeSheetService.saveTimeSheet(this.timeSheetModel)
      .subscribe((responseData: any) => {
        let success = responseData.success;
        this.savingTimeSheetInProgress = false;
        if (success) {
          this.snackbar.open(this.translateService.instant(ConstantVariables.TimeSheetSavedSuccessfully), "", { duration: 3000 });
          this.submitclosefeedtimesheetPopup.emit("");
          this.initializeTimeSheetForm();
          this.formGroupDirective.resetForm();
        } else {
          this.validationMessage = responseData.apiResponseMessages[0].message;
          this.toastr.error("", this.validationMessage);
          //this.closefeedtimesheetPopup.emit("");
          this.resetTimeFieldValues();
          this.tableVisible()
          //this.initializeTimeSheetForm();
          this.cdRef.markForCheck();
        }
      });
  }

  resetTimeFieldValues() {
    this.intimepicker = this.intimepicker;
    this.lunchstarttimepicker = this.lunchstarttimepicker;
    this.lunchendtimepicker = this.lunchendtimepicker;
    this.breakendtimepicker = this.breakendtimepicker;
    this.breakstarttimepicker = this.breakstarttimepicker;
    this.finishtimepicker = this.finishtimepicker;
    this.durationTimepicker = this.durationTimepicker;
    this.setMandatoryFields();
  }

  savePermissionReason() {
    this.savePermissionInProgress = true;
    this.timeSheetPermissionReason = this.permissionReasonForm.value;
    this.timeSheetService.saveTimeSheetPermissionReason(this.timeSheetPermissionReason)
      .subscribe((responseData: any) => {
        let success = responseData.success;
        if (success) {
          this.savePermissionInProgress = false;
          const toastrMessage = this.timeSheetPermissionReason.permissionReason + " " + this.translateService.instant(ConstantVariables.PermissionReasonSavedSuccessfully);
          this.snackbar.open(toastrMessage, "", { duration: 3000 });
          this.closePermissionReasonForm();
          this.getAllPermissionReasons();
        } else {
          this.savePermissionInProgress = false;
          this.permissionReasonValidationMessage = responseData.apiResponseMessages[0].message;
          this.toastr.error("", this.permissionReasonValidationMessage);
        }
      });
  }

  closePermissionReasonForm() {
    this.addPermissionPopover.close();
    this.initializePermissionReasonForm();
  }

  intimeshow() {
    if (!this.intimepicker || this.intimepicker == '') {
      return new Date();
    } else {
      return this.intimepicker;
    }
  }

  closeintime() {
    this.intimepicker = "";
  }

  durationTimeShow() {
    if (!this.durationTimepicker) {
      this.durationTimepicker = ConstantVariables.DefaultTime;
    }
  }

  closeDurationTime() {
    this.durationTimepicker = "";
  }

  lunchstarttimeshow() {
    if (!this.lunchstarttimepicker || this.lunchstarttimepicker == '') {
      return new Date();
    } else {
      return this.lunchstarttimepicker;
    }
  }

  closelunchstarttime() {
    this.lunchstarttimepicker = "";
  }

  lunchendtimeshow() {
    if (!this.lunchendtimepicker || this.lunchendtimepicker == '') {
      return new Date();
    } else {
      return this.lunchendtimepicker;
    }
  }

  closelunchendtime() {
    this.lunchendtimepicker = "";
  }

  breakstarttimeshow() {
    if (!this.breakstarttimepicker || this.breakstarttimepicker == '') {
      return new Date();
    } else {
      return this.breakstarttimepicker;
    }
  }

  closebreakstarttime() {
    this.breakstarttimepicker = "";
  }

  breakendtimeshow() {
    if (!this.breakendtimepicker || this.breakendtimepicker == '') {
      return new Date();
    } else {
      return this.breakendtimepicker;
    }
  }

  closebreakendtime() {
    this.breakendtimepicker = "";
  }

  finishtimeshow() {
    if (!this.finishtimepicker || this.finishtimepicker == '') {
      return new Date();
    } else {
      return this.finishtimepicker;
    }
  }

  closefinishtime() {
    this.finishtimepicker = "";
  }

  employeeSelected(value) {
    this.employeeSelectedValue = true;
    this.tableVisible();
  }

  searchByEmployee() {
    this.employeeSelectedValue = false;
    this.tableVisible();
    let searchEmployee = JSON.parse(JSON.stringify(this.searchEmployee));
    const userModel = new UserModel();
    userModel.employeeNameText = searchEmployee;
    this.store.dispatch(new LoadFeedTimeSheetUsersTriggered(userModel));
  }

  closeSearchEmployee() {
    this.searchEmployee = '';
    this.employeeSelectedValue = false;
    this.tableVisible();
    const userModel = new UserModel();
    userModel.employeeNameText = this.searchEmployee;
    this.store.dispatch(new LoadFeedTimeSheetUsersTriggered(userModel));
  }

  displayFn(EmployeeId) {
    if (!EmployeeId) {
      return '';
    }
    else {
      if (this.employeeList && this.employeeList.length > 0) {
        let Employee = this.employeeList.find(Employee => Employee.id === EmployeeId);
        return Employee.fullName;
      }
      else {
        if (this.feedtimesheeteditpopup) {
          return this.feedtimesheetpopupdata.employeeName;
        }
        else if (this.absentpopup) {
          return this.absentpopupdata.employeeName;
        }
        else if (this.permissionpopup) {
          return this.permissionpopupdata.employeeName;
        }
        else {
          return "";
        }
      }
    }
  }

  getPermissionDetails() {
    this.isAnyOperationIsInprogress = true;
    var timeSheetPermissionsInputModel = new TimeSheetPermissionsInputModel();
    timeSheetPermissionsInputModel.pageNumber = this.pagePermission.pageNumber + 1;
    timeSheetPermissionsInputModel.pageSize = this.pagePermission.size;
    timeSheetPermissionsInputModel.dateFrom = this.dateFrom;
    timeSheetPermissionsInputModel.dateTo = this.dateTo;
    timeSheetPermissionsInputModel.userId = this.userId;
    this.timeSheetService.getPermissionDetails(timeSheetPermissionsInputModel).subscribe((responseData: any) => {
      this.permissionListdata = [];
      if (responseData.success == true) {
        this.permissionListdata = responseData.data;
        this.pagePermission.totalElements = responseData.data.length > 0 ? responseData.data[0].totalCount : 0;
        this.pagePermission.totalPages = this.pagePermission.totalElements / this.pagePermission.size;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.markForCheck();
      }
      else {
        this.permissionListdata = responseData.data;
        this.pagePermission.totalElements = responseData.data.length > 0 ? responseData.data[0].totalCount : 0;
        this.pagePermission.totalPages = this.pagePermission.totalElements / this.pagePermission.size;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.markForCheck();
      }
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}