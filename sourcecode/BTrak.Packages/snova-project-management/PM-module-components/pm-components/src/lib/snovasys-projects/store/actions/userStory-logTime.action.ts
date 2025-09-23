import { Action } from "@ngrx/store";
import { UserStoryLogTimeModel } from "../../models/userStoryLogTimeModel";
import { ValidationModel } from '../../models/validation-messages';

export enum UserStoryLogTimeActionTypes {
  SearchLogTimeTriggered = "[Snovasys-PM][LogTime Component] Search  LogTime Triggered",
  SearchLogTimeCompleted = "[Snovasys-PM][LogTime Component] Search  LogTime Completed",
  InsertLogTimeTriggered = "[Snovasys-PM][LogTime Component] Insert LogTime Triggered",
  InsertLogTimeCompleted = "[Snovasys-PM][LogTime Component] Insert LogTime Completed",
  InsertAutoLogTimeCompleted = "[Snovasys-PM][LogTime Component] Insert AutoLogTime Completed",
  InsertAutoLogTimeTriggered = "[Snovasys-PM][LogTime Component] Insert AutoLogTime Triggered",
  InsertAutoLogTimeCompletedAction = "[Snovasys-PM][LogTime Component] Insert AutoLogTime Completed Action",
  InsertAutoLogTimeCompletedEnded = "[Snovasys-PM][LogTime Component] Insert AutoLogTime Ended",
  UpsertUserStoryAutoLogOnPunchCardTriggered = "[Snovasys-PM][LogTime Component] Upsert UserStory On Punch Card AutoLogTime Triggered",
  UpsertUserStoryAutoLogOnPunchCardCompleted = "[Snovasys-PM][LogTime Component] Upsert UserStory On Punch Card AutoLogTime Completed",
  InsertLogTimeFailed = "[Snovasys-PM][LogTime Component] Insert LogTime Failed",
  UserStoryLogTimeExceptionHandled = "[Snovasys-PM][LogTime Component] LOg Time Exception Handled"  
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

export class InsertAutoLogTimeCompletedAction implements Action {
  type = UserStoryLogTimeActionTypes.InsertAutoLogTimeCompletedAction;
  logTimeId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  userStoryLogTimeModelList: UserStoryLogTimeModel[];
  isBreakStarted?: boolean
  constructor() {}
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
export class UserStoryLogTimeExceptionHandled implements Action {
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
  | UserStoryLogTimeExceptionHandled
  | SearchLogTimeTriggered
  | SearchLogTimeCompleted
  | InsertAutoLogTimeCompleted
  | InsertAutoLogTimeTriggered
  | InsertAutoLogTimeCompletedEnded
  | UpsertUserStoryAutoLogOnPunchCardTriggered
  | UpsertUserStoryAutoLogOnPunchCardCompleted;
