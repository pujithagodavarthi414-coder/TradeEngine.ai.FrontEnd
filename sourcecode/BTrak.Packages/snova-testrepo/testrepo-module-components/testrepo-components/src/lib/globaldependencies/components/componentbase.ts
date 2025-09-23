import { Component, OnInit } from "@angular/core";
import { FeatureIds } from '../constants/feature-ids';
import * as _ from "underscore";
import { LocalStorageProperties } from '../constants/localstorage-properties';

@Component({
  template: ""
})
export class CustomAppBaseComponent implements OnInit {
  canAccess_feature_AccessTestrepo: Boolean;
  canAccess_feature_ViewProjects: Boolean;
  canAccess_feature_ViewTestrepoReports: Boolean;

  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_AccessTestrepo = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_AccessTestrepo.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewProjects = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjects.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTestrepoReports = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTestrepoReports.toString().toLowerCase(); }) != null;
  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
