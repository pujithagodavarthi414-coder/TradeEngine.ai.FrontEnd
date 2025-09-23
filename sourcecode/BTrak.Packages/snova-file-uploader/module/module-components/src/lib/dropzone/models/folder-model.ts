
export class FolderModel {
    folderId: string;
    folderName: string;
    parentFolderId: string;
    folderReferenceId: string;
    folderReferenceTypeId: string;
    storeId: string;
    description: string;
    isArchived: boolean;
    timeStamp: any;

    createdDateTime: Date;
    createdByUserId: string;
    folderCount: number;
    folderSize: number;
    isDefault: boolean;
}
