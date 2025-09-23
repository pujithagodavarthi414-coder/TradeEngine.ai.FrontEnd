import { Action } from '@ngrx/store';

import { FoodOrderModel, FoodOrderManagementApiInput, ChangeFoodOrderStatusInputModel } from '../../models/all-food-orders';

export enum FoodOrderActionTypes {
    LoadFoodOrdersTriggered = '[Food Order Component] Initial Data Load Triggered',
    LoadFoodOrdersCompleted = '[Food Order Component] Initial Data Load Completed',
    CreateFoodOrderTriggered = '[Food Order Component] Create Food Order Triggered',
    CreateFoodOrderCompleted = '[Food Order Component] Create Food Order Completed',
    ChangeFoodOrderStatusTriggred='[Food Order Component] Change Food Order Status Triggred',
    ChangeFoodOrderStatusCompleted='[Food Order Component] Change Food Order Status Completed',
    ChangeFoodOrderStatusFailed = '[Food Order Component] Change Food Order Status Failed',
    CreateFoodOrderFailed = '[Food Order Component] Create Food Order Failed',
    ExceptionHandled = '[Food Order Component] Handle Exception',
}

export class LoadFoodOrdersTriggered implements Action {
    type = FoodOrderActionTypes.LoadFoodOrdersTriggered;
    foodOrderList: FoodOrderModel[];
    foodOrderDetails: FoodOrderModel;
    foodOrderId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodOrderSearchResult: FoodOrderManagementApiInput) { }
}

export class LoadFoodOrdersCompleted implements Action {
    type = FoodOrderActionTypes.LoadFoodOrdersCompleted;
    foodOrderSearchResult: FoodOrderManagementApiInput;
    foodOrderDetails: FoodOrderModel;
    foodOrderId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodOrderList: FoodOrderModel[]) { }
}

export class CreateFoodOrderTriggered implements Action {
    type = FoodOrderActionTypes.CreateFoodOrderTriggered;
    foodOrderSearchResult: FoodOrderManagementApiInput;
    foodOrderList: FoodOrderModel[];
    foodOrderId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodOrderDetails: FoodOrderModel) { }
}

export class CreateFoodOrderCompleted implements Action {
    type = FoodOrderActionTypes.CreateFoodOrderCompleted;
    foodOrderSearchResult: FoodOrderManagementApiInput;
    foodOrderList: FoodOrderModel[];
    foodOrderDetails: FoodOrderModel;
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodOrderId: string) { }
}

export class ChangeFoodOrderStatusTriggred implements Action {
    type = FoodOrderActionTypes.ChangeFoodOrderStatusTriggred;
    foodOrderList: FoodOrderModel[];
    foodOrderStatusDetails: ChangeFoodOrderStatusInputModel;
    foodOrderId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodOrderStatusModel: ChangeFoodOrderStatusInputModel) { }
}

export class ChangeFoodOrderStatusCompleted implements Action {
    type = FoodOrderActionTypes.ChangeFoodOrderStatusCompleted;
    foodOrderList: FoodOrderModel[];
    foodOrderDetails: FoodOrderModel;
    foodOrderId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public foodOrderStatusModel: ChangeFoodOrderStatusInputModel) { }
}

export class CreateFoodOrderFailed implements Action {
    type = FoodOrderActionTypes.CreateFoodOrderFailed;
    foodOrderSearchResult: FoodOrderManagementApiInput;
    foodOrderList: FoodOrderModel[];
    foodOrderDetails: FoodOrderModel;
    foodOrderId: string;
    errorMessage: string;
    constructor(public validationMessages: string[]) { }
}

export class ChangeFoodOrderStatusFailed implements Action {
    type = FoodOrderActionTypes.CreateFoodOrderFailed;
    foodOrderSearchResult: FoodOrderManagementApiInput;
    foodOrderList: FoodOrderModel[];
    foodOrderDetails: ChangeFoodOrderStatusInputModel;
    foodOrderId: string;
    errorMessage: string;
    constructor(public validationMessages: string[]) { }
}

export class ExceptionHandled implements Action {
    type = FoodOrderActionTypes.ExceptionHandled;
    foodOrderSearchResult: FoodOrderManagementApiInput;
    foodOrderList: FoodOrderModel[];
    foodOrderDetails: FoodOrderModel;
    foodOrderId: string;
    validationMessages: string[];
    constructor(public errorMessage: string) { }
}

export type FoodOrderActions = LoadFoodOrdersTriggered
    | LoadFoodOrdersCompleted
    | CreateFoodOrderTriggered
    | CreateFoodOrderCompleted
    | CreateFoodOrderFailed
    | ChangeFoodOrderStatusTriggred
    | ChangeFoodOrderStatusCompleted
    | ExceptionHandled;