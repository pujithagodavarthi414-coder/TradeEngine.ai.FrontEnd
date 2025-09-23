import { Action } from '@ngrx/store';
import { TimeZoneModel } from '../../models/time-zone';

export enum TimeZoneListActionTypes {
    LoadTimeZoneListItemsTriggered = '[HR Widgets TimeZone List Component] Initial Data Load Triggered',
    LoadTimeZoneListItemsCompleted = '[HR Widgets TimeZone List Component] Initial Data Load Completed',
    LoadTimeZoneListItemsFailed = '[HR Widgets TimeZone List Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets TimeZone List Component] Handle Exception',
}

export class LoadTimeZoneListItemsTriggered implements Action {
    type = TimeZoneListActionTypes.LoadTimeZoneListItemsTriggered;
    timeZoneList: TimeZoneModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public timeZoneListSearchResult: TimeZoneModel) { }
}

export class LoadTimeZoneListItemsCompleted implements Action {
    type = TimeZoneListActionTypes.LoadTimeZoneListItemsCompleted;
    timeZoneListSearchResult: TimeZoneModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public timeZoneList: TimeZoneModel[]) { }
}

export class LoadTimeZoneListItemsFailed implements Action {
    type = TimeZoneListActionTypes.LoadTimeZoneListItemsFailed;
    timeZoneListSearchResult: TimeZoneModel;
    timeZoneList: TimeZoneModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = TimeZoneListActionTypes.ExceptionHandled;
    timeZoneListSearchResult: TimeZoneModel;
    timeZoneList: TimeZoneModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type TimeZoneListActions = LoadTimeZoneListItemsTriggered
    | LoadTimeZoneListItemsCompleted
    | LoadTimeZoneListItemsFailed
    | ExceptionHandled