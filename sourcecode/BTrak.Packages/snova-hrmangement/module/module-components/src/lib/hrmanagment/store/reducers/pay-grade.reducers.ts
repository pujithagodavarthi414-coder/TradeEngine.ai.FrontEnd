import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { PayGradeModel } from "../../models/pay-grade-model";
import { PayGradeListActions, PayGradeListActionTypes } from "../actions/pay-grade.actions";

export interface State extends EntityState<PayGradeModel> {
    loadingPayGradeList: boolean;
    getLoadPayGradeErrors: string[],
    exceptionMessage: string;
    
}

export const PayGradeAdapter: EntityAdapter<
    PayGradeModel
> = createEntityAdapter<PayGradeModel>({
    selectId: (PayGrade: PayGradeModel) => PayGrade.payGradeId
});

export const initialState: State = PayGradeAdapter.getInitialState({
    loadingPayGradeList: false,
    exceptionMessage: '',
    getLoadPayGradeErrors: [''],
});

export function reducer(
    state: State = initialState,
    action: PayGradeListActions
): State {
    switch (action.type) {
        case PayGradeListActionTypes.LoadPayGradeTriggered:
            return { ...state, loadingPayGradeList: true };
        case PayGradeListActionTypes.LoadPayGradeCompleted:
            return PayGradeAdapter.addAll(action.payGradeList, {
                ...state,
                loadingPayGradeList: false
            });
        case PayGradeListActionTypes.LoadPayGradeFailed:
            return { ...state, loadingPayGradeList: false, getLoadPayGradeErrors: action.validationMessages };
        case PayGradeListActionTypes.ExceptionHandled:
            return { ...state, loadingPayGradeList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}