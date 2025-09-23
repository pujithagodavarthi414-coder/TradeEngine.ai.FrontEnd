import { NgModuleFactoryLoader, ModuleWithProviders, NgModule, SystemJsNgModuleLoader } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormioModule } from 'angular-formio';
import { EditorModule } from "@tinymce/tinymce-angular";


import { SignaturePadModule } from "angular2-signaturepad";
import { NgSelectModule } from "@ng-select/ng-select";
import { ExcelModule, GridModule, PDFModule } from "@progress/kendo-angular-grid";
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { StatusReportsNamePipe } from '../snovasys-dashboard-management/pipes/statusreportsnamefilter.pipe';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { OrderModule } from 'ngx-order-pipe';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { TranslateModule } from '@ngx-translate/core'; 
import { TimeagoModule } from "ngx-timeago";
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { AvatarModule } from 'ngx-avatar';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as reducers from "./store/reducers/index";
import * as DashboardEffects from "./store/effects/index";
import { AngularSplitModule } from 'angular-split';
import { HeatmapChartComponent } from './components/heatmap-chart.component';
import { ImminentDeadlinesDetailsComponent } from './components/imminent-deadlines-details/imminent-deadlines-details.component';
import { YearDatePickerComponent } from './components/year-date-picker/year-date-picker.component';
import { MonthScheduler } from './pipes/history-scheduler.pipe';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { SoftLabelPipe } from './pipes/soft-labels.pipe';
import { WorkAllocationSummaryChartProfileComponent } from './components/work-allocaion-summary/workallocation-summary-chart-profile.component';
import { DrillDownUserStoryPopupComponent } from './containers/drilldown-userstoryPopup.page';
import { ImminentDeadlinesProfileComponent } from './components/imminentdeadlines-profile.component';
import { AvatarComponent } from '../globaldependencies/components/avatar.component';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchCachedImage.pipe';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { UtcToLocalTimeWithDatePipe } from '../globaldependencies/pipes/utctolocaltimewithdate.pipe';
import { WorkflowStatusFilterPipe } from '../globaldependencies/pipes/workflowstatus.pipes';
import { LanguagePipe } from './pipes/language.pipe';
import { HeatMapDatePipe } from './pipes/heatmap.date.pipe';
import { HoursandMinutesPipe } from './pipes/minutesConversion.pipe';
import { PaletteLabelPipe } from './pipes/palette-label.pipe';
import { ConvertUtcToLocalTimePipe } from './pipes/utctolocaltimeconversion.pipe';
import { LunchBreakLateEmployeeCountVsDateComponent } from './components/lunch-break-late-employee-count-vs-date.component';
import { LateEmployeeCountVsDateComponent } from './components/late-employee-count-vs-date.component';
import { EmployeeWorkLoggingReportComponent } from './components/work-logging-report.component';
import { EmployeeProductivityOnYearly } from './components/employee-productivity-on-yearly.component';
import { EmployeeHistoricalWorkReportComponent } from './components/historical-work-report.component';
import { UsersSpentTimeDetailsReportComponent } from './components/users-spent-time-details-report';
import { WorkItemsAnalysisReportComponent } from './components/work-items-details-report.component';
import { EmployeeLogTimeDetailsReportComponent } from './components/employee-logtime-details-report';
import { InductionConfigurationComponent } from './components/induction-work-items/induction-configuration.component';
import { ExitConfigurationComponent } from './components/exit-work-items/exit-configuration.component';
import { CustomFormSubmissionsComponent } from './components/form-sumissions/form-submission.component';
import { ConfigurePerformanceComponent } from './components/performance/configure-performance.component';
import { PerformanceReportsComponent } from './components/performance/performance-report.component';
import { EmployeeSpentTimeComponent } from './components/employee-spent-time.component';
import { WorkAllocationSummaryChartComponent } from './components/work-allocaion-summary/workallocation-summary-chart.component';
import { UserStoriesDependencyOnMeComponent } from './components/user-stories-dependency-on-me.component';
import { UserStoriesOtherDependencyComponent } from './components/user-stories-other-dependency.component';
import { ImminentDeadlinesComponent } from './components/imminentdeadlines.component';
import { EmployeesCurrentUserStoriesComponent } from './components/employeescurrentuserstories.component';
import { EmployeerunninggoalsComponent } from './components/employeerunninggoals/employeerunninggoals.component';
import { ProjectrunninggoalsComponent } from './components/projectrunninggoals/projectrunninggoals.component';
import { GoalsArchiveComponent } from './components/goals-to-archive.component';
import { ProcessdashboardComponent } from './components/processdashboard/process-dashboard.component';
import { LiveDashBoardComponent } from './components/live-dashboard.component';
import { EmployeeAttendanceComponent } from './components/employee-attendance.componet';
import { EmployeeWorkingDaysComponent } from './components/employee-working-days.component';
import { DailyLogTimeReportComponent } from './components/daily-log-time-report.component';
import { MonthlyLogTimeReportComponent } from './components/monthly-log-time-report.component';
import { LeavesReportComponent } from './components/leaves-report.component';
import { EmployeeIndexComponent } from './components/employee-index.component';
import { DevQualityComponent } from './components/dev-quality.component';
import { QaPerformanceComponent } from './components/qa-performance.component';
import { UserStoriesWaitingForQaApprovalComponent } from './components/user-stories-waiting-for-qa-approval.component';
import { BugReportComponent } from './components/bug-report.component';
import { EmployeeUserStoriesComponent } from './components/employee-user-stories.component';
import { EveryDayTargetDetailsComponent } from './components/every-day-target-details.component';
import { MorningLateEmployeeComponent } from './components/morning-late-employee.component';
import { LunchBreakLateEmployeeComponent } from './components/lunch-break-late-employee.component';
import { MoreSpentTimeEmployeeComponent } from './components/more-spent-time-employee.component';
import { TopFiftyPercentSpentEmployeeComponent } from './components/top-fifty-percent-spent-employee.component';
import { BottomFiftyPercentSpentEmployeeComponent } from './components/bottom-fifty-percent-spent-employee.component';
import { MorningAndAfternoonLateEmployeeComponent } from './components/morning-and-afternoon-late-employee.component';
import { FormSubmissionDialogComponent } from './components/form-sumissions/formSubmissionDialog.component';
import { PerformanceDialogComponent } from './components/performance/performanceDialog.component';
import { DeadlineDateToDaysPipe } from './pipes/dead-line-date-filter.pipe';
import { ProcessDashboardTableComponent } from './components/processdashboard/process-dashboard-table.component';
import { TooltipService } from "@syncfusion/ej2-angular-heatmap";
import { LegendService } from "@syncfusion/ej2-angular-heatmap";
import { HeatMapModule } from "@syncfusion/ej2-angular-heatmap";
import { SnovasysCommentsModule } from '@snovasys/snova-comments';
import { SelectAllComponent } from './components/select-all/select-all.component';
import { ConvertUserBreakToStringPipe } from './pipes/userbreaktostringconversion.pipe';
import { CalendarViewComponent } from './components/calender-view.component';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { CustomCommentAppComponent } from './components/custom-comments-app/custom-comments-app.component';
import { DynamicModule } from '@snovasys/snova-ndc-dynamic';
import { UniqueUserstorysDialogComponent } from './components/user-story-unique-dialog/unique-userstory-dialog.component';
import { TrackerScreenshotsComponent } from './components/tracker-screenshots.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { TimeZoneDataPipe } from './pipes/timeZoneData.pipe';
import { CovertTimeIntoUtcTime } from './pipes/utcoffset.pipe';
import { CompletedWorkItemsComponent } from './components/productivity/completed-workitem-component';
import { ChartAllModule, AccumulationChartAllModule, RangeNavigatorAllModule } from '@syncfusion/ej2-angular-charts';
import { AssignedWorkItemsComponent } from './components/productivity/assigned-workitems-component';
import '@progress/kendo-ui';
import { ChartsModule as kendoCharts } from '@progress/kendo-angular-charts';
import { EmployeeIndexDetailedViewComponent } from './components/employee-index-detailed-view.component';
import { dashboardModuleinfo } from './models/dashboard.model';
import { DashboardModulesService } from './services/dashboard.module.service';
import { ConfigureProbationComponent } from './components/probation/configure-probation.component';
import { ProbationDialogComponent } from './components/probation/probationDialog.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
  },
};

const componentsToInclude = [
  ConfigureProbationComponent,
  ProbationDialogComponent,
  CustomAppBaseComponent,
  DrillDownUserStoryPopupComponent,
  WorkAllocationSummaryChartProfileComponent,
  ImminentDeadlinesProfileComponent,
  AvatarComponent,
  FetchSizedAndCachedImagePipe,
  RemoveSpecialCharactersPipe,
  UtcToLocalTimeWithDatePipe,
  WorkflowStatusFilterPipe,
  LanguagePipe,
  SoftLabelPipe,
  HeatMapDatePipe,
  HoursandMinutesPipe,
  ConvertUtcToLocalTimePipe,
  CovertTimeIntoUtcTime,
  HeatmapChartComponent,
  ImminentDeadlinesDetailsComponent,
  YearDatePickerComponent,
  MonthScheduler,
  MonthScheduler,
  StatusReportsNamePipe,
  HoursandMinutesPipe,
  PaletteLabelPipe,
  EmployeeWorkLoggingReportComponent,
  EmployeeProductivityOnYearly,
  EmployeeHistoricalWorkReportComponent,
  UsersSpentTimeDetailsReportComponent,
  WorkItemsAnalysisReportComponent,
  EmployeeLogTimeDetailsReportComponent,
  InductionConfigurationComponent,
  ExitConfigurationComponent,
  CustomFormSubmissionsComponent,
  ConfigurePerformanceComponent,
  PerformanceReportsComponent,
  EmployeeSpentTimeComponent,
  WorkAllocationSummaryChartComponent,
  UserStoriesDependencyOnMeComponent,
  UserStoriesOtherDependencyComponent,
  ImminentDeadlinesComponent,
  EmployeesCurrentUserStoriesComponent,
  EmployeerunninggoalsComponent,
  CustomCommentAppComponent,
  ProjectrunninggoalsComponent,
  GoalsArchiveComponent,
  ProcessdashboardComponent,
  LiveDashBoardComponent,
  EmployeeAttendanceComponent,
  EmployeeWorkingDaysComponent,
  DailyLogTimeReportComponent,
  MonthlyLogTimeReportComponent,
  LeavesReportComponent,
  EmployeeIndexComponent,
  DevQualityComponent,
  QaPerformanceComponent,
  UserStoriesWaitingForQaApprovalComponent,
  BugReportComponent,
  EmployeeUserStoriesComponent,
  EveryDayTargetDetailsComponent,
  MorningLateEmployeeComponent,
  LunchBreakLateEmployeeComponent,
  MoreSpentTimeEmployeeComponent,
  TopFiftyPercentSpentEmployeeComponent,
  BottomFiftyPercentSpentEmployeeComponent,
  MorningAndAfternoonLateEmployeeComponent,
  LateEmployeeCountVsDateComponent,
  LunchBreakLateEmployeeCountVsDateComponent,
  FormSubmissionDialogComponent,
  PerformanceDialogComponent,
  DeadlineDateToDaysPipe,
  ProcessDashboardTableComponent,
  SelectAllComponent,
  ConvertUserBreakToStringPipe,
  CalendarViewComponent,
  UniqueUserstorysDialogComponent,
  TrackerScreenshotsComponent,
  TimeZoneDataPipe,
  CompletedWorkItemsComponent,AssignedWorkItemsComponent,EmployeeIndexDetailedViewComponent
];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    RouterModule,
    MatMenuModule,
    HeatMapModule,
    MatAutocompleteModule,
    SnovasysCommentsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    ChartAllModule, 
    AccumulationChartAllModule, 
    RangeNavigatorAllModule,
    MatListModule,
    EditorModule,
    SignaturePadModule,
    ExcelModule,
    GridModule,
    PDFModule,
    MatGridListModule,
    FlexLayoutModule,
    NgxDatatableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTabsModule,
    MatCheckboxModule,
    FontAwesomeModule,
    StoreModule.forFeature("Dashboard", reducers.reducers),
    EffectsModule.forFeature(DashboardEffects.allDashboardModuleEffects),
    MatTooltipModule,
    FormioModule,
    FormsModule,
    OrderModule,
    ReactiveFormsModule,
    TimeagoModule.forChild(),
    TranslateModule,
    SatPopoverModule,
    TranslateModule,
    Ng2GoogleChartsModule,
    AvatarModule,
    MatSlideToggleModule,
    AngularSplitModule,
    SnovasysMessageBoxModule,
    SchedulerModule,
    DynamicModule.withComponents([]),
    MatPaginatorModule,
    kendoCharts
  ],
  declarations: [componentsToInclude],
  exports: [componentsToInclude],
  providers: [
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    TooltipService,
    LegendService,
    CookieService,
    GoogleAnalyticsService,
    DatePipe,
    SoftLabelPipe,
    StatusReportsNamePipe,
    FetchSizedAndCachedImagePipe,
    RemoveSpecialCharactersPipe,
    UtcToLocalTimeWithDatePipe,
    WorkflowStatusFilterPipe,
    LanguagePipe,
    HeatMapDatePipe,
    PaletteLabelPipe,
    ConvertUtcToLocalTimePipe,
    CovertTimeIntoUtcTime,
    DeadlineDateToDaysPipe,
    ConvertUserBreakToStringPipe
  ],
  // entryComponents: [
  //   DrillDownUserStoryPopupComponent,
  //   FormSubmissionDialogComponent,
  //   PerformanceDialogComponent,
  //   EmployeeHistoricalWorkReportComponent,
  //   WorkAllocationSummaryChartComponent,
  //   WorkAllocationSummaryChartProfileComponent,
  //   ImminentDeadlinesComponent,
  //   MoreSpentTimeEmployeeComponent,
  //   UniqueUserstorysDialogComponent,
  //   CompletedWorkItemsComponent,
  //   AssignedWorkItemsComponent,
  //   EmployeeIndexDetailedViewComponent
  // ]
})

export class DashboardModule {
  static forChild(config: dashboardModuleinfo): ModuleWithProviders<DashboardModule> {
    return {
      ngModule: DashboardModule,
      providers: [
        { provide: DashboardModulesService, useValue: config }
      ]
    };
  }
}
