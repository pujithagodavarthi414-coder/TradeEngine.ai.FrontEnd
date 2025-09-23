import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { UserProfileActionTypes, UserProfileActions } from '../actions/user-profile.action';
import { UserModel } from '../../models/user-details.model';


export interface State extends EntityState<UserModel> {
    loadingUserProfileDetails: boolean;
    upsertingUserProfileImage: boolean;
    userProfileDetails: UserModel;
    userProfileErrors: string[];
    exceptionMessage: string;
}

export const userProfileAdapter: EntityAdapter<
    UserModel
> = createEntityAdapter<UserModel>({
    selectId: (userModel: UserModel) => userModel.id
});

export const initialState: State = userProfileAdapter.getInitialState({
    loadingUserProfileDetails: false,
    upsertingUserProfileImage: false,
    userProfileDetails: null,
    userProfileErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: UserProfileActions
): State {
    switch (action.type) {
        case UserProfileActionTypes.GetUserProfileByIdTriggered:
            return { ...initialState, loadingUserProfileDetails: true };
        case UserProfileActionTypes.GetUserProfileByIdCompleted:
            return userProfileAdapter.addOne(action.userModel, {
                ...state,
                loadingUserProfileDetails: false,userProfileDetails: action.userModel
            });
        case UserProfileActionTypes.GetUserProfileByIdFailed:
            return { ...state, loadingUserProfileDetails: false, userProfileErrors: action.validationMessages };
        case UserProfileActionTypes.CreateProfileImageTriggered:
            return { ...state, upsertingUserProfileImage: true };
        case UserProfileActionTypes.CreateProfileImageCompleted:
            return { ...state, upsertingUserProfileImage: false };
        case UserProfileActionTypes.CreateProfileImageFailed:
            return { ...state, upsertingUserProfileImage: false, userProfileErrors: action.validationMessages };
        case UserProfileActionTypes.UpdateProfileImageById:
            return userProfileAdapter.updateOne(action.userModelUpdates.userModelUpdate, state);
        case UserProfileActionTypes.ExceptionHandled:
            return { ...state, loadingUserProfileDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}