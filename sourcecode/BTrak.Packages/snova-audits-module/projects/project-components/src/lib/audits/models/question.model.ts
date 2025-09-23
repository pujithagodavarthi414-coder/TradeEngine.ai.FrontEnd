import { DocumentModel } from "./document-model";

export class QuestionModel {
    id: string;
    auditConductQuestionId: string;
    auditVersionId: string;
    questionId: string;
    questionName: string;
    questionHint: string;
    categoryId: string;
    projectId: string;
    auditCategoryId: string;
    auditId: string;
    conductId: string;
    conductAnswerSubmittedId: string;
    masterQuestionTypeId: string;
    masterQuestionTypeName: string;
    questionTypeId: string;
    questionTypeName: string;
    questionTypeOptionId: string;
    questionTypeOptionName: string;
    answerComment: string;
    questionResult: string;
    questionScore: string;
    createdByUserName: string;
    createdByUserProfileImage: string;
    createdByProfileImage: string;
    questionOptionsXml: string;
    questionsXml: string;
    searchText: string;
    createdOn: string;
    updatedOn: string;
    sortBy: string;
    bugPriorityColor: string;
    bugPriorityName: string;
    bugPriorityDescription: string;
    bugPriorityIcon: string;
    userStoryName: string;
    statusHexValue: string;
    status: string;

    questionFilesXml: string;
    conductQuestionFilesXml: string;

    actionsCount: number;
    filesCount: number;

    questionIds: any[];

    questionOptions: QuestionOptions[];
    documents: DocumentModel[];
    isArchived: boolean;
    isFilter: boolean;
    questionResultBoolean: boolean;
    questionUnarchive: boolean;
    isHierarchical: boolean;
    isQuestionMandatory: boolean;
    isOriginalQuestionTypeScore: boolean;
    isForViewHistory: boolean;
    clearFilter: boolean;
    isQuestionAnswered: boolean;
    isAnswerValid: boolean;
    isCopy: boolean;
    questionAnswerId: boolean;
    auditAnswerId: boolean;
    disableAddAndSave: boolean;
    isFromAuditQuestion: boolean;

    createdDateTime: Date;
    updatedDateTime: Date;
    conductCreatedDateTime: Date;

    questionTypeFilter: any;
    questionResultNumeric: any;
    questionResultDate: any;
    questionResultText: any;
    timeStamp: any;

    questionOptionDate: any;
    questionOptionNumeric: any;
    questionOptionTime: any;
    questionOptionText: any;
    estimatedTime: any;
    impactId: any;
    priorityId: any;
    impactName: any;
    priorityName: any;
    auditConductAnswerId: any;
    workFlowId: string;
    roleIds: string;
    selectedRoleIds: any;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canAddAction: boolean;
    noPermission: boolean;
    selectedEmployees: string;

    questionResponsiblePersonId: string;
    questionResponsiblePersonName: string;
    questionResponsiblePersonProfileImage: string;
    enableQuestionLevelWorkFlow: boolean;
    enableQuestionLevelWorkFlowInAudit: boolean;
    questionWorkflowId: string;
}

export class QuestionOptions {
    questionId: string;
    auditConductAnswerId: string;
    questionOptionId: string;
    questionTypeOptionId: string;
    questionOptionName: string;
    questionOptionResult: any;
    questionOptionScore: any;
    questionOptionDate: any;
    questionOptionNumeric: any;
    questionOptionBoolean: any;
    questionOptionTime: any;
    questionOptionText: any;
}