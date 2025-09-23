import { Component, OnInit } from "@angular/core";
import { FeatureIds } from "../constants/feature-ids";
import { LocalStorageProperties } from '../constants/localstorage-properties';
import * as _ from "underscore";

@Component({
  template: ""
})
export class CustomAppBaseComponent implements OnInit {

  canAccess_feature_CanteenPurchasesSummary: boolean;
  canAccess_feature_ViewEmployeeCredits: boolean;
  canAccess_feature_FoodItemsList: boolean;
  canAccess_feature_AddOrUpdateFoodItem: boolean;
  canAccess_feature_CreditAmount: boolean;
  canAccess_feature_OffersCreditedToUsersSummary: boolean;
  canAccess_feature_PurchaseFoodItem: boolean;

  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_CanteenPurchasesSummary = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_CanteenPurchasesSummary.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeCredits = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeCredits.toString().toLowerCase(); }) != null;
    this.canAccess_feature_FoodItemsList = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_FoodItemsList.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateFoodItem = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateFoodItem.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CreditAmount = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_CreditAmount.toString().toLowerCase(); }) != null;
    this.canAccess_feature_OffersCreditedToUsersSummary = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_OffersCreditedToUsersSummary.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PurchaseFoodItem = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_PurchaseFoodItem.toString().toLowerCase(); }) != null;
  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
