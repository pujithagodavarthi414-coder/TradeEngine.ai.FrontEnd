import { ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { process, State } from '@progress/kendo-data-query';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { DragulaService } from 'ng2-dragula';
import { ToastrService } from 'ngx-toastr';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { CandidateSearchtModel } from '../models/candidate-search.model';
import { CandidateUpsertModel } from '../models/candidateUpsertModel';

@Component({
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: component-selector
  selector: 'app-job-candidate-component',
  templateUrl: 'candidate-link.component.html',
  providers: [DragulaService]
})
export class CandidateJobLinkComponent implements OnInit {
  gridData: GridDataResult;
  jobOpeningId: any;
  jobDetails: any;
  candidateId: string;
  sortBy: string;
  searchText: string;
  sortDirection: boolean;
  updateJob: any;
  pageSize = 10;
  candidateDetails: any;
  savingInProgress: boolean;
  isPopCLose = false;

  constructor(
    private recruitmentService: RecruitmentService, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CandidateJobLinkComponent>, private translateService: TranslateService
  ) {
    this.jobDetails = data.data;
    if (this.jobDetails) {
      this.jobOpeningId = this.jobDetails.jobOpeningId;
    }
  }

  ngOnInit() {
    this.updateJob = [];
    this.getCandidates();
  }

  openClosingPopup() {
    this.dialogRef.close({ success: true, addedJob: this.isPopCLose });
  }

  // tslint:disable-next-line: member-ordering
  page = {
    pageNumber: 0,
    size: 10,
    totalElements: 0
  };

  // tslint:disable-next-line: member-ordering
  state: State = {
    skip: 0,
    take: 10
  };

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.candidateDetails, this.state);
  }

  changeChecked(dataItem) {
    if (dataItem.jobOpeningId === this.jobOpeningId) {
      return true;
    } else {
      return false;
    }
  }

  getCandidates() {
    const candidateSearchtModel = new CandidateSearchtModel();
    candidateSearchtModel.candidateId = this.candidateId;
    candidateSearchtModel.canJobById = this.jobOpeningId;
    this.recruitmentService.getCandisates(candidateSearchtModel).subscribe((response: any) => {
      if (response.success) {
        if (response.data.length > 0) {
          this.candidateDetails = response.data;
          this.gridData = process(this.candidateDetails, this.state);
        }
      } else {
      }
      this.cdRef.detectChanges();
    });
  }

  saveJob() {
    this.savingInProgress = true;
    const candidateUpsert = new CandidateUpsertModel();
    candidateUpsert.candidateJson = JSON.stringify(this.updateJob);
    candidateUpsert.jobOpeningId = this.jobOpeningId;
    candidateUpsert.isJobLink = true;
    this.recruitmentService.upsertCandidate(candidateUpsert).subscribe((response: any) => {
      if (response.success) {
        this.savingInProgress = false;
        this.toastr.success('' + this.translateService.instant('PERFORMANCE.SAVEDSUCCESSFULLY'));
        this.isPopCLose = true;
        this.openClosingPopup();
        this.updateJob = '';
      } else {
        this.savingInProgress = false;
        this.toastr.error('' + this.translateService.instant('CANDIDATES.JobCanlinking'));
      }
      this.cdRef.detectChanges();
    });
  }

  saveCheck(dataItem, rowIndex) {
    let data;
    data = dataItem;
    const ch = rowIndex.currentTarget.checked;
    data.isJobOpening = ch;
    const obj = {
      jobOpeningId: this.jobOpeningId,
      isJobOpening: data.isJobOpening,
      canJobOpeningId: data.candidateJobOpeningId,
      candidateId: data.candidateId
    };
    this.updateJob.push(obj);
  }

  cancelClosingPopup() {
    this.savingInProgress = false;
    this.getCandidates();
    this.gridData = process([], this.state);
    this.updateJob = [];
  }
}
