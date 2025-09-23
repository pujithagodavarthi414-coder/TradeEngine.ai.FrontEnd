import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { ExpenseManagementModule, ExpenseViewComponent, MyExpensesComponent } from "@thetradeengineorg1/snova-expense-management"


export class ExpenseComponentSupplierService {

  static components =  [
    {
        name: "All Expenses",
        componentTypeObject: ExpenseViewComponent
    },
    {
        name: "My Expenses",
        componentTypeObject: MyExpensesComponent
    },
    {
      name: "Pending Expenses",
      componentTypeObject: ExpenseViewComponent
    },
    {
      name: "Approved Expenses",
      componentTypeObject: ExpenseViewComponent
    },
  ]
}

@NgModule({
  imports: [
    CommonModule,
    ExpenseManagementModule
  ]
})
export class ExpensePackageModule {
  static componentService = ExpenseComponentSupplierService;
}
