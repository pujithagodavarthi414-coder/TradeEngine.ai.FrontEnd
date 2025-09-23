import { Action } from "@ngrx/store";
import { ProjectType } from "../../models/projectType";

export enum ProjectTypeActionTypes {
  LoadProjectTypesTriggered = "[Snovasys-PM][ProjectType Component] Initial Data Load Triggered",
  LoadProjectTypesCompleted = "[Snovasys-PM][ProjectType Component] Initial Data Load Completed",
  LoadProjectTypesCompletedFromCache = "[Snovasys-PM][ProjectType Component] Initial Data Load Completed From Cache",
  ProjectTypesExceptionHandled = "[Snovasys-PM][ProjectType Component] Project TYpes Exception Handled"
}

export class LoadProjectTypesTriggered implements Action {
  type = ProjectTypeActionTypes.LoadProjectTypesTriggered;
  ProjectTypes: ProjectType[];
  errorMessage: string;
}

// tslint:disable-next-line: max-classes-per-file
export class LoadProjectTypesCompleted implements Action {
  type = ProjectTypeActionTypes.LoadProjectTypesCompleted;
  errorMessage: string;
  constructor(public ProjectTypes: ProjectType[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadProjectTypesCompletedFromCache implements Action {
  type = ProjectTypeActionTypes.LoadProjectTypesCompletedFromCache;
  errorMessage: string;
  ProjectTypes: ProjectType[]
  constructor() {}
}

// tslint:disable-next-line: max-classes-per-file
export class ProjectTypesExceptionHandled implements Action {
  type = ProjectTypeActionTypes.ProjectTypesExceptionHandled;
  ProjectTypes: ProjectType[];
  constructor(public errorMessage: string) {}
}

export type ProjectTypeActions =
  | LoadProjectTypesTriggered
  | LoadProjectTypesCompleted
  | LoadProjectTypesCompletedFromCache
  | ProjectTypesExceptionHandled;
