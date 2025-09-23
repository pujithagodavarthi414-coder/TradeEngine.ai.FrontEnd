import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeMembershipDetailsModel } from '../../models/employee-Membership-details-model';



export enum EmployeeMembershipDetailsActionTypes {
    LoadEmployeeMembershipDetailsTriggered = '[HR Widgets Employee Membership Details Component] Initial Data Load Triggered',
    LoadEmployeeMembershipDetailsCompleted = '[HR Widgets Employee Membership Details Component] Initial Data Load Completed',
    LoadEmployeeMembershipDetailsFailed = '[HR Widgets Employee Membership Details Component] Initial Data Load Failed',
    CreateEmployeeMembershipDetailsTriggered = '[HR Widgets Employee Membership Details Component] Create Employee Membership Details Triggered',
    CreateEmployeeMembershipDetailsCompleted = '[HR Widgets Employee Membership Details Component] Create Employee Membership Details Completed',
    DeleteEmployeeMembershipDetailsCompleted = '[HR Widgets Employee Membership Details Component] Delete Employee Membership Details Completed',
    CreateEmployeeMembershipDetailsFailed = '[HR Widgets Employee Membership Details Component] Create Employee Membership Details Failed',
    GetEmployeeMembershipDetailsByIdTriggered = '[HR Widgets Employee Membership Details Component] Get Employee Membership Details By Id Triggered',
    GetEmployeeMembershipDetailsByIdCompleted = '[HR Widgets  Membership Details Component] Get Employee Membership Details By Id Completed',
    UpdateEmployeeMembershipDetailsById = '[HR Widgets Employee Membership Details Component] Update Employee Membership Details By Id',
    RefreshEmployeeMembershipDetailsList = '[HR Widgets Employee Membership Details Component] Refresh Employee Membership Details List',
    ExceptionHandled = '[HR Widgets Employee Membership Details Component] Handle Exception',
}

export class LoadEmployeeMembershipDetailsTriggered implements Action {
    type = EmployeeMembershipDetailsActionTypes.LoadEmployeeMembershipDetailsTriggered;
    employeeMembershipDetailsList: EmployeeMembershipDetailsModel[];
    employeeMembershipDetails: EmployeeMembershipDetailsModel;
    employeeMembershipDetailId: string;
    employeeMembershipDetailsUpdates: { employeeMembershipDetailsUpdate: Update<EmployeeMembershipDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeMembershipDetailsSearchResult: EmployeeDetailsSearchModel) { }
}

export class LoadEmployeeMembershipDetailsCompleted implements Action {
    type = EmployeeMembershipDetailsActionTypes.LoadEmployeeMembershipDetailsCompleted;
    employeeMembershipDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeMembershipDetails: EmployeeMembershipDetailsModel;
    employeeMembershipDetailId: string;
    employeeMembershipDetailsUpdates: { employeeMembershipDetailsUpdate: Update<EmployeeMembershipDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeMembershipDetailsList: EmployeeMembershipDetailsModel[]) { }
}

export class LoadEmployeeMembershipDetailsFailed implements Action {
    type = EmployeeMembershipDetailsActionTypes.LoadEmployeeMembershipDetailsFailed;
    employeeMembershipDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeMembershipDetailsList: EmployeeMembershipDetailsModel[];
    employeeMembershipDetails: EmployeeMembershipDetailsModel;
    employeeMembershipDetailId: string;
    employeeMembershipDetailsUpdates: { employeeMembershipDetailsUpdate: Update<EmployeeMembershipDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateEmployeeMembershipDetailsTriggered implements Action {
    type = EmployeeMembershipDetailsActionTypes.CreateEmployeeMembershipDetailsTriggered;
    employeeMembershipDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeMembershipDetailsList: EmployeeMembershipDetailsModel[];
    employeeMembershipDetailId: string;
    employeeMembershipDetailsUpdates: { employeeMembershipDetailsUpdate: Update<EmployeeMembershipDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeMembershipDetails: EmployeeMembershipDetailsModel) { }
}

export class CreateEmployeeMembershipDetailsCompleted implements Action {
    type = EmployeeMembershipDetailsActionTypes.CreateEmployeeMembershipDetailsCompleted;
    employeeMembershipDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeMembershipDetailsList: EmployeeMembershipDetailsModel[];
    employeeMembershipDetails: EmployeeMembershipDetailsModel;
    employeeMembershipDetailsUpdates: { employeeMembershipDetailsUpdate: Update<EmployeeMembershipDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeMembershipDetailId: string) { }
}

export class DeleteEmployeeMembershipDetailsCompleted implements Action {
    type = EmployeeMembershipDetailsActionTypes.DeleteEmployeeMembershipDetailsCompleted;
    employeeMembershipDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeMembershipDetailsList: EmployeeMembershipDetailsModel[];
    employeeMembershipDetails: EmployeeMembershipDetailsModel;
    employeeMembershipDetailsUpdates: { employeeMembershipDetailsUpdate: Update<EmployeeMembershipDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeMembershipDetailId: string) { }
}

export class CreateEmployeeMembershipDetailsFailed implements Action {
    type = EmployeeMembershipDetailsActionTypes.CreateEmployeeMembershipDetailsFailed;
    employeeMembershipDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeMembershipDetailsList: EmployeeMembershipDetailsModel[];
    employeeMembershipDetails: EmployeeMembershipDetailsModel;
    employeeMembershipDetailId: string;
    employeeMembershipDetailsUpdates: { employeeMembershipDetailsUpdate: Update<EmployeeMembershipDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}


export class GetEmployeeMembershipDetailsByIdTriggered implements Action {
    type = EmployeeMembershipDetailsActionTypes.GetEmployeeMembershipDetailsByIdTriggered;
    employeeMembershipDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeMembershipDetailsList: EmployeeMembershipDetailsModel[];
    employeeMembershipDetails: EmployeeMembershipDetailsModel;
    employeeMembershipDetailsUpdates: { employeeMembershipDetailsUpdate: Update<EmployeeMembershipDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeMembershipDetailId: string) { }
}

export class GetEmployeeMembershipDetailsByIdCompleted implements Action {
    type = EmployeeMembershipDetailsActionTypes.GetEmployeeMembershipDetailsByIdCompleted;
    employeeMembershipDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeMembershipDetailsList: EmployeeMembershipDetailsModel[];
    employeeMembershipDetailId: string;
    employeeMembershipDetailsUpdates: { employeeMembershipDetailsUpdate: Update<EmployeeMembershipDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeMembershipDetails: EmployeeMembershipDetailsModel) { }
}

export class UpdateEmployeeMembershipDetailsById implements Action {
    type = EmployeeMembershipDetailsActionTypes.UpdateEmployeeMembershipDetailsById;
    employeeMembershipDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeMembershipDetailsList: EmployeeMembershipDetailsModel[];
    employeeMembershipDetailId: string;
    employeeMembershipDetails: EmployeeMembershipDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeMembershipDetailsUpdates: { employeeMembershipDetailsUpdate: Update<EmployeeMembershipDetailsModel> }) { }
}

export class RefreshEmployeeMembershipDetailsList implements Action {
    type = EmployeeMembershipDetailsActionTypes.RefreshEmployeeMembershipDetailsList;
    employeeMembershipDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeMembershipDetailsList: EmployeeMembershipDetailsModel[];
    employeeMembershipDetailId: string;
    employeeMembershipDetailsUpdates: { employeeMembershipDetailsUpdate: Update<EmployeeMembershipDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeMembershipDetails: EmployeeMembershipDetailsModel) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeMembershipDetailsActionTypes.ExceptionHandled;
    employeeMembershipDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeMembershipDetailsList: EmployeeMembershipDetailsModel[];
    employeeMembershipDetails: EmployeeMembershipDetailsModel;
    employeeMembershipDetailId: string;
    employeeMembershipDetailsUpdates: { employeeMembershipDetailsUpdate: Update<EmployeeMembershipDetailsModel> };
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type EmployeeMembershipDetailsActions = LoadEmployeeMembershipDetailsTriggered
    | LoadEmployeeMembershipDetailsCompleted
    | LoadEmployeeMembershipDetailsFailed
    | CreateEmployeeMembershipDetailsTriggered
    | CreateEmployeeMembershipDetailsCompleted
    | DeleteEmployeeMembershipDetailsCompleted
    | CreateEmployeeMembershipDetailsFailed
    | GetEmployeeMembershipDetailsByIdTriggered
    | GetEmployeeMembershipDetailsByIdCompleted
    | UpdateEmployeeMembershipDetailsById
    | RefreshEmployeeMembershipDetailsList
    | ExceptionHandled;