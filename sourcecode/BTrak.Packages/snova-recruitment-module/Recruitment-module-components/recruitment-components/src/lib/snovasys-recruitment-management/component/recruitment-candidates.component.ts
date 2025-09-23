import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { JobOpening } from '../../snovasys-recruitment-management-apps/models/jobOpening.model';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { CandidateSearchtModel } from '../models/candidate-search.model';
import { CreateJobDetailsComponent } from './create-job-detail.component';
import { State } from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { RefreshJobOpeningList } from '../../snovasys-recruitment-management-apps/store/actions/job-opening.action';
import { Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { CandidateActionTypes, LoadCandidateItemsTriggered, RefreshCandidatesList } from '../../snovasys-recruitment-management-apps/store/actions/candidate.action';
import * as hiringStatusModuleReducer from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { SkillsModel } from '../../snovasys-recruitment-management-apps/models/skills.model';
import { InterviewScheduleModel } from '../../snovasys-recruitment-management-apps/models/interviewschedule.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-recruitment-candidates',
  templateUrl: 'recruitment-candidates.component.html'
})

export class CandidatesComponent extends CustomAppBaseComponent implements OnInit, OnDestroy {
  @Output() jobSelected = new EventEmitter<any>();
  @Output() loading = new EventEmitter<any>();
  @Output() jobAdded = new EventEmitter<any>();
  @Output() skillSelected = new EventEmitter<any>();
  @Output() interviewTypeSelected = new EventEmitter<any>();
  @Input('activeJobs')
  set _setActiveJobs(activeJobs: any) {
    if (activeJobs != null && activeJobs !== undefined) {
      this.actvieJobsList = activeJobs;
      this.isJobLoading$ = this.store.pipe(select(hiringStatusModuleReducer.getJobOpeningLoading));
      if (this.actvieJobsList != null && this.actvieJobsList
        !== undefined && this.actvieJobsList !== '' && this.actvieJobsList.length > 0) {
        this.isActiveJobsBoard = true;
        this.isSkillsBoard = false;
        this.skillspin = false;
        this.interviewPin = false;
        this.isSkills = true;
        this.isInterviewer = true;
        this.jobspin = true;
        this.isemptyjobs = false;
        this.isInterviewerBoard = false;
        this.isSkillOrInterview = true;
      }
      this.isSkillOrInterview = true;
      this.cdRef.detectChanges();
    }
    if (activeJobs == null || activeJobs === undefined || activeJobs === '' || this.actvieJobsList.length === 0) {
      this.isActiveJobsBoard = false;
      this.isSkillsBoard = false;
      this.jobspin = true;
      this.isSkills = false;
      this.isInterviewer = false;
      this.skillspin = false;
      this.interviewPin = false;
      this.isInterviewerBoard = false;
      this.isemptyjobs = true;
      this.isSkillOrInterview = true;
      this.cdRef.detectChanges();
    }
  }

  @Input('selectedJob')
  set _setselectedJob(selectedJob: any) {
    if (selectedJob != null && selectedJob !== undefined) {
      let selectedJobChanged = false;
      if ((this.selectedJob !== undefined && this.selectedJob != null && this.selectedJob.jobOpeningId !== selectedJob.jobOpeningId) ||
        (this.selectedJob === undefined || this.selectedJob == null)) {
        selectedJobChanged = true;
      }
      this.selectedJob = selectedJob;
      if (selectedJobChanged) {
        this.getCandiates(this.selectedJob, false);
      }
      this.cdRef.detectChanges();
    }
  }

  @Input('openingstatus')
  set _setOpeningstatus(openingstatus: any) {
    if (openingstatus != null && openingstatus !== undefined) {
      this.openingstatus = openingstatus;
      this.cdRef.detectChanges();
    }
  }

  isemptyjobs: boolean;
  jobspin: boolean;
  isAnyOperationIsInprogress: boolean;
  isArchived: any;
  isThereAnError: boolean;
  skills: any;
  selectedSkill: any;
  selectedInterviewType: any;
  temp: any;
  validationMessage: any;
  selectedCandidate: any;
  skillspin: boolean;
  interviewTypes: any;
  interviewPin: boolean;
  assignee: any;
  searchText: any;
  emptySkillBoard: boolean;
  skillsLoading: boolean;
  candidateUpdatedinSide: boolean;
  skillsLength: any;
  pageNumber: any = 1;
  pageSize: any = 25;
  assigneeId: any;
  selectedTab: string;
  selectedTabIndex: number;
  isActiveJobsBoard: boolean;
  isSkillsBoard = false;
  isInterviewerBoard: boolean;
  isSkillOrInterview = false;
  isJob: boolean;
  isJobs: boolean;
  isSkills = false;
  isInterviewer = false;
  actvieJobsList: any;
  activeJobsList$: Observable<JobOpening[]>;
  showDiv: boolean;
  selectedJob: any = null;
  candidateSearchCriteria: any;
  public ngDestroyed$ = new Subject();
  candidatesLoading$: Observable<boolean>;
  isCandidateExists = true;
  isJobOpeningLoading = true;
  isJobLoading$: Observable<boolean>;
  openingstatus: any;
  candidateLoader = Array;
  candidateLoaderCount = 4;

  constructor(
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private recruitmentService: RecruitmentService,
    private toastr: ToastrService,
    private store: Store<State>,
    private actionUpdates$: Actions,
  ) {
    super();
    this.getInterviewTypes();
    this.actionUpdates$
      .pipe(
        ofType(CandidateActionTypes.LoadCandidateItemsCompleted),
        tap((result: any) => {
          this.candidateSearchCriteria = result.candidate;
          if (this.selectedCandidate) {
            this.selectedUserInfoUpdate();
          }
          if (this.candidateSearchCriteria.length > 0) {
            this.isCandidateExists = true;
          } else {
            this.isCandidateExists = false;
          }
          this.cdRef.detectChanges();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(CandidateActionTypes.LoadCandidateItemsDetailsFailed),
        tap((result: any) => {
          this.toastr.error(result.validationMessages);
          this.cdRef.detectChanges();
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.selectedTabIndex = 0;
    if (window.matchMedia('(min-width: 768px)').matches) {
      this.showDiv = true;
    }
    this.isJobLoading$ = this.store.pipe(select(hiringStatusModuleReducer.getJobOpeningLoading));
  }

  @HostListener('window:resize', [])
  sizeChange() {
    if (window.matchMedia('(max-width: 768px)').matches) {
      this.showDiv = false;
    } else {
      this.showDiv = true;
    }
  }

  getActiveJobsView() {
    if (!this.jobspin && (this.interviewPin || this.skillspin)) {
      this.selectedCandidate = null;
    }
    this.isJobs = !this.isJobs;
    this.jobspin = true;
    this.selectedCandidate = null;
    this.interviewPin = false;
    this.isInterviewerBoard = false;
    this.isSkills = true;
    this.isInterviewer = true;
    this.skillspin = false;
    this.isActiveJobsBoard = !this.isActiveJobsBoard;
    this.isSkillsBoard = false;
    if (this.actvieJobsList) {
      this.selectedJob = null;
      this.selectedJob = this.actvieJobsList[0];
      this.getCandiates(this.selectedJob, false);
    }
    this.isSkillOrInterview = false;
    this.cdRef.detectChanges();
  }

  getSkillsView() {
    if (!this.skillspin && (this.interviewPin || this.jobspin)) {
      this.selectedCandidate = null;
    }
    this.selectedCandidate = null;
    if (!this.skillspin) {
      this.skillsLength = null;
      this.skillsLoading = true;
      this.isAnyOperationIsInprogress = true;
      this.skillsLoading = true;
      this.GetSkillsByCandidates();
    }
    this.isJobs = true;
    this.isSkills = !this.isSkills;
    this.jobspin = false;
    this.skillspin = true;
    this.interviewPin = false;
    this.isActiveJobsBoard = false;
    this.isInterviewer = true;
    this.isSkillsBoard = !this.isSkillsBoard;
    this.isSkillOrInterview = true;
    this.cdRef.detectChanges();
  }

  getInterviewer() {
    this.getInterviewTypes();
    if (!this.interviewPin && (this.jobspin || this.skillspin)) {
      this.selectedCandidate = null;
    }
    this.isJobs = true;
    this.isInterviewer = !this.isInterviewer;
    this.jobspin = false;
    this.skillspin = false;
    this.isSkills = true;
    this.interviewPin = true;
    this.isInterviewerBoard = !this.isInterviewerBoard;
    this.isActiveJobsBoard = false;
    this.isSkillsBoard = false;
    // if (this.interviewTypes.length>0) {
    //   this.assignee = { assigneeName: this.interviewTypes[0].assigneeNames, assigneeId: this.interviewTypes[0].assignee };
    // }
    this.isSkillOrInterview = true;
    this.cdRef.detectChanges();
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }

  selectJob(jobSelected) {
    this.pageNumber = 1;
    if (jobSelected.checked) {
      if (this.selectedJob.jobOpeningId !== jobSelected.job.jobOpeningId) {
        this.candidateCloseClicked();
      }
      this.selectedJob = jobSelected.job;
      this.getCandiates(jobSelected.job, false);
      this.cdRef.detectChanges();
      this.jobSelected.emit(this.selectedJob);
    }
  }

  selectCandidate(event) {
    if (event) {
      this.selectedCandidate = event;
    } else {
      this.selectedCandidate = null;
    }
  }

  createJobDetails(result) {
    const dialogRef = this.dialog.open(CreateJobDetailsComponent, {
      disableClose: true,
      width: '850px', height: '720px',
      data: { data: result }
    });
    // tslint:disable-next-line: no-shadowed-variable
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        if (result.addedJob != null && result.addedJob !== '') {
        } else {
        }
      }
    });
  }

  getJobOpenings() {
    const jobOpening = new JobOpening();
    this.store.dispatch(new RefreshJobOpeningList(jobOpening));
  }

  addOrEditJob(value) {
    if (value) {
    }
  }

  jobAdd(value) {
    if (value) {
      this.jobAdded.emit(value);
    }
  }

  changeJob(value) { }

  candidateCloseClicked() {
    this.selectedCandidate = null;
  }

  candiateAdded(event) {
    if (event.isAdded !== '') {
      this.getCandiates(this.selectedJob, true);
    }
    if (event.isUpdated !== '' && this.isInterviewerBoard !== true) {
      this.pageNumber = event.pageNumber;
      this.getJobOpenings();
      this.getCandiates(this.selectedJob, true);
    }
    if (event.isUpdated !== '' && this.isInterviewerBoard === true) {
      this.pageNumber = event.pageNumber;
      this.assigneeId = event.assigneeId;
      this.getCandiatesbyInterviewer();
    }
  }

  getCandiatesbyInterviewer() {
    const candidateSearchtModel = new CandidateSearchtModel();
    candidateSearchtModel.pageSize = this.pageSize;
    candidateSearchtModel.pageNumber = this.pageNumber;
    candidateSearchtModel.interviewerId = this.assigneeId;
    this.store.dispatch(new RefreshCandidatesList(candidateSearchtModel));
  }

  pageChangeEmit(event) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.cdRef.detectChanges();
  }

  getCandiates(selectedJob, isRefresh) {
    const candidateSearchtModel = new CandidateSearchtModel();
    candidateSearchtModel.pageSize = this.pageSize;
    candidateSearchtModel.pageNumber = this.pageNumber;
    candidateSearchtModel.jobOpeningId = selectedJob.jobOpeningId;
    if (isRefresh) {
      this.store.dispatch(new RefreshCandidatesList(candidateSearchtModel)); } else {
      this.store.dispatch(new LoadCandidateItemsTriggered(candidateSearchtModel)); }
  }

  selectedUserInfoUpdate() {
    this.candidateSearchCriteria.forEach(x => {
      if (x.candidateId === this.selectedCandidate.candidateId && x.jobOpeningId === this.selectedCandidate.jobOpeningId) {
        this.selectedCandidate = x;
      }
    });
    this.cdRef.detectChanges();
  }

  candidateUpdated(value) {
    this.candidateUpdatedinSide = true;
    if (value && this.isSkillsBoard !== true && this.isInterviewerBoard !== true) {
      this.getJobOpenings();
    }
  }

  GetSkillsByCandidates() {
    const skillsModel = new SkillsModel();
    skillsModel.isArchived = false;
    skillsModel.pageNumber = this.pageNumber;
    skillsModel.pageSize = this.pageSize;
    this.recruitmentService.GetSkillsByCandidates(skillsModel).subscribe((response: any) => {
      if (response.success === true) {
        this.isThereAnError = false;
        this.skills = response.data;
        this.selectedSkill = this.skills[0];
        this.skillsLength = this.skills.length;
        this.temp = this.skills;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      }
      this.skillsLoading = false;
      this.loading.emit(false);
    });
  }

  getInterviewTypes() {
    const interviewTypesModel = new InterviewScheduleModel();
    interviewTypesModel.IsInterviewer = true;
    interviewTypesModel.pageNumber = this.pageNumber;
    interviewTypesModel.pageSize = this.pageSize;
    this.recruitmentService.getCandidateInterviewSchedule(interviewTypesModel).subscribe((responseData: any) => {
      this.interviewTypes = responseData.data;
      if (this.interviewTypes) {
        this.assignee = { assigneeName: this.interviewTypes[0].assigneeNames, assigneeId: this.interviewTypes[0].assignee };
      }
      this.isThereAnError = false;
      this.selectedInterviewType = this.interviewTypes[0];
      this.temp = this.interviewTypes;
      this.isAnyOperationIsInprogress = false;
      this.cdRef.detectChanges();
    });
  }

  selectSkill(skillSelected) {
    if (skillSelected.checked) {
      if (this.selectedSkill.skillId !== skillSelected.skill.skillId) {
      }
      this.selectedSkill = skillSelected.skill;
      this.cdRef.detectChanges();
      this.skillSelected.emit(this.skillSelected);
    }
  }

  selectInterviewType(selectInterviewType) {
    if (selectInterviewType.checked) {
      if (this.selectedInterviewType.assignee !== selectInterviewType.interview.assignee) {
      }
      this.selectedInterviewType = selectInterviewType.interview;
      this.assignee = { assigneeName: this.selectedInterviewType.assigneeNames, assigneeId: this.selectedInterviewType.assignee };
      this.cdRef.detectChanges();
    }
  }

  skillpagingChanged(event) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.GetSkillsByCandidates();
  }

  interviewerpagingChanged(event) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.getInterviewTypes();
  }
}

