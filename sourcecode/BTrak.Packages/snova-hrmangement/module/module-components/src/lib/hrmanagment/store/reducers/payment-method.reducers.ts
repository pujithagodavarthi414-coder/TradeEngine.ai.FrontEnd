import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { PaymentMethodListActions, PaymentMethodListActionTypes } from "../actions/payment-method.actions";
import { PaymentMethodModel } from "../../models/payment-method-model";

export interface State extends EntityState<PaymentMethodModel> {
    loadingPaymentMethodList: boolean;
    getLoadPaymentMethodErrors: string[],
    exceptionMessage: string;
    
}

export const PaymentMethodAdapter: EntityAdapter<
    PaymentMethodModel
> = createEntityAdapter<PaymentMethodModel>({
    selectId: (PaymentMethod: PaymentMethodModel) => PaymentMethod.paymentMethodId
});

export const initialState: State = PaymentMethodAdapter.getInitialState({
    loadingPaymentMethodList: false,
    exceptionMessage: '',
    getLoadPaymentMethodErrors: [''],
});

export function reducer(
    state: State = initialState,
    action: PaymentMethodListActions
): State {
    switch (action.type) {
        case PaymentMethodListActionTypes.LoadPaymentMethodTriggered:
            return { ...state, loadingPaymentMethodList: true };
        case PaymentMethodListActionTypes.LoadPaymentMethodCompleted:
            return PaymentMethodAdapter.addAll(action.paymentMethodList, {
                ...state,
                loadingPaymentMethodList: false
            });
        case PaymentMethodListActionTypes.LoadPaymentMethodFailed:
            return { ...state, loadingPaymentMethodList: false, getLoadPaymentMethodErrors: action.validationMessages };
        case PaymentMethodListActionTypes.ExceptionHandled:
            return { ...state, loadingPaymentMethodList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}