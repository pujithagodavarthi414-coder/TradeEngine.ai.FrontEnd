import {
  Component, Input, Output, EventEmitter, OnInit, ViewChild,
  ChangeDetectionStrategy, ViewChildren, QueryList, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { SatPopover } from '@ncstate/sat-popover';
import * as _ from 'underscore';
import { Actions, ofType } from '@ngrx/effects';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatOption } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { CandidateSearchCriteriaInputModel } from '../models/candidate-input.model';
import { InterviewProcessComponent } from './interview-process-component';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ScheduleInterviewComponent } from './schedule-interview.component';
import { HiringStatusUpsertModel } from '../../snovasys-recruitment-management-apps/models/hiringStatusUpsertModel';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { CandidateUpsertModel } from '../models/candidateUpsertModel';
import { State } from '../../snovasys-recruitment-management-apps/store/reducers/index';
import * as hiringStatusModuleReducer from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { HiringStatusActionTypes, LoadHiringStatusItemsTriggered } from '../../snovasys-recruitment-management-apps/store/actions/hiring-status.action';
import { tap } from 'rxjs/operators';
import { JobCandidateLinkComponent } from './jobjoining-link.component';
import { EmployeeListModel } from '../../snovasys-recruitment-management-apps/models/employee-model';
import { CandidateSearchtModel } from '../models/candidate-search.model';
import { LoadCandidateItemsTriggered, RefreshCandidatesList } from '../../snovasys-recruitment-management-apps/store/actions/candidate.action';
import { CandidateDocumentModel } from '../../snovasys-recruitment-management-apps/models/candidate-document.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import Resumable from 'resumablejs';
import { StoreConfigurationModel } from '../models/storeConfigurationModel';
import { FileResultModel } from '../models/fileResultModel';
import { SearchFileModel } from '../models/searchFileModel';
import { UpsertFileModel } from '../models/upsertFileModel';
import { FileModel } from '../models/fileModel';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { DeleteFileInputModel } from '../models/deleteFileInputModel';
import { FetchSizedAndCachedImagePipe } from '../../snovasys-recruitment-management-apps/pipes/fetchSizedAndCachedImage.pipe';
import { NgxGalleryComponent, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery-9';
import { ResumePreviewComponent } from './resume-preview.component';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
@Component({
  selector: 'gc-candidate-summary',
  templateUrl: 'candidate-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class CandidateSummaryComponent extends CustomAppBaseComponent implements OnInit, OnDestroy {
  @ViewChild('allOptionalSkillsSelected') private allOptionalSkillsSelected: MatOption;
  @ViewChildren('addHiredPopover') addHiredPopover;
  @ViewChildren('addSubmissionPopover') addSubmissionPopover;
  @ViewChildren('addEmployeePopover') addEmployeePopover;
  @Output() closePopup = new EventEmitter<string>();
  @ViewChild('onlyPreviewGallery') onlyPreviewGallery: NgxGalleryComponent;
  @ViewChild('allRolesSelected') private allRolesSelected: MatOption;
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allLocationSelected') private allLocationSelected: MatOption;
  @Output() updateAutoLog = new EventEmitter<any>();
  @Output() candidateUpdated = new EventEmitter<any>();
  @Output() interviewTypeAdd = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  @Output() selectCandidate = new EventEmitter<object>();
  @Output() selectedToggleEvent = new EventEmitter<string>();
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @ViewChildren('inLineEditCandidatePopup') inLineEditPopUps;
  @ViewChildren('archivePopOver') archivePopUps;
  @ViewChild('archiveCandidatePopover') archiveCandidatePopup: SatPopover;
  img: string = null;
  candidateStatusId: string;
  hiredForm: FormGroup;
  submissionForm: FormGroup;
  roleid: any;
  minDate = new Date();
  isAnyOperationIsInprogress: boolean;
  temp: any;
  documentIds: any;
  selectDocuments: FormGroup;
  selectedDocuments: any;
  candidateId: string;
  document: string;
  candidateDocumentId: any;
  sendNotificationEmail: any;
  selectRoles: any;
  roleIds: any;
  roleList: any;
  selectedRoles: any;
  isThereAnError: boolean;
  loadSpinner: boolean;
  interviewTypeForm: FormGroup;
  selectLocations: any;
  locationList: any;
  locationIds: any;
  selectedLocations: any;
  selectRolesListData: any;
  employeeId: any;
  isSave = false;
  selectedDownload: any;
  isFileExist: any;
  storeConfigurations: StoreConfigurationModel;
  fileExtensions: string;
  maxStoreSize: number;
  maxFileSize: number;
  files: File[] = [];
  filesize: any;
  filesPresent: boolean;
  progressValue: number;
  fileIndex: number;
  uploadedFileNames: any[] = [];
  fileCounter: number;
  fileResultModel: FileResultModel[];
  anyOperationInProgress: boolean;
  customFileName: any;
  isFromFeedback: boolean;
  fileTypeReferenceId: any;
  isButtonVisible: any;
  folderReferenceId: any;
  referenceFileId: any;
  isTobeReviewed: boolean;
  getFilesInProgress: boolean;
  uploadedFiles: any;
  uploadedFilesLength: any;
  bothFiles: boolean;
  fileNames: string[];
  galleryImages: NgxGalleryImage[];
  galleryOptions: NgxGalleryOptions[];
  selectedCandidateJob: number;
  openingstatus: any;
  isJobOpeningClosed: boolean;
  isJobOpeningDraft: boolean;
  contextMenuPosition = { x: '0px', y: '0px' };
  job: any;
  anyOperationInProgress$: Observable<any>;
  showIcons = true;
  tab: string;
  isSuperagileBoard: boolean;
  selectedCandidates: string[] = [];
  titleText: string;
  estimatedTime: string;
  totalEstimatedTime: string;
  isArchived = false;
  isDeadlinedispaly: boolean;
  isParked: boolean;
  workItemInProgress = false;
  isInlineEdit: boolean;
  isSubTask: boolean;
  isSubTasksShow: boolean;
  treeStructure = true;
  notFromAudits = true;
  isTagsPopUp: boolean;
  uniqueNumberUrl: string;
  profileImage: string;
  isEnableToggle: boolean;
  defaultProfileImage = 'assets/images/faces/18.png';
  public ngDestroyed$ = new Subject();
  show: boolean;
  candidateStatus: any[] = [];
  candidateDocument: any[] = [];
  offeredDate = new FormControl('', Validators.compose([Validators.required]));
  package = new FormControl('', Validators.compose([]));
  hiringStatus: any;
  hiringStatus$: Observable<HiringStatusUpsertModel[]>;
  archiveProgress: boolean;
  moduleTypeId = 15;
  referenceTypeId = ConstantVariables.RecruitmentReferenceTypeId;
  isToUploadFiles = false;
  selectedStoreId: null;
  selectedParentFolderId: null;
  candidateDocumentReferenceId = '';

  @Input('isSkillBoard') isSkillBoard: boolean;
  @Input('candidateSelected') candidateSelected: boolean;
  @Input() page: boolean;
  candidate;
  isCandidateSelected: boolean;
  hiringStatusId: any;
  color: any;
  hiringStatusName: any;
  @Input('candidate')
  set _candidate(data: CandidateSearchCriteriaInputModel) {
    this.candidate = data;
  }
  @Input('hiringStatus')
  set _hiringStatus(data: HiringStatusUpsertModel) {
    this.hiringStatus = data;
  }
  @Input('selectedCandidateJob')
  set _selectedCandidateJob(data: any) {
    this.selectedCandidateJob = data;
  }

  isShow;
  @Input('isShow')
  set _isShow(data: boolean) {
    this.isShow = data;
  }

  @Input('job')
  set _job(data: any) {
    if (data) {
      this.job = data;
    }
    if (this.openingstatus != null) {
      this.openingstatus.forEach(x => {
        if (x.order === 3 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
          this.isJobOpeningClosed = true;
        }
        if (x.order === 1 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
          this.isJobOpeningDraft = true;
        }
      });
    }
  }
  @Input('openingstatus')
  set _setOpeningstatus(openingstatus: any) {
    if (openingstatus != null && openingstatus !== undefined) {
      this.openingstatus = openingstatus;
      this.isJobOpeningClosed = false;
      if (this.job != null) {
        this.openingstatus.forEach(x => {
          if (x.order === 3 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
            this.isJobOpeningClosed = true;
          }
          if (x.order === 1 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
            this.isJobOpeningDraft = true;
          }
        });
      }
      this.cdRef.detectChanges();
    }
  }

  @Input('roleList')
  set _roleList(data: any) {
    if (data) {
      this.roleList = data;
    }
    this.selectRolesListData = this.roleList;
  }

  @Input('branchList')
  set _branchList(data: any) {
    if (data) {
      this.locationList = data;
    }
  }

  constructor(
    private toastr: ToastrService,
    private cookieService: CookieService,
    private translateService: TranslateService,
    private snackbar: MatSnackBar,
    private actionUpdates$: Actions,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private router: Router,
    public dialog: MatDialog,
    private imagePipe: FetchSizedAndCachedImagePipe,
    public dialogRef: MatDialogRef<CandidateSummaryComponent>,
    private recruitmentService: RecruitmentService,
    private store: Store<State>,
  ) {
    super();
    this.selectedDownload = true;
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
    this.formValidate();
  }

  ngOnInit() {
    super.ngOnInit();
    this.formValidate();
    this.galleryOptions = [
      {
        image: false, thumbnails: false, width: '0px', height: '0px', previewFullscreen: true, previewSwipe: true,
        previewZoom: true, previewRotate: true, previewCloseOnEsc: true, previewKeyboardNavigation: true
      }
    ];
    this.submissionFormValidate();
  }

  getSelectedCandidate(candidate, event) {
    this.selectedCandidates = [];
    this.selectCandidate.emit({ candidate, isEmit: true });
  }

  closeArchiveCandidaatePopup() {
    this.archiveProgress = false;
    const popover = this.archiveCandidatePopup;
    if (popover) { popover.close(); }
    this.cdRef.detectChanges();
  }

  navigateToCandidatesPage() {
    this.router.navigate([
      'recruitment/candidate/' + this.candidate.candidateId + '/' + this.candidate.jobOpeningId
    ]);
  }

  saveCandidateStatus(inLineEditCandidatePopup, candidate) {
    if (this.canAccess_feature_EditCandidateDetails) {
      this.candidateStatusId = candidate.hiringStatusId;
      inLineEditCandidatePopup.openPopover();
    }
  }

  closeCandidateDialogWindow() {
    this.isInlineEdit = false;
    this.inLineEditPopUps.forEach((p) => p.closePopover());
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }


  openContextMenu(event: MouseEvent, candidate) {
    if (this.selectedCandidates.length === 0) {
      event.preventDefault();
      const contextMenu = this.triggers.toArray()[0];
      if (contextMenu) {
        this.contextMenuPosition.x = (event.clientX - 180) + 'px';
        this.contextMenuPosition.y = (event.clientY - 90) + 'px';
        this.cdRef.detectChanges();
        contextMenu.openMenu();
        this.selectCandidate.emit({ candidate, isEmit: false });
      }
    }
  }

  copyLink() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, '');
    this.uniqueNumberUrl = this.uniqueNumberUrl
      + '/recruitment/candidate/' + this.candidate.candidateId + '/' + this.candidate.jobOpeningId;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.uniqueNumberUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackbar.open(this.translateService.instant('USERSTORY.LINKCOPIEDSUCCESSFULLY'), 'Ok', { duration: 3000 });
  }

  openInNewTab() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, '');
    this.uniqueNumberUrl = this.uniqueNumberUrl
      + '/recruitment/candidate/' + this.candidate.candidateId + '/' + this.candidate.jobOpeningId;
    window.open(this.uniqueNumberUrl, '_blank');
  }

  applyClassForUniqueName(candidateTypeColor) {
    if (candidateTypeColor) {
      return 'asset-badge';
    } else {
      return 'userstory-unique';
    }
  }

  closeCandidateDialog() {
    this.closeCandidateDialogWindow();
  }

  openAssignee() { }

  openInterviewProcess() {
    const dialogRef = this.dialog.open(InterviewProcessComponent, {
      disableClose: true,
      width: '600px', height: '475px',
      data: { data: this.job, data1: this.candidate },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.interviewTypeAdd === true) {
        this.interviewTypeAdd.emit(true);
      }
    });
  }

  AddHiredDocumentPopover(hiredPopover) {
    this.getCandidateDocuments();
    hiredPopover.openPopover();
  }

  closeHiredPopover() {
    this.clearForm();
    this.addHiredPopover.forEach((p) => p.closePopover());
  }

  addHiredDetails() {
    this.isAnyOperationIsInprogress = true;
    const candidateDocumentModel = new CandidateDocumentModel();
    candidateDocumentModel.candidateId = this.candidate.candidateId;
    candidateDocumentModel.candidateDocumentsId = this.hiredForm.value.candidateDocumentId;
    candidateDocumentModel.candidateEmail = this.candidate.email;
    candidateDocumentModel.candidateName = this.candidate.firstName + ' ' + this.candidate.lastName;
    const documentsList = this.candidateDocument;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.filter(documentsList, function (member: any) {
      return candidateDocumentModel.candidateDocumentsId.toString().includes(member.candidateDocumentId);
    });
    const selectedDocuments = filteredList.map((x: any) => x.document);
    this.selectedDocuments = selectedDocuments.toString();
    candidateDocumentModel.documentName = selectedDocuments.toString();
    candidateDocumentModel.documentArray = candidateDocumentModel.documentName.split(',');
    this.recruitmentService.sendHiredDocumentsMail(candidateDocumentModel).subscribe((response: any) => {
      if (response.success) {
        this.toastr.success('' + this.translateService.instant('BILLINGMANAGEMENT.MAILSENT'));
        this.isAnyOperationIsInprogress = false;
        this.addHiredPopover.forEach((p) => p.closePopover());
        this.clearForm();
      } else {
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  onClick(event) {
    if (this.isCandidateSelected === false) {
      this.isCandidateSelected = true;
    }
  }

  clearForm() {
    this.candidateDocumentId = null;
    this.candidateDocument = null;
    this.sendNotificationEmail = null;
    this.hiredForm = new FormGroup({
      candidateDocumentId: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      )
    });
    this.selectDocuments = new FormGroup({
      candidateDocumentId: new FormControl('')
    });
    this.submissionForm = new FormGroup({
      offeredDate: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      ),
      package: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      )
    });
  }

  formValidate() {
    this.hiredForm = new FormGroup({
      candidateDocumentId: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      )
    });
    this.selectDocuments = new FormGroup({
      candidateDocumentId: new FormControl('')
    });
    this.interviewTypeForm = new FormGroup({
      roleId: new FormControl(null,
        Validators.compose([
        ])
      ),
      locations: new FormControl(null,
        Validators.compose([
        ])
      )
    });
    this.submissionForm = new FormGroup({
      offeredDate: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      package: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      )
    });
  }

  submissionFormValidate() {
    this.submissionForm = new FormGroup({
      offeredDate: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      package: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      )
    });
  }

  compareSelectedDocumentFn(documentsList: any, selectedModules: any) {
    if (documentsList === selectedModules) {
      return true;
    } else {
      return false;
    }
  }

  GetDocumentslist() {
    const selectedDocuments = this.selectDocuments.value.candidateDocumentId;
    const index = selectedDocuments.indexOf(0);
    if (index > -1) {
      selectedDocuments.splice(index, 1);
    }
    this.documentIds = selectedDocuments.toString();
    this.bindDocumentIds(this.documentIds);
  }

  bindDocumentIds(documentIds) {
    if (documentIds) {
      const documentsList = this.candidateDocument;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(documentsList, function (member: any) {
        return documentIds.toString().includes(member.documentId);
      });
      const selectedDocuments = filteredList.map((x: any) => x.documentTypeName);
      this.selectedDocuments = selectedDocuments.toString();
    } else {
      this.selectedDocuments = '';
    }
  }

  toggleDocumentPerOne() {
    if (this.allOptionalSkillsSelected.selected) {
      this.allOptionalSkillsSelected.deselect();
      return false;
    }
    if (
      this.hiredForm.get('candidateDocumentId').value.length === this.candidateDocument.length
    ) {
      this.allOptionalSkillsSelected.select();
    }
  }

  toggleAllDocumentSelected() {
    if (this.allOptionalSkillsSelected.selected && this.candidateDocument) {
      this.hiredForm.get('candidateDocumentId').patchValue([
        ...this.candidateDocument.map((item) => item.candidateDocumentId),
        0
      ]);
      this.selectedDocuments = this.candidateDocument.map((item) => item.candidateDocumentId);
    } else {
      this.hiredForm.get('candidateDocumentId').patchValue([]);
    }
  }

  getResumePreview() {
    const dialogId = 'resume-preview';
    const dialogRef = this.dialog.open(ResumePreviewComponent, {
      disableClose: true,
      id: dialogId,
      width: '1800px', minHeight: '300px',
      data: { candidateId: this.candidate.candidateId, dialogId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        console.log('The dialog was closed');
      }
    });
  }

  getCandidateDocuments() {
    const candidateDocumentModel = new CandidateDocumentModel();
    this.isAnyOperationIsInprogress = true;
    candidateDocumentModel.candidateId = this.candidate.candidateId;
    candidateDocumentModel.isArchived = this.isArchived;
    this.recruitmentService.getCandidateDocuments(candidateDocumentModel).subscribe((response: any) => {
      if (response.success) {
        this.candidateDocument = response.data;
        this.temp = response.data;
        this.isAnyOperationIsInprogress = false;
      } else {
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  AddSubmissionPopover(hiredPopover) {
    hiredPopover.openPopover();
    this.candidateId = this.candidate.candidateId;
    this.getStoreConfigurations();
    this.getUploadedFilesDetails(this.candidateId);
  }

  closeSubmissionPopover(formGroup) {
    this.submissionForm = new FormGroup({
      offeredDate: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      package: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      )
    });
    formGroup.resetForm();
    this.addSubmissionPopover.forEach((p) => p.closePopover());
    this.selectedDownload = true;
  }

  addSubmissionDetails() {
    const candidateSearchtModel = new CandidateSearchtModel();
    candidateSearchtModel.jobOpeningId = this.candidate.jobOpeningId;
    candidateSearchtModel.candidateId = this.candidate.candidateId;
    this.recruitmentService.sendOfferLetter(candidateSearchtModel).subscribe((response: any) => {
      this.toastr.success('' + this.translateService.instant('BILLINGMANAGEMENT.MAILSENT'));
      this.addSubmissionPopover.forEach((p) => p.closePopover());
    });
  }

  downloadOfferLetter(basicJobDetailFormDirective: FormGroupDirective) {
    const candidateSearchtModel = new CandidateSearchtModel();
    candidateSearchtModel.jobOpeningId = this.candidate.jobOpeningId;
    candidateSearchtModel.candidateId = this.candidate.candidateId;
    candidateSearchtModel.package = this.submissionForm.value.package;
    candidateSearchtModel.offeredDate = this.submissionForm.value.offeredDate;
    this.recruitmentService.downloadOfferLetter(candidateSearchtModel).subscribe((response: any) => {
      const filePath = response.data;
      if (filePath) {
        const blob = new Blob([filePath.byteStream], { type: filePath.fileName });
        if (filePath.blobUrl) {
          const parts = filePath.blobUrl.split('.');
          const fileExtension = parts.pop();
          if (fileExtension === 'pdf') {
          } else {
            const downloadLink = document.createElement('a');
            downloadLink.href = filePath.blobUrl;
            downloadLink.click();
          }
        }
        this.toastr.success('' + this.translateService.instant('PERFORMANCE.OFFERLETTER'));
        this.addSubmissionPopover.forEach((p) => p.closePopover());
      }
    });
    this.clearForm();
  }

  AddEmployeePopover(hiredPopover) {
    this.formValidate();
    hiredPopover.openPopover();
  }

  closeEmployeePopover(interviewTypeFormDirective) {
    interviewTypeFormDirective.resetForm();
    this.addEmployeePopover.forEach((p) => p.closePopover());
  }

  downloadPdf(pdf) {
    const parts = pdf.split('/');
    const loc = parts.pop();
  }

  openScheduleInterview() {
    const dialogRef = this.dialog.open(ScheduleInterviewComponent, {
      disableClose: true,
      width: '950px', height: '570px',
      data: { data: this.job, candidate: this.candidate }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openJoBCandidate() {
    const dialogRef = this.dialog.open(JobCandidateLinkComponent, {
      disableClose: true,
      width: '500px', minHeight: '300px',
      data: { data: this.candidate, candidate: this.candidate }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        if (result.addedJob) {
          this.getCanidateAfterClose();
        }
        console.log('The dialog was closed');
      }
    });
  }

  getCanidateAfterClose() {
    const candidateSearchtModel = new CandidateSearchtModel();
    candidateSearchtModel.jobOpeningId = this.candidate.jobOpeningId;
    this.store.dispatch(new LoadCandidateItemsTriggered(candidateSearchtModel));
  }

  changeHiringStatus(value) {
    this.hiringStatusId = value;
    this.hiringStatus.forEach(x => {
      if (x.hiringStatusId === value) {
        this.color = x.color;
        this.hiringStatusName = x.status;
        this.candidateStatusId = value;
        this.cdRef.detectChanges();
        this.upsertCandidateDetail();
        this.closeCandidateDialogWindow();
      }
    });
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

  addEmployeeIntoSystem(interviewTypeFormDirective) {
    this.isSave = true;
    this.getCandiates();
  }
  getCandiates() {
    const candidateSearchtModel = new CandidateSearchtModel();
    candidateSearchtModel.jobOpeningId = this.candidate.jobOpeningId;
    candidateSearchtModel.candidateId = this.candidate.candidateId;
    this.recruitmentService.getCandisates(candidateSearchtModel).subscribe((response: any) => {
      if (response.success) {
        this.candidate = response.data[0];
        this.saveEmployee();
        this.cdRef.detectChanges();
      }
      this.cdRef.detectChanges();
    });
  }

  saveEmployee() {
    this.isSave = true;
    const employeelist = new EmployeeListModel();
    employeelist.firstName = this.candidate.firstName;
    employeelist.surName = this.candidate.lastName;
    employeelist.email = this.candidate.email;
    employeelist.mobileNo = this.candidate.phone;
    employeelist.dateOfJoining = this.candidate.createdDateTime;
    employeelist.departmentId = this.candidate.departmentId;
    employeelist.employeeNumber = this.candidate.employeeNumber;
    employeelist.employeeShiftId = null;
    employeelist.branchId = this.interviewTypeForm.value.locations;
    let roles;
    if (Array.isArray(this.interviewTypeForm.value.roleId)) {
      roles = this.interviewTypeForm.value.roleId;
    } else {
      roles = this.interviewTypeForm.value.roleId.split(',');
    }
    const index2 = roles.indexOf(0);
    if (index2 > -1) {
      roles.splice(index2, 1);
    }
    employeelist.roleIds = roles.join();
    employeelist.permittedBranches = this.interviewTypeForm.value.locations;
    employeelist.isUpsertEmployee = true;
    employeelist.isActiveOnMobile = true;
    this.recruitmentService.upsertEmployees(employeelist).subscribe((response: any) => {
      if (response.success) {
        this.addEmployeePopover.forEach((p) => p.closePopover());
        this.employeeId = response.data;
        this.refereshCandidateListOnConvert();
      } else {
        this.toastr.warning('' + this.translateService.instant('CANDIDATEHISTORY.CANDIDATEToEMPLOYEE'));
      }
      this.isSave = false;
      this.cdRef.detectChanges();
    });
  }

  refereshCandidateListOnConvert() {
    const candidateSearchtModel = new CandidateSearchtModel();
    candidateSearchtModel.jobOpeningId = this.candidate.jobOpeningId;
    this.store.dispatch(new RefreshCandidatesList(candidateSearchtModel));
  }

  upsertCandidateDetail() {
    const candidateUpsert = new CandidateUpsertModel();
    candidateUpsert.candidateId = this.candidate.candidateId;
    candidateUpsert.firstName = this.candidate.firstName;
    candidateUpsert.lastName = this.candidate.lastName;
    candidateUpsert.email = this.candidate.email;
    candidateUpsert.secondaryEmail = this.candidate.secondaryEmail;
    candidateUpsert.phone = this.candidate.phone;
    candidateUpsert.addressJson = this.candidate.addressJson;
    candidateUpsert.currentSalary = this.candidate.currentSalary;
    candidateUpsert.expectedSalary = this.candidate.expectedSalary;
    candidateUpsert.experienceInYears = this.candidate.experienceInYears;
    candidateUpsert.skypeId = this.candidate.skypeId;
    candidateUpsert.assignedToManagerId = this.candidate.assignCandidateTo;
    candidateUpsert.hiringStatusId = this.hiringStatusId == undefined ? this.candidate.hiringStatusId : this.hiringStatusId;
    candidateUpsert.countryId = this.candidate.countryid;
    candidateUpsert.currentDesignation = this.candidate.currentDesignation;
    candidateUpsert.sourceId = this.candidate.SourceId;
    candidateUpsert.sourcePersonId = this.candidate.sourcePersonId;
    candidateUpsert.jobOpeningId = this.candidate.jobOpeningId;
    candidateUpsert.candidateJobOpeningId = this.candidate.candidateJobOpeningId;
    candidateUpsert.assignedToManagerId = this.candidate.assignedToManagerId;
    candidateUpsert.description = this.candidate.description;
    candidateUpsert.timeStamp = this.candidate.timeStamp;
    if (this.archiveProgress) {
      candidateUpsert.isArchived = true;
    }
    this.recruitmentService.upsertCandidate(candidateUpsert).subscribe((response: any) => {
      if (response.success) {
        if (this.archiveProgress) {
          this.closeArchiveCandidaatePopup();
        }
        this.candidateUpdated.emit(this.candidate);
        this.inLineEditPopUps.forEach((p) => p.closePopover());
      } else {
        this.archiveProgress = false;
        this.toastr.error(response.apiResponseMessages[0].message);
      }
      this.cdRef.detectChanges();
    });
  }

  selectdownload(event) {
    this.selectedDownload = event.checked;
  }

  closeFilePopup() {
    this.clearForm();
    this.closeUpsert();
  }

  closeUpsert() {
    this.closePopup.emit('true');
  }

  archivedCandidate() {
    this.archiveProgress = true;
    const candidateUpsert = new CandidateUpsertModel();
    candidateUpsert.candidateJson = '';
    candidateUpsert.candidateId = this.candidate.candidateId;
    candidateUpsert.candidateJobOpeningId = this.candidate.candidateJobOpeningId;
    candidateUpsert.isJobLink = true;
    candidateUpsert.isArchived = true;
    this.recruitmentService.upsertCandidate(candidateUpsert).subscribe((response: any) => {
      if (response.success) {
        if (this.archiveProgress) {
          this.closeArchiveCandidaatePopup();
        }
        this.candidateUpdated.emit(this.candidate);
        this.inLineEditPopUps.forEach((p) => p.closePopover());
      } else {
        this.archiveProgress = false;
        this.toastr.error(response.apiResponseMessages[0].message);
      }
      this.cdRef.detectChanges();
    });
  }

  GetRoleslist() {
    const selectedRoles = this.selectRoles.value.roleId;
    const index = selectedRoles.indexOf(0);
    if (index > -1) {
      selectedRoles.splice(index, 1);
    }
    this.roleIds = selectedRoles.toString();
    this.bindRoleIds(this.roleIds);
  }

  bindRoleIds(roleIds) {
    if (roleIds) {
      const rolesList = this.roleList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(rolesList, function (member: any) {
        return roleIds.toString().includes(member.roleId);
      });
      const selectedRoles = filteredList.map((x: any) => x.roleName);
      this.selectedRoles = selectedRoles.toString();
    } else {
      this.selectedRoles = '';
    }
  }

  clearAddInterviewTypeFormPopup() {
    this.isThereAnError = false;
    this.loadSpinner = false;
    this.interviewTypeForm = new FormGroup({

      roleId: new FormControl(null,
        Validators.compose([
        ])
      )

    });
  }

  toggleRolePerOne() {
    if (this.allRolesSelected.selected) {
      this.allRolesSelected.deselect();
      return false;
    }
    if (
      this.interviewTypeForm.get('roleId').value.length === this.roleList.length
    ) {
      this.allRolesSelected.select();
    }
  }

  toggleAllRolesSelection() {
    if (this.allRolesSelected.selected && this.roleList) {
      this.interviewTypeForm.get('roleId').patchValue([
        ...this.roleList.map((item) => item.roleId),
        0
      ]);
      this.selectedRoles = this.roleList.map((item) => item.roleId);
    } else {
      this.interviewTypeForm.get('roleId').patchValue([]);
    }
  }

  GetLocationslist() {
    const selectedLocations = this.selectLocations.value.locations;
    const index = selectedLocations.indexOf(0);
    if (index > -1) {
      selectedLocations.splice(index, 1);
    }
    this.locationIds = selectedLocations.toString();
    this.bindLocations(this.locationIds);
  }

  bindLocations(locationIds) {
    if (locationIds) {
      const locationList = this.locationList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(locationList, function (member: any) {
        return locationIds.toString().includes(member.branchId);
      });
      const selectedLocations = filteredList.map((x: any) => x.branchName);
      this.selectedLocations = selectedLocations.toString();
    } else {
      this.selectedLocations = '';
    }
  }

  toggleLocationPerOne() {
    if (
      this.interviewTypeForm.get('locations').value.length === this.locationList.length
    ) {
      this.allLocationSelected.select();
    }
  }

  toggleAllLocationSelected() {
    if (this.allLocationSelected.selected && this.locationList) {
      this.interviewTypeForm.get('locations').patchValue([
        ...this.locationList.map((item) => item.branchId
        ),
        0
      ]);
      this.selectLocations = this.locationList.map((item) => item.branchId);
    } else {
      this.interviewTypeForm.get('locations').patchValue([]);
    }
    this.locationIds = this.selectLocations.value;
  }

  selectAll(roles: any, selectedroles: any) {
    if (selectedroles != null && selectedroles.length === roles.length) {
      this.allSelected.select();
    }
  }

  getSelectedRoles() {
    let rolevalues;
    if (Array.isArray(this.interviewTypeForm.value.roleId)) {
      rolevalues = this.interviewTypeForm.value.roleId;
    } else {
      rolevalues = this.interviewTypeForm.value.roleId.split(',');
    }
    const component = rolevalues;
    const index = component.indexOf(0);
    if (index > -1) {
      component.splice(index, 1);
    }
    const rolesList = this.roleList;
    // tslint:disable-next-line: only-arrow-functions
    const selectedUsersList = _.filter(rolesList, function (role: any) {
      return component.toString().includes(role.roleId);
    });
    const roleNames = selectedUsersList.map((x: any) => x.roleName);
    this.selectedRoles = roleNames.toString();
  }

  toggleAllRolesSelected() {
    if (this.allSelected.selected) {
      this.interviewTypeForm.controls['roleId'.toString()].patchValue([
        0, ...this.roleList.map(item => item.roleId)
      ]);
    } else {
      this.interviewTypeForm.controls['roleId'.toString()].patchValue([]);
    }
    this.getSelectedRoles();
  }

  getStoreConfigurations() {
    this.recruitmentService.getStoreConfiguration().subscribe((result: any) => {
      if (result.success) {
        this.storeConfigurations = result.data;
      }
      if (this.storeConfigurations) {
        this.fileExtensions = this.storeConfigurations.fileExtensions;
        let extensions = this.fileExtensions; // .replace('/*', '');
        while (extensions.indexOf('/*') !== -1) {
          extensions = extensions.replace('/*', '');
        }
        if (extensions.includes('*')) {
          this.fileExtensions = '*';
        }
        this.maxStoreSize = this.storeConfigurations.maxStoreSize;
        this.maxFileSize = this.storeConfigurations.maxFileSize;
        if (this.moduleTypeId === 5 || this.moduleTypeId === 9) {
          this.maxStoreSize = this.storeConfigurations.maxStoreSize;
          this.cdRef.markForCheck();
        } else {
          this.maxFileSize = this.storeConfigurations.maxFileSize;
          this.cdRef.markForCheck();
        }
      }
    });
  }

  filesSelected(event) {
    this.files.push(...event.addedFiles);
    if (event.rejectedFiles.length > 0) {
      if (event.rejectedFiles[0].size > this.maxFileSize) {
        this.toastr.error('', this.translateService.instant(ConstantVariables.FileSizeShouldNotExceed) + ' ' +
          this.filesize.transform(this.maxFileSize));
      } else if (this.storeConfigurations.fileExtensions.search(event.rejectedFiles[0].type)) {
        this.toastr.error('', this.translateService.instant(ConstantVariables.ThisFileTypeIsNotAllowed));
      }
    }
    if (this.files.length > 0) {
      this.filesPresent = true;
      this.isButtonVisible = true;
    }
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length > 0) {
      this.filesPresent = true;
    } else {
      this.filesPresent = false;
      this.isButtonVisible = false;
    }
  }

  setAllowedFileExtensions() {
    if (this.storeConfigurations) {
      let extensions = this.storeConfigurations.fileExtensions;
      while (extensions.indexOf('/*') !== -1) {
        extensions = extensions.replace('/*', '');
      }
      extensions = extensions.replace('.*,', '*');
      extensions = extensions.replace(', .*', ', *');
      const splitted = extensions.split(',');
      extensions = '';
      for (let i = 0; i < splitted.length; i++) {
        if (i !== 0) {
          extensions += ', ';
        }
        const trimmedtoken = splitted[i].trim();
        const token = this.translateService.instant('EXTENSIONS.' + trimmedtoken);
        if (token.indexOf('EXTENSIONS.') !== -1) {
          extensions += splitted[i];
        } else {
          extensions += token;
        }
      }
      return extensions;
    }
  }

  private UploaderOnInit(url: string): void {
    this.anyOperationInProgress = true;
    let progress = 0;
    const r = new Resumable({
      target: url,
      chunkSize: 1 * 1024 * 1024, // 3 MB
      query: { moduleTypeId: this.moduleTypeId },
      headers: {
        Authorization: `Bearer ${this.cookieService.get(LocalStorageProperties.CurrentUser)}`
      },
    });
    r.addFiles(this.files.filter(a => a.size > 0));
    r.on('fileAdded', (file, event) => {
      if (!this.fileResultModel || this.fileResultModel.length > 0) {
        this.fileResultModel = [];
        this.cdRef.detectChanges();
      }
      r.upload();
    });
    r.on('complete', (event) => {
      r.files.pop();
      this.progressValue = 0;
      this.filesPresent = false;
      this.fileIndex = 0;
      this.uploadedFileNames = [];
      this.fileCounter = 1;
      if (this.fileResultModel.length > 0) {
        this.upsertFiles(this.fileResultModel);
      }
    });
    r.on('progress', () => {
      progress = Math.round(r.progress() * 100);
      this.progressValue = progress;
      this.cdRef.detectChanges();
    });

    r.on('fileSuccess', (file, response) => {
      if (file && file.fileName) {
        if (!this.uploadedFileNames.find((x) => x === file.fileName)) {
          this.uploadedFileNames.push(file.fileName);
          this.fileCounter = this.uploadedFileNames.length;

          const result = JSON.parse(response);
          if (result && result.length > 0) {
            if (!this.fileResultModel) {
              this.fileResultModel = [];
            }
            const fileResult = new FileResultModel();
            fileResult.fileExtension = result[0].FileExtension;
            fileResult.fileName = result[0].FileName;
            fileResult.filePath = result[0].FilePath;
            fileResult.fileSize = result[0].FileSize;
            this.fileResultModel.push(fileResult);
          }
          this.cdRef.detectChanges();
        }
      }
    });
  }

  upsertFiles(fileResultModel) {
    const upsertFileModel = new UpsertFileModel();
    const fileModelList = [];
    fileResultModel.forEach((element: any) => {
      const fileModel = new FileModel();
      fileModel.fileName = this.customFileName
        && this.customFileName.trim() ? this.customFileName : element.FileName ? element.FileName : element.fileName;
      fileModel.fileSize = element.FileSize ? element.FileSize : element.fileSize;
      fileModel.filePath = element.FilePath ? element.FilePath : element.filePath;
      fileModel.fileExtension = element.FileExtension ? element.FileExtension : element.fileExtension;
      fileModel.isArchived = false;
      fileModel.isQuestionDocuments = false;
      fileModel.questionDocumentId = this.candidateId;
      fileModelList.push(fileModel);
    });
    this.customFileName = null;
    upsertFileModel.filesList = fileModelList;
    upsertFileModel.referenceTypeId = this.referenceTypeId;
    upsertFileModel.isFromFeedback = this.isFromFeedback;
    upsertFileModel.referenceId = this.folderReferenceId;
    this.referenceFileId = this.candidateId;
    upsertFileModel.referenceId = this.referenceFileId;
    upsertFileModel.fileType = this.moduleTypeId;
    if (this.selectedParentFolderId) {
      upsertFileModel.folderId = this.selectedParentFolderId;
    }
    if (this.selectedStoreId) {
      upsertFileModel.storeId = this.selectedStoreId;
    }
    this.uploadFilesFromApp(upsertFileModel);
  }

  uploadFilesFromApp(upsertFileModel: UpsertFileModel) {
    this.recruitmentService.upsertMultipleFiles(upsertFileModel).subscribe((response: any) => {
      if (response.success === true) {
        this.files = [];
        this.isTobeReviewed = false;
        this.fileResultModel = [];
        this.getUploadedFilesDetails(this.candidateId);
        this.cdRef.detectChanges();
      } else {
        this.toastr.error(response.apiResponseMessages[0].message);
      }
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  getUploadedFilesDetails(referenceId) {
    this.getFilesInProgress = true;
    const searchFolderModel = new SearchFileModel();
    searchFolderModel.referenceId = referenceId;
    searchFolderModel.referenceTypeId = this.referenceTypeId;
    searchFolderModel.isArchived = false;
    searchFolderModel.sortDirectionAsc = true;
    searchFolderModel.userStoryId = this.candidateId;
    this.recruitmentService.getFiles(searchFolderModel).subscribe((result: any) => {
      if (result.success) {
        this.uploadedFiles = result.data;
        this.uploadedFilesLength = result.data.length;
        this.selectedDownload = this.uploadedFilesLength > 0 ? false : true;
        if (this.moduleTypeId === 10) {
          this.setFileCountDetails(this.candidateId, this.uploadedFilesLength);
        }
      }
      this.getFilesInProgress = false;
      this.cdRef.detectChanges();
    });
  }
  setFileCountDetails(referenceId, filesCount) {
    const fileDetails = this.cookieService.get(LocalStorageProperties.ExpensesFileCount);
    let fileCountDetails: any;
    if (fileDetails && fileDetails !== '') {
      fileCountDetails = JSON.parse(fileDetails);
    }
    fileCountDetails = (fileCountDetails && fileCountDetails.length > 0) ? fileCountDetails : [];
    const index = fileCountDetails.findIndex((x) => x.expenseId === referenceId);
    if (index !== -1) {
      fileCountDetails.forEach((element) => {
        if (element.expenseId === referenceId) {
          element.filesCount = filesCount;
        }
      });
    } else if (index === -1) {
    }
    this.cookieService.set(LocalStorageProperties.ExpensesFileCount, JSON.stringify(fileCountDetails));
  }

  saveFiles() {

    if (this.files && this.files.length > 1) {
      this.toastr.warning('You can select only one file.');
      return;
    }
    this.anyOperationInProgress = true;
    const formData = new FormData();
    if (this.files.filter((f: any) => f.id != null).length > 0 && this.files.filter((f: any) => f.id == null).length > 0) {
      this.bothFiles = true;
    }
    if (this.filesPresent) {
      this.files.forEach((file: File) => {
        this.fileIndex = this.fileIndex + 1;
        const fileKeyName = 'file' + this.fileIndex.toString();
        formData.append(fileKeyName, file);
      });
      this.fileNames = this.files.map((x: any) => x.name);
      if (this.uploadedFiles && this.uploadedFiles.length > 0) {
        const existingFiles = this.uploadedFiles.filter((file) => this.fileNames.includes(file.fileName)).map((x: any) => x.fileName).join(',');

      }
      this.cdRef.detectChanges();
      this.anyOperationInProgress = false;
      this.UploaderOnInit(environment.apiURL + ApiUrls.UploadFileChunks);
    } else {
      this.files = [];
      this.customFileName = null;
      this.isTobeReviewed = false;
      this.anyOperationInProgress = false;
      this.fileResultModel = [];
    }
  }

  removeAllFiles() {
    this.filesPresent = false;
    this.files = [];
  }

  deleteSelectedFile(file) {
    const deleteFileInputModel = new DeleteFileInputModel();
    deleteFileInputModel.fileId = file.fileId;
    deleteFileInputModel.timeStamp = file.timeStamp;
    this.recruitmentService.deleteFile(deleteFileInputModel).subscribe((result: any) => {
      if (result.success) {
        this.getUploadedFilesDetails(this.candidateId);
      }
    });
    // this.store.dispatch(new DeleteFileTriggered(deleteFileInputModel));
  }
  openPreview(file) {
    const images = [];
    const album = {
      small: this.imagePipe.transform(file.filePath, '50', '50'),
      big: this.imagePipe.transform(file.filePath, '', '')
    };
    images.push(album);
    this.galleryImages = images;
    this.cdRef.detectChanges();
    this.onlyPreviewGallery.openPreview(0);
  }

  downloadFile(file) {
    const parts = file.filePath.split('/');
    const loc = parts.pop();
    if (file.fileExtension === '.pdf') {
      this.downloadPdf(file.filePath);
    } else {
      const downloadLink = document.createElement('a');
      downloadLink.href = file.filePath;
      downloadLink.download = loc.split('.')[0] + '-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') +
        '-File' + file.fileExtension;
      downloadLink.click();
    }
  }
}
