import { Routes } from '@angular/router';
import { FeedTimeSheetComponent } from './components/feedtimesheet.component';
import { ViewTimeSheetComponent } from './components/viewtimesheet.component';
import { PermissionHistoryComponent } from './components/permissionsHistory.component';
import { PermissionRegisterComponent } from './components/permissionsRegister.component';
import { SpentTimeDetailsComponent } from './components/spenttimedetails.component';
import { viewTimeSheetMonthlyComponent } from './components/timesheet-monthly.component';
import { FeedtimesheetComponentProfile } from './components/feedtimesheet-profile.component';
import { UpdatefeedtimesheetComponent } from './components/update-feed-timesheet.component';

export const TimesheetRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: '',
        children: [{
          path: 'viewtimesheet',
          component: ViewTimeSheetComponent,
          data: { title: 'View Time Sheet', breadcrumb: 'View Time Sheet' },
        },
        {
          path: 'viewhistory',
          component: PermissionHistoryComponent,
          data: { title: 'View permission history', breadcrumb: 'view permission history' },
        },
        {
          path: 'viewregister',
          component: PermissionRegisterComponent,
          data: { title: 'View permission register', breadcrumb: 'View permission register' },
        },
        {
          path: 'timepunchcard',
          component: FeedtimesheetComponentProfile,
          data: { title: 'Time punch card', breadcrumb: 'Time punch card' },
        },
        {
          path: 'employeefeedtimesheet',
          component: UpdatefeedtimesheetComponent,
          data: { title: 'Employee feed time sheet', breadcrumb: 'Employee feed time sheet' },
        },
        {
          path: 'spenttimedetails',
          component: SpentTimeDetailsComponent,
          data: { title: 'Spent Time Details', breadcrumb: 'Spent Time Details' },
        },
        {
          path: "viewTimeSheetMonthly/:id",
          component: viewTimeSheetMonthlyComponent,
          data: { title: "View Time Sheet Monthly", breadcrumb: "View Time Sheet Monthly" }
        },
        ]
      }
    ]
  }
];