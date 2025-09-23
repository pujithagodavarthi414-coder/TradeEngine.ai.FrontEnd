import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { UploadProfileImageModel } from '../../models/upload-profile-image-model';
import { UserModel } from '../../models/user-details.model';

export enum UserProfileActionTypes {
    GetUserProfileByIdTriggered = '[Profile Module User Profile Details Component] Get User Profile Details By Id Triggered',
    GetUserProfileByIdCompleted = '[Profile Module User Profile Details Component] Get User Profile Details By Id Completed',
    GetUserProfileByIdFailed = '[Profile Module User Profile Details Component] Get User Profile Details By Id Failed',
    CreateProfileImageTriggered = '[Profile Module User Profile Details Component] Create User Profile Details Triggered',
    CreateProfileImageCompleted = '[Profile Module User Profile Details Component] Create User Profile Details Completed',
    CreateProfileImageFailed = '[Profile Module User Profile Details Component] Create User Profile Details Failed',
    UpdateProfileImageById = '[Profile Module User Profile Details Component] Update User Profile Details By Id',
    UserIsViewingOthersProfile = '[Profile Module User Profile Details Component] User Is Viewing Others Profile',
    ExceptionHandled = '[Profile Module User Profile Details Component] Handle Exception',
}

export class GetUserProfileByIdTriggered implements Action {
    type = UserProfileActionTypes.GetUserProfileByIdTriggered;
    uploadProfileImageModel: UploadProfileImageModel;
    userModel: UserModel;
    userModelUpdates: { userModelUpdate: Update<UserModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public userId: string) { }
}

export class GetUserProfileByIdCompleted implements Action {
    type = UserProfileActionTypes.GetUserProfileByIdCompleted;
    uploadProfileImageModel: UploadProfileImageModel;
    userId: string;
    userModelUpdates: { userModelUpdate: Update<UserModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public userModel: UserModel) { }
}

export class GetUserProfileByIdFailed implements Action {
    type = UserProfileActionTypes.GetUserProfileByIdFailed;
    uploadProfileImageModel: UploadProfileImageModel;
    userId: string;
    userModel: UserModel;
    userModelUpdates: { userModelUpdate: Update<UserModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateProfileImageTriggered implements Action {
    type = UserProfileActionTypes.CreateProfileImageTriggered;
    userId: string;
    userModel: UserModel;
    userModelUpdates: { userModelUpdate: Update<UserModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public uploadProfileImageModel: UploadProfileImageModel) { }
}

export class CreateProfileImageCompleted implements Action {
    type = UserProfileActionTypes.CreateProfileImageCompleted;
    uploadProfileImageModel: UploadProfileImageModel;
    userModel: UserModel;
    userModelUpdates: { userModelUpdate: Update<UserModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public userId: string) { }
}

export class CreateProfileImageFailed implements Action {
    type = UserProfileActionTypes.CreateProfileImageFailed;
    uploadProfileImageModel: UploadProfileImageModel;
    userId: string;
    userModel: UserModel;
    userModelUpdates: { userModelUpdate: Update<UserModel> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class UpdateProfileImageById implements Action {
    type = UserProfileActionTypes.UpdateProfileImageById;
    uploadProfileImageModel: UploadProfileImageModel;
    userId: string;
    userModel: UserModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public userModelUpdates: { userModelUpdate: Update<UserModel> }) { }
}

export class UserIsViewingOthersProfile implements Action {
    type = UserProfileActionTypes.UserIsViewingOthersProfile;
    uploadProfileImageModel: UploadProfileImageModel;
    userId: string;
    userModel: UserModel;
    userModelUpdates: { userModelUpdate: Update<UserModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor() { }
}

export class ExceptionHandled implements Action {
    type = UserProfileActionTypes.ExceptionHandled;
    uploadProfileImageModel: UploadProfileImageModel;
    userId: string;
    userModel: UserModel;
    userModelUpdates: { userModelUpdate: Update<UserModel> };
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type UserProfileActions = GetUserProfileByIdTriggered
    | GetUserProfileByIdCompleted
    | GetUserProfileByIdFailed
    | CreateProfileImageTriggered
    | CreateProfileImageCompleted
    | CreateProfileImageFailed
    | UpdateProfileImageById
    | UserIsViewingOthersProfile
    | ExceptionHandled;