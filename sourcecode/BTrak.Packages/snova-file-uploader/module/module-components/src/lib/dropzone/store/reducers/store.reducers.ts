import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";


import { StoreModel } from "../../models/store-model";
import { StoreActionTypes, StoreActions } from "../actions/store.actions";

export interface State extends EntityState<StoreModel> {
    loadingStore: boolean;
    creatingStore: boolean;
    gettingStoreById: boolean;
    gettingUserStoreId: boolean;
    userStoreId: string;
}

export const StoreAdapter: EntityAdapter<
    StoreModel
> = createEntityAdapter<StoreModel>({
    selectId: (storeModel: StoreModel) => storeModel.storeId
});

export const initialState: State = StoreAdapter.getInitialState({
    loadingStore: false,
    creatingStore: false,
    gettingStoreById: false,
    gettingUserStoreId: false,
    userStoreId: '',
});

export function reducer(
    state: State = initialState,
    action: StoreActions
): State {
    switch (action.type) {
        case StoreActionTypes.LoadStoreTriggered:
            return { ...state, loadingStore: true };
        case StoreActionTypes.LoadStoreCompleted:
            return StoreAdapter.addAll(action.storesList, {
                ...state,
                loadingStore: false
            });
        case StoreActionTypes.LoadStoreFailed:
            return { ...state, loadingStore: false };
        case StoreActionTypes.CreateStoreTriggered:
            return { ...state, creatingStore: true };
        case StoreActionTypes.CreateStoreCompleted:
            return { ...state, creatingStore: false };
        case StoreActionTypes.DeleteStoreCompleted:
            return StoreAdapter.removeOne(action.deletedStoreId, { ...state, creatingStore: false });
        case StoreActionTypes.CreateStoreFailed:
            return { ...state, creatingStore: false };
        case StoreActionTypes.GetStoreByIdTriggered:
            return { ...state, gettingStoreById: true };
        case StoreActionTypes.GetStoreByIdCompleted:
            return { ...state, gettingStoreById: false };
        case StoreActionTypes.UpdateStoreById:
            return StoreAdapter.updateOne(action.storeDetailsUpdates.storeDetailsUpdate, state);
        case StoreActionTypes.RefreshStoreList:
            return StoreAdapter.upsertOne(action.refreshStoreList, state);
        case StoreActionTypes.ExceptionHandled:
            return { ...state, loadingStore: false };
        default:
            return state;
    }
}
