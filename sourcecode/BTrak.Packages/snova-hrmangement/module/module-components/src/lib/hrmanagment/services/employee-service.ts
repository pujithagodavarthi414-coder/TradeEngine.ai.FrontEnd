import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

import { EmployeeListModel } from "../models/employee-model";
import { GenderSearchModel } from "../models/gender-search-model";
import { LicenceTypesModel } from "../models/licence-types-model";
import { EmployeeLicenceDetailsModel } from "../models/employee-licence-details-model";
import { EmployeeDetailsSearchModel } from "../models/employee-details-search-model";
import { EmployeePersonalDetailsModel } from "../models/employee-personal-details-model";
import { EmployeeLicenceDetailsSearchModel } from "../models/employee-licence-details-search-model";
import { NationalitiesSearchModel } from "../models/nationalities-search-model";
import { MaritalStatusesSearchModel } from "../models/marital-statuses-search-model";
import { EmployeeContactDetailsModel } from "../models/employee-contact-details-model";
import { EmployeeImmigrationDetailsModel } from "../models/employee-immigration-details-model";
import { EmployeeImmigrationDetailsSearchModel } from "../models/employee-immigration-details-search-model";
import { EmployeeDependentContactSearchModel } from "../models/employee-dependent-contact-search-model";
import { EmployeeDependentContactModel } from "../models/employee-dependent-contact-model";
import { EmployeeWorkExperienceDetailsSearchModel } from "../models/employee-work-experience-details-search-model";
import { EmployeeWorkExperienceDetailsModel } from "../models/employee-work-experience-details-model";
import { EmployeeEducationDetailsModel } from "../models/employee-education-details-model";
import { EmployeeEducationDetailsSearchModel } from "../models/employee-education-details-search-model";
import { EmployeeEducationLevelsModel } from "../models/employee-education-levels-model";
import { SubscriptionPaidByOptionsModel } from "../models/subscription-paid-by-options-model";
import { EmployeeMembershipDetailsModel } from "../models/employee-membership-details-model";
import { EmployeeMembershipDetailsSearchModel } from "../models/employee-Membership-details-search-model";
import { MembershipModel } from "../models/membership-model";
import { EmployeeLanguageDetailsModel } from "../models/employee-language-details-model";
import { EmployeeLanguageDetailsSearchModel } from "../models/employee-language-details-search-model";
import { CountryModel } from "../models/countries-model";
import { DepartmentModel } from "../models/department-model";
import { EmploymentStatusModel } from "../models/employment-status-model";
import { StatesModel } from "../models/states";
import { EmployeeSkillDetailsModel } from "../models/employee-skill-details-model";
import { EmployeeSkillDetailsSearchModel } from "../models/employee-skill-details-search-model";
import { SkillSearchModel } from "../models/skill-search-model";
import { EmploymentStatusSearchModel } from "../models/employment-status-search-model";
import { JobCategorySearchModel } from "../models/job-category-search-model";
import { EmployeeJobDetailsModel } from "../models/employee-job-model";
import { PayGradeModel } from "../models/pay-grade-model";
import { PayFrequencyModel } from "../models/pay-frequency-model";
import { PaymentMethodModel } from "../models/payment-method-model";
import { EmployeeSalaryDetailsModel } from "../models/employee-salary-details-model";
import { EmployeeSalaryDetailsSearchModel } from "../models/employee-salary-details-search-model";
import { EmployeeBankDetailsModel } from "../models/employee-bank-details-model";
import { ContractTypeSearchModel } from "../models/contract-type-search-model";
import { EmployeeContractModel } from "../models/employee-contract-model";
import { EmployeeContractSearchModel } from "../models/employee-contract-search-model";
import { EmployeeRateSheetModel } from "../models/employee-ratesheet-model";
import { EmployeeRateSheetInsertModel } from "../models/employee-ratesheet-insert-model";
import { EmployeeRatesheetDetailsSearchModel } from "../models/employee-ratesheet-details-search-model";
import { Observable } from 'rxjs';
import { Currency } from '../models/currency';
import { CurrencyModel } from '../models/currency-model';
import { SelectBranch } from '../models/select-branch';
import { UserModel } from '../models/user';
import { Branch } from '../models/branch';
import { CompanysettingsModel } from '../models/company-model';
import { ReminderModel } from '../models/reminder.model';
import { TimeZoneModel } from '../models/time-zone';
import { LanguagesSearchModel } from '../models/languages-search-model';
import { LanguageFluenciesSearchModel } from '../models/language-fluencies-search-model';
import { DesignationModel } from '../models/designations-model';
import { CompetenciesSearchModel } from '../models/competencies-search-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { ActivityConfigurationUserModel } from '../models/activity-configuration-user-model';
import { EmployeeInductionModel } from '../models/employee-induction.model';
import { IntroducedByOptionsModel } from '../models/introduced-by-option-model';
import { SoftLabelConfigurationModel } from '../models/softLabels-model';
import { SearchFileModel } from '../models/search-file-model';
import { UpsertFileModel } from '../models/upsert-file-model';
import { DeleteFileInputModel } from '../models/delete-file-input-model';
import { ShiftTimingModel } from '../models/shift-timing-model';
import { RoleModel } from '../models/role-model';
import { CustomFormFieldModel } from '../models/custom-fileds-model';
import { PayRollTemplateModel } from '../models/PayRollTemplateModel';
import { User } from '../models/induction-user-model';
import { TaxCalculationTypeModel } from '../models/taxcalculationtypemodel';
import { DesktopModel } from '../models/tracker-desktop.model';
import { IntroModel } from "../models/IntroModel";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
    providedIn: "root"
})

export class EmployeeService {

    constructor(private http: HttpClient) { }

    private GET_ALL_Companysettings = APIEndpoint + ApiUrls.GetCompanysettings;
    private Get_All_IntroducedByOptions = APIEndpoint + ApiUrls.GetAllRoles;
    private USERS_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetAllUsers;
    private Get_All_Roles__API_PATH = APIEndpoint + "Roles/RolesApi/GetAllRoles";
    private GET_ALL_PayRollTemplate = APIEndpoint + ApiUrls.GetPayRollTemplates;
    private GET_ALL_Modules = APIEndpoint + ApiUrls.GetModulesList;

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

    upsertEmployees(employeeModel: EmployeeListModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeModel);
        return this.http.post(`${APIEndpoint + ApiUrls.UpsertEmployeePersonalDetails}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getLicenceTypes(licenceTypesModel: LicenceTypesModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(licenceTypesModel);
        return this.http.post(APIEndpoint + ApiUrls.GetLicenceTypes, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertEmployeePersonalDetails(employeePersonalDetails: EmployeePersonalDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeePersonalDetails);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeePersonalDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertEmployeeLicenceDetails(employeeLicenceDetailsModel: EmployeeLicenceDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeLicenceDetailsModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeLicenceDetails, body, httpOptions)
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

    searchEmployeeLicenseDetails(employeeLicenceDetailsSearchModel: EmployeeLicenceDetailsSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeLicenceDetailsSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchEmployeeLicenseDetails, body, httpOptions)
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

    getAllNationalities(nationalitiesSearchModel: NationalitiesSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(nationalitiesSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.GetAllNationalities, body, httpOptions)
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


    upsertEmployeeContactDetails(employeeContactDetailsModel: EmployeeContactDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeContactDetailsModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeContactDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchEmployeeDependentContacts(employeeDependentContactSearchModel: EmployeeDependentContactSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeDependentContactSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchEmployeeDependentContacts, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getEmployeeDependentContacts(employeeDependentContactSearchModel: EmployeeDependentContactSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeDependentContactSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.GetEmployeeDependentContactsById, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertEmployeeDependentContact(employeeDependentContactModel: EmployeeDependentContactModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        let body = JSON.stringify(employeeDependentContactModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeEmergencyContactDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertEmployeeImmigrationDetails(employeeImmigrationDetailsModel: EmployeeImmigrationDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeImmigrationDetailsModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeImmigrationDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchEmployeeImmigrationDetails(employeeImmigrationDetailsSearchModel: EmployeeImmigrationDetailsSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeImmigrationDetailsSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchEmployeeImmigrationDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertEmployeeWorkExperience(employeeWorkExperienceDetailsModel: EmployeeWorkExperienceDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeWorkExperienceDetailsModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeWorkExperience, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchEmployeeWorkExperienceDetails(employeeWorkExperienceDetailsSearchModel: EmployeeWorkExperienceDetailsSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeWorkExperienceDetailsSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchEmployeeWorkExperienceDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertEmployeeEducationDetails(employeeEducationDetailsModel: EmployeeEducationDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeEducationDetailsModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeEducationDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchEmployeeEducationDetails(employeeEducationDetailsSearchModel: EmployeeEducationDetailsSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeEducationDetailsSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchEmployeeEducationDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllEmployeeEducationLevels(employeeEducationLevelModel: EmployeeEducationLevelsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeEducationLevelModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetEducationLevels}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllSubscriptionPaidByOptions(SubscriptionPaidByOptionsModel: SubscriptionPaidByOptionsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(SubscriptionPaidByOptionsModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetSubscriptionPaidByOptions}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertEmployeeMembershipDetails(employeeMembershipDetailsModel: EmployeeMembershipDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeMembershipDetailsModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeMemberships, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }


    searchEmployeeMembershipDetails(employeeMembershipDetailsSearchModel: EmployeeMembershipDetailsSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeMembershipDetailsSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchEmployeeMembershipDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllMembership(membershipModel: MembershipModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(membershipModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetMemberships}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllLanguages(languagesSearchModel: LanguagesSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(languagesSearchModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetLanguages}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllLanguageFluencies(languageFluenciesSearchModel: LanguageFluenciesSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(languageFluenciesSearchModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetLanguageFluencies}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllCompetencies(competenciesSearchModel: CompetenciesSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(competenciesSearchModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetCompetencies}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchEmployeeLanguageDetails(employeeLanguageSearchModel: EmployeeLanguageDetailsSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeLanguageSearchModel);
        return this.http.post(`${APIEndpoint + ApiUrls.SearchEmployeeLanguageDetails}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertEmployeeLanguages(employeeLanguageModel: EmployeeLanguageDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeLanguageModel);
        return this.http.post(`${APIEndpoint + ApiUrls.UpsertEmployeeLanguages}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllCountries(countryModel: CountryModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(countryModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetCountries}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllDepartments(departmentModel: DepartmentModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(departmentModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetDepartments}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getEmployeeById(employeeId: string) {
        let paramsobj = new HttpParams().set('employeeId', employeeId);
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsobj
        };
        return this.http.get(APIEndpoint + ApiUrls.GetEmployeeById, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllDesignations(designationModel: DesignationModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(designationModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetDesignations}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }
    getAllSkill(SkillSearchModel: SkillSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(SkillSearchModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetSkills}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllEmploymentStatus(employmentStatusModel: EmploymentStatusSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employmentStatusModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetEmploymentStatus}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchSkillDetails(EmployeeSkillDetailsSearchModel: EmployeeSkillDetailsSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(EmployeeSkillDetailsSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchEmployeeSkillDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllStates(statesModel: StatesModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(statesModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetStates}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertEmployeeSkill(employeeSkillDetailsModel: EmployeeSkillDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeSkillDetailsModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeSkills, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getJobCategoryDetails(jobCategorySearchModel: JobCategorySearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(jobCategorySearchModel);
        return this.http.post(APIEndpoint + ApiUrls.GetJobCategoryDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllPayGrade(payGradeModel: PayGradeModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(payGradeModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetPayGrades}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertEmployeeJobDetails(employeeJobDetailsModel: EmployeeJobDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeJobDetailsModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeJob, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllPayFrequency(payFrequencyModel: PayFrequencyModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(payFrequencyModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetPayFrequency}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllPaymentMethod(paymentMethodModel: PaymentMethodModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(paymentMethodModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetPaymentMethod}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertEmployeeSalaryDetails(employeeSalaryDetailsModel: EmployeeSalaryDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeSalaryDetailsModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeSalaryDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchEmployeeSalaryDetails(employeeSalaryDetailsSearchModel: EmployeeSalaryDetailsSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeSalaryDetailsSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchEmployeeSalaryDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertEmployeeBankDetails(employeeBankDetails: EmployeeBankDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeBankDetails);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeBankDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }
    getContractTypes(contractTypeSearchModel: ContractTypeSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(contractTypeSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.GetContractTypes, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllBankDetails(employeeBankDetails: EmployeeBankDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeBankDetails);
        return this.http.post(`${APIEndpoint + ApiUrls.GetAllBankDetails}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }
    upsertEmploymentContract(employeeContractModel: EmployeeContractModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeContractModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmploymentContract, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchEmployeeContractDetails(employeeContractSearchModel: EmployeeContractSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeContractSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchEmployeeContractDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllShiftTimings(shiftTimingModel: ShiftTimingModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(shiftTimingModel);
        return this.http.post(`${APIEndpoint + ApiUrls.SearchShiftTiming}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllTimeZones(timeZoneModel: TimeZoneModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(timeZoneModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetAllTimeZones}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getEducationLevels(searchText) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(searchText);
        return this.http.post(APIEndpoint + ApiUrls.GetEducationLevelsDropDown, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getEmployeeRateSheetDetails(employeeRateSheetModel: EmployeeRateSheetModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(employeeRateSheetModel);
        return this.http.post(APIEndpoint + ApiUrls.GetEmployeeRateSheetDetails, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    insertEmployeeRateSheetDetails(employeeRateSheetInsertModel: EmployeeRateSheetInsertModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(employeeRateSheetInsertModel);
        return this.http.post(APIEndpoint + ApiUrls.InsertEmployeeRatesheetDetails, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    updateEmployeeRateSheetDetails(employeeRateSheetModel: EmployeeRateSheetModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(employeeRateSheetModel);
        return this.http.post(APIEndpoint + ApiUrls.UpdateEmployeeRatesheetDetails, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    searchEmployeeRatesheetDetails(employeeRatesheetDetailsSearchModel: EmployeeRatesheetDetailsSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeRatesheetDetailsSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchEmployeeRatesheetDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    employeeUploadTemplate() {
        var url = APIEndpoint + ApiUrls.EmployeeUploadTemplate;
        return this.http.get(url, { responseType: "arraybuffer" });
    }

    getCurrencyList(): Observable<Currency[]> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        let currencyModel = new CurrencyModel();
        currencyModel.isArchived = false;
        let body = JSON.stringify(currencyModel);
        return this.http.post<Currency[]>(APIEndpoint + ApiUrls.GetCurrencies, body, httpOptions)
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

    getEmployeesPayTemplates() {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.get(APIEndpoint + ApiUrls.GetEmployeesPayTemplates, httpOptions);
    }

    getTakeHomeAmount(employeeSalaryId) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        return this.http.get(`${APIEndpoint + ApiUrls.GetTakeHomeAmount}?employeeSalaryId=` + employeeSalaryId, httpOptions)
    }

    getAllBranches(selectbranch: SelectBranch) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        let body = JSON.stringify(selectbranch);
        return this.http
            .post(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
            .pipe(
                map(result => {
                    console.log(" result:", result);
                    return result;
                })
            );
    }

    getUserById(userId: string): Observable<UserModel[]> {
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

    getAllCompanySettings(companysettingModel: CompanysettingsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(companysettingModel);
        return this.http.post(`${this.GET_ALL_Companysettings}`, body, httpOptions);
    }

    UpsertReminder(reminderModel: ReminderModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        const body = JSON.stringify(reminderModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertReminder, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    GetReminders(reminderModel: ReminderModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        const body = JSON.stringify(reminderModel);

        return this.http.post(APIEndpoint + ApiUrls.GetReminders, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    downloadFile(filePath: string) {
        let paramsobj = new HttpParams().set("filePath", filePath);
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
            params: paramsobj
        };
        return this.http.get(APIEndpoint + ApiUrls.DownloadFile, httpOptions)
            .pipe(map(result => {
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

    upsertActivityTrackerUserConfiguration(activityConfigurationUser: ActivityConfigurationUserModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(activityConfigurationUser);
        return this.http.post(APIEndpoint + ApiUrls.UpsertActivityTrackerUserConfiguration, body, httpOptions)
            .pipe(map(result => {
                return result;
            })
            );
    }

    GetEmployeeInductions(induction: EmployeeInductionModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(induction);

        return this.http.post(APIEndpoint + ApiUrls.GetEmployeeInductions, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getAllRoles(introducedByOptions: IntroducedByOptionsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(introducedByOptions);

        return this.http.post(this.Get_All_IntroducedByOptions, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getSoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(softLabels);

        return this.http.post(`${APIEndpoint + ApiUrls.GetSoftLabelConfigurations}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertsoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(softLabels);

        return this.http.post(`${APIEndpoint + ApiUrls.UpsertSoftLabelConfigurations}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getsoftLabelById(softLabelId: string) {
        let paramsObj = new HttpParams().set("softLabelId", softLabelId);
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
            params: paramsObj
        };

        return this.http
            .get(`${APIEndpoint + ApiUrls.GetSoftLabelById}`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetAllUsers(): Observable<User[]> {
        var data = { UserId: null, FirstName: null, sortDirectionAsc: 'true' };
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        let body = JSON.stringify(data);
        return this.http.post<User[]>(
            `${this.USERS_SEARCH_API_PATH}`,
            body,
            httpOptions
        );
    }

    getRoles() {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        var data = { RoleId: null, RoleName: null, Data: null };
        console.log(data);
        let body = JSON.stringify(data);

        return this.http
            .post(`${this.Get_All_Roles__API_PATH}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }
    getModules() {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        var data = { isForCustomApp: true, sortBy: 'moduleName', sortDirectionAsc: true }
        console.log(data);
        let body = JSON.stringify(data);

        return this.http
            .post(`${this.GET_ALL_Modules}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    getDesktops(desktopModel: DesktopModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        let body = JSON.stringify(desktopModel);

        return this.http
            .post(`${APIEndpoint + ApiUrls.GetTrackerDesktops}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetUsers(usermodel: UserModel) {
        const httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: "my-auth-token"
            })
        };

        if (usermodel.pageSize == undefined) {
            usermodel.pageSize = 10;
        }

        let body = JSON.stringify(usermodel);
        return this.http
            .post(`${APIEndpoint + ApiUrls.GetAllUsers}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    getFiles(searchFileModel: SearchFileModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(searchFileModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchFile, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertMultipleFiles(fileModel: UpsertFileModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(fileModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertMultipleFiles, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    deleteFile(deleteFileInputModel: DeleteFileInputModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(deleteFileInputModel);
        return this.http.post(APIEndpoint + ApiUrls.DeleteFile, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getFilesById(searchFileById: string[]) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(searchFileById);
        return this.http.post(APIEndpoint + ApiUrls.GetFileDetailById, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllPayRollTemplates(PayRollTemplateModel: PayRollTemplateModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(PayRollTemplateModel);

        return this.http.post(`${this.GET_ALL_PayRollTemplate}`, body, httpOptions);
    }

    getLineManagers(searchText: string) {
        let paramsobj = new HttpParams().set('searchText', searchText)
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsobj
        };
        return this.http.get<any[]>(APIEndpoint + ApiUrls.GetLineManagers, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    employeeUpload(empList) {
        const httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        };
        let body = JSON.stringify(empList);
        return this.http
            .post(`${APIEndpoint + ApiUrls.EmployeeUpload}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    getRolesForEffects(roleModel: RoleModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        let body = JSON.stringify(roleModel);
        return this.http.post(APIEndpoint + ApiUrls.GetAllRoles, body, httpOptions)
            .pipe(map(result => {
                return result;
            })
            );
    }

    getStoreConfiguration() {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        return this.http.get(APIEndpoint + ApiUrls.GetStoreConfiguration, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    updatecustomField(customField: CustomFormFieldModel) {
        return this.http
            .post<any>(
                `${APIEndpoint + ApiUrls.UpdateCustomFieldData}`,
                customField
            )
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    getTaxCalculationTypes(taxCalculationTypeModel: TaxCalculationTypeModel) {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
      
        let body = JSON.stringify(taxCalculationTypeModel);
      
        return this.http.post(`${APIEndpoint + ApiUrls.GetTaxCalculationTypes}`, body, httpOptions);
      }

      getIntroDetails(introModel : IntroModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
        };

        const body = JSON.stringify(introModel);
        return this.http.post<any[]>(APIEndpoint + ApiUrls.GetIntroDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }
}
