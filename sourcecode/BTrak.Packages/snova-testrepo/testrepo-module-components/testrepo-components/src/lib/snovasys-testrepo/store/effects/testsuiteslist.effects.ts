import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { TranslateService } from "@ngx-translate/core";
import { switchMap, map, catchError } from 'rxjs/operators';
import {
    TestSuiteActionTypes,
    LoadTestSuiteTriggered,
    LoadTestSuiteCompleted,
    LoadTestSuiteListTriggered,
    LoadTestSuiteListCompleted,
    LoadTestSuiteDeleteTriggered,
    LoadTestSuiteDeleteCompleted,
    TestSuiteException,
    TestSuiteFailed,
    LoadTestSuiteByIdTriggered,
    LoadTestSuiteByIdCompleted,
    RefreshTestSuitesList,
    TestSuiteEditCompletedWithInPlaceUpdate,
    LoadMultipleTestSuiteByIdTriggered,
    LoadMultipleTestSuiteByIdCompleted,
    MoveTestSuiteCompleted,
    MoveTestSuiteTriggered,
    MoveTestSuiteFailed
} from '../actions/testsuiteslist.action';

import { CookieService } from "ngx-cookie-service";

import { LoadProjectRelatedCountsTriggered } from '../actions/testrailprojects.actions';

import { TestRailService } from '../../services/testrail.service';
import { TestSuiteList, TestSuiteMultipleUpdates } from '../../models/testsuite';

import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';
import { ConstantVariables } from '../../constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowExceptionMessages } from '../actions/notification-validator.action';
import { State } from '../../../../store/reducers/index';

@Injectable()
export class TestSuiteEffects {
    testSuiteId: string;
    projectId: string;
    snackBarMessage: string;
    deletedTestSuiteId: string;
    newTestSuite: boolean;
    validationMessages: any[];
    exceptionMessage: any;
    currentLang: boolean = false;
    oldProjectId: string;
    isMovingToAnotherProject: boolean;
    searchTestSuite: TestSuiteList;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    latestTestSuiteData: TestSuiteList[];

    constructor(private actions$: Actions, private softLabePipe: SoftLabelPipe, private testRailService: TestRailService, private translateService: TranslateService, private store: Store<State>, private cookieService: CookieService) {
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
    loadtestSuites$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteTriggered>(TestSuiteActionTypes.LoadTestSuiteTriggered),
        switchMap(getAction => {
            return this.testRailService.UpsertTestSuite(getAction.testSuite).pipe(
                map((testSuites: any) => {
                    if (testSuites.success == true) {
                        this.testSuiteId = testSuites.data;
                        this.projectId = getAction.testSuite.projectId;
                        this.oldProjectId = getAction.testSuite.oldProjectId;
                        this.isMovingToAnotherProject = getAction.testSuite.isMovingToAnotherProject;
                        let lang = false;
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
                            lang = false;
                        }
                        else {
                            lang = true;
                        }
                        if (getAction.testSuite.testSuiteId && getAction.testSuite.isArchived == true) {
                            this.newTestSuite = false;
                            // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestSuiteDeleted);
                            if (!lang)
                                this.snackBarMessage = "Scenario deleted successfully";
                            else if (currentCulture == 'ko')
                                this.snackBarMessage = "시나리오가 성공적으로 삭제되었습니다.";
                            else
                                this.snackBarMessage = "సందర్భం విజయవంతంగా తొలగించబడింది";
                        }
                        else if (getAction.testSuite.testSuiteId) {
                            this.newTestSuite = false;
                            // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestSuiteEdited);
                            if (!lang)
                                this.snackBarMessage = "Scenario edited successfully";
                            else if (currentCulture == 'ko')
                                this.snackBarMessage = "시나리오가 성공적으로 편집되었습니다.";
                            else
                                this.snackBarMessage = "సందర్భం సవరించబడింది";
                        }
                        else {
                            this.newTestSuite = true;
                            // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageFortestSuiteCreated);
                            if (!lang)
                                this.snackBarMessage = "Scenario created successfully";
                            else if (currentCulture == 'ko')
                                this.snackBarMessage = "시나리오가 성공적으로 생성되었습니다.";
                            else
                                this.snackBarMessage = "సందర్భం విజయవంతంగా రూపొందించబడింది";
                        }
                        return new LoadTestSuiteCompleted(testSuites.data);
                    }
                    else {
                        this.validationMessages = testSuites.apiResponseMessages
                        return new TestSuiteFailed(testSuites.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestSuiteException(err));
                })
            );
        })
    );

    @Effect()
    movetestSuites$: Observable<Action> = this.actions$.pipe(
        ofType<MoveTestSuiteTriggered>(TestSuiteActionTypes.MoveTestSuiteTriggered),
        switchMap(getAction => {
            return this.testRailService.moveTestSuite(getAction.testSuite).pipe(
                map((testSuites: any) => {
                    if (testSuites.success == true) {
                        this.testSuiteId = testSuites.data;
                        this.projectId = getAction.testSuite.projectId;
                        this.oldProjectId = getAction.testSuite.oldProjectId;
                        let lang = false;
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
                            lang = false;
                        }
                        else {
                            lang = true;
                        }
                        
                        return new MoveTestSuiteCompleted(testSuites.data);
                    }
                    else {
                        this.validationMessages = testSuites.apiResponseMessages
                        return new MoveTestSuiteFailed(testSuites.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestSuiteException(err));
                })
            );
        })
    );

    @Effect()
    testSuiteDelete$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteDeleteTriggered>(TestSuiteActionTypes.LoadTestSuiteDeleteTriggered),
        switchMap(getAction => {
            return this.testRailService.DeleteTestSuite(getAction.deleteTestSuite).pipe(
                map((testSuites: any) => {
                    if (testSuites.success == true) {
                        this.projectId = getAction.deleteTestSuite.projectId;
                        this.newTestSuite = false;
                        this.deletedTestSuiteId = testSuites.data;
                        // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestSuiteDeleted);
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined')
                            this.snackBarMessage = "Scenario deleted successfully";
                        else if (currentCulture == 'ko')
                            this.snackBarMessage = "시나리오가 성공적으로 삭제되었습니다.";
                        else
                            this.snackBarMessage = "సందర్భం విజయవంతంగా తొలగించబడింది";
                        return new LoadTestSuiteDeleteCompleted(testSuites.data);
                    }
                    else {
                        this.validationMessages = testSuites.apiResponseMessages
                        return new TestSuiteFailed(testSuites.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestSuiteException(err));
                })
            );
        })
    );

    @Effect()
    loadtestSuiteDeleteSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteDeleteCompleted>(TestSuiteActionTypes.LoadTestSuiteDeleteCompleted),
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
    loadtestSuiteDeleteSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteDeleteCompleted>(TestSuiteActionTypes.LoadTestSuiteDeleteCompleted),
        pipe(
            map(
                () => {
                    return new LoadProjectRelatedCountsTriggered(this.projectId);
                }
            )
        )
    );

    @Effect()
    movetestSuiteSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<MoveTestSuiteCompleted>(TestSuiteActionTypes.MoveTestSuiteCompleted),
        pipe(
            map(
                () => {
                    return new LoadProjectRelatedCountsTriggered(this.oldProjectId);
                }
            )
        )
    );

    @Effect()
    loadTestSuiteCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteCompleted>(TestSuiteActionTypes.LoadTestSuiteCompleted),
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
    loadtestSuitesSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteCompleted>(TestSuiteActionTypes.LoadTestSuiteCompleted),
        pipe(
            map(
                () => {
                    this.searchTestSuite = new TestSuiteList();
                    this.searchTestSuite.testSuiteId = this.testSuiteId;
                        return new LoadTestSuiteByIdTriggered(this.searchTestSuite);
                }
            )
        )
    );

    @Effect()
    loadTestSuiteById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteByIdTriggered>(TestSuiteActionTypes.LoadTestSuiteByIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestSuiteList(getAction.searchTestSuite).pipe(
                map((searchTestSuites: any) => {
                    if (searchTestSuites.success == true) {
                        this.latestTestSuiteData = searchTestSuites.data;
                        return new LoadTestSuiteByIdCompleted(searchTestSuites.data);
                    }
                    else {
                        this.validationMessages = searchTestSuites.apiResponseMessages
                        return new TestSuiteFailed(searchTestSuites.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestSuiteException(err));
                })
            );
        })
    );

    @Effect()
    loadMultipleTestSuites$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMultipleTestSuiteByIdTriggered>(TestSuiteActionTypes.LoadMultipleTestSuiteByIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestSuiteList(getAction.searchMultipleTestSuites).pipe(
                map((multipleTestSuites: any) => {
                    if (multipleTestSuites.success == true) {
                        let suitesList = this.convertSuitesToJson(multipleTestSuites.data);
                        return new LoadMultipleTestSuiteByIdCompleted({
                            multipleTestSuites: suitesList
                        });
                    }
                    else {
                        this.validationMessages = multipleTestSuites.apiResponseMessages
                        return new TestSuiteFailed(multipleTestSuites.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestSuiteException(err));
                })
            );
        })
    );

    @Effect()
    loadTestSuiteByIdCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteByIdCompleted>(TestSuiteActionTypes.LoadTestSuiteByIdCompleted),
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
                if (this.newTestSuite) {
                    // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageFortestSuiteCreated);
                    if (!lang)
                        this.snackBarMessage = "Scenario created successfully";
                    else if (currentCulture == 'ko')
                        this.snackBarMessage = "시나리오가 성공적으로 생성되었습니다.";
                    else
                        this.snackBarMessage = "సందర్భం విజయవంతంగా రూపొందించబడింది";
                    return new RefreshTestSuitesList(this.latestTestSuiteData[0]);
                }
                else {
                    // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestSuiteEdited);
                    if (!lang)
                        this.snackBarMessage = "Scenario edited successfully";
                    else if (currentCulture == 'ko')
                        this.snackBarMessage = "시나리오가 성공적으로 편집되었습니다.";
                    else
                        this.snackBarMessage = "సందర్భం విజయవంతంగా సవరించబడింది";
                    return new TestSuiteEditCompletedWithInPlaceUpdate({
                        testSuiteUpdate: {
                            id: this.latestTestSuiteData[0].testSuiteId,
                            changes: this.latestTestSuiteData[0]
                        }
                    });
                }
            })
        )
    );

    @Effect()
    loadTestSuiteByIdCompletedSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshTestSuitesList>(TestSuiteActionTypes.RefreshTestSuitesList),
        pipe(
            map(
                () => {
                    return new LoadProjectRelatedCountsTriggered(this.projectId);
                }
            )
        )
    );

    @Effect()
    loadTestSuitesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteListTriggered>(TestSuiteActionTypes.LoadTestSuiteListTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestSuiteList(getAction.testSuites).pipe(
                map((testSuites: any) => {
                    if (testSuites.success == true)
                        return new LoadTestSuiteListCompleted(testSuites.data);
                    else {
                        this.validationMessages = testSuites.apiResponseMessages
                        return new TestSuiteFailed(testSuites.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestSuiteException(err));
                })
            );
        })
    );

    @Effect()
    showValidationMessagesForTestSuite$: Observable<Action> = this.actions$.pipe(
        ofType<TestSuiteFailed>(TestSuiteActionTypes.TestSuiteFailed),
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
    showValidationMessagesForMoveTestSuite$: Observable<Action> = this.actions$.pipe(
        ofType<MoveTestSuiteFailed>(TestSuiteActionTypes.MoveTestSuiteFailed),
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
        ofType<TestSuiteException>(TestSuiteActionTypes.TestSuiteException),
        pipe(
            map(
                () =>
                    new ShowExceptionMessages({
                        message: this.exceptionMessage.message
                    })
            )
        )
    );

    convertSuitesToJson(suitesList) {
        let finalSuitesList = [];
        suitesList.forEach(element => {
            let suiteUpdatesModel = new TestSuiteMultipleUpdates();
            suiteUpdatesModel.id = element.testSuiteId;
            suiteUpdatesModel.changes = element;
            finalSuitesList.push(suiteUpdatesModel);
        });
        return finalSuitesList;
    }
}