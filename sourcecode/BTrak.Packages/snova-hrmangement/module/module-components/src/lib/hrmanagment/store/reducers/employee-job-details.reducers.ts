import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { EmployeeJobDetailsModel } from '../../models/employee-job-model';

import { EmployeeJobDetailsActionTypes, EmployeeJobDetailsActions } from '../actions/employee-job-details.action';

export interface State extends EntityState<EmployeeJobDetailsModel> {
    gettingEmployeeJobDetailsById: boolean;
    creatingEmployeeJobDetails: boolean;
    employeeJobDetailsId: string;
    createEmployeeJobDetailsErrors: string[];
    employeeJobDetailsData: EmployeeJobDetailsModel;
    getEmployeeJobDetailsErrors: string[];
    exceptionMessage: string;
}

export const employeeJobDetailsAdapter: EntityAdapter<
    EmployeeJobDetailsModel
> = createEntityAdapter<EmployeeJobDetailsModel>({
    selectId: (employeeJobDetailsData: EmployeeJobDetailsModel) => employeeJobDetailsData.employeeJobDetailId
});

export const initialState: State = employeeJobDetailsAdapter.getInitialState({
    gettingEmployeeJobDetailsById: false,
    creatingEmployeeJobDetails: false,
    employeeJobDetailsId: '',
    createEmployeeJobDetailsErrors: [''],
    employeeJobDetailsData: null,
    getEmployeeJobDetailsErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeJobDetailsActions
): State {
    switch (action.type) {
        case EmployeeJobDetailsActionTypes.CreateEmployeeJobDetailsTriggered:
            return { ...state, creatingEmployeeJobDetails: true };
        case EmployeeJobDetailsActionTypes.CreateEmployeeJobDetailsCompleted:
            return { ...state, creatingEmployeeJobDetails: false, employeeJobDetailsId: action.employeeJobDetailsId };
        case EmployeeJobDetailsActionTypes.CreateEmployeeJobDetailsFailed:
            return { ...state, creatingEmployeeJobDetails: false, createEmployeeJobDetailsErrors: action.validationMessages };
        case EmployeeJobDetailsActionTypes.GetEmployeeJobDetailsByIdTriggered:
            return { ...state, gettingEmployeeJobDetailsById: true };
        case EmployeeJobDetailsActionTypes.GetEmployeeJobDetailsByIdCompleted:
            return { ...state, gettingEmployeeJobDetailsById: false, employeeJobDetailsData: action.employeeJobDetailsData };
        case EmployeeJobDetailsActionTypes.GetEmployeeJobDetailsByIdFailed:
            return { ...state, creatingEmployeeJobDetails: false, getEmployeeJobDetailsErrors: action.validationMessages };
        case EmployeeJobDetailsActionTypes.ExceptionHandled:
            return { ...state, creatingEmployeeJobDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}