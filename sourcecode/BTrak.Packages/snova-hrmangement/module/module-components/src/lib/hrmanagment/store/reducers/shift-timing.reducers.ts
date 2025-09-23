import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { ShiftTimingListActions, ShiftTimingListActionTypes } from "../actions/shift-timing.action";
import { ShiftTimingModel } from '../../models/shift-timing-model';

export interface State extends EntityState<ShiftTimingModel> {
    loadingShiftTimingList: boolean;
    getLoadShiftTimingErrors: string[],
    exceptionMessage: string;
}

export const ShiftTimingAdapter: EntityAdapter<
    ShiftTimingModel
> = createEntityAdapter<ShiftTimingModel>({
    selectId: (shiftTiming: ShiftTimingModel) => shiftTiming.shiftTimingId
});

export const initialState: State = ShiftTimingAdapter.getInitialState({
    loadingShiftTimingList: false,
    getLoadShiftTimingErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: ShiftTimingListActions
): State {
    switch (action.type) {
        case ShiftTimingListActionTypes.LoadShiftTimingListItemsTriggered:
            return { ...state, loadingShiftTimingList: true };
        case ShiftTimingListActionTypes.LoadShiftTimingListItemsCompleted:
            return ShiftTimingAdapter.addAll(action.shiftTimingList, {
                ...state,
                loadingShiftTimingList: false
            });
        case ShiftTimingListActionTypes.LoadShiftTimingListItemsFailed:
            return { ...state, loadingShiftTimingList: false, getLoadShiftTimingErrors: action.validationMessages };
        case ShiftTimingListActionTypes.ExceptionHandled:
            return { ...state, loadingShiftTimingList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}