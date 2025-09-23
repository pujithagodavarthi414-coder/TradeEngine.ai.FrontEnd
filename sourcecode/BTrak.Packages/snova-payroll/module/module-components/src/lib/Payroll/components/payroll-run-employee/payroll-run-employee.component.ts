import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridDataResult, PageChangeEvent, DataStateChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { PayrollManagementService } from '../../services/payroll-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { process, State } from "@progress/kendo-data-query";
import { Observable } from 'rxjs';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DialogOverviewExampleDialog1 } from './payroll-run-employee-dialog';

@Component({
  selector: 'app-payroll-run-employee',
  templateUrl: './payroll-run-employee.component.html',
  styleUrls: ['./payroll-run-employee.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
  .k-grid tr.rowclass { background-color: yellow !important;}
`]
})
export class PayrollRunEmployeeComponent extends CustomAppBaseComponent implements OnInit {

  payrollRunEmployeeList: any[];
  public gridView: GridDataResult;
  public payslipDetails: any;
  payslipComponents: any;
  anyOperationInProgress: boolean;
  payrollRunId: any;
  payrollStartDate: any;
  payrollEndDate: any;
  netPayDifferentEmployees: boolean = false;
  temp: any;
  roleFeaturesIsInProgress$: Observable<boolean>;

  public state: State = {
    skip: 0,
    take: 50,

  };


  constructor(private payrollManagementService: PayrollManagementService,
    private route: ActivatedRoute, public dialog: MatDialog,private router: Router) { super() }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {

      this.payrollRunId = params.get('id');

    });
    super.ngOnInit();
    this.getPayrollList();
  }

  rowCallback = (context: RowClassArgs) => {
    const isEven = context.dataItem.actualPaidAmount != context.dataItem.previousMonthPaidAmount;
    return {
      rowclass: isEven
    };
  }

  getPayrollList() {
    this.anyOperationInProgress = true;
    this.payrollManagementService.getPayrollRunemployeeList(this.payrollRunId).subscribe((response: any) => {

      this.payrollRunEmployeeList = response.data;
      this.temp = response.data;
      this.anyOperationInProgress = false;
      this.payrollStartDate = this.payrollRunEmployeeList[0].payrollStartDate;
      this.payrollEndDate = this.payrollRunEmployeeList[0].payrollEndDate;
      this.filterList();
    })
  }

  changeNetPayDifferentEmployees($event) {
    this.netPayDifferentEmployees = $event.target.checked;
    this.filterList();
  }

  filterList() {
    if (this.netPayDifferentEmployees == true) {
      const temp = this.temp.filter(payrollRunEmployeeList =>
        (payrollRunEmployeeList.actualPaidAmount != payrollRunEmployeeList.previousMonthPaidAmount)
      );
      this.payrollRunEmployeeList = temp;
    }
    else {
      this.payrollRunEmployeeList = this.temp;
    }
    this.gridView = process(this.payrollRunEmployeeList, this.state);
    this.gridView = {
      data: this.payrollRunEmployeeList.slice(this.state.skip, this.state.skip + this.state.take),
      total: this.payrollRunEmployeeList.length
    };
  }
  public pageChange(event: PageChangeEvent): void {
    this.state.skip = event.skip;
    this.filterList();
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;

    this.gridView = process(this.payrollRunEmployeeList, this.state);
  }


  selectedRow(e, type) {
    this.openDialog(e, type);
  }

  openDialog(rowData, type): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog1, {
      height: "90vh",
      width: "62%",
      direction: 'ltr',
      disableClose: true,   
      data: { employeeId: rowData.employeeId, payrollRunId: this.payrollRunId, isDispalyPopup: true, type: type },
      panelClass: 'userstory-dialog-scroll'

    });

    dialogRef.afterClosed().subscribe(() => {
      this.getPayrollList();
    });
  }

  updatePayrollEmployeeStatus(dataItem) {
    dataItem.isHold = !dataItem.isHold;
    this.payrollManagementService.updatePayrollRunEmployee(dataItem).subscribe(() => {
      this.getPayrollList();
    })
  }

  goToProfile(userId) {
    this.router.navigate(["dashboard/profile", userId, "overview"]);
  }

  backClicked() {
    window.history.back();
  }
}
