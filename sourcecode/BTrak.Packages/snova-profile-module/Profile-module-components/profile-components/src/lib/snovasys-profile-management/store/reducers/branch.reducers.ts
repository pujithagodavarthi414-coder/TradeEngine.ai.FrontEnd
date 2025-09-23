import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { BranchActionTypes, BranchActions } from '../actions/branch.actions';
import { Branch } from '../../models/branch';

export interface State extends EntityState<Branch> {
    loadingBranch: boolean;
    exceptionMessage: string;
}

export const branchAdapter: EntityAdapter<
    Branch
> = createEntityAdapter<Branch>({
    selectId: (branch: Branch) => branch.branchId
});

export const initialState: State = branchAdapter.getInitialState({
    loadingBranch: false,
    exceptionMessage: '',
});

export function reducer(
    state: State = initialState,
    action: BranchActions
): State {
    switch (action.type) {
        case BranchActionTypes.LoadBranchTriggered:
            return { ...state, loadingBranch: true };
        case BranchActionTypes.LoadBranchCompleted:
            return branchAdapter.addAll(action.branchList, {
                ...state, loadingBranch: false
            });
        case BranchActionTypes.LoadBranchFailed:
            return { ...state, loadingBranch: false };
        case BranchActionTypes.BranchExceptionHandled:
            return { ...state, loadingBranch: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}