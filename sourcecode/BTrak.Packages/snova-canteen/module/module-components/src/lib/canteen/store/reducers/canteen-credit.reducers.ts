import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { CanteenCreditModel } from '../../models/canteen-credit-model';

import { CanteenCreditActionTypes, CanteenCreditActions } from '../actions/canteen-credit.actions';

export interface State extends EntityState<CanteenCreditModel> {
    loadingCanteenCredits: boolean;
    creatingCanteenCredit: boolean;
    createCanteenCreditErrors: string[];
    exceptionMessage: string;
}

export const canteenCreditAdapter: EntityAdapter<
    CanteenCreditModel
> = createEntityAdapter<CanteenCreditModel>({
    selectId: (canteenCredit: CanteenCreditModel) => canteenCredit.canteenCreditId
});

export const initialState: State = canteenCreditAdapter.getInitialState({
    loadingCanteenCredits: false,
    creatingCanteenCredit: false,
    createCanteenCreditErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: CanteenCreditActions
): State {
    switch (action.type) {
        case CanteenCreditActionTypes.LoadCanteenCreditsTriggered:
            return { ...state, loadingCanteenCredits: true };
        case CanteenCreditActionTypes.LoadCanteenCreditsCompleted:
            return canteenCreditAdapter.addAll(action.canteenCreditsList, {
                ...state,
                loadingCanteenCredits: false
            });
        case CanteenCreditActionTypes.LoadCanteenCreditFailed:
                return { ...state, loadingCanteenCredits: false,  createCanteenCreditErrors:action.validationMessages };
        case CanteenCreditActionTypes.CreateCanteenCreditTriggered:
            return { ...state, creatingCanteenCredit: true };
        case CanteenCreditActionTypes.CreateCanteenCreditCompleted:
            return { ...state, creatingCanteenCredit: false };
        case CanteenCreditActionTypes.CreateCanteenCreditFailed:
            return { ...state, creatingCanteenCredit: false, createCanteenCreditErrors: action.validationMessages };
        case CanteenCreditActionTypes.ExceptionHandled:
            return { ...state, creatingCanteenCredit: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}