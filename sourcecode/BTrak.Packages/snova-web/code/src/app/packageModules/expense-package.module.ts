import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ExpenseManagementModule, ExpenseViewComponent, MyExpensesComponent, ExpenseRoutes,ExpenseModulesService } from "@thetradeengineorg1/snova-expense-management"
import { AdminLayoutComponent, ShellModule, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { moduleLoader } from "app/common/constants/module-loader";

export class ExpenseComponentSupplierService {

  static components = [
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
    RouterModule.forChild([
      {
        path: '',
        component: AdminLayoutComponent,
        children: ExpenseRoutes
      }
    ]),
    CommonModule,
    ExpenseManagementModule.forChild(moduleLoader as any ),
    ShellModule.forChild(info as shellModulesInfo),
 
  ],
  providers: [
    {provide: ShellModulesService, useValue: info as shellModulesInfo},
    {provide: ExpenseModulesService, useValue: moduleLoader as any }
]
})
export class ExpensePackageModule {
  static componentService = ExpenseComponentSupplierService;
}
