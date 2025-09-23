import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

import { DocumentTemplateModel } from '../models/Document-template-model';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { LanguageModel } from '../models/hr-models/language-model';
import { PayGradeModel } from '../models/pay-grade-model';
import { LicenseTypeModel } from '../models/hr-models/licenseTypeModel';
import { PaymentMethodModel } from '../models/payment-method-model';
import { RateTypeModel } from '../models/hr-models/rate-type-model';
import { DesignationModel } from '../models/designations-model';
import { SoftLabelModel } from '../models/hr-models/soft-label-model';
import { StateModel } from '../models/hr-models/state-model';
import { DepartmentModel } from '../models/department-model';
import { HrBranchModel } from '../models/hr-models/branch-model';
import { RegionsModel } from '../models/hr-models/region-model';
import { CountryModel } from '../models/countries-model';
import { ContractTypeModel } from '../models/contract-type-model';
import { CurrencyModel } from '../models/currency-model';
import { ReferenceTypeModel } from '../models/hr-models/reference-type-model';
import { PaymentTypeUpsertModel } from '../models/hr-models/paymenttype-model';
import { ReportingMethodModel } from '../models/hr-models/reporting-method-model';
import { MembershipModel } from '../models/membership-model';
import { PayfrequencyModel } from '../models/hr-models/payfrequency-model';
import { EmploymentStatusModel } from '../models/employment-status-model';
import { ShiftTimingModel } from '../models/shift-timing-model';
import { ShiftWeekModel } from '../models/shift-week-model';
import { ShiftExceptionModel } from '../models/shift-exception-model';
import { NationalityModel } from '../models/nationality-model';
import { TimeZoneModel } from '../models/time-zone';
import { JobCategoryModel } from '../models/job-category-model';
import { EmployeeShift } from '../models/employeeshift-model';
import { ProfessionalTaxRanges } from '../models/hr-models/professional-tax-ranges-model';
import { TaxSlabs } from '../models/hr-models/tax-slabs-model';
import { RateSheetModel } from '../models/ratesheet-model';
import { RateSheetForModel } from '../models/ratesheet-for-model';
import { PeakHourModel } from '../models/hr-models/peakhour-model';
import { BadgeModel } from '../models/badge-model';
import { SignatureModel } from '../models/signature-model';
import { UserModel } from '../models/user';
import { EmployeeBadgeModel } from '../models/employee-badge.model';
import { AnnouncementModel } from '../models/announcement.model';
import { EmployeeGradeModel } from '../models/hr-models/employee-grade.model';
import { SkillsModel } from '../models/hr-models/hr-models/skills-model';
import { EducationModel } from '../models/hr-models/hr-models/education-model';
import { shiftExpansionModel } from '../models/shiftmodel';
import { WebHookModel } from '../models/webhook-model';
import { ExpenseCategoryModel, MerchantModel } from '../models/hr-models/merchant-model';
import { Observable } from 'rxjs';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { BankModel } from '../models/bankmodel';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})

export class HRManagementService {

  private GET_All_PayGrades = APIEndpoint + ApiUrls.GetPayGrades;
  private Upsert_PayGrade = APIEndpoint + ApiUrls.UpsertPayGrade;
  private GET_All_RateTypes = APIEndpoint + ApiUrls.SearchRateType;
  private Get_All_LicenseTypes = APIEndpoint + ApiUrls.GetLicenceTypes;
  private License_Type = APIEndpoint + ApiUrls.UpsertLicenseType;
  private Get_All_PaymentMethods = APIEndpoint + ApiUrls.GetPaymentMethod;
  private Payment_Method = APIEndpoint + ApiUrls.UpsertPaymentMethod;
  private GET_ALL_Designation = APIEndpoint + ApiUrls.GetDesignations;
  private Upsert_Designation = APIEndpoint + ApiUrls.UpsertDesignation;
  private Upsert_RateType = APIEndpoint + ApiUrls.UpsertRateType;
  private GET_All_SoftLabels = APIEndpoint + ApiUrls.GetSoftLabels;
  private Upsert_SoftLabel = APIEndpoint + ApiUrls.UpsertSoftLabels;
  private GET_All_ContractTypes = APIEndpoint + ApiUrls.GetContractTypes;
  private Upsert_Contract_Type = APIEndpoint + ApiUrls.UpsertContractType;
  private GET_Currencies = APIEndpoint + ApiUrls.GetCurrencies;
  private GET_ALL_STATES = APIEndpoint + ApiUrls.GetStates;
  private Upsert_State = APIEndpoint + ApiUrls.UpsertState;
  private Get_ALL_DEPARTMENTS = APIEndpoint + ApiUrls.GetDepartments;
  private Upsert_Department = APIEndpoint + ApiUrls.UpsertDepartment;
  private Upsert_ExpenseCategory = APIEndpoint + ApiUrls.UpsertExpenseCategory;
  private Upsert_Merchant = APIEndpoint + ApiUrls.UpsertMerchant;
  private GET_ALL_Branches = APIEndpoint + ApiUrls.GetAllBranches;
  private Upsert_Branch = APIEndpoint + ApiUrls.UpsertBranch;
  private GET_All_Regions = APIEndpoint + ApiUrls.GetRegions;
  private Upsert_Regions = APIEndpoint + ApiUrls.UpsertRegion;
  private GET_All_Countries = APIEndpoint + ApiUrls.GetCountries;
  private Upsert_Country = APIEndpoint + ApiUrls.UpsertCountry;
  private GET_ALL_PAYMENTTYPES = APIEndpoint + ApiUrls.GetPaymentTypes;
  private Upsert_Paymenttypes = APIEndpoint + ApiUrls.UpsertPaymentType;
  private GET_ALL_Education = APIEndpoint + ApiUrls.GetEducationLevels;
  private Upsert_Education = APIEndpoint + ApiUrls.UpsertEducationLevel;
  private Upsert_Skills = APIEndpoint + ApiUrls.UpsertSkills;
  private GET_SKILLS = APIEndpoint + ApiUrls.GetSkills;
  private GET_Payfrequency = APIEndpoint + ApiUrls.GetPayFrequency;
  private Upsert_payfrequency = APIEndpoint + ApiUrls.UpsertPayFrequency;
  private Upsert_language = APIEndpoint + ApiUrls.UpsertLanguage;
  private Get_language = APIEndpoint + ApiUrls.GetLanguages;
  private Get_RateSheets = APIEndpoint + ApiUrls.GetRateSheets;
  private Get_RateSheetForNames = APIEndpoint + ApiUrls.GetRateSheetForNames;
  private Get_TaxRanges = APIEndpoint + ApiUrls.GetProfessionalTaxRanges;
  private GetTaxSlabs = APIEndpoint + ApiUrls.GetTaxSlabs;
  private UpsertTaxSlabs = APIEndpoint + ApiUrls.UpsertTaxSlabs;
  private UpsertProfessionalTaxRanges = APIEndpoint + ApiUrls.UpsertProfessionalTaxRanges;
  private GET_ALL_Bank = APIEndpoint + ApiUrls.GetBanks;

  constructor(private http: HttpClient) { }

  getLanguage(languageModel: LanguageModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(languageModel);

    return this.http.post(this.Get_language, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertLanguage(languageModel: LanguageModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(languageModel);

    return this.http.post(this.Upsert_language, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getPayGrades(payGradeModel: PayGradeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(payGradeModel);

    return this.http.post(this.GET_All_PayGrades, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertPayGrade(payGradeModel: PayGradeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(payGradeModel);

    return this.http.post(this.Upsert_PayGrade, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllLicenseTypes(licenseType: LicenseTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(licenseType);

    return this.http.post(this.Get_All_LicenseTypes, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertLicenseType(licenseType: LicenseTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(licenseType);

    return this.http.post(this.License_Type, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllPaymentMethods(paymentMethod: PaymentMethodModel) {
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
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(paymentMethod);

    return this.http.post(this.Payment_Method, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getRateTypes(rateTypeModel: RateTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(rateTypeModel);

    return this.http.post(this.GET_All_RateTypes, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertRateType(rateTypeModel: RateTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(rateTypeModel);

    return this.http.post(this.Upsert_RateType, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getDesignation(designationModel: DesignationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(designationModel);

    return this.http.post(this.GET_ALL_Designation, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertDesignation(designationModel: DesignationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(designationModel);

    return this.http.post(this.Upsert_Designation, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllSoftLabels(softLabelModel: SoftLabelModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(softLabelModel);

    return this.http.post(this.GET_All_SoftLabels, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertSoftLabel(softLabelModel: SoftLabelModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(softLabelModel);

    return this.http.post(this.Upsert_SoftLabel, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getStates(stateModel: StateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(stateModel);

    return this.http.post(this.GET_ALL_STATES, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  upsertState(stateModel: StateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(stateModel);

    return this.http.post(this.Upsert_State, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getdepartment(departmentModel: DepartmentModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(departmentModel);

    return this.http.post(this.Get_ALL_DEPARTMENTS, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertDepartment(departmentModel: DepartmentModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(departmentModel);

    return this.http.post(this.Upsert_Department, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertExpenseCategory(expenseCategoryModel: ExpenseCategoryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(expenseCategoryModel);

    return this.http.post(this.Upsert_ExpenseCategory, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertMerchant(merchantModel: MerchantModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(merchantModel);

    return this.http.post(this.Upsert_Merchant, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getBranches(branchModel: HrBranchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(branchModel);

    return this.http.post(this.GET_ALL_Branches, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertBranch(branchModel: HrBranchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(branchModel);

    return this.http.post(this.Upsert_Branch, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getRegions(regionModel: RegionsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(regionModel);

    return this.http.post(this.GET_All_Regions, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertRegions(regionModel: RegionsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(regionModel);

    return this.http.post(this.Upsert_Regions, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getCountries(countryModel: CountryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(countryModel);

    return this.http.post(this.GET_All_Countries, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertCountry(countryModel: CountryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(countryModel);
    return this.http.post(this.Upsert_Country, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getContractTypes(contractTypeModel: ContractTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(contractTypeModel);

    return this.http.post(this.GET_All_ContractTypes, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertContractType(contractTypeModel: ContractTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(contractTypeModel);

    return this.http.post(this.Upsert_Contract_Type, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getCurrencies(currencyModel: CurrencyModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(currencyModel);

    return this.http.post(this.GET_Currencies, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertCurrency(currencyModel: CurrencyModel) {
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
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(paymenttypeModel);

    return this.http.post(this.GET_ALL_PAYMENTTYPES, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertPaymenttype(paymenttypeModel: PaymentTypeUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(paymenttypeModel);

    return this.http.post(this.Upsert_Paymenttypes, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getEducation(educationModel: EducationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(educationModel);
    return this.http.post(this.GET_ALL_Education, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertEducation(educationModel: EducationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(educationModel);
    return this.http.post(this.Upsert_Education, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getSkills(SkillsModel: SkillsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(SkillsModel);
    return this.http.post(this.GET_SKILLS, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertSkills(SkillsModel: SkillsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(SkillsModel);
    return this.http.post(this.Upsert_Skills, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getReportingMethods(reportingMethodModel: ReportingMethodModel) {
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
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(payfrequencyModel);
    return this.http.post(this.GET_Payfrequency, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertPayFrequency(PayfrequencyModel: PayfrequencyModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(PayfrequencyModel);
    return this.http.post(this.Upsert_payfrequency, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getEmploymentStatuses(employmentStatusModel: EmploymentStatusModel) {
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
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetShiftTimingOptions}`, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllNationalities(nationalityModel: NationalityModel) {
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
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(this.Get_TaxRanges, httpOptions);

  }

  upsertProfessionalTaxRanges(professionalTaxRange: ProfessionalTaxRanges) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(professionalTaxRange);

    return this.http.post(this.UpsertProfessionalTaxRanges, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getTaxSlabs() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(this.GetTaxSlabs, httpOptions);

  }

  upsertTaxSlabs(taxSlab: TaxSlabs) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(taxSlab);

    return this.http.post(this.UpsertTaxSlabs, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllRateSheets(rateSheetModel: RateSheetModel) {
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
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetEmployeesForBonus}`, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getOrgazationChartDetails() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetOrganizationChartDetails}`, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
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

  GetEmployeeReportToMembers(userId: string) {
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

  getDocumentTemplates(documentTemplateModel: DocumentTemplateModel) {
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
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(documentTemplateModel);

    return this.http.post(APIEndpoint + ApiUrls.GenerateTemplateReport, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertDocumentTemplate(documentTemplateModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(documentTemplateModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertDocumentTemplate, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllBanks(bankModel: BankModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(bankModel);

    return this.http.post(`${this.GET_ALL_Bank}`, body, httpOptions);
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
}
