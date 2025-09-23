import { Action } from '@ngrx/store';
import { PayFrequencyModel } from '../../models/pay-frequency-model';

export enum PayFrequencyListActionTypes {
    LoadPayFrequencyTriggered = '[HR Widgets PayFrequency Component] Initial Data Load Triggered',
    LoadPayFrequencyCompleted = '[HR Widgets PayFrequency Component] Initial Data Load Completed',
    LoadPayFrequencyFailed= '[HR Widgets PayFrequency Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets  Component] Handle Exception',
}

export class LoadPayFrequencyTriggered implements Action {
    type = PayFrequencyListActionTypes.LoadPayFrequencyTriggered;
    payFrequencyList: PayFrequencyModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public payFrequencySearchResult: PayFrequencyModel) { }
}

export class LoadPayFrequencyCompleted implements Action {
    type = PayFrequencyListActionTypes.LoadPayFrequencyCompleted;
    payFrequencySearchResult: PayFrequencyModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public payFrequencyList: PayFrequencyModel[]) { }
}

export class LoadPayFrequencyFailed implements Action {
    type = PayFrequencyListActionTypes.LoadPayFrequencyFailed;
    payFrequencySearchResult: PayFrequencyModel;
    payFrequencyList: PayFrequencyModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = PayFrequencyListActionTypes.ExceptionHandled;
    payFrequencySearchResult: PayFrequencyModel;
    payFrequencyList: PayFrequencyModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type PayFrequencyListActions = LoadPayFrequencyTriggered
    | LoadPayFrequencyCompleted
    | LoadPayFrequencyFailed
    | ExceptionHandled