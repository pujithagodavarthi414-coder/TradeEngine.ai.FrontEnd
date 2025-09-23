import * as fromRoot from "../../../../store/reducers/index";
import { ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import * as fromFoodOrderStatus from "./food-order-status.reducers";
import * as fromFoodOrder from "./food-order.reducers";
import * as fromRecentIndividualFoodOrders from "./recent-individual-food-orders.reducers";
import * as fromStoreConfiguration from "./store-configurations.reducers";
import * as fromCurrency from "./currency.reducers";
import * as fromsoftLabels from "./soft-labels.reducers"
import * as fromSnackBar from "./snackbar.reducers";

import { Dictionary } from '@ngrx/entity';
import { FoodOrderModel } from '../../models/all-food-orders';
import { FileInputModel } from '../../models/file-input-model';
import { FileResultModel } from '../../models/fileResultModel';
import { StoreConfigurationModel } from '../../models/store-configuration-model';
import { Currency } from '../../models/currency';
import { SoftLabelConfigurationModel } from '../../models/softLabels-model';

export interface State extends fromRoot.State {
    foodOrders: FoodOrdersState;
}
export interface FoodOrdersState {
    foodOrder: fromFoodOrder.State;
    recentFoodOrder: fromRecentIndividualFoodOrders.State;
    foodOrderStatus: fromFoodOrderStatus.State;
    storeConfiguration: fromStoreConfiguration.State;
    currency: fromCurrency.State;
    softLabels: fromsoftLabels.State;
    snackBar: fromSnackBar.State;
}

export const reducers: ActionReducerMap<FoodOrdersState> = {
    foodOrder: fromFoodOrder.reducer,
    recentFoodOrder: fromRecentIndividualFoodOrders.reducer,
    foodOrderStatus: fromFoodOrderStatus.reducer,
    storeConfiguration: fromStoreConfiguration.reducer,
    currency: fromCurrency.reducer,
    softLabels: fromsoftLabels.reducer,
    snackBar: fromSnackBar.reducer
}

export const getFoodOrdersState = createFeatureSelector<
    State,
    FoodOrdersState
>("foodOrders");

//Food Order Selectors
export const getFoodOrderEntitiesState = createSelector(
    getFoodOrdersState,
    state => state.foodOrder
);

export const {
    selectIds: getFoodOrderIds,
    selectEntities: getFoodOrderEntities,
    selectAll: getFoodOrderAll,
    selectTotal: getFoodOrderTotal
} = fromFoodOrder.foodOrderAdapter.getSelectors(
    getFoodOrderEntitiesState
);

export const getFoodOrderLoading = createSelector(
    getFoodOrdersState,
    state => state.foodOrder.loadingFoodOrders
);

export const createFoodOrderLoading = createSelector(
    getFoodOrdersState,
    state => state.foodOrder.creatingFoodOrder
);

// export const fileUploading = createSelector(
//   getHRManagementState,
//   state => state.fileUpload.isFileUploading
// );

export const createFoodOrderErrors = createSelector(
    getFoodOrdersState,
    state => state.foodOrder.createFoodOrderErrors
);

export const foodOrderExceptionHandling = createSelector(
    getFoodOrdersState,
    state => state.foodOrder.exceptionMessage
);

export const getUpsertedFoodOrderId = createSelector(
    getFoodOrdersState,
    state => state.foodOrder.foodOrderId
);

//Food Order status Selectors
export const getFoodOrderStatusEntitiesState = createSelector(
    getFoodOrdersState,
    state => state.foodOrderStatus
);

export const {
    selectIds: getFoodOrderStatusIds,
    selectEntities: getFoodOrderStatusEntities,
    selectAll: getFoodOrderStatusAll,
    selectTotal: getFoodOrderStatusTotal
} = fromFoodOrderStatus.foodOrderStatusAdapter.getSelectors(
    getFoodOrderStatusEntitiesState
);

export const getFoodOrderStatusLoading = createSelector(
    getFoodOrdersState,
    state => state.foodOrderStatus.loadingFoodOrderStatus
);

export const foodOrderStatusExceptionHandling = createSelector(
    getFoodOrdersState,
    state => state.foodOrderStatus.exceptionMessage
);

//Recent Individual Food Order Selectors
export const getRecentIndividualFoodOrderEntitiesState = createSelector(
    getFoodOrdersState,
    state => state.recentFoodOrder
);

export const {
    selectIds: getRecentIndividualFoodOrderIds,
    selectEntities: getRecentIndividualFoodOrderEntities,
    selectAll: getRecentIndividualFoodOrderAll,
    selectTotal: getRecentIndividualFoodOrderTotal
} = fromFoodOrder.foodOrderAdapter.getSelectors(
    getRecentIndividualFoodOrderEntitiesState
);

export const getRecentIndividualFoodOrderLoading = createSelector(
    getFoodOrdersState,
    state => state.recentFoodOrder.loadingRecentIndividualFoodOrders
);

export const recentIndividualFoodOrderExceptionHandling = createSelector(
    getFoodOrdersState,
    state => state.recentFoodOrder.exceptionMessage
);

//Store Configuration Selectors
export const getStoreConfigurationEntitiesState = createSelector(
    getFoodOrdersState,
    state => state.storeConfiguration
);

export const {
    selectIds: getStoreConfigurationIds,
    selectEntities: getStoreConfigurationEntities,
    selectAll: getStoreConfigurationAll,
    selectTotal: getStoreConfigurationTotal
} = fromStoreConfiguration.storeConfigurationAdapter.getSelectors(
    getStoreConfigurationEntitiesState
);

export const getStoreConfigurationLoading = createSelector(
    getFoodOrdersState,
    state => state.storeConfiguration.loadingStoreConfiguration
);

//Currency Selectors
export const getCurrencyEntitiesState = createSelector(
    getFoodOrdersState,
    state => state.currency
  );
  
  export const {
    selectIds: getCurrencyId,
    selectEntities: getCurrencyEntities,
    selectAll: getCurrencyAll,
    selectTotal: getCurrencyTotal
  } = fromCurrency.currencyAdapter.getSelectors(
    getCurrencyEntitiesState
  );
  
  export const getCurrencyLoading = createSelector(
    getFoodOrdersState,
    state => state.currency.loadingCurrency
  );
  
  export const currencyExceptionHandling = createSelector(
    getFoodOrdersState,
    state => state.currency.exceptionMessage
  );


  export const getSoftLabelsEntitiesState = createSelector(
    getFoodOrdersState,
    state => state.softLabels
  );
  
  
  export const {
    selectIds: getSoftLabelsIds,
    selectEntities: getSoftLabelsEntities,
    selectAll: getSoftLabelsAll,
    selectTotal: getSoftLabelsTotal
  } = fromsoftLabels.softLabelAdapter.getSelectors(
    getSoftLabelsEntitiesState
  );
  
  export const createSoftLabelsLoading = createSelector(
    getFoodOrdersState,
    state => state.softLabels.upsertsoftLabel
  );
  
  export const loadingSearchSoftLabels = createSelector(
    getFoodOrdersState,
    state => state.softLabels.loadingsoftLabels
  );