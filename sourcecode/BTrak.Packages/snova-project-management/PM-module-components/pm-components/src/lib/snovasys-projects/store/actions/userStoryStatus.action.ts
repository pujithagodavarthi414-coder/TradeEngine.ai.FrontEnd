import { Action } from "@ngrx/store";
import { StatusesModel } from "../../models/workflowStatusesModel";

export enum UserStoryStatusActionTypes {
  LoadUserStoryStatusTriggered = "[Snovasys-PM][UserStoryStatus Component] Initial Data Load Triggered",
  LoadUserStoryStatusCompleted = "[Snovasys-PM][UserStoryStatus Component] Initial Data Load Completed"
}

export class LoadUserStoryStatusTriggered implements Action {
  type = UserStoryStatusActionTypes.LoadUserStoryStatusTriggered;
  userStoryStatus: StatusesModel[];
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUserStoryStatusCompleted implements Action {
  type = UserStoryStatusActionTypes.LoadUserStoryStatusCompleted;

  constructor(public userStoryStatus: StatusesModel[]) {}
}

export type UserStoryStatusActions =
  | LoadUserStoryStatusTriggered
  | LoadUserStoryStatusCompleted;
