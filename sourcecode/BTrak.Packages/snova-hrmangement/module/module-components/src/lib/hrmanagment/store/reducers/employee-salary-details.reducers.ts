import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EmployeeSalaryDetailsModel } from '../../models/employee-salary-details-model';
import { EmployeeSalaryDetailsActions, EmployeeSalaryDetailsActionTypes } from '../actions/employee-salary-details.actions';




export interface State extends EntityState<EmployeeSalaryDetailsModel> {
    loadingEmployeeSalaryDetails: boolean;
    creatingEmployeeSalaryDetails: boolean;
    employeeSalaryDetailsId: string;
    createEmployeeSalaryDetailsErrors: string[];
    gettingEmployeeSalaryDetailsById: boolean;
    employeeSalaryDetailsData: EmployeeSalaryDetailsModel;
    exceptionMessage: string;
}

export const employeeSalaryDetailsAdapter: EntityAdapter<
    EmployeeSalaryDetailsModel
> = createEntityAdapter<EmployeeSalaryDetailsModel>({
    selectId: (employeeSalaryDetailsList: EmployeeSalaryDetailsModel) => employeeSalaryDetailsList.employeeSalaryDetailId
});

export const initialState: State = employeeSalaryDetailsAdapter.getInitialState({
    loadingEmployeeSalaryDetails: false,
    creatingEmployeeSalaryDetails: false,
    employeeSalaryDetailsId: '',
    createEmployeeSalaryDetailsErrors: [''],
    gettingEmployeeSalaryDetailsById: false,
    employeeSalaryDetailsData: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeSalaryDetailsActions
): State {
    switch (action.type) {
        case EmployeeSalaryDetailsActionTypes.LoadEmployeeSalaryDetailsTriggered:
            return { ...state, loadingEmployeeSalaryDetails: true };
        case EmployeeSalaryDetailsActionTypes.LoadEmployeeSalaryDetailsCompleted:
            return employeeSalaryDetailsAdapter.addAll(action.employeeSalaryDetailsList, {
                ...state,
                loadingEmployeeSalaryDetails: false
            });
        case EmployeeSalaryDetailsActionTypes.LoadEmployeeSalaryDetailsFailed:
            return { ...state, loadingEmployeeSalaryDetails: false, createEmployeeSalaryDetailsErrors: action.validationMessages };
        case EmployeeSalaryDetailsActionTypes.CreateEmployeeSalaryDetailsTriggered:
            return { ...state, creatingEmployeeSalaryDetails: true };
        case EmployeeSalaryDetailsActionTypes.CreateEmployeeSalaryDetailsCompleted:
            return { ...state, creatingEmployeeSalaryDetails: false, employeeSalaryDetailsId: action.employeeSalaryDetailId };
        case EmployeeSalaryDetailsActionTypes.DeleteEmployeeSalaryDetailsCompleted:
            return employeeSalaryDetailsAdapter.removeOne(action.employeeSalaryDetailId, { ...state, creatingEmployeeSalaryDetails: false });
        case EmployeeSalaryDetailsActionTypes.CreateEmployeeSalaryDetailsFailed:
            return { ...state, creatingEmployeeSalaryDetails: false, createEmployeeSalaryDetailsErrors: action.validationMessages };
        case EmployeeSalaryDetailsActionTypes.GetEmployeeSalaryDetailsByIdTriggered:
            return { ...state, gettingEmployeeSalaryDetailsById: true };
        case EmployeeSalaryDetailsActionTypes.GetEmployeeSalaryDetailsByIdCompleted:
            return { ...state, gettingEmployeeSalaryDetailsById: false, employeeSalaryDetailsData: action.employeeSalaryDetails };
        case EmployeeSalaryDetailsActionTypes.GetEmployeeSalaryDetailsByIdFailed:
            return { ...state, gettingEmployeeSalaryDetailsById: false, createEmployeeSalaryDetailsErrors: action.validationMessages };
        case EmployeeSalaryDetailsActionTypes.UpdateEmployeeSalaryDetailsById:
            return employeeSalaryDetailsAdapter.updateOne(action.employeeSalaryDetailsUpdates.employeeSalaryDetailsUpdate, state);
        case EmployeeSalaryDetailsActionTypes.RefreshEmployeeSalaryDetailsList:
            return employeeSalaryDetailsAdapter.upsertOne(action.employeeSalaryDetails, state);
        case EmployeeSalaryDetailsActionTypes.ExceptionHandled:
            return { ...state, loadingEmployeeSalaryDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}