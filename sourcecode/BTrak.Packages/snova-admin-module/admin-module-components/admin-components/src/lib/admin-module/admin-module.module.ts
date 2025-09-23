import { NgModule, Injector, ModuleWithProviders } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CustomAccessibleIpAddressComponent } from './components/accessible-ip-address/accessible-address.component';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SatPopoverModule } from "@ncstate/sat-popover";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ColorPickerModule } from "ngx-color-picker";
import { CompanyIntroducedByComponent } from './components/company-structure/company-introduced.component';
import { CompanyLocationComponent } from './components/company-structure/company-location.component';
import { DateFormatComponent } from './components/company-structure/date-format.component';
import { MainUseCaseComponent } from './components/company-structure/main-usecase.component';
import { NumberFormatComponent } from './components/company-structure/number-format.component';
import { TimeFormatComponent } from './components/company-structure/time-format.component';
import { ExpenseCategoryDetailsComponent } from './components/expense-management/expense-category.component';
import { MerchantDataComponent } from './components/expense-management/merchant.component';
import { AppsettingsComponent } from './components/mastersettings/appsetting.component';
import { TimeConfigurationSettingsComponent } from './components/mastersettings/time-configuration-settings.component';
import { BranchComponent } from './components/hrm/branch.component';
import { ContractTypeComponent } from './components/hrm/contract-type.component';
import { CountryComponent } from './components/hrm/country.component';
import { CurrencyComponent } from './components/hrm/currency.component';
import { DeapartmentComponent } from './components/hrm/department.component';
import { DesignationComponent } from './components/hrm/designation.component';
import { EducationlevelComponent } from './components/hrm/educationlevel.component';
import { EmploymentStatusComponent } from './components/hrm/employment-status.component';
import { JobCategoryComponent } from './components/hrm/job-category.component';
import { LanguagesComponent } from './components/hrm/language.component';
import { LicenseTypeComponent } from './components/hrm/license-type.component';
import { MembershipComponent } from './components/hrm/memberships.component';
import { NationalityComponent } from './components/hrm/nationality.component';
import { PayGradeComponent } from './components/hrm/pay-grade.component';
import { PayfrequencyComponent } from './components/hrm/payfrequency.component';
import { PaymentMethodComponent } from './components/hrm/payment-method.component';
import { PaymentTypeComponent } from './components/hrm/payment-type.component';
import { RateTypeComponent } from './components/hrm/rate-type.component';
import { RegionComponent } from './components/hrm/region.component';
import { ReportingMethodComponent } from './components/hrm/reporting-method.component';
import { SkillsComponent } from './components/hrm/skills.component';
import { StateComponent } from './components/hrm/state.component';
import { TimeZoneComponent } from './components/hrm/time-zone.component';
import { WebHookComponent } from './components/hrm/webhook.component';
import { BugPriorityComponent } from './components/projects/bug-priority.component';
import { GoalReplanTypeComponent } from './components/projects/goal-replan-type.component';
import { ProjectTypeComponent } from './components/projects/project-type.component';
import { UserStoryReplanTypeComponent } from './components/projects/user-story-replan-type.component';
import { UserStoryStatusComponent } from './components/projects/user-story-status.component';
import { UserStorySubTypeComponent } from './components/projects/user-story-sub-type.component';
import { BoardTypeApiComponent } from './components/projects/admin/boardtypeapi.component';
import { BoardTypeWorkFlowComponent } from './components/projects/admin/boardTypeWorkFlow.component';
import { ConsideredHoursComponent } from './components/projects/admin/consideredhours.component';
import { ProcessDashboardStatusComponent } from './components/projects/admin/processtdashboardstatus.component';
import { WorkFlowManagementComponent } from './components/projects/admin/workFlowMangement.component';
import { WorkFlowComponent } from './components/projects/admin/workFlows.component';
import { WorkFlowStatusTransitionComponent } from './components/projects/admin/workFlowStatusTransition.component';
import { WorkFlowManagementPageComponent } from './components/projects/containers/workFlowManagement.page';
import { FormTypeComponent } from './components/statusreporting/form-type.component';
import { TestcaseAutomationType } from './components/Testrail/test-case-automation-type.component';
import { TestcaseStatusComponent } from './components/Testrail/test-case-status-component';
import { TestcaseTemplateComponent } from './components/Testrail/test-case-template.component';
import { TestcaseTypeComponent } from './components/Testrail/test-case-type.component';
import { ButtonTypeComponent } from './components/Timesheet/button-type.component';
import { FeedbackTypeComponent } from './components/Timesheet/feedback-type.component';
import { PermissionReasonComponent } from './components/Timesheet/permission-reason.component';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { AvatarModule } from 'ngx-avatar';
import { WorkflowStatusFilterPipe } from '../globaldependencies/pipes/workflowstatus.pipes';
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { UtcToLocalTimeWithDatePipe } from '../globaldependencies/pipes/utctolocaltimewithdate.pipe';
import { ShiftTimingComponent } from './components/hrm/shift-timing.component';
import { SoftLabelPipe } from './pipes/softlabels.pipes';
import { ResultFilterPipe } from './pipes/result.pipes';
import { FileSizePipe } from './pipes/filesize-pipe'
import { MasterDataManagementService } from './services/master-data-management.service';
import { CompanyManagementService } from './services/company-management.service';
 
import { CompanyDetailsComponent } from './components/company-structure/company-details.component';
import { BadgeComponent } from './components/hrm/badge.component';
import { PeakHourComponent } from './components/hrm/peakhours.component';
import { RateSheetComponent } from './components/hrm/ratesheet.component';
import { HolidayComponent } from './components/leaves/holiday.component';
import { LeaveFormulaComponent } from './components/leaves/leave-frequency-formula.component';
import { LeaveSessionComponent } from './components/leaves/leave-session.component';
import { LeaveStatusComponent } from './components/leaves/leave-status.component';
import { RestrictionTypeComponent } from './components/leaves/restriction-type.component';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { LeavesManagementService } from './services/leaves-management.service';

import { NgxDropzoneModule } from "ngx-dropzone";
import { UtcToLocalTimePipe } from './pipes/utctolocaltime.pipe';
import { UserStoryTypeComponent } from './components/projects/user-story-type.component';
import { CompanysettingsComponent } from './components/mastersettings/companysetting.component';
import { PayrollfrequencyComponent } from './components/payroll/payrollfrequency.component';
import { ProfessionaltaxrangesComponent } from './components/payroll/professionaltaxranges.component';
import { TaxslabsComponent } from './components/payroll/taxslabs.component';
import { CronEditorModule } from "cron-editor";
import { TemplatesComponent } from './components/mastersettings/template-management.component';
import { SelectAllComponent } from './components/select-all/select-all.component';
import { DashboardManagementComponent } from './components/widgets/dashboard-management.component';
import { PMSoftLabelsComponent } from './components/projects/soft-labels.component';
import { SnovasysAvatarModule } from  '@thetradeengineorg1/snova-avatar';
import { WidgetManagementComponent } from './components/widgets/widget.component';
import { TagsFilterPipe } from './pipes/tagsFilter.pipe';
import { ThemeService } from './services/theme.service';
import { TagsComponent } from './components/widgets/tags.component';
import { ScriptsComponent } from './components/scripts/scriptscomponent';
import { SpecificDayComponent } from './components/payroll/specificday.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DragulaModule } from "ng2-dragula";
import { CompanyHierarchyComponent } from './components/mastersettings/company-hierarchy.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { StatusFilterPipe } from './pipes/status-filter.pipes';
import { FilterPipe } from './pipes/filter-status.pipe';
import { BusinessUnitComponent } from './components/mastersettings/business-unit.component';
import { settingsComponent } from "./components/settings/settings-component";
import { MatTabsModule } from "@angular/material/tabs";
import { AllSettingsViewComponent } from './components/settings/All-settings-view';
import { RoleManagementComponent } from './components/settings/role-management.component';
// import { AdminRoutes } from './admin-module.routing';
import { DynamicModule } from '@thetradeengineorg1/snova-ndc-dynamic';
import { productivityAreaComponent } from './components/productivity/productivity-area.component';
import { ProductivityAreaViewComponent } from './components/productivity/productivity-area-view';
import { GridstarViewComponent } from './components/widget-views/gridstar-view';
import { InsightsComponent } from './components/productivity/insights.component';
import { AccumulationChartAllModule, ChartAllModule, RangeNavigatorAllModule } from '@syncfusion/ej2-angular-charts';
import { CumulativeWorkReportComponent } from './components/projects/cumulative-work-report';
import { ProductivityDashboardContainerComponent } from './components/productivity/productivity-dashboard-container.component';
import { TrendinsightsHrstatsComponent } from './components/productivity/trendinsights-hrstats.component';
import { ProductivityQualitystatsComponent } from './components/productivity/productivity-qualitystats.component';
import { TrendinsightsReportsGraphComponent } from './components/productivity/trendInsights-report.component';
import { ProductivityGraphComponent } from './components/productivity/productivity-graph.component';
import { ProductivityDrilldownComponent } from './components/productivity/productivity-drilldown.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EfficiencyDrilldownComponent } from './components/productivity/efficiency-drilldown.component';

import { CompletedTasksDrilldownComponent } from './components/productivity/completetedtasks-drilldown.component';
import { NoOfBugsDrilldownComponent } from './components/productivity/noOfBugs-drilldown.component';
import { UtilizationDrilldownComponent } from './components/productivity/utilization-drilldown.component';
import { PlannedHoursDrilldownComponent } from './components/productivity/planned-hours-drilldown.component';
import { DeliveredHoursDrilldownComponent } from './components/productivity/delivered-hours-drilldown.component';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { PendingTasksDrilldownComponent } from './components/productivity/pendingtasks-drilldown.component';
import { SpentHoursDrilldownComponent } from './components/productivity/spent-hours-drilldown.component';
import { ReplansDrilldownComponent } from './components/productivity/replans-drilldown.component';
import { BounceBacksDrilldownComponent } from './components/productivity/bouncebacks-drilldown.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DashboardLoadingComponent } from './components/productivity/dashboard-loading.component';
import { WINDOW_PROVIDERS } from './helpers/window.helper';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { SnNgMessageTemplateDirective, SnovasysMessageBoxComponent, SnovasysMessageBoxModule } from '@thetradeengineorg1/snova-message-box';
import { CustomFieldsComponentModule } from '@thetradeengineorg1/snova-custom-fields';
import {  adminModulesInfo } from './models/hr-models/company-model';
import { AdminModulesService } from './services/admin.module.service';
import { TimesheetStatusComponent } from './components/Roster/timesheet-submission-status.component';

const components = [CustomAccessibleIpAddressComponent, CompanyIntroducedByComponent, CompanyLocationComponent, ProductivityDrilldownComponent,CompletedTasksDrilldownComponent,
  NoOfBugsDrilldownComponent,DateFormatComponent, MainUseCaseComponent, NumberFormatComponent, TimeFormatComponent,EfficiencyDrilldownComponent,
  ExpenseCategoryDetailsComponent, MerchantDataComponent, AppsettingsComponent, TimeConfigurationSettingsComponent, UtilizationDrilldownComponent,ReplansDrilldownComponent,BounceBacksDrilldownComponent,
  BranchComponent, ContractTypeComponent, CountryComponent, CurrencyComponent, DeapartmentComponent,PlannedHoursDrilldownComponent,
  DesignationComponent, EducationlevelComponent, EmploymentStatusComponent, JobCategoryComponent,DeliveredHoursDrilldownComponent,
  BranchComponent, ContractTypeComponent, CountryComponent, CurrencyComponent, DeapartmentComponent,PlannedHoursDrilldownComponent,PendingTasksDrilldownComponent,
  DesignationComponent, EducationlevelComponent, EmploymentStatusComponent, JobCategoryComponent,SpentHoursDrilldownComponent,
  LanguagesComponent, LicenseTypeComponent, MembershipComponent, NationalityComponent,
  PayGradeComponent, PayfrequencyComponent, PaymentMethodComponent, PaymentTypeComponent,
  RateTypeComponent, RegionComponent, ReportingMethodComponent,
  SkillsComponent, CompanyDetailsComponent, StateComponent,
  TimeZoneComponent, WebHookComponent, BugPriorityComponent, GoalReplanTypeComponent,TimesheetStatusComponent,
  ProjectTypeComponent, UserStoryReplanTypeComponent, UserStoryStatusComponent, UserStorySubTypeComponent,
  BoardTypeApiComponent, ShiftTimingComponent, BoardTypeWorkFlowComponent,
  ConsideredHoursComponent,  
  ProcessDashboardStatusComponent, WorkFlowManagementComponent, WorkFlowComponent,
  WorkFlowStatusTransitionComponent, WorkFlowManagementPageComponent,
  FormTypeComponent, TestcaseAutomationType, TestcaseStatusComponent, TestcaseTemplateComponent,
  TestcaseTypeComponent, ButtonTypeComponent, FeedbackTypeComponent, PermissionReasonComponent,
  BadgeComponent, PeakHourComponent, RateSheetComponent, HolidayComponent,
  LeaveFormulaComponent, LeaveSessionComponent, LeaveStatusComponent,
  RestrictionTypeComponent, UserStoryTypeComponent, CompanysettingsComponent,
  PayrollfrequencyComponent, ProfessionaltaxrangesComponent, TaxslabsComponent, TemplatesComponent,
  SelectAllComponent, DashboardManagementComponent, PMSoftLabelsComponent, WidgetManagementComponent, ProductivityDashboardContainerComponent,
  TagsComponent,ScriptsComponent,SpecificDayComponent,CompanyHierarchyComponent,BusinessUnitComponent, settingsComponent,productivityAreaComponent,InsightsComponent,CumulativeWorkReportComponent,TrendinsightsReportsGraphComponent,DashboardLoadingComponent];

export function HttpLoaderFactory(httpClient: HttpClient) {
  console.log('inside http loader child');
  return new TranslateHttpLoader(httpClient, 'https://btrak407-development.snovasys.com/assets/i18n/', '.json');
}

// export const MY_FORMATS = {
//   parse: {
//     dateInput: "DD-MMM-YYYY"
//   },
//   display: {
//     dateInput: "DD-MMM-YYYY",
//     monthYearLabel: "MMM YYYY",
//     dateA11yLabel: "DD-MMM-YYYY",
//     monthYearA11yLabel: "MMMM YYYY"
//   }
// };
export const MY_DATE_FORMAT = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [
    CustomAccessibleIpAddressComponent,
    CompanyIntroducedByComponent,
    CompanyLocationComponent,
    CustomAppBaseComponent,
    DateFormatComponent,
    MainUseCaseComponent,
    NumberFormatComponent,
    TimeFormatComponent,
    ExpenseCategoryDetailsComponent,
    MerchantDataComponent,
    AppsettingsComponent,
    TimeConfigurationSettingsComponent,
    BranchComponent,
    ContractTypeComponent,
    CountryComponent,
    CurrencyComponent,
    DeapartmentComponent,
    DesignationComponent,
    EducationlevelComponent,
    EmploymentStatusComponent,
    JobCategoryComponent,
    LanguagesComponent,
    LicenseTypeComponent,
    MembershipComponent,
    NationalityComponent,
    PayGradeComponent,
    PayfrequencyComponent,
    PaymentMethodComponent,
    PaymentTypeComponent,
    RateTypeComponent,
    RegionComponent,
    ReportingMethodComponent,
    SkillsComponent,
    CompanyDetailsComponent,
    StateComponent,
    TimeZoneComponent,
    WebHookComponent,
    BugPriorityComponent,
    GoalReplanTypeComponent,
    TimesheetStatusComponent,
    ProjectTypeComponent,
    UserStoryReplanTypeComponent,
    UserStoryStatusComponent,
    UserStorySubTypeComponent,
    BoardTypeApiComponent,
    ShiftTimingComponent,
    BoardTypeWorkFlowComponent,
    ConsideredHoursComponent,
    ProcessDashboardStatusComponent,
    WorkFlowManagementComponent,
    WorkFlowComponent,
    WorkFlowStatusTransitionComponent,
    WorkFlowManagementPageComponent,
    FormTypeComponent,
    TestcaseAutomationType,
    TestcaseStatusComponent,
    TestcaseTemplateComponent,
    TestcaseTypeComponent,
    ButtonTypeComponent,
    FeedbackTypeComponent,
    PermissionReasonComponent,
    TagsComponent,
    BadgeComponent, PeakHourComponent, RateSheetComponent, HolidayComponent,
    LeaveFormulaComponent, LeaveSessionComponent, LeaveStatusComponent,
    RestrictionTypeComponent, UserStoryTypeComponent, CompanysettingsComponent,
    PayrollfrequencyComponent, ProfessionaltaxrangesComponent, TaxslabsComponent, TemplatesComponent,
    SelectAllComponent, DashboardManagementComponent, PMSoftLabelsComponent, WidgetManagementComponent,
    SpecificDayComponent,CompanyHierarchyComponent,RoleManagementComponent,BusinessUnitComponent,InsightsComponent,CumulativeWorkReportComponent,TrendinsightsReportsGraphComponent,DashboardLoadingComponent,
    //Pipes
    SoftLabelPipe,
    ResultFilterPipe,
    RemoveSpecialCharactersPipe,
    WorkflowStatusFilterPipe,
    UtcToLocalTimeWithDatePipe,
    FetchSizedAndCachedImagePipe,
    UtcToLocalTimePipe,
    TagsFilterPipe,
    FileSizePipe,
    ScriptsComponent,
    StatusFilterPipe,
    FilterPipe,
    settingsComponent,
    productivityAreaComponent,ProductivityAreaViewComponent,
    AllSettingsViewComponent,GridstarViewComponent, 
    ProductivityDashboardContainerComponent, TrendinsightsHrstatsComponent, 
    ProductivityQualitystatsComponent, ProductivityGraphComponent, 
    ProductivityDrilldownComponent, CompletedTasksDrilldownComponent,NoOfBugsDrilldownComponent,EfficiencyDrilldownComponent, UtilizationDrilldownComponent, ReplansDrilldownComponent,BounceBacksDrilldownComponent,
    PlannedHoursDrilldownComponent,PendingTasksDrilldownComponent,DeliveredHoursDrilldownComponent, SpentHoursDrilldownComponent,
  ],
  imports: [ChartAllModule,AccumulationChartAllModule,RangeNavigatorAllModule, MatDialogModule,
    DynamicModule,ChartsModule,CustomFieldsComponentModule,NgxChartsModule,
    CommonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatButtonModule,
    AvatarModule,
    NgxGalleryModule,
    NgxDropzoneModule,
    MatGridListModule,
    CronEditorModule,
    MatRadioModule,
    TreeViewModule,
    SnovasysAvatarModule,
    MatAutocompleteModule,
    GridModule,
    MatChipsModule,
    DragulaModule,
    DragulaModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxMaterialTimepickerModule,
    // NgxMaterialTimepickerModule.forRoot(),
    ColorPickerModule,
    MatDatepickerModule,
    SatPopoverModule,
    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    NgxDatatableModule,
    FontAwesomeModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDividerModule,
    HttpClientModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatListModule,
    MatTabsModule,
    SnovasysMessageBoxModule
  ],
  // entryComponents: components,
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    DatePipe,
    MasterDataManagementService,
    CompanyManagementService,
    LeavesManagementService,
    TranslateService,
    CookieService,
    ThemeService,
    SoftLabelPipe,
    ResultFilterPipe,
    RemoveSpecialCharactersPipe,
    WorkflowStatusFilterPipe,
    UtcToLocalTimeWithDatePipe,
    FetchSizedAndCachedImagePipe,
    UtcToLocalTimePipe,
    TagsFilterPipe,
    FileSizePipe,
    StatusFilterPipe,
    FilterPipe,
    MatDialogModule,
    WINDOW_PROVIDERS
  ],
  exports: components
})

export class AdminModule {
  static forChild(config: adminModulesInfo): ModuleWithProviders<AdminModule> {
    return {
      ngModule: AdminModule,
      providers: [
        { provide: AdminModulesService, useValue: config }
      ]
    };
  }
  constructor(private injector: Injector) {
    // const accessibleIpAddressComponent = createCustomElement(CustomAccessibleIpAddressComponent, { injector });
    // customElements.define('custom-app-fm-component-accessible-address', accessibleIpAddressComponent);
    // customElements.define('app-fm-component-company-introduced', createCustomElement(CompanyIntroducedByComponent, { injector }));
    // customElements.define('app-fm-component-company-location', createCustomElement(CompanyLocationComponent, { injector }));
    // customElements.define('app-fm-component-date-format', createCustomElement(DateFormatComponent, { injector }));
    // customElements.define('app-fm-component-main-usecase', createCustomElement(MainUseCaseComponent, { injector }));
    // customElements.define('app-fm-component-number-format', createCustomElement(NumberFormatComponent, { injector }));
    // customElements.define('app-fm-component-time-format', createCustomElement(TimeFormatComponent, { injector }));
    // customElements.define('app-fm-component-expense-category', createCustomElement(ExpenseCategoryDetailsComponent, { injector }));
    // customElements.define('app-fm-component-merchant', createCustomElement(MerchantDataComponent, { injector }));
    // customElements.define('app-fm-component-appsetting', createCustomElement(AppsettingsComponent, { injector }));
    // customElements.define('app-fm-component-time-configuration-settings', createCustomElement(TimeConfigurationSettingsComponent, { injector }));
    // customElements.define('app-fm-component-branch', createCustomElement(BranchComponent, { injector }));
    // customElements.define('app-fm-component-contract-type', createCustomElement(ContractTypeComponent, { injector }));
    // customElements.define('app-fm-component-country', createCustomElement(CountryComponent, { injector }));
    // customElements.define('app-fm-component-currency', createCustomElement(CurrencyComponent, { injector }));
    // customElements.define('app-fm-component-department', createCustomElement(DeapartmentComponent, { injector }));
    // customElements.define('app-fm-component-designation', createCustomElement(DesignationComponent, { injector }));
    // customElements.define('app-fm-component-education', createCustomElement(EducationlevelComponent, { injector }));
    // customElements.define('app-fm-component-employment-status', createCustomElement(EmploymentStatusComponent, { injector }));
    // customElements.define('app-fm-component-jobcategory', createCustomElement(JobCategoryComponent, { injector }));
    // customElements.define('app-fm-component-language', createCustomElement(LanguagesComponent, { injector }));
    // customElements.define('app-fm-component-license-type', createCustomElement(LicenseTypeComponent, { injector }));
    // customElements.define('app-fm-component-memberships', createCustomElement(MembershipComponent, { injector }));
    // customElements.define('app-fm-component-nationality', createCustomElement(NationalityComponent, { injector }));
    // customElements.define('app-fm-component-pay-grade', createCustomElement(PayGradeComponent, { injector }));
    // customElements.define('app-fm-component-payfrequency', createCustomElement(PayfrequencyComponent, { injector }));
    // customElements.define('app-fm-component-payment-method', createCustomElement(PaymentMethodComponent, { injector }));
    // customElements.define('app-fm-component-payment-type', createCustomElement(PaymentTypeComponent, { injector }));
    // customElements.define('app-fm-component-rate-type', createCustomElement(RateTypeComponent, { injector }));
    // customElements.define('app-fm-component-reference-type', createCustomElement(ReferenceTypeComponent, { injector }));
    // customElements.define('app-fm-component-region', createCustomElement(RegionComponent, { injector }));
    // customElements.define('app-fm-component-reporting-method', createCustomElement(ReportingMethodComponent, { injector }));
    // customElements.define('app-fm-component-skills', createCustomElement(SkillsComponent, { injector }));
    // customElements.define('app-fm-component-soft-label', createCustomElement(SoftLabelComponent, { injector }));
    // customElements.define('app-fm-component-state', createCustomElement(StateComponent, { injector }));
    // customElements.define('app-fm-component-time-zone', createCustomElement(TimeZoneComponent, { injector }));
    // customElements.define('app-fm-component-webhook', createCustomElement(WebHookComponent, { injector }));
    // customElements.define('app-fm-component-bug-priority', createCustomElement(BugPriorityComponent, { injector }));
    // customElements.define('app-fm-component-goal-replan-type', createCustomElement(GoalReplanTypeComponent, { injector }));
    // customElements.define('app-fm-component-project-type', createCustomElement(ProjectTypeComponent, { injector }));
    // customElements.define('app-fm-component-user-story-replan-type', createCustomElement(UserStoryReplanTypeComponent, { injector }));
    // customElements.define('app-pm-component-userstorystatus', createCustomElement(UserStoryStatusComponent, { injector }));
    // customElements.define('app-fm-component-user-story-sub-type', createCustomElement(UserStorySubTypeComponent, { injector }));
    // customElements.define('app-pm-component-boardtypeapi', createCustomElement(BoardTypeApiComponent, { injector }));
    // customElements.define('app-fm-component-shift-timing', createCustomElement(ShiftTimingComponent, { injector }));
    // customElements.define('app-pm-component-boardtypes', createCustomElement(BoardTypeComponent, { injector }));
    // customElements.define('app-pm-component-boardtypeworkflow', createCustomElement(BoardTypeWorkFlowComponent, { injector }));
    // customElements.define('app-pm-component-configuration', createCustomElement(ConfigurationComponent, { injector }));
    // customElements.define('app-pm-component-consideredhours', createCustomElement(ConsideredHoursComponent, { injector }));
    // customElements.define('app-pm-component-permissions', createCustomElement(PermissionsComponent, { injector }));
    // customElements.define('app-pm-component-permissionsmanagement', createCustomElement(PermissionsManagementComponent, { injector }));
    // customElements.define('app-pm-component-processdashboardstatus', createCustomElement(ProcessDashboardStatusComponent, { injector }));
    // customElements.define('app-pm-component-transitiondeadlines', createCustomElement(TransitionDeadlinesComponent, { injector }));
    // customElements.define('app-pm-component-workflowmanagement', createCustomElement(WorkFlowManagementComponent, { injector }));
    // customElements.define('app-pm-component-workflows', createCustomElement(WorkFlowComponent, { injector }));
    // customElements.define('app-pm-component-workflowstatustransition', createCustomElement(WorkFlowStatusTransitionComponent, { injector }));
    // customElements.define('app-pm-container-permissionsmanagement', createCustomElement(PermissionsManagementPageComponent, { injector }));
    // customElements.define('app-pm-page-workflowmanagement', createCustomElement(WorkFlowManagementPageComponent, { injector }));
    // customElements.define('app-fm-component-form-type', createCustomElement(FormTypeComponent, { injector }));
    // customElements.define('app-fm-component-test-case-automation-type', createCustomElement(TestcaseAutomationType, { injector }));
    // customElements.define('app-fm-component-test-case-status', createCustomElement(TestcaseStatusComponent, { injector }));
    // customElements.define('app-fm-component-test-case-template', createCustomElement(TestcaseTemplateComponent, { injector }));
    // customElements.define('app-fm-component-test-case-type', createCustomElement(TestcaseTypeComponent, { injector }));
    // customElements.define('app-fm-component-button-type', createCustomElement(ButtonTypeComponent, { injector }));
    // customElements.define('app-fm-component-feedback-type', createCustomElement(FeedbackTypeComponent, { injector }));
    // customElements.define('app-fm-component-permission-reason', createCustomElement(PermissionReasonComponent, { injector }));
    // customElements.define('app-fm-component-field', createCustomElement(FieldComponent, { injector }));
  }
}
