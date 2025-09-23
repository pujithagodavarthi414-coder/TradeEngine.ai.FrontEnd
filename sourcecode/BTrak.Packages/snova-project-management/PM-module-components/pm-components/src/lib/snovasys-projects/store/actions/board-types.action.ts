import { Action } from "@ngrx/store";
import { BoardType } from "../../models/boardtypes";

export enum BoardTypesActionTypes {
  LoadBoardTypesTriggered = "[Snovasys-PM][BoardTypes Component] Initial Data Load Triggered",
  LoadBoardTypesCompleted = "[Snovasys-PM][BoardTypes Component] Initial Data Load Completed",
  BoardTypesExceptionHandled = "[Snovasys-PM][BoardTypes Component]BoardTypes Exception Handled"
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
export class BoardTypesExceptionHandled implements Action {
  type = BoardTypesActionTypes.BoardTypesExceptionHandled;
  boardTypes: BoardType[];
  constructor(public errorMessage: string) {}
}

export type BoardTypeActions =
  | LoadBoardTypesTriggered
  | LoadBoardTypesCompleted
  | BoardTypesExceptionHandled;
