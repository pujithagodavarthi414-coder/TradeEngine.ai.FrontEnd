import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { WorkflowService } from "../services/workflow.service";

@Component({
    selector: 'app-script-task',
    templateUrl: 'script-task.component.html'
})

export class ScriptTaskComponent extends CustomAppBaseComponent implements OnInit {
    scriptTaskForm: FormGroup;
    form: any;
    formname: string;
    inputparamSteps: FormArray;
    inputparamsStepsShow: boolean = false;
    isEdit: any;
    constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<ScriptTaskComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService, private formBuilder: FormBuilder) {
        super();
        this.form = data;
        this.formname = data.name;
        this.isEdit = data.isEdit;
    }
    ngOnInit(): void {
        this.clearForm();
        this.inputparamsStepsShow = true;
        if (this.isEdit) {
            this.scriptTaskForm.patchValue(this.form.formValue);
            //this.scriptTaskForm.get("name").setValue(this.form.formValue.name);
            //this.scriptTaskForm.get("topic").setValue(this.form.formValue.topic);
            if (this.form.formValue.inputparamSteps && this.form.formValue.inputparamSteps.length > 0) {
                this.form.formValue.inputparamSteps.forEach((value, index) => {
                    this.inputparamSteps = this.scriptTaskForm.get('inputparamSteps') as FormArray;
                    this.inputparamSteps.insert(index, this.bindcriteriaItem(value));
                });
            }
        }
    }
    clearForm() {
        this.scriptTaskForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            script: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            resultVariable: new FormControl(null),
            inputparamSteps: this.formBuilder.array([])
        })
    }
    upsertScriptTask() {
        this.AppDialog.close({ ...this.scriptTaskForm.value, formId: this.form.formId });
    }
    cancelScriptTask() { this.AppDialog.close(); }
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

        this.inputparamSteps = this.scriptTaskForm.get('inputparamSteps') as FormArray;
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
        return (this.scriptTaskForm.get('inputparamSteps') as FormArray).controls;
    }
    getControlsLength() {
        this.addItem((this.scriptTaskForm.get('inputparamSteps') as FormArray).length - 1);
    }
    validateStepsLength() {
        let length = (this.scriptTaskForm.get('inputparamSteps') as FormArray).length;
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