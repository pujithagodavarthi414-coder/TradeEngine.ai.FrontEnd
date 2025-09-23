import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { AssetsCommentsAndHistoryActions, AssetsCommentsAndHistoryActionTypes } from "../actions/assetsCommentsAndHistory.actions";
import { AssetCommentsAndHistory } from "../../models/assets-comments-and-history.model";

export interface State extends EntityState<AssetCommentsAndHistory> {
    loadingAssetsCommentsAndHistory: boolean;
    getLoadAssetsCommentsAndHistoryErrors: string[],
    exceptionMessage: string;
}

export const AssetsCommentsAndHistoryAdapter: EntityAdapter<
    AssetCommentsAndHistory
> = createEntityAdapter<AssetCommentsAndHistory>({
    selectId: (AssetsCommentsAndHistory: AssetCommentsAndHistory) => AssetsCommentsAndHistory.assetHistoryId
});

export const initialState: State = AssetsCommentsAndHistoryAdapter.getInitialState({
    loadingAssetsCommentsAndHistory: false,
    getLoadAssetsCommentsAndHistoryErrors: [""],
    exceptionMessage: ""
});

export function reducer(
    state: State = initialState,
    action: AssetsCommentsAndHistoryActions
): State {
    switch (action.type) {
        case AssetsCommentsAndHistoryActionTypes.LoadAssetsCommentsAndHistoryItemsTriggered:
            return { ...state, loadingAssetsCommentsAndHistory: true };
        case AssetsCommentsAndHistoryActionTypes.LoadAssetsCommentsAndHistoryItemsCompleted:
            return AssetsCommentsAndHistoryAdapter.addAll(action.assetsCommentsAndHistory, {
                ...state,
                loadingAssetsCommentsAndHistory: false
            });
        case AssetsCommentsAndHistoryActionTypes.LoadAssetsCommentsAndHistoryItemsFailed:
            return { ...state, loadingAssetsCommentsAndHistory: false, getLoadAssetsCommentsAndHistoryErrors: action.validationMessages };
        case AssetsCommentsAndHistoryActionTypes.ExceptionHandled:
            return { ...state, loadingAssetsCommentsAndHistory: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}
