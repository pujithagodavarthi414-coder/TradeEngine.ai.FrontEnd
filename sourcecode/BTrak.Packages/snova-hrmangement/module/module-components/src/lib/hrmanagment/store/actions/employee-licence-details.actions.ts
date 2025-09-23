import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeLicenceDetailsModel } from '../../models/employee-licence-details-model';

export enum EmployeeLicenceDetailsActionTypes {
    LoadEmployeeLicenceDetailsTriggered = '[HR Widgets  Licence Details Component] Initial Data Load Triggered',
    LoadEmployeeLicenceDetailsCompleted = '[HR Widgets Employee Licence Details Component] Initial Data Load Completed',
    LoadEmployeeLicenceDetailsFailed = '[HR Widgets Employee Licence Details Component] Initial Data Load Failed',
    CreateEmployeeLicenceDetailsTriggered = '[HR Widgets Employee Licence Details Component] Create Employee Licence Details Triggered',
    CreateEmployeeLicenceDetailsCompleted = '[HR Widgets  Licence Details Component] Create Employee Licence Details Completed',
    DeleteEmployeeLicenceDetailsCompleted = '[HR Widgets Employee Licence Details Component] Delete Employee Licence Details Completed',
    CreateEmployeeLicenceDetailsFailed = '[HR Widgets Employee Licence Details Component] Create Employee Licence Details Failed',
    GetEmployeeLicenceDetailsByIdTriggered = '[HR Widgets Employee Licence Details Component] Get Employee Licence Details By Id Triggered',
    GetEmployeeLicenceDetailsByIdCompleted = '[HR Widgets Employee Licence Details Component] Get Employee Licence Details By Id Completed',
    UpdateEmployeeLicenceDetailsById = '[HR Widgets Employee Licence Details Component] Update Employee Licence Details By Id',
    RefreshEmployeeLicenceDetailsList = '[HR Widgets Employee Licence Details Component] Refresh Employee Licence Details List',
    ExceptionHandled = '[HR Widgets Employee Licence Details Component] Handle Exception',
}

export class LoadEmployeeLicenceDetailsTriggered implements Action {
    type = EmployeeLicenceDetailsActionTypes.LoadEmployeeLicenceDetailsTriggered;
    employeeLicenceDetailsList: EmployeeLicenceDetailsModel[];
    employeeLicenceDetails: EmployeeLicenceDetailsModel;
    employeeLicenceDetailId: string;
    employeeLicenceDetailsUpdates: { employeeLicenceDetailsUpdate: Update<EmployeeLicenceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLicenceDetailsSearchResult: EmployeeDetailsSearchModel) { }
}

export class LoadEmployeeLicenceDetailsCompleted implements Action {
    type = EmployeeLicenceDetailsActionTypes.LoadEmployeeLicenceDetailsCompleted;
    employeeLicenceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLicenceDetails: EmployeeLicenceDetailsModel;
    employeeLicenceDetailId: string;
    employeeLicenceDetailsUpdates: { employeeLicenceDetailsUpdate: Update<EmployeeLicenceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLicenceDetailsList: EmployeeLicenceDetailsModel[]) { }
}

export class LoadEmployeeLicenceDetailsFailed implements Action {
    type = EmployeeLicenceDetailsActionTypes.CreateEmployeeLicenceDetailsFailed;
    employeeLicenceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLicenceDetailsList: EmployeeLicenceDetailsModel[];
    employeeLicenceDetails: EmployeeLicenceDetailsModel;
    employeeLicenceDetailId: string;
    employeeLicenceDetailsUpdates: { employeeLicenceDetailsUpdate: Update<EmployeeLicenceDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateEmployeeLicenceDetailsTriggered implements Action {
    type = EmployeeLicenceDetailsActionTypes.CreateEmployeeLicenceDetailsTriggered;
    employeeLicenceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLicenceDetailsList: EmployeeLicenceDetailsModel[];
    employeeLicenceDetailId: string;
    employeeLicenceDetailsUpdates: { employeeLicenceDetailsUpdate: Update<EmployeeLicenceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLicenceDetails: EmployeeLicenceDetailsModel) { }
}

export class CreateEmployeeLicenceDetailsCompleted implements Action {
    type = EmployeeLicenceDetailsActionTypes.CreateEmployeeLicenceDetailsCompleted;
    employeeLicenceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLicenceDetailsList: EmployeeLicenceDetailsModel[];
    employeeLicenceDetails: EmployeeLicenceDetailsModel;
    employeeLicenceDetailsUpdates: { employeeLicenceDetailsUpdate: Update<EmployeeLicenceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLicenceDetailId: string) { }
}

export class DeleteEmployeeLicenceDetailsCompleted implements Action {
    type = EmployeeLicenceDetailsActionTypes.DeleteEmployeeLicenceDetailsCompleted;
    employeeLicenceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLicenceDetailsList: EmployeeLicenceDetailsModel[];
    employeeLicenceDetails: EmployeeLicenceDetailsModel;
    employeeLicenceDetailsUpdates: { employeeLicenceDetailsUpdate: Update<EmployeeLicenceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLicenceDetailId: string) { }
}

export class CreateEmployeeLicenceDetailsFailed implements Action {
    type = EmployeeLicenceDetailsActionTypes.CreateEmployeeLicenceDetailsFailed;
    employeeLicenceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLicenceDetailsList: EmployeeLicenceDetailsModel[];
    employeeLicenceDetails: EmployeeLicenceDetailsModel;
    employeeLicenceDetailId: string;
    employeeLicenceDetailsUpdates: { employeeLicenceDetailsUpdate: Update<EmployeeLicenceDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}


export class GetEmployeeLicenceDetailsByIdTriggered implements Action {
    type = EmployeeLicenceDetailsActionTypes.GetEmployeeLicenceDetailsByIdTriggered;
    employeeLicenceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLicenceDetailsList: EmployeeLicenceDetailsModel[];
    employeeLicenceDetails: EmployeeLicenceDetailsModel;
    employeeLicenceDetailsUpdates: { employeeLicenceDetailsUpdate: Update<EmployeeLicenceDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLicenceDetailId: string) { }
}

export class GetEmployeeLicenceDetailsByIdCompleted implements Action {
    type = EmployeeLicenceDetailsActionTypes.GetEmployeeLicenceDetailsByIdCompleted;
    employeeLicenceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLicenceDetailsList: EmployeeLicenceDetailsModel[];
    employeeLicenceDetailId: string;
    employeeLicenceDetailsUpdates: { employeeLicenceDetailsUpdate: Update<EmployeeLicenceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLicenceDetails: EmployeeLicenceDetailsModel) { }
}

export class UpdateEmployeeLicenceDetailsById implements Action {
    type = EmployeeLicenceDetailsActionTypes.UpdateEmployeeLicenceDetailsById;
    employeeLicenceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLicenceDetailsList: EmployeeLicenceDetailsModel[];
    employeeLicenceDetailId: string;
    employeeLicenceDetails: EmployeeLicenceDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLicenceDetailsUpdates: { employeeLicenceDetailsUpdate: Update<EmployeeLicenceDetailsModel> }) { }
}


export class RefreshEmployeeLicenceDetailsList implements Action {
    type = EmployeeLicenceDetailsActionTypes.RefreshEmployeeLicenceDetailsList;
    employeeLicenceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLicenceDetailsList: EmployeeLicenceDetailsModel[];
    employeeLicenceDetailId: string;
    employeeLicenceDetailsUpdates: { employeeLicenceDetailsUpdate: Update<EmployeeLicenceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeLicenceDetails: EmployeeLicenceDetailsModel) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeLicenceDetailsActionTypes.ExceptionHandled;
    employeeLicenceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLicenceDetailsList: EmployeeLicenceDetailsModel[];
    employeeLicenceDetails: EmployeeLicenceDetailsModel;
    employeeLicenceDetailId: string;
    employeeLicenceDetailsUpdates: { employeeLicenceDetailsUpdate: Update<EmployeeLicenceDetailsModel> };
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type EmployeeLicenceDetailsActions = LoadEmployeeLicenceDetailsTriggered
    | LoadEmployeeLicenceDetailsCompleted
    | LoadEmployeeLicenceDetailsFailed
    | CreateEmployeeLicenceDetailsTriggered
    | CreateEmployeeLicenceDetailsCompleted
    | DeleteEmployeeLicenceDetailsCompleted
    | CreateEmployeeLicenceDetailsFailed
    | GetEmployeeLicenceDetailsByIdTriggered
    | GetEmployeeLicenceDetailsByIdCompleted
    | UpdateEmployeeLicenceDetailsById
    | RefreshEmployeeLicenceDetailsList
    | ExceptionHandled;