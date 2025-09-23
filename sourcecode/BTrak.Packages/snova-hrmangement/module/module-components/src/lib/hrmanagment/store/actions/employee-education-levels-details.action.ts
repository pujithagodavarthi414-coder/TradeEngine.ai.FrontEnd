import { Action } from '@ngrx/store';
import { EmployeeEducationLevelsModel } from '../../models/employee-education-levels-model';

export enum EmployeeEducationLevelsListActionTypes {
    LoadEmployeeEducationLevelsTriggered = '[HR Widgets Employee Education Levels Component] Initial Data Load Triggered',
    LoadEmployeeEducationLevelsCompleted = '[HR Widgets Employee Education Levels Component] Initial Data Load Completed',
    LoadEmployeeEducationLevelsFailed= '[HR Widgets Employee Education Levels Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets Employee Education Levels Component] Handle Exception',
}

export class LoadEmployeeEducationLevelsTriggered implements Action {
    type = EmployeeEducationLevelsListActionTypes.LoadEmployeeEducationLevelsTriggered;
    EmployeeEducationLevelsList: EmployeeEducationLevelsModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public employeeEducationLevelsSearchResult: EmployeeEducationLevelsModel) { }
}

export class LoadEmployeeEducationLevelsCompleted implements Action {
    type = EmployeeEducationLevelsListActionTypes.LoadEmployeeEducationLevelsCompleted;
    employeeEducationLevelsSearchResult: EmployeeEducationLevelsModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public EmployeeEducationLevelsList: EmployeeEducationLevelsModel[]) { }
}

export class LoadEmployeeEducationLevelsFailed implements Action {
    type = EmployeeEducationLevelsListActionTypes.LoadEmployeeEducationLevelsFailed;
    employeeEducationLevelsSearchResult: EmployeeEducationLevelsModel;
    EmployeeEducationLevelsList: EmployeeEducationLevelsModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = EmployeeEducationLevelsListActionTypes.ExceptionHandled;
    employeeEducationLevelsSearchResult: EmployeeEducationLevelsModel;
    EmployeeEducationLevelsList: EmployeeEducationLevelsModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type EmployeeEducationLevelsListActions = LoadEmployeeEducationLevelsTriggered
    | LoadEmployeeEducationLevelsCompleted
    | LoadEmployeeEducationLevelsFailed
    | ExceptionHandled