import { Action } from "@ngrx/store";
import { CompanysettingsModel } from '../../models/company-model';
import { UserModel } from '../../models/user-model';
import { ValidationModel } from '../../models/validation-messages';

export enum AuthenticationActionTypes {
  UserDetailsFetching = "[Authentication] Fetching User Details",
  UserDetailsFetched = "[Authentication] Fetched User Details",
  RoleDetailsFetchOnReload = "[Authentication] Role Details Fetched On Reload",
  RoleDetailsFetched = "[Authentication] Role Details Fetched",
  RolesFetchTriggered = "[Authentication] Fetching Roles Triggered",
  RolesFetchFailed = '[Authentication] Fetching Roles Failed',
  AuthenticationExceptionHandled = '[Authentication] Exception Handling',
  GetCompanySettingsTriggered = "[Authentication] Get Company Settings Triggered",
  GetCompanySettingsCompleted = "[Authentication] Get Company Settings Completed",
  GetCompanySettingsFailed = "[Authentication] Get Company Settings Failed",
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
