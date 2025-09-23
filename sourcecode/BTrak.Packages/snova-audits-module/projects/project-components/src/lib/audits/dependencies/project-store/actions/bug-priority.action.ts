import { Action } from "@ngrx/store";
import { ValidationModel } from "../../models/validation-messages";
import { BugPriorityDropDownData } from "../../models/bugPriorityDropDown";

export enum BugPriorityActionTypes {
  LoadBugPriorityTypesTriggered = "[SnovaAudisModule BugPriorityTypes Component] Initial Data Load Triggered",
  LoadBugPriorityTypesCompleted = "[SnovaAudisModule BugPriorityTypes Component] Initial Data Load Completed",
  LoadBugPriorityTypesFailed = "[SnovaAudisModule BugPriorityTypes Component] Initial Data Load Failed",
  LoadBugPriorityTypesFromCache = "[SnovaAudisModule BugPriorityTypes Component] Initial Data Load Completed From Cache"
}

export class LoadBugPriorityTypesTriggered implements Action {
  type = BugPriorityActionTypes.LoadBugPriorityTypesTriggered;
  bugPriorities: BugPriorityDropDownData[];
  validationMessages: ValidationModel[];
}

// tslint:disable-next-line: max-classes-per-file
export class LoadBugPriorityTypesCompleted implements Action {
  type = BugPriorityActionTypes.LoadBugPriorityTypesCompleted;
  validationMessages: ValidationModel[];
  constructor(public bugPriorities: BugPriorityDropDownData[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadBugPriorityTypesFailed implements Action {
  type = BugPriorityActionTypes.LoadBugPriorityTypesFailed;
  bugPriorities: BugPriorityDropDownData[]
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadBugPriorityTypesFromCache implements Action {
  type = BugPriorityActionTypes.LoadBugPriorityTypesFromCache;
  bugPriorities: BugPriorityDropDownData[];
  validationMessages: ValidationModel[];
  constructor() {}
}

export type BugPriorityTypeActions =
  | LoadBugPriorityTypesTriggered
  | LoadBugPriorityTypesCompleted
  | LoadBugPriorityTypesFailed
  | LoadBugPriorityTypesFromCache;
