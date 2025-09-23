import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { LeaveApplicabilityActions, LeaveApplicabilityActionTypes } from '../actions/leave-applicability.actions';
import { LeaveApplicabilityModel } from '../../models/leave-applicability-model';

export interface State extends EntityState<LeaveApplicabilityModel> {
    upsertLeaveApplicabilityInProgress: boolean;
    loadingLeaveApplicability: boolean;
    leaveApplicabilityErrors: string[];
    leaveApplicabilityId: string;
    exceptionMessage: string;
}

export const leaveApplicabilityAdapter: EntityAdapter<LeaveApplicabilityModel> = createEntityAdapter<LeaveApplicabilityModel>({
    selectId: (leaveTypes: LeaveApplicabilityModel) => leaveTypes.leaveApplicabilityId
});

export const initialState: State = leaveApplicabilityAdapter.getInitialState({
    upsertLeaveApplicabilityInProgress: false,
    loadingLeaveApplicability: false,
    leaveApplicabilityErrors: [''],
    exceptionMessage: '',
    leaveApplicabilityId: '',
});

export function reducer(
    state: State = initialState,
    action: LeaveApplicabilityActions
): State {
    switch (action.type) {
        case LeaveApplicabilityActionTypes.LoadLeaveApplicabilityTriggered:
            return { ...state, loadingLeaveApplicability: true };
        case LeaveApplicabilityActionTypes.LoadLeaveApplicabilityCompleted:
            return leaveApplicabilityAdapter.addAll(action.leaveTypesList, {
                ...state,
                loadingLeaveTypesList: false
            });
        case LeaveApplicabilityActionTypes.LoadLeaveApplicabilityFailed:
            return { ...state, loadingLeaveApplicability: false, leaveApplicabilityErrors: action.validationMessages };
        case LeaveApplicabilityActionTypes.ExceptionHandled:
            return { ...state, exceptionMessage: action.errorMessage };
        case LeaveApplicabilityActionTypes.AddNewLeaveLeaveApplicabilityTriggered:
            return { ...state, upsertLeaveApplicabilityInProgress: true };
        case LeaveApplicabilityActionTypes.AddNewLeaveLeaveApplicabilityCompleted:
            return { ...state, upsertLeaveApplicabilityInProgress: false, leaveApplicabilityId: action.leaveApplicabilityId };
        case LeaveApplicabilityActionTypes.AddNewLeaveLeaveApplicabilityFailed:
            return { ...state, upsertLeaveApplicabilityInProgress: false, leaveApplicabilityErrors: action.validationMessages };
        default:
            return state;
    }
}