import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { WorkflowModel } from "../models/workflow-model";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { WorkflowService } from "../services/workflow.service";

@Component({
  selector: "app-eventgateway",
  templateUrl: "./event-gateway.component.html"
})
export class EventGateWayComponent extends CustomAppBaseComponent {
  eventGatewayForm: FormGroup;
  form: any;
  formFieldsDropDown: any[];

  conditionSteps: FormArray;
  formname: string;
  isEdit: any;
  conditionShow: boolean = false;
  actions: any[] = [];
  events: any[] = [];

  eventsDropDown = [
    { id: '1', name: 'Message' },
    { id: '2', name: 'Timer' },
    ]

  constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<EventGateWayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService, private formBuilder: FormBuilder,) {
    super();
    this.form = data;
    this.formname = data.name;
    this.isEdit = data.isEdit;
    this.actions = data.items;
    this.events = data.events;
  }
  ngOnInit(): void {
    this.clearForm();
    this.getAllFields();
    this.conditionShow = true;
    if (this.isEdit) {
      this.eventGatewayForm.patchValue(this.form.formValue);
    }
  }
  getAllFields() {
    let workflowModel = new WorkflowModel();
    workflowModel.id = this.form.formId;
    this.workflowService
      .getAllFormFields(workflowModel)
      .subscribe((responseData: any) => {
        this.formFieldsDropDown = responseData.data;
        this.bindForm();
      });
  }
  bindForm() {
    if (this.isEdit) {
      this.eventGatewayForm.patchValue(this.form.formValue);
      if (this.form.formValue.conditionSteps && this.form.formValue.conditionSteps.length > 0) {
        this.form.formValue.conditionSteps.forEach((value, index) => {
          this.conditionSteps = this.eventGatewayForm.get('conditionSteps') as FormArray;
          this.conditionSteps.insert(index, this.bindcriteriaItem(value));
        });
      }
    }
  }
  clearForm() {
    this.eventGatewayForm = new FormGroup({
      formtypeName: new FormControl(null),
      name: new FormControl(null,
        Validators.compose([
            Validators.required
        ])),
        conditionSteps: this.formBuilder.array([])
    })
  }
  
  addItem(index): void {
    this.conditionSteps = this.eventGatewayForm.get('conditionSteps') as FormArray;
    this.conditionSteps.insert(index + 1, this.createconditionItem());
    this.addNewTestCaseStep();
  }
  addNewTestCaseStep() { }
  createconditionItem(): FormGroup {
    return this.formBuilder.group({
      eventName: new FormControl('', Validators.compose([Validators.required])),
      //taskName: new FormControl('', Validators.compose([Validators.required]))
    });
  }
  bindcriteriaItem(data): FormGroup {
    return this.formBuilder.group({
      eventName: new FormControl(data.eventName, Validators.compose([Validators.required])),
      //taskName: new FormControl(data.taskName, Validators.compose([Validators.required]))
    });
  } 
  
  getconditionControls() {
    return (this.eventGatewayForm.get('conditionSteps') as FormArray).controls;
  }
  getControlsLength() {
    this.addItem((this.eventGatewayForm.get('conditionSteps') as FormArray).length - 1);
  }
  
  validateStepsLength() {
    let length = (this.eventGatewayForm.get('conditionSteps') as FormArray).length;
    if (length == 0)
      return true;
    else
      return false;
  }
  removeItem(index) {
    this.conditionSteps.removeAt(index);
    this.addNewTestCaseStep();
  }

  upsertEventGateway() { this.AppDialog.close({ ...this.eventGatewayForm.value, formId: this.form.formId }); }
  canceleventGateway() { this.AppDialog.close(); }
  onNoClick(): void {
    this.AppDialog.close();
  }
}