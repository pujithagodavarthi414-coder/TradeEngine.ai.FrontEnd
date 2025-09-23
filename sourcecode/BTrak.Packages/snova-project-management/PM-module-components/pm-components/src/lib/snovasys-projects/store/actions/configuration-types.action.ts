import { Action } from "@ngrx/store";
import { ConfigurationTypes } from "../../models/configurationTypes";

export enum ConfigurationTypesActionTypes {
  LoadConfigurationTypesTriggered = "[Snovasys-PM][ConfigurationTypes Component] Initial Data Load Triggered",
  LoadConfigurationTypesCompleted = "[Snovasys-PM][ConfigurationTypes Component] Initial Data Load Completed",
  LoadConfigurationTypesExceptionHandled = "[Snovasys-PM][ConfigurationTypes Component]Load Configuration Types Exception Handled"
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
export class LoadConfigurationTypesExceptionHandled implements Action {
  type = ConfigurationTypesActionTypes.LoadConfigurationTypesExceptionHandled;
  ConfigurationTypes: ConfigurationTypes[];
  constructor(public errorMessage: string) {}
}

export type ConfigurationTypesActions =
  | LoadConfigurationTypesTriggered
  | LoadConfigurationTypesCompleted
  | LoadConfigurationTypesExceptionHandled;
