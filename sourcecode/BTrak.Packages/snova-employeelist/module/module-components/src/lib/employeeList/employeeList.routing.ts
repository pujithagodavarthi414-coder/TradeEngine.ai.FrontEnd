import { Routes } from "@angular/router";

import { EmployeeListComponent } from '../employeeList/components/employee-list.component';
import { EmployeeListPageComponent } from './components/employeeList.page';
import { HrAreaComponent } from './components/hr-area-component';

export const EmployeeListRouting: Routes = [

  {
    path: "",
    children: [
    {
    path: "",
    component: HrAreaComponent,
    data: { title: "HR management" }
  },
  {
    path: "employeelist",
    component: HrAreaComponent,
    data: { title: "HR management" }
  },
  {
    path: ":tab",
    component: HrAreaComponent,
    data: { title: "HR management" }
  }
]
  }
];