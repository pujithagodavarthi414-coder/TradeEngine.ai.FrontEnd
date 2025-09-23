import { createSelector, createFeatureSelector, ActionReducerMap, MemoizedSelector } from "@ngrx/store";

import * as fromSuppliers from "./suppliers.reducers";
import * as fromLocations from "./locations.reducers";
import * as fromCurrency from "./currency.reducers";
import * as fromDamagedAssets from "./damaged-assets.reducers";
import * as fromAssignedAssets from "./assigned-assets.reducers";
import * as fromAssetsAllocatedToMe from "./assets-allocated-to-me.reducers";
import * as fromProducts from "./products.reducers";
import * as fromProductDetails from "./product-details.reducers";
import * as fromAssets from "./assets.reducers";
import * as fromBranches from "./branch.reducers"
import * as fromUsers from "../../project-store/reducers/users.reducers";
import * as fromAssetsCommentsAndHistory from './assetsCommentsAndHistory.reducers';

import * as _ from 'underscore';

import * as fromRoot from "../../main-store/reducers/index";
import { Assets } from "../../models/asset";
import { MemoizedSelectorWithProps } from '@ngrx/store/src/selector';

export interface State extends fromRoot.State {
  assetManagement: AssetManagementState;
}

export interface AssetManagementState {
  suppliers: fromSuppliers.State;
  locations: fromLocations.State;
  currency: fromCurrency.State;
  damagedAssets: fromDamagedAssets.State;
  assignedAssets: fromAssignedAssets.State;
  assetsAssignedToMe: fromAssetsAllocatedToMe.State;
  products: fromProducts.State;
  productDetails: fromProductDetails.State;
  assets: fromAssets.State;
  branches: fromBranches.State;
  users: fromUsers.State;
  assetsCommentsAndHistory: fromAssetsCommentsAndHistory.State;
}

export const reducers: ActionReducerMap<AssetManagementState> = {
  suppliers: fromSuppliers.reducer,
  locations: fromLocations.reducer,
  currency: fromCurrency.reducer,
  damagedAssets: fromDamagedAssets.reducer,
  assignedAssets: fromAssignedAssets.reducer,
  assetsAssignedToMe: fromAssetsAllocatedToMe.reducer,
  products: fromProducts.reducer,
  productDetails: fromProductDetails.reducer,
  assets: fromAssets.reducer,
  branches: fromBranches.reducer,
  users: fromUsers.reducer,
  assetsCommentsAndHistory: fromAssetsCommentsAndHistory.reducer,
}

export const getAssetManagementState = createFeatureSelector<
  State,
  AssetManagementState
>("assetManagement");

//Suppliers Selectors
export const getSupplierEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.suppliers
);

export const {
  selectIds: getSuppliersIds,
  selectEntities: getSuppliersEntities,
  selectAll: getSuppliersAll,
  selectTotal: getSuppliersTotal
} : any = fromSuppliers.supplierAdapter.getSelectors(
  getSupplierEntitiesState
);

export const getSupplierLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.suppliers.loadingSuppliers
);

export const createSupplierLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.suppliers.creatingSupplier
);

export const createSuppliersErrors: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.suppliers.createSupplierErrors
);

export const createSupplierErrors: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.suppliers.createSupplierErrors
);

export const exceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.suppliers.exceptionMessage
);

//Location Management Selectors
export const getLocationEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.locations
);

export const {
  selectIds: getLocationIds,
  selectEntities: getalocationsEntities,
  selectAll: getLocationsAll,
  selectTotal: getLocationsTotal
} : any = fromLocations.locationAdapter.getSelectors(
  getLocationEntitiesState
);

export const getLocationLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.locations.loadingLocations
);

export const createLocationLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.locations.creatingLocation
);

export const createLocationsErrors: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.locations.createLocationErrors
);


export const locationExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.locations.exceptionMessage
);

//Currency Selectors
export const getCurrencyEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.currency
);

export const {
  selectIds: getCurrencyId,
  selectEntities: getCurrencyEntities,
  selectAll: getCurrencyAll,
  selectTotal: getCurrencyTotal
} : any = fromCurrency.currencyAdapter.getSelectors(
  getCurrencyEntitiesState
);

export const getCurrencyLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.currency.loadingCurrency
);

export const currencyExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.currency.exceptionMessage
);

//Recently Damaged Assets Selectors
export const getDamagedAssetsEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.damagedAssets
);

export const {
  selectIds: getDamagedAssetId,
  selectEntities: getDamagedAssetsEntities,
  selectAll: getDamagedAssetsAll,
  selectTotal: getDamagedAssetsTotal
} : any = fromDamagedAssets.damagedAssetsAdapter.getSelectors(
  getDamagedAssetsEntitiesState
);

export const getDamagedAssetsLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.damagedAssets.loadingDamagedAssets
);

export const damagedAssetsExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.damagedAssets.exceptionMessage
);

export const getAssetDetailsByAssetIdFromRecentlyDamagedAssets: MemoizedSelectorWithProps<State, any, any> = createSelector(
  getAssetManagementState,
  (state, props) => {
    var filteredAssetsByAssetId = _.find(state.damagedAssets.entities, function (assets: Assets) {
      return assets.assetId.toUpperCase() == props.assetId.toUpperCase()
    });
    return filteredAssetsByAssetId;
  }
);

//Recently Assigned Assets Selectors
export const getAssignedAssetsEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assignedAssets
);

export const {
  selectIds: getAssignedAssetId,
  selectEntities: getAssignedAssetsEntities,
  selectAll: getAssignedAssetsAll,
  selectTotal: getAssignedAssetsTotal
} : any = fromAssignedAssets.assignedAssetsAdapter.getSelectors(
  getAssignedAssetsEntitiesState
);

export const getAssignedAssetsLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assignedAssets.loadingAssignedAssets
);

export const assignedAssetsExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assignedAssets.exceptionMessage
);

export const getAssetDetailsByAssetIdFromRecentlyAssignedAssets: MemoizedSelectorWithProps<State, any, any> = createSelector(
  getAssetManagementState,
  (state, props) => {
    var filteredAssetsByAssetId = _.find(state.assignedAssets.entities, function (assets: Assets) {
      return assets.assetId.toUpperCase() == props.assetId.toUpperCase()
    });
    return filteredAssetsByAssetId;
  }
);

//Assets Allocated To Me Selectors
export const getAssetsAssignedToMeEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assetsAssignedToMe
);

export const {
  selectIds: getAssetAllocatedToMeId,
  selectEntities: getAssetsAllocatedToMeEntities,
  selectAll: getAssetsAllocatedToMeAll,
  selectTotal: getAssetsAllocatedToMeTotal
} : any = fromAssetsAllocatedToMe.assetsAllocatedToMeAdapter.getSelectors(
  getAssetsAssignedToMeEntitiesState
);

export const getAssetsAllocatedToMeLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assetsAssignedToMe.loadingAssetsAllocatedToMe
);

export const assetsAllocatedToMeExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assetsAssignedToMe.exceptionMessage
);

export const getAssetDetailsByAssetIdFromAssetsAllocatedToMe: MemoizedSelectorWithProps<State, any, any> = createSelector(
  getAssetManagementState,
  (state, props) => {
    var filteredAssetsByAssetId = _.find(state.assetsAssignedToMe.entities, function (assets: Assets) {
      return assets.assetId.toUpperCase() == props.assetId.toUpperCase()
    });
    return filteredAssetsByAssetId;
  }
);

//Product Selectors
export const getProductEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.products
);

export const {
  selectIds: getProductIds,
  selectEntities: getProductsEntities,
  selectAll: getProductsAll,
  selectTotal: getProductTotal
} : any = fromProducts.productAdapter.getSelectors(
  getProductEntitiesState
);

export const getProductLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.products.loadingProducts
);

export const createProductLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.products.creatingProduct
);

export const createProductErrors: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.products.createProductErrors
);

export const productExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.products.exceptionMessage
);

//Product Details Selectors
export const getProductDetailsEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.productDetails
);

export const {
  selectIds: getProductDetailsIds,
  selectEntities: getProductDetailsEntities,
  selectAll: getProductDetailsAll,
  selectTotal: getProductDetailsTotal
} : any = fromProductDetails.productDetailsAdapter.getSelectors(
  getProductDetailsEntitiesState
);

export const getProductDetailsLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.productDetails.loadingProductDetails
);

export const createProductDetailsLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.productDetails.creatingProductDetails
);

export const createProductDetailsErrors: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.productDetails.createProductDetailsErrors
);

export const gettingProductDetailsIdLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.productDetails.gettingProductDetailsById
);

export const getEmployeeWorkExperienceDetailsById: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.productDetails.productDetailsData
);

export const getProductDetailsIdOfUpsertEducationDetails: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.productDetails.productDetailsId
);

export const getProductDetailsById: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.productDetails.productDetailsData
);

export const productDetailsExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.productDetails.exceptionMessage
);

//Asset Details Selectors
export const getAssetEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assets
);

export const {
  selectIds: getAssetIds,
  selectEntities: getAssetEntities,
  selectAll: getAssetsAll,
  selectTotal: getAssetsTotal
} : any = fromAssets.assetAdapter.getSelectors(
  getAssetEntitiesState
);

export const getAssetLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assets.loadingAssets
);

export const createAssetLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assets.creatingAsset
);

export const gettingAssetByIdLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assets.gettingAssetById
);

export const getAssetsByIdsLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState, state => state.assets.loadingAssets
)

export const createAssetErrors: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assets.createAssetsErrors
);

export const getAssetSearchResults: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assets.AssetsList
);

export const getAssetIdOfUpsertAsset: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assets.AssetId
);

export const getAssetById: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assets.Asset
);

export const getSelectedAssetId: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assets.selectedAssetId
);

export const getAssetsTotalCount: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assets.assetsTotalCount
);

export const getAssetDetailsByAssetIdFromGetAssetsAll: MemoizedSelectorWithProps<State, any, any> = createSelector(
  getAssetManagementState,
  (state, props) => {
    var filteredAssetsByAssetId = _.find(state.assets.entities, function (assets: Assets) {
      return assets.assetId.toUpperCase() == props.assetId.toUpperCase()
    });
    return filteredAssetsByAssetId;
  }
);

export const assetsExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assets.exceptionMessage
);

//Branch Selectors
export const getBranchEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.branches
);

export const {
  selectIds: getBranchId,
  selectEntities: getBranchEntities,
  selectAll: getBranchAll,
  selectTotal: getBranchTotal
} : any = fromBranches.branchAdapter.getSelectors(
  getBranchEntitiesState
);

export const getBranchLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.branches.loadingBranch
);

export const branchExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.branches.exceptionMessage
);

// Users Selectors
export const getUsersEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.users
);

export const {
  selectIds: getUsersIds,
  selectEntities: getUsersEntities,
  selectAll: getUsersAll,
  selectTotal: getUsersTotal
} : any = fromUsers.userAdapter.getSelectors(getUsersEntitiesState);

export const getUsersLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.users.loadingUsers
);

export const getLoggedUser: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.users.User
);

export const exceptionHandlingForUsers: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.users.exceptionMessage
);

//Assets Comments And History Selectors
export const getAssetsCommentsAndHistoryEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assetsCommentsAndHistory
);

export const {
  selectIds: getAssetsCommentsAndHistoryIds,
  selectEntities: getAssetsCommentsAndHistoryEntities,
  selectAll: getAssetsCommentsAndHistoryAll,
  selectTotal: getAssetsCommentsAndHistoryTotal
} : any = fromAssetsCommentsAndHistory.AssetsCommentsAndHistoryAdapter.getSelectors(
  getAssetsCommentsAndHistoryEntitiesState
);

export const getAssetsCommentsAndHistoryLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assetsCommentsAndHistory.loadingAssetsCommentsAndHistory
);

export const AssetsCommentsAndHistoryExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.assetsCommentsAndHistory.exceptionMessage
);