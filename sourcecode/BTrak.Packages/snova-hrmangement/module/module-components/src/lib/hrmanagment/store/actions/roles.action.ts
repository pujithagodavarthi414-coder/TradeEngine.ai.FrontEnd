import { Action } from '@ngrx/store';
import { RoleModel } from '../../models/role-model';

export enum RolesListActionTypes {
    LoadRolesTriggered = '[HR Widgets Roles Component] Initial Data Load Triggered',
    LoadRolesCompleted = '[HR Widgets Roles Component] Initial Data Load Completed',
    LoadRolesFailed= '[HR Widgets Roles Component] Initial Data Load Failed',
    RolesExceptionHandled = '[HR Widgets Roles Component] Handle Exception',
}

export class LoadRolesTriggered implements Action {
    type = RolesListActionTypes.LoadRolesTriggered;
    RolesList: RoleModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public RolesSearchResult: RoleModel) { }
}

export class LoadRolesCompleted implements Action {
    type = RolesListActionTypes.LoadRolesCompleted;
    RolesSearchResult: RoleModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public RolesList: RoleModel[]) { }
}

export class LoadRolesFailed implements Action {
    type = RolesListActionTypes.LoadRolesFailed;
    RolesSearchResult: RoleModel;
    RolesList: RoleModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class RolesExceptionHandled implements Action {
    type = RolesListActionTypes.RolesExceptionHandled;
    RolesSearchResult: RoleModel;
    RolesList: RoleModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type RolesListActions = LoadRolesTriggered
    | LoadRolesCompleted
    | LoadRolesFailed
    | RolesExceptionHandled