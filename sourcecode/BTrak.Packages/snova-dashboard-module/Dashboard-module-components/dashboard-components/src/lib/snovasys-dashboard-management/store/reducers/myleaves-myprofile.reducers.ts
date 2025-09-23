import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { MyLeaveModel } from '../../models/myleaves-model';
import { MyLeavesActions, MyLeavesActionTypes } from '../actions/myleaves-myprofile.action';

export interface State extends EntityState<MyLeaveModel> {
    upsertLeaveInProgress: boolean;
    loadingLeaves: boolean;
    leaveErrors: string[];
    leaveId: string;
    exceptionMessage: string;
}

export const leavesAdapter: EntityAdapter<MyLeaveModel> = createEntityAdapter<MyLeaveModel>({
    selectId: (leaveTypes: MyLeaveModel) => leaveTypes.leaveApplicationId
});

export const initialState: State = leavesAdapter.getInitialState({
    upsertLeaveInProgress: false,
    loadingLeaves: false,
    leaveErrors: [''],
    exceptionMessage: '',
    leaveId: '',
});

export function reducer(
    state: State = initialState,
    action: MyLeavesActions
): State {
    switch (action.type) {
        case MyLeavesActionTypes.LoadLeavesTriggered:
            return { ...state, loadingLeaves: true };
        case MyLeavesActionTypes.LoadLeavesCompleted:
            return leavesAdapter.addAll(action.leavesList, {
                ...state,
                loadingLeaves: false
            });
        case MyLeavesActionTypes.LoadLeavesFailed:
            return { ...state, loadingLeaves: false, leaveErrors: action.validationMessages };
        case MyLeavesActionTypes.ExceptionHandled:
            return { ...state, exceptionMessage: action.errorMessage };
        case MyLeavesActionTypes.AddNewLeaveTriggered:
            return { ...state, upsertLeaveInProgress: true };
        case MyLeavesActionTypes.AddNewLeaveCompleted:
            return { ...state, upsertLeaveInProgress: false, leaveId: action.leaveId };
        case MyLeavesActionTypes.AddNewLeaveFailed:
            return { ...state, upsertLeaveInProgress: false, leaveErrors: action.validationMessages };
        default:
            return state;
    }
}