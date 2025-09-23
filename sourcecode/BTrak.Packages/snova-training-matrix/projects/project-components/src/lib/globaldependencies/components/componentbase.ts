import { Component, OnInit } from "@angular/core";
import { FeatureIds } from '../constants/feature-ids';
import * as _ from "underscore";
import { LocalStorageProperties } from '../constants/localstorage-properties';

@Component({
  template: ""
})
export class CustomAppBaseComponent implements OnInit {
  canAccess_feature_ViewTrainingCourses: Boolean;
  canAccess_feature_AssignOrUnassignTrainingCourse: Boolean;
  canAccess_feature_ViewTrainingAssignments: Boolean;
  canAccess_feature_ViewTrainingMatrix: Boolean;
  canAccess_feature_ArchiveTrainingCourse: Boolean;
  canAccess_feature_AddOrUpdateTrainingCourse: Boolean;
  canAccess_feature_TrainingManagement: Boolean;
  canAccess_feature_ViewTrainingRecord: Boolean;
  canAccess_feature_AddOrUpdateAssignmentStatus: Boolean;
  canAccess_feature_DragApps: Boolean;

  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_ViewTrainingCourses = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingCourses.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AssignOrUnassignTrainingCourse = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_AssignOrUnassignTrainingCourse.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingAssignments = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingAssignments.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingMatrix = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingMatrix.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveTrainingCourse = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveTrainingCourse.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateTrainingCourse = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateTrainingCourse.toString().toLowerCase(); }) != null;
    this.canAccess_feature_TrainingManagement = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_TrainingManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingRecord = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingRecord.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingCourses = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingCourses.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AssignOrUnassignTrainingCourse = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AssignOrUnassignTrainingCourse.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingAssignments = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingAssignments.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingMatrix = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingMatrix.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveTrainingCourse = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveTrainingCourse.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateTrainingCourse = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateTrainingCourse.toString().toLowerCase(); }) != null;
    this.canAccess_feature_TrainingManagement = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_TrainingManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingRecord = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingRecord.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAssignmentStatus = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAssignmentStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DragApps = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_DragApps.toString().toLowerCase(); }) != null;
  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
