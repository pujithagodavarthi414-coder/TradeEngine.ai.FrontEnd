import { Action } from '@ngrx/store';
import { LanguagesModel } from '../../models/languages-model';
import { LanguagesSearchModel } from '../../models/languages-search-model';


export enum LanguagesActionTypes {
    LoadLanguagesTriggered = '[HR Widgets Languages Component] Initial Data Load Triggered',
    LoadLanguagesCompleted = '[HR Widgets Languages Component] Initial Data Load Completed',
    LoadLanguagesFailed = '[HR Widgets Languages Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets Languages Component] Handle Exception',
}

export class LoadLanguagesTriggered implements Action {
    type = LanguagesActionTypes.LoadLanguagesTriggered;
    languagesList: LanguagesModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public languagesSearchResult: LanguagesSearchModel) { }
}

export class LoadLanguagesCompleted implements Action {
    type = LanguagesActionTypes.LoadLanguagesCompleted;
    languagesSearchResult: LanguagesSearchModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public languagesList: LanguagesModel[]) { }
}

export class LoadLanguagesFailed implements Action {
    type = LanguagesActionTypes.LoadLanguagesFailed;
    languagesSearchResult: LanguagesSearchModel;
    languagesList: LanguagesModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = LanguagesActionTypes.ExceptionHandled;
    languagesSearchResult: LanguagesSearchModel;
    languagesList: LanguagesModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type LanguagesActions = LoadLanguagesTriggered
    | LoadLanguagesCompleted
    | LoadLanguagesFailed
    | ExceptionHandled;