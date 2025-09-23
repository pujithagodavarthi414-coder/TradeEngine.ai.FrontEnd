import { Component, OnInit } from "@angular/core";
import { FeatureIds } from "../constants/feature-ids";
import { LocalStorageProperties } from '../constants/localstorage-properties';
import * as _ from "underscore";

@Component({
  template: ""
})
export class CustomAppBaseComponent implements OnInit {
  
  canAccess_feature_CreateRoster: boolean;
  canAccess_feature_ManageRoster: boolean;
  canAccess_feature_EditRoster: boolean;
  canAccess_feature_ViewRoster: boolean;
  canAccess_feature_ApproveRoster: boolean;
  canAccess_feature_SubmitTimesheet: boolean;
  canAccess_feature_ApproveOrRejectTimesheet: boolean;

  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_CreateRoster = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_CreateRoster.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageRoster = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRoster.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EditRoster = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_EditRoster.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewRoster = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewRoster.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApproveRoster = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ApproveRoster.toString().toLowerCase(); }) != null;
    this.canAccess_feature_SubmitTimesheet = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_SubmitTimesheet.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApproveOrRejectTimesheet= _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ApproveOrRejectTimesheet.toString().toLowerCase(); }) != null;
  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
