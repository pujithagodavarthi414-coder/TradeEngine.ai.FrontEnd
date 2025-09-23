import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { QuestionModel } from '../../models/question.model';

import { QuestionActions, QuestionActionTypes } from '../actions/questions.actions';
import { QuestionHistoryModel } from '../../models/question-history.model';

export interface State extends EntityState<QuestionModel> {
    loadingQuestion: boolean;
    loadingSingleQuestion: boolean;
    loadingSingleVersionQuestion: boolean;
    loadingQuestionDelete: boolean;
    loadingQuestionList: boolean;
    loadingVersionQuestionList: boolean;
    loadingQuestionHistory: boolean;
    loadingQuestionReorder: boolean;
    loadingQuestionsByFilter: boolean;
    loadingMoveQuestions: boolean;
    loadingQuestionsForConduct: boolean;
    loadingConductQuestion: boolean;
    loadingInlineConductQuestion: boolean;
    loadingConductQuestionSearch: boolean;
    loadingQuestionActions: boolean;
    loadingQuestionsByCategoryIdForConducts: boolean;
    questionList: QuestionModel[];
    filteredQuestionsForConducts: QuestionModel[];
    questionsByCategoryIdForConducts: QuestionModel[];
    actionsByQuestion: QuestionModel[];
    auditVersionQuestions: QuestionModel[];
    auditQuestionHistory: QuestionHistoryModel[];
}

export const questionAdapter: EntityAdapter<QuestionModel> = createEntityAdapter<QuestionModel>({
    selectId: (question: QuestionModel) => question.questionId
});

export const initialState: State = questionAdapter.getInitialState({
    loadingQuestion: false,
    loadingSingleQuestion: false,
    loadingSingleVersionQuestion: false,
    loadingQuestionDelete: false,
    loadingQuestionList: false,
    loadingVersionQuestionList: false,
    loadingQuestionHistory: false,
    loadingQuestionReorder: false,
    loadingQuestionsByFilter: false,
    loadingMoveQuestions: false,
    loadingQuestionsForConduct: false,
    loadingConductQuestion: false,
    loadingInlineConductQuestion: false,
    loadingConductQuestionSearch: false,
    loadingQuestionActions: false,
    loadingQuestionsByCategoryIdForConducts: false,
    questionList: null,
    filteredQuestionsForConducts: null,
    questionsByCategoryIdForConducts: null,
    actionsByQuestion: null,
    auditVersionQuestions: null,
    auditQuestionHistory: null
});

export function reducer(
    state: State = initialState,
    action: QuestionActions
): State {
    switch (action.type) {
        case QuestionActionTypes.LoadQuestionTriggered:
            return { ...state, loadingQuestion: true };
        case QuestionActionTypes.LoadQuestionCompleted:
            return { ...state, loadingQuestion: false };
        case QuestionActionTypes.LoadActionsByQuestionTriggered:
            return { ...state, loadingQuestionActions: true };
        case QuestionActionTypes.LoadActionsByQuestionCompleted:
            return { ...state, loadingQuestionActions: false, actionsByQuestion: action.searchQuestions };
        case QuestionActionTypes.LoadConductQuestionTriggered:
            return { ...state, loadingConductQuestion: true };
        case QuestionActionTypes.LoadConductQuestionCompleted:
            return { ...state, loadingConductQuestion: false };
        case QuestionActionTypes.LoadInlineConductQuestionTriggered:
            return { ...state, loadingInlineConductQuestion: true };
        case QuestionActionTypes.LoadInlineConductQuestionCompleted:
            return { ...state, loadingInlineConductQuestion: false };
        case QuestionActionTypes.LoadConductQuestionByIdTriggered:
            return { ...state, loadingConductQuestionSearch: true };
        case QuestionActionTypes.LoadConductQuestionByIdCompleted:
            return { ...state, loadingConductQuestionSearch: false };
        case QuestionActionTypes.LoadConductQuestionEditCompleted:
            return questionAdapter.updateOne(action.questionUpdates.questionUpdate, state);
        case QuestionActionTypes.LoadConductActionQuestionEditCompleted:
            return questionAdapter.updateOne(action.questionUpdates.questionUpdate, state);
        case QuestionActionTypes.LoadQuestionReorderTriggered:
            return { ...state, loadingQuestionReorder: true };
        case QuestionActionTypes.LoadQuestionReorderCompleted:
            return { ...state, loadingQuestionReorder: false };
        case QuestionActionTypes.LoadMoveQuestionsTriggered:
            return { ...state, loadingMoveQuestions: true };
        case QuestionActionTypes.LoadMoveQuestionsCompleted:
            return { ...state, loadingMoveQuestions: false };
        case QuestionActionTypes.LoadQuestionByIdTriggered:
            return { ...state, loadingQuestion: true };
        case QuestionActionTypes.LoadQuestionByIdCompleted:
            return { ...state, loadingQuestion: false };
        case QuestionActionTypes.LoadQuestionsByFilterForConductsTriggered:
            return { ...state, loadingQuestionsByFilter: true };
        case QuestionActionTypes.LoadQuestionsByFilterForConductsCompleted:
            return { ...state, loadingQuestionsByFilter: false, filteredQuestionsForConducts: action.searchQuestions };
        case QuestionActionTypes.LoadQuestionsByCategoryIdForConductsTriggered:
            return { ...state, loadingQuestionsByCategoryIdForConducts: true };
        case QuestionActionTypes.LoadQuestionsByCategoryIdForConductsCompleted:
            return { ...state, loadingQuestionsByCategoryIdForConducts: false, questionsByCategoryIdForConducts: action.searchQuestions };
        case QuestionActionTypes.LoadQuestionHistoryTriggered:
            return { ...state, loadingQuestionHistory: true };
        case QuestionActionTypes.LoadQuestionHistoryCompleted:
            return { ...state, loadingQuestionHistory: false, auditQuestionHistory: action.questionHistory };
        case QuestionActionTypes.LoadSingleQuestionByIdTriggered:
            return { ...state, loadingSingleQuestion: true };
        case QuestionActionTypes.LoadSingleQuestionByIdCompleted:
            return { ...state, loadingSingleQuestion: false };
        case QuestionActionTypes.LoadSingleVersionQuestionByIdTriggered:
            return { ...state, loadingSingleVersionQuestion: true };
        case QuestionActionTypes.LoadSingleVersionQuestionByIdCompleted:
            return { ...state, loadingSingleVersionQuestion: false };
        case QuestionActionTypes.LoadQuestionDeleteCompleted:
            return questionAdapter.removeOne(action.questionId, state);
        case QuestionActionTypes.DeleteMultipleQuestions:
            return questionAdapter.removeMany(action.deleteMovedQuestions, state);
        case QuestionActionTypes.LoadQuestionListTriggered:
            return { ...state, loadingQuestionList: true };
        case QuestionActionTypes.LoadQuestionListCompleted:
            return questionAdapter.addAll(action.searchQuestions, {
                ...state,
                loadingQuestionList: false
            });
        case QuestionActionTypes.LoadVersionQuestionListTriggered:
            return { ...state, loadingVersionQuestionList: true };
        case QuestionActionTypes.LoadVersionQuestionListCompleted:
            return { ...state, loadingVersionQuestionList: false, auditVersionQuestions: action.searchQuestions };
        case QuestionActionTypes.LoadQuestionsForConductsTriggered:
            return { ...state, loadingQuestionsForConduct: true };
        case QuestionActionTypes.LoadQuestionsForConductsCompleted:
            return questionAdapter.addAll(action.searchQuestions, {
                ...state,
                loadingQuestionsForConduct: false
            });
        case QuestionActionTypes.RefreshQuestionsList:
            return questionAdapter.upsertOne(action.question, state);
        case QuestionActionTypes.QuestionEditCompletedWithInPlaceUpdate:
            return questionAdapter.updateOne(action.questionUpdates.questionUpdate, state);
        case QuestionActionTypes.QuestionFailed:
            return { ...state, loadingQuestion: false, loadingQuestionList: false, loadingSingleQuestion: false, loadingQuestionHistory: false, loadingQuestionReorder: false, loadingQuestionsByFilter: false, loadingQuestionsByCategoryIdForConducts: false, loadingMoveQuestions: false, loadingQuestionsForConduct: false, loadingConductQuestion: false, loadingInlineConductQuestion: false, loadingConductQuestionSearch: false, loadingQuestionActions: false };
        case QuestionActionTypes.QuestionException:
            return { ...state, loadingQuestion: false, loadingQuestionList: false, loadingSingleQuestion: false, loadingQuestionHistory: false, loadingQuestionReorder: false, loadingQuestionsByFilter: false, loadingQuestionsByCategoryIdForConducts: false, loadingMoveQuestions: false, loadingQuestionsForConduct: false, loadingConductQuestion: false, loadingInlineConductQuestion: false, loadingConductQuestionSearch: false, loadingQuestionActions: false };
        default:
            return state;
    }
}