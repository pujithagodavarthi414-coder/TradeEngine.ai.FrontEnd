import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeLanguageDetailsModel } from '../../models/employee-language-details-model';

export enum EmployeeLanguageDetailsActionTypes {
    LoadEmployeeLanguageDetailsTriggered = '[HR Widgets Employee Language Details Component] Initial Data Load Triggered',
    LoadEmployeeLanguageDetailsCompleted = '[HR Widgets Employee Language Details Component] Initial Data Load Completed',
    LoadEmployeeLanguageDetailsFailed = '[HR Widgets Employee Language Details Component] Initial Data Load Failed',
    CreateEmployeeLanguageDetailsTriggered = '[HR Widgets Employee Language Details Component] Create Employee Language Details Triggered',
    CreateEmployeeLanguageDetailsCompleted = '[HR Widgets Employee Language Details Component] Create Employee Language Details Completed',
    CreateEmployeeLanguageDetailsFailed = '[HR Widgets Employee Language Details Component] Employee Language Details Failed',
    GetEmployeeLanguageDetailsByIdTriggered = '[HR Widgets Employee Language Details Component] Get Employee Language Details By Id Triggered',
    GetEmployeeLanguageDetailsByIdCompleted = '[HR Widgets Employee Language Details Component] Get Employee Language Details By Id Completed',
    GetEmployeeLanguageDetailsByIdFailed = '[HR Widgets Employee Language Details Component] Get Employee Language Details By Id Failed',
    DeleteEmployeeLanguageDetailsCompleted = '[HR Widgets Employee Language Details Component] Delete Employee Language Details Completed',
    UpdateEmployeeLanguageDetailsById = '[HR Widgets Employee Language Details Component] Update Employee Language Details By Id',
    RefreshEmployeeLanguageDetailsList = '[HR Widgets Employee Language Details Component] Refresh Employee Language Details List',
    ExceptionHandled = '[HR Widgets Employee Language Details Component] Handle Exception',
}

export class LoadEmployeeLanguageDetailsTriggered implements Action {
    type = EmployeeLanguageDetailsActionTypes.LoadEmployeeLanguageDetailsTriggered;
    employeeLanguageDetailsList: EmployeeLanguageDetailsModel[];
    employeeLanguageDetails: EmployeeLanguageDetailsModel;
    employeeLanguageDetailId: string;
    employeeLanguageDetailsUpdates: { employeeLanguageDetailsUpdate: Update<EmployeeLanguageDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel) { }
}

export class LoadEmployeeLanguageDetailsCompleted implements Action {
    type = EmployeeLanguageDetailsActionTypes.LoadEmployeeLanguageDetailsCompleted;
    employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLanguageDetails: EmployeeLanguageDetailsModel;
    employeeLanguageDetailId: string;
    employeeLanguageDetailsUpdates: { employeeLanguageDetailsUpdate: Update<EmployeeLanguageDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLanguageDetailsList: EmployeeLanguageDetailsModel[]) { }
}

export class LoadEmployeeLanguageDetailsFailed implements Action {
    type = EmployeeLanguageDetailsActionTypes.LoadEmployeeLanguageDetailsFailed;
    employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLanguageDetailsList: EmployeeLanguageDetailsModel[];
    employeeLanguageDetails: EmployeeLanguageDetailsModel;
    employeeLanguageDetailId: string;
    employeeLanguageDetailsUpdates: { employeeLanguageDetailsUpdate: Update<EmployeeLanguageDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateEmployeeLanguageDetailsTriggered implements Action {
    type = EmployeeLanguageDetailsActionTypes.CreateEmployeeLanguageDetailsTriggered;
    employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLanguageDetailsList: EmployeeLanguageDetailsModel[];
    employeeLanguageDetailId: string;
    employeeLanguageDetailsUpdates: { employeeLanguageDetailsUpdate: Update<EmployeeLanguageDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLanguageDetails: EmployeeLanguageDetailsModel) { }
}

export class CreateEmployeeLanguageDetailsCompleted implements Action {
    type = EmployeeLanguageDetailsActionTypes.CreateEmployeeLanguageDetailsCompleted;
    employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLanguageDetailsList: EmployeeLanguageDetailsModel[];
    employeeLanguageDetails: EmployeeLanguageDetailsModel;
    employeeLanguageDetailsUpdates: { employeeLanguageDetailsUpdate: Update<EmployeeLanguageDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLanguageDetailId: string) { }
}

export class CreateEmployeeLanguageDetailsFailed implements Action {
    type = EmployeeLanguageDetailsActionTypes.CreateEmployeeLanguageDetailsFailed;
    employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLanguageDetailsList: EmployeeLanguageDetailsModel[];
    employeeLanguageDetails: EmployeeLanguageDetailsModel;
    employeeLanguageDetailId: string;
    employeeLanguageDetailsUpdates: { employeeLanguageDetailsUpdate: Update<EmployeeLanguageDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class GetEmployeeLanguageDetailsByIdTriggered implements Action {
    type = EmployeeLanguageDetailsActionTypes.GetEmployeeLanguageDetailsByIdTriggered;
    employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLanguageDetailsList: EmployeeLanguageDetailsModel[];
    employeeLanguageDetails: EmployeeLanguageDetailsModel;
    employeeLanguageDetailsUpdates: { employeeLanguageDetailsUpdate: Update<EmployeeLanguageDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLanguageDetailId: string) { }
}

export class GetEmployeeLanguageDetailsByIdCompleted implements Action {
    type = EmployeeLanguageDetailsActionTypes.GetEmployeeLanguageDetailsByIdCompleted;
    employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLanguageDetailsList: EmployeeLanguageDetailsModel[];
    employeeLanguageDetailId: string;
    employeeLanguageDetailsUpdates: { employeeLanguageDetailsUpdate: Update<EmployeeLanguageDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLanguageDetails: EmployeeLanguageDetailsModel) { }
}


export class GetEmployeeLanguageDetailsByIdFailed implements Action {
    type = EmployeeLanguageDetailsActionTypes.GetEmployeeLanguageDetailsByIdFailed;
    employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLanguageDetailsList: EmployeeLanguageDetailsModel[];
    employeeLanguageDetails: EmployeeLanguageDetailsModel;
    employeeLanguageDetailId: string;
    employeeLanguageDetailsUpdates: { employeeLanguageDetailsUpdate: Update<EmployeeLanguageDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class DeleteEmployeeLanguageDetailsCompleted implements Action {
    type = EmployeeLanguageDetailsActionTypes.DeleteEmployeeLanguageDetailsCompleted;
    employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLanguageDetailsList: EmployeeLanguageDetailsModel[];
    employeeLanguageDetails: EmployeeLanguageDetailsModel;
    employeeLanguageDetailsUpdates: { employeeLanguageDetailsUpdate: Update<EmployeeLanguageDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLanguageDetailId: string) { }
}

export class UpdateEmployeeLanguageDetailsById implements Action {
    type = EmployeeLanguageDetailsActionTypes.UpdateEmployeeLanguageDetailsById;
    employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLanguageDetailsList: EmployeeLanguageDetailsModel[];
    employeeLanguageDetailId: string;
    employeeLanguageDetails: EmployeeLanguageDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLanguageDetailsUpdates: { employeeLanguageDetailsUpdate: Update<EmployeeLanguageDetailsModel> }) { }
}


export class RefreshEmployeeLanguageDetailsList implements Action {
    type = EmployeeLanguageDetailsActionTypes.RefreshEmployeeLanguageDetailsList;
    employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLanguageDetailsList: EmployeeLanguageDetailsModel[];
    employeeLanguageDetailId: string;
    employeeLanguageDetailsUpdates: { employeeLanguageDetailsUpdate: Update<EmployeeLanguageDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLanguageDetails: EmployeeLanguageDetailsModel) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeLanguageDetailsActionTypes.ExceptionHandled;
    employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLanguageDetailsList: EmployeeLanguageDetailsModel[];
    employeeLanguageDetails: EmployeeLanguageDetailsModel;
    employeeLanguageDetailId: string;
    employeeLanguageDetailsUpdates: { employeeLanguageDetailsUpdate: Update<EmployeeLanguageDetailsModel> };
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type EmployeeLanguageDetailsActions = LoadEmployeeLanguageDetailsTriggered
    | LoadEmployeeLanguageDetailsCompleted
    | LoadEmployeeLanguageDetailsFailed
    | CreateEmployeeLanguageDetailsTriggered
    | CreateEmployeeLanguageDetailsCompleted
    | CreateEmployeeLanguageDetailsFailed
    | GetEmployeeLanguageDetailsByIdTriggered
    | GetEmployeeLanguageDetailsByIdCompleted
    | GetEmployeeLanguageDetailsByIdFailed
    | DeleteEmployeeLanguageDetailsCompleted
    | UpdateEmployeeLanguageDetailsById
    | RefreshEmployeeLanguageDetailsList
    | ExceptionHandled;