import { Action } from "@ngrx/store";
import { SpentTimeReport } from "../../models/userstorySpentTimeModel";

export enum SpentTimeReportsActionTypes {
  LoadSpentTimeReportsTriggered = "[Snovasys-PM][SpentTimeReport Component] Initial Data Load Triggered",
  LoadSpentTimeReportsCompleted = "[Snovasys-PM][SpentTimeReport Component] Initial Data Load Completed",
  UserStorySpentTimeExceptionHandled = "[Snovasys-PM][SpentTimeReport Component] Exception Handled"
}

export class LoadSpentTimeReportsTriggered implements Action {
  type = SpentTimeReportsActionTypes.LoadSpentTimeReportsTriggered;
  spentTimeReportsList: SpentTimeReport[];
  errorMessage: string;
  constructor(public spentTimeReport: SpentTimeReport) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadSpentTimeReportsCompleted implements Action {
  type = SpentTimeReportsActionTypes.LoadSpentTimeReportsCompleted;
  errorMessage: string;
  spentTimeReport: SpentTimeReport;
  constructor(public spentTimeReportsList: SpentTimeReport[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class UserStorySpentTimeExceptionHandled implements Action {
  type = SpentTimeReportsActionTypes.UserStorySpentTimeExceptionHandled;
  spentTimeReportsList: SpentTimeReport[];
  spentTimeReport: SpentTimeReport;
  constructor(public errorMessage: string) {}
}

export type SpentTimeReportsActions =
  | LoadSpentTimeReportsTriggered
  | LoadSpentTimeReportsCompleted
  | UserStorySpentTimeExceptionHandled;
