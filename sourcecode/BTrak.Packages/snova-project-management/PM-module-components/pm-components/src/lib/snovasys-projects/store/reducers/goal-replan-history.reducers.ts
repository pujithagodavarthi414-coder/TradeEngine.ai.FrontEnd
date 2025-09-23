// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { GoalReplanHistoryModel } from "../../models/goal-replan-history";
import { GoalReplanHistoryActions, GoalReplanHistoryActionTypes } from "../actions/goal-replan-history.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<GoalReplanHistoryModel> {
    loadingGoalReplanHistory: boolean;
    getLoadGoalReplanHistoryErrors: string[],
    exceptionMessage: string;
}

export const GoalReplanHistoryAdapter: EntityAdapter<GoalReplanHistoryModel> = createEntityAdapter<GoalReplanHistoryModel>(
    {
      selectId: (goalReplanHistory: GoalReplanHistoryModel) => goalReplanHistory.goalReplanId
    }
  );
export const initialState: State = GoalReplanHistoryAdapter.getInitialState({
    loadingGoalReplanHistory: true,
    getLoadGoalReplanHistoryErrors: [""],
    exceptionMessage: ""
});

export function reducer(
    state: State = initialState,
    action: GoalReplanHistoryActions
): State {
    switch (action.type) {
        case GoalReplanHistoryActionTypes.LoadGoalReplanHistoryItemsTriggered:
            return { ...state, loadingGoalReplanHistory: true };
        case GoalReplanHistoryActionTypes.LoadGoalReplanHistoryItemsCompleted:
            return GoalReplanHistoryAdapter.addAll(action.goalReplanHistory, {
                ...state,
                loadingGoalReplanHistory: false
            });
        case GoalReplanHistoryActionTypes.LoadGoalReplanHistoryItemsFailed:
            return { ...state, loadingGoalReplanHistory: false, getLoadGoalReplanHistoryErrors: action.validationMessages };
        case GoalReplanHistoryActionTypes.GoalReplanHistoryExceptionHandled:
            return { ...state, loadingGoalReplanHistory: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}
