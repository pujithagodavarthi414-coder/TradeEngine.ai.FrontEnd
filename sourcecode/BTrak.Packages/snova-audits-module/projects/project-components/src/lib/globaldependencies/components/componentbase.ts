import { Component, OnInit } from "@angular/core";
import { FeatureIds } from '../constants/feature-ids';
import * as _ from "underscore";
import { LocalStorageProperties } from '../constants/localstorage-properties';

@Component({
  template: ""
})
export class CustomAppBaseComponent implements OnInit {
  canAccess_feature_ViewMasterQuestionTypes: Boolean;
  canAccess_feature_ViewQuestionTypes: Boolean;
  canAccess_feature_AddOrUpdateQuestionType: Boolean;
  canAccess_feature_CanViewAuditNonComplainceReport: Boolean;
  canAccess_feature_ArchiveOrUnarchiveQuestionType: Boolean;
  canAccess_feature_CanViewAuditComplainceReport: Boolean;
  canAccess_feature_CanViewNumberOfAuditsSubmitted: Boolean;
  canAccess_feature_AddOrUpdateActionCategory: Boolean;
  canAccess_feature_ViewActionCategory: Boolean;
  canAccess_feature_ArchiveOrUnarchiveActionCategory: Boolean;
  canAccess_feature_AddOrUpdateAuditRisk: Boolean;
  canAccess_feature_ViewAuditRisk: Boolean;
  canAccess_feature_ArchiveOrUnarchiveAuditRisk: Boolean;
  canAccess_feature_AddOrUpdateAuditImpact: Boolean;
  canAccess_feature_ViewAuditImpact: Boolean;
  canAccess_feature_ArchiveOrUnarchiveAuditImpact: Boolean;
  canAccess_feature_AddOrUpdateAuditPriority: Boolean;
  canAccess_feature_ViewAuditPriority: Boolean;
  canAccess_feature_ArchiveOrUnarchiveAuditPriority: Boolean;
  canAccess_feature_AddOrUpdateAuditRating: Boolean;
  canAccess_feature_ViewAuditRating: Boolean;
  canAccess_feature_ArchiveOrUnarchiveAuditRating: Boolean;
  canAccess_feature_AddDocumentsForQuestion: Boolean;

  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_AddDocumentsForQuestion = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddDocumentsForQuestion.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewMasterQuestionTypes = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewMasterQuestionTypes.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewQuestionTypes = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewQuestionTypes.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateQuestionType = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateQuestionType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanViewAuditNonComplainceReport = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_CanViewAuditNonComplainceReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveQuestionType = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveQuestionType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanViewAuditComplainceReport = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_CanViewAuditComplainceReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanViewNumberOfAuditsSubmitted = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_CanViewNumberOfAuditsSubmitted.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateActionCategory = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateActionCategory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewActionCategory = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewActionCategory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveActionCategory = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveActionCategory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAuditRisk = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAuditRisk.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAuditRisk = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAuditRisk.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveAuditRisk = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveAuditRisk.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAuditImpact = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAuditImpact.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAuditImpact = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAuditImpact.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveAuditImpact = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveAuditImpact.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAuditPriority = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAuditPriority.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAuditPriority = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAuditPriority.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveAuditPriority = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveAuditPriority.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAuditRating = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAuditRating.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAuditRating = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAuditRating.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveAuditRating = _.find(roles, function(role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveAuditRating.toString().toLowerCase(); }) != null;
  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}