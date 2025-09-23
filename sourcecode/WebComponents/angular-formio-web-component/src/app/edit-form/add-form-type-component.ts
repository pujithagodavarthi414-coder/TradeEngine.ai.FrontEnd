import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { ConstantVariables } from '../globaldependencies/constants/constant-variables';
import { CreateForm } from '../models/createForm';
import { FormService } from '../services/formService';
import * as formUtils from 'formiojs/utils/formUtils.js';
import { FormType } from '../models/formType';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-add-form-type-component',
    templateUrl: './add-form-type-component.html'
})
export class AddFormTypeComponent extends CustomAppBaseComponent implements OnInit {

    @Input() isForDialog?: boolean = false;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }
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
    formTypeModel: FormType;
    FormTypeForm: FormGroup;
    formTypes: FormType[];
    timeStamp: any;
    temp: any;
    searchText: string;
    formtype: string;

    constructor(private cdRef: ChangeDetectorRef, private formService: FormService
        , public dialog: MatDialog, private translateService: TranslateService) {
        super();


    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllFormTypes();
        console.log('dsfg');
    }

    getAllFormTypes() {
        this.isAnyOperationIsInprogress = true;

        var formTypeModel = new FormType();
        formTypeModel.isArchived = this.isArchivedTypes;

        this.formService.getAllFormTypes(formTypeModel).subscribe((response: any) => {
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

        this.formTypeModel = new FormType();
        this.formTypeModel.formTypeId = this.formTypeId;
        this.formTypeModel.timeStamp = this.timeStamp;
        this.formTypeModel.formTypeName = this.formTypeName;
        this.formTypeModel.isArchived = !this.isArchivedTypes;

        this.formService.upsertFormType(this.formTypeModel).subscribe((response: any) => {
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
        //   this.formtype = this.translateService.instant('FORMTYPEMASTERTABLE.EDITFORMTYPETITLE');
        this.formtype = 'Edit form type'
        this.timeStamp = row.timeStamp;
        upsertFormTypePopUp.openPopover();
    }

    createFormTypePopupOpen(upsertFormTypePopUp) {
        upsertFormTypePopUp.openPopover();
        //   this.formtype = this.translateService.instant('FORMTYPEMASTERTABLE.ADDFORMTYPETITLE');
        this.formtype = 'Add form type'
    }

    upsertFormType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.formTypeModel = this.FormTypeForm.value;
        this.formTypeModel.formTypeName = this.formTypeModel.formTypeName.trim();
        this.formTypeModel.timeStamp = this.timeStamp;
        this.formTypeModel.formTypeId = this.formTypeId;

        this.formService.upsertFormType(this.formTypeModel).subscribe((response: any) => {
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
    onNoClick(): void {
        this.currentDialog.close();
    }
}
