import { Component, OnInit, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef, ViewChildren } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators, ValidatorFn, FormBuilder, FormArray } from '@angular/forms';
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { WorkflowModel } from "../models/workflow-model";
import { WorkflowService } from "../services/workflow.service";
import { MatRadioChange } from "@angular/material/radio";
import { Guid } from "guid-typescript";



@Component({
    selector: "app-add-webhooks",
    templateUrl: "./add-webhooks.component.html"
})
export class addWebhooksComponent extends CustomAppBaseComponent {

    webhookForm: FormGroup;
    form: any;
    formFieldsDropDown: any[];
    formname:string;
    isEdit: boolean;
    webhookId : string;
    method:any;
    entityStepsShow: boolean = false;
    customStepsShow: boolean = false;
    entityparamSteps: FormArray;
    customparamSteps: FormArray;
    

    constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<addWebhooksComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService,private formBuilder:FormBuilder) {
        super();
        this.form = data;
        this.formname = data.name;
        this.isEdit = data.isEdit;
        if(this.isEdit == true) {
            this.webhookId = this.form.formValue.id;
        } else {
            this.webhookId = Guid.create().toString();
        }
        }
    ngOnInit(): void {
        this.clearForm();
        this.getAllFields();
        this.entityStepsShow = true;
        this.customStepsShow = true;
    }

    getAllFields() {
        let workflowModel = new WorkflowModel();
        workflowModel.id = this.form.formId;
       this.workflowService
            .getAllFormFields(workflowModel)
            .subscribe((responseData: any) => {
                this.formFieldsDropDown = responseData.data;
            });

    }
  
    onChange(mrChange: MatRadioChange) {
        this.method = mrChange.value;
        }

    clearForm() {
        this.webhookForm = new FormGroup({
            formtypeName: new FormControl(null),
            webhookName: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            method: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            urltoNotify: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            fieldName: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            fieldtobeUpdated: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            entityparamSteps: this.formBuilder.array([]),
            customparamSteps: this.formBuilder.array([]),
            previewURL:new FormControl(null),
            parameterName:new FormControl(null),
            valuedescription:new FormControl(null),
            id : new FormControl(null)
        })
    }



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
      
        this.entityparamSteps = this.webhookForm.get('entityparamSteps') as FormArray;
            this.entityparamSteps.insert(index + 1, this.createcriteriaItem());
            this.addNewTestCaseStep();
      }
      
      addNewTestCaseStep(){}
      
      
      createcriteriaItem(): FormGroup {
        return this.formBuilder.group({
            entityName: new FormControl('', Validators.compose([Validators.required])),
            entityValue: new FormControl('', Validators.compose([]))
        });
      }
      

      
      
      getCriteriaControls() {
        return (this.webhookForm.get('entityparamSteps') as FormArray).controls;
      }
      
      getControlsLength() {
        this.addItem((this.webhookForm.get('entityparamSteps') as FormArray).length - 1);
      }
      
      validateStepsLength() {
        let length = (this.webhookForm.get('entityparamSteps') as FormArray).length;
        if (length == 0)
            return true;
        else
            return false;
      }
      
      removeItem(index) {
      
        this.entityparamSteps.removeAt(index);
        this.addNewTestCaseStep();
      }


      addCustomItem(index): void {
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
      
        this.customparamSteps = this.webhookForm.get('customparamSteps') as FormArray;
            this.customparamSteps.insert(index + 1, this.createcustomcriteriaItem());
           // this.addNewTestCaseStep();
      }
      
      
      
      
      createcustomcriteriaItem(): FormGroup {
        return this.formBuilder.group({
            customentityName: new FormControl('', Validators.compose([Validators.required])),
            customentityValue: new FormControl('', Validators.compose([]))
        });
      }
      
      refreshURL(){}
      
      
    //   getCriteriaControls() {
    //     return (this.webhookForm.get('entityparamSteps') as FormArray).controls;
    //   }
      
      getCustomControlsLength() {
        this.addCustomItem((this.webhookForm.get('customparamSteps') as FormArray).length - 1);
      }
      
    //   validateStepsLength() {
    //     let length = (this.webhookForm.get('customparamSteps') as FormArray).length;
    //     if (length == 0)
    //         return true;
    //     else
    //         return false;
    //   }
      
      removeCustomItem(index) {
      
        this.customparamSteps.removeAt(index);
       // this.addNewTestCaseStep();
      }
      

    upsertFieldUpdate() { }

    cancelFiledUpdate() { }

    onNoClick(): void {
        this.AppDialog.close();
    }

}