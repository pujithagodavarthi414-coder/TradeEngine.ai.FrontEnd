import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EmployeeMembershipDetailsModel } from '../../models/employee-Membership-details-model';
import { EmployeeMembershipDetailsActions, EmployeeMembershipDetailsActionTypes } from '../actions/employee-Membership-details.action';




export interface State extends EntityState<EmployeeMembershipDetailsModel> {
    loadingEmployeeMembershipDetails: boolean;
    creatingEmployeeMembershipDetails: boolean;
    employeeMembershipDetailsId: string;
    createEmployeeMembershipDetailsErrors: string[];
    gettingEmployeeMembershipDetailsById: boolean;
    employeeMembershipDetailsData: EmployeeMembershipDetailsModel;
    exceptionMessage: string;
}

export const employeeMembershipDetailsAdapter: EntityAdapter<
    EmployeeMembershipDetailsModel
> = createEntityAdapter<EmployeeMembershipDetailsModel>({
    selectId: (employeeMembershipDetailsList: EmployeeMembershipDetailsModel) => employeeMembershipDetailsList.employeeMembershipId
});

export const initialState: State = employeeMembershipDetailsAdapter.getInitialState({
    loadingEmployeeMembershipDetails: false,
    creatingEmployeeMembershipDetails: false,
    employeeMembershipDetailsId: '',
    createEmployeeMembershipDetailsErrors: [''],
    gettingEmployeeMembershipDetailsById: false,
    employeeMembershipDetailsData: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeMembershipDetailsActions
): State {
    switch (action.type) {
        case EmployeeMembershipDetailsActionTypes.LoadEmployeeMembershipDetailsTriggered:
            return { ...state, loadingEmployeeMembershipDetails: true };
        case EmployeeMembershipDetailsActionTypes.LoadEmployeeMembershipDetailsCompleted:
            return employeeMembershipDetailsAdapter.addAll(action.employeeMembershipDetailsList, {
                ...state,
                loadingEmployeeMembershipDetails: false
            });
            case EmployeeMembershipDetailsActionTypes.LoadEmployeeMembershipDetailsFailed:
                return { ...state, loadingEmployeeMembershipDetails: false, createEmployeeMembershipDetailsErrors: action.validationMessages };
        case EmployeeMembershipDetailsActionTypes.CreateEmployeeMembershipDetailsTriggered:
            return { ...state, creatingEmployeeMembershipDetails: true };
        case EmployeeMembershipDetailsActionTypes.CreateEmployeeMembershipDetailsCompleted:
            return { ...state, creatingEmployeeMembershipDetails: false, employeeMembershipDetailsId: action.employeeMembershipDetailId };
        case EmployeeMembershipDetailsActionTypes.DeleteEmployeeMembershipDetailsCompleted:
            return employeeMembershipDetailsAdapter.removeOne(action.employeeMembershipDetailId, {...state, creatingEmployeeMembershipDetails: false});
        case EmployeeMembershipDetailsActionTypes.CreateEmployeeMembershipDetailsFailed:
            return { ...state, creatingEmployeeMembershipDetails: false, createEmployeeMembershipDetailsErrors: action.validationMessages };
        case EmployeeMembershipDetailsActionTypes.GetEmployeeMembershipDetailsByIdTriggered:
            return { ...state, gettingEmployeeMembershipDetailsById: true };
        case EmployeeMembershipDetailsActionTypes.GetEmployeeMembershipDetailsByIdCompleted:
            return { ...state, gettingEmployeeMembershipDetailsById: false, employeeMembershipDetailsData: action.employeeMembershipDetails };
        case EmployeeMembershipDetailsActionTypes.UpdateEmployeeMembershipDetailsById:
            return employeeMembershipDetailsAdapter.updateOne(action.employeeMembershipDetailsUpdates.employeeMembershipDetailsUpdate, state);
        case EmployeeMembershipDetailsActionTypes.RefreshEmployeeMembershipDetailsList:
            return employeeMembershipDetailsAdapter.upsertOne(action.employeeMembershipDetails, state);
        case EmployeeMembershipDetailsActionTypes.ExceptionHandled:
            return { ...state, loadingEmployeeMembershipDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}