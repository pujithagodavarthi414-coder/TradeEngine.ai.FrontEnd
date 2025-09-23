import { Component, OnInit } from "@angular/core";
import { FeatureIds } from '../../globaldependencies/constants/feature-ids';
import * as _ from "underscore";
import { LocalStorageProperties } from '../constants/localstorage-properties';

@Component({
  template: ""
})
export class AppBaseComponent implements OnInit {
  canAccess_feature_ManageRegion: boolean;
  canAccess_feature_AddOrUpdateClient: boolean;
  canAccess_feature_ViewRecentlyActiveClients: boolean;
  canAccess_feature_ManageImportOrExportClient: boolean;
  canAccess_feature_ViewEstimate: boolean;
  canAccess_feature_AddOrUpdateEstimate: boolean;
  canAccess_feature_ArchiveOrUnarchiveEstimate: boolean;
  canAccess_feature_AddOrUpdateInvoice: boolean;
  canAccess_feature_ViewOrManageInvoiceStatus: boolean;
  canAccess_feature_ViewInvoice: boolean;
  canAccess_feature_DownloadOrShareInvoice: boolean;
  canAccess_feature_ArchiveOrUnarchiveInvoice: boolean;
  canAccess_feature_ConfigureKYC: boolean;
  canAccess_feature_ManageLeadTemplates: boolean;
  canAccess_feature_AddLeadTemplates: boolean;
  canAccess_feature_ManagePurchaseContract: boolean;
  canAccess_feature_ManageSite: boolean;
  canAccess_feature_ManageGRD: boolean;
  canAccess_feature_ManageTVA: boolean;
  canAccess_feature_ManageSolarLog: boolean;
  canAccess_feature_ManageManageEntryFormField: boolean;
  canAccess_feature_ManageGrades: boolean;
  canAccess_feature_ManageProduct: boolean;
  canAccess_feature_ManagePortDetails: boolean;
  canAccess_feature_ManageModeorTermsofPayment: boolean;
  canAccess_feature_ViewClientInvoices: boolean;
  canAccess_feature_CreateClientInvoice: boolean;
  canAccess_feature_ViewContracts: boolean;
  canAccess_feature_AddContracts: boolean;
  canAccess_feature_EditContracts: boolean;
  canAccess_feature_ArchiveContracts: boolean;
  canAccess_feature_ViewLeads: boolean;
  canAccess_feature_CreateLeads: boolean;
  canAccess_feature_ViewCreditLogs: boolean;
  canAccess_feature_ManageConsignee: boolean;
  canAccess_feature_ManageConsigner: boolean;
  canAccess_feature_ManageVessels: boolean;
  canAccess_feature_AddPurchaseExecution: boolean;
  canAccess_feature_ViewPurchaseExecution: boolean;
  canAccess_feature_ManageExpenseBooking: boolean;
  canAccess_feature_ManagePaymentReceipt: boolean;
  canAccess_feature_ManageMasterAccount: boolean;
  canAccess_feature_ManageCreditNote: boolean;
  canAccess_feature_ManageLegalEntities: boolean;
  canAccess_feature_ManageClientTypes: boolean;
  canAccess_feature_ManageAddresses: boolean;
  canAccess_feature_ManageClientSettings: boolean;
  canAccess_feature_ManageKycStatus: boolean;
  canAccess_feature_ViewClientKycHistory: boolean;
  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_ManageRegion = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRegion.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateClient = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateClient.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewRecentlyActiveClients = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewRecentlyActiveClients.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageImportOrExportClient = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageImportOrExportClient.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEstimate = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEstimate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEstimate = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEstimate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveEstimate = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveEstimate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateInvoice = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateInvoice.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewOrManageInvoiceStatus = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewOrManageInvoiceStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewInvoice = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewInvoice.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DownloadOrShareInvoice = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_DownloadOrShareInvoice.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveInvoice = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveInvoice.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConfigureKYC = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ConfigureKYC.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageLeadTemplates = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageLeadtemplates.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePurchaseContract = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePurchaseContract.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddLeadTemplates = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddLeadtemplates.toString().toLowerCase(); }) != null;

    this.canAccess_feature_ManageSite = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageSite.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageGRD = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageGRD.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTVA = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTVA.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageSolarLog = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageSolarLog.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageManageEntryFormField = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageManageEntryFormField.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageProduct = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageProduct.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageModeorTermsofPayment = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageModeorTermsofPayment.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePortDetails = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePortDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CreateClientInvoice = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_CreateClientInvoice.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewClientInvoices = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewClientInvoices.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageGrades = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageGrades.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewContracts = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewContracts.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddContracts = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddContracts.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EditContracts = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_EditContracts.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveContracts = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveContracts.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewLeads = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewLeads.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CreateLeads = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_CreateLeads.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewCreditLogs = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewCreditLogs.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageConsignee = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageConsignee.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageConsigner = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ManageConsigner.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddPurchaseExecution = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddPurchaseExecution.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewPurchaseExecution = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewPurchaseExecution.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageSite = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageSite.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageGRD = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageGRD.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTVA = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTVA.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageSolarLog = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageSolarLog.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageManageEntryFormField = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageManageEntryFormField.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageExpenseBooking = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageExpenseBookingId.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePaymentReceipt = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePaymentReceiptId.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCreditNote = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCreditNoteId.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageMasterAccount = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageMasterAccountId.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageLegalEntities = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageLegalEntities.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageClientTypes = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageClientTypes.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageVessels = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageVessels.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageAddresses = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageAddresses.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageClientSettings = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageClientSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageKycStatus = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ManageKycStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewClientKycHistory = _.find(roles, function(role){ return role.featureId.toLowerCase() == FeatureIds.Feature_ViewClientKycHistory.toString().toLowerCase(); }) != null;

  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
