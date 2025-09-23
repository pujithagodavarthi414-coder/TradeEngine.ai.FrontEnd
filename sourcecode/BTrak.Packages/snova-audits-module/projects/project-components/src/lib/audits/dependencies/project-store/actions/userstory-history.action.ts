import { Action } from "@ngrx/store";
import { ValidationModel } from "../../models/validation-messages";
import {UserStoryHistory} from "../../models/userstory-history.model";

export enum UserstoryHistoryActionTypes {
    LoadUserstoryHistoryTriggered = "[SnovaAudisModule Userstory History Component] Intial Data Load Triggered",
    LoadUserstoryHistoryCompleted = "[SnovaAudisModule Userstory History Component] Intial Data Load Completed",
    LoadUserstoryHistoryFailed = "[SnovaAudisModule Userstory History Component] Intial Data Load Failed",
    ExceptionHandled = "[SnovaAudisModule Userstory History Component]Exception Handled"
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
export class ExceptionHandled implements Action {
    type = UserstoryHistoryActionTypes.ExceptionHandled
    userstoryId: string;
    userstoryHistoryList: UserStoryHistory[];
    validationMessages: ValidationModel[];
    constructor(public errorMessage: string) {}
}

export type UserstoryHistoryActions = LoadUserstoryHistoryTriggered
                                     |LoadUserstoryHistoryCompleted
                                     |LoadUserstoryHistoryFailed
                                     |ExceptionHandled
