export class FormHistoryModel {
    formHistoryId: string;
    genericFormSubmittedId: string;
    formName: string;
    formJson: string;
    fieldName: string;
    oldFieldValue: string;
    newFieldValue: string;
    createdBy: string;
    createdByUserId: string;
    createdDate: string;
    createdProfileImage: string;
    pageSize: number;
    pageNumber: number;
    sortBy: string;
    sortDirectionAsc: boolean;
}