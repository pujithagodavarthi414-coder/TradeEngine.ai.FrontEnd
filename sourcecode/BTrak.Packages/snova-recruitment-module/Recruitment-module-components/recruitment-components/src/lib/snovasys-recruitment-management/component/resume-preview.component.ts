import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { CandidateDocumentModel } from '../../snovasys-recruitment-management-apps/models/candidate-document.model';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { SearchFileModel } from '../models/searchFileModel';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'resume-preview',
  templateUrl: 'resume-preview.component.html',
})
export class ResumePreviewComponent implements OnInit {
  @Output() closePopup = new EventEmitter<string>();
  @ViewChildren('upsertcandidatepopup') upsertcandidatepopover;
  matData: any;
  srcData: any;
  isAnyOperationIsInprogress: boolean;
  candidateId: string;
  candidateDocument: any;
  uploadedFiles: any;
  isPdfPreview: boolean;
  isOtherPreview: boolean;
  moduleTypeId = 15;
  referenceTypeId = ConstantVariables.RecruitmentReferenceTypeId;
  isToUploadFiles = false;
  selectedStoreId: null;
  fileType: boolean;
  currentDialogId: any;
  currentDialog: any;
  id: any;
  injector: any;

  @Input('data')
  set _data(data: any) {
    if (data && data !== undefined) {
      this.matData = data[0];
      if (this.matData) {
        this.candidateId = this.matData.candidateId;
        this.currentDialogId = this.matData.dialogId;
        this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        this.getCandidateDocuments();
      }
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdRef: ChangeDetectorRef, public dialog: MatDialog, private sanitizer: DomSanitizer,
    private toastr: ToastrService, private recruitmentService: RecruitmentService, private translateService: TranslateService,
    public dialogRef: MatDialogRef<ResumePreviewComponent>, private vcr: ViewContainerRef, private datePipe: DatePipe) {
    if (data.dialogId) {
      this.currentDialogId = this.data.dialogId;
      this.id = setTimeout(() => {
        this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
      }, 1200);
    }
    this.candidateId = this.data.candidateId;
    this.getCandidateDocuments();
  }

  ngOnInit() {
    this.injector = this.vcr.injector;
  }

  closeResumePreview() {
    this.dialog.closeAll();
  }

  getCandidateDocuments() {
    const candidateDocumentModel = new CandidateDocumentModel();
    this.isAnyOperationIsInprogress = true;
    candidateDocumentModel.isResume = true;
    candidateDocumentModel.candidateId = this.candidateId;
    candidateDocumentModel.isArchived = false;
    this.recruitmentService.getCandidateDocuments(candidateDocumentModel).subscribe((response: any) => {
      if (response.success) {
        this.candidateDocument = response.data;
        if (this.candidateDocument.length > 0) {
          this.getUploadedFilesDetails(this.candidateDocument[0].candidateDocumentId);
        } else {
          this.closeResumePreview();
          this.toastr.error('' + this.translateService.instant('CANDIDATES.EMPTYRESUME'));
        }
      } else {
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  downloadFile(file) {
    const parts = file.filePath.split('/');
    const loc = parts.pop();

    const downloadLink = document.createElement('a');
    downloadLink.href = file.filePath;
    downloadLink.download = loc.split('.')[0] + '-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') +
      '-File' + file.fileExtension;
    downloadLink.click();
  }

  getUploadedFilesDetails(referenceId) {
    const searchFolderModel = new SearchFileModel();
    searchFolderModel.referenceId = referenceId;
    searchFolderModel.referenceTypeId = this.referenceTypeId;
    searchFolderModel.isArchived = false;
    searchFolderModel.sortDirectionAsc = true;
    this.recruitmentService.getFiles(searchFolderModel).subscribe((result: any) => {
      if (result.success) {
        this.uploadedFiles = result.data;
        const length = this.uploadedFiles.length;
        if (this.uploadedFiles.length > 0) {
          this.selectedFileDetailsPreview(this.uploadedFiles[length - 1]);
        } else {
          this.closeResumePreview();
          this.toastr.error('' + this.translateService.instant('CANDIDATES.EMPTYRESUME'));
        }
        this.cdRef.detectChanges();
      }
    });
  }

  selectedFileDetailsPreview(fileDetails) {
    this.srcData = null;
    this.cdRef.detectChanges();
    if (fileDetails.fileExtension == null) {
      this.isPdfPreview = false;
      this.isOtherPreview = false;
      this.srcData = null;
    } else if (fileDetails.fileExtension.toLowerCase() === '.pdf') {
      this.isPdfPreview = true;
      this.isOtherPreview = false;
      this.srcData = fileDetails;
      this.fileType = true;
      if (!(fileDetails.sanitizedFilePath && fileDetails.sanitizedFilePath.changingThisBreaksApplicationSecurity)) {
        this.srcData.sanitizedFilePath = this.sanitizer.bypassSecurityTrustResourceUrl(fileDetails.filePath);
      }
    } else {
      this.fileType = false;
      this.isPdfPreview = false;
      this.isOtherPreview = true;
      this.srcData = fileDetails;
    }
    this.isAnyOperationIsInprogress = false;
    if (this.fileType === false) {
      // this.closeResumePreview();
    }
  }

}

