import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injector, NgModuleFactoryLoader, SystemJsNgModuleLoader } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '@progress/kendo-angular-dialog';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexModule  } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartsModule } from "ng2-charts";
import { NgSelectModule } from '@ng-select/ng-select';
import { SatPopoverModule } from "@ncstate/sat-popover";
import { AvatarModule } from 'ngx-avatar';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { ActivityTrackerWidgetRoutes } from './activitytracker.routing';
import { UtcToLocalTimePipe } from '../globaldependencies/pipes/utctolocaltime.pipe';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { ActivityTimeFilterPipe } from '../globaldependencies/pipes/activityTimeConversion.pipe';
import { CapitalizeFirstPipe } from '../globaldependencies/pipes/capitalizeFirst.pipe';
import { SoftLabelPipe } from '../globaldependencies/pipes/softlabels.pipes';
import { AvatarComponent } from '../globaldependencies/components/avatar.component';
import { TimeagoModule } from "ngx-timeago";
import { FetchSizedAndCachedImagePipe } from '../globaldependencies/pipes/fetchSizedAndCachedImage.pipe';
import { RosterEmployeeActivityFilterPipe } from '../globaldependencies/pipes/roster-employee-activity-filter.pipe';
import "../globaldependencies/helpers/fontawesome-icons"
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { createCustomElement } from "@angular/elements";
import { ActivityAppsComponent } from './components/activityapps.component';
import { ActivityConfigComponent } from './components/activityconfig.component';
import { ActivityTrackerProductiveAppsComponent } from './components/activitytracker-productiveapps.component';
import { ProductiveAppIconComponent } from './components/productionapp-icon.component';
import { FileSizePipe } from '../globaldependencies/pipes/filesize-pipe';
import { ActivityEmployeeRoleFilterPipe } from '../globaldependencies/pipes/activtiyEmployeeRole.pipe';
import { NgxDropzoneModule } from "ngx-dropzone";
import { ActivityTrackerService } from './services/activitytracker-services';
import { ActivityTrackerBryntumReportView } from './components/activity-tracker-bryntum-component';
import { ActivityTrackerBryntumSchedulerComponent } from './components/activity-bryntum-scheduler.component';
import { ActivityTrackerScreeshotViewer } from './components/activity-tracker-screenshot-report-component';
import { ScreenshotWidgetComponent } from './components/screenshots-widget.component';
import { TrackerTimelineComponent } from './components/tracker-user-timeline/tracker-timeline.component';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { LatestScreenshotsComponent } from './components/latest-screenshots.component';
import { TimeZoneDataPipe } from './pipes/timeZoneData.pipe';
import { MostProductiveUsersComponent } from './components/most-productive-users.component';
import { MostUnProductiveUsersComponent } from './components/most-unproductive-users.component';
import { OfflineEmployeesComponent } from './components/offline-employees.component';
import { OnlineEmployeesComponent } from './components/online-employees.component';
import { IdleTimeUsersComponent } from './components/idle-time-users.component';
import { MinWorkingHoursComponent } from './components/min-working-hours.component';
import { TopSitesComponent } from './components/top-sites-component';
import '@progress/kendo-ui';
import { SnovasysMessageBoxModule } from "@snovasys/snova-message-box"
import { ChartsModule as KendoCharts } from "@progress/kendo-angular-charts";
import { TeamTopSitesComponent } from './components/team-websitesandApplications.component';
import { StartTimeComponent } from './components/start-time.component';
import { EndTimeComponent } from './components/end-time.component';

import { productivityComponent } from './components/productivity.component';
import { UnproductivityComponent } from './components/unproductivity.component';
import { SystemidletimeComponent } from './components/system-idle-time.component';
import { NeutralTimeComponent } from './components/neutraltime.component';
import { DeskTimeComponent } from './components/desktime.component';
import { TeamsizeComponent } from './components/teamsize.component';
import { PresentusersComponent } from './components/present-users.component';

import { ChartAllModule } from '@syncfusion/ej2-angular-charts';
import { TeamActivityComponent } from './components/team-activity.component';

import { ApplicationCategoryComponent } from './components/app-category/application-category.component';
import { AppCatogoryDialogComponent } from './components/app-category/applicaton-category-dialog.component';
import { AvailabilityCalendarComponent } from './components/availability-calendar/availability-calendar.component';
// import { DropDownButtonAllModule } from '@syncfusion/ej2-angular-splitbuttons';
// import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
// import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
// import { MaskedTextBoxModule, UploaderAllModule } from '@syncfusion/ej2-angular-inputs';
// import { ToolbarAllModule, ContextMenuAllModule } from '@syncfusion/ej2-angular-navigations';
// import { ButtonAllModule, CheckBoxAllModule, SwitchAllModule } from '@syncfusion/ej2-angular-buttons';
// import { NumericTextBoxAllModule, TextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
// import { DayService, MonthService, ResizeService, ScheduleAllModule, TimelineMonthService, TimelineViewsService } from '@syncfusion/ej2-angular-schedule';
import { LateemployeeComponent } from './components/late-employee.component';
import { AbsentemployeeComponent } from './components/absent-employee.component';
export const appRoutes: Routes = [{ path: "" }];

export function HttpLoaderFactory(httpClient: HttpClient) {
  console.log('inside http loader child');
  return new TranslateHttpLoader(httpClient, 'https://btrak489-test.snovasys.com/assets/i18n/', '.json');
}

export const MY_FORMATS = {
  parse: {
    dateInput: "DD-MMM-YYYY"
  },
  display: {
    dateInput: "DD-MMM-YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "DD-MMM-YYYY",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

const dialogMock = {
  close: () => { }
};

@NgModule({
  declarations: [
    //global   
    TeamsizeComponent,
    LateemployeeComponent,
    CustomAppBaseComponent,
    RemoveSpecialCharactersPipe,
    ActivityTimeFilterPipe,
    CapitalizeFirstPipe,
    TrackerTimelineComponent,
    AvatarComponent,
    SoftLabelPipe,
    ApplicationCategoryComponent,
    UtcToLocalTimePipe,
    FetchSizedAndCachedImagePipe,
    RosterEmployeeActivityFilterPipe,
    ActivityEmployeeRoleFilterPipe,
    FileSizePipe,
    ActivityAppsComponent,
    ActivityConfigComponent,
    ActivityTrackerProductiveAppsComponent,
    ProductiveAppIconComponent,
    ActivityTrackerBryntumReportView,
    ActivityTrackerBryntumSchedulerComponent,
    ActivityTrackerScreeshotViewer,
    ScreenshotWidgetComponent,
    LatestScreenshotsComponent,
    TimeZoneDataPipe,
    MostProductiveUsersComponent,
    MostUnProductiveUsersComponent,
    OfflineEmployeesComponent,
    OnlineEmployeesComponent,
    IdleTimeUsersComponent,
    MinWorkingHoursComponent,
    TopSitesComponent,
    TeamTopSitesComponent,
    StartTimeComponent,
    EndTimeComponent,
    productivityComponent,
    UnproductivityComponent,
    SystemidletimeComponent,
    NeutralTimeComponent,
    DeskTimeComponent,
    TeamActivityComponent,
    AppCatogoryDialogComponent,
    AvailabilityCalendarComponent,
    PresentusersComponent,
    AbsentemployeeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SnovasysMessageBoxModule,
    // ScheduleAllModule,
    // ToolbarAllModule,
    // ContextMenuAllModule,
    // DropDownButtonAllModule,
    // TreeViewModule,
    // DropDownListAllModule,
    // MultiSelectAllModule,
    // MaskedTextBoxModule,
    // UploaderAllModule,
    // ButtonAllModule,
    // CheckBoxAllModule,
    // SwitchAllModule,
    // NumericTextBoxAllModule,
    // TextBoxAllModule,
    SharedModule,
    FlexModule ,
    FormsModule,
    SchedulerModule,
    RouterModule,
    FontAwesomeModule,
    NgxDatatableModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    ChartsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule,
    MatTooltipModule,
    MatSidenavModule,
    SatPopoverModule,
    NgSelectModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    NgxDropzoneModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AvatarModule,
    TimeagoModule.forRoot(),
    SatPopoverModule,
    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule,
    NgxDatatableModule,
    FontAwesomeModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCheckboxModule,
    AvatarModule,
    NgSelectModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    NgxDropzoneModule,
    ToastrModule.forRoot({
      timeOut: 5000
    }),
    KendoCharts,
    ChartAllModule
  ],
  exports: [
    TrackerTimelineComponent, ActivityTrackerProductiveAppsComponent,
    ApplicationCategoryComponent, TeamActivityComponent,
    LatestScreenshotsComponent, MostProductiveUsersComponent,
    MostUnProductiveUsersComponent, OfflineEmployeesComponent,
    OnlineEmployeesComponent, IdleTimeUsersComponent,
    MinWorkingHoursComponent, TopSitesComponent,
    UnproductivityComponent, AppCatogoryDialogComponent,
    TeamTopSitesComponent, productivityComponent,
    SystemidletimeComponent, NeutralTimeComponent,
    DeskTimeComponent, StartTimeComponent,
    EndTimeComponent, PresentusersComponent, TeamsizeComponent,
    LateemployeeComponent, AbsentemployeeComponent,
    AvailabilityCalendarComponent],
  providers: [DatePipe,
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    TranslateService,
    CookieService,
    // DayService,
    // TimelineViewsService,
    // TimelineMonthService,
    // MonthService,
    // ResizeService,
    SoftLabelPipe,
    ToastrService,
    FileSizePipe,
    FetchSizedAndCachedImagePipe,
    // { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    // { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    ActivityTrackerService
  ],

  // entryComponents: [
  //   AvatarComponent, ActivityAppsComponent,
  //   ActivityConfigComponent, TeamActivityComponent,
  //   ActivityTrackerProductiveAppsComponent, TeamTopSitesComponent,
  //   ProductiveAppIconComponent, ActivityTrackerBryntumReportView,
  //   ActivityTrackerBryntumSchedulerComponent, ApplicationCategoryComponent,
  //   ActivityTrackerScreeshotViewer, AppCatogoryDialogComponent,
  //   ScreenshotWidgetComponent, TopSitesComponent, TeamsizeComponent,
  //   TrackerTimelineComponent, LatestScreenshotsComponent,
  //   MostProductiveUsersComponent, MostUnProductiveUsersComponent,
  //   OfflineEmployeesComponent, OnlineEmployeesComponent,
  //   IdleTimeUsersComponent, MinWorkingHoursComponent, AvailabilityCalendarComponent,
  //   productivityComponent, UnproductivityComponent, SystemidletimeComponent,
  //   NeutralTimeComponent, DeskTimeComponent, StartTimeComponent, EndTimeComponent,
  //   PresentusersComponent, LateemployeeComponent, AbsentemployeeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActivityTrackerWidgetModule {
  constructor(private injector: Injector) {
    const themeBaseColor = localStorage.getItem('themeColor');
    document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
  }
}
