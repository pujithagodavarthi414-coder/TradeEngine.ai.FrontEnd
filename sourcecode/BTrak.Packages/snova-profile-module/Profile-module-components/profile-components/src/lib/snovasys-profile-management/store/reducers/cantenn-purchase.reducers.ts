import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { CanteenPurchaseItemModel } from '../../models/canteen-purchase.model';
import { CanteenPurchaseItemActions, CanteenPurchaseItemActionTypes } from '../actions/canteen-purchage.actions';

export interface State extends EntityState<CanteenPurchaseItemModel> {
    loadingCanteenPurchaseItems: boolean;
    loadingMyCanteenPurchases:boolean;
    myCanteenPurchasesList : CanteenPurchaseItemModel[];
    creatingCanteenPurchaseItem: boolean;
    createCanteenPurchaseItemErrors: string[];
    exceptionMessage: string;
}

export const canteenPurchaseItemAdapter: EntityAdapter<
    CanteenPurchaseItemModel
> = createEntityAdapter<CanteenPurchaseItemModel>({
    selectId: (canteenPurchaseItem: CanteenPurchaseItemModel) => canteenPurchaseItem.userPurchasedCanteenFoodItemId
});

export const initialState: State = canteenPurchaseItemAdapter.getInitialState({
    loadingCanteenPurchaseItems: false,
    loadingMyCanteenPurchases:false,
    creatingCanteenPurchaseItem: false,
    myCanteenPurchasesList:null,
    createCanteenPurchaseItemErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: CanteenPurchaseItemActions
): State {
    switch (action.type) {
        case CanteenPurchaseItemActionTypes.LoadCanteenPurchaseItemsTriggered:
            return { ...state, loadingCanteenPurchaseItems: true };
        case CanteenPurchaseItemActionTypes.LoadCanteenPurchaseItemsCompleted:
            return canteenPurchaseItemAdapter.addAll(action.canteenPurchaseItemsList, {
                ...state,
                loadingCanteenPurchaseItems: false
            });
        case CanteenPurchaseItemActionTypes.LoadCanteenPurchaseItemsFailed:
            return { ...state, loadingCanteenPurchaseItems: false,createCanteenPurchaseItemErrors: action.validationMessages };
        case CanteenPurchaseItemActionTypes.LoadMyCanteenPurchasesTriggered:
            return { ...state, loadingMyCanteenPurchases: true };
        case CanteenPurchaseItemActionTypes.LoadMyCanteenPurchasesCompleted:
            return  { ...state, loadingMyCanteenPurchases: false , myCanteenPurchasesList : action.myCanteenPurchasesList};
        case CanteenPurchaseItemActionTypes.CreateCanteenPurchaseItemTriggered:
            return { ...state, creatingCanteenPurchaseItem: true };
        case CanteenPurchaseItemActionTypes.CreateCanteenPurchaseItemCompleted:
            return { ...state, creatingCanteenPurchaseItem: false };
        case CanteenPurchaseItemActionTypes.CreateCanteenPurchaseItemFailed:
            return { ...state, creatingCanteenPurchaseItem: false, createCanteenPurchaseItemErrors: action.validationMessages };
        case CanteenPurchaseItemActionTypes.CanteenExceptionHandled:
            return { ...state, creatingCanteenPurchaseItem: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}