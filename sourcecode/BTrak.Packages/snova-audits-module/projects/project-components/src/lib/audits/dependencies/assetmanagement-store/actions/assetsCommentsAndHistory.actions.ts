import { Action } from "@ngrx/store";
import { AssetCommentsAndHistory } from "../../models/assets-comments-and-history.model";
import { AssetCommentsAndHistorySearch } from "../../models/assets-comments-and-history-search.model";
import { AssetComments } from "../../models/asset-comments";

export enum AssetsCommentsAndHistoryActionTypes {
    LoadAssetsCommentsAndHistoryItemsTriggered = "[AssetsCommentsAndHistory List Component] Initial Data Load Triggered",
    LoadAssetsCommentsAndHistoryItemsCompleted = "[AssetsCommentsAndHistory List Component] Initial Data Load Completed",
    LoadAssetsCommentsAndHistoryItemsFailed = "[AssetsCommentsAndHistory List Component] Initial Data Load Failed",
    AddAssetCommentTriggered= "[AssetsCommentsAndHistory List Component] Create Asset Comments Triggered",
    AddAssetCommentCompleted= "[AssetsCommentsAndHistory List Component] Create Asset Comments Completed",
    AddAssetCommentFailed= "[AssetsCommentsAndHistory List Component] Create Asset Comments Failed",
    ExceptionHandled = "[AssetsCommentsAndHistory List Component] Handle Exception"
}

export class LoadAssetsCommentsAndHistoryItemsTriggered implements Action {
    type = AssetsCommentsAndHistoryActionTypes.LoadAssetsCommentsAndHistoryItemsTriggered;
    assetsCommentsAndHistory: AssetCommentsAndHistory[];
    validationMessages: any[];
    errorMessage: string;
    assetComments: AssetComments;
    commentId: string;
    constructor(public assetsCommentsAndHistorySearchResult: AssetCommentsAndHistorySearch) { }
}

export class LoadAssetsCommentsAndHistoryItemsCompleted implements Action {
    type = AssetsCommentsAndHistoryActionTypes.LoadAssetsCommentsAndHistoryItemsCompleted;
    assetsCommentsAndHistorySearchResult: AssetCommentsAndHistorySearch;
    validationMessages: any[];
    errorMessage: string;
    assetComments: AssetComments;
    commentId: string;
    constructor(public assetsCommentsAndHistory: AssetCommentsAndHistory[]) { }
}

export class LoadAssetsCommentsAndHistoryItemsFailed implements Action {
    type = AssetsCommentsAndHistoryActionTypes.LoadAssetsCommentsAndHistoryItemsFailed;
    assetsCommentsAndHistorySearchResult: AssetCommentsAndHistorySearch;
    assetsCommentsAndHistory: AssetCommentsAndHistory[];
    errorMessage: string;
    assetComments: AssetComments;
    commentId: string;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class AddAssetCommentTriggered implements Action {
    type = AssetsCommentsAndHistoryActionTypes.AddAssetCommentTriggered;
    assetsCommentsAndHistorySearchResult: AssetCommentsAndHistorySearch;
    assetsCommentsAndHistory: AssetCommentsAndHistory[];
    errorMessage: string;
    validationMessages: any[];
    commentId: string;
    constructor(public assetComments: AssetComments) { }
}

export class AddAssetCommentCompleted implements Action {
    type = AssetsCommentsAndHistoryActionTypes.AddAssetCommentCompleted;
    assetsCommentsAndHistorySearchResult: AssetCommentsAndHistorySearch;
    assetsCommentsAndHistory: AssetCommentsAndHistory[];
    errorMessage: string;
    assetComments: AssetComments;
    validationMessages: any[];
    constructor(public commentId: string) { }
}

export class AddAssetCommentFailed implements Action {
    type = AssetsCommentsAndHistoryActionTypes.AddAssetCommentFailed;
    assetsCommentsAndHistorySearchResult: AssetCommentsAndHistorySearch;
    assetsCommentsAndHistory: AssetCommentsAndHistory[];
    errorMessage: string;
    assetComments: AssetComments;
    commentId: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = AssetsCommentsAndHistoryActionTypes.ExceptionHandled;
    assetsCommentsAndHistorySearchResult: AssetCommentsAndHistorySearch;
    assetsCommentsAndHistory: AssetCommentsAndHistory[];
    validationMessages: any[];
    assetComments: AssetComments;
    commentId: string;
    constructor(public errorMessage: string) { }
}

export type AssetsCommentsAndHistoryActions = LoadAssetsCommentsAndHistoryItemsTriggered
    | LoadAssetsCommentsAndHistoryItemsCompleted
    | LoadAssetsCommentsAndHistoryItemsFailed
    | AddAssetCommentTriggered
    | AddAssetCommentCompleted
    | AddAssetCommentFailed
    | ExceptionHandled