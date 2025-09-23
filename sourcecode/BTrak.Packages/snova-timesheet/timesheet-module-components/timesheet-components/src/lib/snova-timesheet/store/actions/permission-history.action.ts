import { Action } from "@ngrx/store";
import { UserModel } from '../../models/user';
import { ValidationModel } from '../../models/validation.model';

export enum PermissionHistoryActionTypes {
  LoadPermissionHistoryUsersTriggered = "[PermissionHistory Component] Initial Data Load Triggered",
  LoadPermissionHistoryUsersCompleted = "[PermissionHistory Component] Initial Data Load Completed",
  LoadPermissionHistoryUsersFailed = "[PermissionHistory Component] Initial Data Load Failed"
}

export class LoadPermissionHistoryUsersTriggered implements Action {
  type = PermissionHistoryActionTypes.LoadPermissionHistoryUsersTriggered;
  userDetails: UserModel[];
  validationMessages: ValidationModel[];
  constructor(public userModel: UserModel) { }
}

export class LoadPermissionHistoryUsersCompleted implements Action {
  type = PermissionHistoryActionTypes.LoadPermissionHistoryUsersCompleted;
  userModel: UserModel;
  validationMessages: ValidationModel[];
  constructor(public userDetails: UserModel[]) { }
}

export class LoadPermissionHistoryUsersFailed implements Action {
  type = PermissionHistoryActionTypes.LoadPermissionHistoryUsersFailed;
  userModel: UserModel;
  userDetails: UserModel[]
  constructor(public validationMessages: ValidationModel[]) { }
}

export type PermissionHistoryUsersActions =
  | LoadPermissionHistoryUsersTriggered
  | LoadPermissionHistoryUsersCompleted
  | LoadPermissionHistoryUsersFailed;
