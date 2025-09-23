import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';


import { StoreConfigurationModel } from '../../models/store-configuration-model';
import { StoreConfigurationActions, StoreConfigurationActionTypes } from '../actions/store-configurations.actions';

export interface State extends EntityState<StoreConfigurationModel> {
    loadingStoreConfiguration: boolean;
    loadStoreConfigurationErrors: string[];
    exceptionMessage: string
}

export const storeConfigurationAdapter: EntityAdapter<
    StoreConfigurationModel
> = createEntityAdapter<StoreConfigurationModel>({
    selectId: (storeConfigurationModel: StoreConfigurationModel) => storeConfigurationModel.userId
});

export const initialState: State = storeConfigurationAdapter.getInitialState({
    loadingStoreConfiguration: false,
    loadStoreConfigurationErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: StoreConfigurationActions
): State {
    switch (action.type) {
        case StoreConfigurationActionTypes.LoadStoreConfigurationsTriggered:
            return { ...state, loadingStoreConfiguration: true };
        case StoreConfigurationActionTypes.LoadStoreConfigurationsCompleted:
            return storeConfigurationAdapter.addOne(action.storeConfigurationModel, {
                ...state,
                loadingStoreConfiguration: false
            });
        case StoreConfigurationActionTypes.LoadStoreConfigurationsFailed:
            return { ...state, loadingStoreConfiguration: false, loadStoreConfigurationErrors: action.validationMessages };
        case StoreConfigurationActionTypes.ExceptionHandled:
            return { ...state, loadingStoreConfiguration: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}