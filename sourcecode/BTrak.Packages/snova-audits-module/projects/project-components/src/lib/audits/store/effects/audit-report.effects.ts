import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ToastrService } from "ngx-toastr";

import {
    AuditReportActionTypes, LoadReportTriggered, LoadReportCompleted, ReportException, ReportFailed, LoadReportByIdTriggered, LoadReportByIdCompleted, RefreshReportsList, LoadReportListTriggered, LoadReportListCompleted, LoadDetailedReportTriggered, LoadDetailedReportCompleted, LoadShareReportTriggered, LoadShareReportCompleted, LoadReportDeleteTriggered, LoadReportDeleteCompleted
} from '../actions/audit-report.actions';

import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../../dependencies/constants/constant-variables';
// import { SnackbarOpen } from '../../../../views/projects/store/actions/snackbar.actions';
import { ShowExceptionMessages } from '../../dependencies/project-store/actions/notification-validator.action';
import { SoftLabelPipe } from '../../dependencies/pipes/softlabels.pipes';
import { SoftLabelConfigurationModel } from '../../dependencies/models/softLabels-model';
import { State } from '../../dependencies/main-store/reducers/index';
import { AuditService } from '../../services/audits.service';
import { AuditReport } from '../../models/audit-report.model';
import { LoadAuditRelatedCountsTriggered } from '../actions/audits.actions';
import * as auditManagementReducers from "../reducers";

@Injectable()
export class AuditReportEffects {
    auditReportId: string;
    projectId: string;
    snackBarMessage: string;
    newReport: boolean;
    archiveReport: boolean;
    validationMessages: any[];
    exceptionMessage: any;
    searchReport: AuditReport;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    latestReportData: AuditReport[];

    constructor(private actions$: Actions, private auditService: AuditService, private translateService: TranslateService, private toastr: ToastrService, private softLabePipe: SoftLabelPipe, private store: Store<State>) {
        this.softLabels$ = this.store.pipe(select(auditManagementReducers.getSoftLabelsAll));
        this.softLabels$.subscribe((x) => this.softLabels = x);
    }

    @Effect()
    loadAuditReports$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportTriggered>(AuditReportActionTypes.LoadReportTriggered),
        switchMap(getAction => {
            return this.auditService.upsertAuditReport(getAction.report).pipe(
                map((report: any) => {
                    if (report.success == true) {
                        this.auditReportId = report.data;
                        this.projectId = getAction.report.projectId;
                        if (getAction.report.auditReportId && getAction.report.isArchived == true) {
                            this.newReport = false;
                            this.archiveReport = true;
                        }
                        else if (getAction.report.auditReportId) {
                            this.newReport = false;
                            this.archiveReport = false;
                        }
                        else {
                            this.newReport = true;
                            this.archiveReport = false;
                        }
                        this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditCreated);
                        // this.toastr.info("", this.translateService.instant(ConstantVariables.AuditReport));
                        return new LoadReportCompleted(report.data);
                    }
                    else {
                        this.validationMessages = report.apiResponseMessages
                        return new ReportFailed(report.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new ReportException(err));
                })
            );
        })
    );

    // @Effect()
    // loadAuditReportCompleted$: Observable<Action> = this.actions$.pipe(
    //     ofType<LoadReportCompleted>(AuditReportActionTypes.LoadReportCompleted),
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
    loadAuditReportsLoaded$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportCompleted>(AuditReportActionTypes.LoadReportCompleted),
        pipe(
            map(
                () => {
                    if (this.archiveReport == false) {
                        let searchReport = new AuditReport();
                        searchReport.auditReportId = this.auditReportId;
                        searchReport.isArchived = false;
                        return new LoadReportByIdTriggered(searchReport);
                    }
                    else {
                        return new LoadReportDeleteCompleted(this.auditReportId);
                    }
                }
            )
        )
    );

    // @Effect()
    // loadAuditReportDeleteSuccessful$: Observable<Action> = this.actions$.pipe(
    //     ofType<LoadReportDeleteCompleted>(AuditReportActionTypes.LoadReportDeleteCompleted),
    //     pipe(
    //         map(
    //             () => new SnackbarOpen({
    //                 message: this.snackBarMessage,
    //                 action: this.translateService.instant(ConstantVariables.success)
    //             })
    //         )
    //     )
    // );

    @Effect()
    loadAuditReportDeletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportDeleteCompleted>(AuditReportActionTypes.LoadReportDeleteCompleted),
        pipe(
            map(
                () => {
                    return new LoadAuditRelatedCountsTriggered(this.projectId);
                })
        )
    );

    @Effect()
    loadAuditReportById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportByIdTriggered>(AuditReportActionTypes.LoadReportByIdTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditReports(getAction.searchReport).pipe(
                map((searchReports: any) => {
                    if (searchReports.success == true) {
                        this.latestReportData = searchReports.data;
                        return new LoadReportByIdCompleted(searchReports.data);
                    }
                    else {
                        this.validationMessages = searchReports.apiResponseMessages
                        return new ReportFailed(searchReports.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new ReportException(err));
                })
            );
        })
    );

    @Effect()
    loadAuditReportByIdCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportByIdCompleted>(AuditReportActionTypes.LoadReportByIdCompleted),
        pipe(
            map(() => {
                // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForReportCreated);
                return new RefreshReportsList(this.latestReportData[0]);
            })
        )
    );

    @Effect()
    loadAuditDetailedReportById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadDetailedReportTriggered>(AuditReportActionTypes.LoadDetailedReportTriggered),
        switchMap(getAction => {
            return this.auditService.searchDetailedAuditReport(getAction.reportById).pipe(
                map((detailedReport: any) => {
                    if (detailedReport.success == true) {
                        let data = detailedReport.data[0];
                        return new LoadDetailedReportCompleted(data);
                    }
                    else {
                        this.validationMessages = detailedReport.apiResponseMessages
                        return new ReportFailed(detailedReport.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new ReportException(err));
                })
            );
        })
    );

    @Effect()
    loadAuditReportByIdCompletedFully$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshReportsList>(AuditReportActionTypes.RefreshReportsList),
        pipe(
            map(
                () => {
                    return new LoadAuditRelatedCountsTriggered(this.projectId);
                }
            )
        )
    );

    // @Effect()
    // loadShareReport$: Observable<Action> = this.actions$.pipe(
    //     ofType<LoadShareReportTriggered>(AuditReportActionTypes.LoadShareReportTriggered),
    //     switchMap(getAction => {
    //         return this.auditService.ShareReport(getAction.shareReport).pipe(
    //             map((reports: any) => {
    //                 if (reports.success == true) {
    //                     this.snackBarMessage = this.softLabePipe.transform(this.translateService.instant(ConstantVariables.SuccessMessageForReportShared), this.softLabels);
    //                     return new LoadShareReportCompleted(reports.data);
    //                 }
    //                 else {
    //                     this.validationMessages = reports.apiResponseMessages
    //                     return new ReportFailed(reports.apiResponseMessages);
    //                 }
    //             }),
    //             catchError(err => {
    //                 this.exceptionMessage = err;
    //                 return of(new ReportException(err));
    //             })
    //         );
    //     })
    // );

    // @Effect()
    // loadShareReportSent$: Observable<Action> = this.actions$.pipe(
    //     ofType<LoadShareReportCompleted>(AuditReportActionTypes.LoadShareReportCompleted),
    //     pipe(
    //         map(
    //             () => new SnackbarOpen({
    //                 message: this.snackBarMessage,
    //                 action: this.translateService.instant(ConstantVariables.success)
    //             })
    //         )
    //     )
    // );

    @Effect()
    loadAuditReportsList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportListTriggered>(AuditReportActionTypes.LoadReportListTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditReports(getAction.reports).pipe(
                map((reports: any) => {
                    if (reports.success == true)
                        return new LoadReportListCompleted(reports.data);
                    else {
                        this.validationMessages = reports.apiResponseMessages
                        return new ReportFailed(reports.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new ReportException(err));
                })
            );
        })
    );

    @Effect()
    showValidationMessagesForAuditReport$: Observable<Action> = this.actions$.pipe(
        ofType<ReportFailed>(AuditReportActionTypes.ReportFailed),
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
        ofType<ReportException>(AuditReportActionTypes.ReportException),
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