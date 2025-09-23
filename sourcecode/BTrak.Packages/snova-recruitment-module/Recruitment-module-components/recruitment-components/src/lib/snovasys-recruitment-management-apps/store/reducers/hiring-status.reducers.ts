import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { HiringStatusUpsertModel } from '../../models/hiringStatusUpsertModel';
import { HiringStatusActions, HiringStatusActionTypes } from '../actions/hiring-status.action';

export interface State extends EntityState<HiringStatusUpsertModel> {
    loadingHiringList: boolean;
    creatingHiringList: boolean;
    hiringStatusData: HiringStatusUpsertModel;
    createHiringStatusListErrors: string[];
    exceptionMessage: string;
    hiringDetailsById: string;
}

export const HiringStatusAdapter: EntityAdapter<HiringStatusUpsertModel> =
    createEntityAdapter<HiringStatusUpsertModel>({
        selectId: (hiringStatus: HiringStatusUpsertModel) => hiringStatus.hiringStatusId
    });

export const initialState: State = HiringStatusAdapter.getInitialState({
    hiringStatusData: null,
    loadingHiringList: false,
    creatingHiringList: false,
    createHiringStatusListErrors: [''],
    exceptionMessage: '',
    hiringDetailsById: ''
});

export function reducer(
    state: State = initialState,
    action: HiringStatusActions
): State {
    switch (action.type) {
        case HiringStatusActionTypes.LoadHiringStatusItemsTriggered:
            return { ...state, loadingHiringList: true };
        case HiringStatusActionTypes.LoadHiringStatusItemsCompleted:
            return HiringStatusAdapter.addAll(action.hiringStatus, {
                ...state,
                loadingHiringList: false
            });
        case HiringStatusActionTypes.LoadHiringStatusItemsDetailsFailed:
            return { ...state, loadingHiringList: false, createHiringStatusListErrors: action.validationMessages };
        case HiringStatusActionTypes.HiringStatusExceptionHandled:
            return { ...state, loadingHiringList: false, exceptionMessage: action.errorMessage };
        case HiringStatusActionTypes.CreateHiringStatusItemTriggered:
            return { ...state, creatingHiringList: true };
        case HiringStatusActionTypes.CreateHiringStatusItemCompleted:
            return { ...state, creatingHiringList: false, hiringDetailsById: action.hiringId };
        case HiringStatusActionTypes.CreateHiringStatusItemFailed:
            return { ...state, creatingHiringList: false, createHiringStatusListErrors: action.validationMessages };
        default:
            return state;
    }
}
