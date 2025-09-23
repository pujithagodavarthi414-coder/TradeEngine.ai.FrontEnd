import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { WorkflowModel } from "../models/workflow-model";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { WorkflowService } from "../services/workflow.service";

@Component({
    selector: "app-and",
    templateUrl: "./and-gateway.component.html"
})
export class AndGateWayComponent extends CustomAppBaseComponent {
    andGatewayForm: FormGroup;
    form: any;
    formFieldsDropDown: any[];
    functions: any[] = [
        {name: 'String functions', fns: ['startsWith','endsWith', 'equals', 'Includes']},
    ];
    conditionSteps: FormArray;
    formname: string;
    isEdit: any;
    conditionShow:boolean = false;
    actions: any[] = [];
    constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<AndGateWayComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService,private formBuilder: FormBuilder, ) {
        super();
        this.form = data;
        this.formname = data.name;
        this.isEdit = data.isEdit;
        this.actions = data.items;
    }
    ngOnInit(): void {
        this.clearForm();
        //this.getAllFields();
        this.conditionShow = true;
        if(this.isEdit) {
            this.andGatewayForm.patchValue(this.form.formValue);
            this.bindForm();
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
        if (this.form.formValue.conditionSteps && this.form.formValue.conditionSteps.length > 0) {
          this.form.formValue.conditionSteps.forEach((value, index) => {
            this.conditionSteps = this.andGatewayForm.get('conditionSteps') as FormArray;
            this.conditionSteps.insert(index, this.bindcriteriaItem(value));
          });
      }
    }
    clearForm() {
        this.andGatewayForm = new FormGroup({
            formtypeName: new FormControl(null),
            name: new FormControl(null,
              Validators.compose([
                  Validators.required
              ])),
            andGateWayType: new FormControl(null,
              Validators.compose([
                  Validators.required
              ])),
            conditionSteps: this.formBuilder.array([])
        })
    }
   
    addItem(index): void {
        this.conditionSteps = this.andGatewayForm.get('conditionSteps') as FormArray;
        this.conditionSteps.insert(index + 1, this.createconditionItem());
        this.addNewTestCaseStep();
      }
      addNewTestCaseStep() { }
      createconditionItem(): FormGroup {
        return this.formBuilder.group({
            taskName: new FormControl('', Validators.compose([Validators.required]))
        });
      }
      bindcriteriaItem(data): FormGroup {
        return this.formBuilder.group({
          taskName: new FormControl(data.taskName, Validators.compose([Validators.required]))
      });
      }
      getconditionControls() {
        return (this.andGatewayForm.get('conditionSteps') as FormArray).controls;
      }
      getControlsLength() {
        this.addItem((this.andGatewayForm.get('conditionSteps') as FormArray).length - 1);
      }
      validateStepsLength() {
        let length = (this.andGatewayForm.get('conditionSteps') as FormArray).length;
        if (length == 0)
          return true;
        else
          return false;
      }
      removeItem(index) {
        this.conditionSteps.removeAt(index);
        this.addNewTestCaseStep();
      }

    upsertAndGateway() { this.AppDialog.close({ ...this.andGatewayForm.value, formId: this.form.formId }); }
    cancelAndGateway() { this.AppDialog.close(); }
    onNoClick(): void {
        this.AppDialog.close();
    }
}