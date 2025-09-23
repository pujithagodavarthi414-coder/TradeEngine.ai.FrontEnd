import { Action } from "@ngrx/store";
import { fileModel } from "../../models/fileModel";
import { FileSearchCriteriaInputModel } from '../../models/file-model';
import { ValidationModel } from '../../models/validation-messages';

export enum FileUploadActionTypesList {
  FileUploadTriggered = "[Documents fileModel]Create File Uplaod",
  FileUploadCompleted = "[Documents fileModel]Create File Uplaod Complete",
  FileUploadFailed = "[Documents fileModel]Create File Uplaod Failed",
  FileUploadExceptionHandled = "[Documents fileModel]Exception Handled",
  LoadUploadedFilesTriggered = "[Documents fileModel]Load Uploaded files triggered",
  LoadUploadedFilesCompleted = "[Documents fileModel]Load Uploaded files completed",
  LoadUploadedFilesFailed = "[Documents fileModel]Load Uploaded files Failed"
}

export class FileUploadTriggered implements Action {
  type = FileUploadActionTypesList.FileUploadTriggered;
  fileUploadId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  fileSearchCriteriaModel: FileSearchCriteriaInputModel;
  fileResult: fileModel[];
  constructor(public fileUpload: fileModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class FileUploadCompleted implements Action {
  type = FileUploadActionTypesList.FileUploadCompleted;
  fileUpload: fileModel;
  validationMessages: ValidationModel[];
  errorMessage: string;
  fileSearchCriteriaModel: FileSearchCriteriaInputModel;
  fileResult: fileModel[];
  constructor(public fileUploadId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUploadedFilesFailed implements Action {
  type = FileUploadActionTypesList.LoadUploadedFilesFailed;
  fileUpload: fileModel;
  fileUploadId: string;
  errorMessage: string;
  fileSearchCriteriaModel: FileSearchCriteriaInputModel;
  fileResult: fileModel[];
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUploadedFilesTriggered implements Action {
  type = FileUploadActionTypesList.LoadUploadedFilesTriggered;
  fileUpload: fileModel;
  fileUploadId: string;
  errorMessage: string;
  validationMessages: ValidationModel[];
  fileResult: fileModel[];
  constructor(public fileSearchCriteriaModel: FileSearchCriteriaInputModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUploadedFilesCompleted implements Action {
  type = FileUploadActionTypesList.LoadUploadedFilesCompleted;
  fileUpload: fileModel;
  fileUploadId: string;
  errorMessage: string;
  validationMessages: ValidationModel[];
  constructor(public fileResult: fileModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class FileUploadFailed implements Action {
  type = FileUploadActionTypesList.FileUploadFailed;
  fileUpload: fileModel;
  fileUploadId: string;
  errorMessage: string;
  fileSearchCriteriaModel: FileSearchCriteriaInputModel;
  fileResult: fileModel[];
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class FileUploadExceptionHandled implements Action {
  type = FileUploadActionTypesList.FileUploadExceptionHandled;
  fileUpload: fileModel;
  fileUploadId: string;
  validationMessages: ValidationModel[];
  fileSearchCriteriaModel: FileSearchCriteriaInputModel;
  fileResult: fileModel[];
  constructor(public errorMessage: string) {}
}

export type FileUploadActionsUnion =
  | FileUploadTriggered
  | FileUploadCompleted
  | FileUploadFailed
  | FileUploadExceptionHandled
  | LoadUploadedFilesTriggered
  | LoadUploadedFilesCompleted
  | LoadUploadedFilesFailed;
