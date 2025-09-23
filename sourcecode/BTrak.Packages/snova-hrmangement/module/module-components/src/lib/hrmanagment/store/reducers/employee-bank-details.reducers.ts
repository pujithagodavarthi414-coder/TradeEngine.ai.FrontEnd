import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EmployeeBankDetailsModel } from '../../models/employee-bank-details-model';
import { EmployeeBankDetailsActions, EmployeeBankDetailsActionTypes } from '../actions/employee-bank-details.actions';




export interface State extends EntityState<EmployeeBankDetailsModel> {
    loadingEmployeeBankDetails: boolean;
    creatingEmployeeBankDetails: boolean;
    employeeBankDetailsId: string;
    createEmployeeBankDetailsErrors: string[];
    gettingEmployeeBankDetailsById: boolean;
    employeeBankDetailsData: EmployeeBankDetailsModel;
    exceptionMessage: string;
}

export const employeeBankDetailsAdapter: EntityAdapter<
    EmployeeBankDetailsModel
> = createEntityAdapter<EmployeeBankDetailsModel>({
    selectId: (employeeBankDetailsList: EmployeeBankDetailsModel) => employeeBankDetailsList.employeeBankId
});

export const initialState: State = employeeBankDetailsAdapter.getInitialState({
    loadingEmployeeBankDetails: false,
    creatingEmployeeBankDetails: false,
    employeeBankDetailsId: '',
    createEmployeeBankDetailsErrors: [''],
    gettingEmployeeBankDetailsById: false,
    employeeBankDetailsData: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeBankDetailsActions
): State {
    switch (action.type) {
        case EmployeeBankDetailsActionTypes.LoadEmployeeBankDetailsTriggered:
            return { ...state, loadingEmployeeBankDetails: true };
        case EmployeeBankDetailsActionTypes.LoadEmployeeBankDetailsCompleted:
            return employeeBankDetailsAdapter.addAll(action.employeeBankDetailsList, {
                ...state,
                loadingEmployeeBankDetails: false
            });
        case EmployeeBankDetailsActionTypes.LoadEmployeeBankDetailsFailed:
            return { ...state, loadingEmployeeBankDetails: false, createEmployeeBankDetailsErrors: action.validationMessages };
        case EmployeeBankDetailsActionTypes.CreateEmployeeBankDetailsTriggered:
            return { ...state, creatingEmployeeBankDetails: true };
        case EmployeeBankDetailsActionTypes.CreateEmployeeBankDetailsCompleted:
            return { ...state, creatingEmployeeBankDetails: false, employeeBankDetailsId: action.employeeBankDetailId };
        case EmployeeBankDetailsActionTypes.DeleteEmployeeBankDetailsCompleted:
            return employeeBankDetailsAdapter.removeOne(action.employeeBankDetailId, { ...state, creatingEmployeeBankDetails: false });
        case EmployeeBankDetailsActionTypes.CreateEmployeeBankDetailsFailed:
            return { ...state, creatingEmployeeBankDetails: false, createEmployeeBankDetailsErrors: action.validationMessages };
        case EmployeeBankDetailsActionTypes.GetEmployeeBankDetailsByIdTriggered:
            return { ...state, gettingEmployeeBankDetailsById: true };
        case EmployeeBankDetailsActionTypes.GetEmployeeBankDetailsByIdCompleted:
            return { ...state, gettingEmployeeBankDetailsById: false, employeeBankDetailsData: action.employeeBankDetails };
        case EmployeeBankDetailsActionTypes.GetEmployeeBankDetailsByIdFailed:
            return { ...state, gettingEmployeeBankDetailsById: false, createEmployeeBankDetailsErrors: action.validationMessages };
        case EmployeeBankDetailsActionTypes.UpdateEmployeeBankDetailsById:
            return employeeBankDetailsAdapter.updateOne(action.employeeBankDetailsUpdates.employeeBankDetailsUpdate, state);
        case EmployeeBankDetailsActionTypes.RefreshEmployeeBankDetailsList:
            return employeeBankDetailsAdapter.upsertOne(action.employeeBankDetails, state);
        case EmployeeBankDetailsActionTypes.ExceptionHandled:
            return { ...state, loadingEmployeeBankDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}