import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { LeaveModel } from '../../models/leave-model';
import { LeavesActions, LeavesActionTypes } from '../actions/leaves.actions';

export interface State extends EntityState<LeaveModel> {
    upsertLeaveInProgress: boolean;
    loadingLeaves: boolean;
    leaveErrors: string[];
    leaveId: string;
    exceptionMessage: string;
    leavesUpsertModel: LeaveModel;
}

export const leavesAdapter: EntityAdapter<LeaveModel> = createEntityAdapter<LeaveModel>({
    selectId: (leaveTypes: LeaveModel) => leaveTypes.leaveApplicationId
});

export const initialState: State = leavesAdapter.getInitialState({
    upsertLeaveInProgress: false,
    loadingLeaves: false,
    leaveErrors: [''],
    exceptionMessage: '',
    leaveId: '',
    leavesUpsertModel: null
});

export function reducer(
    state: State = initialState,
    action: LeavesActions
): State {
    switch (action.type) {
        case LeavesActionTypes.LoadLeavesTriggered:
            return { ...state, loadingLeaves: true };
        case LeavesActionTypes.LoadLeavesCompleted:
            return leavesAdapter.addAll(action.leavesList, {
                ...state,
                loadingLeaves: false
            });
            case LeavesActionTypes.LoadLeavesByIdTriggered:
                return { ...state, loadingLeaves: true };
            case LeavesActionTypes.LoadLeavesByIdCompleted:
                return { ...state, loadingLeaves: false, upsertLeaveInProgress: false, leavesUpsertModel: action.leavesUpsertModel };
        case LeavesActionTypes.LoadLeavesFailed:
            return { ...state, loadingLeaves: false, leaveErrors: action.validationMessages };
        case LeavesActionTypes.ExceptionHandled:
            return { ...state, exceptionMessage: action.errorMessage };
        case LeavesActionTypes.AddNewLeaveTriggered:
            return { ...state, upsertLeaveInProgress: true };
        case LeavesActionTypes.AddNewLeaveCompleted:
            return { ...state, upsertLeaveInProgress: false, leaveId: action.leaveId };
        case LeavesActionTypes.AddNewLeaveFailed:
            return { ...state, upsertLeaveInProgress: false, leaveErrors: action.validationMessages };
        case LeavesActionTypes.UpdateLeaveById:
            return leavesAdapter.updateOne(action.leaveUpdatedmodels.leaveUpdatedmodel, state);
        default:
            return state;
    }
}