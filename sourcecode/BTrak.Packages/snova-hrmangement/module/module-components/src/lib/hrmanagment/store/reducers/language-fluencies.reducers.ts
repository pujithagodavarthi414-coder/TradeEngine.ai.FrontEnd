import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';


import { LanguageFluencyActionTypes, LanguageFluencyActions } from '../actions/language-fluencies.actions';
import { LanguageFluenciesModel } from '../../models/language-fluencies-model';

export interface State extends EntityState<LanguageFluenciesModel> {
    loadingLanguageFluenciesList: boolean;
    getLoadLanguageFluenciesErrors: string[],
    exceptionMessage: string;
}

export const languageFluencyAdapter: EntityAdapter<
    LanguageFluenciesModel
> = createEntityAdapter<LanguageFluenciesModel>({
    selectId: (languageFluenciesModel: LanguageFluenciesModel) => languageFluenciesModel.languageFluencyId
});

export const initialState: State = languageFluencyAdapter.getInitialState({
    loadingLanguageFluenciesList: false,
    getLoadLanguageFluenciesErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: LanguageFluencyActions
): State {
    switch (action.type) {
        case LanguageFluencyActionTypes.LoadLanguageFluencyTriggered:
            return { ...state, loadingLanguageFluenciesList: true };
        case LanguageFluencyActionTypes.LoadLanguageFluencyCompleted:
            return languageFluencyAdapter.addAll(action.languageFluencyList, {
                ...state,
                loadingLanguageFluenciesList: false
            });
        case LanguageFluencyActionTypes.LoadLanguageFluencyFailed:
            return { ...state, loadingLanguageFluenciesList: false, getLoadLanguageFluenciesErrors: action.validationMessages };
        case LanguageFluencyActionTypes.ExceptionHandled:
            return { ...state, loadingLanguageFluenciesList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}