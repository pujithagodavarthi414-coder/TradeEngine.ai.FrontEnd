import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of, pipe } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowExceptionMessages } from '../actions/notification-validator.action';
import { WorkspaceList } from "../../models/workspaceList";
import { WidgetService } from "../../services/widget.service";
import {
    LoadHiddenWorkspacesListCompleted, LoadHiddenWorkspacesListTriggered, LoadSnackbar, LoadUnHideWorkspacesListCompleted,
    LoadUnHideWorkspacesListTriggered, LoadWorkspaceByIdCompleted, LoadWorkspaceByIdTriggered, LoadWorkspaceDeleteCompleted,
    LoadWorkspaceDeleteTriggered, LoadWorkspacesCompleted, LoadWorkspacesListCompleted, LoadWorkspacesListTriggered,
    LoadWorkspacesTriggered, RefreshHiddenWorkspacesList, RefreshWorkspacesList, WorkspaceEditCompletedWithInPlaceUpdate,
    WorkspaceException, WorkspaceFailed, WorkspacesActionTypes, LoadWorkspacesCompletedIfNoId
} from "../actions/Workspacelist.action";

@Injectable()
export class WorkspaceEffects {
    workspaceId: string;
    snackBarMessage: string;
    validationMessages: any[];
    exceptionMessage: any;
    searchWorkspace: WorkspaceList;
    latestWorkspaceData: WorkspaceList;
    newWorkspace: boolean;
    hideWorkspace: boolean;
    deletedWorkspaceId: string;
    workspacelist: WorkspaceList;

    constructor(private actions$: Actions, private translateService: TranslateService, private WidgetService: WidgetService) { }

    @Effect()
    loadWorkspacesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadWorkspacesListTriggered>(WorkspacesActionTypes.LoadWorkspacesListTriggered),
        switchMap(getAction => {
            return this.WidgetService.GetWorkspaceList(getAction.WorkspacesList).pipe(
                map((Workspaces: any) => {
                    if (Workspaces.success == true) {
                        return new LoadWorkspacesListCompleted(Workspaces.data);
                    }
                    else {
                        this.validationMessages = Workspaces.apiResponseMessages
                        return new WorkspaceFailed(Workspaces.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new WorkspaceException(err));
                })
            );
        })
    );

    @Effect()
    loadWorkspaces$: Observable<Action> = this.actions$.pipe(
        ofType<LoadWorkspacesTriggered>(WorkspacesActionTypes.LoadWorkspacesTriggered),
        switchMap(getAction => {
            return this.WidgetService.UpsertWorkspace(getAction.workspace).pipe(
                map((workspaces: any) => {
                    if (workspaces.success == true) {
                        this.workspaceId = workspaces.data;
                        if (getAction.workspace.workspaceId && getAction.workspace.isHidden == true) {
                            this.newWorkspace = false;
                            this.hideWorkspace = true;
                            this.snackBarMessage = getAction.workspace.workspaceName + " " + this.translateService.instant("APP.DASHBOARDHIDDENSUCCESSFULLY");
                            return new LoadWorkspaceDeleteCompleted(getAction.workspace.workspaceId);
                        }
                        else if (getAction.workspace.workspaceId) {
                            this.newWorkspace = false;
                            this.hideWorkspace = false;
                            this.snackBarMessage = getAction.workspace.workspaceName + " " + this.translateService.instant("APP.DASHBOARDEDITEDSUCCESSFULLY");
                        }
                        else {
                            this.newWorkspace = true;
                            this.hideWorkspace = false;
                            this.snackBarMessage = getAction.workspace.workspaceName + " " + this.translateService.instant("APP.DASHBOARDCREATEDSUCCESSFULLY");
                        }
                        return new LoadWorkspacesCompleted(workspaces.data);
                    } else {
                        this.validationMessages = workspaces.apiResponseMessages
                        return new WorkspaceFailed(workspaces.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new WorkspaceException(err));
                })
            );
        })
    );

    @Effect()
    loadWorkspacesSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<LoadWorkspacesCompleted>(WorkspacesActionTypes.LoadWorkspacesCompleted),
        pipe(
            map(
                () => {
                    this.searchWorkspace = new WorkspaceList();
                    this.searchWorkspace.workspaceId = this.workspaceId;
                    this.searchWorkspace.isArchived = false;
                    return new LoadWorkspaceByIdTriggered(this.searchWorkspace);
                }
            )
        )
    );

    @Effect()
    loadWorkspaceById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadWorkspaceByIdTriggered>(WorkspacesActionTypes.LoadWorkspaceByIdTriggered),
        switchMap(getAction => {
            return this.WidgetService.GetWorkspaceList(getAction.searchWorkspace).pipe(
                map((searchWorkspaces: any) => {
                    if (searchWorkspaces.success == true) {
                        this.latestWorkspaceData = searchWorkspaces.data;
                        if (searchWorkspaces.data.length > 0) {
                            return new LoadWorkspaceByIdCompleted(searchWorkspaces.data);
                        }
                        else {
                            return new LoadWorkspacesCompletedIfNoId();
                        }
                    }
                    else {
                        this.validationMessages = searchWorkspaces.apiResponseMessages
                        return new WorkspaceFailed(searchWorkspaces.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new WorkspaceException(err));
                })
            );
        })
    );

    @Effect()
    loadWorkspaceByIdCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadWorkspaceByIdCompleted>(WorkspacesActionTypes.LoadWorkspaceByIdCompleted),
        pipe(
            map(() => {
                if (this.newWorkspace) {
                    return new RefreshWorkspacesList(this.latestWorkspaceData[0]);
                }
                else {
                    return new WorkspaceEditCompletedWithInPlaceUpdate({
                        workspaceUpdate: {
                            id: this.latestWorkspaceData[0].workspaceId,
                            changes: this.latestWorkspaceData[0]
                        }
                    });
                }
            })
        )
    );

    @Effect()
    WorkspaceEditCompletedWithInPlaceUpdate$: Observable<Action> = this.actions$.pipe(
        ofType<WorkspaceEditCompletedWithInPlaceUpdate>(WorkspacesActionTypes.WorkspaceEditCompletedWithInPlaceUpdate),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage,
                        action: "Success"
                    })
            )
        )
    );

    @Effect()
    LoadWorkspacesCompletedIfNoId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadWorkspacesCompletedIfNoId>(WorkspacesActionTypes.LoadWorkspacesCompletedIfNoId),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage,
                        action: "Success"
                    })
            )
        )
    );

    @Effect()
    loadWorkspaceByIdCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshWorkspacesList>(WorkspacesActionTypes.RefreshWorkspacesList),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage,
                        action: "Success"
                    })
            )
        )
    );

    @Effect()
    RefreshHiddenWorkspacesList$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshHiddenWorkspacesList>(WorkspacesActionTypes.RefreshHiddenWorkspacesList),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage,
                        action: "Success"
                    })
            )
        )
    );

    @Effect()
    workspaceDelete$: Observable<Action> = this.actions$.pipe(
        ofType<LoadWorkspaceDeleteTriggered>(WorkspacesActionTypes.LoadWorkspaceDeleteTriggered),
        switchMap(getAction => {
            return this.WidgetService.DeleteWorkspace(getAction.deleteWorkspace).pipe(
                map((workspaces: any) => {
                    if (workspaces.success == true) {
                        this.newWorkspace = false;
                        this.hideWorkspace = false;
                        this.deletedWorkspaceId = workspaces.data;
                        this.snackBarMessage = getAction.deleteWorkspace.workspaceName + " " + this.translateService.instant("APP.DASHBOARDDELETEDSUCCESSFULLY");
                        return new LoadWorkspaceDeleteCompleted(getAction.deleteWorkspace.workspaceId);
                    }
                    else {
                        this.validationMessages = workspaces.apiResponseMessages
                        return new WorkspaceFailed(workspaces.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new WorkspaceException(err));
                })
            );
        })
    );

    @Effect()
    workspaceUnHide$: Observable<Action> = this.actions$.pipe(
        ofType<LoadUnHideWorkspacesListTriggered>(WorkspacesActionTypes.LoadUnHideWorkspacesListTriggered),
        switchMap(getAction => {
            return this.WidgetService.UpsertWorkspace(getAction.unHideWorkspace).pipe(
                map((workspaces: any) => {
                    if (workspaces.success == true) {
                        this.workspaceId = workspaces.data;
                        this.snackBarMessage = getAction.unHideWorkspace.workspaceName + " " + this.translateService.instant("APP.DASHBOARDEXPOSEDSUCCESSFULLY");
                        return new LoadUnHideWorkspacesListCompleted(getAction.unHideWorkspace.workspaceId);
                    }
                    else {
                        this.validationMessages = workspaces.apiResponseMessages
                        return new WorkspaceFailed(workspaces.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new WorkspaceException(err));
                })
            );
        })
    );

    @Effect()
    loadunHideWorkspaceSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<LoadUnHideWorkspacesListCompleted>(WorkspacesActionTypes.LoadUnHideWorkspacesListCompleted),
        pipe(
            map(
                () => {
                    this.newWorkspace = true;
                    return new LoadWorkspacesCompleted(this.workspaceId);
                }
            )
        )
    );

    @Effect()
    loadworkspaceDeleteSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<LoadWorkspaceDeleteCompleted>(WorkspacesActionTypes.LoadWorkspaceDeleteCompleted),
        pipe(
            map(
                () => {
                    if (this.hideWorkspace) {
                        this.workspacelist = new WorkspaceList();
                        this.workspacelist.workspaceId = "null";
                        this.workspacelist.isHidden = true;
                        return new LoadHiddenWorkspacesListTriggered(this.workspacelist);
                    }
                    else {
                        return new LoadSnackbar();
                    }
                }
            )
        )
    );

    @Effect()
    loadHiddenWorkspacesListTriggered$: Observable<Action> = this.actions$.pipe(
        ofType<LoadHiddenWorkspacesListTriggered>(WorkspacesActionTypes.LoadHiddenWorkspacesListTriggered),
        switchMap(getAction => {
            return this.WidgetService.GetWorkspaceList(getAction.WorkspacesList).pipe(
                map((Workspaces: any) => {
                    if (Workspaces.success == true)
                        return new LoadHiddenWorkspacesListCompleted(Workspaces.data);
                    else {
                        this.validationMessages = Workspaces.apiResponseMessages
                        return new WorkspaceFailed(Workspaces.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new WorkspaceException(err));
                })
            );
        })
    );

    @Effect()
    LoadSnackbarTriggered$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSnackbar>(WorkspacesActionTypes.LoadSnackbar),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage,
                        action: "Success"
                    })
            )
        )
    );

    @Effect()
    showValidationMessagesForWorkspace$: Observable<Action> = this.actions$.pipe(
        ofType<WorkspaceFailed>(WorkspacesActionTypes.WorkspaceFailed),
        pipe(
            map(
                () => {
                    for (var i = 0; i < this.validationMessages.length; i++) {
                        return new ShowExceptionMessages({
                            message: this.validationMessages[i].message
                        })
                    }
                }
            )
        )
    );

    // @Effect()
    // exceptionHandled$: Observable<Action> = this.actions$.pipe(
    //     ofType<WorkspaceException>(WorkspacesActionTypes.WorkspaceException),
    //     pipe(
    //         map(
    //             () =>
    //                 new ShowExceptionMessages({
    //                     message: this.exceptionMessage.message
    //                 })
    //         )
    //     )
    // );
}