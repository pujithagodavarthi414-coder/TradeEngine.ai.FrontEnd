import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { NationalitiesActions, NationalitiesActionTypes } from '../actions/nationalities.actions';
import { NationalityModel } from '../../models/nationality-model';

export interface State extends EntityState<NationalityModel> {
    loadingNationalitiesList: boolean;
    getLoadNationalitiesErrors: string[],
    exceptionMessage: string;
}

export const nationalitiesAdapter: EntityAdapter<
    NationalityModel
> = createEntityAdapter<NationalityModel>({
    selectId: (nationalityModel: NationalityModel) => nationalityModel.nationalityId
});

export const initialState: State = nationalitiesAdapter.getInitialState({
    loadingNationalitiesList: false,
    getLoadNationalitiesErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: NationalitiesActions
): State {
    switch (action.type) {
        case NationalitiesActionTypes.LoadNationalitiesTriggered:
            return { ...state, loadingNationalitiesList: true };
        case NationalitiesActionTypes.LoadNationalitiesCompleted:
            return nationalitiesAdapter.addAll(action.nationalitiesList, {
                ...state,
                loadingNationalitiesList: false
            });
        case NationalitiesActionTypes.LoadNationalitiesFailed:
            return { ...state, loadingNationalitiesList: false, getLoadNationalitiesErrors: action.validationMessages };
        case NationalitiesActionTypes.ExceptionHandled:
            return { ...state, loadingNationalitiesList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}