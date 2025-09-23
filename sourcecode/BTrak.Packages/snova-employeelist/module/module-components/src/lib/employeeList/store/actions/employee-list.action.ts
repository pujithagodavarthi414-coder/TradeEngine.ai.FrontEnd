import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { EmployeeListModel } from '../../models/employee-model';

export enum EmployeeListActionTypes {
    LoadEmployeeListItemsTriggered = '[Employee Lists Component] Initial Data Load Triggered',
    LoadEmployeeListItemsCompleted = '[Employee Lists Component] Initial Data Load Completed',
    LoadEmployeeListItemsDetailsFailed = '[Employee Lists Component] Initial Data Load Failed',
    CreateEmployeeListItemTriggered = '[Employee Lists Component] Create Employee ListTriggered',
    CreateEmployeeListItemCompleted = '[Employee Lists Component] Create Employee List Completed',
    CreateEmployeeListItemFailed = '[Employee Lists Component] Create Employee List Failed',
    GetEmployeeListDetailsByIdTriggered = '[Employee Lists Details Component] Get Employee List Details By Id Triggered',
    GetEmployeeListDetailsByIdCompleted = '[Employee Lists Details Component] Get Employee List Details By Id Completed',
    GetEmployeeListDetailsByIdFailed = '[Employee Lists Details Component] Get Employee List Details By Id Failed',
    UpdateEmployeeListDetailsById = '[Employee Lists Details Component] Update Employee List Details By Id',
    RefreshEmployeeListDetailsList = '[Employee Lists Details Component] Refresh Employee List Details List',
    ExceptionHandled = '[Employee Lists Component] Handle Exception',
    LoadAllEmployeeDetailsListItemsTriggered = "[Employee Lists Component] Initial All Employee Load Triggered",
    LoadAllEmployeeDetailsListItemsCompleted = "[Employee Lists Component] Initial All Employee Load Completed"
}

export class LoadEmployeeListItemsTriggered implements Action {
    type = EmployeeListActionTypes.LoadEmployeeListItemsTriggered;
    employeeList: EmployeeListModel[];
    employeeDetailsList: EmployeeListModel[];
    employee: EmployeeListModel;
    employeeId: string;
    employeeListDetailsUpdates: { employeeListDetailsUpdate: Update<EmployeeListModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeListSearchResult: EmployeeListModel) { }
}

export class LoadAllEmployeeDetailsListItemsTriggered implements Action {
    type = EmployeeListActionTypes.LoadAllEmployeeDetailsListItemsTriggered;
    employeeList: EmployeeListModel[];
    employeeDetailsList: EmployeeListModel[];
    employee: EmployeeListModel;
    employeeId: string;
    employeeListDetailsUpdates: { employeeListDetailsUpdate: Update<EmployeeListModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeListSearchResult: EmployeeListModel) { }
}

export class LoadEmployeeListItemsCompleted implements Action {
    type = EmployeeListActionTypes.LoadEmployeeListItemsCompleted;
    employeeListSearchResult: EmployeeListModel;
    employeeDetailsList: EmployeeListModel[];
    employee: EmployeeListModel;
    employeeId: string;
    validationMessages: any[];
    employeeListDetailsUpdates: { employeeListDetailsUpdate: Update<EmployeeListModel> }
    errorMessage: string;
    constructor(public employeeList: EmployeeListModel[]) { }
}

export class LoadAllEmployeeDetailsListItemsCompleted implements Action {
    type = EmployeeListActionTypes.LoadAllEmployeeDetailsListItemsCompleted;
    employeeListSearchResult: EmployeeListModel;
    employeeList: EmployeeListModel[];
    employee: EmployeeListModel;
    employeeId: string;
    validationMessages: any[];
    employeeListDetailsUpdates: { employeeListDetailsUpdate: Update<EmployeeListModel> }
    errorMessage: string;
    constructor(public employeeDetailsList: EmployeeListModel[]) { }
}

export class LoadEmployeeListItemsDetailsFailed implements Action {
    type = EmployeeListActionTypes.LoadEmployeeListItemsDetailsFailed;
    employeeList: EmployeeListModel[];
    employeeDetailsList: EmployeeListModel[];
    employee: EmployeeListModel;
    employeeId: string;
    employeeListDetailsUpdates: { employeeListDetailsUpdate: Update<EmployeeListModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateEmployeeListItemTriggered implements Action {
    type = EmployeeListActionTypes.CreateEmployeeListItemTriggered;
    employeeListSearchResult: EmployeeListModel;
    employeeList: EmployeeListModel[];
    employeeDetailsList: EmployeeListModel[];
    employeeId: string;
    validationMessages: any[];
    employeeListDetailsUpdates: { employeeListDetailsUpdate: Update<EmployeeListModel> }
    errorMessage: string;
    constructor(public employee: EmployeeListModel) { }
}

export class CreateEmployeeListItemCompleted implements Action {
    type = EmployeeListActionTypes.CreateEmployeeListItemCompleted;
    employeeListSearchResult: EmployeeListModel;
    employeeList: EmployeeListModel[];
    employeeDetailsList: EmployeeListModel[];
    employee: EmployeeListModel;
    validationMessages: any[];
    employeeListDetailsUpdates: { employeeListDetailsUpdate: Update<EmployeeListModel> }
    errorMessage: string;
    constructor(public employeeId: string) { }
}

export class CreateEmployeeListItemFailed implements Action {
    type = EmployeeListActionTypes.CreateEmployeeListItemFailed;
    employeeListSearchResult: EmployeeListModel;
    employeeList: EmployeeListModel[];
    employeeDetailsList: EmployeeListModel[];
    employee: EmployeeListModel;
    employeeId: string;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class GetEmployeeListDetailsByIdTriggered implements Action {
    type = EmployeeListActionTypes.GetEmployeeListDetailsByIdTriggered;
    employeeListSearchResult: EmployeeListModel;
    employeeList: EmployeeListModel[];
    employeeDetailsList: EmployeeListModel[];
    employee: EmployeeListModel;
    employeeListDetailsUpdates: { employeeListDetailsUpdate: Update<EmployeeListModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeId: string) { }
}

export class GetEmployeeListDetailsByIdCompleted implements Action {
    type = EmployeeListActionTypes.GetEmployeeListDetailsByIdCompleted;
    employeeListSearchResult: EmployeeListModel;
    employeeList: EmployeeListModel[];
    employeeDetailsList: EmployeeListModel[];
    employeeId: string;
    employeeListDetailsUpdates: { employeeListDetailsUpdate: Update<EmployeeListModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employee: EmployeeListModel) { }
}

export class UpdateEmployeeListDetailsById implements Action {
    type = EmployeeListActionTypes.UpdateEmployeeListDetailsById;
    employeeListSearchResult: EmployeeListModel;
    employeeList: EmployeeListModel[];
    employeeDetailsList: EmployeeListModel[];
    employeeId: string;
    employee: EmployeeListModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeListDetailsUpdates: { employeeListDetailsUpdate: Update<EmployeeListModel> }) { }
}

export class RefreshEmployeeListDetailsList implements Action {
    type = EmployeeListActionTypes.RefreshEmployeeListDetailsList;
    employeeListSearchResult: EmployeeListModel;
    employeeList: EmployeeListModel[];
    employeeDetailsList: EmployeeListModel[];
    employeeId: string;
    employeeListDetailsUpdates: { employeeListDetailsUpdate: Update<EmployeeListModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employee: EmployeeListModel) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeListActionTypes.ExceptionHandled;
    employeeListSearchResult: EmployeeListModel;
    employeeDetailsList: EmployeeListModel[];
    employee: EmployeeListModel;
    employeeId: string;
    employeeList: EmployeeListModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type EmployeeListActions = LoadEmployeeListItemsTriggered
    | LoadEmployeeListItemsCompleted
    | LoadEmployeeListItemsDetailsFailed
    | LoadAllEmployeeDetailsListItemsCompleted
    | LoadAllEmployeeDetailsListItemsTriggered
    | CreateEmployeeListItemCompleted
    | CreateEmployeeListItemFailed
    | CreateEmployeeListItemTriggered
    | GetEmployeeListDetailsByIdTriggered
    | GetEmployeeListDetailsByIdCompleted
    | UpdateEmployeeListDetailsById
    | RefreshEmployeeListDetailsList
    | ExceptionHandled