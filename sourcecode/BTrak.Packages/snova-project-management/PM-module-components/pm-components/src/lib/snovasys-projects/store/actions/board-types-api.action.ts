import { Action } from "@ngrx/store";
import { boardTypeapi } from "../../models/boardTypeApi";

export enum BoardTypesApiActionTypes {
  LoadBoardTypesApiTriggered = "[Snovasys-PM][BoardTypesApi Component] Initial Data Load Triggered",
  LoadBoardTypesApiCompleted = "[Snovasys-PM][BoardTypesApi Component] Initial Data Load Completed",
  LoadBoardTypesExceptionHandled = "[Snovasys-PM][BoardTypesApi Component]Load Board Types Exception Handled"
}

export class LoadBoardTypesApiTriggered implements Action {
  type = BoardTypesApiActionTypes.LoadBoardTypesApiTriggered;
  boardTypesApi: boardTypeapi[];
  errorMessage: string;
}

// tslint:disable-next-line: max-classes-per-file
export class LoadBoardTypesApiCompleted implements Action {
  type = BoardTypesApiActionTypes.LoadBoardTypesApiCompleted;
  errorMessage: string;
  constructor(public boardTypesApi: boardTypeapi[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadBoardTypesExceptionHandled implements Action {
  type = BoardTypesApiActionTypes.LoadBoardTypesExceptionHandled;
  boardTypesApi: boardTypeapi[];
  constructor(public errorMessage: string) {}
}

export type BoardTypeApiActions =
  | LoadBoardTypesApiTriggered
  | LoadBoardTypesApiCompleted
  | LoadBoardTypesExceptionHandled;
