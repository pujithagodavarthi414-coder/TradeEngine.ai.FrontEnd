import { Routes } from '@angular/router';
import { StatusReportRoutes } from 'Status-reports-module-components/status-reports-components/src/lib/status-reports-management/status-reports.routes';

export const appRoutes: Routes = [{
    path: "statusreports",
    children: StatusReportRoutes,
    data: { title: "Forms", breadcrumb: "Forms" }
}]
