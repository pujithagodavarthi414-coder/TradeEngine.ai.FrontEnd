import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Assets } from '../../models/asset';
import { AssetsActionTypes, AssetsActions } from '../actions/assets.actions';

export interface State extends EntityState<Assets> {
    loadingAssets: boolean;
    creatingAsset: boolean;
    gettingAssetById: boolean;
    createAssetsErrors: string[];
    AssetsList: Assets[];
    Asset: Assets;
    AssetId: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    exceptionMessage: string;
    loadingAssetsByIds: boolean;
}

export const assetAdapter: EntityAdapter<
    Assets
> = createEntityAdapter<Assets>({
    selectId: (asset: Assets) => asset.assetId
});

export const initialState: State = assetAdapter.getInitialState({
    loadingAssets: false,
    creatingAsset: false,
    gettingAssetById: false,
    createAssetsErrors: [''],
    AssetsList: null,
    Asset: null,
    AssetId: '',
    selectedAssetId: '',
    assetsTotalCount: -1,
    exceptionMessage: '',
    loadingAssetsByIds: false
});

export function reducer(
    state: State = initialState,
    action: AssetsActions
): State {
    switch (action.type) {
        case AssetsActionTypes.LoadAssetsTriggered:
            return { ...state, loadingAssets: true };
        case AssetsActionTypes.LoadAssetsCompleted:
            return assetAdapter.addAll(action.assetsList, {
                ...state,
                loadingAssets: false, AssetsList: action.assetsList
            });
        case AssetsActionTypes.LoadAssetsFailed:
            return { ...state, loadingAssets: false };
        case AssetsActionTypes.CreateAssetsTriggered:
            return { ...state, creatingAsset: true };
        case AssetsActionTypes.CreateAssetsCompleted:
            return { ...state, creatingAsset: false, AssetId: action.assetId };
        case AssetsActionTypes.CreateAssetsFailed:
            return { ...state, creatingAsset: false, createAssetsErrors: action.validationMessages };
        case AssetsActionTypes.GetAssetByIdTriggered:
            return { ...state, gettingAssetById: true };
        case AssetsActionTypes.GetAssetByIdCompleted:
            return { ...state, gettingAssetById: false, Asset: action.asset };
        case AssetsActionTypes.GetAssetByIdFailed:
            return { ...state, gettingAssetById: false };
        case AssetsActionTypes.CreateAssetCompletedWithInPlaceUpdate:
            return assetAdapter.updateOne(action.assetUpdates.assetUpdate, state);
        case AssetsActionTypes.GetAssetsByIdsTriggered:
            return { ...state, loadingAssetsByIds: true };
        case AssetsActionTypes.GetAssetsByIdsCompleted:
            return assetAdapter.updateMany(action.assetMultipleUpdates.assetMultipleUpdate, {
                ...state,
                loadingAssetsByIds: false
            });
        case AssetsActionTypes.RefreshAssetsList:
            return assetAdapter.upsertOne(action.asset, state);
        case AssetsActionTypes.RemoveAssetsFromTheList:
            return assetAdapter.removeOne(action.assetIdToBeRemoved, { ...state });
        case AssetsActionTypes.GetSelectedAssetCompleted:
            return { ...state, selectedAssetId: action.selectedAssetId };
        case AssetsActionTypes.AssetsTotalCountCompleted:
            return { ...state, assetsTotalCount: action.assetsTotalCount };
        case AssetsActionTypes.AssetsExceptionHandled:
            return { ...state, creatingAsset: false, exceptionMessage: action.errorMessage };
        case AssetsActionTypes.RemoveMultipleAssetsIdsCompleted:
            return assetAdapter.removeMany(action.assetIds, { ...state });
        default:
            return state;
    }
}