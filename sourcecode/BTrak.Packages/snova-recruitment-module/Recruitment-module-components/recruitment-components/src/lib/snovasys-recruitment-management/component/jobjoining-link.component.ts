import { ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { orderBy, process, SortDescriptor, State } from '@progress/kendo-data-query';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { DragulaService } from 'ng2-dragula';
import { ToastrService } from 'ngx-toastr';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { CandidateUpsertModel } from '../models/candidateUpsertModel';
import { JobOpening } from '../../snovasys-recruitment-management-apps/models/jobOpening.model';
@Component({
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: component-selector
  selector: 'app-job-joinig-component',
  templateUrl: 'jobjoining-link.component.html',
  providers: [DragulaService]
})
export class JobCandidateLinkComponent implements OnInit {
  gridData: GridDataResult;
  jobOpeningId: any;
  jobDetails: any;
  candidateId: string;
  sortBy: string;
  searchText: string;
  sortDirection: boolean;
  updateJob: any;
  isPopCLose = false;
  pageSize = 10;
  candidateDetails: any;
  savingInProgress: boolean;
  isAnyOperationIsInProgress: boolean;
  email: any;
  public multiple = false;
  public allowUnsort = true;
  public sort: SortDescriptor[] = [{
    field: 'jobOpeningTitle'
  }];
  candidateJobDetails: any;
  isJob: boolean;

  constructor(
    private recruitmentService: RecruitmentService, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<JobCandidateLinkComponent>, private translateService: TranslateService
  ) {
    this.jobDetails = data.data;
    if (this.jobDetails) {
      this.jobOpeningId = this.jobDetails.jobOpeningId;
      this.email = this.jobDetails.email;
      this.candidateId = this.jobDetails.candidateId;
    }
  }

  ngOnInit() {
    this.updateJob = [];
    this.getJobOpenings();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadProducts();
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

  private loadProducts(): void {
    this.gridData = {
      data: orderBy(this.candidateDetails, this.sort),
      total: this.candidateDetails.length
    };
  }

  getJobOpenings() {
    const jobOpening = new JobOpening();
    this.isAnyOperationIsInProgress = true;
    this.recruitmentService.getJobOpenings(jobOpening).subscribe((response: any) => {
      if (response.success) {
        this.candidateDetails = response.data;
        this.getcandidateJobDetails();
      } else {
        this.isAnyOperationIsInProgress = false;
      }
    });
  }

  getcandidateJobDetails() {
    const JobDetailsModel = new JobOpening();
    JobDetailsModel.candidateId = this.candidateId;
    this.recruitmentService.getJobOpenings(JobDetailsModel).subscribe((response: any) => {
      if (response.success) {
        this.candidateJobDetails = response.data;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.candidateJobDetails.length; i++) {
          // tslint:disable-next-line: prefer-for-of
          for (let j = 0; j < this.candidateDetails.length; j++) {
            if (this.candidateJobDetails) {
              if (this.candidateJobDetails[i].jobOpeningId === this.candidateDetails[j].jobOpeningId) {
                this.candidateDetails[j].isCandidate = true;
              }
            }
          }
        }
        this.gridData = process(this.candidateDetails, this.state);
      }
    });
  }

  saveJob() {
    this.savingInProgress = true;
    const candidateUpsert = new CandidateUpsertModel();
    candidateUpsert.candidateJson = JSON.stringify(this.updateJob);
    candidateUpsert.candidateId = this.candidateId;
    candidateUpsert.isJobLink = true;
    candidateUpsert.isJob = this.isJob;
    this.recruitmentService.upsertCandidate(candidateUpsert).subscribe((response: any) => {
      if (response.success) {
        this.savingInProgress = false;
        this.isPopCLose = true;
        this.toastr.success('' + this.translateService.instant('PERFORMANCE.SAVEDSUCCESSFULLY'));
        this.openClosingPopup();
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
    this.isJob = data.jobOpeningStatus.toLowerCase() === 'closed' ? true : false;
    data.isJobOpening = ch;
    const obj = {
      jobOpeningId: data.jobOpeningId,
      isJobOpening: data.isJobOpening,
      canJobOpeningId: data.candidateJobOpeningId,
      candidateId: this.candidateId,
    };
    this.updateJob.push(obj);

  }
  cancelClosingPopup() {
    this.savingInProgress = false;
    this.updateJob = [];
    this.getJobOpenings();
    this.gridData = process([], this.state);
  }

}
