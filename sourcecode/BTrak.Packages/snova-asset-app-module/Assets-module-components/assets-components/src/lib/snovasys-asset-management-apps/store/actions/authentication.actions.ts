import { Action } from "@ngrx/store";
import { ValidationModel } from '../../models/validation-messages';
import { CompanysettingsModel } from '../../models/company-model';
import { UserModel } from '../../models/user-model';

export enum AuthenticationActionTypes {
  UserDetailsFetching = "[Asset Apps Authentication] Fetching User Details",
  UserDetailsFetched = "[Asset Apps Authentication] Fetched User Details",
  RoleDetailsFetchOnReload = "[Asset Apps Authentication] Role Details Fetched On Reload",
  RoleDetailsFetched = "[Asset Apps Authentication] Role Details Fetched",
  RolesFetchTriggered = "[Asset Apps Authentication] Fetching Roles Triggered",
  RolesFetchFailed = '[Asset Apps Authentication] Fetching Roles Failed',
  AuthenticationExceptionHandled = '[Asset Apps Authentication] Exception Handling',
  GetCompanySettingsTriggered = "[Asset Apps Authentication] Get Company Settings Triggered",
  GetCompanySettingsCompleted = "[Asset Apps Authentication] Get Company Settings Completed",
  GetCompanySettingsFailed = "[Asset Apps Authentication] Get Company Settings Failed",
}

export class UserDetailsFetched implements Action {
  type = AuthenticationActionTypes.UserDetailsFetched;
  public userName: string;
  public userToken: string;
  public userId: string;
  public password: string;
  public errorMessage: string;
  public isStartEnabled: boolean;
  public loginData: any;
  constructor(public userModel: UserModel) { }
}

export class UserDetailsFetching implements Action {
  type = AuthenticationActionTypes.UserDetailsFetching;
  public userName: string;
  public userToken: string;
  public userId: string;
  public password: string;
  public errorMessage: string;
  public isStartEnabled: boolean;
  public userModel: UserModel
  constructor(
    public loginData: any) { }
}

export class RoleDetailsFetched implements Action {
  type = AuthenticationActionTypes.RoleDetailsFetched;

  constructor(public roleFeatures: any[]) { }
}

export class RoleDetailsFetchOnReload implements Action {
  type = AuthenticationActionTypes.RoleDetailsFetchOnReload;

  constructor() { }
}

export class RolesFetchTriggered implements Action {
  type = AuthenticationActionTypes.RolesFetchTriggered;

  constructor() { }
}

export class RolesFetchFailed implements Action {
  type = AuthenticationActionTypes.RolesFetchFailed;
  constructor(public validationMessages: string[]) { }
}

export class GetCompanySettingsTriggered implements Action {
  type = AuthenticationActionTypes.GetCompanySettingsTriggered;

  constructor(public companySettingsModel: CompanysettingsModel) { }
}

export class GetCompanySettingsCompleted implements Action {
  type = AuthenticationActionTypes.GetCompanySettingsCompleted;

  constructor(public companySettingsModel: any[]) { }
}

export class GetCompanySettingsFailed implements Action {
  type = AuthenticationActionTypes.GetCompanySettingsFailed;

  constructor(public validationMessages: ValidationModel[]) { }
}

export class AuthenticationExceptionHandled implements Action {
  type = AuthenticationActionTypes.AuthenticationExceptionHandled;

  constructor(public errorMessage: string) { }
}

export type AuthenticationActions =
  | UserDetailsFetching
  | UserDetailsFetched
