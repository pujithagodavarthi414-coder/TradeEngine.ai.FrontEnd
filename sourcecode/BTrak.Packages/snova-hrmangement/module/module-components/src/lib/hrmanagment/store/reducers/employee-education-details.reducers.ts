import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EmployeeEducationDetailsModel } from '../../models/employee-education-details-model';
import { EmployeeEducationDetailsActions, EmployeeEducationDetailsActionTypes } from '../actions/employee-education-details.action';




export interface State extends EntityState<EmployeeEducationDetailsModel> {
    loadingEmployeeEducationDetails: boolean;
    creatingEmployeeEducationDetails: boolean;
    employeeEducationDetailsId: string;
    employeeEducationDetailsErrors: string[];
    gettingEmployeeEducationDetailsById: boolean;
    employeeEducationDetailsData: EmployeeEducationDetailsModel;
    exceptionMessage: string;
}

export const employeeEducationDetailsAdapter: EntityAdapter<
    EmployeeEducationDetailsModel
> = createEntityAdapter<EmployeeEducationDetailsModel>({
    selectId: (employeeEducationDetailsList: EmployeeEducationDetailsModel) => employeeEducationDetailsList.employeeEducationDetailId
});

export const initialState: State = employeeEducationDetailsAdapter.getInitialState({
    loadingEmployeeEducationDetails: false,
    creatingEmployeeEducationDetails: false,
    employeeEducationDetailsId: '',
    employeeEducationDetailsErrors: [''],
    gettingEmployeeEducationDetailsById: false,
    employeeEducationDetailsData: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeEducationDetailsActions
): State {
    switch (action.type) {
        case EmployeeEducationDetailsActionTypes.LoadEmployeeEducationDetailsTriggered:
            return { ...state, loadingEmployeeEducationDetails: true };
        case EmployeeEducationDetailsActionTypes.LoadEmployeeEducationDetailsCompleted:
            return employeeEducationDetailsAdapter.addAll(action.employeeEducationDetailsList, {
                ...state,
                loadingEmployeeEducationDetails: false
            });
        case EmployeeEducationDetailsActionTypes.LoadEmployeeEducationDetailsFailed:
            return { ...state, loadingEmployeeEducationDetails: false, employeeEducationDetailsErrors: action.validationMessages };
        case EmployeeEducationDetailsActionTypes.CreateEmployeeEducationDetailsTriggered:
            return { ...state, creatingEmployeeEducationDetails: true };
        case EmployeeEducationDetailsActionTypes.CreateEmployeeEducationDetailsCompleted:
            return { ...state, creatingEmployeeEducationDetails: false, employeeEducationDetailsId: action.employeeEducationDetailId };
        case EmployeeEducationDetailsActionTypes.DeleteEmployeeEducationDetailsCompleted:
            return employeeEducationDetailsAdapter.removeOne(action.employeeEducationDetailId, { ...state, creatingEmployeeEducationDetails: false });
        case EmployeeEducationDetailsActionTypes.CreateEmployeeEducationDetailsFailed:
            return { ...state, creatingEmployeeEducationDetails: false, employeeEducationDetailsErrors: action.validationMessages };
        case EmployeeEducationDetailsActionTypes.GetEmployeeEducationDetailsByIdTriggered:
            return { ...state, gettingEmployeeEducationDetailsById: true };
        case EmployeeEducationDetailsActionTypes.GetEmployeeEducationDetailsByIdCompleted:
            return { ...state, gettingEmployeeEducationDetailsById: false, employeeEducationDetailsData: action.employeeEducationDetails };
        case EmployeeEducationDetailsActionTypes.UpdateEmployeeEducationDetailsById:
            return employeeEducationDetailsAdapter.updateOne(action.employeeEducationDetailsUpdates.employeeEducationDetailsUpdate, state);
        case EmployeeEducationDetailsActionTypes.RefreshEmployeeEducationDetailsList:
            return employeeEducationDetailsAdapter.upsertOne(action.employeeEducationDetails, state);
        case EmployeeEducationDetailsActionTypes.ExceptionHandled:
            return { ...state, loadingEmployeeEducationDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}