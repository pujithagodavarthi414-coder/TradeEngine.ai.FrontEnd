import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

import { ValidationModel } from "../../../../views/assetmanagement/models/validation-messages";
import { UserModel } from "../../../../views/hrmanagment/models/user";

import { UserActions, UserActionTypes } from "../actions/users.actions";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<UserModel> {
  loadingUsersList: boolean;
  gettingUserById: boolean,
  creatingUser: boolean;
  createUserErrors: ValidationModel[];
  UserId: string;
  User: UserModel;
  exceptionMessage: string;
}

export const usersListAdapter: EntityAdapter<UserModel> = createEntityAdapter<UserModel>({
  selectId: (user: UserModel) => user.id

});

export const initialState: State = usersListAdapter.getInitialState({
  loadingUsersList: false,
  creatingUser: false,
  gettingUserById: null,
  User: null,
  exceptionMessage: "",
  UserId: "",
  createUserErrors: []
});

export function reducer(
  state: State = initialState,
  action: UserActions
): State {
  switch (action.type) {
    case UserActionTypes.LoadUsersListTriggered:
      return { ...state, loadingUsersList: true };
    case UserActionTypes.LoadUsersListCompleted:
      return usersListAdapter.addAll(action.usersModel, {
        ...state,
        loadingUsersList: false
      });
    case UserActionTypes.CreateUsersTriggered:
      return { ...state, creatingUser: true };
    case UserActionTypes.CreateUsersCompleted:
      return { ...state, creatingUser: false, UserId: action.userId };
    case UserActionTypes.CreateUsersFailed:
      return { ...state, creatingUser: false, createUserErrors: action.validationMessages };
    case UserActionTypes.GetUserByIdTriggered:
      return { ...state, gettingUserById: true };
    case UserActionTypes.RemoveUserFromList:
      state = usersListAdapter.removeOne(action.userId, state);
      return { ...state, creatingUser: false };
    case UserActionTypes.GetUserByIdCompleted:
      return { ...state, gettingUserById: false, User: action.users };
    case UserActionTypes.CreateUserCompletedWithInPlaceUpdate:
      return usersListAdapter.updateOne(action.userUpdates.userUpdate, state);
    case UserActionTypes.RefreshUsersList:
      return usersListAdapter.upsertOne(action.users, state);
    case UserActionTypes.ExceptionHandled:
      return { ...state, exceptionMessage: action.errorMessage, loadingUsersList: false };
    default:
      return state;
  }
}
