import { Component, OnInit, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef, ViewChildren } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators, ValidatorFn, FormBuilder, FormArray } from '@angular/forms';
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DatePipe } from "@angular/common";
import { WorkflowService } from "../services/workflow.service";
import { WorkflowModel } from "../models/workflow-model";
import { User } from "../models/timezone-model";
import { Guid } from "guid-typescript";



@Component({
    selector: "app-add-checklist",
    templateUrl: "./add-checklist.component.html"
})

export class addChecklistComponent extends CustomAppBaseComponent {

    fieldForm: FormGroup;
    form: any;
    formFieldsDropDown: any[];
    formname: string;
    usersList: User[];
    dueDate: any;
    isEdit: any;
    checkListId: string;
    prioritylist = [
        { id: '1', name: 'High' },
        { id: '2', name: 'Low' },
        { id: '3', name: 'Moderate' }
    ]
    selectedpriority = this.prioritylist[1];


    conditionlist = [
        { id: '1', name: 'After' }
    ]
    selectedconditionlisty = this.conditionlist[1];

    day = [
        { id: '1', name: 'Day(s)' },
        { id: '2', name: 'Week(s)' },
        { id: '3', name: 'Month(s)' },
        { id: '3', name: 'Year(s)' }
    ]
    selectedday = this.prioritylist[1];

    rulelist = [
        { id: '1', name: 'Added Time' },
        { id: '2', name: 'Date of Exit' },
        { id: '3', name: 'Date of Joining' },
        { id: '3', name: 'Date of Birth' }
    ]
    selectedrulelist = this.rulelist[1];

    constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<addChecklistComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService,
        private datePipe: DatePipe) {
        super();
        this.form = data;
        this.formname = data.name;
        this.isEdit = data.isEdit;
        if (this.isEdit == true) {
            this.checkListId = this.form.formValue.id;
        } else {
            this.checkListId = Guid.create().toString();
        }
    }

    ngOnInit(): void {
        this.clearForm();
        if (this.isEdit) {
            this.fieldForm.patchValue(this.form.formValue);
        }
        this.getAllUsers();
        //this.getAllFields();
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

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.dueDate = event.target.value;
    }

    getAllUsers() {
        var searchModel: any = {};
        searchModel.isArchived = false
        this.workflowService.GetAllUsers(searchModel).subscribe((x: any) => {
            if (x.success) {
                this.usersList = x.data;
            }
        })
    }

    clearForm() {
        this.fieldForm = new FormGroup({
            formtypeName: new FormControl(null),
            name: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
            ,
            description: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            taskOwner: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            displayName: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            taskName: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            dueDate: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            // number: new FormControl(null,
            //     Validators.compose([
            //         Validators.required
            //     ])
            // ),
            // days: new FormControl(null,
            //     Validators.compose([
            //         Validators.required
            //     ])
            // ),
            // daysCondition: new FormControl(null,
            //     Validators.compose([
            //         Validators.required
            //     ])
            // ),
            // rule: new FormControl(null,
            //     Validators.compose([
            //         Validators.required
            //     ])
            // ),
            priority: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            id: new FormControl(this.checkListId,
                Validators.compose([

                ])
            ),
        })
    }

    AddTask() { }

    upsertChecklist() {
        const locale = 'en';
        const dateFormat = 'dd MMMM yyyy';
        const date: Date = this.fieldForm.value.dueDate;
        this.fieldForm.value.dueDate = this.datePipe.transform(date, dateFormat);
        this.AppDialog.close(this.fieldForm.value);
    }

    cancelChecklist() { }

    onNoClick(): void {
        this.AppDialog.close();
    }

}