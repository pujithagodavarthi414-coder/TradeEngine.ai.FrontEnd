import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { LeaveFrequencyActions, LeaveTypeActionTypes } from '../actions/leave-types.actions';
import { LeaveFrequencyTypeModel } from '../../models/leave-frequency-type.model';

export interface State extends EntityState<LeaveFrequencyTypeModel> {
    upsertLeaveTypeInProgress: boolean;
    upsertExistingLeaveTypeInProgress: boolean;
    loadingLeaveTypesList: boolean;
    leaveTypeErrors: string[];
    leaveTypeId: string;
    leaveTypeData: LeaveFrequencyTypeModel[];
    exceptionMessage: string;
}

export const leaveTypeAdapter: EntityAdapter<
    LeaveFrequencyTypeModel
> = createEntityAdapter<LeaveFrequencyTypeModel>({
    selectId: (leaveTypes: LeaveFrequencyTypeModel) => leaveTypes.leaveTypeId
});

export const initialState: State = leaveTypeAdapter.getInitialState({
    upsertLeaveTypeInProgress: false,
    upsertExistingLeaveTypeInProgress: false,
    loadingLeaveTypesList: false,
    leaveTypeErrors: [''],
    exceptionMessage: '',
    leaveTypeId: '',
    leaveTypeData: null
});

export function reducer(
    state: State = initialState,
    action: LeaveFrequencyActions
): State {
    switch (action.type) {
        case LeaveTypeActionTypes.LoadLeaveTypesTriggered:
            return { ...state, loadingLeaveTypesList: true };
        case LeaveTypeActionTypes.LoadLeaveTypesCompleted:
            return leaveTypeAdapter.addAll(action.leaveTypesList, {
                ...state,
                loadingLeaveTypesList: false
            });
        case LeaveTypeActionTypes.LoadLeaveTypesFailed:
            return { ...state, loadingLeaveTypesList: false, leaveTypeErrors: action.validationMessages };
        case LeaveTypeActionTypes.ExceptionHandled:
            return { ...state, upsertLeaveTypeInProgress: false, exceptionMessage: action.errorMessage };
        case LeaveTypeActionTypes.AddNewLeaveTypeTriggered:
            return { ...state, upsertLeaveTypeInProgress: true };
        case LeaveTypeActionTypes.AddNewLeaveTypeCompleted:
            return { ...state, upsertLeaveTypeInProgress: false, leaveTypeId: action.leaveTypeId };
        case LeaveTypeActionTypes.AddNewLeaveTypeFailed:
            return { ...state, upsertLeaveTypeInProgress: false, leaveTypeErrors: action.validationMessages };
            case LeaveTypeActionTypes.UpdateLeaveTypeTriggered:
                return { ...state, upsertExistingLeaveTypeInProgress: true };
            case LeaveTypeActionTypes.UpdateLeaveTypeCompleted:
                return { ...state, upsertExistingLeaveTypeInProgress: false, leaveTypeId: action.leaveTypeId };
            case LeaveTypeActionTypes.UpdateLeaveTypeFailed:
                return { ...state, upsertExistingLeaveTypeInProgress: false, leaveTypeErrors: action.validationMessages };
        case LeaveTypeActionTypes.LoadLeaveTypeByIdTriggered:
            return { ...state, loadingLeaveTypesList: true };
        case LeaveTypeActionTypes.LoadLeaveTypeByIdCompleted:
            return { ...state, loadingLeaveTypesList: false, leaveTypeData: action.leaveTypeById };
        case LeaveTypeActionTypes.LoadLeaveTypeByIdFailed:
            return { ...state, loadingLeaveTypesList: false, leaveTypeErrors: action.validationMessages };
        default:
            return state;
    }
}