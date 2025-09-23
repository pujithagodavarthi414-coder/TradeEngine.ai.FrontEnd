import { Injectable } from "@angular/core";
import { switchMap, map, catchError, mergeMap } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { SearchFolderModel } from "../../models/search-folder-model";
import { StoreManagementService } from "../../services/store-management.service";
import { LoadFilesCompleted } from "../actions/file.actions";
import { FolderActionTypes, LoadFoldersCompleted, LoadFoldersFailed, CreateFolderTriggered, FolderExceptionHandled, DeleteFolderCompleted, CreateFolderCompleted, CreateFolderFailed, GetFolderByIdTriggered, GetFolderByIdCompleted, UpdateFolderById, RefreshFolderList, LoadFoldersAndFilesTriggered, LoadFoldersAndFilesCompleted, LoadBreadcrumbCompleted, LoadStoreDataCompleted, LoadFoldersAndFilesFailed, LoadFolderDescriptionCompleted } from "../actions/folder.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { ConstantVariables } from '../../constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';

@Injectable()
export class FolderEffects {
    isNewFolder: boolean;
    toastrMessage: string;

    @Effect()
    loadFolder$: Observable<Action> = this.actions$.pipe(
        ofType<LoadFoldersAndFilesTriggered>(FolderActionTypes.LoadFoldersAndFilesTriggered),
        switchMap(searchAction => {
            return this.storeManagementService
                .getFolders(searchAction.searchFolderModel)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        return new LoadFoldersAndFilesCompleted(response.data);
                    } else {
                        return new LoadFoldersAndFilesFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new FolderExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    loadFolders$: Observable<Action> = this.actions$.pipe(
        ofType<LoadFoldersAndFilesCompleted>(FolderActionTypes.LoadFoldersAndFilesCompleted),
        mergeMap((searchAction) => [
            new LoadFoldersCompleted(searchAction.foldersAndFilesInputModel.folders ? JSON.parse(searchAction.foldersAndFilesInputModel.folders): []),
            new LoadFilesCompleted(searchAction.foldersAndFilesInputModel.files ? JSON.parse(searchAction.foldersAndFilesInputModel.files) : []),
            new LoadBreadcrumbCompleted(searchAction.foldersAndFilesInputModel.breadCrumb ? JSON.parse(searchAction.foldersAndFilesInputModel.breadCrumb): []), 
            new LoadStoreDataCompleted(searchAction.foldersAndFilesInputModel.store ? JSON.parse(searchAction.foldersAndFilesInputModel.store) : []),
            new LoadFolderDescriptionCompleted(searchAction.foldersAndFilesInputModel.parentFolderDescription)
        ]),catchError((err: any) => of(new LoadFoldersAndFilesFailed(err)))
    );

    @Effect()
    showValidationMessagesForLoadFoldersAndFilesFailed$: Observable<Action> = this.actions$.pipe(
        ofType<LoadFoldersAndFilesFailed>(FolderActionTypes.LoadFoldersAndFilesFailed),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForLoadFoldersFailed$: Observable<Action> = this.actions$.pipe(
        ofType<LoadFoldersFailed>(FolderActionTypes.LoadFoldersFailed),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages
            })
            )
        })
    );

    @Effect()
    upsertFolder$: Observable<Action> = this.actions$.pipe(
        ofType<CreateFolderTriggered>(FolderActionTypes.CreateFolderTriggered),
        switchMap(folderDetailsTriggeredAction => {
            if (folderDetailsTriggeredAction.upsertFolderDetails.folderId === null || folderDetailsTriggeredAction.upsertFolderDetails.folderId === '' || folderDetailsTriggeredAction.upsertFolderDetails.folderId === undefined) {
                this.isNewFolder = true;
                this.toastrMessage = this.translateService.instant(ConstantVariables.FolderCreatedSuccessfully);
            } else if (
                folderDetailsTriggeredAction.upsertFolderDetails.folderId !== undefined &&
                folderDetailsTriggeredAction.upsertFolderDetails.isArchived === true
            ) {
                this.isNewFolder = false;
                this.toastrMessage = this.translateService.instant(ConstantVariables.FolderDeletedSuccessfully);
            } else {
                this.isNewFolder = false;
                this.toastrMessage = this.translateService.instant(ConstantVariables.FolderUpdatedSuccessfully);
            }
            return this.storeManagementService
                .upsertFolder(folderDetailsTriggeredAction.upsertFolderDetails)
                .pipe(map((folderDetailsId: any) => {
                    if (folderDetailsId.success === true) {
                        if (folderDetailsTriggeredAction.upsertFolderDetails.isArchived)
                            return new DeleteFolderCompleted(folderDetailsId.data);
                        else
                            return new CreateFolderCompleted(folderDetailsId.data);
                    } else {
                        return new CreateFolderFailed(folderDetailsId.apiResponseMessages);
                    }
                }),
                    catchError(error => {
                        return of(new FolderExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    showValidationMessagesForCreateFoldersFailed$: Observable<Action> = this.actions$.pipe(
        ofType<CreateFolderFailed>(FolderActionTypes.CreateFolderFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    upsertFolderSuccessfulAndLoadDependentDetails$: Observable<Action> = this.actions$.pipe(
        ofType<CreateFolderCompleted>(FolderActionTypes.CreateFolderCompleted),
        switchMap(searchAction => {
            let folderModel = new SearchFolderModel();
            folderModel.folderId = searchAction.upsertFolderId;
            return of(new GetFolderByIdTriggered(folderModel));
        })
    );

    @Effect()
    upsertFolderSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<CreateFolderCompleted>(FolderActionTypes.CreateFolderCompleted),
        pipe(map(() =>
            new SnackbarOpen({
                message: this.toastrMessage, // TODO: Change to proper toast message
                action: this.translateService.instant(ConstantVariables.success)
            })
        )
        )
    );

    @Effect()
    deleteFolderSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteFolderCompleted>(FolderActionTypes.DeleteFolderCompleted),
        pipe(map(() =>
            new SnackbarOpen({
                message: this.toastrMessage, // TODO: Change to proper toast message
                action: this.translateService.instant(ConstantVariables.success)
            })
        )
        )
    );

    @Effect()
    getFolderById$: Observable<Action> = this.actions$.pipe(
        ofType<GetFolderByIdTriggered>(FolderActionTypes.GetFolderByIdTriggered),
        switchMap(searchAction => {
            return this.storeManagementService
                .getFolders(searchAction.searchFolderByIdModel)
                .pipe(map((folderDetailsData: any) => {
                    if (folderDetailsData.success === true) {

                        return new GetFolderByIdCompleted(folderDetailsData.data.folders ? JSON.parse(folderDetailsData.data.folders)[0]: []);
                    } else {
                        return new LoadFoldersFailed(
                            folderDetailsData.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new FolderExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertFolderSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<GetFolderByIdCompleted>(FolderActionTypes.GetFolderByIdCompleted),
        switchMap(searchAction => {
            if (this.isNewFolder)
                return of(new RefreshFolderList(searchAction.folderDetailsById))
            else {
                return of(new UpdateFolderById({
                    folderDetailsUpdate: {
                        id: searchAction.folderDetailsById.folderId,
                        changes: searchAction.folderDetailsById
                    }
                }))
            }
        })
    );

    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<FolderExceptionHandled>(FolderActionTypes.FolderExceptionHandled),
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