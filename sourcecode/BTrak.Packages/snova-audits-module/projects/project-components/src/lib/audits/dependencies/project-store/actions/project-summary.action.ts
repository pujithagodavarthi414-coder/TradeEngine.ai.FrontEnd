import { Action } from "@ngrx/store";
import { ValidationModel } from "../../../../views/assetmanagement/models/validation-messages";
import { projectOverViewModel } from "../../models/projectOverViewModel";

export enum ProjectSummaryActionTypes {
  ProjectSummaryTriggered = "[SnovaAudisModule Project Summary] Project Summary Triggered",
  ProjectSummaryCompleted = "[SnovaAudisModule Project Summary] Project Summary Completed",
  ProjectSummaryLoadFailed = "[SnovaAudisModule Project Summary] Project Summary Load Failed",
  ExceptionHandled = "[SnovaAudisModule Project Summary] Exception Handled"
}

export class ProjectSummaryTriggered implements Action {
  type = ProjectSummaryActionTypes.ProjectSummaryTriggered;
  projectOverViewModel: projectOverViewModel;
  error: any;
  validationMessages: ValidationModel[];
  constructor(public projectId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ProjectSummaryCompleted implements Action {
  type = ProjectSummaryActionTypes.ProjectSummaryCompleted;
  projectId: string;
  error: any;
  validationMessages: ValidationModel[];
  // tslint:disable-next-line: no-shadowed-variable
  constructor(public projectOverViewModel: projectOverViewModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ProjectSummaryLoadFailed implements Action {
  type = ProjectSummaryActionTypes.ProjectSummaryLoadFailed;
  projectId: string;
  projectOverViewModel: projectOverViewModel;
  error: any;
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
  type = ProjectSummaryActionTypes.ExceptionHandled;
  projectId: string;
  projectOverViewModel: projectOverViewModel;
  validationMessages: ValidationModel[];
  constructor(public error: any) {}
}

export type ProjectSummaryActionsUnion =
  | ProjectSummaryTriggered
  | ProjectSummaryCompleted
  | ProjectSummaryLoadFailed
  | ExceptionHandled;
