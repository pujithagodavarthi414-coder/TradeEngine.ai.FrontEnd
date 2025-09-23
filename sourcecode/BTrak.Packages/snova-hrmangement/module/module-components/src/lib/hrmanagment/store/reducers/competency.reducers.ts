import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { CompetencyActionTypes, CompetencyActions } from '../actions/competency.actions';
import { CompetenciesModel } from '../../models/competencies-model';

export interface State extends EntityState<CompetenciesModel> {
    loadingCompetencyList: boolean;
    getLoadCompetencyErrors: string[],
    exceptionMessage: string;
}

export const competencyAdapter: EntityAdapter<
    CompetenciesModel
> = createEntityAdapter<CompetenciesModel>({
    selectId: (competenciesModel: CompetenciesModel) => competenciesModel.competencyId
});

export const initialState: State = competencyAdapter.getInitialState({
    loadingCompetencyList: false,
    getLoadCompetencyErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: CompetencyActions
): State {
    switch (action.type) {
        case CompetencyActionTypes.LoadCompetencyTriggered:
            return { ...state, loadingCompetencyList: true };
        case CompetencyActionTypes.LoadCompetencyCompleted:
            return competencyAdapter.addAll(action.competencyList, {
                ...state,
                loadingCompetencyList: false
            });
        case CompetencyActionTypes.LoadCompetencyFailed:
            return { ...state, loadingCompetencyList: false, getLoadCompetencyErrors: action.validationMessages };
        case CompetencyActionTypes.ExceptionHandled:
            return { ...state, loadingCompetencyList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}