import { Component, OnInit, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef, ViewChildren } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators, ValidatorFn, FormBuilder, FormArray } from '@angular/forms';
import { WorkflowService } from "../../services/workflow.service";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { ActivityService } from "../../services/activity.service";
import { ActivityModel } from "../../models/activityModel";



@Component({
    selector: "app-send-task",
    templateUrl: "./send-task.component.html"
})
export class SendTaskComponent  extends CustomAppBaseComponent {
    sendTaskForm: FormGroup;
    form: any;
    formname: string;
    inputparamSteps: FormArray;
    inputparamsStepsShow: boolean = false;
    isEdit: any;
    topics: any //= [{ id: 1, name: 'mailtemplate-activity' }, { id: 2, name: 'notification-activity' }, { id: 3, name: 'status-update' }];
    constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<SendTaskComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService, private formBuilder: FormBuilder,
        private activityService: ActivityService) {
        super();
        this.form = data;
        this.formname = data.name;
        this.isEdit = data.isEdit;
    }
    ngOnInit(): void {
        this.clearForm();
        this.getActivities();
        this.inputparamsStepsShow = true;
        if (this.isEdit) {
            this.sendTaskForm.patchValue(this.form.formValue);
            //this.sendTaskForm.get("name").setValue(this.form.formValue.name);
            //this.sendTaskForm.get("topic").setValue(this.form.formValue.topic);
            if (this.form.formValue.inputparamSteps && this.form.formValue.inputparamSteps.length > 0) {
                this.form.formValue.inputparamSteps.forEach((value, index) => {
                    this.inputparamSteps = this.sendTaskForm.get('inputparamSteps') as FormArray;
                    this.inputparamSteps.insert(index, this.bindcriteriaItem(value));
                });
            }
        }
    }
    getActivities() {
        let act = new ActivityModel();
        act.isArchive = false;
        this.activityService.getActivity(act).subscribe((result: any) => {
          if (result.success) {
            this.topics = result.data;
          }
          else {
            this.topics = [];
          }
        })
    }
    clearForm() {
        this.sendTaskForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            topic: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            inputparamSteps: this.formBuilder.array([])
        })
    }
    upsertSendTask() {
        this.AppDialog.close({ ...this.sendTaskForm.value, formId: this.form.formId });
    }
    cancelSendTask() { this.AppDialog.close(); }
    addItem(index): void {
        // if (this.addTestCaseForm.value.title == '' || this.addTestCaseForm.value.title == null) {
        //    // this.toastr.warning(this.translateService.instant(ConstantVariables.PleaseFillTestCaseTitle));
        // }
        // else if (this.addTestCaseForm.value.title.length > 500) {
        //     //this.toastr.warning(this.translateService.instant(ConstantVariables.TestCaseTitleShouldNotExceed500Characters));
        // }
        // else if (!this.disabledTestCase) {
        //     this.testCaseSteps = this.addTestCaseForm.get('testCaseSteps') as FormArray;
        //     this.testCaseSteps.insert(index + 1, this.createItem());
        //     this.addNewTestCaseStep();
        // }

        this.inputparamSteps = this.sendTaskForm.get('inputparamSteps') as FormArray;
        this.inputparamSteps.insert(index + 1, this.createcriteriaItem());
        this.addNewTestCaseStep();
    }
    addNewTestCaseStep() { }
    createcriteriaItem(): FormGroup {
        return this.formBuilder.group({
            inputName: new FormControl('', Validators.compose([Validators.required])),
            inputValue: new FormControl('', Validators.compose([]))
        });
    }
    bindcriteriaItem(data): FormGroup {
        return this.formBuilder.group({
            inputName: new FormControl(data.inputName, Validators.compose([Validators.required])),
            inputValue: new FormControl(data.inputValue, Validators.compose([]))
        });
    }
    getCriteriaControls() {
        return (this.sendTaskForm.get('inputparamSteps') as FormArray).controls;
    }
    getControlsLength() {
        this.addItem((this.sendTaskForm.get('inputparamSteps') as FormArray).length - 1);
    }
    validateStepsLength() {
        let length = (this.sendTaskForm.get('inputparamSteps') as FormArray).length;
        if (length == 0)
            return true;
        else
            return false;
    }
    removeItem(index) {
        this.inputparamSteps.removeAt(index);
        this.addNewTestCaseStep();
    }
    onNoClick(): void {
        this.AppDialog.close();
    }
    onTopicChange(event) {
        var steps = this.sendTaskForm.get('inputparamSteps') as FormArray;
        steps.clear();
        var topic = this.topics.find(x => x.activityName == event.value);
        var inputs = [];
        if(topic.inputs.trim()) {
            inputs = topic.inputs.split(',');
        }
        if (inputs && inputs.length > 0) {
            inputs.forEach((value, index) => {
                if(value.trim()) {
                    steps.insert(index, this.bindInputItem(value));
                }
            });
          }
    }
    bindInputItem(data): FormGroup {
        return this.formBuilder.group({
            inputName: new FormControl(data, Validators.compose([Validators.required])),
            inputValue: new FormControl('', Validators.compose([]))
        });
    }
}