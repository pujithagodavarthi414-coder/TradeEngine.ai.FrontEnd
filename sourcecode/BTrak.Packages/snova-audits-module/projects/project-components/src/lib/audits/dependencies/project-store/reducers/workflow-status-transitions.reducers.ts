import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { WorkFlowStatusTransitionTableData } from "../../models/workFlowStatusTransitionTableData";
import {
  workflowStatusTransitionActions,
  workFlowStatusTransitionActionTypes
} from "../actions/work-flow-status-transitions.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<WorkFlowStatusTransitionTableData> {
  loadingWorkflowstatusTransition: boolean;
}

export const workflowStatusTransitionAdapter: EntityAdapter<
  WorkFlowStatusTransitionTableData
> = createEntityAdapter<WorkFlowStatusTransitionTableData>({
  selectId: (WorkflowStatusTransition: WorkFlowStatusTransitionTableData) =>
    WorkflowStatusTransition.workflowEligibleStatusTransitionId
});

export const initialState: State = workflowStatusTransitionAdapter.getInitialState(
  {
    loadingWorkflowstatusTransition: false
  }
);

export function reducer(
  state: State = initialState,
  action: workflowStatusTransitionActions
): State {
  switch (action.type) {
    case workFlowStatusTransitionActionTypes.LoadworkflowStatusTransitionTriggered:
      return { ...state, loadingWorkflowstatusTransition: true };
    case workFlowStatusTransitionActionTypes.LoadworkflowStatusTransitionCompleted:
      return workflowStatusTransitionAdapter.addAll(
        action.workflowStatusTransition,
        {
          ...state,
          loadingWorkflowstatusTransition: false
        }
      );
    case workFlowStatusTransitionActionTypes.LoadworkflowStatusTransitionFailed:
        return { ...state, loadingWorkflowstatusTransition: false };
    default:
      return state;
  }
}
