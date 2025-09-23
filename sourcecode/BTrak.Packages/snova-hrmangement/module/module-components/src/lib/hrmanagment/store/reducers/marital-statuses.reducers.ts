import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { MaritalStatusesActions, MaritalStatusesActionTypes } from '../actions/marital-statuses.actions';
import { MaritalStatusesModel } from '../../models/marital-statuses-model';

export interface State extends EntityState<MaritalStatusesModel> {
    loadingMaritalStatusesList: boolean;
    getLoadMaritalStatusesErrors: string[],
    exceptionMessage: string;
}

export const maritalStatusesAdapter: EntityAdapter<
    MaritalStatusesModel
> = createEntityAdapter<MaritalStatusesModel>({
    selectId: (maritalStatusesModel: MaritalStatusesModel) => maritalStatusesModel.maritalStatusId
});

export const initialState: State = maritalStatusesAdapter.getInitialState({
    loadingMaritalStatusesList: false,
    getLoadMaritalStatusesErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: MaritalStatusesActions
): State {
    switch (action.type) {
        case MaritalStatusesActionTypes.LoadMaritalStatusesTriggered:
            return { ...state, loadingMaritalStatusesList: true };
        case MaritalStatusesActionTypes.LoadMaritalStatusesCompleted:
            return maritalStatusesAdapter.addAll(action.maritalStatusesList, {
                ...state,
                loadingMaritalStatusesList: false
            });
        case MaritalStatusesActionTypes.LoadMaritalStatusesFailed:
            return { ...state, loadingMaritalStatusesList: false, getLoadMaritalStatusesErrors: action.validationMessages };
        case MaritalStatusesActionTypes.MaritalExceptionHandled:
            return { ...state, loadingMaritalStatusesList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}