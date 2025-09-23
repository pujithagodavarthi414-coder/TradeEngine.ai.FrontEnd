import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { QuestionModel } from '../../models/question.model';
import { QuestionHistoryModel } from '../../models/question-history.model';
import { QuestionsShiftModel } from '../../models/questions-shift.model';
import { UserStory } from '../../dependencies/models/userStory';

export enum QuestionActionTypes {
    LoadQuestionTriggered = '[SnovaAuditsModule Question Component] Initial Question Load Triggered',
    LoadQuestionCompleted = '[SnovaAuditsModule Question Component] Initial Question Load Completed',
    LoadConductActionTriggered = '[SnovaAuditsModule Question Component] Initial Load Conduct Action Triggered',
    LoadConductActionCompleted = '[SnovaAuditsModule Question Component] Initial Load Conduct Action Completed',
    LoadActionsByQuestionTriggered = '[SnovaAuditsModule Question Component] Initial Load Actions By Question Triggered',
    LoadActionsByQuestionCompleted = '[SnovaAuditsModule Question Component] Initial Load Actions By Question Completed',
    LoadConductQuestionTriggered = '[SnovaAuditsModule Question Component] Initial Question Conduct Load Triggered',
    LoadConductQuestionCompleted = '[SnovaAuditsModule Question Component] Initial Question Conduct Load Completed',
    LoadInlineConductQuestionTriggered = '[SnovaAuditsModule Question Component] Initial Inline Question Conduct Load Triggered',
    LoadInlineConductQuestionCompleted = '[SnovaAuditsModule Question Component] Initial Inline Question Conduct Load Completed',
    LoadConductQuestionByIdTriggered = '[SnovaAuditsModule Question Component] Initial Question Conduct By Id Load Triggered',
    LoadConductQuestionByIdCompleted = '[SnovaAuditsModule Question Component] Initial Question Conduct By Id Load Completed',
    LoadConductQuestionEditCompleted = '[SnovaAuditsModule Question Component] Initial Question Conduct By Id Edit Load Completed',
    LoadConductActionQuestionByIdTriggered = '[SnovaAuditsModule Question Component] Initial Question Action Conduct By Id Load Triggered',
    LoadConductActionQuestionByIdCompleted = '[SnovaAuditsModule Question Component] Initial Question Action Conduct By Id Load Completed',
    LoadConductActionQuestionEditCompleted = '[SnovaAuditsModule Question Component] Initial Question Action Conduct By Id Edit Load Completed',
    LoadMoveQuestionsTriggered = '[SnovaAuditsModule Question Component] Initial Questions Move Load Triggered',
    LoadMoveQuestionsCompleted = '[SnovaAuditsModule Question Component] Initial Questions Move Load Completed',
    DeleteMultipleQuestions = '[SnovaAuditsModule Question Component] Initial Questions Move Multiple Load Completed',
    LoadQuestionsByCategoryIdForConductsTriggered = '[SnovaAuditsModule Question Component] Initial Questions By Category For Conducts Load Triggered',
    LoadQuestionsByCategoryIdForConductsCompleted = '[SnovaAuditsModule Question Component] Initial Questions By Category For Conducts Load Completed',
    LoadQuestionsForConductsTriggered = '[SnovaAuditsModule Question Component] Initial Questions For Conducts Load Triggered',
    LoadQuestionsForConductsCompleted = '[SnovaAuditsModule Question Component] Initial Questions For Conducts Load Completed',
    LoadQuestionsByFilterForConductsTriggered = '[SnovaAuditsModule Question Component] Initial Questions For Filters Load Triggered',
    LoadQuestionsByFilterForConductsCompleted = '[SnovaAuditsModule Question Component] Initial Questions For Filters Load Completed',
    LoadCopyOrMoveQuestionsTriggered = '[SnovaAuditsModule Question Component] Initial Question Copy Move Load Triggered',
    LoadCopyOrMoveQuestionsCompleted = '[SnovaAuditsModule Question Component] Initial Question Copy Move Load Completed',
    LoadQuestionReorderTriggered = '[SnovaAuditsModule Question Component] Initial Question Reorder Triggered',
    LoadQuestionReorderCompleted = '[SnovaAuditsModule Question Component] Initial Question Reorder Completed',
    LoadQuestionHistoryTriggered = '[SnovaAuditsModule Question Component] Initial Question History Load Triggered',
    LoadQuestionHistoryCompleted = '[SnovaAuditsModule Question Component] Initial Question History Load Completed',
    LoadQuestionDeleteTriggered = '[SnovaAuditsModule Question Component] Initial Question Delete Load Triggered',
    LoadQuestionDeleteCompleted = '[SnovaAuditsModule Question Component] Initial Question Delete Load Completed',
    LoadQuestionDelete = '[SnovaAuditsModule Question Component] Initial Question Delete',
    LoadQuestionByIdTriggered = '[SnovaAuditsModule Question Component] Initial Question By Id Load Triggered',
    LoadQuestionByIdCompleted = '[SnovaAuditsModule Question Component] Initial Question By Id Load Completed',
    LoadQuestionViewTriggered = '[SnovaAuditsModule Question Component] Initial Question View Load Triggered',
    LoadQuestionViewCompleted = '[SnovaAuditsModule Question Component] Initial Question View Load Completed',
    LoadConductQuestionViewTriggered = '[SnovaAuditsModule Question Component] Initial Conduct Question View Load Triggered',
    LoadConductQuestionViewCompleted = '[SnovaAuditsModule Question Component] Initial Conduct Question View Load Completed',
    LoadSingleQuestionByIdTriggered = '[SnovaAuditsModule Question Component] Initial Single Question By Id Load Triggered',
    LoadSingleQuestionByIdCompleted = '[SnovaAuditsModule Question Component] Initial Single Question By Id Load Completed',
    LoadSingleVersionQuestionByIdTriggered = '[SnovaAuditsModule Question Component] Initial Single Version Question By Id Load Triggered',
    LoadSingleVersionQuestionByIdCompleted = '[SnovaAuditsModule Question Component] Initial Single Version Question By Id Load Completed',
    RefreshQuestionsList = '[SnovaAuditsModule Question Component] Initial Question Refresh List Load Completed',
    QuestionEditCompletedWithInPlaceUpdate = '[SnovaAuditsModule Question Component] Initial Question Update Load Completed',
    LoadQuestionListTriggered = '[SnovaAuditsModule Question Component] Initial Question List Load Triggered',
    LoadQuestionListCompleted = '[SnovaAuditsModule Question Component] Initial Question List Load Completed',
    LoadVersionQuestionListTriggered = '[SnovaAuditsModule Question Component] Initial Version Question List Load Triggered',
    LoadVersionQuestionListCompleted = '[SnovaAuditsModule Question Component] Initial Version Question List Load Completed',
    QuestionFailed = '[SnovaAuditsModule Question Component] Question Load Failed',
    QuestionException = '[SnovaAuditsModule Question Component] Question Exception Handled'
}

export class LoadQuestionTriggered implements Action {
    type = QuestionActionTypes.LoadQuestionTriggered;
    questionId: string;
    deleteMovedQuestions: string[];
    actionModel: UserStory;
    actionId: string;
    questionIdList: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadQuestionCompleted implements Action {
    type = QuestionActionTypes.LoadQuestionCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public questionId: string) { }
}

export class LoadConductActionTriggered implements Action {
    type = QuestionActionTypes.LoadConductActionTriggered;
    questionId: string;
    question: QuestionModel;
    actionId: string;
    deleteMovedQuestions: string[];
    questionIdList: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public actionModel: UserStory) { }
}

export class LoadConductActionCompleted implements Action {
    type = QuestionActionTypes.LoadConductActionCompleted;
    questionId: string;
    question: QuestionModel;
    actionModel: UserStory;
    deleteMovedQuestions: string[];
    questionIdList: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public actionId: string) { }
}

export class LoadActionsByQuestionTriggered implements Action {
    type = QuestionActionTypes.LoadActionsByQuestionTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadActionsByQuestionCompleted implements Action {
    type = QuestionActionTypes.LoadActionsByQuestionCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    questionId: string;
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchQuestions: QuestionModel[]) { }
}

export class LoadConductQuestionTriggered implements Action {
    type = QuestionActionTypes.LoadConductQuestionTriggered;
    questionId: string;
    deleteMovedQuestions: string[];
    actionModel: UserStory;
    actionId: string;
    questionIdList: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadConductQuestionCompleted implements Action {
    type = QuestionActionTypes.LoadConductQuestionCompleted;
    question: QuestionModel;
    deleteMovedQuestions: string[];
    actionModel: UserStory;
    actionId: string;
    questionIdList: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public questionId: string) { }
}

export class LoadConductQuestionByIdTriggered implements Action {
    type = QuestionActionTypes.LoadConductQuestionByIdTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadConductQuestionByIdCompleted implements Action {
    type = QuestionActionTypes.LoadConductQuestionByIdCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    questionId: string;
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchQuestions: QuestionModel[]) { }
}

export class LoadConductQuestionEditCompleted implements Action {
    type = QuestionActionTypes.LoadConductQuestionEditCompleted;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    question: QuestionModel;
    searchQuestions: QuestionModel[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public questionUpdates: { questionUpdate: Update<QuestionModel> }) { }
}

export class LoadConductActionQuestionByIdTriggered implements Action {
    type = QuestionActionTypes.LoadConductActionQuestionByIdTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadConductActionQuestionByIdCompleted implements Action {
    type = QuestionActionTypes.LoadConductActionQuestionByIdCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    questionId: string;
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchQuestions: QuestionModel[]) { }
}

export class LoadConductActionQuestionEditCompleted implements Action {
    type = QuestionActionTypes.LoadConductActionQuestionEditCompleted;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    question: QuestionModel;
    searchQuestions: QuestionModel[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public questionUpdates: { questionUpdate: Update<QuestionModel> }) { }
}

export class LoadInlineConductQuestionTriggered implements Action {
    type = QuestionActionTypes.LoadInlineConductQuestionTriggered;
    questionId: string;
    deleteMovedQuestions: string[];
    actionModel: UserStory;
    actionId: string;
    questionIdList: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadInlineConductQuestionCompleted implements Action {
    type = QuestionActionTypes.LoadInlineConductQuestionCompleted;
    question: QuestionModel;
    deleteMovedQuestions: string[];
    actionModel: UserStory;
    actionId: string;
    questionIdList: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public questionId: string) { }
}

export class LoadMoveQuestionsTriggered implements Action {
    type = QuestionActionTypes.LoadMoveQuestionsTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadMoveQuestionsCompleted implements Action {
    type = QuestionActionTypes.LoadMoveQuestionsCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public questionId: string) { }
}

export class DeleteMultipleQuestions implements Action {
    type = QuestionActionTypes.DeleteMultipleQuestions;
    question: QuestionModel;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public deleteMovedQuestions: string[]) { }
}

export class LoadCopyOrMoveQuestionsTriggered implements Action {
    type = QuestionActionTypes.LoadCopyOrMoveQuestionsTriggered;
    question: QuestionModel;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public copyOrMoveQuestions: QuestionsShiftModel) { }
}

export class LoadCopyOrMoveQuestionsCompleted implements Action {
    type = QuestionActionTypes.LoadCopyOrMoveQuestionsCompleted;
    question: QuestionModel;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public copyOrMoveAuditId: string) { }
}

export class LoadQuestionsByCategoryIdForConductsTriggered implements Action {
    type = QuestionActionTypes.LoadQuestionsByCategoryIdForConductsTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadQuestionsByCategoryIdForConductsCompleted implements Action {
    type = QuestionActionTypes.LoadQuestionsByCategoryIdForConductsCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    questionId: string;
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchQuestions: QuestionModel[]) { }
}

export class LoadQuestionsForConductsTriggered implements Action {
    type = QuestionActionTypes.LoadQuestionsForConductsTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadQuestionsForConductsCompleted implements Action {
    type = QuestionActionTypes.LoadQuestionsForConductsCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    questionId: string;
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchQuestions: QuestionModel[]) { }
}

export class LoadQuestionsByFilterForConductsTriggered implements Action {
    type = QuestionActionTypes.LoadQuestionsByFilterForConductsTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadQuestionsByFilterForConductsCompleted implements Action {
    type = QuestionActionTypes.LoadQuestionsByFilterForConductsCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    questionId: string;
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchQuestions: QuestionModel[]) { }
}

export class LoadQuestionReorderTriggered implements Action {
    type = QuestionActionTypes.LoadQuestionReorderTriggered;
    question: QuestionModel;
    questionId: string;
    deleteMovedQuestions: string[];
    actionModel: UserStory;
    actionId: string;
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public questionIdList: string[]) { }
}

export class LoadQuestionReorderCompleted implements Action {
    type = QuestionActionTypes.LoadQuestionReorderCompleted;
    question: QuestionModel;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor() { }
}

export class LoadQuestionHistoryTriggered implements Action {
    type = QuestionActionTypes.LoadQuestionHistoryTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadQuestionHistoryCompleted implements Action {
    type = QuestionActionTypes.LoadQuestionHistoryCompleted;
    question: QuestionModel;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public questionHistory: QuestionHistoryModel[]) { }
}

export class LoadQuestionDeleteTriggered implements Action {
    type = QuestionActionTypes.LoadQuestionDeleteTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadQuestionDeleteCompleted implements Action {
    type = QuestionActionTypes.LoadQuestionDeleteCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public questionId: string) { }
}

export class LoadQuestionDelete implements Action {
    type = QuestionActionTypes.LoadQuestionDelete;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public questionId: string) { }
}

export class LoadQuestionViewTriggered implements Action {
    type = QuestionActionTypes.LoadQuestionViewTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadQuestionViewCompleted implements Action {
    type = QuestionActionTypes.LoadQuestionViewCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    questionId: string;
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchQuestions: QuestionModel[]) { }
}

export class LoadConductQuestionViewTriggered implements Action {
    type = QuestionActionTypes.LoadConductQuestionViewTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadConductQuestionViewCompleted implements Action {
    type = QuestionActionTypes.LoadConductQuestionViewCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    questionId: string;
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchQuestions: QuestionModel[]) { }
}

export class LoadQuestionByIdTriggered implements Action {
    type = QuestionActionTypes.LoadQuestionByIdTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadQuestionByIdCompleted implements Action {
    type = QuestionActionTypes.LoadQuestionByIdCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    questionId: string;
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchQuestions: QuestionModel[]) { }
}

export class LoadSingleQuestionByIdTriggered implements Action {
    type = QuestionActionTypes.LoadSingleQuestionByIdTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadSingleQuestionByIdCompleted implements Action {
    type = QuestionActionTypes.LoadSingleQuestionByIdCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    questionId: string;
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchQuestions: QuestionModel[]) { }
}

export class LoadSingleVersionQuestionByIdTriggered implements Action {
    type = QuestionActionTypes.LoadSingleVersionQuestionByIdTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadSingleVersionQuestionByIdCompleted implements Action {
    type = QuestionActionTypes.LoadSingleVersionQuestionByIdCompleted;
    question: QuestionModel;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    questionId: string;
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchQuestions: QuestionModel[]) { }
}

export class RefreshQuestionsList implements Action {
    type = QuestionActionTypes.RefreshQuestionsList;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class QuestionEditCompletedWithInPlaceUpdate implements Action {
    type = QuestionActionTypes.QuestionEditCompletedWithInPlaceUpdate;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    question: QuestionModel;
    searchQuestions: QuestionModel[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public questionUpdates: { questionUpdate: Update<QuestionModel> }) { }
}

export class LoadQuestionListTriggered implements Action {
    type = QuestionActionTypes.LoadQuestionListTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadQuestionListCompleted implements Action {
    type = QuestionActionTypes.LoadQuestionListCompleted;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    question: QuestionModel;
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchQuestions: QuestionModel[]) { }
}

export class LoadVersionQuestionListTriggered implements Action {
    type = QuestionActionTypes.LoadVersionQuestionListTriggered;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public question: QuestionModel) { }
}

export class LoadVersionQuestionListCompleted implements Action {
    type = QuestionActionTypes.LoadVersionQuestionListCompleted;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    question: QuestionModel;
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchQuestions: QuestionModel[]) { }
}

export class QuestionFailed implements Action {
    type = QuestionActionTypes.QuestionFailed;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    question: QuestionModel;
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    errorMessage: string;
    constructor(public responseMessages: string[]) { }
}

export class QuestionException implements Action {
    type = QuestionActionTypes.QuestionException;
    questionId: string;
    questionIdList: string[];
    actionModel: UserStory;
    actionId: string;
    deleteMovedQuestions: string[];
    copyOrMoveQuestions: QuestionsShiftModel;
    copyOrMoveAuditId: string;
    questionHistory: QuestionHistoryModel[];
    question: QuestionModel;
    searchQuestions: QuestionModel[];
    questionUpdates: { questionUpdate: Update<QuestionModel> };
    responseMessages: string[];
    constructor(public errorMessage: string) { }
}

export type QuestionActions = LoadQuestionTriggered | LoadQuestionCompleted | LoadQuestionDelete | LoadSingleQuestionByIdTriggered | LoadSingleQuestionByIdCompleted |
    LoadQuestionByIdTriggered | LoadQuestionByIdCompleted | RefreshQuestionsList | QuestionEditCompletedWithInPlaceUpdate | LoadQuestionListTriggered | LoadQuestionListCompleted |
    LoadQuestionDeleteTriggered | LoadQuestionDeleteCompleted | LoadQuestionHistoryTriggered | LoadQuestionHistoryCompleted |
    LoadQuestionViewTriggered | LoadQuestionViewCompleted | LoadQuestionReorderTriggered | LoadQuestionReorderCompleted |
    LoadCopyOrMoveQuestionsTriggered | LoadCopyOrMoveQuestionsCompleted | LoadQuestionsByCategoryIdForConductsTriggered | LoadQuestionsByCategoryIdForConductsCompleted |
    LoadQuestionsByFilterForConductsTriggered | LoadQuestionsByFilterForConductsCompleted | LoadMoveQuestionsTriggered | LoadMoveQuestionsCompleted |
    DeleteMultipleQuestions | LoadQuestionsForConductsTriggered | LoadQuestionsForConductsCompleted | LoadConductQuestionTriggered |
    LoadConductQuestionCompleted | LoadConductQuestionByIdTriggered | LoadConductQuestionByIdCompleted | LoadInlineConductQuestionTriggered |
    LoadInlineConductQuestionCompleted | LoadConductQuestionEditCompleted | LoadConductActionTriggered | LoadConductActionCompleted | 
    LoadActionsByQuestionTriggered | LoadActionsByQuestionCompleted | LoadConductActionQuestionByIdTriggered | LoadConductActionQuestionByIdCompleted | 
    LoadConductActionQuestionEditCompleted | LoadConductQuestionViewTriggered | LoadConductQuestionViewCompleted | QuestionFailed | QuestionException |
    LoadVersionQuestionListTriggered | LoadVersionQuestionListTriggered | LoadSingleVersionQuestionByIdTriggered | LoadSingleVersionQuestionByIdCompleted