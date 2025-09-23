import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { DashboardModule, EmployeeWorkLoggingReportComponent, EmployeeProductivityOnYearly, EmployeeHistoricalWorkReportComponent, UsersSpentTimeDetailsReportComponent, WorkItemsAnalysisReportComponent, EmployeeLogTimeDetailsReportComponent, InductionConfigurationComponent, 
  CustomFormSubmissionsComponent, ConfigurePerformanceComponent, PerformanceReportsComponent, EmployeeSpentTimeComponent, WorkAllocationSummaryChartComponent, UserStoriesDependencyOnMeComponent, 
  UserStoriesOtherDependencyComponent, ImminentDeadlinesComponent, EmployeesCurrentUserStoriesComponent, EmployeerunninggoalsComponent, ProjectrunninggoalsComponent, GoalsArchiveComponent, ProcessdashboardComponent, 
  LiveDashBoardComponent, EmployeeAttendanceComponent, EmployeeWorkingDaysComponent, DailyLogTimeReportComponent, MonthlyLogTimeReportComponent, LeavesReportComponent, EmployeeIndexComponent, DevQualityComponent, QaPerformanceComponent, UserStoriesWaitingForQaApprovalComponent, 
  BugReportComponent, EmployeeUserStoriesComponent, EveryDayTargetDetailsComponent, MorningLateEmployeeComponent, LunchBreakLateEmployeeComponent, MoreSpentTimeEmployeeComponent, TopFiftyPercentSpentEmployeeComponent, 
  BottomFiftyPercentSpentEmployeeComponent, MorningAndAfternoonLateEmployeeComponent, LateEmployeeCountVsDateComponent, LunchBreakLateEmployeeCountVsDateComponent } from "@thetradeengineorg1/snova-dashboard-module";



export class DashboardComponentSupplierService {

  static components =  [
    { name: "Work logging report", componentTypeObject: EmployeeWorkLoggingReportComponent },
    { name: "Productivity report", componentTypeObject: EmployeeProductivityOnYearly },
    { name: "Historical work report", componentTypeObject: EmployeeHistoricalWorkReportComponent },
    { name: "Users spent time details report", componentTypeObject: UsersSpentTimeDetailsReportComponent },
    { name: "Work items analysys board", componentTypeObject: WorkItemsAnalysisReportComponent },
    { name: "Work items log time details report", componentTypeObject: EmployeeLogTimeDetailsReportComponent },
    { name: "Induction configurations", componentTypeObject: InductionConfigurationComponent },
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
    { name: "Process dashboard", componentTypeObject: ProcessdashboardComponent },
    { name: "Live dashboard", componentTypeObject: LiveDashBoardComponent },
    { name: "Employee Attendance", componentTypeObject: EmployeeAttendanceComponent },
    { name: "Employee working days", componentTypeObject: EmployeeWorkingDaysComponent },
    { name: "Daily log time report", componentTypeObject: DailyLogTimeReportComponent },
    { name: "Monthly log time report", componentTypeObject: MonthlyLogTimeReportComponent },
    { name:  "Leaves report", componentTypeObject: LeavesReportComponent },
    { name: "Employee index", componentTypeObject: EmployeeIndexComponent },
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
    { name:"Lunch break late employee count Vs date", componentTypeObject: LunchBreakLateEmployeeCountVsDateComponent }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    DashboardModule
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
    CustomFormSubmissionsComponent,
    QaPerformanceComponent,
    EmployeeWorkingDaysComponent,
    EmployeeSpentTimeComponent,
    EmployeeAttendanceComponent,
    DailyLogTimeReportComponent,
    ProjectrunninggoalsComponent,
    EmployeeProductivityOnYearly,
    BottomFiftyPercentSpentEmployeeComponent,
    ProcessdashboardComponent
  ]
})
export class DashboardPackageModule {
  static componentService = DashboardComponentSupplierService;
}
