import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
   Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CronOptions } from 'cron-editor';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ComponentModel } from '@snovasys/snova-comments';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CandidateSearchtModel } from '../models/candidate-search.model';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { HiringStatusUpsertModel } from '../../snovasys-recruitment-management-apps/models/hiringStatusUpsertModel';
import { JobOpening } from '../../snovasys-recruitment-management-apps/models/jobOpening.model';
import { CountrySearch } from '../models/country-search.model';
import { DesigationSearch } from '../models/designation-search.model';
import { SourceUpsertModel } from '../../snovasys-recruitment-management-apps/models/SourceUpsertModel';
import { CandidateUpsertModel } from '../models/candidateUpsertModel';
import { ToastrService } from 'ngx-toastr';
import { SatPopover } from '@ncstate/sat-popover';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScheduleInterviewComponent } from './schedule-interview.component';
import { JobCandidateLinkComponent } from './jobjoining-link.component';
import { InterviewProcessComponent } from './interview-process-component';
import { SoftLabelConfigurationModel } from '@snovasys/snova-custom-fields';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-candidate-unique-detail',
  templateUrl: 'candidate-unique-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateUniqueDetailComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChild('editCandidateMenuPopover') editCandidateMenuPopover: SatPopover;
  @ViewChild('archivePopover') archivePopover: SatPopover;
  @Output() currentDialog = new EventEmitter<any>();

  descriptionSlug: any;
  isEditorVisible = false;
  dropdowns: any[];
  selectedTab: string = null;
  candidateStatus: any[] = [];
  activeJobs: any;
  jobId: any;
  assignees: any[] = [];
  assigneeName: string;
  dependentName: string;
  isSuperagileBoard = true;
  isPaused: boolean;
  candidateNameDuplicate: string;
  public cronExpression = '0 10 1/1 * ?';
  softLabels: SoftLabelConfigurationModel[];
  onboardProcessDate: any;
  isPermissionsForCandidateComments = true;
  componentModel: ComponentModel = new ComponentModel();
  selectedStoreId: null;
  anyOperationInProgress: boolean;
  anyOperationInProgress$: Observable<boolean>;
  candidateId: any = null;
  candidateDetails: any = null;
  candidateDetailsChanged: any = null;
  hiringStatus: any = null;
  candidateStatusId: string = null;
  job: any;
  firstName: string;
  lastName: string;
  email: string;
  secondaryEmail: string;
  phoneNumber: string;
  address: string;
  address1: string;
  address2: string;
  state: string;
  zipcode: string;
  statesList; any;
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
  sources: any;
  candidateJobOpeningId: any;
  timeStamp: any;
  savingInProgress = false;
  isAnyOperationsInprogress = false;
  isArchiveCandidate: boolean;
  referenceTypeId = 'C2F6B138-E412-4905-9E78-A4AB4D3C804C';
  moduleTypeId = 15;
  emailValidation: boolean;
  emailRequiredvalidation: boolean;
  secondaryEmailValidation: boolean;
  isFirstNameValidation: boolean;
  isSecondNameValidation: boolean;
  phoneNumberValidation: boolean;
  isCandidateArchived = false;
  expectedSalaryError = false;
  fatherName: any;
  isFromBryntum: boolean;
  temp: any;
  @Input('candidateDetails')
  set setcandidatedetails(
    data: any,
  ) {
    if (data !== undefined) {
      if (this.data !== undefined && this.data !== null) {
        this.data = this.data; }
      this.candidateId = this.data.candidate.candidateId;
      this.jobId = this.data.job.jobOpeningId;
      this.isFromBryntum = true;
      this.getCandidates();
      this.cdRef.detectChanges();
    }
  }

  constructor(
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private recruitmentService: RecruitmentService,
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
    this.route.params.subscribe((params: Params) => {
      if (params) {
        this.candidateId = params['id'.toString()];
        this.jobId = params['jobId'.toString()];
        if (this.candidateId !== undefined && this.candidateId !== null) {
          this.getCandidates(); }
      }
    });
  }

  public cronOptions: CronOptions = {
    formInputClass: 'form-control cron-editor-input',
    formSelectClass: 'form-control cron-editor-select',
    formRadioClass: 'cron-editor-radio',
    formCheckboxClass: 'cron-editor-checkbox',
    defaultTime: '10:00:00',
    use24HourTime: true,
    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: true,
    hideSeconds: true,
    removeSeconds: true,
    removeYears: true
  };

  public initSettings = {
    plugins: "paste,lists advlist",
    branding: false,
          //powerpaste_allow_local_images: true,
      //powerpaste_word_import: 'prompt',
      //powerpaste_html_import: 'prompt',
    toolbar: 'link image code'
  };

  ngOnInit() {
    super.ngOnInit();
    this.timeStamp = null;
    this.getJobOpenings();
    this.getHiringStatus();
    this.getUsersList();
    this.getCountries();
    this.getDesignation();
    this.getSources();
    this.getStates();
    this.getSoftLabelConfiguration();

    this.dropdowns = [
      {
        name: 'Comment',
        value: 'Comment'
      }
    ];

    if (this.canAccess_feature_ViewCandidateDocuments) {
      this.dropdowns.push({
        name: 'CANDIDATESTRIPS.DOCUMENT',
        value: 'Documents'
      });
      this.selectedTab = 'Documents';
    }

    if (this.canAccess_feature_ManageCancelInterviewSchedule || this.canAccess_feature_AddInterviewSchedule) {
      this.dropdowns.push({
        name: 'CANDIDATESTRIPS.INTERVIEW',
        value: 'Interview'
      });
      this.selectedTab = 'Interview';
    }

    if (this.canAccess_feature_ViewCandidateHistory) {
      this.dropdowns.push({
        name: 'USERSTORYUNIQUE.HISTORY',
        value: 'History'
      });
      this.selectedTab = 'History';
    }
    if (this.canAccess_feature_ViewCandidateSkills) {
      this.dropdowns.push({
        name: 'CANDIDATESTRIPS.SKILLS',
        value: 'Skills'
      });
    }
    if (this.canAccess_feature_ViewCandidateExperience) {
      this.dropdowns.push({
        name: 'HRMANAGAMENT.EXPERIENCE',
        value: 'Experience'
      });
    }
    if (this.canAccess_feature_ViewCandidateEducationDetails) {
      this.dropdowns.push({
        name: 'CANDIDATESTRIPS.EDUCATION',
        value: 'Education'
      });
    }
    if (this.canAccess_feature_ViewCandidateJobs) {
      this.dropdowns.push({
        name: 'CANDIDATESTRIPS.JOB',
        value: 'Job'
      });
    }

    if (this.selectedTab == null) {
      this.selectedTab = this.dropdowns[0].value;
    }

    this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
    this.componentModel.backendApi = environment.apiURL;
    this.componentModel.parentComponent = this;
    this.componentModel.callBackFunction =
     ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });

  }

  checkToggleButton() {
    return false;
  }

  enableEditor() {
    if (this.canAccess_feature_EditCandidateDetails) {
      this.isEditorVisible = true;
    }
  }
  selectchange(value) {
    this.selectedTab = value;
  }
  closeTagsDialog(event) {}

  navigateToJobDetailsPage() {
    this.router.navigate([
      'recruitment/jobopening/' + this.candidateDetails.jobOpeningId
    ]);
  }

  redirectToRecruitment() {
    this.router.navigate(['recruitment/recruitmentmanagement']);
    this.closeDialog();
  }

  redirectPage() {}

  showMatFormField() {}

  openInterviewProcess() {
    const dialogRef = this.dialog.open(InterviewProcessComponent, {
      disableClose: true,
      width: '600px', height: '450px',
      data: { data: this.job, data1: this.candidateDetails }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openScheduleInterview() {
    const dialogRef = this.dialog.open(ScheduleInterviewComponent, {
      disableClose: true,
      width: '950px', height: '570px',
      data: { data: this.job, candidate: this.candidateDetails }

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openJoBCandidate() {
    const dialogRef = this.dialog.open(JobCandidateLinkComponent, {
      disableClose: true,
      width: '800px', height: '600px',
      data: { data: this.candidateDetails, candidate: this.candidateDetails }

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  handleDescriptionEvent() {
    let isChanged = false;
    if (this.descriptionSlug !== this.candidateDetails.description) {
      this.candidateDetailsChanged.description = this.descriptionSlug;
      isChanged = true;
      this.upsertCandidateDetail();
    }
  }

  checkPermissionsForMatMenu() {
    if (this.canAccess_feature_ArchiveCandidate
       || this.canAccess_feature_LinkJobOpeningToCandidate || this.canAccess_feature_LinkInterviewProcess
      || this.canAccess_feature_ManageCancelInterviewSchedule || this.canAccess_feature_AddInterviewSchedule) {
      return true;
    } else {
      return false;
    }
  }

  cancelDescription() {
    this.isEditorVisible = false;
    this.descriptionSlug = this.candidateDetails.description;
  }

  descriptionReset() {
    this.descriptionSlug = this.candidateDetails.description;
  }

  validationCheck() {
    const expression = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';
    const regex = new RegExp(expression);
    if (this.secondaryEmail !== this.candidateDetails.secondaryEmail) {
      if (!this.secondaryEmail.match(regex)) {
        this.secondaryEmailValidation = true;
      } else {
        this.secondaryEmailValidation = false;
      }
    }
    if (this.email !== this.candidateDetails.email) {
      if (this.email === '' || this.email == null) {
        this.emailRequiredvalidation = true;
        this.emailValidation = false;
      } else if (!this.email.match(regex)) {
        this.emailValidation = true;
        this.emailRequiredvalidation = false;
      } else {
        this.emailValidation = false;
        this.emailRequiredvalidation = false;
      }
    }
    if (this.phoneNumber !== this.candidateDetails.phoneNumber) {
      if (this.phoneNumber == null || this.phoneNumber === '') {
        this.phoneNumberValidation = true;
      } else {
        this.phoneNumberValidation = false;
      }
    }
    if (this.firstName !== this.candidateDetails.firstName) {
      if (this.firstName == null || this.firstName === '') {
        this.isFirstNameValidation = true;
      } else {
        this.isFirstNameValidation = false;
      }
    }
    if (this.lastName !== this.candidateDetails.lastName) {
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
        const min = parseFloat(this.currentSalary);
        const max = parseFloat(this.expectedSalary);
        if (max >= min) {
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

  candidateAddressUpdate() {
    const obj = {
      address1: this.address1,
      address2: this.address2,
      state: this.state,
      zipcode: this.zipcode
    };
    const latestAddress = JSON.stringify(obj);
    if (this.address !== latestAddress) {
      this.address = latestAddress;
      this.editedValueChange();
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
    if (this.sourceId !== this.candidateDetails.sourceId && !this.isSourcePersonRequired) {
      this.editedValueChange();
    }
    this.cdRef.detectChanges();
  }

  editedValueChange() {
    let isChanged = false;
    if (this.candidateStatusId !== this.candidateDetails.hiringStatusId) {
      isChanged = true;
      this.candidateDetailsChanged.hiringStatusId = this.candidateStatusId;
    }
    if (this.assigneeName !== this.candidateDetails.assignedToManagerId) {
      isChanged = true;
      this.candidateDetailsChanged.assignedToManagerId = this.assigneeName;
    }
    if (this.descriptionSlug !== this.candidateDetails.description) {
      isChanged = true;
      this.candidateDetailsChanged.description = this.descriptionSlug;
    }
    if (this.firstName !== this.candidateDetails.firstName && !this.isFirstNameValidation && this.firstName.length <= 50) {
      this.candidateDetailsChanged.firstName = this.firstName;
      isChanged = true;
    }
    if (this.lastName !== this.candidateDetails.lastName && !this.isSecondNameValidation && this.lastName.length <= 50) {
      this.candidateDetailsChanged.lastName = this.lastName;
      isChanged = true;
    }
    if (this.fatherName !== this.candidateDetails.fatherName && this.fatherName !== '' && this.fatherName.length <= 50) {
      this.candidateDetails.fatherName = this.fatherName;
      isChanged = true;
    }
    if (this.email !== this.candidateDetails.email && !this.emailRequiredvalidation && !this.emailValidation) {
      this.candidateDetailsChanged.email = this.email;
      isChanged = true;
    }
    if (this.secondaryEmail !== this.candidateDetails.secondaryEmail && !this.secondaryEmailValidation) {
      this.candidateDetailsChanged.secondaryEmail = this.secondaryEmail;
      isChanged = true;
    }
    if (this.phoneNumber !== this.candidateDetails.phone && !this.phoneNumberValidation && this.phoneNumber.length <= 15) {
      this.candidateDetailsChanged.phone = this.phoneNumber; isChanged = true;
    }
    if (this.address !== this.candidateDetails.addressJson && this.zipcode.length <= 20) {
      this.candidateDetailsChanged.addressJson = this.address;
      isChanged = true;
    }
    if (this.currentSalary !== this.candidateDetails.currentSalary) {
      this.candidateDetailsChanged.currentSalary = this.currentSalary;
      isChanged = true;
    }
    if ((this.expectedSalary !== this.candidateDetails.expectedSalary) && !this.expectedSalaryError) {
      this.candidateDetailsChanged.expectedSalary = this.expectedSalary;
      isChanged = true;
    }
    if (this.experience !== this.candidateDetails.experienceInYears) {
      this.candidateDetailsChanged.experienceInYears = this.experience;
      isChanged = true;
    }
    if (this.skypeId !== this.candidateDetails.skypeId) {
      this.candidateDetailsChanged.skypeId = this.skypeId;
      isChanged = true;
    }
    if (this.countryId !== this.candidateDetails.countryId) {
      this.candidateDetailsChanged.countryId = this.countryId;
      isChanged = true;
    }
    if (this.currentDesignation !== this.candidateDetails.currentDesignation) {
      this.candidateDetailsChanged.currentDesignation = this.currentDesignation;
      isChanged = true;
    }
    if (this.sourceId !== this.candidateDetails.sourceId && this.sourceId !== '0' && !this.isSourcePersonRequired) {
      this.candidateDetailsChanged.sourceId = this.sourceId;
      isChanged = true;
    }
    if (this.sourcePersonId !== this.candidateDetails.sourcePersonId && this.sourcePersonId && this.sourceId) {
      this.candidateDetailsChanged.sourcePersonId = this.sourcePersonId;
      isChanged = true;
    }
    if (isChanged) {
      this.upsertCandidateDetail();
    }
  }

  archiveCandidate() {
    this.patchValues();
    this.isArchiveCandidate = true;
    this.upsertCandidateDetail();
  }

  closeDialog() {
    this.isArchiveCandidate = false;
    const popover = this.archivePopover;
    if (popover) {
      popover.close();
    }
    this.closePopover();
  }

  closePopover() {
    const popover = this.editCandidateMenuPopover;
    if (popover) { popover.close(); }
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

  patchValues() {
    this.candidateJobOpeningId = this.candidateDetails.candidateJobOpeningId;
    this.candidateStatusId = this.candidateDetails.hiringStatusId;
    this.jobId = this.candidateDetails.jobOpeningId;
    this.assigneeName = this.candidateDetails.assignedToManagerId;
    this.descriptionSlug = this.candidateDetails.description;
    this.firstName = this.candidateDetails.firstName;
    this.lastName = this.candidateDetails.lastName;
    this.fatherName = this.candidateDetails.fatherName;
    this.email = this.candidateDetails.email;
    this.secondaryEmail = this.candidateDetails.secondaryEmail;
    this.phoneNumber = this.candidateDetails.phone;
    this.address = this.candidateDetails.addressJson;
    const split = JSON.parse(this.address);
    this.address1 = split.address1;
    this.address2 = split.address2;
    this.state = split.state;
    this.state = this.state.toLowerCase();
    this.zipcode = split.zipcode;
    this.currentSalary = this.candidateDetails.currentSalary;
    this.expectedSalary = this.candidateDetails.expectedSalary;
    this.experience = this.candidateDetails.experienceInYears;
    this.skypeId = this.candidateDetails.skypeId;
    this.countryId = this.candidateDetails.countryId;
    this.currentDesignation = this.candidateDetails.currentDesignation;
    this.sourceId = this.candidateDetails.sourceId == null ? '0' : this.candidateDetails.sourceId;
    this.sourcePersonId = this.candidateDetails.sourcePersonId;
    if (this.sourcePersonId !== '' && this.sourcePersonId != null && this.sourcePersonId !== undefined) {
      this.isSourcePersonRequired = true;
    }
    this.timeStamp = this.candidateDetails.timeStamp;
  }

  getSoftLabelConfiguration() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  getCandidates() {
    this.isAnyOperationsInprogress = true;
    const candidateSearchtModel = new CandidateSearchtModel();
    candidateSearchtModel.candidateId = this.candidateId;
    candidateSearchtModel.jobOpeningId = this.jobId;
    this.recruitmentService.getCandisates(candidateSearchtModel).subscribe((response: any) => {
      if (this.isFromBryntum) {
        this.getJobOpenings();
        this.isFromBryntum = false;
      }
      if (response.success) {
        if (response.data.length > 0) {
          this.candidateDetails = response.data[0];
          if (this.candidateDetailsChanged == null) {
            this.patchValues();
          } else {
            this.timeStamp = this.candidateDetails.timeStamp;
          }
          this.candidateDetailsChanged = this.candidateDetails;
          this.isCandidateArchived = false;
        } else {
          this.isCandidateArchived = true;
        }
      } else {
        // this.toastr.error(response.apiResponseMessages[0].message);
      }
      this.isAnyOperationsInprogress = false;
      this.cdRef.detectChanges();
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
        // this.toastr.error(response.apiResponseMessages[0].message);
      }
    });
  }

  getJobOpenings() {
    const jobOpening = new JobOpening();
    this.recruitmentService.getJobOpenings(jobOpening).subscribe((response: any) => {
      if (response.success) {
        this.activeJobs = response.data;
        if (this.candidateDetails) {
          this.activeJobs.forEach(x => {
            if (x.jobOpeningId === this.candidateDetails.jobOpeningId || x.jobOpeningId === this.jobId) {
              this.job = x;
            }
          });
        }
      } else {
      }
      this.cdRef.detectChanges();
    });
  }

  getUsersList() {
    this.recruitmentService.GetAllUsers().subscribe((response: any) => {
      if (response.success) {
        this.assignees = response.data;
      } else {

      }
      this.cdRef.detectChanges();
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

  getSources() {
    const sourceUpsertModel = new SourceUpsertModel();
    this.recruitmentService.getSources(sourceUpsertModel).subscribe((response: any) => {
      if (response.success) {
        this.sources = response.data;
      } else {
      }
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

  upsertCandidateDetail() {
    this.savingInProgress = true;
    const candidateUpsert = new CandidateUpsertModel();
    candidateUpsert.candidateId = this.candidateId;
    candidateUpsert.firstName = this.candidateDetailsChanged.firstName;
    candidateUpsert.lastName = this.candidateDetailsChanged.lastName;
    candidateUpsert.fatherName = this.candidateDetailsChanged.fatherName;
    candidateUpsert.email = this.candidateDetailsChanged.email;
    candidateUpsert.secondaryEmail = this.candidateDetailsChanged.secondaryEmail;
    candidateUpsert.phone = this.candidateDetailsChanged.phone;
    candidateUpsert.addressJson = this.candidateDetailsChanged.addressJson;
    candidateUpsert.currentSalary = this.candidateDetailsChanged.currentSalary;
    candidateUpsert.expectedSalary = this.candidateDetailsChanged.expectedSalary;
    candidateUpsert.experienceInYears = this.candidateDetailsChanged.experienceInYears;
    candidateUpsert.skypeId = this.candidateDetailsChanged.skypeId;
    candidateUpsert.assignedToManagerId = this.candidateDetailsChanged.assignedToManagerId;
    candidateUpsert.hiringStatusId = this.candidateDetailsChanged.hiringStatusId;
    candidateUpsert.countryId = this.candidateDetailsChanged.countryId;
    candidateUpsert.currentDesignation = this.candidateDetailsChanged.currentDesignation;
    candidateUpsert.sourceId = this.candidateDetailsChanged.sourceId === '0' ? null : this.candidateDetailsChanged.sourceId;
    candidateUpsert.sourcePersonId = this.candidateDetailsChanged.sourcePersonId;
    candidateUpsert.jobOpeningId = this.jobId;
    candidateUpsert.candidateJobOpeningId = this.candidateJobOpeningId;
    candidateUpsert.description = this.candidateDetailsChanged.description;
    candidateUpsert.timeStamp = this.timeStamp;
    if (this.isArchiveCandidate) {
      candidateUpsert.isArchived = true;
    }
    this.recruitmentService.upsertCandidate(candidateUpsert).subscribe((response: any) => {
      if (response.success) {
        this.savingInProgress = false;
        if (this.isArchiveCandidate) {
          this.isArchiveCandidate = false;
          this.router.navigate(['recruitment/recruitmentmanagement']);
          this.currentDialog.emit(true);
        } else {
          this.getCandidates();
        }
      } else {
        this.isArchiveCandidate = false;
        this.savingInProgress = false;
        this.toastr.error(response.apiResponseMessages[0].message);
        this.getCandidates();
      }
      this.cdRef.detectChanges();
    });
  }
}
