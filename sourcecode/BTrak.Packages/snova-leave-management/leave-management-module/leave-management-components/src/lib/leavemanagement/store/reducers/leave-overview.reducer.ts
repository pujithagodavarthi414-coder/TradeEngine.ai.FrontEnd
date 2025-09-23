import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { LeaveOverviewModel } from "../../models/leave-overview-model";
import { LeaveOverviewActionTypes, LeaveOverViewActions } from "../actions/leave-overview.action";

export interface State extends EntityState<LeaveOverviewModel> {
    loadingLeaves: boolean;
    leaveErrors: string[];
    userId: string;
    exceptionMessage: string;
}

export const leaveOverviewAdapter: EntityAdapter<LeaveOverviewModel> = createEntityAdapter<LeaveOverviewModel>({
    selectId: (leaveOverviewlists: LeaveOverviewModel) => leaveOverviewlists.userId
});

export const initialState: State = leaveOverviewAdapter.getInitialState({
    loadingLeaves: false,
    leaveErrors: [''],
    exceptionMessage: '',
    userId: '',
});

export function reducer(
    state: State = initialState,
    action: LeaveOverViewActions
): State {
    switch (action.type) {
        case LeaveOverviewActionTypes.LoadLeavesOverviewTriggered:
            return { ...state, loadingLeaves: true };
        case LeaveOverviewActionTypes.LoadLeavesOverviewCompleted:
            return leaveOverviewAdapter.addAll(action.leavesOverviewList, {
                ...state,
                loadingLeaves: false
            });
        case LeaveOverviewActionTypes.LoadLeavesOverviewFailed:
            return { ...state, loadingLeaves: false, leaveErrors: action.validationMessages };
        case LeaveOverviewActionTypes.ExceptionHandled:
            return { ...state, exceptionMessage: action.errorMessage };

        default:
            return state;
    }
}
