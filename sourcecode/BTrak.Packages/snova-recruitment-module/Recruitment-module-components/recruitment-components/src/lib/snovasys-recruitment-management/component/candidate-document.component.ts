import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { CandidateDocumentModel } from '../../snovasys-recruitment-management-apps/models/candidate-document.model';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { DocumentTypeUpsertModel } from '../../snovasys-recruitment-management-apps/models/documentTypeUpsertModel';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-candide-document-detail',
  templateUrl: 'candidate-document.component.html',

})
export class CandidateDocumentComponent implements OnInit {
  @Input() src: string;
  @Input() name: string;
  @Input() size: string;
  @Input() isNameRequired ? = true;
  @ViewChildren('upsertDocumentPopUp') upsertDocumentPopover;
  @ViewChildren('deleteDocumentPopup') deleteDocumentPopover;
  @ViewChild('documentFormDirective') documentFormDirective: FormGroupDirective;
  @Output() closePopup = new EventEmitter<string>();

  isAnyOperationIsInprogress = true;
  documents: any;
  candidateDocument: any;
  documentForm: FormGroup;
  candidateDocumentsId: string;
  documentName: string;
  timeStamp: any;
  ratingTypeTitle: any;
  isThereAnError: boolean;
  validationMessage: string;
  searchText: any;
  document: any;
  isArchived = false;
  documentTitle: any;
  documentTypeId: any;
  candidaTypeId: any;
  selectedCandidateDocument: any;
  documentTypes: any;
  candidateData: any;
  temp: any = [];
  isDocument = false;
  description: any;
  isResume: any;
  @Input('candidateData')
  set _candidateData(candidateData: any) {
    this.candidateData = candidateData;
  }

  ngOnInit() {
    this.isDocument = false;
    this.getCandidateDocuments();
    this.clearForm();
    this.getDocumentTypes();
  }

  constructor(
    private recruitmentService: RecruitmentService,
    private cdRef: ChangeDetectorRef
  ) {
    this.isDocument = false;
  }

  getCandidateDocuments() {
    const candidateDocumentModel = new CandidateDocumentModel();
    this.isAnyOperationIsInprogress = true;
    candidateDocumentModel.candidateId = this.candidateData.candidateId;
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

  editDocument(row, upsertDocumentPopUp) {
    this.isDocument = true;
    this.selectedCandidateDocument = row;
    upsertDocumentPopUp.openPopover();
  }

  createCandidateDocument(upsertDocumentPopUp) {
    this.isDocument = true;
    this.selectedCandidateDocument = null;
    upsertDocumentPopUp.openPopover();
  }

  clearForm() {
    this.document = null;
    this.candidateDocumentsId = null;
    this.isResume = null;
    this.isThereAnError = false;
    this.validationMessage = null;
    this.timeStamp = null;
    this.isAnyOperationIsInprogress = false;
    this.searchText = null;
    this.documentForm = new FormGroup({
      document: new FormControl(null,
        Validators.compose([
          Validators.required,
        ])
      ),
      isResume: new FormControl(null,
        Validators.compose([
        ])
      ),
      description: new FormControl(null,
        Validators.compose([
          Validators.required,
        ])
      ),
      documentlink: new FormControl(null,
        Validators.compose([
        ])
      ),
      candidateDocumentsId: new FormControl(null,
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
  }

  closeDocumentDialog(event) {
    this.isDocument = false;
    if (!event) {
      this.closePopup.emit('');
    } else {
      this.upsertDocumentPopover.forEach((p) => p.closePopover()); }

    if (event === 'true') {
      this.getCandidateDocuments();
    }
  }

  deleteDocumentPopupOpen(row, deletedocumentPopup) {
    this.candidateDocumentsId = row.candidateDocumentId;
    this.documentName = row.document;
    this.description = row.description;
    this.timeStamp = row.timeStamp;
    this.documentTypeId = row.documentTypeId;
    this.candidaTypeId = row.candidateTypeId;
    this.isResume = row.isResume;
    deletedocumentPopup.openPopover();
  }

  deleteDocument() {
    this.isAnyOperationIsInprogress = true;
    const candidateDocument = new CandidateDocumentModel();
    candidateDocument.candidateId = this.candidateData.candidateId;
    candidateDocument.document = this.documentName.toString().trim();
    candidateDocument.candidateDocumentsId = this.candidateDocumentsId;
    candidateDocument.documentTypeId = this.documentTypeId;
    candidateDocument.isResume = this.isResume;
    candidateDocument.description = this.description;
    candidateDocument.timeStamp = this.timeStamp;
    candidateDocument.isArchived = !this.isArchived;
    this.recruitmentService.upsertCandidateDocuments(candidateDocument).subscribe((response: any) => {
      if (response.success === true) {
        this.deleteDocumentPopover.forEach((p) => p.closePopover());
        this.clearForm();
        this.getCandidateDocuments();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  closeDeleteDocumentPopup() {
    this.clearForm();
    this.deleteDocumentPopover.forEach((p) => p.closePopover());
  }

  getDocumentTypes() {
    this.isAnyOperationIsInprogress = true;
    const documentTypeModel = new DocumentTypeUpsertModel();
    documentTypeModel.isArchived = false;
    this.recruitmentService.getDocumentTypes(documentTypeModel).subscribe((response: any) => {
      if (response.success === true) {
        this.documentTypes = response.data;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      }
    });
  }

  filterByName(value) {
    if (this.searchText != null && this.searchText !== undefined && this.searchText !== '') {
      const temp = this.temp.filter(data =>
        (data.document.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1)
        || (data.description.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1)
        || (data.documentTypeName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1));
      this.candidateDocument = temp;
    } else if (this.searchText == null || this.searchText === '') {
      this.candidateDocument = this.temp;
    }
  }

  closeSearch() {
    this.searchText = null;
    this.filterByName(null);
  }
}
