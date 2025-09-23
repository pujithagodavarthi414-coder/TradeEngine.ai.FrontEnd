import { Action } from '@ngrx/store';

import { AssetInputModel } from '../../models/asset-input-model';
import { Assets } from '../../models/asset';

export enum DamagedAssetsActionTypes {
    LoadRecentlyDamagedAssetsTriggered = '[Asset Apps Recently Damaged Assets Component] Initial Data Load Triggered',
    LoadRecentlyDamagedAssetsCompleted = '[Asset Apps Recently Damaged Assets Component] Initial Data Load Completed',
    LoadRecentlyDamagedAssetsFailed = '[Asset Apps Recently Damaged Assets Component] Initial Data Load Failed',
    DamagedAssetsExceptionHandled = '[Asset Apps Recently Damaged Assets Component] HandleException',
}

export class LoadRecentlyDamagedAssetsTriggered implements Action {
    type = DamagedAssetsActionTypes.LoadRecentlyDamagedAssetsTriggered;
    recentlyDamagedAssetsList: Assets[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public damagedAssetsSearchResult: AssetInputModel) { }
}

export class LoadRecentlyDamagedAssetsCompleted implements Action {
    type = DamagedAssetsActionTypes.LoadRecentlyDamagedAssetsCompleted;
    damagedAssetsSearchResult: AssetInputModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public recentlyDamagedAssetsList: Assets[]) { }
}


export class LoadRecentlyDamagedAssetsFailed implements Action {
    type = DamagedAssetsActionTypes.LoadRecentlyDamagedAssetsFailed;
    damagedAssetsSearchResult: AssetInputModel;
    recentlyDamagedAssetsList: Assets[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class DamagedAssetsExceptionHandled implements Action {
    type = DamagedAssetsActionTypes.DamagedAssetsExceptionHandled;
    damagedAssetsSearchResult: AssetInputModel;
    recentlyDamagedAssetsList: Assets[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type DamagedAssetsActions = LoadRecentlyDamagedAssetsTriggered
    | LoadRecentlyDamagedAssetsCompleted
    | LoadRecentlyDamagedAssetsFailed
    | DamagedAssetsExceptionHandled;