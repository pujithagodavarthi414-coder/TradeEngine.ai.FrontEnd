import { Action } from '@ngrx/store';

import { CanteenBalanceModel } from '../../models/canteen-balance-model';
import { CanteenBalanceSearchInputModel } from '../../models/canteen-balance-search-model';

export enum CanteenBalanceActionTypes {
    LoadCanteenBalanceTriggered = '[Canteen Balance Component] Initial Data Load Triggered',
    LoadCanteenBalanceCompleted = '[Canteen Balance Component] Initial Data Load Completed',
    LoadCanteenBalanceDetailsFailed = '[Canteen Balance Component] Load Canteen Balance Details Failed',
    ExceptionHandled = '[Canteen Balance Component] Handle Exception',
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