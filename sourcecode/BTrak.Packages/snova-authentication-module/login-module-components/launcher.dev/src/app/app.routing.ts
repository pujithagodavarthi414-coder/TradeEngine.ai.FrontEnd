import { Routes } from "@angular/router";
import { AuthLayoutComponent } from 'login-module-components/login-components/src/lib/snova-authentication/auth-layout/auth-layout.component';
import { UnAuthGuard } from 'login-module-components/login-components/src/lib/snova-authentication/auth/unauth.guard';
import { AuthGuard } from 'login-module-components/login-components/src/lib/snova-authentication/auth/auth.guard';
import { SessionsRoutes } from 'login-module-components/login-components/src/public-api';
import { AppComponent } from './app.component';
import { DashboardLayoutComponent } from './dashboard-layout.component';

export const routerConfig: Routes = [
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
        children: SessionsRoutes,
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
        component: DashboardLayoutComponent,
        data: { title: "Dashboard Management", breadcrumb: "Dashboard Management" }
      },
    ]
  },
  {
    path: "**",
    redirectTo: "sessions/404"
  }
];
