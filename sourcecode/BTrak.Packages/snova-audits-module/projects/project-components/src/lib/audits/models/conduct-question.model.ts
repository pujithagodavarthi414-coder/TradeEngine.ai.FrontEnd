export class ConductQuestionModel {
    auditId: string;
    questionId: string;
    auditCategoryId: string;
    questionsSelected: number;
    questionsCount: number;
    categorySelected: boolean;
    categoryCheckBoxClicked: boolean;
    unselectCategory: boolean;
    selectCategory: boolean;
    multiCategories: boolean;
    unselectAllQuestions: boolean;
    categoriesAllNone: boolean;
}

export class AuditConductCategories {
    auditId: string;
    auditCategoryId: string;
    conductId: string;
    isArchived: boolean;
    isIncludeAllQuestions: any;
    includeConductQuestions: any;
    isCategoriesRequired: any;
}

export class ConductSubmitModel {
    conductAnswerSubmittedId: string;
    questionId: string;
    conductId: string;
    questionTypeOptionId: string;
    answerComment: string;
    questionTypeOptionName: string;

    timeStamp: any;
}