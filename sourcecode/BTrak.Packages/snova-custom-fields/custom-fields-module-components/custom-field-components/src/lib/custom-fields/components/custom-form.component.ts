import { Component, OnInit, Inject, Output, EventEmitter, ChangeDetectorRef, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as formUtils from 'formiojs/utils/formUtils.js';
import { Subject } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { CustomFormFieldModel } from '../models/custom-fileds-model';
import { CustomFieldService } from '../servicces/custom-field.service';

@Component({
    selector: "app-custom-form-component",
    templateUrl: "./custom-form.component.html"
})

export class CustomFormsComponent implements OnInit {
    @Output() closeMatDialog = new EventEmitter<any>();
    @Output() submitFormComponent = new EventEmitter<any>();
    anyOperationInProgress: boolean;
    validationMessage: string;
    customFormComponent: CustomFormFieldModel;
    formName: string;
    customFieldData: CustomFormFieldModel;
    isButtonDisabled: boolean;
    isFormEdit: boolean;
    moduleTypeId: number;
    referenceTypeId: string;
    referenceId: string;
    formObject: any;
    timeStamp: any;
    formDataJson: any;
    isButtonVisible: boolean;
    nameFormControl = new FormControl("", [
        Validators.required,
        Validators.maxLength(100)
    ]);
    public basicForm = { components: [] };

    public defaultForm = {
        components: [
            {
                input: true,
                tableView: true,
                inputType: "text",
                inputMask: "",
                label: "Text Field",
                key: "textField",
                placeholder: "",
                prefix: "",
                suffix: "",
                multiple: false,
                defaultValue: "",
                protected: false,
                unique: false,
                persistent: true,
                validate: {
                    required: false,
                    minLength: "",
                    maxLength: "",
                    pattern: "",
                    custom: "",
                    customPrivate: false
                },
                conditional: {
                    show: false,
                    when: null,
                    eq: ""
                },
                type: "textfield",
                $$hashKey: "object:249",
                autofocus: false,
                hidden: false,
                clearOnHide: true,
                spellcheck: true
            }
        ]
    };
    formButtonDisable: boolean = false;
    editCustomFieldFormId: string;
    forms = { components: [] };
    public ngDestroyed$ = new Subject();
    matData: any;
    currentDialogId: any;
    currentDialog: any;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            if (this.matData && Object.keys(this.matData).length) this.initiateData(this.matData);
            this.currentDialogId = this.matData.dialogId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }


    constructor(public dialogRef: MatDialogRef<CustomFormsComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private snackbar: MatSnackBar,
        private translateService: TranslateService,
        private customFieldService: CustomFieldService,
        private toastr: ToastrService,
        private cdRef: ChangeDetectorRef,
        public dialog: MatDialog) {

        if (data && Object.keys(data).length) this.initiateData(data);
    }

    initiateData(data) {
        this.moduleTypeId = data.moduleTypeId;
        this.referenceId = data.referenceId;
        this.referenceTypeId = data.referenceTypeId;
        this.customFieldData = data.customFieldComponent;
        this.isButtonVisible = data.isButtonVisible;
        if (!this.isButtonVisible) {
            this.forms = { components: [] };
            this.formObject = Object.assign({}, this.basicForm);
            this.isButtonDisabled = false;
        }
        if (this.customFieldData) {
            this.formName = this.customFieldData.formName;
            this.editCustomFieldFormId = this.customFieldData.customFieldId;
            this.formObject = {};
            this.formObject.Components = JSON.parse(this.customFieldData.formJson)
            this.forms = this.formObject;
            this.formDataJson = this.customFieldData.formDataJson;
            this.timeStamp = this.customFieldData.timeStamp;
            this.isFormEdit = true;
        }
        else {
            this.editCustomFieldFormId = null;
            this.formName = null;
            this.timeStamp = null;
            this.formObject = Object.assign({}, this.basicForm);
            this.isFormEdit = false;
        }
    }

    ngOnInit() {
    }

    onChange(event) {
        if (event.form != undefined) { this.formObject = event.form; }
    }
    onClose() {
        this.closeMatDialog.emit({ emitString: 'new', dialog: this.currentDialog });
        if (this.dialogRef && this.dialogRef.hasOwnProperty('close')) this.dialogRef.close();
        if (this.currentDialog) this.currentDialog.dialog();
        if (this.dialogRef) this.dialogRef.close();
    }

    

    checkIsButtonDisabled() {
        if (this.formName) {
            this.isButtonDisabled = false;
        } else {
            this.isButtonDisabled = true;
        }
    }

    emitEvent(event) {
      console.log(event);
      this.formObject = event.detail;
    }

    createCustomFields() {
        this.customFormComponent = new CustomFormFieldModel();
        this.customFormComponent.moduleTypeId = this.moduleTypeId;
        this.customFormComponent.referenceId = this.referenceId;
        this.customFormComponent.referenceTypeId = this.referenceTypeId;
        this.customFormComponent.formName = this.formName;
        this.customFormComponent.timeStamp = this.timeStamp;
        this.customFormComponent.customFieldId = this.editCustomFieldFormId;
        var formKeys = [];
        if (this.formObject) {
            formUtils.eachComponent(this.formObject.components, function (component) {
                formKeys.push({ key: component.key, label: component.label });
            }, false);
        }

        this.customFormComponent.formJson = JSON.stringify(this.formObject);
        this.customFormComponent.formKeys = JSON.stringify(formKeys);
        if (this.isButtonVisible) {
            this.anyOperationInProgress = true;
            this.customFieldService.upsertcustomField(this.customFormComponent).subscribe((result) => {
                if (result.success == true) {
                    if (this.customFormComponent.customFieldId) {
                        this.snackbar.open(this.translateService.instant('GENERICFORM.CUSTOMFIELDUPDATEDSUCCESSFULLY'), "ok", {
                            duration: 3000
                        });
                    } else {
                        this.snackbar.open(this.translateService.instant('GENERICFORM.CUSTOMFIELDADDEDSUCCESSFULLY'), "ok", {
                            duration: 3000
                        });
                    }
                    this.forms = { components: [] };
                    this.formObject = Object.assign({}, this.basicForm);
                    this.nameFormControl.reset();
                    this.isButtonDisabled = false;
                    this.closeMatDialog.emit({ emitString: '', dialog: this.currentDialog });
                    if (this.currentDialog) this.currentDialog.close();
                    if (this.dialogRef) this.dialogRef.close();
                } else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                }
                this.anyOperationInProgress = false;
                this.cdRef.detectChanges();
            })
        } else {
            this.submitFormComponent.emit({ emitData: this.customFormComponent, dialog: this.currentDialog });
            if (this.currentDialog) this.currentDialog.close();
            if (this.dialogRef && this.dialogRef.hasOwnProperty('close')) this.dialogRef.close();
        }
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }

}