import { createSelector, createFeatureSelector, ActionReducerMap, MemoizedSelector } from "@ngrx/store";
import * as fromCurrency from "./currency.reducers";
import * as fromUsers from "./userList.reducers";
import * as fromChangePassword from './change-password.reducers';
import * as fromEmployee from "./employee-list.reducers";
import * as fromDepartment from "./department.reducers";
import * as fromDesignation from "./designation.reducers";
import * as fromEmploymentStatus from "./employee-status.reducers";
import * as fromLicenceTypes from "./licence-types.reducers";
import * as fromEmergencyContactDetails from "./emergency-details.reducers";
import * as fromCountries from "./countries.reducers";
import * as fromStates from "./states.reducers";
import * as fromEmployeeLicenceDetails from "./employee-licence-details.reducers";
import * as fromEmployeePersonalDetails from "./employee-personal-details.reducers";
import * as fromGender from "./gender.reducers";
import * as fromMaritalStatuses from "./marital-statuses.reducers";
import * as fromNationalities from "./nationalities.reducers";
import * as fromEmployeeContactDetails from "./employee-contact-details.reducers";
import * as fromRelationshipDetails from "./relationship-details.reducers";
import * as fromReportTo from "./report-to.reducers";
import * as fromReportingMethodDetails from "./reporting-method.reducers";
import * as fromUsersList from "./users-list.reducers";
import * as fromEmployeeImmigrationDetails from "./employee-immigration-details.reducers";
import * as fromEmployeeDependentDetails from "./employee-dependent-details.reducers";
import * as fromEmployeeEducationDetails from "./employee-education-details.reducers";
import * as fromEmployeeEducationLevels from "./employee-education-levels-details.reducers";
import * as fromEmployeeWorkExperience from "./employee-work-experience-details.reducers";
import * as fromSubscriptionPaidByOptions from "./subscription-paid-by-options.reducers";
import * as fromEmployeeMembershipDetails from "./employee-membership-details.reducers";
import * as fromMembership from "./membership.reducers";
import * as fromLanguages from "./languages.reducers";
import * as fromLanguageFluencies from "./language-fluencies.reducers";
import * as fromCompetencies from "./competency.reducers";
import * as fromEmployeeLanguageDetails from "./employee-language-details.reducers";
import * as fromRoles from "./roles.reducers";
import * as fromSkill from "./skill.reducers";
import * as fromEmployeeSkill from "./employee-skill-details.reducers";
import * as fromJobCategory from "./job-category.reducers";
import * as fromEmployeeJobDetails from "./employee-job-details.reducers";
import * as fromPayGrade from "./pay-grade.reducers";
import * as fromPayFrequency from "./pay-frequency.reducers";
import * as fromPaymentMethod from "./payment-method.reducers";
import * as fromEmployeeSalaryDetails from "./employee-salary-details.reducers";
import * as fromEmployeeBankDetails from "./employee-bank-details.reducers";
import * as fromContractType from "./contract-type.reducers";
import * as fromEmployeeContract from "./employee-contract-details.reducers";
import * as fromShiftTiming from "./shift-timing.reducers";
import * as fromTimeZone from "./time-zone.reducers";
import * as fromUsersDropDown from "./users.reducers"
import * as fromEmployeeRateSheetDetails from "./employee-ratesheet-details.reducers";
import * as fromRateSheetForDetails from "./ratesheetfor.reducers";
import * as fromAllEmployeeDetails from "./employee-list-details.reducer"
import * as fromsoftLabels from "./soft-labels.reducers"
import * as _ from 'underscore';
import * as fromBranches from "./branch.reducers"
import * as fromStoreConfiguration from "./store-configurations.reducers";
import * as fromSnackBar from "./snackbar.reducers";

import * as fromRoot from "../../../../store/reducers/index";

import { Dictionary } from '@ngrx/entity';

import { Branch } from "../../models/branch";
import { StoreConfigurationModel } from "../../models/store-configuration-model";
import { FoodOrderModel } from '../../models/all-food-orders';
import { User } from '../../models/induction-user-model';
import { Currency } from '../../models/currency';
import { UserModel } from '../../models/user';
import { FoodItemModel } from '../../models/canteen-food-item-model';
import { CanteenCreditModel } from '../../models/canteen-credit-model';
import { CanteenPurchaseItemModel } from '../../models/canteen-purchase-item-model';
import { CanteenBalanceModel } from '../../models/canteen-balance-model';
import { EmployeeListModel } from '../../models/employee-model';
import { DepartmentModel } from '../../models/department-model';
import { DesignationModel } from '../../models/designations-model';
import { EmploymentStatusModel } from '../../models/employment-status-model';
import { LicenceTypesModel } from '../../models/licence-types-model';
import { CountryModel } from '../../models/countries-model';
import { StatesModel } from '../../models/states';
import { EmployeeLicenceDetailsModel } from '../../models/employee-licence-details-model';
import { EmployeePersonalDetailsModel } from '../../models/employee-personal-details-model';
import { GenderModel } from '../../models/gender-model';
import { MaritalStatusesModel } from '../../models/marital-statuses-model';
import { NationalityModel } from '../../models/nationality-model';
import { RelationshipDetailsModel } from '../../models/relationship-details-model';
import { EmployeeImmigrationDetailsModel } from '../../models/employee-immigration-details-model';
import { EmployeeDependentContactModel } from '../../models/employee-dependent-contact-model';
import { EmployeeEmergencyContactDetails } from '../../models/employee-emergency-contact-details-model';
import { ReportToDetailsModel } from '../../models/report-to-details-model';
import { EmployeeEducationDetailsModel } from '../../models/employee-education-details-model';
import { EmployeeWorkExperienceDetailsModel } from '../../models/employee-work-experience-details-model';
import { SubscriptionPaidByOptionsModel } from '../../models/subscription-paid-by-options-model';
import { EmployeeMembershipDetailsModel } from '../../models/employee-Membership-details-model';
import { LanguagesModel } from '../../models/languages-model';
import { LanguageFluenciesModel } from '../../models/language-fluencies-model';
import { EmployeeLanguageDetailsModel } from '../../models/employee-language-details-model';
import { RoleModel } from '../../models/role-model';
import { SkillDetailsModel } from '../../models/skill-details-model';
import { EmployeeSkillDetailsModel } from '../../models/employee-skill-details-model';
import { JobCategoryModel } from '../../models/job-category-model';
import { EmployeeJobDetailsModel } from '../../models/employee-job-model';
import { PayGradeModel } from '../../models/pay-grade-model';
import { PayFrequencyModel } from '../../models/pay-frequency-model';
import { PaymentMethodModel } from '../../models/payment-method-model';
import { EmployeeBankDetailsModel } from '../../models/employee-bank-details-model';
import { ContractTypeModel } from '../../models/contract-type-model';
import { EmployeeContractModel } from '../../models/employee-contract-model';
import { ShiftTimingModel } from '../../models/shift-timing-model';
import { TimeZoneModel } from '../../models/time-zone';
import { UserDropDownModel } from '../../models/user-model';
import { FileResultModel } from '../../models/fileResultModel';
import { FileInputModel } from '../../models/file-input-model';
import { EmployeeRateSheetModel } from '../../models/employee-ratesheet-model';
import { RateSheetForModel } from '../../models/ratesheet-for-model';
import { SoftLabelConfigurationModel } from '../../models/softLabels-model';
import { EmployeeContactDetailsModel } from '../../models/employee-contact-details-model';
import { ReportingMethodDetailsModel } from '../../models/repoting-method-details-model';
import { EmployeeEducationLevelsModel } from '../../models/employee-education-levels-model';
import { MembershipModel } from '../../models/membership-model';
import { CompetenciesModel } from '../../models/competencies-model';
import { EmployeeSalaryDetailsModel } from '../../models/employee-salary-details-model';


export interface State extends fromRoot.State {
  hrManagement: HRManagementState;
}

export interface HRManagementState {
  currency: fromCurrency.State;
  users: fromUsers.State;
  changePassword: fromChangePassword.State;
  employee: fromEmployee.State;
  department: fromDepartment.State;
  designation: fromDesignation.State;
  employmentStatus: fromEmploymentStatus.State;
  licenceTypes: fromLicenceTypes.State;
  EmergencyContactDetails: fromEmergencyContactDetails.State;
  countries: fromCountries.State;
  states: fromStates.State;
  employeeLicenceDetails: fromEmployeeLicenceDetails.State;
  employeePersonalDetails: fromEmployeePersonalDetails.State;
  genders: fromGender.State;
  maritalStatuses: fromMaritalStatuses.State;
  nationalities: fromNationalities.State;
  employeeContactDetails: fromEmployeeContactDetails.State;
  relationshipDetails: fromRelationshipDetails.State;
  usersList: fromUsersList.State;
  employeeImmigrationDetails: fromEmployeeImmigrationDetails.State;
  employeeDependentDetails: fromEmployeeDependentDetails.State;
  reportTo: fromReportTo.State;
  reportingMethodDetails: fromReportingMethodDetails.State;
  employeeEducationDetails: fromEmployeeEducationDetails.State;
  employeeEducationLevels: fromEmployeeEducationLevels.State;
  employeeWorkExperienceDetails: fromEmployeeWorkExperience.State;
  subscriptionPaidByOptions: fromSubscriptionPaidByOptions.State;
  employeeMembershipDetails: fromEmployeeMembershipDetails.State;
  membership: fromMembership.State;
  languages: fromLanguages.State;
  languageFluencies: fromLanguageFluencies.State;
  competencies: fromCompetencies.State;
  employeeLanguageDetails: fromEmployeeLanguageDetails.State;
  roles: fromRoles.State;
  skill: fromSkill.State;
  employeeSkillDetails: fromEmployeeSkill.State;
  jobCategory: fromJobCategory.State;
  jobDetails: fromEmployeeJobDetails.State;
  payGrade: fromPayGrade.State;
  payFrequency: fromPayFrequency.State;
  paymentMethod: fromPaymentMethod.State;
  employeeSalaryDetails: fromEmployeeSalaryDetails.State;
  employeeBankDetails: fromEmployeeBankDetails.State;
  contractType: fromContractType.State;
  employeeContractDetails: fromEmployeeContract.State;
  shiftTiming: fromShiftTiming.State;
  timeZone: fromTimeZone.State;
  usersDropDown: fromUsersDropDown.State;
  rateSheet: fromEmployeeRateSheetDetails.State;
  rateSheetFor: fromRateSheetForDetails.State;
  allEmployeeDetails: fromAllEmployeeDetails.State;
  softLabels: fromsoftLabels.State;
  branches: fromBranches.State;
  storeConfiguration: fromStoreConfiguration.State;
  snackBar: fromSnackBar.State;
}

export const reducers: ActionReducerMap<HRManagementState> = {
  currency: fromCurrency.reducer,
  users: fromUsers.reducer,
  changePassword: fromChangePassword.reducer,
  employee: fromEmployee.reducer,
  department: fromDepartment.reducer,
  designation: fromDesignation.reducer,
  employmentStatus: fromEmploymentStatus.reducer,
  licenceTypes: fromLicenceTypes.reducer,
  EmergencyContactDetails: fromEmergencyContactDetails.reducer,
  countries: fromCountries.reducer,
  states: fromStates.reducer,
  employeeLicenceDetails: fromEmployeeLicenceDetails.reducer,
  employeePersonalDetails: fromEmployeePersonalDetails.reducer,
  genders: fromGender.reducer,
  maritalStatuses: fromMaritalStatuses.reducer,
  nationalities: fromNationalities.reducer,
  employeeContactDetails: fromEmployeeContactDetails.reducer,
  relationshipDetails: fromRelationshipDetails.reducer,
  usersList: fromUsersList.reducer,
  employeeImmigrationDetails: fromEmployeeImmigrationDetails.reducer,
  employeeDependentDetails: fromEmployeeDependentDetails.reducer,
  reportTo: fromReportTo.reducer,
  reportingMethodDetails: fromReportingMethodDetails.reducer,
  employeeEducationDetails: fromEmployeeEducationDetails.reducer,
  employeeEducationLevels: fromEmployeeEducationLevels.reducer,
  employeeWorkExperienceDetails: fromEmployeeWorkExperience.reducer,
  subscriptionPaidByOptions: fromSubscriptionPaidByOptions.reducer,
  employeeMembershipDetails: fromEmployeeMembershipDetails.reducer,
  membership: fromMembership.reducer,
  languages: fromLanguages.reducer,
  languageFluencies: fromLanguageFluencies.reducer,
  competencies: fromCompetencies.reducer,
  employeeLanguageDetails: fromEmployeeLanguageDetails.reducer,
  roles: fromRoles.reducer,
  skill: fromSkill.reducer,
  employeeSkillDetails: fromEmployeeSkill.reducer,
  jobCategory: fromJobCategory.reducer,
  jobDetails: fromEmployeeJobDetails.reducer,
  payGrade: fromPayGrade.reducer,
  payFrequency: fromPayFrequency.reducer,
  paymentMethod: fromPaymentMethod.reducer,
  employeeSalaryDetails: fromEmployeeSalaryDetails.reducer,
  employeeBankDetails: fromEmployeeBankDetails.reducer,
  contractType: fromContractType.reducer,
  employeeContractDetails: fromEmployeeContract.reducer,
  shiftTiming: fromShiftTiming.reducer,
  timeZone: fromTimeZone.reducer,
  usersDropDown: fromUsersDropDown.reducer,
  rateSheet: fromEmployeeRateSheetDetails.reducer,
  rateSheetFor: fromRateSheetForDetails.reducer,
  allEmployeeDetails: fromAllEmployeeDetails.reducer,
  softLabels: fromsoftLabels.reducer,
  branches: fromBranches.reducer,
  storeConfiguration: fromStoreConfiguration.reducer,
  snackBar: fromSnackBar.reducer
}

export const getHRManagementState = createFeatureSelector<
  State,
  HRManagementState
>("hrManagement");

export const getAllEmployeeDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.allEmployeeDetails
);

export const {
  selectIds: getAllEmployeeDetailsIds,
  selectEntities: getAllEmployeeDetailsEntities,
  selectAll: getAllEmployeeDetailsAll,
  selectTotal: getAllEmployeeDetailsTotal
} = fromAllEmployeeDetails.AllEmployeeListAdapter.getSelectors(
  getAllEmployeeDetailsEntitiesState
);

export const getAllEmployeeDetailsLoading = createSelector(
  getHRManagementState,
  state => state.allEmployeeDetails.loadingEmployeeList
);



//Currency Selectors
export const getCurrencyEntitiesState = createSelector(
  getHRManagementState,
  state => state.currency
);

export const {
  selectIds: getCurrencyId,
  selectEntities: getCurrencyEntities,
  selectAll: getCurrencyAll,
  selectTotal: getCurrencyTotal
} = fromCurrency.currencyAdapter.getSelectors(
  getCurrencyEntitiesState
);

export const getCurrencyLoading = createSelector(
  getHRManagementState,
  state => state.currency.loadingCurrency
);

export const currencyExceptionHandling = createSelector(
  getHRManagementState,
  state => state.currency.exceptionMessage
);

// Users Selectors
export const getUsersEntitiesState = createSelector(
  getHRManagementState,
  state => state.users
);

export const {
  selectIds: getUsersIds,
  selectEntities: getUsersEntities,
  selectAll: getUsersAll,
  selectTotal: getUsersTotal
} = fromUsers.userAdapter.getSelectors(getUsersEntitiesState);

export const getUsersLoading = createSelector(
  getHRManagementState,
  state => state.users.loadingUsers
);

export const getLoggedUser = createSelector(
  getHRManagementState,
  state => state.users.User
);

//Users list Selectors
export const getUsersListEntitiesState = createSelector(
  getHRManagementState,
  state => state.usersList
);

export const {
  selectIds: getUsersListIds,
  selectEntities: getUsersListEntities,
  selectAll: getUsersListAll,
  selectTotal: getUsersListTotal
} = fromUsersList.usersListAdapter.getSelectors(getUsersListEntitiesState);

export const getUsersListLoading = createSelector(
  getHRManagementState,
  state => state.usersList.loadingUsersList
);

export const createUserLoading = createSelector(
  getHRManagementState,
  state => state.usersList.creatingUser
);

export const gettingUserByIdLoading = createSelector(
  getHRManagementState,
  state => state.usersList.gettingUserById
);

export const exceptionHandlingForUsers = createSelector(
  getHRManagementState,
  state => state.usersList.exceptionMessage
);



//Change Password selectors

export const getChangePasswordEntitiesState = createSelector(
  getHRManagementState,
  state => state.changePassword
);

export const changePasswordLoading = createSelector(
  getHRManagementState,
  state => state.changePassword.CreatingPassword
);

//Employee Selectors
export const getEmployeeEntitiesState = createSelector(
  getHRManagementState,
  state => state.employee
);

export const {
  selectIds: getEmployeeIds,
  selectEntities: getEmployeeEntities,
  selectAll: getEmployeeAll,
  selectTotal: getEmployeeTotal
} = fromEmployee.EmployeeListAdapter.getSelectors(
  getEmployeeEntitiesState
);

export const getEmployeeLoading = createSelector(
  getHRManagementState,
  state => state.employee.loadingEmployeeList
);

export const createEmployeeListDetailLoading = createSelector(
  getHRManagementState,
  state => state.employee.creatingEmployeeList
);

export const gettingEmployeeListDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.employee.gettingEmployeeListDetailsById
);

export const createEmployeeListDetailsErrors = createSelector(
  getHRManagementState,
  state => state.employee.createEmployeeListErrors
);

export const getEmployeeListDetailsIdOfUpsertMembershipDetails = createSelector(
  getHRManagementState,
  state => state.employee.employeeListDetailsById
);

export const getEmployeeListDetailsById = createSelector(
  getHRManagementState,
  state => state.employee.employeeListDetailsData
);

export const employeeExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employee.exceptionMessage
);

//Department Selectors
export const getDepartmentEntitiesState = createSelector(
  getHRManagementState,
  state => state.department
);

export const {
  selectIds: getDepartmentIds,
  selectEntities: getDepartmentEntities,
  selectAll: getDepartmentAll,
  selectTotal: getDepartmentTotal
} = fromDepartment.DepartmentAdapter.getSelectors(
  getDepartmentEntitiesState
);

export const getDepartmentLoading = createSelector(
  getHRManagementState,
  state => state.department.loadingDepartmentList
);

export const departmentExceptionHandling = createSelector(
  getHRManagementState,
  state => state.department.exceptionMessage
);

//Designation Selectors
export const getDesignationEntitiesState = createSelector(
  getHRManagementState,
  state => state.designation
);

export const {
  selectIds: getDesignationIds,
  selectEntities: getDesignationEntities,
  selectAll: getDesignationAll,
  selectTotal: getDesignationTotal
} = fromDesignation.DesignationAdapter.getSelectors(
  getDesignationEntitiesState
);

export const getDesignationLoading = createSelector(
  getHRManagementState,
  state => state.designation.loadingDesignationList
);

export const DesignationExceptionHandling = createSelector(
  getHRManagementState,
  state => state.designation.exceptionMessage
);

//EmploymentStatus Selectors
export const getEmploymentStatusEntitiesState = createSelector(
  getHRManagementState,
  state => state.employmentStatus
);

export const {
  selectIds: getEmploymentStatusIds,
  selectEntities: getEmploymentStatusEntities,
  selectAll: getEmploymentStatusAll,
  selectTotal: getEmploymentStatusTotal
} = fromEmploymentStatus.EmploymentStatusAdapter.getSelectors(
  getEmploymentStatusEntitiesState
);

export const getEmploymentStatusLoading = createSelector(
  getHRManagementState,
  state => state.employmentStatus.loadingEmploymentList
);

export const EmploymentStatusExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employmentStatus.exceptionMessage
);

//Licence types Selectors
export const getLicenceTypesEntitiesState = createSelector(
  getHRManagementState,
  state => state.licenceTypes
);

export const {
  selectIds: getLicenceTypeIds,
  selectEntities: getLicenceTypeEntities,
  selectAll: getLicenceTypeAll,
  selectTotal: getLicenceTypeTotal
} = fromLicenceTypes.licenceTypesAdapter.getSelectors(
  getLicenceTypesEntitiesState
);

export const getLicenceTypesLoading = createSelector(
  getHRManagementState,
  state => state.licenceTypes.loadingLicenceTypes
);

export const licenceTypesExceptionHandling = createSelector(
  getHRManagementState,
  state => state.licenceTypes.exceptionMessage
);

//Country Selectors
export const getCountryEntitiesState = createSelector(
  getHRManagementState,
  state => state.countries
);

export const {
  selectIds: getCountryIds,
  selectEntities: getCountryEntities,
  selectAll: getCountryAll,
  selectTotal: getCountryTotal
} = fromCountries.CountryAdapter.getSelectors(
  getCountryEntitiesState
);

export const getCountryLoading = createSelector(
  getHRManagementState,
  state => state.countries.loadingCountryList
);

export const CountryExceptionHandling = createSelector(
  getHRManagementState,
  state => state.countries.exceptionMessage
);


//States Selectors
export const getStatesEntitiesState = createSelector(
  getHRManagementState,
  state => state.states
);

export const {
  selectIds: getStatesIds,
  selectEntities: getStatesEntities,
  selectAll: getStatesAll,
  selectTotal: getStatesTotal
} = fromStates.StatesAdapter.getSelectors(
  getStatesEntitiesState
);

export const getStatesLoading = createSelector(
  getHRManagementState,
  state => state.states.loadingStatesList
);

export const StatesExceptionHandling = createSelector(
  getHRManagementState,
  state => state.states.exceptionMessage
);

//Employee Licence Details Selectors
export const getEmployeeLicenceDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeeLicenceDetails
);

export const {
  selectIds: getEmployeeLicenceDetailIds,
  selectEntities: getEmployeeLicenceDetailEntities,
  selectAll: getEmployeeLicenceDetailsAll,
  selectTotal: getEmployeeLicenceDetailsTotal
} = fromEmployeeLicenceDetails.employeeLicenceDetailsAdapter.getSelectors(
  getEmployeeLicenceDetailsEntitiesState
);

export const getEmployeeLicenceDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeLicenceDetails.loadingEmployeeLicenceDetails
);

export const createEmployeeLicenceDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeLicenceDetails.creatingEmployeeLicenceDetails
);

export const gettingEmployeeLicenceDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.employeeLicenceDetails.gettingEmployeeLicenceDetailsById
);

export const createEmployeeLicenceDetailsErrors = createSelector(
  getHRManagementState,
  state => state.employeeLicenceDetails.createEmployeeLicenceDetailsErrors
);

export const getEmployeeLicenceDetailsIdOfUpsertLicenceDetails = createSelector(
  getHRManagementState,
  state => state.employeeLicenceDetails.employeeLicenceDetailsId
);

export const getEmployeeLicenceDetailsById = createSelector(
  getHRManagementState,
  state => state.employeeLicenceDetails.employeeLicenceDetailsData
);

export const employeeLicenceDetailExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeeLicenceDetails.exceptionMessage
);

//Employee Personal Details Selectors
export const getEmployeePersonalDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeePersonalDetails
);

export const {
  selectIds: getEmployeePersonalDetailIds,
  selectEntities: getEmployeePersonalDetailEntities,
  selectAll: getEmployeePersonalDetailsAll,
  selectTotal: getEmployeePersonalDetailsTotal
} = fromEmployeePersonalDetails.employeePersonalDetailsAdapter.getSelectors(
  getEmployeePersonalDetailsEntitiesState
);

export const getEmployeePersonalDetailsLoading = createSelector(
  getHRManagementState,
  state => state.employeePersonalDetails.gettingEmployeePersonalDetailsById
);

export const createEmployeePersonalDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeePersonalDetails.creatingEmployeePersonalDetails
);

export const getEmployeePersonalDetailsIdRecentlyUpserted = createSelector(
  getHRManagementState,
  state => state.employeePersonalDetails.employeePersonalDetailsId
);

export const getEmployeePersonalDetailsDataById = createSelector(
  getHRManagementState,
  state => state.employeePersonalDetails.employeePersonalDetailsData
);

export const employeePersonalDetailExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeePersonalDetails.exceptionMessage
);

//Gender Selectors
export const getGenderEntitiesState = createSelector(
  getHRManagementState,
  state => state.genders
);

export const {
  selectIds: getGenderIds,
  selectEntities: getGenderEntities,
  selectAll: getGenderAll,
  selectTotal: getGendersTotal
} = fromGender.genderAdapter.getSelectors(
  getGenderEntitiesState
);

export const getGenderLoading = createSelector(
  getHRManagementState,
  state => state.genders.loadingGendersList
);

export const genderExceptionHandling = createSelector(
  getHRManagementState,
  state => state.genders.exceptionMessage
);

//Marital Statuses Selectors
export const getMaritalStatusesEntitiesState = createSelector(
  getHRManagementState,
  state => state.maritalStatuses
);

export const {
  selectIds: getMaritalStatusesIds,
  selectEntities: getMaritalStatusesEntities,
  selectAll: getMaritalStatusesAll,
  selectTotal: getMaritalStatusesTotal
} = fromMaritalStatuses.maritalStatusesAdapter.getSelectors(
  getMaritalStatusesEntitiesState
);

export const getMaritalStatusesLoading = createSelector(
  getHRManagementState,
  state => state.maritalStatuses.loadingMaritalStatusesList
);

export const maritalStatusesExceptionHandling = createSelector(
  getHRManagementState,
  state => state.maritalStatuses.exceptionMessage
);

//Nationalities Statuses Selectors
export const getNationalitiesEntitiesState = createSelector(
  getHRManagementState,
  state => state.nationalities
);

export const {
  selectIds: getNationalitiesIds,
  selectEntities: getNationalitiesEntities,
  selectAll: getNationalitiesAll,
  selectTotal: getNationalitiesTotal
} = fromNationalities.nationalitiesAdapter.getSelectors(
  getNationalitiesEntitiesState
);

export const getNationalitiesLoading = createSelector(
  getHRManagementState,
  state => state.nationalities.loadingNationalitiesList
);

export const nationalitiesExceptionHandling = createSelector(
  getHRManagementState,
  state => state.nationalities.exceptionMessage
);

//Employee contact details Selectors
export const getEmployeeContactDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeeContactDetails
);

export const {
  selectIds: getEmployeeContactDetailsIds,
  selectEntities: getEmployeeContactDetailsEntities,
  selectAll: getEmployeeContactDetailsAll,
  selectTotal: getEmployeeContactDetailsTotal
} = fromEmployeeContactDetails.employeeContactDetailsAdapter.getSelectors(
  getEmployeeContactDetailsEntitiesState
);

export const getEmployeeContactDetailsLoading = createSelector(
  getHRManagementState,
  state => state.employeeContactDetails.gettingEmployeeContactDetails
);

export const createEmployeeContactDetailsLoading = createSelector(
  getHRManagementState,
  state => state.employeeContactDetails.creatingEmployeeContactDetailsLoading
);

export const EmployeeContactDetailstExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeeContactDetails.exceptionMessage
);

export const getEmployeeContactDetailsData = createSelector(
  getHRManagementState,
  state => state.employeeContactDetails.employeeContactDetailsData
);

//Relationship details Selectors

export const getRelationshipDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.relationshipDetails
);

export const {
  selectIds: getRelationshipdetailsIds,
  selectEntities: getRelationshipDetailsEntities,
  selectAll: getRelationshipDetailsAll,
  selectTotal: getRelationshipDetailsTotal
} = fromRelationshipDetails.relationshipDetailsAdapter.getSelectors(getRelationshipDetailsEntitiesState);

export const getRelationshipDetailsLoading = createSelector(
  getHRManagementState,
  state => state.relationshipDetails.gettingRelationshipDetails
);

export const RelationshipDetailstExceptionHandling = createSelector(
  getHRManagementState,
  state => state.relationshipDetails.exceptionMessage
);

//Employee Immigration Details Selectors
export const getEmployeeImmigrationDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeeImmigrationDetails
);

export const {
  selectIds: getEmployeeImmigrationDetailIds,
  selectEntities: getEmployeeImmigrationDetailEntities,
  selectAll: getEmployeeImmigrationDetailsAll,
  selectTotal: getEmployeeImmigrationDetailsTotal
} = fromEmployeeImmigrationDetails.employeeImmigrationDetailsAdapter.getSelectors(
  getEmployeeImmigrationDetailsEntitiesState
);

export const getEmployeeImmigrationDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeImmigrationDetails.loadingEmployeeImmigrationDetails
);

export const createEmployeeImmigrationDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeImmigrationDetails.creatingEmployeeImmigrationDetails
);

export const gettingEmployeeImmigrationDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.employeeImmigrationDetails.gettingEmployeeImmigrationDetailsById
);

export const createEmployeeImmigrationDetailsErrors = createSelector(
  getHRManagementState,
  state => state.employeeImmigrationDetails.employeeImmigrationDetailsErrors
);

export const getEmployeeImmigrationDetailsIdOfUpsertImmigrationDetails = createSelector(
  getHRManagementState,
  state => state.employeeImmigrationDetails.employeeImmigrationDetailsId
);

export const getEmployeeImmigrationDetailsById = createSelector(
  getHRManagementState,
  state => state.employeeImmigrationDetails.employeeImmigrationDetailsData
);

export const employeeImmigrationDetailExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeeImmigrationDetails.exceptionMessage
);

//Employee Dependent Details Selectors
export const getEmployeeDependentDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeeDependentDetails
);

export const {
  selectIds: getEmployeeDependentDetailIds,
  selectEntities: getEmployeeDependentDetailEntities,
  selectAll: getEmployeeDependentDetailsAll,
  selectTotal: getEmployeeDependentDetailsTotal
} = fromEmployeeDependentDetails.employeeDependentDetailsAdapter.getSelectors(
  getEmployeeDependentDetailsEntitiesState
);

export const getEmployeeDependentDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeDependentDetails.loadingEmployeeDependentDetails
);

export const createEmployeeDependentDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeDependentDetails.creatingEmployeeDependentDetails
);

export const gettingEmployeeDependentDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.employeeDependentDetails.gettingEmployeeDependentDetailsById
);

export const createEmployeeDependentDetailsErrors = createSelector(
  getHRManagementState,
  state => state.employeeDependentDetails.createEmployeeDependentDetailsErrors
);

export const getEmployeeDependentDetailsIdOfUpsertDependentDetails = createSelector(
  getHRManagementState,
  state => state.employeeDependentDetails.employeeDependentDetailsId
);

export const getEmployeeDependentDetailsById = createSelector(
  getHRManagementState,
  state => state.employeeDependentDetails.employeeDependentDetailsData
);

export const employeeDependentDetailExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeeDependentDetails.exceptionMessage
);

// Employee Emergency Details Selectors
export const getEmergencyContactDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.EmergencyContactDetails
);

export const {
  selectIds: getEmergencyContactDetailsIds,
  selectEntities: getEmergencyContactDetailsEntities,
  selectAll: getEmergencyContactDetailsAll,
  selectTotal: getEmergencyContactDetailsTotal
} = fromEmergencyContactDetails.EmergencyContactAdapter.getSelectors(
  getEmergencyContactDetailsEntitiesState
);

export const getEmergencyContactDetailsLoading = createSelector(
  getHRManagementState,
  state => state.EmergencyContactDetails.loadingEmergencyDetails
);

export const createEmergencyContactDetailsLoading = createSelector(
  getHRManagementState,
  state => state.EmergencyContactDetails.creatingEmergencyContact
);

export const gettingEmergencyContactDetailstByIdLoading = createSelector(
  getHRManagementState,
  state => state.EmergencyContactDetails.gettingEmergencyContactById
);

export const createEmergencyContactDetailsErrors = createSelector(
  getHRManagementState,
  state => state.EmergencyContactDetails.createEmergencyContactErrors
);

export const createdEmergencyId = createSelector(
  getHRManagementState,
  state => state.EmergencyContactDetails.EmployeeEmergencyContactId
);


// Report To Selectors
export const getReportToEntitiesState = createSelector(
  getHRManagementState,
  state => state.reportTo
);

export const {
  selectIds: getReportToIds,
  selectEntities: getReportToEntities,
  selectAll: getReportToAll,
  selectTotal: getReportToTotal
} = fromReportTo.ReportToAdapter.getSelectors(getReportToEntitiesState);

export const getReportToLoading = createSelector(
  getHRManagementState,
  state => state.reportTo.loadingReportTo
);

export const createReportToLoading = createSelector(
  getHRManagementState,
  state => state.reportTo.creatingReportTo
);

export const gettingReportToIdLoading = createSelector(
  getHRManagementState,
  state => state.reportTo.gettingReportToById
);


export const exceptionHandlingForReportMethodDetails = createSelector(
  getHRManagementState,
  state => state.reportTo.exceptionMessage
);

// Reporting Method Selectors
export const getReportingMethodDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.reportingMethodDetails
);

export const {
  selectIds: getReportingMethodDetailsIds,
  selectEntities: getReportingMethodDetailsEntities,
  selectAll: getReportingMethodDetailsAll,
  selectTotal: getReportingMethodDetailsTotal
} = fromReportingMethodDetails.ReportingMethodDetailsAdapter.getSelectors(getReportingMethodDetailsEntitiesState);

export const getReportingMethodDetailsLoading = createSelector(
  getHRManagementState,
  state => state.reportingMethodDetails.loadingReportingMethodDetails
);


export const gettingReportingMethodDetailsByIdLoading = createSelector(
  getHRManagementState,
  state => state.reportingMethodDetails.loadingReportingMethodDetailsById
);

export const exceptionHandlingForReportingMethodDetails = createSelector(
  getHRManagementState,
  state => state.reportingMethodDetails.exceptionMessage
);

//Employee Education Details Selectors
export const getEmployeeEducationDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeeEducationDetails
);

export const {
  selectIds: getEmployeeEducationDetailIds,
  selectEntities: getEmployeeEducationDetailEntities,
  selectAll: getEmployeeEducationDetailsAll,
  selectTotal: getEmployeeEducationDetailsTotal
} = fromEmployeeEducationDetails.employeeEducationDetailsAdapter.getSelectors(
  getEmployeeEducationDetailsEntitiesState
);

export const getEmployeeEducationDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeEducationDetails.loadingEmployeeEducationDetails
);

export const createEmployeeEducationDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeEducationDetails.creatingEmployeeEducationDetails
);

export const gettingEmployeeEducationDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.employeeEducationDetails.gettingEmployeeEducationDetailsById
);

export const createEmployeeEducationDetailsErrors = createSelector(
  getHRManagementState,
  state => state.employeeEducationDetails.employeeEducationDetailsErrors
);

export const getEmployeeEducationDetailsIdOfUpsertEducationDetails = createSelector(
  getHRManagementState,
  state => state.employeeEducationDetails.employeeEducationDetailsId
);

export const getEmployeeEducationDetailsById = createSelector(
  getHRManagementState,
  state => state.employeeEducationDetails.employeeEducationDetailsData
);

export const employeeEducationDetailExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeeEducationDetails.exceptionMessage
);

//EmployeeEducationLevels Selectors
export const getEmployeeEducationLevelsEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeeEducationLevels
);

export const {
  selectIds: getEmployeeEducationLevelsIds,
  selectEntities: getEmployeeEducationLevelsEntities,
  selectAll: getEmployeeEducationLevelsAll,
  selectTotal: getEmployeeEducationLevelsTotal
} = fromEmployeeEducationLevels.EmployeeEducationAdapter.getSelectors(
  getEmployeeEducationLevelsEntitiesState
);

export const getEmployeeEducationLevelsLoading = createSelector(
  getHRManagementState,
  state => state.employeeEducationLevels.loadingEmployeeEducationLevelsList
);

export const EmployeeEducationLevelsExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeeEducationLevels.exceptionMessage
);

//Employee Work Experience Details Selectors
export const getEmployeeWorkExperienceEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeeWorkExperienceDetails
);

export const {
  selectIds: getEmployeeWorkExperienceDetailIds,
  selectEntities: getEmployeeWorkExperienceDetailEntities,
  selectAll: getEmployeeWorkExperienceDetailsAll,
  selectTotal: getEmployeeWorkExperienceDetailsTotal
} = fromEmployeeWorkExperience.employeeWorkExperienceDetailsAdapter.getSelectors(
  getEmployeeWorkExperienceEntitiesState
);

export const getEmployeeWorkExperienceDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeWorkExperienceDetails.loadingEmployeeWorkExperienceDetails
);

export const createEmployeeWorkExperienceDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeWorkExperienceDetails.creatingEmployeeWorkExperienceDetails
);

export const gettingEmployeeWorkExperienceDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.employeeWorkExperienceDetails.gettingEmployeeWorkExperienceDetailsById
);

export const createEmployeeWorkExperienceDetailsErrors = createSelector(
  getHRManagementState,
  state => state.employeeWorkExperienceDetails.employeeWorkExperienceDetailsErrors
);

export const getEmployeeWorkExperienceDetailsIdOfUpsertDependentDetails = createSelector(
  getHRManagementState,
  state => state.employeeWorkExperienceDetails.employeeWorkExperienceDetailsId
);

export const getEmployeeWorkExperienceDetailsById = createSelector(
  getHRManagementState,
  state => state.employeeWorkExperienceDetails.employeeWorkExperienceDetailsData
);

export const employeeWorkExperienceDetailExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeeWorkExperienceDetails.exceptionMessage
);

export const CreatedworkExperienceId = createSelector(
  getHRManagementState,
  state => state.employeeWorkExperienceDetails.employeeWorkExperienceDetailsId
);

//SubscriptionPaidByOptions Selectors
export const getSubscriptionPaidByOptionsEntitiesState = createSelector(
  getHRManagementState,
  state => state.subscriptionPaidByOptions
);

export const {
  selectIds: getSubscriptionPaidByOptionsIds,
  selectEntities: getSubscriptionPaidByOptionsEntities,
  selectAll: getSubscriptionPaidByOptionsAll,
  selectTotal: getSubscriptionPaidByOptionsTotal
} = fromSubscriptionPaidByOptions.SubscriptionPaidByOptionsAdapter.getSelectors(
  getSubscriptionPaidByOptionsEntitiesState
);

export const getSubscriptionPaidByOptionsLoading = createSelector(
  getHRManagementState,
  state => state.subscriptionPaidByOptions.loadingSubscriptionPaidByOptionsList
);

export const SubscriptionPaidByOptionsExceptionHandling = createSelector(
  getHRManagementState,
  state => state.subscriptionPaidByOptions.exceptionMessage
);

//Employee Membership Details Selectors
export const getEmployeeMembershipDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeeMembershipDetails
);

export const {
  selectIds: getEmployeeMembershipDetailIds,
  selectEntities: getEmployeeMembershipDetailEntities,
  selectAll: getEmployeeMembershipDetailsAll,
  selectTotal: getEmployeeMembershipDetailsTotal
} = fromEmployeeMembershipDetails.employeeMembershipDetailsAdapter.getSelectors(
  getEmployeeMembershipDetailsEntitiesState
);

export const getEmployeeMembershipDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeMembershipDetails.loadingEmployeeMembershipDetails
);

export const createEmployeeMembershipDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeMembershipDetails.creatingEmployeeMembershipDetails
);

export const gettingEmployeeMembershipDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.employeeMembershipDetails.gettingEmployeeMembershipDetailsById
);

export const createEmployeeMembershipDetailsErrors = createSelector(
  getHRManagementState,
  state => state.employeeMembershipDetails.createEmployeeMembershipDetailsErrors
);

export const getEmployeeMembershipDetailsIdOfUpsertMembershipDetails = createSelector(
  getHRManagementState,
  state => state.employeeMembershipDetails.employeeMembershipDetailsId
);

export const getEmployeeMembershipDetailsById = createSelector(
  getHRManagementState,
  state => state.employeeMembershipDetails.employeeMembershipDetailsData
);

export const employeeMembershipDetailExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeeMembershipDetails.exceptionMessage
);

//Membership Selectors
export const getMembershipEntitiesState = createSelector(
  getHRManagementState,
  state => state.membership
);

export const {
  selectIds: getMembershipIds,
  selectEntities: getMembershipEntities,
  selectAll: getMembershipAll,
  selectTotal: getMembershipTotal
} = fromMembership.MembershipAdapter.getSelectors(
  getMembershipEntitiesState
);

export const getMembershipLoading = createSelector(
  getHRManagementState,
  state => state.membership.loadingMembershipList
);

export const MembershipExceptionHandling = createSelector(
  getHRManagementState,
  state => state.membership.exceptionMessage
);

//Languages Statuses Selectors
export const getLanguagesEntitiesState = createSelector(
  getHRManagementState,
  state => state.languages
);

export const {
  selectIds: getLanguagesIds,
  selectEntities: getLanguagesEntities,
  selectAll: getLanguagesAll,
  selectTotal: getLanguagesTotal
} = fromLanguages.languagesAdapter.getSelectors(
  getLanguagesEntitiesState
);

export const getLanguagesLoading = createSelector(
  getHRManagementState,
  state => state.languages.loadingLanguagesList
);

export const languagesExceptionHandling = createSelector(
  getHRManagementState,
  state => state.languages.exceptionMessage
);

//Language Fluencies Statuses Selectors
export const getLanguageFluencyEntitiesState = createSelector(
  getHRManagementState,
  state => state.languageFluencies
);

export const {
  selectIds: getLanguageFluenciesIds,
  selectEntities: getLanguageFluenciesEntities,
  selectAll: getLanguageFluenciesAll,
  selectTotal: geLanguageFluenciesTotal
} = fromLanguageFluencies.languageFluencyAdapter.getSelectors(
  getLanguageFluencyEntitiesState
);

export const getLanguageFluenciesLoading = createSelector(
  getHRManagementState,
  state => state.languageFluencies.loadingLanguageFluenciesList
);

export const languageFluenciesExceptionHandling = createSelector(
  getHRManagementState,
  state => state.languageFluencies.exceptionMessage
);

//Competencies Selectors
export const getCompetenciesEntitiesState = createSelector(
  getHRManagementState,
  state => state.competencies
);

export const {
  selectIds: getCompetenciesIds,
  selectEntities: getCompetenciesEntities,
  selectAll: getCompetenciesAll,
  selectTotal: getCompetenciesTotal
} = fromCompetencies.competencyAdapter.getSelectors(
  getCompetenciesEntitiesState
);

export const getCompetenciesLoading = createSelector(
  getHRManagementState,
  state => state.competencies.loadingCompetencyList
);

export const competenciesExceptionHandling = createSelector(
  getHRManagementState,
  state => state.competencies.exceptionMessage
);

//Employee Language Details Selectors
export const getEmployeeLanguageEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeeLanguageDetails
);

export const {
  selectIds: getEmployeeLanguageDetailIds,
  selectEntities: getEmployeeLanguageDetailEntities,
  selectAll: getEmployeeLanguageDetailsAll,
  selectTotal: getEmployeeLanguageDetailsTotal
} = fromEmployeeLanguageDetails.employeeLanguageDetailsAdapter.getSelectors(
  getEmployeeLanguageEntitiesState
);

export const getEmployeeLanguageDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeLanguageDetails.loadingEmployeeLanguageDetails
);

export const createEmployeeLanguageDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeLanguageDetails.creatingEmployeeLanguageDetails
);

export const gettingEmployeeLanguageDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.employeeLanguageDetails.gettingEmployeeLanguageDetailsById
);

export const createEmployeeLanguageDetailsErrors = createSelector(
  getHRManagementState,
  state => state.employeeLanguageDetails.employeeLanguageDetailsErrors
);

export const getEmployeeLanguageDetailsIdOfUpsertDependentDetails = createSelector(
  getHRManagementState,
  state => state.employeeLanguageDetails.employeeLanguageDetailsId
);

export const getEmployeeLanguageDetailsById = createSelector(
  getHRManagementState,
  state => state.employeeLanguageDetails.employeeLanguageDetailsData
);

export const employeeLanguageDetailExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeeLanguageDetails.exceptionMessage
);

//Roles Selectors
export const getRolesEntitiesState = createSelector(
  getHRManagementState,
  state => state.roles
);

export const {
  selectIds: getRolesIds,
  selectEntities: getRolesEntities,
  selectAll: getRolesAll,
  selectTotal: getRolesTotal
} = fromRoles.RolesAdapter.getSelectors(
  getRolesEntitiesState
);

export const getRolesLoading = createSelector(
  getHRManagementState,
  state => state.roles.loadingRolesList
);

export const RolesExceptionHandling = createSelector(
  getHRManagementState,
  state => state.roles.exceptionMessage
);

//Skill Selectors
export const getSkillEntitiesState = createSelector(
  getHRManagementState,
  state => state.skill
);

export const {
  selectIds: getSkillIds,
  selectEntities: getSkillEntities,
  selectAll: getSkillAll,
  selectTotal: getSkillTotal
} = fromSkill.SkillAdapter.getSelectors(
  getSkillEntitiesState
);

export const getSkillLoading = createSelector(
  getHRManagementState,
  state => state.skill.loadingSkillList
);

export const skillExceptionHandling = createSelector(
  getHRManagementState,
  state => state.skill.exceptionMessage
);


//Employee Work Experience Details Selectors
export const getEmployeeSkillEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeeSkillDetails
);

export const {
  selectIds: getEmployeeSkillDetailIds,
  selectEntities: getEmployeeSkillDetailEntities,
  selectAll: getEmployeeSkillDetailsAll,
  selectTotal: getEmployeeSkillDetailsTotal
} = fromEmployeeSkill.employeeSkillDetailsAdapter.getSelectors(
  getEmployeeSkillEntitiesState
);

export const getEmployeeSkillDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeSkillDetails.loadingEmployeeSkillDetails
);

export const createEmployeeSkillDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeSkillDetails.creatingEmployeeSkillDetails
);

export const gettingEmployeeSkillDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.employeeSkillDetails.gettingEmployeeSkillDetailsById
);

export const createEmployeeSkillDetailsErrors = createSelector(
  getHRManagementState,
  state => state.employeeSkillDetails.employeeSkillDetailsErrors
);

export const getEmployeeSkillDetailsIdOfUpsertSkillDetails = createSelector(
  getHRManagementState,
  state => state.employeeSkillDetails.employeeSkillDetailsId
);

export const getEmployeeSkillDetailsById = createSelector(
  getHRManagementState,
  state => state.employeeSkillDetails.employeeSkillDetailsData
);

export const employeeSkillDetailExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeeSkillDetails.exceptionMessage
);

//Job Category Statuses Selectors
export const getJobCategoryEntitiesState = createSelector(
  getHRManagementState,
  state => state.jobCategory
);

export const {
  selectIds: getJobCategoryIds,
  selectEntities: getJobCategoryEntities,
  selectAll: getJobCategoryAll,
  selectTotal: getJobCategoryTotal
} = fromJobCategory.jobCategoryAdapter.getSelectors(
  getJobCategoryEntitiesState
);

export const getJobCategoryLoading = createSelector(
  getHRManagementState,
  state => state.jobCategory.loadingJobCategoryList
);

export const jobCategoryExceptionHandling = createSelector(
  getHRManagementState,
  state => state.jobCategory.exceptionMessage
);

//Employee Job Details Selectors
export const getEmployeeJobDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.jobDetails
);

export const {
  selectIds: getEmployeeJobDetailIds,
  selectEntities: getEmployeeJobDetailEntities,
  selectAll: getEmployeeJobDetailsAll,
  selectTotal: getEmployeeJobDetailsTotal
} = fromEmployeeJobDetails.employeeJobDetailsAdapter.getSelectors(
  getEmployeeJobDetailsEntitiesState
);

export const getEmployeeJobDetailsLoading = createSelector(
  getHRManagementState,
  state => state.jobDetails.gettingEmployeeJobDetailsById
);

export const createEmployeeJobDetailLoading = createSelector(
  getHRManagementState,
  state => state.jobDetails.creatingEmployeeJobDetails
);

export const getEmployeeJobDetailsIdRecentlyUpserted = createSelector(
  getHRManagementState,
  state => state.jobDetails.employeeJobDetailsId
);

export const getEmployeeJobDetailsDataById = createSelector(
  getHRManagementState,
  state => state.jobDetails.employeeJobDetailsData
);

export const employeeJobDetailExceptionHandling = createSelector(
  getHRManagementState,
  state => state.jobDetails.exceptionMessage
);

//PayGrade Selectors
export const getPayGradeEntitiesState = createSelector(
  getHRManagementState,
  state => state.payGrade
);

export const {
  selectIds: getPayGradeIds,
  selectEntities: getPayGradeEntities,
  selectAll: getPayGradeAll,
  selectTotal: getPayGradeTotal
} = fromPayGrade.PayGradeAdapter.getSelectors(
  getPayGradeEntitiesState
);

export const getPayGradeLoading = createSelector(
  getHRManagementState,
  state => state.payGrade.loadingPayGradeList
);

export const PayGradeExceptionHandling = createSelector(
  getHRManagementState,
  state => state.payGrade.exceptionMessage
);

//PayFrequency Selectors
export const getPayFrequencyEntitiesState = createSelector(
  getHRManagementState,
  state => state.payFrequency
);

export const {
  selectIds: getPayFrequencyIds,
  selectEntities: getPayFrequencyEntities,
  selectAll: getPayFrequencyAll,
  selectTotal: getPayFrequencyTotal
} = fromPayFrequency.PayFrequencyAdapter.getSelectors(
  getPayFrequencyEntitiesState
);

export const getPayFrequencyLoading = createSelector(
  getHRManagementState,
  state => state.payFrequency.loadingPayFrequencyList
);

export const PayFrequencyExceptionHandling = createSelector(
  getHRManagementState,
  state => state.payFrequency.exceptionMessage
);

//PaymentMethod Selectors
export const getPaymentMethodEntitiesState = createSelector(
  getHRManagementState,
  state => state.paymentMethod
);

export const {
  selectIds: getPaymentMethodIds,
  selectEntities: getPaymentMethodEntities,
  selectAll: getPaymentMethodAll,
  selectTotal: getPaymentMethodTotal
} = fromPaymentMethod.PaymentMethodAdapter.getSelectors(
  getPaymentMethodEntitiesState
);

export const getPaymentMethodLoading = createSelector(
  getHRManagementState,
  state => state.paymentMethod.loadingPaymentMethodList
);

export const PaymentMethodExceptionHandling = createSelector(
  getHRManagementState,
  state => state.paymentMethod.exceptionMessage
);

//Employee Salary Details Selectors
export const getEmployeeSalaryDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeeSalaryDetails
);

export const {
  selectIds: getEmployeeSalaryDetailIds,
  selectEntities: getEmployeeSalaryDetailEntities,
  selectAll: getEmployeeSalaryDetailsAll,
  selectTotal: getEmployeeSalaryDetailsTotal
} = fromEmployeeSalaryDetails.employeeSalaryDetailsAdapter.getSelectors(
  getEmployeeSalaryDetailsEntitiesState
);

export const getEmployeeSalaryDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeSalaryDetails.loadingEmployeeSalaryDetails
);

export const createEmployeeSalaryDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeSalaryDetails.creatingEmployeeSalaryDetails
);

export const gettingEmployeeSalaryDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.employeeSalaryDetails.gettingEmployeeSalaryDetailsById
);

export const createEmployeeSalaryDetailsErrors = createSelector(
  getHRManagementState,
  state => state.employeeSalaryDetails.createEmployeeSalaryDetailsErrors
);

export const getEmployeeSalaryDetailsIdOfUpsertSalaryDetails = createSelector(
  getHRManagementState,
  state => state.employeeSalaryDetails.employeeSalaryDetailsId
);

export const getEmployeeSalaryDetailsById = createSelector(
  getHRManagementState,
  state => state.employeeSalaryDetails.employeeSalaryDetailsData
);

export const employeeSalaryDetailExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeeSalaryDetails.exceptionMessage
);

//Employee Bank Details Selectors
export const getEmployeeBankDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeeBankDetails
);

export const {
  selectIds: getEmployeeBankDetailIds,
  selectEntities: getEmployeeBankDetailEntities,
  selectAll: getEmployeeBankDetailsAll,
  selectTotal: getEmployeeBankDetailsTotal
} = fromEmployeeBankDetails.employeeBankDetailsAdapter.getSelectors(
  getEmployeeBankDetailsEntitiesState
);

export const getEmployeeBankDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeBankDetails.loadingEmployeeBankDetails
);

export const createEmployeeBankDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeBankDetails.creatingEmployeeBankDetails
);

export const gettingEmployeeBankDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.employeeBankDetails.gettingEmployeeBankDetailsById
);

export const createEmployeeBankDetailsErrors = createSelector(
  getHRManagementState,
  state => state.employeeBankDetails.createEmployeeBankDetailsErrors
);

export const getEmployeeBankDetailsIdOfUpsertBankDetails = createSelector(
  getHRManagementState,
  state => state.employeeBankDetails.employeeBankDetailsId
);

export const getEmployeeBankDetailsById = createSelector(
  getHRManagementState,
  state => state.employeeBankDetails.employeeBankDetailsData
);

export const employeeBankDetailExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeeBankDetails.exceptionMessage
);

//Contract type Selectors
export const getContractTypeEntitiesState = createSelector(
  getHRManagementState,
  state => state.contractType
);

export const {
  selectIds: getContractTypeIds,
  selectEntities: getContractTypeEntities,
  selectAll: getContractTypeAll,
  selectTotal: getContractTypeTotal
} = fromContractType.contractTypeAdapter.getSelectors(
  getContractTypeEntitiesState
);

export const getContractTypeLoading = createSelector(
  getHRManagementState,
  state => state.contractType.loadingContractTypeList
);

export const contractTypeExceptionHandling = createSelector(
  getHRManagementState,
  state => state.contractType.exceptionMessage
);

//Employee Contract Details Selectors
export const getEmployeeContractEntitiesState = createSelector(
  getHRManagementState,
  state => state.employeeContractDetails
);

export const {
  selectIds: getEmployeeContractDetailIds,
  selectEntities: getEmployeeContractDetailEntities,
  selectAll: getEmployeeContractDetailsAll,
  selectTotal: getEmployeeContractDetailsTotal
} = fromEmployeeContract.employeeContractDetailsAdapter.getSelectors(
  getEmployeeContractEntitiesState
);

export const getEmployeeContractDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeContractDetails.loadingEmployeeContractDetails
);

export const createEmployeeContractDetailLoading = createSelector(
  getHRManagementState,
  state => state.employeeContractDetails.creatingEmployeeContractDetails
);

export const gettingEmployeeContractDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.employeeContractDetails.gettingEmployeeContractDetailsById
);

export const createEmployeeContractDetailsErrors = createSelector(
  getHRManagementState,
  state => state.employeeContractDetails.employeeContractDetailsErrors
);

export const getEmployeeContractDetailsId = createSelector(
  getHRManagementState,
  state => state.employeeContractDetails.employeeContractDetailsId
);

export const getEmployeeContractDetailsById = createSelector(
  getHRManagementState,
  state => state.employeeContractDetails.employeeContractDetailsData
);

export const employeeContractDetailExceptionHandling = createSelector(
  getHRManagementState,
  state => state.employeeContractDetails.exceptionMessage
);

//ShiftTiming Selectors
export const getShiftTimingEntitiesState = createSelector(
  getHRManagementState,
  state => state.shiftTiming
);

export const {
  selectIds: getShiftTimingIds,
  selectEntities: getShiftTimingEntities,
  selectAll: getShiftTimingAll,
  selectTotal: getShiftTimingTotal
} = fromShiftTiming.ShiftTimingAdapter.getSelectors(
  getShiftTimingEntitiesState
);

export const getShiftTimingLoading = createSelector(
  getHRManagementState,
  state => state.shiftTiming.loadingShiftTimingList
);

export const ShiftTimingExceptionHandling = createSelector(
  getHRManagementState,
  state => state.shiftTiming.exceptionMessage
);

//TimeZone Selectors
export const getTimeZoneEntitiesState = createSelector(
  getHRManagementState,
  state => state.timeZone
);

export const {
  selectIds: getTimeZoneIds,
  selectEntities: getTimeZoneEntities,
  selectAll: getTimeZoneAll,
  selectTotal: getTimeZoneTotal
} = fromTimeZone.TimeZoneAdapter.getSelectors(
  getTimeZoneEntitiesState
);

export const getTimeZoneLoading = createSelector(
  getHRManagementState,
  state => state.timeZone.loadingTimeZoneList
);

export const TimeZoneExceptionHandling = createSelector(
  getHRManagementState,
  state => state.timeZone.exceptionMessage
);

//User DropDown Selectors
export const getUserDropDownEntitiesState = createSelector(
  getHRManagementState,
  state => state.usersDropDown
);

export const {
  selectIds: getUserDropDownIds,
  selectEntities: getUserDropDownEntities,
  selectAll: getUserDropDownAll,
  selectTotal: getUserDropDownTotal
} = fromUsersDropDown.usersAdapter.getSelectors(
  getUserDropDownEntitiesState
);

export const getUserDropDownLoading = createSelector(
  getHRManagementState,
  state => state.usersDropDown.loadingUsersList
);

export const userDropDownExceptionHandling = createSelector(
  getHRManagementState,
  state => state.usersDropDown.exceptionMessage
);

//Employee Rate Sheet Details Selectors
export const getEmployeeRateSheetDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.rateSheet
);

export const {
  selectIds: getEmployeeRateSheetDetailIds,
  selectEntities: getEmployeeRateSheetDetailEntities,
  selectAll: getEmployeeRateSheetDetailsAll,
  selectTotal: getEmployeeRateSheetDetailsTotal
} = fromEmployeeRateSheetDetails.employeeRateSheetDetailsAdapter.getSelectors(
  getEmployeeRateSheetDetailsEntitiesState
);

export const getEmployeeRateSheetDetailLoading = createSelector(
  getHRManagementState,
  state => state.rateSheet.loadingEmployeeRateSheetDetails
);

export const createEmployeeRateSheetDetailLoading = createSelector(
  getHRManagementState,
  state => state.rateSheet.creatingEmployeeRateSheetDetails
);

export const gettingEmployeeRateSheetDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.rateSheet.gettingEmployeeRateSheetDetailsById
);

export const createEmployeeRateSheetDetailsErrors = createSelector(
  getHRManagementState,
  state => state.rateSheet.errorMessage
);

export const getEmployeeRateSheetDetailsIdOfUpsertRateSheetDetails = createSelector(
  getHRManagementState,
  state => state.rateSheet.employeeRateSheetID
);

export const getEmployeeRateSheetDetailsById = createSelector(
  getHRManagementState,
  state => state.rateSheet.employeeRateSheet
);

//Rate Sheet For Details Selectors
export const getRateSheetForDetailsEntitiesState = createSelector(
  getHRManagementState,
  state => state.rateSheetFor
);

export const {
  selectIds: getRateSheetForDetailIds,
  selectEntities: getRateSheetForDetailEntities,
  selectAll: getRateSheetForDetailsAll,
  selectTotal: getRateSheetForDetailsTotal
} = fromRateSheetForDetails.rateSheetForDetailsAdapter.getSelectors(
  getRateSheetForDetailsEntitiesState
);

export const getRateSheetForDetailLoading = createSelector(
  getHRManagementState,
  state => state.rateSheetFor.loadingRateSheetForDetails
);

export const createRateSheetForDetailLoading = createSelector(
  getHRManagementState,
  state => state.rateSheetFor.creatingRateSheetForDetails
);

export const gettingRateSheetForDetailsIdLoading = createSelector(
  getHRManagementState,
  state => state.rateSheetFor.gettingRateSheetForDetailsById
);

export const createRateSheetForDetailsErrors = createSelector(
  getHRManagementState,
  state => state.rateSheetFor.errorMessage
);

export const getSoftLabelsEntitiesState = createSelector(
  getHRManagementState,
  state => state.softLabels
);


export const {
  selectIds: getSoftLabelsIds,
  selectEntities: getSoftLabelsEntities,
  selectAll: getSoftLabelsAll,
  selectTotal: getSoftLabelsTotal
} = fromsoftLabels.softLabelAdapter.getSelectors(
  getSoftLabelsEntitiesState
);

export const createSoftLabelsLoading = createSelector(
  getHRManagementState,
  state => state.softLabels.upsertsoftLabel
);

export const loadingSearchSoftLabels = createSelector(
  getHRManagementState,
  state => state.softLabels.loadingsoftLabels
);

//Branch Selectors
export const getBranchEntitiesState = createSelector(
  getHRManagementState,
  state => state.branches
);

export const {
  selectIds: getBranchId,
  selectEntities: getBranchEntities,
  selectAll: getBranchAll,
  selectTotal: getBranchTotal
} = fromBranches.branchAdapter.getSelectors(
  getBranchEntitiesState
);

export const getBranchLoading = createSelector(
  getHRManagementState,
  state => state.branches.loadingBranch
);

export const branchExceptionHandling = createSelector(
  getHRManagementState,
  state => state.branches.exceptionMessage
);

//Store Configuration Selectors
export const getStoreConfigurationEntitiesState = createSelector(
  getHRManagementState,
  state => state.storeConfiguration
);

export const {
  selectIds: getStoreConfigurationIds,
  selectEntities: getStoreConfigurationEntities,
  selectAll: getStoreConfigurationAll,
  selectTotal: getStoreConfigurationTotal
} = fromStoreConfiguration.storeConfigurationAdapter.getSelectors(
  getStoreConfigurationEntitiesState
);

export const getStoreConfigurationLoading = createSelector(
  getHRManagementState,
  state => state.storeConfiguration.loadingStoreConfiguration
);