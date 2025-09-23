import { Action } from '@ngrx/store';
import { UserDropDownModel } from '../../models/user-dropdown.model';

export enum UsersActionTypes {
    LoadUsersDropDownTriggered = '[Asset Management Users Component] Initial Data Load Triggered',
    LoadUsersDropDownCompleted = '[Asset Management Users Component] Initial Data Load Completed',
    LoadUsersDropDownFailed = '[Asset Management Users Component] Initial Data Load Failed',
    ExceptionHandled = '[Asset Management Users Component] Handle Exception',
}

export class LoadUsersDropDownTriggered implements Action {
    type = UsersActionTypes.LoadUsersDropDownTriggered;
    usersList: UserDropDownModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public searchText: string) { }
}

export class LoadUsersDropDownCompleted implements Action {
    type = UsersActionTypes.LoadUsersDropDownCompleted;
    searchText: string;
    validationMessages: any[];
    errorMessage: string;
    constructor(public usersList: UserDropDownModel[]) { }
}

export class LoadUsersDropDownFailed implements Action {
    type = UsersActionTypes.LoadUsersDropDownFailed;
    searchText: string;
    usersList: UserDropDownModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = UsersActionTypes.ExceptionHandled;
    searchText: string;
    usersList: UserDropDownModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type UsersActions = LoadUsersDropDownTriggered
    | LoadUsersDropDownCompleted
    | LoadUsersDropDownFailed
    | ExceptionHandled