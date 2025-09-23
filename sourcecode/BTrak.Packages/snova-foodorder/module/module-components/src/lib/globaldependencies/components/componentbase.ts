import { Component, OnInit } from "@angular/core";
import { FeatureIds } from "../constants/feature-ids";
import { LocalStorageProperties } from '../constants/localstorage-properties';
import * as _ from "underscore";

@Component({
  template: ""
})
export class CustomAppBaseComponent implements OnInit {

  canAccess_feature_AllFoodOrders: boolean;
  canAccess_feature_ViewFoodOrders: boolean;
  canAccess_feature_AddFoodOrder: boolean;
  canAccess_feature_BillAmountOnDailyBasis: boolean;
  canAccess_feature_RecentIndividualFoodOrders: boolean;
  canAccess_feature_UpdateFoodOrder: boolean;

  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_AllFoodOrders = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AllFoodOrders.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewFoodOrders = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewFoodOrders.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddFoodOrder = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddFoodOrder.toString().toLowerCase(); }) != null;
    this.canAccess_feature_BillAmountOnDailyBasis = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_BillAmountOnDailyBasis.toString().toLowerCase(); }) != null;
    this.canAccess_feature_RecentIndividualFoodOrders = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_RecentIndividualFoodOrders.toString().toLowerCase(); }) != null;
    this.canAccess_feature_UpdateFoodOrder = _.find(roles, function (role) { return role.featureId.toLowerCase() == FeatureIds.Feature_UpdateFoodOrder.toString().toLowerCase(); }) != null;
  }

  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
