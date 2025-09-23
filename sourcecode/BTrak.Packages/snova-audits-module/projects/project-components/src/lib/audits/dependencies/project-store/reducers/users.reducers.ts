import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

import { User } from "../../models/user-project";

import { UserActions, UserActionTypes } from "../actions/users.actions";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<User> {
  loadingUsers: boolean;
  User: User;
  exceptionMessage: string;
}

export const userAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user.id

});

export const initialState: State = userAdapter.getInitialState({
  loadingUsers: false,
  User: null,
  exceptionMessage: ""
});

export function reducer(
  state: State = initialState,
  action: UserActions
): State {
  switch (action.type) {
    case UserActionTypes.LoadUsersTriggered:
      return { ...state, loadingUsers: true };
    case UserActionTypes.LoadUsersCompleted:
      return userAdapter.addAll(action.userModel, {
        ...state,
        loadingUsers: false
      });
    case UserActionTypes.LoggedUserTriggered:
      return { ...state, loadingUsers: true };
    case UserActionTypes.LoggedUserCompleted:
      return { ...state, User: action.users };
    case UserActionTypes.LoadUsersCompletedFromCache:
      return { ...state, loadingUsers: false };
    case UserActionTypes.ExceptionHandled:
      return { ...state, exceptionMessage: action.errorMessage, loadingUsers: false };
    default:
      return state;
  }
}
