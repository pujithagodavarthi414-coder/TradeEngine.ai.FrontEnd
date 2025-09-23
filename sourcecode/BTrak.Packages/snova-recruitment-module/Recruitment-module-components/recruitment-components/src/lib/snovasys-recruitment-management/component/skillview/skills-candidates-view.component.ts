import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Store, select } from '@ngrx/store';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { RecruitmentService } from '../../../snovasys-recruitment-management-apps/services/recruitment.service';
import { State } from '../../../store/reducers.ts';
import { CandidateSearchCriteriaInputModel } from '../../models/candidate-input.model';
import { DragulaService } from 'ng2-dragula';
import { InterviewRoundsModel } from '../../../snovasys-recruitment-management-apps/models/interviewRounds.model';
import * as _ from 'underscore';
import { HiringStatusUpsertModel } from '../../../snovasys-recruitment-management-apps/models/hiringStatusUpsertModel';
import { HiringStatusActionTypes, LoadHiringStatusItemsTriggered } from '../../../snovasys-recruitment-management-apps/store/actions/hiring-status.action';
import { Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as hiringStatusModuleReducer from '../../../snovasys-recruitment-management-apps/store/reducers/index';
import { Observable } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'gc-skills-candidates-view',
  templateUrl: 'skills-candidates-view.component.html',
  providers: [DragulaService]
})

export class SkillsCandidateViewComponent extends CustomAppBaseComponent implements OnInit, OnDestroy {
  @Output() candiateAddedEmit = new EventEmitter<any>();
  @Output() selectCandidate = new EventEmitter<any>();
  skill: any;
  isAnyOperationIsInprogress: boolean;
  isThereAnError: boolean;
  candidates: any;
  isVisible: boolean;
  selectedTab = 'active-jobs';
  temp: any;
  validationMessage: any;
  scrollDistance: any;
  isCandidateExists = false;
  selectedSkill: any;
  selectedCandidate: any;
  showDiv: boolean;
  searchText: string;
  selectedCandidateId: any;
  isCandidateExisits: boolean;
  candidateLoader = Array;
  employeeCheck: any = false;
  candidateLoaderCount = 3;
  selectedCandidateJob: any;
  candidatesList: any;
  interviewType: any;
  hiringStatusIds: string;
  interviewTypeIds: string;
  assignedToManagerIds: string;
  totalCount: any;
  pageSizeOptions: number[] = [25, 50, 100, 150, 200];
  pageNumber: any = 1;
  pageSize: any = 25;
  pageIndex: any;
  hiringStatus$: Observable<HiringStatusUpsertModel[]>;
  hiringStatus: HiringStatusUpsertModel[];

  @Input('skill')
  set _skill(skill: any) {
    if (skill != null && skill !== undefined) {
      this.skill = skill;
      this.pageNumber = 1;
      this.pageSize = 25;
      this.pageIndex = 0;
      this.selectedSkill = this.skill.skillId;
      this.isAnyOperationIsInprogress = true;
      this.getcandidates(this.selectedSkill);
      this.cdRef.detectChanges();
    }
  }

  @Input('candidateUpdatedinSide')
  set _candidateUpdatedinSide(candidateUpdatedinSide: boolean) {
    if (candidateUpdatedinSide) {
      this.getcandidates(this.selectedSkill);
      this.cdRef.detectChanges();
    }
  }

  @Input('pageSize')
  set _pageSize(data: any) {
    this.pageSize = data;
  }

  @Input('pageNumber')
  set _pageNumber(data: any) {
    this.pageNumber = data;
  }

  ngOnInit() {
    super.ngOnInit();
    this.getInterviewTypes();

    if (window.matchMedia('(min-width: 768px)').matches) {
      this.showDiv = true;
    }
  }

  @HostListener('window:resize', [])
  sizeChange() {
    if (window.matchMedia('(max-width: 768px)').matches) {
      this.showDiv = false;
    } else {
      this.showDiv = true;
    }
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
  }

  public ngOnDestroy() {
  }

  getCandiates(pageEvent) {
    if (pageEvent.pageSize !== this.pageSize) {
      this.pageNumber = 1;
      this.pageIndex = 0;
    } else {
      this.pageNumber = pageEvent.pageIndex + 1;
      this.pageIndex = pageEvent.pageIndex;
    }
    this.pageSize = pageEvent.pageSize;
    this.getcandidates(this.selectedSkill);
  }


  getcandidates(value) {
    const candidatesearchmodel = new CandidateSearchCriteriaInputModel();
    candidatesearchmodel.skillId = value;
    candidatesearchmodel.pageNumber = this.pageNumber;
    candidatesearchmodel.pageSize = this.pageSize;
    this.recruitmentService.getCandidatesBySkill(candidatesearchmodel).subscribe((response: any) => {
      if (response.success === true) {
        this.isThereAnError = false;
        this.candidates = response.data;
        this.isCandidateExisits = this.candidates.length > 0 ? true : false;
        this.temp = this.candidates;
        this.totalCount = 0;
        if (this.candidates.length > 0) {
          this.totalCount = this.candidates[0].totalCount;
          this.pageNumber = this.candidates[0].pageNumber;
          this.pageIndex = this.candidates[0].pageNumber - 1;
          this.pageSize = this.candidates[0].pageSize;
          this.isCandidateExists = true;
        }
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
        this.isCandidateExists = false;
        this.cdRef.detectChanges();
      }
    });
  }

  getInterviewTypesEmmit(value) {
    this.getInterviewTypes();
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
  selectCandidates(event) {
    if (event.isEmit) {
      this.selectedCandidate = event.candidate;
      this.selectedCandidateId = event.candidate.candidateId;
      this.selectCandidate.emit(event.candidate);
      this.showDiv = true;
      this.selectedCandidateJob = event.candidate.jobOpeningId;
    } else {
      this.selectedCandidateId = null;
    }
  }

  candiateAdded(event) {
    const emitObj = { isAdded: event, isUpdated: '' };
    this.candiateAddedEmit.emit(emitObj);
  }

  candidateUpdated(event) {
    this.isAnyOperationIsInprogress = false;
    this.getcandidates(this.selectedSkill);
  }

  highLightSelectedCandidate(candidateId) {
    if (this.selectedCandidateId === candidateId) {
      return true;
    } else {
      return false;
    }
  }

  candidateCloseClicked() {
    this.selectedCandidate = null;
    this.showDiv = false;
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
    if (this.searchText != null && this.searchText !== undefined && this.searchText !== '') {

    } else {
      this.searchText = null;
    }
    this.getFilterData();

  }

  searchemployee(value) {
    this.employeeCheck = value;
    this.getFilterData();
  }


  getFilterData() {
    this.candidatesList = this.temp;
    if (this.hiringStatusIds != null) {
      const hiringStatus = this.hiringStatusIds.split(',');
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(this.candidatesList, function(priority: any) {
        return hiringStatus.includes(priority.hiringStatusId);
      });
      this.candidatesList = filteredList;
    }
    if (this.interviewTypeIds != null) {
      const interviewTypes = this.interviewTypeIds.split(',');
      var filteredIds: any;
      // tslint:disable-next-line: only-arrow-functions
      let filteredListData: any = _.filter(this.candidatesList, function(priorityList: any) {
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
      this.candidatesList = filteredListData;
    }
    if (this.assignedToManagerIds != null) {
      const managerIds = this.assignedToManagerIds.split(',');
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(this.candidatesList, function(priority: any) {
        return managerIds.includes(priority.assignedToManagerId == null ? 'null' : (priority.assignedToManagerId));
      });
      this.candidatesList = filteredList;
    }

    if (this.searchText != null && this.searchText !== undefined && this.searchText !== '') {
      this.candidatesList = this.candidatesList.filter(data =>
        (data.jobOpeningTitle.indexOf(this.searchText) > -1)
        || (data.firstName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1)
        || (data.email.indexOf(this.searchText) > -1)
        || (data.experienceInYears == null ? null : data.experienceInYears.toString().indexOf(this.searchText) > -1)
        || (data.phone.indexOf(this.searchText) > -1));
    }

    if (this.employeeCheck) {
      const employeeCheck = this.employeeCheck;
      // tslint:disable-next-line: only-arrow-functions
      const temp = _.filter(this.candidatesList, function(data: any) {
        return data.isEmployee === employeeCheck;
      });
      this.candidatesList = temp;
    }
    this.candidates = this.candidatesList;
    this.cdRef.detectChanges();
  }

  public get value(): string {
    return;
  }

}
