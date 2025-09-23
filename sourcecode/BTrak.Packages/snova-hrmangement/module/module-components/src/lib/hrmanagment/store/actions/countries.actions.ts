import { Action } from '@ngrx/store';
import { CountryModel } from '../../models/countries-model';

export enum CountryListActionTypes {
    LoadCountryListItemsTriggered = '[HR Widgets Country List Component] Initial Data Load Triggered',
    LoadCountryListItemsCompleted = '[HR Widgets Country List Component] Initial Data Load Completed',
    LoadCountryListItemsFailed = '[HR Widgets Country List Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets Country List Component] Handle Exception',
}

export class LoadCountryListItemsTriggered implements Action {
    type = CountryListActionTypes.LoadCountryListItemsTriggered;
    countryList: CountryModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public countryListSearchResult: CountryModel) { }
}

export class LoadCountryListItemsCompleted implements Action {
    type = CountryListActionTypes.LoadCountryListItemsCompleted;
    countryListSearchResult: CountryModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public countryList: CountryModel[]) { }
}

export class LoadCountryListItemsFailed implements Action {
    type = CountryListActionTypes.LoadCountryListItemsFailed;
    countryListSearchResult: CountryModel;
    countryList: CountryModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = CountryListActionTypes.ExceptionHandled;
    countryListSearchResult: CountryModel;
    countryList: CountryModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type CountryListActions = LoadCountryListItemsTriggered
    | LoadCountryListItemsCompleted
    | LoadCountryListItemsFailed
    | ExceptionHandled