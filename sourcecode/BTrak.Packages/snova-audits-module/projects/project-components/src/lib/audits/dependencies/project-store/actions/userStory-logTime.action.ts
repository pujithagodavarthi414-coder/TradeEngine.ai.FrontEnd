import { Action } from "@ngrx/store";
import { ValidationModel } from "../../models/validation-messages";
import { UserStoryLogTimeModel } from "../../models/userStoryLogTimeModel";

export enum UserStoryLogTimeActionTypes {
  SearchLogTimeTriggered = "[SnovaAudisModule LogTime Component] Search  LogTime Triggered",
  SearchLogTimeCompleted = "[SnovaAudisModule LogTime Component] Search  LogTime Completed",
  InsertLogTimeTriggered = "[SnovaAudisModule LogTime Component] Insert LogTime Triggered",
  InsertLogTimeCompleted = "[SnovaAudisModule LogTime Component] Insert LogTime Completed",
  InsertAutoLogTimeCompleted = "[SnovaAudisModule LogTime Component] Insert AutoLogTime Completed",
  InsertAutoLogTimeTriggered = "[SnovaAudisModule LogTime Component] Insert AutoLogTime Triggered",
  InsertAutoLogTimeCompletedEnded = "[SnovaAudisModule LogTime Component] Insert AutoLogTime Ended",
  UpsertUserStoryAutoLogOnPunchCardTriggered = "[SnovaAudisModule LogTime Component] Upsert UserStory On Punch Card AutoLogTime Triggered",
  UpsertUserStoryAutoLogOnPunchCardCompleted = "[SnovaAudisModule LogTime Component] Upsert UserStory On Punch Card AutoLogTime Completed",
  InsertLogTimeFailed = "[SnovaAudisModule LogTime Component] Insert LogTime Failed",
  ExceptionHandled = "[SnovaAudisModule LogTime Component] Exception Handled"  
}

export class SearchLogTimeTriggered implements Action {
  type = UserStoryLogTimeActionTypes.SearchLogTimeTriggered;
  logTimeId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  userStoryLogTimeModelList: UserStoryLogTimeModel[];
  isBreakStarted?: boolean
  constructor(public userStoryLogTimeModel: UserStoryLogTimeModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class SearchLogTimeCompleted implements Action {
  type = UserStoryLogTimeActionTypes.SearchLogTimeCompleted;
  logTimeId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  userStoryLogTimeModel: UserStoryLogTimeModel;
  isBreakStarted?: boolean
  constructor(public userStoryLogTimeModelList: UserStoryLogTimeModel[]) {}
}

export class UpsertUserStoryAutoLogOnPunchCardTriggered implements Action {
  type = UserStoryLogTimeActionTypes.UpsertUserStoryAutoLogOnPunchCardTriggered;
  logTimeId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  userStoryLogTimeModelList: UserStoryLogTimeModel[];
  userStoryLogTimeModel: UserStoryLogTimeModel;
  constructor(public isBreakStarted?: boolean) {}
}

export class UpsertUserStoryAutoLogOnPunchCardCompleted implements Action {
  type = UserStoryLogTimeActionTypes.UpsertUserStoryAutoLogOnPunchCardCompleted;
  logTimeId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  userStoryLogTimeModelList: UserStoryLogTimeModel[];
  userStoryLogTimeModel: UserStoryLogTimeModel;
  constructor(public isBreakStarted?: boolean) {}
}

// tslint:disable-next-line: max-classes-per-file
export class InsertLogTimeTriggered implements Action {
  type = UserStoryLogTimeActionTypes.InsertLogTimeTriggered;
  logTimeId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  userStoryLogTimeModelList: UserStoryLogTimeModel[];
  isBreakStarted?: boolean
  constructor(public userStoryLogTimeModel: UserStoryLogTimeModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class InsertAutoLogTimeTriggered implements Action {
  type = UserStoryLogTimeActionTypes.InsertAutoLogTimeTriggered;
  logTimeId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  userStoryLogTimeModelList: UserStoryLogTimeModel[];
  isBreakStarted?: boolean
  constructor(public userStoryLogTimeModel: UserStoryLogTimeModel) {}
}


// tslint:disable-next-line: max-classes-per-file
export class InsertLogTimeCompleted implements Action {
  type = UserStoryLogTimeActionTypes.InsertLogTimeCompleted;
  userStoryLogTimeModel: UserStoryLogTimeModel;
  validationMessages: ValidationModel[];
  errorMessage: string;
  userStoryLogTimeModelList: UserStoryLogTimeModel[];
  isBreakStarted?: boolean
  constructor(public logTimeId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class InsertAutoLogTimeCompleted implements Action {
  type = UserStoryLogTimeActionTypes.InsertAutoLogTimeCompleted;
  userStoryLogTimeModel: UserStoryLogTimeModel;
  validationMessages: ValidationModel[];
  errorMessage: string;
  userStoryLogTimeModelList: UserStoryLogTimeModel[];
  isBreakStarted?: boolean
  constructor(public logTimeId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class InsertAutoLogTimeCompletedEnded implements Action {
  type = UserStoryLogTimeActionTypes.InsertAutoLogTimeCompleted;
  userStoryLogTimeModel: UserStoryLogTimeModel;
  validationMessages: ValidationModel[];
  errorMessage: string;
  userStoryLogTimeModelList: UserStoryLogTimeModel[];
  isBreakStarted?: boolean
  constructor(public logTimeId: string) {}
}


// tslint:disable-next-line: max-classes-per-file
export class InsertLogTimeFailed implements Action {
  type = UserStoryLogTimeActionTypes.InsertLogTimeFailed;
  userStoryLogTimeModel: UserStoryLogTimeModel;
  logTimeId: string;
  errorMessage: string;
  userStoryLogTimeModelList: UserStoryLogTimeModel[];
  isBreakStarted?: boolean
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
  type = UserStoryLogTimeActionTypes.InsertLogTimeFailed;
  userStoryLogTimeModel: UserStoryLogTimeModel;
  logTimeId: string;
  validationMessages: ValidationModel[];
  userStoryLogTimeModelList: UserStoryLogTimeModel[];
  isBreakStarted?: boolean
  constructor(public errorMessage: string) {}
}

export type UserStoryLogTimeActions =
  | InsertLogTimeTriggered
  | InsertLogTimeCompleted
  | InsertLogTimeFailed
  | ExceptionHandled
  | SearchLogTimeTriggered
  | SearchLogTimeCompleted
  | InsertAutoLogTimeCompleted
  | InsertAutoLogTimeTriggered
  | InsertAutoLogTimeCompletedEnded
  | UpsertUserStoryAutoLogOnPunchCardTriggered
  | UpsertUserStoryAutoLogOnPunchCardCompleted;
