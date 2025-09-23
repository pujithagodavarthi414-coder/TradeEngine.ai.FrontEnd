import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef,
   ChangeDetectionStrategy, ViewChild, ElementRef, ViewChildren, OnDestroy } from '@angular/core';
import * as _ from 'underscore';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ofType, Actions } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { SatPopover } from '@ncstate/sat-popover';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { ComponentModel } from '@snovasys/snova-comments';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { HiringStatusUpsertModel } from '../../snovasys-recruitment-management-apps/models/hiringStatusUpsertModel';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { CandidateUpsertModel } from '../models/candidateUpsertModel';
import { CandidateSearchtModel } from '../models/candidate-search.model';
import { State } from '../../snovasys-recruitment-management-apps/store/reducers/index';
import * as hiringStatusModuleReducer from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { HiringStatusActionTypes, LoadHiringStatusItemsTriggered } from '../../snovasys-recruitment-management-apps/store/actions/hiring-status.action';
import { CandidateActionTypes, CreateCandidateItemTriggered } from '../../snovasys-recruitment-management-apps/store/actions/candidate.action';
import { SourceUpsertModel } from '../../snovasys-recruitment-management-apps/models/SourceUpsertModel';
import { DesigationSearch } from '../models/designation-search.model';
import { CountrySearch } from '../models/country-search.model';
import { CandidateDocumentModel } from '../../snovasys-recruitment-management-apps/models/candidate-document.model';
import { DocumentTypeUpsertModel } from '../../snovasys-recruitment-management-apps/models/documentTypeUpsertModel';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gc-candidate-detail',
  templateUrl: 'candidate-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateDetailComponent extends CustomAppBaseComponent implements OnInit, OnDestroy {

  @ViewChildren('upsertDocumentPopUp') upsertDocumentPopUp;
  @ViewChildren('addPopOver') addPopOvers;
  @Input('candidateId')
  set _candidateId(data: any) {
    if (data) {
      this.candidateId = data.candidateId;
      const checkData = this.candidateData;
      this.candidateData = data;
      this.candidate = this.candidateData;
      if (checkData === undefined || checkData == null || checkData.candidateId !== this.candidate.candidateId) {
        if (this.tabstrip) {
          Promise.resolve(null).then(() => this.tabstrip.selectTab(0));
        }
        this.panelOpenState = false;
        this.expansionIcon = false;
        this.expectedSalaryError = false;
        this.emailValidation = false;
        this.emailRequiredvalidation = false;
        this.secondaryEmailValidation = false;
        this.isFirstNameValidation = false;
        this.isSecondNameValidation = false;
        this.phoneNumberValidation = false;
        this.candidateStatusId = this.candidate.hiringStatusId;
        this.firstName = this.candidate.firstName;
        this.lastName = this.candidate.lastName;
        this.fatherName = this.candidate.fatherName;
        this.emailAddress = this.candidate.email;
        this.phoneNumber = this.candidate.phone;
        this.Address = this.candidate.addressJson;
        this.description = this.candidate.description;
        this.secondaryEmail = this.candidate.secondaryEmail;
        this.currentSalary = this.candidate.currentSalary;
        this.expectedSalary = this.candidate.expectedSalary;
        this.experience = this.candidate.experienceInYears;
        this.skypeId = this.candidate.skypeId;
        this.assignee = this.candidate.assignedToManagerId;
        this.countryId = this.candidate.countryId;
        if (this.candidate.currentDesignation && this.candidate.currentDesignation !== '') {
          this.currentDesignation = this.candidate.currentDesignation.toLowerCase();
        } else {
          this.currentDesignation = null;
        }
        this.sourceId = this.candidate.sourceId == null ? '0' : this.candidate.sourceId;
        this.sourcePersonId = this.candidate.sourcePersonId;
        const split = JSON.parse(this.Address);
        this.address1 = split.address1;
        this.address2 = split.address2;
        this.state = split.state;
        this.state = this.state.toLowerCase();
        this.zipcode = split.zipcode;
        if (this.sourcePersonId !== '' && this.sourcePersonId != null && this.sourcePersonId !== undefined) {
          this.isSourcePersonRequired = true;
        }
      }
      this.cdRef.detectChanges();
      this.getCandidateDocuments();
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

  selectedTab;
  @Input('selectedTab')
  set _selectedTab(data: string) {
    this.selectedTab = data;
    this.isCandidateStatus = false;
  }

  @Input('selectedJob')
  set _selectedJob(data: any) {
    this.selectedJob = data;
  }

  @Input('job')
  set _job(data: any) {
    if (data) {
      this.job = data;
    }
  }
  @Input('isInterviewerBoard')
  set _isInterviewerBoard(data: boolean) {
    if (data) {
      this.isInterviewerBoard = data;
    }
  }
  @Input() isCandidatePage: boolean;
  @Output() candidateCloseClicked = new EventEmitter<any>();
  @Output() candidateUpdated = new EventEmitter<any>();
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @ViewChild('candidateAssigneePopover') candidateAssigneePopUp: SatPopover;
  @ViewChildren('addSection') addSectionsPopover;
  @ViewChild('addSection') addSectionPopover: SatPopover;
  @ViewChild('fileUpload') fileUploadExample: ElementRef;
  @ViewChildren('FileUploadPopup') FileUploadPopup;
  @ViewChild('showAssignee') showAssignee;

  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  Address: string;
  hiringStatus: any;
  selectedJob: any;
  hiringStatus$: Observable<HiringStatusUpsertModel[]>;
  secondaryEmail: string;
  currentSalary: any;
  expectedSalary: any;
  experience: any;
  skypeId: string;
  countryId: string;
  currentDesignation: string;
  sourceId: string;
  sourcePersonId: string;
  isSourcePersonRequired: boolean;
  countryList: any;
  designationList: any;
  assignees: any;
  sources: any;
  statesList: any;
  address1: string;
  address2: string;
  state: string;
  zipcode: string;
  designationName: string;
  emailValidation: boolean;
  emailRequiredvalidation: boolean;
  secondaryEmailValidation: boolean;
  isFirstNameValidation: boolean;
  isSecondNameValidation: boolean;
  phoneNumberValidation: boolean;
  expectedSalaryError = false;
  isArchived: any;
  isAlreadyHit = false;
  isInterviewerBoard: any;
  fatherName: any;
  isAnyOperationIsInprogress: boolean;
  candidateDocument: any;
  candidateDocumentReferenceId: any = '';
  validationMessage: any;
  isFileExist: any;
  candidateTimeStamp: any;
  documentTypes: any;
  documentType: any;
  candidateDocumentResume: any;
  isExistsResume: boolean;
  after: any = false;
  pageSize: any;
  pageNumber: any;
  candidateStatus: any[] = [];
  job: any;
  timeStamp: any;
  position: any;
  candidate: any; // CandidateSearchCriteriaInputModel;
  anyOperationInProgress = false;
  versionName: string;
  isReplan: boolean;
  tag: string;
  none = 'none';
  selectedJobOpeningId: string;
  isFileUpload: boolean;
  isCandidateStatusDisabled = false;
  isCandidateStatus: boolean;
  isEditCandidate = true;
  candidateName: string;
  selectedIndex = 'GENERAL';
  isSuperagileBoard: boolean;
  candidateStatusId: string;
  assignee: string;
  description: string;
  isThereAnError: boolean;
  validationmessage: string;
  tab: string;
  candidateId: string;
  selectedStoreId: null;
  moduleTypeId = 15;
  referenceTypeId = ConstantVariables.RecruitmentReferenceTypeId;
  isButtonVisible = true;
  candidateData: any;
  selectedMember: string;
  isEditorVisible = false;
  panelOpenState = false;
  expansionIcon = false;
  defaultProfileImage = 'assets/images/faces/18.png';
  profileImage: string;
  componentModel: ComponentModel = new ComponentModel();
  isValidation: boolean;
  isExtension = false;
  public ngDestroyed$ = new Subject();
  jobId: string;
  savingInProgress: boolean;

  isToUploadFiles = false;
  selectedParentFolderId: null;

  public initSettings1 = {
    plugins: "paste,lists advlist",
    branding: false,
    //powerpaste_allow_local_images: true,
    //powerpaste_word_import: 'prompt',
    //powerpaste_html_import: 'prompt',
    toolbar: 'link image code'
  };

  public schedulingEnds = [{ endType: 'Never', code: 1 },
  { endType: 'ON', code: 2 }
  ];

  public initSettings = {
    selector: '.dfree-header',
    menubar: false,
    inline: true,
    theme: 'inlite',
    insert_toolbar: 'undo redo',
    selection_toolbar: 'bold italic | h2 h3 | blockquote quicklink'
  };

  constructor(
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private actionUpdates$: Actions,
    public dialog: MatDialog,
    private recruitmentService: RecruitmentService,
    private store: Store<State>,
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

    this.actionUpdates$
      .pipe(
        ofType(CandidateActionTypes.CreateCandidateItemCompleted),
        tap((result: any) => {
          this.anyOperationInProgress = false;
          if (!this.isAlreadyHit) {
            this.getCandiates(this.candidate);
            this.isAlreadyHit = true;
          }
          this.candidateUpdated.emit(this.candidate);
          this.cdRef.detectChanges();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(CandidateActionTypes.CreateCandidateItemFailed),
        tap((result: any) => {
          const status = this.store.pipe(select(hiringStatusModuleReducer.candidatesCreatedorUpsertFailed));
          status.subscribe((response) => {
            this.anyOperationInProgress = false;
            if (!this.isAlreadyHit) {
              this.getCandiates(this.candidate);
              this.isAlreadyHit = true;
            }
          });
          this.cdRef.detectChanges();
        })
      )
      .subscribe();

  }

  ngOnInit() {
    super.ngOnInit();
    this.anyOperationInProgress = false;
    this.getHiringStatus();
    this.getUsersList();
    this.getCountries();
    this.getDesignation();
    this.getSources();
    this.getStates();
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }

  closeCandidateDetailWindow() {
    this.candidate = null;
    this.candidateCloseClicked.emit();
  }

  getCandidateStatusChange(event) {
    const value = event;
    this.candidate.hiringStatusId = value;
    this.hiringStatus.forEach(x => {
      if (x.hiringStatusId === value) {
        this.candidate.color = x.color;
        this.candidate.hiringStatusName = x.status;
        this.candidateStatusId = value;
        this.upsertCandidateDetail();
      }
    });
  }

  updateCandidateName() {

  }
  public onTabSelect(tabIndex) {
    if (tabIndex.index === 0) {
      this.isEditorVisible = false;
      this.selectedIndex = 'GENERAL';
    } else {
      this.selectedIndex = tabIndex.title;
    }
  }


  openAssignee() {
    this.showAssignee.open();
  }

  closeFileUploadPopover() {
    this.FileUploadPopup.forEach((p) => p.closePopover());
  }

  enableEditor() {
    if (this.canAccess_feature_EditCandidateDetails) {
      this.isEditorVisible = true;
    }
  }

  togglePanel() {
    this.panelOpenState = !this.panelOpenState;
    this.expansionIcon = !this.expansionIcon;
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

  candidateAddressUpdate() {
    const obj = {
      address1: this.address1,
      address2: this.address2,
      state: this.state,
      zipcode: this.zipcode
    };
    const latestAddress = JSON.stringify(obj);
    if (this.Address !== latestAddress) {
      this.Address = latestAddress;
      this.candidateDetailsUpdate();
    }
  }

  sourceChanged() {
    if (this.sourceId !== '0') {
      this.sources.forEach(x => {
        if (x.sourceId === this.sourceId) {
          this.isSourcePersonRequired = x.isReferenceNumberNeeded;
        }
      });
    }
    if (!this.isSourcePersonRequired || this.sourceId === '0') {
      this.sourcePersonId = null;
      this.isSourcePersonRequired = false;
    }
    if (this.sourceId !== this.candidate.sourceId && !this.sourcePersonId) {
      this.candidateDetailsUpdate();
    }
    this.cdRef.detectChanges();
  }

  validationCheck() {
    const expression = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';
    const regex = new RegExp(expression);
    if (this.secondaryEmail !== this.candidate.secondaryEmail) {
      if (!this.secondaryEmail.match(regex)) {
        this.secondaryEmailValidation = true;
      } else {
        this.secondaryEmailValidation = false;
      }
    }
    if (this.emailAddress !== this.candidate.email) {
      if (this.emailAddress === '' || this.emailAddress == null) {
        this.emailRequiredvalidation = true;
        this.emailValidation = false;
      } else if (!this.emailAddress.match(regex)) {
        this.emailValidation = true;
        this.emailRequiredvalidation = false;
      } else {
        this.emailValidation = false;
        this.emailRequiredvalidation = false;
      }
    }
    if (this.phoneNumber !== this.candidate.phone) {
      if (this.phoneNumber == null || this.phoneNumber === '') {
        this.phoneNumberValidation = true;
      } else {
        this.phoneNumberValidation = false;
      }
    }
    if (this.firstName !== this.candidate.firstName) {
      if (this.firstName == null || this.firstName === '') {
        this.isFirstNameValidation = true;
      } else {
        this.isFirstNameValidation = false;
      }
    }
    if (this.lastName !== this.candidate.lastName) {
      if (this.lastName == null || this.lastName === '') {
        this.isSecondNameValidation = true;
      } else {
        this.isSecondNameValidation = false;
      }
    }
    if (this.expectedSalary !== '0' && this.expectedSalary != null && this.expectedSalary !== '') {
      if (this.currentSalary === '0' || this.currentSalary == null || this.currentSalary === '') {
        this.expectedSalaryError = false;
      } else {
        if (parseFloat(this.expectedSalary) >= parseFloat(this.currentSalary)) {
          this.expectedSalaryError = false;
        } else {
          this.expectedSalaryError = true;
        }
      }
    }
    if (this.expectedSalary === '0' || this.expectedSalary == null || this.expectedSalary === '') {
      this.expectedSalaryError = false;
    }
    this.cdRef.markForCheck();
  }

  candidateDetailsUpdate() {
    let isUpdated = false;
    if (this.firstName !== this.candidate.firstName && this.firstName !== ''
    && !this.isFirstNameValidation && this.firstName.length <= 50) {
      this.candidate.firstName = this.firstName;
      isUpdated = true;
    }
    if (this.lastName !== this.candidate.lastName && this.lastName !== '' && !this.isSecondNameValidation && this.lastName.length <= 50) {
      this.candidate.lastName = this.lastName;
      isUpdated = true;
    }
    if (this.fatherName !== this.candidate.fatherName && this.fatherName !== '' && this.fatherName.length <= 50) {
      this.candidate.fatherName = this.fatherName;
      isUpdated = true;
    }
    if (this.emailAddress !== this.candidate.email && this.emailAddress !== '' && !this.emailRequiredvalidation && !this.emailValidation) {
      this.candidate.email = this.emailAddress;
      isUpdated = true;
    }
    if (this.secondaryEmail !== this.candidate.secondaryEmail && !this.secondaryEmailValidation) {
      this.candidate.secondaryEmail = this.secondaryEmail;
      isUpdated = true;
    }
    if (this.phoneNumber !== this.candidate.phone && !this.phoneNumberValidation && this.phoneNumber.length <= 15) {
      this.candidate.phone = this.phoneNumber;
      isUpdated = true;
    }
    if (this.Address !== this.candidate.addressJson) {
      this.candidate.addressJson = this.Address;
      isUpdated = true;
    }
    if (this.currentSalary !== this.candidate.currentSalary) {
      this.candidate.currentSalary = this.currentSalary;
      isUpdated = true;
    }
    if ((this.expectedSalary !== this.candidate.expectedSalary) && !this.expectedSalaryError) {
      this.candidate.expectedSalary = this.expectedSalary;
      isUpdated = true;
    }
    if (this.skypeId !== this.candidate.skypeId) {
      this.candidate.skypeId = this.skypeId;
      isUpdated = true;
    }
    if (this.assignee !== this.candidate.assignedToManagerId) {
      this.candidate.assignedToManagerId = this.assignee;
      isUpdated = true;
    }
    if (this.countryId !== this.candidate.countryId && this.countryId !== '' && this.countryId != null) {
      this.candidate.countryId = this.countryId;
      isUpdated = true;
    }
    if (this.currentDesignation !== this.candidate.currentDesignation) {
      this.candidate.currentDesignation = this.currentDesignation;
      isUpdated = true;
    }
    if (this.sourceId !== this.candidate.sourceId && this.sourceId !== '0' && !this.sourcePersonId) {
      this.candidate.sourceId = this.sourceId;
      isUpdated = true;
    }
    if ((this.sourceId !== this.candidate.sourceId || this.sourceId === this.candidate.sourceId) && this.sourcePersonId &&
      this.sourcePersonId !== this.candidate.sourcePersonId && this.sourcePersonId !== '' && this.sourcePersonId != null) {
      this.candidate.sourceId = this.sourceId;
      this.candidate.sourcePersonId = this.sourcePersonId;
      isUpdated = true;
    }
    if (this.experience !== this.candidate.experienceInYears) {
      this.candidate.experienceInYears = this.experience;
      isUpdated = true;
    }
    if (isUpdated) {
      this.upsertCandidateDetail();
    }
  }

  saveCandidateDescription() {
    if (this.description !== this.candidate.description) {
      this.candidate.description = this.description;
      this.upsertCandidateDetail();
    }
  }

  resetDescription() {
    this.description = this.candidate.description;
  }

  cancelDescription() {
    this.isEditorVisible = false;
    this.description = this.candidate.description;
  }

  changeAssignee(event) {}

  savepopup() { }

  getHiringStatus() {
    const hiring = new HiringStatusUpsertModel();
    hiring.isArchived = false;
    this.store.dispatch(new LoadHiringStatusItemsTriggered(hiring));
    this.hiringStatus$ = this.store.pipe(select(hiringStatusModuleReducer.getHiringStatusAll));
    this.hiringStatus$.subscribe((result) => {
      this.hiringStatus = result;
    });
  }

  upsertCandidateDetail() {
    this.anyOperationInProgress = true;
    const candidateUpsert = new CandidateUpsertModel();
    candidateUpsert.candidateId = this.candidate.candidateId;
    candidateUpsert.firstName = this.candidate.firstName;
    candidateUpsert.lastName = this.candidate.lastName;
    candidateUpsert.fatherName = this.candidate.fatherName;
    candidateUpsert.email = this.candidate.email;
    candidateUpsert.secondaryEmail = this.candidate.secondaryEmail;
    candidateUpsert.phone = this.candidate.phone;
    candidateUpsert.addressJson = this.candidate.addressJson;
    candidateUpsert.currentSalary = this.candidate.currentSalary;
    candidateUpsert.expectedSalary = this.candidate.expectedSalary;
    candidateUpsert.experienceInYears = this.candidate.experienceInYears;
    candidateUpsert.skypeId = this.candidate.skypeId;
    candidateUpsert.assignedToManagerId = this.candidate.assignCandidateTo;
    candidateUpsert.hiringStatusId = this.candidate.hiringStatusId;
    candidateUpsert.countryId = this.candidate.countryId;
    candidateUpsert.currentDesignation = this.candidate.currentDesignation;
    candidateUpsert.sourceId = this.candidate.sourceId;
    candidateUpsert.sourcePersonId = this.candidate.sourcePersonId === '0' ? null : this.candidate.sourcePersonId;
    candidateUpsert.jobOpeningId = this.candidate.jobOpeningId;
    candidateUpsert.candidateJobOpeningId = this.candidate.candidateJobOpeningId;
    candidateUpsert.assignedToManagerId = this.candidate.assignedToManagerId;
    candidateUpsert.description = this.candidate.description;
    candidateUpsert.timeStamp = this.candidate.timeStamp;
    this.isAlreadyHit = false;
    this.store.dispatch(new CreateCandidateItemTriggered(candidateUpsert));
  }

  getCandiates(selectedJob) {
    this.anyOperationInProgress = true;
    const candidateSearchtModel = new CandidateSearchtModel();
    candidateSearchtModel.jobOpeningId = selectedJob.jobOpeningId;
    candidateSearchtModel.candidateId = selectedJob.candidateId;
    candidateSearchtModel.pageSize = this.pageSize;
    candidateSearchtModel.pageNumber = this.pageNumber;
    this.recruitmentService.getCandisates(candidateSearchtModel).subscribe((response: any) => {
      if (response.success) {
        this.candidate = response.data[0];
        this.isEditorVisible = false;
        this.cdRef.detectChanges();
      } else {
        this.toastr.error(response.apiResponseMessages[0].message);
      }
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  getUsersList() {
    this.anyOperationInProgress = true;
    this.recruitmentService.GetAllUsers().subscribe((response: any) => {
      if (response.success) {
        this.assignees = response.data;
      } else {

      }
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  getCountries() {
    this.anyOperationInProgress = true;
    const countrySearch = new CountrySearch();
    countrySearch.isArchived = false;
    this.recruitmentService.getCountries(countrySearch).subscribe((response: any) => {
      if (response.success) {
        this.countryList = response.data;
      } else {

      }
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  getDesignation() {
    this.anyOperationInProgress = true;
    const designation = new DesigationSearch();
    designation.isArchived = false;
    this.recruitmentService.getDesignation(designation).subscribe((response: any) => {
      if (response.success) {
        this.designationList = response.data;
      }
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  getSources() {
    this.anyOperationInProgress = true;
    const sourceUpsertModel = new SourceUpsertModel();
    sourceUpsertModel.isArchived = false;
    this.recruitmentService.getSources(sourceUpsertModel).subscribe((response: any) => {
      if (response.success) {
        this.sources = response.data;
      } else {
      }
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  getStates() {
    this.anyOperationInProgress = true;
    this.recruitmentService.getStates().subscribe((response: any) => {
      if (response.success) {
        this.statesList = response.data;
      }
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }
  filesExist(event) {
    this.isFileExist = event;
  }

  getDocumentTypes() {
    this.isAnyOperationIsInprogress = true;
    const documentTypeModel = new DocumentTypeUpsertModel();
    documentTypeModel.isArchived = false;
    this.recruitmentService.getDocumentTypes(documentTypeModel).subscribe((response: any) => {
      if (response.success === true) {
        this.documentTypes = response.data;
        this.documentType = this.documentTypes[0].documentTypeId;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      }
    });
  }

  CloseUpsertDocument() {
    this.after = !this.after;
    this.isAnyOperationIsInprogress = false;
  }

  UpsertDocument() {
    this.isToUploadFiles = false;
    this.isAnyOperationIsInprogress = true;
    const candidateDocument = new CandidateDocumentModel();
    candidateDocument.document = this.isExistsResume === false ? 'Resume'.toString().trim() : this.candidateDocumentResume.document;
    candidateDocument.description = this.isExistsResume === false ? 'Resume' : this.candidateDocumentResume.description;
    candidateDocument.isResume = true;
    candidateDocument.candidateDocumentsId = this.isExistsResume === false ? '' : this.candidateDocumentResume.candidateDocumentId;
    candidateDocument.candidateId = this.candidate.candidateId;
    candidateDocument.documentTypeId = this.isExistsResume === false ? '' : this.candidateDocumentResume.documentTypeId;
    candidateDocument.timeStamp = this.isExistsResume === false ? '' : this.candidateDocumentResume.timeStamp;
    this.recruitmentService.upsertCandidateDocuments(candidateDocument).subscribe((response: any) => {
      if (response.success === true) {
        this.isToUploadFiles = true;
        this.candidateDocumentReferenceId = response.data;
        this.getCandidateDocuments();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  getCandidateDocuments() {
    const candidateDocumentModel = new CandidateDocumentModel();
    this.isAnyOperationIsInprogress = true;
    candidateDocumentModel.candidateId = this.candidate.candidateId;
    candidateDocumentModel.isResume = true;
    candidateDocumentModel.isArchived = false;
    this.recruitmentService.getCandidateDocuments(candidateDocumentModel).subscribe((response: any) => {
      if (response.success) {
        this.candidateDocument = response.data;
        this.isAnyOperationIsInprogress = false;
        if (this.candidateDocument.length > 0) {
          this.isExistsResume = true;
          this.candidateDocumentReferenceId = this.candidateDocument[0].candidateDocumentId;
          this.candidateDocumentResume = this.candidateDocument[0];
        } else {
          this.isExistsResume = false;
        }
      } else {
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  closeFilePopup() {
    this.isAnyOperationIsInprogress = false;
  }
}
