import { Action } from "@ngrx/store";
import { BoardTypeUiModel } from "../../models/boardTypeUiModel";

export enum BoardTypesUiActionTypes {
  LoadBoardTypesUiTriggered = "[Snovasys-PM][BoardTypeUi Component] Initial Data Load Triggered",
  LoadBoardTypesUiCompleted = "[Snovasys-PM][BoardTypeUi Component] Initial Data Load Completed"
}

export class LoadBoardTypesUiTriggered implements Action {
  type = BoardTypesUiActionTypes.LoadBoardTypesUiTriggered;
  boardTypesUi: BoardTypeUiModel[];
}

// tslint:disable-next-line: max-classes-per-file
export class LoadBoardTypesUiCompleted implements Action {
  type = BoardTypesUiActionTypes.LoadBoardTypesUiCompleted;

  constructor(public boardTypesUi: BoardTypeUiModel[]) {}
}

export type BoardTypeUiActions =
  | LoadBoardTypesUiTriggered
  | LoadBoardTypesUiCompleted;
