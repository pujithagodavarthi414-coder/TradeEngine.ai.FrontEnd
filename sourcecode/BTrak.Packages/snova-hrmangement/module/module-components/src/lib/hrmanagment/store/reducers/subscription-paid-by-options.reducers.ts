import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { SubscriptionPaidByOptionsModel } from "../../models/subscription-paid-by-options-model";

import { SubscriptionPaidByOptionsListActions, SubscriptionPaidByOptionsListActionTypes } from "../actions/subscription-paid-by-options.actions";
import { from } from "rxjs";


export interface State extends EntityState<SubscriptionPaidByOptionsModel> {
    loadingSubscriptionPaidByOptionsList: boolean;
    getLoadSubscriptionPaidByOptionsErrors: string[],
    exceptionMessage: string;
    
}

export const SubscriptionPaidByOptionsAdapter: EntityAdapter<
    SubscriptionPaidByOptionsModel
> = createEntityAdapter<SubscriptionPaidByOptionsModel>({
    selectId: (subscriptionPaidByOptions: SubscriptionPaidByOptionsModel) => subscriptionPaidByOptions.subscriptionPaidById
});

export const initialState: State = SubscriptionPaidByOptionsAdapter.getInitialState({
    loadingSubscriptionPaidByOptionsList: false,
    exceptionMessage: '',
    getLoadSubscriptionPaidByOptionsErrors: [''],
});

export function reducer(
    state: State = initialState,
    action: SubscriptionPaidByOptionsListActions
): State {
    switch (action.type) {
        case SubscriptionPaidByOptionsListActionTypes.LoadSubscriptionPaidByOptionsTriggered:
            return { ...state, loadingSubscriptionPaidByOptionsList: true };
        case SubscriptionPaidByOptionsListActionTypes.LoadSubscriptionPaidByOptionsCompleted:
            return SubscriptionPaidByOptionsAdapter.addAll(action.SubscriptionPaidByOptionsList, {
                ...state,
                loadingSubscriptionPaidByOptionsList: false
            });
        case SubscriptionPaidByOptionsListActionTypes.LoadSubscriptionPaidByOptionsFailed:
            return { ...state, loadingSubscriptionPaidByOptionsList: false, getLoadSubscriptionPaidByOptionsErrors: action.validationMessages };
        case SubscriptionPaidByOptionsListActionTypes.ExceptionHandled:
            return { ...state, loadingSubscriptionPaidByOptionsList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}