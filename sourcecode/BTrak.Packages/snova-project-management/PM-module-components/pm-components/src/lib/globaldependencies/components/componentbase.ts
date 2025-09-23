import { Component, OnInit } from "@angular/core";
import { FeatureIds } from '../constants/feature-ids';
import * as _ from "underscore";
import { LocalStorageProperties } from '../constants/localstorage-properties';

@Component({
  template: ""
})
export class CustomAppBaseComponent implements OnInit {
  canAccess_feature_MyWork: Boolean;
  canAccess_feature_AllGoals: Boolean;
  canAccess_feature_AccessTestrepo: Boolean;
  canAccess_feature_ArchiveProject: Boolean;
  canAccess_feature_AssignAdhocWorkToAllUsers: Boolean;
  canAccess_feature_TestrepoManagement: Boolean;
  canAccess_feature_AddOrEditCustomFieldsForProjectManagement: Boolean;
  canAccess_feature_ProjectManagement: Boolean;
  canAccess_feature_ViewProjects: Boolean;
  canAccess_feature_ManageTestrepoManagement: Boolean;
  canAccess_feature_PublishAsDefault: Boolean;
  canAccess_feature_DeleteCustomFieldsForProjectManagement: Boolean;
  canAccess_feature_ArchiveAdhocWork: Boolean;
  canAccess_feature_ViewProjectActivity: Boolean;
  canAccess_feature_AddProject: Boolean;
  canAccess_feature_AddOrUpdateAdhocWork: Boolean;
  canAccess_feature_DeleteGoalFilter: Boolean;
  canAccess_feature_ManageProjectManagement: Boolean;
  canAccess_feature_ViewFiles: Boolean;
  canAccess_feature_CanSubmitCustomFieldsForProjectManagement: Boolean;
  canAccess_feature_ViewTestrepoReports: Boolean;
  canAccess_feature_MyAdhocWork: Boolean;
  canAccess_feature_UnarchiveProject: Boolean;
  canAccess_feature_ParkAdhocWork: Boolean;
  canAccess_feature_AllGoalsWithAdvancedSearch: Boolean;
  canAccess_feature_ManageProjectRolePermissions: Boolean;
  canAccess_feature_ViewAllAdhocWorks: Boolean;
  canAccess_feature_ViewMyWorkWithAdvancedSearch: Boolean;
  canAccess_feature_MyProjectWork: Boolean;
  canAccess_feature_DragApps: Boolean;
  canAccess_feature_ViewAuditActions: Boolean;
  canAccess_feature_EmployeeIndex: Boolean;
  canAccess_feature_QaPerformance: Boolean;
  canAccess_feature_AccessAudits: Boolean;
  canAccess_feature_ViewAudits: Boolean;
  canAccess_feature_ViewProjectsInAudits: Boolean;
  canAccess_feature_ViewActivityScreenshots: Boolean;
  canAccess_feature_ViewProjectReports: Boolean;
  canAccess_feature_ManageProjectSettings: Boolean;
  canAccess_feature_ResourceUsageReport: Boolean;
  canAccess_feature_ProjectUsageReport: Boolean;

  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_MyWork = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_MyWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AllGoals = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AllGoals.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AccessTestrepo = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AccessTestrepo.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveProject = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveProject.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AssignAdhocWorkToAllUsers = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AssignAdhocWorkToAllUsers.toString().toLowerCase(); }) != null;
    this.canAccess_feature_TestrepoManagement = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_TestrepoManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrEditCustomFieldsForProjectManagement = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrEditCustomFieldsForProjectManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ProjectManagement = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ProjectManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewProjects = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjects.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTestrepoManagement = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTestrepoManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PublishAsDefault = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_PublishAsDefault.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DeleteCustomFieldsForProjectManagement = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_DeleteCustomFieldsForProjectManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveAdhocWork = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveAdhocWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewProjectActivity = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjectActivity.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddProject = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddProject.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAdhocWork = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAdhocWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DeleteGoalFilter = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_DeleteGoalFilter.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageProjectManagement = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageProjectManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewFiles = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewFiles.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanSubmitCustomFieldsForProjectManagement = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_CanSubmitCustomFieldsForProjectManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTestrepoReports = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTestrepoReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_MyAdhocWork = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_MyAdhocWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_UnarchiveProject = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_UnarchiveProject.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ParkAdhocWork = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ParkAdhocWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AllGoalsWithAdvancedSearch = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AllGoalsWithAdvancedSearch.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageProjectRolePermissions = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageProjectRolePermissions.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAllAdhocWorks = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAllAdhocWorks.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewMyWorkWithAdvancedSearch = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewMyWorkWithAdvancedSearch.toString().toLowerCase(); }) != null;
    this.canAccess_feature_MyProjectWork = _.find(roles, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_MyProjectWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DragApps = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_DragApps.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAuditActions = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAuditActions.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeIndex = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeIndex.toString().toLowerCase(); }) != null;
    this.canAccess_feature_QaPerformance = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_QaPerformance.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AccessAudits = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_AccessAudits.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewActivityScreenshots = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewActivityScreenshots.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewProjectReports = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjectReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageProjectSettings = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageProjectSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAudits = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAudits.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewProjectsInAudits = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjectsInAudits.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ResourceUsageReport = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ResourceUsageReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ProjectUsageReport = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ProjectUsageReport.toString().toLowerCase(); }) != null;
  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
