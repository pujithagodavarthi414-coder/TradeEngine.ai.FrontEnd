import { Action } from "@ngrx/store";
import {UserStoryHistory} from "../../models/userstory-history.model";
import { ValidationModel } from '../../models/validation-messages';

export enum UserstoryHistoryActionTypes {
    LoadUserstoryHistoryTriggered = "[Snovasys-PM][Userstory History Component] Intial Data Load Triggered",
    LoadUserstoryHistoryCompleted = "[Snovasys-PM][Userstory History Component] Intial Data Load Completed",
    LoadUserstoryHistoryFailed = "[Snovasys-PM][Userstory History Component] Intial Data Load Failed",
    UserStoryHistoryExceptionHandled = "[Snovasys-PM][Userstory History Component]Exception Handled"
}

export class LoadUserstoryHistoryTriggered implements Action {
    type = UserstoryHistoryActionTypes.LoadUserstoryHistoryTriggered
    userstoryHistoryList: UserStoryHistory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    constructor(public userstoryId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUserstoryHistoryCompleted implements Action {
    type = UserstoryHistoryActionTypes.LoadUserstoryHistoryCompleted
    userstoryId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    constructor(public userstoryHistoryList: UserStoryHistory[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUserstoryHistoryFailed implements Action {
    type = UserstoryHistoryActionTypes.LoadUserstoryHistoryFailed
    userstoryId: string;
    userstoryHistoryList: UserStoryHistory[];
    errorMessage: string;
    constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class UserStoryHistoryExceptionHandled implements Action {
    type = UserstoryHistoryActionTypes.UserStoryHistoryExceptionHandled
    userstoryId: string;
    userstoryHistoryList: UserStoryHistory[];
    validationMessages: ValidationModel[];
    constructor(public errorMessage: string) {}
}

export type UserstoryHistoryActions = LoadUserstoryHistoryTriggered
                                     |LoadUserstoryHistoryCompleted
                                     |LoadUserstoryHistoryFailed
                                     |UserStoryHistoryExceptionHandled
