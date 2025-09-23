export class QuestionHistoryModel {
    questionId: string;
    auditId: string;
    conductId: string;
    projectId: string;
    auditName: string;
    conductName: string;
    field: string;
    categoryName: string;
    questionName: string;
    auditIds: string;
    userIds: string;
    branchIds: string;
    oldValue: string;
    newValue: string;
    description: string;
    createdByUserId: string;
    performedByUserName: string;
    performedByUserProfileImage: string;

    isOriginalQuestionTypeScore: boolean;
    isQuestionMandatory: boolean;

    pageSize: number;
    pageNumber: number;
    totalCount: number;

    createdDateTime: Date;
    dateFrom: Date;
    dateTo: Date;
    isActionInculde: boolean
}