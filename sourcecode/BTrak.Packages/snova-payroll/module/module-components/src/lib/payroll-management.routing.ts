import { Routes } from "@angular/router";

import { PayrollRunEmployeeComponent } from "./Payroll/components/payroll-run-employee/payroll-run-employee.component";
import { PayrollRunComponent } from './Payroll/components/payroll-run/payroll-run.component';
import { PayRollConfigurationComponent } from './Payroll/components/payrollconfiguration.component';

export const PayrollmanagementRoutes: Routes = [
  {
    path: "payroll",
    component: PayrollRunComponent,
    data: { title: "Payroll", breadcrumb: "Payroll" }
  },
  {
    path: "payrollsummary/:id",
    component: PayrollRunEmployeeComponent,
    data: { title: "Payroll run employee", breadcrumb: "Payroll run employee" }
  },
  {
    path: 'payrolltemplate',
    component: PayRollConfigurationComponent,
    data: { title: 'payroll management' },
  },
  {
    path: 'payrolltemplate/:id',
    component: PayRollConfigurationComponent,
    data: { title: 'payroll management' },
  }
];