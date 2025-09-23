import { Action } from '@ngrx/store';
import { PaymentMethodModel } from '../../models/payment-method-model';

export enum PaymentMethodListActionTypes {
    LoadPaymentMethodTriggered = '[HR Widgets PaymentMethod Component] Initial Data Load Triggered',
    LoadPaymentMethodCompleted = '[HR Widgets PaymentMethod Component] Initial Data Load Completed',
    LoadPaymentMethodFailed= '[HR Widgets PaymentMethod Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets  Component] Handle Exception',
}

export class LoadPaymentMethodTriggered implements Action {
    type = PaymentMethodListActionTypes.LoadPaymentMethodTriggered;
    paymentMethodList: PaymentMethodModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public paymentMethodSearchResult: PaymentMethodModel) { }
}

export class LoadPaymentMethodCompleted implements Action {
    type = PaymentMethodListActionTypes.LoadPaymentMethodCompleted;
    paymentMethodSearchResult: PaymentMethodModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public paymentMethodList: PaymentMethodModel[]) { }
}

export class LoadPaymentMethodFailed implements Action {
    type = PaymentMethodListActionTypes.LoadPaymentMethodFailed;
    paymentMethodSearchResult: PaymentMethodModel;
    paymentMethodList: PaymentMethodModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = PaymentMethodListActionTypes.ExceptionHandled;
    paymentMethodSearchResult: PaymentMethodModel;
    paymentMethodList: PaymentMethodModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type PaymentMethodListActions = LoadPaymentMethodTriggered
    | LoadPaymentMethodCompleted
    | LoadPaymentMethodFailed
    | ExceptionHandled