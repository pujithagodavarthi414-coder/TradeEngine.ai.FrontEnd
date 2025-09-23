import { Action } from "@ngrx/store";
import { ConsideredHours } from "../../models/ConsideredHours";

export enum ConsideredHoursActionTypes {
  LoadConsideredHoursTriggered = "[SnovaAudisModule ConsideredHours Component] Initial Data Load Triggered",
  LoadConsideredHoursCompleted = "[SnovaAudisModule ConsideredHours Component] Initial Data Load Completed",
  ExceptionHandled = "[SnovaAudisModule ConsideredHours Component]Exception Handled"
}

export class LoadConsideredHoursTriggered implements Action {
  type = ConsideredHoursActionTypes.LoadConsideredHoursTriggered;
  consideredHours: ConsideredHours[];
  errorMessage: string;
}

// tslint:disable-next-line: max-classes-per-file
export class LoadConsideredHoursCompleted implements Action {
  type = ConsideredHoursActionTypes.LoadConsideredHoursCompleted;
  errorMessage: string;
  constructor(public consideredHours: ConsideredHours[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
  type = ConsideredHoursActionTypes.ExceptionHandled;
  consideredHours: ConsideredHours[];
  constructor(public errorMessage: string) {}
}

export type ConsideredHoursActions =
  | LoadConsideredHoursTriggered
  | LoadConsideredHoursCompleted
  | ExceptionHandled;
