import { Component, OnInit } from "@angular/core";
import { FeatureIds } from '../../globaldependencies/constants/feature-ids';
import * as _ from "underscore";
import { LocalStorageProperties } from '../constants/localstorage-properties';

@Component({
  template: ""
})



export class AppBaseComponent implements OnInit {
  canAccess_feature_AddOrUpdateExpense: boolean;
  canAccess_feature_ManageMerchant: boolean;
  canAccess_feature_ManageExpenseCategory: boolean;
  canAccess_feature_ViewExpenses: boolean;
  canAccess_feature_DragApps: boolean;
  canAccess_feature_ShareExpense: boolean;
  canAccess_feature_ArchiveExpense: boolean;
  canAccess_feature_ApproveOrRejectExpense: boolean;
  canAccess_feature_ViewExpenseReports: boolean;
  canAccess_feature_ManageExpenseSettings: boolean;
  canAccess_feature_AddOrEditCustomFieldsForExpenses: boolean;
  canAccess_feature_CanSubmitCustomFieldsForExpenses: boolean;

  ngOnInit(): void {
    var rolesJson = localStorage.getItem(LocalStorageProperties.RoleFeatures);
    var roles: any[] = rolesJson ? JSON.parse(rolesJson) : [];

    this.canAccess_feature_AddOrUpdateExpense = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateExpense.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageMerchant = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageMerchant.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageExpenseCategory = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageExpenseCategory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewExpenses = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewExpenses.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DragApps = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_DragApps.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ShareExpense = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ShareExpense.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveExpense = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveExpense.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApproveOrRejectExpense = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ApproveOrRejectExpense.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewExpenseReports = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewExpenseReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageExpenseSettings = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageExpenseSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrEditCustomFieldsForExpenses = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrEditCustomFieldsForExpenses.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanSubmitCustomFieldsForExpenses = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_CanSubmitCustomFieldsForExpenses.toString().toLowerCase(); }) != null;
  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
