import { Action } from '@ngrx/store';

import { CanteenCreditModel } from '../../models/canteen-credit-model';
import { CanteenCreditSearchInputModel } from '../../models/canteen-credit-search-input-model';

export enum CanteenCreditActionTypes {
    LoadCanteenCreditsTriggered = '[Canteen Credit Component] Initial Data Load Triggered',
    LoadCanteenCreditsCompleted = '[Canteen Credit Component] Initial Data Load Completed',
    LoadCanteenCreditFailed = '[Canteen Credit Component] Intial Data Load Failed',
    CreateCanteenCreditTriggered = '[Canteen Credit Component] Create Canteen Credit Triggered',
    CreateCanteenCreditCompleted = '[Canteen Credit Component] Create Canteen Credit Completed',
    CreateCanteenCreditFailed = '[Canteen Credit Component] Create Canteen Credit Failed',
    ExceptionHandled = '[Canteen Credit Component] Handle Exception',
}

export class LoadCanteenCreditsTriggered implements Action {
    type = CanteenCreditActionTypes.LoadCanteenCreditsTriggered;
    canteenCreditsList: CanteenCreditModel[];
    canteenCredit: CanteenCreditModel;
    canteenCreditId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public canteenCreditSearchResult: CanteenCreditSearchInputModel) { }
}

export class LoadCanteenCreditsCompleted implements Action {
    type = CanteenCreditActionTypes.LoadCanteenCreditsCompleted;
    canteenCreditSearchResult: CanteenCreditSearchInputModel;
    canteenCredit: CanteenCreditModel;
    canteenCreditId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public canteenCreditsList: CanteenCreditModel[]) { }
}

export class LoadCanteenCreditFailed implements Action {
    type = CanteenCreditActionTypes.LoadCanteenCreditFailed;
    canteenCreditSearchResult: CanteenCreditSearchInputModel;
    canteenCredit: CanteenCreditModel;
    canteenCreditsList: CanteenCreditModel[];
    canteenCreditId: string;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateCanteenCreditTriggered implements Action {
    type = CanteenCreditActionTypes.CreateCanteenCreditTriggered;
    canteenCreditSearchResult: CanteenCreditSearchInputModel;
    canteenCreditsList: CanteenCreditModel[];
    canteenCreditId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public canteenCredit: CanteenCreditModel) { }
}

export class CreateCanteenCreditCompleted implements Action {
    type = CanteenCreditActionTypes.CreateCanteenCreditCompleted;
    canteenCreditSearchResult: CanteenCreditSearchInputModel;
    canteenCreditsList: CanteenCreditModel[];
    canteenCredit: CanteenCreditModel;
    validationMessages: string[];
    errorMessage: string;
    constructor(public canteenCreditId: string) { }
}

export class CreateCanteenCreditFailed implements Action {
    type = CanteenCreditActionTypes.CreateCanteenCreditFailed;
    canteenCreditSearchResult: CanteenCreditSearchInputModel;
    canteenCreditsList: CanteenCreditModel[];
    canteenCredit: CanteenCreditModel;
    canteenCreditId: string;
    errorMessage: string;
    constructor(public validationMessages: string[]) { }
}

export class ExceptionHandled implements Action {
    type = CanteenCreditActionTypes.ExceptionHandled;
    canteenCreditSearchResult: CanteenCreditSearchInputModel;
    canteenCreditsList: CanteenCreditModel[];
    canteenCredit: CanteenCreditModel;
    canteenCreditId: string;
    validationMessages: string[];
    constructor(public errorMessage: string) { }
}

export type CanteenCreditActions = LoadCanteenCreditsTriggered
    | LoadCanteenCreditsCompleted
    | LoadCanteenCreditFailed
    | CreateCanteenCreditTriggered
    | CreateCanteenCreditCompleted
    | CreateCanteenCreditFailed
    | ExceptionHandled;