import { Action } from "@ngrx/store";
import { GoalReplanHistoryModel } from "../../models/goal-replan-history"

export enum GoalReplanHistoryActionTypes {
    LoadGoalReplanHistoryItemsTriggered = "[SnovaAudisModule GoalReplanHistory List Component] Initial Data Load Triggered",
    LoadGoalReplanHistoryItemsCompleted = "[SnovaAudisModule GoalReplanHistory List Component] Initial Data Load Completed",
    LoadGoalReplanHistoryItemsFailed = "[SnovaAudisModule GoalReplanHistory List Component] Initial Data Load Failed",
    ExceptionHandled = "[SnovaAudisModule GoalReplanHistory List Component] Handle Exception"
}

export class LoadGoalReplanHistoryItemsTriggered implements Action {
    type = GoalReplanHistoryActionTypes.LoadGoalReplanHistoryItemsTriggered;
    goalReplanHistory: GoalReplanHistoryModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public goalId: string, public goalReplanValue: number) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadGoalReplanHistoryItemsCompleted implements Action {
    type = GoalReplanHistoryActionTypes.LoadGoalReplanHistoryItemsCompleted;
    goalId: string;
    goalReplanValue: number
    validationMessages: any[];
    errorMessage: string;
    constructor(public goalReplanHistory: GoalReplanHistoryModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadGoalReplanHistoryItemsFailed implements Action {
    type = GoalReplanHistoryActionTypes.LoadGoalReplanHistoryItemsFailed;
    goalId: string;
    goalReplanValue: number
    goalReplanHistory: GoalReplanHistoryModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
    type = GoalReplanHistoryActionTypes.ExceptionHandled;
    goalId: string;
    goalReplanValue: number
    goalReplanHistory: GoalReplanHistoryModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type GoalReplanHistoryActions = LoadGoalReplanHistoryItemsTriggered
    | LoadGoalReplanHistoryItemsCompleted
    | LoadGoalReplanHistoryItemsFailed
    | ExceptionHandled
