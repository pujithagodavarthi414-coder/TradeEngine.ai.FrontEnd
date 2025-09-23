export class FileModel {
    fileId: string;
    fileName: string;
    fileSize: number;
    filePath: string;
    fileExtension: string;
    isArchived: boolean;
    timeStamp: any;
    folderId: string;
    referenceId: string;
    referenceTypeId: string;
    storeId: string;
    uploadFileId:string;
    name:string;
    size:number;
    id:string;
}

export class FileSearchCriteriaInputModel{
    userStoryId:string;
    leadId:string;
    foodOrderId:string;
    statusReportingId:string;
    employeeId:string;
    expenseId:string;
    expenseReportId:string;
}
