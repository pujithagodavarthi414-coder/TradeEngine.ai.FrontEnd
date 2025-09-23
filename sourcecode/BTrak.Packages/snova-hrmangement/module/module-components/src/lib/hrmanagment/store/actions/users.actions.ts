import { Action } from '@ngrx/store';

import { UserDropDownModel } from '../../models/user-model';

export enum UsersActionTypes {
    LoadUsersDropDownTriggered = '[HR Widgets Users Component] Initial Data Load Triggered',
    LoadUsersDropDownCompleted = '[HR Widgets Users Component] Initial Data Load Completed',
    LoadUsersDropDownFailed = '[HR Widgets Users Component] Initial Data Load Failed',
    UsersExceptionHandled = '[HR Widgets Users Component] Handle Exception',
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

export class UsersExceptionHandled implements Action {
    type = UsersActionTypes.UsersExceptionHandled;
    searchText: string;
    usersList: UserDropDownModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type UsersActions = LoadUsersDropDownTriggered
    | LoadUsersDropDownCompleted
    | LoadUsersDropDownFailed
    | UsersExceptionHandled