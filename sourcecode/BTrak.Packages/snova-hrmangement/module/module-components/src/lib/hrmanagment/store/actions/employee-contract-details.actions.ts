import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeContractModel } from '../../models/employee-contract-model';

export enum EmployeeContractDetailsActionTypes {
    LoadEmployeeContractDetailsTriggered = '[HR Widgets Employee Contract Details Component] Initial Data Load Triggered',
    LoadEmployeeContractDetailsCompleted = '[HR Widgets Employee Contract Details Component] Initial Data Load Completed',
    LoadEmployeeContractDetailsFailed = '[HR Widgets Employee Contract Details Component] Initial Data Load Failed',
    CreateEmployeeContractDetailsTriggered = '[HR Widgets Employee Contract Details Component] Create Employee Contract Details Triggered',
    CreateEmployeeContractDetailsCompleted = '[HR Widgets Employee Contract Details Component] Create Employee Contract Details Completed',
    CreateEmployeeContractDetailsFailed = '[HR Widgets Employee Contract Details Component] Create Employee Contract Details Failed',
    GetEmployeeContractDetailsByIdTriggered = '[HR Widgets Employee Contract Details Component] Get Employee Contract Details By Id Triggered',
    GetEmployeeContractDetailsByIdCompleted = '[HR Widgets Employee Contract Details Component] Get Employee Contract Details By Id Completed',
    GetEmployeeContractDetailsByIdFailed = '[HR Widgets Employee Contract Details Component] Get Employee Contract Details By Id Failed',
    DeleteEmployeeContractDetailsCompleted = '[HR Widgets Employee Contract Details Component] Delete Employee Contract Details Completed',
    UpdateEmployeeContractDetailsById = '[HR Widgets Employee Contract Details Component] Update Employee Contract Details By Id',
    RefreshEmployeeContractDetailsList = '[HR Widgets Employee Contract Details Component] Refresh Employee Contract Details List',
    ExceptionHandled = '[HR Widgets Employee Contract Details Component] Handle Exception',
}

export class LoadEmployeeContractDetailsTriggered implements Action {
    type = EmployeeContractDetailsActionTypes.LoadEmployeeContractDetailsTriggered;
    employeeContractDetailsList: EmployeeContractModel[];
    employeeContractDetails: EmployeeContractModel;
    employeeContractDetailId: string;
    employeeContractDetailsUpdates: { employeeContractDetailsUpdate: Update<EmployeeContractModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeContractDetailsSearchResult: EmployeeDetailsSearchModel) { }
}

export class LoadEmployeeContractDetailsCompleted implements Action {
    type = EmployeeContractDetailsActionTypes.LoadEmployeeContractDetailsCompleted;
    employeeContractDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeContractDetails: EmployeeContractModel;
    employeeContractDetailId: string;
    employeeContractDetailsUpdates: { employeeContractDetailsUpdate: Update<EmployeeContractModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeContractDetailsList: EmployeeContractModel[]) { }
}

export class LoadEmployeeContractDetailsFailed implements Action {
    type = EmployeeContractDetailsActionTypes.LoadEmployeeContractDetailsFailed;
    employeeContractDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeContractDetailsList: EmployeeContractModel[];
    employeeContractDetails: EmployeeContractModel;
    employeeContractDetailId: string;
    employeeContractDetailsUpdates: { employeeContractDetailsUpdate: Update<EmployeeContractModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateEmployeeContractDetailsTriggered implements Action {
    type = EmployeeContractDetailsActionTypes.CreateEmployeeContractDetailsTriggered;
    employeeContractDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeContractDetailsList: EmployeeContractModel[];
    employeeContractDetailId: string;
    employeeContractDetailsUpdates: { employeeContractDetailsUpdate: Update<EmployeeContractModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeContractDetails: EmployeeContractModel) { }
}

export class CreateEmployeeContractDetailsCompleted implements Action {
    type = EmployeeContractDetailsActionTypes.CreateEmployeeContractDetailsCompleted;
    employeeContractDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeContractDetailsList: EmployeeContractModel[];
    employeeContractDetails: EmployeeContractModel;
    employeeContractDetailsUpdates: { employeeContractDetailsUpdate: Update<EmployeeContractModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeContractDetailId: string) { }
}

export class CreateEmployeeContractDetailsFailed implements Action {
    type = EmployeeContractDetailsActionTypes.CreateEmployeeContractDetailsFailed;
    employeeContractDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeContractDetailsList: EmployeeContractModel[];
    employeeContractDetails: EmployeeContractModel;
    employeeContractDetailId: string;
    employeeContractDetailsUpdates: { employeeContractDetailsUpdate: Update<EmployeeContractModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class GetEmployeeContractDetailsByIdTriggered implements Action {
    type = EmployeeContractDetailsActionTypes.GetEmployeeContractDetailsByIdTriggered;
    employeeContractDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeContractDetailsList: EmployeeContractModel[];
    employeeContractDetails: EmployeeContractModel;
    employeeContractDetailsUpdates: { employeeContractDetailsUpdate: Update<EmployeeContractModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeContractDetailId: string) { }
}

export class GetEmployeeContractDetailsByIdCompleted implements Action {
    type = EmployeeContractDetailsActionTypes.GetEmployeeContractDetailsByIdCompleted;
    employeeContractDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeContractDetailsList: EmployeeContractModel[];
    employeeContractDetailId: string;
    employeeContractDetailsUpdates: { employeeContractDetailsUpdate: Update<EmployeeContractModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeContractDetails: EmployeeContractModel) { }
}

export class GetEmployeeContractDetailsByIdFailed implements Action {
    type = EmployeeContractDetailsActionTypes.GetEmployeeContractDetailsByIdFailed;
    employeeContractDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeContractDetailsList: EmployeeContractModel[];
    employeeContractDetails: EmployeeContractModel;
    employeeContractDetailId: string;
    employeeContractDetailsUpdates: { employeeContractDetailsUpdate: Update<EmployeeContractModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class DeleteEmployeeContractDetailsCompleted implements Action {
    type = EmployeeContractDetailsActionTypes.DeleteEmployeeContractDetailsCompleted;
    employeeContractDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeContractDetailsList: EmployeeContractModel[];
    employeeContractDetails: EmployeeContractModel;
    employeeContractDetailsUpdates: { employeeContractDetailsUpdate: Update<EmployeeContractModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeContractDetailId: string) { }
}

export class UpdateEmployeeContractDetailsById implements Action {
    type = EmployeeContractDetailsActionTypes.UpdateEmployeeContractDetailsById;
    employeeContractDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeContractDetailsList: EmployeeContractModel[];
    employeeContractDetailId: string;
    employeeContractDetails: EmployeeContractModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeContractDetailsUpdates: { employeeContractDetailsUpdate: Update<EmployeeContractModel> }) { }
}


export class RefreshEmployeeContractDetailsList implements Action {
    type = EmployeeContractDetailsActionTypes.RefreshEmployeeContractDetailsList;
    employeeContractDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeContractDetailsList: EmployeeContractModel[];
    employeeContractDetailId: string;
    employeeContractDetailsUpdates: { employeeContractDetailsUpdate: Update<EmployeeContractModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeContractDetails: EmployeeContractModel) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeContractDetailsActionTypes.ExceptionHandled;
    employeeContractDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeContractDetailsList: EmployeeContractModel[];
    employeeContractDetails: EmployeeContractModel;
    employeeContractDetailId: string;
    employeeContractDetailsUpdates: { employeeContractDetailsUpdate: Update<EmployeeContractModel> };
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type EmployeeContractDetailsActions = LoadEmployeeContractDetailsTriggered
    | LoadEmployeeContractDetailsCompleted
    | LoadEmployeeContractDetailsFailed
    | CreateEmployeeContractDetailsTriggered
    | CreateEmployeeContractDetailsCompleted
    | CreateEmployeeContractDetailsFailed
    | GetEmployeeContractDetailsByIdTriggered
    | GetEmployeeContractDetailsByIdCompleted
    | GetEmployeeContractDetailsByIdFailed
    | DeleteEmployeeContractDetailsCompleted
    | UpdateEmployeeContractDetailsById
    | RefreshEmployeeContractDetailsList
    | ExceptionHandled;