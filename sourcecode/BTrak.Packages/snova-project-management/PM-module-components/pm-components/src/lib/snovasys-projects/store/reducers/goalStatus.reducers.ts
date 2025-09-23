// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { GoalStatusDropDownData } from "../../models/goalStatusDropDown";
import {
  GoalStatusActions,
  GoalStatusActionTypes
} from "../actions/goalStatus.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<GoalStatusDropDownData> {
  loadinggoalStatus: boolean;
}

export const goalStatusAdapter: EntityAdapter<
  GoalStatusDropDownData
> = createEntityAdapter<GoalStatusDropDownData>({
  selectId: (goalStatus: GoalStatusDropDownData) => goalStatus.goalStatusId
});

export const initialState: State = goalStatusAdapter.getInitialState({
  loadinggoalStatus: false
});

export function reducer(
  state: State = initialState,
  action: GoalStatusActions
): State {
  switch (action.type) {
    case GoalStatusActionTypes.LoadGoalStatusTriggered:
      return { ...state, loadinggoalStatus: true };
     case GoalStatusActionTypes.LoadGoalStatusCompletedFromCache:
      return { ...state, loadinggoalStatus: false };
    case GoalStatusActionTypes.LoadGoalStatusCompleted:
      return goalStatusAdapter.addAll(action.goalStatuses, {
        ...state,
        loadinggoalStatus: false
      });
    default:
      return state;
  }
}
