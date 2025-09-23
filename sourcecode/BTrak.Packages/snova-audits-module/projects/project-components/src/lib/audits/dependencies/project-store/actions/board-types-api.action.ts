import { Action } from "@ngrx/store";
import { boardTypeapi } from "../../models/boardTypeApi";

export enum BoardTypesApiActionTypes {
  LoadBoardTypesApiTriggered = "[SnovaAudisModule BoardTypesApi Component] Initial Data Load Triggered",
  LoadBoardTypesApiCompleted = "[SnovaAudisModule BoardTypesApi Component] Initial Data Load Completed",
  ExceptionHandled = "[SnovaAudisModule BoardTypesApi Component]Exception Handled"
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
export class ExceptionHandled implements Action {
  type = BoardTypesApiActionTypes.ExceptionHandled;
  boardTypesApi: boardTypeapi[];
  constructor(public errorMessage: string) {}
}

export type BoardTypeApiActions =
  | LoadBoardTypesApiTriggered
  | LoadBoardTypesApiCompleted
  | ExceptionHandled;
