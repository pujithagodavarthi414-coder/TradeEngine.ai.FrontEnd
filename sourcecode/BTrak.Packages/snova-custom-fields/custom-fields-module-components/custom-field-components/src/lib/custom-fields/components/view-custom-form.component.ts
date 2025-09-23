import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { CustomFormFieldModel } from '../models/custom-fileds-model';
import { CustomFieldService } from '../servicces/custom-field.service';

@Component({
    selector: "app-custom-view-form-component",
    templateUrl: "./view-custom-form.component.html"
})

export class ViewCustomFormComponent implements OnInit {
    @Input("customField")
    set _customField(data: CustomFormFieldModel) {
        this.customField = data;
        this.isEdit = false;
        if (this.customField.formJson) {
            let formObject = JSON.parse(this.customField.formJson);
            this.formatFormJson(formObject);
            this.cdRef.detectChanges();
        }
        if (this.customField.formDataJson) {
            this.formData.data = JSON.parse(this.customField.formDataJson);
            this.cdRef.detectChanges();
        } else {
            this.formData.data = {};
            this.cdRef.detectChanges();
        }
        if (document.querySelector(".formio-loader-wrapper") as HTMLElement) {
            (document.querySelector(".formio-loader-wrapper") as HTMLElement).parentElement.parentElement.style.display = "none";
        }
    }

    @Input("referenceId")
    set _referenceId(data: string) {
        this.referenceId = data;
        // this.formSrc = JSON.parse(this.customField.formJson);
    }

    @Input("isMultipleInsert")
    set _isMultipleInsert(data: boolean) {
        this.isMultipleInsert = data;
        if (this.isMultipleInsert) {
            this.formData.data = {};
        }
        this.isEdit = this.isMultipleInsert;
        this.cdRef.detectChanges();
    }

    @Input("isEditFieldPermission")
    set _isEditFieldPermission(data: boolean) {
        this.isEditFieldPermission = data;
    }
    @Input("assetReferenceId")
    set _assetReferenceId(data: string) {
        this.assetReferenceId = data;
        if (this.assetReferenceId) {
            this.referenceId = this.assetReferenceId;
            this.updateCustomFieldsData();
        } else if (!this.referenceId) {
            this.formData.data = {};
            this.cdRef.detectChanges();
        }
    }

    @Input("isFromAssets")
    set _isFromAssets(data: boolean) {
        this.isFromAssets = data;
    }

    @ViewChild("customFormio") formio;
    @Output() closeViewPopup = new EventEmitter<string>();
    @Output() viewCustomApp = new EventEmitter<string>();
    @Output() customFormsUpdate = new EventEmitter<string>();
    anyOperationInProgress: boolean;
    customField: CustomFormFieldModel;
    referenceId: string;
    assetReferenceId: string;
    submittedData: any;
    formObject: any;
    formName: string;
    isEditFieldPermission: boolean;
    isEdit = false;
    isFromAssets: boolean;
    isMultipleInsert = false;
    hideComponents: any[] = [];
    formData = { data: {} };
    submitTrigger: any;
    validationMessage: string;
    public ngDestroyed$ = new Subject();

    constructor(private cdRef: ChangeDetectorRef, private customFieldService: CustomFieldService, private toastr: ToastrService) { }
    ngOnInit() {
        this.submitTrigger = new EventEmitter();
    }

    closePopup() {
        this.closeViewPopup.emit("");
    }

    editCustomField() {
        this.isEdit = true;
    }

    formatFormJson(formObject) {
        let updatedNewComponents = [];
        if (formObject && formObject.length > 0) {
            formObject.forEach((comp) => {
                let values = [];
                let keys = Object.keys(comp);
                keys.forEach((key) => {
                    values.push(comp[key]);
                    let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
                    let idx = keys.indexOf(key);
                    if (idx > -1) {
                        keys[idx] = updatedKeyName;
                    }
                })
                var updatedModel = {};
                for (let i = 0; i < keys.length; i++) {
                    updatedModel[keys[i]] = values[i];
                }
                updatedNewComponents.push(updatedModel);
            })
        }
        this.formObject = {};
        this.formObject.components = updatedNewComponents;
    }

    cancelEditForm() {
        let formObject = JSON.parse(this.customField.formJson);
        this.formatFormJson(formObject);
        if (this.customField.formDataJson) {
            this.formData.data = JSON.parse(this.customField.formDataJson);
        } else {
            this.formData.data = JSON.parse(this.customField.formDataJson);
        }
        this.isEdit = false;
        this.cdRef.detectChanges();
    }

    resetEditForm() {
        let formObject = JSON.parse(this.customField.formJson);
        this.formatFormJson(formObject);
        if (this.customField.formDataJson) {
            this.formData.data = JSON.parse(this.customField.formDataJson);
        } else {
            this.formData.data = {};
        }
        this.cdRef.detectChanges();
    }

    onChange() {
        this.submittedData = this.formio.formio.data
    }

    onSubmit() {
        this.updateCustomFields();
    }

    updateCustomFields() {
        if (this.referenceId) {
            this.updateCustomFieldsData();
        } else {
            this.isEdit = !this.isEdit;
        }

    }

    updateCustomFieldsData() {
        console.log(this.submittedData);
        const customField = new CustomFormFieldModel();
        customField.moduleTypeId = this.customField.moduleTypeId;
        customField.referenceId = this.referenceId;
        customField.referenceTypeId = this.customField.referenceTypeId;
        customField.timeStamp = this.customField.customFieldTimeStamp;
        customField.customFieldId = this.customField.customFieldId;
        if (this.isMultipleInsert === true || this.assetReferenceId) {
            customField.customDataFormFieldId = null;
        } else {
            customField.customDataFormFieldId = this.customField.customDataFormFieldId;
        }
        customField.formDataJson = JSON.stringify(this.submittedData);
        customField.formName = this.customField.formName;
        this.customFieldService.updatecustomField(customField).subscribe((result) => {
            if (result.success === true) {
                this.viewCustomApp.emit('');
                this.customField.customDataFormFieldId = result.data;
                if (this.assetReferenceId) {
                    this.assetReferenceId = null;
                    this.customFormsUpdate.emit('');

                } else {
                    this.customField.formDataJson = JSON.stringify(this.formData.data);
                }
                this.isEdit = false;
                this.cdRef.detectChanges();
            } else {
                this.validationMessage = result.apiResponseMessages[0];
                this.toastr.success(this.validationMessage);
            }
            this.anyOperationInProgress = false;
        });
        if (this.isMultipleInsert === true) {
            this.closePopup();
        }
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }


}