// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { SprintReplanHistoryModel } from "../../models/sprint-replan-history-model";
import { SprintReplanHistoryActions, SprintReplanHistoryActionTypes } from "../actions/sprint-replan-history.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<SprintReplanHistoryModel> {
    loadingSprintReplanHistory: boolean;
    getLoadSprintReplanHistoryErrors: string[],
    exceptionMessage: string;
}

export const SprintReplanHistoryAdapter: EntityAdapter<SprintReplanHistoryModel> = createEntityAdapter<SprintReplanHistoryModel>(
    {
      selectId: (SprintReplanHistory: SprintReplanHistoryModel) => SprintReplanHistory.sprintReplanId
    }
  );
export const initialState: State = SprintReplanHistoryAdapter.getInitialState({
    loadingSprintReplanHistory: true,
    getLoadSprintReplanHistoryErrors: [""],
    exceptionMessage: ""
});

export function reducer(
    state: State = initialState,
    action: SprintReplanHistoryActions
): State {
    switch (action.type) {
        case SprintReplanHistoryActionTypes.LoadSprintReplanHistoryItemsTriggered:
            return { ...state, loadingSprintReplanHistory: true };
        case SprintReplanHistoryActionTypes.LoadSprintReplanHistoryItemsCompleted:
            return SprintReplanHistoryAdapter.addAll(action.SprintReplanHistory, {
                ...state,
                loadingSprintReplanHistory: false
            });
        case SprintReplanHistoryActionTypes.LoadSprintReplanHistoryItemsFailed:
            return { ...state, loadingSprintReplanHistory: false, getLoadSprintReplanHistoryErrors: action.validationMessages };
        case SprintReplanHistoryActionTypes.SprintReplanHistoryExceptionHandled:
            return { ...state, loadingSprintReplanHistory: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}
