import { Action } from '@ngrx/store';

import { FoodOrderModel, FoodOrderManagementApiInput } from '../../models/all-food-orders';

export enum FoodOrderStatusActionTypes {
    LoadFoodOrderStatusTriggered = '[Food Order Status Component] Initial Data Load Triggered',
    LoadFoodOrderStatusCompleted = '[Food Order Status Component] Initial Data Load Completed',
    ExceptionHandled = '[Food Order Status Component] Handle Exception',
}

export class LoadFoodOrderStatusTriggered implements Action {
    type = FoodOrderStatusActionTypes.LoadFoodOrderStatusTriggered;
    foodOrderList: FoodOrderModel[];
    foodOrderDetails: FoodOrderModel;
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodOrderSearchResult: FoodOrderManagementApiInput) { }
}

export class LoadFoodOrderStatusCompleted implements Action {
    type = FoodOrderStatusActionTypes.LoadFoodOrderStatusCompleted;
    foodOrderSearchResult: FoodOrderManagementApiInput;
    foodOrderDetails: FoodOrderModel;
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodOrderList: FoodOrderModel[]) { }
}

export class ExceptionHandled implements Action {
    type = FoodOrderStatusActionTypes.ExceptionHandled;
    foodOrderSearchResult: FoodOrderManagementApiInput;
    foodOrderList: FoodOrderModel[];
    foodOrderDetails: FoodOrderModel;
    validationMessages: string[];
    constructor(public errorMessage: string) { }
}

export type FoodOrderStatusActions = LoadFoodOrderStatusTriggered
    | LoadFoodOrderStatusCompleted
    | ExceptionHandled