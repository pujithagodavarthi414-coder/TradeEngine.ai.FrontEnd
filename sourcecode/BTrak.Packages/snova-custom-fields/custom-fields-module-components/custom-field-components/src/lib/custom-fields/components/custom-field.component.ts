import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { State } from "../store/reducers/index";
import { Subject } from "rxjs";
import { CustomFormsComponent } from "./custom-form.component";
import { ToastrService } from "ngx-toastr";
import { CustomFormFieldModel } from '../models/custom-fileds-model';
import { CustomFieldService } from '../servicces/custom-field.service';
import { Router } from '@angular/router';

@Component({
    selector: "app-custom-field-component",
    templateUrl: "./custom-field.component.html"
})

export class CustomFieldsComponent implements OnInit {
    @Input("moduleTypeId")
    set _moduleTypeId(data: number) {
        this.moduleTypeId = data;
    }
    @Input("referenceTypeId")
    set _referenceTypeId(data: string) {
        this.referenceTypeId = data;
    }

    @Input("referenceId")
    set _referenceId(data: string) {
        this.referenceId = data;
        this.getCutomFields();
    }

    @Input("isAddPermission")
    set _isAddPermission(data: boolean) {
        this.isAddPermission = data;
    }
    @Input("isEditFieldPermission")
    set _isEditFieldPermission(data: boolean) {
        this.isEditFieldPermission = data;
    }
    @Input("isDeletePermission")
    set _isDeletePermission(data: boolean) {
        this.isDeletePermission = data;
    }
    @Input("reload")
    set _reload(data: string) {
        if (this.reload != data) {
            this.reload = data;
            this.getCutomFields();
        }
    }
    @Input("isButtonVisible")
    set _isButtonVisible(data: boolean) {
        this.isButtonVisible = data;
        if (this.moduleTypeId == 1) {
            this.isButtonVisible = false;
        }
    }

    @Input("assetReferenceId")
    set _assetReferenceId(data: string) {
        this.assetReferenceId = data;
    }
    @Input("isFromAssets")
    set _isFromAssets(data: boolean) {
        this.isFromAssets = data;
    }

    @Output() refreshUserStory = new EventEmitter<string>();
    @Output() refreshForms = new EventEmitter<string>();
    @Output() customFieldsLength = new EventEmitter<number>();
    @Output() emitCustomFieldsLength = new EventEmitter<number>();
    isDelete: boolean;
    reload: string;
    assetReferenceId: string;
    customFields: CustomFormFieldModel[];
    customFieldData: CustomFormFieldModel;
    anyOperationInProgress: boolean;
    moduleTypeId: number;
    isFieldId: string;
    formSrc: any;
    referenceId: string;
    formName: string;
    referenceTypeId: string;
    isAddPermission: boolean;
    isDeletePermission: boolean;
    isEditFieldPermission: boolean;
    validationMessage: string;
    isView = true;
    isButtonVisible: boolean;
    public ngDestroyed$ = new Subject();
    isProfilePage: boolean;
    isFromAssets: boolean;

    constructor(
        public dialog: MatDialog, private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef,
        private customFieldService: CustomFieldService, private toastr: ToastrService, private routes: Router) {
        if (this.routes.url.includes("profile") && this.routes.url.split("/")[3]) {
            this.isProfilePage = true;
        }
        else {
            this.isProfilePage = false;
        }
    }

    ngOnInit() {
    }

    getCutomFields() {
        this.anyOperationInProgress = true;
        var customFormModel = new CustomFormFieldModel();
        customFormModel.moduleTypeId = this.moduleTypeId;
        customFormModel.referenceTypeId = this.referenceTypeId;
        customFormModel.referenceId = this.referenceId;
        if (this.referenceTypeId) {
            this.customFieldService.searchCustomFields(customFormModel).subscribe((result) => {
                if (result.success == true) {
                    this.customFields = result.data;
                    if(this.isDelete) {
                      this.isDelete = false;
                      this.emitCustomFieldsLength.emit(this.customFields.length);
                    } else {
                        this.customFieldsLength.emit(this.customFields.length)
                    }
                } else {
                    this.validationMessage = result.apiResponseMessages[0];
                    this.toastr.success(this.validationMessage);
                }
                this.anyOperationInProgress = false;
                this.cdRef.detectChanges();
            });
        } else {
            this.customFields = [];
            this.anyOperationInProgress = false;
        }
    }

    openCustomForm(isButtonVisible: boolean) {
        const formsDialog = this.dialog.open(CustomFormsComponent, {
            height: '62%',
            width: '60%',
            hasBackdrop: true,
            direction: "ltr",
            data: {
                moduleTypeId: this.moduleTypeId, referenceId: this.referenceId, referenceTypeId: this.referenceTypeId,
                customFieldComponent: this.customFieldData, isButtonVisible: isButtonVisible
            },
            disableClose: true,
            panelClass: 'custom-modal-box'
        });
        formsDialog.componentInstance.closeMatDialog.subscribe((result) => {
            this.refreshForms.emit('true');
            this.getCutomFields();
            this.dialog.closeAll();
        });

    }

    viewFormComponent(customField) {
        this.isView = true;
        this.isFieldId = customField.customFieldId;
    }

    checkViewPermission(fieId) {
        if (this.isFieldId == fieId) {
            this.closeViewFormPopUp();
        }
    }

    closeViewFormPopUp() {
        this.isView = false;
    }

    editFormComponent(customField) {
        this.customFieldData = customField;
        this.openCustomForm(true);
    }

    deleteCustomField(customField) {
        this.anyOperationInProgress = true;
        this.isDelete = true;
        var customFieldModel = new CustomFormFieldModel();
        customFieldModel.moduleTypeId = customField.moduleTypeId;
        customFieldModel.referenceId = customField.referenceId;
        customFieldModel.referenceTypeId = customField.referenceTypeId;
        customFieldModel.formName = customField.formName;
        customFieldModel.timeStamp = customField.timeStamp;
        customFieldModel.customFieldId = customField.customFieldId;
        customFieldModel.formJson = customField.formJson;
        customFieldModel.formKeys = customField.formKeys;
        customFieldModel.IsArchived = true;
        this.customFieldService.upsertcustomField(customFieldModel).subscribe((result) => {
            if (result.success === true) {
                this.refreshForms.emit('true');
                this.getCutomFields();
            } else {
                this.validationMessage = result.apiResponseMessages[0];
                this.toastr.success(this.validationMessage);
            }
            this.anyOperationInProgress = false;
        });
    }

    refreshCustomApp(event) {
        this.refreshUserStory.emit('');
    }

    refreshFormsList() {
        this.assetReferenceId = null;
        this.getCutomFields();
    }
}
