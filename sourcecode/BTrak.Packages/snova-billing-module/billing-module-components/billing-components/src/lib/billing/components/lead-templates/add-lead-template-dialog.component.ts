import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { LeadTemplate } from "../../models/lead-template.model";
import { BillingManagementService } from "../../services/billing-management.service";

@Component({
    selector: "add-lead-template-dialog",
    templateUrl: "./add-lead-template-dialog.component.html"
})

export class AddLeadTemplateDialog implements OnInit {
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        if (this.matData) {
            this.currentDialogId = this.matData.dialogId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            console.log(this.matData.formJson)
            this.formJson = this.matData.formJson ? JSON.parse(this.matData.formJson) : Object.assign({}, this.basicForm);
            this.formName = this.matData.formName;
            this.timeStamp = this.matData.timeStamp;
            this.templateId = this.matData.templateId;
            this.isPreview = this.matData.isPreview;
            this.initializeForm();
        }
    }
    @Output() closeMatDialog = new EventEmitter<boolean>();
    formJson: any;
    formName: string;
    templateId: string;
    timeStamp: any;
    isAddInProgress: boolean;
    isPreview: boolean;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    id: any;
    public basicForm = { components: [] };
    templateForm = new FormGroup({
        formName: new FormControl("", [
            Validators.required,
            Validators.maxLength(50)
        ])
    });
    creditsToBeUsed: any = {
        "label": "Credits to be used",
        "mask": false,
        "tableView": true,
        "alwaysEnabled": false,
        "type": "number",
        "input": true,
        "key": "creditsToBeUsed",
        "validate": {
            "customMessage": "",
            "json": "",
            "required": false,
            "custom": "",
            "customPrivate": false,
            "min": "",
            "max": "",
            "step": "any",
            "integer": ""
        },
        "conditional": {
            "show": "",
            "when": "",
            "json": "",
            "eq": ""
        },
        "reorder": false,
        "delimiter": false,
        "requireDecimal": false,
        "encrypted": false,
        "properties": {},
        "customConditional": "",
        "logic": [],
        "attributes": {},
        "placeholder": "",
        "prefix": "",
        "customClass": "",
        "suffix": "",
        "multiple": false,
        "defaultValue": null,
        "protected": false,
        "unique": false,
        "persistent": true,
        "hidden": false,
        "clearOnHide": true,
        "dataGridLabel": false,
        "labelPosition": "top",
        "labelWidth": 30,
        "labelMargin": 3,
        "description": "",
        "errorLabel": "",
        "tooltip": "",
        "hideLabel": false,
        "tabindex": "",
        "disabled": false,
        "autofocus": false,
        "dbIndex": false,
        "customDefaultValue": "",
        "calculateValue": "",
        "allowCalculateOverride": false,
        "widget": null,
        "refreshOn": "",
        "clearOnRefresh": false,
        "validateOn": "change",
        "id": "e9cbqws"
    };


    constructor(public leadTemplateDialog: MatDialogRef<AddLeadTemplateDialog>, public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any, private billingService: BillingManagementService,
        private toastr: ToastrService) {
        if (data.dialogId) {
            this.currentDialogId = this.data.dialogId;
            this.id = setTimeout(() => {
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }, 1200)
            this.formJson = this.matData.formJson ? JSON.parse(this.matData.formJson) : Object.assign({}, this.basicForm);
            this.formName = this.matData.formName;
            this.timeStamp = this.matData.timeStamp;
            this.templateId = this.matData.templateId;
            this.isPreview = this.matData.isPreview;
            this.initializeForm();
        }
    }

    ngOnInit() {

    }

    upsertLeadTemplate() {
        this.isAddInProgress = true;
        var addTemplateModel = new LeadTemplate();
        addTemplateModel = this.templateForm.value;
        let isInsert = true;
        if (this.formJson && this.formJson.components) {
            this.formJson.components.forEach(element => {
                if (element.key == 'creditsToBeUsed') {
                    isInsert = false;
                }
            });
            if (isInsert) {
                this.formJson.components.splice(0, 0, this.creditsToBeUsed);
            }
        }
        addTemplateModel.formJson = JSON.stringify(this.formJson);
        addTemplateModel.timeStamp = this.timeStamp;
        addTemplateModel.templateId = this.templateId;
        this.billingService.upsertLeadTemplate(addTemplateModel).subscribe((response: any) => {
            this.isAddInProgress = false;
            if (response.success) {
                this.closeMatDialog.emit(true);
                if (this.currentDialog) {
                    this.currentDialog.close();
                    this.currentDialog.close({ success: true });
                }
                else if (this.leadTemplateDialog) this.leadTemplateDialog.close();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message)
            }
        })
    }

    initializeForm() {
        this.templateForm = new FormGroup({
            formName: new FormControl(this.formName, [
                Validators.required,
                Validators.maxLength(50)
            ]),
        });
    }

    onChange(event) {
        if (event.form != undefined) { this.formJson = event.form };
    }

    onNoClick(): void {
        if (this.currentDialog) {
            this.currentDialog.close();
            this.currentDialog.close({ success: true });
        }
        else if (this.leadTemplateDialog) this.leadTemplateDialog.close();
    }

}