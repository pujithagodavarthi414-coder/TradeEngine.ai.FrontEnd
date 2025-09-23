import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter,
  HostListener, Input, OnDestroy, OnInit, Output, ViewChild, ViewChildren
} from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import * as _ from 'underscore';
import * as  moment from 'moment'
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { CandidateSearchCriteriaInputModel } from '../models/candidate-input.model';
import { CandidateUpsertModel } from '../models/CandidateUpsertModel';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { SourceUpsertModel } from '../../snovasys-recruitment-management-apps/models/SourceUpsertModel';
import { HiringStatusUpsertModel } from '../../snovasys-recruitment-management-apps/models/HiringStatusUpsertModel';
import { JobOpening } from '../../snovasys-recruitment-management-apps/models/jobOpening.model';
import { UserModel } from '../../snovasys-recruitment-management-apps/models/user-model';
import { HiringStatusActionTypes, LoadHiringStatusItemsTriggered } from '../../snovasys-recruitment-management-apps/store/actions/hiring-status.action';
import { State } from '../../snovasys-recruitment-management-apps/store/reducers/index';
import * as hiringStatusModuleReducer from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { CandidateActionTypes, CreateCandidateItemTriggered } from '../../snovasys-recruitment-management-apps/store/actions/candidate.action';
import { CountrySearch } from '../models/country-search.model';
import { DesigationSearch } from '../models/designation-search.model';
import { InterviewRoundsModel } from '../../snovasys-recruitment-management-apps/models/interviewRounds.model';
import { JobOpeningStatusInputModel } from '../../snovasys-recruitment-management-apps/models/jobOpeningStatusInputModel';
import { CandidateDocumentModel } from '../../snovasys-recruitment-management-apps/models/candidate-document.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';


@Component({
  selector: 'app-pm-component-superagile-board',
  templateUrl: 'superagile-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class SuperagileBoardComponent extends CustomAppBaseComponent implements OnInit, OnDestroy {
  @Output() searchcandidate = new EventEmitter<string>();
  @Output() searchemployee = new EventEmitter<any>();
  @ViewChildren('addCandidatePopover') addSectionsPopover;
  @Output() selectedAssigneManagerId = new EventEmitter<string>();
  @Output() selectedHiringStatusList = new EventEmitter<string>();
  @Output() selectedInterviewTypeList = new EventEmitter<string>();
  @Output() selectedSortByOption = new EventEmitter<string>();
  @Output() candiateAdded = new EventEmitter<any>();
  @ViewChild('allCandidateTypesSelected') private allCandidateTypesSelected: MatOption;
  @ViewChild('allCandidatesSelectedList') private allCandidatesSelectedList: MatOption;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('candidateDetailFormDirective') candidateDetailFormDirective: FormGroupDirective;

  @Input('job')
  set _job(job: JobOpening) {
    if (job != null && job !== undefined) {
      if (this.job != null && this.job.jobOpeningId !== job.jobOpeningId && this.searchText != null && this.searchText !== '') {
        this.searchText = '';
      }
      this.job = job;
      this.title = this.job.jobOpeningTitle;
      this.isJobOpeningClosed = false;
      this.isJobOpeningDraft = false;
      let openingStatus = false;
      if (this.openingstatus != null) {
        openingStatus = true;
        this.openingstatus.forEach(x => {
          if (x.order === 3 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
            this.isJobOpeningClosed = true;
          }
          if (x.order === 1 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
            this.isJobOpeningDraft = true;
          }
          if (x.order === 2 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
            this.isJobOpeningDraft = false;
            this.isJobOpeningClosed = false;
          }
        });
      }
      this.cdRef.detectChanges();
      this.formValidate();
      this.isArchived = false;
      this.selectedHiringType = null;
      this.selectedInterviewTypes = null;
      this.userNames = null;
      this.isFiltersShow = false;
      this.cdRef.detectChanges();
      if (!openingStatus) {
        this.getjobOpeningStatus();
      }
    }

  }

  @Input('skill')
  set _skill(skill: any) {
    if (skill != null && skill !== undefined) {
      if (this.skill != null && this.skill.skillId !== skill.skillId && this.searchText != null && this.searchText !== '') {
        this.searchText = '';
      }
      this.skill = skill;
      this.title = this.skill.skillName;
      this.isJobOpeningClosed = true;
      this.cdRef.detectChanges();
      this.formValidate();
      this.isFiltersShow = false;
      this.cdRef.detectChanges();
    }

  }

  @Input('assignee')
  set _assignee(data: string) {
    this.assignee = data;
    if (this.assignee) {
      this.title = this.assignee;
      this.cdRef.detectChanges();
    }
  }

  @Input('candidate')
  set setCandidate(
    candidate: CandidateSearchCriteriaInputModel[]
  ) {
    if (candidate !== undefined) {
      this.candidates = candidate;
      this.temp = this.candidates;
      this.setFunctionForCandidates();
    }
  }


  @Input('interviewType')
  set setInterviewType(
    interviewType: InterviewRoundsModel[]
  ) {
    if (interviewType !== undefined) {
      this.interviewType = interviewType;
      this.temp = this.interviewType;
    }
  }
  @Input('isCandidateExisits')
  set _isCandidateExisits(data: any) {

    this.isCandidateExisits = data;
    this.cdRef.detectChanges();

  }

  isReportsPage;
  @Input('isReportsPage')
  set _isReportsPage(isReportsPage: boolean) {
    this.isReportsPage = isReportsPage;
    if (this.isReportsPage) {
      this.isDocument = false;
    }
  }

  @Input('isDocument')
  set _isDocument(isDocument: boolean) {
    this.isDocument = isDocument;
    if (this.isDocument) {
      this.isReportsPage = false;
    }
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

  candidateStatus: any[];
  createCandidateForm: FormGroup;
  job: any;
  candidates: CandidateSearchCriteriaInputModel[];
  candidate: JobOpening[];
  anyOperationInProgress: boolean;
  skill: any;
  title: any;
  isInterviewerBoard: boolean;
  assignee: string;
  employees: any;
  candidateId: string;
  jobOpeningId: string;
  isArchived: boolean;
  temp: any;
  selectHiringStatus: any;
  hiringStatusId: string;
  hiringstatusList: any;
  selectedHiringStatus: any;
  hiringManagerIds: any;
  hiringstatus: any;
  assignToManagerIds: any;
  selectedUserList: any;
  interviewType: any;
  InterviewTypeIds: any;
  selectedInterviewType: any;
  interviewTypeIds: any;
  interviewTypesList: InterviewRoundsModel[];
  assignedToManagerId: string;
  assignedToManagerIds: string;
  isEmployee = false;
  isCandidateExisits: any;
  isAnyOperationIsInprogress: boolean;
  validationMessage: any;
  isThereAnError: boolean;
  candidateDocumentReferenceId: any;
  documentType: any;
  candidateTimeStamp: any;
  documentTypes: any;
  isFileExist: any;
  candidatesLoading$: Observable<boolean>;
  candidateDocument: any;
  isDefault: any = true;
  singleUpload: boolean;
  anyOperationInProgress$: Observable<boolean>;
  accessPublishBoard$: boolean;
  accessDragApps$: boolean;
  accessUploadIcons$: boolean;
  ownerName: string;
  showDropDown: boolean;
  isDocument: boolean;
  disabled: boolean;
  tab: string;
  isFiltersShow: boolean;
  isBacklogIssues: boolean;
  selectHiringStatusesForm: FormGroup;
  selectInterviewTypeFormList: FormGroup;
  selectedItem: boolean;
  checkReplan: boolean;
  userCheckedAll: boolean;
  searchText: string = null;
  estimatedTime: string;
  ownerId: string;
  searchTags: string;
  defaultName = 'N/A';
  clearFormValue: boolean;
  isSelected: any[] = [];
  isSelectedMembers: any[] = [];
  selectedAssigneelist = [];
  public ngDestroyed$ = new Subject();
  public showUsersList = false;
  divActivate = false;
  selectedMember: string;
  selectedSourcePerson: string;
  selectedHiringType: string;
  selectedInterviewTypes: string;
  orderByOption: string;
  selectedNames: string[] = [];
  userNames: string;
  defaultProfilePicture = 'assets/images/faces/18.png';
  unAssignedUserList: any;
  isUnassigned: boolean;
  savingInProgress = false;
  hiringStatus: any;
  hiringStatus$: Observable<HiringStatusUpsertModel[]>;
  sources: any;
  userList: any;
  countryList: any;
  designationList: any;
  isSourcePersonRequired: boolean;
  statesList: any;
  openingstatus: any = null;
  isJobOpeningClosed = false;
  expectedSalaryError = false;
  isJobOpeningDraft = false;
  selectedStoreId: null;
  moduleTypeId = 15;
  referenceTypeId = ConstantVariables.RecruitmentReferenceTypeId;
  isToUploadFiles = true;
  selectedParentFolderId: null;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private actionUpdates$: Actions,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private el: ElementRef,
    private recruitmentService: RecruitmentService
  ) {
    super();
    let variable: any;
    variable = moment;

    this.isSelected = [];
    this.isSelectedMembers = [];
    this.formValidate();
    this.clearCandidateTypeForm();
    this.clearCandidateTypeFormList();
    this.route.params.subscribe((params) => {
      this.tab = params['tab'.toString()];
      if (this.router.url.toString().includes('job')) {
        this.tab = 'xde';
      }
    });

    this.actionUpdates$
      .pipe(
        ofType(HiringStatusActionTypes.LoadHiringStatusItemsCompleted),
        tap(() => {
          this.hiringStatus$ = this.store.pipe(select(hiringStatusModuleReducer.getHiringStatusAll), tap(result => {
            this.hiringStatus = result;
          }));
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(CandidateActionTypes.CreateCandidateItemCompleted),
        tap((result: any) => {
          this.savingInProgress = false;
          this.emitCandiateAdded();
          this.candidateDetailFormDirective.resetForm();
          this.formValidate();
          this.candidateId = result.candidateId;
          if (this.singleUpload === true) {
            this.upsertDocument();
            this.singleUpload = false;
          }
          this.addSectionsPopover.forEach((p) => p.closePopover());
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(CandidateActionTypes.CreateCandidateItemFailed),
        tap((result: any) => {
          const status = this.store.pipe(select(hiringStatusModuleReducer.candidatesCreatedorUpsertFailed));
          status.subscribe((response) => {
            if (response) {
              // this.toastr.error(response[0].message);
            }
            this.savingInProgress = false;
          });
          this.cdRef.detectChanges();
        })
      )
      .subscribe();

  }

  ngOnInit() {
    super.ngOnInit();
    this.formValidate();
    this.clearCandidateTypeForm();
    this.clearCandidateTypeFormList();
    this.getSources();
    this.getHiringStatus();
    this.getUsersList();
    this.getInterviewTypes();
    this.getCountries();
    this.getDesignation();
    this.getStates();
  }

  clearAssigneeFilter() {
    this.assignedToManagerId = '';
    this.selectedAssigneelist = [];
    this.isSelected = [];
    this.isSelectedMembers = [];
    this.selectedNames = [];
    this.userNames = null;
    this.isUnassigned = null;
    this.selectedAssigneManagerId.emit(this.assignedToManagerId);
  }

  clearCandidateTypeForm() {
    this.selectHiringStatusesForm = new FormGroup({
      hiringStatusId: new FormControl('', [])
    });
  }

  clearCandidateTypeFormList() {
    this.selectInterviewTypeFormList = new FormGroup({
      interviewTypeIds: new FormControl('', [])
    });
  }

  getAssigneeValue(selectedEvent) {
    const users = this.userList;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList: any = _.find(users, function(memeber: any) {
      return memeber.id === selectedEvent;
    });
    if (filteredList) {
      this.selectedMember = filteredList.fullName;
    } else {
      this.selectedMember = null;
    }
  }

  getSourcePerson(selectedEvent) {
    const users = this.userList;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList: any = _.find(users, function(memeber: any) {
      return memeber.id === selectedEvent;
    });
    if (filteredList) {
      this.selectedSourcePerson = filteredList.fullName;
    } else {
      this.selectedSourcePerson = null;
    }
  }

  searchCandidates() {
    this.searchcandidate.emit(this.searchText);
  }

  searchEmployees() {
    this.isEmployee = !this.isEmployee;
    this.searchemployee.emit(this.isEmployee);
  }

  toggleUsers() {
    this.showUsersList = !this.showUsersList;
  }

  clickEvent(event) {
    this.divActivate = !this.divActivate;
    this.toggleUsers();
  }

  closeSearch() {
    this.searchText = '';
    this.searchCandidates();
  }

  toggleAllHiringStatusList() {
    if (this.allCandidateTypesSelected.selected && this.hiringStatus) {
      this.selectHiringStatusesForm.controls.hiringStatusId.patchValue([
        ...this.hiringStatus.map((item) => item.hiringStatusId),
        0
      ]);
      this.selectedHiringStatus = this.hiringStatus.map((item) => item.hiringStatusId);
    } else {
      this.selectHiringStatusesForm.controls.hiringStatusId.patchValue([]);
    }
    this.getHiringStatusList();
  }

  toggleAllInterviewTypesList() {
    if (this.allCandidatesSelectedList.selected && this.interviewType) {
      this.selectInterviewTypeFormList.controls.interviewTypeIds.patchValue([
        ...this.interviewType.map((item) => item.interviewTypeId),
        0
      ]);

    } else {
      this.selectInterviewTypeFormList.controls.interviewTypeIds.patchValue([]);
    }
    this.getInterviewTypeList();
  }

  clearCandidateFilters() {
    this.searchText = null;
    this.isEmployee = false;
    this.searchTags = null;
    this.selectInterviewTypeFormList.reset();
    this.selectHiringStatusesForm.reset();
    this.selectedAssigneelist = [];
    this.selectedHiringType = null;
    this.assignedToManagerId = '';
    this.selectedInterviewTypes = null;
    this.searchCandidates();
    this.isSelected = [];
    this.isSelectedMembers = [];
    this.selectedAssigneelist = [];
    this.userNames = null;
    this.selectedSortByOption.emit('');
    this.selectedInterviewTypeList.emit('');
    this.selectedHiringStatusList.emit('');
    this.selectedAssigneManagerId.emit(this.assignedToManagerId);
    this.orderByOption = null;
    this.selectedSortByOption.emit('');
    this.userNames = null;
    this.isUnassigned = null;
  }

  closeAssigneeDropdown() {
    this.showUsersList = false;
  }

  clearHiringType() {
    this.selectedHiringType = null;
    this.hiringStatusId = null;
    this.selectHiringStatusesForm.reset();
    this.selectedHiringStatusList.emit(this.hiringStatusId);
  }

  clearInterviewType() {
    this.selectedInterviewTypes = null;
    this.interviewTypeIds = null;
    this.selectInterviewTypeFormList.reset();
    this.selectedInterviewTypeList.emit(this.interviewTypeIds);
  }


  onClick(event) {
    if (!this.el.nativeElement.contains(event.target)) { // similar checks
      this.closeAssigneeDropdown();
    }
  }

  getAssigne(userId, isChecked, selectedIndex, userName) {
    if (isChecked) {
      this.selectedAssigneelist.push(userId);
      this.selectedNames.push(userName);
      this.isSelected[selectedIndex] = true;
    } else {
      const index = this.selectedAssigneelist.indexOf(userId);
      this.selectedAssigneelist.splice(index, 1);
      this.selectedNames.splice(index, 1);
      this.isSelected[selectedIndex] = false;
    }
    this.userNames = this.selectedNames.toString();
    this.assignedToManagerId = this.selectedAssigneelist.toString();
    this.selectedAssigneManagerId.emit(this.assignedToManagerId);
  }

  getSelectedMember(userId, selectedIndex, userName) {
    const index = this.selectedAssigneelist.indexOf(userId);
    if (index > -1) {
      this.selectedAssigneelist.splice(index, 1);
      this.selectedNames.splice(index, 1);
      this.isSelectedMembers[selectedIndex] = false;
    } else {
      this.selectedAssigneelist.push(userId);
      this.selectedNames.push(userName);
      this.isSelectedMembers[selectedIndex] = true;
    }
    const isResult = this.selectedNames.filter((x) => x === 'N/A');
    if (isResult.length > 0) {
      this.isUnassigned = true;
    } else {
      this.isUnassigned = false;
    }
    this.userNames = this.selectedNames.toString();
    this.assignedToManagerId = this.selectedAssigneelist.toString();
    this.selectedAssigneManagerId.emit(this.assignedToManagerId);
  }

  getHiringStatusList() {
    const selectedTypes = this.selectHiringStatusesForm.value.hiringStatusId;
    const index = selectedTypes.indexOf(0);
    if (index > -1) {
      selectedTypes.splice(index, 1);
    }

    this.hiringStatusId = selectedTypes.toString();
    const hiringStatus = this.hiringStatus;
    // tslint:disable-next-line: only-arrow-functions
    const hiringStatusList: any = _.filter(hiringStatus, function(priority: any) {
      return selectedTypes.toString().includes(priority.hiringStatusId);
    });
    const hiringStatusesList = hiringStatusList.map((x: any) => x.status);
    this.selectedHiringType = hiringStatusesList.toString();
    this.cdRef.detectChanges();
    this.selectedHiringStatusList.emit(this.hiringStatusId);
  }

  getInterviewTypeList() {
    const selectedTypesList = this.selectInterviewTypeFormList.value.interviewTypeIds;
    const index = selectedTypesList.indexOf(0);
    if (index > -1) {
      selectedTypesList.splice(index, 1);
    }
    this.interviewTypeIds = selectedTypesList.toString();
    const interviewType = this.interviewType;
    // tslint:disable-next-line: only-arrow-functions
    const interviewTypeListData = _.filter(interviewType, function(priorityList: any) {
      return selectedTypesList.toString().includes(priorityList.interviewTypeId);
    });
    const interviewTypeNameList = interviewTypeListData.map((x: any) => x.interviewTypeName);
    this.selectedInterviewTypes = interviewTypeNameList.toString();
    this.cdRef.detectChanges();
    this.selectedInterviewTypeList.emit(this.interviewTypeIds);
  }

  toggleHiringStatusPerOneList(all) {
    if (this.allCandidateTypesSelected.selected) {
      this.allCandidateTypesSelected.deselect();
      return false;
    }
    if (
      this.selectHiringStatusesForm.controls.hiringStatusId.value.length === this.hiringStatus.length
    ) {
      this.allCandidateTypesSelected.select();
    }
  }

  toggleInterviewTypeOneList(all) {
    if (this.allCandidatesSelectedList.selected) {
      this.allCandidatesSelectedList.deselect();
      return false;
    }
    if (
      this.selectInterviewTypeFormList.value.interviewTypeIds.length === this.interviewType.length
    ) {
      this.allCandidatesSelectedList.select();
    }
  }

  ngOnDestroy() {
    this.ngDestroyed$.next();
  }

  showFilters() {
    this.isFiltersShow = !this.isFiltersShow;
  }

  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    if (window.matchMedia('(max-width: 1440px)').matches) {
      this.isFiltersShow = true;
    }
  }

  filter() {
    if (this.searchText || this.searchTags
       || this.orderByOption || this.selectedHiringType || this.selectedInterviewTypes || this.userNames) {
      return true;
    } else {
      return false;
    }
  }

  AddCandidatePopover(candidatePopover) {
    this.candidateDocumentReferenceId = null;
    this.isDefault = !this.isDefault;
    this.cdRef.detectChanges();
    this.getSources();
    candidatePopover.openPopover();
  }

  sourceChanged(value) {
    if (value !== '0') {
      this.sources.forEach(x => {
        if (x.sourceId === value) {
          this.isSourcePersonRequired = x.isReferenceNumberNeeded;
        }
      });
    }
    if (!this.isSourcePersonRequired || value === '0') {
      this.createCandidateForm.get('SourcePersonId').patchValue('');
      this.isSourcePersonRequired = false;
    }
    this.cdRef.detectChanges();
  }

  numberOnly(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  floatOnly(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      return false;
    }
    return true;
  }

  validateInput() {
    if (this.createCandidateForm.value.expectedSalary !== '0' && this.createCandidateForm.value.expectedSalary != null
     && this.createCandidateForm.value.expectedSalary !== '') {
      if (this.createCandidateForm.value.currentSalary === '0' || this.createCandidateForm.value.currentSalary == null
       || this.createCandidateForm.value.currentSalary === '') {
        this.expectedSalaryError = false;
      } else {
        if (parseFloat(this.createCandidateForm.value.expectedSalary) >= parseFloat(this.createCandidateForm.value.currentSalary)) {
          this.expectedSalaryError = false;
        } else {
          this.expectedSalaryError = true;
        }
      }
    }
    if (this.createCandidateForm.value.expectedSalary === '0' || this.createCandidateForm.value.expectedSalary == null
     || this.createCandidateForm.value.expectedSalary === '') {
      this.expectedSalaryError = false;
    }

  }

  formValidate() {
    this.expectedSalaryError = false;
    this.isSourcePersonRequired = false;
    this.selectedMember = null;
    this.selectedSourcePerson = null;
    this.createCandidateForm = new FormGroup({
      firstName: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      fatherName: new FormControl('',
        Validators.compose([
          Validators.maxLength(50)
        ])
      ),
      lastName: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      email: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
        ])
      ),
      secondaryEmail: new FormControl('',
        Validators.compose([
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
        ])
      ),
      phone: new FormControl('',
        Validators.compose([
          Validators.maxLength(15)
        ])
      ),
      address1: new FormControl('',
        Validators.compose([
          Validators.maxLength(500)
        ])),
      address2: new FormControl('',
        Validators.compose([
          Validators.maxLength(500)
        ])),
      state: new FormControl('',
        Validators.compose([
          Validators.required
        ])),
      zipcode: new FormControl('',
        Validators.compose([
          Validators.maxLength(20)
        ])),
      currentSalary: new FormControl(''),
      expectedSalary: new FormControl(''),
      experience: new FormControl(''),
      skypeId: new FormControl(''),
      assignCandidateTo: new FormControl(''),
      hiringStatusId: new FormControl(''),
      countryId: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      ),
      currentDesignation: new FormControl(''),
      SourceId: new FormControl(''),
      SourcePersonId: new FormControl('')

    });
  }

  addCandidateDetail(formDirective: FormGroupDirective) {
    const obj = {
      address1: this.createCandidateForm.value.address1,
      address2: this.createCandidateForm.value.address2,
      state: this.createCandidateForm.value.state,
      zipcode: this.createCandidateForm.value.zipcode
    };
    this.savingInProgress = true;
    const candidateUpsert = new CandidateUpsertModel();
    candidateUpsert.firstName = this.createCandidateForm.value.firstName;
    candidateUpsert.fatherName = this.createCandidateForm.value.fatherName;
    candidateUpsert.lastName = this.createCandidateForm.value.lastName;
    candidateUpsert.email = this.createCandidateForm.value.email;
    candidateUpsert.secondaryEmail = this.createCandidateForm.value.secondaryEmail;
    candidateUpsert.phone = this.createCandidateForm.value.phone;
    candidateUpsert.addressJson = JSON.stringify(obj);
    candidateUpsert.currentSalary = this.createCandidateForm.value.currentSalary;
    candidateUpsert.expectedSalary = this.createCandidateForm.value.expectedSalary;
    candidateUpsert.experienceInYears = this.createCandidateForm.value.experience;
    candidateUpsert.skypeId = this.createCandidateForm.value.skypeId;
    candidateUpsert.assignedToManagerId = this.createCandidateForm.value.assignCandidateTo;
    candidateUpsert.hiringStatusId = this.createCandidateForm.value.hiringStatusId;
    candidateUpsert.countryId = this.createCandidateForm.value.countryId;
    candidateUpsert.currentDesignation = this.createCandidateForm.value.currentDesignation;
    candidateUpsert.sourceId = this.createCandidateForm.value.SourceId === '0' ? null : this.createCandidateForm.value.SourceId;
    candidateUpsert.sourcePersonId = this.createCandidateForm.value.SourcePersonId;
    candidateUpsert.jobOpeningId = this.job.jobOpeningId;
    candidateUpsert.candidateJobOpeningId = null;
    this.singleUpload = true;
    this.store.dispatch(new CreateCandidateItemTriggered(candidateUpsert));
  }

  emitCandiateAdded() {
    this.candiateAdded.emit(this.job);
  }

  closeCandidatePopover(formDirective: FormGroupDirective) {
    this.isDefault = !this.isDefault;
    formDirective.resetForm();
    setTimeout(() => this.candidateDetailFormDirective.resetForm(), 0);
    this.formValidate();
    this.addSectionsPopover.forEach((p) => p.closePopover());
  }

  getSources() {
    const sourceUpsertModel = new SourceUpsertModel();
    sourceUpsertModel.isArchived = false;
    this.recruitmentService.getSources(sourceUpsertModel).subscribe((response: any) => {
      if (response.success) {
        this.sources = response.data;
      } else {
        this.toastr.error(response.apiResponseMessages[0].message);
      }
    });
  }

  getHiringStatus() {
    const hiring = new HiringStatusUpsertModel();
    hiring.isArchived = false;
    this.recruitmentService.getHiringStatus(hiring).subscribe((response: any) => {
      if (response.success) {
        this.hiringStatus = response.data;
        this.cdRef.detectChanges();
      } else {
        this.toastr.error(response.apiResponseMessages[0].message);
      }
    });
    this.store.dispatch(new LoadHiringStatusItemsTriggered(hiring));
  }

  getInterviewTypes() {
    const interviewTypes = new InterviewRoundsModel();
    interviewTypes.isArchived = false;
    this.recruitmentService.getInterviewRounds(interviewTypes).subscribe((response: any) => {
      if (response.success) {
        this.interviewType = response.data;
        this.cdRef.detectChanges();
      } else {
        this.toastr.error(response.apiResponseMessages[0].message);
        this.cdRef.detectChanges();
      }
    });
  }

  getUsersList() {
    const userModel = new UserModel();
    this.recruitmentService.GetAllUsers().subscribe((response: any) => {
      if (response.success) {
        this.userList = response.data;
      } else {

      }
    });
  }

  getCountries() {
    const countrySearch = new CountrySearch();
    countrySearch.isArchived = false;
    this.recruitmentService.getCountries(countrySearch).subscribe((response: any) => {
      if (response.success) {
        this.countryList = response.data;
      } else {

      }
      this.cdRef.detectChanges();
    });
  }

  getDesignation() {
    const designation = new DesigationSearch();
    designation.isArchived = false;
    this.recruitmentService.getDesignation(designation).subscribe((response: any) => {
      if (response.success) {
        this.designationList = response.data;
      }
      this.cdRef.detectChanges();
    });
  }

  getStates() {
    this.recruitmentService.getStates().subscribe((response: any) => {
      if (response.success) {
        this.statesList = response.data;
      }
      this.cdRef.detectChanges();
    });
  }

  getjobOpeningStatus() {
    const jobOpeningStatusInputModel = new JobOpeningStatusInputModel();
    jobOpeningStatusInputModel.isArchived = false;
    this.recruitmentService.getJobOpeningStatus(jobOpeningStatusInputModel).subscribe((response: any) => {
      if (response.success === true) {
        this.openingstatus = response.data;
        this.openingstatus.forEach(x => {
          if (x.order === 3 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
            this.isJobOpeningClosed = true;
          }
          if (x.order === 1 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
            this.isJobOpeningDraft = true;
          }
          if (x.order === 2 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
            this.isJobOpeningDraft = false;
            this.isJobOpeningClosed = false;
          }
        });
        this.cdRef.detectChanges();
      } else {
        this.cdRef.detectChanges();
      }
    });
  }

  setFunctionForCandidates() {
    const candidatesList = this.temp;
    // tslint:disable-next-line: only-arrow-functions
    const filteredlist = _.filter(candidatesList, function(candidate: any) {
      return candidate.assignedToManagerId == null;
    });
    if (filteredlist.length > 0) {
      this.unAssignedUserList = true;
    } else {
      this.unAssignedUserList = false;
    }
  }

  filesExist(event) {
    this.isFileExist = event;
  }

  upsertDocument() {
    this.isToUploadFiles = false;
    this.isAnyOperationIsInprogress = true;
    const candidateDocument = new CandidateDocumentModel();
    candidateDocument.document = 'Resume'.toString().trim();
    candidateDocument.description = 'Resume';
    candidateDocument.isResume = true;
    candidateDocument.candidateDocumentsId = '';
    candidateDocument.candidateId = this.candidateId;
    candidateDocument.documentTypeId = '';
    candidateDocument.timeStamp = this.candidateTimeStamp;
    this.recruitmentService.upsertCandidateDocuments(candidateDocument).subscribe((response: any) => {
      if (response.success === true) {
        this.isToUploadFiles = true;
        this.candidateDocumentReferenceId = response.data;
        this.isAnyOperationIsInprogress = false;
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  closeFilePopup() {}

}

