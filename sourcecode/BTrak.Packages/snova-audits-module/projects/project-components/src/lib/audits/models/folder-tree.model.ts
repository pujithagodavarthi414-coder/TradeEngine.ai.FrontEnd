export class FolderTreeModel{
    auditId: string;
    parentAuditId: string;
    auditName: string;
    extension: string;
    folderSize: number;
    fileSize: number;
    fileId: string;
    isAudit: boolean;
    auditTagsModels: any[];
    children: any[];
}

export class FolderModel {
    auditId: string;
    auditName: string;
    parentAuditId: string;
    description: string;
    isArchived: boolean;
    timeStamp: any;

    createdDateTime: Date;
    createdByUserId: string;
    folderCount: number;
    folderSize: number;
    isDefault: boolean;
}