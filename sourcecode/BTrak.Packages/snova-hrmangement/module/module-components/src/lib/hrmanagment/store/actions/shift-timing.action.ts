import { Action } from '@ngrx/store';
import { ShiftTimingModel } from '../../models/shift-timing-model';

export enum ShiftTimingListActionTypes {
    LoadShiftTimingListItemsTriggered = '[HR Widgets ShiftTiming List Component] Initial Data Load Triggered',
    LoadShiftTimingListItemsCompleted = '[HR Widgets  List Component] Initial Data Load Completed',
    LoadShiftTimingListItemsFailed = '[HR Widgets ShiftTiming List Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets ShiftTiming List Component] Handle Exception',
}

export class LoadShiftTimingListItemsTriggered implements Action {
    type = ShiftTimingListActionTypes.LoadShiftTimingListItemsTriggered;
    shiftTimingList: ShiftTimingModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public ShiftTimingListSearchResult: ShiftTimingModel) { }
}

export class LoadShiftTimingListItemsCompleted implements Action {
    type = ShiftTimingListActionTypes.LoadShiftTimingListItemsCompleted;
    shiftTimingListSearchResult: ShiftTimingModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public shiftTimingList: ShiftTimingModel[]) { }
}

export class LoadShiftTimingListItemsFailed implements Action {
    type = ShiftTimingListActionTypes.LoadShiftTimingListItemsFailed;
    shiftTimingListSearchResult: ShiftTimingModel;
    shiftTimingList: ShiftTimingModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = ShiftTimingListActionTypes.ExceptionHandled;
    shiftTimingListSearchResult: ShiftTimingModel;
    shiftTimingList: ShiftTimingModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type ShiftTimingListActions = LoadShiftTimingListItemsTriggered
    | LoadShiftTimingListItemsCompleted
    | LoadShiftTimingListItemsFailed
    | ExceptionHandled