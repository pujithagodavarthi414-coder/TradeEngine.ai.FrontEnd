import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { EmployeeWorkExperienceDetailsModel } from '../../models/employee-work-experience-details-model';
import { EmployeeWorkExperienceDetailsActionTypes, EmployeeWorkExperienceDetailsActions } from '../actions/employee-work-experience-details.actions';

export interface State extends EntityState<EmployeeWorkExperienceDetailsModel> {
    loadingEmployeeWorkExperienceDetails: boolean;
    creatingEmployeeWorkExperienceDetails: boolean;
    employeeWorkExperienceDetailsFailed: boolean;
    employeeWorkExperienceDetailsId: string;
    employeeWorkExperienceDetailsErrors: string[];
    gettingEmployeeWorkExperienceDetailsById: boolean;
    employeeWorkExperienceDetailsData: EmployeeWorkExperienceDetailsModel;
    exceptionMessage: string;
}

export const employeeWorkExperienceDetailsAdapter: EntityAdapter<
    EmployeeWorkExperienceDetailsModel
> = createEntityAdapter<EmployeeWorkExperienceDetailsModel>({
    selectId: (employeeWorkExperienceDetailsList: EmployeeWorkExperienceDetailsModel) => employeeWorkExperienceDetailsList.employeeWorkExperienceId
});

export const initialState: State = employeeWorkExperienceDetailsAdapter.getInitialState({
    loadingEmployeeWorkExperienceDetails: false,
    creatingEmployeeWorkExperienceDetails: false,
    employeeWorkExperienceDetailsFailed: false,
    employeeWorkExperienceDetailsId: '',
    employeeWorkExperienceDetailsErrors: [''],
    gettingEmployeeWorkExperienceDetailsById: false,
    employeeWorkExperienceDetailsData: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeWorkExperienceDetailsActions
): State {
    switch (action.type) {
        case EmployeeWorkExperienceDetailsActionTypes.LoadEmployeeWorkExperienceDetailsTriggered:
            return { ...state, loadingEmployeeWorkExperienceDetails: true };
        case EmployeeWorkExperienceDetailsActionTypes.LoadEmployeeWorkExperienceDetailsCompleted:
            return employeeWorkExperienceDetailsAdapter.addAll(action.employeeWorkExperienceDetailsList, {
                ...state,
                loadingEmployeeWorkExperienceDetails: false
            });
        case EmployeeWorkExperienceDetailsActionTypes.LoadEmployeeWorkExperienceDetailsFailed:
            return { ...state, loadingEmployeeWorkExperienceDetails: false, employeeWorkExperienceDetailsErrors: action.validationMessages };
        case EmployeeWorkExperienceDetailsActionTypes.CreateEmployeeWorkExperienceDetailsTriggered:
            return { ...state, creatingEmployeeWorkExperienceDetails: true };
        case EmployeeWorkExperienceDetailsActionTypes.CreateEmployeeWorkExperienceDetailsCompleted:
            return { ...state, creatingEmployeeWorkExperienceDetails: false, employeeWorkExperienceDetailsId: action.employeeWorkExperienceDetailId };
        case EmployeeWorkExperienceDetailsActionTypes.CreateEmployeeWorkExperienceDetailsFailed:
            return { ...state, creatingEmployeeWorkExperienceDetails: false, employeeWorkExperienceDetailsErrors: action.validationMessages };
        case EmployeeWorkExperienceDetailsActionTypes.DeleteEmployeeWorkExperienceDetailsCompleted:
            return employeeWorkExperienceDetailsAdapter.removeOne(action.employeeWorkExperienceDetailId, {...state, creatingEmployeeWorkExperienceDetails: false});
        case EmployeeWorkExperienceDetailsActionTypes.GetEmployeeWorkExperienceDetailsByIdTriggered:
            return { ...state, gettingEmployeeWorkExperienceDetailsById: true };
        case EmployeeWorkExperienceDetailsActionTypes.GetEmployeeWorkExperienceDetailsByIdCompleted:
            return { ...state, gettingEmployeeWorkExperienceDetailsById: false, employeeWorkExperienceDetailsData: action.employeeWorkExperienceDetails };
        case EmployeeWorkExperienceDetailsActionTypes.GetEmployeeWorkExperienceDetailsByIdFailed:
            return { ...state, gettingEmployeeWorkExperienceDetailsById: false, employeeWorkExperienceDetailsErrors: action.validationMessages };
        case EmployeeWorkExperienceDetailsActionTypes.UpdateEmployeeWorkExperienceDetailsById:
            return employeeWorkExperienceDetailsAdapter.updateOne(action.employeeWorkExperienceDetailsUpdates.employeeWorkExperienceDetailsUpdate, state);
        case EmployeeWorkExperienceDetailsActionTypes.RefreshEmployeeWorkExperienceDetailsList:
            return employeeWorkExperienceDetailsAdapter.upsertOne(action.employeeWorkExperienceDetails, state);
        case EmployeeWorkExperienceDetailsActionTypes.ExceptionHandled:
            return { ...state, loadingEmployeeWorkExperienceDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}