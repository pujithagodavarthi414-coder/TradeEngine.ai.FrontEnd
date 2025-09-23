import { Action } from "@ngrx/store";
import { BugPriorityDropDownData } from "../../models/bugPriorityDropDown";
import { ValidationModel } from '../../models/validation-messages';

export enum BugPriorityActionTypes {
  LoadBugPriorityTypesTriggered = "[BugPriorityTypes Component] Initial Data Load Triggered",
  LoadBugPriorityTypesCompleted = "[BugPriorityTypes Component] Initial Data Load Completed",
  LoadBugPriorityTypesFailed = "[BugPriorityTypes Component] Initial Data Load Failed",
  LoadBugPriorityTypesFromCache = "[BugPriorityTypes Component] Initial Data Load Completed From Cache"
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
