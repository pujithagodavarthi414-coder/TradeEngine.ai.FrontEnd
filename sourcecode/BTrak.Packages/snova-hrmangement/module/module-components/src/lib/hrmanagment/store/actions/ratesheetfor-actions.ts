
import { Update } from "@ngrx/entity";
import { Action } from "@ngrx/store";
import { RateSheetForModel } from '../../models/ratesheet-for-model';

export enum RateSheetForDetailsActionTypes {
    GetRateSheetForTriggered = '[HR Widgets Rate Sheet For Details Component] Initial Data Load Triggered',
    GetRateSheetForCompleted = '[HR Widgets  Sheet For Details Component] Initial Data Load Completed',
    GetRateSheetForFailed = '[HR Widgets Rate Sheet For Details Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets Rate Sheet For Details Component] Handle Exception',
}

export class GetRateSheetForTriggered implements Action {
    type = RateSheetForDetailsActionTypes.GetRateSheetForTriggered;
    validationMessages: any[];
    errorMessage: string;
    rateSheetForID: string;
    rateSheetFor: RateSheetForModel;
    rateSheetForDetails: RateSheetForModel[];
    rateSheetForUpdates: { rateSheetForUpdate: Update<RateSheetForModel> };
    constructor(public rateSheetForDetailsSearchResult: RateSheetForModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetRateSheetForCompleted implements Action {
    type = RateSheetForDetailsActionTypes.GetRateSheetForCompleted;
    validationMessages: any[];
    errorMessage: string;
    rateSheetForID: string;
    rateSheetFor: RateSheetForModel;
    rateSheetForDetailsSearchResult: RateSheetForModel;
    rateSheetForUpdates: { rateSheetForUpdate: Update<RateSheetForModel> };
    constructor(public rateSheetForDetails: RateSheetForModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetRateSheetForFailed implements Action {
    type = RateSheetForDetailsActionTypes.GetRateSheetForFailed;
    errorMessage: string;
    rateSheetForID: string;
    rateSheetFor: RateSheetForModel;
    rateSheetForDetails: RateSheetForModel[];
    rateSheetForDetailsSearchResult: RateSheetForModel;
    rateSheetForUpdates: { rateSheetForUpdate: Update<RateSheetForModel> };
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
    type = RateSheetForDetailsActionTypes.ExceptionHandled;
    validationMessages: any[];
    rateSheetForID: string;
    rateSheetFor: RateSheetForModel;
    rateSheetForDetails: RateSheetForModel[];
    rateSheetForDetailsSearchResult: RateSheetForModel;
    rateSheetForUpdates: { rateSheetForUpdate: Update<RateSheetForModel> };
    constructor(public errorMessage: string) { }
}

export type RateSheetForDetailsActions = GetRateSheetForTriggered
    | GetRateSheetForCompleted
    | GetRateSheetForFailed
