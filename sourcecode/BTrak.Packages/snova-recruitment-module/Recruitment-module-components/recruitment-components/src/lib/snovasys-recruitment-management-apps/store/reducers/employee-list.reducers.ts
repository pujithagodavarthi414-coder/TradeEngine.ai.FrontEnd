import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { EmployeeListModel } from '../../models/employee-model';
import { EmployeeListActions, EmployeeListActionTypes } from '../actions/employee-list.action';

export interface State extends EntityState<EmployeeListModel> {
    loadingEmployeeList: boolean;
    creatingEmployeeList: boolean;
    createEmployeeListErrors: string[];
    gettingEmployeeListDetailsById: boolean;
    employeeListDetailsById: string;
    employeeListDetailsData: EmployeeListModel;
    exceptionMessage: string;
}

export const EmployeeListAdapter: EntityAdapter<
    EmployeeListModel
> = createEntityAdapter<EmployeeListModel>({
    selectId: (employee: EmployeeListModel) => employee.employeeId
});

export const initialState: State = EmployeeListAdapter.getInitialState({
    loadingEmployeeList: false,
    creatingEmployeeList: false,
    createEmployeeListErrors: [''],
    gettingEmployeeListDetailsById: false,
    employeeListDetailsData: null,
    employeeListDetailsById: '',
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmployeeListActions
): State {
    switch (action.type) {
        case EmployeeListActionTypes.LoadEmployeeListItemsTriggered:
            return { ...state, loadingEmployeeList: true };
        case EmployeeListActionTypes.RecruitmentLoadEmployeeListItemsCompleted:
            return EmployeeListAdapter.addAll(action.employeeList, {
                ...state,
                loadingEmployeeList: false
            });
            case EmployeeListActionTypes.LoadEmployeeListItemsDetailsFailed:
                return { ...state, loadingEmployeeList: false, createEmployeeListErrors: action.validationMessages };
        case EmployeeListActionTypes.CreateEmployeeListItemTriggered:
            return { ...state, creatingEmployeeList: true };
        case EmployeeListActionTypes.CreateEmployeeListItemCompleted:
            return { ...state, creatingEmployeeList: false, employeeListDetailsById: action.employeeId };
        case EmployeeListActionTypes.CreateEmployeeListItemFailed:
            return { ...state, creatingEmployeeList: false, createEmployeeListErrors: action.validationMessages };
        case EmployeeListActionTypes.GetEmployeeListDetailsByIdTriggered:
            return { ...state, gettingEmployeeListDetailsById: true };
        case EmployeeListActionTypes.GetEmployeeListDetailsByIdCompleted:
            return { ...state, gettingEmployeeListDetailsById: false, employeeListDetailsData: action.employee };
        case EmployeeListActionTypes.RefreshEmployeeListDetailsList:
            return EmployeeListAdapter.upsertOne(action.employee, state);
        case EmployeeListActionTypes.EmployeeListExceptionHandled:
            return { ...state, creatingEmployeeList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}
