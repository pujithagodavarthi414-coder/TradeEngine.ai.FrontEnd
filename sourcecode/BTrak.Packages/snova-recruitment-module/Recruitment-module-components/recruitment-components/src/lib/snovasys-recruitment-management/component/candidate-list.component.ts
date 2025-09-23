import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { CandidateSearchCriteriaInputModel } from '../models/candidate-input.model';
import { DragulaService } from 'ng2-dragula';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { Observable, Subject } from 'rxjs';
import { State } from '../../snovasys-recruitment-management-apps/store/reducers/index';
import * as candidatesModuleReducer from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { Store, select } from '@ngrx/store';
import { RoleModel } from '../../snovasys-recruitment-management-apps/models/rolesdropdown.model';
import { Branch } from '../../snovasys-recruitment-management-apps/models/branch';
import { JobOpeningStatusInputModel } from '../../snovasys-recruitment-management-apps/models/jobOpeningStatusInputModel';
import { RefreshCandidatesList } from '../../snovasys-recruitment-management-apps/store/actions/candidate.action';
import { InterviewRoundsModel } from '../../snovasys-recruitment-management-apps/models/interviewRounds.model';
import * as _ from 'underscore';
import { HiringStatusActionTypes, LoadHiringStatusItemsTriggered } from '../../snovasys-recruitment-management-apps/store/actions/hiring-status.action';
import { CandidateSearchtModel } from '../models/candidate-search.model';
import { HiringStatusUpsertModel } from '../../snovasys-recruitment-management-apps/models/hiringStatusUpsertModel';
import * as hiringStatusModuleReducer from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'gc-candidate-list',
  templateUrl: 'candidate-list.component.html',
  providers: [DragulaService]
})

export class CandidateListComponent extends CustomAppBaseComponent implements OnInit, OnDestroy {
  @Output() selectCandidate = new EventEmitter<any>();
  @Output() candiateAddedEmit = new EventEmitter<any>();
  @Output() pageChangeEmit = new EventEmitter<any>();
  job: any;
  candidates: any = [];
  candidateLoader = Array;
  candidateLoaderCount = 3;
  isVisible: boolean;
  selectedTab = 'active-jobs';
  scrollDistance: any;
  isAnyOperationIsInProgress: boolean;
  jobOpening: any;
  public ngDestroyed$ = new Subject();
  candidatesLoading$: Observable<boolean>;
  temp: any;
  searchText: any;
  isCandidateExisits: boolean;
  selectedCandidateId: string;
  roleList: any;
  tempinterviewtypes: any;
  hiringStatus: any;
  interviewTypesList: any;
  assigneManagerList: any;
  branchList: any;
  isInterviewerBoard = true;
  assignee: string;
  isEmployee: any;
  isEmployeeExisits: boolean;
  openingstatus: any;
  employeeList: any;
  test: any;
  list: any;
  tempz: any;
  interviewType: any;
  hiringStatusIds: string;
  interviewTypeIds: string;
  assignedToManagerIds: string;
  filter: boolean;
  totalCount: any = 0;
  pageSize = 25;
  pageIndex: number;
  pageNumber = 1;
  pageSizeOptions: number[] = [25, 50, 100, 150, 200];
  employeeCheck: any = false;
  hiringStatus$: Observable<HiringStatusUpsertModel[]>;
  assigneeId: any;

  @Input('job')
  set _job(job: any) {
    if (job != null && job !== undefined) {
      this.job = job;
      this.cdRef.detectChanges();
    }
  }

  @Input('candidateSearchCriteria')
  set setCandidateSearchCriteria(
    candidateSearchCriteria: CandidateSearchCriteriaInputModel[]
  ) {
    if (candidateSearchCriteria !== undefined) {
      this.candidates = candidateSearchCriteria;
      this.isCandidateExisits = this.candidates.length > 0 ? true : false;
      this.temp = this.candidates;
      this.totalCount = 0;
      if (this.candidates.length > 0) {
        this.totalCount = this.candidates[0].totalCount;
        this.pageNumber = this.candidates[0].pageNumber;
        this.pageIndex = this.candidates[0].pageNumber - 1;
        this.pageSize = this.candidates[0].pageSize;
      }
    }
  }

  @Input('isCandidateExists')
  set _isCandidateExists(data: any) {
    this.isCandidateExisits = data;
    this.cdRef.detectChanges();
  }
  @Input('isInterviewerBoard')
  set _isInterviewerBoard(data: boolean) {
    if (data) {
      this.isInterviewerBoard = data;
      this.cdRef.detectChanges();
    } else if (data === false) {
      this.isInterviewerBoard = data;
      this.cdRef.detectChanges();
    }
  }

  @Input('assignee')
  set _assignee(data: any) {
    if (data) {
      this.assignee = data.assigneeName;
      this.assigneeId = data.assigneeId;
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.searchText = null;
    this.isEmployee = true;
    this.candidatesLoading$ = this.store.pipe(select(candidatesModuleReducer.getCandidatesLoading));
    this.getRoles();
    this.getBranch();
    this.getInterviewTypes();
  }

  constructor(
    private toastr: ToastrService,
    public recruitmentService: RecruitmentService,
    private cdRef: ChangeDetectorRef,
    private store: Store<State>,
    private actionUpdates$: Actions,
  ) {
    super();
    this.actionUpdates$
      .pipe(
        ofType(HiringStatusActionTypes.LoadHiringStatusItemsCompleted),
        tap(() => {
          this.hiringStatus$ = this.store.pipe(select(hiringStatusModuleReducer.getHiringStatusAll));
          this.hiringStatus$.subscribe((result) => {
            this.hiringStatus = result;
          });
          this.cdRef.detectChanges();
        })
      )
      .subscribe();
    this.getjobOpeningStatus();
    this.getHiringStatus();
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }

  selectedCandidate(event) {
    if (event.isEmit) {
      this.selectedCandidateId = event.candidate.candidateId;
      this.selectCandidate.emit(event.candidate);
    }
  }

  getjobOpeningStatus() {
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

  filterHiringStatus(hiringStatusId) {
    if (hiringStatusId) {
      this.hiringStatusIds = hiringStatusId;

    } else {
      this.hiringStatusIds = null;
    }
    this.getFilterData();
  }

  filterInterviewType(interviewTypeIds) {
    if (interviewTypeIds) {
      this.interviewTypeIds = interviewTypeIds;

    } else {
      this.interviewTypeIds = null;
    }
    this.getFilterData();
  }

  filterCandidatesByAssignee(assignedToManagerId) {
    if (assignedToManagerId) {
      this.assignedToManagerIds = assignedToManagerId;

    } else {
      this.assignedToManagerIds = null;
    }
    this.getFilterData();
  }

  onScrollDown() {}

  searchcandidate(value) {
    this.searchText = value;
    this.filterByName(value);
  }

  filterByName(value) {
    if (this.searchText != null && this.searchText !== undefined && this.searchText !== '') {} else {
      this.searchText = null;
    }
    this.getFilterData();
  }

  searchemployee(value) {
    this.employeeCheck = value;
    this.getFilterData();
  }

  getInterviewTypesEmmit(value) {
    this.getInterviewTypes();
  }

  getInterviewTypes() {
    const interviewTypeResult = new InterviewRoundsModel();
    interviewTypeResult.isArchived = false;
    this.recruitmentService.getInterviewRounds(interviewTypeResult).subscribe((response: any) => {
      if (response.success) {
        this.interviewType = response.data;
        this.cdRef.detectChanges();
      } else {
        this.toastr.error(response.apiResponseMessages[0].message);
      }
    });
  }

  candiateAdded(event) {
    const emitObj = { isAdded: event, isUpdated: '', pageNumber: this.pageNumber };
    this.candiateAddedEmit.emit(emitObj);
  }

  candidateUpdated(event) {
    const emitObj = { isAdded: '', isUpdated: event, pageNumber: this.pageNumber, assigneeId: this.assigneeId };
    this.candiateAddedEmit.emit(emitObj);
  }

  highLightSelectedCandidate(candidateId) {
    if (this.selectedCandidateId === candidateId) {
      return true;
    } else {
      return false;
    }
  }

  getRoles() {
    const roleModel = new RoleModel();
    this.recruitmentService.getAllRolesDropDown(roleModel).subscribe((response: any) => {
      if (response.success === true) {
        this.roleList = response.data;
        this.cdRef.detectChanges();
      }
    });
  }

  getBranch() {
    const branchSearchResult = new Branch();
    this.recruitmentService.getBranchList(branchSearchResult).subscribe((response: any) => {
      if (response.success === true) {
        this.branchList = response.data;
        this.cdRef.detectChanges();
      }
    });
  }

  getFilterData() {
    this.candidates = this.temp;
    if (this.hiringStatusIds != null) {
      const hiringStatus = this.hiringStatusIds.split(',');
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(this.candidates, function(priority: any) {
        return hiringStatus.includes(priority.hiringStatusId);
      });
      this.candidates = filteredList;
    }
    if (this.interviewTypeIds != null) {
      const interviewTypes = this.interviewTypeIds.split(',');
      var filteredIds: any;
      // tslint:disable-next-line: only-arrow-functions
      let filteredListData: any = _.filter(this.candidates, function(priorityList: any) {
        let isMapped = false;
        interviewTypes.forEach(x => {
          if (priorityList.interviewTypeIds != null && priorityList.interviewTypeIds !== undefined) {
            const selectedTypeIds = priorityList.interviewTypeIds.split(',');
            selectedTypeIds.forEach((selectedType => {
              if (selectedType.trim().toLowerCase() === x.toLowerCase()) {
                isMapped = true;
              }
            }));
          }
        });
        if (isMapped) {
          filteredIds.push(priorityList);
          return filteredIds;
        }
      });
      filteredListData = _.uniq(filteredListData);
      this.candidates = filteredListData;
    }
    if (this.assignedToManagerIds != null) {
      const managerIds = this.assignedToManagerIds.split(',');
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(this.candidates, function(priority: any) {
        return managerIds.includes(priority.assignedToManagerId == null ? 'null' : (priority.assignedToManagerId));
      });
      this.candidates = filteredList;
    }

    if (this.searchText != null && this.searchText !== undefined && this.searchText !== '') {
      this.candidates = this.candidates.filter(data =>
        (data.jobOpeningTitle.indexOf(this.searchText) > -1)
        || (data.firstName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1)
        || (data.email.indexOf(this.searchText) > -1)
        || (data.experienceInYears == null ? null : data.experienceInYears.toString().indexOf(this.searchText) > -1)
        || (data.phone.indexOf(this.searchText) > -1));
    }
    if (this.employeeCheck) {
      const employeeCheck = this.employeeCheck;
      // tslint:disable-next-line: only-arrow-functions
      const temp = _.filter(this.candidates, function(data: any) {
        return data.isEmployee === employeeCheck;
      });
      this.candidates = temp;
      this.isCandidateExisits = this.candidates.length > 0 ? true : false;
    }
  }

  public get value(): string {
    return;
  }

  getCandiates(pageEvent) {
    const candidateSearchtModel = new CandidateSearchtModel();
    const emitObj = { pageNumber: pageEvent.pageIndex + 1, pageSize: pageEvent.pageSize };
    this.pageChangeEmit.emit(emitObj);
    if (pageEvent.pageSize !== this.pageSize) {
      this.pageNumber = 1;
      this.pageIndex = 0;
    } else {
      this.pageNumber = pageEvent.pageIndex + 1;
      this.pageIndex = pageEvent.pageIndex;
    }
    this.pageSize = pageEvent.pageSize;
    candidateSearchtModel.pageSize = this.pageSize;
    candidateSearchtModel.pageNumber = this.pageNumber;
    if (this.isInterviewerBoard === true) {
      candidateSearchtModel.interviewerId = this.assigneeId;
    } else {
      candidateSearchtModel.jobOpeningId = this.job.jobOpeningId;
    }
    this.store.dispatch(new RefreshCandidatesList(candidateSearchtModel));
  }

  getHiringStatus() {
    const hiring = new HiringStatusUpsertModel();
    hiring.isArchived = false;
    this.store.dispatch(new LoadHiringStatusItemsTriggered(hiring));
    this.hiringStatus$ = this.store.pipe(select(hiringStatusModuleReducer.getHiringStatusAll));
    this.hiringStatus$.subscribe((result) => {
      this.hiringStatus = result;
    });
  }
}
