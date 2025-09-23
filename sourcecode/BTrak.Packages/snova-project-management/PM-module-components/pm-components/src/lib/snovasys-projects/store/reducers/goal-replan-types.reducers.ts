// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { GoalReplanModel } from "../../models/goalReplanModel";
import {
  GoalReplanActions,
  GoalReplanActionsActionTypes
} from "../actions/goal-replan-types.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<GoalReplanModel> {
  loadingGoalReplanTypes: boolean;
  goalReplanStart: boolean;
}

export const goalReplanTypesAdapter: EntityAdapter<
  GoalReplanModel
> = createEntityAdapter<GoalReplanModel>({
  selectId: (goalReplanTypes: GoalReplanModel) =>
    goalReplanTypes.goalReplanTypeId
});

export const initialState: State = goalReplanTypesAdapter.getInitialState({
  loadingGoalReplanTypes: false,
  goalReplanStart: false
});

export function reducer(
  state: State = initialState,
  action: GoalReplanActions
): State {
  switch (action.type) {
    case GoalReplanActionsActionTypes.LoadGoalReplanActionsTriggered:
      return { ...state, loadingGoalReplanTypes: true };
      case GoalReplanActionsActionTypes.LoadGoalReplanActionsCompletedFromCache:
      return { ...state, loadingGoalReplanTypes: false };
    case GoalReplanActionsActionTypes.LoadGoalReplanActionsCompleted:
      return goalReplanTypesAdapter.addAll(action.goalReplanModel, {
        ...state,
        loadingGoalReplanTypes: false
      });
    case GoalReplanActionsActionTypes.InsertGoalReplanTriggered:
      return { ...state, goalReplanStart: true };
    case GoalReplanActionsActionTypes.InsertGoalReplanCompleted:
      return { ...state, goalReplanStart: false };
    default:
      return state;
  }
}
