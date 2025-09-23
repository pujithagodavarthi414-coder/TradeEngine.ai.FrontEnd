import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { CandidateDocumentModel } from '../../snovasys-recruitment-management-apps/models/candidate-document.model';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DocumentTypeUpsertModel } from '../../snovasys-recruitment-management-apps/models/documentTypeUpsertModel';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'add-candidate-document-detail',
  templateUrl: 'add-candidate-document.component.html',

})
export class AddcandidatedocumentdetailComponent extends CustomAppBaseComponent implements OnInit {

  @ViewChildren('upsertDocumentPopUp') upsertDocumentPopover;
  @ViewChildren('deleteDocumentPopup') deleteDocumentPopover;
  @ViewChild('documentFormDirective') documentFormDirective: FormGroupDirective;
  @ViewChildren('upsertDocumentTypePopUp') upsertDocumentTypePopover;
  @Output() closePopup = new EventEmitter<string>();
  @Input() src: string;
  @Input() name: string;
  @Input() size: string;
  @Input() isNameRequired ? = true;
  @Input('selectedIndex')
  set _setSelectedIndex(selectedIndex: string) {
    this.selectedIndex = selectedIndex;
    this.formValidate();
    this.filledData(this.candidateDocument);
  }
  @Input('candidate')
  set _setcandidate(candidate: any) {
    this.candidate = candidate;
    this.candidateId = this.candidate.candidateId;
  }

  @Input('candidateDocument')
  set _setCandidateDocument(candidateDocument: any) {
    if (candidateDocument) {
      this.isEdit = true;
      this.candidateDocument = candidateDocument;
      this.formValidate();
      this.candidateId = this.candidateDocument.candidateId;
      this.filledData(this.candidateDocument);
      this.candidateDocumentReferenceId = this.candidateDocument.candidateDocumentId;
    } else {
      this.document = '';
      this.isEdit = false;
      this.candidateDocumentReferenceId = null;
      this.isFileExist = false;
      this.document = '';
      this.clearForm();
      this.documentForm.patchValue([]);
    }
  }

  @Input('documentTypes')
  set _documentTypes(data: any) {
    if (data) {
      this.documentTypes = data;
      this.cdRef.detectChanges();
    }
  }

  selectedIndex;
  candidate: any;
  candidateId: any;
  documentTypes: any;
  isEdit = false;
  isFileExist: boolean;
  candidateReferenceId = '';
  documentTypeForm: FormGroup;
  documentTypeTitle: any;
  documentTypeId: string;
  isAnyOperationIsInprogress = true;
  documents: any;
  candidateDocument: any = '';
  documentForm: FormGroup;
  CandidateDocumentsId: string;
  DocumentName: string;
  timeStamp: any;
  ratingTypeTitle: any;
  isThereAnError: boolean;
  validationMessage: string;
  searchText: any;
  document: any;
  isArchived = false;
  documentTitle: any;
  moduleTypeId = 15;
  referenceTypeId = ConstantVariables.RecruitmentReferenceTypeId;
  isToUploadFiles = false;
  selectedStoreId: null;
  selectedParentFolderId: null;
  candidateDocumentReferenceId = '';

  ngOnInit() {
    super.ngOnInit();
  }

  constructor(
    private recruitmentService: RecruitmentService,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<AddcandidatedocumentdetailComponent>,
    private cdRef: ChangeDetectorRef
  ) {
    super();
    this.clearForm();
  }

  getCandidateDocuments() {
    const candidateDocumentModel = new CandidateDocumentModel();
    this.isAnyOperationIsInprogress = true;
    candidateDocumentModel.candidateId = this.candidateId;
    candidateDocumentModel.isArchived = this.isArchived;
    this.recruitmentService.getCandidateDocuments(candidateDocumentModel).subscribe((response: any) => {
      if (response.success) {
        this.candidateDocument = response.data;
        this.isAnyOperationIsInprogress = false;

      } else {
        this.isAnyOperationIsInprogress = false;
      }
    });

  }

  upsertDocument(formDirective: FormGroupDirective) {
    this.isToUploadFiles = false;
    this.isAnyOperationIsInprogress = true;
    const candidateDocument = new CandidateDocumentModel();
    candidateDocument.document = this.documentForm.value.document.toString().trim();
    candidateDocument.description = this.documentForm.value.description;
    candidateDocument.candidateDocumentsId = this.documentForm.value.candidateDocumentId;
    candidateDocument.candidateId = this.candidateId;
    candidateDocument.documentTypeId = this.documentForm.value.documentTypeId;
    candidateDocument.isResume = this.documentForm.value.isResume;
    candidateDocument.timeStamp = this.candidateDocument.timeStamp;
    this.recruitmentService.upsertCandidateDocuments(candidateDocument).subscribe((response: any) => {
      if (response.success === true) {
        this.isToUploadFiles = true;
        this.candidateDocumentReferenceId = response.data;
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  formValidate() {
    this.documentForm = new FormGroup({
      document: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ])
      ),
      isResume: new FormControl(null,
        Validators.compose([
        ])
      ),
      description: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ])
      ),
      documentlink: new FormControl(null,
        Validators.compose([
        ])
      ),
      candidateDocumentId: new FormControl(null,
        Validators.compose([
        ])
      ),
      candidateId: new FormControl(null,
        Validators.compose([
        ])
      ),
      documentTypeId: new FormControl(null,
        Validators.compose([
        ])
      ),
    });

    if (this.candidateDocument) {
      this.filledData(this.candidateDocument);
    }
    this.documentTypeForm = new FormGroup({
      documentTypeName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
    });
  }

  clearForm() {
    this.document = '';
    this.isThereAnError = false;
    this.validationMessage = null;
    this.timeStamp = null;
    this.isAnyOperationIsInprogress = false;
    this.searchText = null;
    this.documentForm = new FormGroup({
      document: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ])
      ),
      isResume: new FormControl(null,
        Validators.compose([
        ])
      ),
      description: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ])
      ),
      documentlink: new FormControl(null,
        Validators.compose([
        ])
      ),
      candidateDocumentId: new FormControl(null,
        Validators.compose([
        ])
      ),
      candidateId: new FormControl(null,
        Validators.compose([
        ])
      ),
      documentTypeId: new FormControl(null,
        Validators.compose([

        ])
      ),
    });
    this.documentTypeForm = new FormGroup({
      documentTypeName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
    });
  }

  closedialog() {
    this.documentFormDirective.resetForm();
    this.closePopup.emit('false');
    this.documents = '';
    this.clearForm();
  }

  closeUpsert() {
    this.documentFormDirective.resetForm();
    this.closePopup.emit('true');
  }

  openClosingPopup() {
    this.dialogRef.close();
    this.formValidate();
  }

  filledData(data) {
    if (this.candidateDocument != null && this.candidateDocument !== undefined) {
      this.documentForm.patchValue(this.candidateDocument);
    }
  }

  filesExist(event) {
    this.isFileExist = event;
  }

  closeFilePopup() {
    this.clearForm();
    this.closeUpsert();
    this.getCandidateDocuments();
  }

  createDocumentType(upsertDocumentTypePopUp) {
    upsertDocumentTypePopUp.openPopover();
    this.documentTypeTitle = this.translateService.instant('DOCUMENTTYPE.ADDDOCUMENTTYPETITLE');
  }

  upsertDocumentType(formDirective: FormGroupDirective) {
    this.isAnyOperationIsInprogress = true;

    let documentType = new DocumentTypeUpsertModel();
    documentType = this.documentTypeForm.value;
    documentType.documentTypeName = documentType.documentTypeName.toString().trim();
    documentType.documentTypeId = this.documentTypeId;
    documentType.timeStamp = this.timeStamp;

    this.recruitmentService.upsertDocumentType(documentType).subscribe((response: any) => {
      if (response.success === true) {
        this.upsertDocumentTypePopover.forEach((p) => p.closePopover());
        this.clearForm();
        formDirective.resetForm();
        this.getDocumentTypes();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  getDocumentTypes() {
    this.isAnyOperationIsInprogress = true;
    const documentTypeModel = new DocumentTypeUpsertModel();
    documentTypeModel.isArchived = this.isArchived;
    this.recruitmentService.getDocumentTypes(documentTypeModel).subscribe((response: any) => {
      if (response.success === true) {
        this.isThereAnError = false;
        this.clearForm();
        this.documentTypes = response.data;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      }
    });
  }

  closeUpsertDocumentTypePopUpPopup(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.clearForm();
    this.upsertDocumentTypePopover.forEach((p) => p.closePopover());
  }

}


