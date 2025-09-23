import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { EmployeeDependentContactModel } from '../../models/employee-dependent-contact-model';
import { EmployeeDependentContactSearchModel } from '../../models/employee-dependent-contact-search-model';

export enum EmployeeDependentDetailsActionTypes {
    LoadEmployeeDependentDetailsTriggered = '[HR Widgets Employee Dependent Details Component] Initial Data Load Triggered',
    LoadEmployeeDependentDetailsCompleted = '[HR Widgets Employee Dependent Details Component] Initial Data Load Completed',
    CreateEmployeeDependentDetailsTriggered = '[HR Widgets Employee Dependent Details Component] Create Employee Dependent Details Triggered',
    CreateEmployeeDependentDetailsCompleted = '[HR Widgets Employee Dependent Details Component] Create Employee Dependent Details Completed',
    DeleteEmployeeDependentDetailsCompleted = '[HR Widgets Employee Dependent Details Component] Delete Employee Dependent Details Completed',
    GetEmployeeDependentDetailsByIdTriggered = '[HR Widgets Employee Dependent Details Component] Get Employee Dependent Details By Id Triggered',
    GetEmployeeDependentDetailsByIdCompleted = '[HR Widgets Employee Dependent Details Component] Get Employee Dependent Details By Id Completed',
    UpdateEmployeeDependentDetailsById = '[HR Widgets Employee Dependent Details Component] Update Employee Dependent Details By Id',
    RefreshEmployeeDependentDetailsList = '[HR Widgets Employee Dependent Details Component] Refresh Employee Dependent Details List',
    EmployeeDependentDetailsFailed = '[HR Widgets Employee Dependent Details Component] Employee Dependent Details Failed',
    ExceptionHandled = '[HR Widgets Employee Dependent Details Component] Handle Exception',
}

export class LoadEmployeeDependentDetailsTriggered implements Action {
    type = EmployeeDependentDetailsActionTypes.LoadEmployeeDependentDetailsTriggered;
    employeeDependentDetailsList: EmployeeDependentContactModel[];
    employeeDependentDetails: EmployeeDependentContactModel;
    employeeDependentDetailId: string;
    employeeDependentDetailsUpdates: { employeeDependentDetailsUpdate: Update<EmployeeDependentContactModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeDependentDetailsSearchResult: EmployeeDependentContactSearchModel) { }
}

export class LoadEmployeeDependentDetailsCompleted implements Action {
    type = EmployeeDependentDetailsActionTypes.LoadEmployeeDependentDetailsCompleted;
    employeeDependentDetailsSearchResult: EmployeeDependentContactSearchModel;
    employeeDependentDetails: EmployeeDependentContactModel;
    employeeDependentDetailId: string;
    employeeDependentDetailsUpdates: { employeeDependentDetailsUpdate: Update<EmployeeDependentContactModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeDependentDetailsList: EmployeeDependentContactModel[]) { }
}

export class CreateEmployeeDependentDetailsTriggered implements Action {
    type = EmployeeDependentDetailsActionTypes.CreateEmployeeDependentDetailsTriggered;
    employeeDependentDetailsSearchResult: EmployeeDependentContactSearchModel;
    employeeDependentDetailsList: EmployeeDependentContactModel[];
    employeeDependentDetailId: string;
    employeeDependentDetailsUpdates: { employeeDependentDetailsUpdate: Update<EmployeeDependentContactModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeDependentDetails: EmployeeDependentContactModel) { }
}

export class CreateEmployeeDependentDetailsCompleted implements Action {
    type = EmployeeDependentDetailsActionTypes.CreateEmployeeDependentDetailsCompleted;
    employeeDependentDetailsSearchResult: EmployeeDependentContactSearchModel;
    employeeDependentDetailsList: EmployeeDependentContactModel[];
    employeeDependentDetails: EmployeeDependentContactModel;
    employeeDependentDetailsUpdates: { employeeDependentDetailsUpdate: Update<EmployeeDependentContactModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeDependentDetailId: string) { }
}

export class DeleteEmployeeDependentDetailsCompleted implements Action {
    type = EmployeeDependentDetailsActionTypes.DeleteEmployeeDependentDetailsCompleted;
    employeeDependentDetailsSearchResult: EmployeeDependentContactSearchModel;
    employeeDependentDetailsList: EmployeeDependentContactModel[];
    employeeDependentDetails: EmployeeDependentContactModel;
    employeeDependentDetailsUpdates: { employeeDependentDetailsUpdate: Update<EmployeeDependentContactModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeDependentDetailId: string) { }
}

export class GetEmployeeDependentDetailsByIdTriggered implements Action {
    type = EmployeeDependentDetailsActionTypes.GetEmployeeDependentDetailsByIdTriggered;
    employeeDependentDetailsSearchResult: EmployeeDependentContactSearchModel;
    employeeDependentDetailsList: EmployeeDependentContactModel[];
    employeeDependentDetails: EmployeeDependentContactModel;
    employeeDependentDetailsUpdates: { employeeDependentDetailsUpdate: Update<EmployeeDependentContactModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeDependentDetailId: string) { }
}

export class GetEmployeeDependentDetailsByIdCompleted implements Action {
    type = EmployeeDependentDetailsActionTypes.GetEmployeeDependentDetailsByIdCompleted;
    employeeDependentDetailsSearchResult: EmployeeDependentContactSearchModel;
    employeeDependentDetailsList: EmployeeDependentContactModel[];
    employeeDependentDetailId: string;
    employeeDependentDetailsUpdates: { employeeDependentDetailsUpdate: Update<EmployeeDependentContactModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeDependentDetails: EmployeeDependentContactModel) { }
}

export class UpdateEmployeeDependentDetailsById implements Action {
    type = EmployeeDependentDetailsActionTypes.UpdateEmployeeDependentDetailsById;
    employeeDependentDetailsSearchResult: EmployeeDependentContactSearchModel;
    employeeDependentDetailsList: EmployeeDependentContactModel[];
    employeeDependentDetailId: string;
    employeeDependentDetails: EmployeeDependentContactModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeDependentDetailsUpdates: { employeeDependentDetailsUpdate: Update<EmployeeDependentContactModel> }) { }
}


export class RefreshEmployeeDependentDetailsList implements Action {
    type = EmployeeDependentDetailsActionTypes.RefreshEmployeeDependentDetailsList;
    employeeDependentDetailsSearchResult: EmployeeDependentContactSearchModel;
    employeeDependentDetailsList: EmployeeDependentContactModel[];
    employeeDependentDetailId: string;
    employeeDependentDetailsUpdates: { employeeDependentDetailsUpdate: Update<EmployeeDependentContactModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeDependentDetails: EmployeeDependentContactModel) { }
}

export class EmployeeDependentDetailsFailed implements Action {
    type = EmployeeDependentDetailsActionTypes.EmployeeDependentDetailsFailed;
    employeeDependentDetailsSearchResult: EmployeeDependentContactSearchModel;
    employeeDependentDetailsList: EmployeeDependentContactModel[];
    employeeDependentDetails: EmployeeDependentContactModel;
    employeeDependentDetailId: string;
    employeeDependentDetailsUpdates: { employeeDependentDetailsUpdate: Update<EmployeeDependentContactModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeDependentDetailsActionTypes.ExceptionHandled;
    employeeDependentDetailsSearchResult: EmployeeDependentContactSearchModel;
    employeeDependentDetailsList: EmployeeDependentContactModel[];
    employeeDependentDetails: EmployeeDependentContactModel;
    employeeDependentDetailId: string;
    employeeDependentDetailsUpdates: { employeeDependentDetailsUpdate: Update<EmployeeDependentContactModel> };
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type EmployeeDependentDetailsActions = LoadEmployeeDependentDetailsTriggered
    | LoadEmployeeDependentDetailsCompleted
    | CreateEmployeeDependentDetailsTriggered
    | CreateEmployeeDependentDetailsCompleted
    | DeleteEmployeeDependentDetailsCompleted
    | GetEmployeeDependentDetailsByIdTriggered
    | GetEmployeeDependentDetailsByIdCompleted
    | UpdateEmployeeDependentDetailsById
    | RefreshEmployeeDependentDetailsList
    | EmployeeDependentDetailsFailed
    | ExceptionHandled;