import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ToastrService } from "ngx-toastr";

import {
    ReportActionTypes, LoadReportTriggered, LoadReportCompleted, ReportException, ReportFailed, LoadReportByIdTriggered, LoadReportByIdCompleted, RefreshReportsList, LoadReportListTriggered, LoadReportListCompleted, LoadDetailedReportTriggered, LoadDetailedReportCompleted, LoadShareReportTriggered, LoadShareReportCompleted, LoadReportDeleteTriggered, LoadReportDeleteCompleted
} from '../actions/reports.actions';

import { TestRailService } from '../../services/testrail.service';
import { TranslateService } from "@ngx-translate/core";
import { ReportsList, TestRailReport } from '../../models/reports-list';
import { LoadProjectRelatedCountsTriggered } from '../actions/testrailprojects.actions';

import { CookieService } from "ngx-cookie-service";

import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';
import { ConstantVariables } from '../../constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowExceptionMessages } from '../actions/notification-validator.action';
import { State } from '../../../../store/reducers/index';

@Injectable()
export class ReportEffects {
    reportId: string;
    projectId: string;
    snackBarMessage: string;
    newReport: boolean;
    currentLang: boolean = false;
    validationMessages: any[];
    exceptionMessage: any;
    searchReport: TestRailReport;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    latestReportData: ReportsList[];

    constructor(private actions$: Actions, private testRailService: TestRailService, private translateService: TranslateService, private toastr: ToastrService, private softLabePipe: SoftLabelPipe, private store: Store<State>, private cookieService: CookieService) {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));

        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
            this.currentLang = false;
        }
        else {
            this.currentLang = true;
        }
    }

    @Effect()
    loadReports$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportTriggered>(ReportActionTypes.LoadReportTriggered),
        switchMap(getAction => {
            return this.testRailService.UpsertReport(getAction.report).pipe(
                map((report: any) => {
                    if (report.success == true) {
                        this.reportId = report.data;
                        this.projectId = getAction.report.projectId;
                        // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForReportCreated);
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined')
                            this.snackBarMessage = "Test report created successfully";
                        else if (currentCulture =='ko')
                            this.snackBarMessage = "테스트 보고서가 성공적으로 생성되었습니다.";
                        else
                            this.snackBarMessage = "నివేదిక విజయవంతంగా సృష్టించబడింది";
                        this.toastr.info("", this.softLabePipe.transform((this.translateService.instant(ConstantVariables.TestCaseReport)), this.softLabels));
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

    @Effect()
    loadReportCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportCompleted>(ReportActionTypes.LoadReportCompleted),
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
    loadReportsLoaded$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportCompleted>(ReportActionTypes.LoadReportCompleted),
        pipe(
            map(
                () => {
                    this.searchReport = new TestRailReport();
                    this.searchReport.reportId = this.reportId;
                    this.searchReport.isArchived = false;
                    return new LoadReportByIdTriggered(this.searchReport);
                }
            )
        )
    );

    @Effect()
    loadReportDelete$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportDeleteTriggered>(ReportActionTypes.LoadReportDeleteTriggered),
        switchMap(getAction => {
            return this.testRailService.UpsertReport(getAction.deleteReport).pipe(
                map((report: any) => {
                    if (report.success == true) {
                        this.projectId = getAction.deleteReport.projectId;
                        // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForReportDeleted);
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined')
                            this.snackBarMessage = "Test report deleted successfully";
                        else if (currentCulture =='ko')
                            this.snackBarMessage = "테스트 보고서가 성공적으로 삭제되었습니다.";
                        else
                            this.snackBarMessage = "నివేదిక విజయవంతంగా తొలగించబడింది";
                        return new LoadReportDeleteCompleted(report.data);
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

    @Effect()
    loadReportDeleteSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportDeleteCompleted>(ReportActionTypes.LoadReportDeleteCompleted),
        pipe(
            map(
                () => new SnackbarOpen({
                    message: this.snackBarMessage,
                    action: this.translateService.instant(ConstantVariables.success)
                })
            )
        )
    );

    @Effect()
    loadReportDeletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportDeleteCompleted>(ReportActionTypes.LoadReportDeleteCompleted),
        pipe(
            map(
                () => {
                    return new LoadProjectRelatedCountsTriggered(this.projectId);
                })
        )
    );

    @Effect()
    loadReportById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportByIdTriggered>(ReportActionTypes.LoadReportByIdTriggered),
        switchMap(getAction => {
            return this.testRailService.SearchReports(getAction.searchReport).pipe(
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
    loadReportByIdCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportByIdCompleted>(ReportActionTypes.LoadReportByIdCompleted),
        pipe(
            map(() => {
                // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForReportCreated);
                let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined')
                    this.snackBarMessage = "Test report created successfully";
                else if (currentCulture =='ko')
                    this.snackBarMessage = "테스트 보고서가 성공적으로 생성되었습니다.";
                else
                    this.snackBarMessage = "నివేదిక విజయవంతంగా సృష్టించబడింది";
                return new RefreshReportsList(this.latestReportData[0]);
            })
        )
    );

    @Effect()
    loadDetailedReportById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadDetailedReportTriggered>(ReportActionTypes.LoadDetailedReportTriggered),
        switchMap(getAction => {
            return this.testRailService.GetReportById(getAction.reportById).pipe(
                map((detailedReport: any) => {
                    if (detailedReport.success == true) {
                        return new LoadDetailedReportCompleted(detailedReport.data);
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
    loadReportByIdCompletedFully$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshReportsList>(ReportActionTypes.RefreshReportsList),
        pipe(
            map(
                () => {
                    return new LoadProjectRelatedCountsTriggered(this.projectId);
                }
            )
        )
    );

    @Effect()
    loadShareReport$: Observable<Action> = this.actions$.pipe(
        ofType<LoadShareReportTriggered>(ReportActionTypes.LoadShareReportTriggered),
        switchMap(getAction => {
            return this.testRailService.ShareReport(getAction.shareReport).pipe(
                map((reports: any) => {
                    if (reports.success == true) {
                        // this.snackBarMessage = this.softLabePipe.transform(this.translateService.instant(ConstantVariables.SuccessMessageForReportShared), this.softLabels);
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined')
                            this.snackBarMessage = "Mail will be sent once the test report is generated.";
                        else if (currentCulture == 'ko')
                            this.snackBarMessage = "테스트 보고서가 생성되면 메일이 발송됩니다.";
                        else
                            this.snackBarMessage = "పరీక్ష నివేదిక ఉత్పత్తి అయిన తర్వాత మెయిల్ పంపబడుతుంది.";
                        return new LoadShareReportCompleted(reports.data);
                    }
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
    loadShareReportSent$: Observable<Action> = this.actions$.pipe(
        ofType<LoadShareReportCompleted>(ReportActionTypes.LoadShareReportCompleted),
        pipe(
            map(
                () => new SnackbarOpen({
                    message: this.snackBarMessage,
                    action: this.translateService.instant(ConstantVariables.success)
                })
            )
        )
    );

    @Effect()
    loadReportsList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadReportListTriggered>(ReportActionTypes.LoadReportListTriggered),
        switchMap(getAction => {
            return this.testRailService.SearchReports(getAction.reports).pipe(
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
    showValidationMessagesForReport$: Observable<Action> = this.actions$.pipe(
        ofType<ReportFailed>(ReportActionTypes.ReportFailed),
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
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<ReportException>(ReportActionTypes.ReportException),
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