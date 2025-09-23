import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { EmployeePersonalDetailsModel } from '../../models/employee-personal-details-model';

import { EmployeePersonalDetailsActionTypes, EmployeePersonalDetailsActions } from '../actions/employee-personal-details.actions';

export interface State extends EntityState<EmployeePersonalDetailsModel> {
    gettingEmployeePersonalDetailsById: boolean;
    creatingEmployeePersonalDetails: boolean;
    employeePersonalDetailsId: string;
    createEmployeePersonalDetailsErrors: string[];
    employeePersonalDetailsData: EmployeePersonalDetailsModel;
    getEmployeePersonalDetailsErrors: string[];
    exceptionMessage: string;
}

export const employeePersonalDetailsAdapter: EntityAdapter<
    EmployeePersonalDetailsModel
> = createEntityAdapter<EmployeePersonalDetailsModel>({
    selectId: (employeePersonalDetailsData: EmployeePersonalDetailsModel) => employeePersonalDetailsData.employeeId
});

export const initialState: State = employeePersonalDetailsAdapter.getInitialState({
    gettingEmployeePersonalDetailsById: false,
    creatingEmployeePersonalDetails: false,
    employeePersonalDetailsId: '',
    createEmployeePersonalDetailsErrors: [''],
    employeePersonalDetailsData: null,
    getEmployeePersonalDetailsErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeePersonalDetailsActions
): State {
    switch (action.type) {
        case EmployeePersonalDetailsActionTypes.CreateEmployeePersonalDetailsTriggered:
            return { ...state, creatingEmployeePersonalDetails: true };
        case EmployeePersonalDetailsActionTypes.CreateEmployeePersonalDetailsCompleted:
            return { ...state, creatingEmployeePersonalDetails: false, employeePersonalDetailsId: action.employeePersonalDetailsId };
        case EmployeePersonalDetailsActionTypes.CreateEmployeePersonalDetailsFailed:
            return { ...state, creatingEmployeePersonalDetails: false, createEmployeePersonalDetailsErrors: action.validationMessages };
        case EmployeePersonalDetailsActionTypes.GetEmployeeDetailsByIdTriggered:
            return { ...state, gettingEmployeePersonalDetailsById: true };
        case EmployeePersonalDetailsActionTypes.GetEmployeeDetailsByIdCompleted:
            return { ...state, gettingEmployeePersonalDetailsById: false, employeePersonalDetailsData: action.employeePersonalDetailsData };
        case EmployeePersonalDetailsActionTypes.GetEmployeeDetailsByIdFailed:
            return { ...state, creatingEmployeePersonalDetails: false, getEmployeePersonalDetailsErrors: action.validationMessages };
        case EmployeePersonalDetailsActionTypes.ExceptionHandled:
            return { ...state, creatingEmployeePersonalDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}