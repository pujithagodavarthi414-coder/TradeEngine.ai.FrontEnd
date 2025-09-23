import { Action } from "@ngrx/store";
import { WorkflowStatus } from "../../models/workflowStatus";

export enum workFlowStatusActionTypes {
  LoadworkflowStatusTriggered = "[SnovaAudisModule workflowStatus Component] Initial Data Load Triggered",
  LoadworkflowStatusCompleted = "[SnovaAudisModule workflowStatus Component] Initial Data Load Completed",
  LoadworkflowStatusCompletedFromCache = "[SnovaAudisModule workflowStatus Component] Initial Data Load Completed From Cache",
  ExceptionHandled = "[SnovaAudisModule workflowStatus Component] Exception Handled"
}

export class LoadworkflowStatusTriggered implements Action {
  type = workFlowStatusActionTypes.LoadworkflowStatusTriggered;
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
  | ExceptionHandled;

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
  type =
    workFlowStatusActionTypes.ExceptionHandled;
  workflowStatus: WorkflowStatus[];
  workflowStatusModel: WorkflowStatus;

  constructor(
    public errorMessage: string
  ) { }
}
