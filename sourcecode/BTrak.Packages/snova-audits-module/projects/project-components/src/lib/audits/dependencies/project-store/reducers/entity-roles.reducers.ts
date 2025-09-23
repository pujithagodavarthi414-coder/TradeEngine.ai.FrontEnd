// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { EntityRoleModel } from "../../models/entity-role-model";
import { EntityRoleActions, EntityRoleActionTypes } from "../actions/entity-roles.actions";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<EntityRoleModel> {
  loadingEntityRoles: boolean;
}

export const entityRoleAdapter: EntityAdapter<EntityRoleModel> = createEntityAdapter<
EntityRoleModel
>({
  selectId: (entityRole: EntityRoleModel) => entityRole.entityRoleId
});

export const initialState: State = entityRoleAdapter.getInitialState({
  loadingEntityRoles: false
});

export function reducer(
  state: State = initialState,
  action: EntityRoleActions
): State {
  switch (action.type) {
    case EntityRoleActionTypes.LoadEntityRolesTriggered:
      return { ...state, loadingEntityRoles: true };
    case EntityRoleActionTypes.LoadEntityRolesCompleted:
      return entityRoleAdapter.addAll(action.entityRoles, {
        ...state,
        loadingEntityRoles: false
      });
    case EntityRoleActionTypes.LoadEntityRolesCompletedFromCache:
      return { ...state, loadingEntityRoles: false };
    default:
      return state;
  }
}
