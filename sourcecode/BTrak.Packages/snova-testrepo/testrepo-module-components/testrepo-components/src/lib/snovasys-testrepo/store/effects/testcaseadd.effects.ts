import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { TranslateService } from "@ngx-translate/core";
import { switchMap, map, catchError } from 'rxjs/operators';
import { CookieService } from "ngx-cookie-service";
import {
    TestCaseActionTypes,
    LoadTestCaseTriggered,
    LoadTestCaseCompleted,
    LoadTestCaseFailed,
    TestCaseExceptionHandled,
    LoadTestCaseDetailsTriggered,
    LoadTestCaseDetailsCompleted,
    LoadTestCaseTitleTriggered,
    LoadTestCaseTitleCompleted,
    LoadTestCaseTitleDeleteTriggered,
    LoadTestCaseTitleDeleteCompleted,
    LoadTestCasesBySectionIdTriggered,
    LoadTestCasesBySectionIdCompleted,
    LoadTestCaseAssignToTriggered,
    LoadTestCaseAssignToCompleted,
    LoadTestCaseStatusTriggered,
    LoadTestCaseStatusCompleted,
    LoadTestCasesBySectionIdForRunsTriggered,
    LoadTestCasesBySectionIdForRunsCompleted,
    LoadTestCasesBySectionAndRunIdTriggered,
    LoadTestCasesBySectionAndRunIdCompleted,
    LoadTestCaseBySectionAndRunIdAfterStatusTriggered,
    LoadTestCaseBySectionAndRunIdAfterStatusCompleted,
    LoadTestCaseStatusFailed,
    TestCaseStatusExceptionHandled,
    TestCaseStatusEditWithInPlaceUpdateForStatus,
    LoadTestCaseAfterEditTriggered,
    LoadTestCaseAfterEditCompleted,
    TestCaseEditWithInPlaceUpdate,
    LoadMultipleTestRunResultTriggered,
    LoadMultipleTestRunResultCompleted,
    LoadUpdateTestRunResultTriggered,
    LoadUpdateTestRunResultCompleted,
    LoadTestCasesByUserStoryIdTriggered,
    LoadTestCasesByUserStoryIdCompleted,
    LoadMultipleTestCasesBySectionIdTriggered,
    LoadMultipleTestCasesBySectionIdCompleted,
    LoadSingleTestCaseBySectionIdTriggered,
    LoadSingleTestCaseBySectionIdCompleted,
    LoadSingleTestRunCaseBySectionIdTriggered,
    LoadSingleTestRunCaseBySectionIdCompleted,
    LoadTestCasesByFilterForRunsTriggered,
    LoadTestCasesByFilterForRunsCompleted,
    LoadMultipleTestCasesByUserStoryIdTriggered,
    LoadMultipleTestCasesByUserStoryIdCompleted,
    LoadSingleTestCasesByUserStoryIdEditCompleted,
    LoadTestCaseScenarioDeleteTriggered,
    LoadTestCaseScenarioDeleteCompleted,
    LoadTestCaseScenarioStatusTriggered,
    LoadTestCaseScenarioStatusCompleted,
    LoadBugsByUserStoryIdTriggered,
    LoadBugsByUserStoryIdCompleted,
    LoadHistoryByUserStoryIdTriggered,
    LoadHistoryByUserStoryIdCompleted,
    LoadBugsByGoalIdTriggered,
    LoadBugsByGoalIdCompleted,
    LoadTestCaseViewTriggered,
    LoadTestCaseViewCompleted,
    LoadCopyOrMoveCasesTriggered,
    LoadCopyOrMoveCasesCompleted,
    LoadTestCaseStepTriggered,
    LoadTestCaseStepCompleted,
    LoadTestCaseStepAfterEditTriggered,
    LoadTestCaseStepAfterEditCompleted,
    LoadTestCaseReorderTriggered,
    LoadTestCaseReorderCompleted,
    LoadMoveTestCasesTriggered,
    LoadMoveTestCasesCompleted,
    DeleteMultipleTestCases,
    LoadTestCaseAfterReorderEditTriggered,
    LoadTestCaseAfterReorderEditCompleted,
    LoadMultipleTestCasesDelete,
    LoadTestCaseBySectionAndRunIdAfterBugStatusTriggered,
    LoadTestCaseBySectionAndRunIdAfterBugStatusCompleted,
    TestCaseStatusEditWithInPlaceUpdateForBugStatus,
    LoadBugsByTestCaseIdTriggered,
    LoadBugsByTestCaseIdCompleted,
    LoadTestCasesByFilterForSuitesTriggered,
    LoadTestCasesByFilterForSuitesCompleted
} from '../actions/testcaseadd.actions';

import { LoadTestSuiteByIdTriggered, TestSuiteActionTypes, TestSuiteEditCompletedWithInPlaceUpdate, LoadMultipleTestSuiteByIdTriggered } from '../actions/testsuiteslist.action';
import { LoadTestRunByIdForStatusTriggered } from '../actions/testrun.actions';
import { LoadTestSuiteSectionListTriggered } from '../actions/testsuitesection.actions';
import { LoadTestCaseTypeListFromCache } from '../actions/testcasetypes.actions';

import { TestRailService } from '../../services/testrail.service';
import { State } from '../../../../store/reducers/index';
import { TestSuiteList } from '../../models/testsuite';
import { TestCase } from '../../models/testcase';
import { TestRun } from '../../models/testrun';
import { TestSuiteRunSections } from '../../models/testsuitesection';

import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';
import { ConstantVariables } from '../../constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()

export class TestCaseEffects {
    snackBarMessage: string;
    latestTesCaseAfterStatusData: TestCase;
    latestTesCaseAfterEditData: TestCase[];
    validationMessages: any[];
    exceptionMessage: any;
    testSuiteId: string;
    shiftTestSuiteId: string;
    shiftSourceTestSuiteId: string;
    sectionId: string;
    currentSectionId: string;
    shiftAppendToSection: string;
    testRunId: string;
    testCaseId: string;
    userStoryId: string;
    multipleTestCaseIds: string[];
    moveCaseIds: string[];
    isShiftCopy: boolean;
    softLabels: SoftLabelConfigurationModel[];
    isHierarchical: boolean = false;
    isShiftHierarchical: boolean = false;
    insertingScenarios: boolean = false;
    isStatusUpdated: boolean = false;
    singleEditingScenario: boolean = false;
    currentLang: boolean = false;
    isShiftCasesOnly: boolean = false;
    isShiftSectionsAndParents: boolean = false;
    isTestCaseCopy: boolean = false;
    showMessage: boolean = false;

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
    loadTestCase$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseTriggered>(TestCaseActionTypes.LoadTestCaseTriggered),
        switchMap(getAction => {
            return this.testRailService.UpsertTestCase(getAction.testCase).pipe(
                map((testCaseId: any) => {
                    if (testCaseId.success == true) {
                        this.testSuiteId = getAction.testCase.testSuiteId;
                        this.sectionId = getAction.testCase.sectionId;
                        this.testCaseId = getAction.testCase.testCaseId;
                        // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestCaseEdited);
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
                            this.snackBarMessage = "Test case updated successfully";
                        }
                        else if (currentCulture == 'ko'){
                            this.snackBarMessage = "테스트 케이스가 성공적으로 업데이트되었습니다.";
                        }
                        else {
                            this.snackBarMessage = "పరీక్ష కేసు విజయవంతంగా నవీకరించబడింది";
                        }
                        if (getAction.testCase.userStoryId) {
                            this.userStoryId = getAction.testCase.userStoryId;
                            this.insertingScenarios = true;
                            this.singleEditingScenario = true;
                        }
                        else
                            this.insertingScenarios = false;
                        if (getAction.testCase.changeSection) {
                            let searchTestCases = new TestCase();
                            searchTestCases.sectionId = getAction.testCase.oldSectionId;
                            searchTestCases.isFilter = false;
                            searchTestCases.isArchived = false;
                            return new LoadTestCasesBySectionIdTriggered(searchTestCases);
                        }
                        else
                            return new LoadTestCaseCompleted(testCaseId.data);
                    }
                    else {
                        this.validationMessages = testCaseId.apiResponseMessages
                        return new LoadTestCaseFailed(testCaseId.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCaseScenarioStatusEdit$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseScenarioStatusTriggered>(TestCaseActionTypes.LoadTestCaseScenarioStatusTriggered),
        switchMap(getAction => {
            return this.testRailService.UpsertTestCaseScenario(getAction.testCaseStatusScenario).pipe(
                map((testCaseStatusScenarioId: any) => {
                    if (testCaseStatusScenarioId.success == true) {
                        this.testSuiteId = getAction.testCaseStatusScenario.testSuiteId;
                        this.sectionId = getAction.testCaseStatusScenario.sectionId;
                        this.testCaseId = getAction.testCaseStatusScenario.testCaseId;
                        this.userStoryId = getAction.testCaseStatusScenario.userStoryId;
                        this.insertingScenarios = true;
                        this.singleEditingScenario = true;
                        // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestCaseEdited);
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
                            this.snackBarMessage = "Test case updated successfully";
                        }
                        else if (currentCulture == 'ko'){
                            this.snackBarMessage = "테스트 케이스가 성공적으로 업데이트되었습니다.";
                        }
                        else {
                            this.snackBarMessage = "పరీక్ష కేసు విజయవంతంగా నవీకరించబడింది";
                        }
                        return new LoadTestCaseScenarioStatusCompleted(testCaseStatusScenarioId.data);
                    }
                    else {
                        this.validationMessages = testCaseStatusScenarioId.apiResponseMessages
                        return new LoadTestCaseFailed(testCaseStatusScenarioId.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCaseTitle$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseTitleTriggered>(TestCaseActionTypes.LoadTestCaseTitleTriggered),
        switchMap(getAction => {
            return this.testRailService.UpsertTestCaseTitle(getAction.testCaseTitle).pipe(
                map((testCaseTitleId: any) => {
                    if (testCaseTitleId.success == true) {
                        this.testSuiteId = getAction.testCaseTitle.testSuiteId;
                        if (getAction.testCaseTitle.isHierarchical) {
                            this.sectionId = getAction.testCaseTitle.hierarchicalSectionId;
                            this.isHierarchical = true;
                        }
                        else {
                            this.sectionId = getAction.testCaseTitle.sectionId;
                            this.isHierarchical = false;
                        }
                        if (getAction.testCaseTitle.userStoryId) {
                            this.userStoryId = getAction.testCaseTitle.userStoryId;
                            this.insertingScenarios = true;
                            this.singleEditingScenario = false;
                        }
                        else {
                            this.insertingScenarios = false;
                        }
                        let lang = false;
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
                            lang = false;
                        }
                        else {
                            lang = true;
                        }
                        if (getAction.testCaseTitle.testCaseId) {
                            // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForCaseTitleEdited);
                            if (!lang) {
                                this.snackBarMessage = "Test cases edited successfully";
                            }
                            else if (currentCulture == 'ko'){
                                this.snackBarMessage = "성공적으로 편집 된 테스트 케이스";
                            }
                            else {
                                this.snackBarMessage = "పరీక్ష కేసులు విజయవంతంగా సవరించబడ్డాయి";
                            }
                        }
                        else {
                            // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForCaseTitleCreated);
                            if (!lang) {
                                this.snackBarMessage = "Test cases created successfully";
                            }
                            else if (currentCulture == 'ko'){
                                this.snackBarMessage = "성공적으로 생성 된 테스트 케이스";
                            }
                            else {
                                this.snackBarMessage = "పరీక్ష కేసులు విజయవంతంగా సృష్టించబడ్డాయి";
                            }
                        }
                        this.multipleTestCaseIds = testCaseTitleId.data;
                        return new LoadTestCaseTitleCompleted(testCaseTitleId.data);
                    }
                    else {
                        this.validationMessages = testCaseTitleId.apiResponseMessages
                        return new LoadTestCaseFailed(testCaseTitleId.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCaseDelete$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseTitleDeleteTriggered>(TestCaseActionTypes.LoadTestCaseTitleDeleteTriggered),
        switchMap(getAction => {
            return this.testRailService.DeleteTestCase(getAction.testCaseDelete).pipe(
                map((testCaseDeleteId: any) => {
                    if (testCaseDeleteId.success == true) {
                        this.testSuiteId = getAction.testCaseDelete.testSuiteId;
                        // if (getAction.testCaseDelete.title.length > 200)
                        //     this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForCaseTitleDeleted);
                        // else
                        //     this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForCaseTitleDeleted);
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
                            this.snackBarMessage = "Test case deleted successfully";
                        }
                        else if (currentCulture == 'ko'){
                            this.snackBarMessage = "테스트 케이스가 성공적으로 삭제되었습니다.";
                        }
                        else {
                            this.snackBarMessage = "పరీక్ష కేసు విజయవంతంగా తొలగించబడింది";
                        }
                        return new LoadTestCaseTitleDeleteCompleted(testCaseDeleteId.data);
                    }
                    else {
                        this.validationMessages = testCaseDeleteId.apiResponseMessages
                        return new LoadTestCaseFailed(testCaseDeleteId.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadMultipleTestCasesDelete$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMultipleTestCasesDelete>(TestCaseActionTypes.LoadMultipleTestCasesDelete),
        switchMap(getAction => {
            return this.testRailService.DeleteTestCase(getAction.testCaseDelete).pipe(
                map((response: any) => {
                    if (response.success == true) {
                        this.testSuiteId = getAction.testCaseDelete.testSuiteId;
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
                            this.snackBarMessage = "Test cases deleted successfully";
                        }
                        else if (currentCulture == 'ko'){
                            this.snackBarMessage = "테스트 케이스가 성공적으로 삭제되었습니다.";
                        }
                        else {
                            this.snackBarMessage = "పరీక్ష కేసులు విజయవంతంగా తొలగించబడింది";
                        }
                        let result = response.data;
                        let Ids = [];
                        if (result)
                            Ids = result.split(',');
                        this.showMessage = true;
                        return new DeleteMultipleTestCases(Ids);
                    }
                    else {
                        this.validationMessages = response.apiResponseMessages
                        return new LoadTestCaseFailed(response.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadMultipleTestCasesDeletes$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteMultipleTestCases>(TestCaseActionTypes.DeleteMultipleTestCases),
        pipe(
            map(
                () => {
                    if (this.showMessage) {
                        return new SnackbarOpen({
                            message: this.snackBarMessage, // TODO: Change to proper toast message
                            action: this.translateService.instant(ConstantVariables.success)
                        })
                    }
                    else {
                        return new LoadTestCaseTypeListFromCache();
                    }
                })
        )
    );

    @Effect()
    loadMultipleTestCasesDeleteDone$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteMultipleTestCases>(TestCaseActionTypes.DeleteMultipleTestCases),
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
    loadTestCaseScenarioDelete$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseScenarioDeleteTriggered>(TestCaseActionTypes.LoadTestCaseScenarioDeleteTriggered),
        switchMap(getAction => {
            return this.testRailService.UpsertTestCaseScenario(getAction.testCaseScenarioDelete).pipe(
                map((testCaseDeleteId: any) => {
                    if (testCaseDeleteId.success == true) {
                        this.testSuiteId = getAction.testCaseScenarioDelete.testSuiteId;
                        // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForCaseTitleDeleted);
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
                            this.snackBarMessage = "Test case deleted successfully";
                        }
                        else if (currentCulture == 'ko'){
                            this.snackBarMessage = "테스트 케이스가 성공적으로 삭제되었습니다.";
                        }
                        else {
                            this.snackBarMessage = "పరీక్ష కేసు విజయవంతంగా తొలగించబడింది";
                        }
                        return new LoadTestCaseScenarioDeleteCompleted(testCaseDeleteId.data);
                    }
                    else {
                        this.validationMessages = testCaseDeleteId.apiResponseMessages
                        return new LoadTestCaseFailed(testCaseDeleteId.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    reOrderTestCases$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseReorderTriggered>(TestCaseActionTypes.LoadTestCaseReorderTriggered),
        switchMap(getAction => {
            return this.testRailService.ReorderTestCases(getAction.testCaseIdList).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadTestCaseReorderCompleted();
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new LoadTestCaseFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    moveTestCases$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMoveTestCasesTriggered>(TestCaseActionTypes.LoadMoveTestCasesTriggered),
        switchMap(getAction => {
            this.moveCaseIds = getAction.moveTestCasesModel.testCaseIds;
            this.testSuiteId = getAction.moveTestCasesModel.testSuiteId;
            this.isHierarchical = getAction.moveTestCasesModel.isHierarchical;
            this.isTestCaseCopy = getAction.moveTestCasesModel.isCopy;
            return this.testRailService.MoveTestCases(getAction.moveTestCasesModel).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadMoveTestCasesCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new LoadTestCaseFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    moveTestCasesCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMoveTestCasesCompleted>(TestCaseActionTypes.LoadMoveTestCasesCompleted),
        pipe(
            map(
                () => {
                    if (!this.isHierarchical && !this.isTestCaseCopy) {
                        this.showMessage = false;
                        return new DeleteMultipleTestCases(this.moveCaseIds);
                    }
                    else if (this.isTestCaseCopy) {
                        let searchTestSuite = new TestSuiteList();
                        searchTestSuite.testSuiteId = this.testSuiteId;
                        searchTestSuite.isArchived = false;
                        return new LoadTestSuiteByIdTriggered(searchTestSuite);
                    }
                    else
                        return new LoadTestCaseTypeListFromCache();
                }
            )
        )
    );

    @Effect()
    loadCopyOrMoveCases$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCopyOrMoveCasesTriggered>(TestCaseActionTypes.LoadCopyOrMoveCasesTriggered),
        switchMap(getAction => {
            return this.testRailService.UpsertCopyOrMoveCases(getAction.copyOrMoveCases).pipe(
                map((copyOrMoveCasesId: any) => {
                    if (copyOrMoveCasesId.success == true) {
                        this.isShiftHierarchical = getAction.copyOrMoveCases.isHierarchical;
                        this.shiftTestSuiteId = getAction.copyOrMoveCases.testSuiteId;
                        this.shiftSourceTestSuiteId = getAction.copyOrMoveCases.sourceTestSuiteId;
                        this.currentSectionId = getAction.copyOrMoveCases.currentSectionId;
                        this.shiftAppendToSection = getAction.copyOrMoveCases.appendToSectionId;
                        this.isShiftCopy = getAction.copyOrMoveCases.isCopy;
                        this.isShiftCasesOnly = getAction.copyOrMoveCases.isCasesOnly;
                        this.isShiftSectionsAndParents = getAction.copyOrMoveCases.isAllParents;
                        this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForCaseTitleDeleted);
                        return new LoadCopyOrMoveCasesCompleted(copyOrMoveCasesId.data);
                    }
                    else {
                        this.validationMessages = copyOrMoveCasesId.apiResponseMessages
                        return new LoadTestCaseFailed(copyOrMoveCasesId.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadCopyOrMoveCasesCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCopyOrMoveCasesCompleted>(TestCaseActionTypes.LoadCopyOrMoveCasesCompleted),
        pipe(
            map(
                () => {
                    let searchTestSuite = new TestSuiteList();
                    let testSuites = [];
                    testSuites.push(this.shiftTestSuiteId);
                    testSuites.push(this.shiftSourceTestSuiteId);
                    searchTestSuite.multipleTestSuiteIds = testSuites;
                    searchTestSuite.isArchived = false;
                    return new LoadMultipleTestSuiteByIdTriggered(searchTestSuite);
                }
            )
        )
    );

    @Effect()
    loadCopyOrMoveCasesCompletelySuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<TestSuiteEditCompletedWithInPlaceUpdate>(TestSuiteActionTypes.TestSuiteEditCompletedWithInPlaceUpdate),
        pipe(
            map(
                () => {
                    if (this.shiftSourceTestSuiteId && this.isShiftCopy == false) {
                        let searchTestSuite = new TestSuiteList();
                        searchTestSuite.testSuiteId = this.shiftSourceTestSuiteId;
                        searchTestSuite.isArchived = false;
                        this.shiftSourceTestSuiteId = null;
                        return new LoadTestSuiteByIdTriggered(searchTestSuite);
                    }
                    else
                        return new LoadTestCaseTypeListFromCache();
                }
            )
        )
    );

    @Effect()
    loadCopyOrMoveCasesCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCopyOrMoveCasesCompleted>(TestCaseActionTypes.LoadCopyOrMoveCasesCompleted),
        pipe(
            map(
                () => {
                    if (this.isShiftSectionsAndParents || (this.isShiftCasesOnly && (this.shiftAppendToSection == null || this.shiftAppendToSection == ''))) {
                        let sectionsList = new TestSuiteRunSections();
                        sectionsList.testSuiteId = this.shiftTestSuiteId;
                        return new LoadTestSuiteSectionListTriggered(sectionsList);
                    }
                    else if (this.isShiftCasesOnly && this.currentSectionId && this.shiftAppendToSection == this.currentSectionId) {
                        let testCaseSearch = new TestCase();
                        testCaseSearch.sectionId = this.currentSectionId;
                        testCaseSearch.isArchived = false;
                        testCaseSearch.isFilter = false;
                        testCaseSearch.isHierarchical = this.isShiftHierarchical;
                        return new LoadTestCasesBySectionIdTriggered(testCaseSearch);
                    }
                    else {
                        return new LoadTestCaseTypeListFromCache();
                    }
                }
            )
        )
    );

    @Effect()
    loadTestCaseAssignTo$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseAssignToTriggered>(TestCaseActionTypes.LoadTestCaseAssignToTriggered),
        switchMap(getAction => {
            return this.testRailService.UpdateTestCaseStatus(getAction.testCaseAssignTo).pipe(
                map((testCaseAssignId: any) => {
                    if (testCaseAssignId.success == true) {
                        this.testRunId = getAction.testCaseAssignTo.testRunId;
                        this.testCaseId = getAction.testCaseAssignTo.testCaseId;
                        this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForCaseAssignToUpdated);
                        return new LoadTestCaseAssignToCompleted(testCaseAssignId.data);
                    }
                    else {
                        this.validationMessages = testCaseAssignId.apiResponseMessages
                        return new LoadTestCaseFailed(testCaseAssignId.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCaseStatus$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseStatusTriggered>(TestCaseActionTypes.LoadTestCaseStatusTriggered),
        switchMap(getAction => {
            return this.testRailService.UpdateTestCaseStatus(getAction.testCaseStatus).pipe(
                map((testCaseStatus: any) => {
                    if (testCaseStatus.success == true) {
                        this.testRunId = getAction.testCaseStatus.testRunId;
                        this.testCaseId = getAction.testCaseStatus.testCaseId;
                        this.isStatusUpdated = getAction.testCaseStatus.isBugAdded;
                        this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForStatusUpdated);
                        return new LoadTestCaseStatusCompleted(testCaseStatus.data);
                    }
                    else {
                        this.validationMessages = testCaseStatus.apiResponseMessages
                        return new LoadTestCaseFailed(testCaseStatus.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCaseAssignToCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseAssignToCompleted>(TestCaseActionTypes.LoadTestCaseAssignToCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage, // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    loadTestCaseAssignToCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseAssignToCompleted>(TestCaseActionTypes.LoadTestCaseAssignToCompleted),
        pipe(
            map(
                () => {
                    let searchTestCase = new TestCase();
                    searchTestCase.testRunId = this.testRunId;
                    searchTestCase.testCaseId = this.testCaseId;
                    searchTestCase.isArchived = false;
                    return new LoadTestCaseBySectionAndRunIdAfterStatusTriggered(searchTestCase);
                }
            )
        )
    );

    @Effect()
    loadTestCaseStatusCompletedSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseStatusCompleted>(TestCaseActionTypes.LoadTestCaseStatusCompleted),
        pipe(
            map(
                () => {
                    let searchTestCase = new TestCase();
                    searchTestCase.testRunId = this.testRunId;
                    searchTestCase.testCaseId = this.testCaseId;
                    searchTestCase.isBugAdded = this.isStatusUpdated;
                    searchTestCase.isArchived = false;
                    return new LoadTestCaseBySectionAndRunIdAfterStatusTriggered(searchTestCase);
                }
            )
        )
    );

    @Effect()
    loadTestCaseStatusCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseStatusCompleted>(TestCaseActionTypes.LoadTestCaseStatusCompleted),
        pipe(
            map(
                () => {
                    let searchTestRun = new TestRun();
                    searchTestRun.testRunId = this.testRunId;
                    searchTestRun.isArchived = false;
                    return new LoadTestRunByIdForStatusTriggered(searchTestRun);
                }
            )
        )
    );

    @Effect()
    loadTestCaseCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseCompleted>(TestCaseActionTypes.LoadTestCaseCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage, // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    loadTestCaseStatusScenarioCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseScenarioStatusCompleted>(TestCaseActionTypes.LoadTestCaseScenarioStatusCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage, // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    loadTestCaseAfterEditCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseCompleted>(TestCaseActionTypes.LoadTestCaseCompleted),
        pipe(
            map(
                () => {
                    let searchTestCase = new TestCase();
                    searchTestCase.testSuiteId = this.testSuiteId;
                    searchTestCase.testCaseId = this.testCaseId;
                    searchTestCase.sectionId = this.sectionId;
                    searchTestCase.userStoryId = this.userStoryId;
                    searchTestCase.isArchived = false;
                    if (this.insertingScenarios)
                        return new LoadMultipleTestCasesByUserStoryIdTriggered(searchTestCase);
                    else
                        return new LoadTestCaseAfterEditTriggered(searchTestCase);
                }
            )
        )
    );

    @Effect()
    loadTestCaseStatusScenarioAfterEditCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseScenarioStatusCompleted>(TestCaseActionTypes.LoadTestCaseScenarioStatusCompleted),
        pipe(
            map(
                () => {
                    let searchTestCase = new TestCase();
                    searchTestCase.testSuiteId = this.testSuiteId;
                    searchTestCase.testCaseId = this.testCaseId;
                    searchTestCase.sectionId = this.sectionId;
                    searchTestCase.userStoryId = this.userStoryId;
                    searchTestCase.isArchived = false;
                    return new LoadMultipleTestCasesByUserStoryIdTriggered(searchTestCase);
                }
            )
        )
    );

    @Effect()
    loadTestCaseTitleCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMultipleTestCasesBySectionIdCompleted>(TestCaseActionTypes.LoadMultipleTestCasesBySectionIdCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage, // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    loadTestCaseTitleByUserStoryIdCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMultipleTestCasesByUserStoryIdCompleted>(TestCaseActionTypes.LoadMultipleTestCasesByUserStoryIdCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage, // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    loadTestCaseTitleCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseTitleCompleted>(TestCaseActionTypes.LoadTestCaseTitleCompleted),
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
    loadTestCaseCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseCompleted>(TestCaseActionTypes.LoadTestCaseCompleted),
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
    loadTestCaseTitleCompletedFully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseTitleCompleted>(TestCaseActionTypes.LoadTestCaseTitleCompleted),
        pipe(
            map(
                () => {
                    let searchTestCases = new TestCase();
                    searchTestCases.sectionId = this.sectionId;
                    searchTestCases.multipleTestCaseIds = this.multipleTestCaseIds;
                    searchTestCases.isFilter = false;
                    searchTestCases.isArchived = false;
                    if (this.isHierarchical)
                        searchTestCases.isHierarchical = true;
                    else
                        searchTestCases.isHierarchical = false;
                    if (this.insertingScenarios) {
                        searchTestCases.userStoryId = this.userStoryId;
                        return new LoadMultipleTestCasesByUserStoryIdTriggered(searchTestCases);
                    }
                    else {
                        return new LoadMultipleTestCasesBySectionIdTriggered(searchTestCases);
                    }
                }
            )
        )
    );

    @Effect()
    loadTestCaseDeleteCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseTitleDeleteCompleted>(TestCaseActionTypes.LoadTestCaseTitleDeleteCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage, // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    loadTestCaseScenarioDeleteCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseScenarioDeleteCompleted>(TestCaseActionTypes.LoadTestCaseScenarioDeleteCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage, // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    loadTestCaseDeleteCompletedFully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseTitleDeleteCompleted>(TestCaseActionTypes.LoadTestCaseTitleDeleteCompleted),
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
    loadTestCaseDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseDetailsTriggered>(TestCaseActionTypes.LoadTestCaseDetailsTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCaseById(getAction.testCaseEditId).pipe(
                map((testCaseDetails: any) => {
                    if (testCaseDetails.success == true)
                        return new LoadTestCaseDetailsCompleted(testCaseDetails.data);
                    else {
                        this.validationMessages = testCaseDetails.apiResponseMessages
                        return new LoadTestCaseFailed(testCaseDetails.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCasesBySectionId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCasesBySectionIdTriggered>(TestCaseActionTypes.LoadTestCasesBySectionIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCasesBySectionId(getAction.searchCasesSectionDetails).pipe(
                map((testCases: any) => {
                    if (testCases.success == true)
                        return new LoadTestCasesBySectionIdCompleted(testCases.data);
                    else {
                        this.validationMessages = testCases.apiResponseMessages
                        return new LoadTestCaseFailed(testCases.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCasesByUserStoryId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCasesByUserStoryIdTriggered>(TestCaseActionTypes.LoadTestCasesByUserStoryIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCasesByUserStoryId(getAction.searchTestCasesByUserStoryId).pipe(
                map((testCases: any) => {
                    if (testCases.success == true)
                        return new LoadTestCasesByUserStoryIdCompleted(testCases.data);
                    else {
                        this.validationMessages = testCases.apiResponseMessages
                        return new LoadTestCaseFailed(testCases.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadBugsByUserStoryId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadBugsByUserStoryIdTriggered>(TestCaseActionTypes.LoadBugsByUserStoryIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetBugsByUserStoryId(getAction.searchBugsByUserStoryId).pipe(
                map((bugs: any) => {
                    if (bugs.success == true)
                        return new LoadBugsByUserStoryIdCompleted(bugs.data);
                    else {
                        this.validationMessages = bugs.apiResponseMessages
                        return new LoadTestCaseFailed(bugs.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadBugsByTestCaseStatusId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadBugsByTestCaseIdTriggered>(TestCaseActionTypes.LoadBugsByTestCaseIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetBugsByUserStoryId(getAction.searchBugsByUserStoryId).pipe(
                map((bugs: any) => {
                    if (bugs.success == true)
                        return new LoadBugsByTestCaseIdCompleted(bugs.data);
                    else {
                        this.validationMessages = bugs.apiResponseMessages
                        return new LoadTestCaseFailed(bugs.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadBugsByGoalId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadBugsByGoalIdTriggered>(TestCaseActionTypes.LoadBugsByGoalIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetBugsByGoalId(getAction.searchBugsByGoalId).pipe(
                map((bugs: any) => {
                    if (bugs.success == true)
                        return new LoadBugsByGoalIdCompleted(bugs.data);
                    else {
                        this.validationMessages = bugs.apiResponseMessages
                        return new LoadTestCaseFailed(bugs.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadHistoryByUserStoryId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadHistoryByUserStoryIdTriggered>(TestCaseActionTypes.LoadHistoryByUserStoryIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetUserStoryScenarioHistory(getAction.history).pipe(
                map((history: any) => {
                    if (history.success == true)
                        return new LoadHistoryByUserStoryIdCompleted(history.data);
                    else {
                        this.validationMessages = history.apiResponseMessages
                        return new LoadTestCaseFailed(history.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadMultipleTestCasesByUserStoryId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMultipleTestCasesByUserStoryIdTriggered>(TestCaseActionTypes.LoadMultipleTestCasesByUserStoryIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCasesByUserStoryId(getAction.searchMultipleCasesByUserStoryId).pipe(
                map((multipleTestCases: any) => {
                    if (multipleTestCases.success == true) {
                        if (this.singleEditingScenario || getAction.searchMultipleCasesByUserStoryId.isBugAdded) {
                            this.latestTesCaseAfterEditData = multipleTestCases.data;
                            return new LoadSingleTestCasesByUserStoryIdEditCompleted(multipleTestCases.data);
                        }
                        else
                            return new LoadMultipleTestCasesByUserStoryIdCompleted(multipleTestCases.data);
                    }
                    else {
                        this.validationMessages = multipleTestCases.apiResponseMessages
                        return new LoadTestCaseFailed(multipleTestCases.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadSingleTestCaseBySectionId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSingleTestCaseBySectionIdTriggered>(TestCaseActionTypes.LoadSingleTestCaseBySectionIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCaseDetailsByCaseId(getAction.searchSingleCaseDetails).pipe(
                map((singleTestCase: any) => {
                    if (singleTestCase.success == true) {
                        return new LoadSingleTestCaseBySectionIdCompleted(singleTestCase.data);
                    }
                    else {
                        this.validationMessages = singleTestCase.apiResponseMessages
                        return new LoadTestCaseFailed(singleTestCase.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadSingleRunTestCaseBySectionId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSingleTestRunCaseBySectionIdTriggered>(TestCaseActionTypes.LoadSingleTestRunCaseBySectionIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestRunCaseDetailsByCaseId(getAction.searchSingleRunCaseDetails).pipe(
                map((singleTestRunCase: any) => {
                    if (singleTestRunCase.success == true) {
                        return new LoadSingleTestRunCaseBySectionIdCompleted(singleTestRunCase.data);
                    }
                    else {
                        this.validationMessages = singleTestRunCase.apiResponseMessages
                        return new LoadTestCaseFailed(singleTestRunCase.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadMultipleTestCasesBySectionId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMultipleTestCasesBySectionIdTriggered>(TestCaseActionTypes.LoadMultipleTestCasesBySectionIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCasesBySectionId(getAction.searchMultipleCasesSectionDetails).pipe(
                map((multipleTestCases: any) => {
                    if (multipleTestCases.success == true) {
                        return new LoadMultipleTestCasesBySectionIdCompleted(multipleTestCases.data);
                    }
                    else {
                        this.validationMessages = multipleTestCases.apiResponseMessages
                        return new LoadTestCaseFailed(multipleTestCases.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCaseAfterEdit$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseAfterEditTriggered>(TestCaseActionTypes.LoadTestCaseAfterEditTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCasesBySectionId(getAction.searchCaseAfterEdit).pipe(
                map((testCaseAfterEdit: any) => {
                    if (testCaseAfterEdit.success == true) {
                        this.latestTesCaseAfterEditData = testCaseAfterEdit.data;
                        return new LoadTestCaseAfterEditCompleted(testCaseAfterEdit.data);
                    }
                    else {
                        this.validationMessages = testCaseAfterEdit.apiResponseMessages
                        return new LoadTestCaseFailed(testCaseAfterEdit.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCaseAfterReorderEdit$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseAfterReorderEditTriggered>(TestCaseActionTypes.LoadTestCaseAfterReorderEditTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCasesBySectionId(getAction.searchCasesSectionDetails).pipe(
                map((testCaseAfterEdit: any) => {
                    if (testCaseAfterEdit.success == true) {
                        this.latestTesCaseAfterEditData = testCaseAfterEdit.data;
                        return new LoadTestCaseAfterReorderEditCompleted(testCaseAfterEdit.data);
                    }
                    else {
                        this.validationMessages = testCaseAfterEdit.apiResponseMessages
                        return new LoadTestCaseFailed(testCaseAfterEdit.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCaseAfterEditCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseAfterEditCompleted>(TestCaseActionTypes.LoadTestCaseAfterEditCompleted),
        pipe(
            map(() => {
                return new TestCaseEditWithInPlaceUpdate({
                    caseEditUpdate: {
                        id: this.latestTesCaseAfterEditData[0].testCaseId,
                        changes: this.latestTesCaseAfterEditData[0]
                    }
                });
            })
        )
    );

    @Effect()
    loadTestCaseAfterReorderEditCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseAfterReorderEditCompleted>(TestCaseActionTypes.LoadTestCaseAfterReorderEditCompleted),
        pipe(
            map(() => {
                return new TestCaseEditWithInPlaceUpdate({
                    caseEditUpdate: {
                        id: this.latestTesCaseAfterEditData[0].testCaseId,
                        changes: this.latestTesCaseAfterEditData[0]
                    }
                });
            })
        )
    );

    @Effect()
    loadTestCaseAfterEditByUserStoryIdCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSingleTestCasesByUserStoryIdEditCompleted>(TestCaseActionTypes.LoadSingleTestCasesByUserStoryIdEditCompleted),
        pipe(
            map(() => {
                return new TestCaseEditWithInPlaceUpdate({
                    caseEditUpdate: {
                        id: this.latestTesCaseAfterEditData[0].testCaseId,
                        changes: this.latestTesCaseAfterEditData[0]
                    }
                });
            })
        )
    );

    @Effect()
    loadTestCasesBySectionAndRunId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCasesBySectionAndRunIdTriggered>(TestCaseActionTypes.LoadTestCasesBySectionAndRunIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCasesBySectionAndRunId(getAction.searchCasesSectionRunDetails).pipe(
                map((testCasesByRuns: any) => {
                    if (testCasesByRuns.success == true)
                        return new LoadTestCasesBySectionAndRunIdCompleted(testCasesByRuns.data);
                    else {
                        this.validationMessages = testCasesByRuns.apiResponseMessages
                        return new LoadTestCaseFailed(testCasesByRuns.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCaseBySectionAndRunIdAfterStatus$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseBySectionAndRunIdAfterStatusTriggered>(TestCaseActionTypes.LoadTestCaseBySectionAndRunIdAfterStatusTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestRunCaseDetailsByCaseId(getAction.searchCaseAfterStatus).pipe(
                map((testCaseAfterStatus: any) => {
                    if (testCaseAfterStatus.success == true) {
                        this.latestTesCaseAfterStatusData = testCaseAfterStatus.data;
                        return new LoadTestCaseBySectionAndRunIdAfterStatusCompleted(testCaseAfterStatus.data);
                    }
                    else {
                        this.validationMessages = testCaseAfterStatus.apiResponseMessages
                        return new LoadTestCaseStatusFailed(testCaseAfterStatus.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseStatusExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadsTestCaseBySectionAndRunIdAfterStatus$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseBySectionAndRunIdAfterBugStatusTriggered>(TestCaseActionTypes.LoadTestCaseBySectionAndRunIdAfterBugStatusTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestRunCaseDetailsByCaseId(getAction.searchCaseAfterStatus).pipe(
                map((testCaseAfterStatus: any) => {
                    if (testCaseAfterStatus.success == true) {
                        this.latestTesCaseAfterStatusData = testCaseAfterStatus.data;
                        return new LoadTestCaseBySectionAndRunIdAfterBugStatusCompleted(testCaseAfterStatus.data);
                    }
                    else {
                        this.validationMessages = testCaseAfterStatus.apiResponseMessages
                        return new LoadTestCaseStatusFailed(testCaseAfterStatus.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseStatusExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCaseByIdAfterBugStatusCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseBySectionAndRunIdAfterBugStatusCompleted>(TestCaseActionTypes.LoadTestCaseBySectionAndRunIdAfterBugStatusCompleted),
        pipe(
            map(() => {
                return new TestCaseStatusEditWithInPlaceUpdateForBugStatus({
                    caseStatusUpdate: {
                        id: this.latestTesCaseAfterStatusData.testCaseId,
                        changes: this.latestTesCaseAfterStatusData
                    }
                });
            })
        )
    );

    @Effect()
    loadTestCaseByIdAfterStatusCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseBySectionAndRunIdAfterStatusCompleted>(TestCaseActionTypes.LoadTestCaseBySectionAndRunIdAfterStatusCompleted),
        pipe(
            map(() => {
                return new TestCaseStatusEditWithInPlaceUpdateForStatus({
                    caseStatusUpdate: {
                        id: this.latestTesCaseAfterStatusData.testCaseId,
                        changes: this.latestTesCaseAfterStatusData
                    }
                });
            })
        )
    );

    @Effect()
    loadTestCasesBySectionIdForRuns$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCasesBySectionIdForRunsTriggered>(TestCaseActionTypes.LoadTestCasesBySectionIdForRunsTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCasesBySectionId(getAction.searchCasesSectionDetailsForRun).pipe(
                map((testCasesForRuns: any) => {
                    if (testCasesForRuns.success == true)
                        {
                            let tempData = [];
                            testCasesForRuns.data.forEach(element => {
                                let index = tempData.findIndex(x => x.testCaseId.toLowerCase() == element.testCaseId.toLowerCase());
                                if(index == -1) {
                                    tempData.push(element)
                                }
                            });
                            testCasesForRuns.data = tempData;
                            return new LoadTestCasesBySectionIdForRunsCompleted(testCasesForRuns.data);
                        }
                    else {
                        this.validationMessages = testCasesForRuns.apiResponseMessages
                        return new LoadTestCaseFailed(testCasesForRuns.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCaseView$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseViewTriggered>(TestCaseActionTypes.LoadTestCaseViewTriggered),
        switchMap(getAction => {
            return this.testRailService.UpdateTestCaseViewCount(getAction.testCaseViewDetails).pipe(
                map((testCaseViewDetails: any) => {
                    if (testCaseViewDetails.success == true)
                        return new LoadTestCaseViewCompleted(testCaseViewDetails.data);
                    else {
                        this.validationMessages = testCaseViewDetails.apiResponseMessages
                        return new LoadTestCaseFailed(testCaseViewDetails.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCasesByFilterForRuns$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCasesByFilterForRunsTriggered>(TestCaseActionTypes.LoadTestCasesByFilterForRunsTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCasesByFilters(getAction.searchCasesByFilterForRuns).pipe(
                map((filteredTestCases: any) => {
                    if (filteredTestCases.success == true)
                        return new LoadTestCasesByFilterForRunsCompleted(filteredTestCases.data);
                    else {
                        this.validationMessages = filteredTestCases.apiResponseMessages
                        return new LoadTestCaseFailed(filteredTestCases.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCasesByFilterForSuites$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCasesByFilterForSuitesTriggered>(TestCaseActionTypes.LoadTestCasesByFilterForSuitesTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCasesByFilters(getAction.searchCasesByFilterForRuns).pipe(
                map((filteredTestCases: any) => {
                    if (filteredTestCases.success == true)
                        return new LoadTestCasesByFilterForSuitesCompleted(filteredTestCases.data);
                    else {
                        this.validationMessages = filteredTestCases.apiResponseMessages
                        return new LoadTestCaseFailed(filteredTestCases.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadUpdateMultipleTestCases$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMultipleTestRunResultTriggered>(TestCaseActionTypes.LoadMultipleTestRunResultTriggered),
        switchMap(getAction => {
            return this.testRailService.UpdateTestRunResultForTestCases(getAction.updateMultipleTestCases).pipe(
                map((multipleTestCases: any) => {
                    if (multipleTestCases.success == true) {
                        this.testRunId = getAction.updateMultipleTestCases.testRunId;
                        if (getAction.updateMultipleTestCases.isHierarchical) {
                            this.sectionId = getAction.updateMultipleTestCases.hierarchicalSectionId;
                            this.isHierarchical = true;
                        }
                        else {
                            this.sectionId = getAction.updateMultipleTestCases.sectionId;
                            this.isHierarchical = false;
                        }
                        return new LoadMultipleTestRunResultCompleted(multipleTestCases.data);
                    }
                    else {
                        this.validationMessages = multipleTestCases.apiResponseMessages
                        return new LoadTestCaseFailed(multipleTestCases.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadUpdateMultipleTestCasesCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMultipleTestRunResultCompleted>(TestCaseActionTypes.LoadMultipleTestRunResultCompleted),
        pipe(
            map(
                () => {
                    let searchTestCasesByRunId = new TestCase();
                    searchTestCasesByRunId.testRunId = this.testRunId;
                    searchTestCasesByRunId.sectionId = this.sectionId;
                    searchTestCasesByRunId.isArchived = false;
                    searchTestCasesByRunId.isHierarchical = this.isHierarchical;
                    return new LoadTestCasesBySectionAndRunIdTriggered(searchTestCasesByRunId);
                }
            )
        )
    );

    @Effect()
    loadUpdateMultipleTestCasesCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMultipleTestRunResultCompleted>(TestCaseActionTypes.LoadMultipleTestRunResultCompleted),
        pipe(
            map(
                () => {
                    let searchTestRun = new TestRun();
                    searchTestRun.testRunId = this.testRunId;
                    searchTestRun.isArchived = false;
                    return new LoadTestRunByIdForStatusTriggered(searchTestRun);
                }
            )
        )
    );

    @Effect()
    loadUpdateSingleTestCase$: Observable<Action> = this.actions$.pipe(
        ofType<LoadUpdateTestRunResultTriggered>(TestCaseActionTypes.LoadUpdateTestRunResultTriggered),
        switchMap(getAction => {
            return this.testRailService.UpdateTestRunResultForTestCases(getAction.updateSingleTestCase).pipe(
                map((singleTestCase: any) => {
                    if (singleTestCase.success == true) {
                        this.testRunId = getAction.updateSingleTestCase.testRunId;
                        this.testCaseId = getAction.updateSingleTestCase.testCaseIds[0];
                        this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForStatusUpdated);
                        return new LoadUpdateTestRunResultCompleted(singleTestCase.data);
                    }
                    else {
                        this.validationMessages = singleTestCase.apiResponseMessages
                        return new LoadTestCaseFailed(singleTestCase.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadUpdateSingleTestCaseCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadUpdateTestRunResultCompleted>(TestCaseActionTypes.LoadUpdateTestRunResultCompleted),
        pipe(
            map(
                () => {
                    let searchTestCase = new TestCase();
                    searchTestCase.testRunId = this.testRunId;
                    searchTestCase.testCaseId = this.testCaseId;
                    searchTestCase.isBugAdded = this.isStatusUpdated;
                    searchTestCase.isArchived = false;
                    return new LoadTestCaseBySectionAndRunIdAfterStatusTriggered(searchTestCase);
                }
            )
        )
    );

    @Effect()
    loadUpdateSingleTestCaseCompletedFully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadUpdateTestRunResultCompleted>(TestCaseActionTypes.LoadUpdateTestRunResultCompleted),
        pipe(
            map(
                () => {
                    let searchTestRun = new TestRun();
                    searchTestRun.testRunId = this.testRunId;
                    searchTestRun.isArchived = false;
                    return new LoadTestRunByIdForStatusTriggered(searchTestRun);
                }
            )
        )
    );

    @Effect()
    showValidationMessagesForTestCaseAfterStatus$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseStatusFailed>(TestCaseActionTypes.LoadTestCaseStatusFailed),
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
    exceptionHandledForTestCaseAfterStatus$: Observable<Action> = this.actions$.pipe(
        ofType<TestCaseStatusExceptionHandled>(TestCaseActionTypes.TestCaseStatusExceptionHandled),
        pipe(
            map(
                () =>
                    new ShowExceptionMessages({
                        message: this.exceptionMessage.message
                    })
            )
        )
    );

    @Effect()
    showValidationMessagesForAddTestCase$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseFailed>(TestCaseActionTypes.LoadTestCaseFailed),
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
        ofType<TestCaseExceptionHandled>(TestCaseActionTypes.TestCaseExceptionHandled),
        pipe(
            map(
                () =>
                    new ShowExceptionMessages({
                        message: this.exceptionMessage.message
                    })
            )
        )
    );

    @Effect()
    loadTestCaseStep$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseStepTriggered>(TestCaseActionTypes.LoadTestCaseStepTriggered),
        switchMap(getAction => {
            return this.testRailService.UpsertTestCase(getAction.testCaseStep).pipe(
                map((testCaseId: any) => {
                    if (testCaseId.success == true) {
                        this.testSuiteId = getAction.testCaseStep.testSuiteId;
                        this.sectionId = getAction.testCaseStep.sectionId;
                        this.testCaseId = getAction.testCaseStep.testCaseId;
                        return new LoadTestCaseStepCompleted(testCaseId.data);
                    }
                    else {
                        this.validationMessages = testCaseId.apiResponseMessages
                        return new LoadTestCaseFailed(testCaseId.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    loadTestCaseStepsAfterEditCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseStepCompleted>(TestCaseActionTypes.LoadTestCaseStepCompleted),
        pipe(
            map(
                () => {
                    let searchTestCase = new TestCase();
                    searchTestCase.testCaseId = this.testCaseId;
                    searchTestCase.sectionId = this.sectionId;
                    searchTestCase.isArchived = false;
                    return new LoadTestCaseStepAfterEditTriggered(searchTestCase);
                }
            )
        )
    );

    @Effect()
    loadTestCaseStepAfterEdit$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseStepAfterEditTriggered>(TestCaseActionTypes.LoadTestCaseStepAfterEditTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCaseDetailsByCaseId(getAction.searchCaseStepAfterEdit).pipe(
                map((testCaseAfterEdit: any) => {
                    if (testCaseAfterEdit.success == true) {
                        return new LoadTestCaseStepAfterEditCompleted(testCaseAfterEdit.data);
                    }
                    else {
                        this.validationMessages = testCaseAfterEdit.apiResponseMessages
                        return new LoadTestCaseFailed(testCaseAfterEdit.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestCaseExceptionHandled(err));
                })
            );
        })
    );
}
