import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { RecruitmentService } from '../services/recruitment.service';
import { DocumentTypeUpsertModel } from '../models/documentTypeUpsertModel';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'app-am-component-document-type',
    templateUrl: `document-type.component.html`
})

export class DocumentTypeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren('upsertDocumentTypePopUp') upsertDocumentTypePopover;
    @ViewChildren('deleteDocumentTypePopup') deleteDocumentTypePopover;
    @Input('dashboardFilters')
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    @Input('fromRoute')
    set _fromRoute(data: boolean) {
        if (data || data === false) {
            this.isFromRoute = data; } else {
            this.isFromRoute = true; }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress = true;
    isArchived = false;
    toastr: any;
    isFromRoute = false;
    documentTypes: DocumentTypeUpsertModel[];
    validationMessage: string;
    isFiltersVisible = false;
    isThereAnError: boolean;
    documentTypeForm: FormGroup;
    timeStamp: any;
    temp: any;
    searchText: string;
    documentTypeId: string;
    documentTypeName: string;
    loading = false;
    documentTypeTitle: string;

    constructor(
        private recruitmentService: RecruitmentService, private cdRef: ChangeDetectorRef, private translateService: TranslateService) {
        super();
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getDocumentTypes();
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
                this.temp = this.documentTypes;
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

    createDocumentType(upsertDocumentTypePopUp) {
        upsertDocumentTypePopUp.openPopover();
        this.documentTypeTitle = this.translateService.instant('DOCUMENTTYPE.ADDDOCUMENTTYPETITLE');
    }

    closeUpsertDocumentTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertDocumentTypePopover.forEach((p) => p.closePopover());
    }

    editDocumentType(row, upsertDocumentTypePopUp) {
        this.documentTypeForm.patchValue(row);
        this.documentTypeId = row.documentTypeId;
        this.documentTypeName = row.documentTypeName;
        this.timeStamp = row.timeStamp;
        this.documentTypeTitle = this.translateService.instant('DOCUMENTTYPE.EDITDOCUMENTTYPETITLE');
        upsertDocumentTypePopUp.openPopover();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
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

    clearForm() {
        this.documentTypeName = null;
        this.documentTypeId = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.documentTypeForm = new FormGroup({
            documentTypeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
        });
    }

    deleteDocumentTypePopupOpen(row, deleteDocumentTypePopup) {
        this.documentTypeId = row.documentTypeId;
        this.documentTypeName = row.documentTypeName;
        this.timeStamp = row.timeStamp;
        deleteDocumentTypePopup.openPopover();
    }

    closeDeleteDocumentTypePopup() {
        this.clearForm();
        this.deleteDocumentTypePopover.forEach((p) => p.closePopover());
    }

    deleteDocumentType() {
        this.isAnyOperationIsInprogress = true;
        const documentTypeInputModel = new DocumentTypeUpsertModel();
        documentTypeInputModel.documentTypeId = this.documentTypeId;
        documentTypeInputModel.documentTypeName = this.documentTypeName;
        documentTypeInputModel.timeStamp = this.timeStamp;
        documentTypeInputModel.isArchived = !this.isArchived;
        this.recruitmentService.upsertDocumentType(documentTypeInputModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteDocumentTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getDocumentTypes();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = '';
        }
        const temp = this.temp.filter(documentType => (documentType.documentTypeName.toLowerCase().indexOf(this.searchText) > -1));
        this.documentTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
    closeUpsertDocumentTypePopUpPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertDocumentTypePopover.forEach((p) => p.closePopover());
    }
}
