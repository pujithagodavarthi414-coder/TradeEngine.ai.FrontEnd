import { Component, OnInit } from "@angular/core";
import { FeatureIds } from "../constants/feature-ids";
import { LocalStorageProperties } from '../constants/localstorage-properties';
import * as _ from "underscore";

@Component({
  template: ""
})
export class CustomAppBaseComponent implements OnInit {
  canAccess_feature_PayrollCalculationConfigurations: boolean;
  canAccess_feature_ContractPaySettings: boolean;
  canAccess_feature_ConfigurePayrollStatus: boolean;
  canAccess_feature_PayrollRun: boolean;
  canAccess_feature_PayrollTemplateConfiguration: boolean;
  canAccess_feature_EmployeeCreditorDetails: boolean;
  canAccess_feature_ApproveEmployeeLoans: boolean;
  canAccess_feature_PayrollRoleConfiguration: boolean;
  canAccess_feature_PayrollMaritalStatusConfiguration: boolean;
  canAccess_feature_EmployeePayrollDetails: boolean;
  canAccess_feature_ManagePayrollComponent: boolean;
  canAccess_feature_PayrollManagement: boolean;
  canAccess_feature_PayrollGenderConfiguration: boolean;
  canAccess_feature_ConfigureEmployeePayrollTemplates: boolean;
  canAccess_feature_ManagePayrollTemplate: boolean;
  canAccess_feature_PayrollBranchConfiguration: boolean;
  canAccess_feature_PayrollRunEmployee: boolean;
  canAccess_feature_PayrollFrequency: boolean;
  canAccess_feature_ViewMonthlyPayrollDetails: boolean;
  canAccess_feature_ViewEmployeeBonus: boolean;
  canAccess_feature_EmployeeLoans: boolean;
  canAccess_feature_ManageEmployeeRateTag: boolean;
  canAccess_feature_TdsSettings: boolean;
  canAccess_feature_AllowanceTime: boolean;
  canAccess_feature_DaysOfWeekConfiguration: boolean;
  canAccess_feature_ViewEmployeeLoanInstallment: boolean;
  canAccess_feature_AddOrUpdateEmployeeContactDetails: boolean;
  canAccess_feature_CanEditOtherEmployeeDetails: boolean;
  canAccess_feature_ManagePaymentMethod: boolean;
  canAccess_feature_TaxAllowance: boolean;
  canAccess_feature_EmployeeTaxAllowanceDetails: boolean;
  canAccess_feature_FinancialYearConfigurations: boolean;
  canAccess_feature_HourlyTdsConfiguration: boolean;
  canAccess_feature_LeaveEncashmentSettings: boolean;
  canAccess_feature__ManageEmployeeRateTag: boolean;
  canAccess_feature_ManageRateTag: boolean;
  canAccess_feature_RateTagAllowanceTime: boolean;
  canAccess_feature_AddOrEditEmployeeLoanInstallment: boolean;
  canAccess_feature_ApproveEmployeeTaxAllowances: boolean;
  canAccess_feature_EditPayslip: boolean;
  canAccess_feature_ManageRateTagConfiguration: boolean;
  canAccess_feature_ManageBank: boolean;
  canAccess_feature_EmployeePreviousCompanyTax: boolean;
  canAccess_feature_AddOrUpdateEmployeeBonus: boolean;

  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_PayrollCalculationConfigurations = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollCalculationConfigurations.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ContractPaySettings = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ContractPaySettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConfigurePayrollStatus = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ConfigurePayrollStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollRun = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollRun.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollTemplateConfiguration = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollTemplateConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeCreditorDetails = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeCreditorDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApproveEmployeeLoans = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ApproveEmployeeLoans.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollRoleConfiguration = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollRoleConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollMaritalStatusConfiguration = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollMaritalStatusConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeePayrollDetails = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeePayrollDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePayrollComponent = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePayrollComponent.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollManagement = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollGenderConfiguration = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollGenderConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConfigureEmployeePayrollTemplates = _.find(roles, function(role: any){ return role.featureId.toLowerCase() ==FeatureIds.Feature_ConfigureEmployeePayrollTemplates.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePayrollTemplate = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePayrollTemplate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollBranchConfiguration = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollBranchConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollRunEmployee = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollRunEmployee.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollFrequency = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollFrequency.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewMonthlyPayrollDetails = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewMonthlyPayrollDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeBonus = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeBonus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeLoans = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeLoans.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageEmployeeRateTag = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageEmployeeRateTag.toString().toLowerCase(); }) != null;
    this.canAccess_feature_TdsSettings = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_TdsSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AllowanceTime = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AllowanceTime.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DaysOfWeekConfiguration = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_DaysOfWeekConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeLoanInstallment = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeLoanInstallment.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeContactDetails = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeContactDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanEditOtherEmployeeDetails = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_CanEditOtherEmployeeDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePaymentMethod = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePaymentMethod.toString().toLowerCase(); }) != null;
    this.canAccess_feature_TaxAllowance = _.find(roles, function(role: any){ return role.featureId.toLowerCase() ==FeatureIds.Feature_EmployeeTaxAllowanceDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeTaxAllowanceDetails = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeTaxAllowanceDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_FinancialYearConfigurations = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_FinancialYearConfigurations.toString().toLowerCase(); }) != null;
    this.canAccess_feature_HourlyTdsConfiguration = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_HourlyTdsConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_LeaveEncashmentSettings = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_LeaveEncashmentSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageRateTag = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRateTag.toString().toLowerCase(); }) != null;
    this.canAccess_feature_RateTagAllowanceTime = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_RateTagAllowanceTime.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrEditEmployeeLoanInstallment = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrEditEmployeeLoanInstallment.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApproveEmployeeTaxAllowances = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ApproveEmployeeTaxAllowances.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EditPayslip = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_EditPayslip.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageRateTagConfiguration =  _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRateTagConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageBank =  _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageBank.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeePreviousCompanyTax =  _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.EmployeePreviousCompanyTax.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeBonus = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeBonus.toString().toLowerCase(); }) != null;
  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
