import { Action } from '@ngrx/store';
import { StoreConfigurationModel } from '../../models/store-configuration-model';


export enum StoreConfigurationActionTypes {
    LoadStoreConfigurationsTriggered = '[HR Widgets Store Configuration Component] Initial Data Load Triggered',
    LoadStoreConfigurationsCompleted = '[HR Widgets Store Configuration Component] Initial Data Load Completed',
    LoadStoreConfigurationsFailed = '[HR Widgets Store Configuration Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets Store Configuration Component] Handle Exception',
}

export class LoadStoreConfigurationsTriggered implements Action {
    type = StoreConfigurationActionTypes.LoadStoreConfigurationsTriggered;
    storeConfigurationModel: StoreConfigurationModel;
    validationMessages: any[];
    errorMessage: string;
    constructor() { }
}

export class LoadStoreConfigurationsCompleted implements Action {
    type = StoreConfigurationActionTypes.LoadStoreConfigurationsCompleted;
    validationMessages: any[];
    errorMessage: string;
    constructor(public storeConfigurationModel: StoreConfigurationModel) { }
}

export class LoadStoreConfigurationsFailed implements Action {
    type = StoreConfigurationActionTypes.LoadStoreConfigurationsFailed;
    storeConfigurationModel: StoreConfigurationModel;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = StoreConfigurationActionTypes.ExceptionHandled;
    storeConfigurationModel: StoreConfigurationModel;
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type StoreConfigurationActions = LoadStoreConfigurationsTriggered
    | LoadStoreConfigurationsCompleted
    | LoadStoreConfigurationsFailed
    | ExceptionHandled
