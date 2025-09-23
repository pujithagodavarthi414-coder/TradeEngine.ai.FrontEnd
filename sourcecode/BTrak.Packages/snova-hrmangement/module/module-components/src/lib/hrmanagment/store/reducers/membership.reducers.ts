import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { MembershipModel } from "../../models/membership-model";
import { MembershipListActions, MembershipListActionTypes } from "../actions/membership.action";

export interface State extends EntityState<MembershipModel> {
    loadingMembershipList: boolean;
    getLoadMembershipErrors: string[],
    exceptionMessage: string;
    
}

export const MembershipAdapter: EntityAdapter<
    MembershipModel
> = createEntityAdapter<MembershipModel>({
    selectId: (membership: MembershipModel) => membership.membershipId
});

export const initialState: State = MembershipAdapter.getInitialState({
    loadingMembershipList: false,
    exceptionMessage: '',
    getLoadMembershipErrors: [''],
});

export function reducer(
    state: State = initialState,
    action: MembershipListActions
): State {
    switch (action.type) {
        case MembershipListActionTypes.LoadMembershipTriggered:
            return { ...state, loadingMembershipList: true };
        case MembershipListActionTypes.LoadMembershipCompleted:
            return MembershipAdapter.addAll(action.MembershipList, {
                ...state,
                loadingMembershipList: false
            });
        case MembershipListActionTypes.LoadMembershipFailed:
            return { ...state, loadingMembershipList: false, getLoadMembershipErrors: action.validationMessages };
        case MembershipListActionTypes.ExceptionHandled:
            return { ...state, loadingMembershipList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}