import { Update } from "@ngrx/entity";
import { Action } from "@ngrx/store";
import { User, UserModel } from "../../models/user";
import { ValidationModel } from '../../models/validation-messages';

export enum UserActionTypes {
  LoadUsersTriggered = "[Snovasys-PM][User Component] Initial Data Load Triggered",
  LoadUsersCompleted = "[Snovasys-PM][User Component] Initial Data Load Completed",
  LoadUsersListTriggered = "[Snovasys-PM][Users Component] Initial Data Users Triggered",
  LoadUsersListCompleted = "[Snovasys-PM][Users Component] Initial Data  Users Completed",
  LoggedUserTriggered = "[Snovasys-PM][Logged Component] Logged User Triggered",
  LoggedUserCompleted = "[Snovasys-PM][Logged Component] Logged User Completed",
  LoadUsersCompletedFromCache = "[Snovasys-PM][User Component] Initial Data Load Completed From Cache",
  CreateUsersTriggered = "[Snovasys-PM][Create Component] Create User Triggered",
  CreateUsersCompleted = "[Snovasys-PM][Create Component] Create User Completed",
  CreateUsersFailed = "[Snovasys-PM][Create Component] Create Users Failed",
  GetUserByIdTriggered= "[Snovasys-PM][Get Component] Get User By Id  Triggered",
  GetUserByIdCompleted= "[Snovasys-PM][Get Component] Get User By Id  Completed",
  CreateUserCompletedWithInPlaceUpdate= "[Snovasys-PM][User Component] Create User Completed WIth In Place Update",
  RefreshUsersList= "[Snovasys-PM][Refresh Component] Refresh User List",
  UserExceptionHandled = "[Snovasys-PM][User Component] Exception Handled",
  RemoveUserFromList = "[Snovasys-PM][User Component] Remove User From the list"
}

export class LoadUsersTriggered implements Action {
  type = UserActionTypes.LoadUsersTriggered;
  userModel: User[];
  usersModel: UserModel[];
  errorMessage: string;
  users: UserModel;
  userId: string;
  userUpdates: { userUpdate: Update<UserModel> };
  validationMessages: ValidationModel[];
  constructor( ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUsersCompleted implements Action {
  type = UserActionTypes.LoadUsersCompleted;
  usersModel: UserModel[];
  errorMessage: string;
  users: UserModel;
  userId: string;
  userUpdates: { userUpdate: Update<UserModel> };
  validationMessages: ValidationModel[];
  constructor(public userModel: User[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUsersListTriggered implements Action {
  type = UserActionTypes.LoadUsersListTriggered;
  userModel: User[];
  usersModel: UserModel[];
  errorMessage: string;
  userId: string;
  userUpdates: { userUpdate: Update<UserModel> };
  validationMessages: ValidationModel[];
  constructor(public users: UserModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUsersListCompleted implements Action {
  type = UserActionTypes.LoadUsersListCompleted;
  userModel: User[];
  errorMessage: string;
  users: UserModel;
  userId: string;
  userUpdates: { userUpdate: Update<UserModel> };
  validationMessages: ValidationModel[];
  constructor(public usersModel: UserModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoggedUserTriggered implements Action {
  type = UserActionTypes.LoggedUserTriggered;
  userModel: User[];
  usersModel: UserModel[];
  errorMessage: string;
  users: UserModel;
  userId: string;
  userUpdates: { userUpdate: Update<UserModel> };
  validationMessages: ValidationModel[];
  constructor() {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoggedUserCompleted implements Action {
  type = UserActionTypes.LoggedUserCompleted;
  userModel: User[];
  usersModel: UserModel[];
  errorMessage: string;
  userId: string;
  validationMessages: ValidationModel[];
  userUpdates: { userUpdate: Update<UserModel> };
  constructor(public users: UserModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUsersCompletedFromCache implements Action {
  type = UserActionTypes.LoadUsersCompletedFromCache;
  userModel: User[];
  usersModel: UserModel[];
  errorMessage: string;
  userId: string;
  validationMessages: ValidationModel[];
  userUpdates: { userUpdate: Update<UserModel> };
  constructor(public users: UserModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateUsersTriggered implements Action {
  type = UserActionTypes.CreateUsersTriggered;
  userModel: User[];
  usersModel: UserModel[];
  errorMessage: string;
  userId: string;
  validationMessages: ValidationModel[];
  userUpdates: { userUpdate: Update<UserModel> };
  constructor(public  users: UserModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class CreateUsersCompleted implements Action {
  type = UserActionTypes.CreateUsersCompleted;
  userModel: User[];
  usersModel: UserModel[];
  errorMessage: string;
  users: UserModel;
  validationMessages: ValidationModel[];
  userUpdates: { userUpdate: Update<UserModel> };
  constructor(public userId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class RemoveUserFromList implements Action {
  type = UserActionTypes.RemoveUserFromList;
  userModel: User[];
  usersModel: UserModel[];
  errorMessage: string;
  users: UserModel;
  validationMessages: ValidationModel[];
  userUpdates: { userUpdate: Update<UserModel> };
  constructor(public userId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class CreateUsersFailed implements Action {
  type = UserActionTypes. CreateUsersFailed;
  userModel: User[];
  usersModel: UserModel[];
  users: UserModel;
  userId: string;
  userUpdates: { userUpdate: Update<UserModel> };
  errorMessage: string;
  constructor(public validationMessages: ValidationModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetUserByIdTriggered implements Action {
  type = UserActionTypes.GetUserByIdTriggered;
  userModel: User[];
  usersModel: UserModel[];
  errorMessage: string;
  users: UserModel;
  validationMessages: ValidationModel[];
  userUpdates: { userUpdate: Update<UserModel> };
  constructor(public userId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetUserByIdCompleted implements Action {
  type = UserActionTypes.GetUserByIdCompleted;
  errorMessage: string;
  userId: string;
  userModel: User[];
  usersModel: UserModel[];
  validationMessages: ValidationModel[];
  userUpdates: { userUpdate: Update<UserModel> };
  constructor(public users: UserModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class CreateUserCompletedWithInPlaceUpdate implements Action {
  type = UserActionTypes.CreateUserCompletedWithInPlaceUpdate;
  userModel: User[];
  usersModel: UserModel[];
  users: UserModel;
  userId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  constructor(public userUpdates: { userUpdate: Update<UserModel> }) { }
}

// tslint:disable-next-line: max-classes-per-file
export class RefreshUsersList implements Action {
  type = UserActionTypes.RefreshUsersList;
  userModel: User[];
  usersModel: UserModel[];
  userId: string;
  validationMessages: ValidationModel[];
  userUpdates: { userUpdate: Update<UserModel> };
  errorMessage: string;
  constructor(public users: UserModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UserExceptionHandled implements Action {
  type = UserActionTypes.LoggedUserCompleted;
  userModel: User[];
  usersModel: UserModel[];
  users: UserModel;
  validationMessages: ValidationModel[];
  userId: string;
  userUpdates: { userUpdate: Update<UserModel> };
  constructor(public errorMessage: string) {}
}

export type UserActions =
  | LoadUsersTriggered
  | LoadUsersCompleted
  | LoggedUserTriggered
  | LoggedUserCompleted
  | LoadUsersCompletedFromCache
  | CreateUsersTriggered
  | CreateUsersCompleted
  | CreateUsersFailed
  | GetUserByIdTriggered
  | GetUserByIdCompleted
  | CreateUserCompletedWithInPlaceUpdate
  | RefreshUsersList
  | UserExceptionHandled
  | RemoveUserFromList
  | LoadUsersListCompleted
  | LoadUsersListTriggered
