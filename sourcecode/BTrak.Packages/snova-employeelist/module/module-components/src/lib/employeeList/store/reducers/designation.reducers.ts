import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { DesignationListActions, DesignationListActionTypes } from "../actions/designation.action";
import { DesignationModel } from '../../models/designations-model';

export interface State extends EntityState<DesignationModel> {
    loadingDesignationList: boolean;
    getLoadDesignationErrors: string[],
    exceptionMessage: string;
}

export const DesignationAdapter: EntityAdapter<
    DesignationModel
> = createEntityAdapter<DesignationModel>({
    selectId: (designation: DesignationModel) => designation.designationId
});

export const initialState: State = DesignationAdapter.getInitialState({
    loadingDesignationList: false,
    getLoadDesignationErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: DesignationListActions
): State {
    switch (action.type) {
        case DesignationListActionTypes.LoadDesignationListItemsTriggered:
            return { ...state, loadingDesignationList: true };
        case DesignationListActionTypes.LoadDesignationListItemsCompleted:
            return DesignationAdapter.addAll(action.designationList, {
                ...state,
                loadingDesignationList: false
            });
        case DesignationListActionTypes.LoadDesignationListItemsFailed:
            return { ...state, loadingDesignationList: false, getLoadDesignationErrors: action.validationMessages };
        case DesignationListActionTypes.ExceptionHandled:
            return { ...state, loadingDesignationList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}