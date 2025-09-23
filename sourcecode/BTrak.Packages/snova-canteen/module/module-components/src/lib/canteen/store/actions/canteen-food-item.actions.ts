import { Action } from '@ngrx/store';

import { FoodItemModel } from '../../models/canteen-food-item-model';
import { FoodItemSearchInputModel } from '../../models/canteen-food-item-search-input-model';

export enum CanteenFoodItemActionTypes {
    LoadCanteenFoodItemsTriggered = '[Canteen Food Item Component] Initial Data Load Triggered',
    LoadCanteenFoodItemsCompleted = '[Canteen Food Item Component] Initial Data Load Completed',
    CreateCanteenFoodItemTriggered = '[Canteen Food Item Component] Create Canteen Food Item Triggered',
    CreateCanteenFoodItemCompleted = '[Canteen Food Item Component] Create Canteen Food Item Completed',
    CreateCanteenFoodItemFailed = '[Canteen Food Item Component] Create Canteen Food Item Failed',
    LoadCanteenFoodItemsFailed = '[Canteen Food Item Component] Load Canteen Food Items Failed',
    ExceptionHandled = '[Canteen Food Item Component] Handle Exception',
}

export class LoadCanteenFoodItemsTriggered implements Action {
    type = CanteenFoodItemActionTypes.LoadCanteenFoodItemsTriggered;
    foodItemsList: FoodItemModel[];
    foodItem: FoodItemModel;
    foodItemId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodItemSearchResult: FoodItemSearchInputModel) { }
}

export class LoadCanteenFoodItemsCompleted implements Action {
    type = CanteenFoodItemActionTypes.LoadCanteenFoodItemsCompleted;
    foodItemSearchResult: FoodItemSearchInputModel;
    foodItem: FoodItemModel;
    foodItemId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodItemsList: FoodItemModel[]) { }
}

export class CreateCanteenFoodItemTriggered implements Action {
    type = CanteenFoodItemActionTypes.CreateCanteenFoodItemTriggered;
    foodItemSearchResult: FoodItemSearchInputModel;
    foodItemsList: FoodItemModel[];
    foodItemId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodItem: FoodItemModel) { }
}

export class CreateCanteenFoodItemCompleted implements Action {
    type = CanteenFoodItemActionTypes.CreateCanteenFoodItemCompleted;
    foodItemSearchResult: FoodItemSearchInputModel;
    foodItemsList: FoodItemModel[];
    foodItem: FoodItemModel;
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodItemId: string) { }
}

export class CreateCanteenFoodItemFailed implements Action {
    type = CanteenFoodItemActionTypes.CreateCanteenFoodItemFailed;
    foodItemSearchResult: FoodItemSearchInputModel;
    foodItemsList: FoodItemModel[];
    foodItem: FoodItemModel;
    foodItemId: string;
    errorMessage: string;
    constructor(public validationMessages: string[]) { }
}

export class LoadCanteenFoodItemsFailed implements Action {
    type = CanteenFoodItemActionTypes.LoadCanteenFoodItemsFailed;
    foodItemSearchResult: FoodItemSearchInputModel;
    foodItemsList: FoodItemModel[];
    foodItem: FoodItemModel;
    foodItemId: string;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = CanteenFoodItemActionTypes.ExceptionHandled;
    foodItemSearchResult: FoodItemSearchInputModel;
    foodItemsList: FoodItemModel[];
    foodItem: FoodItemModel;
    foodItemId: string;
    validationMessages: string[];
    constructor(public errorMessage: string) { }
}

export type CanteenFoodItemActions = LoadCanteenFoodItemsTriggered
    | LoadCanteenFoodItemsCompleted
    | CreateCanteenFoodItemTriggered
    | CreateCanteenFoodItemCompleted
    | CreateCanteenFoodItemFailed
    | LoadCanteenFoodItemsFailed
    | ExceptionHandled;