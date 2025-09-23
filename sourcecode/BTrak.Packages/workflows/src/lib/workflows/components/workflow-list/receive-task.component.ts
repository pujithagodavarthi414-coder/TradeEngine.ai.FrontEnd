import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { WorkflowService } from "../../services/workflow.service";

@Component({
    selector: "app-receive-task",
    templateUrl: "./receive-task.component.html"
})
export class ReceiveTaskComponent extends CustomAppBaseComponent {
    receiveTaskForm: FormGroup;
    form: any;
    formname: string;
    inputparamSteps: FormArray;
    inputparamsStepsShow: boolean = false;
    isEdit: any;
    constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<ReceiveTaskComponent>,
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
            this.receiveTaskForm.patchValue(this.form.formValue);
            //this.receiveTaskForm.get("name").setValue(this.form.formValue.name);
            //this.receiveTaskForm.get("topic").setValue(this.form.formValue.topic);
            if (this.form.formValue.inputparamSteps && this.form.formValue.inputparamSteps.length > 0) {
                this.form.formValue.inputparamSteps.forEach((value, index) => {
                    this.inputparamSteps = this.receiveTaskForm.get('inputparamSteps') as FormArray;
                    this.inputparamSteps.insert(index, this.bindcriteriaItem(value));
                });
            }
        }
    }
    clearForm() {
        this.receiveTaskForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            messageName: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            inputparamSteps: this.formBuilder.array([])
        })
    }
    upsertReceiveTask() {
        this.AppDialog.close({ ...this.receiveTaskForm.value, formId: this.form.formId });
    }
    cancelReceiveTask() { this.AppDialog.close(); }
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

        this.inputparamSteps = this.receiveTaskForm.get('inputparamSteps') as FormArray;
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
        return (this.receiveTaskForm.get('inputparamSteps') as FormArray).controls;
    }
    getControlsLength() {
        this.addItem((this.receiveTaskForm.get('inputparamSteps') as FormArray).length - 1);
    }
    validateStepsLength() {
        let length = (this.receiveTaskForm.get('inputparamSteps') as FormArray).length;
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