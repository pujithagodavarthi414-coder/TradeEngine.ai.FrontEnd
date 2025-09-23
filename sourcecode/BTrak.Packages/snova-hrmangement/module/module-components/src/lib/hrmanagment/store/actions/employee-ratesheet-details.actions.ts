import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeRateSheetModel } from '../../models/employee-ratesheet-model';
import { EmployeeRateSheetInsertModel } from '../../models/employee-ratesheet-insert-model';

export enum EmployeeRateSheetDetailsActionTypes {
    LoadEmployeeRateSheetDetailsTriggered = '[HR Widgets Employee Rate Sheet Details Component] Initial Data Load Triggered',
    LoadEmployeeRateSheetDetailsCompleted = '[HR Widgets Employee Rate Sheet Details Component] Initial Data Load Completed',
    LoadEmployeeRateSheetDetailsFailed = '[HR Widgets Employee Rate Sheet Details Component] Initial Data Load Failed',
    CreateEmployeeRateSheetDetailsTriggered = '[HR Widgets Employee Rate Sheet Details Component] Create Employee Rate Sheet Details Triggered',
    CreateEmployeeRateSheetDetailsCompleted = '[HR Widgets Employee Rate Sheet Details Component] Create Employee Rate Sheet Details Completed',
    CreateEmployeeRateSheetDetailsFailed = '[HR Widgets Employee Rate Sheet Details Component] Create Employee Rate Sheet Details Failed',
    UpdateEmployeeRateSheetDetailsTriggered = '[HR Widgets Employee Rate Sheet Details Component] Update Employee Rate Sheet Details Triggered',
    UpdateEmployeeRateSheetDetailsCompleted = '[HR Widgets  Rate Sheet Details Component] Update Employee Rate Sheet Details Completed',
    UpdateEmployeeRateSheetDetailsFailed = '[HR Widgets Employee Rate Sheet Details Component] Update Employee Rate Sheet Details Failed',
    DeleteEmployeeRateSheetDetailsCompleted = '[HR Widgets Employee Rate Sheet Details Component] Delete Employee Rate Sheet Details Completed',
    GetEmployeeRateSheetDetailsByIdTriggered = '[HR Widgets Employee Rate Sheet Details Component] Get Employee Rate Sheet Details By Id Triggered',
    GetEmployeeRateSheetDetailsByIdCompleted = '[HR Widgets  Rate Sheet Details Component] Get Employee Rate Sheet Details By Id Completed',
    GetEmployeeRateSheetDetailsByIdFailed = '[HR Widgets Employee Rate Sheet Details Component] Get Employee Rate Sheet Details By Id Failed',
    UpdateEmployeeRateSheetDetailsById = '[HR Widgets Employee Rate Sheet Details Component] Update Employee Rate Sheet Details By Id',
    RefreshEmployeeRateSheetDetailsList = '[HR Widgets  Rate Sheet Details Component] Refresh Employee Rate Sheet Details List',
    ExceptionHandled = '[HR Widgets Employee Rate Sheet Details Component] Handle Exception',
}

export class LoadEmployeeRateSheetDetailsTriggered implements Action {
    type = EmployeeRateSheetDetailsActionTypes.LoadEmployeeRateSheetDetailsTriggered;
    validationMessages: any[];
    errorMessage: string;
    employeeRateSheetID: string;
    employeeRateSheet: EmployeeRateSheetModel;
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadEmployeeRateSheetDetailsCompleted implements Action {
    type = EmployeeRateSheetDetailsActionTypes.LoadEmployeeRateSheetDetailsCompleted;
    validationMessages: any[];
    errorMessage: string;
    employeeRateSheetID: string;
    employeeRateSheet: EmployeeRateSheetModel;
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public employeeRateSheetDetails: EmployeeRateSheetModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadEmployeeRateSheetDetailsFailed implements Action {
    type = EmployeeRateSheetDetailsActionTypes.LoadEmployeeRateSheetDetailsFailed;
    errorMessage: string;
    employeeRateSheetID: string;
    employeeRateSheet: EmployeeRateSheetModel;
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class CreateEmployeeRateSheetDetailsTriggered implements Action {
    type = EmployeeRateSheetDetailsActionTypes.CreateEmployeeRateSheetDetailsTriggered;
    errorMessage: string;
    validationMessages: any[];
    employeeRateSheetID: string;
    employeeRateSheet: EmployeeRateSheetModel
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    constructor(public employeeRateSheetInsertModel: EmployeeRateSheetInsertModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class CreateEmployeeRateSheetDetailsCompleted implements Action {
    type = EmployeeRateSheetDetailsActionTypes.CreateEmployeeRateSheetDetailsCompleted;
    errorMessage: string;
    validationMessages: any[];
    employeeRateSheet: EmployeeRateSheetModel
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public employeeRateSheetID: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class CreateEmployeeRateSheetDetailsFailed implements Action {
    type = EmployeeRateSheetDetailsActionTypes.CreateEmployeeRateSheetDetailsFailed;
    errorMessage: string;
    employeeRateSheetID: string;
    employeeRateSheet: EmployeeRateSheetModel
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateEmployeeRateSheetDetailsTriggered implements Action {
    type = EmployeeRateSheetDetailsActionTypes.UpdateEmployeeRateSheetDetailsTriggered;
    errorMessage: string;
    validationMessages: any[];
    employeeRateSheetID: string;
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public employeeRateSheet: EmployeeRateSheetModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateEmployeeRateSheetDetailsCompleted implements Action {
    type = EmployeeRateSheetDetailsActionTypes.UpdateEmployeeRateSheetDetailsCompleted;
    errorMessage: string;
    validationMessages: any[];
    employeeRateSheet: EmployeeRateSheetModel
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public employeeRateSheetID: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateEmployeeRateSheetDetailsFailed implements Action {
    type = EmployeeRateSheetDetailsActionTypes.UpdateEmployeeRateSheetDetailsFailed;
    errorMessage: string;
    employeeRateSheetID: string;
    employeeRateSheet: EmployeeRateSheetModel
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public validationMessages: any[]) { }
}
// tslint:disable-next-line: max-classes-per-file
export class DeleteEmployeeRateSheetDetailsCompleted implements Action {
    type = EmployeeRateSheetDetailsActionTypes.DeleteEmployeeRateSheetDetailsCompleted;
    errorMessage: string;
    validationMessages: any[];
    employeeRateSheet: EmployeeRateSheetModel
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public employeeRateSheetID: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetEmployeeRateSheetDetailsByIdTriggered implements Action {
    type = EmployeeRateSheetDetailsActionTypes.GetEmployeeRateSheetDetailsByIdTriggered;
    errorMessage: string;
    validationMessages: any[];
    employeeRateSheet: EmployeeRateSheetModel
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public employeeRateSheetID: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetEmployeeRateSheetDetailsByIdCompleted implements Action {
    type = EmployeeRateSheetDetailsActionTypes.GetEmployeeRateSheetDetailsByIdCompleted;
    errorMessage: string;
    validationMessages: any[];
    employeeRateSheetID: string;
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public employeeRateSheet: EmployeeRateSheetModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetEmployeeRateSheetDetailsByIdFailed implements Action {
    type = EmployeeRateSheetDetailsActionTypes.GetEmployeeRateSheetDetailsByIdFailed;
    errorMessage: string;
    employeeRateSheetID: string;
    employeeRateSheet: EmployeeRateSheetModel;
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateEmployeeRateSheetDetailsById implements Action {
    type = EmployeeRateSheetDetailsActionTypes.UpdateEmployeeRateSheetDetailsById;
    errorMessage: string;
    validationMessages: any[]
    employeeRateSheetID: string;
    employeeRateSheet: EmployeeRateSheetModel;
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> }) { }
}

// tslint:disable-next-line: max-classes-per-file
export class RefreshEmployeeRateSheetDetailsList implements Action {
    type = EmployeeRateSheetDetailsActionTypes.RefreshEmployeeRateSheetDetailsList;
    errorMessage: string;
    validationMessages: any[];
    employeeRateSheetID: string;
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public employeeRateSheet: EmployeeRateSheetModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
    type = EmployeeRateSheetDetailsActionTypes.ExceptionHandled;
    validationMessages: any[];
    employeeRateSheetID: string;
    employeeRateSheet: EmployeeRateSheetModel;
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetUpdates: { employeeRateSheetUpdate: Update<EmployeeRateSheetModel> };
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    constructor(public errorMessage: string) { }
}

export type EmployeeRateSheetDetailsActions = LoadEmployeeRateSheetDetailsTriggered
    | LoadEmployeeRateSheetDetailsCompleted
    | LoadEmployeeRateSheetDetailsFailed
    | CreateEmployeeRateSheetDetailsTriggered
    | CreateEmployeeRateSheetDetailsCompleted
    | DeleteEmployeeRateSheetDetailsCompleted
    | CreateEmployeeRateSheetDetailsFailed
    | UpdateEmployeeRateSheetDetailsTriggered
    | UpdateEmployeeRateSheetDetailsCompleted
    | UpdateEmployeeRateSheetDetailsFailed
    | GetEmployeeRateSheetDetailsByIdTriggered
    | GetEmployeeRateSheetDetailsByIdCompleted
    | GetEmployeeRateSheetDetailsByIdFailed
    | UpdateEmployeeRateSheetDetailsById
    | RefreshEmployeeRateSheetDetailsList
    | ExceptionHandled;
