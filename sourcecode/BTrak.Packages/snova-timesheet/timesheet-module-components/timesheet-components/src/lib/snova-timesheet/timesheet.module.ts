import { NgModule, Injector, ModuleWithProviders, NgModuleFactoryLoader, SystemJsNgModuleLoader } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SnovasysAvatarModule } from "@snovasys/snova-avatar";
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SatPopoverModule } from "@ncstate/sat-popover";

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { EditService } from './services/edit-permission.service';
import { DatePipe } from '@angular/common'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StoreModule } from '@ngrx/store';
import * as TimeSheetEffects from './store/effects/index';
import { EffectsModule } from '@ngrx/effects';
import * as TimeSheetReducers from './store/reducers/index';

import { FeedTimeSheetComponent } from './components/feedtimesheet.component';
import { PermissionHistoryComponent } from './components/permissionsHistory.component';
import { PermissionRegisterComponent } from './components/permissionsRegister.component';
import { SpentTimeDetailsComponent } from './components/spenttimedetails.component';
import { ViewTimeSheetComponent } from './components/viewtimesheet.component';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';
import { viewTimeSheetMonthlyComponent } from './components/timesheet-monthly.component';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { SoftLabelPipe } from '../globaldependencies/pipes/softlabels.pipes';
import { UtcToLocalTimeWithDatePipe } from '../globaldependencies/pipes/utctolocaltimewithdate.pipe';
import { WorkflowStatusFilterPipe } from '../globaldependencies/pipes/workflowstatus.pipes';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { AvatarModule } from 'ngx-avatar';
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { UtcToLocalTimePipe } from '../globaldependencies/pipes/utctolocaltime.pipe';
import { FetchSizedAndCachedImagePipe } from '../globaldependencies/pipes/fetchSizedAndCachedImage.pipe';
import { AvatarProfileComponent } from '../globaldependencies/components/avatar.component';
import { UserBreakToStringPipe } from '../globaldependencies/pipes/userbreaksconvertiontostring.pipe';
import { ConvertUserBreakToStringPipe } from '../globaldependencies/pipes/userbreaktostringconversion.pipe';
import { LanguagePipe } from '../globaldependencies/pipes/language.pipe';
import { DateDifferencePipe } from '../globaldependencies/pipes/datedifferenceFilter.pipe';
import { HoursandMinutesPipe } from '../globaldependencies/pipes/minutesConversion.pipe';
import { FeedtimesheetComponentProfile } from './components/feedtimesheet-profile.component';
import { UpdatefeedtimesheetComponent } from './components/update-feed-timesheet.component';
import { StatusReportDialogComponent } from './components/status-report/status-report-dialog.component';
import { DynamicModule } from '@snovasys/snova-ndc-dynamic';
import { TimesheetModulesInfo } from './models/timesheetModulesInfo';
import { TimesheetModuleService } from './services/timesheet.modules.service';
import { WorkItemsDialogComponent } from './components/all-work-items-dialog/all-work-items-dialog.component';
import { GridModule } from "@progress/kendo-angular-grid";
import '@progress/kendo-ui';
import { BreakTimeDisplayComponent } from './components/break-timings-dialog.component';
import { ActivityTrackerAppViewComponent } from './components/activity-tracker-dialog/activity-tracker-app-view.component';
import { ActivityTrackerDialogComponent } from './components/activity-tracker-dialog/activity-tracker-dialog.component';
import { ActivityTimeFilterPipe } from '../globaldependencies/pipes/activityTimeConversion.pipe';
import { SystemDetectBreaksComponent } from './components/activity-tracker-dialog/system-detect-breaks.component';
import { WorkLogDrillDownComponent } from './components/work-log-drilldown.component';
import { TimeZoneDataPipe } from '../globaldependencies/pipes/timeZoneData.pipe';
import { TimesheetService } from './services/timesheet-service.service';
import { TrackerScreenshotsComponent } from './components/tracker-screenshots.component';
import { ChartsModule as kendoCharts } from '@progress/kendo-angular-charts';
import 'hammerjs';
import { UserCommitsViewComponent } from './components/activity-tracker-dialog/user-commits.component';
import { AllLateUsersComponent } from './components/all-late-users.component';
import { AllAbsenceUsersComponent } from './components/all-absence-users.component';
import { TimeZoneNamePipe } from '../globaldependencies/pipes/timeZoneName.pipe';
import { LiveCastDialogComponent } from './components/activity-tracker-dialog/live-cast-dialog-component';
 
export const MY_FORMATS = {
  parse: {
    dateInput: "LL"
  },
  display: {
    dateInput: "DD MMM yyyy",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

export const COMPONENTS = [
  FeedTimeSheetComponent,
  PermissionHistoryComponent,
  PermissionRegisterComponent,
  SpentTimeDetailsComponent,
  ViewTimeSheetComponent,
  viewTimeSheetMonthlyComponent,
  StatusReportDialogComponent,
  WorkItemsDialogComponent,
  FeedtimesheetComponentProfile,
  UpdatefeedtimesheetComponent,
  RemoveSpecialCharactersPipe,
  SoftLabelPipe,
  UtcToLocalTimeWithDatePipe,
  WorkflowStatusFilterPipe,
  CustomAppBaseComponent,
  UtcToLocalTimePipe,
  TimeZoneDataPipe,
  TimeZoneNamePipe,
  FetchSizedAndCachedImagePipe,
  AvatarProfileComponent,
  UserBreakToStringPipe,
  ConvertUserBreakToStringPipe,
  BreakTimeDisplayComponent,
  LanguagePipe,
  DateDifferencePipe,
  HoursandMinutesPipe,
  ActivityTrackerAppViewComponent,
  UserCommitsViewComponent,
  ActivityTrackerDialogComponent,
  ActivityTimeFilterPipe,
  SystemDetectBreaksComponent,
  WorkLogDrillDownComponent,
  TrackerScreenshotsComponent,
  AllLateUsersComponent,
  AllAbsenceUsersComponent,
  LiveCastDialogComponent
];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    DynamicModule.withComponents([]),
    MatListModule,
    MatGridListModule,
    FlexLayoutModule,
    GridModule,
    NgxDatatableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    RouterModule,
    StoreModule.forFeature("timeSheetManagement", TimeSheetReducers.reducers),
    EffectsModule.forFeature(TimeSheetEffects.allAssetModuleEffects),
    MatExpansionModule,
    MatSlideToggleModule,
    FontAwesomeModule,
    SatPopoverModule,
    TranslateModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    ToastrModule,
    HttpClientModule,
    SnovasysMessageBoxModule,
    AvatarModule,
    SnovasysAvatarModule,
    NgxMaterialTimepickerModule,
    kendoCharts
  ],  
  // tslint:disable-next-line:max-line-length
  declarations: [COMPONENTS],
  exports:[COMPONENTS],
  entryComponents: [viewTimeSheetMonthlyComponent, BreakTimeDisplayComponent,TrackerScreenshotsComponent, AllLateUsersComponent,AllAbsenceUsersComponent, FeedtimesheetComponentProfile, StatusReportDialogComponent, WorkLogDrillDownComponent, WorkItemsDialogComponent, ActivityTrackerDialogComponent],
  providers: [
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    EditService,
    DatePipe,
    TranslateService,
    TimesheetService,
    GoogleAnalyticsService,
    CookieService,
    RemoveSpecialCharactersPipe,
    SoftLabelPipe,
    UtcToLocalTimeWithDatePipe,
    WorkflowStatusFilterPipe,
    UtcToLocalTimePipe,
    TimeZoneDataPipe,
    TimeZoneNamePipe,
    FetchSizedAndCachedImagePipe,
    UserBreakToStringPipe,
    ConvertUserBreakToStringPipe,
    LanguagePipe,
    DateDifferencePipe,
    HoursandMinutesPipe
  ]
})

export class TimesheetModule {
  static forChild(config: TimesheetModulesInfo): ModuleWithProviders<TimesheetModule> {
    return {
      ngModule: TimesheetModule,
      providers: [
        { provide: TimesheetModuleService, useValue: config }
      ]
    };
  }
}