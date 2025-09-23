import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { WorkflowStatus } from "../../models/workflowStatus";
import {
  workflowStatusActions,
  workFlowStatusActionTypes
} from "../actions/work-flow-status.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<WorkflowStatus> {
  loadingWorkflowstatus: boolean;
}

export const workflowStatusAdapter: EntityAdapter<
  WorkflowStatus
> = createEntityAdapter<WorkflowStatus>({
  // tslint:disable-next-line: no-shadowed-variable
  selectId: (WorkflowStatus: WorkflowStatus) => WorkflowStatus.workFlowStatusId
});

export const initialState: State = workflowStatusAdapter.getInitialState({
  loadingWorkflowstatus: false
});

export function reducer(
  state: State = initialState,
  action: workflowStatusActions
): State {
  switch (action.type) {
    case workFlowStatusActionTypes.LoadworkflowStatusTriggered:
      return { ...state, loadingWorkflowstatus: true };
    case workFlowStatusActionTypes.LoadworkflowStatusCompleted:
      return workflowStatusAdapter.upsertMany(action.workflowStatus, {
        ...state,
        loadingWorkflowstatus: false
      });
    case workFlowStatusActionTypes.LoadworkflowStatusCompletedFromCache:
      return {
        ...state,
        loadingWorkflowstatus: false
      };
    default:
      return state;
  }
}
