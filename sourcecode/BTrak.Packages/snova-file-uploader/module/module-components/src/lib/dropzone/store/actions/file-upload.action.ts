import { Action } from "@ngrx/store";
import { FileResultModel } from '../../models/fileResultModel';

export enum FileUploadActionTypes {
  FileUploadActionTriggered = "[DropZone FileUpload Component] File Upload Action Triggered",
  FileUploadActionCompleted = "[DropZone FileUpload Component] File Upload Action Completed",
  FileUploadActionFailed = "[DropZone FileUpload Component] File Upload Action Failed",
  FileUploadExceptionHandled = "[DropZone FileUpload Component] File Upload Exception",
  GetReferenceIdOfFile = "[DropZone FileUpload Component] Get ReferenceId of File",
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

export class FileUploadExceptionHandled implements Action {
  type = FileUploadActionTypes.FileUploadExceptionHandled;
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
  | FileUploadExceptionHandled
  | GetReferenceIdOfFile;