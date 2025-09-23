import { Routes } from "@angular/router";
import { AuthGuard, AuthLayoutComponent, UnAuthGuard } from "@snovasys/snova-authentication-module";

export const rootProdRouterConfig: Routes = [
  {
    path: "",
    redirectTo: "sessions",
    pathMatch: "full"
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "sessions",
        canActivate: [UnAuthGuard],
        loadChildren: () => import('./packageModules/sessions.module').then(m => m.SessionModule),
        data: { title: "Session" }
      }
    ]
  },
  {
    path: "dashboard-management",
    canActivate: [AuthGuard],
    children: [
      {
        path: "**",
        loadChildren: () => import('./packageModules/tester.module').then(m => m.TesterModule),
        data: { title: "Dashboard Management", breadcrumb: "Dashboard Management" }
      }
    ]
  },
  {
    path: "**",
    redirectTo: "sessions/404"
  }
];
