import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { EmployeeSkillDetailsModel } from '../../models/employee-skill-details-model';
import { EmployeeSkillDetailsActionTypes, EmployeeSkillDetailsActions } from '../actions/employee-skill-details.actions';

export interface State extends EntityState<EmployeeSkillDetailsModel> {
    loadingEmployeeSkillDetails: boolean;
    creatingEmployeeSkillDetails: boolean;
    employeeSkillDetailsFailed: boolean;
    employeeSkillDetailsId: string;
    employeeSkillDetailsErrors: string[];
    gettingEmployeeSkillDetailsById: boolean;
    employeeSkillDetailsData: EmployeeSkillDetailsModel;
    exceptionMessage: string;
}

export const employeeSkillDetailsAdapter: EntityAdapter<
    EmployeeSkillDetailsModel
> = createEntityAdapter<EmployeeSkillDetailsModel>({
    selectId: (employeeSkillDetailsList: EmployeeSkillDetailsModel) => employeeSkillDetailsList.employeeSkillId
});

export const initialState: State = employeeSkillDetailsAdapter.getInitialState({
    loadingEmployeeSkillDetails: false,
    creatingEmployeeSkillDetails: false,
    employeeSkillDetailsFailed: false,
    employeeSkillDetailsId: '',
    employeeSkillDetailsErrors: [''],
    gettingEmployeeSkillDetailsById: false,
    employeeSkillDetailsData: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeSkillDetailsActions
): State {
    switch (action.type) {
        case EmployeeSkillDetailsActionTypes.LoadEmployeeSkillDetailsTriggered:
            return { ...state, loadingEmployeeSkillDetails: true };
        case EmployeeSkillDetailsActionTypes.LoadEmployeeSkillDetailsCompleted:
            return employeeSkillDetailsAdapter.addAll(action.employeeSkillDetailsList, {
                ...state,
                loadingEmployeeSkillDetails: false
            });
        case EmployeeSkillDetailsActionTypes.LoadEmployeeSkillDetailsFailed:
            return { ...state, loadingEmployeeSkillDetails: false, employeeSkillDetailsErrors: action.validationMessages };
        case EmployeeSkillDetailsActionTypes.CreateEmployeeSkillDetailsTriggered:
            return { ...state, creatingEmployeeSkillDetails: true };
        case EmployeeSkillDetailsActionTypes.CreateEmployeeSkillDetailsCompleted:
            return { ...state, creatingEmployeeSkillDetails: false, employeeSkillDetailsId: action.employeeSkillDetailId };
        case EmployeeSkillDetailsActionTypes.CreateEmployeeSkillDetailsFailed:
            return { ...state, creatingEmployeeSkillDetails: false, employeeSkillDetailsErrors: action.validationMessages };
        case EmployeeSkillDetailsActionTypes.DeleteEmployeeSkillDetailsCompleted:
            return employeeSkillDetailsAdapter.removeOne(action.employeeSkillDetailId, state);
        case EmployeeSkillDetailsActionTypes.GetEmployeeSkillDetailsByIdTriggered:
            return { ...state, gettingEmployeeSkillDetailsById: true };
        case EmployeeSkillDetailsActionTypes.GetEmployeeSkillDetailsByIdCompleted:
            return { ...state, gettingEmployeeSkillDetailsById: false, employeeSkillDetailsData: action.employeeSkillDetails };
        case EmployeeSkillDetailsActionTypes.GetEmployeeSkillDetailsByIdFailed:
            return { ...state, gettingEmployeeSkillDetailsById: false, employeeSkillDetailsErrors: action.validationMessages };
        case EmployeeSkillDetailsActionTypes.UpdateEmployeeSkillDetailsById:
            return employeeSkillDetailsAdapter.updateOne(action.employeeSkillDetailsUpdates.employeeSkillDetailsUpdate, state);
        case EmployeeSkillDetailsActionTypes.RefreshEmployeeSkillDetailsList:
            return employeeSkillDetailsAdapter.upsertOne(action.employeeSkillDetails, state);
        case EmployeeSkillDetailsActionTypes.ExceptionHandled:
            return { ...state, loadingEmployeeSkillDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}