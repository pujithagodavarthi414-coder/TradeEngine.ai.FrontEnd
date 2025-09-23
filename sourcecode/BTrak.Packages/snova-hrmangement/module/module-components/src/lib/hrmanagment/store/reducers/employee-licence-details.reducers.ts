import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { EmployeeLicenceDetailsModel } from '../../models/employee-licence-details-model';

import { EmployeeLicenceDetailsActions, EmployeeLicenceDetailsActionTypes } from '../actions/employee-licence-details.actions';

export interface State extends EntityState<EmployeeLicenceDetailsModel> {
    loadingEmployeeLicenceDetails: boolean;
    creatingEmployeeLicenceDetails: boolean;
    employeeLicenceDetailsId: string;
    createEmployeeLicenceDetailsErrors: string[];
    gettingEmployeeLicenceDetailsById: boolean;
    employeeLicenceDetailsData: EmployeeLicenceDetailsModel;
    exceptionMessage: string;
}

export const employeeLicenceDetailsAdapter: EntityAdapter<
    EmployeeLicenceDetailsModel
> = createEntityAdapter<EmployeeLicenceDetailsModel>({
    selectId: (employeeLicenceDetailsList: EmployeeLicenceDetailsModel) => employeeLicenceDetailsList.employeeLicenceDetailId
});

export const initialState: State = employeeLicenceDetailsAdapter.getInitialState({
    loadingEmployeeLicenceDetails: false,
    creatingEmployeeLicenceDetails: false,
    employeeLicenceDetailsId: '',
    createEmployeeLicenceDetailsErrors: [''],
    gettingEmployeeLicenceDetailsById: false,
    employeeLicenceDetailsData: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeLicenceDetailsActions
): State {
    switch (action.type) {
        case EmployeeLicenceDetailsActionTypes.LoadEmployeeLicenceDetailsTriggered:
            return { ...state, loadingEmployeeLicenceDetails: true };
        case EmployeeLicenceDetailsActionTypes.LoadEmployeeLicenceDetailsCompleted:
            return employeeLicenceDetailsAdapter.addAll(action.employeeLicenceDetailsList, {
                ...state,
                loadingEmployeeLicenceDetails: false
            });
        case EmployeeLicenceDetailsActionTypes.LoadEmployeeLicenceDetailsFailed:
            return { ...state, loadingEmployeeLicenceDetails: false, createEmployeeLicenceDetailsErrors: action.validationMessages };
        case EmployeeLicenceDetailsActionTypes.CreateEmployeeLicenceDetailsTriggered:
            return { ...state, creatingEmployeeLicenceDetails: true };
        case EmployeeLicenceDetailsActionTypes.CreateEmployeeLicenceDetailsCompleted:
            return { ...state, creatingEmployeeLicenceDetails: false, employeeLicenceDetailsId: action.employeeLicenceDetailId };
        case EmployeeLicenceDetailsActionTypes.DeleteEmployeeLicenceDetailsCompleted:
            return employeeLicenceDetailsAdapter.removeOne(action.employeeLicenceDetailId, { ...state, creatingEmployeeLicenceDetails: false });
        case EmployeeLicenceDetailsActionTypes.CreateEmployeeLicenceDetailsFailed:
            return { ...state, creatingEmployeeLicenceDetails: false, createEmployeeLicenceDetailsErrors: action.validationMessages };
        case EmployeeLicenceDetailsActionTypes.GetEmployeeLicenceDetailsByIdTriggered:
            return { ...state, gettingEmployeeLicenceDetailsById: true };
        case EmployeeLicenceDetailsActionTypes.GetEmployeeLicenceDetailsByIdCompleted:
            return { ...state, gettingEmployeeLicenceDetailsById: false, employeeLicenceDetailsData: action.employeeLicenceDetails };
        case EmployeeLicenceDetailsActionTypes.UpdateEmployeeLicenceDetailsById:
            return employeeLicenceDetailsAdapter.updateOne(action.employeeLicenceDetailsUpdates.employeeLicenceDetailsUpdate, state);
        case EmployeeLicenceDetailsActionTypes.RefreshEmployeeLicenceDetailsList:
            return employeeLicenceDetailsAdapter.upsertOne(action.employeeLicenceDetails, state);
        case EmployeeLicenceDetailsActionTypes.ExceptionHandled:
            return { ...state, creatingEmployeeLicenceDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}