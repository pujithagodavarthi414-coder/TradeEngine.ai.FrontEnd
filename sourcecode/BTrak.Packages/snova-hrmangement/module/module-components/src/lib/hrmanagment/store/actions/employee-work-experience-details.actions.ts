import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeWorkExperienceDetailsModel } from '../../models/employee-work-experience-details-model';

export enum EmployeeWorkExperienceDetailsActionTypes {
    LoadEmployeeWorkExperienceDetailsTriggered = '[HR Widgets Employee Work Experience Details Component] Initial Data Load Triggered',
    LoadEmployeeWorkExperienceDetailsCompleted = '[HR Widgets Employee Work Experience Details Component] Initial Data Load Completed',
    LoadEmployeeWorkExperienceDetailsFailed = '[HR Widgets Employee Work Experience Details Component] Initial Data Load Failed',
    CreateEmployeeWorkExperienceDetailsTriggered = '[HR Widgets Employee Work Experience Details Component] Create Employee Work Experience Details Triggered',
    CreateEmployeeWorkExperienceDetailsCompleted = '[HR Widgets Employee Work Experience Details Component] Create Employee Work Experience Details Completed',
    CreateEmployeeWorkExperienceDetailsFailed = '[HR Widgets Employee Work Experience Details Component] Create Employee Work Experience Details Failed',
    GetEmployeeWorkExperienceDetailsByIdTriggered = '[HR Widgets Employee Work Experience Details Component] Get Employee Work Experience Details By Id Triggered',
    GetEmployeeWorkExperienceDetailsByIdCompleted = '[HR Widgets Employee Work Experience Details Component] Get Employee Work Experience Details By Id Completed',
    GetEmployeeWorkExperienceDetailsByIdFailed = '[HR Widgets  Work Experience Details Component] Get Employee Work Experience Details By Id Failed',
    DeleteEmployeeWorkExperienceDetailsCompleted = '[HR Widgets Employee Work Experience Details Component] Delete Employee Work Experience Details Completed',
    UpdateEmployeeWorkExperienceDetailsById = '[HR Widgets Employee Work Experience Details Component] Update Employee Work Experience Details By Id',
    RefreshEmployeeWorkExperienceDetailsList = '[HR Widgets  Work Experience Details Component] Refresh Employee Work Experience Details List',
    ExceptionHandled = '[HR Widgets Employee Work Experience Details Component] Handle Exception',
}

export class LoadEmployeeWorkExperienceDetailsTriggered implements Action {
    type = EmployeeWorkExperienceDetailsActionTypes.LoadEmployeeWorkExperienceDetailsTriggered;
    employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel[];
    employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel;
    employeeWorkExperienceDetailId: string;
    employeeWorkExperienceDetailsUpdates: { employeeWorkExperienceDetailsUpdate: Update<EmployeeWorkExperienceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel) { }
}

export class LoadEmployeeWorkExperienceDetailsCompleted implements Action {
    type = EmployeeWorkExperienceDetailsActionTypes.LoadEmployeeWorkExperienceDetailsCompleted;
    employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel;
    employeeWorkExperienceDetailId: string;
    employeeWorkExperienceDetailsUpdates: { employeeWorkExperienceDetailsUpdate: Update<EmployeeWorkExperienceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel[]) { }
}

export class LoadEmployeeWorkExperienceDetailsFailed implements Action {
    type = EmployeeWorkExperienceDetailsActionTypes.LoadEmployeeWorkExperienceDetailsFailed;
    employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel[];
    employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel;
    employeeWorkExperienceDetailId: string;
    employeeWorkExperienceDetailsUpdates: { employeeWorkExperienceDetailsUpdate: Update<EmployeeWorkExperienceDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateEmployeeWorkExperienceDetailsTriggered implements Action {
    type = EmployeeWorkExperienceDetailsActionTypes.CreateEmployeeWorkExperienceDetailsTriggered;
    employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel[];
    employeeWorkExperienceDetailId: string;
    employeeWorkExperienceDetailsUpdates: { employeeWorkExperienceDetailsUpdate: Update<EmployeeWorkExperienceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel) { }
}

export class CreateEmployeeWorkExperienceDetailsCompleted implements Action {
    type = EmployeeWorkExperienceDetailsActionTypes.CreateEmployeeWorkExperienceDetailsCompleted;
    employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel[];
    employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel;
    employeeWorkExperienceDetailsUpdates: { employeeWorkExperienceDetailsUpdate: Update<EmployeeWorkExperienceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeWorkExperienceDetailId: string) { }
}

export class CreateEmployeeWorkExperienceDetailsFailed implements Action {
    type = EmployeeWorkExperienceDetailsActionTypes.CreateEmployeeWorkExperienceDetailsFailed;
    employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel[];
    employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel;
    employeeWorkExperienceDetailId: string;
    employeeWorkExperienceDetailsUpdates: { employeeWorkExperienceDetailsUpdate: Update<EmployeeWorkExperienceDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class GetEmployeeWorkExperienceDetailsByIdTriggered implements Action {
    type = EmployeeWorkExperienceDetailsActionTypes.GetEmployeeWorkExperienceDetailsByIdTriggered;
    employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel[];
    employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel;
    employeeWorkExperienceDetailsUpdates: { employeeWorkExperienceDetailsUpdate: Update<EmployeeWorkExperienceDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeWorkExperienceDetailId: string) { }
}

export class GetEmployeeWorkExperienceDetailsByIdCompleted implements Action {
    type = EmployeeWorkExperienceDetailsActionTypes.GetEmployeeWorkExperienceDetailsByIdCompleted;
    employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel[];
    employeeWorkExperienceDetailId: string;
    employeeWorkExperienceDetailsUpdates: { employeeWorkExperienceDetailsUpdate: Update<EmployeeWorkExperienceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel) { }
}

export class GetEmployeeWorkExperienceDetailsByIdFailed implements Action {
    type = EmployeeWorkExperienceDetailsActionTypes.GetEmployeeWorkExperienceDetailsByIdFailed;
    employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel[];
    employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel;
    employeeWorkExperienceDetailId: string;
    employeeWorkExperienceDetailsUpdates: { employeeWorkExperienceDetailsUpdate: Update<EmployeeWorkExperienceDetailsModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class DeleteEmployeeWorkExperienceDetailsCompleted implements Action {
    type = EmployeeWorkExperienceDetailsActionTypes.DeleteEmployeeWorkExperienceDetailsCompleted;
    employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel[];
    employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel;
    employeeWorkExperienceDetailsUpdates: { employeeWorkExperienceDetailsUpdate: Update<EmployeeWorkExperienceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeWorkExperienceDetailId: string) { }
}

export class UpdateEmployeeWorkExperienceDetailsById implements Action {
    type = EmployeeWorkExperienceDetailsActionTypes.UpdateEmployeeWorkExperienceDetailsById;
    employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel[];
    employeeWorkExperienceDetailId: string;
    employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeWorkExperienceDetailsUpdates: { employeeWorkExperienceDetailsUpdate: Update<EmployeeWorkExperienceDetailsModel> }) { }
}


export class RefreshEmployeeWorkExperienceDetailsList implements Action {
    type = EmployeeWorkExperienceDetailsActionTypes.RefreshEmployeeWorkExperienceDetailsList;
    employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel[];
    employeeWorkExperienceDetailId: string;
    employeeWorkExperienceDetailsUpdates: { employeeWorkExperienceDetailsUpdate: Update<EmployeeWorkExperienceDetailsModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeWorkExperienceDetailsActionTypes.ExceptionHandled;
    employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel[];
    employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel;
    employeeWorkExperienceDetailId: string;
    employeeWorkExperienceDetailsUpdates: { employeeWorkExperienceDetailsUpdate: Update<EmployeeWorkExperienceDetailsModel> };
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type EmployeeWorkExperienceDetailsActions = LoadEmployeeWorkExperienceDetailsTriggered
    | LoadEmployeeWorkExperienceDetailsCompleted
    | LoadEmployeeWorkExperienceDetailsFailed
    | CreateEmployeeWorkExperienceDetailsTriggered
    | CreateEmployeeWorkExperienceDetailsCompleted
    | CreateEmployeeWorkExperienceDetailsFailed
    | GetEmployeeWorkExperienceDetailsByIdTriggered
    | GetEmployeeWorkExperienceDetailsByIdCompleted
    | GetEmployeeWorkExperienceDetailsByIdFailed
    | DeleteEmployeeWorkExperienceDetailsCompleted
    | UpdateEmployeeWorkExperienceDetailsById
    | RefreshEmployeeWorkExperienceDetailsList
    | ExceptionHandled;