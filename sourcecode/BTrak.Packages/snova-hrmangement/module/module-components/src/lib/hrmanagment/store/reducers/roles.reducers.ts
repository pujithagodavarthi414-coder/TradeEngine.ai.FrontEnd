import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

import { RolesListActions, RolesListActionTypes } from "../actions/roles.action";
import { RoleModel } from '../../models/role-model';

export interface State extends EntityState<RoleModel> {
    loadingRolesList: boolean;
    getLoadRolesErrors: string[],
    exceptionMessage: string;
    
}

export const RolesAdapter: EntityAdapter<
    RoleModel
> = createEntityAdapter<RoleModel>({
    selectId: (Roles: RoleModel) => Roles.roleId
});

export const initialState: State = RolesAdapter.getInitialState({
    loadingRolesList: false,
    exceptionMessage: '',
    getLoadRolesErrors: [''],
});

export function reducer(
    state: State = initialState,
    action: RolesListActions
): State {
    switch (action.type) {
        case RolesListActionTypes.LoadRolesTriggered:
            return { ...state, loadingRolesList: true };
        case RolesListActionTypes.LoadRolesCompleted:
            return RolesAdapter.addAll(action.RolesList, {
                ...state,
                loadingRolesList: false
            });
        case RolesListActionTypes.LoadRolesFailed:
            return { ...state, loadingRolesList: false, getLoadRolesErrors: action.validationMessages };
        case RolesListActionTypes.RolesExceptionHandled:
            return { ...state, loadingRolesList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}