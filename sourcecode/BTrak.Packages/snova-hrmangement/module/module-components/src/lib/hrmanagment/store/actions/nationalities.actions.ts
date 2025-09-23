import { Action } from '@ngrx/store';
import { NationalitiesSearchModel } from '../../models/nationalities-search-model';
import { NationalityModel } from '../../models/nationality-model';

export enum NationalitiesActionTypes {
    LoadNationalitiesTriggered = '[HR Widgets  Component] Initial Data Load Triggered',
    LoadNationalitiesCompleted = '[HR Widgets Nationalities Component] Initial Data Load Completed',
    LoadNationalitiesFailed = '[HR Widgets Nationalities Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets Nationalities Component] Handle Exception',
}

export class LoadNationalitiesTriggered implements Action {
    type = NationalitiesActionTypes.LoadNationalitiesTriggered;
    nationalitiesList: NationalityModel[];
    validationMessages: string[];
    errorMessage: string;
    constructor(public nationalitiesSearchResult: NationalitiesSearchModel) { }
}

export class LoadNationalitiesCompleted implements Action {
    type = NationalitiesActionTypes.LoadNationalitiesCompleted;
    nationalitiesSearchResult: NationalitiesSearchModel;
    validationMessages: string[];
    errorMessage: string;
    constructor(public nationalitiesList: NationalityModel[]) { }
}

export class LoadNationalitiesFailed implements Action {
    type = NationalitiesActionTypes.LoadNationalitiesFailed;
    nationalitiesSearchResult: NationalitiesSearchModel;
    nationalitiesList: NationalityModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = NationalitiesActionTypes.ExceptionHandled;
    nationalitiesSearchResult: NationalitiesSearchModel;
    nationalitiesList: NationalityModel[];
    validationMessages: string[];
    constructor(public errorMessage: string) { }
}

export type NationalitiesActions = LoadNationalitiesTriggered
    | LoadNationalitiesCompleted
    | LoadNationalitiesFailed
    | ExceptionHandled;