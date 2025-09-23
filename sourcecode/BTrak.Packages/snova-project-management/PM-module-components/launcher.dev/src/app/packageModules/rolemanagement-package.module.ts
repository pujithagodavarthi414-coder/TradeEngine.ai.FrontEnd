import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { EntityPermissionsComponent, RolePermissionsComponent, RoleManagementModule, RoleManagementRoutes } from "@snovasys/snova-role-management";
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@snovasys/snova-shell-module';
import { info } from '../constants/modules';
import cloneDeep_ from 'lodash/cloneDeep';

const cloneDeep = cloneDeep_;

export class RoleManagementComponentSupplierService {

  static components =  [
    { name: "Project role permissions", componentTypeObject: EntityPermissionsComponent },
    { name: "Role permissions", componentTypeObject: RolePermissionsComponent }
  ];
}
@NgModule({
  imports: [
    RoleManagementModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdminLayoutComponent,
        children: RoleManagementRoutes
      }
    ]),
    CommonModule,
    ShellModule.forChild({ modules: cloneDeep((cloneDeep(info) as shellModulesInfo).modules) })
  ],
  declarations: [],
  exports: [],
  providers: [
    {provide: ShellModulesService, useValue: (cloneDeep(info) as shellModulesInfo) }
  ],
  entryComponents: []
})

export class RoleManagementPackageModule {
  static componentService = RoleManagementComponentSupplierService;
}
