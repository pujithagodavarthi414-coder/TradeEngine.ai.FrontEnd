import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Assets } from '../../models/asset';

import { AssignedAssetsActionTypes, AssignedAssetsActions } from '../actions/assigned-assets.actions';

export interface State extends EntityState<Assets> {
    loadingAssignedAssets: boolean;
    exceptionMessage: string;
}

export const assignedAssetsAdapter: EntityAdapter<
    Assets
> = createEntityAdapter<Assets>({
    selectId: (assignedAssets: Assets) => assignedAssets.assetId
});

export const initialState: State = assignedAssetsAdapter.getInitialState({
    loadingAssignedAssets: false,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: AssignedAssetsActions
): State {
    switch (action.type) {
        case AssignedAssetsActionTypes.LoadRecentlyAssignedAssetsTriggered:
            return { ...state, loadingAssignedAssets: true };
        case AssignedAssetsActionTypes.LoadRecentlyAssignedAssetsCompleted:
            return assignedAssetsAdapter.addAll(action.recentlyAssignedAssetsList, {
                ...state, loadingAssignedAssets: false
            });
        case AssignedAssetsActionTypes.LoadRecentlyAssignedAssetsFailed:
            return { ...state, loadingAssignedAssets: false };
        case AssignedAssetsActionTypes.ExceptionHandled:
            return { ...state, loadingAssignedAssets: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}