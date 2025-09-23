
export class UpsertFileModel {
    filesList: FileModel[];
    folderId: string;
    storeId: string;
    referenceId: string;
    referenceTypeId: string;
    referenceTypeName: string;
    fileType: number;
    createdDateTime: Date;
    createdByUserId: string;
    isDefault: boolean;
    isFromFeedback: boolean;
    isToBeReviewed: boolean;
}

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
}
