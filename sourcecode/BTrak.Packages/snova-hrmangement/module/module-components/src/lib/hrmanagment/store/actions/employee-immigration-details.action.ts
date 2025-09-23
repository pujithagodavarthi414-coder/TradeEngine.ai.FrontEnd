import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeImmigrationDetailsModel } from '../../models/employee-immigration-details-model';


export enum EmployeeImmigrationDetailsActionTypes {
    LoadEmployeeImmigrationDetailsTriggered = '[HR Widgets Employee Immigration Details Component] Initial Data Load Triggered',
    LoadEmployeeImmigrationDetailsCompleted = '[HR Widgets Employee Immigration Details Component] Initial Data Load Completed',
    LoadEmployeeImmigrationDetailsFailed = '[HR Widgets Employee Immigration Details Component] Initial Data Load Failed',
    CreateEmployeeImmigrationDetailsTriggered = '[HR Widgets Employee Immigration Details Component] Create Employee Immigration Details Triggered',
    CreateEmployeeImmigrationDetailsCompleted = '[HR Widgets Employee Immigration Details Component] Create Employee Immigration Details Completed',
    CreateEmployeeImmigrationDetailsFailed = '[HR Widgets Employee Immigration Details Component] Create Employee Immigration Details Failed',
    DeleteEmployeeImmigrationDetailsCompleted = '[HR Widgets Employee Immigration Details Component] Delete Employee Immigration Details Completed',
    GetEmployeeImmigrationDetailsByIdTriggered = '[HR Widgets Employee Immigration Details Component] Get Employee Immigration Details By Id Triggered',
    GetEmployeeImmigrationDetailsByIdCompleted = '[HR Widgets Employee Immigration Details Component] Get Employee Immigration Details By Id Completed',
    UpdateEmployeeImmigrationDetailsById = '[HR Widgets Employee Immigration Details Component] Update Employee Immigration Details By Id',
    RefreshEmployeeImmigrationDetailsList = '[HR Widgets Employee Immigration Details Component] Refresh Employee Immigration Details List',
    ExceptionHandled = '[HR Widgets Employee Immigration Details Component] Handle Exception',
}

export class LoadEmployeeImmigrationDetailsTriggered implements Action {
    type = EmployeeImmigrationDetailsActionTypes.LoadEmployeeImmigrationDetailsTriggered;
    employeeImmigrationDetailsList: EmployeeImmigrationDetailsModel[];
    employeeImmigrationDetails: EmployeeImmigrationDetailsModel;
    employeeImmigrationDetailId: string;
    employeeImmigrationDetailsUpdates: { employeeImmigrationDetailsUpdate: Update<EmployeeImmigrationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeImmigrationDetailsSearchResult: EmployeeDetailsSearchModel) { }
}

export class LoadEmployeeImmigrationDetailsCompleted implements Action {
    type = EmployeeImmigrationDetailsActionTypes.LoadEmployeeImmigrationDetailsCompleted;
    employeeImmigrationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeImmigrationDetails: EmployeeImmigrationDetailsModel;
    employeeImmigrationDetailId: string;
    employeeImmigrationDetailsUpdates: { employeeImmigrationDetailsUpdate: Update<EmployeeImmigrationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeImmigrationDetailsList: EmployeeImmigrationDetailsModel[]) { }
}

export class LoadEmployeeImmigrationDetailsFailed implements Action {
    type = EmployeeImmigrationDetailsActionTypes.LoadEmployeeImmigrationDetailsFailed;
    employeeImmigrationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeImmigrationDetailsList: EmployeeImmigrationDetailsModel[];
    employeeImmigrationDetails: EmployeeImmigrationDetailsModel;
    employeeImmigrationDetailId: string;
    employeeImmigrationDetailsUpdates: { employeeImmigrationDetailsUpdate: Update<EmployeeImmigrationDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateEmployeeImmigrationDetailsTriggered implements Action {
    type = EmployeeImmigrationDetailsActionTypes.CreateEmployeeImmigrationDetailsTriggered;
    employeeImmigrationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeImmigrationDetailsList: EmployeeImmigrationDetailsModel[];
    employeeImmigrationDetailId: string;
    employeeImmigrationDetailsUpdates: { employeeImmigrationDetailsUpdate: Update<EmployeeImmigrationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeImmigrationDetails: EmployeeImmigrationDetailsModel) { }
}

export class CreateEmployeeImmigrationDetailsCompleted implements Action {
    type = EmployeeImmigrationDetailsActionTypes.CreateEmployeeImmigrationDetailsCompleted;
    employeeImmigrationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeImmigrationDetailsList: EmployeeImmigrationDetailsModel[];
    employeeImmigrationDetails: EmployeeImmigrationDetailsModel;
    employeeImmigrationDetailsUpdates: { employeeImmigrationDetailsUpdate: Update<EmployeeImmigrationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeImmigrationDetailId: string) { }
}

export class DeleteEmployeeImmigrationDetailsCompleted implements Action {
    type = EmployeeImmigrationDetailsActionTypes.DeleteEmployeeImmigrationDetailsCompleted;
    employeeImmigrationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeImmigrationDetailsList: EmployeeImmigrationDetailsModel[];
    employeeImmigrationDetails: EmployeeImmigrationDetailsModel;
    employeeImmigrationDetailsUpdates: { employeeImmigrationDetailsUpdate: Update<EmployeeImmigrationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeImmigrationDetailId: string) { }
}

export class CreateEmployeeImmigrationDetailsFailed implements Action {
    type = EmployeeImmigrationDetailsActionTypes.CreateEmployeeImmigrationDetailsFailed;
    employeeImmigrationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeImmigrationDetailsList: EmployeeImmigrationDetailsModel[];
    employeeImmigrationDetails: EmployeeImmigrationDetailsModel;
    employeeImmigrationDetailId: string;
    employeeImmigrationDetailsUpdates: { employeeImmigrationDetailsUpdate: Update<EmployeeImmigrationDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}


export class GetEmployeeImmigrationDetailsByIdTriggered implements Action {
    type = EmployeeImmigrationDetailsActionTypes.GetEmployeeImmigrationDetailsByIdTriggered;
    employeeImmigrationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeImmigrationDetailsList: EmployeeImmigrationDetailsModel[];
    employeeImmigrationDetails: EmployeeImmigrationDetailsModel;
    employeeImmigrationDetailsUpdates: { employeeImmigrationDetailsUpdate: Update<EmployeeImmigrationDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeImmigrationDetailId: string) { }
}

export class GetEmployeeImmigrationDetailsByIdCompleted implements Action {
    type = EmployeeImmigrationDetailsActionTypes.GetEmployeeImmigrationDetailsByIdCompleted;
    employeeImmigrationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeImmigrationDetailsList: EmployeeImmigrationDetailsModel[];
    employeeImmigrationDetailId: string;
    employeeImmigrationDetailsUpdates: { employeeImmigrationDetailsUpdate: Update<EmployeeImmigrationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeImmigrationDetails: EmployeeImmigrationDetailsModel) { }
}

export class UpdateEmployeeImmigrationDetailsById implements Action {
    type = EmployeeImmigrationDetailsActionTypes.UpdateEmployeeImmigrationDetailsById;
    employeeImmigrationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeImmigrationDetailsList: EmployeeImmigrationDetailsModel[];
    employeeImmigrationDetailId: string;
    employeeImmigrationDetails: EmployeeImmigrationDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeImmigrationDetailsUpdates: { employeeImmigrationDetailsUpdate: Update<EmployeeImmigrationDetailsModel> }) { }
}

export class RefreshEmployeeImmigrationDetailsList implements Action {
    type = EmployeeImmigrationDetailsActionTypes.RefreshEmployeeImmigrationDetailsList;
    employeeImmigrationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeImmigrationDetailsList: EmployeeImmigrationDetailsModel[];
    employeeImmigrationDetailId: string;
    employeeImmigrationDetailsUpdates: { employeeImmigrationDetailsUpdate: Update<EmployeeImmigrationDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeImmigrationDetails: EmployeeImmigrationDetailsModel) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeImmigrationDetailsActionTypes.ExceptionHandled;
    employeeImmigrationDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeImmigrationDetailsList: EmployeeImmigrationDetailsModel[];
    employeeImmigrationDetails: EmployeeImmigrationDetailsModel;
    employeeImmigrationDetailId: string;
    employeeImmigrationDetailsUpdates: { employeeImmigrationDetailsUpdate: Update<EmployeeImmigrationDetailsModel> };
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type EmployeeImmigrationDetailsActions = LoadEmployeeImmigrationDetailsTriggered
    | LoadEmployeeImmigrationDetailsCompleted
    | LoadEmployeeImmigrationDetailsFailed
    | CreateEmployeeImmigrationDetailsTriggered
    | CreateEmployeeImmigrationDetailsCompleted
    | DeleteEmployeeImmigrationDetailsCompleted
    | CreateEmployeeImmigrationDetailsFailed
    | GetEmployeeImmigrationDetailsByIdTriggered
    | GetEmployeeImmigrationDetailsByIdCompleted
    | UpdateEmployeeImmigrationDetailsById
    | RefreshEmployeeImmigrationDetailsList
    | ExceptionHandled;