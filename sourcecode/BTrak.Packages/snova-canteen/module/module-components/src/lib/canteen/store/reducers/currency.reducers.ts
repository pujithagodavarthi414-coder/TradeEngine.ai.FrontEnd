import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Currency } from '../../models/currency';

import { CurrencyActionTypes, CurrencyActions } from '../actions/currency.actions';

export interface State extends EntityState<Currency> {
    loadingCurrency: boolean;
    exceptionMessage: string;
}

export const currencyAdapter: EntityAdapter<Currency> = createEntityAdapter<Currency>({
    selectId: (currency: Currency) => currency.currencyId
});

export const initialState: State = currencyAdapter.getInitialState({
    loadingCurrency: false,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: CurrencyActions
): State {
    switch (action.type) {
        case CurrencyActionTypes.LoadCurrencyTriggered:
            return { ...state, loadingCurrency: true };
        case CurrencyActionTypes.LoadCurrencyCompleted:
            return currencyAdapter.addAll(action.currencyList, {
                ...state, loadingCurrency: false
            });
        case CurrencyActionTypes.LoadCurrencyFailed:
            return { ...state, loadingCurrency: false };
        case CurrencyActionTypes.ExceptionHandled:
            return { ...state, loadingCurrency: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}