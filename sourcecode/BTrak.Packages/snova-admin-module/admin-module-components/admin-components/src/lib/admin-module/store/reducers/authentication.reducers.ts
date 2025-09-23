import { Action } from "@ngrx/store";
import {
  AuthenticationActionTypes,
  CompanyWorkItemStartFunctionalityRequiredSuccess,
  AuthenticationActions,
  AuthenticationFailed,
  RoleDetailsFetched,
  EntityRoleDetailsFetched,
  EntityReolesByUserIdFetchCompleted,
  GetCompanyThemeCompleted,
  GetUserStoreIdCompleted,
  GetCompanySettingsCompleted
} from "../actions/authentication.actions";
import { RoleFeatureModel } from "../../models/rolefeature";
import { EntityRoleFeatureModel } from "../../models/entityRoleFeature";
import { UserModel } from "../../models/user";
import { ThemeModel } from "../../models/themes.model";

export interface State {
  errorWhileLoggingIn: string;
  userId: string;
  userName: string;
  userModel: UserModel;
  loadingEntityFeatures: boolean;
  loadingUserEntityFeatures: boolean;
  deletingDemoData: boolean;
  loadingRoleFeatures: boolean;
  userToken: string;
  userLoggedIn: boolean;
  userLoggingIn: boolean;
  roleFeatures: any[];
  entityTypeRoleFeatures: EntityRoleFeatureModel[];
  rolePermissionsList: EntityRoleFeatureModel[];
  themeModel: ThemeModel;
  gettingUserStoreId: boolean;
  userStoreId: string;
  isStartEnabled: boolean;
  companySettingsModel: any[];

}

export const initialState: State = {
  userId: null,
  userName: null,
  userModel: null,
  loadingEntityFeatures: true,
  loadingUserEntityFeatures: true,
  loadingRoleFeatures: true,
  deletingDemoData: false,
  userLoggedIn: false,
  userLoggingIn: false,
  userToken: null,
  errorWhileLoggingIn: null,
  roleFeatures: [],
  entityTypeRoleFeatures: [],
  rolePermissionsList: [],
  themeModel: null,
  gettingUserStoreId: false,
  userStoreId: '',
  isStartEnabled: false,
  companySettingsModel: []
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case AuthenticationActionTypes.AuthenticateUser:
      return { ...initialState, userLoggingIn: true ,
        //userLoggingIn: false,
        userLoggedIn: true,
        userToken: (action as AuthenticationActions).userToken,
        errorWhileLoggingIn: null};

      case AuthenticationActionTypes.AuthenticateNewUser:
        return { ...initialState, userLoggingIn: true };

    case AuthenticationActionTypes.CompanyWorkItemStartFunctionalityRequiredSuccess:
      return {
        ...state,
        isStartEnabled: (action as CompanyWorkItemStartFunctionalityRequiredSuccess).isStartEnabled
      };

    case AuthenticationActionTypes.Authenticated:
      return {
        ...state,
        userLoggingIn: false,
        userLoggedIn: true,
        userToken: (action as AuthenticationActions).userToken,
        errorWhileLoggingIn: null
      };

    case AuthenticationActionTypes.SignedOff:
      return initialState;

    case AuthenticationActionTypes.AuthenticationFailed:
      return {
        ...state,
        userLoggingIn: false,
        userLoggedIn: false,
        userToken: null,
        errorWhileLoggingIn: (action as AuthenticationFailed).errorMessage
      };

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
    case AuthenticationActionTypes.EntityRoleDetailsFetched:
      return {
        ...state,
        loadingEntityFeatures: false,
        entityTypeRoleFeatures: (action as EntityRoleDetailsFetched).entityTypeRoleFeatures
      };
    case AuthenticationActionTypes.EntityReolesByUserIdFetchCompleted:
      return {
        ...state,
        loadingUserEntityFeatures: false,
        rolePermissionsList: (action as EntityReolesByUserIdFetchCompleted).entityTypeRoleFeatures
      };
    case AuthenticationActionTypes.ClearDemoDataTriggred:
      return {
        ...state,
        deletingDemoData: true,
      };
    case AuthenticationActionTypes.ClearDemoDataCompleted:
      return {
        ...state,
        deletingDemoData: false,
      };
    case AuthenticationActionTypes.ClearDemoDataFailed:
      return {
        ...state,
        deletingDemoData: false,
      };
    case AuthenticationActionTypes.GetCompanyThemeTriggered:
      return {
        ...state
      };
    case AuthenticationActionTypes.GetCompanyThemeCompleted:
      return {
        ...state,
        themeModel: (action as GetCompanyThemeCompleted).themeModel
      };
    case AuthenticationActionTypes.GetCompanyThemeFailed:
      return {
        ...state
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
    case AuthenticationActionTypes.EntityRolesByUserIdFetchTriggered:
      return { ...state, loadingEntityFeatures: true };
    case AuthenticationActionTypes.GetUserStoreIdTriggered:
      return { ...state, gettingUserStoreId: true };
    case AuthenticationActionTypes.GetUserStoreIdCompleted:
      return { ...state, gettingUserStoreId: false, userStoreId: (action as GetUserStoreIdCompleted).userStoreDetails.storeId };
    case AuthenticationActionTypes.ExceptionHandled:
      return { ...state, gettingUserStoreId: false, loadingEntityFeatures: false };
    default:
      return state;
  }
}
