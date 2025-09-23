import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { TranslateService } from "@ngx-translate/core";
import { switchMap, map, catchError } from 'rxjs/operators';

import { SnackbarOpen } from '../../dependencies/project-store/actions/snackbar.actions';
import { ShowExceptionMessages } from '../../dependencies/project-store/actions/notification-validator.action';

import * as auditManagementReducers from "../reducers";

import { SoftLabelPipe } from '../../dependencies/pipes/softlabels.pipes';
import { SoftLabelConfigurationModel } from '../../dependencies/models/softLabels-model';

import { State } from '../../dependencies/main-store/reducers/index';

import { AuditConduct } from '../../models/audit-conduct.model';
import { AuditService } from '../../services/audits.service';

import { AuditConductActionTypes, LoadAuditConductTriggered, LoadAuditConductCompleted, AuditConductFailed, AuditConductException, LoadAuditConductByIdTriggered, LoadAuditConductByIdCompleted, RefreshAuditConductsList, AuditConductEditCompletedWithInPlaceUpdate, LoadAuditConductListTriggered, LoadAuditConductListCompleted, LoadAuditConductDelete, LoadSubmitConductTriggered, LoadSubmitConductCompleted } from '../actions/conducts.actions';
import { LoadAuditRelatedCountsTriggered } from '../actions/audits.actions';
import { ConstantVariables } from '../../dependencies/constants/constant-variables';

@Injectable()
export class AuditConductEffects {
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];

    searchAuditConduct: AuditConduct;
    latestAuditConductData: AuditConduct[];

    exceptionMessage: any;
    conductId: string;
    projectId: string;
    deletedAuditConductId: string;
    newAuditConduct: boolean;
    archiveAuditConduct: boolean = false;;
    snackBarMessage: string;
    validationMessages: any[];

    constructor(private actions$: Actions, private softLabePipe: SoftLabelPipe, private auditService: AuditService, private translateService: TranslateService, private store: Store<State>) {
        this.softLabels$ = this.store.pipe(select(auditManagementReducers.getSoftLabelsAll));
        this.softLabels$.subscribe((x) => this.softLabels = x);
    }

    @Effect()
    loadAudits$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditConductTriggered>(AuditConductActionTypes.LoadAuditConductTriggered),
        switchMap(getAction => {
            return this.auditService.upsertAuditConduct(getAction.auditConduct).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.conductId = result.data;
                        this.projectId = getAction.auditConduct.projectId;
                        if (getAction.auditConduct.conductId && getAction.auditConduct.isArchived == true || getAction.auditConduct.conductId && getAction.auditConduct.isCompleted == true || getAction.auditConduct.conductId && getAction.auditConduct.auditConductUnarchive == true) {
                            this.newAuditConduct = false;
                            this.archiveAuditConduct = true;
                            if (getAction.auditConduct.isArchived)
                                this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditArchived);
                            else
                                this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditEdited);
                        }
                        else if (getAction.auditConduct.conductId) {
                            this.newAuditConduct = false;
                            this.archiveAuditConduct = false;
                            this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditEdited);
                        }
                        else {
                            this.newAuditConduct = true;
                            this.archiveAuditConduct = false;
                            this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditCreated);
                        }
                        return new LoadAuditConductCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditConductFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditConductException(err));
                })
            );
        })
    );

    // @Effect()
    // loadAuditCompleted$: Observable<Action> = this.actions$.pipe(
    //     ofType<RefreshAuditConductsList>(AuditConductActionTypes.RefreshAuditConductsList),
    //     pipe(
    //         map(
    //             () =>
    //                 new SnackbarOpen({
    //                     message: this.snackBarMessage,
    //                     action: this.translateService.instant(ConstantVariables.success)
    //                 })
    //         )
    //     )
    // );

    // @Effect()
    // loadAuditDeletesCompleted$: Observable<Action> = this.actions$.pipe(
    //     ofType<LoadAuditConductDelete>(AuditConductActionTypes.LoadAuditConductDelete),
    //     pipe(
    //         map(
    //             () =>
    //                 new SnackbarOpen({
    //                     message: this.snackBarMessage,
    //                     action: this.translateService.instant(ConstantVariables.success)
    //                 })
    //         )
    //     )
    // );

    @Effect()
    loadAuditCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditConductCompleted>(AuditConductActionTypes.LoadAuditConductCompleted),
        pipe(
            map(
                () => {
                    if (this.archiveAuditConduct == false) {
                        let searchAuditConduct = new AuditConduct();
                        searchAuditConduct.conductId = this.conductId;
                        //searchAuditConduct.isArchived = false;
                        return new LoadAuditConductByIdTriggered(searchAuditConduct);
                    }
                    else {
                        return new LoadAuditConductDelete(this.conductId);
                    }
                })
        )
    );

    @Effect()
    loadAuditById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditConductByIdTriggered>(AuditConductActionTypes.LoadAuditConductByIdTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditConducts(getAction.auditConduct).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.latestAuditConductData = result.data;
                        return new LoadAuditConductByIdCompleted(this.latestAuditConductData);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditConductFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditConductException(err));
                })
            );
        })
    );

    @Effect()
    loadSubmitConductById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSubmitConductTriggered>(AuditConductActionTypes.LoadSubmitConductTriggered),
        switchMap(getAction => {
            return this.auditService.submitAuditConduct(getAction.auditConduct).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.conductId = getAction.auditConduct.conductId;
                        this.snackBarMessage = this.translateService.instant(ConstantVariables.MessageForQuestionSubmitted);
                        return new LoadSubmitConductCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditConductFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditConductException(err));
                })
            );
        })
    );

    @Effect()
    loadSubmitConductByIdDone$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSubmitConductCompleted>(AuditConductActionTypes.LoadSubmitConductCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage,
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    loadSubmitConductByIdDoneFully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSubmitConductCompleted>(AuditConductActionTypes.LoadSubmitConductCompleted),
        pipe(
            map(
                () => {
                    let searchAuditConduct = new AuditConduct();
                    searchAuditConduct.conductId = this.conductId;
                    //searchAuditConduct.isArchived = false;
                    searchAuditConduct.canRefreshConduct = true;
                    return new LoadAuditConductByIdTriggered(searchAuditConduct);
                })
        )
    );

    @Effect()
    loadAuditByIdCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditConductByIdCompleted>(AuditConductActionTypes.LoadAuditConductByIdCompleted),
        pipe(
            map(() => {
                if (this.newAuditConduct) {
                    this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditCreated);
                    return new RefreshAuditConductsList(this.latestAuditConductData[0]);
                }
                else {
                    this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditEdited);
                    return new AuditConductEditCompletedWithInPlaceUpdate({
                        auditConductUpdate: {
                            id: this.latestAuditConductData[0].conductId,
                            changes: this.latestAuditConductData[0]
                        }
                    });
                }
            })
        )
    );

    @Effect()
    loadAuditCompletedSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshAuditConductsList>(AuditConductActionTypes.RefreshAuditConductsList),
        pipe(
            map(
                () => {
                    return new LoadAuditRelatedCountsTriggered(this.projectId);
                })
        )
    );

    @Effect()
    loadAuditCompleteSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditConductDelete>(AuditConductActionTypes.LoadAuditConductDelete),
        pipe(
            map(
                () => {
                    return new LoadAuditRelatedCountsTriggered(this.projectId);
                })
        )
    );

    @Effect()
    loadAuditsList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditConductListTriggered>(AuditConductActionTypes.LoadAuditConductListTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditConducts(getAction.auditConduct).pipe(
                map((result: any) => {
                    if (result.success == true)
                        return new LoadAuditConductListCompleted(result.data);
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditConductFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditConductException(err));
                })
            );
        })
    );

    @Effect()
    showValidationMessagesForAudit$: Observable<Action> = this.actions$.pipe(
        ofType<AuditConductFailed>(AuditConductActionTypes.AuditConductFailed),
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

    @Effect()
    auditExceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<AuditConductException>(AuditConductActionTypes.AuditConductException),
        pipe(
            map(
                () =>
                    new ShowExceptionMessages({
                        message: this.exceptionMessage.message
                    })
            )
        )
    );
}