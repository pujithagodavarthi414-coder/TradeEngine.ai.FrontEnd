import { Component, Input, ViewChildren, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, TemplateRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { CookieService } from 'ngx-cookie-service';
import { ComponentModel } from '@snovasys/snova-comments';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { InterviewFeedbackModel } from '../../snovasys-recruitment-management-apps/models/interviewfeedback.model';
import { InterviewProcessConfigurationModel } from '../../snovasys-recruitment-management-apps/models/InterviewProcessConfigurationModel';
import { InterviewScheduleModel } from '../../snovasys-recruitment-management-apps/models/interviewschedule.model';
import { RatingTypeUpsertModel } from '../../snovasys-recruitment-management-apps/models/ratingTypeUpsertModel';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import * as _ from 'underscore';
import { DatePipe } from '@angular/common';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { UserModel } from '../../snovasys-recruitment-management-apps/models/user-model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { TranslateService } from '@ngx-translate/core';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line: component-selector
  selector: 'app-interview-tab-component',
  templateUrl: 'interview-tab.component.html',
})

export class InterviewTabComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChild('candidateScheduleFormDirective') candidateScheduleFormDirective: FormGroupDirective;
  @ViewChild('allAssigneeSelected') private allAssigneeSelected: MatOption;
  @ViewChildren('FileUploadPopup') FileUploadPopup;
  @ViewChildren('phonePopup') phonePopup;
  @ViewChild('customFormsComponent') customFormsComponent: TemplateRef<any>;
  @ViewChildren('upsertRatingTypePopUp') upsertRatingTypePopover;
  rowData: any;
  selectedId: any = null;
  selectedRow: any = null;
  startDate: Date = null;
  endDate: Date = null;
  interviewtDate: Date = null;
  componentModel: ComponentModel = new ComponentModel();
  scheduleId: any;
  scheduleComment: string = null;
  rateId: any = ['5'];
  name = 'S S';
  source: string = null;
  candidateSchedule: any = null;
  timeStamp: any = null;
  candidateInterviewFeedBackId: any = null;
  feedbackTimeStamp: any = null;
  jobAssignTo: any;
  selectAssignee: FormGroup;
  assigneeIds: any;
  selectedCandidateId: any;
  moduleTypeId = 15;
  referenceTypeId = ConstantVariables.RecruitmentReferenceTypeId;
  isButtonVisible = true;
  selectedStoreId: null;
  isShowcomments = false;
  previousRatingName: string = null;
  newRatingName: string = null;
  referenceId: any;
  isrecruitment: boolean;
  formIndex: number;
  interscheduletime: any = [];
  isAnyOperationIsInprogress: boolean;
  interviewRatingId: string;
  isThereAnError: boolean;
  validationMessage: any;
  ratingTypeForm: FormGroup;
  ratingTypeTitle: any;
  selectedScheduleId: any;
  showUploader = true;
  @Input('job')
  set _job(data: any) {
    if (data) {
      this.job = data;
    }
  }

  @Input('candidateData')
  set _candidateData(data: any) {
    if (data) {
      this.candidateData = data;
      this.moblieNumber = this.candidateData.countryCode
       + this.candidateData.phone + ',' + this.candidateData.firstName + ' ' + this.candidateData.lastName;
      this.selectedCandidateId = data.candidateId;
      this.getInterviewProcessConfiguration();
    }
  }

  candidateData: any;
  moblieNumber: string;
  isScheduled: boolean;
  job: any;
  anyOperationsInprogress: boolean;
  feedbackOperationsInprogress: boolean;
  savingInProgress: boolean;
  feedbackSavingInProgress: boolean;
  candidateScheduleForm: FormGroup;
  ratingTypes: any;
  candidateInterviewScheduleId: any = null;
  searchtext: any;
  selectedHiringManager: string;
  onBoardProcessDate: Date = new Date();

  ngOnInit() {
    super.ngOnInit();
    this.formValidate();
    this.getRatingTypes();
    this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
    this.componentModel.backendApi = environment.apiURL;
    this.componentModel.parentComponent = this;
    this.componentModel.callBackFunction =
     ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
  }

  constructor(
    private translateService: TranslateService,
    private cookieService: CookieService,
    private recruitmentService: RecruitmentService,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    super();
  }

  formValidate() {
    this.isShowcomments = false;
    this.newRatingName = null;
    this.previousRatingName = null;
    this.candidateScheduleForm = new FormGroup({
      startTime: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      ),
      endTime: new FormControl('',
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
      isConfirmed: new FormControl('',
        Validators.compose([
        ])
      ),
      isRescheduled: new FormControl('',
        Validators.compose([
        ])
      ),
      isCancelled: new FormControl('',
        Validators.compose([
        ])
      ),
      candidateInterviewScheduleId: new FormControl('',
        Validators.compose([
        ])
      )
    });
    this.selectAssignee = new FormGroup({
      assignee: new FormControl([Validators.required])
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

  openView(row) {
    if (row.interviewProcessConfigurationId !== this.selectedId) {
      this.candidateInterviewScheduleId = null;
      this.selectedId = row.interviewProcessConfigurationId;
      this.selectedRow = row;
      this.selectedScheduleId = row.scheduleId;
      this.referenceTypeId = row.interviewTypeId;
      this.referenceId = row.interviewTypeId;
      this.moduleTypeId = 24;
      this.isrecruitment = true;
      this.getUsers(row.roleId);
      if (row.scheduleId == null || row.scheduleId === undefined || row.scheduleId === '00000000-0000-0000-0000-000000000000') {
        this.candidateSchedule = null;
        this.timeStamp = null;
        this.formValidate();
      } else {
        this.getCandidateScheduling(row, null);
      }
      this.cdRef.detectChanges();
    }
  }

  changeRating(value) {
    if (value === '') {
      this.rateId = null;
    } else {
      this.rateId = value;
    }
    if (this.rateId) {
      const ratingObj = this.ratingTypes.filter(x => x.interviewRatingId === this.rateId);
      this.newRatingName = ratingObj != null && ratingObj !== undefined ? ratingObj[0].interviewRatingName : null;
      this.upsertInterviewFeedback();
    }
  }

  resetCandidateInterview(formDirective: FormGroupDirective) {
    if (this.candidateSchedule) {
      this.candidateScheduleForm.patchValue(this.candidateSchedule);
    } else {
      formDirective.resetForm();
      this.formValidate();
    }
    this.cdRef.detectChanges();
  }

  upsertCandidateScheduling() {
    this.savingInProgress = true;
    const interviewSchedule = new InterviewScheduleModel();
    interviewSchedule.candidateId = this.candidateData.candidateId;
    interviewSchedule.jobOpeningId = this.candidateData.jobOpeningId;
    interviewSchedule.interviewTypeId = this.selectedRow.interviewTypeId;
    interviewSchedule.candidateInterviewScheduleId = this.candidateScheduleForm.value.candidateInterviewScheduleId;
    interviewSchedule.startTime = this.candidateScheduleForm.value.startTime;
    interviewSchedule.endTime = this.candidateScheduleForm.value.endTime;
    interviewSchedule.interviewDate = this.candidateScheduleForm.value.interviewDate;
    interviewSchedule.scheduleComments = this.candidateScheduleForm.value.scheduleComments;
    interviewSchedule.isCancelled = this.candidateScheduleForm.value.isCancelled;
    interviewSchedule.isConfirmed = this.candidateScheduleForm.value.isConfirmed;
    interviewSchedule.timeStamp = this.timeStamp;
    interviewSchedule.assignee = this.candidateScheduleForm.value.assignee;
    interviewSchedule.assigneeIds = this.assigneeIds;
    interviewSchedule.candidateName = this.candidateData.firstName + ' ' + this.candidateData.lastName;
    interviewSchedule.interviewTypeName = this.selectedRow.interviewTypeName;
    interviewSchedule.isVideoCalling = this.selectedRow.isVideoCalling;
    this.recruitmentService.upsertCandidateInterviewSchedule(interviewSchedule).subscribe((response: any) => {
      if (response.success) {
        this.getCandidateScheduling(this.selectedRow, response.data);
      } else {
      }
      this.savingInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  getCandidateScheduling(value, id) {
    this.anyOperationsInprogress = true;
    const interviewSchedule = new InterviewScheduleModel();
    interviewSchedule.candidateId = this.candidateData.candidateId;
    interviewSchedule.interviewTypeId = value.interviewTypeId;
    interviewSchedule.candidateInterviewScheduleId = value.scheduleId;
    if (id) {
      this.candidateInterviewScheduleId = id;
      interviewSchedule.candidateInterviewScheduleId = id;
    }
    this.interscheduletime = interviewSchedule;
    this.recruitmentService.getCandidateInterviewSchedule(interviewSchedule).subscribe((response: any) => {
      if (response.success) {
        if (response.data.length > 0) {
          let i = 0;
          this.formIndex = 0;
          if (this.interscheduletime.candidateInterviewScheduleId.includes(response.data[i].candidateInterviewScheduleId)) {
            this.candidateSchedule = response.data[0];
            this.formIndex = i;
            i++;
          }

          this.candidateInterviewScheduleId = this.candidateSchedule.candidateInterviewScheduleId;

          this.timeStamp = this.candidateSchedule.timeStamp;
          let assigneeIds = [];
          this.assigneeIds = response.data[0].assigneeIds;
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
          this.selectedHiringManager = response.data[0].assigneeNames;
          this.candidateScheduleForm.patchValue(this.candidateSchedule);
        } else {
          this.candidateSchedule = [];
          this.candidateInterviewScheduleId = null;
          this.formValidate();
          this.timeStamp = null;
        }
      } else {
        this.candidateSchedule = null;
        this.timeStamp = null;
        this.formValidate();
      }
      if (this.candidateInterviewScheduleId) {
        this.getCandidateInterviewFeedback();
      }
      this.anyOperationsInprogress = false;
      this.cdRef.detectChanges();
    });
  }

  getInterviewProcessConfiguration() {
    const interviewWorkflow = new InterviewProcessConfigurationModel();
    if (this.candidateData.interviewProcessId != null && this.candidateData.interviewProcessId !== undefined) {
      interviewWorkflow.interviewProcessId = this.candidateData.interviewProcessId;
      interviewWorkflow.candidateId = this.candidateData.candidateId;
      interviewWorkflow.jobOpeningId = this.candidateData.jobOpeningId;
    } else {
      interviewWorkflow.interviewProcessId = this.job.interviewProcessId;
      interviewWorkflow.jobOpeningId = this.job.jobOpeningId;
      interviewWorkflow.candidateId = this.candidateData.candidateId;
    }
    this.recruitmentService.getInterviewProcessConfiguration(interviewWorkflow).subscribe((response: any) => {
      if (response.success) {
        this.rowData = response.data;
        this.cdRef.detectChanges();
      } else {
      }
    });
  }

  getRatingTypes() {
    this.recruitmentService.getRatingTypes(new RatingTypeUpsertModel()).subscribe((response: any) => {
      if (response.success) {
        this.ratingTypes = response.data;
        this.cdRef.detectChanges();
      } else {
      }
    });
  }

  upsertInterviewFeedback() {
    this.feedbackSavingInProgress = true;
    const interviewFeedback = new InterviewFeedbackModel();
    interviewFeedback.candidateInterviewScheduleId = this.candidateInterviewScheduleId;
    interviewFeedback.candidateInterviewFeedBackId = this.candidateInterviewFeedBackId;
    interviewFeedback.interviewRatingId = this.rateId;
    interviewFeedback.timeStamp = this.feedbackTimeStamp;
    this.recruitmentService.upsertCandidateInterviewFeedback(interviewFeedback).subscribe((response: any) => {
      if (response.success) {
        this.candidateInterviewFeedBackId = response.data;
        this.upsertRatingComment();
        this.getCandidateInterviewFeedback();
      } else {

      }
      this.feedbackSavingInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  getCandidateInterviewFeedback() {
    this.feedbackOperationsInprogress = true;
    const interviewFeedback = new InterviewFeedbackModel();
    interviewFeedback.candidateInterviewScheduleId = this.candidateInterviewScheduleId;
    interviewFeedback.candidateInterviewFeedBackId = this.candidateInterviewFeedBackId;
    this.recruitmentService.getCandidateInterviewFeedback(interviewFeedback).subscribe((response: any) => {
      if (response.success) {
        if (response.data.length > 0) {
          this.candidateInterviewFeedBackId = response.data[0].candidateInterviewFeedBackId;
          this.rateId = response.data[0].interviewRatingId;
          this.feedbackTimeStamp = response.data[0].timeStamp;
          this.previousRatingName = response.data[0].interviewRatingName;
        } else {
          this.candidateInterviewFeedBackId = null;
          this.rateId = null;
          this.feedbackTimeStamp = null;
          this.previousRatingName = null;
        }
      } else {
        this.candidateInterviewFeedBackId = null;
        this.rateId = null;
        this.feedbackTimeStamp = null;
        this.previousRatingName = null;
      }
      this.feedbackOperationsInprogress = false;
      this.cdRef.detectChanges();
    });
  }

  getUsers(value) {
    this.searchtext = '';
    const user = new UserModel();
    user.roleIds = value;
    this.recruitmentService.GetUsersListByRoles(user).subscribe((response: any) => {
      if (response.success) {
        this.jobAssignTo = response.data;
      }
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
      this.selectAssignee.controls.assignee.patchValue([
        ...this.jobAssignTo.map((item) => item.id),
        0
      ]);
    } else {
      this.selectAssignee.controls.assignee.patchValue([]);
    }
    this.selectedHiringManager = this.selectAssignee.value;
    this.getAssigneelist();
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

  openFileUploadPopover(FileUploadPopup) {
    this.moduleTypeId = 15;
    this.referenceTypeId = ConstantVariables.RecruitmentReferenceTypeId;
    this.selectedScheduleId = this.selectedScheduleId;
    this.showUploader = !this.showUploader;
    this.cdRef.detectChanges();
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
      receiverId: this.candidateInterviewScheduleId,
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

  paymentDetails(value) {}

  callCandidatePopover(phonePopup, row) {
    this.formValidate();
    this.selectedRow = row;
    this.candidateInterviewScheduleId = row.scheduleId;
    if (row.scheduleId === '00000000-0000-0000-0000-000000000000' || row.scheduleId == null || row.scheduleId === undefined) {
      this.isScheduled = false;
    } else {
      this.isScheduled = true;
    }
    phonePopup.openPopover();
    this.cdRef.detectChanges();
  }

  closePhonePopup() {
    this.candidateInterviewScheduleId = null;
    this.isShowcomments = false;
    this.isScheduled = false;
    this.phonePopup.forEach((p) => p.closePopover());
  }

  createRatingType(upsertRatingTypePopUp) {
    upsertRatingTypePopUp.openPopover();
    this.ratingTypeTitle = this.translateService.instant('RATINGTYPES.ADDRATINGTYPETITLE');
  }

  closeUpsertRatingTypePopUpPopup(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.clearForm();
    this.upsertRatingTypePopover.forEach((p) => p.closePopover());
  }

  UpsertRatingType(formDirective: FormGroupDirective) {
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
        this.getRatingTypes();
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
  }

}
