import { Component, OnInit } from "@angular/core";
import * as _ from "underscore";
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { EntityTypeFeatureIds } from '../constants/entitytype-feature-ids';

@Component({
  template: ""
})

export class AppFeatureBaseComponent implements OnInit {
  canAccess_entityType_feature_AddOrUpdateAuditCategory: Boolean;
  canAccess_entityType_feature_ArchiveOrUnarchiveAuditReports: Boolean;
  canAccess_entityType_feature_ViewAuditConducts: Boolean;
  canAccess_entityType_feature_AddOrUpdateAuditQuestions: Boolean;
  canAccess_entityType_feature_AddOrUpdateAuditReports: Boolean;
  canAccess_entityType_feature_ViewAudit: Boolean;
  canAccess_entityType_feature_ArchiveOrUnarchiveAudit: Boolean;
  canAccess_entityType_feature_ArchiveOrUnarchiveAuditConduct: Boolean;
  canAccess_entityType_feature_CanAssignAuditTags: Boolean;
  canAccess_entityType_feature_ArchiveOrUnarchiveAuditCategory: Boolean;
  canAccess_entityType_feature_CopyOrMoveQuestions: Boolean;
  canAccess_entityType_feature_DownloadOrShareAuditReports: Boolean;
  canAccess_entityType_feature_CanCloneAudit: Boolean;
  canAccess_entityType_feature_AddOrUpdateAuditConduct: Boolean;
  canAccess_entityType_feature_ArchiveOrUnarchiveAuditQuestions: Boolean;
  canAccess_entityType_feature_ViewAuditActions: Boolean;
  canAccess_entityType_feature_AddOrUpdateAudit: Boolean;
  canAccess_entityType_feature_ViewAuditReports: Boolean;
  canAccess_entityType_feature_CanAnswerQuestions: Boolean;
  canAccess_entityType_feature_CanSubmitAuditConduct: Boolean;
  canAccess_entityType_feature_ViewOverallAuditActivity: Boolean;
  canAccess_entityType_feature_ViewAuditConductTimelineReport: Boolean;
  canAccess_entityType_feature_CanImportAndExportAudits: Boolean;
  canAccess_entityType_feature_CanImportAndExportConducts: Boolean;
  canAccess_entityType_feature_CanAddAndViewAuditLevelDocuments: Boolean;
  canAccess_entityType_feature_CanAddAndViewConductLevelDocuments: Boolean;
  canAccess_entityType_feature_CanAddAndViewQuestionLevelDocuments: Boolean;
  canAccess_entityType_feature_AddOrUpdateAuditFolder: Boolean;
  canAccess_entityType_feature_DeleteAuditFolder: Boolean;
  canAccess_entityType_feature_CanConfigureQuestionRoles: Boolean;
  canAccess_entityType_feature_CanCreateAuditVersion: Boolean;
  canAccess_entityType_feature_CanViewAuditVersions: Boolean;
  canAccess_entityType_feature_CanReconductAudit: Boolean;
  canAccess_entityType_feature_CanScheduleAudit: Boolean;
  canAccess_entityType_feature_CanEnableWorkflows: Boolean;
  canAccess_entityType_feature_CanViewQuestionLevelAnalytics: Boolean;
  canAccess_entityType_feature_CanViewQuestionLevelCustomFields: Boolean;
  canAccess_entityType_feature_CanSendLinkForSubmission: Boolean;
  canAccess_entityType_feature_CanAddAuditAction: Boolean;
  canAccess_entityType_feature_CanViewAuditAnalytics: Boolean;
  canAccess_entityType_feature_CanLogTime: Boolean;
  
  canAccess_entityType_feature_CanAddEstimatedTime: Boolean;
  canAccess_entityType_feature_CanViewConductHistory: Boolean;
  canAccess_entityType_feature_CopyOrMoveQuestionsFromCategoryToCategory: Boolean;
  canAccess_entityType_feature_CanDeleteAuditSchedule: Boolean;
  canAccess_entityType_feature_ViewAuditDetails: Boolean;
  canAccess_entityType_feature_ViewConductDetails: Boolean;
  canAccess_entityType_feature_CanAddOrEditAuditPriority: Boolean;
  canAccess_entityType_feature_CanAddOrEditAuditImpact: Boolean;
  canAccess_entityType_feature_CanAddOrEditAuditRisk: Boolean;
  canAccess_entityType_feature_CanAddRAGConfiguration: Boolean;
  canAccess_entityType_feature_CanHaveQuestionResponsiblePerson: Boolean;
  canAccess_entityType_feature_CanAssignConductTags: Boolean;
  canAccess_entityType_feature_CanAddAuditLevelCustomFields: Boolean;
  canAccess_entityType_feature_CanAnswerConductLevelCustomFields: Boolean;
  canAccess_entityType_feature_CanViewConductLevelCustomFieldsHistory: Boolean;
  canAccess_entityType_feature_CanAddAndViewAuditLevelComments: Boolean;
  canAccess_entityType_feature_CanAddAndViewConductLevelComments: Boolean;
  canAccess_entityType_feature_CanAddAndViewAuditQuestionLevelComments: Boolean;
  canAccess_entityType_feature_CanAddAndViewConductQuestionLevelComments: Boolean;

  constructor() {
  }

  ngOnInit() {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.EntityRoleFeatures));
    this.canAccess_entityType_feature_AddOrUpdateAuditCategory = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateAuditCategory.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ArchiveOrUnarchiveAuditReports = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ArchiveOrUnarchiveAuditReports.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ViewAuditConducts = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ViewAuditConducts.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_AddOrUpdateAuditQuestions = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateAuditQuestions.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_AddOrUpdateAuditReports = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateAuditReports.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ViewAudit = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ViewAudit.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ArchiveOrUnarchiveAudit = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ArchiveOrUnarchiveAudit.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ArchiveOrUnarchiveAuditConduct = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ArchiveOrUnarchiveAuditConduct.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAssignAuditTags = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAssignAuditTags.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ArchiveOrUnarchiveAuditCategory = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ArchiveOrUnarchiveAuditCategory.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CopyOrMoveQuestions = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CopyOrMoveQuestions.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_DownloadOrShareAuditReports = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_DownloadOrShareAuditReports.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanCloneAudit = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanCloneAudit.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_AddOrUpdateAuditConduct = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateAuditConduct.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ArchiveOrUnarchiveAuditQuestions = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ArchiveOrUnarchiveAuditQuestions.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ViewAuditActions = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ViewAuditActions.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_AddOrUpdateAudit = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateAudit.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ViewAuditReports = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ViewAuditReports.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAnswerQuestions = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAnswerQuestions.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanSubmitAuditConduct = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanSubmitAuditConduct.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ViewOverallAuditActivity = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ViewOverallAuditActivity.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ViewAuditConductTimelineReport = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ViewAuditConductTimelineReport.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanImportAndExportAudits = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanImportAndExportAudits.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanImportAndExportConducts = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanImportAndExportConducts.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAddAndViewAuditLevelDocuments = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAndViewAuditLevelDocuments.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAddAndViewConductLevelDocuments = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAndViewConductLevelDocuments.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAddAndViewQuestionLevelDocuments = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAndViewQuestionLevelDocuments.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_AddOrUpdateAuditFolder = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateAuditFolder.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_DeleteAuditFolder = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_DeleteAuditFolder.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanConfigureQuestionRoles = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanConfigureQuestionRoles.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanCreateAuditVersion = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanCreateAuditVersion.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanViewAuditVersions = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanViewAuditVersions.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanReconductAudit = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanReconductAudit.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanScheduleAudit = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanScheduleAudit.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanEnableWorkflows = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanEnableWorkflows.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanViewQuestionLevelAnalytics = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanViewQuestionLevelAnalytics.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanViewQuestionLevelCustomFields = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanViewQuestionLevelCustomFields.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanSendLinkForSubmission = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanSendLinkForSubmission.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAddAuditAction = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAuditAction.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanViewAuditAnalytics = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanViewAuditAnalytics.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanLogTime = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanLogTime.toString().toLowerCase(); }) != null;
    
    this.canAccess_entityType_feature_CanAddEstimatedTime = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddEstimatedTime.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanViewConductHistory = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanViewConductHistory.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CopyOrMoveQuestionsFromCategoryToCategory = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CopyOrMoveQuestionsFromCategoryToCategory.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanDeleteAuditSchedule = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanDeleteAuditSchedule.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ViewAuditDetails = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ViewAuditDetails.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_ViewConductDetails = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ViewConductDetails.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAddOrEditAuditPriority = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddOrEditAuditPriority.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAddOrEditAuditImpact = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddOrEditAuditImpact.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAddOrEditAuditRisk = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddOrEditAuditRisk.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAddRAGConfiguration = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddRAGConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanHaveQuestionResponsiblePerson = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanHaveQuestionResponsiblePerson.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAssignConductTags = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAssignConductTags.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAddAuditLevelCustomFields = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAuditLevelCustomFields.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAnswerConductLevelCustomFields = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAnswerConductLevelCustomFields.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanViewConductLevelCustomFieldsHistory = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanViewConductLevelCustomFieldsHistory.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAddAndViewAuditLevelComments = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAndViewAuditLevelComments.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAddAndViewConductLevelComments = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAndViewConductLevelComments.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAddAndViewAuditQuestionLevelComments = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAndViewAuditQuestionLevelComments.toString().toLowerCase(); }) != null;
    this.canAccess_entityType_feature_CanAddAndViewConductQuestionLevelComments = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAndViewConductQuestionLevelComments.toString().toLowerCase(); }) != null;
  }
}