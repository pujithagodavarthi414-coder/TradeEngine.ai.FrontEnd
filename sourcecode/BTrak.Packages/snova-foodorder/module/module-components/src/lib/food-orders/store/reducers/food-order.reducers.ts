import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { FoodOrderModel } from '../../models/all-food-orders';

import { FoodOrderActionTypes, FoodOrderActions } from '../actions/food-order.actions';

export interface State extends EntityState<FoodOrderModel> {
    loadingFoodOrders: boolean;
    creatingFoodOrder: boolean;
    foodOrderId: string;
    changingFoodOrderStatus:boolean;
    changeFoodOrderErrors:string[];
    createFoodOrderErrors: string[];
    exceptionMessage: string;
}

export const foodOrderAdapter: EntityAdapter<
    FoodOrderModel
> = createEntityAdapter<FoodOrderModel>({
    selectId: (foodOrder: FoodOrderModel) => foodOrder.foodOrderId
});

export const initialState: State = foodOrderAdapter.getInitialState({
    loadingFoodOrders: false,
    creatingFoodOrder: false,
    foodOrderId: '',
    changingFoodOrderStatus:false,
    changeFoodOrderErrors:[''],
    createFoodOrderErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: FoodOrderActions
): State {
    switch (action.type) {
        case FoodOrderActionTypes.LoadFoodOrdersTriggered:
            return { ...state, loadingFoodOrders: true };
        case FoodOrderActionTypes.LoadFoodOrdersCompleted:
            return foodOrderAdapter.addAll(action.foodOrderList, {
                ...state,
                loadingFoodOrders: false
            });
        case FoodOrderActionTypes.CreateFoodOrderTriggered:
            return { ...state, creatingFoodOrder: true };
        case FoodOrderActionTypes.CreateFoodOrderCompleted:
            return { ...state, creatingFoodOrder: false, foodOrderId: action.foodOrderId };
        case FoodOrderActionTypes.CreateFoodOrderFailed:
            return { ...state, creatingFoodOrder: false, createFoodOrderErrors: action.validationMessages };
        case FoodOrderActionTypes.ChangeFoodOrderStatusTriggred:
            return { ...state, changingFoodOrderStatus: true };
        case FoodOrderActionTypes.ChangeFoodOrderStatusCompleted:
            return { ...state, changingFoodOrderStatus: false };
        case FoodOrderActionTypes.ChangeFoodOrderStatusFailed:
            return { ...state, changingFoodOrderStatus: false, changeFoodOrderErrors: action.validationMessages };
        case FoodOrderActionTypes.ExceptionHandled:
            return { ...state, creatingFoodOrder: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}