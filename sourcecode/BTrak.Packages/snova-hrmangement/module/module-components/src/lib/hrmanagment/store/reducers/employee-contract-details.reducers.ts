import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EmployeeContractModel } from '../../models/employee-contract-model';
import { EmployeeContractDetailsActionTypes, EmployeeContractDetailsActions } from '../actions/employee-contract-details.actions';


export interface State extends EntityState<EmployeeContractModel> {
    loadingEmployeeContractDetails: boolean;
    creatingEmployeeContractDetails: boolean;
    employeeContractDetailsFailed: boolean;
    employeeContractDetailsId: string;
    employeeContractDetailsErrors: string[];
    gettingEmployeeContractDetailsById: boolean;
    employeeContractDetailsData: EmployeeContractModel;
    exceptionMessage: string;
}

export const employeeContractDetailsAdapter: EntityAdapter<
    EmployeeContractModel
> = createEntityAdapter<EmployeeContractModel>({
    selectId: (employeeContractDetailsList: EmployeeContractModel) => employeeContractDetailsList.employmentContractId
});

export const initialState: State = employeeContractDetailsAdapter.getInitialState({
    loadingEmployeeContractDetails: false,
    creatingEmployeeContractDetails: false,
    employeeContractDetailsFailed: false,
    employeeContractDetailsId: '',
    employeeContractDetailsErrors: [''],
    gettingEmployeeContractDetailsById: false,
    employeeContractDetailsData: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeContractDetailsActions
): State {
    switch (action.type) {
        case EmployeeContractDetailsActionTypes.LoadEmployeeContractDetailsTriggered:
            return { ...state, loadingEmployeeContractDetails: true };
        case EmployeeContractDetailsActionTypes.LoadEmployeeContractDetailsCompleted:
            return employeeContractDetailsAdapter.addAll(action.employeeContractDetailsList, {
                ...state,
                loadingEmployeeContractDetails: false
            });
        case EmployeeContractDetailsActionTypes.LoadEmployeeContractDetailsFailed:
            return { ...state, loadingEmployeeContractDetails: false, employeeContractDetailsErrors: action.validationMessages };
        case EmployeeContractDetailsActionTypes.CreateEmployeeContractDetailsTriggered:
            return { ...state, creatingEmployeeContractDetails: true };
        case EmployeeContractDetailsActionTypes.CreateEmployeeContractDetailsCompleted:
            return { ...state, creatingEmployeeContractDetails: false, employeeContractDetailsId: action.employeeContractDetailId };
        case EmployeeContractDetailsActionTypes.CreateEmployeeContractDetailsFailed:
            return { ...state, creatingEmployeeContractDetails: false, employeeContractDetailsErrors: action.validationMessages };
        case EmployeeContractDetailsActionTypes.DeleteEmployeeContractDetailsCompleted:
            return employeeContractDetailsAdapter.removeOne(action.employeeContractDetailId, {...state, creatingEmployeeContractDetails: false});
        case EmployeeContractDetailsActionTypes.GetEmployeeContractDetailsByIdTriggered:
            return { ...state, gettingEmployeeContractDetailsById: true };
        case EmployeeContractDetailsActionTypes.GetEmployeeContractDetailsByIdCompleted:
            return { ...state, gettingEmployeeContractDetailsById: false, employeeContractDetailsData: action.employeeContractDetails };
        case EmployeeContractDetailsActionTypes.GetEmployeeContractDetailsByIdFailed:
            return { ...state, gettingEmployeeContractDetailsById: false, employeeContractDetailsErrors: action.validationMessages };
        case EmployeeContractDetailsActionTypes.UpdateEmployeeContractDetailsById:
            return employeeContractDetailsAdapter.updateOne(action.employeeContractDetailsUpdates.employeeContractDetailsUpdate, state);
        case EmployeeContractDetailsActionTypes.RefreshEmployeeContractDetailsList:
            return employeeContractDetailsAdapter.upsertOne(action.employeeContractDetails, state);
        case EmployeeContractDetailsActionTypes.ExceptionHandled:
            return { ...state, loadingEmployeeContractDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}