import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { RoleModelBase } from "../../models/roleModelBase";
import { RoleActions, RoleActionTypes } from "../actions/roles.actions";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<RoleModelBase> {
  loadingRoles: boolean;
}

export const roleAdapter: EntityAdapter<RoleModelBase> = createEntityAdapter<
  RoleModelBase
>({
  selectId: (role: RoleModelBase) => role.roleId
});

export const initialState: State = roleAdapter.getInitialState({
  loadingRoles: false
});

export function reducer(
  state: State = initialState,
  action: RoleActions
): State {
  switch (action.type) {
    case RoleActionTypes.LoadRolesTriggered:
      return { ...state, loadingRoles: true };
    case RoleActionTypes.LoadRolesCompleted:
      return roleAdapter.addAll(action.Roles, {
        ...state,
        loadingRoles: false
      });
    case RoleActionTypes.LoadRolesCompletedFromCache:
      return { ...state, loadingRoles: false };
    default:
      return state;
  }
}
