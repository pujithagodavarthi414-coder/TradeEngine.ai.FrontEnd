import { Action } from '@ngrx/store';

import { MaritalStatusesSearchModel } from '../../models/marital-statuses-search-model';
import { MaritalStatusesModel } from '../../models/marital-statuses-model';

export enum MaritalStatusesActionTypes {
    LoadMaritalStatusesTriggered = '[HR Widgets Marital Statuses Component] Initial Data Load Triggered',
    LoadMaritalStatusesCompleted = '[HR Widgets Marital Statuses Component] Initial Data Load Completed',
    LoadMaritalStatusesFailed = '[HR Widgets Marital Statuses Component] Initial Data Load Failed',
    MaritalExceptionHandled = '[HR Widgets Marital Statuses Component] Handle Exception',
}

export class LoadMaritalStatusesTriggered implements Action {
    type = MaritalStatusesActionTypes.LoadMaritalStatusesTriggered;
    maritalStatusesList: MaritalStatusesModel[];
    validationMessages: string[];
    errorMessage: string;
    constructor(public maritalStatusesSearchResult: MaritalStatusesSearchModel) { }
}

export class LoadMaritalStatusesCompleted implements Action {
    type = MaritalStatusesActionTypes.LoadMaritalStatusesCompleted;
    maritalStatusesSearchResult: MaritalStatusesSearchModel;
    validationMessages: string[];
    errorMessage: string;
    constructor(public maritalStatusesList: MaritalStatusesModel[]) { }
}

export class LoadMaritalStatusesFailed implements Action {
    type = MaritalStatusesActionTypes.LoadMaritalStatusesFailed;
    maritalStatusesSearchResult: MaritalStatusesSearchModel;
    maritalStatusesList: MaritalStatusesModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class MaritalExceptionHandled implements Action {
    type = MaritalStatusesActionTypes.MaritalExceptionHandled;
    maritalStatusesSearchResult: MaritalStatusesSearchModel;
    maritalStatusesList: MaritalStatusesModel[];
    validationMessages: string[];
    constructor(public errorMessage: string) { }
}

export type MaritalStatusesActions = LoadMaritalStatusesTriggered
    | LoadMaritalStatusesCompleted
    | LoadMaritalStatusesFailed
    | MaritalExceptionHandled;