import { Action } from "@ngrx/store";
import { ValidationModel } from "../../models/validation-messages";
import { fileModel } from "../../models/fileModel";
import { FileSearchCriteriaInputModel } from "../../models/fileSearchCriteriaInputModel";

export enum FileUploadActionTypes {
  FileUploadTriggered = "[SnovaAudisModule fileModel]Create File Uplaod",
  FileUploadCompleted = "[SnovaAudisModule fileModel]Create File Uplaod Complete",
  FileUploadFailed = "[SnovaAudisModule fileModel]Create File Uplaod Failed",
  ExceptionHandled = "[SnovaAudisModule fileModel]Exception Handled",
  LoadUploadedFilesTriggered = "[SnovaAudisModule fileModel]Load Uploaded files triggered",
  LoadUploadedFilesCompleted = "[SnovaAudisModule fileModel]Load Uploaded files completed",
  LoadUploadedFilesFailed = "[SnovaAudisModule fileModel]Load Uploaded files Failed"
}

export class FileUploadTriggered implements Action {
  type = FileUploadActionTypes.FileUploadTriggered;
  fileUploadId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  fileSearchCriteriaModel: FileSearchCriteriaInputModel;
  fileResult: fileModel[];
  constructor(public fileUpload: fileModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class FileUploadCompleted implements Action {
  type = FileUploadActionTypes.FileUploadCompleted;
  fileUpload: fileModel;
  validationMessages: ValidationModel[];
  errorMessage: string;
  fileSearchCriteriaModel: FileSearchCriteriaInputModel;
  fileResult: fileModel[];
  constructor(public fileUploadId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUploadedFilesFailed implements Action {
  type = FileUploadActionTypes.LoadUploadedFilesFailed;
  fileUpload: fileModel;
  fileUploadId: string;
  errorMessage: string;
  fileSearchCriteriaModel: FileSearchCriteriaInputModel;
  fileResult: fileModel[];
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUploadedFilesTriggered implements Action {
  type = FileUploadActionTypes.LoadUploadedFilesTriggered;
  fileUpload: fileModel;
  fileUploadId: string;
  errorMessage: string;
  validationMessages: ValidationModel[];
  fileResult: fileModel[];
  constructor(public fileSearchCriteriaModel: FileSearchCriteriaInputModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUploadedFilesCompleted implements Action {
  type = FileUploadActionTypes.LoadUploadedFilesCompleted;
  fileUpload: fileModel;
  fileUploadId: string;
  errorMessage: string;
  validationMessages: ValidationModel[];
  constructor(public fileResult: fileModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class FileUploadFailed implements Action {
  type = FileUploadActionTypes.FileUploadFailed;
  fileUpload: fileModel;
  fileUploadId: string;
  errorMessage: string;
  fileSearchCriteriaModel: FileSearchCriteriaInputModel;
  fileResult: fileModel[];
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
  type = FileUploadActionTypes.ExceptionHandled;
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
  | ExceptionHandled
  | LoadUploadedFilesTriggered
  | LoadUploadedFilesCompleted
  | LoadUploadedFilesFailed;
