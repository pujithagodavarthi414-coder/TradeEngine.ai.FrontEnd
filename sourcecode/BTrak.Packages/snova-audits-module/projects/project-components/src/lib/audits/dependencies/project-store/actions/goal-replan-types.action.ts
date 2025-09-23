import { Action } from "@ngrx/store";
import { GoalReplan } from "../../models/goalReplan";
import { GoalReplanModel } from "../../models/goalReplanModel";
import { ValidationModel } from "../../models/validation-messages";

export enum GoalReplanActionsActionTypes {
  LoadGoalReplanActionsTriggered = "[SnovaAudisModule GoalReplanActions Component] Initial Data Load Triggered",
  LoadGoalReplanActionsCompleted = "[SnovaAudisModule GoalReplanActions Component] Initial Data Load Completed",
  LoadGoalReplanActionsCompletedFromCache = "[SnovaAudisModule GoalReplanActions Component] Initial Data Load Completed From Cache",
  InsertGoalReplanTriggered = "[SnovaAudisModule GoalReplanActions Component] Insert Goal Replan Triggered",
  InsertGoalReplanCompleted = "[SnovaAudisModule GoalReplanActions Component] Insert Goal Replan Completed",
  InsertGoalReplanFailed = "[SnovaAudisModule GoalReplanActions Component] Insert Goal Replan Failed"
}

export class LoadGoalReplanActionsTriggered implements Action {
  type = GoalReplanActionsActionTypes.LoadGoalReplanActionsTriggered;
  goalReplanModel: GoalReplanModel[];
  goalReplan: GoalReplan;
  goalReplanId: string;
  validationMessages: ValidationModel[];
}

// tslint:disable-next-line: max-classes-per-file
export class LoadGoalReplanActionsCompleted implements Action {
  type = GoalReplanActionsActionTypes.LoadGoalReplanActionsCompleted;
  goalReplan: GoalReplan;
  goalReplanId: string;
  validationMessages: ValidationModel[];
  constructor(public goalReplanModel: GoalReplanModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class InsertGoalReplanTriggered implements Action {
  type = GoalReplanActionsActionTypes.InsertGoalReplanTriggered;
  goalReplanId: string;
  goalReplanModel: GoalReplanModel[];
  validationMessages: ValidationModel[];
  constructor(public goalReplan: GoalReplan) {}
}

// tslint:disable-next-line: max-classes-per-file
export class InsertGoalReplanCompleted implements Action {
  type = GoalReplanActionsActionTypes.InsertGoalReplanCompleted;
  goalReplanModel: GoalReplanModel[];
  goalReplan: GoalReplan;
  validationMessages: ValidationModel[];
  constructor(public goalReplanId: string) {}
}

export class InsertGoalReplanFailed implements Action {
  type = GoalReplanActionsActionTypes.InsertGoalReplanFailed;
  goalReplanModel: GoalReplanModel[];
  goalReplan: GoalReplan;
  goalReplanId: string;
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadGoalReplanActionsCompletedFromCache implements Action {
  type = GoalReplanActionsActionTypes.LoadGoalReplanActionsCompletedFromCache;
  goalReplanModel: GoalReplanModel[];
  goalReplan: GoalReplan;
  goalReplanId: string;
  validationMessages: ValidationModel[];
  constructor() {}
}

export type GoalReplanActions =
  | LoadGoalReplanActionsTriggered
  | LoadGoalReplanActionsCompleted
  | InsertGoalReplanFailed
  | LoadGoalReplanActionsCompletedFromCache;
