import { Action } from "@ngrx/store";
import { WorkFlow } from "../../models/workFlow";

export enum WorkflowActionTypes {
  LoadWorkflowTriggered = "[Snovasys-PM][Workflow Component] Initial Data Load Triggered",
  LoadWorkflowCompleted = "[Snovasys-PM][Workflow Component] Initial Data Load Completed",
  WorkflowExceptionHandled = "[Snovasys-PM][Workflow Component] Exception Handled"
}

export class LoadWorkflowTriggered implements Action {
  type = WorkflowActionTypes.LoadWorkflowTriggered;
  workflowList: WorkFlow[];
  errorMessage: string;
}

// tslint:disable-next-line: max-classes-per-file
export class LoadWorkflowCompleted implements Action {
  type = WorkflowActionTypes.LoadWorkflowCompleted;
  errorMessage: string
  constructor(public workflowList: WorkFlow[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class WorkflowExceptionHandled implements Action {
  type = WorkflowActionTypes.WorkflowExceptionHandled;
  workflowList: WorkFlow[];
  constructor(public errorMessage: string) {}
}

export type WorkflowActions = LoadWorkflowTriggered | LoadWorkflowCompleted|WorkflowExceptionHandled;
