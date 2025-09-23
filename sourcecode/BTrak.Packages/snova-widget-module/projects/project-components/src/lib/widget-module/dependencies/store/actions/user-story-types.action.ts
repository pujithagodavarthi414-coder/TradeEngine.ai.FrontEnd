import { Action } from "@ngrx/store";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { ValidationModel } from '../../models/validation-messages';

export enum UserStoryTypesActionTypes {
  LoadUserStoryTypesTriggered = "[UserStoryTypes Component] Initial Data Load Triggered",
  LoadUserStoryTypesCompleted = "[UserStoryTypes Component] Initial Data Load Completed",
  LoadUserStoryTypesFailed = "[UserStoryTypes Component] Initial Data Load Failed"
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
