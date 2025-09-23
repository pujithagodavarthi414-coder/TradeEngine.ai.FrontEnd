import { Action } from "@ngrx/store";
import { FileResultModel } from '../../models/file-result-model';

export enum FileUploadActionTypes {
  FileUploadActionTriggered = "[Feedback management FileUpload Component] File Upload Action Triggered",
  FileUploadActionCompleted = "[Feedback management FileUpload Component] File Upload Action Completed",
  FileUploadActionFailed = "[Feedback management FileUpload Component] File Upload Action Failed",
  ExceptionHandled = "[Feedback management FileUpload Component] File Upload Exception",
  GetReferenceIdOfFile = "[Feedback management FileUpload Component] Get ReferenceId of File",
}

export class FileUploadActionTriggered implements Action {
  type = FileUploadActionTypes.FileUploadActionTriggered;
  fileResult: FileResultModel[];
  validationMessages: any[];
  errorMessage: string;
  referenceId: string;
  constructor(public fileModel: FormData, public moduleTypeId: number) { }
}

export class FileUploadActionCompleted implements Action {
  type = FileUploadActionTypes.FileUploadActionCompleted;
  fileModel: FormData;
  moduleTypeId: number;
  validationMessages: any[];
  errorMessage: string;
  referenceId: string;
  constructor(public fileResult: FileResultModel[]) { }
}

export class FileUploadActionFailed implements Action {
  type = FileUploadActionTypes.FileUploadActionFailed;
  fileModel: FormData;
  moduleTypeId: number;
  fileResult: FileResultModel[];
  errorMessage: string;
  referenceId: string;
  constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
  type = FileUploadActionTypes.ExceptionHandled;
  fileModel: FormData;
  moduleTypeId: number;
  fileResult: FileResultModel[];
  validationMessages: any[];
  referenceId: string;
  constructor(public errorMessage: string) { }
}

export class GetReferenceIdOfFile implements Action {
  type = FileUploadActionTypes.GetReferenceIdOfFile;
  fileModel: FormData;
  moduleTypeId: number;
  fileResult: FileResultModel[];
  validationMessages: any[];
  errorMessage: string;
  constructor(public referenceId: string) { }
}

export type FileUploadActions =
  | FileUploadActionTriggered
  | FileUploadActionCompleted
  | FileUploadActionFailed
  | ExceptionHandled
  | GetReferenceIdOfFile;