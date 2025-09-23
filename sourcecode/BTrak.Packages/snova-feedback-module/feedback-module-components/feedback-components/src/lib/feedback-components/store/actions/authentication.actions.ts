import { Action } from "@ngrx/store";
import { UserModel } from '../../models/user';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { ValidationModel } from '../../models/validation-messages';
import { ThemeModel } from '../../models/themes.model';
import { CompanysettingsModel } from '../../models/company-model';
import { StoreSearchModel, StoreModel } from '../../models/store-model';

export enum AuthenticationActionTypes {
  AuthenticateUser = "[Feedback management Authentication] Authenticate User",
  Authenticated = "[Feedback management Authentication] Authenticated",
  CompanyWorkItemStartFunctionalityRequired  = "[Feedback management Authentication] CompanyWorkItemStartFunctionalityRequired",
  CompanyWorkItemStartFunctionalityRequiredFailed  = "[Feedback management Authentication] CompanyWorkItemStartFunctionalityRequired Failed",
  CompanyWorkItemStartFunctionalityRequiredSuccess  = "[Feedback management Authentication] CompanyWorkItemStartFunctionalityRequired Success",
  SignedOff = "[Feedback management Authentication] Signed Off",
  UserDetailsFetching = "[Feedback management Authentication] Fetching User Details",
  UserDetailsFetched = "[Feedback management Authentication] Fetched User Details",
  AuthenticationFailed = "[Feedback management Authentication] Authentication Failed",
  RoleDetailsFetchOnReload = "[Feedback management Authentication] Role Details Fetched On Reload",
  RoleDetailsFetched = "[Feedback management Authentication] Role Details Fetched",
  InitializeAfterLoginData = "[Feedback management Authentication] Initialize after login data",
  RolesFetchTriggered = "[Feedback management Authentication] Fetching Roles Triggered",
  RolesFetchFailed = '[Feedback management Authentication] Fetching Roles Failed',
  EntityRolesFetchTriggered = "[Feedback management Authentication] Fetching Entity Roles Triggered",
  EntityRoleDetailsFetched = "[Feedback management Authentication] Entity Role Details Fetched",
  EntityRolesByUserIdFetchTriggered = "[Feedback management Authentication] Fetching Entity Roles By UserId Triggered",
  EntityReolesByUserIdFetchCompleted = "[Feedback management Authentication] Fetching EntityRoles By UserId Completed",
  EntityRolesByUserIdFetchFailed = "[Feedback management Authentication] Fetching EntityRoles By UserId Failed",
  GetCompanyThemeTriggered = "[Feedback management Authentication] GEt Company Theme Triggered",
  GetCompanyThemeCompleted = "[Feedback management Authentication] GEt Company Theme Completed",
  GetCompanyThemeFailed = "[Feedback management Authentication] GEt Company Theme Failed",
  ClearDemoDataTriggred = "[Feedback management Authentication] Clear Demo Data Triggred",
  ClearDemoDataCompleted = "[Feedback management Authentication] Clear Demo Data Completed",
  ClearDemoDataFailed = "[Feedback management Authentication] Clear Demo Data Failed",
  GetUserStoreIdTriggered = '[Feedback management Authentication] Get User Store Id Triggered',
  GetUserStoreIdCompleted = '[Feedback management Authentication] Get User Store Id Completed',
  GetUserStoreIdFailed = '[Feedback management Authentication] Get User Store Id Failed',
  ExceptionHandled = '[Feedback management Authentication] Exception Handling',
  AuthenticateNewUser = "[Feedback management Authentication] Authenticate New User",
  GetCompanySettingsTriggered = "[Feedback management Authentication] Get Company Settings Triggered",
  GetCompanySettingsCompleted = "[Feedback management Authentication] Get Company Settings Completed",
  GetCompanySettingsFailed = "[Feedback management Authentication] Get Company Settings Failed",

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
 
  constructor(public userName: string) {}
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
  | AuthenticationFailed
  | CompanyWorkItemStartFunctionalityRequired
  | CompanyWorkItemStartFunctionalityRequiredSuccess
  | AuthenticateNewUser
  