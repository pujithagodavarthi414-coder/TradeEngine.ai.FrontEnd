import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CandidateUpsertModel } from '../../../snovasys-recruitment-management/models/candidateUpsertModel';
import { CandidateActions, CandidateActionTypes } from '../actions/candidate.action';

export interface State extends EntityState<CandidateUpsertModel> {
    loadingCandidateList: boolean;
    creatingCandidateList: boolean;
    CandidateData: any[];
    createCandidateListErrors: string[];
    exceptionMessage: string;
    candidateDetailsById: string;
}

export const CandidateAdapter: EntityAdapter<CandidateUpsertModel> =
    createEntityAdapter<CandidateUpsertModel>({
    selectId: (candidate: CandidateUpsertModel) => candidate.candidateId
});

export const initialState: State = CandidateAdapter.getInitialState({
    loadingCandidateList: false,
    creatingCandidateList: false,
    CandidateData: null,
    createCandidateListErrors: [''],
    exceptionMessage: '',
    candidateDetailsById: ''
});

export function reducer(
    state: State = initialState,
    action: CandidateActions
): State {
    switch (action.type) {
        case CandidateActionTypes.LoadCandidateItemsTriggered:
            return { ...state, loadingCandidateList: true };
        case CandidateActionTypes.LoadCandidateItemsCompleted:
            return CandidateAdapter.addAll(action.candidate, {
                ...state,
                loadingCandidateList: false
            });
        case CandidateActionTypes.LoadCandidateItemsDetailsFailed:
            return { ...state, loadingCandidateList: false, createCandidateListErrors: action.validationMessages };
        case CandidateActionTypes.CandidateExceptionHandled:
            return { ...state, loadingCandidateList: false, exceptionMessage: action.errorMessage };
        case CandidateActionTypes.CreateCandidateItemTriggered:
            return { ...state, creatingCandidateList: true };
        case CandidateActionTypes.CreateCandidateItemCompleted:
            return { ...state, creatingCandidateList: false, candidateDetailsById: action.candidateId };
        case CandidateActionTypes.CreateCandidateItemFailed:
            return { ...state, creatingCandidateList: false, createCandidateListErrors: action.validationMessages };
        default:
            return state;
    }
}
