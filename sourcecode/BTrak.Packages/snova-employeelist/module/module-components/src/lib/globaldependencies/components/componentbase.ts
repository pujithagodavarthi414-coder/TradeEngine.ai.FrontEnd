import { Component, OnInit } from "@angular/core";
import { FeatureIds } from "../constants/feature-ids";
import { LocalStorageProperties } from '../constants/localstorage-properties';
import * as _ from "underscore";

@Component({
  template: ""
})
export class CustomAppBaseComponent implements OnInit {

  canAccess_feature_CanEditOtherEmployeeDetails: boolean;
  canAccess_feature_ViewEmployeeSalaryDetails: boolean;
  canAccess_feature_ViewEmployeeShiftDetails: boolean;
  canAccess_feature_ViewEmployeeSkillDetails: boolean;
  canAccess_feature_ViewEmployeeWorkExperienceDetails: boolean;
  canAccess_feature_ViewEmployeeLicenceDetails: boolean;
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
  canAccess_feature_ManageInductionWork: boolean;
  canAccess_feature_ViewAllEmployees: boolean;
  canAccess_feature_UserUpload: boolean;
  canAccess_feature_ApproveOrRejectLeave: boolean;
  canAccess_feature_ConfigureEmployeeTracking: boolean;
  canAccess_feature_Storemanagement: boolean;
  canAccess_feature_PayrollRun: boolean;
  canAccess_feature_ManageHRSettings: boolean;
  canAccess_feature_ManagePayrollSettings: boolean;
  canAccess_feature_ManageLeaveSettings: boolean;
  canAccess_feature_ViewReportingEmployees: boolean;


  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_CanEditOtherEmployeeDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_CanEditOtherEmployeeDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeSalaryDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeSalaryDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeShiftDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeShiftDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeSkillDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeSkillDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeWorkExperienceDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeWorkExperienceDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeLicenceDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeLicenceDetails.toString().toLowerCase(); }) != null;
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
    this.canAccess_feature_ManageInductionWork = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageInductionWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAllEmployees = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAllEmployees.toString().toLowerCase(); }) != null;
    this.canAccess_feature_UserUpload = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_UserUpload.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApproveOrRejectLeave = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ApproveOrRejectLeave.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConfigureEmployeeTracking = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ConfigureEmployeeTracking.toString().toLowerCase(); }) != null;
    
    this.canAccess_feature_Storemanagement = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageStoreManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollRun = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollRun.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageHRSettings = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageHrSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePayrollSettings = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePayrollSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageLeaveSettings = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageLeaveSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewReportingEmployees = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewReportingEmployees.toString().toLowerCase(); }) != null;
    
   
    //this.canAccess_feature_ManageRateSheet = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeIndexManageRateSheet.toString().toLowerCase(); }) != null;
  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
