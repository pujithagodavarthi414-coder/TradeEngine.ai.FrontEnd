import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { FoodOrderModel } from '../../models/all-food-orders';

import { RecentIndividualFoodOrdersActionTypes, RecentIndividualFoodOrdersActions } from '../actions/recent-individual-food-orders.actions';

export interface State extends EntityState<FoodOrderModel> {
    loadingRecentIndividualFoodOrders: boolean;
    exceptionMessage: string;
}

export const recentIndividualFoodOrderAdapter: EntityAdapter<
    FoodOrderModel
> = createEntityAdapter<FoodOrderModel>({
    selectId: (recentIndividualFoodOrder: FoodOrderModel) => recentIndividualFoodOrder.foodOrderId
});

export const initialState: State = recentIndividualFoodOrderAdapter.getInitialState({
    loadingRecentIndividualFoodOrders: false,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: RecentIndividualFoodOrdersActions
): State {
    switch (action.type) {
        case RecentIndividualFoodOrdersActionTypes.LoadRecentIndividualFoodOrdersTriggered:
            return { ...state, loadingRecentIndividualFoodOrders: true };
        case RecentIndividualFoodOrdersActionTypes.LoadRecentIndividualFoodOrdersCompleted:
            return recentIndividualFoodOrderAdapter.addAll(action.recentIndividualFoodOrdersList, {
                ...state,
                loadingRecentIndividualFoodOrders: false
            });
        case RecentIndividualFoodOrdersActionTypes.ExceptionHandled:
            return { ...state, loadingRecentIndividualFoodOrders: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}