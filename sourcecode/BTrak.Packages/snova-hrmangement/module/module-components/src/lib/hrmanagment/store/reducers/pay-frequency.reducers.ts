import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { PayFrequencyModel } from "../../models/pay-frequency-model";

import { PayFrequencyListActions, PayFrequencyListActionTypes } from "../actions/pay-frequency.actions";

export interface State extends EntityState<PayFrequencyModel> {
    loadingPayFrequencyList: boolean;
    getLoadPayFrequencyErrors: string[],
    exceptionMessage: string;
    
}

export const PayFrequencyAdapter: EntityAdapter<
    PayFrequencyModel
> = createEntityAdapter<PayFrequencyModel>({
    selectId: (PayFrequency: PayFrequencyModel) => PayFrequency.payFrequencyId
});

export const initialState: State = PayFrequencyAdapter.getInitialState({
    loadingPayFrequencyList: false,
    exceptionMessage: '',
    getLoadPayFrequencyErrors: [''],
});

export function reducer(
    state: State = initialState,
    action: PayFrequencyListActions
): State {
    switch (action.type) {
        case PayFrequencyListActionTypes.LoadPayFrequencyTriggered:
            return { ...state, loadingPayFrequencyList: true };
        case PayFrequencyListActionTypes.LoadPayFrequencyCompleted:
            return PayFrequencyAdapter.addAll(action.payFrequencyList, {
                ...state,
                loadingPayFrequencyList: false
            });
        case PayFrequencyListActionTypes.LoadPayFrequencyFailed:
            return { ...state, loadingPayFrequencyList: false, getLoadPayFrequencyErrors: action.validationMessages };
        case PayFrequencyListActionTypes.ExceptionHandled:
            return { ...state, loadingPayFrequencyList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}