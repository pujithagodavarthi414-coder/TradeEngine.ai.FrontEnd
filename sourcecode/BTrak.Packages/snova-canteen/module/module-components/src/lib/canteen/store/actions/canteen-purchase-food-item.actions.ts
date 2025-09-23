import { Action } from '@ngrx/store';
import { FoodItemModel } from '../../models/canteen-food-item-model';
import { FoodItemSearchInputModel } from '../../models/canteen-food-item-search-input-model';

export enum CanteenPurchaseFoodItemActionTypes {
    LoadCanteenPurchaseFoodItemsTriggered = '[Canteen Purchase Food Item Component] Initial Data Load Triggered',
    LoadCanteenPurchaseFoodItemsCompleted = '[Canteen Purchase Food Item Component] Initial Data Load Completed',
    LoadCanteenPurchaseFoodItemFailed = '[Canteen Purchase Food Item Component] Initial Data Load Failed',
    ExceptionHandled = '[Canteen Purchase Food Item Component] Handle Exception',
}

export class LoadCanteenPurchaseFoodItemsTriggered implements Action {
    type = CanteenPurchaseFoodItemActionTypes.LoadCanteenPurchaseFoodItemsTriggered;
    foodPurchaseItemsList: FoodItemModel[];
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodItemSearchResult: FoodItemSearchInputModel) { }
}

export class LoadCanteenPurchaseFoodItemsCompleted implements Action {
    type = CanteenPurchaseFoodItemActionTypes.LoadCanteenPurchaseFoodItemsCompleted;
    foodItemSearchResult: FoodItemSearchInputModel;
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodPurchaseItemsList: FoodItemModel[]) { }
}

export class LoadCanteenPurchaseFoodItemFailed implements Action {
    type = CanteenPurchaseFoodItemActionTypes.LoadCanteenPurchaseFoodItemFailed;
    foodItemSearchResult: FoodItemSearchInputModel;
    foodPurchaseItemsList: FoodItemModel[];
    errorMessage: string;
    constructor(public validationMessages: string[]) { }
}

export class ExceptionHandled implements Action {
    type = CanteenPurchaseFoodItemActionTypes.ExceptionHandled;
    foodItemSearchResult: FoodItemSearchInputModel;
    foodPurchaseItemsList: FoodItemModel[];
    validationMessages: string[];
    constructor(public errorMessage: string) { }
}

export type CanteenPurchaseFoodItemActions = LoadCanteenPurchaseFoodItemsTriggered
    | LoadCanteenPurchaseFoodItemsCompleted
    | LoadCanteenPurchaseFoodItemFailed
    | ExceptionHandled;