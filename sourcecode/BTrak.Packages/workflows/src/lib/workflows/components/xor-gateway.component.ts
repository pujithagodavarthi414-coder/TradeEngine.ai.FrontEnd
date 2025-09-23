import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { WorkflowModel } from "../models/workflow-model";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { WorkflowService } from "../services/workflow.service";

@Component({
  selector: "app-xor",
  templateUrl: "./xor-gateway.component.html"
})
export class XorGateWayComponent extends CustomAppBaseComponent {
  fieldForm: FormGroup;
  form: any; 
  formFieldsDropDown: any[];
  functions: any[] = [
    { name: 'String functions', fns: ['startsWith', 'endsWith', 'equalsIgnoreCase', 'contains', 'matches','notmatches'] },
    { name: 'Integer functions', fns: ['==', '!=', '>', '>=', '<', '<='] },
    // { name: 'Date functions', fns: ['equals', 'before', 'after'] }
  ];
  conditionSteps: FormArray;
  formname: string;
  isEdit: any;
  conditionShow: boolean = false;
  actions: any[] = [];
  constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<XorGateWayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService, private formBuilder: FormBuilder,) {
    super();
    this.form = data;
    this.formname = data.name;
    this.isEdit = data.isEdit;
    this.actions = data.items;
  }
  ngOnInit(): void {
    this.clearForm();
    this.onChangeGateWayType();
    this.getAllFields();
    this.conditionShow = true;
    if (this.isEdit) {
      this.fieldForm.patchValue(this.form.formValue);
    }
  }
  getAllFields() {
    let workflowModel = new WorkflowModel();
    workflowModel.id = this.form.formId;
    this.workflowService
      .getAllFormFields(workflowModel)
      .subscribe((responseData: any) => {
        this.formFieldsDropDown = responseData.data;
        this.cdRef.detectChanges();
        this.bindForm();
      });
  }
  bindForm() {
    if (this.isEdit) {
      this.fieldForm.patchValue(this.form.formValue);
      if (this.form.formValue.conditionSteps && this.form.formValue.conditionSteps.length > 0) {
        this.form.formValue.conditionSteps.forEach((value, index) => {
          this.conditionSteps = this.fieldForm.get('conditionSteps') as FormArray;
          this.conditionSteps.insert(index, this.bindcriteriaItem(value));
        });
      }
    }
  }
  clearForm() {
    this.fieldForm = new FormGroup({
      formtypeName: new FormControl(null),
      
        name: new FormControl(null,
          Validators.compose([
            Validators.required
          ])
        ),
      orGateWayType: new FormControl(null),
      elseCond: new FormControl(null),
      conditionSteps: this.formBuilder.array([]),
      
    })
  }
  // addElseItem(index): void {
  //   this.conditionSteps = this.fieldForm.get('conditionSteps') as FormArray;
  //   this.conditionSteps.insert(index + 1, this.createElseConditionItem());
  //   this.addNewTestCaseStep();
  // }
  // createElseConditionItem(): FormGroup {
  //   return this.formBuilder.group({
  //     fieldName1: new FormControl('', Validators.compose([Validators.required])),
  //     taskName: new FormControl('', Validators.compose([Validators.required])),
  //   });
  // }
  addItem(index): void {
    this.conditionSteps = this.fieldForm.get('conditionSteps') as FormArray;
    this.conditionSteps.insert(index + 1, this.createconditionItem());
    this.addNewTestCaseStep();
  }
  addNewTestCaseStep() { }
  createconditionItem(): FormGroup {
    if (this.fieldForm.get('orGateWayType').value == 'Fork') {
      return this.formBuilder.group({
        fieldName1: new FormControl('', Validators.compose([Validators.required])),
        fieldType: new FormControl('', Validators.compose([Validators.required])),
        functionName: new FormControl('', Validators.compose([Validators.required])),
        taskName: new FormControl('', Validators.compose([Validators.required])),
        fieldValue: new FormControl('', Validators.compose([Validators.required]))
      });
    }
    else {
      return this.formBuilder.group({
        taskName: new FormControl('', Validators.compose([Validators.required]))
      });
    }
  }
  bindcriteriaItem(data): FormGroup {
    if (this.fieldForm.get('orGateWayType').value == 'Fork') {
      return this.formBuilder.group({
        fieldName1: new FormControl(data.fieldName1, Validators.compose([Validators.required])),
        fieldType: new FormControl(data.fieldType, Validators.compose([Validators.required])),
        functionName: new FormControl(data.functionName, Validators.compose([Validators.required])),
        taskName: new FormControl(data.taskName, Validators.compose([Validators.required])),
        fieldValue: new FormControl(data.fieldValue, Validators.compose([Validators.required]))
      });
    } else {
      return this.formBuilder.group({
        taskName: new FormControl(data.taskName, Validators.compose([Validators.required]))
      });
    }
  }
  onChangeField(e, i) {
    var dataType = this.formFieldsDropDown.find(x => x.key == e.value).dataType;
    this.getconditionControls()[i].get("fieldType").setValue(dataType);
  }
  getconditionControls() {
    return (this.fieldForm.get('conditionSteps') as FormArray).controls;
  }
  getControlsLength() {
    this.addItem((this.fieldForm.get('conditionSteps') as FormArray).length - 1);
  }
  // getControlsLengthForElse() {
  //   this.addElseItem((this.fieldForm.get('conditionSteps') as FormArray).length - 1);
  // }
  validateStepsLength() {
    let length = (this.fieldForm.get('conditionSteps') as FormArray).length;
    if (length == 0)
      return true;
    else
      return false;
  }
  removeItem(index) {
    this.conditionSteps.removeAt(index);
    this.addNewTestCaseStep();
  }

  upsertFieldUpdate() { this.AppDialog.close({ ...this.fieldForm.value, formId: this.form.formId }); }
  cancelFiledUpdate() { this.AppDialog.close(); }
  onNoClick(): void {
    this.AppDialog.close();
  }
  onChangeGateWayType() {
    this.fieldForm.get('orGateWayType').valueChanges.subscribe((value: any) => {
      var conditionSteps = this.fieldForm.get('conditionSteps') as FormArray;
      conditionSteps.clear();
    });
  }
}