import { Update } from "@ngrx/entity";
import { Action } from "@ngrx/store";
import { User } from '../../models/induction-user-model';
import { UserModel } from '../../models/user';
import { ValidationModel } from '../../models/validation-messages';
// tslint:disable-next-line: ordered-imports

export enum UserActionTypes {
  LoadUsersTriggered = "[HR Widgets User Component] Initial Data Load Triggered",
  LoadUsersCompleted = "[HR Widgets User Component] Initial Data Load Completed",
  LoadUsersListTriggered = "[HR Widgets Users Component] Initial Data Users Triggered",
  LoadUsersListCompleted = "[HR Widgets Users Component] Initial Data  Users Completed",
  LoggedUserTriggered = "[HR Widgets Logged Component] Logged User Triggered",
  LoggedUserCompleted = "[HR Widgets Logged Component] Logged User Completed",
  LoadUsersCompletedFromCache = "[HR Widgets User Component] Initial Data Load Completed From Cache",
  CreateUsersTriggered = "[HR Widgets Create Component] Create User Triggered",
  CreateUsersCompleted = "[HR Widgets Create Component] Create User Completed",
  CreateUsersFailed = "[HR Widgets Create Component] Create Users Failed",
  GetUserByIdTriggered= "[HR Widgets  Component] Get User By Id  Triggered",
  GetUserByIdCompleted= "[HR Widgets Get Component] Get User By Id  Completed",
  CreateUserCompletedWithInPlaceUpdate= "[HR Widgets User Component] Create User Completed WIth In Place Update",
  RefreshUsersList= "[HR Widgets Refresh Component] Refresh User List",
  ExceptionHandled = "[HR Widgets User Component] Exception Handled",
  RemoveUserFromList = "[HR Widgets User Component] Remove User From the list"
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
export class ExceptionHandled implements Action {
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
  | ExceptionHandled
  | RemoveUserFromList
  | LoadUsersListCompleted
  | LoadUsersListTriggered
