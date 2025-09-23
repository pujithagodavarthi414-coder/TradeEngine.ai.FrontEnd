import { Component, OnInit, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef, ViewChildren } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators, ValidatorFn, FormBuilder, FormArray } from '@angular/forms';
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WorkflowService } from "../services/workflow.service";
import { WorkflowModel } from "../models/workflow-model";



@Component({
    selector: "app-custom-functions",
    templateUrl: "./add-customfunctions.component.html"
})
export class addCustomFunctionsComponent extends CustomAppBaseComponent {

    fieldForm: FormGroup;
    form: any;
    formFieldsDropDown: any[];
    formname:string;

    constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<addCustomFunctionsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService,) {
        super();
        this.form = data;
        this.formname = data.name;
        }
    ngOnInit(): void {
        this.clearForm();
        this.getAllFields();
    }

    getAllFields() {
        let workflowModel = new WorkflowModel();
        workflowModel.id = this.form.formId;
        console.log(workflowModel);
        this.workflowService
            .getAllFormFields(workflowModel)
            .subscribe((responseData: any) => {
                this.formFieldsDropDown = responseData.data;
            });

    }

    clearForm() {
        this.fieldForm = new FormGroup({
            formtypeName: new FormControl(null),
            fieldUpdateName: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            fieldName: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            fieldtobeUpdated: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }



    upsertFieldUpdate() { }

    cancelFiledUpdate() { }

    onNoClick(): void {
        this.AppDialog.close();
    }

}