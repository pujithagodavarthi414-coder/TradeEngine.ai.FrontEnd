import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EmployeeImmigrationDetailsModel } from '../../models/employee-immigration-details-model';
import { EmployeeImmigrationDetailsActions, EmployeeImmigrationDetailsActionTypes } from '../actions/employee-immigration-details.action';



export interface State extends EntityState<EmployeeImmigrationDetailsModel> {
    loadingEmployeeImmigrationDetails: boolean;
    creatingEmployeeImmigrationDetails: boolean;
    employeeImmigrationDetailsId: string;
    employeeImmigrationDetailsErrors: string[];
    gettingEmployeeImmigrationDetailsById: boolean;
    employeeImmigrationDetailsData: EmployeeImmigrationDetailsModel;
    exceptionMessage: string;
}

export const employeeImmigrationDetailsAdapter: EntityAdapter<
    EmployeeImmigrationDetailsModel
> = createEntityAdapter<EmployeeImmigrationDetailsModel>({
    selectId: (employeeImmigrationDetailsList: EmployeeImmigrationDetailsModel) => employeeImmigrationDetailsList.employeeImmigrationId
});

export const initialState: State = employeeImmigrationDetailsAdapter.getInitialState({
    loadingEmployeeImmigrationDetails: false,
    creatingEmployeeImmigrationDetails: false,
    employeeImmigrationDetailsId: '',
    employeeImmigrationDetailsErrors: [''],
    gettingEmployeeImmigrationDetailsById: false,
    employeeImmigrationDetailsData: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeImmigrationDetailsActions
): State {
    switch (action.type) {
        case EmployeeImmigrationDetailsActionTypes.LoadEmployeeImmigrationDetailsTriggered:
            return { ...state, loadingEmployeeImmigrationDetails: true };
        case EmployeeImmigrationDetailsActionTypes.LoadEmployeeImmigrationDetailsCompleted:
            return employeeImmigrationDetailsAdapter.addAll(action.employeeImmigrationDetailsList, {
                ...state,
                loadingEmployeeImmigrationDetails: false
            });
            case EmployeeImmigrationDetailsActionTypes.LoadEmployeeImmigrationDetailsFailed:
                return { ...state, loadingEmployeeImmigrationDetails: false, employeeImmigrationDetailsErrors: action.validationMessages };
        case EmployeeImmigrationDetailsActionTypes.CreateEmployeeImmigrationDetailsTriggered:
            return { ...state, creatingEmployeeImmigrationDetails: true };
        case EmployeeImmigrationDetailsActionTypes.CreateEmployeeImmigrationDetailsCompleted:
            return { ...state, creatingEmployeeImmigrationDetails: false, employeeImmigrationDetailsId: action.employeeImmigrationDetailId };
        case EmployeeImmigrationDetailsActionTypes.DeleteEmployeeImmigrationDetailsCompleted:
            return employeeImmigrationDetailsAdapter.removeOne(action.employeeImmigrationDetailId,  {...state, creatingEmployeeImmigrationDetails: false});
        case EmployeeImmigrationDetailsActionTypes.CreateEmployeeImmigrationDetailsFailed:
            return { ...state, creatingEmployeeImmigrationDetails: false, employeeImmigrationDetailsErrors: action.validationMessages };
        case EmployeeImmigrationDetailsActionTypes.GetEmployeeImmigrationDetailsByIdTriggered:
            return { ...state, gettingEmployeeImmigrationDetailsById: true };
        case EmployeeImmigrationDetailsActionTypes.GetEmployeeImmigrationDetailsByIdCompleted:
            return { ...state, gettingEmployeeImmigrationDetailsById: false, employeeImmigrationDetailsData: action.employeeImmigrationDetails };
        case EmployeeImmigrationDetailsActionTypes.UpdateEmployeeImmigrationDetailsById:
            return employeeImmigrationDetailsAdapter.updateOne(action.employeeImmigrationDetailsUpdates.employeeImmigrationDetailsUpdate, state);
        case EmployeeImmigrationDetailsActionTypes.RefreshEmployeeImmigrationDetailsList:
            return employeeImmigrationDetailsAdapter.upsertOne(action.employeeImmigrationDetails, state);
        case EmployeeImmigrationDetailsActionTypes.ExceptionHandled:
            return { ...state, loadingEmployeeImmigrationDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}