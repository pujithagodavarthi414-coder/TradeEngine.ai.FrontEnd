import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivityModel } from "../models/activityModel";
import { MessageEventType } from "../models/enum";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { ActivityService } from "../services/activity.service";
import { WorkflowService } from "../services/workflow.service";

@Component({
    selector: "message-event-task",
    templateUrl: "./message-event.component.html"
})
export class MessageEventComponent extends CustomAppBaseComponent {
    messageEventForm: FormGroup;
    form: any;
    formname: string;
    inputparamSteps: FormArray;
    inputparamsStepsShow: boolean = false;
    isEdit: any;
    actions: any[] = [];
    MessageEventType = [
        { id: '0', name: 'Message Start Event' },
        { id: '1', name: 'Message Intermediate Catching Event' },
        { id: '2', name: 'Message Intermediate Throwing Event' },
        { id: '3', name: 'Message Interrupted Boundary Event' },
        { id: '4', name: 'Message Non Interrupted Boundary Event' },
        { id: '5', name: 'Message End Event' },
    ]
    selectedMessageEventType = this.MessageEventType[1];
    topics: any //= [{ id: 1, name: 'mailtemplate-activity' }, { id: 2, name: 'notification-activity' }, { id: 3, name: 'status-update' }];
    constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<MessageEventComponent>,
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
        this.onChangeMessageEventType();
        this.inputparamsStepsShow = true;
        if (this.isEdit) {
            this.messageEventForm.patchValue(this.form.formValue);
            this.messageEventForm.get('messageName').setValue(this.form.formValue.messageName);
            if(this.form.formValue.topic) {
                this.addTopic(this.form.formValue.topic);
            }
            if(this.form.formValue.taskName) {
                this.addTaskName(this.form.formValue.taskName);
            }
            if (this.form.formValue.inputparamSteps && this.form.formValue.inputparamSteps.length > 0) {
                this.form.formValue.inputparamSteps.forEach((value, index) => {
                    this.inputparamSteps = this.messageEventForm.get('inputparamSteps') as FormArray;
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
        this.messageEventForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            messageName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            messageEventType: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    
                ])
            ),
            inputparamSteps: this.formBuilder.array([])
        })
    }
    upsertMessageEvent() {
        this.AppDialog.close({ ...this.messageEventForm.value, formId: this.form.formId });
    }
    cancelMessageEvent() { this.AppDialog.close(); }
    addItem(index): void {
        this.inputparamSteps = this.messageEventForm.get('inputparamSteps') as FormArray;
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
        return (this.messageEventForm.get('inputparamSteps') as FormArray).controls;
    }
    getControlsLength() {
        this.addItem((this.messageEventForm.get('inputparamSteps') as FormArray).length - 1);
    }
    validateStepsLength() {
        let length = (this.messageEventForm.get('inputparamSteps') as FormArray).length;
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
    onChangeMessageEventType() {
        this.messageEventForm.get('messageEventType').valueChanges.subscribe((value: any) => {
            if (value == MessageEventType.MessageIntermediateThrowingEvent || value == MessageEventType.MessageEndEvent) {
                this.messageEventForm.addControl('topic', new FormControl('', Validators.required));
            } else {
                this.messageEventForm.removeControl('topic');
            }
            this.messageEventForm.get('topic')?.updateValueAndValidity();
            if (value == MessageEventType.MessageInterruptedBoundaryEvent || value == MessageEventType.MessageNonInterruptedBoundaryEvent) {
                this.messageEventForm.addControl('taskName', new FormControl('', Validators.required));
            } else {
                this.messageEventForm.removeControl('taskName');
            }
            this.messageEventForm.get('taskName')?.updateValueAndValidity();
        });
    }
    addTopic(topic) {
        this.messageEventForm.addControl('topic', new FormControl(topic, Validators.required));
    }
    addTaskName(taskName) {
        this.messageEventForm.addControl('taskName', new FormControl(taskName, Validators.required)); 
    }
    onTopicChange(event) {
        var steps = this.messageEventForm.get('inputparamSteps') as FormArray;
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