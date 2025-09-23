import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";

import { FileInputModel } from "../../models/file-input-model";

import { FileActionTypes, FileActions } from "../actions/file.actions";

export interface State extends EntityState<FileInputModel> {
    loadingFile: boolean;
    loadFileErrors: string[];
    creatingFile: boolean;
    upsertFileId: string[];
    createFileErrors: string[];
    gettingFileById: boolean;
    fileDetailsData: FileInputModel[];
    exceptionMessage: string;
}

export const fileAdapter: EntityAdapter<
    FileInputModel
> = createEntityAdapter<FileInputModel>({
    selectId: (fileModel: FileInputModel) => fileModel.fileId.toUpperCase()
});

export const initialState: State = fileAdapter.getInitialState({
    loadingFile: false,
    loadFileErrors: [],
    creatingFile: false,
    upsertFileId: null,
    createFileErrors: [],
    gettingFileById: false,
    fileDetailsData: null,
    exceptionMessage: ""
});

export function reducer(
    state: State = initialState,
    action: FileActions
): State {
    switch (action.type) {
        case FileActionTypes.LoadFilesTriggered:
            return { ...initialState, loadingFile: true };
        case FileActionTypes.LoadFilesCompleted:
            return fileAdapter.addAll(action.filesList, {
                ...state,
                loadingFile: false
            });
        case FileActionTypes.LoadFilesFailed:
            return { ...state, loadingFile: false, loadFileErrors: action.validationMessages };
        case FileActionTypes.CreateFileTriggered:
            return { ...state, creatingFile: true };
        case FileActionTypes.CreateFileCompleted:
            return { ...state, creatingFile: false, upsertFileId: action.upsertFileId };
        case FileActionTypes.DeleteFileTriggered:
            return { ...state, creatingFile: true };
        case FileActionTypes.DeleteFileCompleted:
            return fileAdapter.removeOne(action.deletedFileId.toUpperCase(), { ...state, creatingFile: false });
        case FileActionTypes.CreateFileFailed:
            return { ...state, creatingFile: false, createFileErrors: action.validationMessages };
        case FileActionTypes.GetFileByIdTriggered:
            return { ...state, gettingFileById: true };
        case FileActionTypes.GetFileByIdCompleted:
            return { ...state, gettingFileById: false, fileDetailsData: action.fileDetailsById };
        // case FileActionTypes.UpdateFileById:
        //     return fileAdapter.updateOne(action.fileDetailsUpdates.fileDetailsUpdate, state);
        case FileActionTypes.RefreshFileList:
            return fileAdapter.upsertOne(action.refreshFileDetails, state);
        case FileActionTypes.RefreshMultipleFilesList:
            return fileAdapter.upsertMany(action.refreshMultipleFileDetails, state);
        case FileActionTypes.FileExceptionHandled:
            return { ...state, loadingFile: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}
