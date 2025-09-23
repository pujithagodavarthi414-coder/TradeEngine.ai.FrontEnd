import { Routes } from "@angular/router";
import { UnAuthGuard, AuthGuard, AuthLayoutComponent } from "@snovasys/snova-authentication-module";
import { AdminLayoutComponent } from './admin-layout.component';

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
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard-management",
        redirectTo:"projects",
        pathMatch:"full"
      },
      {
        path: "projects",
        loadChildren: () => import('./packageModules/projects-route.module').then(m => m.ProjectsRouteModule),
        data: { title: "Projects", breadcrumb: "Projects" }
      },

    ]
  },
  {
    path: "**",
    redirectTo: "sessions/404"
  }
];
