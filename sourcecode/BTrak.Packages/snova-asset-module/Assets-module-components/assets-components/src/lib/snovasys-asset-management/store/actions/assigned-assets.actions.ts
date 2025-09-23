import { Action } from '@ngrx/store';

import { AssetInputModel } from '../../models/asset-input-model';
import { Assets } from '../../models/asset';

export enum AssignedAssetsActionTypes {
    LoadRecentlyAssignedAssetsTriggered = '[Asset Management Recently Assigned Assets Component] Initial Data Load Triggered',
    LoadRecentlyAssignedAssetsCompleted = '[Asset Management Recently Assigned Assets Component] Initial Data Load Completed',
    LoadRecentlyAssignedAssetsFailed = '[Asset Management Recently Assigned Assets Component] Initial Data Load Failed',
    AssignedAssetsExceptionHandled = '[Asset Management Recently Assigned Assets Component] HandleException',
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

export class AssignedAssetsExceptionHandled implements Action {
    type = AssignedAssetsActionTypes.AssignedAssetsExceptionHandled;
    assignedAssetsSearchResult: AssetInputModel;
    recentlyAssignedAssetsList: Assets[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type AssignedAssetsActions = LoadRecentlyAssignedAssetsTriggered
    | LoadRecentlyAssignedAssetsCompleted
    | LoadRecentlyAssignedAssetsFailed
    | AssignedAssetsExceptionHandled;