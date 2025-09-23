import { Component, OnInit } from "@angular/core";
import { FeatureIds } from '../constants/feature-ids';
import { LocalStorageProperties } from '../constants/localstorage-properties';

@Component({
  template: ""
})

export class CustomAppBaseComponent implements OnInit {
  canAccess_feature_AddOrUpdateStatusReportingConfiguration: Boolean;
  canAccess_feature_ViewStatusReports: Boolean;
  canAccess_feature_SubmitStatusReport: Boolean;
  canAccess_feature_AddOrUpdateForm: Boolean;
  canAccess_feature_ArchiveStatusReportConfiguration: Boolean;
  canAccess_feature_ViewStatusReportingConfiguration: Boolean;
  canAccess_feature_ViewStatusReportSettings: Boolean;

  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_AddOrUpdateStatusReportingConfiguration = roles.find(role => { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateStatusReportingConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewStatusReports = roles.find(role => { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewStatusReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_SubmitStatusReport = roles.find(role => { return role.featureId.toLowerCase() == FeatureIds.Feature_SubmitStatusReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateForm = roles.find(role => { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateForm.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveStatusReportConfiguration = roles.find(role => { return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveStatusReportConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewStatusReportingConfiguration = roles.find(role => { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewStatusReportingConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewStatusReportSettings = roles.find(role => { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewStatusReportSettings.toString().toLowerCase(); }) != null;
  
  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {
  }

  private logNavigation() {
  }
  
}
