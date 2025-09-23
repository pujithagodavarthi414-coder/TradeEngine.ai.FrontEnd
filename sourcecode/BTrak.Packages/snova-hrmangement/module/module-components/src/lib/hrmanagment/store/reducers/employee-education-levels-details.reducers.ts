import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { EmployeeEducationLevelsModel } from "../../models/employee-education-levels-model";
import { EmployeeEducationLevelsListActions, EmployeeEducationLevelsListActionTypes } from "../actions/employee-education-levels-details.action";

export interface State extends EntityState<EmployeeEducationLevelsModel> {
    loadingEmployeeEducationLevelsList: boolean;
    getLoadEducationLevelsErrors: string[],
    exceptionMessage: string;
    
}

export const EmployeeEducationAdapter: EntityAdapter<
    EmployeeEducationLevelsModel
> = createEntityAdapter<EmployeeEducationLevelsModel>({
    selectId: (employeeEducation: EmployeeEducationLevelsModel) => employeeEducation.educationLevelId
});

export const initialState: State = EmployeeEducationAdapter.getInitialState({
    loadingEmployeeEducationLevelsList: false,
    exceptionMessage: '',
    getLoadEducationLevelsErrors: [''],
});

export function reducer(
    state: State = initialState,
    action: EmployeeEducationLevelsListActions
): State {
    switch (action.type) {
        case EmployeeEducationLevelsListActionTypes.LoadEmployeeEducationLevelsTriggered:
            return { ...state, loadingEmployeeEducationLevelsList: true };
        case EmployeeEducationLevelsListActionTypes.LoadEmployeeEducationLevelsCompleted:
            return EmployeeEducationAdapter.addAll(action.EmployeeEducationLevelsList, {
                ...state,
                loadingEmployeeEducationLevelsList: false
            });
        case EmployeeEducationLevelsListActionTypes.LoadEmployeeEducationLevelsFailed:
            return { ...state, loadingEmployeeEducationLevelsList: false, getLoadEducationLevelsErrors: action.validationMessages };
        case EmployeeEducationLevelsListActionTypes.ExceptionHandled:
            return { ...state, loadingEmployeeEducationLevelsList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}