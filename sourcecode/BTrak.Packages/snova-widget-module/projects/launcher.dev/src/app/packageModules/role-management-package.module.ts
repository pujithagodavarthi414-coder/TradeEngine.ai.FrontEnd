import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { EntityPermissionsComponent, RolePermissionsComponent, RoleManagementModule } from "@thetradeengineorg1/snova-role-management";

export class RoleManagementComponentSupplierService {

  static components =  [
    { name: "Project role permissions", componentTypeObject: EntityPermissionsComponent },
    { name: "Role permissions", componentTypeObject: RolePermissionsComponent }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    RoleManagementModule
  ]
})
export class RoleManagementPackageModule {
  static componentService = RoleManagementComponentSupplierService;
}
