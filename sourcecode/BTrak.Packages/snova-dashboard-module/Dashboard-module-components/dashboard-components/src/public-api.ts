import { DashboardModule } from './lib/snovasys-dashboard-management/dashboard.module';
import { EmployeeWorkLoggingReportComponent } from './lib/snovasys-dashboard-management/components/work-logging-report.component';
import { EmployeeProductivityOnYearly } from './lib/snovasys-dashboard-management/components/employee-productivity-on-yearly.component';
import { EmployeeHistoricalWorkReportComponent } from './lib/snovasys-dashboard-management/components/historical-work-report.component';
import { UsersSpentTimeDetailsReportComponent } from './lib/snovasys-dashboard-management/components/users-spent-time-details-report';
import { WorkItemsAnalysisReportComponent } from './lib/snovasys-dashboard-management/components/work-items-details-report.component';
import { EmployeeLogTimeDetailsReportComponent } from './lib/snovasys-dashboard-management/components/employee-logtime-details-report';
import { InductionConfigurationComponent } from './lib/snovasys-dashboard-management/components/induction-work-items/induction-configuration.component';
import { ExitConfigurationComponent } from './lib/snovasys-dashboard-management/components/exit-work-items/exit-configuration.component';
import { CustomFormSubmissionsComponent } from './lib/snovasys-dashboard-management/components/form-sumissions/form-submission.component';
import { ConfigurePerformanceComponent } from './lib/snovasys-dashboard-management/components/performance/configure-performance.component';
import { PerformanceReportsComponent } from './lib/snovasys-dashboard-management/components/performance/performance-report.component';
import { EmployeeSpentTimeComponent } from './lib/snovasys-dashboard-management/components/employee-spent-time.component';
import { WorkAllocationSummaryChartComponent } from './lib/snovasys-dashboard-management/components/work-allocaion-summary/workallocation-summary-chart.component';
import { UserStoriesDependencyOnMeComponent } from './lib/snovasys-dashboard-management/components/user-stories-dependency-on-me.component';
import { UserStoriesOtherDependencyComponent } from './lib/snovasys-dashboard-management/components/user-stories-other-dependency.component';
import { ImminentDeadlinesComponent } from './lib/snovasys-dashboard-management/components/imminentdeadlines.component';
import { EmployeesCurrentUserStoriesComponent } from './lib/snovasys-dashboard-management/components/employeescurrentuserstories.component';
import { EmployeerunninggoalsComponent } from './lib/snovasys-dashboard-management/components/employeerunninggoals/employeerunninggoals.component';
import { ProjectrunninggoalsComponent } from './lib/snovasys-dashboard-management/components/projectrunninggoals/projectrunninggoals.component';
import { GoalsArchiveComponent } from './lib/snovasys-dashboard-management/components/goals-to-archive.component';
import { ProcessdashboardComponent } from './lib/snovasys-dashboard-management/components/processdashboard/process-dashboard.component';
import { LiveDashBoardComponent } from './lib/snovasys-dashboard-management/components/live-dashboard.component';
import { EmployeeAttendanceComponent } from './lib/snovasys-dashboard-management/components/employee-attendance.componet';
import { EmployeeWorkingDaysComponent } from './lib/snovasys-dashboard-management/components/employee-working-days.component';
import { DailyLogTimeReportComponent } from './lib/snovasys-dashboard-management/components/daily-log-time-report.component';
import { MonthlyLogTimeReportComponent } from './lib/snovasys-dashboard-management/components/monthly-log-time-report.component';
import { LeavesReportComponent } from './lib/snovasys-dashboard-management/components/leaves-report.component';
import { EmployeeIndexComponent } from './lib/snovasys-dashboard-management/components/employee-index.component';
import { DevQualityComponent } from './lib/snovasys-dashboard-management/components/dev-quality.component';
import { QaPerformanceComponent } from './lib/snovasys-dashboard-management/components/qa-performance.component';
import { UserStoriesWaitingForQaApprovalComponent } from './lib/snovasys-dashboard-management/components/user-stories-waiting-for-qa-approval.component';
import { BugReportComponent } from './lib/snovasys-dashboard-management/components/bug-report.component';
import { EmployeeUserStoriesComponent } from './lib/snovasys-dashboard-management/components/employee-user-stories.component';
import { EveryDayTargetDetailsComponent } from './lib/snovasys-dashboard-management/components/every-day-target-details.component';
import { MorningLateEmployeeComponent } from './lib/snovasys-dashboard-management/components/morning-late-employee.component';
import { LunchBreakLateEmployeeComponent } from './lib/snovasys-dashboard-management/components/lunch-break-late-employee.component';
import { MoreSpentTimeEmployeeComponent } from './lib/snovasys-dashboard-management/components/more-spent-time-employee.component';
import { TopFiftyPercentSpentEmployeeComponent } from './lib/snovasys-dashboard-management/components/top-fifty-percent-spent-employee.component';
import { BottomFiftyPercentSpentEmployeeComponent } from './lib/snovasys-dashboard-management/components/bottom-fifty-percent-spent-employee.component';
import { MorningAndAfternoonLateEmployeeComponent } from './lib/snovasys-dashboard-management/components/morning-and-afternoon-late-employee.component';
import { LateEmployeeCountVsDateComponent } from './lib/snovasys-dashboard-management/components/late-employee-count-vs-date.component';
import { LunchBreakLateEmployeeCountVsDateComponent } from './lib/snovasys-dashboard-management/components/lunch-break-late-employee-count-vs-date.component';
import { HrDashboardService } from './lib/snovasys-dashboard-management/services/hr-dashboard.service';
import { ProductivityDashboardService } from './lib/snovasys-dashboard-management/services/productivity-dashboard.service';
import { PaletteLabelPipe } from './lib/snovasys-dashboard-management/pipes/palette-label.pipe';
import { MyProfileService } from './lib/snovasys-dashboard-management/services/myProfile.service';
import { CustomCommentAppComponent } from './lib/snovasys-dashboard-management/components/custom-comments-app/custom-comments-app.component';
import { CompletedWorkItemsComponent } from './lib/snovasys-dashboard-management/components/productivity/completed-workitem-component';
import { AssignedWorkItemsComponent } from './lib/snovasys-dashboard-management/components/productivity/assigned-workitems-component';
import { CustomAppBaseComponent } from './lib/globaldependencies/components/componentbase';
import { EmployeeIndexDetailedViewComponent } from './lib/snovasys-dashboard-management/components/employee-index-detailed-view.component';
import { FormSubmissionDialogComponent } from './lib/snovasys-dashboard-management/components/form-sumissions/formSubmissionDialog.component';
import { HeatmapChartComponent } from './lib/snovasys-dashboard-management/components/heatmap-chart.component';
import { ImminentDeadlinesDetailsComponent } from './lib/snovasys-dashboard-management/components/imminent-deadlines-details/imminent-deadlines-details.component';
import { PerformanceDialogComponent } from './lib/snovasys-dashboard-management/components/performance/performanceDialog.component';
import { TrackerScreenshotsComponent } from './lib/snovasys-dashboard-management/components/tracker-screenshots.component';
import { DeadlineDateToDaysPipe } from './lib/snovasys-dashboard-management/pipes/dead-line-date-filter.pipe';
import { SoftLabelPipe } from './lib/snovasys-dashboard-management/pipes/soft-labels.pipe';
import { StatusReportsNamePipe } from './lib/snovasys-dashboard-management/pipes/statusreportsnamefilter.pipe';
import { CovertTimeIntoUtcTime } from './lib/snovasys-dashboard-management/pipes/utcoffset.pipe';
import { YearDatePickerComponent } from './lib/snovasys-dashboard-management/components/year-date-picker/year-date-picker.component';
import { MonthScheduler } from './lib/snovasys-dashboard-management/pipes/history-scheduler.pipe';
import { WorkAllocationSummaryChartProfileComponent } from './lib/snovasys-dashboard-management/components/work-allocaion-summary/workallocation-summary-chart-profile.component';

import { ImminentDeadlinesProfileComponent } from './lib/snovasys-dashboard-management/components/imminentdeadlines-profile.component';
import { RemoveSpecialCharactersPipe } from './lib/globaldependencies/pipes/removeSpecialCharacters.pipe';
import { UtcToLocalTimeWithDatePipe } from './lib/globaldependencies/pipes/utctolocaltimewithdate.pipe';
import { WorkflowStatusFilterPipe } from './lib/globaldependencies/pipes/workflowstatus.pipes';
import { FetchSizedAndCachedImagePipe } from './lib/snovasys-dashboard-management/pipes/fetchCachedImage.pipe';
import { LanguagePipe } from './lib/snovasys-dashboard-management/pipes/language.pipe';
import { HeatMapDatePipe } from './lib/snovasys-dashboard-management/pipes/heatmap.date.pipe';
import { HoursandMinutesPipe } from './lib/snovasys-dashboard-management/pipes/minutesConversion.pipe';
import { UniqueUserstorysDialogComponent } from './lib/snovasys-dashboard-management/components/user-story-unique-dialog/unique-userstory-dialog.component';
import { CalendarViewComponent } from './lib/snovasys-dashboard-management/components/calender-view.component';
import { ProcessDashboardTableComponent } from './lib/snovasys-dashboard-management/components/processdashboard/process-dashboard-table.component';
import { SelectAllComponent } from './lib/snovasys-dashboard-management/components/select-all/select-all.component';
import { TimeZoneDataPipe } from './lib/snovasys-dashboard-management/pipes/timeZoneData.pipe';
import { DrillDownUserStoryPopupComponent } from './lib/snovasys-dashboard-management/containers/drilldown-userstoryPopup.page';
import { ConvertUtcToLocalTimePipe } from './lib/snovasys-dashboard-management/pipes/utctolocaltimeconversion.pipe';
import { AvatarComponent } from './lib/globaldependencies/components/avatar.component';
import { ConvertUserBreakToStringPipe } from './lib/snovasys-dashboard-management/pipes/userbreaktostringconversion.pipe';
import { ConfigureProbationComponent } from './lib/snovasys-dashboard-management/components/probation/configure-probation.component';
import { ProbationDialogComponent } from './lib/snovasys-dashboard-management/components/probation/probationDialog.component';

export { DashboardModule };
export { EmployeeWorkLoggingReportComponent }
export { EmployeeProductivityOnYearly }
export { EmployeeHistoricalWorkReportComponent }
export { UsersSpentTimeDetailsReportComponent }
export { WorkItemsAnalysisReportComponent }
export { EmployeeLogTimeDetailsReportComponent }
export { InductionConfigurationComponent }
export { ExitConfigurationComponent }
export { CustomFormSubmissionsComponent }
export { ConfigurePerformanceComponent }
export { PerformanceReportsComponent }
export { EmployeeSpentTimeComponent }
export { WorkAllocationSummaryChartComponent }
export { UserStoriesDependencyOnMeComponent }
export { UserStoriesOtherDependencyComponent }
export { ImminentDeadlinesComponent }
export { EmployeesCurrentUserStoriesComponent }
export { EmployeerunninggoalsComponent }
export { CustomCommentAppComponent }
export { ProjectrunninggoalsComponent }
export { GoalsArchiveComponent }
export { ProcessdashboardComponent }
export { LiveDashBoardComponent }
export { EmployeeAttendanceComponent }
export { EmployeeWorkingDaysComponent }
export { DailyLogTimeReportComponent }
export { MonthlyLogTimeReportComponent }
export { LeavesReportComponent }
export { EmployeeIndexComponent }
export { DevQualityComponent }
export { QaPerformanceComponent }
export { UserStoriesWaitingForQaApprovalComponent }
export { BugReportComponent }
export { EmployeeUserStoriesComponent }
export { EveryDayTargetDetailsComponent }
export { MorningLateEmployeeComponent }
export { LunchBreakLateEmployeeComponent }
export { MoreSpentTimeEmployeeComponent }
export { TopFiftyPercentSpentEmployeeComponent }
export { BottomFiftyPercentSpentEmployeeComponent }
export { MorningAndAfternoonLateEmployeeComponent }
export { LateEmployeeCountVsDateComponent }
export { LunchBreakLateEmployeeCountVsDateComponent }
export { HrDashboardService }
export { ProductivityDashboardService }
export { PaletteLabelPipe }
export { MyProfileService }
export { CompletedWorkItemsComponent }
export { AssignedWorkItemsComponent }
export{CovertTimeIntoUtcTime}
export{EmployeeIndexDetailedViewComponent}
export{TrackerScreenshotsComponent}
export{FormSubmissionDialogComponent}
export{PerformanceDialogComponent}
export{StatusReportsNamePipe}
export{AvatarComponent}
export{ConvertUserBreakToStringPipe}
export{ImminentDeadlinesProfileComponent}
export{WorkAllocationSummaryChartProfileComponent}
export{SoftLabelPipe}
export{UniqueUserstorysDialogComponent}
export{LanguagePipe}
export{HoursandMinutesPipe}
export{HeatMapDatePipe}
export{MonthScheduler}
export{RemoveSpecialCharactersPipe}
export{FetchSizedAndCachedImagePipe}
export{UtcToLocalTimeWithDatePipe}
export{WorkflowStatusFilterPipe}
export{YearDatePickerComponent}
export{HeatmapChartComponent}
export{CustomAppBaseComponent}
export{ImminentDeadlinesDetailsComponent}
export{DeadlineDateToDaysPipe}
export{CalendarViewComponent}
export{TimeZoneDataPipe}
export{ConvertUtcToLocalTimePipe}
export{DrillDownUserStoryPopupComponent}
export{SelectAllComponent}
export{ProcessDashboardTableComponent}
export{ConfigureProbationComponent}
export{ProbationDialogComponent}
export * from "./lib/snovasys-dashboard-management/store/reducers/index";
export * from "./lib/snovasys-dashboard-management/store/actions/user-profile.action";
export { State as dashboardState } from './lib/snovasys-dashboard-management/store/reducers/user-profile.reducers';
export { reducer as dashbaordReducer } from './lib/snovasys-dashboard-management/store/reducers/user-profile.reducers';
