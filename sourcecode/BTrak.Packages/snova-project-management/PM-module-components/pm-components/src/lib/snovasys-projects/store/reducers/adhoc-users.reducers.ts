import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { User } from "../../models/user";
import { AdhocUsersActions, AdhocUsersActionTypes } from "../actions/adhoc-users.action";

export interface State extends EntityState<User> {
    loadingAdhocUsers: boolean;
    exceptionMessage: string;
}

export const AdhocUsersAdapter: EntityAdapter<
User
> = createEntityAdapter<User>({
    selectId: (users: User) => users.id
});

export const initialState: State = AdhocUsersAdapter.getInitialState({
    loadingAdhocUsers: false,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: AdhocUsersActions
): State {
    switch (action.type) {
        case AdhocUsersActionTypes.GetAdhocUsersTriggered:
            return { ...state, loadingAdhocUsers: true };
        case AdhocUsersActionTypes.GetAdhocUsersCompleted:
            return AdhocUsersAdapter.addAll(action.users, {
                ...state,
                loadingAdhocUsers: false
            });
        default:
            return state;
    }
}