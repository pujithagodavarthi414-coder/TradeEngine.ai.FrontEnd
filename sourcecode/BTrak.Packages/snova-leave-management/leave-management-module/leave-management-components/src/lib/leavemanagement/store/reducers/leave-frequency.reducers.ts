import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { LeaveFrequencyTypeModel } from '../../models/leave-frequency-type-model';
import { LeaveManagementActions, LeaveFrequencyActionTypes } from '../actions/leave-frequency.actions';

export interface State extends EntityState<LeaveFrequencyTypeModel> {
    loadingLeaveFrequencyTypesList: boolean;
    upsertLeaveFrequencyInProgress: boolean;
    loadEncashmentTypesInprogress: boolean;
    loadLeaveFormulasInprogress: boolean;
    loadRestrictionTypesInprogress: boolean;
    loadFrequencyDetailsInprogress: boolean;
    leaveFrequencyDetails: LeaveFrequencyTypeModel;
    leaveFrequencyTypeErrors: string[];
    encashmentTypeErrors: string[];
    leaveFormulaErrors: string[];
    restrictionTypeErrors: string[];
    leaveTypeId: string;
    encashmentTypes: any;
    leaveFormulas: any;
    restrictionTypes: any;
    leaveFrequencyType: LeaveFrequencyTypeModel;
    exceptionMessage: string;
    upsertexistingLeaveFrequencyInProgress: boolean;
}

export const leaveFrequnecyAdapter: EntityAdapter<
    LeaveFrequencyTypeModel
> = createEntityAdapter<LeaveFrequencyTypeModel>({
    selectId: (leaveTypes: LeaveFrequencyTypeModel) => leaveTypes.leaveFrequencyId
});

export const initialState: State = leaveFrequnecyAdapter.getInitialState({
    loadingLeaveFrequencyTypesList: false,
    upsertLeaveFrequencyInProgress: false,
    upsertexistingLeaveFrequencyInProgress: false,
    loadEncashmentTypesInprogress: false,
    loadLeaveFormulasInprogress: false,
    loadRestrictionTypesInprogress: false,
    loadFrequencyDetailsInprogress: false,
    encashmentTypes: null,
    leaveFormulas: null,
    restrictionTypes: null,
    leaveFrequencyTypeErrors: [''],
    encashmentTypeErrors: [''],
    leaveFormulaErrors: [''],
    restrictionTypeErrors: [''],
    exceptionMessage: '',
    leaveTypeId: '',
    leaveFrequencyDetails: null,
    leaveFrequencyType: null
});

export function reducer(
    state: State = initialState,
    action: LeaveManagementActions
): State {
    switch (action.type) {
        case LeaveFrequencyActionTypes.LoadLeaveFrequenciesTriggered:
            return { ...state, loadingLeaveFrequencyTypesList: true };
        case LeaveFrequencyActionTypes.LoadLeaveFrequenciesCompleted:
            return leaveFrequnecyAdapter.addAll(action.leaveFrequencyTypesList, {
                ...state,
                loadingLeaveFrequencyTypesList: false
            });
        case LeaveFrequencyActionTypes.LoadLeaveFrequenciesFailed:
            return { ...state, loadingLeaveFrequencyTypesList: false, leaveFrequencyTypeErrors: action.validationMessages };
        case LeaveFrequencyActionTypes.ExceptionHandled:
            return { ...state, loadingLeaveFrequencyTypesList: false, exceptionMessage: action.errorMessage };
        case LeaveFrequencyActionTypes.LoadLeaveFrequenciesByIdTriggered:
            return { ...state, loadingLeaveFrequencyTypesList: true };
        case LeaveFrequencyActionTypes.LoadLeaveFrequenciesByIdCompleted:
            return { ...state, loadingLeaveFrequencyTypesList: false, leaveFrequencyType: action.leaveFrequencyType };
        case LeaveFrequencyActionTypes.LoadLeaveFrequenciesByIdFailed:
            return { ...state, loadingLeaveFrequencyTypesList: false, leaveFrequencyTypeErrors: action.validationMessages };
        case LeaveFrequencyActionTypes.AddNewLeaveTypeFrequencyTriggered:
            return { ...state, upsertLeaveFrequencyInProgress: true };
        case LeaveFrequencyActionTypes.AddNewLeaveTypeFrequencyCompleted:
            return { ...state, upsertLeaveFrequencyInProgress: false, leaveTypeId: action.leaveTypeId };
        case LeaveFrequencyActionTypes.AddNewLeaveTypeFrequencyFailed:
            return { ...state, upsertLeaveFrequencyInProgress: false, leaveFrequencyTypeErrors: action.validationMessages };
        case LeaveFrequencyActionTypes.UpdateLeaveTypeFrequencyTriggered:
            return { ...state, upsertexistingLeaveFrequencyInProgress: true };
        case LeaveFrequencyActionTypes.UpdateLeaveTypeFrequencyCompleted:
            return { ...state, upsertexistingLeaveFrequencyInProgress: false, leaveTypeId: action.leaveTypeId };
        case LeaveFrequencyActionTypes.UpdateLeaveTypeFrequencyFailed:
            return { ...state, upsertexistingLeaveFrequencyInProgress: false, leaveFrequencyTypeErrors: action.validationMessages };
        case LeaveFrequencyActionTypes.LoadEncashmentTypesTriggered:
            return { ...state, loadEncashmentTypesInprogress: true };
        case LeaveFrequencyActionTypes.LoadEncashmentTypesCompleted:
            return { ...state, loadEncashmentTypesInprogress: false, encashmentTypes: action.encashmentTypes };
        case LeaveFrequencyActionTypes.LoadEncashmentTypesFailed:
            return { ...state, loadEncashmentTypesInprogress: false, encashmentTypeErrors: action.validationMessages };
        case LeaveFrequencyActionTypes.LoadLeaveFormulasTriggered:
            return { ...state, loadLeaveFormulasInprogress: true };
        case LeaveFrequencyActionTypes.LoadLeaveFormulasCompleted:
            return { ...state, loadLeaveFormulasInprogress: false, leaveFormulas: action.leaveFormulas };
        case LeaveFrequencyActionTypes.LoadLeaveFormulasFailed:
            return { ...state, loadLeaveFormulasInprogress: false, leaveFormulaErrors: action.validationMessages };
        case LeaveFrequencyActionTypes.LoadRestrictionTypesTriggered:
            return { ...state, loadRestrictionTypesInprogress: true };
        case LeaveFrequencyActionTypes.LoadRestrictionTypesCompleted:
            return { ...state, loadRestrictionTypesInprogress: false, restrictionTypes: action.restrictionTypesList };
        case LeaveFrequencyActionTypes.LoadRestrictionTypesFailed:
            return { ...state, loadRestrictionTypesInprogress: false, restrictionTypeErrors: action.validationMessages };
        case LeaveFrequencyActionTypes.LoadLeaveFrequenciesByFrequencyIdTriggered:
            return { ...state, loadFrequencyDetailsInprogress: true };
        case LeaveFrequencyActionTypes.LoadLeaveFrequenciesByFrequencyIdCompleted:
            return { ...state, loadFrequencyDetailsInprogress: false, leaveFrequencyDetails: action.leaveFrequencyDetails };
        case LeaveFrequencyActionTypes.LoadLeaveFrequenciesByFrequencyIdFailed:
            return { ...state, loadFrequencyDetailsInprogress: false, leaveFrequencyTypeErrors: action.validationMessages };
        default:
            return state;
    }
}