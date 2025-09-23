import { Component, Inject } from '@angular/core';
import { PayrollManagementService } from '../../services/payroll-management.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PayRollRunEmployeeComponentDialog } from './payroll-run-employee-component-dialog';
import { PayRollRunEmployeeComponentHistoryDialog } from './payroll-run-employee-component-history-dialog';
import { PayRollRunEmployeeComponentYTDDialog } from './payroll-run-employee-component-ytd-dialog';

@Component({
    templateUrl: 'payroll-run-employee-dialog.html',
    styles: [`
    .borderleft { border-left:1px solid black }
  `]
  
  })
  export class DialogOverviewExampleDialog1 {
    public payslipDetails: any;
    payslipComponents: any;
    isDispalyPopup: boolean;
    payrollRunId: any;
    employeeId: any;
    totalEarnings: number = 0;
    totalDeductions: number = 0;
    fullTotalEarnings: number = 0;
    fullTotalDedutions: number = 0;
    type: string;
    earningsComponentsLength: number = 0;
    deductonsComponentsLength: number = 0;
    includeYtd: boolean = false;
  
    constructor(private payrollManagementService: PayrollManagementService,
      public dialogRef: MatDialogRef<DialogOverviewExampleDialog1>, public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.employeeId = data.employeeId;
      this.payrollRunId = data.payrollRunId;
      this.isDispalyPopup = data.isDispalyPopup;
      this.type = data.type;
  
      this.getPayslipDetails();
  
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    getPayslipDetails() {
  
      this.totalEarnings = 0;
      this.totalDeductions = 0;
      this.fullTotalEarnings = 0;
  
      this.payrollManagementService.getPaySlipDetailsList(this.payrollRunId, this.employeeId).subscribe((response: any) => {
        console.log(response);
        this.payslipDetails = response.data[0];
        this.includeYtd = response.data[0].includeYtd;
        console.log(this.payslipDetails);
        this.payslipComponents = response.data;
        this.calculateTotalEarnings();
        if (!this.isDispalyPopup) {
          this.downloadPayslip();
          this.dialogRef.close();
        }
  
      })
    }
  
  
    calculateTotalEarnings() {
      this.payslipComponents.forEach(component => {
        if (!component.isDeduction) {
          this.totalEarnings = this.totalEarnings + component.actual;
          this.fullTotalEarnings = this.fullTotalEarnings + component.full;
        } else {
          this.totalDeductions = this.totalDeductions + component.actual;
  
        }
  
      });
  
    }
    downloadPayslip() {
      const div = document.getElementById("html2Pdf");
    }
  
    filterComponents(isDeduction) {
      if (isDeduction == true) {
        this.deductonsComponentsLength = this.payslipComponents.filter(x => x.isDeduction == true).length;
        return this.payslipComponents.filter(x => x.isDeduction == true);
      }
      else {
        this.earningsComponentsLength = this.payslipComponents.filter(x => x.isDeduction != true).length;
        return this.payslipComponents.filter(x => x.isDeduction != true);
      }
    }
  
    selectedPayRollRunEmployeeComponent(row, isEdit) {
      this.openPayRollRunEmployeeComponentDialog(row, isEdit);
    }
  
    openPayRollRunEmployeeComponentDialog(rowData, isEdit): void {
      const dialogRef = this.dialog.open(PayRollRunEmployeeComponentDialog, {
        data: { payRollRunEmployeeComponentModel: rowData, isEdit: isEdit }
      });
  
      dialogRef.afterClosed().subscribe(() => {
        console.log('The dialog was closed');
        this.getPayslipDetails();
      });
    }

    openPayRollRunEmployeeComponentYTDDialog(rowData, isEdit): void {
      const dialogRef = this.dialog.open(PayRollRunEmployeeComponentYTDDialog, {
        data: { payRollRunEmployeeComponentYTDModel: rowData, isEdit: isEdit }
      });
  
      dialogRef.afterClosed().subscribe(() => {
        console.log('The dialog was closed');
        this.getPayslipDetails();
      });
    }

  
    selectedPayRollRunEmployeeComponentHistory(row) {
      this.openPayRollRunEmployeeComponentHistoryDialog(row);
    }
  
    openPayRollRunEmployeeComponentHistoryDialog(rowData): void {
      const dialogRef = this.dialog.open(PayRollRunEmployeeComponentHistoryDialog, {
        data: { payRollRunEmployeeComponentModel: rowData }
      });
  
      dialogRef.afterClosed().subscribe(() => {
        console.log('The dialog was closed');
      });
    }


    selectedPayRollRunEmployeeComponentYTD(row, isEdit) {
      this.openPayRollRunEmployeeComponentYTDDialog(row, isEdit);
    }
  
    openSelectedPayRollRunEmployeeComponentYTD(rowData, isEdit): void {
      const dialogRef = this.dialog.open(PayRollRunEmployeeComponentYTDDialog, {
        data: { payRollRunEmployeeComponentYTDModel: rowData, isEdit: isEdit }
      });
  
      dialogRef.afterClosed().subscribe(() => {
        console.log('The dialog was closed');
        this.getPayslipDetails();
      });
    }
  }
  