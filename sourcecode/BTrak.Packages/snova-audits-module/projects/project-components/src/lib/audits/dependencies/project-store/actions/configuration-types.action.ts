import { Action } from "@ngrx/store";
import { ConfigurationTypes } from "../../models/configurationTypes";

export enum ConfigurationTypesActionTypes {
  LoadConfigurationTypesTriggered = "[SnovaAudisModule ConfigurationTypes Component] Initial Data Load Triggered",
  LoadConfigurationTypesCompleted = "[SnovaAudisModule ConfigurationTypes Component] Initial Data Load Completed",
  ExceptionHandled = "[SnovaAudisModule ConfigurationTypes Component]Exception Handled"
}

export class LoadConfigurationTypesTriggered implements Action {
  type = ConfigurationTypesActionTypes.LoadConfigurationTypesTriggered;
  ConfigurationTypes: ConfigurationTypes[];
  errorMessage: string;
}

// tslint:disable-next-line: max-classes-per-file
export class LoadConfigurationTypesCompleted implements Action {
  type = ConfigurationTypesActionTypes.LoadConfigurationTypesCompleted;
  errorMessage: string;
  // tslint:disable-next-line: no-shadowed-variable
  constructor(public ConfigurationTypes: ConfigurationTypes[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
  type = ConfigurationTypesActionTypes.ExceptionHandled;
  ConfigurationTypes: ConfigurationTypes[];
  constructor(public errorMessage: string) {}
}

export type ConfigurationTypesActions =
  | LoadConfigurationTypesTriggered
  | LoadConfigurationTypesCompleted
  | ExceptionHandled;
