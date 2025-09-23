import { Action } from '@ngrx/store';

import { EmployeePersonalDetailsModel } from '../../models/employee-personal-details-model';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';

export enum EmployeePersonalDetailsActionTypes {
    CreateEmployeePersonalDetailsTriggered = '[HR Widgets Employee Personal Details Component] Create Employee Personal Details Triggered',
    CreateEmployeePersonalDetailsCompleted = '[HR Widgets Employee Personal Details Component] Create Employee Personal Details Completed',
    CreateEmployeePersonalDetailsFailed = '[HR Widgets Employee Personal Details Component] Create Employee Personal Details Failed',
    GetEmployeeDetailsByIdTriggered = '[HR Widgets Employee Personal Details Component] Get Employee Personal Details By Id Triggered ',
    GetEmployeeDetailsByIdCompleted = '[HR Widgets Employee Personal Details Component] Get Employee Personal Details By Id Completed',
    GetEmployeeDetailsByIdFailed = '[HR Widgets Employee Personal Details Component] Get Employee Personal Details By Id Failed',
    ExceptionHandled = '[HR Widgets Employee Personal Details Component] Handle Exception',
}

export class CreateEmployeePersonalDetailsTriggered implements Action {
    type = EmployeePersonalDetailsActionTypes.CreateEmployeePersonalDetailsTriggered;
    employeePersonalDetailsId: string;
    employeeDetailsSearchModel: EmployeeDetailsSearchModel;
    employeePersonalDetailsData: EmployeePersonalDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeePersonalDetails: EmployeePersonalDetailsModel) { }
}

export class CreateEmployeePersonalDetailsCompleted implements Action {
    type = EmployeePersonalDetailsActionTypes.CreateEmployeePersonalDetailsCompleted;
    employeePersonalDetails: EmployeePersonalDetailsModel;
    employeeDetailsSearchModel: EmployeeDetailsSearchModel;
    employeePersonalDetailsData: EmployeePersonalDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeePersonalDetailsId: string) { }
}

export class CreateEmployeePersonalDetailsFailed implements Action {
    type = EmployeePersonalDetailsActionTypes.CreateEmployeePersonalDetailsFailed;
    employeePersonalDetails: EmployeePersonalDetailsModel;
    employeePersonalDetailsId: string;
    employeeDetailsSearchModel: EmployeeDetailsSearchModel;
    employeePersonalDetailsData: EmployeePersonalDetailsModel;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class GetEmployeeDetailsByIdTriggered implements Action {
    type = EmployeePersonalDetailsActionTypes.GetEmployeeDetailsByIdTriggered;
    employeePersonalDetails: EmployeePersonalDetailsModel;
    employeePersonalDetailsId: string;
    employeePersonalDetailsData: EmployeePersonalDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeDetailsSearchModel: EmployeeDetailsSearchModel) { }
}

export class GetEmployeeDetailsByIdCompleted implements Action {
    type = EmployeePersonalDetailsActionTypes.GetEmployeeDetailsByIdCompleted;
    employeePersonalDetails: EmployeePersonalDetailsModel;
    employeePersonalDetailsId: string;
    employeeDetailsSearchModel: EmployeeDetailsSearchModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeePersonalDetailsData: EmployeePersonalDetailsModel) { }
}

export class GetEmployeeDetailsByIdFailed implements Action {
    type = EmployeePersonalDetailsActionTypes.GetEmployeeDetailsByIdFailed;
    employeePersonalDetails: EmployeePersonalDetailsModel;
    employeePersonalDetailsId: string;
    employeeDetailsSearchModel: EmployeeDetailsSearchModel;
    employeePersonalDetailsData: EmployeePersonalDetailsModel;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = EmployeePersonalDetailsActionTypes.ExceptionHandled;
    employeePersonalDetails: EmployeePersonalDetailsModel;
    employeePersonalDetailsId: string;
    employeePersonalDetailsData: EmployeePersonalDetailsModel;
    validationMessages: any[];
    employeeDetailsSearchModel: EmployeeDetailsSearchModel;
    constructor(public errorMessage: string) { }
}

export type EmployeePersonalDetailsActions = CreateEmployeePersonalDetailsTriggered
    | CreateEmployeePersonalDetailsCompleted
    | CreateEmployeePersonalDetailsFailed
    | GetEmployeeDetailsByIdTriggered
    | GetEmployeeDetailsByIdCompleted
    | GetEmployeeDetailsByIdFailed
    | ExceptionHandled