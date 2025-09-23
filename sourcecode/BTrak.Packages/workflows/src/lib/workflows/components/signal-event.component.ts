import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivityModel } from "../models/activityModel";
import { MessageEventType, SignalEventType } from "../models/enum";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { ActivityService } from "../services/activity.service";
import { WorkflowService } from "../services/workflow.service";

@Component({
    selector: "signal-event-task",
    templateUrl: "./signal-event.component.html"
})
export class SignalEventComponent extends CustomAppBaseComponent {
    signalEventForm: FormGroup;
    form: any;
    formname: string;
    inputparamSteps: FormArray;
    inputparamsStepsShow: boolean = false;
    isEdit: any;
    actions: any[] = [];
    SignalEventType = [
        { id: '0', name: 'Signal Start Event' },
        { id: '1', name: 'Signal Intermediate Catching Event' },
        { id: '2', name: 'Signal Intermediate Throwing Event' },
        { id: '3', name: 'Signal Interrupted Boundary Event' },
        { id: '4', name: 'Signal Non Interrupted Boundary Event' },
        { id: '5', name: 'Signal End Event' },
    ]
    topics: any //= [{ id: 1, name: 'mailtemplate-activity' }, { id: 2, name: 'notification-activity' }, { id: 3, name: 'status-update' }];
    constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<SignalEventComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService, private formBuilder: FormBuilder,
        private activityService: ActivityService) {
        super();
        this.form = data;
        this.formname = data.name;
        this.isEdit = data.isEdit;
        this.actions = data.items;
    }
    ngOnInit(): void {
        this.clearForm();
        this.getActivities();
        this.onChangeSignalEventType();
        this.inputparamsStepsShow = true;
        if (this.isEdit) {
            this.signalEventForm.patchValue(this.form.formValue);
            this.signalEventForm.get('signalName').setValidators(this.form.formValue.signalName);
            // if(this.form.formValue.topic) {
            //     this.addTopic(this.form.formValue.topic);
            // }
            if(this.form.formValue.taskName) {
                this.addTaskName(this.form.formValue.taskName);
            }
            if (this.form.formValue.inputparamSteps && this.form.formValue.inputparamSteps.length > 0) {
                this.form.formValue.inputparamSteps.forEach((value, index) => {
                    this.inputparamSteps = this.signalEventForm.get('inputparamSteps') as FormArray;
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
        this.signalEventForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            signalName: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            signalEventType: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            inputparamSteps: this.formBuilder.array([])
        })
    }
    upsertSignalEvent() {
        this.AppDialog.close({ ...this.signalEventForm.value, formId: this.form.formId });
    }
    cancelSignalEvent() { this.AppDialog.close(); }
    addItem(index): void {
        this.inputparamSteps = this.signalEventForm.get('inputparamSteps') as FormArray;
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
        return (this.signalEventForm.get('inputparamSteps') as FormArray).controls;
    }
    getControlsLength() {
        this.addItem((this.signalEventForm.get('inputparamSteps') as FormArray).length - 1);
    }
    validateStepsLength() {
        let length = (this.signalEventForm.get('inputparamSteps') as FormArray).length;
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
    onChangeSignalEventType() {
        this.signalEventForm.get('signalEventType').valueChanges.subscribe((value: any) => {
            // if (value == SignalEventType.SignalIntermediateThrowingEvent || value == SignalEventType.SignalEndEvent) {
            //     this.signalEventForm.addControl('topic', new FormControl('', Validators.required));
            // } else {
            //     this.signalEventForm.removeControl('topic');
            // }
           // this.signalEventForm.get('topic')?.updateValueAndValidity();
            if (value == SignalEventType.SignalInterruptedBoundaryEvent || value == SignalEventType.SignalNonInterruptedBoundaryEvent) {
                this.signalEventForm.addControl('taskName', new FormControl('', Validators.required));
            } else {
                this.signalEventForm.removeControl('taskName');
            }
            this.signalEventForm.get('taskName')?.updateValueAndValidity();
        });
    }
    // addTopic(topic) {
    //     this.signalEventForm.addControl('topic', new FormControl(topic, Validators.required));
    // }
    addTaskName(taskName) {
        this.signalEventForm.addControl('taskName', new FormControl(taskName, Validators.required)); 
    }
    // onTopicChange(event) {
    //     var steps = this.signalEventForm.get('inputparamSteps') as FormArray;
    //     steps.clear();
    //     var topic = this.topics.find(x => x.activityName == event.value);
    //     var inputs = [];
    //     if(topic.inputs.trim()) {
    //         inputs = topic.inputs.split(',');
    //     }
    //     if (inputs && inputs.length > 0) {
    //         inputs.forEach((value, index) => {
    //             if(value.trim()) {
    //                 steps.insert(index, this.bindInputItem(value));
    //             }
    //         });
    //       }
    // }
    bindInputItem(data): FormGroup {
        return this.formBuilder.group({
            inputName: new FormControl(data, Validators.compose([Validators.required])),
            inputValue: new FormControl('', Validators.compose([]))
        });
    }
}