import { Action } from '@ngrx/store';
import { DepartmentModel } from '../../models/department-model';
export enum DepartmentListActionTypes {
    LoadDepartmentListItemsTriggered = '[HR Widgets Department List Component] Initial Data Load Triggered',
    LoadDepartmentListItemsCompleted = '[HR Widgets Department List Component] Initial Data Load Completed',
    LoadDepartmentListItemsFailed = '[HR Widgets Department List Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets Department List Component] Handle Exception',
}

export class LoadDepartmentListItemsTriggered implements Action {
    type = DepartmentListActionTypes.LoadDepartmentListItemsTriggered;
    departmentList: DepartmentModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public departmentSearchResult: DepartmentModel) { }
}

export class LoadDepartmentListItemsCompleted implements Action {
    type = DepartmentListActionTypes.LoadDepartmentListItemsCompleted;
    departmentListSearchResult: DepartmentModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public departmentList: DepartmentModel[]) { }
}

export class LoadDepartmentListItemsFailed implements Action {
    type = DepartmentListActionTypes.LoadDepartmentListItemsFailed;
    departmentListSearchResult: DepartmentModel;
    departmentList: DepartmentModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = DepartmentListActionTypes.ExceptionHandled;
    departmentListSearchResult: DepartmentModel;
    departmentList: DepartmentModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type DepartmentListActions = LoadDepartmentListItemsTriggered
    | LoadDepartmentListItemsCompleted
    | LoadDepartmentListItemsFailed
    | ExceptionHandled