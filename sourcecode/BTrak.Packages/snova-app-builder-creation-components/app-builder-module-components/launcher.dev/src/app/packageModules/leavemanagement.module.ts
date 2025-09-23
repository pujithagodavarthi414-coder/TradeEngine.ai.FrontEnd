import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { MyLeavesListComponent , LeaveManagementModule } from "@thetradeengineorg1/snova-leave-management";


export class LeaveManagementModuleService {

  static components = [
    {
      name: "Leaves",  componentTypeObject:  MyLeavesListComponent,
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    LeaveManagementModule
  ],
  entryComponents:[MyLeavesListComponent]
})
export class LeaveModule {
  static componentService = LeaveManagementModuleService;
}
