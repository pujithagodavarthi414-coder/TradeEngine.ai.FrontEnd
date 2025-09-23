import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { EmployeeDependentContactModel } from '../../models/employee-dependent-contact-model';
import { EmployeeDependentDetailsActionTypes, EmployeeDependentDetailsActions } from '../actions/employee-dependent-details.actions';

export interface State extends EntityState<EmployeeDependentContactModel> {
    loadingEmployeeDependentDetails: boolean;
    creatingEmployeeDependentDetails: boolean;
    employeeDependentDetailsId: string;
    createEmployeeDependentDetailsErrors: string[];
    gettingEmployeeDependentDetailsById: boolean;
    employeeDependentDetailsData: EmployeeDependentContactModel;
    exceptionMessage: string;
}

export const employeeDependentDetailsAdapter: EntityAdapter<
    EmployeeDependentContactModel
> = createEntityAdapter<EmployeeDependentContactModel>({
    selectId: (employeeDependentDetailsList: EmployeeDependentContactModel) => employeeDependentDetailsList.employeeDependentId
});

export const initialState: State = employeeDependentDetailsAdapter.getInitialState({
    loadingEmployeeDependentDetails: false,
    creatingEmployeeDependentDetails: false,
    employeeDependentDetailsId: '',
    createEmployeeDependentDetailsErrors: [''],
    gettingEmployeeDependentDetailsById: false,
    employeeDependentDetailsData: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeDependentDetailsActions
): State {
    switch (action.type) {
        case EmployeeDependentDetailsActionTypes.LoadEmployeeDependentDetailsTriggered:
            return { ...state, loadingEmployeeDependentDetails: true };
        case EmployeeDependentDetailsActionTypes.LoadEmployeeDependentDetailsCompleted:
            return employeeDependentDetailsAdapter.addAll(action.employeeDependentDetailsList, {
                ...state,
                loadingEmployeeDependentDetails: false
            });
        case EmployeeDependentDetailsActionTypes.CreateEmployeeDependentDetailsTriggered:
            return { ...state, creatingEmployeeDependentDetails: true };
        case EmployeeDependentDetailsActionTypes.CreateEmployeeDependentDetailsCompleted:
            return { ...state, creatingEmployeeDependentDetails: false, employeeDependentDetailsId: action.employeeDependentDetailId };
        case EmployeeDependentDetailsActionTypes.DeleteEmployeeDependentDetailsCompleted:
            return employeeDependentDetailsAdapter.removeOne(action.employeeDependentDetailId, {...state, creatingEmployeeDependentDetails: false});
        case EmployeeDependentDetailsActionTypes.EmployeeDependentDetailsFailed:
            return { ...state, creatingEmployeeDependentDetails: false, createEmployeeDependentDetailsErrors: action.validationMessages };
        case EmployeeDependentDetailsActionTypes.GetEmployeeDependentDetailsByIdTriggered:
            return { ...state, gettingEmployeeDependentDetailsById: true };
        case EmployeeDependentDetailsActionTypes.GetEmployeeDependentDetailsByIdCompleted:
            return { ...state, gettingEmployeeDependentDetailsById: false, employeeDependentDetailsData: action.employeeDependentDetails };
        case EmployeeDependentDetailsActionTypes.UpdateEmployeeDependentDetailsById:
            return employeeDependentDetailsAdapter.updateOne(action.employeeDependentDetailsUpdates.employeeDependentDetailsUpdate, state);
        case EmployeeDependentDetailsActionTypes.RefreshEmployeeDependentDetailsList:
            return employeeDependentDetailsAdapter.upsertOne(action.employeeDependentDetails, state);
        case EmployeeDependentDetailsActionTypes.ExceptionHandled:
            return { ...state, loadingEmployeeDependentDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}