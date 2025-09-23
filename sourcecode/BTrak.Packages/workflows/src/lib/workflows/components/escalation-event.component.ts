import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivityModel } from "../models/activityModel";
import { EscalationEventType, MessageEventType } from "../models/enum";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { ActivityService } from "../services/activity.service";
import { WorkflowService } from "../services/workflow.service";

@Component({
    selector: "escalation-event-task",
    templateUrl: "./escalation-event.component.html"
})
export class EscalationEventComponent extends CustomAppBaseComponent {
    escalationEventForm: FormGroup;
    form: any;
    formname: string;
    inputparamSteps: FormArray;
    inputparamsStepsShow: boolean = false;
    isEdit: any;
    actions: any[] = [];
    EscalationEventType = [
        { id: '0', name: 'Escalation Intermediate Throwing Event' },
        { id: '1', name: 'Escalation Interrupted Boundary Event' },
        { id: '2', name: 'Escalation Non Interrupted Boundary Event' },
        { id: '3', name: 'Escalation End Event' },
        // { id: '4', name: 'Escalation Start Event' }
    ]
    topics: any //= [{ id: 1, name: 'mailtemplate-activity' }, { id: 2, name: 'notification-activity' }, { id: 3, name: 'status-update' }];
    constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<EscalationEventComponent
        >,private activityService: ActivityService,
        @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService, private formBuilder: FormBuilder) {
        super();
        this.form = data;
        this.formname = data.name;
        this.isEdit = data.isEdit;
        this.actions = data.items;
    }
    ngOnInit(): void {
        this.clearForm();
        this.getActivities();
        this.onChangeEventType();  
        this.inputparamsStepsShow = true;
        if (this.isEdit) {
            this.escalationEventForm.patchValue(this.form.formValue);
            this.escalationEventForm.get('escalationName').setValue(this.form.formValue.escalationName);
            this.escalationEventForm.get('escalationEventType').setValue(this.form.formValue.escalationEventType);
            if(this.form.formValue.topic) {
                this.addTopic(this.form.formValue.topic);
            }
            if(this.form.formValue.taskName) {
                this.addTaskName(this.form.formValue.taskName);
            }
            if (this.form.formValue.inputparamSteps && this.form.formValue.inputparamSteps.length > 0) {
                this.form.formValue.inputparamSteps.forEach((value, index) => {
                    this.inputparamSteps = this.escalationEventForm.get('inputparamSteps') as FormArray;
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
        this.escalationEventForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            escalationName: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            escalationCode: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            escalationEventType: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            inputparamSteps: this.formBuilder.array([])
        })
    }
    upsertEscalationEvent() {
        this.AppDialog.close({ ...this.escalationEventForm.value, formId: this.form.formId });
    }
    cancelEscalationEvent() { this.AppDialog.close(); }
    addItem(index): void {
        this.inputparamSteps = this.escalationEventForm.get('inputparamSteps') as FormArray;
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
        return (this.escalationEventForm.get('inputparamSteps') as FormArray).controls;
    }
    getControlsLength() {
        this.addItem((this.escalationEventForm.get('inputparamSteps') as FormArray).length - 1);
    }
    validateStepsLength() {
        let length = (this.escalationEventForm.get('inputparamSteps') as FormArray).length;
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
    onChangeEventType() {
        this.escalationEventForm.get('escalationEventType').valueChanges.subscribe((value: any) => {
            if (value == EscalationEventType.EscalationInterruptedBoundaryEvent || value == EscalationEventType.EscalationNonInterruptedBoundaryEvent) {
                this.escalationEventForm.addControl('taskName', new FormControl('', Validators.required));
            } else {
                this.escalationEventForm.removeControl('taskName');
            }
            this.escalationEventForm.get('taskName')?.updateValueAndValidity();
        });
    }
    addTopic(topic) {
        this.escalationEventForm.addControl('topic', new FormControl(topic, Validators.required));
    }
    addTaskName(taskName) {
        this.escalationEventForm.addControl('taskName', new FormControl(taskName, Validators.required)); 
    }
    onTopicChange(event) {
        var steps = this.escalationEventForm.get('inputparamSteps') as FormArray;
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