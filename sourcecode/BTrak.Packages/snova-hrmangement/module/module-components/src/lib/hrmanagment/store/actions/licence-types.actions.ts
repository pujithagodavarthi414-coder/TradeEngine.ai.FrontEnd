import { Action } from '@ngrx/store';

import { LicenceTypesModel } from '../../models/licence-types-model';

export enum LicenceTypesActionTypes {
    LoadLicenceTypeTriggered = '[HR Widgets Licence Type Component] Initial Data Load Triggered',
    LoadLicenceTypeCompleted = '[HR Widgets Licence Type Component] Initial Data Load Completed',
    LoadLicenceTypeFailed = '[HR Widgets Licence Type Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets Licence Type Component] Handle Exception',
}

export class LoadLicenceTypeTriggered implements Action {
    type = LicenceTypesActionTypes.LoadLicenceTypeTriggered;
    licenceTypesList: LicenceTypesModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public licenceTypesSearchResult: LicenceTypesModel) { }
}

export class LoadLicenceTypeCompleted implements Action {
    type = LicenceTypesActionTypes.LoadLicenceTypeCompleted;
    licenceTypesSearchResult: LicenceTypesModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public licenceTypesList: LicenceTypesModel[]) { }
}

export class LoadLicenceTypeFailed implements Action {
    type = LicenceTypesActionTypes.LoadLicenceTypeFailed;
    licenceTypesSearchResult: LicenceTypesModel;
    licenceTypesList: LicenceTypesModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = LicenceTypesActionTypes.ExceptionHandled;
    licenceTypesSearchResult: LicenceTypesModel;
    licenceTypesList: LicenceTypesModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type LicenceTypesActions = LoadLicenceTypeTriggered
    | LoadLicenceTypeCompleted
    | LoadLicenceTypeFailed
    | ExceptionHandled;