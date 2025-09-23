import * as fromCurrency from './currency.effects';
import * as fromEmployeeList from './employee-list.effects';
import * as fromChangePassword from './change-passowrd.effets';
import * as fromDesignationList from './designation.effects';
import * as fromDepartmentList from './department.effects';
import * as fromEmploymentStatus from './employment-status.effects';
import * as fromLicenceTypes from './licence-types.effects';
import * as fromEmergencyContactDetails from './emergency-details.effects';
import * as fromCountries from './countries.effects';
import * as fromStates from './states.effects';
import * as fromEmployeeLicenceDetails from './employee-licence-details.effects';
import * as fromEmployeePersonalDetails from './employee-personal-details.effects';
import * as fromGender from './gender.effects';
import * as fromMaritalStatuses from './marital-statuses.effects';
import * as fromNationalities from './nationalities.effects';
import * as fromEmployeeContactDetails from './employee-contact-details.effects';
import * as fromEmergencyContactDetailsEffects from './emergency-details.effects'
import * as fromRelationshipDetails from './relationship-details.effects';
import * as fromEmployeeImmigrationDetails from './employee-immigration-details.effects';
import * as fromDependentDetails from './employee-dependent-details.effects';
import * as fromReportTo from './report-to.effects';
import * as fromReportingMethod from './reporting-method.effects';
import * as fromEmployeeEducationDetails from './employee-education-details.effects';
import * as fromEmployeeEducationLevels from './employee-education-levels-details.effects';
import * as fromEmployeeWorkExperienceDetails from './employee-work-experience-details.effects';
import * as fromSubscriptionPaidByOptions from './subscription-paid-by-options.effects';
import * as fromEmployeeMembershipDetails from'./employee-membership.effects';
import * as fromMembership from './membership.effects';
import * as fromLanguages from './languages.effects';
import * as fromLanguageFluency from './language-fluencies.effects';
import * as fromCompetency from './competency.effects';
import * as fromEmployeeLanguageDetails from './employee-language-details.effects';
import * as fromRoles from './roles.effects';
import * as fromSkill from './skill.effects';
import * as fromEmployeeSkillDetails from './employee-skill-details.effects';
import * as fromJobCategory from './job-category.effects';
import * as fromEmployeeJobDetails from './employee-job-details.effects';
import * as fromPayGrade from './pay-grade.effects';
import * as fromPayFrequency from './pay-frequency.effects';
import * as fromEmployeeSalaryDetails from './employee-salary-details.effects';
import * as fromPaymentMethod from './payment-method.effects';
import * as fromEmployeeBankDetails from './employee-bank-details.effects';
import * as fromContractType from './contract-type.effects';
import * as fromEmployeeContractDetails from './employee-contract-details.effects';
import * as fromShiftTiming from './shift-timing.effects';
import * as fromTimeZone from './time-zone.effects';
import * as fromUsersDropDown from './users.effects';
import * as fromRateSheetDetails from './employee-ratesheet-details.effects';
import * as fromRateSheetForDetails from './ratesheetfor-effects';
import * as fromUser from './user-profile.effects';
import * as fromNotification from './notification-validator.effects';
import * as fromSnackBar from './snackbar.effects';
import * as fromSoftLabel from './soft-labels.effects';
import * as fromUserList from './userList.effects';
import * as fromStoreConfiguration from './store-configurations.effects';
import * as fromBranch from './branch.effects';

export const HRManagementModuleEffects: any = [
    fromCurrency.CurrencyEffects,
    fromEmployeeList.EmployeeListEffects,
    fromChangePassword.ChangePasswordEffects,
    fromDesignationList.DesignationListEffects,
    fromDepartmentList.DepartmentListEffects,
    fromEmploymentStatus.EmploymentStatusListEffects,
    fromLicenceTypes.LicenceTypesEffects,
    fromEmergencyContactDetails.EmergencyContactDetailsEffects,
    fromCountries.CountryListEffects,
    fromStates.StatesListEffects,
    fromEmployeeLicenceDetails.EmployeeLicenceDetailsEffects,
    fromEmployeePersonalDetails.EmployeePersonalDetailsEffects,
    fromGender.GenderEffects,
    fromMaritalStatuses.MaritalStatusesEffects,
    fromNationalities.NationalitiesEffects,
    fromEmployeeContactDetails.EmployeeContactDetailsEffects,
    fromRelationshipDetails.RelationshipDetailsEffects,
    fromEmployeeImmigrationDetails.EmployeeImmigrationDetailsEffects,
    fromDependentDetails.EmployeeDependentDetailsEffects,
    fromReportTo.ReportToEffects,
    fromReportingMethod.ReportingMethodEffects,
    fromEmployeeEducationDetails.EmployeeEducationDetailsEffects,
    fromEmployeeEducationLevels.EmployeeEducationLevelsEffects,
    fromEmployeeWorkExperienceDetails.EmployeeWorkExperienceDetailsEffects,
    fromSubscriptionPaidByOptions.SubscriptionPaidByOptionsEffects,
    fromEmployeeMembershipDetails.EmployeeMembershipDetailsEffects,
    fromMembership.MembershipEffects,
    fromLanguages.LanguagesEffects,
    fromLanguageFluency.LanguageFluencyEffects,
    fromCompetency.CompetencyEffects,
    fromEmployeeLanguageDetails.EmployeeLanguageDetailsEffects,
    fromRoles.RolesEffects,
    fromSkill.SkillEffects,
    fromEmployeeSkillDetails.EmployeeSkillDetailsEffects,
    fromJobCategory.JobCategoryEffects,
    fromEmployeeJobDetails.EmployeeJobDetailsEffects,
    fromPayGrade.PayGradeEffects,
    fromPayFrequency.PayFrequencyEffects,
    fromEmployeeSalaryDetails.EmployeeSalaryDetailsEffects,
    fromPaymentMethod.PaymentMethodEffects,
    fromEmployeeBankDetails.EmployeeBankDetailsEffects,
    fromContractType.ContractTypeEffects,
    fromEmployeeContractDetails.EmployeeContractDetailsEffects,
    fromShiftTiming.ShiftTimingListEffects,
    fromTimeZone.TimeZoneListEffects,
    fromUsersDropDown.UsersEffects,
    fromRateSheetDetails.EmployeeRateSheetDetailsEffects,
    fromRateSheetForDetails.RateSheetForDetailsEffects,
    fromUser.UserProfileEffects,
    fromNotification.NotificationValidatorEffects,
    fromSnackBar.SnackbarEffects,
    fromSoftLabel.SoftLabelConfigurationEffects,
    fromUserList.UserEffects,
    fromStoreConfiguration.StoreConfigurationEffects,
    fromBranch.BranchEffects
];
