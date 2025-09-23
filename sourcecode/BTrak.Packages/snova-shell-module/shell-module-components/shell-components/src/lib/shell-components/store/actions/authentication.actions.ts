import { Action } from "@ngrx/store";
import { UserModel } from '../../models/user';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { ThemeModel } from '../../models/themes.model';
import { ValidationModel } from '../../models/validation.model';
import { StoreModel } from '../../models/store-model';
import { StoreSearchModel } from '../../models/store-search-model';
import { CompanysettingsModel } from '../../models/company-model';

export enum AuthenticationActionTypes {
  AuthenticateUser = "[Snovasys-Shell] [Authentication] Authenticate User",
  Authenticated = "[Snovasys-Shell] [Authentication] Authenticated",
  CompanyWorkItemStartFunctionalityRequired = "[Snovasys-Shell] [Authentication] CompanyWorkItemStartFunctionalityRequired",
  CompanyWorkItemStartFunctionalityRequiredFailed = "[Snovasys-Shell] [Authentication] CompanyWorkItemStartFunctionalityRequired Failed",
  CompanyWorkItemStartFunctionalityRequiredSuccess = "[Snovasys-Shell] [Authentication] CompanyWorkItemStartFunctionalityRequired Success",
  SignedOff = "[Snovasys-Shell] [Authentication] Signed Off",
  UserDetailsFetching = "[Snovasys-Shell] [Authentication] Fetching User Details",
  UserDetailsFetched = "[Snovasys-Shell] [Authentication] Fetched User Details",
  UserInitialDetailsFetched = "[Snovasys-Shell] [Authentication] Fetched User Initial Details",
  UserInitialDetailsFetchedCompleted = "[Snovasys-Shell] [Authentication] Fetched User Initial Details Completed",
  UserDetailsFetchedAfterLogin = "[Snovasys-Shell] [Authentication] Fetched User Details After Login",
  UserDetailsFetchedAfterCompanyLogin = "[Snovasys-Shell] [Authentication] Fetched User Details After Company Login",
  AuthenticationFailed = "[Snovasys-Shell] [Authentication] Authentication Failed",
  RoleDetailsFetchOnReload = "[Snovasys-Shell] [Authentication] Role Details Fetched On Reload",
  RoleDetailsFetched = "[Snovasys-Shell] [Authentication] Role Details Fetched",
  InitializeAfterLoginData = "[Snovasys-Shell] [Authentication] Initialize after login data",
  RolesFetchTriggered = "[Snovasys-Shell] [Authentication] Fetching Roles Triggered",
  RolesFetchFailed = '[Snovasys-Shell] [Authentication] Fetching Roles Failed',
  EntityRolesFetchTriggered = "[Snovasys-Shell] [Authentication] Fetching Entity Roles Triggered",
  EntityRoleDetailsFetched = "[Snovasys-Shell] [Authentication] Entity Role Details Fetched",
  EntityRolesByUserIdFetchTriggered = "[Snovasys-Shell] [Authentication] Fetching Entity Roles By UserId Triggered",
  EntityReolesByUserIdFetchCompleted = "[Snovasys-Shell] [Authentication] Fetching EntityRoles By UserId Completed",
  EntityRolesByUserIdFetchFailed = "[Snovasys-Shell] [Authentication] Fetching EntityRoles By UserId Failed",
  GetCompanyThemeTriggered = "[Snovasys-Shell] [Authentication] GEt Company Theme Triggered",
  GetCompanyThemeCompleted = "[Snovasys-Shell] [Authentication] GEt Company Theme Completed",
  GetCompanyThemeFailed = "[Snovasys-Shell] [Authentication] GEt Company Theme Failed",
  ClearDemoDataTriggred = "[Snovasys-Shell] [Authentication] Clear Demo Data Triggred",
  ClearDemoDataCompleted = "[Snovasys-Shell] [Authentication] Clear Demo Data Completed",
  ClearDemoDataFailed = "[Snovasys-Shell] [Authentication] Clear Demo Data Failed",
  GetUserStoreIdTriggered = '[Snovasys-Shell] [Authentication] Get User Store Id Triggered',
  GetUserStoreIdCompleted = '[Snovasys-Shell] [Authentication] Get User Store Id Completed',
  GetUserStoreIdFailed = '[Snovasys-Shell] [Authentication] Get User Store Id Failed',
  ExceptionHandled = '[Snovasys-Shell] [Authentication] Exception Handling',
  AuthenticateNewUser = "[Snovasys-Shell] [Authentication] Authenticate New User",
  GetCompanySettingsTriggered = "[Snovasys-Shell] [Authentication] Get Company Settings Triggered",
  GetCompanySettingsCompleted = "[Snovasys-Shell] [Authentication] Get Company Settings Completed",
  GetCompanySettingsFailed = "[Snovasys-Shell] [Authentication] Get Company Settings Failed",
  FetchTimeSheetButtonDetails = "[Snovasys-Shell] [Authentication] Get Time Sheet Button Details"
}

export class AuthenticateUser implements Action {
  type = AuthenticationActionTypes.AuthenticateUser;
  public userId: string;
  public userToken: string;
  public userModel: UserModel;
  public errorMessage: string;
  public isStartEnabled: boolean;
  public loginData: any;

  constructor(public userName: string, public password: string) { }
}

export class AuthenticateNewUser implements Action {
  type = AuthenticationActionTypes.AuthenticateNewUser;
  public userId: string;
  public userToken: string;
  public userModel: UserModel;
  public errorMessage: string;

  constructor(public userName: string) { }
}

export class Authenticated implements Action {
  type = AuthenticationActionTypes.Authenticated;
  public userId: string;
  public password: string;
  public errorMessage: string;
  public userModel: UserModel;
  public isStartEnabled: boolean;
  public loginData: any;
  constructor(public userName: string, public userToken: string) { }
}

export class CompanyWorkItemStartFunctionalityRequired implements Action {
  type = AuthenticationActionTypes.CompanyWorkItemStartFunctionalityRequired;
  public userId: string;
  public password: string;
  public errorMessage: string;
  public userModel: UserModel;
  public userName: string;
  public userToken: string;
  public loginData: any;
  public isStartEnabled: boolean;
  constructor() { }
}


export class CompanyWorkItemStartFunctionalityRequiredSuccess implements Action {
  type = AuthenticationActionTypes.CompanyWorkItemStartFunctionalityRequiredSuccess;
  public userId: string;
  public password: string;
  public errorMessage: string;
  public userModel: UserModel;
  public userName: string;
  public loginData: any;
  public userToken: string;

  constructor(public isStartEnabled: boolean) { }
}

export class AuthenticationFailed implements Action {
  type = AuthenticationActionTypes.AuthenticationFailed;
  public userName: string;
  public userToken: string;
  public userId: string;
  public password: string;
  public userModel: UserModel;
  public isStartEnabled: boolean;
  public loginData: any;
  constructor(public errorMessage: string) { }
}

export class SignedOff implements Action {
  type = AuthenticationActionTypes.SignedOff;
  public userName: string;
  public userToken: string;
  public userId: string;
  public password: string;
  public userModel: UserModel;
  public errorMessage: string;
  public isStartEnabled: boolean;
  public loginData: any;
  constructor() { }
}

export class UserDetailsFetched implements Action {
  type = AuthenticationActionTypes.UserDetailsFetched;
  public userName: string;
  public userToken: string;
  public userId: string;
  public password: string;
  public errorMessage: string;
  public isStartEnabled: boolean;
  public loginData: any;
  constructor(public userModel: UserModel) { }
}

export class UserDetailsFetchedAfterLogin implements Action {
  type = AuthenticationActionTypes.UserDetailsFetchedAfterLogin;
  public userName: string;
  public userToken: string;
  public userId: string;
  public password: string;
  public errorMessage: string;
  public isStartEnabled: boolean;
  public loginData: any;
  constructor(public userModel: UserModel) { }
}

export class UserDetailsFetchedAfterCompanyLogin implements Action {
  type = AuthenticationActionTypes.UserDetailsFetchedAfterCompanyLogin;
  public userName: string;
  public userToken: string;
  public userId: string;
  public password: string;
  public errorMessage: string;
  public isStartEnabled: boolean;
  public loginData: any;
  constructor(public userModel: UserModel) { }
}

export class UserInitialDetailsFetched implements Action {
  type = AuthenticationActionTypes.UserInitialDetailsFetched;
  public userName: string;
  public userToken: string;
  public userId: string;
  public password: string;
  public errorMessage: string;
  public isStartEnabled: boolean;
  public loginData: any;
  constructor(public userModel: UserModel) { }
}

export class UserInitialDetailsFetchedCompleted implements Action {
  type = AuthenticationActionTypes.UserInitialDetailsFetchedCompleted;
  public userName: string;
  public userToken: string;
  public userId: string;
  public password: string;
  public errorMessage: string;
  public isStartEnabled: boolean;
  public loginData: any;
  public userModel: UserModel;
  constructor(public userInitialData: any) { }
}

export class FetchTimeSheetButtonDetails implements Action {
  type = AuthenticationActionTypes.FetchTimeSheetButtonDetails;
  public userName: string;
  public userToken: string;
  public userId: string;
  public password: string;
  public errorMessage: string;
  public isStartEnabled: boolean;
  public loginData: any;
  public userModel: UserModel;
  constructor() { }
}

export class UserDetailsFetching implements Action {
  type = AuthenticationActionTypes.UserDetailsFetching;
  public userName: string;
  public userToken: string;
  public userId: string;
  public password: string;
  public errorMessage: string;
  public isStartEnabled: boolean;
  public userModel: UserModel
  constructor(
    public loginData: any) { }
}

export class RoleDetailsFetched implements Action {
  type = AuthenticationActionTypes.RoleDetailsFetched;

  constructor(public roleFeatures: any[]) { }
}

export class RoleDetailsFetchOnReload implements Action {
  type = AuthenticationActionTypes.RoleDetailsFetchOnReload;

  constructor() { }
}

export class InitializeAfterLoginData implements Action {
  type = AuthenticationActionTypes.InitializeAfterLoginData;

  constructor() { }
}

export class RolesFetchTriggered implements Action {
  type = AuthenticationActionTypes.RolesFetchTriggered;

  constructor() { }
}

export class RolesFetchFailed implements Action {
  type = AuthenticationActionTypes.RolesFetchFailed;
  constructor(public validationMessages: string[]) { }
}


export class EntityRolesFetchTriggered implements Action {
  type = AuthenticationActionTypes.EntityRolesFetchTriggered;

  constructor(public projectId: string) { }
}


export class EntityRolesByUserIdFetchTriggered implements Action {
  type = AuthenticationActionTypes.EntityRolesByUserIdFetchTriggered;

  constructor(public projectId: string, public requiredType: string, public isSprintType: boolean) { }
}


export class EntityRoleDetailsFetched implements Action {
  type = AuthenticationActionTypes.EntityRoleDetailsFetched;

  constructor(public entityTypeRoleFeatures: EntityRoleFeatureModel[]) { }
}

export class EntityReolesByUserIdFetchCompleted implements Action {
  type = AuthenticationActionTypes.EntityReolesByUserIdFetchCompleted;

  constructor(public entityTypeRoleFeatures: EntityRoleFeatureModel[]) { }
}


export class EntityRolesByUserIdFetchFailed implements Action {
  type = AuthenticationActionTypes.EntityRolesByUserIdFetchFailed;
  constructor(public validationMessages: ValidationModel[]) { }
}

export class ClearDemoDataTriggred implements Action {
  type = AuthenticationActionTypes.ClearDemoDataTriggred;

  constructor() { }
}

export class ClearDemoDataCompleted implements Action {
  type = AuthenticationActionTypes.ClearDemoDataCompleted;

  constructor(public companyId: string) { }
}

export class ClearDemoDataFailed implements Action {
  type = AuthenticationActionTypes.ClearDemoDataFailed;

  constructor(public validationMessages: ValidationModel[]) { }
}


export class GetCompanyThemeTriggered implements Action {
  type = AuthenticationActionTypes.GetCompanyThemeTriggered;

  constructor() { }
}


export class GetCompanyThemeCompleted implements Action {
  type = AuthenticationActionTypes.GetCompanyThemeCompleted;

  constructor(public themeModel: ThemeModel) { }
}

export class GetCompanyThemeFailed implements Action {
  type = AuthenticationActionTypes.GetCompanyThemeFailed;

  constructor(public validationMessages: ValidationModel[]) { }
}

export class GetUserStoreIdTriggered implements Action {
  type = AuthenticationActionTypes.GetUserStoreIdTriggered;

  constructor(public searchUserStoreDetailsModel: StoreSearchModel) { }
}

export class GetUserStoreIdCompleted implements Action {
  type = AuthenticationActionTypes.GetUserStoreIdCompleted;

  constructor(public userStoreDetails: StoreModel) { }
}


export class GetCompanySettingsTriggered implements Action {
  type = AuthenticationActionTypes.GetCompanySettingsTriggered;

  constructor(public companySettingsModel: CompanysettingsModel) { }
}



export class GetCompanySettingsCompleted implements Action {
  type = AuthenticationActionTypes.GetCompanySettingsCompleted;

  constructor(public companySettingsModel: any[]) { }
}


export class GetCompanySettingsFailed implements Action {
  type = AuthenticationActionTypes.GetCompanySettingsFailed;

  constructor(public validationMessages: ValidationModel[]) { }
}




export class GetUserStoreIdFailed implements Action {
  type = AuthenticationActionTypes.GetUserStoreIdFailed;

  constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
  type = AuthenticationActionTypes.ExceptionHandled;

  constructor(public errorMessage: string) { }
}

export type AuthenticationActions =
  | AuthenticateUser
  | Authenticated
  | SignedOff
  | UserDetailsFetching
  | UserDetailsFetched
  | UserDetailsFetchedAfterLogin
  | UserDetailsFetchedAfterCompanyLogin
  | UserInitialDetailsFetched
  | UserInitialDetailsFetchedCompleted
  | AuthenticationFailed
  | CompanyWorkItemStartFunctionalityRequired
  | CompanyWorkItemStartFunctionalityRequiredSuccess
  | AuthenticateNewUser
