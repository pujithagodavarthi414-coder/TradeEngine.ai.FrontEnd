import { Routes } from "@angular/router";
import { AuthGuard, AuthLayoutComponent, UnAuthGuard } from "@thetradeengineorg1/snova-authentication-module";
import { AddModuleComponent } from "@thetradeengineorg1/snova-module-tabs-module";

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
      },
      {
        path: "sco",
        canActivate: [UnAuthGuard],
        loadChildren: () => import('./packageModules/sco-billing.module').then(m => m.ScoModule),
        data: { title: "Billing Management", breadcrumb: "Billing Management" }
      },
      {
        path: "client",
        canActivate: [UnAuthGuard],
        loadChildren: () => import('./packageModules/clients-unauth.module').then(m => m.ClientsUnAuthModule),
        data: { title: "Billing Management", breadcrumb: "Billing Management" }
      },
      {
        path: "File",
        canActivate: [UnAuthGuard],
        loadChildren: () => import('./packageModules/clients-unauth.module').then(m => m.ClientsUnAuthModule),
        data: { title: "View custom file", breadcrumb: "View custom file" }
      },
      {
        path: "webview-unauth",
        canActivate: [UnAuthGuard],
        component: AuthLayoutComponent,
        loadChildren: () => import('./packageModules/app-builder-unauth.module').then(m => m.AppBuilderUnAuthModule),
        data: { title: "Web view unauth", breadcrumb: "Web view unauth" }
        },
        {
            path: "kyc-submission",
            canActivate: [UnAuthGuard],
            component: AuthLayoutComponent,
            loadChildren: () => import('./packageModules/app-builder-unauth.module').then(m => m.AppBuilderUnAuthModule),
            data: { title: "Custom Applications", breadcrumb: "Custom Applications" }
        }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "module",
        loadChildren: () => import('./packageModules/module-tabs.module').then(m => m.ModuleTabsModule),
        data: { title: "Module Management", breadcrumb: "Module Management" }
      },
    
      {
        path: "dashboard",
        loadChildren: () => import('./packageModules/profile.module').then(m => m.ProfileManagementModule),
        data: { title: "Dashboard", breadcrumb: "DASHBOARD" }
      },
      {
        path: "shell",
        loadChildren: () => import('./packageModules/shell-layout.module').then(m => m.ShellLayoutModule),
        data: { title: "shell", breadcrumb: "SHELL" }
      },
      {
        path: "application",
        loadChildren: () => import('./packageModules/application-form.module').then(m => m.ApplicationFormModule),
        data: { title: "Application", breadcrumb: "Application" }
      },
      {
        path: "dashboard",
        loadChildren: () => import('./packageModules/dashboard-package.module').then(m => m.DashboardPackageModule),
        data: { title: "Dashboard", breadcrumb: "DASHBOARD" }
      },
      {
        path: "chat",
        loadChildren: () => import('./packageModules/chat.module').then(m => m.ChatManagementModule),
        data: { title: "Chat", breadcrumb: "CHAT" }
      },
      {
        path: "projects",
        loadChildren: () => import('./packageModules/project-management-package.module').then(m => m.ProjectPackageModule),
        data: { title: "Projects", breadcrumb: "Projects" }
      },
      {
        path: "timesheet",
        loadChildren: () => import('./packageModules/time-sheet-package.module').then(m => m.TimesheetPackageModule),
        data: { title: "Time Sheet", breadcrumb: "Time Sheet" }
      },
      {
        path: "hrmanagment",
        loadChildren:
          () => import('./packageModules/employeeList.module').then(m => m.EmployeeDetailsListModule),
        data: { title: "HR Managment", breadcrumb: "HR Managment" }
      },
      {
        path: "leavemanagement",
        loadChildren:
          () => import('./packageModules/leavemanagement-package.module').then(m => m.LeavesManagementPackageModule),
        data: { title: "Leave Managment", breadcrumb: "Leave Managment" }
      },
      {
        path: "dashboard-management",
        loadChildren: () => import('./packageModules/widget-package.module').then(m => m.WidgetPackageModule),
        data: { title: "Dashboard Management", breadcrumb: "Dashboard Management" }
      },
      {
        path: "assetmanagement",
        loadChildren: () => import('./packageModules/assetmanagement.module').then(m => m.AssetModule),
        data: { title: "Assets", breadcrumb: "Assets" }
      },
      {
        path: "rolemanagement",
        loadChildren: () => import('./packageModules/role-management-package.module').then(m => m.RoleManagementPackageModule),
        data: { title: "Role Management", breadcrumb: "Role Management" }
      },
      // {
      //   path: "forms",
      //   loadChildren: "./packageModules/status-reports.module#StatusReportModule",
      //   data: { title: "Forms", breadcrumb: "Forms" }
      // },
      {
        path: "forms",
        loadChildren: () => import('./packageModules/app-builder-package.module').then(m => m.AppBuilderPacakgeModule),
        data: { title: "Custom Applications", breadcrumb: "Custom Applications" }
      },
      {
        path: "statusreports",
        loadChildren: () => import('./packageModules/status-reports.module').then(m => m.StatusReportPackageModule),
        data: { title: "Status reports", breadcrumb: "Status reports" }
      },
      {
        path: "applications",
        loadChildren: () => import('./packageModules/app-builder-package.module').then(m => m.AppBuilderPacakgeModule),
        data: { title: "Status Reporting", breadcrumb: "Status Reporting" }
      },
      {
        path: "webview",
        loadChildren: () => import('./packageModules/app-builder-package.module').then(m => m.AppBuilderPacakgeModule),
        data: { title: "Web view", breadcrumb: "Web view" }
      },
      {
        path: "activitytracker",
        loadChildren:
          () => import('./packageModules/activity-tracker.module').then(m => m.ActivityTrackModule),
        data: { title: "Activity tracker", breadcrumb: "Activity tracker" }
      },
      {
        path: "documentmanagement",
        loadChildren: () => import('./packageModules/documentmanagement-package.module').then(m => m.DocumentManagementPackageModule),
        data: { title: "Document Management", breadcrumb: "Document Management" }
      },
      {
        path: "billingmanagement",
        loadChildren: () => import('./packageModules/billing.module').then(m => m.BillingManagementModule),
        data: { title: "Billing Management", breadcrumb: "Billing Management" }
      },
      {
        path: "lives",
        loadChildren: () => import('./packageModules/trading-package.module').then(m => m.TradingModule),
        data: { title: "Trading Management", breadcrumb: "Trading Management" }
      },
      {
        path: "document",
        loadChildren:
          () => import('./packageModules/documentmanagement-package.module').then(m => m.DocumentManagementPackageModule),
        data: { title: "Document Management", breadcrumb: "Document Management" }
      },
      {
        path: "manageroster",
        loadChildren: () => import('./packageModules/roster-package.module').then(m => m.RosterPackageModule),
        data: { title: "Roster management", breadcrumb: "Roster management" }
      },
      {
        path: "audits",
        loadChildren: () => import('./packageModules/audits-package.module').then(m => m.AuditsPackageModule),
        data: { title: "Audits", breadcrumb: "Audits" }
      },
      {
        path: "payrollmanagement",
        loadChildren: () => import('./packageModules/payroll-package.module').then(m => m.PayrollPackageModule),
        data: { title: "Payroll", breadcrumb: "Payroll" }
      },
      {
        path: "app-store",
        loadChildren: () => import('./packageModules/appStore-package.module').then(m => m.AppStorePacakgeModule),
        data: { title: "Dashboard Management", breadcrumb: "Dashboard Management" }
      },
      {
        path: "expenses",
        loadChildren: () => import('./packageModules/expense-package.module').then(m => m.ExpensePackageModule),
        data: { title: "Expense", breadcrumb: "Expense" }
      },
      {
        path: "invoices",
        loadChildren: () => import('./packageModules/invoice-package.module').then(m => m.InvoicePackageModule),
        data: { title: "Invoices", breadcrumb: "Invoices" }
      },
      {
        path: "settings",
        loadChildren: () => import('./packageModules/admin-package.module').then(m => m.AdminPackageModule),
        data: { title: "Settings", breadcrumb: "Settings" }
      },
      {
        path: "productivity",
        loadChildren: () => import('./packageModules/admin-package.module').then(m => m.AdminPackageModule),
        data: { title: "productivity", breadcrumb: "productivity" }
      },
      {
        path: "recruitment",
        loadChildren: () => import('./packageModules/recruitment-package.module').then(m => m.RecruitmentModule),
        data: { title: "Recruitment", breadcrumb: "Recruitment" }
      }
    ]
  },
  {
    path: "**",
    redirectTo: "sessions/404"
  }
];
