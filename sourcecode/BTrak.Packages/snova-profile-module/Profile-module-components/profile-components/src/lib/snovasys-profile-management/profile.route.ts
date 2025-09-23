import { UserStoriesComponent } from './components/user-stories.component';
import { CanteenPurchasesComponent } from './components/canteenPurchases.component';
import { MyAssetsComponent } from './components/assets.component';
import { TimeSheetAuditComponent } from './components/timeSheetAudit.component';
import { ViewTimeSheetComponentProfile } from './components/viewTimeSheet.component';
import { EmployeeDetailsOverviewComponent } from './components/employee-details-overview.component';
import { MyProfilePageComponent } from './containers/my-profile.page.template';
import { LeaveHistorySchedulerComponent } from './components/leave-history-scheduler.component';
import { Routes } from '@angular/router';
import { ProfilePageOthersComponent } from './containers/profile-page-others.template';
import { ProfilePageComponent } from './containers/profile.page';
import { LeaveDetailsCompnent } from './components/leave-details.component';
import { EmployeeSignatureComponent } from './components/signature/employee-signature-invitations.component';
import { HistoricalWorkReportComponent } from './components/historical-work-report.component';
import { EmployeeInductionComponent } from './components/induction-work-items/employee-induction.component';
import { EmployeeExitComponent } from './components/exit-work-items/employee-exit.component';
import { PerformanceSubmissionComponent } from './components/performance/performance-submission.component';
import { HrRecordComponent } from './components/hr-record/hr-record.component';
import { MyLeavesListProfileComponent } from './components/my-leaves-list.component';
import { UserActivityComponent } from './components/user-activity.component';
import { ApproverTimeSheetSubmissionComponent } from '@thetradeengineorg1/snova-rostering-widget';
import { ProbationSubmissionComponent } from './components/probation/probation-submission.component';
export const ProfileRoutes: Routes = [
  {
    path: "",
    children: [
      { path: 'myProfile/:id', component: ProfilePageOthersComponent, data: { title: 'Profile', breadcrumb: 'Profile'} },
      {
        path: 'profile', component: MyProfilePageComponent, data: { title: 'My Profile', breadcrumb: 'My Profile' },
        children:
          [
            {
              path: '', component: ProfilePageComponent, data: { title: 'Hr record', breadcrumb: 'Hr record' },
              children:
                [
                  {
                    path: '', component: EmployeeDetailsOverviewComponent, data: { title: 'Hr record', breadcrumb: 'Hr record' }
                  }
                ]
            },
            {
              path: ':id', component: ProfilePageComponent, data: { title: 'Hr record', breadcrumb: 'Hr record' },
              children:
                [
                  {
                    path: '', component: EmployeeDetailsOverviewComponent, data: { title: 'Overview', breadcrumb: 'Overview' }
                  },
                  {
                    path: 'user-stories', component: UserStoriesComponent, data: { title: 'User stories', breadcrumb: 'User stories' }
                  },
                  {
                    path: 'canteen-purchases', component: CanteenPurchasesComponent, data: { title: 'Canteen purchases', breadcrumb: 'Canteen purchases' }
                  },
                  {
                    path: 'induction-work', component: EmployeeInductionComponent, data: { title: 'Canteen purchases', breadcrumb: 'Canteen purchases' }
                  },
                  {
                    path: 'exit-work', component: EmployeeExitComponent, data: { title: 'Exit Checklist', breadcrumb: 'Exit Checklist' }
                  },
                  {
                    path: 'signature-inviations', component: EmployeeSignatureComponent, data: { title: 'Canteen purchases', breadcrumb: 'Canteen purchases' }
                  },
                  {
                    path: 'assets', component: MyAssetsComponent, data: { title: 'Assets', breadcrumb: 'Assets' }
                  },
                  {
                    path: 'timesheet-audit', component: TimeSheetAuditComponent, data: { title: 'Timesheet audit', breadcrumb: 'Timesheet audit' }
                  },
                  {
                    path: 'view-time-sheet', component: ViewTimeSheetComponentProfile, data: { title: 'View timesheet', breadcrumb: 'View timesheet' }
                  },
                  {
                    path: 'overview', component: EmployeeDetailsOverviewComponent, data: { title: 'Overview', breadcrumb: 'Overview' }
                  },
                  {
                    path: 'hr-record', component: HrRecordComponent, data: { title: 'HR record', breadcrumb: 'HR record' },
                  },
                  {
                    path: 'hr-record/:tab', component: HrRecordComponent, data: { title: 'HR record', breadcrumb: 'HR record' },
                  },
                  {
                    path: 'leaves-permissions', component: MyLeavesListProfileComponent, data: { title: 'Leave permissions', breadcrumb: 'Leave permissions' }
                  },
                  {
                    path: 'performance', component: PerformanceSubmissionComponent, data: { title: 'performance', breadcrumb: 'performance' }
                  },
                  {
                    path: 'probation', component: ProbationSubmissionComponent, data: { title: 'performance', breadcrumb: 'performance' }
                  },
                  {
                    path: 'leave-history-scheduler', component: LeaveHistorySchedulerComponent, data: { title: 'Calendar', breadcrumb: 'Holidays and leaves' }
                  },
                  {
                    path: 'applicable-leaves', component: LeaveDetailsCompnent, data: { title: 'Leave allowance', breadcrumb: 'Leave allowance' }
                  },
                  {
                    path: 'historical-work-report', component: HistoricalWorkReportComponent, data: { title: 'Historical Work Report', breadcrumb: 'Historical Work Report' }
                  },
                  {
                    path: 'user-activity', component: UserActivityComponent, data: { title: 'Historical Work Report', breadcrumb: 'Historical Work Report' }
                  },
                  {
                    path: 'timesheetApproval', component: ApproverTimeSheetSubmissionComponent, data: { title: 'Timesheet approval', breadcrumb: 'Timesheet approval' }
                  }
                ]
            }
          ]
      }
    ]
  },
];