import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { AdhocUniqueDetailComponent, ProjectManagementComponentsModule } from '@thetradeengineorg1/snova-project-management';
import {
    StatusReportingComponent, StatusReportComponent, ViewreportsComponent,
    ViewindividualreportsComponent, StatusReportsModule
} from '@thetradeengineorg1/snova-status-reports-module';
import { DashboardModule,ConfigureProbationComponent, EmployeeWorkLoggingReportComponent, EmployeeProductivityOnYearly, EmployeeHistoricalWorkReportComponent, UsersSpentTimeDetailsReportComponent, WorkItemsAnalysisReportComponent, EmployeeLogTimeDetailsReportComponent, InductionConfigurationComponent, ExitConfigurationComponent,
    CustomFormSubmissionsComponent, ConfigurePerformanceComponent, PerformanceReportsComponent, EmployeeSpentTimeComponent, WorkAllocationSummaryChartComponent, UserStoriesDependencyOnMeComponent, 
    UserStoriesOtherDependencyComponent, ImminentDeadlinesComponent, EmployeesCurrentUserStoriesComponent, EmployeerunninggoalsComponent, ProjectrunninggoalsComponent, GoalsArchiveComponent, ProcessdashboardComponent, 
    LiveDashBoardComponent, EmployeeAttendanceComponent, EmployeeWorkingDaysComponent, DailyLogTimeReportComponent, MonthlyLogTimeReportComponent, LeavesReportComponent, EmployeeIndexComponent, DevQualityComponent, QaPerformanceComponent, UserStoriesWaitingForQaApprovalComponent, 
    BugReportComponent, EmployeeUserStoriesComponent, EveryDayTargetDetailsComponent, MorningLateEmployeeComponent, LunchBreakLateEmployeeComponent, MoreSpentTimeEmployeeComponent, TopFiftyPercentSpentEmployeeComponent, 
    BottomFiftyPercentSpentEmployeeComponent, MorningAndAfternoonLateEmployeeComponent, LateEmployeeCountVsDateComponent, LunchBreakLateEmployeeCountVsDateComponent, CustomCommentAppComponent, CompletedWorkItemsComponent, AssignedWorkItemsComponent } from '@thetradeengineorg1/snova-dashboard-module';
import { moduleLoader } from 'app/common/constants/module-loader';


export class DashboardComponentSupplierService {

    static components =  [
      { name: "Work logging report", componentTypeObject: EmployeeWorkLoggingReportComponent },
      { name: "Productivity report", componentTypeObject: EmployeeProductivityOnYearly },
      { name: "Work report", componentTypeObject: EmployeeHistoricalWorkReportComponent },
      { name: "Historical work report", componentTypeObject: EmployeeHistoricalWorkReportComponent },
      { name: "Users spent time details report", componentTypeObject: UsersSpentTimeDetailsReportComponent },
      { name: "Work items analysis board", componentTypeObject: WorkItemsAnalysisReportComponent },
      { name: "Work items log time details report", componentTypeObject: EmployeeLogTimeDetailsReportComponent },
      { name: "Induction configurations", componentTypeObject: InductionConfigurationComponent },
      { name: "Exit configurations", componentTypeObject: ExitConfigurationComponent },
      { name: "Form submissions", componentTypeObject: CustomFormSubmissionsComponent },
      { name: "Performance configurations", componentTypeObject: ConfigurePerformanceComponent },
      { name: "Performance reports", componentTypeObject: PerformanceReportsComponent },
      { name: "Employee spent time", componentTypeObject: EmployeeSpentTimeComponent },
      { name:  "Work allocation summary", componentTypeObject: WorkAllocationSummaryChartComponent },
      { name: "Work items dependency on me", componentTypeObject: UserStoriesDependencyOnMeComponent },
      { name: "Work items dependency on others", componentTypeObject: UserStoriesOtherDependencyComponent },
      { name: "Imminent deadlines", componentTypeObject: ImminentDeadlinesComponent },
      { name: "Employees current work items", componentTypeObject: EmployeesCurrentUserStoriesComponent },
      { name: "Actively running goals", componentTypeObject: EmployeerunninggoalsComponent },
      { name:  "Project actively running goals", componentTypeObject: ProjectrunninggoalsComponent },
      { name:  "Goals to archive", componentTypeObject: GoalsArchiveComponent },
      { name: "Goal Performance Indicator", componentTypeObject: ProcessdashboardComponent },
      { name: "Live dashboard", componentTypeObject: LiveDashBoardComponent },
      { name: "Employee Attendance", componentTypeObject: EmployeeAttendanceComponent },
      { name: "Employee working days", componentTypeObject: EmployeeWorkingDaysComponent },
      { name: "Daily log time report", componentTypeObject: DailyLogTimeReportComponent },
      { name: "Monthly log time report", componentTypeObject: MonthlyLogTimeReportComponent },
      { name:  "Leaves report", componentTypeObject: LeavesReportComponent },
      { name: "Productivity index", componentTypeObject: EmployeeIndexComponent },
      { name: "EmployeeIndex", componentTypeObject: EmployeeIndexComponent },
      { name: "Dev quality", componentTypeObject: DevQualityComponent },
      { name: "Qa performance", componentTypeObject: QaPerformanceComponent },
      { name: "Work items waiting for qa approval", componentTypeObject: UserStoriesWaitingForQaApprovalComponent },
      { name: "Bug report", componentTypeObject: BugReportComponent },
      { name: "Employee work items", componentTypeObject: EmployeeUserStoriesComponent },
      { name: "Everyday target details", componentTypeObject: EveryDayTargetDetailsComponent },
      { name: "Morning late employee", componentTypeObject: MorningLateEmployeeComponent },
      { name: "Lunch break late employee", componentTypeObject: LunchBreakLateEmployeeComponent },
      { name: "More spent time employee", componentTypeObject: MoreSpentTimeEmployeeComponent },
      { name:"Top fifty percent spent employee", componentTypeObject: TopFiftyPercentSpentEmployeeComponent },
      { name: "Bottom fifty percent spent employee", componentTypeObject: BottomFiftyPercentSpentEmployeeComponent },
      { name: "Morning and afternoon late employee", componentTypeObject: MorningAndAfternoonLateEmployeeComponent },
      { name: "Morning late employee count Vs date", componentTypeObject: LateEmployeeCountVsDateComponent },
      { name:"Lunch break late employee count Vs date", componentTypeObject: LunchBreakLateEmployeeCountVsDateComponent },
      { name:"Comments app", componentTypeObject: CustomCommentAppComponent },
      { name:"Completed work items", componentTypeObject: CompletedWorkItemsComponent },
      { name:"Assigned Work Items", componentTypeObject: AssignedWorkItemsComponent },
      { name:"Probation configurations", componentTypeObject: ConfigureProbationComponent }
    ];
  }

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "",
                component: AdminLayoutComponent,
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
                        path: 'view-reports/:id', component: ViewindividualreportsComponent, data: { title: 'View Individual Report', breadcrumb: 'View Individual Report' }
                    },
                    { path: 'adhoc-workitem/:id', component: AdhocUniqueDetailComponent, data: { title: 'AdhocWork' } },
                    // { path: 'myProfile/:id', component: ProfilePageOthersComponent, data: { title: 'Profile', breadcrumb: 'Profile' } },
                    // {
                    //     path: 'profile', component: MyProfilePageComponent, data: { title: 'My Profile', breadcrumb: 'My Profile' },
                    //     children:
                    //         [
                    //             {
                    //                 path: '', component: ProfilePageComponent, data: { title: 'Hr record', breadcrumb: 'Hr record' },
                    //                 children:
                    //                     [
                    //                         {
                    //                             path: '', component: EmployeeDetailsOverviewComponent, data: { title: 'Hr record', breadcrumb: 'Hr record' }
                    //                         }
                    //                     ]
                    //             },
                    //             {
                    //                 path: ':id', component: ProfilePageComponent, data: { title: 'Hr record', breadcrumb: 'Hr record' },
                    //                 children:
                    //                     [
                    //                         {
                    //                             path: '', component: EmployeeDetailsOverviewComponent, data: { title: 'Overview', breadcrumb: 'Overview' }
                    //                         },
                    //                         {
                    //                             path: 'user-stories', component: UserStoriesComponent, data: { title: 'User stories', breadcrumb: 'User stories' }
                    //                         },
                    //                         {
                    //                             path: 'canteen-purchases', component: CanteenPurchasesComponent, data: { title: 'Canteen purchases', breadcrumb: 'Canteen purchases' }
                    //                         },
                    //                         {
                    //                             path: 'induction-work', component: EmployeeInductionComponent, data: { title: 'Induction work', breadcrumb: 'Induction work' }
                    //                         },
                    //                         {
                    //                             path: 'signature-inviations', component: EmployeeSignatureComponent, data: { title: 'Signature invitations', breadcrumb: 'Signature invitations' }
                    //                         },
                    //                         {
                    //                             path: 'assets', component: MyAssetsComponent, data: { title: 'Assets', breadcrumb: 'Assets' }
                    //                         },
                    //                         {
                    //                             path: 'timesheet-audit', component: TimeSheetAuditComponent, data: { title: 'Timesheet audit', breadcrumb: 'Timesheet audit' }
                    //                         },
                    //                         {
                    //                             path: 'view-time-sheet', component: ViewTimeSheetComponentProfile, data: { title: 'View timesheet', breadcrumb: 'View timesheet' }
                    //                         },
                    //                         {
                    //                             path: 'overview', component: EmployeeDetailsOverviewComponent, data: { title: 'Overview', breadcrumb: 'Overview' }
                    //                         },
                    //                         // {
                    //                         //   path: 'hr-record', component: HrRecordComponent, data: { title: 'HR record', breadcrumb: 'HR record' },
                    //                         // },
                    //                         // {
                    //                         //   path: 'hr-record/:tab', component: HrRecordComponent, data: { title: 'HR record', breadcrumb: 'HR record' },
                    //                         // },
                    //                         {
                    //                             path: 'leaves-permissions', component: MyLeavesListComponent, data: { title: 'Leave permissions', breadcrumb: 'Leave permissions' }
                    //                         },
                    //                         {
                    //                             path: 'performance', component: PerformanceSubmissionComponent, data: { title: 'performance', breadcrumb: 'performance' }
                    //                         },
                    //                         {
                    //                             path: 'leave-history-scheduler', component: LeaveHistorySchedulerComponent, data: { title: 'Calendar', breadcrumb: 'Holidays and leaves' }
                    //                         },
                    //                         {
                    //                             path: 'applicable-leaves', component: LeaveDetailsCompnent, data: { title: 'Leave allowance', breadcrumb: 'Leave allowance' }
                    //                         },
                    //                         // {
                    //                         //     path: 'create-form', component: CreateformsComponent, data: { title: 'Create Form', breadcrumb: 'Create Form' }
                    //                         // },
                    //                         {
                    //                             path: 'historical-work-report', component: EmployeeHistoricalWorkReportComponent, data: { title: 'Historical Work Report', breadcrumb: 'Historical Work Report' }
                    //                         },
                    //                         {
                    //                             path: 'payslip', component: PaySlipComponent, data: { title: 'Payslip', breadcrumb: 'Payslip' }
                    //                         },
                    //                         {
                    //                             path: 'payroll-details', component: PayrollDetailsComponent, data: { title: 'Payroll details', breadcrumb: 'Payroll details' }
                    //                         }
                    //                     ]
                    //             }
                    //         ]
                    // }
                ]
            }]),
        CommonModule,
        ShellModule.forChild(moduleLoader as shellModulesInfo),
        ProjectManagementComponentsModule,
        DashboardModule.forChild(moduleLoader as any),
        StatusReportsModule
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo }
    ],
    entryComponents:[
        EmployeerunninggoalsComponent,
        BugReportComponent,
        DevQualityComponent,
        EmployeeIndexComponent,
        EmployeeUserStoriesComponent,
        EmployeesCurrentUserStoriesComponent,
        EveryDayTargetDetailsComponent,
        GoalsArchiveComponent,
        LiveDashBoardComponent,
        EmployeeWorkLoggingReportComponent,
        EmployeeLogTimeDetailsReportComponent,
        UserStoriesOtherDependencyComponent,
        UserStoriesDependencyOnMeComponent,
        WorkItemsAnalysisReportComponent,
        TopFiftyPercentSpentEmployeeComponent,
        UsersSpentTimeDetailsReportComponent,
        PerformanceReportsComponent,
        ConfigurePerformanceComponent,
        LateEmployeeCountVsDateComponent,
        MorningLateEmployeeComponent,
        MorningAndAfternoonLateEmployeeComponent,
        MonthlyLogTimeReportComponent,
        LunchBreakLateEmployeeCountVsDateComponent,
        LunchBreakLateEmployeeComponent,
        LeavesReportComponent,
        InductionConfigurationComponent,
        ExitConfigurationComponent,
        CustomFormSubmissionsComponent,
        QaPerformanceComponent,
        EmployeeWorkingDaysComponent,
        EmployeeSpentTimeComponent,
        EmployeeAttendanceComponent,
        DailyLogTimeReportComponent,
        ProjectrunninggoalsComponent,
        EmployeeProductivityOnYearly,
        BottomFiftyPercentSpentEmployeeComponent,
        ProcessdashboardComponent,
        UserStoriesWaitingForQaApprovalComponent,
        CustomCommentAppComponent,
        ConfigureProbationComponent
    ]
})
export class DashboardPackageModule {
    static componentService = DashboardComponentSupplierService;
  }