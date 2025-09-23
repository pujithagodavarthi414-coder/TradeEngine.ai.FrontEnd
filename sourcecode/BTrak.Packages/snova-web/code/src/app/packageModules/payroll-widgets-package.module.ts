import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PayRollModule, EmployeeResignation, ConfigureEmployeeBonusComponent, ContractPaySettingsComponent, EmployeeLoanComponent, EmployeePayrollTemplatesComponent, EmployeeGradeConfigurationComponent, EmployeeGradeComponent, EmployeePFComponent, EsiMonthlyComponent, EsiOfAnEmployeeComponent, IncomeSalaryComponent, ProfessionalTaxMonthlyComponent, ProfessionalTaxReturnComponent, SalaryBillRegisterComponent, SalaryForItComponent, SalaryReportComponent, SalaryWagesComponent, PayrollStatusComponent, PayRollMonthlyDetailsComponent, RateTagComponent, RateTagAllowanceTimeComponent, EmployeeRateTagDetailsComponent, TdsSettingsComponent, AllowanceTimeComponent, CreditorDetailsComponent, DaysOfWeekConfigurationComponent, EmployeeLoanInstallment, EmployeeAccountDetailsComponent, PayRollEmployeeResignation, EmployeeTaxAllowanceDetailsComponent, FinancialYearConfigurationsComponent, HourlyTdsConfigurationComponent, LeaveEncashmentSettingsComponent, PayRollBranchConfigurationComponent, PayRollCalculationConfigurationsComponent, PayRollComponentComponent, PayRollGenderConfigurationComponent, PayRollMaritalStatusConfigurationComponent, PayRollTemplateComponent, PayrollDetailsComponent, PayRollRoleConfigurationComponent, TaxAllowanceComponent ,RateTagConfigurationComponent, BankComponent} from '@thetradeengineorg1/snova-payroll-widgets';
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { moduleLoader } from 'app/common/constants/module-loader';

export class PayRollWidgetComponentSupplierService {

    static components =  [
      {
          name: "Configure Employee bonus",
          componentTypeObject: ConfigureEmployeeBonusComponent
      }, 
      {
          name: "Contract pay settings",
          componentTypeObject: ContractPaySettingsComponent
      }, 
      {
          name: "Employee loans",
          componentTypeObject: EmployeeLoanComponent
      },
      {
          name: "Employee payroll configuration",
          componentTypeObject: EmployeePayrollTemplatesComponent
      },
      {
          name: "Employee grade configuration",
          componentTypeObject: EmployeeGradeConfigurationComponent
      },
      {
          name: "Employee grade",
          componentTypeObject: EmployeeGradeComponent
      },
      {
          name: "PF of employees",
          componentTypeObject: EmployeePFComponent
      },
      {
          name: "ESI monthly statement",
          componentTypeObject: EsiMonthlyComponent
      },
      {
          name: "ESI of employees",
          componentTypeObject: EsiOfAnEmployeeComponent
      },
      {
          name: "Income salary statement",
          componentTypeObject: IncomeSalaryComponent
      },
      {
          name: "Professional tax monthly statement",
          componentTypeObject: ProfessionalTaxMonthlyComponent
      },
      {
          name: "Professional tax returns",
          componentTypeObject: ProfessionalTaxReturnComponent
      },
      {
          name: "Salary bill register",
          componentTypeObject: SalaryBillRegisterComponent
      },
      {
          name: "Salary for IT",
          componentTypeObject: SalaryForItComponent
      },
      {
          name: "Salary register",
          componentTypeObject: SalaryReportComponent
      },
      {
          name: "Salary wages",
          componentTypeObject: SalaryWagesComponent
      },
      {
          name: "Configure Payroll status",
          componentTypeObject: PayrollStatusComponent
      },
      {
          name: "Monthly payroll details",
          componentTypeObject: PayRollMonthlyDetailsComponent
      },
      {
          name: "Rate tag library",
          componentTypeObject: RateTagComponent
      },
      {
          name: "Rate tag allowance time",
          componentTypeObject: RateTagAllowanceTimeComponent
      },
      {
          name: "Employee rate tag",
          componentTypeObject: EmployeeRateTagDetailsComponent
      },
      {
        name: "Rate tag configuration",
        componentTypeObject: RateTagConfigurationComponent
      },
      {
          name: "Tds settings",
          componentTypeObject: TdsSettingsComponent
      },
      {
          name: "Allowance time",
          componentTypeObject: AllowanceTimeComponent
      },
      {
          name: "Creditor details",
          componentTypeObject: CreditorDetailsComponent
      },
      {
          name: "Days of week configuration",
          componentTypeObject: DaysOfWeekConfigurationComponent
      },
      {
          name: "Employee loan installment",
          componentTypeObject: EmployeeLoanInstallment
      },
      {
          name: "Employee account details",
          componentTypeObject: EmployeeAccountDetailsComponent
      },
      {
          name: "Employee resignation",
          componentTypeObject: PayRollEmployeeResignation
      },
      {
          name: "Employee tax allowance details",
          componentTypeObject: EmployeeTaxAllowanceDetailsComponent
      },
      {
          name: "Financial year configurations",
          componentTypeObject: FinancialYearConfigurationsComponent
      },
      {
          name: "Hourly tds configuration",
          componentTypeObject: HourlyTdsConfigurationComponent
      },
      {
          name: "Leave encashment settings",
          componentTypeObject: LeaveEncashmentSettingsComponent
      },
      {
          name: "Payroll branch configuration",
          componentTypeObject: PayRollBranchConfigurationComponent
      },
      {
          name: "Payroll calculation configurations",
          componentTypeObject: PayRollCalculationConfigurationsComponent
      },
      {
          name: "Payroll component",
          componentTypeObject: PayRollComponentComponent
      },
      {
          name: "Payroll gender configuration",
          componentTypeObject: PayRollGenderConfigurationComponent
      },
      {
          name: "Payroll marital status configuration",
          componentTypeObject: PayRollMaritalStatusConfigurationComponent
      },
      {
          name: "Payroll template",
          componentTypeObject: PayRollTemplateComponent
      },
      {
          name: "Employee payroll details",
          componentTypeObject: PayrollDetailsComponent
      },
      {
          name: "Payroll role configuration",
          componentTypeObject: PayRollRoleConfigurationComponent
      },
      {
          name: "Tax allowance",
          componentTypeObject: TaxAllowanceComponent
      },
      {
          name: "Employee resignation details",
          componentTypeObject: EmployeeResignation
      },
      {
        name: "Bank",
        componentTypeObject: BankComponent
      }
    ]
}

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent
            }
        ]),
        CommonModule,
        ShellModule.forChild(moduleLoader as shellModulesInfo),
        PayRollModule
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo }
    ],
    entryComponents: []
})

export class PayRollWidgetPackageModule {
    static componentService = PayRollWidgetComponentSupplierService;
}
