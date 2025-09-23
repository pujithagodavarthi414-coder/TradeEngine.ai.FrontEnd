import { Action } from '@ngrx/store';
import { SubscriptionPaidByOptionsModel } from '../../models/subscription-paid-by-options-model';


export enum SubscriptionPaidByOptionsListActionTypes {
    LoadSubscriptionPaidByOptionsTriggered = '[HR Widgets Subscription Paid By Options Component] Initial Data Load Triggered',
    LoadSubscriptionPaidByOptionsCompleted = '[HR Widgets Subscription Paid By Options Component] Initial Data Load Completed',
    LoadSubscriptionPaidByOptionsFailed= '[HR Widgets Subscription Paid By Options Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets Subscription Paid By Options Component] Handle Exception',
}

export class LoadSubscriptionPaidByOptionsTriggered implements Action {
    type = SubscriptionPaidByOptionsListActionTypes.LoadSubscriptionPaidByOptionsTriggered;
    SubscriptionPaidByOptionsList: SubscriptionPaidByOptionsModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public SubscriptionPaidByOptionsSearchResult: SubscriptionPaidByOptionsModel) { }
}

export class LoadSubscriptionPaidByOptionsCompleted implements Action {
    type = SubscriptionPaidByOptionsListActionTypes.LoadSubscriptionPaidByOptionsCompleted;
    SubscriptionPaidByOptionsSearchResult: SubscriptionPaidByOptionsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public SubscriptionPaidByOptionsList: SubscriptionPaidByOptionsModel[]) { }
}

export class LoadSubscriptionPaidByOptionsFailed implements Action {
    type = SubscriptionPaidByOptionsListActionTypes.LoadSubscriptionPaidByOptionsFailed;
    SubscriptionPaidByOptionsSearchResult: SubscriptionPaidByOptionsModel;
    SubscriptionPaidByOptionsList: SubscriptionPaidByOptionsModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = SubscriptionPaidByOptionsListActionTypes.ExceptionHandled;
    SubscriptionPaidByOptionsSearchResult: SubscriptionPaidByOptionsModel;
    SubscriptionPaidByOptionsList: SubscriptionPaidByOptionsModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type SubscriptionPaidByOptionsListActions = LoadSubscriptionPaidByOptionsTriggered
    | LoadSubscriptionPaidByOptionsCompleted
    | LoadSubscriptionPaidByOptionsFailed
    | ExceptionHandled