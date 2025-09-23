import { Injectable } from "@angular/core";
import { switchMap, map, catchError } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { StoreManagementService } from "../../services/store-management.service";
import { FileActionTypes, LoadFilesTriggered, LoadFilesCompleted, LoadFilesFailed, CreateFileTriggered, CreateFileCompleted, CreateFileFailed, DeleteFileCompleted, GetFileByIdTriggered, GetFileByIdCompleted, RefreshFileList, UpdateFileById, FileExceptionHandled, RefreshMultipleFilesList, DeleteFileTriggered, FileDispatchActionStopped } from "../actions/file.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { ConstantVariables } from '../../constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';

@Injectable()
export class FileEffects {
    isNewFile: boolean;
    toastrMessage: string;
    isFromFeedback: boolean;
    @Effect()
    loadFile$: Observable<Action> = this.actions$.pipe(
        ofType<LoadFilesTriggered>(FileActionTypes.LoadFilesTriggered),
        switchMap(searchAction => {
            return this.storeManagementService
                .getFiles(searchAction.searchFilesModel)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        return new LoadFilesCompleted(response.data);
                    } else {
                        return new LoadFilesFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new FileExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    showValidationMessagesForLoadFilesFailed$: Observable<Action> = this.actions$.pipe(
        ofType<LoadFilesFailed>(FileActionTypes.LoadFilesFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    upsertFile$: Observable<Action> = this.actions$.pipe(
        ofType<CreateFileTriggered>(FileActionTypes.CreateFileTriggered),
        switchMap(fileDetailsTriggeredAction => {
            if (fileDetailsTriggeredAction.upsertFileDetails.filesList.length == 1) {
                if (fileDetailsTriggeredAction.upsertFileDetails.filesList[0].fileId === null || fileDetailsTriggeredAction.upsertFileDetails.filesList[0].fileId === '' || fileDetailsTriggeredAction.upsertFileDetails.filesList[0].fileId === undefined) {
                    this.isNewFile = true;
                    this.toastrMessage = this.translateService.instant(ConstantVariables.FileCreatedSuccessfully);
                } else if (
                    fileDetailsTriggeredAction.upsertFileDetails.filesList[0].fileId !== undefined &&
                    fileDetailsTriggeredAction.upsertFileDetails.filesList[0].isArchived === true
                ) {
                    this.isNewFile = false;
                    this.toastrMessage = this.translateService.instant(ConstantVariables.FileDeletedSuccessfully);
                } else {
                    this.isNewFile = false;
                    this.toastrMessage = this.translateService.instant(ConstantVariables.FileUpdatedSuccessfully);
                }
                if(fileDetailsTriggeredAction.upsertFileDetails.isFromFeedback) {
                    this.isFromFeedback = true;
                } else {
                    this.isFromFeedback = false;
                }
                return this.storeManagementService
                    .upsertMultipleFiles(fileDetailsTriggeredAction.upsertFileDetails)
                    .pipe(map((fileDetailsId: any) => {
                        if (fileDetailsId.success === true) {
                            if (fileDetailsTriggeredAction.upsertFileDetails.filesList[0].isArchived)
                                return new DeleteFileCompleted(fileDetailsId.data[0]);
                            else
                                return new CreateFileCompleted(fileDetailsId.data);
                        } else {
                            return new CreateFileFailed(fileDetailsId.apiResponseMessages);
                        }
                    }),
                        catchError(error => {
                            return of(new FileExceptionHandled(error));
                        })
                    );
            }
            else if (fileDetailsTriggeredAction.upsertFileDetails.filesList.length > 1) {
                this.isNewFile = true;
                this.toastrMessage = this.translateService.instant(ConstantVariables.FileCreatedSuccessfully);
                return this.storeManagementService
                    .upsertMultipleFiles(fileDetailsTriggeredAction.upsertFileDetails)
                    .pipe(map((fileDetailsId: any) => {
                        if (fileDetailsId.success === true)
                            return new CreateFileCompleted(fileDetailsId.data);
                        else
                            return new CreateFileFailed(fileDetailsId.apiResponseMessages);
                    }),
                        catchError(error => {
                            return of(new FileExceptionHandled(error));
                        })
                    );
            }
        })
    );

    @Effect()
    deleteFile$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteFileTriggered>(FileActionTypes.DeleteFileTriggered),
        switchMap(deleteFileTriggeredAction => {
            this.toastrMessage = this.translateService.instant(ConstantVariables.FileDeletedSuccessfully);
            return this.storeManagementService
                .deleteFile(deleteFileTriggeredAction.deleteFileInputModel)
                .pipe(map((result: any) => {
                    if (result.success === true) {
                        return new DeleteFileCompleted(result.data);
                    } else {
                        return new CreateFileFailed(result.apiResponseMessages);
                    }
                }),
                    catchError(error => {
                        return of(new FileExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    showValidationMessagesForCreateFilesFailed$: Observable<Action> = this.actions$.pipe(
        ofType<CreateFileFailed>(FileActionTypes.CreateFileFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    upsertFileSuccessfulAndLoadDependentDetails$: Observable<Action> = this.actions$.pipe(
        ofType<CreateFileCompleted>(FileActionTypes.CreateFileCompleted),
        switchMap(searchAction => {
            if(this.isFromFeedback) {
                return of(new FileDispatchActionStopped());
            } else {
                return of(new GetFileByIdTriggered(searchAction.upsertFileId));
            }
        })
    );

    @Effect()
    upsertFileSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<CreateFileCompleted>(FileActionTypes.CreateFileCompleted),
        pipe(map(() =>
            new SnackbarOpen({
                message: this.toastrMessage, // TODO: Change to proper toast message
                action: this.translateService.instant(ConstantVariables.success)
            })
        )
        )
    );

    @Effect()
    deleteFileSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteFileCompleted>(FileActionTypes.DeleteFileCompleted),
        pipe(map(() =>
            new SnackbarOpen({
                message: this.toastrMessage, // TODO: Change to proper toast message
                action: this.translateService.instant(ConstantVariables.success)
            })
        )
        )
    );

    @Effect()
    getFileById$: Observable<Action> = this.actions$.pipe(
        ofType<GetFileByIdTriggered>(FileActionTypes.GetFileByIdTriggered),
        switchMap(searchAction => {
            return this.storeManagementService
                .getFilesById(searchAction.searchFileById)
                .pipe(map((fileDetailsData: any) => {
                    if (fileDetailsData.success === true) {
                        return new GetFileByIdCompleted(fileDetailsData.data);
                    } else {
                        return new LoadFilesFailed(
                            fileDetailsData.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new FileExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertFileSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<GetFileByIdCompleted>(FileActionTypes.GetFileByIdCompleted),
        switchMap(searchAction => {
            if (this.isNewFile && searchAction.fileDetailsById.length == 1)
                return of(new RefreshFileList(searchAction.fileDetailsById[0]))
            if (this.isNewFile && searchAction.fileDetailsById.length > 1)
                return of(new RefreshMultipleFilesList(searchAction.fileDetailsById))
            else if (!this.isNewFile && searchAction.fileDetailsById.length == 1) {
                return of(new UpdateFileById({
                    fileDetailsUpdate: {
                        id: searchAction.fileDetailsById[0].fileId,
                        changes: searchAction.fileDetailsById[0]
                    }
                }))
            }
        })
    );

    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<FileExceptionHandled>(FileActionTypes.FileExceptionHandled),
        switchMap(searchAction => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage, // TODO: Change to proper toast message
            })
            )
        })
    );

    constructor(
        private actions$: Actions,
        private storeManagementService: StoreManagementService,
        private translateService: TranslateService
    ) { }
}