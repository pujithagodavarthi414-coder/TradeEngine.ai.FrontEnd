import { Component, OnInit, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef, ViewChildren } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators, ValidatorFn, FormBuilder, FormArray } from '@angular/forms';
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WorkflowModel } from "../models/workflow-model";
import { WorkflowService } from "../services/workflow.service";
import { Guid } from "guid-typescript";



@Component({
    selector: "app-field-update",
    templateUrl: "./field-update.component.html"
})
export class fieldUpdateCreatorComponent extends CustomAppBaseComponent {

    fieldForm: FormGroup;
    formsDropdown: any[] = [];
    form: any;
    formFieldsDropDown: any[];
    formname: string;
    isEdit: any;
    id: any;
    inputParamSteps: FormArray;

    constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<fieldUpdateCreatorComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService, private formBuilder: FormBuilder) {
        super();
        this.clearForm();
        this.form = data;
        this.formname = data.name;
        this.isEdit = data.isEdit;
        this.formsDropdown = data.formsList;

        this.getAllFields();

        if (this.isEdit) {
            this.id = this.form.formValue.id;
            this.fieldForm.patchValue(this.form.formValue);
            if (this.form.formValue.inputParamSteps && this.form.formValue.inputParamSteps.length > 0) {
                this.form.formValue.inputParamSteps.forEach((value, index) => {
                    this.inputParamSteps = this.fieldForm.get('inputParamSteps') as FormArray;
                    this.inputParamSteps.insert(index, this.bindCriteriaItem(value));
                });
            } else {
                this.addItem(-1);
            }
        } else {
            this.id = Guid.create().toString();
            this.addItem(-1);
        }

    }
    ngOnInit(): void {

    }

    getAllFields() {
        let workflowModel = new WorkflowModel();
        workflowModel.id = this.form.formId;
        this.workflowService
            .getAllFormFields(workflowModel)
            .subscribe((responseData: any) => {
                this.formFieldsDropDown = responseData.data;
            });
    }

    clearForm() {
        this.fieldForm = new FormGroup({
            formtypeName: new FormControl(null),
            name: new FormControl(null, Validators.compose([
                Validators.required
            ])
            ),
            description: new FormControl(null, Validators.compose([
                Validators.required
            ])
            ),
            id: new FormControl(this.id, []
            ),
            syncForm: new FormControl(null,
                Validators.compose([])
            ),
            inputParamSteps: this.formBuilder.array([])
        })


    }

    addItem(index) {
        this.inputParamSteps = this.fieldForm.get('inputParamSteps') as FormArray;
        this.inputParamSteps.insert(index + 1, this.createCriteriaItem());
    }

    removeItem(index) {
        this.inputParamSteps.removeAt(index);
    }

    createCriteriaItem() {
        let id = Guid.create().toString();
        return this.formBuilder.group({
            fieldName: new FormControl('', Validators.compose([Validators.required])),
            fieldValue: new FormControl('', Validators.compose([])),
            id: new FormControl(id, Validators.compose([]))
        });
    }

    bindCriteriaItem(data) {
        return this.formBuilder.group({
            fieldName: new FormControl(data.fieldName, Validators.compose([Validators.required])),
            fieldValue: new FormControl(data.fieldValue, Validators.compose([])),
            id: new FormControl(data.id, Validators.compose([]))
        });
    }

    getControlsLength() {
        this.addItem((this.fieldForm.get('inputParamSteps') as FormArray).length - 1);
    }

    upsertFieldUpdate() { this.AppDialog.close({ ...this.fieldForm.value, formId: this.form.formId }); }

    cancelFiledUpdate() { this.AppDialog.close(); }

    onNoClick(): void {
        this.AppDialog.close();
    }

}