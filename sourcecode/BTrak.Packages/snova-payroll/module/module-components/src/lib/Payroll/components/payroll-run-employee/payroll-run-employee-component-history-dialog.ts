import { Component, Inject } from '@angular/core';
import { PayRollRunEmployeeComponentModel } from '../../models/payrollrunemployeecomponentmodel';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    templateUrl: 'payroll-run-employee-component-history-dialog.html',
    styles: [`
    .payrollrunemployeecomponent-dialog { width:450px }
  `]
})
export class PayRollRunEmployeeComponentHistoryDialog {
    payRollRunEmployeeComponentModel: PayRollRunEmployeeComponentModel;

    constructor(public dialogRef: MatDialogRef<PayRollRunEmployeeComponentHistoryDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.payRollRunEmployeeComponentModel = data.payRollRunEmployeeComponentModel;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}