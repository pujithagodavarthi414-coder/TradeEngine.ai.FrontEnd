import { Action } from "@ngrx/store";
import {
  AuthenticationActionTypes,
  AuthenticationActions,
  RoleDetailsFetched,
  GetCompanySettingsCompleted
} from "../actions/authentication.actions";
import { UserModel } from '../../models/user-model';

export interface State {
  errorWhileLoggingIn: string;
  userId: string;
  userName: string;
  userModel: UserModel;
  loadingRoleFeatures: boolean;
  userToken: string;
  userLoggedIn: boolean;
  userLoggingIn: boolean;
  roleFeatures: any[];
  isStartEnabled: boolean;
  companySettingsModel: any[];
}

export const initialState: State = {
  userId: null,
  userName: null,
  userModel: null,
  loadingRoleFeatures: true,
  userLoggedIn: false,
  userLoggingIn: false,
  userToken: null,
  errorWhileLoggingIn: null,
  roleFeatures: [],
  isStartEnabled: false,
  companySettingsModel: []
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case AuthenticationActionTypes.UserDetailsFetched:
      return {
        ...state,
        userModel: (action as AuthenticationActions).userModel
      };

    case AuthenticationActionTypes.RoleDetailsFetched:
      return {
        ...state,
        loadingRoleFeatures: false,
        roleFeatures: (action as RoleDetailsFetched).roleFeatures
      };

    case AuthenticationActionTypes.GetCompanySettingsTriggered:
      return {
        ...state
      };
    case AuthenticationActionTypes.GetCompanySettingsCompleted:
      return {
        ...state,
        companySettingsModel: (action as GetCompanySettingsCompleted).companySettingsModel
      };
    case AuthenticationActionTypes.GetCompanySettingsFailed:
      return {
        ...state
      };
    case AuthenticationActionTypes.AuthenticationExceptionHandled:
      return { ...state, };
    default:
      return state;
  }
}
