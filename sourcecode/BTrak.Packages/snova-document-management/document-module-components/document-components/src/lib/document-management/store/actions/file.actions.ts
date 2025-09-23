import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { FileInputModel } from '../../models/file-input-model';
import { UpsertFileModel } from '../../models/upsert-file-model';
import { DeleteFileInputModel } from '../../models/delete-file-input-model';
import { SearchFileModel } from '../../models/search-file-model';

export enum FileActionTypes {
    LoadFilesTriggered = '[Documents File Component] Initial Data Load Triggered',
    LoadFilesCompleted = '[Documents File Component] Initial Data Load Completed',
    LoadFilesFailed = '[Documents File Component] Initial Data Load Failed',
    CreateFileTriggered = '[Documents File Component] Create File Triggered',
    CreateFileCompleted = '[Documents File Component] Create File Completed',
    DeleteFileTriggered = '[Documents File Component] Delete File Triggered',
    DeleteFileCompleted = '[Documents File Component] Delete File Completed',
    CreateFileFailed = '[Documents File Component] Create File Failed',
    GetFileByIdTriggered = '[Documents File Component] Get File By Id Triggered',
    GetFileByIdCompleted = '[Documents File Component] Get File By Id Completed',
    UpdateFileById = '[Documents File Component] Update File By Id',
    RefreshFileList = '[Documents File Component] Refresh File List',
    RefreshMultipleFilesList = '[Documents File Component] Refresh Multiple Files List',
    FileDispatchActionStopped = '[Documents File Component] File Dispatch Action Stopped',
    FileExceptionHandled = '[Documents sFile Component] Handle Exception',
}

export class LoadFilesTriggered implements Action {
    type = FileActionTypes.LoadFilesTriggered;
    filesList: FileInputModel[];
    upsertFileDetails: UpsertFileModel;
    upsertFileId: string[];
    deleteFileInputModel: DeleteFileInputModel;
    deletedFileId: string;
    searchFileById: string[];
    fileDetailsById: FileInputModel[];;
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshFileDetails: FileInputModel;
    refreshMultipleFileDetails: FileInputModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public searchFilesModel: SearchFileModel) { }
}

export class LoadFilesCompleted implements Action {
    type = FileActionTypes.LoadFilesCompleted;
    searchFilesModel: SearchFileModel;
    upsertFileDetails: UpsertFileModel;
    upsertFileId: string[];
    deleteFileInputModel: DeleteFileInputModel;
    deletedFileId: string;
    searchFileById: string[];
    fileDetailsById: FileInputModel[];;
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshFileDetails: FileInputModel;
    refreshMultipleFileDetails: FileInputModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public filesList: FileInputModel[]) { }
}

export class LoadFilesFailed implements Action {
    type = FileActionTypes.LoadFilesFailed;
    searchFilesModel: SearchFileModel;
    filesList: FileInputModel[];
    upsertFileDetails: UpsertFileModel;
    upsertFileId: string[];
    deleteFileInputModel: DeleteFileInputModel;
    deletedFileId: string;
    searchFileById: string[];
    fileDetailsById: FileInputModel[];;
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshFileDetails: FileInputModel;
    refreshMultipleFileDetails: FileInputModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateFileTriggered implements Action {
    type = FileActionTypes.CreateFileTriggered;
    searchFilesModel: SearchFileModel;
    filesList: FileInputModel[];
    upsertFileId: string[];
    deleteFileInputModel: DeleteFileInputModel;
    deletedFileId: string;
    searchFileById: string[];
    fileDetailsById: FileInputModel[];;
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshFileDetails: FileInputModel;
    refreshMultipleFileDetails: FileInputModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public upsertFileDetails: UpsertFileModel) { }
}

export class CreateFileCompleted implements Action {
    type = FileActionTypes.CreateFileCompleted;
    searchFilesModel: SearchFileModel;
    filesList: FileInputModel[];
    upsertFileDetails: UpsertFileModel;
    deleteFileInputModel: DeleteFileInputModel;
    deletedFileId: string;
    searchFileById: string[];
    fileDetailsById: FileInputModel[];;
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshFileDetails: FileInputModel;
    refreshMultipleFileDetails: FileInputModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public upsertFileId: string[]) { }
}

export class DeleteFileTriggered implements Action {
    type = FileActionTypes.DeleteFileTriggered;
    searchFilesModel: SearchFileModel;
    filesList: FileInputModel[];
    upsertFileDetails: UpsertFileModel;
    upsertFileId: string[];
    deletedFileId: string;
    searchFileById: string[];
    fileDetailsById: FileInputModel[];;
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshFileDetails: FileInputModel;
    refreshMultipleFileDetails: FileInputModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public deleteFileInputModel: DeleteFileInputModel) { }
}

export class DeleteFileCompleted implements Action {
    type = FileActionTypes.DeleteFileCompleted;
    searchFilesModel: SearchFileModel;
    filesList: FileInputModel[];
    upsertFileDetails: UpsertFileModel;
    upsertFileId: string[];
    deleteFileInputModel: DeleteFileInputModel;
    searchFileById: string[];
    fileDetailsById: FileInputModel[];;
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshFileDetails: FileInputModel;
    refreshMultipleFileDetails: FileInputModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public deletedFileId: string) { }
}

export class CreateFileFailed implements Action {
    type = FileActionTypes.CreateFileFailed;
    searchFilesModel: SearchFileModel;
    filesList: FileInputModel[];
    upsertFileDetails: UpsertFileModel;
    upsertFileId: string[];
    deleteFileInputModel: DeleteFileInputModel;
    deletedFileId: string;
    searchFileById: string[];
    fileDetailsById: FileInputModel[];;
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshFileDetails: FileInputModel;
    refreshMultipleFileDetails: FileInputModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class GetFileByIdTriggered implements Action {
    type = FileActionTypes.GetFileByIdTriggered;
    searchFilesModel: SearchFileModel;
    filesList: FileInputModel[];
    upsertFileDetails: UpsertFileModel;
    upsertFileId: string[];
    deleteFileInputModel: DeleteFileInputModel;
    deletedFileId: string;
    fileDetailsById: FileInputModel[];;
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshFileDetails: FileInputModel;
    refreshMultipleFileDetails: FileInputModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public searchFileById: string[]) { }
}

export class GetFileByIdCompleted implements Action {
    type = FileActionTypes.GetFileByIdCompleted;
    searchFilesModel: SearchFileModel;
    filesList: FileInputModel[];
    upsertFileDetails: UpsertFileModel;
    upsertFileId: string[];
    deleteFileInputModel: DeleteFileInputModel;
    deletedFileId: string;
    searchFileById: string[];
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshFileDetails: FileInputModel;
    refreshMultipleFileDetails: FileInputModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public fileDetailsById: FileInputModel[]) { }
}

export class UpdateFileById implements Action {
    type = FileActionTypes.UpdateFileById;
    searchFilesModel: SearchFileModel;
    filesList: FileInputModel[];
    upsertFileDetails: UpsertFileModel;
    upsertFileId: string[];
    deleteFileInputModel: DeleteFileInputModel;
    deletedFileId: string;
    searchFileById: string[];
    fileDetailsById: FileInputModel[];;
    refreshFileDetails: FileInputModel;
    refreshMultipleFileDetails: FileInputModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> }) { }
}

export class RefreshFileList implements Action {
    type = FileActionTypes.RefreshFileList;
    searchFilesModel: SearchFileModel;
    filesList: FileInputModel[];
    upsertFileDetails: UpsertFileModel;
    upsertFileId: string[];
    deleteFileInputModel: DeleteFileInputModel;
    deletedFileId: string;
    searchFileById: string[];
    fileDetailsById: FileInputModel[];;
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshMultipleFileDetails: FileInputModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public refreshFileDetails: FileInputModel) { }
}

export class RefreshMultipleFilesList implements Action {
    type = FileActionTypes.RefreshMultipleFilesList;
    searchFilesModel: SearchFileModel;
    filesList: FileInputModel[];
    upsertFileDetails: UpsertFileModel;
    upsertFileId: string[];
    deleteFileInputModel: DeleteFileInputModel;
    deletedFileId: string;
    searchFileById: string[];
    fileDetailsById: FileInputModel[];;
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshFileDetails: FileInputModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public refreshMultipleFileDetails: FileInputModel[]) { }
}

export class FileExceptionHandled implements Action {
    type = FileActionTypes.FileExceptionHandled;
    searchFilesModel: SearchFileModel;
    filesList: FileInputModel[];
    upsertFileDetails: UpsertFileModel;
    upsertFileId: string[];
    deleteFileInputModel: DeleteFileInputModel;
    deletedFileId: string;
    searchFileById: string[];
    fileDetailsById: FileInputModel[];;
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshFileDetails: FileInputModel;
    refreshMultipleFileDetails: FileInputModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export class FileDispatchActionStopped implements Action {
    type = FileActionTypes.FileDispatchActionStopped;
    searchFilesModel: SearchFileModel;
    filesList: FileInputModel[];
    upsertFileDetails: UpsertFileModel;
    upsertFileId: string[];
    deleteFileInputModel: DeleteFileInputModel;
    deletedFileId: string;
    searchFileById: string[];
    fileDetailsById: FileInputModel[];;
    fileDetailsUpdates: { fileDetailsUpdate: Update<FileInputModel> };
    refreshFileDetails: FileInputModel;
    refreshMultipleFileDetails: FileInputModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor() { }
}

export type FileActions = LoadFilesTriggered
    | LoadFilesCompleted
    | LoadFilesFailed
    | CreateFileTriggered
    | CreateFileCompleted
    | DeleteFileTriggered
    | DeleteFileCompleted
    | CreateFileFailed
    | GetFileByIdTriggered
    | GetFileByIdCompleted
    | UpdateFileById
    | RefreshFileList
    | RefreshMultipleFilesList
    | FileExceptionHandled
    | FileDispatchActionStopped;