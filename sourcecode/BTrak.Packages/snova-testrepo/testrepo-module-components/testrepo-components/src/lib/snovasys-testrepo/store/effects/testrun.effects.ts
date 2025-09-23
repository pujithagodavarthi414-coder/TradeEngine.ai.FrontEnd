import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { TranslateService } from "@ngx-translate/core";
import {
    TestRunActionTypes,
    LoadTestRunTriggered,
    LoadTestRunCompleted,
    LoadTestRunListTriggered,
    LoadTestRunListCompleted,
    TestRunFailed,
    TestRunException,
    LoadTestRunByIdTriggered,
    LoadTestRunByIdCompleted,
    RefreshTestRunsList,
    TestRunEditCompletedWithInPlaceUpdate,
    LoadTestRunDeleteTriggered,
    LoadTestRunDeleteCompleted,
    LoadTestRunByIdForStatusTriggered,
    LoadTestRunByIdForStatusCompleted,
    TestRunEditCompletedWithInPlaceUpdateForStatus
} from '../actions/testrun.actions';

import { LoadTestSuiteByIdTriggered } from '../actions/testsuiteslist.action';

import { TestRailService } from '../../services/testrail.service';
import { TestRunList, TestRun } from '../../models/testrun';
import { LoadProjectRelatedCountsTriggered } from '../actions/testrailprojects.actions';
import { TestSuiteList } from '../../models/testsuite';

import { CookieService } from "ngx-cookie-service";

import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';
import { ConstantVariables } from '../../constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowExceptionMessages } from '../actions/notification-validator.action';
import { State } from '../../../../store/reducers/index';

@Injectable()

export class TestRunEffects {
    testRunId: string;
    projectId: string;
    snackBarMessage: string;
    validationMessages: any[];
    exceptionMessage: any;
    testSuiteId: string;
    newTestRun: boolean = false;
    isCompleted: boolean = false;
    currentLang: boolean = false;
    searchTestRun: TestRun;
    latestTestRunData: TestRunList;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];

    constructor(private actions$: Actions, private testRailService: TestRailService, private softLabePipe: SoftLabelPipe, private translateService: TranslateService, private store: Store<State>, private cookieService: CookieService) {
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
    loadTestRun$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunTriggered>(TestRunActionTypes.LoadTestRunTriggered),
        switchMap(getAction => {
            return this.testRailService.UpsertTestRun(getAction.testRun).pipe(
                map((testRunId: any) => {
                    if (testRunId.success == true) {
                        this.testRunId = testRunId.data;
                        this.testSuiteId = getAction.testRun.testSuiteId;
                        this.projectId = getAction.testRun.projectId;
                        this.isCompleted = getAction.testRun.isCompleted;
                        let lang = false;
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
                            lang = false;
                        }
                        else {
                            lang = true;
                        }
                        if (getAction.testRun.testRunId) {
                            this.newTestRun = false;
                            // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestRunEdited);
                            if (!lang)
                                this.snackBarMessage = "Run edited successfully";
                            else if (currentCulture == 'ko')
                                this.snackBarMessage = "성공적으로 편집 된 실행";
                            else
                                this.snackBarMessage = "పరుగు విజయవంతంగా సవరించబడింది";
                        }
                        else {
                            this.newTestRun = true;
                            // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestRunCreated);
                            if (!lang)
                                this.snackBarMessage = "Run created successfully";
                            else if (currentCulture == 'ko')
                                this.snackBarMessage = "실행이 성공적으로 생성되었습니다.";
                            else
                                this.snackBarMessage = "పరుగు విజయవంతంగా సృష్టించబడింది";
                        }
                        return new LoadTestRunCompleted(testRunId.data);
                    }
                    else {
                        this.validationMessages = testRunId.apiResponseMessages
                        return new TestRunFailed(testRunId.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestRunException(err));
                })
            );
        })
    );

    @Effect()
    loadTestRunCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunCompleted>(TestRunActionTypes.LoadTestRunCompleted),
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
    loadTestRunCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunCompleted>(TestRunActionTypes.LoadTestRunCompleted),
        pipe(
            map(
                () => {
                    this.searchTestRun = new TestRun();
                    this.searchTestRun.projectId = this.projectId;
                    this.searchTestRun.testRunId = this.testRunId;
                    this.searchTestRun.isArchived = false;
                    this.searchTestRun.isCompleted = this.isCompleted;
                    return new LoadTestRunByIdTriggered(this.searchTestRun);
                }
            )
        )
    );

    @Effect()
    loadTestRunById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunByIdTriggered>(TestRunActionTypes.LoadTestRunByIdTriggered),
        switchMap(getAction => {
            return this.testRailService.SearchTestRuns(getAction.searchTestRun).pipe(
                map((searchTestRuns: any) => {
                    if (searchTestRuns.success == true) {
                        this.latestTestRunData = searchTestRuns.data;
                        return new LoadTestRunByIdCompleted(searchTestRuns.data);
                    }
                    else {
                        this.validationMessages = searchTestRuns.apiResponseMessages
                        return new TestRunFailed(searchTestRuns.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestRunException(err));
                })
            );
        })
    );

    @Effect()
    loadTestRunByIdCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunByIdCompleted>(TestRunActionTypes.LoadTestRunByIdCompleted),
        pipe(
            map(() => {
                let lang = false;
                let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
                    lang = false;
                }
                else {
                    lang = true;
                }
                if (this.newTestRun) {
                    // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestRunCreated);
                    if (!lang)
                        this.snackBarMessage = "Run created successfully";
                    else if (currentCulture == 'ko')
                        this.snackBarMessage = "실행이 성공적으로 생성되었습니다.";
                    else
                        this.snackBarMessage = "పరుగు విజయవంతంగా సృష్టించబడింది";
                    return new RefreshTestRunsList(this.latestTestRunData[0]);
                }
                else {
                    // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestRunEdited);
                    if (!lang)
                        this.snackBarMessage = "Run edited successfully";
                    else if (currentCulture == 'ko')
                        this.snackBarMessage = "성공적으로 편집 된 실행";
                    else
                        this.snackBarMessage = "పరుగు విజయవంతంగా సవరించబడింది";
                    return new TestRunEditCompletedWithInPlaceUpdate({
                        testRunUpdate: {
                            id: this.latestTestRunData[0].testRunId,
                            changes: this.latestTestRunData[0]
                        }
                    });
                }
            })
        )
    );

    @Effect()
    loadTestRunByIdForStatus$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunByIdForStatusTriggered>(TestRunActionTypes.LoadTestRunByIdForStatusTriggered),
        switchMap(getAction => {
            return this.testRailService.SearchTestRuns(getAction.searchTestRunForStatus).pipe(
                map((searchTestRuns: any) => {
                    if (searchTestRuns.success == true) {
                        this.latestTestRunData = searchTestRuns.data;
                        return new LoadTestRunByIdForStatusCompleted(searchTestRuns.data);
                    }
                    else {
                        this.validationMessages = searchTestRuns.apiResponseMessages
                        return new TestRunFailed(searchTestRuns.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestRunException(err));
                })
            );
        })
    );

    @Effect()
    loadTestRunByIdCompletedForStatus$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunByIdForStatusCompleted>(TestRunActionTypes.LoadTestRunByIdForStatusCompleted),
        pipe(
            map(() => {
                return new TestRunEditCompletedWithInPlaceUpdateForStatus({
                    testRunUpdateForStatus: {
                        id: this.latestTestRunData[0].testRunId,
                        changes: this.latestTestRunData[0]
                    }
                });
            })
        )
    );

    @Effect()
    testRunDelete$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunDeleteTriggered>(TestRunActionTypes.LoadTestRunDeleteTriggered),
        switchMap(getAction => {
            return this.testRailService.DeleteTestRun(getAction.deleteTestRun).pipe(
                map((testRuns: any) => {
                    if (testRuns.success == true) {
                        this.projectId = getAction.deleteTestRun.projectId;
                        this.newTestRun = false;
                        // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestRunDeleted);
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined')
                            this.snackBarMessage = "Run deleted successfully";
                        else if (currentCulture == 'ko')
                            this.snackBarMessage ="실행이 성공적으로 삭제되었습니다.";
                        else
                            this.snackBarMessage = "పరుగు విజయవంతంగా తొలగించబడింది";
                        return new LoadTestRunDeleteCompleted(testRuns.data);
                    }
                    else {
                        this.validationMessages = testRuns.apiResponseMessages
                        return new TestRunFailed(testRuns.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestRunException(err));
                })
            );
        })
    );

    @Effect()
    loadtestRunDeleteSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunDeleteCompleted>(TestRunActionTypes.LoadTestRunDeleteCompleted),
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
    loadtestRunDeleteSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunDeleteCompleted>(TestRunActionTypes.LoadTestRunDeleteCompleted),
        pipe(
            map(
                () => {
                    return new LoadProjectRelatedCountsTriggered(this.projectId);
                }
            )
        )
    );

    @Effect()
    loadTestRunByIdCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshTestRunsList>(TestRunActionTypes.RefreshTestRunsList),
        pipe(
            map(
                () => {
                    return new LoadProjectRelatedCountsTriggered(this.projectId);
                }
            )
        )
    );

    @Effect()
    loadTestRunByIdCompletedSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshTestRunsList>(TestRunActionTypes.RefreshTestRunsList),
        pipe(
            map(
                () => {
                    let searchTestSuite = new TestSuiteList();
                    searchTestSuite.testSuiteId = this.testSuiteId;
                    searchTestSuite.isArchived = false;
                    return new LoadTestSuiteByIdTriggered(searchTestSuite);
                }
            )
        )
    );

    @Effect()
    loadTestRunDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunListTriggered>(TestRunActionTypes.LoadTestRunListTriggered),
        switchMap(getAction => {
            return this.testRailService.SearchTestRuns(getAction.testRuns).pipe(
                map((testRunsList: any) => {
                    if (testRunsList.success == true)
                        return new LoadTestRunListCompleted(testRunsList.data);
                    else {
                        this.validationMessages = testRunsList.apiResponseMessages
                        return new TestRunFailed(testRunsList.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestRunException(err));
                })
            );
        })
    );

    @Effect()
    showValidationMessagesForTestRun$: Observable<Action> = this.actions$.pipe(
        ofType<TestRunFailed>(TestRunActionTypes.TestRunFailed),
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
        ofType<TestRunException>(TestRunActionTypes.TestRunException),
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