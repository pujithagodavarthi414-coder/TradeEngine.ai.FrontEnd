import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { EmploymentStatusModel } from "../../models/employment-status-model";
import { EmploymentStatusListActions, EmploymentStatusListActionTypes } from "../actions/employment-status.action";

export interface State extends EntityState<EmploymentStatusModel> {
    loadingEmploymentList: boolean;
    exceptionMessage: string;
}

export const EmploymentStatusAdapter: EntityAdapter<
    EmploymentStatusModel
> = createEntityAdapter<EmploymentStatusModel>({
    selectId: (employmentStatus: EmploymentStatusModel) => employmentStatus.employmentStatusId
});

export const initialState: State = EmploymentStatusAdapter.getInitialState({
    loadingEmploymentList: false,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmploymentStatusListActions
): State {
    switch (action.type) {
        case EmploymentStatusListActionTypes.LoadEmploymentStatusListItemsTriggered:
            return { ...state, loadingEmploymentList: true };
        case EmploymentStatusListActionTypes.LoadEmploymentStatusListItemsCompleted:
            return EmploymentStatusAdapter.addAll(action.employmentStatusList, {
                ...state,
                loadingEmploymentList: false
            });
        default:
            return state;
    }
}