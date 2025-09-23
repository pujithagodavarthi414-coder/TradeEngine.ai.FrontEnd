import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../../dependencies/constants/constant-variables';
import { switchMap, map, catchError } from 'rxjs/operators';

import { SnackbarOpen } from '../../dependencies/project-store/actions/snackbar.actions';
import { ShowExceptionMessages } from '../../dependencies/project-store/actions/notification-validator.action';

import * as auditManagementReducers from "../reducers";

import { SoftLabelPipe } from '../../dependencies/pipes/softlabels.pipes';
import { SoftLabelConfigurationModel } from '../../dependencies/models/softLabels-model';

import { State } from '../../dependencies/main-store/reducers/index';
import { AuditCompliance, AuditMultipleUpdates } from '../../models/audit-compliance.model';
import { AuditService } from '../../services/audits.service';

import { AuditActionTypes, LoadAuditTriggered, LoadAuditCompleted, AuditFailed, AuditException, LoadAuditByIdTriggered, LoadAuditByIdCompleted, RefreshAuditsList, AuditEditCompletedWithInPlaceUpdate, LoadAuditListTriggered, LoadAuditListCompleted, LoadAuditDelete, LoadAuditRelatedCountsTriggered, LoadAuditRelatedCountsCompleted, LoadMultipleAuditsByIdTriggered, LoadMultipleAuditsByIdCompleted, LoadAuditTagListTriggered, LoadAuditTagListCompleted, LoadAuditTagTriggered, LoadAuditTagCompleted, LoadAuditCloneTriggered, LoadAuditCloneCompleted, LoadAnotherAuditByIdTriggered, LoadAnotherAuditByIdCompleted, LoadAuditVersionListTriggered, LoadAuditVersionListCompleted, LoadCopyAuditListTriggered, LoadCopyAuditListCompleted, LoadConductTagListTriggered, LoadConductTagListCompleted, LoadConductTagTriggered, LoadConductTagCompleted } from '../actions/audits.actions';
import { AuditConduct } from '../../models/audit-conduct.model';
import { LoadAuditConductByIdTriggered } from '../actions/conducts.actions';

@Injectable()
export class AuditEffects {
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];

    searchAudit: AuditCompliance;
    latestAuditData: AuditCompliance[];

    exceptionMessage: any;
    auditId: string;
    conductId: string;
    projectId: string;
    deletedAuditId: string;
    newAudit: boolean;
    archiveAudit: boolean = false;;
    snackBarMessage: string;
    validationMessages: any[];

    constructor(private actions$: Actions, private softLabePipe: SoftLabelPipe, private auditService: AuditService, private translateService: TranslateService, private store: Store<State>) {
        this.softLabels$ = this.store.pipe(select(auditManagementReducers.getSoftLabelsAll));
        this.softLabels$.subscribe((x) => this.softLabels = x);
    }

    @Effect()
    loadAuditRelatedCounts$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditRelatedCountsTriggered>(AuditActionTypes.LoadAuditRelatedCountsTriggered),
        switchMap(getAction => {
            return this.auditService.getAuditRelatedCounts(getAction.projectId).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.projectId = getAction.projectId;
                        return new LoadAuditRelatedCountsCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditException(err));
                })
            );
        })
    );

    @Effect()
    loadAudits$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditTriggered>(AuditActionTypes.LoadAuditTriggered),
        switchMap(getAction => {
            return this.auditService.upsertAuditCompliance(getAction.audit).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.auditId = result.data;
                        this.projectId = getAction.audit.projectId;
                        if (getAction.audit.auditId && getAction.audit.isArchived == true || getAction.audit.auditId && getAction.audit.auditUnarchive == true) {
                            this.newAudit = false;
                            this.archiveAudit = true;
                            this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditArchived);
                        }
                        else if (getAction.audit.auditId) {
                            this.newAudit = false;
                            this.archiveAudit = false;
                            this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditEdited);
                        }
                        else {
                            this.newAudit = true;
                            this.archiveAudit = false;
                            this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditCreated);
                        }
                        return new LoadAuditCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditException(err));
                })
            );
        })
    );

    // @Effect()
    // loadAuditCompleted$: Observable<Action> = this.actions$.pipe(
    //     ofType<RefreshAuditsList>(AuditActionTypes.RefreshAuditsList),
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
    // loadAuditsCompleted$: Observable<Action> = this.actions$.pipe(
    //     ofType<LoadAuditDelete>(AuditActionTypes.LoadAuditDelete),
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
        ofType<LoadAuditCompleted>(AuditActionTypes.LoadAuditCompleted),
        pipe(
            map(
                () => {
                    if (this.archiveAudit == false) {
                        let searchAudit = new AuditCompliance();
                        searchAudit.auditId = this.auditId;
                        searchAudit.isArchived = false;
                        return new LoadAuditByIdTriggered(searchAudit);
                    }
                    else {
                        return new LoadAuditDelete(this.auditId);
                    }
                })
        )
    );

    @Effect()
    loadAuditById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditByIdTriggered>(AuditActionTypes.LoadAuditByIdTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditCompliances(getAction.audit).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.latestAuditData = result.data;
                        return new LoadAuditByIdCompleted(this.latestAuditData);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditException(err));
                })
            );
        })
    );

    @Effect()
    loadAnotherAuditById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAnotherAuditByIdTriggered>(AuditActionTypes.LoadAnotherAuditByIdTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditCompliances(getAction.audit).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.latestAuditData = result.data;
                        return new LoadAnotherAuditByIdCompleted(this.latestAuditData);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditException(err));
                })
            );
        })
    );

    @Effect()
    loadAuditClone$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCloneTriggered>(AuditActionTypes.LoadAuditCloneTriggered),
        switchMap(getAction => {
            return this.auditService.cloneAudit(getAction.audit).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.auditId = result.data;
                        this.projectId = getAction.audit.projectId;
                        this.snackBarMessage = this.translateService.instant(ConstantVariables.MessageForAuditCloned);
                        return new LoadAuditCloneCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditException(err));
                })
            );
        })
    );

    @Effect()
    loadAuditCloneCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCloneCompleted>(AuditActionTypes.LoadAuditCloneCompleted),
        pipe(
            map(
                () => {
                    this.newAudit = true;
                    let searchAudit = new AuditCompliance();
                    searchAudit.auditId = this.auditId;
                    searchAudit.isArchived = false;
                    searchAudit.fromClone = true;
                    return new LoadAuditByIdTriggered(searchAudit);
                })
        )
    );

    @Effect()
    loadAuditCloneCompleteds$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCloneCompleted>(AuditActionTypes.LoadAuditCloneCompleted),
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
    loadAuditClonesCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCloneCompleted>(AuditActionTypes.LoadAuditCloneCompleted),
        pipe(
            map(
                () => {
                    return new LoadAuditRelatedCountsTriggered(this.projectId);
                })
        )
    );

    @Effect()
    loadAuditTag$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditTagTriggered>(AuditActionTypes.LoadAuditTagTriggered),
        switchMap(getAction => {
            return this.auditService.upsertAuditTags(getAction.audit).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.auditId = getAction.audit.auditId;
                        this.projectId = getAction.audit.projectId;
                        return new LoadAuditTagCompleted(this.auditId);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditException(err));
                })
            );
        })
    );

    @Effect()
    loadConductTag$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductTagTriggered>(AuditActionTypes.LoadConductTagTriggered),
        switchMap(getAction => {
            return this.auditService.upsertAuditTags(getAction.audit).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.auditId = getAction.audit.auditId;
                        this.conductId = getAction.audit.conductId;
                        this.projectId = getAction.audit.projectId;
                        return new LoadConductTagCompleted(this.auditId);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditException(err));
                })
            );
        })
    );

    @Effect()
    loadConductByIdAfterConductTag$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductTagCompleted>(AuditActionTypes.LoadConductTagCompleted),
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

    // @Effect()
    // loadAuditTagsCompleted$: Observable<Action> = this.actions$.pipe(
    //     ofType<LoadAuditTagCompleted>(AuditActionTypes.LoadAuditTagCompleted),
    //     pipe(
    //         map(
    //             () => {
    //                 let searchAudit = new AuditCompliance();
    //                 //searchAudit.auditId = this.auditId;
    //                 searchAudit.isArchived = false;
    //                 return new LoadAuditListTriggered(searchAudit);
    //             })
    //     )
    // );

    @Effect()
    loadAuditTagsCompleteds$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditTagCompleted>(AuditActionTypes.LoadAuditTagCompleted),
        pipe(
            map(
                () => {
                    return new LoadAuditRelatedCountsTriggered(this.projectId);
                })
        )
    );

    @Effect()
    loadAuditTags$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditTagListTriggered>(AuditActionTypes.LoadAuditTagListTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditTags(getAction.audit.searchText, getAction.audit.selectedIds).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadAuditTagListCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditException(err));
                })
            );
        })
    );

    @Effect()
    loadConductTags$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductTagListTriggered>(AuditActionTypes.LoadConductTagListTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditTags(getAction.audit.searchText, getAction.audit.selectedIds).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadConductTagListCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditException(err));
                })
            );
        })
    );

    @Effect()
    loadMultipleAuditsById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMultipleAuditsByIdTriggered>(AuditActionTypes.LoadMultipleAuditsByIdTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditCompliances(getAction.audit).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        let auditsList = this.convertAuditsToJson(result.data);
                        return new LoadMultipleAuditsByIdCompleted({
                            multipleAudits: auditsList
                        });
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditException(err));
                })
            );
        })
    );

    @Effect()
    loadAuditByIdCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditByIdCompleted>(AuditActionTypes.LoadAuditByIdCompleted),
        pipe(
            map(() => {
                if (this.newAudit) {
                    this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditCreated);
                    return new RefreshAuditsList(this.latestAuditData[0]);
                }
                else {
                    this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditEdited);
                    return new AuditEditCompletedWithInPlaceUpdate({
                        auditUpdate: {
                            id: this.latestAuditData[0].auditId,
                            changes: this.latestAuditData[0]
                        }
                    });
                }
            })
        )
    );

    @Effect()
    loadAuditCompletedSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshAuditsList>(AuditActionTypes.RefreshAuditsList),
        pipe(
            map(
                () => {
                    return new LoadAuditRelatedCountsTriggered(this.projectId);
                })
        )
    );

    @Effect()
    loadAuditCompleteSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditDelete>(AuditActionTypes.LoadAuditDelete),
        pipe(
            map(
                () => {
                    return new LoadAuditRelatedCountsTriggered(this.projectId);
                })
        )
    );

    @Effect()
    loadAuditsList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditListTriggered>(AuditActionTypes.LoadAuditListTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditCompliances(getAction.audit).pipe(
                map((result: any) => {
                    if (result.success == true)
                        return new LoadAuditListCompleted(result.data);
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditException(err));
                })
            );
        })
    );

    @Effect()
    loadAuditsCopyList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCopyAuditListTriggered>(AuditActionTypes.LoadCopyAuditListTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditCompliances(getAction.audit).pipe(
                map((result: any) => {
                    if (result.success == true)
                        return new LoadCopyAuditListCompleted(result.data);
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditException(err));
                })
            );
        })
    );

    @Effect()
    loadAuditVersionsList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditVersionListTriggered>(AuditActionTypes.LoadAuditVersionListTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditCompliances(getAction.audit).pipe(
                map((result: any) => {
                    if (result.success == true)
                        return new LoadAuditVersionListCompleted(result.data);
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditException(err));
                })
            );
        })
    );

    @Effect()
    showValidationMessagesForAudit$: Observable<Action> = this.actions$.pipe(
        ofType<AuditFailed>(AuditActionTypes.AuditFailed),
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
        ofType<AuditException>(AuditActionTypes.AuditException),
        pipe(
            map(
                () =>
                    new ShowExceptionMessages({
                        message: this.exceptionMessage.message
                    })
            )
        )
    );

    convertAuditsToJson(auditList) {
        let finalAuditList = [];
        auditList.forEach(element => {
            let auditUpdatesModel = new AuditMultipleUpdates();
            auditUpdatesModel.id = element.auditId;
            auditUpdatesModel.changes = element;
            finalAuditList.push(auditUpdatesModel);
        });
        return finalAuditList;
    }
}