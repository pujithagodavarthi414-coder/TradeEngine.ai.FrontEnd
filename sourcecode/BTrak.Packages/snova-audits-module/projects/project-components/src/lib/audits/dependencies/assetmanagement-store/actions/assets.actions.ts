import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { AssetInputModel } from '../../models/asset-input-model';
import { Assets } from '../../models/asset';

export enum AssetsActionTypes {
    LoadAssetsTriggered = '[Assets Component] Initial Data Load Triggered',
    LoadAssetsCompleted = '[Assets Component] Initial Data Load Completed',
    LoadAssetsFailed = '[Assets Component] Initial Data Load Failed',
    CreateAssetsTriggered = '[Assets Component] Create Asset Triggered',
    CreateAssetsCompleted = '[Assets Component] Create Asset Completed',
    CreateAssetsFailed = '[Assets Component] Create Asset Failed',
    GetAssetByIdTriggered = '[Assets Component] Get Asset By Id Triggered',
    GetAssetByIdCompleted = '[Assets Component] Get Asset By Id Completed',
    GetAssetByIdFailed = '[Assets Component] Get Asset By Id Failed',
    CreateAssetCompletedWithInPlaceUpdate = '[Asset Component] Create Asset Completed With InPlace Update',
    RefreshAssetsList = '[Asset Component] Refresh Assets List',
    RemoveAssetsFromTheList = '[Asset Component] Asset To Be Removed',
    GetSelectedAssetTriggered = '[Asset Component] Get Selected Asset Triggered',
    GetSelectedAssetCompleted = '[Asset Component] Get Selected Asset Completed',
    AssetsTotalCountTriggered = '[Asset Component] Assets Total Count Triggered',
    AssetsTotalCountCompleted = '[Asset Component] Assets Total Count Completed',
    GetAssetsByIdsTriggered = '[] Assets Load By Ids Triggered',
    GetAssetsByIdsCompleted = '[] Assets Load By Ids Completed',
    GetAssetsByIdsFailed = '[] Assets Load By Ids Failed',
    ExceptionHandled = '[Assets Component] HandleException',
    RemoveMultipleAssetsIdsCompleted = "[Assets Component] Remove Multiple Assets Ids Completed",
    LoadAssetsCommentsAndHistory = "[Assets Component] Load Assets Comments and history",
}

export class LoadAssetsTriggered implements Action {
    type = AssetsActionTypes.LoadAssetsTriggered;
    assetsList: Assets[];
    asset: Assets;
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public assetsSearchResult: AssetInputModel) { }
}

export class LoadAssetsCompleted implements Action {
    type = AssetsActionTypes.LoadAssetsCompleted;
    assetsSearchResult: AssetInputModel;
    asset: Assets;
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public assetsList: Assets[]) { }
}

export class LoadAssetsFailed implements Action {
    type = AssetsActionTypes.LoadAssetsFailed;
    assetsSearchResult: AssetInputModel;
    assetsList: Assets[];
    asset: Assets;
    assetId: string;
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateAssetsTriggered implements Action {
    type = AssetsActionTypes.CreateAssetsTriggered;
    assetsSearchResult: AssetInputModel;
    assetsList: Assets[];
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public asset: Assets) { }
}

export class CreateAssetsCompleted implements Action {
    type = AssetsActionTypes.CreateAssetsCompleted;
    assetsSearchResult: AssetInputModel;
    assetsList: Assets[];
    asset: Assets;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public assetId: string) { }
}

export class CreateAssetsFailed implements Action {
    type = AssetsActionTypes.CreateAssetsFailed;
    assetsSearchResult: AssetInputModel;
    assetsList: Assets[];
    asset: Assets;
    assetId: string;
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public validationMessages: any[]) { }
}

export class GetAssetByIdTriggered implements Action {
    type = AssetsActionTypes.GetAssetByIdTriggered;
    assetsSearchResult: AssetInputModel;
    assetsList: Assets[];
    asset: Assets;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public assetId: string) { }
}

export class GetAssetByIdCompleted implements Action {
    type = AssetsActionTypes.GetAssetByIdCompleted;
    assetsSearchResult: AssetInputModel;
    assetsList: Assets[];
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public asset: Assets) { }
}

export class GetAssetByIdFailed implements Action {
    type = AssetsActionTypes.GetAssetByIdFailed;
    assetsSearchResult: AssetInputModel;
    assetsList: Assets[];
    asset: Assets;
    assetId: string;
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateAssetCompletedWithInPlaceUpdate implements Action {
    type = AssetsActionTypes.CreateAssetCompletedWithInPlaceUpdate;
    assetsSearchResult: AssetInputModel;
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    assetsList: Assets[];
    asset: Assets;
    assetId: string;
    validationMessages: any[];
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public assetUpdates: { assetUpdate: Update<Assets> }) { }
}

export class RefreshAssetsList implements Action {
    type = AssetsActionTypes.RefreshAssetsList;
    assetsSearchResult: AssetInputModel;
    assetsList: Assets[];
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public asset: Assets) { }
}

export class RemoveAssetsFromTheList implements Action {
    type = AssetsActionTypes.RemoveAssetsFromTheList;
    asset: Assets;
    assetsSearchResult: AssetInputModel;
    assetsList: Assets[];
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public assetIdToBeRemoved: string) { }
}

export class GetSelectedAssetTriggered implements Action {
    type = AssetsActionTypes.GetSelectedAssetTriggered;
    asset: Assets;
    assetsSearchResult: AssetInputModel;
    assetsList: Assets[];
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public selectedAssetId: string) { }
}

export class GetSelectedAssetCompleted implements Action {
    type = AssetsActionTypes.GetSelectedAssetCompleted;
    asset: Assets;
    assetsSearchResult: AssetInputModel;
    assetsList: Assets[];
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public selectedAssetId: string) { }
}

export class AssetsTotalCountTriggered implements Action {
    type = AssetsActionTypes.AssetsTotalCountTriggered;
    asset: Assets;
    assetsList: Assets[];
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public assetsSearchResult: AssetInputModel) { }
}

export class AssetsTotalCountCompleted implements Action {
    type = AssetsActionTypes.AssetsTotalCountCompleted;
    asset: Assets;
    assetsList: Assets[];
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsSearchResult: AssetInputModel;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public assetsTotalCount: number) { }
}

export class RemoveMultipleAssetsIdsCompleted implements Action {
    type = AssetsActionTypes.RemoveMultipleAssetsIdsCompleted;
    assetsSearchResult: AssetInputModel;
    assetsList: Assets[];
    asset: Assets;
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    errorMessage: string;
    assetIdForCommentsAndHistory: string;
    constructor(public assetIds: string[]) { }
}

export class GetAssetsByIdsTriggered implements Action {
    type = AssetsActionTypes.GetAssetsByIdsTriggered;
    assetsList: Assets[];
    asset: Assets;
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public assetsSearchResult: AssetInputModel) { }
}

export class GetAssetsByIdsCompleted implements Action {
    type = AssetsActionTypes.GetAssetsByIdsCompleted;
    assetsSearchResult: AssetInputModel;
    asset: Assets;
    assetsList: Assets[];
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] }) { }
}

export class GetAssetsByIdsFailed implements Action {
    type = AssetsActionTypes.GetAssetsByIdsFailed;
    assetsSearchResult: AssetInputModel;
    asset: Assets;
    assetsList: Assets[];
    assetId: string;
    assetUpdates: { assetUpdate: Update<Assets> };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    assetIdForCommentsAndHistory: string;
    constructor(public validationMessages: any[]) { }
}

export class LoadAssetsCommentsAndHistory implements Action {
    type = AssetsActionTypes.LoadAssetsCommentsAndHistory;
    assetsSearchResult: AssetInputModel;
    asset: Assets;
    assetsList: Assets[];
    assetId: string;
    assetUpdates: { assetUpdate: Update<Assets> };
    errorMessage: string;
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    validationMessages: any[];
    constructor(public assetIdForCommentsAndHistory: string) { }
}

export class ExceptionHandled implements Action {
    type = AssetsActionTypes.ExceptionHandled;
    assetsSearchResult: AssetInputModel;
    assetsList: Assets[];
    asset: Assets;
    assetId: string;
    validationMessages: any[];
    assetUpdates: { assetUpdate: Update<Assets> };
    assetMultipleUpdates: { assetMultipleUpdate: Update<Assets>[] };
    assetIdToBeRemoved: string;
    selectedAssetId: string;
    assetsTotalCount: number;
    assetIds: string[];
    assetIdForCommentsAndHistory: string;
    constructor(public errorMessage: string) { }
}

export type AssetsActions = LoadAssetsTriggered
    | LoadAssetsCompleted
    | LoadAssetsFailed
    | CreateAssetsTriggered
    | CreateAssetsCompleted
    | CreateAssetsFailed
    | GetAssetByIdTriggered
    | GetAssetByIdCompleted
    | GetAssetByIdFailed
    | CreateAssetCompletedWithInPlaceUpdate
    | RefreshAssetsList
    | RemoveAssetsFromTheList
    | GetSelectedAssetTriggered
    | GetSelectedAssetCompleted
    | AssetsTotalCountTriggered
    | AssetsTotalCountCompleted
    | GetAssetsByIdsTriggered
    | GetAssetsByIdsCompleted
    | RemoveMultipleAssetsIdsCompleted
    | GetAssetsByIdsFailed
    | LoadAssetsCommentsAndHistory
    | ExceptionHandled