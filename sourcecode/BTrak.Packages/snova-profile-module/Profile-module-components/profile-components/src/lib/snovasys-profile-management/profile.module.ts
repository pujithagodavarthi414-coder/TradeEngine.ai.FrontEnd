import { NgModule, SystemJsNgModuleLoader, NgModuleFactoryLoader, ModuleWithProviders } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';


import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormioModule } from 'angular-formio';
import { EditorModule } from "@tinymce/tinymce-angular";
import { SignaturePadModule } from "angular2-signaturepad";
import { NgSelectModule } from "@ng-select/ng-select";
import { ExcelModule, GridModule, PDFModule } from "@progress/kendo-angular-grid";
import { SnovasysMessageBoxModule } from  '@thetradeengineorg1/snova-message-box';
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
import { UserStoriesComponent } from './components/user-stories.component';
import { CanteenPurchasesComponent } from './components/canteenPurchases.component';
import { MyAssetsComponent } from './components/assets.component';
import { TimeSheetAuditComponent } from './components/timeSheetAudit.component';
import { EmployeeDetailsOverviewComponent } from './components/employee-details-overview.component';
import { PresentUserStoriesComponent } from './components/present-user-stories/present-user-stories.component';
import { MonthScheduler } from './pipes/history-scheduler.pipe';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { SoftLabelPipe } from './pipes/soft-labels.pipe';
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
import { DeadlineDateToDaysPipe } from './pipes/dead-line-date-filter.pipe';
import { TooltipService } from "@syncfusion/ej2-angular-heatmap";
import { LegendService } from "@syncfusion/ej2-angular-heatmap";
import { HeatMapModule } from "@syncfusion/ej2-angular-heatmap";
import { SnovasysCommentsModule } from '@thetradeengineorg1/snova-comments';
import { ViewTimeSheetComponentProfile } from './components/viewTimeSheet.component';
import { LeaveHistorySchedulerComponent } from './components/leave-history-scheduler.component';
import { LeaveDetailsCompnent } from './components/leave-details.component';
import { ConvertUserBreakToStringPipe } from './pipes/userbreaktostringconversion.pipe';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { MyProfilePageComponent } from './containers/my-profile.page.template';
import { ProfilePageOthersComponent } from './containers/profile-page-others.template';
import { RouterModule } from '@angular/router';
import { ProfilePageComponent } from './containers/profile.page';
import { FutureUserStoriesComponent } from './components/future-user-stories/future-user-stories.component';
import { PreviousUserStoriesComponent } from './components/previous-user-stories/previous-user-stories.component';
import { StatusReportsNamePipe } from './pipes/statusreportsnamefilter.pipe';
import { SelectAllComponent } from './components/select-all/select-all.component';
import { PerformanceSubmissionComponent } from './components/performance/performance-submission.component';
import { PerformanceDialogComponent } from './components/performance/performanceDialog.component';
import { MyLeavesListProfileComponent } from './components/my-leaves-list.component';
import { HrRecordComponent } from './components/hr-record/hr-record.component';
import { HistoricalWorkReportComponent } from './components/historical-work-report.component';
import { EmployeeSignatureComponent } from './components/signature/employee-signature-invitations.component';
import { SignatureDialogComponent } from './components/signature/signature-dialog.component';
import { InductionWorItemDialogComponent } from './components/induction-work-items/induction-workitem-dialog.component';
import { EmployeeInductionComponent } from './components/induction-work-items/employee-induction.component';
import { ExitWorItemDialogComponent } from './components/exit-work-items/exit-workitem-dialog.component';
import { EmployeeExitComponent } from './components/exit-work-items/employee-exit.component';
import { WorkAllocationSummaryChartProfileComponent } from './components/workallocation-summary-chart-profile.component';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { SignatureComponent } from './components/signature/signature.component';
import { SignatureBaseComponent } from './components/signature/signature-base.component';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { DynamicModule } from '@thetradeengineorg1/snova-ndc-dynamic';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { AppProfileGridsterComponent } from './components/hr-record/app-profile-gridster.component';
import { ProfileAppListComponent } from './components/hr-record/custom-app-list.component';
import { ProfileAppDialogComponent } from './components/hr-record/app-dialog.component';
import { profileModulesInfo } from './models/profileModulesInfo';
import { ProfileModulesService } from './services/profile.modules.service';
import { UserActivityComponent } from './components/user-activity.component';
import { BreakTimesDisplayComponent } from './components/break-timings-dialog.component';
import { UtcToLocalTimePipe } from './pipes/utoToLocalTime.pipe';
import { TimeZoneDataPipe } from './pipes/timeZoneData.pipe';
import { TimesheetModule } from '@thetradeengineorg1/snova-timesheet';
import { DragulaService } from 'ng2-dragula';
import { ProbationSubmissionComponent } from './components/probation/probation-submission.component';

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
  AppProfileGridsterComponent,
  CustomAppBaseComponent,
  SoftLabelPipe,
  ImminentDeadlinesProfileComponent,
  AvatarComponent,
  FetchSizedAndCachedImagePipe,
  RemoveSpecialCharactersPipe,
  UtcToLocalTimeWithDatePipe,
  WorkflowStatusFilterPipe,
  LanguagePipe,
  HeatMapDatePipe,
  ConvertUtcToLocalTimePipe,
  UserStoriesComponent,
  CanteenPurchasesComponent,
  MyAssetsComponent,
  TimeSheetAuditComponent,
  EmployeeDetailsOverviewComponent,
  FutureUserStoriesComponent,
  PresentUserStoriesComponent,
  PreviousUserStoriesComponent,
  MonthScheduler,
  MonthScheduler,
  StatusReportsNamePipe,
  ProfileAppListComponent,
  HoursandMinutesPipe,
  TimeZoneDataPipe,
  PaletteLabelPipe,
  DeadlineDateToDaysPipe,
  SelectAllComponent,
  ViewTimeSheetComponentProfile,
  PerformanceSubmissionComponent,
  LeaveHistorySchedulerComponent,
  LeaveDetailsCompnent,
  ConvertUserBreakToStringPipe,
  MyProfilePageComponent,
  ProfilePageComponent,
  ProfilePageOthersComponent,
  MyLeavesListProfileComponent,
  HrRecordComponent,
  HistoricalWorkReportComponent,
  UserActivityComponent,
  EmployeeSignatureComponent,
  SignatureDialogComponent,
  InductionWorItemDialogComponent,
  EmployeeInductionComponent,
  ExitWorItemDialogComponent,
  EmployeeExitComponent,
  PerformanceDialogComponent,
  WorkAllocationSummaryChartProfileComponent,
  SignatureComponent,
  SignatureBaseComponent,
  ProfileAppDialogComponent,
  BreakTimesDisplayComponent,
  UtcToLocalTimePipe,
  ProbationSubmissionComponent
];

@NgModule({
  imports: [
    DynamicModule,
    DynamicModule.withComponents([]),
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    HeatMapModule,
    MatAutocompleteModule,
    SnovasysCommentsModule,
    MatProgressBarModule,
    NgxGalleryModule,
    MatButtonModule,
    RouterModule,
    MatChipsModule,
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
    TimesheetModule
  ],
  declarations: [componentsToInclude],
  exports: [componentsToInclude],
  providers: [
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    TooltipService,
    GoogleAnalyticsService,
    LegendService,
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
    TimeZoneDataPipe,
    ConvertUtcToLocalTimePipe,
    DeadlineDateToDaysPipe,
    ConvertUserBreakToStringPipe,
    CookieService,
    UtcToLocalTimePipe,
    DragulaService
  ],
  entryComponents: [
    SignatureDialogComponent,
    InductionWorItemDialogComponent,
    ExitWorItemDialogComponent,
    PerformanceDialogComponent,
    ProfileAppDialogComponent,
    BreakTimesDisplayComponent
  ]
})

export class ProfileModule {
  static forChild(config: profileModulesInfo): ModuleWithProviders<ProfileModule> {
    return {
      ngModule: ProfileModule,
      providers: [
        { provide: ProfileModulesService, useValue: config }
      ]
    };
  }
}