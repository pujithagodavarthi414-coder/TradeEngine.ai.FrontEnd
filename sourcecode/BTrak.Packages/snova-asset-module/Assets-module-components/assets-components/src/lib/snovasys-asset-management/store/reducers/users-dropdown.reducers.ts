import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { UserDropDownModel } from '../../models/user-dropdown.model';
import { UsersActions, UsersActionTypes } from '../actions/users-dropdown.actions';

export interface State extends EntityState<UserDropDownModel> {
    loadingUsersList: boolean;
    getLoadUsersErrors: string[],
    exceptionMessage: string;
}

export const usersAdapter: EntityAdapter<
UserDropDownModel
> = createEntityAdapter<UserDropDownModel>({
    selectId: (userModel: UserDropDownModel) => userModel.id
});

export const initialState: State = usersAdapter.getInitialState({
    loadingUsersList: false,
    getLoadUsersErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: UsersActions
): State {
    switch (action.type) {
        case UsersActionTypes.LoadUsersDropDownTriggered:
            return { ...state, loadingUsersList: true };
        case UsersActionTypes.LoadUsersDropDownCompleted:
            return usersAdapter.addAll(action.usersList, {
                ...state,
                loadingUsersList: false
            });
        case UsersActionTypes.LoadUsersDropDownFailed:
            return { ...state, loadingUsersList: false, getLoadUsersErrors: action.validationMessages };
        case UsersActionTypes.ExceptionHandled:
            return { ...state, loadingUsersList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}