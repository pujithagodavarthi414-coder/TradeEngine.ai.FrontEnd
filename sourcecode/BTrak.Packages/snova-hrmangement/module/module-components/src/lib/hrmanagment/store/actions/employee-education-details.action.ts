import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeEducationDetailsModel } from '../../models/employee-education-details-model';



export enum EmployeeEducationDetailsActionTypes {
    LoadEmployeeEducationDetailsTriggered = '[HR Widgets Employee Education Details Component] Initial Data Load Triggered',
    LoadEmployeeEducationDetailsCompleted = '[HR Widgets Employee Education Details Component] Initial Data Load Completed',
    LoadEmployeeEducationDetailsFailed = '[HR Widgets Employee Education Details Component] Initial Data Load Failed',
    CreateEmployeeEducationDetailsTriggered = '[HR Widgets Employee Education Details Component] Create Employee Education Details Triggered',
    CreateEmployeeEducationDetailsCompleted = '[HR Widgets Employee Education Details Component] Create Employee Education Details Completed',
    DeleteEmployeeEducationDetailsCompleted = '[HR Widgets Employee Education Details Component] Delete Employee Education Details Completed',
    CreateEmployeeEducationDetailsFailed = '[HR Widgets Employee Education Details Component] Create Employee Education Details Failed',
    GetEmployeeEducationDetailsByIdTriggered = '[HR Widgets Employee Education Details Component] Get Employee Education Details By Id Triggered',
    GetEmployeeEducationDetailsByIdCompleted = '[HR Widgets Employee Education Details Component] Get Employee Education Details By Id Completed',
    UpdateEmployeeEducationDetailsById = '[HR Widgets Employee Education Details Component] Update Employee Education Details By Id',
    RefreshEmployeeEducationDetailsList = '[HR Widgets Employee Education Details Component] Refresh Employee Education Details List',
    ExceptionHandled = '[HR Widgets Employee Education Details Component] Handle Exception',
}

export class LoadEmployeeEducationDetailsTriggered implements Action {
    type = EmployeeEducationDetailsActionTypes.LoadEmployeeEducationDetailsTriggered;
    employeeEducationDetailsList: EmployeeEducationDetailsModel[];
    employeeEducationDetails: EmployeeEducationDetailsModel;
    employeeEducationDetailId: string;
    employeeEducationDetailsUpdates: { employeeEducationDetailsUpdate: Update<EmployeeEducationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeEducationDetailsSearchResult: EmployeeDetailsSearchModel) { }
}

export class LoadEmployeeEducationDetailsCompleted implements Action {
    type = EmployeeEducationDetailsActionTypes.LoadEmployeeEducationDetailsCompleted;
    employeeEducationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeEducationDetails: EmployeeEducationDetailsModel;
    employeeEducationDetailId: string;
    employeeEducationDetailsUpdates: { employeeEducationDetailsUpdate: Update<EmployeeEducationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeEducationDetailsList: EmployeeEducationDetailsModel[]) { }
}

export class LoadEmployeeEducationDetailsFailed implements Action {
    type = EmployeeEducationDetailsActionTypes.LoadEmployeeEducationDetailsFailed;
    employeeEducationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeEducationDetailsList: EmployeeEducationDetailsModel[];
    employeeEducationDetails: EmployeeEducationDetailsModel;
    employeeEducationDetailId: string;
    employeeEducationDetailsUpdates: { employeeEducationDetailsUpdate: Update<EmployeeEducationDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateEmployeeEducationDetailsTriggered implements Action {
    type = EmployeeEducationDetailsActionTypes.CreateEmployeeEducationDetailsTriggered;
    employeeEducationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeEducationDetailsList: EmployeeEducationDetailsModel[];
    employeeEducationDetailId: string;
    employeeEducationDetailsUpdates: { employeeEducationDetailsUpdate: Update<EmployeeEducationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeEducationDetails: EmployeeEducationDetailsModel) { }
}

export class CreateEmployeeEducationDetailsCompleted implements Action {
    type = EmployeeEducationDetailsActionTypes.CreateEmployeeEducationDetailsCompleted;
    employeeEducationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeEducationDetailsList: EmployeeEducationDetailsModel[];
    employeeEducationDetails: EmployeeEducationDetailsModel;
    employeeEducationDetailsUpdates: { employeeEducationDetailsUpdate: Update<EmployeeEducationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeEducationDetailId: string) { }
}

export class DeleteEmployeeEducationDetailsCompleted implements Action {
    type = EmployeeEducationDetailsActionTypes.DeleteEmployeeEducationDetailsCompleted;
    employeeEducationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeEducationDetailsList: EmployeeEducationDetailsModel[];
    employeeEducationDetails: EmployeeEducationDetailsModel;
    employeeEducationDetailsUpdates: { employeeEducationDetailsUpdate: Update<EmployeeEducationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeEducationDetailId: string) { }
}

export class CreateEmployeeEducationDetailsFailed implements Action {
    type = EmployeeEducationDetailsActionTypes.CreateEmployeeEducationDetailsFailed;
    employeeEducationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeEducationDetailsList: EmployeeEducationDetailsModel[];
    employeeEducationDetails: EmployeeEducationDetailsModel;
    employeeEducationDetailId: string;
    employeeEducationDetailsUpdates: { employeeEducationDetailsUpdate: Update<EmployeeEducationDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}


export class GetEmployeeEducationDetailsByIdTriggered implements Action {
    type = EmployeeEducationDetailsActionTypes.GetEmployeeEducationDetailsByIdTriggered;
    employeeEducationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeEducationDetailsList: EmployeeEducationDetailsModel[];
    employeeEducationDetails: EmployeeEducationDetailsModel;
    employeeEducationDetailsUpdates: { employeeEducationDetailsUpdate: Update<EmployeeEducationDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeEducationDetailId: string) { }
}

export class GetEmployeeEducationDetailsByIdCompleted implements Action {
    type = EmployeeEducationDetailsActionTypes.GetEmployeeEducationDetailsByIdCompleted;
    employeeEducationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeEducationDetailsList: EmployeeEducationDetailsModel[];
    employeeEducationDetailId: string;
    employeeEducationDetailsUpdates: { employeeEducationDetailsUpdate: Update<EmployeeEducationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeEducationDetails: EmployeeEducationDetailsModel) { }
}

export class UpdateEmployeeEducationDetailsById implements Action {
    type = EmployeeEducationDetailsActionTypes.UpdateEmployeeEducationDetailsById;
    employeeEducationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeEducationDetailsList: EmployeeEducationDetailsModel[];
    employeeEducationDetailId: string;
    employeeEducationDetails: EmployeeEducationDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeEducationDetailsUpdates: { employeeEducationDetailsUpdate: Update<EmployeeEducationDetailsModel> }) { }
}


export class RefreshEmployeeEducationDetailsList implements Action {
    type = EmployeeEducationDetailsActionTypes.RefreshEmployeeEducationDetailsList;
    employeeEducationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeEducationDetailsList: EmployeeEducationDetailsModel[];
    employeeEducationDetailId: string;
    employeeEducationDetailsUpdates: { employeeEducationDetailsUpdate: Update<EmployeeEducationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeEducationDetails: EmployeeEducationDetailsModel) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeEducationDetailsActionTypes.ExceptionHandled;
    employeeEducationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeEducationDetailsList: EmployeeEducationDetailsModel[];
    employeeEducationDetails: EmployeeEducationDetailsModel;
    employeeEducationDetailId: string;
    employeeEducationDetailsUpdates: { employeeEducationDetailsUpdate: Update<EmployeeEducationDetailsModel> };
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type EmployeeEducationDetailsActions = LoadEmployeeEducationDetailsTriggered
    | LoadEmployeeEducationDetailsCompleted
    | LoadEmployeeEducationDetailsFailed
    | CreateEmployeeEducationDetailsTriggered
    | CreateEmployeeEducationDetailsCompleted
    | DeleteEmployeeEducationDetailsCompleted
    | CreateEmployeeEducationDetailsFailed
    | GetEmployeeEducationDetailsByIdTriggered
    | GetEmployeeEducationDetailsByIdCompleted
    | UpdateEmployeeEducationDetailsById
    | RefreshEmployeeEducationDetailsList
    | ExceptionHandled;