import { AuditTagsModel } from './audit-compliance.model';
import { ConductQuestionModel } from "./conduct-question.model";

export class AuditConduct {
    id: string;
    auditId: string;
    conductId: string;
    projectId: string;
    parentConductId: string;
    auditName: string;
    auditDescription: string;
    auditConductName: string;
    auditConductDescription: string;
    createdByUserName: string;
    updatedByUserName: string;
    createdByUserProfileImage: string;
    createdByProfileImage: string;
    searchText: string;
    sortBy: string;
    periodValue: string;
    dateTo: Date; 
    dateFrom: Date; 
    userId: string;
    statusFilter : string;
    branchId: string;
    tagId: string;
    tagName: string;
    auditRatingId: string;
    auditRatingName: string;

    isIncludeAllQuestions: any;
    selectedQuestions: ConductQuestionModel[];
    selectedCategories: string[];

    categoriesCount: number;
    questionsCount: number;
    pageSize: number;
    pageNumber: number;
    activeAuditsCount: number;
    archivedAuditsCount: number;
    auditConductConductsCount: number;
    auditConductReportsCount: number;
    conductScore: number;
    inBoundPercent: number;
    outBoundPercent: number;
    answeredCount: number;
    unAnsweredCount: number;
    validAnswersCount: number;
    inValidAnswersCount: number;

    sortDirectionAsc: boolean;
    isArchived: boolean;
    auditConductUnarchive: boolean;
    isCompleted: boolean;
    isConduct: boolean;
    isConductSubmitted: boolean;
    canConductSubmitted: boolean;
    areActionsAdded: boolean;
    areDocumentsUploaded: boolean;
    isCategoriesRequired: boolean;
    isRAG: boolean;
    isFromUnique: boolean;
    canLogTime: boolean;
    isNewConduct: any;
    isToBeDeleted: boolean;
    fromConductComponent: boolean;
    canRefreshConduct: boolean;
    haveCustomFields: boolean;

    createdDateTime: Date;
    updatedDateTime: Date;
    deadlineDate: Date;
    questionsForReport : any;
    timeStamp: any;
    responsibleUserId:any;

    estimatedTime: any;
    totalEstimatedTime: any;
    totalSpentTime: any;

    responsibleUserName:any;
    responsibleProfileImage:any;

    conductAssigneeMail: any;
    auditResponsibleUserMail: any;

    auditTagsModels: AuditTagsModel[];
    conductTagsModels: AuditTagsModel[];
    status: string;
    statusColor: string;
    children: any[];
    businessUnitIds: any[] = [];
}

export class CondutLinkEmailModel {
    toMails: string;
    conductId: string;
    auditId: string;
    conductName: string;
}