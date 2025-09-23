import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SpecificDayComponent,AdminModule,CompanysettingsComponent,TemplatesComponent,TimesheetStatusComponent, DashboardManagementComponent, TaxslabsComponent, PMSoftLabelsComponent, ProfessionaltaxrangesComponent, UserStoryTypeComponent, PayrollfrequencyComponent, CompanyDetailsComponent, CustomAccessibleIpAddressComponent, UserStoryReplanTypeComponent, CompanyIntroducedByComponent, CompanyLocationComponent, DateFormatComponent, MainUseCaseComponent, NumberFormatComponent, TimeFormatComponent, ExpenseCategoryDetailsComponent, MerchantDataComponent, BranchComponent, ContractTypeComponent, CountryComponent, CurrencyComponent, DeapartmentComponent, DesignationComponent, EducationlevelComponent, EmploymentStatusComponent, JobCategoryComponent, LanguagesComponent, LicenseTypeComponent, MembershipComponent, NationalityComponent, PayGradeComponent, PayfrequencyComponent, PaymentMethodComponent, PaymentTypeComponent, RateTypeComponent, RegionComponent, ReportingMethodComponent, ShiftTimingComponent, SkillsComponent, StateComponent, TimeZoneComponent, WebHookComponent, AppsettingsComponent, TimeConfigurationSettingsComponent, BoardTypeApiComponent, BoardTypeWorkFlowComponent, ProcessDashboardStatusComponent, WorkFlowManagementPageComponent, BugPriorityComponent, GoalReplanTypeComponent, ProjectTypeComponent, UserStoryStatusComponent, UserStorySubTypeComponent, FormTypeComponent, TestcaseAutomationType, TestcaseStatusComponent, TestcaseTypeComponent, ButtonTypeComponent, FeedbackTypeComponent, PermissionReasonComponent, BadgeComponent, PeakHourComponent, RateSheetComponent, HolidayComponent, LeaveFormulaComponent, LeaveSessionComponent, LeaveStatusComponent, RestrictionTypeComponent,CompanyHierarchyComponent,BusinessUnitComponent,InsightsComponent,CumulativeWorkReportComponent, AdminRoutes, ProductivityDashboardContainerComponent, AdminModulesService } from "@thetradeengineorg1/snova-admin-module";
import { AdminLayoutComponent, ShellModule, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { moduleLoader } from "app/common/constants/module-loader";
import { info } from 'app/common/constants/modules';

export class AdminComponentSupplierService {

  static components =  [
    {
        name: "Templates",
        componentTypeObject: TemplatesComponent
      },
    {
      name: "Accessible IP address",
      componentTypeObject: CustomAccessibleIpAddressComponent
    },
    {
        name: "Work item replan type",
        componentTypeObject: UserStoryReplanTypeComponent
    },    
    {
        name: "Company introduced by option",
        componentTypeObject: CompanyIntroducedByComponent
    },
    {
        name: "Company location",
        componentTypeObject: CompanyLocationComponent
    },
    {               
        name: "Date format",
        componentTypeObject: DateFormatComponent
    },
    {
        name: "Main use case",
        componentTypeObject: MainUseCaseComponent
    },
    {
        name: "Number Format",
        componentTypeObject: NumberFormatComponent
    },
    {
        name: "Time format",
        componentTypeObject: TimeFormatComponent
    },
    {
        name: "Expense category",
        componentTypeObject: ExpenseCategoryDetailsComponent
    },
    {
        name: "Merchants",
        componentTypeObject: MerchantDataComponent
    },
    {
        name: "Branch",
        componentTypeObject: BranchComponent
    },
    {
        name: "Contract type",
        componentTypeObject: ContractTypeComponent
    },
    {
        name: "Country",
        componentTypeObject: CountryComponent
    },
    {
        name: "Currency",
        componentTypeObject: CurrencyComponent
    },
    {
        name: "Department",
        componentTypeObject: DeapartmentComponent
    },
    {
        name: "Designation",
        componentTypeObject: DesignationComponent
    },
    {
        name: "Education levels",
        componentTypeObject: EducationlevelComponent
    },
    {
        name: "Employment type",
        componentTypeObject: EmploymentStatusComponent
    },
    {
        name: "Job category",
        componentTypeObject: JobCategoryComponent
    },
    {
        name: "Languages",
        componentTypeObject: LanguagesComponent
    },
    {
        name: "Identification type",
        componentTypeObject: LicenseTypeComponent
    },
    {
        name: "Memberships",
        componentTypeObject: MembershipComponent
    },
    {
        name: "Nationalities",
        componentTypeObject: NationalityComponent
    },
    {
        name: "Paygrade",
        componentTypeObject: PayGradeComponent
    },
    {
        name: "Pay frequency",
        componentTypeObject: PayfrequencyComponent
    },
    {
        name: "Payment method",
        componentTypeObject: PaymentMethodComponent
    },
    {
        name: "Payment type",
        componentTypeObject: PaymentTypeComponent
    },
    {
        name: "Rate type",
        componentTypeObject: RateTypeComponent
    },    
    {
        name: "Region",
        componentTypeObject: RegionComponent
    },            
    {
        name: "Reporting methods",
        componentTypeObject: ReportingMethodComponent
    },   
    {
        name: "Shift timing",
        componentTypeObject: ShiftTimingComponent
    },         
    {
        name: "Skills",
        componentTypeObject: SkillsComponent
    },                            
    {
        name: "State",
        componentTypeObject: StateComponent
    },            
    {
        name: "Time zone",
        componentTypeObject: TimeZoneComponent
    },            
    {
        name: "WebHook",
        componentTypeObject: WebHookComponent
    },            
    {
        name: "App settings",
        componentTypeObject: AppsettingsComponent
    },            
    {
        name: "Time configuration settings",
        componentTypeObject: TimeConfigurationSettingsComponent
    },
    {
        name: "Board type api",
        componentTypeObject: BoardTypeApiComponent
    },
    {
        name: "Board type workflow management",
        componentTypeObject: BoardTypeWorkFlowComponent
    },
    {
        name: "Manage Goal Performance Indicator",
        componentTypeObject: ProcessDashboardStatusComponent
    },            
    {
        name: "Workflow management",
        componentTypeObject: WorkFlowManagementPageComponent
    },
    {
        name: "Bug priority",
        componentTypeObject: BugPriorityComponent
    },
    {
        name: "Goal replan type",
        componentTypeObject: GoalReplanTypeComponent
    },
    {
        name: "Project type",
        componentTypeObject: ProjectTypeComponent
    },
    {
        name: "Work item replan type",
        componentTypeObject: UserStoryReplanTypeComponent
    },
    {
        name: "Work item status",
        componentTypeObject: UserStoryStatusComponent
    },
    {
        name: "Work item sub type",
        componentTypeObject: UserStorySubTypeComponent
    },
    {
        name: "Form type",
        componentTypeObject: FormTypeComponent
    },
    {
        name: "Test case automation type",
        componentTypeObject: TestcaseAutomationType
    },
    {
        name: "Test case status",
        componentTypeObject: TestcaseStatusComponent
    },
    {
        name: "Test case type",
        componentTypeObject: TestcaseTypeComponent
    },
    {
        name: "Button type",
        componentTypeObject: ButtonTypeComponent
    },
    {
        name: "Feedback type",
        componentTypeObject: FeedbackTypeComponent
    },
    {
        name: "Permission reason",
        componentTypeObject: PermissionReasonComponent
    },
    {
        name: "Badges",
        componentTypeObject: BadgeComponent
    },
    {
        name: "Peak hour",
        componentTypeObject: PeakHourComponent
    },
    {
        name: "Ratesheet",
        componentTypeObject: RateSheetComponent
    },
    {
        name: "Holiday",
        componentTypeObject: HolidayComponent
    },
    {
        name: "Leave formula",
        componentTypeObject: LeaveFormulaComponent
    },
    {
        name: "Leave session",
        componentTypeObject: LeaveSessionComponent
    },
    {
        name: "Leave status",
        componentTypeObject: LeaveStatusComponent
    },
    {
        name: "Restriction type",
        componentTypeObject: RestrictionTypeComponent
    },
    {
        name: "Company details",
        componentTypeObject: CompanyDetailsComponent
    },
    {
        name: "Work item type",
        componentTypeObject: UserStoryTypeComponent
    },
    {
        name: "Payroll frequency",
        componentTypeObject: PayrollfrequencyComponent
    },
    {
        name: "Professional tax ranges",
        componentTypeObject: ProfessionaltaxrangesComponent
    },
    {
        name: "Soft label configuration",
        componentTypeObject: PMSoftLabelsComponent
    },
    {
        name: "Tax slabs",
        componentTypeObject: TaxslabsComponent
    },
    {
        name: "Dashboard configuration",
        componentTypeObject: DashboardManagementComponent
    },
    {
        name: "Company settings",
        componentTypeObject: CompanysettingsComponent
    },
    {
        name: "Specific day",
        componentTypeObject: SpecificDayComponent
    },
    {
        name: "Company hierarchy",
        componentTypeObject: CompanyHierarchyComponent
    },
    {
        name: "Business unit",
        componentTypeObject: BusinessUnitComponent
    },
    {
        name: "Insights",
        componentTypeObject: InsightsComponent
    },
    {
        name: "Productivity Dashboard",
        componentTypeObject:  ProductivityDashboardContainerComponent
    },
    {
        name: "Cumulative work report",
        componentTypeObject: CumulativeWorkReportComponent
    },   
    {
        name: "Time sheet submission status",
        componentTypeObject: TimesheetStatusComponent
    },   
   
  ];
}

@NgModule({
  imports: [
    RouterModule.forChild([
        {
          path: '',
          component: AdminLayoutComponent,
          children: AdminRoutes
        }
      ]),
    CommonModule,
    AdminModule.forChild(moduleLoader as any),
    ShellModule.forChild(moduleLoader as shellModulesInfo),
  ],
  providers: [
    {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo },
    {provide: AdminModulesService, useValue: moduleLoader as any }
]
})
export class AdminPackageModule {
  static componentService = AdminComponentSupplierService;
}