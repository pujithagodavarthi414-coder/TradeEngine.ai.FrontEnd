import { Component, OnInit } from "@angular/core";
import { EntityTypeFeatureIds } from './entitytype-feature-ids';
import * as _ from "underscore";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
  template: ""
})

export class CustomAppFeatureBaseComponent implements OnInit {
  canAccess_entityType_feature_AddOrUpdateVersion: Boolean;
  canAccess_entityType_feature_DeleteTestcases: Boolean;
  canAccess_entityType_feature_AddOrUpdateRun: Boolean;
  canAccess_entityType_feature_DeleteTestReport: Boolean;
  canAccess_entityType_feature_DeleteScenario: Boolean;
  canAccess_entityType_feature_DeleteVersion: Boolean;
  canAccess_entityType_feature_AddOrUpdateScenarioSection: Boolean;
  canAccess_entityType_feature_DeleteScenarioSection: Boolean;
  canAccess_entityType_feature_SendReport: Boolean;
  canAccess_entityType_feature_AddOrUpdateStatus: Boolean;
  canAccess_entityType_feature_CopyOrMoveCases: Boolean;
  canAccess_entityType_feature_AddOrUpdateTestReport: Boolean;
  canAccess_entityType_feature_ExportRunReport: Boolean;
  canAccess_entityType_feature_MergeScenarios: Boolean;
  canAccess_entityType_feature_AddOrUpdateTestcases: Boolean;
  canAccess_entityType_feature_ExportAndImportScenarios: Boolean;
  canAccess_entityType_feature_DeleteRun: Boolean;
  canAccess_entityType_feature_AddOrUpdateScenario: Boolean;
  canAccess_entityType_feature_CanMoveTestSuiteFromOneProjectToAnother: Boolean;

  constructor() {
  }

  ngOnInit() {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.EntityRoleFeatures));
    this.canAccess_entityType_feature_AddOrUpdateVersion = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateVersion.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_DeleteTestcases = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_DeleteTestcases.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_AddOrUpdateRun = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateRun.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_DeleteTestReport = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_DeleteTestReport.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_DeleteScenario = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_DeleteScenario.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_DeleteVersion = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_DeleteVersion.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_AddOrUpdateScenarioSection = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateScenarioSection.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_DeleteScenarioSection = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_DeleteScenarioSection.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_SendReport = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_SendReport.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_AddOrUpdateStatus = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateStatus.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CopyOrMoveCases = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CopyOrMoveCases.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_AddOrUpdateTestReport = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateTestReport.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ExportRunReport = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ExportRunReport.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_MergeScenarios = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_MergeScenarios.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_AddOrUpdateTestcases = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateTestcases.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ExportAndImportScenarios = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ExportAndImportScenarios.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_DeleteRun = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_DeleteRun.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_AddOrUpdateScenario = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateScenario.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanMoveTestSuiteFromOneProjectToAnother = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanMoveTestSuiteFromOneProjectToAnother.toString().toLowerCase(); }) != null;
  }
}
