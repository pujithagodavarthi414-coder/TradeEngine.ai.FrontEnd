import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { CanteenBalanceActionTypes, CanteenBalanceActions } from '../actions/canteen-balance.actions';
import { CanteenBalanceModel } from '../../models/canteen-balance.model';

export interface State extends EntityState<CanteenBalanceModel> {
    loadingCanteenBalance: boolean;
    canteenBalanceErrors: string[];
    exceptionMessage: string;
}

export const canteenBalanceAdapter: EntityAdapter<
    CanteenBalanceModel
> = createEntityAdapter<CanteenBalanceModel>({
    selectId: (canteenBalance: CanteenBalanceModel) => canteenBalance.userId
});

export const initialState: State = canteenBalanceAdapter.getInitialState({
    loadingCanteenBalance: false,
    canteenBalanceErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: CanteenBalanceActions
): State {
    switch (action.type) {
        case CanteenBalanceActionTypes.LoadCanteenBalanceTriggered:
            return { ...state, loadingCanteenBalance: true };
        case CanteenBalanceActionTypes.LoadCanteenBalanceCompleted:
            return canteenBalanceAdapter.addAll(action.canteenBalanceList, {
                ...state,
                loadingCanteenBalance: false
            });
        case CanteenBalanceActionTypes.LoadCanteenBalanceDetailsFailed:
            return { ...state, loadingCanteenBalance: false, canteenBalanceErrors: action.validationMessages };
        case CanteenBalanceActionTypes.ExceptionHandled:
            return { ...state, loadingCanteenBalance: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}
