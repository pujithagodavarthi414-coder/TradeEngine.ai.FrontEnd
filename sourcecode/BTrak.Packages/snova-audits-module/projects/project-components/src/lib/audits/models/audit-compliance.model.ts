import { RecurringCronExpressionModel } from "../dependencies/models/cron-expression-model";

export class AuditCompliance {
    id: string;
    auditId: string;
    conductId: string;
    projectId: string;
    parentAuditId: string;
    auditVersionId: string;
    auditName: string;
    auditDescription: string;
    createdByUserName: string;
    createdByUserId: string;
    createdByUserProfileImage: string;
    createdByProfileImage: string;
    searchText: string;
    sortBy: string;
    tagId: string;
    tagName: string;
    periodValue: string;
    dateTo: Date; 
    dateFrom: Date; 
    userId: string;
    statusFilter : string;
    branchId: string;

    multipleAuditIds: string[];
    selectedIds: string;

    categoriesCount: number;
    auditCategoriesCount: number;
    conductsCount: number;
    questionsCount: number;
    auditQuestionsCount: number;
    pageSize: number;
    pageNumber: number;
    activeAuditsCount: number;
    archivedAuditsCount: number;
    activeAuditConductsCount: number;
    archivedAuditConductsCount: number;
    activeAuditReportsCount: number;
    archivedAuditReportsCount: number;
    activeAuditFoldersCount: number;
    archivedAuditFoldersCount: number;
    actionsCount: number;
    inBoundPercent: number;
    outBoundPercent: number;

    sortDirectionAsc: boolean;
    isArchived: boolean;
    isRAG: boolean;
    isAudit: boolean;
    canLogTime: boolean;
    auditUnarchive: boolean;
    isNewAudit: any;
    isToBeDeleted: boolean;
    fromAuditComponent: boolean;
    canRefreshAudit: boolean;
    fromClone: boolean;

    createdDateTime: Date;
    updatedDateTime: Date;

    timeStamp: any;
    folderTimeStamp: any;
    responsibleUserId: any;
    schedulingDetails: RecurringCronExpressionModel[];
    auditTagsModels: AuditTagsModel[];

    estimatedTime: any;
    totalEstimatedTime: any;
    totalSpentTime: any;
    responsibleUserName:any;
    responsibleProfileImage:any;
    enableQuestionLevelWorkFlow: boolean;
    enableWorkFlowForAudit: boolean;
    enableWorkFlowForAuditConduct: boolean;
    auditWorkFlowId: string;
    auditWorkFlowName: string;
    conductWorkFlowName: string;
    conductWorkFlowId: string;
    status: string;
    statusColor: string;
    auditDefaultWorkflowId: string;
    conductDefaultWorkflowId: string;
    questionDefaultWorkflowId: string;
    toSetDefaultWorkflows: boolean;
    isForFilter: boolean;
    children: any[];
    businessUnitIds: any[] = [];
}

export class AuditMultipleUpdates {
    id: string;
    changes: AuditCompliance;
}

export class AuditTagsModel {
    tagId: string;
    tagName: string;
}

export class AuditsExportModel {
    auditName: string;
    toMails: string;
    download: string;
    projectId : string;
    isForFilter : boolean;
}