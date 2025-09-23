import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { UserModel } from '../../models/user';
import { ChangePasswordActionTypes, ChangePasswordActions } from '../actions/change-password.actions';


export interface State extends EntityState<UserModel> {
    CreatingPassword: boolean;
    CreatingPasswordErrors: string[];
    password: string;
    exceptionMessage: string;
}

export const assetAdapter: EntityAdapter<
    UserModel
> = createEntityAdapter<UserModel>({
    selectId: (userModel: UserModel) => userModel.password
});

export const initialState: State = assetAdapter.getInitialState({
    CreatingPassword: false,
    CreatingPasswordErrors: [''],
    password: '',
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: ChangePasswordActions
): State {
    switch (action.type) {
        case ChangePasswordActionTypes.ChangePasswordTriggered:
            return { ...state, CreatingPassword: true };
        case ChangePasswordActionTypes.ChangePasswordCompleted:
            return { ...state, CreatingPassword: false, password: action.userId };
        case ChangePasswordActionTypes.ChangePasswordFailed:
            return { ...state, CreatingPassword: false, CreatingPasswordErrors: action.validationMessages };
        case ChangePasswordActionTypes.ChangePasswordExceptionHandled:
            return { ...state, CreatingPassword: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}