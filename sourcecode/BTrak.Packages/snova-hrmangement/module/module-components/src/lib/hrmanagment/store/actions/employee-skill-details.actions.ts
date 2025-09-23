import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeSkillDetailsModel } from '../../models/employee-skill-details-model';

export enum EmployeeSkillDetailsActionTypes {
    LoadEmployeeSkillDetailsTriggered = '[HR Widgets Employee Skill Details Component] Initial Data Load Triggered',
    LoadEmployeeSkillDetailsCompleted = '[HR Widgets Employee Skill Details Component] Initial Data Load Completed',
    LoadEmployeeSkillDetailsFailed = '[HR Widgets Employee Skill Details Component] Initial Data Load Failed',
    CreateEmployeeSkillDetailsTriggered = '[HR Widgets Employee Skill Details Component] Create Employee Skill Details Triggered',
    CreateEmployeeSkillDetailsCompleted = '[HR Widgets Employee Skill Details Component] Create Employee Skill Details Completed',
    CreateEmployeeSkillDetailsFailed = '[HR Widgets Employee Skill Details Component] Create Employee Skill Details Failed',
    GetEmployeeSkillDetailsByIdTriggered = '[HR Widgets Employee Skill Details Component] Get Employee Skill Details By Id Triggered',
    GetEmployeeSkillDetailsByIdCompleted = '[HR Widgets Employee Skill Details Component] Get Employee Skill Details By Id Completed',
    GetEmployeeSkillDetailsByIdFailed = '[HR Widgets Employee Skill Details Component] Get Employee Skill Details By Id Failed',
    DeleteEmployeeSkillDetailsCompleted = '[HR Widgets Employee Skill Details Component] Delete Employee Skill Details Completed',
    UpdateEmployeeSkillDetailsById = '[HR Widgets Employee Skill Details Component] Update Employee Skill Details By Id',
    RefreshEmployeeSkillDetailsList = '[HR Widgets Employee Skill Details Component] Refresh Employee Skill Details List',
    ExceptionHandled = '[HR Widgets Employee Skill Details Component] Handle Exception',
}

export class LoadEmployeeSkillDetailsTriggered implements Action {
    type = EmployeeSkillDetailsActionTypes.LoadEmployeeSkillDetailsTriggered;
    employeeSkillDetailsList: EmployeeSkillDetailsModel[];
    employeeSkillDetails: EmployeeSkillDetailsModel;
    employeeSkillDetailId: string;
    employeeSkillDetailsUpdates: { employeeSkillDetailsUpdate: Update<EmployeeSkillDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel) { }
}

export class LoadEmployeeSkillDetailsCompleted implements Action {
    type = EmployeeSkillDetailsActionTypes.LoadEmployeeSkillDetailsCompleted;
    employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSkillDetails: EmployeeSkillDetailsModel;
    employeeSkillDetailId: string;
    employeeSkillDetailsUpdates: { employeeSkillDetailsUpdate: Update<EmployeeSkillDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSkillDetailsList: EmployeeSkillDetailsModel[]) { }
}

export class LoadEmployeeSkillDetailsFailed implements Action {
    type = EmployeeSkillDetailsActionTypes.LoadEmployeeSkillDetailsFailed;
    employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSkillDetailsList: EmployeeSkillDetailsModel[];
    employeeSkillDetails: EmployeeSkillDetailsModel;
    employeeSkillDetailId: string;
    employeeSkillDetailsUpdates: { employeeSkillDetailsUpdate: Update<EmployeeSkillDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateEmployeeSkillDetailsTriggered implements Action {
    type = EmployeeSkillDetailsActionTypes.CreateEmployeeSkillDetailsTriggered;
    employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSkillDetailsList: EmployeeSkillDetailsModel[];
    employeeSkillDetailId: string;
    employeeSkillDetailsUpdates: { employeeSkillDetailsUpdate: Update<EmployeeSkillDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSkillDetails: EmployeeSkillDetailsModel) { }
}

export class CreateEmployeeSkillDetailsCompleted implements Action {
    type = EmployeeSkillDetailsActionTypes.CreateEmployeeSkillDetailsCompleted;
    employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSkillDetailsList: EmployeeSkillDetailsModel[];
    employeeSkillDetails: EmployeeSkillDetailsModel;
    employeeSkillDetailsUpdates: { employeeSkillDetailsUpdate: Update<EmployeeSkillDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSkillDetailId: string) { }
}

export class CreateEmployeeSkillDetailsFailed implements Action {
    type = EmployeeSkillDetailsActionTypes.CreateEmployeeSkillDetailsFailed;
    employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSkillDetailsList: EmployeeSkillDetailsModel[];
    employeeSkillDetails: EmployeeSkillDetailsModel;
    employeeSkillDetailId: string;
    employeeSkillDetailsUpdates: { employeeSkillDetailsUpdate: Update<EmployeeSkillDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class GetEmployeeSkillDetailsByIdTriggered implements Action {
    type = EmployeeSkillDetailsActionTypes.GetEmployeeSkillDetailsByIdTriggered;
    employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSkillDetailsList: EmployeeSkillDetailsModel[];
    employeeSkillDetails: EmployeeSkillDetailsModel;
    employeeSkillDetailsUpdates: { employeeSkillDetailsUpdate: Update<EmployeeSkillDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSkillDetailId: string) { }
}

export class GetEmployeeSkillDetailsByIdCompleted implements Action {
    type = EmployeeSkillDetailsActionTypes.GetEmployeeSkillDetailsByIdCompleted;
    employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSkillDetailsList: EmployeeSkillDetailsModel[];
    employeeSkillDetailId: string;
    employeeSkillDetailsUpdates: { employeeSkillDetailsUpdate: Update<EmployeeSkillDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSkillDetails: EmployeeSkillDetailsModel) { }
}

export class GetEmployeeSkillDetailsByIdFailed implements Action {
    type = EmployeeSkillDetailsActionTypes.GetEmployeeSkillDetailsByIdFailed;
    employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSkillDetailsList: EmployeeSkillDetailsModel[];
    employeeSkillDetails: EmployeeSkillDetailsModel;
    employeeSkillDetailId: string;
    employeeSkillDetailsUpdates: { employeeSkillDetailsUpdate: Update<EmployeeSkillDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class DeleteEmployeeSkillDetailsCompleted implements Action {
    type = EmployeeSkillDetailsActionTypes.DeleteEmployeeSkillDetailsCompleted;
    employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSkillDetailsList: EmployeeSkillDetailsModel[];
    employeeSkillDetails: EmployeeSkillDetailsModel;
    employeeSkillDetailsUpdates: { employeeSkillDetailsUpdate: Update<EmployeeSkillDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSkillDetailId: string) { }
}

export class UpdateEmployeeSkillDetailsById implements Action {
    type = EmployeeSkillDetailsActionTypes.UpdateEmployeeSkillDetailsById;
    employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSkillDetailsList: EmployeeSkillDetailsModel[];
    employeeSkillDetailId: string;
    employeeSkillDetails: EmployeeSkillDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSkillDetailsUpdates: { employeeSkillDetailsUpdate: Update<EmployeeSkillDetailsModel> }) { }
}


export class RefreshEmployeeSkillDetailsList implements Action {
    type = EmployeeSkillDetailsActionTypes.RefreshEmployeeSkillDetailsList;
    employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSkillDetailsList: EmployeeSkillDetailsModel[];
    employeeSkillDetailId: string;
    employeeSkillDetailsUpdates: { employeeSkillDetailsUpdate: Update<EmployeeSkillDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeSkillDetails: EmployeeSkillDetailsModel) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeSkillDetailsActionTypes.ExceptionHandled;
    employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSkillDetailsList: EmployeeSkillDetailsModel[];
    employeeSkillDetails: EmployeeSkillDetailsModel;
    employeeSkillDetailId: string;
    employeeSkillDetailsUpdates: { employeeSkillDetailsUpdate: Update<EmployeeSkillDetailsModel> };
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type EmployeeSkillDetailsActions = LoadEmployeeSkillDetailsTriggered
    | LoadEmployeeSkillDetailsCompleted
    | LoadEmployeeSkillDetailsFailed
    | CreateEmployeeSkillDetailsTriggered
    | CreateEmployeeSkillDetailsCompleted
    | CreateEmployeeSkillDetailsFailed
    | GetEmployeeSkillDetailsByIdTriggered
    | GetEmployeeSkillDetailsByIdCompleted
    | GetEmployeeSkillDetailsByIdFailed
    | DeleteEmployeeSkillDetailsCompleted
    | UpdateEmployeeSkillDetailsById
    | RefreshEmployeeSkillDetailsList
    | ExceptionHandled;