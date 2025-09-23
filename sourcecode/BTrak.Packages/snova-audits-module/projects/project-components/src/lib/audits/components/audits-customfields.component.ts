import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { CustomFormFieldModel } from '../dependencies/models/custom-fileds-model';
import { CustomFieldMode } from '../models/custom-field.model';
import { AuditService } from '../services/audits.service';


@Component({
    selector: 'audits-customfields',
    templateUrl: 'audits-customfields.component.html',

})

export class AuditsCustomFieldsComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChild("customFormsComponent") customFormsComponent: TemplateRef<any>;

    @Input("selectedAudit")
    set _selectedAudit(data: any) {
        if (data) {
            this.selectedAudit = data;
            this.referenceId = this.selectedAudit.auditId;
            this.referenceTypeId = this.selectedAudit.projectId;
            this.isFormType = true;
        }
    }

    @Input("selectedConduct")
    set _selectedConduct(data: any) {
        if (data) {
            this.selectedConduct = data;
            this.referenceId = this.selectedConduct.conductId;
            this.referenceTypeId = this.selectedConduct.projectId;
            this.isComplete = this.selectedConduct.isCompleted;
            this.addButtonVisible = false;
            if (this.selectedConduct.isConductSubmitted == null || this.selectedConduct.isConductSubmitted == false)
                this.isConductSubmitted = false;
            else
                this.isConductSubmitted = true;
            if (this.selectedConduct.isConductEditable == null || this.selectedConduct.isConductEditable == true)
                this.isConductEditable = true;
            else
                this.isConductEditable = false;
            // this.isEditFieldPermission = this.isComplete == true ? false : true;
            if (this.referenceTypeId) {
                this.isFormType = true;
                this.isEditFieldPermission = (!this.isConductEditable || this.isConductSubmitted) ? false : true;
            }
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

    @Input("projectId")
    set _projectId(data: string) {
        if (data) {
            this.referenceTypeId = data;
            this.isFormType = true;
        }
    }

    formsData = [];
    temp = [];

    isComplete: any;
    validationMessage: string;
    model: any;
    moduleTypeId = 90;
    referenceId: any;
    isFormType: boolean = false;
    isreload: string;
    referenceTypeId: any;
    customFormComponent: CustomFormFieldModel;
    selectedAudit: any;
    noformData: any;
    formName: string;
    selectedForm: any;
    form: any;
    isDeletePermission: boolean;
    isAddPermission: boolean;
    isEditFieldPermission: boolean;
    selectedConduct: any;
    addButtonVisible: boolean;
    isConductEditable: boolean = true;
    isFromReports: boolean = false;
    isAuditArchived: boolean = false;
    isConductSubmitted: boolean = false;
    anyOperationInProgress: any;

    constructor(private toastr: ToastrService, public dialog: MatDialog, private cdRef: ChangeDetectorRef, private auditService: AuditService,) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.searchCustomFieldForms();
    }

    openCustomForm() {
        let dialogId = "app-audit-custom-form-component";
        const formsDialog = this.dialog.open(this.customFormsComponent, {
            height: "70%",
            width: "60%",
            hasBackdrop: true,
            direction: "ltr",
            id: dialogId,
            data: {
                formPhysicalId: dialogId, dialogId: dialogId, moduleTypeId: 90, referenceId: this.referenceId, referenceTypeId: this.referenceTypeId,
                customFieldComponent: this.customFormComponent, isButtonVisible: true
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
        customFieldHistoryModel.referenceId = this.referenceId;
        customFieldHistoryModel.moduleTypeId = 90;
        this.auditService.searchCustomFieldForms(customFieldHistoryModel).subscribe((result: any) => {
            if (result.success) {
                this.formsData = result.data;
                this.temp = result.data;
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
            model.referenceId = this.referenceId;
            this.auditService.updatecustomField(model).subscribe((result: any) => {
                if (result.success) {
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
                    // this.formsData = [];
                    // this.formsData.push(...this.temp);
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