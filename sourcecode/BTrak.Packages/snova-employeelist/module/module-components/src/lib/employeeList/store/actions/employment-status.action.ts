import { Action } from '@ngrx/store';

import { EmploymentStatusModel } from '../../models/employment-status-model';
import { EmploymentStatusSearchModel } from '../../models/employment-status-search-model';

export enum EmploymentStatusListActionTypes {
    LoadEmploymentStatusListItemsTriggered = '[Employee List EmploymentStatus List Component] Initial Data Load Triggered',
    LoadEmploymentStatusListItemsCompleted = '[Employee List EmploymentStatus List Component] Initial Data Load Completed',
    LoadEmploymentListItemsFailed = '[Employee List EmploymentStatus List Component] Initial Data Load Failed',
    EmploymentExceptionHandled = '[Employee List EmploymentStatus List Component] Handle Exception',
}

export class LoadEmploymentStatusListItemsTriggered implements Action {
    type = EmploymentStatusListActionTypes.LoadEmploymentStatusListItemsTriggered;
    employmentStatusList: EmploymentStatusModel[];
    errorMessage: string;
    constructor(public employmentStatusListSearchResult: EmploymentStatusSearchModel) { }
}

export class LoadEmploymentStatusListItemsCompleted implements Action {
    type = EmploymentStatusListActionTypes.LoadEmploymentStatusListItemsCompleted;
    employmentStatusListSearchResult: EmploymentStatusSearchModel;
    errorMessage: string;
    constructor(public employmentStatusList: EmploymentStatusModel[]) { }
}

export class LoadEmploymentListItemsFailed implements Action {
    type = EmploymentStatusListActionTypes.LoadEmploymentListItemsFailed;
    employmentStatusListSearchResult: EmploymentStatusSearchModel;
    employmentStatusList: EmploymentStatusModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class EmploymentExceptionHandled implements Action {
    type = EmploymentStatusListActionTypes.EmploymentExceptionHandled;
    employmentStatusListSearchResult: EmploymentStatusSearchModel;
    employmentStatusList: EmploymentStatusModel[];
    constructor(public errorMessage: string) { }
}

export type EmploymentStatusListActions = LoadEmploymentStatusListItemsTriggered
    | LoadEmploymentStatusListItemsCompleted
    | LoadEmploymentListItemsFailed
    | EmploymentExceptionHandled