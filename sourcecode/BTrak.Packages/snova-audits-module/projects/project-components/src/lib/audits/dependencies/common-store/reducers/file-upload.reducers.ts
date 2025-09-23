import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";

import {FileResultModel} from '../../models/fileResultModel'

import { FileUploadActions, FileUploadActionTypes } from "../actions/file-upload.action";

export interface State extends EntityState<FileResultModel> {
  isFileUploading: boolean;
  File: FileResultModel[];
  fileUploadErrors: string[];
  exceptionMessage: string;
  referenceId: string,
}

export const fileUploadAdapter: EntityAdapter<
  FileResultModel
> = createEntityAdapter<FileResultModel>({
  selectId: (file: FileResultModel) => file.filePath
});

export const initialState: State = fileUploadAdapter.getInitialState({
  isFileUploading: false,
  File: null,
  fileUploadErrors: [''],
  exceptionMessage: '',
  referenceId: null,
});

export function reducer(state: State = initialState, action: FileUploadActions): State {
  switch (action.type) {
    case FileUploadActionTypes.FileUploadActionTriggered:
      return { ...state, isFileUploading: true };
    case FileUploadActionTypes.FileUploadActionCompleted:
      return fileUploadAdapter.addAll(action.fileResult, {
        ...state,
        isFileUploading: false
      })
    case FileUploadActionTypes.FileUploadActionFailed:
      return { ...state, isFileUploading: false, fileUploadErrors: action.validationMessages };
    case FileUploadActionTypes.ExceptionHandled:
      return { ...state, isFileUploading: false, exceptionMessage: action.errorMessage };
    case FileUploadActionTypes.GetReferenceIdOfFile:
      return { ...state, referenceId: action.referenceId };
    default:
      return state;
  }
}