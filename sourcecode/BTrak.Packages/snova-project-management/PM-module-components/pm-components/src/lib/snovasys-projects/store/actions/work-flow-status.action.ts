import { Action } from "@ngrx/store";
import { WorkflowStatus } from "../../models/workflowStatus";

export enum workFlowStatusActionTypes {
  LoadworkflowStatusTriggered = "[Snovasys-PM][workflowStatus Component] Initial Data Load Triggered",
  LoadworkflowStatusCompleted = "[Snovasys-PM][workflowStatus Component] Initial Data Load Completed",
  LoadworkflowStatusCompletedFromCache = "[Snovasys-PM][workflowStatus Component] Initial Data Load Completed From Cache",
  LoadWorkflowStatusListTriggered = "[Snovasys-PM][workflowStatus Component] Initial Data  Triggered",
  WorkflowStatusExceptionHandled = "[Snovasys-PM][workflowStatus Component] Exception Handled"
}

export class LoadworkflowStatusTriggered implements Action {
  type = workFlowStatusActionTypes.LoadworkflowStatusTriggered;
  workflowStatus: WorkflowStatus[];
  errorMessage: string;
  constructor(public workflowStatusModel: WorkflowStatus) { }
}

export class LoadWorkflowStatusListTriggered implements Action {
  type = workFlowStatusActionTypes.LoadWorkflowStatusListTriggered;
  workflowStatus: WorkflowStatus[];
  errorMessage: string;
  constructor(public workflowStatusModel: WorkflowStatus) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadworkflowStatusCompleted implements Action {
  type = workFlowStatusActionTypes.LoadworkflowStatusCompleted;
  errorMessage: string;
  constructor(public workflowStatus: WorkflowStatus[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadworkflowStatusCompletedFromCache implements Action {
  type = workFlowStatusActionTypes.LoadworkflowStatusCompletedFromCache;
  workflowStatus: WorkflowStatus[];
  workflowStatusModel: WorkflowStatus;
  errorMessage: string;
  constructor() { }
}

export type workflowStatusActions =
  | LoadworkflowStatusTriggered
  | LoadworkflowStatusCompleted
  | LoadworkflowStatusCompletedFromCache
  | WorkflowStatusExceptionHandled
  | LoadWorkflowStatusListTriggered;

// tslint:disable-next-line: max-classes-per-file
export class WorkflowStatusExceptionHandled implements Action {
  type =
    workFlowStatusActionTypes.WorkflowStatusExceptionHandled;
  workflowStatus: WorkflowStatus[];
  workflowStatusModel: WorkflowStatus;

  constructor(
    public errorMessage: string
  ) { }
}
