import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Assets } from '../../models/asset';

import { DamagedAssetsActionTypes, DamagedAssetsActions } from '../actions/damaged-assets.actions';

export interface State extends EntityState<Assets> {
    loadingDamagedAssets: boolean;
    exceptionMessage: string;
}

export const damagedAssetsAdapter: EntityAdapter<
    Assets
> = createEntityAdapter<Assets>({
    selectId: (damagedAssets: Assets) => damagedAssets.assetId
});

export const initialState: State = damagedAssetsAdapter.getInitialState({
    loadingDamagedAssets: false,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: DamagedAssetsActions
): State {
    switch (action.type) {
        case DamagedAssetsActionTypes.LoadRecentlyDamagedAssetsTriggered:
            return { ...state, loadingDamagedAssets: true };
        case DamagedAssetsActionTypes.LoadRecentlyDamagedAssetsCompleted:
            return damagedAssetsAdapter.addAll(action.recentlyDamagedAssetsList, {
                ...state, loadingDamagedAssets: false
            });
        case DamagedAssetsActionTypes.LoadRecentlyDamagedAssetsFailed:
            return { ...state, loadingDamagedAssets: false };
        case DamagedAssetsActionTypes.DamagedAssetsExceptionHandled:
            return { ...state, loadingDamagedAssets: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}