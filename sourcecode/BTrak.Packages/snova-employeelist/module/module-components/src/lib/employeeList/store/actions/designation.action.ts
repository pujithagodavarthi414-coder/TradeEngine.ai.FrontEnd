import { Action } from '@ngrx/store';
import { DesignationModel } from '../../models/designations-model';

export enum DesignationListActionTypes {
    LoadDesignationListItemsTriggered = '[Employee List  List Component] Initial Data Load Triggered',
    LoadDesignationListItemsCompleted = '[Employee List Designation List Component] Initial Data Load Completed',
    LoadDesignationListItemsFailed = '[Employee List Designation List Component] Initial Data Load Failed',
    ExceptionHandled = '[Employee List List Component] Handle Exception',
}

export class LoadDesignationListItemsTriggered implements Action {
    type = DesignationListActionTypes.LoadDesignationListItemsTriggered;
    designationList: DesignationModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public designationListSearchResult: DesignationModel) { }
}

export class LoadDesignationListItemsCompleted implements Action {
    type = DesignationListActionTypes.LoadDesignationListItemsCompleted;
    designationListSearchResult: DesignationModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public designationList: DesignationModel[]) { }
}

export class LoadDesignationListItemsFailed implements Action {
    type = DesignationListActionTypes.LoadDesignationListItemsFailed;
    designationListSearchResult: DesignationModel;
    designationList: DesignationModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = DesignationListActionTypes.ExceptionHandled;
    designationListSearchResult: DesignationModel;
    designationList: DesignationModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type DesignationListActions = LoadDesignationListItemsTriggered
    | LoadDesignationListItemsCompleted
    | LoadDesignationListItemsFailed
    | ExceptionHandled