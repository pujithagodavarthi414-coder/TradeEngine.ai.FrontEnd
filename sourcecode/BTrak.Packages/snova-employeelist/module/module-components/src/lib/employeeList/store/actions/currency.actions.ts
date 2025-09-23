import { Action } from '@ngrx/store';
import { Currency } from '../../models/currency';

export enum CurrencyActionTypes {
    LoadCurrencyTriggered = '[Employee List Currency Component] Initial Data Load Triggered',
    LoadCurrencyCompleted = '[Employee List Currency  Component] Initial Data Load Completed',
    LoadCurrencyFailed = '[Employee List Currency  Component] Initial Data Load Failed',
    ExceptionHandled = '[Employee List Currency Component] HandleException',
}

export class LoadCurrencyTriggered implements Action {
    type = CurrencyActionTypes.LoadCurrencyTriggered;
    currencyList: Currency[];
    errorMessage: string;
    validationMessages: any[];
    constructor() { }
}

export class LoadCurrencyCompleted implements Action {
    type = CurrencyActionTypes.LoadCurrencyCompleted;
    errorMessage: string;
    validationMessages: any[];
    constructor(public currencyList: Currency[]) { }
}

export class LoadCurrencyFailed implements Action {
    type = CurrencyActionTypes.LoadCurrencyFailed;
    errorMessage: string;
    currencyList: Currency[]
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = CurrencyActionTypes.ExceptionHandled;
    currencyList: Currency[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type CurrencyActions = LoadCurrencyTriggered
    | LoadCurrencyCompleted
    | LoadCurrencyFailed
    | ExceptionHandled;