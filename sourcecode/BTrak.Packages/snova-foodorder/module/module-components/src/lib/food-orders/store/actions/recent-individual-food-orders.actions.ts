import { Action } from '@ngrx/store';

import { FoodOrderManagementApiInput, FoodOrderModel } from '../../models/all-food-orders';

export enum RecentIndividualFoodOrdersActionTypes {
    LoadRecentIndividualFoodOrdersTriggered = '[Food Order Recent Individual Food Orders Component] Initial Data Load Triggered',
    LoadRecentIndividualFoodOrdersCompleted = '[Food Order Recent Individual Food Orders Component] Initial Data Load Completed',
    ExceptionHandled = '[Food Order Recent Individual Food Orders Component] Handle Exception',
}

export class LoadRecentIndividualFoodOrdersTriggered implements Action {
    type = RecentIndividualFoodOrdersActionTypes.LoadRecentIndividualFoodOrdersTriggered;
    recentIndividualFoodOrdersList: FoodOrderModel[];
    errorMessage: string;
    constructor(public recentIndividualFoodOrdersSearchResult: FoodOrderManagementApiInput) { }
}

export class LoadRecentIndividualFoodOrdersCompleted implements Action {
    type = RecentIndividualFoodOrdersActionTypes.LoadRecentIndividualFoodOrdersCompleted;
    recentIndividualFoodOrdersSearchResult: FoodOrderManagementApiInput;
    errorMessage: string;
    constructor(public recentIndividualFoodOrdersList: FoodOrderModel[]) { }
}

export class ExceptionHandled implements Action {
    type = RecentIndividualFoodOrdersActionTypes.ExceptionHandled;
    recentIndividualFoodOrdersSearchResult: FoodOrderManagementApiInput;
    recentIndividualFoodOrdersList: FoodOrderModel[];
    constructor(public errorMessage: string) { }
}

export type RecentIndividualFoodOrdersActions = LoadRecentIndividualFoodOrdersTriggered
    | LoadRecentIndividualFoodOrdersCompleted
    | ExceptionHandled;