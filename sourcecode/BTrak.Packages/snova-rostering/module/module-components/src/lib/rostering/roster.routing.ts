import { Routes } from "@angular/router";

import { ViewRosterComponent } from "./containers/view-employee-roster.component";
import { AddRosterComponent } from "./components/add-employee-roster.component";
import { ViewRosterDetailsComponent } from "./components/view-employee-roster-details.component";
// import { AdminLayoutComponent } from "app/shared/components/layouts/admin-layout/admin-layout.component";

export const RosterRoutes: Routes = [
  {
    path: '',
    component: ViewRosterComponent,
    data: { title: "Manage roster", breadcrumb: "Manage roster" }
  },
  {
    path: "createroster",
    component: AddRosterComponent,
    data: { title: "Create roster", breadcrumb: "Create roster" }
  },
  {
    path: "updateroster",
    component: ViewRosterDetailsComponent,
    data: { title: "Update roster", breadcrumb: "Update roster" }
  }
]
