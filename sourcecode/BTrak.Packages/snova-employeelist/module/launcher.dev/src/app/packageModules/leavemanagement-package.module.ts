import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeaveManagementModule, LeaveManagementRoutes, LeavesDashBoardListComponent, MyLeavesListComponent,LeaveTypesListComponent,LeavesListComponent} from "@snovasys/snova-leave-management";
import { CommonModule } from '@angular/common';
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@snovasys/snova-shell-module';
import { info } from '../../app/common/modules';
import * as cloneDeep_ from 'lodash/cloneDeep';

const cloneDeep = cloneDeep_;

export class LeavesManagementComponentSupplierService {

    static components =  [
      {
          name: "Leaves dashboard",
          componentTypeObject: LeavesDashBoardListComponent
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
        ShellModule.forChild({ modules: cloneDeep((cloneDeep(info) as shellModulesInfo).modules) }),
        CommonModule
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue: (cloneDeep(info) as shellModulesInfo) }
    ],
    entryComponents: []
})

export class LeavesManagementPackageModule { 
    static componentService = LeavesManagementComponentSupplierService;
}
