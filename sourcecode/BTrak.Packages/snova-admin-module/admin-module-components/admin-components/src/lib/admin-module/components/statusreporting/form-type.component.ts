import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { OnInit, Component, Input, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { GenericFormType } from '../../models/generic-form-type-model';
import { TranslateService } from '@ngx-translate/core';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-form-type',
    templateUrl: `form-type.component.html`

})

export class FormTypeComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @Input() isForDialog?: boolean = false;
    @ViewChildren("deleteFormTypePopUp") deleteFormTypePopover;
    @ViewChildren("upsertFormTypePopUp") upsertFormTypePopover;

    masterDataForm: FormGroup;

    isAnyOperationIsInprogress: boolean = false;
    isArchivedTypes: boolean = false;
    isFiltersVisible: boolean;
    isThereAnError: boolean;
    formTypeId: string;
    formTypeName: string;
    validationMessage: string;
    formTypeModel: GenericFormType;
    FormTypeForm: FormGroup;
    formTypes: GenericFormType[];
    timeStamp: any;
    temp: any;
    searchText: string;
    formtype: string;

    constructor(private cdRef: ChangeDetectorRef,
        private masterdataService: MasterDataManagementService
        , private translateService: TranslateService) {
        super();
        
        
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllFormTypes();
    }

    getAllFormTypes() {
        this.isAnyOperationIsInprogress = true;

        var genericFormTypeModel = new GenericFormType();
        genericFormTypeModel.isArchived = this.isArchivedTypes;

        this.masterdataService.getAllFormTypes(genericFormTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.formTypes = response.data;
                this.temp = this.formTypes;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    deleteFormTypePopUpOpen(row, deleteFormTypePopUp) {
        this.formTypeId = row.id;
        this.timeStamp = row.timeStamp;
        this.formTypeName = row.formTypeName;
        deleteFormTypePopUp.openPopover();
    }

    closeDeleteFormTypePopUp() {
        this.clearForm();
        this.deleteFormTypePopover.forEach((p) => p.closePopover());
    }

    deleteFormType() {
        this.isAnyOperationIsInprogress = true;

        this.formTypeModel = new GenericFormType();
        this.formTypeModel.formTypeId = this.formTypeId;
        this.formTypeModel.timeStamp = this.timeStamp;
        this.formTypeModel.formTypeName = this.formTypeName;
        this.formTypeModel.isArchived = !this.isArchivedTypes;

        this.masterdataService.upsertFormType(this.formTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteFormTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllFormTypes();
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    closeUpserIFormTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertFormTypePopover.forEach((p) => p.closePopover());
    }

    cancelDeleteFormType() {
        this.clearForm();
        this.deleteFormTypePopover.forEach((p) => p.closePopover());
    }

    editFormTypePopupOpen(row, upsertFormTypePopUp) {
        this.FormTypeForm.patchValue(row);
        this.formTypeId = row.id;
        this.formtype = this.translateService.instant('FORMTYPEMASTERTABLE.EDITFORMTYPETITLE');
        this.timeStamp = row.timeStamp;
        upsertFormTypePopUp.openPopover();
    }

    createFormTypePopupOpen(upsertFormTypePopUp) {
        upsertFormTypePopUp.openPopover();
        this.formtype = this.translateService.instant('FORMTYPEMASTERTABLE.ADDFORMTYPETITLE');
    }

    upsertFormType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.formTypeModel = this.FormTypeForm.value;
        this.formTypeModel.formTypeName = this.formTypeModel.formTypeName.trim();
        this.formTypeModel.timeStamp = this.timeStamp;
        this.formTypeModel.formTypeId = this.formTypeId;

        this.masterdataService.upsertFormType(this.formTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertFormTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllFormTypes();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    clearForm() {
        this.formTypeId = null;
        this.formTypeName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.formTypeModel = null;
        this.validationMessage = null;
        this.searchText = null;
        this.timeStamp = null;
        this.FormTypeForm = new FormGroup({
            formTypeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
        })
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(formType => formType.formTypeName.toLowerCase().indexOf(this.searchText) > -1);
        this.formTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
