import { Action } from '@ngrx/store';

import { GenderSearchModel } from '../../models/gender-search-model';
import { GenderModel } from '../../models/gender-model';

export enum GenderActionTypes {
    LoadGendersTriggered = '[HR Widgets Genders Component] Initial Data Load Triggered',
    LoadGendersCompleted = '[HR Widgets Genders Component] Initial Data Load Completed',
    LoadGenderFailed = '[HR Widgets Genders Component] Initial Data Load Failed',
    GenderExceptionHandled = '[HR Widgets Genders Component] Handle Exception',
}

export class LoadGendersTriggered implements Action {
    type = GenderActionTypes.LoadGendersTriggered;
    genderList: GenderModel[];
    validationMessages: string[];
    errorMessage: string;
    constructor(public genderSearchResult: GenderSearchModel) { }
}

export class LoadGendersCompleted implements Action {
    type = GenderActionTypes.LoadGendersCompleted;
    genderSearchResult: GenderSearchModel;
    validationMessages: string[];
    errorMessage: string;
    constructor(public genderList: GenderModel[]) { }
}

export class LoadGenderFailed implements Action {
    type = GenderActionTypes.LoadGenderFailed;
    genderSearchResult: GenderSearchModel;
    genderList: GenderModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class GenderExceptionHandled implements Action {
    type = GenderActionTypes.GenderExceptionHandled;
    genderSearchResult: GenderSearchModel;
    genderList: GenderModel[];
    validationMessages: string[];
    constructor(public errorMessage: string) { }
}

export type GenderActions = LoadGendersTriggered
    | LoadGendersCompleted
    | LoadGenderFailed
    | GenderExceptionHandled;