import { Action } from '@ngrx/store';
import { Currency } from '../../models/currency';

export enum CurrencyActionTypes {
    LoadCurrencyTriggered = '[Asset Apps Currency Component] Initial Data Load Triggered',
    LoadCurrencyCompleted = '[Asset Apps Currency  Component] Initial Data Load Completed',
    LoadCurrencyFailed = '[Asset Apps Currency  Component] Initial Data Load Failed',
    CurrencyExceptionHandled = '[Asset Apps Currency Component] HandleException',
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

export class CurrencyExceptionHandled implements Action {
    type = CurrencyActionTypes.CurrencyExceptionHandled;
    currencyList: Currency[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type CurrencyActions = LoadCurrencyTriggered
    | LoadCurrencyCompleted
    | LoadCurrencyFailed
    | CurrencyExceptionHandled;