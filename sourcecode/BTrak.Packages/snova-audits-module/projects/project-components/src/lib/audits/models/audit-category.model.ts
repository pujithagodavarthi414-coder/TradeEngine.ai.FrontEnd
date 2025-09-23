import { QuestionModel } from "./question.model";

export class AuditCategory {
    auditCategoryId: string;
    auditConductCategoryId: string;
    parentAuditCategoryId: string;
    auditVersionId: string;
    auditCategoryName: string;
    auditCategoryDescription: string;
    auditId: string;
    conductId: string;
    auditName: string;
    createdByUserName: string;

    subAuditCategories: AuditCategory[];
    questions: QuestionModel[];

    questionsCount: number;
    conductQuestionsCount: number;
    conductScore: number;
    answeredCount: number;
    unAnsweredCount: number;
    validAnswersCount: number;
    inValidAnswersCount: number;

    isArchived: boolean;
    isHierarchical: boolean;
    isCategoriesRequired: boolean;
    includeConductQuestions: boolean;
    isIncludeAllQuestions: boolean;

    createdDateTime: Date;

    timeStamp: any;
    questionDashboardId: string;
}

export class ConductCategories {
    auditName: string;
    auditId: string;
    auditDescription: string;
    conductSelectedQuestions: string[];
    conductSelectedCategories: string[];
    auditCategories: AuditCategory[];
}