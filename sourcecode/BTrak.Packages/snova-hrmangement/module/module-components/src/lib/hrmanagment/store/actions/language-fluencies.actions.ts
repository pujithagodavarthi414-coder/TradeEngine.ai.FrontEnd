import { Action } from '@ngrx/store';
import { LanguageFluenciesSearchModel } from '../../models/language-fluencies-search-model';
import { LanguageFluenciesModel } from '../../models/language-fluencies-model';

export enum LanguageFluencyActionTypes {
    LoadLanguageFluencyTriggered = '[HR Widgets Language Fluency Component] Initial Data Load Triggered',
    LoadLanguageFluencyCompleted = '[HR Widgets Language Fluency Component] Initial Data Load Completed',
    LoadLanguageFluencyFailed = '[HR Widgets Language Fluency Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets  Fluency Component] Handle Exception',
}

export class LoadLanguageFluencyTriggered implements Action {
    type = LanguageFluencyActionTypes.LoadLanguageFluencyTriggered;
    languageFluencyList: LanguageFluenciesModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public languageFluencySearchResult: LanguageFluenciesSearchModel) { }
}

export class LoadLanguageFluencyCompleted implements Action {
    type = LanguageFluencyActionTypes.LoadLanguageFluencyCompleted;
    languageFluencySearchResult: LanguageFluenciesSearchModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public languageFluencyList: LanguageFluenciesModel[]) { }
}

export class LoadLanguageFluencyFailed implements Action {
    type = LanguageFluencyActionTypes.LoadLanguageFluencyFailed;
    languageFluencySearchResult: LanguageFluenciesSearchModel;
    languageFluencyList: LanguageFluenciesModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = LanguageFluencyActionTypes.ExceptionHandled;
    languageFluencySearchResult: LanguageFluenciesSearchModel;
    languageFluencyList: LanguageFluenciesModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type LanguageFluencyActions = LoadLanguageFluencyTriggered
    | LoadLanguageFluencyCompleted
    | LoadLanguageFluencyFailed
    | ExceptionHandled;