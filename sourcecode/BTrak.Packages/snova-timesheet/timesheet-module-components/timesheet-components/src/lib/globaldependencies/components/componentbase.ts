import { Component, OnInit } from "@angular/core";
import { FeatureIds } from '../constants/feature-ids';
import * as _ from "underscore";
import { LocalStorageProperties } from '../constants/localstorage-properties';

@Component({
  template: ""
})

export class CustomAppBaseComponent implements OnInit {
  canAccess_feature_AddOrUpdateTimesheetentry: Boolean;
  canAccess_feature_ViewPermissions: Boolean;
  canAccess_feature_ViewTodaysTimesheet: Boolean;
  canAccess_feature_PunchCard: Boolean;
  canAccess_feature_ViewTimesheetFeed: Boolean;
  canAccess_feature_AddPermission: Boolean;
  canAccess_feature_UpdatePermission: Boolean;
  canAccess_feature_DeletePermissions: Boolean;
  canAccess_feature_ViewActivityScreenshots: Boolean;
  canAccess_feature_CanViewLiveScreen: Boolean;

  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_AddOrUpdateTimesheetentry = _.find(roles, function (role) { return role['featureId'].toLowerCase() == FeatureIds.Feature_AddOrUpdateTimesheetentry.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewPermissions = _.find(roles, function (role) { return role['featureId'].toLowerCase() == FeatureIds.Feature_ViewPermissions.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTodaysTimesheet = _.find(roles, function (role) { return role['featureId'].toLowerCase() == FeatureIds.Feature_ViewTodaysTimesheet.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PunchCard = _.find(roles, function (role) { return role['featureId'].toLowerCase() == FeatureIds.Feature_PunchCard.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTimesheetFeed = _.find(roles, function (role) { return role['featureId'].toLowerCase() == FeatureIds.Feature_ViewTimesheetFeed.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddPermission = _.find(roles, function(role){ return role['featureId'].toLowerCase() == FeatureIds.Feature_AddPermission.toString().toLowerCase(); }) != null;
    this.canAccess_feature_UpdatePermission = _.find(roles, function(role){ return role['featureId'].toLowerCase() == FeatureIds.Feature_UpdatePermission.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DeletePermissions = _.find(roles, function(role){ return role['featureId'].toLowerCase() == FeatureIds.Feature_DeletePermissions.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewActivityScreenshots = _.find(roles, function (role) { return role['featureId'].toLowerCase() == FeatureIds.Feature_ViewActivityScreenshots.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanViewLiveScreen = _.find(roles, function(role){ return role['featureId'].toLowerCase() == FeatureIds.Feature_CanViewLiveScreen.toString().toLowerCase(); }) != null;
  }
  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
