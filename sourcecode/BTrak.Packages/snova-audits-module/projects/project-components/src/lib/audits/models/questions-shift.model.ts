export class QuestionsShiftModel {
    sourceAuditId: string;
    auditId: string;
    questionsList: any[];
    selectedCategories: any[];
    questionIds: any[];
    isCopy: boolean;
    isQuestionsOnly: boolean;
    isHierarchical: boolean;
    isQuestionsWithCategories: boolean;
    isAllParents: boolean;
    appendToCategoryId: string;
    auditCategoryId: string;
    currentCategoryId: string;
    projectId: string;
}

export class MoveQuestionsModel {
    questionIds: string[];
    auditCategoryId: string;
    isHierarchical: boolean;
}