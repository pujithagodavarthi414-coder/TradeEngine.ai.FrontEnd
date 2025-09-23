import { Action } from "@ngrx/store";

import { ChangePasswordModel } from "../../models/change-password-model";


export enum ChangePasswordActionTypes {
  ChangePasswordTriggered = "[HR Widgets Change Password Component] Change Password Triggered",
  ChangePasswordCompleted = "[HR Widgets Change Password Component] Change Password Completed",
  ChangePasswordFailed = "[HR Widgets Change Password Component] Change Password Failed",
  ChangePasswordExceptionHandled = "[HR Widgets Change Password Component] Exception Handled",
}

export class ChangePasswordTriggered implements Action {
  type = ChangePasswordActionTypes.ChangePasswordTriggered;
  userId: string;
  validationMessages: any[];
  errorMessage: string;
  constructor(public changePasswordModel: ChangePasswordModel) { }
}

export class ChangePasswordCompleted implements Action {
  type = ChangePasswordActionTypes.ChangePasswordCompleted;
  changePasswordModel: ChangePasswordModel;
  validationMessages: any[];
  errorMessage: string;
  constructor(public userId: string) { }
}

export class ChangePasswordFailed implements Action {
  type = ChangePasswordActionTypes.ChangePasswordFailed;
  changePasswordModel: ChangePasswordModel;
  userId: string;
  errorMessage: string;
  constructor(public validationMessages: any[]) { }
}

export class ChangePasswordExceptionHandled implements Action {
  type = ChangePasswordActionTypes.ChangePasswordExceptionHandled;
  changePasswordModel: ChangePasswordModel;
  userId: string;
  validationMessages: any[];
  constructor(public errorMessage: string) { }
}

export type ChangePasswordActions =
  | ChangePasswordTriggered
  | ChangePasswordCompleted
  | ChangePasswordFailed
  | ChangePasswordExceptionHandled;