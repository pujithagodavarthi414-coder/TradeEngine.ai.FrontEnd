import { Action } from '@ngrx/store';
import { StatesModel } from '../../models/states';

export enum StatesListActionTypes {
    LoadStatesListItemsTriggered = '[HR Widgets States List Component] Initial Data Load Triggered',
    LoadStatesListItemsCompleted = '[HR Widgets States List Component] Initial Data Load Completed',
    LoadStatesListItemsFailed = '[HR Widgets States List Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets States List Component] Handle Exception',
}

export class LoadStatesListItemsTriggered implements Action {
    type = StatesListActionTypes.LoadStatesListItemsTriggered;
    statesList: StatesModel[];
    errorMessage: string;
    constructor(public statesSearchResult: StatesModel) { }
}

export class LoadStatesListItemsCompleted implements Action {
    type = StatesListActionTypes.LoadStatesListItemsCompleted;
    statesSearchResult: StatesModel;
    errorMessage: string;
    constructor(public statesList: StatesModel[]) { }
}

export class LoadStatesListItemsFailed implements Action {
    type = StatesListActionTypes.LoadStatesListItemsFailed;
    statesSearchResult: StatesModel;
    statesList: StatesModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = StatesListActionTypes.ExceptionHandled;
    statesSearchResult: StatesModel;
    statesList: StatesModel[];
    constructor(public errorMessage: string) { }
}

export type StatesListActions = LoadStatesListItemsTriggered
    | LoadStatesListItemsCompleted
    | LoadStatesListItemsFailed
    | ExceptionHandled