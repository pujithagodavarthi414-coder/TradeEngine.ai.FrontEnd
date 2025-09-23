import { Action } from "@ngrx/store";
import { ValidationModel } from '../../models/validation-messages';

import { ConfigurationSettingModel } from "../../models/configurationType";

export enum permissionConfigurationActionTypes {
  LoadPermissionsListTriggered = "[Snovasys-PM][PermissionsList Component] Initial Data Load Triggered",
  LoadPermissionsListCompleted = "[Snovasys-PM][PermissionsList Component] Initial Data Load Completed",
  LoadPermissionsListFailed =  "[Snovasys-PM][PermissionsList Component] Initial Data Load Failed",
  LoadpermisionsListCompletedFromCache = "[Snovasys-PM][PermissionsList Component] Initial Data Load Completed From Cache",
  LoadPermissionListExceptionHandled = "[Snovasys-PM][PermissionsList Component] Load Permisison List Exception Handled"
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
export class LoadPermissionListExceptionHandled implements Action {
  type = permissionConfigurationActionTypes.LoadPermissionListExceptionHandled;
  configurationSettings: ConfigurationSettingModel;
  configurationSettingsList: ConfigurationSettingModel[];
  validationMessages: ValidationModel[];
  constructor(public errorMessage: string) {}
}

export type permissionConfigurationActions =
  | LoadPermissionsListTriggered
  | LoadPermissionsListCompleted
  | LoadPermissionListExceptionHandled
  | LoadPermissionsListCompleted
  | LoadpermisionsListCompletedFromCache;
