import { Action } from "@ngrx/store";
import { ValidationModel } from "../../models/validation-messages";
import { ConfigurationSettingModel } from "../../models/configurationType";

export enum permissionConfigurationActionTypes {
  LoadPermissionsListTriggered = "[SnovaAudisModule PermissionsList Component] Initial Data Load Triggered",
  LoadPermissionsListCompleted = "[SnovaAudisModule PermissionsList Component] Initial Data Load Completed",
  LoadPermissionsListFailed =  "[SnovaAudisModule PermissionsList Component] Initial Data Load Failed",
  LoadpermisionsListCompletedFromCache = "[SnovaAudisModule PermissionsList Component] Initial Data Load Completed From Cache",
  ExceptionHandled = "[SnovaAudisModule PermissionsList Component] Exception Handled"
}

export class LoadPermissionsListTriggered implements Action {
  type = permissionConfigurationActionTypes.LoadPermissionsListTriggered;
  configurationSettingsList: ConfigurationSettingModel[];
  errorMessage: string;
  validationMessages: ValidationModel[];
  constructor(public configurationSetting: ConfigurationSettingModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadPermissionsListCompleted implements Action {
  type = permissionConfigurationActionTypes.LoadPermissionsListCompleted;
  configurationSettings: ConfigurationSettingModel;
  errorMessage: string;
  validationMessages: ValidationModel[];
  constructor(public configurationSettingsList: ConfigurationSettingModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadPermissionsListFailed implements Action {
  type = permissionConfigurationActionTypes.LoadPermissionsListFailed;
  configurationSettings: ConfigurationSettingModel;
  errorMessage: string;
  configurationSettingsList: ConfigurationSettingModel[];
  constructor(public   validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadpermisionsListCompletedFromCache implements Action {
  type = permissionConfigurationActionTypes.LoadpermisionsListCompletedFromCache;
  configurationSettings: ConfigurationSettingModel;
  errorMessage: string;
  configurationSettingsList: ConfigurationSettingModel[];
  validationMessages: ValidationModel[];
  constructor() {}
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
  type = permissionConfigurationActionTypes.ExceptionHandled;
  configurationSettings: ConfigurationSettingModel;
  configurationSettingsList: ConfigurationSettingModel[];
  validationMessages: ValidationModel[];
  constructor(public errorMessage: string) {}
}

export type permissionConfigurationActions =
  | LoadPermissionsListTriggered
  | LoadPermissionsListCompleted
  | ExceptionHandled
  | LoadPermissionsListCompleted
  | LoadpermisionsListCompletedFromCache;
