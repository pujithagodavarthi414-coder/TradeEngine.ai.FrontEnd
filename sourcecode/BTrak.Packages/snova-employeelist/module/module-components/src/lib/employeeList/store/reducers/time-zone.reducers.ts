import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { TimeZoneListActions, TimeZoneListActionTypes } from "../actions/time-zone.actions";
import { TimeZoneModel } from '../../models/time-zone';

export interface State extends EntityState<TimeZoneModel> {
    loadingTimeZoneList: boolean;
    getLoadTimeZoneErrors: string[],
    exceptionMessage: string;
}

export const TimeZoneAdapter: EntityAdapter<
    TimeZoneModel
> = createEntityAdapter<TimeZoneModel>({
    selectId: (TimeZone: TimeZoneModel) => TimeZone.timeZoneId
});

export const initialState: State = TimeZoneAdapter.getInitialState({
    loadingTimeZoneList: false,
    getLoadTimeZoneErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: TimeZoneListActions
): State {
    switch (action.type) {
        case TimeZoneListActionTypes.LoadTimeZoneListItemsTriggered:
            return { ...state, loadingTimeZoneList: true };
        case TimeZoneListActionTypes.LoadTimeZoneListItemsCompleted:
            return TimeZoneAdapter.addAll(action.timeZoneList, {
                ...state,
                loadingTimeZoneList: false
            });
        case TimeZoneListActionTypes.LoadTimeZoneListItemsFailed:
            return { ...state, loadingTimeZoneList: false, getLoadTimeZoneErrors: action.validationMessages };
        case TimeZoneListActionTypes.ExceptionHandled:
            return { ...state, loadingTimeZoneList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}