import { Component, OnInit, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef, ViewChildren } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators, ValidatorFn, FormBuilder, FormArray } from '@angular/forms';
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WorkflowService } from "../services/workflow.service";
import { Guid } from "guid-typescript";



@Component({
  selector: "app-user-task",
  templateUrl: "./user-task.component.html"
})
export class userTaskComponent extends CustomAppBaseComponent {

  userTaskForm: FormGroup;
  form: any;
  formname: string;
  inputparamSteps: FormArray;
  inputparamsStepsShow: boolean = false;
  isEdit: any;
  userTaskId : string;

  constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<userTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService, private formBuilder: FormBuilder) {
    super();
    this.form = data;
    this.formname = data.name;
    this.isEdit = data.isEdit;
    if(this.isEdit) {
      this.userTaskId = this.form.formValue.id;
    } else {
      this.userTaskId = Guid.create().toString();
    }
  }
  ngOnInit(): void {
    this.clearForm();
    this.inputparamsStepsShow = true;
    if (this.isEdit) {
      // this.userTaskForm.patchValue(this.form.formValue);
      this.userTaskForm.get("name").setValue(this.form.formValue.name);
      if (this.form.formValue.inputparamSteps && this.form.formValue.inputparamSteps.length > 0) {
        this.form.formValue.inputparamSteps.forEach((value, index) => {
          this.inputparamSteps = this.userTaskForm.get('inputparamSteps') as FormArray;
          this.inputparamSteps.insert(index, this.bindcriteriaItem(value));
        });
      }
    }
  }



  clearForm() {
    this.userTaskForm = new FormGroup({
      name: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      inputparamSteps: this.formBuilder.array([]),
      id : new FormControl(null)
    })
  }
  upsertUsertask() {
    this.AppDialog.close({ ...this.userTaskForm.value, formId: this.form.formId });
  }

  cancelUsertask() { this.AppDialog.close(); }

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

    this.inputparamSteps = this.userTaskForm.get('inputparamSteps') as FormArray;
    this.inputparamSteps.insert(index + 1, this.createcriteriaItem());
    this.addNewTestCaseStep();
  }

  addNewTestCaseStep() { }


  createcriteriaItem(): FormGroup {
    let inputId = Guid.create().toString();
    return this.formBuilder.group({
      inputName: new FormControl('', Validators.compose([Validators.required])),
      inputValue: new FormControl('', Validators.compose([])),
      inputId : new FormControl(inputId)
    });
  }

  bindcriteriaItem(data): FormGroup {
    return this.formBuilder.group({
      inputName: new FormControl(data.inputName, Validators.compose([Validators.required])),
      inputValue: new FormControl(data.inputValue, Validators.compose([])),
      inputId : new FormControl(data.inputId, Validators.compose([]))
    });
  }


  getCriteriaControls() {
    return (this.userTaskForm.get('inputparamSteps') as FormArray).controls;
  }

  getControlsLength() {
    this.addItem((this.userTaskForm.get('inputparamSteps') as FormArray).length - 1);
  }

  validateStepsLength() {
    let length = (this.userTaskForm.get('inputparamSteps') as FormArray).length;
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

}