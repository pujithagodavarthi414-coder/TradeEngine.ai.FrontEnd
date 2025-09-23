import { Action } from "@ngrx/store";
import { BoardType } from "../../models/boardtypes";

export enum BoardTypesActionTypes {
  LoadBoardTypesTriggered = "[SnovaAudisModule BoardTypes Component] Initial Data Load Triggered",
  LoadBoardTypesCompleted = "[SnovaAudisModule BoardTypes Component] Initial Data Load Completed",
  ExceptionHandled = "[SnovaAudisModule BoardTypes Component]Exception Handled"
}

export class LoadBoardTypesTriggered implements Action {
  type = BoardTypesActionTypes.LoadBoardTypesTriggered;
  boardTypes: BoardType[];
  errorMessage: string;
}

// tslint:disable-next-line: max-classes-per-file
export class LoadBoardTypesCompleted implements Action {
  type = BoardTypesActionTypes.LoadBoardTypesCompleted;
  errorMessage: string;
  constructor(public boardTypes: BoardType[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
  type = BoardTypesActionTypes.ExceptionHandled;
  boardTypes: BoardType[];
  constructor(public errorMessage: string) {}
}

export type BoardTypeActions =
  | LoadBoardTypesTriggered
  | LoadBoardTypesCompleted
  | ExceptionHandled;
