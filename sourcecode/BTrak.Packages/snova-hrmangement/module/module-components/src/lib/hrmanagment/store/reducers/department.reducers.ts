import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { DepartmentModel } from "../../models/department-model";
import { DepartmentListActions, DepartmentListActionTypes } from "../actions/department.action";

export interface State extends EntityState<DepartmentModel> {
    loadingDepartmentList: boolean;
    exceptionMessage: string;
}

export const DepartmentAdapter: EntityAdapter<
    DepartmentModel
> = createEntityAdapter<DepartmentModel>({
    selectId: (department: DepartmentModel) => department.departmentId
});

export const initialState: State = DepartmentAdapter.getInitialState({
    loadingDepartmentList: false,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: DepartmentListActions
): State {
    switch (action.type) {
        case DepartmentListActionTypes.LoadDepartmentListItemsTriggered:
            return { ...state, loadingDepartmentList: true };
        case DepartmentListActionTypes.LoadDepartmentListItemsCompleted:
            return DepartmentAdapter.addAll(action.departmentList, {
                ...state,
                loadingDepartmentList: false
            });
        default:
            return state;
    }
}