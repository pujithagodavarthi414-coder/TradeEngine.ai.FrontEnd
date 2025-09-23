import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RouterModule } from '@angular/router';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownsModule, DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { MomentUtcDateAdapter } from './globaldependencies/helpers/moment-utc-date-adapter';
import { SnovasysMessageBoxModule } from "@snovasys/snova-message-box";
import { SnovasysAvatarModule } from "@snovasys/snova-avatar";
import { ExcelModule, GridModule } from "@progress/kendo-angular-grid";
import { TagInputModule } from 'ngx-chips';
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { CronEditorModule } from "cron-editor";
import { MonthOrderByPipe } from './payrollwidgetsandreports/pipes/monthOrderByPipe';
import { RemoveSpecialCharactersPipe } from './payrollwidgetsandreports/pipes/removeSpecialCharacters.pipe';
import { TaxAllowanceComponent } from './payrollwidgetsandreports/payroll-widgets/taxallowance.component';
import { FetchSizedAndCachedImagePipe } from './payrollwidgetsandreports/pipes/fetchSizedAndCachedImage.pipe';
import { UtcToLocalTimeWithDatePipe } from './payrollwidgetsandreports/pipes/utctolocaltimewithdate.pipe';
import { MonthNamePipe } from './payrollwidgetsandreports/pipes/month.pipe';
import { SoftLabelPipe} from './payrollwidgetsandreports/pipes/softlabels.pipes';
import { ContractPaySettingsComponent } from './payrollwidgetsandreports/payroll-widgets/contractpaysettings/contractpaysettings.component';
import { EmployeeLoanComponent } from './payrollwidgetsandreports/payroll-widgets/employee-loan/employee-loan.component';
import { EmployeePayrollTemplatesComponent } from './payrollwidgetsandreports/payroll-widgets/employee-payroll-templates/employee-payroll-templates.component';
import { EmployeeGradeConfigurationComponent } from './payrollwidgetsandreports/payroll-reports/employee-grade-configuration.component';
import { EmployeeConfigurationDialougeComponent } from './payrollwidgetsandreports/payroll-reports/employee-grade-dialouge.component';
import { EmployeeGradeComponent } from './payrollwidgetsandreports/payroll-reports/employee-grade.component';
import { CustomAppBaseComponent } from './globaldependencies/components/componentbase';
import { PayRollMaritalStatusConfigurationComponent } from './payrollwidgetsandreports/payroll-widgets/payrollmaritalstatusconfiguration.component';
import { PayRollTemplateComponent } from './payrollwidgetsandreports/payroll-widgets/payrolltemplate.component';
import { PayRollGenderConfigurationComponent } from './payrollwidgetsandreports/payroll-widgets/payrollgenderconfiguration.component';
import { PayRollComponentComponent } from './payrollwidgetsandreports/payroll-widgets/payrollcomponent.component';
import { PayRollCalculationConfigurationsComponent } from './payrollwidgetsandreports/payroll-widgets/payrollcalculationconfigurations.component';
import { PayRollBranchConfigurationComponent } from './payrollwidgetsandreports/payroll-widgets/payrollbranchconfiguration.component';
import { LeaveEncashmentSettingsComponent } from './payrollwidgetsandreports/payroll-widgets/leaveencashmentsettings.component';
import { HourlyTdsConfigurationComponent } from './payrollwidgetsandreports/payroll-widgets/hourlytds-configuration.component';
import { FinancialYearConfigurationsComponent } from './payrollwidgetsandreports/payroll-widgets/financialyearconfigurations.component';
import { EmployeeTaxAllowanceDetailsComponent } from './payrollwidgetsandreports/payroll-widgets/employeetaxallowancedetails.component';
import { PayRollEmployeeResignation } from './payrollwidgetsandreports/payroll-widgets/employeeresignation.component';
import { EmployeeAccountDetailsComponent } from './payrollwidgetsandreports/payroll-widgets/employeeaccountdetails.component';
import { EmployeeLoanInstallment } from './payrollwidgetsandreports/payroll-widgets/employee-loan-installment.component';
import { DaysOfWeekConfigurationComponent } from './payrollwidgetsandreports/payroll-widgets/daysofweek-configuration.component';
import { CreditorDetailsComponent } from './payrollwidgetsandreports/payroll-widgets/creditordetails.component';
import { AllowanceTimeComponent } from './payrollwidgetsandreports/payroll-widgets/allowance-time.component';
import { TdsSettingsComponent } from './payrollwidgetsandreports/payroll-widgets/tds-settings/tdssettings.component';
import { RateTagAllowanceTimeComponent } from './payrollwidgetsandreports/payroll-widgets/ratetagallowancetime/ratetagallowance-time.component';
import { EmployeeRateTagDetailsComponent } from './payrollwidgetsandreports/payroll-widgets/employeeratetagdetails/employee-ratetag-details.component';
import { RateTagComponent } from './payrollwidgetsandreports/payroll-widgets/ratetag/ratetagcomponent';
import { PayRollMonthlyDetailsComponent } from './payrollwidgetsandreports/payroll-widgets/payrollmonthlydetails/payrollmonthlydetails.component';
import { PayrollStatusComponent } from './payrollwidgetsandreports/payroll-widgets/payroll-status/payroll-status.component';
import { SalaryWagesComponent } from './payrollwidgetsandreports/payroll-reports/salary-wages.component';
import { SalaryReportComponent } from './payrollwidgetsandreports/payroll-reports/salary-report-component';
import { SalaryForItComponent } from './payrollwidgetsandreports/payroll-reports/salary-for-it.component';
import { SalaryBillRegisterComponent } from './payrollwidgetsandreports/payroll-reports/salary-bill-register.component';
import { ProfessionalTaxReturnComponent } from './payrollwidgetsandreports/payroll-reports/professional-tax-return-component';
import { ProfessionalTaxMonthlyComponent } from './payrollwidgetsandreports/payroll-reports/professiona-tax-monthly.component';
import { IncomeSalaryComponent } from './payrollwidgetsandreports/payroll-reports/income-salary-statement.component';
import { EsiOfAnEmployeeComponent } from './payrollwidgetsandreports/payroll-reports/esi-of-an-employee.component';
import { EsiMonthlyComponent } from './payrollwidgetsandreports/payroll-reports/esi-monthly-statement-component';
import { EmployeePFComponent } from './payrollwidgetsandreports/payroll-reports/employee-pf.component';
import { ConfigureEmployeeBonusComponent } from './payrollwidgetsandreports/payroll-widgets/configure-employee-bonus/configure-employee-bonus.component';
import { CookieService } from 'ngx-cookie-service';
import "./globaldependencies/helpers/fontawesome-icons";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './globaldependencies/helpers/jwt.interceptor';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as payRollReducers from "./payrollwidgetsandreports/store/reducers/index";
import * as PayRollModuleEffects from "./payrollwidgetsandreports/store/effects/index";
import { PayrollDetailsComponent } from './payrollwidgetsandreports/payroll-widgets/payroll-details/payroll-details.component';
import { PayRollRoleConfigurationComponent } from './payrollwidgetsandreports/payroll-widgets/payrollroleconfiguration.component';
import { PaySlipComponent } from './payrollwidgetsandreports/payroll-widgets/payslip.component';
import { EmployeeResignation } from './payrollwidgetsandreports/payroll-widgets/employee-resignation/employee-resignation';
import { DropZoneModule } from '@snovasys/snova-file-uploader';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { RateTagConfigurationComponent } from './payrollwidgetsandreports/payroll-widgets/ratetagconfiguration/ratetag-configuration.component';
import { AddRateTagsComponent } from './payrollwidgetsandreports/payroll-widgets/ratetagconfiguration/add-ratetags.component';
import { BankComponent } from './payrollwidgetsandreports/payroll-widgets/bank.component';
import { AddBankComponent } from './payrollwidgetsandreports/payroll-widgets/add-bank.component';
import { PayRollBandsComponent } from './payrollwidgetsandreports/payroll-widgets/payrollbands/payrollbands.component';
import { EmployeePreviousCompanyTaxComponent } from './payrollwidgetsandreports/payroll-widgets/employeepreviouscompanytax/employeepreviouscompanytax.component';
import { AddRateTagComponent } from './payrollwidgetsandreports/payroll-widgets/ratetag/add-ratetag.component';
import { RateTagLibraryComponent } from './payrollwidgetsandreports/payroll-widgets/ratetag/ratetag-library.component';
import { ExitWorItemDialogComponent } from './payrollwidgetsandreports/payroll-widgets/exit-work-items/exit-workitem-dialog.component';
import { MobileNumberDirective } from './payrollwidgetsandreports/directives/mobile-number.directive';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
  },
};

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    FontAwesomeModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    FlexLayoutModule,
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
    MatCheckboxModule,
    MatTableModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    MatAutocompleteModule,
    MatTooltipModule,
    TranslateModule,
    SatPopoverModule,
    DropDownsModule,
    DropDownListModule,
    SnovasysMessageBoxModule,
    MatSlideToggleModule,
    SnovasysAvatarModule,
    NgxDropzoneModule,
    NgxGalleryModule,
    DropZoneModule,
    GridModule,
    ExcelModule,
    TagInputModule,
    NgxMaterialTimepickerModule,
    CronEditorModule,
    MatSnackBarModule,
   
    StoreModule.forFeature("payRollManagement", payRollReducers.reducers),
    EffectsModule.forFeature(PayRollModuleEffects.allPayRollModuleEffects)
  ],
  declarations: [
    MobileNumberDirective,
    ConfigureEmployeeBonusComponent,
    ContractPaySettingsComponent,
    EmployeeLoanComponent,
    EmployeePayrollTemplatesComponent,
    EmployeeGradeConfigurationComponent,
    EmployeeConfigurationDialougeComponent,
    EmployeeGradeComponent,
    EmployeePFComponent,
    EsiMonthlyComponent,
    EsiOfAnEmployeeComponent,
    IncomeSalaryComponent,
    ProfessionalTaxMonthlyComponent,
    ProfessionalTaxReturnComponent,
    SalaryBillRegisterComponent,
    SalaryForItComponent,
    SalaryReportComponent,
    SalaryWagesComponent,
    PayrollStatusComponent,
    PayRollMonthlyDetailsComponent,
    RateTagComponent,
    RateTagAllowanceTimeComponent,
    EmployeeRateTagDetailsComponent,
    TdsSettingsComponent,
    AllowanceTimeComponent,
    CreditorDetailsComponent,
    DaysOfWeekConfigurationComponent,
    EmployeeLoanInstallment,
    EmployeeAccountDetailsComponent,
    PayRollEmployeeResignation,
    EmployeeTaxAllowanceDetailsComponent,
    FinancialYearConfigurationsComponent,
    HourlyTdsConfigurationComponent,
    LeaveEncashmentSettingsComponent,
    PayRollBranchConfigurationComponent,
    PayRollCalculationConfigurationsComponent,
    PayRollComponentComponent,
    PayRollGenderConfigurationComponent,
    PayRollMaritalStatusConfigurationComponent,
    PayRollTemplateComponent,
    TaxAllowanceComponent,
    CustomAppBaseComponent,
    PayrollDetailsComponent,
    FetchSizedAndCachedImagePipe,
    UtcToLocalTimeWithDatePipe,
    MonthNamePipe,
    RemoveSpecialCharactersPipe,
    MonthOrderByPipe,
    SoftLabelPipe,
    PayRollRoleConfigurationComponent,
    PaySlipComponent,
    EmployeeResignation,
    RateTagConfigurationComponent,
    AddRateTagsComponent,
    BankComponent,
    AddBankComponent,
    PayRollBandsComponent,
    EmployeePreviousCompanyTaxComponent,
    AddRateTagComponent,
    ExitWorItemDialogComponent,
    RateTagLibraryComponent],
  exports: [ConfigureEmployeeBonusComponent,
    ContractPaySettingsComponent,
    EmployeeLoanComponent,
    EmployeePayrollTemplatesComponent,
    EmployeeGradeConfigurationComponent,
    EmployeeConfigurationDialougeComponent,
    EmployeeGradeComponent,
    EmployeePFComponent,
    EsiMonthlyComponent,
    EsiOfAnEmployeeComponent,
    IncomeSalaryComponent,
    ProfessionalTaxMonthlyComponent,
    ProfessionalTaxReturnComponent,
    SalaryBillRegisterComponent,
    SalaryForItComponent,
    SalaryReportComponent,
    SalaryWagesComponent,
    PayrollStatusComponent,
    PayRollMonthlyDetailsComponent,
    RateTagComponent,
    RateTagAllowanceTimeComponent,
    EmployeeRateTagDetailsComponent,
    TdsSettingsComponent,
    AllowanceTimeComponent,
    CreditorDetailsComponent,
    DaysOfWeekConfigurationComponent,
    EmployeeLoanInstallment,
    EmployeeAccountDetailsComponent,
    PayRollEmployeeResignation,
    EmployeeTaxAllowanceDetailsComponent,
    FinancialYearConfigurationsComponent,
    HourlyTdsConfigurationComponent,
    LeaveEncashmentSettingsComponent,
    PayRollBranchConfigurationComponent,
    PayRollCalculationConfigurationsComponent,
    PayRollComponentComponent,
    PayRollGenderConfigurationComponent,
    PayRollMaritalStatusConfigurationComponent,
    PayRollTemplateComponent,
    TaxAllowanceComponent,
    CustomAppBaseComponent,
    PayrollDetailsComponent,
    FetchSizedAndCachedImagePipe,
    UtcToLocalTimeWithDatePipe,
    MonthNamePipe,
    RemoveSpecialCharactersPipe,
    MonthOrderByPipe,
    PayRollRoleConfigurationComponent,
    PaySlipComponent,
    EmployeeResignation,
    RateTagConfigurationComponent,
    AddRateTagsComponent,
    BankComponent,
    AddBankComponent,
    PayRollBandsComponent,
    EmployeePreviousCompanyTaxComponent,
    ExitWorItemDialogComponent,
    RateTagLibraryComponent],
  providers: [CookieService,DatePipe, SoftLabelPipe,
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" } ,
    { provide: MatDialogRef, useValue: {}},
    { provide: MAT_DIALOG_DATA, useValue: {}}
  ],
  entryComponents: [
    ConfigureEmployeeBonusComponent,
    ContractPaySettingsComponent,
    EmployeeLoanComponent,
    EmployeePayrollTemplatesComponent,
    EmployeeGradeConfigurationComponent,
    EmployeeConfigurationDialougeComponent,
    EmployeeGradeComponent,
    EmployeePFComponent,
    EsiMonthlyComponent,
    EsiOfAnEmployeeComponent,
    IncomeSalaryComponent,
    ProfessionalTaxMonthlyComponent,
    ProfessionalTaxReturnComponent,
    SalaryBillRegisterComponent,
    SalaryForItComponent,
    SalaryReportComponent,
    SalaryWagesComponent,
    PayrollStatusComponent,
    PayRollMonthlyDetailsComponent,
    RateTagComponent,
    RateTagAllowanceTimeComponent,
    EmployeeRateTagDetailsComponent,
    TdsSettingsComponent,
    AllowanceTimeComponent,
    CreditorDetailsComponent,
    DaysOfWeekConfigurationComponent,
    EmployeeLoanInstallment,
    EmployeeAccountDetailsComponent,
    PayRollEmployeeResignation,
    EmployeeTaxAllowanceDetailsComponent,
    FinancialYearConfigurationsComponent,
    HourlyTdsConfigurationComponent,
    LeaveEncashmentSettingsComponent,
    PayRollBranchConfigurationComponent,
    PayRollCalculationConfigurationsComponent,
    PayRollComponentComponent,
    PayRollGenderConfigurationComponent,
    PayRollMaritalStatusConfigurationComponent,
    PayRollTemplateComponent,
    TaxAllowanceComponent,
    CustomAppBaseComponent,
    PayrollDetailsComponent,
    PayRollRoleConfigurationComponent,
    EmployeeResignation,
    RateTagConfigurationComponent,
    AddRateTagsComponent,
    BankComponent,
    AddBankComponent,
    PayRollBandsComponent,
    EmployeePreviousCompanyTaxComponent,
    AddRateTagComponent,
    ExitWorItemDialogComponent,
    RateTagLibraryComponent
  ],
})
export class PayRollModule {
}
