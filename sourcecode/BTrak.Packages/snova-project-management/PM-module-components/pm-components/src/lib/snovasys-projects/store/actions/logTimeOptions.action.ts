import { Action } from "@ngrx/store";
import { LogTimeOption } from "../../models/logTimeOption";

export enum userStoryLogTimeActionTypes {
  LogTimeOptionsTriggered = "[Snovasys-PM][LogTimeOptions Component] Initial Data Load Triggered",
  LogTimeOptionsCompleted = "[Snovasys-PM][LogTimeOptions Component] Initial Data Load Completed",
  LogTimeOptionsCompletedfromCache = "[Snovasys-PM][LogTimeOptions Component] Initial Data Load Completed From Cache"
}

export class LogTimeOptionsTriggered implements Action {
  type = userStoryLogTimeActionTypes.LogTimeOptionsTriggered;
  logTimeOptions: LogTimeOption[];
}

// tslint:disable-next-line: max-classes-per-file
export class LogTimeOptionsCompleted implements Action {
  type = userStoryLogTimeActionTypes.LogTimeOptionsCompleted;

  constructor(public logTimeOptions: LogTimeOption[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LogTimeOptionsCompletedfromCache implements Action {
  type = userStoryLogTimeActionTypes.LogTimeOptionsCompletedfromCache;
  logTimeOptions: LogTimeOption[];
  constructor() {}
}

export type LogTimeOptionsActions =
  | LogTimeOptionsTriggered
  | LogTimeOptionsCompleted
  | LogTimeOptionsCompletedfromCache;
