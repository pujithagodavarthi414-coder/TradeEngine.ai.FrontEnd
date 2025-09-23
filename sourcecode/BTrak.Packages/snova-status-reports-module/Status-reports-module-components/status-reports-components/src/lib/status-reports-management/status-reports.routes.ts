import { Routes } from '@angular/router';
import { StatusReportComponent } from './components/statusreport.component';
import { ViewreportsComponent } from './components/viewreports.component';
import { StatusReportingComponent } from './components/statusReporting.component';

export const StatusReportRoutes: Routes = [{
    path: "",
    children: [
        {
            path: 'status-reporting', component: StatusReportingComponent, data: { title: 'Status reporting', breadcrumb: 'Status reporting' }
        },
        {
            path: 'status-report-configuration', component: StatusReportComponent, data: { title: 'Status report', breadcrumb: 'Status report' }
        },
        {
            path: 'view-reports', component: ViewreportsComponent, data: { title: 'View Reports', breadcrumb: 'View Reports' }
        },
        {
            path: 'view-reports/:tab', component: ViewreportsComponent, data: { title: 'View Reports', breadcrumb: 'View Reports' }
        }
    ]
}]
