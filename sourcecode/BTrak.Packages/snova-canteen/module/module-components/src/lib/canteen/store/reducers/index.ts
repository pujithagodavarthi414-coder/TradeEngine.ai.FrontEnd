import { createSelector, createFeatureSelector, ActionReducerMap, MemoizedSelector } from "@ngrx/store";
import * as fromCanteenFoodItems from "./canteen-food-item.reducers";
import * as fromCanteenCredits from "./canteen-credit.reducers";
import * as fromCanteenPurchaseItems from "./canteen-purchase-item.reducers";
import * as fromCanteenBalance from "./canteen-balance.reducers";
import * as fromCurrency from "./currency.reducers";
import * as fromUsersDropDown from "./users.reducers"
import * as fromPurchaseFoodItems from "./canteen-purchase-food-item.reducers";
import * as fromBranches from "./branch.reducers"
import * as fromsoftLabels from "./soft-labels.reducers"
import * as fromSnackBar from "./snackbar.reducers";

import * as fromRoot from "../../../../store/reducers/index";

import { FoodItemModel } from '../../models/canteen-food-item-model';
import { CanteenCreditModel } from '../../models/canteen-credit-model';
import { CanteenPurchaseItemModel } from '../../models/canteen-purchase-item-model';
import { CanteenBalanceModel } from '../../models/canteen-balance-model';
import { Currency } from '../../models/currency';
import { Dictionary } from '@ngrx/entity';
import { UserDropDownModel } from '../../models/user-model';
import { Branch } from '../../models/branch';
import { SoftLabelConfigurationModel } from '../../models/softLabels-model';

export interface State extends fromRoot.State {
    canteen: canteenState;
}

export interface canteenState {
    canteenFoodItem: fromCanteenFoodItems.State;
    canteenCredit: fromCanteenCredits.State;
    canteenPurchaseItem: fromCanteenPurchaseItems.State;
    canteenBalance: fromCanteenBalance.State;
    purchaseFoodItems: fromPurchaseFoodItems.State;
    usersDropDown: fromUsersDropDown.State;
    currency: fromCurrency.State;
    branches: fromBranches.State;
    softLabels: fromsoftLabels.State;
    snackBar: fromSnackBar.State;
}

export const reducers: ActionReducerMap<canteenState> = {
    canteenFoodItem: fromCanteenFoodItems.reducer,
    canteenCredit: fromCanteenCredits.reducer,
    canteenPurchaseItem: fromCanteenPurchaseItems.reducer,
    canteenBalance: fromCanteenBalance.reducer,
    purchaseFoodItems: fromPurchaseFoodItems.reducer,
    usersDropDown: fromUsersDropDown.reducer,
    currency: fromCurrency.reducer,
    branches: fromBranches.reducer,
    softLabels: fromsoftLabels.reducer,
    snackBar: fromSnackBar.reducer
}
export const getCanteenState = createFeatureSelector<
    State,
    canteenState
>("canteen");

//Canteen Food Item Selectors
export const getCanteenFoodItemEntitiesState = createSelector(
    getCanteenState,
    state => state.canteenFoodItem
);

export const {
    selectIds: getCanteenFoodItemIds,
    selectEntities: getCanteenFoodItemEntities,
    selectAll: getCanteenFoodItemsAll,
    selectTotal: getCanteenFoodItemTotal
} = fromCanteenFoodItems.canteenFoodItemAdapter.getSelectors(
    getCanteenFoodItemEntitiesState
);

export const getCanteenFoodItemLoading = createSelector(
    getCanteenState,
    state => state.canteenFoodItem.loadingCanteenFoodItems
);

export const createCanteenFoodItemLoading = createSelector(
    getCanteenState,
    state => state.canteenFoodItem.creatingCanteenFoodItem
);

export const createCanteenFoodItemErrors = createSelector(
    getCanteenState,
    state => state.canteenFoodItem.createCanteenFoodItemErrors
);

export const canteenFoodItemExceptionHandling = createSelector(
    getCanteenState,
    state => state.canteenFoodItem.exceptionMessage
);

//Canteen Credit Selectors
export const getCanteenCreditEntitiesState = createSelector(
    getCanteenState,
    state => state.canteenCredit
);

export const {
    selectIds: getCanteenCreditIds,
    selectEntities: getCanteenCreditEntities,
    selectAll: getCanteenCreditsAll,
    selectTotal: getCanteenCreditTotal
} = fromCanteenCredits.canteenCreditAdapter.getSelectors(
    getCanteenCreditEntitiesState
);

export const getCanteenCreditLoading = createSelector(
    getCanteenState,
    state => state.canteenCredit.loadingCanteenCredits
);

export const createCanteenCreditLoading = createSelector(
    getCanteenState,
    state => state.canteenCredit.creatingCanteenCredit
);

export const createCanteenCreditErrors = createSelector(
    getCanteenState,
    state => state.canteenCredit.createCanteenCreditErrors
);

export const canteenCreditExceptionHandling = createSelector(
    getCanteenState,
    state => state.canteenCredit.exceptionMessage
);

//Canteen Purchase Item Selectors
export const getCanteenPurchaseEntitiesState = createSelector(
    getCanteenState,
    state => state.canteenPurchaseItem
);

export const {
    selectIds: getCanteenPurchaseItemIds,
    selectEntities: getCanteenPurchaseItemEntities,
    selectAll: getCanteenPurchaseItemsAll,
    selectTotal: getCanteenPurchaseItemTotal
} = fromCanteenPurchaseItems.canteenPurchaseItemAdapter.getSelectors(
    getCanteenPurchaseEntitiesState
);

export const getCanteenPurchaseItemLoading = createSelector(
    getCanteenState,
    state => state.canteenPurchaseItem.loadingCanteenPurchaseItems
);

export const getMyCanteenPurchasesLoading = createSelector(
    getCanteenState,
    state => state.canteenPurchaseItem.loadingMyCanteenPurchases
);

export const createCanteenPurchaseItemLoading = createSelector(
    getCanteenState,
    state => state.canteenPurchaseItem.creatingCanteenPurchaseItem
);

export const createCanteenPurchaseItemErrors = createSelector(
    getCanteenState,
    state => state.canteenPurchaseItem.createCanteenPurchaseItemErrors
);

export const myCanteenPurchasesList = createSelector(
    getCanteenState,
    state => state.canteenPurchaseItem.myCanteenPurchasesList
);

export const canteenPurchaseItemExceptionHandling = createSelector(
    getCanteenState,
    state => state.canteenPurchaseItem.exceptionMessage
);

//Canteen Balance Selectors
export const getCanteenBalanceEntitiesState = createSelector(
    getCanteenState,
    state => state.canteenBalance
);

export const {
    selectIds: getCanteenBalanceIds,
    selectEntities: getCanteenBalanceEntities,
    selectAll: getCanteenBalanceAll,
    selectTotal: getCanteenBalanceTotal
} = fromCanteenBalance.canteenBalanceAdapter.getSelectors(
    getCanteenBalanceEntitiesState
);

export const getCanteenBalanceLoading = createSelector(
    getCanteenState,
    state => state.canteenBalance.loadingCanteenBalance
);

export const canteenBalanceErrors = createSelector(
    getCanteenState,
    state => state.canteenBalance.canteenBalanceErrors
);

export const canteenBalanceExceptionHandling = createSelector(
    getCanteenState,
    state => state.canteenBalance.exceptionMessage
);

//Purchase Food Items Selectors
export const getPurchaseFoodItemsEntitiesState = createSelector(
    getCanteenState,
    state => state.purchaseFoodItems
  );
  
  export const {
    selectIds: getPurchaseFoodItemsIds,
    selectEntities: getPurchaseFoodItemsEntities,
    selectAll: getPurchaseFoodItemsAll,
    selectTotal: getPurchaseFoodItemsTotal
  } = fromPurchaseFoodItems.canteenPurchaseFoodItemAdapter.getSelectors(
    getPurchaseFoodItemsEntitiesState
  );
  
  export const getPurchaseFoodItemsLoading = createSelector(
    getCanteenState,
    state => state.purchaseFoodItems.loadingCanteenPurchaseFoodItems
  );
  
  export const purchaseFoodItemsExceptionHandling = createSelector(
    getCanteenState,
    state => state.purchaseFoodItems.exceptionMessage
  );
  
//User DropDown Selectors
export const getUserDropDownEntitiesState = createSelector(
    getCanteenState,
    state => state.usersDropDown
  );
  
  export const {
    selectIds: getUserDropDownIds,
    selectEntities: getUserDropDownEntities,
    selectAll: getUserDropDownAll,
    selectTotal: getUserDropDownTotal
  } = fromUsersDropDown.usersAdapter.getSelectors(
    getUserDropDownEntitiesState
  );
  
  export const getUserDropDownLoading = createSelector(
    getCanteenState,
    state => state.usersDropDown.loadingUsersList
  );
  
  export const userDropDownExceptionHandling = createSelector(
    getCanteenState,
    state => state.usersDropDown.exceptionMessage
  );

  //Currency Selectors
export const getCurrencyEntitiesState = createSelector(
    getCanteenState,
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
    getCanteenState,
    state => state.currency.loadingCurrency
  );
  
  export const currencyExceptionHandling = createSelector(
    getCanteenState,
    state => state.currency.exceptionMessage
  );

  //Branch Selectors
export const getBranchEntitiesState = createSelector(
    getCanteenState,
    state => state.branches
  );
  
  export const {
    selectIds: getBranchId,
    selectEntities: getBranchEntities,
    selectAll: getBranchAll,
    selectTotal: getBranchTotal
  } = fromBranches.branchAdapter.getSelectors(
    getBranchEntitiesState
  );
  
  export const getBranchLoading = createSelector(
    getCanteenState,
    state => state.branches.loadingBranch
  );
  
  export const branchExceptionHandling = createSelector(
    getCanteenState,
    state => state.branches.exceptionMessage
  );

  export const getSoftLabelsEntitiesState = createSelector(
    getCanteenState,
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
    getCanteenState,
    state => state.softLabels.upsertsoftLabel
  );
  
  export const loadingSearchSoftLabels = createSelector(
    getCanteenState,
    state => state.softLabels.loadingsoftLabels
  );
  