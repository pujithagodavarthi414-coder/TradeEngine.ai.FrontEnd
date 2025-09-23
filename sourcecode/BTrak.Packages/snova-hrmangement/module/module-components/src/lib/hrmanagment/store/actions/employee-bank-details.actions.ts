import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity'

import { EmployeeBankDetailsModel } from '../../models/employee-bank-details-model';

export enum EmployeeBankDetailsActionTypes {
    LoadEmployeeBankDetailsTriggered = '[HR Widgets Employee Bank Details Component] Initial Data Load Triggered',
    LoadEmployeeBankDetailsCompleted = '[HR Widgets Employee Bank Details Component] Initial Data Load Completed',
    LoadEmployeeBankDetailsFailed = '[HR Widgets Employee Bank Details Component] Initial Data Load Failed',
    CreateEmployeeBankDetailsTriggered = '[HR Widgets Employee Bank Details Component] Create Employee Bank Details Triggered',
    CreateEmployeeBankDetailsCompleted = '[HR Widgets Employee Bank Details Component] Create Employee Bank Details Completed',
    DeleteEmployeeBankDetailsCompleted = '[HR Widgets Employee Bank Details Component] Delete Employee Bank Details Completed',
    CreateEmployeeBankDetailsFailed = '[HR Widgets Employee Bank Details Component] Create Employee Bank Details Failed',
    GetEmployeeBankDetailsByIdTriggered = '[HR Widgets Employee Bank Details Component] Get Employee Bank Details By Id Triggered',
    GetEmployeeBankDetailsByIdCompleted = '[HR Widgets Employee Bank Details Component] Get Employee Bank Details By Id Completed',
    GetEmployeeBankDetailsByIdFailed = '[HR Widgets Employee Bank Details Component] Get Employee Bank Details By Id Failed',
    UpdateEmployeeBankDetailsById = '[HR Widgets Employee Bank Details Component] Update Employee Bank Details By Id',
    RefreshEmployeeBankDetailsList = '[HR Widgets Employee Bank Details Component] Refresh Employee Bank Details List',
    ExceptionHandled = '[HR Widgets Employee Bank Details Component] Handle Exception',
}

export class LoadEmployeeBankDetailsTriggered implements Action {
    type = EmployeeBankDetailsActionTypes.LoadEmployeeBankDetailsTriggered;
    employeeBankDetailsList: EmployeeBankDetailsModel[];
    employeeBankDetails: EmployeeBankDetailsModel;
    employeeBankDetailId: string;
    employeeBankDetailsUpdates: { employeeBankDetailsUpdate: Update<EmployeeBankDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeBankDetailsSearchResult: EmployeeBankDetailsModel) { }
}

export class LoadEmployeeBankDetailsCompleted implements Action {
    type = EmployeeBankDetailsActionTypes.LoadEmployeeBankDetailsCompleted;
    employeeBankDetailsSearchResult: EmployeeBankDetailsModel;
    employeeBankDetails: EmployeeBankDetailsModel;
    employeeBankDetailId: string;
    employeeBankDetailsUpdates: { employeeBankDetailsUpdate: Update<EmployeeBankDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeBankDetailsList: EmployeeBankDetailsModel[]) { }
}

export class LoadEmployeeBankDetailsFailed implements Action {
    type = EmployeeBankDetailsActionTypes.LoadEmployeeBankDetailsFailed;
    employeeBankDetailsSearchResult: EmployeeBankDetailsModel;
    employeeBankDetailsList: EmployeeBankDetailsModel[];
    employeeBankDetails: EmployeeBankDetailsModel;
    employeeBankDetailId: string;
    employeeBankDetailsUpdates: { employeeBankDetailsUpdate: Update<EmployeeBankDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateEmployeeBankDetailsTriggered implements Action {
    type = EmployeeBankDetailsActionTypes.CreateEmployeeBankDetailsTriggered;
    employeeBankDetailsSearchResult: EmployeeBankDetailsModel;
    employeeBankDetailsList: EmployeeBankDetailsModel[];
    employeeBankDetailId: string;
    employeeBankDetailsUpdates: { employeeBankDetailsUpdate: Update<EmployeeBankDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeBankDetails: EmployeeBankDetailsModel) { }
}

export class CreateEmployeeBankDetailsCompleted implements Action {
    type = EmployeeBankDetailsActionTypes.CreateEmployeeBankDetailsCompleted;
    employeeBankDetailsSearchResult: EmployeeBankDetailsModel;
    employeeBankDetailsList: EmployeeBankDetailsModel[];
    employeeBankDetails: EmployeeBankDetailsModel;
    employeeBankDetailsUpdates: { employeeBankDetailsUpdate: Update<EmployeeBankDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeBankDetailId: string) { }
}

export class DeleteEmployeeBankDetailsCompleted implements Action {
    type = EmployeeBankDetailsActionTypes.DeleteEmployeeBankDetailsCompleted;
    employeeBankDetailsSearchResult: EmployeeBankDetailsModel;
    employeeBankDetailsList: EmployeeBankDetailsModel[];
    employeeBankDetails: EmployeeBankDetailsModel;
    employeeBankDetailsUpdates: { employeeBankDetailsUpdate: Update<EmployeeBankDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeBankDetailId: string) { }
}

export class CreateEmployeeBankDetailsFailed implements Action {
    type = EmployeeBankDetailsActionTypes.CreateEmployeeBankDetailsFailed;
    employeeBankDetailsSearchResult: EmployeeBankDetailsModel;
    employeeBankDetailsList: EmployeeBankDetailsModel[];
    employeeBankDetails: EmployeeBankDetailsModel;
    employeeBankDetailId: string;
    employeeBankDetailsUpdates: { employeeBankDetailsUpdate: Update<EmployeeBankDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}


export class GetEmployeeBankDetailsByIdTriggered implements Action {
    type = EmployeeBankDetailsActionTypes.GetEmployeeBankDetailsByIdTriggered;
    employeeBankDetailsSearchResult: EmployeeBankDetailsModel;
    employeeBankDetailsList: EmployeeBankDetailsModel[];
    employeeBankDetails: EmployeeBankDetailsModel;
    employeeBankDetailsUpdates: { employeeBankDetailsUpdate: Update<EmployeeBankDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeBankDetailId: string) { }
}

export class GetEmployeeBankDetailsByIdCompleted implements Action {
    type = EmployeeBankDetailsActionTypes.GetEmployeeBankDetailsByIdCompleted;
    employeeBankDetailsSearchResult: EmployeeBankDetailsModel;
    employeeBankDetailsList: EmployeeBankDetailsModel[];
    employeeBankDetailId: string;
    employeeBankDetailsUpdates: { employeeBankDetailsUpdate: Update<EmployeeBankDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeBankDetails: EmployeeBankDetailsModel) { }
}

export class GetEmployeeBankDetailsByIdFailed implements Action {
    type = EmployeeBankDetailsActionTypes.GetEmployeeBankDetailsByIdFailed;
    employeeBankDetailsSearchResult: EmployeeBankDetailsModel;
    employeeBankDetailsList: EmployeeBankDetailsModel[];
    employeeBankDetails: EmployeeBankDetailsModel;
    employeeBankDetailId: string;
    employeeBankDetailsUpdates: { employeeBankDetailsUpdate: Update<EmployeeBankDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class UpdateEmployeeBankDetailsById implements Action {
    type = EmployeeBankDetailsActionTypes.UpdateEmployeeBankDetailsById;
    employeeBankDetailsSearchResult: EmployeeBankDetailsModel;
    employeeBankDetailsList: EmployeeBankDetailsModel[];
    employeeBankDetailId: string;
    employeeBankDetails: EmployeeBankDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeBankDetailsUpdates: { employeeBankDetailsUpdate: Update<EmployeeBankDetailsModel> }) { }
}

export class RefreshEmployeeBankDetailsList implements Action {
    type = EmployeeBankDetailsActionTypes.RefreshEmployeeBankDetailsList;
    employeeBankDetailsSearchResult: EmployeeBankDetailsModel;
    employeeBankDetailsList: EmployeeBankDetailsModel[];
    employeeBankDetailId: string;
    employeeBankDetailsUpdates: { employeeBankDetailsUpdate: Update<EmployeeBankDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeBankDetails: EmployeeBankDetailsModel) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeBankDetailsActionTypes.ExceptionHandled;
    employeeBankDetailsSearchResult: EmployeeBankDetailsModel;
    employeeBankDetailsList: EmployeeBankDetailsModel[];
    employeeBankDetails: EmployeeBankDetailsModel;
    employeeBankDetailId: string;
    employeeBankDetailsUpdates: { employeeBankDetailsUpdate: Update<EmployeeBankDetailsModel> };
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type EmployeeBankDetailsActions = LoadEmployeeBankDetailsTriggered
    | LoadEmployeeBankDetailsCompleted
    | LoadEmployeeBankDetailsFailed
    | CreateEmployeeBankDetailsTriggered
    | CreateEmployeeBankDetailsCompleted
    | DeleteEmployeeBankDetailsCompleted
    | CreateEmployeeBankDetailsFailed
    | GetEmployeeBankDetailsByIdTriggered
    | GetEmployeeBankDetailsByIdCompleted
    | GetEmployeeBankDetailsByIdFailed
    | UpdateEmployeeBankDetailsById
    | RefreshEmployeeBankDetailsList
    | ExceptionHandled;