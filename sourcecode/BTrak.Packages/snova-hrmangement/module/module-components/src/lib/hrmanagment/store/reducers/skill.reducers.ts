import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { SkillDetailsModel } from '../../models/skill-details-model';

import { SkillActions, SkillActionTypes } from '../actions/Skill.actions';

export interface State extends EntityState<SkillDetailsModel> {
    loadingSkillList: boolean;
    getLoadSkillErrors: string[],
    exceptionMessage: string;
}

export const SkillAdapter: EntityAdapter<
    SkillDetailsModel
> = createEntityAdapter<SkillDetailsModel>({
    selectId: (SkillDetailsModel: SkillDetailsModel) => SkillDetailsModel.skillId
});

export const initialState: State = SkillAdapter.getInitialState({
    loadingSkillList: false,
    getLoadSkillErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: SkillActions
): State {
    switch (action.type) {
        case SkillActionTypes.LoadSkillTriggered:
            return { ...state, loadingSkillList: true };
        case SkillActionTypes.LoadSkillCompleted:
            return SkillAdapter.addAll(action.SkillList, {
                ...state,
                loadingSkillList: false
            });
        case SkillActionTypes.LoadSkillFailed:
            return { ...state, loadingSkillList: false, getLoadSkillErrors: action.validationMessages };
        case SkillActionTypes.ExceptionHandled:
            return { ...state, loadingSkillList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}