import { Component, Inject } from '@angular/core';
import { PayRollRunEmployeeComponentModel } from '../../models/payrollrunemployeecomponentmodel';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { PayRollComponentModel } from '../../models/PayRollComponentModel';
import { PayrollManagementService } from '../../services/payroll-management.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'payroll-run-employee-component-dialog.html',
  styles: [`
    .payrollrunemployeecomponent-dialog { width:450px }
  `]
})
export class PayRollRunEmployeeComponentDialog {
  payRollRunEmployeeComponentModel: PayRollRunEmployeeComponentModel;
  payRollRunEmployeeComponentInputModel: PayRollRunEmployeeComponentModel;
  isAnyOperationIsInprogress: boolean;
  payRollRunEmployeeComponentForm: FormGroup;
  isThereAnError: boolean = false;
  validationMessage: string;
  isEdit: boolean;
  payRollComponents: PayRollComponentModel[];
  originalComponentAmount: number;
  addOrUpdateYtdComponent: boolean;
  addOrUpdateComponent: boolean;
  originalActualComponentAmount: number;
  includeYtd: boolean;

  constructor(private payrollManagementService: PayrollManagementService,
    public dialogRef: MatDialogRef<PayRollRunEmployeeComponentDialog>, private toastr: ToastrService,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.payRollRunEmployeeComponentModel = data.payRollRunEmployeeComponentModel;
    this.isEdit = data.isEdit;
    this.originalComponentAmount = this.payRollRunEmployeeComponentModel.componentAmount;
  }

  public ngOnInit(): void {
    this.clearForm();
    this.getPayRollComponents();
    this.includeYtd = this.payRollRunEmployeeComponentModel.includeYtd;
    if (this.isEdit == true) {
      this.payRollRunEmployeeComponentForm.patchValue(this.payRollRunEmployeeComponentModel);
      this.originalActualComponentAmount = this.payRollRunEmployeeComponentForm.controls["actualComponentAmount"].value;
    }
    else {
      this.payRollRunEmployeeComponentModel.componentAmount = null;
      this.payRollRunEmployeeComponentModel.actualComponentAmount = null;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  clearForm() {
    this.isAnyOperationIsInprogress = false;
    this.isThereAnError = false;
    this.payRollRunEmployeeComponentForm = new FormGroup({
      actualComponentAmount: new FormControl(null,
      ),
      componentAmount: new FormControl(null,
      ),
      comments: new FormControl(null,
      ),
      ytdComments: new FormControl(null,
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

  upsertPayRollRunEmployeeComponent(formDirective: FormGroupDirective) {
    this.addOrUpdateComponent = false;
    this.addOrUpdateYtdComponent = false;

    if (this.payRollRunEmployeeComponentForm.controls["comments"].value == "")
      this.payRollRunEmployeeComponentForm.controls["comments"].setValue(null);
    if (this.payRollRunEmployeeComponentForm.controls["ytdComments"].value == "")
      this.payRollRunEmployeeComponentForm.controls["ytdComments"].setValue(null);

    if (this.payRollRunEmployeeComponentForm.controls["actualComponentAmount"].value == null &&
      this.payRollRunEmployeeComponentForm.controls["componentAmount"].value == null && !this.isEdit) {
      this.toastr.error("", this.translateService.instant("PAYROLLRUNEMPLOYEECOMPONENT.EITHERMONTHLYORYEARLYAMOUNTISREQUIRED"));
    }
    else if (this.payRollRunEmployeeComponentForm.controls["actualComponentAmount"].value != null
      && this.payRollRunEmployeeComponentForm.controls["comments"].value == null && !this.isEdit) {
      this.toastr.error("", this.translateService.instant("PAYROLLRUNEMPLOYEECOMPONENT.COMMENTSREQUIREDERROR"));
    }
    else if (this.payRollRunEmployeeComponentForm.controls["componentAmount"].value != null
      && this.payRollRunEmployeeComponentForm.controls["ytdComments"].value == null && !this.isEdit) {
      this.toastr.error("", this.translateService.instant("PAYROLLRUNEMPLOYEECOMPONENT.YTDCOMMENTSREQUIREDERROR"));
    }
    else if (this.isEdit && this.payRollRunEmployeeComponentForm.controls["comments"].value == null
      && (this.payRollRunEmployeeComponentForm.controls["actualComponentAmount"].value != this.payRollRunEmployeeComponentModel.actualComponentAmount)) {
      this.toastr.error("", this.translateService.instant("PAYROLLRUNEMPLOYEECOMPONENT.COMMENTSREQUIREDERROR"));
    }
    else if (this.isEdit && this.payRollRunEmployeeComponentForm.controls["ytdComments"].value == null
      && (this.payRollRunEmployeeComponentForm.controls["componentAmount"].value != this.payRollRunEmployeeComponentModel.componentAmount)) {
      this.toastr.error("", this.translateService.instant("PAYROLLRUNEMPLOYEECOMPONENT.YTDCOMMENTSREQUIREDERROR"));
    }
    else {
      this.isAnyOperationIsInprogress = true;
      this.payRollRunEmployeeComponentInputModel = this.payRollRunEmployeeComponentForm.value;
      this.payRollRunEmployeeComponentInputModel.employeeId = this.payRollRunEmployeeComponentModel.employeeId;
      this.payRollRunEmployeeComponentInputModel.payRollRunId = this.payRollRunEmployeeComponentModel.payRollRunId;
      this.payRollRunEmployeeComponentInputModel.originalComponentAmount = null;
      this.payRollRunEmployeeComponentInputModel.originalActualComponentAmount = null;
      if (this.isEdit) {
        this.payRollRunEmployeeComponentInputModel.originalComponentAmount = this.originalComponentAmount;
        this.payRollRunEmployeeComponentInputModel.originalActualComponentAmount = this.originalActualComponentAmount;
        this.payRollRunEmployeeComponentInputModel.payRollRunEmployeeComponentId = this.payRollRunEmployeeComponentModel.payRollRunEmployeeComponentId;
        this.payRollRunEmployeeComponentInputModel.timeStamp = this.payRollRunEmployeeComponentModel.timeStamp;
      }
      if (this.payRollRunEmployeeComponentInputModel.originalActualComponentAmount != this.payRollRunEmployeeComponentForm.controls["actualComponentAmount"].value) {
        this.addOrUpdateComponent = true;
      }
      if (this.payRollRunEmployeeComponentInputModel.originalComponentAmount != this.payRollRunEmployeeComponentInputModel.componentAmount) {
        this.addOrUpdateYtdComponent = true;
      }
      this.payRollRunEmployeeComponentInputModel.addOrUpdateComponent =  this.addOrUpdateComponent;
      this.payRollRunEmployeeComponentInputModel.addOrUpdateYtdComponent =  this.addOrUpdateYtdComponent;
      this.payrollManagementService.upsertPayRollRunEmployeeComponent(this.payRollRunEmployeeComponentInputModel).subscribe((response: any) => {
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
}
