import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeSalaryDetailsModel } from '../../models/employee-salary-details-model';



export enum EmployeeSalaryDetailsActionTypes {
    LoadEmployeeSalaryDetailsTriggered = '[HR Widgets Employee Salary Details Component] Initial Data Load Triggered',
    LoadEmployeeSalaryDetailsCompleted = '[HR Widgets  Salary Details Component] Initial Data Load Completed',
    LoadEmployeeSalaryDetailsFailed = '[HR Widgets Employee Salary Details Component] Initial Data Load Failed',
    CreateEmployeeSalaryDetailsTriggered = '[HR Widgets Employee Salary Details Component] Create Employee Salary Details Triggered',
    CreateEmployeeSalaryDetailsCompleted = '[HR Widgets Employee Salary Details Component] Create Employee Salary Details Completed',
    DeleteEmployeeSalaryDetailsCompleted = '[HR Widgets Employee Salary Details Component] Delete Employee Salary Details Completed',
    CreateEmployeeSalaryDetailsFailed = '[HR Widgets Employee Salary Details Component] Create Employee Salary Details Failed',
    GetEmployeeSalaryDetailsByIdTriggered = '[HR Widgets Employee Salary Details Component] Get Employee Salary Details By Id Triggered',
    GetEmployeeSalaryDetailsByIdCompleted = '[HR Widgets Employee Salary Details Component] Get Employee Salary Details By Id Completed',
    GetEmployeeSalaryDetailsByIdFailed = '[HR Widgets Employee Salary Details Component] Get Employee Salary Details By Id Failed',
    UpdateEmployeeSalaryDetailsById = '[HR Widgets Employee Salary Details Component] Update Employee Salary Details By Id',
    RefreshEmployeeSalaryDetailsList = '[HR Widgets Employee Salary Details Component] Refresh Employee Salary Details List',
    ExceptionHandled = '[HR Widgets Employee Salary Details Component] Handle Exception',
}

export class LoadEmployeeSalaryDetailsTriggered implements Action {
    type = EmployeeSalaryDetailsActionTypes.LoadEmployeeSalaryDetailsTriggered;
    employeeSalaryDetailsList: EmployeeSalaryDetailsModel[];
    employeeSalaryDetails: EmployeeSalaryDetailsModel;
    employeeSalaryDetailId: string;
    employeeSalaryDetailsUpdates: { employeeSalaryDetailsUpdate: Update<EmployeeSalaryDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel) { }
}

export class LoadEmployeeSalaryDetailsCompleted implements Action {
    type = EmployeeSalaryDetailsActionTypes.LoadEmployeeSalaryDetailsCompleted;
    employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSalaryDetails: EmployeeSalaryDetailsModel;
    employeeSalaryDetailId: string;
    employeeSalaryDetailsUpdates: { employeeSalaryDetailsUpdate: Update<EmployeeSalaryDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSalaryDetailsList: EmployeeSalaryDetailsModel[]) { }
}

export class LoadEmployeeSalaryDetailsFailed implements Action {
    type = EmployeeSalaryDetailsActionTypes.LoadEmployeeSalaryDetailsFailed;
    employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSalaryDetailsList: EmployeeSalaryDetailsModel[];
    employeeSalaryDetails: EmployeeSalaryDetailsModel;
    employeeSalaryDetailId: string;
    employeeSalaryDetailsUpdates: { employeeSalaryDetailsUpdate: Update<EmployeeSalaryDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateEmployeeSalaryDetailsTriggered implements Action {
    type = EmployeeSalaryDetailsActionTypes.CreateEmployeeSalaryDetailsTriggered;
    employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSalaryDetailsList: EmployeeSalaryDetailsModel[];
    employeeSalaryDetailId: string;
    employeeSalaryDetailsUpdates: { employeeSalaryDetailsUpdate: Update<EmployeeSalaryDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSalaryDetails: EmployeeSalaryDetailsModel) { }
}

export class CreateEmployeeSalaryDetailsCompleted implements Action {
    type = EmployeeSalaryDetailsActionTypes.CreateEmployeeSalaryDetailsCompleted;
    employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSalaryDetailsList: EmployeeSalaryDetailsModel[];
    employeeSalaryDetails: EmployeeSalaryDetailsModel;
    employeeSalaryDetailsUpdates: { employeeSalaryDetailsUpdate: Update<EmployeeSalaryDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSalaryDetailId: string) { }
}

export class DeleteEmployeeSalaryDetailsCompleted implements Action {
    type = EmployeeSalaryDetailsActionTypes.DeleteEmployeeSalaryDetailsCompleted;
    employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSalaryDetailsList: EmployeeSalaryDetailsModel[];
    employeeSalaryDetails: EmployeeSalaryDetailsModel;
    employeeSalaryDetailsUpdates: { employeeSalaryDetailsUpdate: Update<EmployeeSalaryDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSalaryDetailId: string) { }
}

export class CreateEmployeeSalaryDetailsFailed implements Action {
    type = EmployeeSalaryDetailsActionTypes.CreateEmployeeSalaryDetailsFailed;
    employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSalaryDetailsList: EmployeeSalaryDetailsModel[];
    employeeSalaryDetails: EmployeeSalaryDetailsModel;
    employeeSalaryDetailId: string;
    employeeSalaryDetailsUpdates: { employeeSalaryDetailsUpdate: Update<EmployeeSalaryDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}


export class GetEmployeeSalaryDetailsByIdTriggered implements Action {
    type = EmployeeSalaryDetailsActionTypes.GetEmployeeSalaryDetailsByIdTriggered;
    employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSalaryDetailsList: EmployeeSalaryDetailsModel[];
    employeeSalaryDetails: EmployeeSalaryDetailsModel;
    employeeSalaryDetailsUpdates: { employeeSalaryDetailsUpdate: Update<EmployeeSalaryDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSalaryDetailId: string) { }
}

export class GetEmployeeSalaryDetailsByIdCompleted implements Action {
    type = EmployeeSalaryDetailsActionTypes.GetEmployeeSalaryDetailsByIdCompleted;
    employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSalaryDetailsList: EmployeeSalaryDetailsModel[];
    employeeSalaryDetailId: string;
    employeeSalaryDetailsUpdates: { employeeSalaryDetailsUpdate: Update<EmployeeSalaryDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSalaryDetails: EmployeeSalaryDetailsModel) { }
}

export class GetEmployeeSalaryDetailsByIdFailed implements Action {
    type = EmployeeSalaryDetailsActionTypes.GetEmployeeSalaryDetailsByIdFailed;
    employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSalaryDetailsList: EmployeeSalaryDetailsModel[];
    employeeSalaryDetails: EmployeeSalaryDetailsModel;
    employeeSalaryDetailId: string;
    employeeSalaryDetailsUpdates: { employeeSalaryDetailsUpdate: Update<EmployeeSalaryDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class UpdateEmployeeSalaryDetailsById implements Action {
    type = EmployeeSalaryDetailsActionTypes.UpdateEmployeeSalaryDetailsById;
    employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSalaryDetailsList: EmployeeSalaryDetailsModel[];
    employeeSalaryDetailId: string;
    employeeSalaryDetails: EmployeeSalaryDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSalaryDetailsUpdates: { employeeSalaryDetailsUpdate: Update<EmployeeSalaryDetailsModel> }) { }
}

export class RefreshEmployeeSalaryDetailsList implements Action {
    type = EmployeeSalaryDetailsActionTypes.RefreshEmployeeSalaryDetailsList;
    employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSalaryDetailsList: EmployeeSalaryDetailsModel[];
    employeeSalaryDetailId: string;
    employeeSalaryDetailsUpdates: { employeeSalaryDetailsUpdate: Update<EmployeeSalaryDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSalaryDetails: EmployeeSalaryDetailsModel) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeSalaryDetailsActionTypes.ExceptionHandled;
    employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSalaryDetailsList: EmployeeSalaryDetailsModel[];
    employeeSalaryDetails: EmployeeSalaryDetailsModel;
    employeeSalaryDetailId: string;
    employeeSalaryDetailsUpdates: { employeeSalaryDetailsUpdate: Update<EmployeeSalaryDetailsModel> };
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type EmployeeSalaryDetailsActions = LoadEmployeeSalaryDetailsTriggered
    | LoadEmployeeSalaryDetailsCompleted
    | LoadEmployeeSalaryDetailsFailed
    | CreateEmployeeSalaryDetailsTriggered
    | CreateEmployeeSalaryDetailsCompleted
    | DeleteEmployeeSalaryDetailsCompleted
    | CreateEmployeeSalaryDetailsFailed
    | GetEmployeeSalaryDetailsByIdTriggered
    | GetEmployeeSalaryDetailsByIdCompleted
    | GetEmployeeSalaryDetailsByIdFailed
    | UpdateEmployeeSalaryDetailsById
    | RefreshEmployeeSalaryDetailsList
    | ExceptionHandled;