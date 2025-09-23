import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { PermissionHistoryComponent, UpdatefeedtimesheetComponent, FeedtimesheetComponentProfile,PermissionRegisterComponent, SpentTimeDetailsComponent, ViewTimeSheetComponent, TimesheetModule } from "@thetradeengineorg1/snova-timesheet";


export class TimesheetComponentSupplierService {

  static components =  [
    { name: "Permission history", componentTypeObject: PermissionHistoryComponent },
    { name: "Permission register", componentTypeObject: PermissionRegisterComponent },
    { name: "Spent time details", componentTypeObject: SpentTimeDetailsComponent },
    { name: "Time sheet", componentTypeObject: ViewTimeSheetComponent },
    { name: "Employee feed time sheet", componentTypeObject: UpdatefeedtimesheetComponent },
    { name: "Time punch card", componentTypeObject: FeedtimesheetComponentProfile }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    TimesheetModule
  ]
})
export class TimesheetPackageModule {
  static componentService = TimesheetComponentSupplierService;
}
