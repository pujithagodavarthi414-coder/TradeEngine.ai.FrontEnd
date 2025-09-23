import { Action } from '@ngrx/store';
import { HiringStatusUpsertModel } from '../../models/hiringStatusUpsertModel';

export enum HiringStatusActionTypes {
    LoadHiringStatusItemsTriggered = '[Hiring Status Component] Initial Data Load Triggered',
    LoadHiringStatusItemsCompleted = '[Hiring Status Component] Initial Data Load Completed',
    LoadHiringStatusItemsDetailsFailed = '[Hiring Status Component] Initial Data Load Failed',
    HiringStatusExceptionHandled = '[Hiring Status Component] Handle Exception',
    CreateHiringStatusItemTriggered = '[Hiring Status Component] Create Hiring Status Triggered',
    CreateHiringStatusItemCompleted = '[Hiring Status Component] Create Hiring Status Completed',
    CreateHiringStatusItemFailed = '[Hiring Status Component] Create Hiring Status Failed',
}

export class LoadHiringStatusItemsTriggered implements Action {
    type = HiringStatusActionTypes.LoadHiringStatusItemsTriggered;
    hiringStatusUpsertModel: HiringStatusUpsertModel;
    hiringStatus: HiringStatusUpsertModel[];
    validationMessages: any[];
    errorMessage: string;
    hiringId: string;
    constructor(public hiringStatusSearch: HiringStatusUpsertModel) { }
}

export class LoadHiringStatusItemsCompleted implements Action {
    type = HiringStatusActionTypes.LoadHiringStatusItemsCompleted;
    hiringStatusSearch: HiringStatusUpsertModel;
    hiringStatusUpsertModel: HiringStatusUpsertModel;
    validationMessages: any[];
    errorMessage: string;
    hiringId: string;
    constructor(public hiringStatus: HiringStatusUpsertModel[]) { }
}

export class LoadHiringStatusItemsDetailsFailed implements Action {
    type = HiringStatusActionTypes.LoadHiringStatusItemsDetailsFailed;
    hiringStatusSearch: HiringStatusUpsertModel;
    hiringStatusUpsertModel: HiringStatusUpsertModel;
    hiringStatus: HiringStatusUpsertModel[];
    errorMessage: string;
    hiringId: string;
    constructor(public validationMessages: any[]) { }
}

export class HiringStatusExceptionHandled implements Action {
    type = HiringStatusActionTypes.HiringStatusExceptionHandled;
    hiringStatusSearch: HiringStatusUpsertModel;
    hiringStatusUpsertModel: HiringStatusUpsertModel;
    hiringStatus: HiringStatusUpsertModel[];
    validationMessages: any[];
    hiringId: string;
    constructor(public errorMessage: string) { }
}

export class CreateHiringStatusItemTriggered implements Action {
    type = HiringStatusActionTypes.CreateHiringStatusItemTriggered;
    hiringStatusSearch: HiringStatusUpsertModel;
    hiringStatus: HiringStatusUpsertModel[];
    validationMessages: any[];
    errorMessage: string;
    hiringId: string;
    constructor(public hiringStatusUpsertModel: HiringStatusUpsertModel) { }
}

export class CreateHiringStatusItemCompleted implements Action {
    type = HiringStatusActionTypes.CreateHiringStatusItemCompleted;
    hiringStatusUpsertModel: HiringStatusUpsertModel;
    hiringStatusSearch: HiringStatusUpsertModel;
    hiringStatus: HiringStatusUpsertModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public hiringId: string) { }
}

export class CreateHiringStatusItemFailed implements Action {
    type = HiringStatusActionTypes.CreateHiringStatusItemFailed;
    hiringStatusUpsertModel: HiringStatusUpsertModel;
    hiringStatusSearch: HiringStatusUpsertModel;
    hiringStatus: HiringStatusUpsertModel[];
    hiringId: string;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export type HiringStatusActions = LoadHiringStatusItemsTriggered
    | LoadHiringStatusItemsCompleted
    | LoadHiringStatusItemsDetailsFailed
    | HiringStatusExceptionHandled
    | CreateHiringStatusItemTriggered
    | CreateHiringStatusItemCompleted
    | CreateHiringStatusItemFailed;
