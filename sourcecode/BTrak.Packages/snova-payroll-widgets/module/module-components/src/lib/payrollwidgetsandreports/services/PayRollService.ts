import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PayRollComponentModel } from '../models/PayRollComponentModel';
import { PayRollTemplateModel } from '../models/PayRollTemplateModel';
import { PayRollTemplateConfigurationModel } from '../models/PayRollTemplateConfigurationModel';
import { PayRollResignationStatusModel } from '../models/PayRollResignationStatusModel';
import { EmployeeBonus } from '../models/employee-bonus';
import { PayRollRoleConfigurationModel } from '../models/payrollroleconfigurationmodel';
import { PayRollBranchConfigurationModel } from '../models/payrollbranchconfigurationmodel';
import { PayRollGenderConfigurationModel } from '../models/payrollgenderconfigurationmodel';
import { PayRollMaritalStatusConfigurationModel } from '../models/payrollmaritalstatusconfigurationmodel';
import { EmployeePayRollConfiguration } from '../models/employee-payroll-configuration';
import { PayRollEmployeeResignationModel } from '../models/PayRollEmployeeResignationModel';
import { PayrollStatus } from '../models/payroll-status';
import { TaxAllowanceModel } from '../models/TaxAllowanceModel';
import { EmployeeTaxAllowanceDetailsModel } from '../models/employeetaxallowancedetailsmodel';
import { LeaveEncashmentSettingsModel } from '../models/leaveencashmentsettingsmodel';
import { EmployeeAccountDetailsModel } from '../models/employeeaccountdetailsmodel';
import { FinancialYearConfigurationsModel } from '../models/financialyearconfigurationsmodel';
import { PayRollCalculationConfigurationsModel } from '../models/payrollcalculationconfigurationsmodel';
import { CreditorDetailsModel } from '../models/creditordetailsmodel';
import { TdsSettingsModel } from '../models/tdssettingsmodel';
import { map } from 'rxjs/operators';
import { MonthlyESIModel } from '../models/monthlyEsiModel';
import { ProfessionalTaxMonthlyModel } from '../models/professional-tax-monthly';
import { GradeDetailsModel } from '../models/gradeDetailsmodel';
import { IncomeSalaryModel } from '../models/incomeSalaryModel';
import { SearchHourlyTds } from '../models/search-hourly-tdsmodel';
import { HourlyTds } from '../models/hourly-tdsmodel';
import { DaysOfWeekConfiguration } from '../models/daysofweek-configurationmodel';
import { AllowanceTime } from '../models/allowance-timemodel';
import { ContractPaySettingsModel } from '../models/contractpaysettingsmodel';
import { EmployeeLoanModel } from '../models/employeeloancomponentmodel';
import { EmployeeLoan } from '../models/employee-loan';
import { SalaryWagesModel } from '../models/salary-wages.model';
import { EmployeeESIModel } from '../models/esi-of-employee.model';
import { EmployeePFModel } from '../models/employee-pf.model';
import { SalaryForITModel } from '../models/salary-for-it.model';
import { RateTagModel } from '../models/ratetag-model';
import { RateTagForModel } from '../models/ratetag-for-model';
import { RateTagAllowanceTime } from '../models/ratetagallowancetimemodel';
import { EmployeeRateTagModel } from '../models/employee-ratetag-model';
import { EmployeeRateTagInsertModel } from '../models/employee-ratetag-insert-model';
import { EmployeeRateTagDetailsSearchModel } from '../models/employee-ratetag-details-search-model';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { CompanyRegistrationModel } from '../models/company-registration-model';
import { Branch } from '../models/branch';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user';
import { EmployeeGradeModel } from '../models/employee-grade.model';
import { HrBranchModel } from '../models/branch-model';
import { EmploymentStatusSearchModel } from '../models/employment-status-search-model';
import { RateSheetForModel } from '../models/ratesheet-for-model';
import { WeekdayModel } from '../models/weekday-model';
import { EmployeeListModel } from '../models/employee-list-model';
import { GenderSearchModel } from '../models/gender-search-model';
import { MaritalStatusesSearchModel } from '../models/marital-statuses-search-model';
import { AppsettingsModel } from '../models/appsetting-model';
import { PayfrequencyModel } from '../models/payfrequency-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { EmployeeDetailsSearchModel } from '../models/employee-details-search-model';
import { PartsOfDayModel } from '../models/partsofdaymodel';
import { BankModel } from '../models/bankmodel';
import { RateTagConfigurationModel } from '../models/RateTagConfigurationModel';
import { RateTagConfigurationInsertModel } from '../models/ratetagconfigurationinputmodel';
import { RateTagRoleBranchConfigurationModel } from '../models/ratetagrolebranchconfiguration';
import { PayRollBandsModel } from '../models/payrollbandsmodel';
import { EmployeePreviousCompanyTaxModel } from '../models/employeepreviouscompanytaxmodel';
import { EmployeeRateTagConfigurationModel } from '../models/employeeratetagconfiguration';
import { ExitModel } from '../models/exit.model';
import { UserStory } from '../models/userstory.model';


let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class PayRollService {

  constructor(private http: HttpClient) { }

  private GET_ALL_PayRollComponent = APIEndpoint + ApiUrls.GetPayRollComponents;
  private Upsert_PayRollComponent = APIEndpoint + ApiUrls.UpsertPayRollComponent;
  private GET_ALL_PayRollTemplate = APIEndpoint + ApiUrls.GetPayRollTemplates;
  private Upsert_PayRollTemplate = APIEndpoint + ApiUrls.UpsertPayRollTemplate;
  private GET_ALL_ResignationStatusComponent = APIEndpoint + ApiUrls.GetResignationStatus;
  private Upsert_ResignationStatus = APIEndpoint + ApiUrls.UpsertResignationStatus;

  private GetEmployeesBonusDetails = APIEndpoint + ApiUrls.GetEmployeesBonusDetails;
  private UpsertEmployeesBonusDetails = APIEndpoint + ApiUrls.UpsertEmployeeBonusDetails;
  private GetEmployees = APIEndpoint + ApiUrls.GetEmployeesForBonus;
  private GetEmployeesPayTemplates = APIEndpoint + ApiUrls.GetEmployeesPayTemplates;
  private GetEmployeePayrollConfiguration = APIEndpoint + ApiUrls.GetEmployeePayrollConfiguration;
  private UpsertEmployeePayrollConfiguration = APIEndpoint + ApiUrls.UpsertEmployeePayrollConfiguration;

  private GET_ALL_PayRollRoleConfiguration = APIEndpoint + ApiUrls.GetPayRollRoleConfigurations;
  private Upsert_PayRollRoleConfiguration = APIEndpoint + ApiUrls.UpsertPayRollRoleConfiguration;
  private GET_ALL_PayRollBranchConfiguration = APIEndpoint + ApiUrls.GetPayRollBranchConfigurations;
  private Upsert_PayRollBranchConfiguration = APIEndpoint + ApiUrls.UpsertPayRollBranchConfiguration;
  private GET_ALL_PayRollGenderConfiguration = APIEndpoint + ApiUrls.GetPayRollGenderConfigurations;
  private Upsert_PayRollGenderConfiguration = APIEndpoint + ApiUrls.UpsertPayRollGenderConfiguration;
  private GET_ALL_PayRollMaritalStatusConfiguration = APIEndpoint + ApiUrls.GetPayRollMaritalStatusConfigurations;
  private Upsert_PayRollMaritalStatusConfiguration = APIEndpoint + ApiUrls.UpsertPayRollMaritalStatusConfiguration;
  private GetPayrollStatusList = APIEndpoint + ApiUrls.GetPayrollStatusList;
  private UpsertPayrollStatus = APIEndpoint + ApiUrls.UpsertPayrollStatus;

  private GetEmployeesResignation = APIEndpoint + ApiUrls.GetEmployeesResignation;
  private Upsert_EmployeeResignation = APIEndpoint + ApiUrls.UpsertEmployeeResignation;
  private GET_ALL_Component = APIEndpoint + ApiUrls.GetComponents;
  private GET_ALL_TaxAllowances = APIEndpoint + ApiUrls.GetTaxAllowances;
  private Upsert_TaxAllowance = APIEndpoint + ApiUrls.UpsertTaxAllowance;
  private GET_ALL_TaxAllowanceType = APIEndpoint + ApiUrls.GetTaxAllowanceTypes;
  private GET_ALL_EmployeeTaxAllowanceDetails = APIEndpoint + ApiUrls.GetEmployeeTaxAllowanceDetails;
  private Upsert_EmployeeTaxAllowanceDetails = APIEndpoint + ApiUrls.UpsertEmployeeTaxAllowanceDetails;
  private GET_ALL_LeaveEncashmentSettings = APIEndpoint + ApiUrls.GetLeaveEncashmentSettings;
  private Upsert_LeaveEncashmentSettings = APIEndpoint + ApiUrls.UpsertLeaveEncashmentSettings;
  private GET_ALL_EmployeeAccountDetails = APIEndpoint + ApiUrls.GetEmployeeAccountDetails;
  private Upsert_EmployeeAccountDetails = APIEndpoint + ApiUrls.UpsertEmployeeAccountDetails;
  private GET_ALL_FinancialYearConfigurations = APIEndpoint + ApiUrls.GetFinancialYearConfigurations;
  private Upsert_FinancialYearConfigurations = APIEndpoint + ApiUrls.UpsertFinancialYearConfigurations;
  private GET_ALL_EmployeeCreditorDetails = APIEndpoint + ApiUrls.GetEmployeeCreditorDetails;
  private Upsert_EmployeeCreditorDetails = APIEndpoint + ApiUrls.UpsertEmployeeCreditorDetails;
  private GET_ALL_PayRollCalculationConfigurations = APIEndpoint + ApiUrls.GetPayRollCalculationConfigurations;
  private Upsert_PayRollCalculationConfigurations = APIEndpoint + ApiUrls.UpsertPayRollCalculationConfigurations;
  private GET_ALL_PeriodType = APIEndpoint + ApiUrls.GetPeriodTypes;
  private GET_ALL_PayRollCalculationType = APIEndpoint + ApiUrls.GetPayRollCalculationTypes;
  private GET_ALL_FinancialYearType = APIEndpoint + ApiUrls.GetFinancialYearTypes;
  private GET_ALL_MonthlyESI = APIEndpoint + ApiUrls.GetESIMonthlyStatement;
  private GET_ALL_TdsSettings = APIEndpoint + ApiUrls.GetTdsSettings;
  private Upsert_TdsSettings = APIEndpoint + ApiUrls.UpsertTdsSettings;
  private GET_ALL_ContractPaySettings = APIEndpoint + ApiUrls.GetContractPaySettings;
  private Upsert_ContractPaySettings = APIEndpoint + ApiUrls.UpsertContractPaySettings;
  private GET_ALL_ContractPayType = APIEndpoint + ApiUrls.GetContractPayTypes;
  private GET_ALL_PartsOfDay = APIEndpoint + ApiUrls.GetPartsOfDays;
  private GET_ALL_EmployeeLoan = APIEndpoint + ApiUrls.GetEmployeeLoans;
  private Upsert_EmployeeLoan = APIEndpoint + ApiUrls.UpsertEmployeeLoan;
  private GET_ALL_LoanType = APIEndpoint + ApiUrls.GetLoanTypes;

  private Get_All_Roles__API_PATH = APIEndpoint + "Roles/RolesApi/GetAllRoles";
  private GET_Currencies = APIEndpoint + ApiUrls.SearchSystemCurrencies;
  private USERS_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetAllUsers;
  private GET_All_Appsettings = APIEndpoint + ApiUrls.GetAppsettings;
  private GET_ALL_Bank = APIEndpoint + ApiUrls.GetBanks;
 


  ConvertDataToCSVFile(HeaderColumns: any[], data: any,
    HeaderColumnsIgnored: any[], filename: string) {
    let csvArray: any;
    const replacer = (key, value) => value === null ? '' :
      (value.toString().indexOf('"') > 0 ?
        value.replace(/"/g, " ") : value); // specify how you want to handle null values here

    if (data.length > 0) {
      const header_original = Object.keys(data[0]).filter(function (item) {
        return HeaderColumnsIgnored.findIndex(x => x.field === item) === -1
      });
      const header_show = header_original.map(function (value: string, index: number) {
        return HeaderColumns.filter(function (item) { return item.field === value })[0].title
      });
      let csv = data.map(row => header_original.map
        (fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header_show.join(','));
      csvArray = csv.join('\r\n');
    }
    else {
      // no record rows
      const header_show = HeaderColumns.map(function (value: string, index: number) {
        return value["title"];
      });
      let csv = data.map(row => header_show.map
        (fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header_show.join(','));
      csvArray = csv.join('\r\n');
    }
    var a = document.createElement('a');
    var blob = new Blob([csvArray], { type: 'text/csv' }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  getAllPayRollComponents(payRollComponentModel: PayRollComponentModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(payRollComponentModel);

    return this.http.post(`${this.GET_ALL_PayRollComponent}`, body, httpOptions);
  }

  upsertPayRollComponent(payRollComponentModel: PayRollComponentModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(payRollComponentModel);

    return this.http.post(`${this.Upsert_PayRollComponent}`, body, httpOptions);
  }

  getAllPayRollTemplates(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${this.GET_ALL_PayRollTemplate}`, body, httpOptions);
  }

  upsertPayRollTemplate(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${this.Upsert_PayRollTemplate}`, body, httpOptions);
  }

  getAllComponents(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${this.GET_ALL_Component}`, body, httpOptions);
  }

  getAllResignationStatus(PayRollResignationStatusModel: PayRollResignationStatusModel) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollResignationStatusModel);

    return this.http.post(`${this.GET_ALL_ResignationStatusComponent}`, body, httpOptions);

  }

  upsertResignationStatus(PayRollResignationStatusModel: PayRollResignationStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollResignationStatusModel);

    return this.http.post(`${this.Upsert_ResignationStatus}`, body, httpOptions);
  }

  getEmployeesBonus(employeeId) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get(`${this.GetEmployeesBonusDetails}?employeeId=` + employeeId, httpOptions);
  }

  upsertEmployeeBonus(employeeBonus: EmployeeBonus) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(employeeBonus);

    return this.http.post(`${this.UpsertEmployeesBonusDetails}`, body, httpOptions);
  }

  //exit
	getAllExitConfigurations(exit: ExitModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(exit);

		return this.http.post(APIEndpoint + ApiUrls.GetExitConfigurations, body, httpOptions)
			.pipe(map((result) => {
				return result;
			}));
	}

  upsertExitConfiguration(exit: ExitModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(exit);

		return this.http.post(APIEndpoint + ApiUrls.UpsertExitConfiguration, body, httpOptions)
			.pipe(map((result) => {
				return result;
			}));
	}

  getUsersDropDown(searchText: string) {
		let paramsobj = new HttpParams().set('searchText', searchText);
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
			params: paramsobj
		};
		return this.http.get(APIEndpoint + ApiUrls.GetUsersDropDown, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

  upsertAdhocWork(userStory: UserStory) {
    const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(userStory);
    return this.http
        .post(APIEndpoint + ApiUrls.UpsertAdhocWork, body, httpOptions)
        .pipe(
            map(result => {
                return result;
            })
        );
}


  getEmployees() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(this.GetEmployees, httpOptions);
  }

  getAllPayRollRoleConfigurations(PayRollRoleConfigurationModel: PayRollRoleConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollRoleConfigurationModel);

    return this.http.post(`${this.GET_ALL_PayRollRoleConfiguration}`, body, httpOptions);
  }

  upsertPayRollRoleConfiguration(PayRollRoleConfigurationModel: PayRollRoleConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollRoleConfigurationModel);

    return this.http.post(`${this.Upsert_PayRollRoleConfiguration}`, body, httpOptions);
  }

  getAllPayRollBranchConfigurations(PayRollBranchConfigurationModel: PayRollBranchConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollBranchConfigurationModel);

    return this.http.post(`${this.GET_ALL_PayRollBranchConfiguration}`, body, httpOptions);
  }

  upsertPayRollBranchConfiguration(PayRollBranchConfigurationModel: PayRollBranchConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollBranchConfigurationModel);

    return this.http.post(`${this.Upsert_PayRollBranchConfiguration}`, body, httpOptions);
  }

  getAllPayRollGenderConfigurations(PayRollGenderConfigurationModel: PayRollGenderConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollGenderConfigurationModel);

    return this.http.post(`${this.GET_ALL_PayRollGenderConfiguration}`, body, httpOptions);
  }

  upsertPayRollGenderConfiguration(PayRollGenderConfigurationModel: PayRollGenderConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollGenderConfigurationModel);

    return this.http.post(`${this.Upsert_PayRollGenderConfiguration}`, body, httpOptions);
  }

  getAllPayRollMaritalStatusConfigurations(PayRollMaritalStatusConfigurationModel: PayRollMaritalStatusConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollMaritalStatusConfigurationModel);

    return this.http.post(`${this.GET_ALL_PayRollMaritalStatusConfiguration}`, body, httpOptions);
  }

  upsertPayRollMaritalStatusConfiguration(PayRollMaritalStatusConfigurationModel: PayRollMaritalStatusConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollMaritalStatusConfigurationModel);

    return this.http.post(`${this.Upsert_PayRollMaritalStatusConfiguration}`, body, httpOptions);
  }

  getEmployeesPayTemplates() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(this.GetEmployeesPayTemplates, httpOptions);
    // return this.http.post(`${this.GET_ALL_PayRollTemplate}`, body, httpOptions);
  }

  getEmployeePayrollConfiguration() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(this.GetEmployeePayrollConfiguration, httpOptions);
    // return this.http.post(`${this.GET_ALL_PayRollTemplate}`, body, httpOptions);
  }

  upsertEmployeePayrollConfiguration(employeePayRollConfiguration: EmployeePayRollConfiguration) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(employeePayRollConfiguration);

    return this.http.post(this.UpsertEmployeePayrollConfiguration, body, httpOptions);
  }


  upsertEmployeeResignation(PayRollEmployeeResignationModel: PayRollEmployeeResignationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollEmployeeResignationModel);

    return this.http.post(`${this.Upsert_EmployeeResignation}`, body, httpOptions);
  }
  getAllEmployeeResignation(PayRollEmployeeResignationModel: PayRollEmployeeResignationModel) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollEmployeeResignationModel);

    return this.http.post(`${this.GetEmployeesResignation}`, body, httpOptions);
  }
  getPayrollStatusList() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(this.GetPayrollStatusList, httpOptions);
    // return this.http.post(`${this.GET_ALL_PayRollTemplate}`, body, httpOptions);
  }

  upsertPayrollStatus(payrollStatus: PayrollStatus) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(payrollStatus);

    return this.http.post(this.UpsertPayrollStatus, body, httpOptions);
  }

  getAllTaxAllowances(TaxAllowanceModel: TaxAllowanceModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(TaxAllowanceModel);

    return this.http.post(`${this.GET_ALL_TaxAllowances}`, body, httpOptions);
  }

  upsertTaxAllowance(TaxAllowanceModel: TaxAllowanceModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(TaxAllowanceModel);

    return this.http.post(`${this.Upsert_TaxAllowance}`, body, httpOptions);
  }

  getAllTaxAllowanceTypes(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${this.GET_ALL_TaxAllowanceType}`, body, httpOptions);
  }

  getAllEmployeeTaxAllowanceDetails(EmployeeTaxAllowanceDetailsModel: EmployeeTaxAllowanceDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(EmployeeTaxAllowanceDetailsModel);

    return this.http.post(`${this.GET_ALL_EmployeeTaxAllowanceDetails}`, body, httpOptions);
  }

  upsertEmployeeTaxAllowanceDetails(EmployeeTaxAllowanceDetailsModel: EmployeeTaxAllowanceDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(EmployeeTaxAllowanceDetailsModel);

    return this.http.post(`${this.Upsert_EmployeeTaxAllowanceDetails}`, body, httpOptions);
  }

  getAllLeaveEncashmentSettings(LeaveEncashmentSettingsModel: LeaveEncashmentSettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(LeaveEncashmentSettingsModel);

    return this.http.post(`${this.GET_ALL_LeaveEncashmentSettings}`, body, httpOptions);
  }

  upsertLeaveEncashmentSettings(LeaveEncashmentSettingsModel: LeaveEncashmentSettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(LeaveEncashmentSettingsModel);

    return this.http.post(`${this.Upsert_LeaveEncashmentSettings}`, body, httpOptions);
  }

  getAllEmployeeAccountDetails(EmployeeAccountDetailsModel: EmployeeAccountDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(EmployeeAccountDetailsModel);

    return this.http.post(`${this.GET_ALL_EmployeeAccountDetails}`, body, httpOptions);
  }

  upsertEmployeeAccountDetails(EmployeeAccountDetailsModel: EmployeeAccountDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(EmployeeAccountDetailsModel);

    return this.http.post(`${this.Upsert_EmployeeAccountDetails}`, body, httpOptions);
  }

  getAllFinancialYearConfigurations(FinancialYearConfigurationsModel: FinancialYearConfigurationsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(FinancialYearConfigurationsModel);

    return this.http.post(`${this.GET_ALL_FinancialYearConfigurations}`, body, httpOptions);
  }

  upsertFinancialYearConfigurations(FinancialYearConfigurationsModel: FinancialYearConfigurationsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(FinancialYearConfigurationsModel);

    return this.http.post(`${this.Upsert_FinancialYearConfigurations}`, body, httpOptions);
  }

  getAllEmployeeCreditorDetails(EmployeeCreditorDetailsModel: CreditorDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(EmployeeCreditorDetailsModel);

    return this.http.post(`${this.GET_ALL_EmployeeCreditorDetails}`, body, httpOptions);
  }

  upsertEmployeeCreditorDetails(EmployeeCreditorDetailsModel: CreditorDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(EmployeeCreditorDetailsModel);

    return this.http.post(`${this.Upsert_EmployeeCreditorDetails}`, body, httpOptions);
  }

  getAllPayRollCalculationConfigurations(PayRollCalculationConfigurationsModel: PayRollCalculationConfigurationsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollCalculationConfigurationsModel);

    return this.http.post(`${this.GET_ALL_PayRollCalculationConfigurations}`, body, httpOptions);
  }

  upsertPayRollCalculationConfigurations(PayRollCalculationConfigurationsModel: PayRollCalculationConfigurationsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollCalculationConfigurationsModel);

    return this.http.post(`${this.Upsert_PayRollCalculationConfigurations}`, body, httpOptions);
  }

  getAllPeriodTypes(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${this.GET_ALL_PeriodType}`, body, httpOptions);
  }


  getAllPayRollCalculationTypes(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${this.GET_ALL_PayRollCalculationType}`, body, httpOptions);
  }

  getAllFinancialYearTypes(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${this.GET_ALL_FinancialYearType}`, body, httpOptions);
  }

  downloadSalaryCertificate(employeeId: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(employeeId);

    return this.http.post(APIEndpoint + ApiUrls.DownloadEmployeeSalaryCertificate, body, httpOptions);
  }

  getAllTdsSettings(TdsSettingsModel: TdsSettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(TdsSettingsModel);

    return this.http.post(`${this.GET_ALL_TdsSettings}`, body, httpOptions);
  }

  upsertTdsSettings(TdsSettingsModel: TdsSettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(TdsSettingsModel);

    return this.http.post(`${this.Upsert_TdsSettings}`, body, httpOptions);
  }

  getHourlyTdsConfiguration(searchHourlyTds: SearchHourlyTds) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(searchHourlyTds);

    return this.http.post(APIEndpoint + ApiUrls.GetHourlyTdsConfiguration, body, httpOptions);
  }

  upsertHourlyTdsConfiguration(hourlyTds: HourlyTds) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(hourlyTds);

    return this.http.post(APIEndpoint + ApiUrls.UpsertHourlyTdsConfiguration, body, httpOptions);
  }

  getDaysOfWeekConfiguration(searchHourlyTds: SearchHourlyTds) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(searchHourlyTds);

    return this.http.post(APIEndpoint + ApiUrls.GetDaysOfWeekConfiguration, body, httpOptions);
  }

  upsertDayOfWeekConfiguration(dayOfWeek: DaysOfWeekConfiguration) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(dayOfWeek);

    return this.http.post(APIEndpoint + ApiUrls.UpsertDaysOfWeekConfiguration, body, httpOptions);
  }

  getAllowanceTime(searchHourlyTds: SearchHourlyTds) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(searchHourlyTds);

    return this.http.post(APIEndpoint + ApiUrls.GetAllowanceTime, body, httpOptions);
  }

  upsertAllowanceTime(allowanceTime: AllowanceTime) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(allowanceTime);

    return this.http.post(APIEndpoint + ApiUrls.UpsertAllowanceTime, body, httpOptions);
  }

  getAllContractPaySettings(ContractPaySettingsModel: ContractPaySettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(ContractPaySettingsModel);

    return this.http.post(`${this.GET_ALL_ContractPaySettings}`, body, httpOptions);
  }

  upsertContractPaySettings(ContractPaySettingsModel: ContractPaySettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(ContractPaySettingsModel);

    return this.http.post(`${this.Upsert_ContractPaySettings}`, body, httpOptions);
  }

  getAllContractPayTypes(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${this.GET_ALL_ContractPayType}`, body, httpOptions);
  }

  getAllPartsOfDays(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${this.GET_ALL_PartsOfDay}`, body, httpOptions);
  }

  getAllEmployeeLoans(EmployeeLoanModel: EmployeeLoanModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(EmployeeLoanModel);

    return this.http.post(`${this.GET_ALL_EmployeeLoan}`, body, httpOptions);
  }

  upsertEmployeeLoan(EmployeeLoanModel: EmployeeLoanModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(EmployeeLoanModel);

    return this.http.post(`${this.Upsert_EmployeeLoan}`, body, httpOptions);
  }

  getAllLoanTypes(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${this.GET_ALL_LoanType}`, body, httpOptions);
  }

  getEmployeeLoanInstallment(searchHourlyTds: SearchHourlyTds) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(searchHourlyTds);

    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeLoanInstallment, body, httpOptions);
  }

  upsertEmployeeLoanInstallMent(employeeLoan: EmployeeLoan) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(employeeLoan);

    return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeLoanInstallment, body, httpOptions);
  }

  getPayRollMonthlyDetails(dateOfMonth) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.get(`${APIEndpoint + ApiUrls.GetPayRollMonthlyDetails}?dateOfMonth=` + dateOfMonth, httpOptions)
  }


  downloadEmployeeLoanStatement(employeeLoanModel: EmployeeLoanModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(employeeLoanModel);

    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeLoanStatementDocument, body, httpOptions);
  }

  getEsiMonthlyStatement(monthlyESIModel: MonthlyESIModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(monthlyESIModel);

    return this.http.post(`${this.GET_ALL_MonthlyESI}`, body, httpOptions);
  }

  getSalaryReport(monthlyESIModel: MonthlyESIModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(monthlyESIModel);

    return this.http.post(APIEndpoint + ApiUrls.GetSalaryRegister, body, httpOptions);
  }

  getProfessionalTaxMonthly(professionalTaxMonthlyModel: ProfessionalTaxMonthlyModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(professionalTaxMonthlyModel);

    return this.http.post(APIEndpoint + ApiUrls.GetProfessionTaxMonthlyStatement, body, httpOptions);
  }

  getProfessionalTaxReturn(professionalTaxMonthlyModel: ProfessionalTaxMonthlyModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(professionalTaxMonthlyModel);

    return this.http.post(APIEndpoint + ApiUrls.GetProfessionTaxReturns, body, httpOptions);
  }


  getSalaryBillRegister(monthlyESIModel: MonthlyESIModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(monthlyESIModel);

    return this.http.post(APIEndpoint + ApiUrls.GetSalaryBillRegister, body, httpOptions);
  }

  getEmployeeGradeDetails(gradeDetailsModel: GradeDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(gradeDetailsModel);

    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeGrades, body, httpOptions);
  }

  upsertEmployeeGradeDetails(gradeDetailsModel: GradeDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(gradeDetailsModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeGrade, body, httpOptions);
  }

  getIncomeSalaryDetails(incomeSalaryModel: IncomeSalaryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(incomeSalaryModel);

    return this.http.post(APIEndpoint + ApiUrls.GetIncomeSalaryStatementDetail, body, httpOptions);
  }

  getFormvPdf(professionalTaxMonthlyModel: ProfessionalTaxMonthlyModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(professionalTaxMonthlyModel);

    return this.http.post(APIEndpoint + ApiUrls.GetFormvPdf, body, httpOptions);
  }

  getRegisterOfWages(salaryWagesModes: SalaryWagesModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(salaryWagesModes);

    return this.http.post(APIEndpoint + ApiUrls.GetRegisterOfWages, body, httpOptions);
  }

  getEmployeePF(employeePFModel: EmployeePFModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(employeePFModel);

    return this.http.post(APIEndpoint + ApiUrls.GetEmployeePFReport, body, httpOptions);
  }

  getESIDetailsOfEmployee(employeeESIModel: EmployeeESIModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(employeeESIModel);

    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeESIReport, body, httpOptions);
  }

  getSalaryForIT(salaryForITModel: SalaryForITModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(salaryForITModel);
    return this.http.post(APIEndpoint + ApiUrls.GetSalaryforITOfAnEmployee, body, httpOptions);
  }


  getTakeHomeAmount(employeeSalaryId) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetTakeHomeAmount}?employeeSalaryId=` + employeeSalaryId, httpOptions)
  }

  getUserCountry() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.get(APIEndpoint + ApiUrls.GetUserCountry, httpOptions)
  }

  getAllRateTags(rateSheetModel: RateTagModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(rateSheetModel);

    return this.http.post(APIEndpoint + ApiUrls.GetRateTags, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllRateTagForNames(rateSheetForModel: RateTagForModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(rateSheetForModel);

    return this.http.post(APIEndpoint + ApiUrls.GetRateTagForNames, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertRateTag(rateSheetModel: RateTagModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(rateSheetModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertRateTag, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getRateTagAllowanceTime(searchHourlyTds: SearchHourlyTds) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(searchHourlyTds);

    return this.http.post(APIEndpoint + ApiUrls.GetRateTagAllowanceTime, body, httpOptions);
  }

  upsertRateTagAllowanceTime(allowanceTime: RateTagAllowanceTime) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(allowanceTime);

    return this.http.post(APIEndpoint + ApiUrls.UpsertRateTagAllowanceTime, body, httpOptions);
  }

  insertEmployeeRateTagDetails(employeeRateTagInsertModel: EmployeeRateTagInsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(employeeRateTagInsertModel);
    return this.http.post(APIEndpoint + ApiUrls.InsertEmployeeRateTagDetails, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  updateEmployeeRateTagDetails(employeeRateTagModel: EmployeeRateTagModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(employeeRateTagModel);
    return this.http.post(APIEndpoint + ApiUrls.UpdateEmployeeRateTagDetails, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  searchEmployeeRateTagDetails(employeeDetailsSearchModel: EmployeeDetailsSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeDetailsSearchModel);
    return this.http.post(APIEndpoint + ApiUrls.SearchEmployeeRateTagDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllRoles() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    var data = { RoleId: null, RoleName: null, Data: null, isArchived: false };
    let body = JSON.stringify(data);

    return this.http
      .post(`${this.Get_All_Roles__API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getCurrencies(companyModel: CompanyRegistrationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(this.GET_Currencies, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getBranchList(branchSearchResult: Branch): Observable<Branch[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(branchSearchResult);
    return this.http.post<Branch[]>(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllUsers(userModel: UserModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(userModel);
    return this.http.post(`${this.USERS_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getGrades(employeeGradeModel: EmployeeGradeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(employeeGradeModel);

    return this.http.post(APIEndpoint + ApiUrls.GetGrades, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }


  upsertGrades(employeeGradeModel: EmployeeGradeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(employeeGradeModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertGrade, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getEntityDropDown(searchText) {
    let paramsobj = new HttpParams().set('searchText', searchText);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
      params: paramsobj
    };
    return this.http.get(`${APIEndpoint + ApiUrls.GetEntityDropDown}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getBranches(branchModel: HrBranchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(branchModel);

    return this.http.post(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllEmploymentStatuses(employmentStatusModel: EmploymentStatusSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employmentStatusModel);
    return this.http.post(`${APIEndpoint + ApiUrls.GetEmploymentStatus}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllRateSheetForNames(rateSheetForModel: RateSheetForModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(rateSheetForModel);

    return this.http.post(APIEndpoint + ApiUrls.GetRateSheetForNames, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllWeekDays(weekDayModel: WeekdayModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(weekDayModel);

    return this.http.post(APIEndpoint + ApiUrls.GetWeekDays, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getUserById(userModel: UserModel) {
    let paramsobj = new HttpParams().set('userId', userModel.userId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get<UserModel[]>(APIEndpoint + ApiUrls.GetUserById, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllEmployees(employeeModel: EmployeeListModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeModel);
    return this.http.post(`${APIEndpoint + ApiUrls.GetAllEmployees}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getGenders(genderSearchModel: GenderSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(genderSearchModel);
    return this.http.post(APIEndpoint + ApiUrls.GetGenders, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getMaritalStatuses(maritalStatusesSearchModel: MaritalStatusesSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(maritalStatusesSearchModel);
    return this.http.post(APIEndpoint + ApiUrls.GetMaritalStatuses, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  UploadFile(formData, moduleTypeId) {
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };
    return this.http
      .post(`${APIEndpoint + ApiUrls.UploadFile}?moduleTypeId=` + moduleTypeId, formData, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  getAllAppSettings(appsettingsModel: AppsettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(appsettingsModel);

    return this.http.post(`${this.GET_All_Appsettings}`, body, httpOptions);
  }

  getAllEmployeesDetails(employeeModel: EmployeeListModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeModel);
    return this.http.post(`${APIEndpoint + ApiUrls.GetAllEmployeesDetails}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  downloadPayslip(payrollRunId, employeeId) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.get(`${APIEndpoint + ApiUrls.DownloadPaySlip}?payrollRunId=` + payrollRunId + '&employeeId=' + employeeId, httpOptions)
  }

  getEmployeePayrollDetailsList(employeeId) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get(`${APIEndpoint + ApiUrls.GetEmployeePayrollDetailsList}?employeeId=` + employeeId, httpOptions)
  }

  getMyEmployeeId(userId: string) {
    let paramsobj = new HttpParams().set('userId', userId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get<UserModel[]>(APIEndpoint + ApiUrls.GetUserById, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEmployeeDetails(employeeDetailsSearchModel: EmployeeDetailsSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeDetailsSearchModel);
    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getLoggedInUser() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.get(`${APIEndpoint + ApiUrls.GetLoggedInUser}`, httpOptions).pipe(
      map(result => {
        return result;
      })
    );
  }

  upsertPartsOfDay(partsOfDay: PartsOfDayModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(partsOfDay);

    return this.http.post(APIEndpoint + ApiUrls.UpsertPartsOfDay, body, httpOptions);
  }

  getAllBanks(bankModel: BankModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(bankModel);

    return this.http.post(`${this.GET_ALL_Bank}`, body, httpOptions);
  }

  insertRateTagConfigurations(rateTagConfigurationInsertModel: RateTagConfigurationInsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(rateTagConfigurationInsertModel);
    return this.http.post(APIEndpoint + ApiUrls.InsertRateTagConfigurations, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  updatetRateTagConfiguration(rateTagConfigurationModel: RateTagConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(rateTagConfigurationModel);
    return this.http.post(APIEndpoint + ApiUrls.UpdateRateTagConfiguration, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  UpsertRateTagRoleBranchConfiguration(rateTagRoleBranchConfigurationModel: RateTagRoleBranchConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(rateTagRoleBranchConfigurationModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertRateTagRoleBranchConfiguration, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getRateTagConfigurations(rateTagConfigurationModel: RateTagConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(rateTagConfigurationModel);

    return this.http.post(APIEndpoint + ApiUrls.GetRateTagConfigurations, body, httpOptions);
  }

  getRateTagRoleBranchConfigurations(rateTagRoleBranchConfigurationModel: RateTagRoleBranchConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(rateTagRoleBranchConfigurationModel);

    return this.http.post(APIEndpoint + ApiUrls.GetRateTagRoleBranchConfigurations, body, httpOptions);
  }

  upsertBank(bankModel: BankModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(bankModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertBank, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getCountries(companyModel: CompanyRegistrationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(APIEndpoint + ApiUrls.GetCountries, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllPayRollBands(payRollBandsModel: PayRollBandsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(payRollBandsModel);

    return this.http.post(APIEndpoint + ApiUrls.GetPayRollBands, body, httpOptions);
  }

  upsertPayRollBands(payRollBandsModel: PayRollBandsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(payRollBandsModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertPayRollBands, body, httpOptions);
  }

  getAllEmployeePreviousCompanyTaxes(EmployeePreviousCompanyTaxModel: EmployeePreviousCompanyTaxModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(EmployeePreviousCompanyTaxModel);

    return this.http.post(APIEndpoint + ApiUrls.GetEmployeePreviousCompanyTaxes, body, httpOptions);
  }

  upsertEmployeePreviousCompanyTax(EmployeePreviousCompanyTaxModel: EmployeePreviousCompanyTaxModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(EmployeePreviousCompanyTaxModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeePreviousCompanyTax, body, httpOptions);
  }

  getEmployeeRateTagConfigurations(employeeRateTagConfigurationModel: EmployeeRateTagConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(employeeRateTagConfigurationModel);

    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeRateTagConfigurations, body, httpOptions);
  }
}
