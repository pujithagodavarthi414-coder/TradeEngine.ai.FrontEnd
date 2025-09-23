import { Routes } from "@angular/router";
import { AuditRoutes } from 'projects/project-components/src/lib/audits/audits.routing';
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
        //canActivate: [UnAuthGuard],
        loadChildren: () => import('./packageModules/sessions.module').then(m => m.SessionModule),
        data: { title: "Session" }
      }
    ]
  },
  {
    path: "",
   // canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard-management",
        redirectTo: "/audits/auditsview",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "audits",
    component: AdminLayoutComponent,
    //canActivate: [AuthGuard],
    children: AuditRoutes
  },
  {
    path: "**",
    redirectTo: "sessions/404"
  }
];
