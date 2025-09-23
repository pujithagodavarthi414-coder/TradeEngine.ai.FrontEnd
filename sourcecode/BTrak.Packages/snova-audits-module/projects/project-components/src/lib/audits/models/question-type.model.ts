export class QuestionType {
    id: string;
    masterQuestionTypeId: string;
    masterQuestionTypeName: string;
    questionTypeId: string;
    questionTypeName: string;
    questionName: string;
    questionTypeOptionName: string;
    questionTypeDescription: string;
    createdByUserName: string;
    createdByUserProfileImage: string;
    createdByProfileImage: string;
    searchText: string;
    sortBy: string;

    questionTypeOptions: QuestionTypeOptions[];

    pageSize: number;
    pageNumber: number;

    sortDirectionAsc: boolean;
    isArchived: boolean;
    canQuestionTypeDeleted: boolean;
    isFromMasterQuestionType: boolean;

    createdDateTime: Date;
    updatedDateTime: Date;

    timeStamp: any;
}

export class QuestionTypeOptions {
    questionTypeOptionId: string;
    questionTypeOptionName: string;
    questionTypeOptionOrder: string;
    questionTypeOptionResult: any;
    questionTypeOptionScore: any;
    canQuestionTypeOptionDeleted: boolean;
}