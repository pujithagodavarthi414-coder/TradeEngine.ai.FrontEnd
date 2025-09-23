import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, Input, ChangeDetectorRef, TemplateRef, Inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { Subject, Observable, Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from "@angular/router";
import * as _ from "underscore";
// import { StatusReportingDialogComponent } from "../components/status-reporting-dialog.component";
import { takeUntil } from "rxjs/operators";
// import { WorkItemDialogComponent } from "app/views/projects/components/userStories/work-item-dailogue.component";
import { TimesheetService } from '../services/timesheet-service.service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { TimesheetFeed } from '../models/timesheetfeed';
import { UserStorySearchCriteriaInputModel } from '../models/userStorySearchInput';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { TimesheetDisableorEnable } from '../models/timesheetenabledisable';
import { ButtonTypeInputModel } from '../models/button-type-input-model';
import { UserStory } from '../models/userStory';
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { FeedTimeSheetModel } from '../models/feedTimeSheetModel';
import { UserStoryLogTimeModel } from '../models/userStoryLogTimeModel';
import { FeatureIds } from '../../globaldependencies/constants/feature-ids';
import { StatusReportDialogComponent } from './status-report/status-report-dialog.component';
import { WorkItemsDialogComponent } from './all-work-items-dialog/all-work-items-dialog.component';
import { TimeZoneDataPipe } from '../../globaldependencies/pipes/timeZoneData.pipe';
import * as moment_ from 'moment';
import { timeZoneCollection } from '../../globaldependencies/constants/timeZone.Collection';

const moment = moment_;

@Component({
  selector: "app-feedtimesheet",
  templateUrl: "./feedtimesheet-profile.component.html"
})

export class FeedtimesheetComponentProfile extends CustomAppBaseComponent implements OnInit {
  timeSheetFeedData: TimesheetFeed[];
  userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
  @ViewChild("statusReportDialogComponet") statusReportDialogComponet: TemplateRef<any>;
  @ViewChild("myWorkDialogComponet") myWorkDialogComponet: TemplateRef<any>;

  isFeedTimeSheet
  @Input('isFeedTimeSheet')
  set _isFeedTimeSheet(data: boolean) {
    this.isFeedTimeSheet = data;
    this.getAllButtonTypes();
  }

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  dashboardFilterswork = {
    projectId: null,
    userId: null,
    goalId: null,
    isDailogue: true
  };
  @ViewChildren('openStatusReportPopUp') openStatusReportPopover;
  @ViewChildren('openResponseReportPopUp') openResponseReportPopover;
  @Output() closeFeedTimeSheetPopup = new EventEmitter<any>();
  @Output() getTimeFeedHistory = new EventEmitter<string>();

  public timesheetDisableorEnable: TimesheetDisableorEnable;
  loadingInProgress: boolean;
  startInProgress: boolean;
  finishInProgress: boolean;
  lunchStartInProgress: boolean;
  lunchFinishInProgress: boolean;
  breakStartInProgress: boolean;
  breakFinishInProgress: boolean;
  displayStartAbbr: boolean;
  displayFinishAbbr: boolean;
  displayBreakInAbbr: boolean;
  displayBreakOutAbbr: boolean;
  displayLunchStartAbbr: boolean;
  displayLunchEndAbbr: boolean;
  formListDetails: any;
  timeZoneName: string = null;
  timeZoneOffset: string = null;
  isFinishValid: any;
  userResponce: string;
  validationMessages: string;
  public timeSheetClick: any;
  public isLoggingComplainceTrue: boolean = false;
  public isLoggingMandatory: boolean;
  public formsNotSubmitted: boolean;
  public spentTime: any;
  public ngDestroyed$ = new Subject();
  selectedUrl: string;
  notsubmitedFormsCount: number = 0;
  selectedUserId: string;
  public buttonTypeDetails: ButtonTypeInputModel;
  public buttonTypes: any[];
  public buttonTypeData: boolean = false;
  userStories$: Observable<UserStory[]>;
  userStories: UserStory[];
  userStory: UserStory;
  private sub: Subscription;
  isSubmitStatusreport: Boolean = true;

  get anyOperationInProgress() {
    return (
      this.loadingInProgress ||
      this.startInProgress ||
      this.finishInProgress ||
      this.lunchStartInProgress ||
      this.lunchFinishInProgress ||
      this.breakStartInProgress ||
      this.breakFinishInProgress
    );
  }

  constructor(
    private timesheetService: TimesheetService,
    private timZonePipe: TimeZoneDataPipe,
    public snackBar: MatSnackBar,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private routeParams: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    public googleAnalyticsService: GoogleAnalyticsService
  ) {
    super();
    this.timesheetDisableorEnable = new TimesheetDisableorEnable();
    this.startInProgress = false;
    this.finishInProgress = false;
    this.lunchStartInProgress = false;
    this.lunchFinishInProgress = false;
    this.breakStartInProgress = false;
    this.breakFinishInProgress = false;
    this.formsNotSubmitted = false;
    this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    this.routeParams.params.subscribe(route => {
      if (route.url) {
        this.selectedUrl = route.url;
      }
    });
  }

  ngOnInit() {
    super.ngOnInit();
    //this.getAllButtonTypes();
    this.userStorySearchCriteria.pageNumber = 1;
    this.userStorySearchCriteria.pageSize = null;
    this.userResponce = "";
    // this.getUserTimeZoneOffset();  ---------- service to get user ip
    // this.store.dispatch(
    //   new userStoryActions.Search(this.userStorySearchCriteria)
    // );
    // this.sub = this.actionUpdates$
    //   .pipe(
    //     takeUntil(this.ngDestroyed$),
    //     ofType(userStoryActions.UserStoryActionTypes.SearchComplete),
    //     tap((us: any) => {
    //       this.userStories = us;
    //       this.userStories$ = this.store.pipe(
    //         select(projectModuleReducer.getAllUserStories));
    //       this.userStories$.subscribe((data) => {
    //         this.userStories = data;
    //         this.userStory = this.userStories.find(obj => { return (obj.startTime != null || obj.startTime != undefined) && !obj.endTime });
    //         if (!this.userStory) { this.userStory = this.findSubUserstoryTime(); }
    //       })
    //     })
    //   ).subscribe();

    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.isSubmitStatusreport = _.find(roles, function (role) { return role['featureId'].toLowerCase() == FeatureIds.Feature_ManageRegion.toString().toLowerCase(); }) != null;

    // this.canAccess_feature_SubmitStatusReport$.subscribe((x) => {
    //   this.isSubmitStatusreport = x;
    // });
  }

  getUserTimeZoneOffset() {
    this.timesheetService.getUserIpDetails().subscribe((result: any) => {
      this.timeZoneName = result.timezone;
      if (this.timeZoneName) {
        const index = timeZoneCollection.findIndex((p) => p.TimeZone == this.timeZoneName);
        if (index > -1) {
          this.timeZoneOffset = timeZoneCollection[index].GMTOffset;
        }
      }
    });
  }

  refreshTimeSheet() {
    this.loadingInProgress = true;
    this.timesheetService.currenttimeSheetEnabledInformation    //todo:- have to implement ngrx
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe(data => {
        this.refreshTimeSheetData(data);
        this.loadingInProgress = false;
        this.getTimeFeedHistory.emit("");
      });
  }

  getAllButtonTypes() {
    this.loadingInProgress = true;
    this.buttonTypeDetails = new ButtonTypeInputModel();
    this.timesheetService.getButtonTypeDetails(this.buttonTypeDetails).subscribe((response: any) => {
      if (response.success == true) {
        this.buttonTypes = response.data;
        this.cookieService.set('AllButtonTypes', JSON.stringify(response.data));
        this.buttonTypeData = true;
        this.refreshTimeSheet();
        this.getTimeSheetButtons();
        this.loadingInProgress = false;
      }
      if (response.success == false) {
        this.loadingInProgress = false;
        this.buttonTypeData = false;
        this.toastr.warning("", response.apiResponseMessages[0].message);
      }
    });

  }

  public getTimeSheetButtons() {
    this.loadingInProgress = true;
    this.timesheetService
      .getTimeSheetEnabledInformation()
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data: string) => {
        this.refreshTimeSheetData(data);
        this.loadingInProgress = false;
        this.cdRef.detectChanges();
      });
  }

  buttonTypeIdSearch(data) {
    var buttonTypes = this.buttonTypes;
    var selectedUsersList = _.filter(buttonTypes, function (user) {
      return data == user.buttonCode;
    })
    if (selectedUsersList.length > 0) {
      return selectedUsersList[0].buttonTypeId;
    }
    else {
      return null;
    }
  }

  public timeSheetStart() {
    this.startInProgress = true;
    let feedtimeSheetModel = new FeedTimeSheetModel();
    feedtimeSheetModel.ButtonTypeId = this.buttonTypeIdSearch('START');
    feedtimeSheetModel.ButtonClickedDate = this.getCurrentTime();
    this.timeSheetClick = 'START';
    this.timesheetService
      .logTimeSheetEntry(feedtimeSheetModel)
      .subscribe((data: any) => {
        if (data.success == true) {
          this.startInProgress = false;
          this.getTimeSheetButtons();
          this.snackBar.open(this.translateService.instant('TIMEPUNCHCARD.YOURSTARTHASBEENREGISTERED'), this.translateService.instant('TIMEPUNCHCARD.COOL'), { duration: 3000 });
          this.getTimeFeedHistory.emit("");
        }
        else {
          this.startInProgress = false;
          this.getTimeSheetButtons();
          this.toastr.warning("", data.apiResponseMessages[0].message);
        }
      });
  }

  public timeSheetEnd() {
    this.finishInProgress = true;
    let feedtimeSheetModel = new FeedTimeSheetModel();
    feedtimeSheetModel.ButtonTypeId = this.buttonTypeIdSearch('FINISH');
    feedtimeSheetModel.ButtonClickedDate = this.getCurrentTime();
    feedtimeSheetModel.UserReason = this.userResponce;
    this.timeSheetClick = 'FINISH';
    // if (this.userStory) {
    //   var userStoryLogTime = new UserStoryLogTimeModel();
    //   userStoryLogTime.userStoryId = this.userStory.userStoryId;
    //   userStoryLogTime.startTime = this.userStory.startTime;
    //   userStoryLogTime.endTime = new Date();
    //   userStoryLogTime.parentUserStoryId = null;
    //   this.store.dispatch(new InsertAutoLogTimeTriggered(userStoryLogTime));
    // }
    this.timesheetService.logTimeSheetEntry(feedtimeSheetModel).subscribe((data: any) => {
      if (data.success == true) {
        this.UpsertUserstoryLogTimeBasedOnPunchCard(null);
        this.finishInProgress = false;
        this.getTimeSheetButtons();
        this.openStatusReportPopover.forEach((p) => p.closePopover());
        this.closeFeedTimeSheetPopup.emit();
        this.snackBar.open(this.translateService.instant('TIMEPUNCHCARD.THANKYOUVERYMUCHFORHELPINGSNOVASYS'),
          this.translateService.instant('TIMEPUNCHCARD.OK'), { duration: 3000 });
        this.getTimeFeedHistory.emit("");
      }
      else {
        this.finishInProgress = false;
        this.getTimeSheetButtons();
        this.toastr.warning("", data.apiResponseMessages[0].message);
      }
    });
  }

  public timeSheetEndValid(openStatusReport) {
    console.log(this.selectedUrl);
    this.finishInProgress = true;
    this.formsNotSubmitted = false;
    this.notsubmitedFormsCount = 0;

    this.timesheetService.GetLoggingComplainceDetails().subscribe((result: any) => {
      this.isFinishValid = result.data.loggingComplianceDetails;
      this.formListDetails = result.data.statusReportingConfigurationForms;
      this.isLoggingMandatory = this.isFinishValid.isLoggingMandatory == 1 ? true : false;
      for (let form of this.formListDetails) {
        if (form.isSubmitted == false) {
          this.notsubmitedFormsCount = this.notsubmitedFormsCount + 1;
          this.formsNotSubmitted = true;
        }
      }

      if ((this.isFinishValid.isFinishValid || !this.isLoggingMandatory) && (this.formsNotSubmitted == false || !this.isSubmitStatusreport)) {
        this.timeSheetEnd();
      }
      else {
        this.isLoggingComplainceTrue = !this.isFinishValid.isFinishValid;
        this.finishInProgress = false;
        openStatusReport.openPopover();
      }
    });
  }


  public responseReport(openResponseReport) {
    openResponseReport.openPopover();
  }

  public timeSheetLunchStart() {
    this.lunchStartInProgress = true;
    let feedtimeSheetModel = new FeedTimeSheetModel();
    feedtimeSheetModel.ButtonTypeId = this.buttonTypeIdSearch('LUNCHSTART');
    feedtimeSheetModel.ButtonClickedDate = this.getCurrentTime();
    this.timeSheetClick = 'LUNCHSTART';
    // if (this.userStory) {
    //   var userStoryLogTime = new UserStoryLogTimeModel();
    //   userStoryLogTime.breakType = true;
    //   userStoryLogTime.userStoryId = this.userStory.userStoryId;
    //   userStoryLogTime.startTime = this.userStory.startTime;
    //   userStoryLogTime.endTime = new Date();
    //   userStoryLogTime.parentUserStoryId = null;
    //   this.store.dispatch(new InsertAutoLogTimeTriggered(userStoryLogTime));
    // }
    this.timesheetService.logTimeSheetEntry(feedtimeSheetModel)
      .subscribe((data: any) => {
        if (data.success == true) {
          this.UpsertUserstoryLogTimeBasedOnPunchCard(true);
          this.lunchStartInProgress = false;
          this.getTimeSheetButtons();
          this.snackBar.open(this.translateService.instant('TIMEPUNCHCARD.ENJOYYOURMEAL'), this.translateService.instant('TIMEPUNCHCARD.OK'), { duration: 3000 });
          this.getTimeFeedHistory.emit("");
        }
        else {
          this.lunchStartInProgress = false;
          this.getTimeSheetButtons();
          this.toastr.warning("", data.apiResponseMessages[0].message);
        }
      });
  }


  findSubUserstoryTime() {
    var susy;
    this.userStories.forEach((us) => {
      if (us.subUserStoriesList) {
        return us.subUserStoriesList.forEach((sus) => {
          if (sus.startTime && (sus.startTime != null || sus.startTime != undefined) && !sus.endTime) {
            susy = sus;
          }
        });
      }
    });
    return susy;
  }

  public timeSheetLunchFinish() {
    this.lunchFinishInProgress = true;
    let feedtimeSheetModel = new FeedTimeSheetModel();
    feedtimeSheetModel.ButtonTypeId = this.buttonTypeIdSearch('LUNCHEND');
    feedtimeSheetModel.ButtonClickedDate = this.getCurrentTime();
    this.timeSheetClick = 'LUNCHEND';
    // this.startAutoFinishedUserStory();
    this.timesheetService.logTimeSheetEntry(feedtimeSheetModel)
      .subscribe((data: any) => {
        if (data.success == true) {
          this.UpsertUserstoryLogTimeBasedOnPunchCard(false);
          this.lunchFinishInProgress = false;
          this.getTimeSheetButtons();
          this.snackBar.open(this.translateService.instant('TIMEPUNCHCARD.WELCOMEBACK'), this.translateService.instant('TIMEPUNCHCARD.OK'), { duration: 3000 });
          this.getTimeFeedHistory.emit("");
        }
        else {
          this.lunchFinishInProgress = false;
          this.getTimeSheetButtons();
          this.toastr.warning("", data.apiResponseMessages[0].message);
        }
      });
  }

  startAutoFinishedUserStory() {
    this.userStory = this.userStories.find(obj => { return obj.breakType == true });
    if (!this.userStory) { this.userStory = this.findSubUserstoryAutoFinished(); }
    if (this.userStory) {
      var userStoryLogTime = new UserStoryLogTimeModel();
      userStoryLogTime.userStoryId = this.userStory.userStoryId;
      userStoryLogTime.startTime = new Date();
      userStoryLogTime.parentUserStoryId = null;
      // this.store.dispatch(new InsertAutoLogTimeTriggered(userStoryLogTime));
      this.timesheetService.UpsertUserStoryLogTime(userStoryLogTime)
        .subscribe((data: any) => {
          if (data.success === false) {
            this.validationMessages = data.apiResponseMessages[0].message;
            this.toastr.error(this.validationMessages);
          }
        });
    }
  }

  findSubUserstoryAutoFinished() {
    var susy;
    this.userStories.forEach((us) => {
      if (us.subUserStoriesList) {
        return us.subUserStoriesList.forEach((sus) => {
          if (sus.breakType == true) {
            susy = sus;
          }
        });
      }
    });
    return susy;
  }

  getCurrentTime(): any {
    // return this.datePipe.transform(moment().utc().format('YYYY-MM-DD[T]HH:mm:ss.SSSZ'),'y-MM-dTHH:mm:ss ZZZZZ',this.timeZoneOffset) 
    // return moment().format('YYYY-MM-DD[T]HH:mm:ss.SSSZ');
    return null;
  }

  public timeSheetBreakStart() {
    this.breakStartInProgress = true;
    let feedtimeSheetModel = new FeedTimeSheetModel();
    feedtimeSheetModel.ButtonTypeId = this.buttonTypeIdSearch('BREAKIN');
    feedtimeSheetModel.ButtonClickedDate = this.getCurrentTime();
    this.timeSheetClick = 'BREAKIN';
    // if (this.userStory) {
    //   var userStoryLogTime = new UserStoryLogTimeModel();
    //   userStoryLogTime.breakType = true;
    //   userStoryLogTime.userStoryId = this.userStory.userStoryId;
    //   userStoryLogTime.startTime = this.userStory.startTime;
    //   userStoryLogTime.endTime = new Date();
    //   userStoryLogTime.parentUserStoryId = null;
    //   this.store.dispatch(new InsertAutoLogTimeTriggered(userStoryLogTime));
    // }
    this.timesheetService.logTimeSheetEntry(feedtimeSheetModel)
      .subscribe((data: any) => {
        if (data.success == true) {
          this.UpsertUserstoryLogTimeBasedOnPunchCard(true);
          this.breakStartInProgress = false;
          this.getTimeSheetButtons();
          this.snackBar.open(this.translateService.instant('TIMEPUNCHCARD.BREAKSTARTHASBEENREGISTERED'), this.translateService.instant('TIMEPUNCHCARD.OK'), { duration: 3000 });
          this.getTimeFeedHistory.emit("");
        }
        else {
          this.breakStartInProgress = false;
          this.getTimeSheetButtons();
          this.toastr.warning("", data.apiResponseMessages[0].message);
        }
      });
  }

  public timeSheetBreakFinish() {
    this.breakFinishInProgress = true;
    let feedtimeSheetModel = new FeedTimeSheetModel();
    feedtimeSheetModel.ButtonTypeId = this.buttonTypeIdSearch('BREAKOUT');
    feedtimeSheetModel.ButtonClickedDate = this.getCurrentTime();
    this.timeSheetClick = 'BREAKOUT';
    //this.startAutoFinishedUserStory();
    this.timesheetService.logTimeSheetEntry(feedtimeSheetModel)
      .subscribe((data: any) => {
        if (data.success == true) {
          this.UpsertUserstoryLogTimeBasedOnPunchCard(false);
          this.breakFinishInProgress = false;
          this.getTimeSheetButtons();
          this.snackBar.open(this.translateService.instant('TIMEPUNCHCARD.WELCOMEBACK'), this.translateService.instant('TIMEPUNCHCARD.OK'), { duration: 3000 });
          this.getTimeFeedHistory.emit("");
        }
        else {
          this.breakFinishInProgress = false;
          this.getTimeSheetButtons();
          this.toastr.warning("", data.apiResponseMessages[0].message);
        }
      });
  }

  buttonTypeDataList(data) {
    var buttonTypes = this.buttonTypes;
    var selectedUsersList = _.filter(buttonTypes, function (user) {
      return data == user.buttonCode;
    })
    if (selectedUsersList.length > 0) {
      if (selectedUsersList[0].buttonTypeName.includes('$$')) {
        return this.translateService.instant(selectedUsersList[0].buttonTypeName.substr(2, selectedUsersList[0].buttonTypeName.length - 4))
      } else {
        return selectedUsersList[0].buttonTypeName;
      }
    }
    else {
      return null;
    }
  }

  buttonTypeShortNamesList(data) {
    var buttonTypes = this.buttonTypes;
    var selectedUsersList = _.filter(buttonTypes, function (user) {
      return data == user.buttonCode;
    })
    if (selectedUsersList.length > 0) {
      if (selectedUsersList[0].shortName.includes('$$')) {
        return this.translateService.instant(selectedUsersList[0].shortName.substr(2, selectedUsersList[0].shortName.length - 4))
      } else {
        return selectedUsersList[0].shortName;
      }
    }
    else {
      return null;
    }
  }

  private refreshTimeSheetData(data: any) {
    if (data == "" || data.data == true || data == undefined) {
      return;
    }

    this.timesheetDisableorEnable = JSON.parse(data);

    if (this.timeSheetClick == 'START' && this.timesheetDisableorEnable.StartTime != this.buttonTypeDataList('START'))
      this.googleAnalyticsService.eventEmitter("Time Sheet", "Time Sheet - Day Start", this.timesheetDisableorEnable.StartTime, 1);

    else if (this.timeSheetClick == 'FINISH' && this.timesheetDisableorEnable.FinishTime != this.buttonTypeDataList('FINISH'))
      this.googleAnalyticsService.eventEmitter("Time Sheet", "Time Sheet - Day Finish", this.timesheetDisableorEnable.FinishTime, 1);

    else if (this.timeSheetClick == 'LUNCHSTART' && this.timesheetDisableorEnable.LunchStartTime != this.buttonTypeDataList('LUNCHSTART'))
      this.googleAnalyticsService.eventEmitter("Time Sheet", "Time Sheet - Lunch Start", this.timesheetDisableorEnable.LunchStartTime, 1);

    else if (this.timeSheetClick == 'LUNCHEND' && this.timesheetDisableorEnable.LunchEndTime != this.buttonTypeDataList('LUNCHEND'))
      this.googleAnalyticsService.eventEmitter("Time Sheet", "Time Sheet - Lunch End", this.timesheetDisableorEnable.LunchEndTime, 1);

    else if (this.timeSheetClick == 'BREAKIN' && this.timesheetDisableorEnable.BreakInTime != this.buttonTypeDataList('BREAKIN'))
      this.googleAnalyticsService.eventEmitter("Time Sheet", "Time Sheet - Break Start", this.timesheetDisableorEnable.BreakInTime, 1);


    this.spentTime = this.timesheetDisableorEnable.SpentTime == 0 ? false : true;

    console.log('before printing the data');
    console.log(this.timesheetDisableorEnable);

    if (this.timesheetDisableorEnable.StartTime == null) {
      this.displayStartAbbr = false;
      this.timesheetDisableorEnable.StartTime = this.buttonTypeDataList('START');
    } else {
      this.displayStartAbbr = true;
      this.timesheetDisableorEnable.StartTime =
        this.buttonTypeShortNamesList('START') + "(" + this.timZonePipe.transform(this.timesheetDisableorEnable.StartTime, 'HH:mm');
    }

    if (this.timesheetDisableorEnable.FinishTime == null) {
      this.displayFinishAbbr = false;
      this.timesheetDisableorEnable.FinishTime = this.buttonTypeDataList('FINISH');
    } else {
      this.displayFinishAbbr = true;
      this.timesheetDisableorEnable.FinishTime =
        this.buttonTypeShortNamesList('FINISH') + "(" + this.timZonePipe.transform(this.timesheetDisableorEnable.FinishTime, 'HH:mm');
    }

    if (this.timesheetDisableorEnable.LunchStartTime == null) {
      this.displayLunchStartAbbr = false;
      this.timesheetDisableorEnable.LunchStartTime = this.buttonTypeDataList('LUNCHSTART');
    } else {
      this.displayLunchStartAbbr = true;
      this.timesheetDisableorEnable.LunchStartTime =
        this.buttonTypeShortNamesList('LUNCHSTART') + "(" + this.timZonePipe.transform(this.timesheetDisableorEnable.LunchStartTime, 'HH:mm');
    }

    if (this.timesheetDisableorEnable.LunchEndTime == null) {
      this.displayLunchEndAbbr = false;
      this.timesheetDisableorEnable.LunchEndTime = this.buttonTypeDataList('LUNCHEND');
    } else {
      this.displayLunchEndAbbr = true;
      this.timesheetDisableorEnable.LunchEndTime =
        this.buttonTypeShortNamesList('LUNCHEND') + "(" + this.timZonePipe.transform(this.timesheetDisableorEnable.LunchEndTime, 'HH:mm');
    }

    if (this.timesheetDisableorEnable.BreakInTime == null) {
      this.displayBreakInAbbr = false;
      this.timesheetDisableorEnable.BreakInTime = this.buttonTypeDataList('BREAKIN');
    } else {
      this.displayBreakInAbbr = true;
      this.timesheetDisableorEnable.BreakInTime =
        this.buttonTypeShortNamesList('BREAKIN') + "(" + this.timZonePipe.transform(this.timesheetDisableorEnable.BreakInTime, 'HH:mm');
    }

    if (this.timesheetDisableorEnable.BreakOutTime == null) {
      this.displayBreakOutAbbr = false;
      this.timesheetDisableorEnable.BreakOutTime = this.buttonTypeDataList('BREAKOUT');
    } else {
      this.displayBreakOutAbbr = true;
      this.timesheetDisableorEnable.BreakOutTime =
        this.buttonTypeShortNamesList('BREAKOUT') + "(" + this.timZonePipe.transform(this.timesheetDisableorEnable.BreakOutTime, 'HH:mm');
    }
  }

  // tslint:disable-next-line:member-ordering
  show: boolean;

  // tslint:disable-next-line:member-ordering
  public opened: any = false;

  public close(status) {
    console.log(`Dialog result: ${status}`);
    this.opened = false;
  }

  public open() {
    this.opened = true;
  }

  public ngOnDestroy() {
    console.log('unsubscribing');
    this.ngDestroyed$.next();
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  closeStatusReport() {
    this.openStatusReportPopover.forEach((p) => p.closePopover());
  }

  closeResponseReport() {
    this.openResponseReportPopover.forEach((p) => p.closePopover());
  }

  submitStatusReport() {
    if (this.userResponce.length > 0 && this.userResponce.length <= 400) {
      if (this.formsNotSubmitted == false || !this.isSubmitStatusreport) {
        this.openResponseReportPopover.forEach((p) => p.closePopover());
        this.openStatusReportPopover.forEach((p) => p.closePopover());
        this.timeSheetEnd();
      } else {
        this.openStatusReportPopover.forEach((p) => p.closePopover());
        this.openResponseReportPopover.forEach((p) => p.closePopover());
      }
    }
  }

  navigateToStatusReport() {
    let dialogId = "status-report-dailogue";
    const projectDialog = this.dialog.open(this.statusReportDialogComponet, {
      minWidth: '90vw',
      minHeight: '95vh',
      id: dialogId,
      data: { formPhysicalId: dialogId }
    });
    projectDialog.afterClosed().subscribe(() => { });
  }

  navigateToMyWork() {
    let dialogId = "work-items-dailogue";
    const projectDialog = this.dialog.open(this.myWorkDialogComponet, {
      minWidth: '80vw',
      minHeight: '90vh',
      id: dialogId,
      data: { formPhysicalId: dialogId }
    });
    projectDialog.afterClosed().subscribe(() => { });
  }

  UpsertUserstoryLogTimeBasedOnPunchCard(isBreakStarted) {
    this.timesheetService.UpsertUserStoryLogTimeFromPuncCard(isBreakStarted)
      .subscribe((data: any) => {
        if (data.success === false) {
          this.validationMessages = data.apiResponseMessages[0].message;
          this.toastr.error(this.validationMessages);
        }
      });
  }

  disableSubmission() {
    if (this.userResponce.length > 0 && this.userResponce.length <= 800) {
      return true;
    } else {
      return false;
    }
  }
}