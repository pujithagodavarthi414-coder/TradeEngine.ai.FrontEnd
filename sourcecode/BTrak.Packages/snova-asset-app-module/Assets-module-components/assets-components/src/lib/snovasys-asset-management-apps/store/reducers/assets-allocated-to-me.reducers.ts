import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Assets } from '../../models/asset';

import { AssetsAllocatedToMeActionTypes, AssetsAllocatedToMeActions } from '../actions/assets-assigned-to-me.actions';

export interface State extends EntityState<Assets> {
    loadingAssetsAllocatedToMe: boolean;
    exceptionMessage: string;
}

export const assetsAllocatedToMeAdapter: EntityAdapter<
    Assets
> = createEntityAdapter<Assets>({
    selectId: (assetsAllocatedToMe: Assets) => assetsAllocatedToMe.assetId
});

export const initialState: State = assetsAllocatedToMeAdapter.getInitialState({
    loadingAssetsAllocatedToMe: false,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: AssetsAllocatedToMeActions
): State {
    switch (action.type) {
        case AssetsAllocatedToMeActionTypes.LoadAssetsAllocatedToMeTriggered:
            return { ...state, loadingAssetsAllocatedToMe: true };
        case AssetsAllocatedToMeActionTypes.LoadAssetsAllocatedToMeCompleted:
            return assetsAllocatedToMeAdapter.addAll(action.assetsAllocatedToMeList, {
                ...state, loadingAssetsAllocatedToMe: false
            });
        case AssetsAllocatedToMeActionTypes.LoadAssetsAllocatedToMeFailed:
            return { ...state, loadingAssetsAllocatedToMe: false };
        case AssetsAllocatedToMeActionTypes.ExceptionHandled:
            return { ...state, loadingAssetsAllocatedToMe: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}