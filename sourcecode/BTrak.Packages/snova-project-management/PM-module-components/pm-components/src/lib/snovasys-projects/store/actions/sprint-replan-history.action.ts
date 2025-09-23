import { Action } from "@ngrx/store";
import { SprintReplanHistoryModel } from "../../models/sprint-replan-history-model";

export enum SprintReplanHistoryActionTypes {
    LoadSprintReplanHistoryItemsTriggered = "[Snovasys-PM][SprintReplanHistory List Component] Initial Data Load Triggered",
    LoadSprintReplanHistoryItemsCompleted = "[Snovasys-PM][SprintReplanHistory List Component] Initial Data Load Completed",
    LoadSprintReplanHistoryItemsFailed = "[Snovasys-PM][SprintReplanHistory List Component] Initial Data Load Failed",
    SprintReplanHistoryExceptionHandled = "[Snovasys-PM][SprintReplanHistory List Component] Handle Exception"
}

export class LoadSprintReplanHistoryItemsTriggered implements Action {
    type = SprintReplanHistoryActionTypes.LoadSprintReplanHistoryItemsTriggered;
    SprintReplanHistory: SprintReplanHistoryModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public sprintId: string, public SprintReplanValue: number) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadSprintReplanHistoryItemsCompleted implements Action {
    type = SprintReplanHistoryActionTypes.LoadSprintReplanHistoryItemsCompleted;
    sprintId: string;
    SprintReplanValue: number
    validationMessages: any[];
    errorMessage: string;
    constructor(public SprintReplanHistory: SprintReplanHistoryModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadSprintReplanHistoryItemsFailed implements Action {
    type = SprintReplanHistoryActionTypes.LoadSprintReplanHistoryItemsFailed;
    sprintId: string;
    SprintReplanValue: number
    SprintReplanHistory: SprintReplanHistoryModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class SprintReplanHistoryExceptionHandled implements Action {
    type = SprintReplanHistoryActionTypes.SprintReplanHistoryExceptionHandled;
    sprintId: string;
    SprintReplanValue: number
    SprintReplanHistory: SprintReplanHistoryModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type SprintReplanHistoryActions = LoadSprintReplanHistoryItemsTriggered
    | LoadSprintReplanHistoryItemsCompleted
    | LoadSprintReplanHistoryItemsFailed
    | SprintReplanHistoryExceptionHandled
