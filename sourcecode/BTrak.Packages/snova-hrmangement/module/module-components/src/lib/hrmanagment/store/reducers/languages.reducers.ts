import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';


import { LanguagesActions, LanguagesActionTypes } from '../actions/languages.actions';
import { LanguagesModel } from '../../models/languages-model';

export interface State extends EntityState<LanguagesModel> {
    loadingLanguagesList: boolean;
    getLoadLanguagesErrors: string[],
    exceptionMessage: string;
}

export const languagesAdapter: EntityAdapter<
    LanguagesModel
> = createEntityAdapter<LanguagesModel>({
    selectId: (languagesModel: LanguagesModel) => languagesModel.languageId
});

export const initialState: State = languagesAdapter.getInitialState({
    loadingLanguagesList: false,
    getLoadLanguagesErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: LanguagesActions
): State {
    switch (action.type) {
        case LanguagesActionTypes.LoadLanguagesTriggered:
            return { ...state, loadingLanguagesList: true };
        case LanguagesActionTypes.LoadLanguagesCompleted:
            return languagesAdapter.addAll(action.languagesList, {
                ...state,
                loadingLanguagesList: false
            });
        case LanguagesActionTypes.LoadLanguagesFailed:
            return { ...state, loadingLanguagesList: false, getLoadLanguagesErrors: action.validationMessages };
        case LanguagesActionTypes.ExceptionHandled:
            return { ...state, loadingLanguagesList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}