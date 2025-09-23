import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { EmployeeLanguageDetailsModel } from '../../models/employee-language-details-model';

import { EmployeeLanguageDetailsActionTypes, EmployeeLanguageDetailsActions } from '../actions/employee-language-details.actions';

export interface State extends EntityState<EmployeeLanguageDetailsModel> {
    loadingEmployeeLanguageDetails: boolean;
    creatingEmployeeLanguageDetails: boolean;
    employeeLanguageDetailsFailed: boolean;
    employeeLanguageDetailsId: string;
    employeeLanguageDetailsErrors: string[];
    gettingEmployeeLanguageDetailsById: boolean;
    employeeLanguageDetailsData: EmployeeLanguageDetailsModel;
    exceptionMessage: string;
}

export const employeeLanguageDetailsAdapter: EntityAdapter<
    EmployeeLanguageDetailsModel
> = createEntityAdapter<EmployeeLanguageDetailsModel>({
    selectId: (employeeLanguageDetailsList: EmployeeLanguageDetailsModel) => employeeLanguageDetailsList.employeeLanguageId
});

export const initialState: State = employeeLanguageDetailsAdapter.getInitialState({
    loadingEmployeeLanguageDetails: false,
    creatingEmployeeLanguageDetails: false,
    employeeLanguageDetailsFailed: false,
    employeeLanguageDetailsId: '',
    employeeLanguageDetailsErrors: [''],
    gettingEmployeeLanguageDetailsById: false,
    employeeLanguageDetailsData: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeLanguageDetailsActions
): State {
    switch (action.type) {
        case EmployeeLanguageDetailsActionTypes.LoadEmployeeLanguageDetailsTriggered:
            return { ...state, loadingEmployeeLanguageDetails: true };
        case EmployeeLanguageDetailsActionTypes.LoadEmployeeLanguageDetailsCompleted:
            return employeeLanguageDetailsAdapter.addAll(action.employeeLanguageDetailsList, {
                ...state,
                loadingEmployeeLanguageDetails: false
            });
        case EmployeeLanguageDetailsActionTypes.LoadEmployeeLanguageDetailsFailed:
            return { ...state, loadingEmployeeLanguageDetails: false, employeeLanguageDetailsErrors: action.validationMessages };
        case EmployeeLanguageDetailsActionTypes.CreateEmployeeLanguageDetailsTriggered:
            return { ...state, creatingEmployeeLanguageDetails: true };
        case EmployeeLanguageDetailsActionTypes.CreateEmployeeLanguageDetailsCompleted:
            return { ...state, creatingEmployeeLanguageDetails: false, employeeLanguageDetailsId: action.employeeLanguageDetailId };
        case EmployeeLanguageDetailsActionTypes.CreateEmployeeLanguageDetailsFailed:
            return { ...state, creatingEmployeeLanguageDetails: false, employeeLanguageDetailsErrors: action.validationMessages };
        case EmployeeLanguageDetailsActionTypes.DeleteEmployeeLanguageDetailsCompleted:
            return employeeLanguageDetailsAdapter.removeOne(action.employeeLanguageDetailId, {...state, creatingEmployeeLanguageDetails: false});
        case EmployeeLanguageDetailsActionTypes.GetEmployeeLanguageDetailsByIdTriggered:
            return { ...state, gettingEmployeeLanguageDetailsById: true };
        case EmployeeLanguageDetailsActionTypes.GetEmployeeLanguageDetailsByIdCompleted:
            return { ...state, gettingEmployeeLanguageDetailsById: false, employeeLanguageDetailsData: action.employeeLanguageDetails };
        case EmployeeLanguageDetailsActionTypes.GetEmployeeLanguageDetailsByIdFailed:
            return { ...state, gettingEmployeeLanguageDetailsById: false, employeeLanguageDetailsErrors: action.validationMessages };
        case EmployeeLanguageDetailsActionTypes.UpdateEmployeeLanguageDetailsById:
            return employeeLanguageDetailsAdapter.updateOne(action.employeeLanguageDetailsUpdates.employeeLanguageDetailsUpdate, state);
        case EmployeeLanguageDetailsActionTypes.RefreshEmployeeLanguageDetailsList:
            return employeeLanguageDetailsAdapter.upsertOne(action.employeeLanguageDetails, state);
        case EmployeeLanguageDetailsActionTypes.ExceptionHandled:
            return { ...state, loadingEmployeeLanguageDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}