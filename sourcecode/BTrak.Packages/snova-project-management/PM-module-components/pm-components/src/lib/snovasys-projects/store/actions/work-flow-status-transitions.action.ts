import { Action } from "@ngrx/store";
import { WorkFlowStatusTransitionTableData } from "../../models/workFlowStatusTransitionTableData";
import { ValidationAction } from "./notification-validator.action";
import { ValidationModel } from '../../models/validation-messages';

export enum workFlowStatusTransitionActionTypes {
  LoadworkflowStatusTransitionTriggered = "[Snovasys-PM][workflowStatusTransition Component] Initial Data Load Triggered",
  LoadworkflowStatusTransitionCompleted = "[Snovasys-PM][workflowStatusTransition Component] Initial Data Load Completed",
  LoadworkflowStatusTransitionFailed = "[Snovasys-PM][workflowStatusTransition Component] Initial Data Load Failed",
  WorkflowStatusTransitionExceptionHandled = "[Snovasys-PM][workflowStatusTransition Component] Exception Handled"
}

export class LoadworkflowStatusTransitionTriggered implements Action {
  type =
    workFlowStatusTransitionActionTypes.LoadworkflowStatusTransitionTriggered;
  workflowStatusTransition: WorkFlowStatusTransitionTableData[];
  errorMessage: string;
  validationMessages: ValidationModel[];
  constructor(public workflowTransitions: WorkFlowStatusTransitionTableData) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadworkflowStatusTransitionCompleted implements Action {
  type =
    workFlowStatusTransitionActionTypes.LoadworkflowStatusTransitionCompleted;
  workflowTransitions: WorkFlowStatusTransitionTableData;
  errorMessage: string;
  validationMessages: ValidationModel[];
  constructor(
    public workflowStatusTransition: WorkFlowStatusTransitionTableData[]
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadworkflowStatusTransitionFailed implements Action {
  type =
    workFlowStatusTransitionActionTypes.LoadworkflowStatusTransitionFailed;
  workflowTransitions: WorkFlowStatusTransitionTableData;
  workflowStatusTransition: WorkFlowStatusTransitionTableData[];
  errorMessage: string;
  constructor(
    public validationMessages: ValidationModel[]
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class WorkflowStatusTransitionExceptionHandled implements Action {
  type =
    workFlowStatusTransitionActionTypes.WorkflowStatusTransitionExceptionHandled;
  workflowTransitions: WorkFlowStatusTransitionTableData;
  workflowStatusTransition: WorkFlowStatusTransitionTableData[];
  validationMessages: ValidationModel[];
  constructor(
    public errorMessage: string
  ) {}
}

export type workflowStatusTransitionActions =
  | LoadworkflowStatusTransitionTriggered
  | LoadworkflowStatusTransitionCompleted
  | LoadworkflowStatusTransitionFailed
  |WorkflowStatusTransitionExceptionHandled;
