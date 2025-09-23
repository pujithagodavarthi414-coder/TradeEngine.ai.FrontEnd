export class FormSubmissionModel {
    formSubmissionId: string;
    genericFormId: string;
    assignedToUserId: string;
    assignedToUserName: string;
    assignedToUserImage: string;
    assignedByUserId: string;
    assignedByUserName: string;
    assignedByUserImage: string;
    formData: string;
    formJson: string;
    formTypeName: string;
    formName: string;
    lastestModificationOn: Date;
    isArchived: boolean;
    status: string;
    createdDateTime: Date;
    CreatedByUserId: string;
    totalCount: number;
    assignedByYou: boolean;
    pageSize: number;
    pageNumber: number;
    searchText: string;
    sortBy: string;
    sortDirectionAsc: boolean;
}
