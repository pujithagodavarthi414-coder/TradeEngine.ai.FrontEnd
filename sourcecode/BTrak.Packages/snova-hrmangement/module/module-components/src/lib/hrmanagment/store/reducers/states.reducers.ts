import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { StatesModel } from "../../models/states";
import { StatesListActions, StatesListActionTypes } from "../actions/states.action";

export interface State extends EntityState<StatesModel> {
    loadingStatesList: boolean;
    exceptionMessage: string;
}

export const StatesAdapter: EntityAdapter<
    StatesModel
> = createEntityAdapter<StatesModel>({
    selectId: (states: StatesModel) => states.stateId
});

export const initialState: State = StatesAdapter.getInitialState({
    loadingStatesList: false,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: StatesListActions
): State {
    switch (action.type) {
        case StatesListActionTypes.LoadStatesListItemsTriggered:
            return { ...state, loadingStatesList: true };
        case StatesListActionTypes.LoadStatesListItemsCompleted:
            return StatesAdapter.addAll(action.statesList, {
                ...state,
                loadingStatesList: false
            });
        default:
            return state;
    }
}