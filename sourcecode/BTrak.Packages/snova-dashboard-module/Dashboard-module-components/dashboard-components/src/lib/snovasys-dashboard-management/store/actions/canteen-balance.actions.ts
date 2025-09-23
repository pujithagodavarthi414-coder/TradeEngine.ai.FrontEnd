import { Action } from '@ngrx/store';
import { CanteenBalanceSearchInputModel } from '../../models/canteen-balance-search-input.model';
import { CanteenBalanceModel } from '../../models/canteen-balance.model';

export enum CanteenBalanceActionTypes {
    LoadCanteenBalanceTriggered = '[Dashboard Module Canteen Balance Component] Initial Data Load Triggered',
    LoadCanteenBalanceCompleted = '[Dashboard Module Canteen Balance Component] Initial Data Load Completed',
    LoadCanteenBalanceDetailsFailed = '[Dashboard Module Canteen Balance Component] Load Canteen Balance Details Failed',
    ExceptionHandled = '[Dashboard Module Canteen Balance Component] Handle Exception',
}

export class LoadCanteenBalanceTriggered implements Action {
    type = CanteenBalanceActionTypes.LoadCanteenBalanceTriggered;
    canteenBalanceList: CanteenBalanceModel[];
    validationMessages: any[];
    errorMessage: string
    constructor(public canteenBalanceSearchResult: CanteenBalanceSearchInputModel) { }
}

export class LoadCanteenBalanceCompleted implements Action {
    type = CanteenBalanceActionTypes.LoadCanteenBalanceCompleted;
    canteenBalanceSearchResult: CanteenBalanceSearchInputModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public canteenBalanceList: CanteenBalanceModel[]) { }
}

export class ExceptionHandled implements Action {
    type = CanteenBalanceActionTypes.ExceptionHandled;
    canteenBalanceSearchResult: CanteenBalanceSearchInputModel;
    canteenBalanceList: CanteenBalanceModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export class LoadCanteenBalanceDetailsFailed implements Action {
    type = CanteenBalanceActionTypes.LoadCanteenBalanceDetailsFailed;
    canteenBalanceSearchResult: CanteenBalanceSearchInputModel;
    canteenBalanceList: CanteenBalanceModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export type CanteenBalanceActions = LoadCanteenBalanceTriggered
    | LoadCanteenBalanceCompleted
    | LoadCanteenBalanceDetailsFailed
    | ExceptionHandled;
