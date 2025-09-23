import { Action } from "@ngrx/store";
import { ValidationModel } from "../../models/validation-messages";
import { User } from "../../models/user";

export enum AdhocUsersActionTypes {
    GetAdhocUsersTriggered = "[Snovasys-PM][Adhocwork Component ]Create Adhoc Users Triggered",
    GetAdhocUsersCompleted = "[Snovasys-PM][Adhocwork Component ]Create Adhoc Users Completed",
    AdhocUsersExceptionHandled  = "[Snovasys-PM][Adhocwork Component]Exception Handled",
}

export class GetAdhocUsersTriggered implements Action {
    type = AdhocUsersActionTypes.GetAdhocUsersTriggered
    validationMessages:ValidationModel[];
    errorMessage:string;
    users: User[];
    constructor(public searchText:string, public isUserStoryDropDown: boolean){}
}

export class GetAdhocUsersCompleted implements Action{
    type = AdhocUsersActionTypes.GetAdhocUsersCompleted
    validationMessages:ValidationModel[];
    isUserStoryDropDown: boolean;
    errorMessage:string;
    searchText: string;
    constructor(public users: User[]){}
}

export class AdhocUsersExceptionHandled implements Action {
    type = AdhocUsersActionTypes.AdhocUsersExceptionHandled
    validationMessages:ValidationModel[];
    isUserStoryDropDown: boolean;
    users: User[];
    constructor(public errorMessage:string){}
}

export type AdhocUsersActions = GetAdhocUsersCompleted | GetAdhocUsersTriggered | AdhocUsersExceptionHandled