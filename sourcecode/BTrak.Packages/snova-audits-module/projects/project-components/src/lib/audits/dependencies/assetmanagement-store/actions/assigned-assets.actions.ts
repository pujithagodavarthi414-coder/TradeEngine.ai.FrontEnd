import { Action } from '@ngrx/store';

import { AssetInputModel } from '../../models/asset-input-model';
import { Assets } from '../../models/asset';

export enum AssignedAssetsActionTypes {
    LoadRecentlyAssignedAssetsTriggered = '[Recently Assigned Assets Component] Initial Data Load Triggered',
    LoadRecentlyAssignedAssetsCompleted = '[Recently Assigned Assets Component] Initial Data Load Completed',
    LoadRecentlyAssignedAssetsFailed = '[Recently Assigned Assets Component] Initial Data Load Failed',
    ExceptionHandled = '[Recently Assigned Assets Component] HandleException',
}

export class LoadRecentlyAssignedAssetsTriggered implements Action {
    type = AssignedAssetsActionTypes.LoadRecentlyAssignedAssetsTriggered;
    recentlyAssignedAssetsList: Assets[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public assignedAssetsSearchResult: AssetInputModel) { }
}

export class LoadRecentlyAssignedAssetsCompleted implements Action {
    type = AssignedAssetsActionTypes.LoadRecentlyAssignedAssetsCompleted;
    assignedAssetsSearchResult: AssetInputModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public recentlyAssignedAssetsList: Assets[]) { }
}

export class LoadRecentlyAssignedAssetsFailed implements Action {
    type = AssignedAssetsActionTypes.LoadRecentlyAssignedAssetsFailed;
    assignedAssetsSearchResult: AssetInputModel;
    recentlyAssignedAssetsList: Assets[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = AssignedAssetsActionTypes.ExceptionHandled;
    assignedAssetsSearchResult: AssetInputModel;
    recentlyAssignedAssetsList: Assets[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type AssignedAssetsActions = LoadRecentlyAssignedAssetsTriggered
    | LoadRecentlyAssignedAssetsCompleted
    | LoadRecentlyAssignedAssetsFailed
    | ExceptionHandled;