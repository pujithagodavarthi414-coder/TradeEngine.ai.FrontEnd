import { Action } from '@ngrx/store';
import { AssetInputModel } from '../../models/asset-input-model';
import { Assets } from '../../models/asset';

export enum AssetsAllocatedToMeActionTypes {
    LoadAssetsAllocatedToMeTriggered = '[Asset Apps Assets Allocated To Me Component] Initial Data Load Triggered',
    LoadAssetsAllocatedToMeCompleted = '[Asset Apps Assets Allocated To Me Component] Initial Data Load Completed',
    LoadAssetsAllocatedToMeFailed = '[Asset Apps Assets Allocated To Me Component] Initial Data Load Failed',
    ExceptionHandled = '[Asset Apps Assets Allocated To Me Component] HandleException',
}

export class LoadAssetsAllocatedToMeTriggered implements Action {
    type = AssetsAllocatedToMeActionTypes.LoadAssetsAllocatedToMeTriggered;
    assetsAllocatedToMeList: Assets[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public assetsAllocatedToMeSearchResult: AssetInputModel) { }
}

export class LoadAssetsAllocatedToMeCompleted implements Action {
    type = AssetsAllocatedToMeActionTypes.LoadAssetsAllocatedToMeCompleted;
    assetsAllocatedToMeSearchResult: AssetInputModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public assetsAllocatedToMeList: Assets[]) { }
}

export class LoadAssetsAllocatedToMeFailed implements Action {
    type = AssetsAllocatedToMeActionTypes.LoadAssetsAllocatedToMeFailed;
    assetsAllocatedToMeSearchResult: AssetInputModel;
    assetsAllocatedToMeList: Assets[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = AssetsAllocatedToMeActionTypes.ExceptionHandled;
    assetsAllocatedToMeSearchResult: AssetInputModel;
    assetsAllocatedToMeList: Assets[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type AssetsAllocatedToMeActions = LoadAssetsAllocatedToMeTriggered
    | LoadAssetsAllocatedToMeCompleted
    | LoadAssetsAllocatedToMeFailed
    | ExceptionHandled;