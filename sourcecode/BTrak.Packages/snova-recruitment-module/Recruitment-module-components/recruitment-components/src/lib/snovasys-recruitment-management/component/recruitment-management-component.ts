import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { JobOpening } from '../../snovasys-recruitment-management-apps/models/jobOpening.model';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { State } from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { JobOpeningActionTypes, LoadJobOpeningItemsTriggered, RefreshJobOpeningList } from '../../snovasys-recruitment-management-apps/store/actions/job-opening.action';
import { Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { CandidateActionTypes } from '../../snovasys-recruitment-management-apps/store/actions/candidate.action';
import { JobOpeningStatusInputModel } from '../../snovasys-recruitment-management-apps/models/jobOpeningStatusInputModel';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-recruitment-management',
  templateUrl: 'recruitment-management-component.html'
})

export class RecruitmentManagementComponent extends CustomAppBaseComponent implements OnInit, OnDestroy {
  selectedTab: string;
  selectedTabIndex: number;
  activeJobs: any = [];
  activeJobs$: Observable<JobOpening[]>;
  isAnyOperationIsInprogress: boolean;
  activeJobsCount: any = null;
  selectedJob: any = null;
  isJobAdded = false;
  openingstatus: any;
  public ngDestroyed$ = new Subject();

  constructor(
    private dialog: MatDialog,
    private recruitmentService: RecruitmentService,
    private store: Store<State>,
    private actionUpdates$: Actions,
    private cdRef: ChangeDetectorRef
  ) {
    super();

    this.actionUpdates$
      .pipe(
        ofType(JobOpeningActionTypes.LoadJobOpeningItemsCompleted),
        tap((result: any) => {
          this.activeJobs = result.jobOpening;
          if (this.activeJobs == null || this.activeJobs === undefined) {
            this.activeJobs = '';
          }
          if (this.activeJobs != null && this.activeJobs !== undefined
             && this.activeJobs !== '' && this.selectedJob != null && this.selectedJob !== undefined) {
            let isselectedJob = false;
            this.activeJobs.forEach(x => {
              if (x.jobOpeningId === this.selectedJob.jobOpeningId) {
                isselectedJob = true;
              }
            });
            if (!isselectedJob) {
              this.selectedJob = this.activeJobs[0];
            }
          }
          if (this.selectedJob == null || this.selectedJob === undefined) {
            this.selectedJob = this.activeJobs[0];
          } else {
            if (this.isJobAdded === true) {
              this.selectedJob = this.activeJobs[0];
              this.isJobAdded = false;
            } else {
              if (this.selectedJob) {
                this.activeJobs.forEach(x => {
                  if (x.jobOpeningId === this.selectedJob.jobOpeningId) {
                    this.selectedJob = x;
                  }
                });
              }
            }
          }
          this.activeJobsCount = this.activeJobs[0];
          this.isAnyOperationIsInprogress = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(JobOpeningActionTypes.LoadJobOpeningItemsDetailsFailed),
        tap(() => {
          this.isAnyOperationIsInprogress = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(CandidateActionTypes.CreateCandidateItemCompleted),
        tap((result: any) => {
          this.getCandidatesCount();
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.selectedTabIndex = 1;
    this.selectedTab = 'Candidates';
    this.getJobOpenings(false);
    this.getjobOpeningStatus();
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }

  onTabClick(event: MatTabChangeEvent) {
    this.dialog.closeAll();
    if (event.tab.textLabel.includes('Candidates')) {
      this.selectedTab = 'Candidates';
      this.getJobOpenings(false);
      this.getjobOpeningStatus();
    } else if (event.tab.textLabel.includes('Interviews')) {
      this.selectedTab = 'Interviews';
    }
  }

  candidateArchive(value) {
    if (value) {
      this.selectedTab = 'Candidates';
    }
    this.cdRef.detectChanges();
  }

  isCandidates(value) {
    if (value === 'Candidates') {
      return true;
    } else {
      return false;
    }
  }

  jobSelected(value) {
    if (value) {
      this.selectedJob = value;
      this.cdRef.detectChanges();
    }
  }

  jobAdded(value) {
    if (value) {
      this.isJobAdded = true;
      this.getJobOpenings(true);
    }
  }

  getJobOpenings(isFromAdd) {
    const jobOpening = new JobOpening();
    this.isAnyOperationIsInprogress = true;
    jobOpening.pageNumber = 1;
    jobOpening.pageSize = 25;
    if (isFromAdd) {
      //this.store.dispatch(new RefreshJobOpeningList(jobOpening)); 
    } else {
      this.store.dispatch(new LoadJobOpeningItemsTriggered(jobOpening)); }
  }

  getCandidatesCount() {
    const jobOpening = new JobOpening();
    this.isAnyOperationIsInprogress = true;
    this.recruitmentService.getJobOpenings(jobOpening).subscribe((response: any) => {
      if (response.success) {
        this.activeJobsCount.totalCandidates = response.data[0].totalCandidates;
        this.isAnyOperationIsInprogress = false;
      } else {
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  getjobOpeningStatus() {
    this.isAnyOperationIsInprogress = false;
    const jobOpeningStatusInputModel = new JobOpeningStatusInputModel();
    jobOpeningStatusInputModel.isArchived = false;
    this.recruitmentService.getJobOpeningStatus(jobOpeningStatusInputModel).subscribe((response: any) => {
      if (response.success === true) {
        this.openingstatus = response.data;
        this.cdRef.detectChanges();
      } else {
        this.cdRef.detectChanges();
      }
    });
  }
}
