import { WebHookModel } from '../../dependencies/models/webhook-model';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ExpenseCategoryModel, MerchantModel } from "../../dependencies/models/merchant-model";
import { shiftExpansionModel } from "../../dependencies/models/shiftmodel";
import { map } from "rxjs/operators";
// import { environment } from "../../../../environments/environment";
// import { ApiUrls } from "../../../common/constants/api-urls";
import { NationalityModel } from "../../dependencies/models/nationality-model";
// import { Employee } from "../../../views/hrmanagment/models/employeeList";
import { CountryModel } from "../../dependencies/models/country-model";
import { BadgeModel } from "../../dependencies/models/hr-models/badge-model";
import { HrBranchModel } from "../../dependencies/models/hr-models/branch-model";
import { ContractTypeModel } from "../../dependencies/models/hr-models/contract-type-model";
import { CurrencyModel } from "../../dependencies/models/hr-models/currency-model";
import { DepartmentModel } from "../../dependencies/models/hr-models/department-model";
import { DesignationModel } from "../../dependencies/models/hr-models/designation-model";
import { EducationModel } from "../../dependencies/models/hr-models/education-model";
import { EmployeeShift } from "../../dependencies/models/hr-models/employeeshift-model";
import { EmploymentStatusModel } from "../../dependencies/models/hr-models/employment-status-model";
import { JobCategoryModel } from "../../dependencies/models/hr-models/job-category-model";
import { LanguageModel } from "../../dependencies/models/hr-models/language-model";
import { LicenseTypeModel } from "../../dependencies/models/hr-models/licenseTypeModel";
import { MembershipModel } from "../../dependencies/models/hr-models/membership-model";
import { PayGradeModel } from "../../dependencies/models/hr-models/pay-grade-model";
import { PayfrequencyModel } from "../../dependencies/models/hr-models/payfrequency-model";
import { PaymentMethodModel } from "../../dependencies/models/hr-models/paymentMethodModel";
import { PaymentTypeUpsertModel } from "../../dependencies/models/hr-models/paymenttype-model";
import { PeakHourModel } from "../../dependencies/models/hr-models/peakhour-model";
import { ProfessionalTaxRanges } from "../../dependencies/models/hr-models/professional-tax-ranges-model";
import { RateTypeModel } from "../../dependencies/models/hr-models/rate-type-model";
import { RateSheetForModel } from "../../dependencies/models/hr-models/ratesheet-for-model";
import { RateSheetModel } from "../../dependencies/models/hr-models/ratesheet-model";
import { ReferenceTypeModel } from "../../dependencies/models/hr-models/reference-type-model";
import { RegionsModel } from "../../dependencies/models/hr-models/region-model";
import { ReportingMethodModel } from "../../dependencies/models/hr-models/reporting-method-model";
import { ShiftExceptionModel } from "../../dependencies/models/hr-models/shift-exception-model";
import { ShiftTimingModel } from "../../dependencies/models/hr-models/shift-timing-model";
import { ShiftWeekModel } from "../../dependencies/models/hr-models/shift-week-model";
import { SkillsModel } from "../../dependencies/models/hr-models/skills-model";
import { SoftLabelModel } from "../../dependencies/models/hr-models/soft-label-model";
import { StateModel } from "../../dependencies/models/hr-models/state-model";
import { TaxSlabs } from "../../dependencies/models/hr-models/tax-slabs-model";
import { TimeZoneModel } from "../../dependencies/models/hr-models/time-zone";
import { EmployeeBadgeModel } from "../../dependencies/models/hr-models/employee-badge.model";
import { AnnouncementModel } from "../../dependencies/models/hr-models/announcement.model";
import { UserModel } from "../../dependencies/models/user";
import { EmployeeGradeModel } from '../../dependencies/models/hr-models/employee-grade.model';
import { SignatureModel } from '../../dependencies/models/hr-models/signature-model';
import { DocumentTemplateModel } from '../../dependencies/models/Document-template-model';
import { ApiUrls } from '../constants/api-urls';
import { Observable } from "rxjs";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Injectable({
  providedIn: "root"
})

export class HRManagementService {

  private GET_All_PayGrades = ApiUrls.GetPayGrades;
  private Upsert_PayGrade = ApiUrls.UpsertPayGrade;
  private GET_All_RateTypes = ApiUrls.SearchRateType;
  private Get_All_LicenseTypes = ApiUrls.GetLicenceTypes;
  private License_Type = ApiUrls.UpsertLicenseType;
  private Get_All_PaymentMethods = ApiUrls.GetPaymentMethod;
  private Payment_Method = ApiUrls.UpsertPaymentMethod;
  private GET_ALL_Designation = ApiUrls.GetDesignations;
  private Upsert_Designation = ApiUrls.UpsertDesignation;
  private Upsert_RateType = ApiUrls.UpsertRateType;
  private GET_All_SoftLabels = ApiUrls.GetSoftLabels;
  private Upsert_SoftLabel = ApiUrls.UpsertSoftLabels;
  private GET_All_ContractTypes = ApiUrls.GetContractTypes;
  private Upsert_Contract_Type = ApiUrls.UpsertContractType;
  private GET_Currencies = ApiUrls.GetCurrencies;
  private GET_ALL_STATES = ApiUrls.GetStates;
  private Upsert_State = ApiUrls.UpsertState;
  private Get_ALL_DEPARTMENTS = ApiUrls.GetDepartments;
  private Upsert_Department = ApiUrls.UpsertDepartment;
  private Upsert_ExpenseCategory = ApiUrls.UpsertExpenseCategory;
  private Upsert_Merchant = ApiUrls.UpsertMerchant;
  private GET_ALL_Branches = ApiUrls.GetAllBranches;
  private Upsert_Branch = ApiUrls.UpsertBranch;
  private GET_All_Regions = ApiUrls.GetRegions;
  private Upsert_Regions = ApiUrls.UpsertRegion;
  private GET_All_Countries = ApiUrls.GetCountries;
  private Upsert_Country = ApiUrls.UpsertCountry;
  private GET_ALL_PAYMENTTYPES = ApiUrls.GetPaymentTypes;
  private Upsert_Paymenttypes = ApiUrls.UpsertPaymentType;
  private GET_ALL_Education = ApiUrls.GetEducationLevels;
  private Upsert_Education = ApiUrls.UpsertEducationLevel;
  private Upsert_Skills = ApiUrls.UpsertSkills;
  private GET_SKILLS = ApiUrls.GetSkills;
  private GET_Payfrequency = ApiUrls.GetPayFrequency;
  private Upsert_payfrequency = ApiUrls.UpsertPayFrequency;
  private Upsert_language = ApiUrls.UpsertLanguage;
  private Get_language = ApiUrls.GetLanguages;
  private Get_RateSheets = ApiUrls.GetRateSheets;
  private Get_RateSheetForNames = ApiUrls.GetRateSheetForNames;
  private Get_TaxRanges = ApiUrls.GetProfessionalTaxRanges;
  private GetTaxSlabs = ApiUrls.GetTaxSlabs;
  private UpsertTaxSlabs = ApiUrls.UpsertTaxSlabs;
  private UpsertProfessionalTaxRanges = ApiUrls.UpsertProfessionalTaxRanges;

  constructor(private http: HttpClient) { }

  getLanguage(languageModel: LanguageModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(languageModel);

    return this.http.post(APIEndpoint + this.Get_language, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertLanguage(languageModel: LanguageModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(languageModel);

    return this.http.post(APIEndpoint + this.Upsert_language, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getPayGrades(payGradeModel: PayGradeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(payGradeModel);

    return this.http.post(APIEndpoint + this.GET_All_PayGrades, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertPayGrade(payGradeModel: PayGradeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(payGradeModel);

    return this.http.post(APIEndpoint + this.Upsert_PayGrade, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllLicenseTypes(licenseType: LicenseTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(licenseType);

    return this.http.post(APIEndpoint + this.Get_All_LicenseTypes, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertLicenseType(licenseType: LicenseTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(licenseType);

    return this.http.post(APIEndpoint + this.License_Type, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllPaymentMethods(paymentMethod: PaymentMethodModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(paymentMethod);

    return this.http.post(this.Get_All_PaymentMethods, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertPaymentMethod(paymentMethod: PaymentMethodModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(paymentMethod);

    return this.http.post(APIEndpoint + this.Payment_Method, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getRateTypes(rateTypeModel: RateTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(rateTypeModel);

    return this.http.post(APIEndpoint + this.GET_All_RateTypes, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertRateType(rateTypeModel: RateTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(rateTypeModel);

    return this.http.post(APIEndpoint + this.Upsert_RateType, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getDesignation(designationModel: DesignationModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(designationModel);

    return this.http.post(APIEndpoint + this.GET_ALL_Designation, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertDesignation(designationModel: DesignationModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(designationModel);

    return this.http.post(APIEndpoint + this.Upsert_Designation, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllSoftLabels(softLabelModel: SoftLabelModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(softLabelModel);

    return this.http.post(APIEndpoint + this.GET_All_SoftLabels, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertSoftLabel(softLabelModel: SoftLabelModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(softLabelModel);

    return this.http.post(APIEndpoint + this.Upsert_SoftLabel, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getStates(stateModel: StateModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(stateModel);

    return this.http.post(APIEndpoint + this.GET_ALL_STATES, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  upsertState(stateModel: StateModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(stateModel);

    return this.http.post(APIEndpoint + this.Upsert_State, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getdepartment(departmentModel: DepartmentModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(departmentModel);

    return this.http.post(APIEndpoint + this.Get_ALL_DEPARTMENTS, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertDepartment(departmentModel: DepartmentModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(departmentModel);

    return this.http.post(APIEndpoint + this.Upsert_Department, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertExpenseCategory(expenseCategoryModel: ExpenseCategoryModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(expenseCategoryModel);

    return this.http.post(APIEndpoint + this.Upsert_ExpenseCategory, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertMerchant(merchantModel: MerchantModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(merchantModel);

    return this.http.post(APIEndpoint + this.Upsert_Merchant, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getBranches(branchModel: HrBranchModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(branchModel);

    return this.http.post(APIEndpoint + this.GET_ALL_Branches, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertBranch(branchModel: HrBranchModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(branchModel);

    return this.http.post(APIEndpoint + this.Upsert_Branch, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getRegions(regionModel: RegionsModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(regionModel);

    return this.http.post(APIEndpoint + this.GET_All_Regions, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertRegions(regionModel: RegionsModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(regionModel);

    return this.http.post(APIEndpoint + this.Upsert_Regions, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getCountries(countryModel: CountryModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(countryModel);

    return this.http.post(APIEndpoint + this.GET_All_Countries, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertCountry(countryModel: CountryModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(countryModel);
    return this.http.post(APIEndpoint + this.Upsert_Country, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getContractTypes(contractTypeModel: ContractTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(contractTypeModel);

    return this.http.post(APIEndpoint + this.GET_All_ContractTypes, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertContractType(contractTypeModel: ContractTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(contractTypeModel);

    return this.http.post(APIEndpoint + this.Upsert_Contract_Type, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getCurrencies(currencyModel: CurrencyModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(currencyModel);

    return this.http.post(APIEndpoint + this.GET_Currencies, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertCurrency(currencyModel: CurrencyModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(currencyModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertCurrency, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getReferenceTypes(referenceTypeModel: ReferenceTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(referenceTypeModel);

    return this.http.post(APIEndpoint + ApiUrls.GetReferenceTypes, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertReferenceType(referenceTypeModel: ReferenceTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(referenceTypeModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertReferenceType, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getPaymentTypes(paymenttypeModel: PaymentTypeUpsertModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(paymenttypeModel);

    return this.http.post(APIEndpoint + this.GET_ALL_PAYMENTTYPES, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertPaymenttype(paymenttypeModel: PaymentTypeUpsertModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(paymenttypeModel);

    return this.http.post(APIEndpoint + this.Upsert_Paymenttypes, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getEducation(EducationModel: EducationModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(EducationModel);
    return this.http.post(APIEndpoint + this.GET_ALL_Education, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertEducation(EducationModel: EducationModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(EducationModel);
    return this.http.post(APIEndpoint + this.Upsert_Education, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getSkills(SkillsModel: SkillsModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(SkillsModel);
    return this.http.post(APIEndpoint + this.GET_SKILLS, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertSkills(SkillsModel: SkillsModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(SkillsModel);
    return this.http.post(APIEndpoint + this.Upsert_Skills, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getReportingMethods(reportingMethodModel: ReportingMethodModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(reportingMethodModel);

    return this.http.post(APIEndpoint + ApiUrls.GetReportingMethods, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertReportingMethod(reportingMethodModel: ReportingMethodModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(reportingMethodModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertReportingMethod, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getMemberships(membershipModel: MembershipModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(membershipModel);

    return this.http.post(APIEndpoint + ApiUrls.GetMemberships, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertMembershipDetail(membershipModel: MembershipModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(membershipModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertMembership, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  getPayFrequency(payfrequencyModel: PayfrequencyModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(payfrequencyModel);
    return this.http.post(APIEndpoint + this.GET_Payfrequency, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertPayFrequency(PayfrequencyModel: PayfrequencyModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(PayfrequencyModel);
    return this.http.post(APIEndpoint + this.Upsert_payfrequency, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getEmploymentStatuses(employmentStatusModel: EmploymentStatusModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(employmentStatusModel);

    return this.http.post(APIEndpoint + ApiUrls.GetEmploymentStatus, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertEmploymentStatus(employmentStatusModel: EmploymentStatusModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(employmentStatusModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertEmploymentStatus, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getShiftTiming(shiftTimingModel: ShiftTimingModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(shiftTimingModel);

    return this.http.post(APIEndpoint + ApiUrls.SearchShiftTiming, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getShiftExpansion(shiftModel: shiftExpansionModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(shiftModel);
    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeShift, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getShiftWeek(shiftWeekModel: ShiftWeekModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(shiftWeekModel);

    return this.http.post(APIEndpoint + ApiUrls.GetShiftWeek, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getShiftException(shiftExceptionModel: ShiftExceptionModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(shiftExceptionModel);

    return this.http.post(APIEndpoint + ApiUrls.GetShiftException, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetShiftTimingOptions() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetShiftTimingOptions}`, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllNationalities(nationalityModel: NationalityModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(nationalityModel);

    return this.http.post(APIEndpoint + ApiUrls.GetNationalities, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertShiftTiming(shiftTimingModel: ShiftTimingModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(shiftTimingModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertShiftTiming, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertShiftWeek(shiftWeekModel: ShiftWeekModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(shiftWeekModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertShiftWeek, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertShiftException(shiftExceptionModel: ShiftExceptionModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(shiftExceptionModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertShiftException, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertNationality(nationalityModel: NationalityModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(nationalityModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertNationality, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));

  }

  getAllTimeZones(timeZoneModel: TimeZoneModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(timeZoneModel);

    return this.http.post(APIEndpoint + ApiUrls.GetAllTimeZones, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertTimeZones(timeZoneModel: TimeZoneModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(timeZoneModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertTimeZone, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));

  }

  getJobCategories(jobCategoryModel: JobCategoryModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(jobCategoryModel);

    return this.http.post(APIEndpoint + ApiUrls.GetJobCategoryDetails, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertEmployeeShift(employeeShift: EmployeeShift) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(employeeShift);

    return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeShift, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertJobCategory(jobCategoryModel: JobCategoryModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(jobCategoryModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertJobCategories, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getTaxRanges() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(APIEndpoint + this.Get_TaxRanges, httpOptions);

  }

  upsertProfessionalTaxRanges(professionalTaxRange: ProfessionalTaxRanges) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(professionalTaxRange);

    return this.http.post(APIEndpoint + this.UpsertProfessionalTaxRanges, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getTaxSlabs() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(APIEndpoint + this.GetTaxSlabs, httpOptions);

  }

  upsertTaxSlabs(taxSlab: TaxSlabs) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(taxSlab);

    return this.http.post(APIEndpoint + this.UpsertTaxSlabs, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllRateSheets(rateSheetModel: RateSheetModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(rateSheetModel);

    return this.http.post(APIEndpoint + ApiUrls.GetRateSheets, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllRateSheetForNames(rateSheetForModel: RateSheetForModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(rateSheetForModel);

    return this.http.post(APIEndpoint + ApiUrls.GetRateSheetForNames, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertRateSheet(rateSheetModel: RateSheetModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(rateSheetModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertRateSheet, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllPeakHours(peakHourModel: PeakHourModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(peakHourModel);

    return this.http.post(APIEndpoint + ApiUrls.GetPeakHours, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertPeakHour(peakHourModel: PeakHourModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(peakHourModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertPeakHour, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getwebhook(webhookModel: WebHookModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(webhookModel);

    return this.http.post(APIEndpoint + ApiUrls.GetWebHooks, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getBadges(badgeModel: BadgeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(badgeModel);

    return this.http.post(APIEndpoint + ApiUrls.GetBadges, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertSignature(signature: SignatureModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(signature);

    return this.http.post(APIEndpoint + ApiUrls.UpsertSignature, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getSignature(signature: SignatureModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(signature);

    return this.http.post(APIEndpoint + ApiUrls.GetSignature, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertWebHook(webhookModel: WebHookModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(webhookModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertWebHook, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  getEmployees() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetEmployeesForBonus}`, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getOrgazationChartDetails() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetOrganizationChartDetails}`, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getMyEmployeeId(userId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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

  GetEmployeeReportToMembers(userId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsobj = new HttpParams().set('userId', userId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(`${APIEndpoint + ApiUrls.GetEmployeeReportToMembers}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertBadge(badgeModel: BadgeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(badgeModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertBadge, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getBadgesAssignedToEmployee(badgeModel: EmployeeBadgeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(badgeModel);

    return this.http.post(APIEndpoint + ApiUrls.GetBadgesAssignedToEmployee, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  assignBadgeToEmployee(badgeModel: EmployeeBadgeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(badgeModel);

    return this.http.post(APIEndpoint + ApiUrls.AssignBadgeToEmployee, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAnnouncements(announcement: AnnouncementModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(announcement);

    return this.http.post(APIEndpoint + ApiUrls.GetAnnouncements, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertAnnouncement(announcement: AnnouncementModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(announcement);

    return this.http.post(APIEndpoint + ApiUrls.UpsertAnnouncement, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getGrades(employeeGradeModel: EmployeeGradeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(employeeGradeModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertGrade, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getDocumentTemplates(documentTemplateModel: DocumentTemplateModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(documentTemplateModel);

    return this.http.post(APIEndpoint + ApiUrls.GetDocumentTemplates, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  generateReport(documentTemplateModel: DocumentTemplateModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(documentTemplateModel);

    return this.http.post(APIEndpoint + ApiUrls.GenerateTemplateReport, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
}
