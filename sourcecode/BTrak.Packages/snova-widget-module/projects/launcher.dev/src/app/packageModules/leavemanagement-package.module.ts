import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeaveManagementModule,  LeavesDashBoardListComponent } from "@thetradeengineorg1/snova-leave-management";
import { CommonModule } from '@angular/common';

export class LeavesManagementComponentSupplierService {

    static components =  [
      {
          name: "Leaves dashboard",
          componentTypeObject: LeavesDashBoardListComponent
      }
    ]
  }

@NgModule({
    imports: [
        LeaveManagementModule,
        CommonModule
    ],
    declarations: [],
    exports: [],
    providers: [],
    entryComponents: []
})

export class LeavesManagementPackageModule { 
    static componentService = LeavesManagementComponentSupplierService;
}
