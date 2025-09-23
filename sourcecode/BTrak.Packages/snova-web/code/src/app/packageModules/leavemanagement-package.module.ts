import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeaveManagementModule, LeaveManagementRoutes, LeavesDashBoardListComponent, MyLeavesListComponent,LeaveTypesListComponent,LeavesListComponent} from "@thetradeengineorg1/snova-leave-management";
import { CommonModule } from '@angular/common';
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { moduleLoader } from 'app/common/constants/module-loader';

export class LeavesManagementComponentSupplierService {

    static components =  [
      {
          name: "Leaves dashboard",
          componentTypeObject: LeavesDashBoardListComponent
      },
      {
        name: "My Leaves",
        componentTypeObject: MyLeavesListComponent
    },
      {
        name: "My leaves list",
        componentTypeObject: MyLeavesListComponent
      },
      {
        name: "Leaves",  componentTypeObject:  MyLeavesListComponent,
      },
      {
        name: "Leave types",  componentTypeObject:  LeaveTypesListComponent,
      },
      {
        name: "Leaves list",  componentTypeObject:  LeavesListComponent,
      }
    ]
  }

@NgModule({
    imports: [
        LeaveManagementModule,
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children: LeaveManagementRoutes
            }
        ]),
        ShellModule.forChild(moduleLoader as shellModulesInfo),
        CommonModule
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo }
    ],
    entryComponents: []
})

export class LeavesManagementPackageModule { 
    static componentService = LeavesManagementComponentSupplierService;
}
