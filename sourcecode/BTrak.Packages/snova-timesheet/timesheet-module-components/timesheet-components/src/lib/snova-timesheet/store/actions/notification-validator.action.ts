
import { Action } from "@ngrx/store";
import { ValidationModel } from '../../models/validation.model';

export enum ValidationActionTypes {
  ShowExceptionMessages = "[Exception] Show",
  ShowValidationMessages = "[Validation] Show"
}

export class ShowExceptionMessages implements Action {
  readonly type = ValidationActionTypes.ShowExceptionMessages;
  constructor(public payload: { message: string }) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ShowValidationMessages implements Action {
  readonly type = ValidationActionTypes.ShowValidationMessages;
  constructor( public payload: { validationMessages: ValidationModel[] }) {}
}

export type ValidationAction = ShowExceptionMessages
  | ShowValidationMessages;
