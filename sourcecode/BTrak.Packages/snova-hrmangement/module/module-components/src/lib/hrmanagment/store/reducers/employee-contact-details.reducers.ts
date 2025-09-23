import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EmployeeContactDetailsModel } from '../../models/employee-contact-details-model';
import { EmployeeContactDetailsActions, EmployeeContactDetailsActionTypes } from '../actions/employee-contact-details.actions';


export interface State extends EntityState<EmployeeContactDetailsModel> {
    gettingEmployeeContactDetails: boolean;
    creatingEmployeeContactDetailsLoading: boolean;
    employeeContactDetailsData: EmployeeContactDetailsModel[];
    createEmployeeContactDetailErrors: string[];
    exceptionMessage: string;
}

export const employeeContactDetailsAdapter: EntityAdapter<
    EmployeeContactDetailsModel
> = createEntityAdapter<EmployeeContactDetailsModel>({
    selectId: (contactDetails: EmployeeContactDetailsModel) => contactDetails.employeeId
});

export const initialState: State = employeeContactDetailsAdapter.getInitialState({
    gettingEmployeeContactDetails: false,
    creatingEmployeeContactDetailsLoading: false,
    employeeContactDetailsData: [],
    createEmployeeContactDetailErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeContactDetailsActions
): State {
    switch (action.type) {
        case EmployeeContactDetailsActionTypes.GetEmployeeContactDetailsTriggered:
            return { ...state, gettingEmployeeContactDetails: true };
        case EmployeeContactDetailsActionTypes.GetEmployeeContactDetailsCompleted:
            return { ...state, gettingEmployeeContactDetails: false, employeeContactDetailsData: action.employeeContactDetailsData };
        case EmployeeContactDetailsActionTypes.CreateEmployeeContactDetailsTriggered:
            return { ...state, creatingEmployeeContactDetailsLoading: true };
        case EmployeeContactDetailsActionTypes.CreateEmployeeContactDetailsCompleted:
            return { ...state, creatingEmployeeContactDetailsLoading: false };
        case EmployeeContactDetailsActionTypes.CreateEmployeeContactDetailsFailed:
            return { ...state, creatingEmployeeContactDetailsLoading: false, createEmployeeContactDetailErrors: action.validationMessages };
        case EmployeeContactDetailsActionTypes.ExceptionHandled:
            return { ...state, creatingEmployeeContactDetailsLoading: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}