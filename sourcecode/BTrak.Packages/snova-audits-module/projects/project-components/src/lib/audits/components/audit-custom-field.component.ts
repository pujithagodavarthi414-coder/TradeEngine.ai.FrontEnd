import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { CustomFormFieldModel } from '../dependencies/models/custom-fileds-model';
import { CustomFieldMode } from '../models/custom-field.model';
import { AuditService } from '../services/audits.service';


@Component({
    selector: 'audit-custom-field',
    templateUrl: 'audit-custom-field.component.html',

})

export class AuditCustomFieldComponent extends AppFeatureBaseComponent implements OnInit {

    @ViewChild("customFormsComponent") customFormsComponent: TemplateRef<any>;

    @Input("selectedAudit")
    set _selectedAudit(data: any) {
        if (data) {
            this.selectedAudit = data;
            this.referenceTypeId = this.selectedAudit.auditId;
            ;
        }
    }

    @Input("selectedConduct")
    set _selectedConduct(data: any) {
        if (data) {
            this.selectedConduct = data;
            this.referenceTypeId = this.selectedConduct.conductId;
            this.isComplete = this.selectedConduct.isCompleted;
            this.addButtonVisible = false;
        }
    }

    @Input("question")
    set _question(data: any) {
        if (data) {
            this.questionId = data.questionId;
            this.isFormType = true;
            //this.questionId = null;
        }
    }

    @Input("fileType")
    set _fileType(data: any) {
        if (data) {
            if (data == "audit") {
                this.isFromReports = false;
                this.addButtonVisible = true;
                this.isDeletePermission = true;
                this.isAddPermission = true;
                this.isEditFieldPermission = false;
            }
            else if (data == "conduct") {
                this.isFromReports = false;
                this.addButtonVisible = false;
                this.isDeletePermission = false;
                this.isAddPermission = false;
                this.isEditFieldPermission = this.isComplete == true ? false : true;
            }
            else {
                this.isFromReports = true;
                this.addButtonVisible = false;
                this.isDeletePermission = false;
                this.isAddPermission = false;
                this.isEditFieldPermission = false;
            }
        }
    }

    isComplete: any;
    validationMessage: string;
    model: any;
    moduleTypeId = 90;
    questionId: any;
    isFormType: boolean = false;
    isreload: string;
    referenceTypeId: any;
    customFormComponent: CustomFormFieldModel;
    selectedAudit: any;
    formsData = [];
    noformData: any;
    formName: string;
    selectedForm: any;
    form: any;
    temp = [];
    isDeletePermission: boolean;
    isAddPermission: boolean;
    isEditFieldPermission: boolean;
    selectedConduct: any;
    addButtonVisible: boolean;
    isFromReports: boolean = false;
    anyOperationInProgress: any;

    constructor(private toastr: ToastrService, public dialog: MatDialog, private cdRef: ChangeDetectorRef, private auditService: AuditService,) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.searchCustomFieldForms();
    }

    openCustomForm() {
        let dialogId = "app-custom-form-component";
        const formsDialog = this.dialog.open(this.customFormsComponent, {
            height: "70%",
            width: "60%",
            hasBackdrop: true,
            direction: "ltr",
            id: dialogId,
            data: {
                moduleTypeId: 90, referenceId: this.questionId, referenceTypeId: this.selectedAudit.auditId,
                customFieldComponent: this.customFormComponent, isButtonVisible: true, formPhysicalId: dialogId, dialogId: dialogId
            },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
        formsDialog.afterClosed().subscribe(() => {
            this.searchCustomFieldForms();
        });
    }

    closeDialog(result) {
        result.dialog.close();
        if (!result.emitString) {
            this.isFormType = true;
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
            this.isreload = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
            this.cdRef.detectChanges();
        }
    }

    submitFormComponent(result) {
        result.dialog.close();
        if (result.emitData) {
            this.customFormComponent = result.emitData;
            this.cdRef.detectChanges();
        }
    }

    editFormComponent() {
        this.openCustomForm();
    }

    searchCustomFieldForms() {
        this.anyOperationInProgress = true;
        let customFieldHistoryModel = new CustomFieldMode();
        customFieldHistoryModel.referenceTypeId = this.referenceTypeId;
        if (this.isFromReports) {
            customFieldHistoryModel.referenceId = this.questionId;
            customFieldHistoryModel.moduleTypeId = 90;
        }
        this.auditService.searchCustomFieldForms(customFieldHistoryModel).subscribe((result: any) => {
            if (result.success) {
                this.formsData = result.data;
                this.temp = this.formsData;
                this.noformData = (this.formsData && this.formsData.length > 0) ? true : false;
                this.anyOperationInProgress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.formsData = [];
                this.temp = [];
                this.anyOperationInProgress = false;
                this.cdRef.detectChanges();
            }
        })
    }

    onformSelected(value) {
        if (this.formName) {
            let model = new CustomFormFieldModel();
            model = Object.assign({}, value);
            model.formName = this.formName;
            model.customFieldId = null;
            model.formJson = value.formJson;
            model.formKeys = value.formKeys
            model.moduleTypeId = 90;
            model.referenceTypeId = value.referenceTypeId;
            model.referenceId = this.questionId;
            this.auditService.updatecustomField(model).subscribe((result: any) => {
                if (result.success == true) {
                    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
                    this.isreload = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
                    this.cdRef.detectChanges();
                    this.selectedForm = null;
                    this.formName = null;
                    this.searchCustomFieldForms();
                    this.cdRef.markForCheck();
                }
                else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                    this.selectedForm = null;
                    this.formName = null;
                    this.cdRef.markForCheck();
                }
                // this.formsData = this.temp;
                this.cdRef.detectChanges();
            });
        }
        else {
            this.toastr.error("Custom field name should not be null");
            this.selectedForm = null;
            this.formName = null;
            this.cdRef.detectChanges();
        }
    }
}