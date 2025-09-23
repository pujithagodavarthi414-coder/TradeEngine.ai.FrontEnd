import { FileModel } from "./file-model";

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
    fileTypeReferenceId: string;
    description: string;
    parentFolderNames: string[];
}
