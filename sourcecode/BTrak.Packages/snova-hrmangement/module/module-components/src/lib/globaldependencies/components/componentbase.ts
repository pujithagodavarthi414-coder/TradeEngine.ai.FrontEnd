import { Component, OnInit } from "@angular/core";
import { FeatureIds } from "../constants/feature-ids";
import { LocalStorageProperties } from '../constants/localstorage-properties';
import * as _ from "underscore";

@Component({
  template: ""
})
export class CustomAppBaseComponent implements OnInit {

  canAccess_feature_AddOrUpdateEmploymentContract: boolean;
  canAccess_feature_CanEditOtherEmployeeDetails: boolean;
  canAccess_feature_AddOrUpdateEmployeeDependentContactDetails: boolean;
  canAccess_feature_AddOrUpdateEmployeeEducationDetails: boolean;
  canAccess_feature_AddOrUpdateEmployeeEmergencyContactDetails: boolean;
  canAccess_feature_AddOrUpdateEmployeeImmigration: boolean
  canAccess_feature_AddOrUpdateEmployeeLanguages: boolean;
  canAccess_feature_AddOrUpdateEmployeeIdentificationDetails: boolean;
  canAccess_feature_AddOrUpdateEmployeeMemberships: boolean;
  canAccess_feature_ManageEmployeeRatesheet: boolean;
  canAccess_feature_AddOrUpdateEmployeeReportingToDetails: boolean;
  canAccess_feature_AddOrUpdateEmployeeSalaryDetails: boolean;
  canAccess_feature_ConfigureEmployeePayrollTemplates: boolean;
  canAccess_feature_AddOrUpdateEmployeeSkills: boolean;
  canAccess_feature_AddOrUpdateEmployeeWorkExperienceDetails: boolean;
  canAccess_feature_ViewBadgesAssignedToEmployee: boolean;
  canAccess_feature_AddOrUpdateEmployeeContactDetails: boolean;
  canAccess_feature_AddOrUpdateEmployeeJobDetails: boolean;
  canAccess_feature_AddOrUpdateEmployeePersonalDetails: boolean;
  canAccess_feature_ViewEmployeeSalaryDetails: boolean;
  canAccess_feature_ViewEmployeeShiftDetails: boolean;
  canAccess_feature_AddOrUpdateEmployeeShifts: boolean;
  canAccess_feature_ViewEmployeeSkillDetails: boolean;
  canAccess_feature_ViewEmployeeWorkExperienceDetails: boolean;
  canAccess_feature_ViewEmployeeIdentificationDetails: boolean;
  canAccess_feature_CanCreateReminders: boolean;
  canAccess_feature_CanViewOrganizationChart: boolean;
  canAccess_feature_ViewEmployeePersonalDetails: boolean;
  canAccess_feature_ViewEmployeeContactDetails: boolean;
  canAccess_feature_ViewEmployeeEmergencyContactDetails: boolean;
  canAccess_feature_ViewEmployeeDependentContactDetails: boolean;
  canAccess_feature_ViewEmployeeImmigrationDetails: boolean;
  canAccess_feature_ViewEmployeeJobDetails: boolean;
  canAccess_feature_ViewEmploymentContractDetails: boolean;
  canAccess_feature_ViewEmployeeBankDetails: boolean;
  canAccess_feature_ViewEmployeeReportToDetails: boolean;
  canAccess_feature_ViewEmployeeLanguageDetails: boolean;
  canAccess_feature_ViewEmployeeEducationDetails: boolean;
  canAccess_feature_ViewEmployeeMembershipDetails: boolean;
  canAccess_feature_CanAssignBadgeToEmployee: boolean;
  canAccess_feature_CanPassAnAnnouncement: boolean;
  canAccess_feature_ViewUsers: boolean;
  canAccess_feature_AddUser: boolean;
  canAccess_feature_UpdateUser: boolean;
  canAccess_feature_ResetPassword: boolean;
  canAccess_feature_ConfigurePerformance: boolean;
  canAccess_feature_AddOrUpdateEmployeeBankDetails: boolean;
  canAccess_feature_ManageDocumentTemplates: boolean;
  canAccess_feature_EmployeeIndex: boolean;
  canAccess_feature_ManageRateSheet: boolean;
  canAccess_feature_AddOrEditCustomFieldsForHrManagement: boolean;
  canAccess_feature_ManageBank: boolean;
  canAccess_feature_ConfigureEmployeeTracking: boolean;

  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_AddOrUpdateEmploymentContract = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmploymentContract.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanEditOtherEmployeeDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_CanEditOtherEmployeeDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeDependentContactDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeDependentContactDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeEducationDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeEducationDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeEmergencyContactDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeEmergencyContactDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeImmigration = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeImmigration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeLanguages = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeLanguages.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeIdentificationDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeIdentificationDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeMemberships = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeMemberships.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageEmployeeRatesheet = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageEmployeeRatesheet.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeReportingToDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeReportingToDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeSalaryDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeSalaryDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConfigureEmployeePayrollTemplates = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ConfigureEmployeePayrollTemplates.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeSkills = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeSkills.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeWorkExperienceDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeWorkExperienceDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewBadgesAssignedToEmployee = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewBadgesAssignedToEmployee.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeContactDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeContactDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeJobDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeJobDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeePersonalDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeePersonalDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeSalaryDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeSalaryDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeShiftDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeShiftDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeShifts = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeShifts.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeSkillDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeSkillDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeWorkExperienceDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeWorkExperienceDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeIdentificationDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeIdentificationDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanCreateReminders = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_CanCreateReminders.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanViewOrganizationChart = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_CanViewOrganizationChart.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeePersonalDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeePersonalDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeContactDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeContactDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeEmergencyContactDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeEmergencyContactDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeDependentContactDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeDependentContactDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeImmigrationDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeImmigrationDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeJobDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeJobDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmploymentContractDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmploymentContractDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeBankDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeBankDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeReportToDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeReportToDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeLanguageDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeLanguageDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeEducationDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeEducationDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeMembershipDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeMembershipDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanAssignBadgeToEmployee = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_CanAssignBadgeToEmployee.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanPassAnAnnouncement = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_CanPassAnAnnouncement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewUsers = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewUsers.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddUser = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddUser.toString().toLowerCase(); }) != null;
    this.canAccess_feature_UpdateUser = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_UpdateUser.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ResetPassword = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ResetPassword.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConfigurePerformance = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ConfigurePerformance.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeBankDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeBankDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeIndex = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeIndex.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrEditCustomFieldsForHrManagement = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrEditCustomFieldsForHrManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageRateSheet = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRateSheet.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageDocumentTemplates = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageDocumentTemplates.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageBank =  _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageBank.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConfigureEmployeeTracking = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ConfigureEmployeeTracking.toString().toLowerCase(); }) != null;
    
  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
