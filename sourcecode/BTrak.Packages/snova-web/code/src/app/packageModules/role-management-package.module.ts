import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { EntityPermissionsComponent, RolePermissionsComponent, RoleManagementModule, RoleManagementRoutes } from "@thetradeengineorg1/snova-role-management";
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { moduleLoader } from "app/common/constants/module-loader";
import { info } from 'app/common/constants/modules';

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
    ShellModule.forChild(moduleLoader as shellModulesInfo),
  ],
  declarations: [],
  exports: [],
  providers: [
    {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo }
  ],
  entryComponents: []
})

export class RoleManagementPackageModule {
  static componentService = RoleManagementComponentSupplierService;
}
