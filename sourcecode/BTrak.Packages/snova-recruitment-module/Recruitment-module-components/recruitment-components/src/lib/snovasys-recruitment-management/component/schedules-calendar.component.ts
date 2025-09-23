import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component,
   EventEmitter, OnInit, Output, ViewChild, TemplateRef, ViewChildren, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchedulerEvent } from '@progress/kendo-angular-scheduler';
import { Guid } from 'guid-typescript';
import * as moment_ from 'moment';
import { CookieService } from 'ngx-cookie-service';
const moment = moment_;
import { Observable } from 'rxjs';
import { ComponentModel } from '@snovasys/snova-comments';
import * as _ from 'underscore';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { InterviewFeedbackModel } from '../../snovasys-recruitment-management-apps/models/interviewfeedback.model';
import { InterviewScheduleModel } from '../../snovasys-recruitment-management-apps/models/interviewschedule.model';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import '../../globaldependencies/helpers/fontawesome-icons';
import { ActivatedRoute, Params } from '@angular/router';
import { CandidateSearchtModel } from '../models/candidate-search.model';
import { TranslateService } from '@ngx-translate/core';
import { RatingTypeUpsertModel } from '../../snovasys-recruitment-management-apps/models/ratingTypeUpsertModel';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

@Component({
  selector: 'app-schedules-component-calender-view-detail',
  templateUrl: 'schedules-calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InterviewSchedulesCalenderViewComponent extends CustomAppBaseComponent implements OnInit {
  @Output() eventClicked = new EventEmitter<any>();
  @Output() selectedViewIndex = new EventEmitter<any>();
  @ViewChildren('confirmPopover') confirmPopover;
  @ViewChildren('feedbackPopover') feedbackPopover;
  @ViewChild('kendoScheduler') kendoScheduler;
  @ViewChildren('FileUploadPopup') FileUploadPopup;
  @ViewChild('customFormsComponent') customFormsComponent: TemplateRef<any>;
  @ViewChild('feedbackFormDirective') feedbackFormDirective: FormGroupDirective;
  @ViewChildren('upsertRatingTypePopUp') upsertRatingTypePopover;
  showCheckBox: boolean;
  isCalenderView = true;
  schedules$: Observable<InterviewScheduleModel[]>;
  schedules: InterviewScheduleModel[];
  schedulesDummy: InterviewScheduleModel[];
  interviewScheduleEvent: SchedulerEvent[] = [];
  componentModel: ComponentModel = new ComponentModel();
  scheduler: SchedulerEvent;
  loadingInProgress: boolean;
  length: number;
  selectedViewType = 0;
  viewTypes: any;
  isFromAllWorkItems: boolean;
  selectedInterviewSchedule: any;
  toaster: any;
  selectedPlan: InterviewScheduleModel[];
  solutionData: any[];
  requestDetails: any;
  isShowcomments = false;
  isAnyOperationIsInprogress: boolean;
  Rating: any;
  newRatingName: any;
  rateId: any;
  feedbackSavingInProgress: boolean;
  anyOperationsInprogress: boolean;
  previousRatingName: any;
  feedForm: FormGroup;
  selectedStoreId: null;
  moduleTypeId = 15;
  referenceTypeId = ConstantVariables.RecruitmentReferenceTypeId;
  scheduleId: any;
  candidateId: any;
  selectedDate: Date;
  startTime: string;
  endTime: string;
  selectedItem: any;
  currentdate: Date;
  selectedDate1: any;
  currentdate1: string;
  routeScheduleId: any;
  moblieNumber: any;
  referenceId: any;
  isrecruitment: boolean;
  isPhoneCall: boolean;
  isVideoCall: boolean;
  ratingTypeTitle: any;
  ratingTypeForm: FormGroup;
  interviewRatingId: string;
  timeStamp: any;
  isThereAnError: boolean;
  validationMessage: any;

  constructor(
    private cdRef: ChangeDetectorRef, public dialog: MatDialog, public datepipe: DatePipe,
    private recruitmentService: RecruitmentService, private cookieService: CookieService,
    private datePipe: DatePipe, private translateService: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private param: ActivatedRoute
  ) {
    super();
    this.param.queryParams.subscribe(routeParams => {
      if (routeParams) {
        this.scheduleId = routeParams.CandidateScheduleId; }
      this.candidateId = routeParams.CandidateId;
    });

    this.param.params.subscribe((params: Params) => {
      if (params) {
        this.routeScheduleId = params['scheduleId'.toString()];
      }
    });

    this.getUserCandidateInterviewSchedules();
    this.patchFeedBackValue(null);
    this.clearForm();
  }

  ngOnInit() {
    this.patchFeedBackValue(null);
    super.ngOnInit();
    this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
    this.componentModel.backendApi = environment.apiURL;
    this.componentModel.parentComponent = this;
    this.componentModel.callBackFunction =
     ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
  }

  getInterviewRatings() {
    this.recruitmentService.getInterviewRatings().subscribe((response: any) => {
      this.isAnyOperationIsInprogress = true;
      if (response.success) {
        this.Rating = response.data;
        this.isAnyOperationIsInprogress = false;
      } else {
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  getUserCandidateInterviewSchedules() {
    this.loadingInProgress = true;
    this.recruitmentService.getUserCandidateInterviewSchedules().subscribe((x: any) => {
      if (x.success) {
        this.schedules = x.data;
        this.selectedPlan = this.schedules;
        this.length = x.data.length;
        this.getDate();
        this.loadGridData();
      } else {
        this.toaster.error(x.apiResponseMessages[0].message);
      }
      this.loadingInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  getDate() {
    const schedule = this.schedules.filter(x => x.candidateInterviewScheduleId === this.routeScheduleId);
    this.selectedDate1 = schedule != null && schedule !== undefined && schedule.length > 0 ? schedule[0].interviewDate : null;
    this.currentdate = new Date();
    this.currentdate1 = this.datePipe.transform(this.currentdate, 'yyyy-MM-dd');
    this.selectedDate1 = (this.selectedDate1 == null || this.selectedDate1 === undefined) ? this.currentdate1 : this.selectedDate1;
    this.selectedDate = new Date(this.selectedDate1);
  }

  setTime(dataItem: any, isStart) {
    const date = moment(dataItem.interviewDate).format('DD-MM-YYYY');
    let endTime;
    if (isStart) {
      if (dataItem.startTime) {
        endTime = dataItem.startTime;
      } else {
        endTime = '00:00:00';
      }
    } else {
      if (dataItem.endTime) {
        endTime = dataItem.endTime;
      } else {
        endTime = '23:59:59';
      }
    }
    return moment(date + ' ' + endTime, 'DD-MM-YYYY HH:mm');
  }

  setColor(dataItem: any) {
    return (dataItem.candidateInterviewScheduleId === this.routeScheduleId) ? '#51e85e' : '';
  }

  loadGridData() {
    if (this.selectedPlan && this.selectedPlan.length > 0) {
      // tslint:disable-next-line: only-arrow-functions
      const groupvalues = this.groupBy(this.selectedPlan, function(item) {
        return [item.interviewDate, (item.startTime || item.interviewDate
           || item.interviewDate), (item.endTime || item.endTime || item.startTime)];
      });
      this.solutionData = _.map(groupvalues, (dataItem) => {
        const startTime = this.setTime(dataItem[0], true);
        const endTime = this.setTime(dataItem[0], false);
        const color = this.setColor(dataItem[0]);
        if (startTime.hour() >= 12 && endTime.hour() <= 12 && endTime < startTime) {
          endTime.add(1, 'days');
        } else if (endTime < startTime) {
          if (new Date(dataItem[0].interviewDate) < startTime.toDate()) {
            startTime.add(-1, 'days');
          } else {
            endTime.add(1, 'days');
          }
        }

        const isConfirmed = dataItem[0].isConfirmed;
        return {
          id: Guid.create().toString(),
          dataItem: Object.keys(dataItem).map((dtIndex) => {
            const item = dataItem[dtIndex];
            item.color = color;
            item.description = 'This schedule is' + (isConfirmed === true ? ' approved' : ' waiting for approval');
            return item;
          }),
          start: startTime.toDate(),
          startTimezone: null,
          end: endTime.toDate(),
          endTimezone: null
        } as SchedulerEvent;
      });

      setTimeout(() => {
        this.solutionData = [...this.solutionData];
      }, 100);
    } else {
      const event = (): SchedulerEvent => ({
        title: '',
        start: null,
        end: null
      });
      this.solutionData = [];
      this.selectedPlan = [];
      this.kendoScheduler.scrollToTime('09:00');
    }
  }

  groupBy(array, f) {
    const groups = {};
    // tslint:disable-next-line: only-arrow-functions
    array.forEach(function(o) {
      const group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return groups;
  }

  getColorInMonth(color) {
    return color === '#ffffff' ? '#ff7c73' : color;
  }

  approveSchedule() {
    const approveinterviewschedule = new InterviewScheduleModel();
    this.loadingInProgress = true;
    approveinterviewschedule.candidateInterviewScheduleId = this.selectedInterviewSchedule;
    approveinterviewschedule.isConfirmed = true;
    this.recruitmentService.approveSchedule(approveinterviewschedule).subscribe((x: any) => {
      this.loadingInProgress = false;
      this.getUserCandidateInterviewSchedules();
      this.confirmPopover.forEach((p) => p.closePopover());
    });
  }

  cancelSchedule() {
    this.confirmPopover.forEach((p) => p.closePopover());
  }

  getConfirm(confirmPopover, event) {
    this.selectedInterviewSchedule = event.candidateInterviewScheduleId;
    confirmPopover.openPopover();
    this.cdRef.markForCheck();
  }

  getFeedback(feedbackPopover, event) {
    this.getInterviewRatings();
    this.isShowcomments = true;
    this.referenceTypeId = event.interviewTypeId;
    this.referenceId = event.interviewTypeId;
    this.isrecruitment = true;
    this.moduleTypeId = 24;
    this.selectedInterviewSchedule = event.candidateInterviewScheduleId;
    this.isPhoneCall = event.isPhoneCalling;
    this.isVideoCall = event.isVideoCalling;
    this.getCandidates(event.candidateId);
    this.getCandidateInterviewFeedback(this.selectedInterviewSchedule);
    feedbackPopover.openPopover();
    this.cdRef.markForCheck();
  }

  changeRating(value) {
    if (value === '') {
      this.rateId = null;
    } else {
      this.rateId = value;
    }
    if (this.rateId) {
      const ratingObj = this.Rating.filter(x => x.interviewRatingId === this.rateId);
      this.newRatingName = ratingObj != null && ratingObj !== undefined ? ratingObj[0].interviewRatingName : null;
      this.upsertInterviewFeedback();
    }
  }

  upsertInterviewFeedback() {
    this.feedbackSavingInProgress = true;
    const interviewFeedback = new InterviewFeedbackModel();
    interviewFeedback.candidateInterviewScheduleId = this.selectedInterviewSchedule;
    interviewFeedback.interviewRatingId = this.rateId;
    this.recruitmentService.upsertCandidateInterviewFeedback(interviewFeedback).subscribe((response: any) => {
      if (response.success) {
        this.upsertRatingComment();
        this.getCandidateInterviewFeedback(this.selectedInterviewSchedule);
      } else {

      }
      this.feedbackSavingInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  getCandidateInterviewFeedback(id) {
    this.anyOperationsInprogress = true;
    const interviewFeedback = new InterviewFeedbackModel();
    interviewFeedback.candidateInterviewScheduleId = id;
    this.recruitmentService.getCandidateInterviewFeedback(interviewFeedback).subscribe((response: any) => {
      if (response.success) {
        if (response.data.length > 0) {
          this.patchFeedBackValue(response.data[0]);
          this.rateId = response.data[0].interviewRatingId;
        } else {
          this.feedForm.get('candidateInterviewScheduleId').patchValue(id);
        }
      } else {
        this.feedForm.get('candidateInterviewScheduleId').patchValue(id);
      }
      this.anyOperationsInprogress = false;
      this.cdRef.detectChanges();
    });
  }

  patchFeedBackValue(value) {
    if (value != null) {
      this.feedForm = new FormGroup({
        rate: new FormControl(value.interviewRatingId,
          Validators.compose([
            Validators.required
          ])
        ),
        candidateInterviewFeedBackId: new FormControl(value.candidateInterviewFeedBackId,
          Validators.compose([])
        ),
        candidateInterviewScheduleId: new FormControl(value.candidateInterviewScheduleId,
          Validators.compose([])
        ),
        timeStamp: new FormControl(value.timeStamp,
          Validators.compose([])
        )
      });
    } else {
      this.feedForm = new FormGroup({
        rate: new FormControl('',
          Validators.compose([
            Validators.required
          ])
        ),
        candidateInterviewFeedBackId: new FormControl('',
          Validators.compose([])
        ),
        candidateInterviewScheduleId: new FormControl('',
          Validators.compose([])
        ),
        timeStamp: new FormControl('',
          Validators.compose([])
        )
      });
    }

  }

  upsertRatingComment() {
    let comment = null;
    if (this.previousRatingName == null || this.previousRatingName === undefined) {
      comment = 'Rating was added as ' + this.newRatingName; } else {
      comment = 'Rating was changed from ' + this.previousRatingName + ' to ' + this.newRatingName; }
    this.isShowcomments = false;
    const commentUserInputModel = {
      commentId: null,
      receiverId: this.selectedInterviewSchedule,
      comment,
      parentCommentId: null
    };
    this.recruitmentService.upsertComments(commentUserInputModel).subscribe((response: any) => {
      if (response.success) {
        this.isShowcomments = true;
        this.previousRatingName = null;
        this.newRatingName = null;
        this.selectedInterviewSchedule = commentUserInputModel.receiverId;
      }
      this.cdRef.detectChanges();
    });
  }

  openClosingPopup() {
    this.confirmPopover.forEach((p) => p.closePopover());
  }

  closeFeedback(feedbackFormDirective: FormGroupDirective) {
    feedbackFormDirective.resetForm();
    setTimeout(() => this.feedbackFormDirective.resetForm(), 0);
    this.selectedInterviewSchedule = null;
    this.isShowcomments = false;
    this.feedForm.clearValidators();
    this.feedbackPopover.forEach((p) => p.closePopover());
  }

  openFileUploadPopover(FileUploadPopup) {
    this.moduleTypeId = 15;
    this.referenceTypeId = ConstantVariables.RecruitmentReferenceTypeId;
    FileUploadPopup.openPopover();
  }

  closeFileUploadPopover() {
    this.FileUploadPopup.forEach((p) => p.closePopover());
  }

  getCandidates(id) {
    const candidateSearchtModel = new CandidateSearchtModel();
    candidateSearchtModel.candidateId = id;
    this.recruitmentService.getCandisates(candidateSearchtModel).subscribe((response: any) => {
      if (response.success) {
        if (response.data.length > 0) {
          this.moblieNumber = response.data[0].countryCode
           + response.data[0].phone + ',' + response.data[0].firstName + ' ' + response.data[0].lastName;
        }
      } else {
        // this.toastr.error(response.apiResponseMessages[0].message);
      }
      this.cdRef.detectChanges();
    });
  }

  createRatingType(upsertRatingTypePopUp) {
    upsertRatingTypePopUp.openPopover();
    this.ratingTypeTitle = this.translateService.instant('RATINGTYPES.ADDRATINGTYPETITLE');
  }

  clearForm() {
    this.isAnyOperationIsInprogress = false;
    this.ratingTypeForm = new FormGroup({
      interviewRatingName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      value: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
    });
  }

  upsertRatingType(formDirective: FormGroupDirective) {
    this.isAnyOperationIsInprogress = true;
    let ratingType = new RatingTypeUpsertModel();
    ratingType = this.ratingTypeForm.value;
    ratingType.interviewRatingName = ratingType.interviewRatingName.toString().trim();
    ratingType.Value = ratingType.Value;
    ratingType.interviewRatingId = this.interviewRatingId;
    ratingType.timeStamp = this.timeStamp;
    this.recruitmentService.upsertRatingType(ratingType).subscribe((response: any) => {
      if (response.success === true) {
        this.isThereAnError = false;
        formDirective.resetForm();
        this.clearForm();
        this.upsertRatingTypePopover.forEach((p) => p.closePopover());
        this.getInterviewRatings();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  closeUpsertRatingTypePopUpPopup(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.clearForm();
    this.upsertRatingTypePopover.forEach((p) => p.closePopover());
  }

}
