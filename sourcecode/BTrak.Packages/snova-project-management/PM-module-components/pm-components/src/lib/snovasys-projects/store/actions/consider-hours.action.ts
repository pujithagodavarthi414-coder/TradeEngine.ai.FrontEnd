import { Action } from "@ngrx/store";
import { ConsideredHours } from "../../models/ConsideredHours";

export enum ConsideredHoursActionTypes {
  LoadConsideredHoursTriggered = "[Snovasys-PM][ConsideredHours Component] Initial Data Load Triggered",
  LoadConsideredHoursCompleted = "[Snovasys-PM][ConsideredHours Component] Initial Data Load Completed",
  LoadConsideredHoursExceptionHandled = "[Snovasys-PM][ConsideredHours Component]Load Considered Hours Exception Handled"
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
export class LoadConsideredHoursExceptionHandled implements Action {
  type = ConsideredHoursActionTypes.LoadConsideredHoursExceptionHandled;
  consideredHours: ConsideredHours[];
  constructor(public errorMessage: string) {}
}

export type ConsideredHoursActions =
  | LoadConsideredHoursTriggered
  | LoadConsideredHoursCompleted
  | LoadConsideredHoursExceptionHandled;
