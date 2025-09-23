import { Action } from "@ngrx/store";
import { ValidationModel } from "../../models/validation-messages";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";

export enum UserStoryTypesActionTypes {
  LoadUserStoryTypesTriggered = "[SnovaAudisModule UserStoryTypes Component] Initial Data Load Triggered",
  LoadUserStoryTypesCompleted = "[SnovaAudisModule UserStoryTypes Component] Initial Data Load Completed",
  LoadUserStoryTypesFailed = "[SnovaAudisModule UserStoryTypes Component] Initial Data Load Failed"
}

export class LoadUserStoryTypesTriggered implements Action {
  type = UserStoryTypesActionTypes.LoadUserStoryTypesTriggered;
  userStoryTypes: UserStoryTypesModel[];
  validationMessages: ValidationModel[];
  constructor(public  userStoryTypesModel: UserStoryTypesModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUserStoryTypesCompleted implements Action {
  type = UserStoryTypesActionTypes.LoadUserStoryTypesCompleted;
  userStoryTypesModel: UserStoryTypesModel;
  validationMessages: ValidationModel[];
  constructor(public userStoryTypes: UserStoryTypesModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUserStoryTypesFailed implements Action {
  type = UserStoryTypesActionTypes.LoadUserStoryTypesFailed;
  userStoryTypes: UserStoryTypesModel[];
  userStoryTypesModel: UserStoryTypesModel;
  constructor(public validationMessages: ValidationModel[]) {}
}

export type UserStoryTypesActions =
  | LoadUserStoryTypesTriggered
  | LoadUserStoryTypesCompleted
  | LoadUserStoryTypesFailed;
