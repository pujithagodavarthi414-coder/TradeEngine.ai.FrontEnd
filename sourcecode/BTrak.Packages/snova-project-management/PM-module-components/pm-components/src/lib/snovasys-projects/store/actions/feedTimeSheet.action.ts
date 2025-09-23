import { Action } from "@ngrx/store";
import { UserModel } from '../../models/user';
import { ValidationModel } from '../../models/validation-messages';
export enum FeedTimeSheetUsersActionTypes {
  LoadFeedTimeSheetUsersTriggered = "[Snovasys-PM][FeedTimeSheet Component] Initial Data Load Triggered",
  LoadFeedTimeSheetUsersCompleted = "[Snovasys-PM][FeedTimeSheet Component] Initial Data Load Completed",
  LoadFeedTimeSheetUsersFailed = "[Snovasys-PM][FeedTimeSheet Component] Initial Data Load Failed"
}

export class LoadFeedTimeSheetUsersTriggered implements Action {
  type = FeedTimeSheetUsersActionTypes.LoadFeedTimeSheetUsersTriggered;
  userDetails: UserModel[];
  validationMessages:ValidationModel[];
  constructor(public userModel:UserModel){}
}

export class LoadFeedTimeSheetUsersCompleted implements Action {
  type = FeedTimeSheetUsersActionTypes.LoadFeedTimeSheetUsersCompleted;
  userModel:UserModel;
  validationMessages:ValidationModel[];
  constructor(public userDetails: UserModel[]) {}
}

export class LoadFeedTimeSheetUsersFailed implements Action {
  type = FeedTimeSheetUsersActionTypes.LoadFeedTimeSheetUsersFailed;
  userModel:UserModel;
  userDetails: UserModel[]
  constructor(public validationMessages:ValidationModel[]) {}
}

export type FeedTimeSheetUsersActions =
  | LoadFeedTimeSheetUsersTriggered
  | LoadFeedTimeSheetUsersCompleted
  | LoadFeedTimeSheetUsersFailed;
