import { ChangeDetectorRef, Component, Input, OnInit, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CandidateJobDetailsModel } from '../../snovasys-recruitment-management-apps/models/candidatejobdetails.model';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { JobOpening } from '../../snovasys-recruitment-management-apps/models/jobOpening.model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-candidate-job-detail',
  templateUrl: 'candidate-job-detail.component.html',

})
export class CandidateJobDetailComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren('upsertJobDetailPopUp') upsertJobDetailPopover;
  @ViewChildren('deleteJobDetailPopup') deleteJobDetailPopover;
  @Input() src: string;
  @Input() name: string;
  @Input() size: string;
  @Input() isNameRequired ? = true;
  isAnyOperationIsInprogress: boolean;
  candidateJobDetails: any;
  jobDetailForm: FormGroup;
  jobName: any;
  applieddatetime: any;
  interviewStatus: any;
  timeStamp: any;
  JobTitle: any;
  isArchived: any;
  isThereAnError: boolean;
  validationMessage: any;
  candidateId: any;
  candidateData: any;
  isFromJob: any;
  searchText: string = null;
  onBoardProcessDate: Date;
  temp: any;
  sortDirection = true;
  sortBy = 'jobOpeningTitle';
  JobOpening: any;


  @Input('candidateData')
  set _candidateData(data: any) {
    if (data) {
      this.candidateData = data;
      this.clearForm();
      this.getcandidateJobDetails();
    }
  }

  @Input('isFromJob')
  set _isFromJob(data: any) {
    if (data) {
      this.isFromJob = data;
    }
  }

  ngOnInit() {
    super.ngOnInit();
  }

  constructor(
    private toastr: ToastrService,
    private recruitmentService: RecruitmentService,
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
    super();
  }

  getcandidateJobDetails() {
    const jobDetailsModel = new JobOpening();
    jobDetailsModel.email = this.candidateData.email;
    jobDetailsModel.isArchived = this.isArchived;
    this.isAnyOperationIsInprogress = true;
    jobDetailsModel.sortDirectionAsc = this.sortDirection;
    jobDetailsModel.sortBy = this.sortBy;
    this.recruitmentService.getCandidateJobDetails(jobDetailsModel).subscribe((response: any) => {
      if (response.success) {
        this.candidateJobDetails = response.data;
        this.temp = response.data;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      } else {
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  upsertCandidateJobDetails(value) {
    this.isAnyOperationIsInprogress = true;
    const candidateJobDetailsModel = new CandidateJobDetailsModel();
    candidateJobDetailsModel.candidateId = this.jobDetailForm.value.CandidateId;
    candidateJobDetailsModel.jobName = this.jobDetailForm.value.jobName;
    candidateJobDetailsModel.appliedDateTime = this.jobDetailForm.value.applieddatetime;
    candidateJobDetailsModel.interviewStatus = this.jobDetailForm.value.interviewStatus;
    candidateJobDetailsModel.timeStamp = this.jobDetailForm.value.timeStamp;
    this.recruitmentService.upsertCandidateJobDetails(candidateJobDetailsModel).subscribe((response: any) => {
      if (response.success) {
        this.candidateJobDetails = response.data;
        this.toastr.success('Candidate Job saved successfully');
      } else {
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  editJobDetail(row, upsertJobDetailPopUp) {
    this.jobDetailForm.patchValue(row);
    this.candidateId = row.CandidateId;
    this.jobName = row.jobName;
    this.applieddatetime = row.applieddatetime;
    this.interviewStatus = row.interviewStatus;
    this.timeStamp = row.timeStamp;
    this.JobTitle = this.translateService.instant('JOBDETAILS.EDITJOBDETAILSTITLE');
    upsertJobDetailPopUp.openPopover();
  }

  deleteJobDetailPopupOpen(row, deleteJobDetailPopup) {
    this.jobName = row.jobName;
    this.applieddatetime = row.applieddatetime;
    this.interviewStatus = row.interviewStatus;
    this.timeStamp = row.timeStamp;
    deleteJobDetailPopup.openPopover();
  }

  closeUpsertJobDetailUpPopup(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.clearForm();
    this.upsertJobDetailPopover.forEach((p) => p.closePopover());
  }

  deleteJobDetail() {
    this.isAnyOperationIsInprogress = true;
    const candidateJobDetailsModel = new CandidateJobDetailsModel();
    candidateJobDetailsModel.candidateId = this.jobDetailForm.value.CandidateId;
    candidateJobDetailsModel.jobName = this.jobName;
    candidateJobDetailsModel.appliedDateTime = this.applieddatetime;
    candidateJobDetailsModel.interviewStatus = this.interviewStatus;
    candidateJobDetailsModel.timeStamp = this.timeStamp;
    candidateJobDetailsModel.isArchived = !this.isArchived;
    this.recruitmentService.upsertCandidateJobDetails(candidateJobDetailsModel).subscribe((response: any) => {
      if (response.success === true) {
        this.deleteJobDetailPopover.forEach((p) => p.closePopover());
        this.clearForm();
        this.getcandidateJobDetails();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  closeDeleteJobDetailPopup() {
    this.clearForm();
    this.deleteJobDetailPopover.forEach((p) => p.closePopover());
  }
  clearForm() {
    this.jobName = null;
    this.candidateId = null;
    this.applieddatetime = null;
    this.isThereAnError = false;
    this.validationMessage = null;
    this.interviewStatus = null;
    this.timeStamp = null;
    this.isAnyOperationIsInprogress = false;
    this.jobDetailForm = new FormGroup({
      candidateId: new FormControl(null,
        Validators.compose([
        ])
      ),
      jobName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      applieddatetime: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      interviewStatus: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      timeStamp: new FormControl(null,
        Validators.compose([
        ])
      ),
    });
  }

  onSort(event) {
    if (this.candidateJobDetails.length > 0) {
      const sort = event.sorts[0];
      this.sortBy = sort.prop;
      if (sort.dir === 'asc') {
        this.sortDirection = true;
      } else {
        this.sortDirection = false;
      }
      this.getcandidateJobDetails();
    }
  }

  closeSearch() {
    this.searchText = null;
    this.filterByName(null);
  }

  filterByName(value) {
    if (this.searchText != null && this.searchText !== undefined && this.searchText !== '') {
      const temp = this.temp.filter(data =>
        (data.jobOpeningTitle.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1)
        || (data.hiringStatusName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1));
      this.candidateJobDetails = temp;
    } else if (this.searchText == null || this.searchText === '') {
      this.candidateJobDetails = this.temp;
    }
  }
}
