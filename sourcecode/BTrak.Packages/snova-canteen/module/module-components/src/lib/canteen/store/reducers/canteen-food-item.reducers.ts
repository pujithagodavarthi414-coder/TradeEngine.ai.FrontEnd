import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { FoodItemModel } from '../../models/canteen-food-item-model';

import { CanteenFoodItemActionTypes, CanteenFoodItemActions } from '../actions/canteen-food-item.actions';

export interface State extends EntityState<FoodItemModel> {
    loadingCanteenFoodItems: boolean;
    creatingCanteenFoodItem: boolean;
    createCanteenFoodItemErrors: string[];
    exceptionMessage: string;
}

export const canteenFoodItemAdapter: EntityAdapter<
    FoodItemModel
> = createEntityAdapter<FoodItemModel>({
    selectId: (foodItem: FoodItemModel) => foodItem.foodItemId
});

export const initialState: State = canteenFoodItemAdapter.getInitialState({
    loadingCanteenFoodItems: false,
    creatingCanteenFoodItem: false,
    createCanteenFoodItemErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: CanteenFoodItemActions
): State {
    switch (action.type) {
        case CanteenFoodItemActionTypes.LoadCanteenFoodItemsTriggered:
            return { ...state, loadingCanteenFoodItems: true };
        case CanteenFoodItemActionTypes.LoadCanteenFoodItemsCompleted:
            return canteenFoodItemAdapter.addAll(action.foodItemsList, {
                ...state,
                loadingCanteenFoodItems: false
            });
        case CanteenFoodItemActionTypes.LoadCanteenFoodItemsFailed:
            return { ...state, loadingCanteenFoodItems: false, createCanteenFoodItemErrors:action.validationMessages};
        case CanteenFoodItemActionTypes.CreateCanteenFoodItemTriggered:
            return { ...state, creatingCanteenFoodItem: true };
        case CanteenFoodItemActionTypes.CreateCanteenFoodItemCompleted:
            return { ...state, creatingCanteenFoodItem: false };
        case CanteenFoodItemActionTypes.CreateCanteenFoodItemFailed:
            return { ...state, creatingCanteenFoodItem: false, createCanteenFoodItemErrors: action.validationMessages };
        case CanteenFoodItemActionTypes.ExceptionHandled:
            return { ...state, creatingCanteenFoodItem: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}