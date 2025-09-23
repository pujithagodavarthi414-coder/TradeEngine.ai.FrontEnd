import { Action } from '@ngrx/store';

import { EmployeeContactDetailsModel } from '../../models/employee-contact-details-model';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';

export enum EmployeeContactDetailsActionTypes {
    CreateEmployeeContactDetailsTriggered = '[HR Widgets Employee Contact Details Component] Create Employee Contact Details Triggered',
    CreateEmployeeContactDetailsCompleted = '[HR Widgets Employee Contact Details Component] Create Employee Contact Details Completed',
    CreateEmployeeContactDetailsFailed = '[HR Widgets Employee Contact Details Component] Create Employee Contact Details Failed',
    GetEmployeeContactDetailsTriggered = '[HR Widgets Employee Contact Details Component] Get Employee Contact Details Triggered ',
    GetEmployeeContactDetailsCompleted = '[HR Widgets Employee Contact Details Component] Get Employee Contact Details Completed',
    GetEmployeeContactDetailsFailed = '[HR Widgets Employee Contact Details Component] Get Employee Contact Details Failed',
    ExceptionHandled = '[HR Widgets Employee Contact Details Component] Handle Exception',
}

export class CreateEmployeeContactDetailsTriggered implements Action {
    type = EmployeeContactDetailsActionTypes.CreateEmployeeContactDetailsTriggered;
    employeeContactDetailsId: string;
    employeeDetailsSearchModel: EmployeeDetailsSearchModel;
    employeeContactDetailsData: EmployeeContactDetailsModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeContactDetails: EmployeeContactDetailsModel) { }
}

export class CreateEmployeeContactDetailsCompleted implements Action {
    type = EmployeeContactDetailsActionTypes.CreateEmployeeContactDetailsCompleted;
    employeeContactDetails: EmployeeContactDetailsModel;
    employeeDetailsSearchModel: EmployeeDetailsSearchModel;
    employeeContactDetailsData: EmployeeContactDetailsModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeContactDetailsId: string) { }
}

export class CreateEmployeeContactDetailsFailed implements Action {
    type = EmployeeContactDetailsActionTypes.CreateEmployeeContactDetailsFailed;
    employeeContactDetails: EmployeeContactDetailsModel;
    employeeContactDetailsId: string;
    employeeDetailsSearchModel: EmployeeDetailsSearchModel;
    employeeContactDetailsData: EmployeeContactDetailsModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class GetEmployeeContactDetailsTriggered implements Action {
    type = EmployeeContactDetailsActionTypes.GetEmployeeContactDetailsTriggered;
    employeeContactDetails: EmployeeContactDetailsModel;
    employeeContactDetailsId: string;
    employeeContactDetailsData: EmployeeContactDetailsModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeDetailsSearchModel: EmployeeDetailsSearchModel) { }
}

export class GetEmployeeContactDetailsCompleted implements Action {
    type = EmployeeContactDetailsActionTypes.GetEmployeeContactDetailsCompleted;
    employeeContactDetails: EmployeeContactDetailsModel;
    employeeContactDetailsId: string;
    employeeDetailsSearchModel: EmployeeDetailsSearchModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeContactDetailsData: EmployeeContactDetailsModel[]) { }
}

export class GetEmployeeContactDetailsFailed implements Action {
    type = EmployeeContactDetailsActionTypes.GetEmployeeContactDetailsFailed;
    employeeContactDetails: EmployeeContactDetailsModel;
    employeeContactDetailsId: string;
    employeeDetailsSearchModel: EmployeeDetailsSearchModel;
    employeeContactDetailsData: EmployeeContactDetailsModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeContactDetailsActionTypes.ExceptionHandled;
    employeeContactDetails: EmployeeContactDetailsModel;
    employeeContactDetailsId: string;
    employeeContactDetailsData: EmployeeContactDetailsModel[];
    validationMessages: any[];
    employeeDetailsSearchModel: EmployeeDetailsSearchModel;
    constructor(public errorMessage: string) { }
}

export type EmployeeContactDetailsActions = CreateEmployeeContactDetailsTriggered
    | CreateEmployeeContactDetailsCompleted
    | CreateEmployeeContactDetailsFailed
    | GetEmployeeContactDetailsTriggered
    | GetEmployeeContactDetailsCompleted
    | GetEmployeeContactDetailsFailed
    | ExceptionHandled