import { Component, Output, EventEmitter, Inject,
   ViewEncapsulation, ViewChildren, ViewChild, ChangeDetectorRef, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Store, select } from '@ngrx/store';
import { ComponentModel } from '@snovasys/snova-comments';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { State } from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { InterviewFeedbackModel } from '../../snovasys-recruitment-management-apps/models/interviewfeedback.model';
import { InterviewProcessConfigurationModel } from '../../snovasys-recruitment-management-apps/models/InterviewProcessConfigurationModel';
import { InterviewScheduleModel } from '../../snovasys-recruitment-management-apps/models/interviewschedule.model';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
import * as _ from 'underscore';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DatePipe } from '@angular/common';
import { ScheduleStatusModel } from '../models/scheduleStatus.model';
import { UserModel } from '../../snovasys-recruitment-management-apps/models/user-model';
import { Observable } from 'rxjs';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { TranslateService } from '@ngx-translate/core';
import { CandidateSearchtModel } from '../models/candidate-search.model';
import { RefreshCandidatesList } from '../../snovasys-recruitment-management-apps/store/actions/candidate.action';
import { RatingTypeUpsertModel } from '../../snovasys-recruitment-management-apps/models/ratingTypeUpsertModel';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-schedule-interview-component',
  templateUrl: 'schedule-interview.component.html',
})

export class ScheduleInterviewComponent extends CustomAppBaseComponent implements OnInit {
  savingInProgress: boolean;
  @Output() messageEvent = new EventEmitter<string>();
  @ViewChildren('addScheduleInterviewPopup') schedulePopover;
  @ViewChildren('addFeedbackPopup') feedbackPopover;
  @ViewChild('scheduleFormDirective') scheduleFormDirective: FormGroupDirective;
  @ViewChildren('cancelSchedulePopup') cancelSchedulePopover;
  @ViewChild('feedbackFormDirective') feedbackFormDirective: FormGroupDirective;
  @ViewChild('allAssigneeSelected') private allAssigneeSelected: MatOption;
  @ViewChildren('inLineEditSchedulePopup') inLineEditPopUps;
  @ViewChildren('FileUploadPopup') FileUploadPopup;
  @ViewChild('formDirective') formGroupDirective: FormGroupDirective;
  @ViewChild('customFormsComponent') customFormsComponent: TemplateRef<any>;
  @ViewChildren('upsertRatingTypePopUp') upsertRatingTypePopover;

  @ViewChildren('phonePopup') phonePopup;
  feedForm: FormGroup;
  addScheduleInterviewForm: FormGroup;
  scheduleId: any;
  componentModel: ComponentModel = new ComponentModel();
  rowData: any;
  job: any;
  Rating: any;
  interview: any;
  Rate: any;
  isAnyOperationIsInprogress: boolean;
  candidateData: any;
  anyOperationsInprogress: boolean;
  selectedRow: any;
  validationMessage: any;
  isThereAnError: boolean;
  jobAssignTo: any;
  searchtext: any;
  selectedHiringManager: string;
  reSchedule: boolean;
  cancelComment: string;
  selectAssignee: FormGroup;
  assigneeIds: any;
  onBoardProcessDate: Date = new Date();
  scheduleStatusId: any;
  scheduleStatus: any;
  isInlineEditForScheduleStatusStatus: boolean;
  isInitial: boolean;
  anyOperationInProgress$: Observable<boolean>;
  scheduleinterviewtitle: string;
  isShowcomments = false;
  previousRatingName: any;
  feedbackTimeStamp: any;
  rateId: any;
  candidateInterviewFeedBackId: any;
  candidateInterviewScheduleId: any;
  feedbackOperationsInprogress: boolean;
  feedbackSavingInProgress: boolean;
  newRatingName: any;
  selectedScheduleId: any;
  selectedStoreId: null;
  moduleTypeId = 15;
  referenceTypeId = ConstantVariables.RecruitmentReferenceTypeId;
  candidateScheduleToStatus: any;
  timestamp: any;
  referenceId: string;
  formReferenceTypeId: string;
  interviewtypeId: string;
  moblieNumber: string;
  isrecruitment: boolean;
  ratingTypeForm: FormGroup;
  timeStamp: any;
  interviewRatingId: any;
  ratingTypeTitle: any;
  showUploader = true;
  initialLoading: any;

  ngOnInit() {
    super.ngOnInit();
    this.reSchedule = false;
    this.formValidate();
    this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
    this.componentModel.backendApi = environment.apiURL;
    this.componentModel.parentComponent = this;
    this.componentModel.callBackFunction =
     ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
    this.getInterviewRatings();
    this.getScheduleStatus();
    this.cancelComment = '';
    this.selectAssignee = new FormGroup({
      assignee: new FormControl([])
    });
  }

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private store: Store<State>,
    private cookieService: CookieService,
    private recruitmentService: RecruitmentService,
    private cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ScheduleInterviewComponent>,
    private datePipe: DatePipe, private translateService: TranslateService
  ) {
    super();
    if (data.candidate) {
      this.candidateData = data.candidate;
      this.moblieNumber = this.candidateData.countryCode + this.candidateData.phone
       + ',' + this.candidateData.firstName + ' ' + this.candidateData.lastName;
    }
    if (data.data) {
      this.job = data.data;
      this.initialLoading = true;
      this.getInterviewProcessConfiguration();
    }
    this.cancelComment = '';
  }

  formValidate() {
    this.isThereAnError = false;
    this.cancelComment = '';
    this.addScheduleInterviewForm = new FormGroup({
      startDate: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      ),
      endDate: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      ),
      interviewDate: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      ),
      scheduleComments: new FormControl('',
        Validators.compose([

        ])
      ),
      candidateInterviewScheduleId: new FormControl('',
        Validators.compose([
        ])
      ),
      isCancelled: new FormControl('',
        Validators.compose([])
      ),
      isConfirmed: new FormControl('',
        Validators.compose([])
      ),
      timeStamp: new FormControl('',
        Validators.compose([

        ])
      )
    });
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
    this.selectAssignee = new FormGroup({
      assignee: new FormControl('')
    });
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

  patchScheduleValue(row) {
    this.addScheduleInterviewForm = new FormGroup({
      startDate: new FormControl(row.startTime,
        Validators.compose([
          Validators.required
        ])
      ),
      endDate: new FormControl(row.endTime,
        Validators.compose([
          Validators.required
        ])
      ),
      interviewDate: new FormControl(row.interviewDate,
        Validators.compose([
          Validators.required
        ])
      ),
      scheduleComments: new FormControl(row.scheduleComments,
        Validators.compose([

        ])
      ),
      candidateInterviewScheduleId: new FormControl(row.candidateInterviewScheduleId,
        Validators.compose([
        ])
      ),
      isCancelled: new FormControl(row.isCancelled,
        Validators.compose([])
      ),
      isConfirmed: new FormControl(row.isConfirmed,
        Validators.compose([])
      ),
      timeStamp: new FormControl(row.timeStamp,
        Validators.compose([
        ])
      )
    });
  }

  patchFeedBackValue(value) {
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
  }

  addScheduleInterPopup(addScheduleInterviewPopup, row, isReschedule) {
    this.formValidate();
    this.selectedRow = row;
    this.reSchedule = isReschedule;

    if (row.scheduleId === '00000000-0000-0000-0000-000000000000' || row.scheduleId == null) {
      this.getUsers(row.roleId);
      this.scheduleinterviewtitle = this.translateService.instant('SCHEDULE.TITLE');
      this.reSchedule = false;
      this.candidateScheduleToStatus = '';
    } else {
      this.scheduleinterviewtitle = this.translateService.instant('SCHEDULE.RESCHEDULETITLE');
      this.getCandidateScheduling(row, null);
      this.reSchedule = true;
    }
    addScheduleInterviewPopup.openPopover();
  }

  addFeedPopup(addFeedbackPopup, row) {
    this.formValidate();
    this.feedForm.get('candidateInterviewScheduleId').patchValue(row.scheduleId);
    this.selectedRow = row;
    this.candidateInterviewScheduleId = row.scheduleId;
    this.isShowcomments = true;
    this.selectedScheduleId = row.scheduleId;
    this.referenceTypeId = row.interviewTypeId;
    this.referenceId = row.interviewTypeId;
    this.moduleTypeId = 24;
    this.isrecruitment = true;
    this.getCandidateInterviewFeedback(row.scheduleId);
    addFeedbackPopup.openPopover();
    this.cdRef.detectChanges();
  }

  callCandidatePopover(phonePopup, row) {
    this.formValidate();
    this.feedForm.get('candidateInterviewScheduleId').patchValue(row.scheduleId);
    this.selectedRow = row;
    this.candidateInterviewScheduleId = row.scheduleId;
    this.selectedScheduleId = row.scheduleId;
    if (row.scheduleId === '00000000-0000-0000-0000-000000000000' || row.scheduleId == null || row.scheduleId === undefined) {
      this.isShowcomments = false;
    } else {
      this.isShowcomments = true;
    }
    phonePopup.openPopover();
    this.cdRef.detectChanges();
  }

  closeUpsertAddAppUrl(passwordFormDirective: FormGroupDirective) {
    passwordFormDirective.resetForm();
    setTimeout(() => this.scheduleFormDirective.resetForm(), 0);
    this.addScheduleInterviewForm.clearValidators();
    this.schedulePopover.forEach((p) => p.closePopover());
  }

  closeFeedback(feedbackFormDirective: FormGroupDirective) {
    feedbackFormDirective.resetForm();
    setTimeout(() => this.feedbackFormDirective.resetForm(), 0);
    this.feedForm.clearValidators();
    this.candidateInterviewScheduleId = null;
    this.isShowcomments = false;
    this.feedbackPopover.forEach((p) => p.closePopover());
  }

  closePhonePopup() {
    this.candidateInterviewScheduleId = null;
    this.isShowcomments = false;
    this.phonePopup.forEach((p) => p.closePopover());
  }

  openClosingPopup() {
    this.dialogRef.close();
  }

  openFileUploadPopover(FileUploadPopup) {
    this.moduleTypeId = 15;
    this.referenceTypeId = ConstantVariables.RecruitmentReferenceTypeId;
    this.showUploader = !this.showUploader;
    FileUploadPopup.openPopover();
  }

  closeFileUploadPopover() {
    this.FileUploadPopup.forEach((p) => p.closePopover());
  }


  upsertRatingComment() {
    let comment = null;
    if (this.previousRatingName == null || this.previousRatingName === undefined) {
      comment = 'Rating was added as ' + this.newRatingName; } else {
      comment = 'Rating was changed from ' + this.previousRatingName + ' to ' + this.newRatingName; }
    this.isShowcomments = false;
    const commentUserInputModel = {
      commentId: null,
      receiverId: this.selectedRow.scheduleId,
      comment,
      parentCommentId: null
    };
    this.recruitmentService.upsertComments(commentUserInputModel).subscribe((response: any) => {
      if (response.success) {
        this.isShowcomments = true;
        this.previousRatingName = null;
        this.newRatingName = null;
        this.candidateInterviewScheduleId = commentUserInputModel.receiverId;
      }
      this.cdRef.detectChanges();
    });
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
    interviewFeedback.candidateInterviewScheduleId = this.selectedRow.scheduleId;
    interviewFeedback.candidateInterviewFeedBackId = this.selectedRow.candidateInterviewFeedBackId;
    interviewFeedback.interviewRatingId = this.rateId;
    interviewFeedback.timeStamp = this.feedbackTimeStamp;
    this.recruitmentService.upsertCandidateInterviewFeedback(interviewFeedback).subscribe((response: any) => {
      if (response.success) {
        this.candidateInterviewFeedBackId = response.data;
        this.upsertRatingComment();
        this.getCandidateInterviewFeedback(this.selectedRow.scheduleId);
      } else {
      }
      this.feedbackSavingInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  getInterviewProcessConfiguration() {
    const interviewWorkflow = new InterviewProcessConfigurationModel();
    this.anyOperationsInprogress = true;
    if (this.candidateData.interviewProcessId != null && this.candidateData.interviewProcessId !== undefined) {
      interviewWorkflow.interviewProcessId = this.candidateData.interviewProcessId;
      interviewWorkflow.candidateId = this.candidateData.candidateId;
      interviewWorkflow.jobOpeningId = this.candidateData.jobOpeningId;
    } else {
      interviewWorkflow.interviewProcessId = this.job.interviewProcessId;
      interviewWorkflow.jobOpeningId = this.candidateData.jobOpeningId;
      interviewWorkflow.candidateId = this.candidateData.candidateId;
    }

    this.recruitmentService.getInterviewProcessConfiguration(interviewWorkflow).subscribe((response: any) => {
      if (response.success) {
        this.rowData = response.data;
        this.anyOperationsInprogress = false;
        this.initialLoading = false;
        this.cdRef.detectChanges();
      } else {}
    });
  }

  getCandidateScheduling(value, id) {
    this.anyOperationsInprogress = true;
    const interviewSchedule = new InterviewScheduleModel();
    interviewSchedule.candidateId = this.candidateData.candidateId;
    interviewSchedule.interviewTypeId = value.interviewTypeId;
    if (id) {
      interviewSchedule.candidateInterviewScheduleId = id;
    }
    this.recruitmentService.getCandidateInterviewSchedule(interviewSchedule).subscribe((response: any) => {
      if (response.success) {
        if (response.data.length > 0) {
          const candidateSchedule = response.data[0];
          this.candidateScheduleToStatus = response.data[0];
          this.timestamp = response.data[0].timeStamp;
          this.patchScheduleValue(candidateSchedule);
          this.getUsers(value.roleId);
          this.anyOperationsInprogress = false;
          this.cdRef.detectChanges();
        } else {
          this.formValidate();
          this.timestamp = '';
        }
      } else {
        this.formValidate();
        this.candidateScheduleToStatus = '';
      }
      this.anyOperationsInprogress = false;
      this.cdRef.detectChanges();
    });
  }

  getCandidateInterviewScheduling(value) {
    this.anyOperationsInprogress = true;
    const interviewSchedule = new InterviewScheduleModel();
    interviewSchedule.candidateId = this.candidateData.candidateId;
    interviewSchedule.interviewTypeId = value.interviewTypeId;
    this.recruitmentService.getCandidateInterviewSchedule(interviewSchedule).subscribe((response: any) => {
      if (response.success) {
        if (response.data.length > 0) {
          const candidateSchedule = response.data[0];
          this.getCandidateInterviewFeedback(candidateSchedule.candidateInterviewScheduleId);
        } else {
          this.formValidate();
        }
      } else {
        this.formValidate();
      }
      this.anyOperationsInprogress = false;
      this.cdRef.detectChanges();
    });
  }

  getCandidateInterviewFeedback(id) {
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

  upsertCandidateScheduling(formDirective: FormGroupDirective) {
    this.savingInProgress = true;
    const interviewSchedule = new InterviewScheduleModel();
    interviewSchedule.candidateId = this.candidateData.candidateId;
    interviewSchedule.interviewTypeId = this.selectedRow.interviewTypeId;
    interviewSchedule.candidateInterviewScheduleId = this.addScheduleInterviewForm.value.candidateInterviewScheduleId;
    interviewSchedule.startTime = this.addScheduleInterviewForm.value.startDate;
    interviewSchedule.endTime = this.addScheduleInterviewForm.value.endDate;
    interviewSchedule.interviewDate = this.addScheduleInterviewForm.value.interviewDate;
    interviewSchedule.scheduleComments = this.addScheduleInterviewForm.value.scheduleComments;
    interviewSchedule.isCancelled = this.addScheduleInterviewForm.value.isCancelled;
    interviewSchedule.isConfirmed = this.addScheduleInterviewForm.value.isConfirmed;
    interviewSchedule.timeStamp = this.timestamp;
    interviewSchedule.jobOpeningId = this.candidateData.jobOpeningId;
    interviewSchedule.isRescheduled = this.reSchedule;
    interviewSchedule.assignee = this.selectAssignee.get('assignee').value;
    interviewSchedule.candidateName = this.candidateData.firstName + ' ' + this.candidateData.lastName;
    interviewSchedule.interviewTypeName = this.selectedRow.interviewTypeName;
    interviewSchedule.isVideoCalling = this.selectedRow.isVideoCalling;
    this.recruitmentService.upsertCandidateInterviewSchedule(interviewSchedule).subscribe((response: any) => {
      if (response.success) {
        this.schedulePopover.forEach((p) => p.closePopover());
        this.getInterviewProcessConfiguration();
        this.isThereAnError = false;
        this.savingInProgress = false;
        formDirective.resetForm();
        this.candidatesAfterRefresh();
        this.formValidate();
        this.toastr.success('Email sent successfully');
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
      this.savingInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  candidatesAfterRefresh() {
    const candidateSearchtModel = new CandidateSearchtModel();
    candidateSearchtModel.jobOpeningId = this.candidateData.jobOpeningId;
    this.store.dispatch(new RefreshCandidatesList(candidateSearchtModel));
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

  getUsers(value) {
    this.isAnyOperationIsInprogress = true;
    this.searchtext = '';
    const user = new UserModel();
    user.roleIds = value;
    this.recruitmentService.GetUsersListByRoles(user).subscribe((response: any) => {
      if (response.success) {
        this.jobAssignTo = response.data;
        let assigneeIds = [];
        this.assigneeIds = this.candidateScheduleToStatus.assigneeIds;
        if (this.assigneeIds) {
          const arr = this.assigneeIds.split(',');
          if (arr.length === this.jobAssignTo.length) {
            assigneeIds.push(0);
          }
          this.assigneeIds.split(',').forEach(element => {
            assigneeIds.push(element);
          });
        } else {
          assigneeIds = [];
        }
        this.selectAssignee = new FormGroup({
          assignee: new FormControl(assigneeIds)
        });
        this.selectedHiringManager = this.candidateScheduleToStatus.assigneeNames;
      }
      this.isAnyOperationIsInprogress = false;
      this.cdRef.detectChanges();
    });
  }

  getHiringManagerValue(event) {
    let assigneeIds = [];
    this.assigneeIds = event;
    if (this.assigneeIds) {
      this.assigneeIds.split(',').forEach(element => {
        assigneeIds.push(element);
      });
    } else {
      assigneeIds = [];
    }
    this.selectAssignee = new FormGroup({
      assignee: new FormControl(assigneeIds)
    });
  }

  closeSchedulePopup() {
    this.clearForm();
    this.selectAssignee = new FormGroup({
      assignee: new FormControl('')
    });
    this.cancelSchedulePopover.forEach((p) => p.closePopover());
  }

  cancelSchedulePopupOpen(cancelSchedulePopup, row) {
    this.formValidate();
    this.selectedRow = row;
    cancelSchedulePopup.openPopover();
  }

  cancelSchedule() {
    const interviewSchedule = new InterviewScheduleModel();
    this.savingInProgress = true;
    interviewSchedule.candidateId = this.candidateData.candidateId;
    interviewSchedule.interviewTypeId = this.selectedRow.interviewTypeId;
    interviewSchedule.candidateInterviewScheduleId = this.selectedRow.scheduleId;
    interviewSchedule.cancelComment = this.cancelComment;
    interviewSchedule.candidateEmail = this.candidateData.email;
    interviewSchedule.interviewTypeName = this.selectedRow.interviewTypeName;
    this.recruitmentService.cancelInterviewSchedule(interviewSchedule).subscribe((response: any) => {
      if (response.success) {
        this.getInterviewProcessConfiguration();
        this.cancelSchedulePopover.forEach((p) => p.closePopover());
        this.toastr.success('Schedule has been cancelled');
        this.savingInProgress = false;
      } else {
        this.isThereAnError = true;
        this.toastr.error(response.apiResponseMessages[0].message);
      }
      this.cdRef.detectChanges();
    });
  }

  toggleAssigneePerOne(all) {
    if (this.allAssigneeSelected.selected) {
      this.allAssigneeSelected.deselect();
      return false;
    }
    if (
      this.selectAssignee.controls.assignee.value.length === this.jobAssignTo.length
    ) {
      this.allAssigneeSelected.select();
    }
  }

  toggleAllAssigneeSelected() {
    if (this.allAssigneeSelected.selected) {
      this.selectAssignee.get('assignee').patchValue([
        ...this.jobAssignTo.map((item) => item.id),
        0
      ]);
      this.assigneeIds = this.jobAssignTo.map((item) => item.id);
    } else {
      this.selectAssignee.get('assignee').patchValue([]);
    }
  }

  getAssigneelist() {
    const selectedAssignees = this.selectAssignee.value.assignee;
    const index = selectedAssignees.indexOf(0);
    if (index > -1) {
      selectedAssignees.splice(index, 1);
    }
    this.assigneeIds = selectedAssignees.toString();
    this.bindAssignee(this.assigneeIds);
  }

  bindAssignee(assigneeIds) {
    if (assigneeIds) {
      const assigneeList = this.jobAssignTo;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(assigneeList, function(member: any) {
        return assigneeIds.toString().includes(member.id);
      });
      const selectedAssignee = filteredList.map((x: any) => x.fullName);
      this.selectedHiringManager = selectedAssignee.toString();
    } else {
      this.selectedHiringManager = '';
    }
  }

  compareSelectedAssigneeFn(assignee: any, selectedModules: any) {
    if (assignee === selectedModules) {
      return true;
    } else {
      return false;
    }
  }

  covertTimeIntoUtcTime(inputTime): string {
    if (inputTime == null || inputTime === '') {
      return null; }
    return this.datePipe.transform(inputTime, 'yyyy-MM-dd HH:mm');
  }

  saveScheduleStatus(inLineEditSchedulePopup, row) {
    this.scheduleStatusId = row.statusId;
    this.selectedRow = row;
    inLineEditSchedulePopup.openPopover();
    this.getCandidateScheduling(row, null);
  }

  getScheduleStatus() {
    const schedulestatus = new ScheduleStatusModel();
    schedulestatus.isArchived = false;
    this.recruitmentService.getScheduleStatus(schedulestatus).subscribe((response: any) => {
      if (response.success) {
        this.scheduleStatus = response.data;
        this.cdRef.detectChanges();
      } else {
        this.toastr.error(response.apiResponseMessages[0].message);
      }
    });
  }

  changeScheduleStatus(value) {
    this.scheduleStatus.forEach(x => {
      if (x.scheduleStatusId === value) {
        this.scheduleStatus.color = x.color;
        this.scheduleStatus.scheduleStatusName = x.status;
        this.scheduleStatusId = value;
        this.cdRef.detectChanges();
      }
    });
  }

  upsertScheduleStatus() {
    this.isAnyOperationIsInprogress = true;
    const interviewSchedule = new InterviewScheduleModel();
    interviewSchedule.candidateInterviewScheduleId = this.selectedRow.scheduleId;
    interviewSchedule.statusId = this.scheduleStatusId;
    interviewSchedule.candidateId = this.candidateData.candidateId;
    interviewSchedule.interviewTypeId = this.selectedRow.interviewTypeId;
    interviewSchedule.jobOpeningId = this.candidateData.jobOpeningId;
    interviewSchedule.timeStamp = this.selectedRow.scheduleTimeStamp;
    interviewSchedule.startTime = this.addScheduleInterviewForm.value.startDate;
    interviewSchedule.endTime = this.addScheduleInterviewForm.value.endDate;
    interviewSchedule.interviewDate = this.addScheduleInterviewForm.value.interviewDate;
    interviewSchedule.scheduleComments = this.addScheduleInterviewForm.value.scheduleComments;
    interviewSchedule.isCancelled = this.addScheduleInterviewForm.value.isCancelled;
    interviewSchedule.isConfirmed = this.addScheduleInterviewForm.value.isConfirmed;
    interviewSchedule.timeStamp = this.addScheduleInterviewForm.value.timeStamp;
    interviewSchedule.isRescheduled = this.reSchedule;
    interviewSchedule.assignee = this.selectAssignee.get('assignee').value;
    interviewSchedule.candidateName = this.candidateData.firstName + ' ' + this.candidateData.lastName;
    interviewSchedule.interviewTypeName = this.selectedRow.interviewTypeName;
    interviewSchedule.isVideoCalling = this.selectedRow.isVideoCalling;
    this.recruitmentService.upsertCandidateInterviewSchedule(interviewSchedule).subscribe((response: any) => {
      if (response.success === true) {
        this.isAnyOperationIsInprogress = false;
        this.getInterviewProcessConfiguration();
        this.closeScheduleStatusDialogWindow();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  closeScheduleStatusDialogWindow() {
    this.isInlineEditForScheduleStatusStatus = false;
    this.inLineEditPopUps.forEach((p) => p.closePopover());
  }

  paymentDetails(value) {}

  createRatingType(upsertRatingTypePopUp) {
    upsertRatingTypePopUp.openPopover();
    this.ratingTypeTitle = this.translateService.instant('RATINGTYPES.ADDRATINGTYPETITLE');
  }

  closeUpsertRatingTypePopUpPopup(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.clearForm();
    this.upsertRatingTypePopover.forEach((p) => p.closePopover());
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

  clearForm() {
    this.isThereAnError = false;
    this.validationMessage = null;
    this.timeStamp = null;
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
    this.addScheduleInterviewForm = new FormGroup({
      startDate: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      ),
      endDate: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      ),
      interviewDate: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      ),
      scheduleComments: new FormControl('',
        Validators.compose([

        ])
      ),
      candidateInterviewScheduleId: new FormControl('',
        Validators.compose([
        ])
      ),
      isCancelled: new FormControl('',
        Validators.compose([])
      ),
      isConfirmed: new FormControl('',
        Validators.compose([])
      ),
      timeStamp: new FormControl('',
        Validators.compose([

        ])
      )
    });
    this.selectAssignee = new FormGroup({
      assignee: new FormControl('')
    });
  }

}
