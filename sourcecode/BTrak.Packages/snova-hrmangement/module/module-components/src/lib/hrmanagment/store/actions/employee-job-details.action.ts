import { Action } from '@ngrx/store';

import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeJobDetailsModel } from '../../models/employee-job-model';

export enum EmployeeJobDetailsActionTypes {
    CreateEmployeeJobDetailsTriggered = '[HR Widgets Employee Job Details Component] Create Employee Job Details Triggered',
    CreateEmployeeJobDetailsCompleted = '[HR Widgets Employee Job Details Component] Create Employee Job Details Completed',
    CreateEmployeeJobDetailsFailed = '[HR Widgets Employee Job Details Component] Create Employee Job Details Failed',
    GetEmployeeJobDetailsByIdTriggered = '[HR Widgets Employee Job Details Component] Get Employee Job Details By Id Triggered ',
    GetEmployeeJobDetailsByIdCompleted = '[HR Widgets Employee Job Details Component] Get Employee Job Details By Id Completed',
    GetEmployeeJobDetailsByIdFailed = '[HR Widgets Employee Job Details Component] Get Employee Job Details By Id Failed',
    ExceptionHandled = '[HR Widgets Employee Job Details Component] Handle Exception',
}

export class CreateEmployeeJobDetailsTriggered implements Action {
    type = EmployeeJobDetailsActionTypes.CreateEmployeeJobDetailsTriggered;
    employeeJobDetailsId: string;
    employeeJobDetailsSearchModel: EmployeeDetailsSearchModel;
    employeeJobDetailsData: EmployeeJobDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeJobDetails: EmployeeJobDetailsModel) { }
}

export class CreateEmployeeJobDetailsCompleted implements Action {
    type = EmployeeJobDetailsActionTypes.CreateEmployeeJobDetailsCompleted;
    employeeJobDetails: EmployeeJobDetailsModel;
    employeeJobDetailsSearchModel: EmployeeDetailsSearchModel;
    employeeJobDetailsData: EmployeeJobDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeJobDetailsId: string) { }
}

export class CreateEmployeeJobDetailsFailed implements Action {
    type = EmployeeJobDetailsActionTypes.CreateEmployeeJobDetailsFailed;
    employeeJobDetails: EmployeeJobDetailsModel;
    employeeJobDetailsId: string;
    employeeJobDetailsSearchModel: EmployeeDetailsSearchModel;
    employeeJobDetailsData: EmployeeJobDetailsModel;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class GetEmployeeJobDetailsByIdTriggered implements Action {
    type = EmployeeJobDetailsActionTypes.GetEmployeeJobDetailsByIdTriggered;
    employeeJobDetails: EmployeeJobDetailsModel;
    employeeJobDetailsId: string;
    employeeJobDetailsData: EmployeeJobDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeJobDetailsSearchModel: EmployeeDetailsSearchModel) { }
}

export class GetEmployeeJobDetailsByIdCompleted implements Action {
    type = EmployeeJobDetailsActionTypes.GetEmployeeJobDetailsByIdCompleted;
    employeeJobDetails: EmployeeJobDetailsModel;
    employeeJobDetailsId: string;
    employeeJobDetailsSearchModel: EmployeeDetailsSearchModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeJobDetailsData: EmployeeJobDetailsModel) { }
}

export class GetEmployeeJobDetailsByIdFailed implements Action {
    type = EmployeeJobDetailsActionTypes.GetEmployeeJobDetailsByIdFailed;
    employeeJobDetails: EmployeeJobDetailsModel;
    employeeJobDetailsId: string;
    employeeJobDetailsSearchModel: EmployeeDetailsSearchModel;
    employeeJobDetailsData: EmployeeJobDetailsModel;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeJobDetailsActionTypes.ExceptionHandled;
    employeeJobDetails: EmployeeJobDetailsModel;
    employeeJobDetailsId: string;
    employeeJobDetailsData: EmployeeJobDetailsModel;
    validationMessages: any[];
    employeeJobDetailsSearchModel: EmployeeDetailsSearchModel;
    constructor(public errorMessage: string) { }
}

export type EmployeeJobDetailsActions = CreateEmployeeJobDetailsTriggered
    | CreateEmployeeJobDetailsCompleted
    | CreateEmployeeJobDetailsFailed
    | GetEmployeeJobDetailsByIdTriggered
    | GetEmployeeJobDetailsByIdCompleted
    | GetEmployeeJobDetailsByIdFailed
    | ExceptionHandled