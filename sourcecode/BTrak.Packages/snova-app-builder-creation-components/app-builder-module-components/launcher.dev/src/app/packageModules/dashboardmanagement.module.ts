import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { EmployeeIndexComponent, DashboardModule } from "@thetradeengineorg1/snova-dashboard-module"

export class DashboardManagementModuleService {

  static components = [
    {
      name: "EmployeeIndex",  componentTypeObject:  EmployeeIndexComponent,
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    DashboardModule
  ],
  entryComponents:[EmployeeIndexComponent]
})
export class DashboardManagementModule {
  static componentService = DashboardManagementModuleService;
}
