import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { PermissionHistoryUsersActions, PermissionHistoryActionTypes } from "../actions/permission-history.action";
import { UserModel } from '../../models/user';

export interface State extends EntityState<UserModel> {
  loadingPermissionHistoryUsers: boolean;
}

export const permissionHistoryAdapter: EntityAdapter<UserModel> = createEntityAdapter<UserModel>({
  selectId: (userModel: UserModel) => userModel.id
});

export const initialState: State = permissionHistoryAdapter.getInitialState({
  loadingPermissionHistoryUsers: false
});

export function reducer(
  state: State = initialState,
  action: PermissionHistoryUsersActions
): State {
  switch (action.type) {
    case PermissionHistoryActionTypes.LoadPermissionHistoryUsersTriggered:
      return { ...state, loadingPermissionHistoryUsers: true };
    case PermissionHistoryActionTypes.LoadPermissionHistoryUsersCompleted:
      return permissionHistoryAdapter.addAll(action.userDetails, {
        ...state,
        loadingPermissionHistoryUsers: false
      });
    case PermissionHistoryActionTypes.LoadPermissionHistoryUsersFailed:
      return { ...state, loadingPermissionHistoryUsers: false };
    default:
      return state;
  }
}
