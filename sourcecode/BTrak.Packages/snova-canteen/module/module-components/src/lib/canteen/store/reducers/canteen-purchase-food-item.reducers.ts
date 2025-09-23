import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { FoodItemModel } from '../../models/canteen-food-item-model';
import { CanteenPurchaseFoodItemActionTypes, CanteenPurchaseFoodItemActions } from '../actions/canteen-purchase-food-item.actions';

export interface State extends EntityState<FoodItemModel> {
    loadingCanteenPurchaseFoodItems: boolean;
    exceptionMessage: string;
    loadCanteenPurchaseFoodItemErrors: string[];
}

export const canteenPurchaseFoodItemAdapter: EntityAdapter<
    FoodItemModel
> = createEntityAdapter<FoodItemModel>({
    selectId: (foodItem: FoodItemModel) => foodItem.foodItemId
});

export const initialState: State = canteenPurchaseFoodItemAdapter.getInitialState({
    loadingCanteenPurchaseFoodItems: false,
    loadCanteenPurchaseFoodItemErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: CanteenPurchaseFoodItemActions
): State {
    switch (action.type) {
        case CanteenPurchaseFoodItemActionTypes.LoadCanteenPurchaseFoodItemsTriggered:
            return { ...state, loadingCanteenPurchaseFoodItems: true };
        case CanteenPurchaseFoodItemActionTypes.LoadCanteenPurchaseFoodItemsCompleted:
            return canteenPurchaseFoodItemAdapter.addAll(action.foodPurchaseItemsList, {
                ...state,
                loadingCanteenFoodItems: false
            });
        case CanteenPurchaseFoodItemActionTypes.LoadCanteenPurchaseFoodItemFailed:
            return { ...state, loadingCanteenPurchaseFoodItems: false, loadCanteenPurchaseFoodItemErrors: action.validationMessages };
        case CanteenPurchaseFoodItemActionTypes.ExceptionHandled:
            return { ...state, loadingCanteenPurchaseFoodItems: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}