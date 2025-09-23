import { TimeUsageService } from './services/time-usage.service';

import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injector, SystemJsNgModuleLoader,  NgModuleFactoryLoader, ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '@progress/kendo-angular-dialog';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
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
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ChartsModule } from "ng2-charts";
import { SatPopoverModule } from "@ncstate/sat-popover";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { AvatarModule } from 'ngx-avatar';
import '@progress/kendo-ui';

import { ActivityTrackerRoutes } from './activitytracker.routing';
import { ActivityScreenshotsComponent } from './components/activity-screenshots-component';
import { UtcToLocalTimePipe } from '../globaldependencies/pipes/utctolocaltime.pipe';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { ActivityTimeFilterPipe } from '../globaldependencies/pipes/activityTimeConversion.pipe';
import { CapitalizeFirstPipe } from '../globaldependencies/pipes/capitalizeFirst.pipe';
import { SoftLabelPipe } from '../globaldependencies/pipes/softlabels.pipes';
import { TimeZoneDataPipe } from '../globaldependencies/pipes/timeZoneData.pipe';
import { AvatarComponent } from '../globaldependencies/components/avatar.component';
import { TimeagoModule } from "ngx-timeago";
import { TimeUsageComponent } from './components/time-usage.component';
import { WebsitesAndApplicationsComponent } from './components/websites-and-applications.component';
import { WebAppUsageComponent } from './components/web-app-usage.component';
import { TimeUsageDrillDownComponent } from './components/time-usage-drilldown.component';
import { ScreenshotsComponent } from './components/screenshots-component';
import { AppUsageReportComponent } from './components/app-usage-report.component';
import { EmployeeActivityLogDetailsComponent } from './components/employee-activity-log-details.component';
import { FetchSizedAndCachedImagePipe } from '../globaldependencies/pipes/fetchSizedAndCachedImage.pipe';
import { RosterEmployeeFilterPipe } from '../globaldependencies/pipes/roster-employee-filter.pipe';
import "../globaldependencies/helpers/fontawesome-icons"
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { createCustomElement } from "@angular/elements";
import { ActivityEmployeeRoleFilterPipe } from '../globaldependencies/pipes/activtiyEmployeeRole.pipe';
import { ActivityTrackerBryntumReportView } from './components/activity-tracker-bryntum-component';
import { ActivityTrackerScreeshotViewer } from './components/activity-tracker-screenshot-report-component';
import { ActivityTrackerBryntumSchedulerComponent } from './components/activity-bryntum-scheduler.component';
import { ViewTrackerTimeSheetComponent } from './components/view-timesheet.component';
import { DynamicModule } from '@snovasys/snova-ndc-dynamic';
import { TimesheetModule } from '@snovasys/snova-timesheet';
import { ActivityDashboardPageComponent } from './containers/activity-tracker-mainpage.component';
import { ActivityAppsComponent } from './components/activityapps.component';
import { ActivityTrackerHistoryComponent } from './components/activity-tracker-history.component';
import { ChartsModule as kendoCharts } from '@progress/kendo-angular-charts';
import { FileSizePipe } from '../globaldependencies/pipes/filesize-pipe';
import { NgxDropzoneModule } from "ngx-dropzone";
import { SelectAllComponent } from './components/select-all/select-all.component';
import { ActivityModeConfigComponent } from './components/activity-tracker-mode-config.component';
import { TrackerGridsterComponent } from './components/dashboards/tracker-gridster.component';
import { ProfileAppListComponent } from './components/dashboards/tracker-list-view.component';
import { TrackerDashboardComponent } from './components/dashboards/tracker-myDashboard.component';
import { TeamActivityComponent } from './components/team-activity-component';
import { ChartAllModule, AccumulationChartAllModule, RangeNavigatorAllModule } from '@syncfusion/ej2-angular-charts';
import { SummaryMainPageComponent } from './containers/summary-mainpage.component';
import { CreateAppCategoryDialogComponent } from './components/app-category/applicaton-category-dialog.component';
import { MinHourFilterPipe } from './pipes/minHrCoversion.pipe';
import { DetailedViewComponent } from './components/detailed-view.component';
import { LiveCastDialogComponent } from './components/live-cast-dialog-component';
import { ActivityModulesInfo } from './models/activity-tracker.model';
import { ActivityTrackerModuleService } from './services/activitytracker.module.services';

export const appRoutes: Routes = [{ path: "" }];

export function HttpLoaderFactory(httpClient: HttpClient) {
  console.log('inside http loader child');
  return new TranslateHttpLoader(httpClient, 'https://btrak406-development.snovasys.co.uk/assets/i18n/', '.json');
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
    FileSizePipe,
    CustomAppBaseComponent,
    RemoveSpecialCharactersPipe,
    ActivityTimeFilterPipe,
    CapitalizeFirstPipe,
    ActivityAppsComponent,
    ActivityModeConfigComponent,
    AvatarComponent,
    SoftLabelPipe,
    TimeZoneDataPipe,
    UtcToLocalTimePipe,
    FetchSizedAndCachedImagePipe,
    RosterEmployeeFilterPipe,
    ActivityEmployeeRoleFilterPipe,
    CreateAppCategoryDialogComponent,
    ActivityScreenshotsComponent,
    SelectAllComponent,
    TimeUsageComponent,
    WebsitesAndApplicationsComponent,
    WebAppUsageComponent,
    TimeUsageDrillDownComponent,
    ScreenshotsComponent,
    EmployeeActivityLogDetailsComponent,
    AppUsageReportComponent,
    ActivityDashboardPageComponent,
    ActivityTrackerBryntumReportView,
    ActivityTrackerScreeshotViewer,
    ActivityTrackerBryntumSchedulerComponent,
    ViewTrackerTimeSheetComponent,
    ActivityTrackerHistoryComponent,
    TrackerGridsterComponent,
    ProfileAppListComponent,
    TrackerDashboardComponent,
    TeamActivityComponent,
    SummaryMainPageComponent,
    MinHourFilterPipe,
    DetailedViewComponent,
    LiveCastDialogComponent
  ],
  imports: [
    CommonModule,
    // RouterModule.forChild(ActivityTrackerRoutes),
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    SharedModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    FormsModule,
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
    MatButtonToggleModule,
    SatPopoverModule,
    NgSelectModule,
    MatSlideToggleModule,
    NgxDropzoneModule,
    TranslateModule,
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
    MatIconModule,
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
    NgxDropzoneModule,
    ToastrModule.forRoot({
      timeOut: 5000
    }),
    TimesheetModule,
    DynamicModule.withComponents([]),
    kendoCharts,
    ChartAllModule,
    AccumulationChartAllModule,
    RangeNavigatorAllModule
  ],
  exports: [AppUsageReportComponent, CreateAppCategoryDialogComponent, TeamActivityComponent],
  providers: [DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    TranslateService,
    CookieService,
    SoftLabelPipe,
    TimeZoneDataPipe,
    ToastrService,
    FileSizePipe,
    ActivityTimeFilterPipe,
    FetchSizedAndCachedImagePipe,
    ActivityEmployeeRoleFilterPipe,
    MinHourFilterPipe,
    // { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    // { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    TimeUsageService
  ],

  // // entryComponents: [
  //   AvatarComponent,
  //   ActivityScreenshotsComponent,
  //   ActivityAppsComponent,
  //   ActivityModeConfigComponent,
  //   TimeUsageComponent,
  //   WebsitesAndApplicationsComponent,
  //   WebAppUsageComponent,
  //   TimeUsageDrillDownComponent,
  //   CreateAppCategoryDialogComponent,
  //   ScreenshotsComponent,
  //   EmployeeActivityLogDetailsComponent,
  //   AppUsageReportComponent,
  //   ActivityDashboardPageComponent,
  //   ActivityTrackerBryntumReportView,
  //   ActivityTrackerScreeshotViewer,
  //   ActivityTrackerBryntumSchedulerComponent,
  //   TeamActivityComponent,
  //   SummaryMainPageComponent,
  //   SelectAllComponent,
  //   LiveCastDialogComponent,
  //   DetailedViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActivityTrackerModule {
  static forChild(config: ActivityModulesInfo): ModuleWithProviders<ActivityTrackerModule> {
    return {
      ngModule: ActivityTrackerModule,
      providers: [
        { provide: ActivityTrackerModuleService, useValue: config }
      ]
    };
  }
  constructor(private injector: Injector) {
    const themeBaseColor = localStorage.getItem('themeColor');
    document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
    // customElements.define('app-fm-component-websites-and-applications', createCustomElement(WebsitesAndApplicationsComponent, { injector }));
    // customElements.define('app-fm-containers-page-activitydashboard', createCustomElement(ActivityDashboardPageComponent, { injector }));
  }
}
