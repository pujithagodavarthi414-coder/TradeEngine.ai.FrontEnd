import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { GenderActions, GenderActionTypes } from '../actions/gender.actions';
import { GenderModel } from '../../models/gender-model';

export interface State extends EntityState<GenderModel> {
    loadingGendersList: boolean;
    getLoadGenderErrors: string[],
    exceptionMessage: string;
}

export const genderAdapter: EntityAdapter<
    GenderModel
> = createEntityAdapter<GenderModel>({
    selectId: (genderModel: GenderModel) => genderModel.genderId
});

export const initialState: State = genderAdapter.getInitialState({
    loadingGendersList: false,
    getLoadGenderErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: GenderActions
): State {
    switch (action.type) {
        case GenderActionTypes.LoadGendersTriggered:
            return { ...state, loadingGendersList: true };
        case GenderActionTypes.LoadGendersCompleted:
            return genderAdapter.addAll(action.genderList, {
                ...state,
                loadingGendersList: false
            });
        case GenderActionTypes.LoadGenderFailed:
            return { ...state, loadingGendersList: false, getLoadGenderErrors: action.validationMessages };
        case GenderActionTypes.GenderExceptionHandled:
            return { ...state, loadingGendersList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}