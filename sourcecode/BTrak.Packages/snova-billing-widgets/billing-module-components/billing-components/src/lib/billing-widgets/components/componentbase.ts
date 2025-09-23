import { Component, OnInit } from "@angular/core";
import { FeatureIds } from '../../globaldependencies/constants/feature-ids';
import * as _ from "underscore";
import { LocalStorageProperties } from '../constants/localstorage-properties';

@Component({
  template: ""
})
export class AppBaseComponent implements OnInit {
  canAccess_feature_ViewEstimate: boolean;
  canAccess_feature_AddOrUpdateEstimate: boolean;
  canAccess_feature_ArchiveOrUnarchiveEstimate: boolean;
  canAccess_feature_AddOrUpdateInvoice: boolean;
  canAccess_feature_ViewOrManageInvoiceStatus: boolean;
  canAccess_feature_ViewInvoice: boolean;
  canAccess_feature_DownloadOrShareInvoice: boolean;
  canAccess_feature_ArchiveOrUnarchiveInvoice:boolean;
  canAccess_feature_ManageInvoiceSettings:boolean;
  canAccess_feature_AddOrEditCustomFieldsForInvoices: boolean;
  canAccess_feature_CanSubmitCustomFieldsForInvoices: boolean;
  canAccess_feature_DeleteCustomFieldsForHrManagement: boolean;
  canAccess_feature_ManageAdvancedInvoices: boolean;
  canAccess_feature_ManageEntryComponents: boolean;
  canAccess_feature_ManageBankAccountComponents: boolean;
  canAccess_feature_ManageMessageFieldType: boolean;
  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_ViewEstimate = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEstimate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEstimate = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEstimate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveEstimate = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveEstimate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateInvoice = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateInvoice.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewOrManageInvoiceStatus = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewOrManageInvoiceStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewInvoice = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewInvoice.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DownloadOrShareInvoice = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_DownloadOrShareInvoice.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveInvoice = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveInvoice.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageInvoiceSettings = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageInvoiceSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DeleteCustomFieldsForHrManagement = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_DeleteCustomFieldsForHrManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrEditCustomFieldsForInvoices = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrEditCustomFieldsForInvoices.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanSubmitCustomFieldsForInvoices = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_CanSubmitCustomFieldsForInvoices.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageAdvancedInvoices = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageAdvancedInvoices.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageEntryComponents = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageEntryComponents.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageBankAccountComponents = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageBankAccountComponents.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageMessageFieldType = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageMessageFieldType.toString().toLowerCase(); }) != null;
  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
