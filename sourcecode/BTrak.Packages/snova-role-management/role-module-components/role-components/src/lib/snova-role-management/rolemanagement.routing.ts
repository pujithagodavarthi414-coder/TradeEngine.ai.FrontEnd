import { Routes } from "@angular/router";
import { RoleManagementContainerComponent } from "./containers/role-management";
import { EntityPermissionsComponent } from "./components/entity-permissions.component";
import { RolePermissionsComponent } from "./components/role-permissions.component";

export const RoleManagementRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: RoleManagementContainerComponent,
        data: { title: "Role Management", breadcrumb: "Role Management" },
        children: [
          {
            path: "",
            component: RolePermissionsComponent,
            data: { title: "Roles List", breadcrumb: "Roles" }
          },
          {
            path: "rolemanagement",
            component: RolePermissionsComponent,
            data: { title: "Roles List", breadcrumb: "Roles" }
          },
          {
            path: "entityrolemanagement",
            component: EntityPermissionsComponent,
            data: { title: "Entity role permissions", breadcrumb: "Entity role permissions" }
          },
        ]
      }
    ]
  }
];