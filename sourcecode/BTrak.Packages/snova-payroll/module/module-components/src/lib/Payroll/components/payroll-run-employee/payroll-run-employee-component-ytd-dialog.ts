import { Component, Inject } from '@angular/core';
import { PayRollRunEmployeeComponentYTDModel } from '../../models/payrollrunemployeecomponentytdmodel';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { PayRollComponentModel } from '../../models/PayRollComponentModel';
import { PayrollManagementService } from '../../services/payroll-management.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: 'payroll-run-employee-component-ytd-dialog.html',
    styles: [`
    .payrollrunemployeecomponentytd-dialog { width:450px }
  `]
  })
  export class PayRollRunEmployeeComponentYTDDialog {
    payRollRunEmployeeComponentYTDModel: PayRollRunEmployeeComponentYTDModel;
    payRollRunEmployeeComponentInputModel: PayRollRunEmployeeComponentYTDModel;
    isAnyOperationIsInprogress: boolean;
    payRollRunEmployeeComponentForm: FormGroup;
    isThereAnError: boolean = false;
    validationMessage: string;
    isEdit: boolean;
    payRollComponents: PayRollComponentModel[];
    OriginalComponentAmount: number;
  
    constructor(private payrollManagementService: PayrollManagementService,
      public dialogRef: MatDialogRef<PayRollRunEmployeeComponentYTDDialog>, private toastr: ToastrService,
      private translateService: TranslateService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.payRollRunEmployeeComponentYTDModel = data.payRollRunEmployeeComponentYTDModel;
      this.isEdit = data.isEdit;
      this.OriginalComponentAmount = this.payRollRunEmployeeComponentYTDModel.full;
    }
  
    public ngOnInit(): void {
      this.clearForm();
      this.getPayRollComponents();
      if (this.isEdit == true) {
        this.payRollRunEmployeeComponentForm.patchValue(this.payRollRunEmployeeComponentYTDModel);
      }
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    clearForm() {
      this.isAnyOperationIsInprogress = false;
      this.isThereAnError = false;
      this.payRollRunEmployeeComponentForm = new FormGroup({
        componentAmount: new FormControl(null,
          Validators.compose([
            Validators.required
          ])
        ),
        componentId: new FormControl(null,
          Validators.compose([
            Validators.required
          ])
        ),
        isDeduction: new FormControl(null,
        )
      })
    }
  
    getPayRollComponents() {
      var payRollComponentModel = new PayRollComponentModel();
      payRollComponentModel.isArchived = false;
      this.payrollManagementService.getAllPayRollComponents(payRollComponentModel).subscribe((response: any) => {
        if (response.success == true) {
          this.payRollComponents = response.data;
        }
        else {
          this.validationMessage = response.apiResponseMessages[0].message;
        }
      });
    }
  
    upsertPayRollRunEmployeeComponentYTD(formDirective: FormGroupDirective) {
      this.isAnyOperationIsInprogress = true;
      this.payRollRunEmployeeComponentInputModel = this.payRollRunEmployeeComponentForm.value;
      this.payRollRunEmployeeComponentInputModel.employeeId = this.payRollRunEmployeeComponentYTDModel.employeeId;
      this.payRollRunEmployeeComponentInputModel.payRollRunId = this.payRollRunEmployeeComponentYTDModel.payRollRunId;
      if (this.isEdit) {
        this.payRollRunEmployeeComponentInputModel.componentId = this.payRollRunEmployeeComponentYTDModel.componentId;
        this.payRollRunEmployeeComponentInputModel.payRollRunEmployeeComponentId = this.payRollRunEmployeeComponentYTDModel.payRollRunEmployeeComponentId;
        this.payRollRunEmployeeComponentInputModel.timeStamp = this.payRollRunEmployeeComponentYTDModel.timeStamp;
        this.payRollRunEmployeeComponentInputModel.isDeduction = this.payRollRunEmployeeComponentYTDModel.isDeduction;
      }
      this.payrollManagementService.upsertPayRollRunEmployeeComponentYTD(this.payRollRunEmployeeComponentInputModel).subscribe((response: any) => {
        if (response.success == true) {
          this.dialogRef.close();
          this.clearForm();
          formDirective.resetForm();
          if (this.isEdit) {
            this.toastr.success("", this.translateService.instant("PAYROLLRUNEMPLOYEECOMPONENT.COMPONENTUPDATEDSUCCESSFULLY"));
          }
          else {
            this.toastr.success("", this.translateService.instant("PAYROLLRUNEMPLOYEECOMPONENT.COMPONENTADDEDSUCCESSFULLY"));
          }
        }
        else {
          this.isThereAnError = true;
          this.validationMessage = response.apiResponseMessages[0].message;
          this.isAnyOperationIsInprogress = false;
        }
      });
    }
  }
  