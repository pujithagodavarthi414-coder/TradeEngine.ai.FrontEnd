import { Action } from "@ngrx/store";
import { GoalStatusDropDownData } from "../../models/goalStatusDropDown";

export enum GoalStatusActionTypes {
  LoadGoalStatusTriggered = "[Snovasys-PM][GoalStatus Component] Initial Data Load Triggered",
  LoadGoalStatusCompleted = "[Snovasys-PM][GoalStatus Component] Initial Data Load Completed",
  LoadGoalStatusCompletedFromCache = "[Snovasys-PM][GoalStatus Component] Initial Data Load Completed From Cache"
}

export class LoadGoalStatusTriggered implements Action {
  type = GoalStatusActionTypes.LoadGoalStatusTriggered;
  goalStatuses: GoalStatusDropDownData[];
}

// tslint:disable-next-line: max-classes-per-file
export class LoadGoalStatusCompleted implements Action {
  type = GoalStatusActionTypes.LoadGoalStatusCompleted;

  constructor(public goalStatuses: GoalStatusDropDownData[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadGoalStatusCompletedFromCache implements Action {
  type = GoalStatusActionTypes.LoadGoalStatusCompletedFromCache;
  goalStatuses: GoalStatusDropDownData[];
  constructor() {}
}

export type GoalStatusActions =
  | LoadGoalStatusTriggered
  | LoadGoalStatusCompleted
  | LoadGoalStatusCompletedFromCache;
