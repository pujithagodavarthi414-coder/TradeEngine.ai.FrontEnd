import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { WorkFlow } from "../../models/workflow";
import {
  WorkflowActions,
  WorkflowActionTypes
} from "../actions/workflow-list.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<WorkFlow> {
  loadingWorkflow: boolean;
}

export const workflowAdapter: EntityAdapter<WorkFlow> = createEntityAdapter<
  WorkFlow
>({
  selectId: (workflow: WorkFlow) => workflow.workFlowId
});

export const initialState: State = workflowAdapter.getInitialState({
  loadingWorkflow: false
});

export function reducer(
  state: State = initialState,
  action: WorkflowActions
): State {
  switch (action.type) {
    case WorkflowActionTypes.LoadWorkflowTriggered:
      return { ...state, loadingWorkflow: true };
    case WorkflowActionTypes.LoadWorkflowCompleted:
      return workflowAdapter.addAll(action.workflowList, {
        ...state,
        loadingWorkflow: false
      });
    default:
      return state;
  }
}
