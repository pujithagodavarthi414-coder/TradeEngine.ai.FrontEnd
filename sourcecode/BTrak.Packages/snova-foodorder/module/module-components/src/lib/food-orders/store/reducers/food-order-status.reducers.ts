import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { FoodOrderModel } from '../../models/all-food-orders';
import { FoodOrderStatusActions, FoodOrderStatusActionTypes } from '../actions/food-order-status.actions';


export interface State extends EntityState<FoodOrderModel> {
    loadingFoodOrderStatus: boolean;
    foodOrderId: string;
    exceptionMessage: string;
}

export const foodOrderStatusAdapter: EntityAdapter<
    FoodOrderModel
> = createEntityAdapter<FoodOrderModel>({
    selectId: (foodOrder: FoodOrderModel) => foodOrder.foodOrderId
});

export const initialState: State = foodOrderStatusAdapter.getInitialState({
    loadingFoodOrderStatus: false,
    foodOrderId: '',
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: FoodOrderStatusActions
): State {
    switch (action.type) {
        case FoodOrderStatusActionTypes.LoadFoodOrderStatusTriggered:
            return { ...state, loadingFoodOrderStatus: true };
        case FoodOrderStatusActionTypes.LoadFoodOrderStatusCompleted:
            return foodOrderStatusAdapter.addAll(action.foodOrderList, {
                ...state,
                loadingFoodOrderStatus: false
            });
        case FoodOrderStatusActionTypes.ExceptionHandled:
            return { ...state, loadingFoodOrderStatus: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}