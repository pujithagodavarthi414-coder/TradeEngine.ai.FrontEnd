import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { State } from '../reducers/index';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { TranslateService } from "@ngx-translate/core";
import {
    TestSuiteSectionActionTypes,
    LoadTestSuiteSectionTriggered,
    LoadTestSuiteSectionCompleted,
    LoadTestSuiteSectionListTriggered,
    LoadTestSuiteSectionListCompleted,
    LoadTestSuiteSectionDeleteTriggered,
    LoadTestSuiteSectionDeleteCompleted,
    TestSuiteSectionFailed,
    TestSuiteSectionException,
    LoadTestSuiteSectionListForRunsTriggered,
    LoadTestSuiteSectionListForRunsCompleted,
    LoadTestRunSectionListTriggered,
    LoadTestRunSectionListCompleted,
    LoadSingleTestSuiteSectionTriggered,
    LoadSingleTestSuiteSectionCompleted,
    LoadTestSuiteSectionEdit,
    LoadTestSuiteSectionFirstTriggered
} from '../actions/testsuitesection.actions';

import * as testSuiteSectionModuleReducer from "../reducers/index";

import { LoadTestCaseSectionListTriggered } from '../actions/testcasesections.actions';
import { LoadTestSuiteByIdTriggered } from '../actions/testsuiteslist.action';

import { TestRailService } from '../../services/testrail.service';
import { TestSuiteRunSections, TestSuiteCases, TestSuiteSection, TestSuiteSections } from '../../models/testsuitesection';
import { TestSuiteList } from '../../models/testsuite';

import { CookieService } from "ngx-cookie-service";

import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';
import { ConstantVariables } from '../../constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class TestSuiteEffects {
    testSuiteSectionList$: Observable<TestSuiteCases>;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionData: any;
    editTestSuiteSectionData: any;
    snackBarMessage: string;
    testSuiteId: string;
    sectionId: string;
    deleteSectionId: string;
    currentLang: boolean = false;
    validationMessages: any[];
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    exceptionMessage: any;
    editSection: boolean = false;

    constructor(private actions$: Actions, private store: Store<State>, private testRailService: TestRailService, private softLabePipe: SoftLabelPipe, private translateService: TranslateService, private cookieService: CookieService) {
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
    loadTestSuiteSection$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionTriggered>(TestSuiteSectionActionTypes.LoadTestSuiteSectionTriggered),
        switchMap(getAction => {
            return this.testRailService.UpsertTestsuiteSection(getAction.testSuiteSection).pipe(
                map((testSuiteSection: any) => {
                    if (testSuiteSection.success == true) {
                        this.testSuiteId = getAction.testSuiteSection.testSuiteId;
                        this.testSuiteSectionList$ = this.store.pipe(select(testSuiteSectionModuleReducer.getTestSuiteSectionList));
                        this.testSuiteSectionList$.subscribe(result => {
                            let sectionTreeObject = result;
                            let sectionTreeData = null;
                            if (sectionTreeObject) {
                                sectionTreeData = new TestSuiteCases();
                                sectionTreeData.testSuiteName = sectionTreeObject.testSuiteName;
                                sectionTreeData.testSuiteId = sectionTreeObject.testSuiteId;
                                sectionTreeData.description = sectionTreeObject.description;
                                sectionTreeData.testRunSelectedCases = sectionTreeObject.testRunSelectedCases;
                                sectionTreeData.testRunSelectedSections = sectionTreeObject.testRunSelectedSections;
                                sectionTreeData.sections = sectionTreeObject.sections;
                            }
                            this.testSuiteSectionList = sectionTreeData;
                        });
                        let lang = false;
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
                            lang = false;
                        }
                        else {
                            lang = true;
                        }
                        if (getAction.testSuiteSection.testSuiteSectionId && getAction.testSuiteSection.isArchived == true) {
                            // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestSuiteSectionDeleted);
                            if (!lang)
                                this.snackBarMessage = "Section deleted successfully";
                            else if (currentCulture == 'ko')
                                this.snackBarMessage = "섹션이 성공적으로 삭제되었습니다.";
                            else
                                this.snackBarMessage = "విభాగం విజయవంతంగా తొలగించబడింది";
                        }
                        else if (getAction.testSuiteSection.testSuiteSectionId) {
                            this.editSection = true;
                            let sectionsList = new TestSuiteRunSections();
                            sectionsList.testSuiteId = this.testSuiteId;
                            sectionsList.sectionId = getAction.testSuiteSection.testSuiteSectionId;
                            // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestSuiteSectionEdited);
                            if (!lang)
                                this.snackBarMessage = "Section edited successfully";
                            else if (currentCulture == 'ko')
                                this.snackBarMessage = "섹션이 성공적으로 수정되었습니다.";
                            else
                                this.snackBarMessage = "విభాగం విజయవంతంగా సవరించబడింది";
                            return new LoadSingleTestSuiteSectionTriggered(sectionsList);
                        }
                        else {
                            this.editSection = false;
                            this.sectionId = testSuiteSection.data;
                            // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestSuiteSectionCreated);
                            if (!lang)
                                this.snackBarMessage = "Section created successfully";
                            else if (currentCulture == 'ko')
                                this.snackBarMessage = "섹션이 성공적으로 생성되었습니다.";
                            else
                                this.snackBarMessage = "విభాగం విజయవంతంగా సృష్టించబడింది";
                            if (this.testSuiteSectionList == null || this.testSuiteSectionList.sections == null || this.testSuiteSectionList.sections.length == 0) {
                                return new LoadTestSuiteSectionFirstTriggered();
                            }
                            else {
                                return new LoadTestSuiteSectionCompleted(testSuiteSection.data);
                            }
                        }
                    }
                    else {
                        this.validationMessages = testSuiteSection.apiResponseMessages
                        return new TestSuiteSectionFailed(testSuiteSection.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestSuiteSectionException(err));
                })
            );
        })
    );

    @Effect()
    loadTestSuiteSectionDelete$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionDeleteTriggered>(TestSuiteSectionActionTypes.LoadTestSuiteSectionDeleteTriggered),
        switchMap(getAction => {
            return this.testRailService.DeleteTestsuiteSection(getAction.testSuiteSectionDelete).pipe(
                map((testSuiteSectionDelete: any) => {
                    if (testSuiteSectionDelete.success == true) {
                        this.testSuiteSectionList$ = this.store.pipe(select(testSuiteSectionModuleReducer.getTestSuiteSectionList));
                        this.testSuiteSectionList$.subscribe(result => {
                            let sectionTreeObject = result;
                            let sectionTreeData = new TestSuiteCases();
                            sectionTreeData.testSuiteName = sectionTreeObject.testSuiteName;
                            sectionTreeData.testSuiteId = sectionTreeObject.testSuiteId;
                            sectionTreeData.description = sectionTreeObject.description;
                            sectionTreeData.testRunSelectedCases = sectionTreeObject.testRunSelectedCases;
                            sectionTreeData.testRunSelectedSections = sectionTreeObject.testRunSelectedSections;
                            sectionTreeData.sections = sectionTreeObject.sections;
                            this.testSuiteSectionList = sectionTreeData;
                        });
                        this.testSuiteId = getAction.testSuiteSectionDelete.testSuiteId;
                        this.deleteSectionId = testSuiteSectionDelete.data;
                        // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForTestSuiteSectionDeleted);
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined')
                            this.snackBarMessage = "Section deleted successfully";
                        else if (currentCulture == 'ko')
                            this.snackBarMessage = "섹션이 성공적으로 삭제되었습니다.";
                        else
                            this.snackBarMessage = "విభాగం విజయవంతంగా తొలగించబడింది";
                        return new LoadTestSuiteSectionDeleteCompleted(testSuiteSectionDelete.data);
                    }
                    else {
                        this.validationMessages = testSuiteSectionDelete.apiResponseMessages
                        return new TestSuiteSectionFailed(testSuiteSectionDelete.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestSuiteSectionException(err));
                })
            );
        })
    );

    @Effect()
    loadTestSuiteSectionEditCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionEdit>(TestSuiteSectionActionTypes.LoadTestSuiteSectionEdit),
        pipe(
            map(() =>
                new SnackbarOpen({
                    message: this.snackBarMessage,
                    action: this.translateService.instant(ConstantVariables.success)
                })
            )
        )
    );

    // @Effect()
    // loadTestSuiteSectionEditSuccessful$: Observable<Action> = this.actions$.pipe(
    //     ofType<LoadTestSuiteSectionListCompleted>(TestSuiteSectionActionTypes.LoadTestSuiteSectionListCompleted),
    //     pipe(
    //         map(() =>
    //             new SnackbarOpen({
    //                 message: this.snackBarMessage,
    //                 action: this.translateService.instant(ConstantVariables.success)
    //             })
    //         )
    //     )
    // );

    @Effect()
    loadTestSuiteSectionFirstSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionFirstTriggered>(TestSuiteSectionActionTypes.LoadTestSuiteSectionFirstTriggered),
        pipe(
            map(() => {
                let sectionsList = new TestSuiteRunSections();
                sectionsList.testSuiteId = this.testSuiteId;
                return new LoadTestSuiteSectionListTriggered(sectionsList);
            })
        )
    );

    @Effect()
    loadTestSuiteSectionFirstSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionFirstTriggered>(TestSuiteSectionActionTypes.LoadTestSuiteSectionFirstTriggered),
        pipe(
            map(() => {
                let searchTestSuite = new TestSuiteList();
                searchTestSuite.testSuiteId = this.testSuiteId;
                return new LoadTestSuiteByIdTriggered(searchTestSuite);
            })
        )
    );

    @Effect()
    loadTestSuiteSectionFirstSuccessfullyCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionFirstTriggered>(TestSuiteSectionActionTypes.LoadTestSuiteSectionFirstTriggered),
        pipe(
            map(() => {
                return new LoadTestCaseSectionListTriggered(this.testSuiteId);
            })
        )
    );

    @Effect()
    loadTestSuiteSectionSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionCompleted>(TestSuiteSectionActionTypes.LoadTestSuiteSectionCompleted),
        pipe(
            map(() => {
                let sectionsList = new TestSuiteRunSections();
                sectionsList.testSuiteId = this.testSuiteId;
                sectionsList.sectionId = this.sectionId;
                return new LoadSingleTestSuiteSectionTriggered(sectionsList);
            })
        )
    );

    @Effect()
    loadTestSuiteSectionSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionCompleted>(TestSuiteSectionActionTypes.LoadTestSuiteSectionCompleted),
        pipe(
            map(() => {
                let searchTestSuite = new TestSuiteList();
                searchTestSuite.testSuiteId = this.testSuiteId;
                return new LoadTestSuiteByIdTriggered(searchTestSuite);
            })
        )
    );

    @Effect()
    loadTestSuiteSectionSuccessfullyCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionCompleted>(TestSuiteSectionActionTypes.LoadTestSuiteSectionCompleted),
        pipe(
            map(() => {
                return new LoadTestCaseSectionListTriggered(this.testSuiteId);
            })
        )
    );

    @Effect()
    loadTestSuiteSectionDeleteSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionDeleteCompleted>(TestSuiteSectionActionTypes.LoadTestSuiteSectionDeleteCompleted),
        pipe(
            map(() =>
                new SnackbarOpen({
                    message: this.snackBarMessage,
                    action: this.translateService.instant(ConstantVariables.success)
                })
            )
        )
    );

    @Effect()
    loadTestSuiteSectionEditSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionEdit>(TestSuiteSectionActionTypes.LoadTestSuiteSectionEdit),
        pipe(
            map(() => {
                let data = this.changeDataOfTheSection(this.editTestSuiteSectionData);
                return new LoadTestSuiteSectionListCompleted(data);
            })
        )
    );

    @Effect()
    loadTestSuiteSectionDeleteSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionDeleteCompleted>(TestSuiteSectionActionTypes.LoadTestSuiteSectionDeleteCompleted),
        pipe(
            map(() => {
                let data = this.deleteDataOfTheSection(this.deleteSectionId);
                return new LoadTestSuiteSectionListCompleted(data);
            })
        )
    );

    @Effect()
    loadTestSuiteSectionDeleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionDeleteCompleted>(TestSuiteSectionActionTypes.LoadTestSuiteSectionDeleteCompleted),
        pipe(
            map(() => {
                let searchTestSuite = new TestSuiteList();
                searchTestSuite.testSuiteId = this.testSuiteId;
                searchTestSuite.isArchived = false;
                return new LoadTestSuiteByIdTriggered(searchTestSuite);
            })
        )
    );

    @Effect()
    loadTestSuiteSectionList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionListTriggered>(TestSuiteSectionActionTypes.LoadTestSuiteSectionListTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestSuiteSectionList(getAction.testSuiteRunSection).pipe(
                map((testSuiteSectionList: any) => {
                    if (testSuiteSectionList.success == true)
                        return new LoadTestSuiteSectionListCompleted(testSuiteSectionList.data);
                    else {
                        this.validationMessages = testSuiteSectionList.apiResponseMessages
                        return new TestSuiteSectionFailed(testSuiteSectionList.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestSuiteSectionException(err));
                })
            );
        })
    );

    @Effect()
    loadSingleTestSuiteSectionData$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSingleTestSuiteSectionTriggered>(TestSuiteSectionActionTypes.LoadSingleTestSuiteSectionTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestSuiteSectionList(getAction.singleTestSuiteSection).pipe(
                map((singleTestSuiteSectionData: any) => {
                    if (singleTestSuiteSectionData.success == true && this.editSection == false) {
                        let sectionData = singleTestSuiteSectionData.data;
                        this.testSuiteSectionData = sectionData.sections[0];
                        return new LoadSingleTestSuiteSectionCompleted(this.testSuiteSectionData);
                    }
                    else if (singleTestSuiteSectionData.success == true && this.editSection) {
                        let sectionData = singleTestSuiteSectionData.data;
                        this.editTestSuiteSectionData = sectionData.sections[0];
                        return new LoadTestSuiteSectionEdit();
                    }
                    else {
                        this.validationMessages = singleTestSuiteSectionData.apiResponseMessages
                        return new TestSuiteSectionFailed(singleTestSuiteSectionData.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestSuiteSectionException(err));
                })
            );
        })
    );

    @Effect()
    loadSingleTestSuiteSectionCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSingleTestSuiteSectionCompleted>(TestSuiteSectionActionTypes.LoadSingleTestSuiteSectionCompleted),
        pipe(
            map(() => {
                let data = this.insertDataOfTheSection(this.testSuiteSectionData);
                return new LoadTestSuiteSectionListCompleted(data);
            })
        )
    );

    @Effect()
    loadSingleTestSuiteSectionCompletedFully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSingleTestSuiteSectionCompleted>(TestSuiteSectionActionTypes.LoadSingleTestSuiteSectionCompleted),
        pipe(
            map(() => new SnackbarOpen({
                message: this.snackBarMessage,
                action: this.translateService.instant(ConstantVariables.success)
            })
            )
        )
    );

    @Effect()
    loadTestRunSectionList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunSectionListTriggered>(TestSuiteSectionActionTypes.LoadTestRunSectionListTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestSuiteSectionList(getAction.testRunSection).pipe(
                map((testRunSectionList: any) => {
                    if (testRunSectionList.success == true)
                        return new LoadTestRunSectionListCompleted(testRunSectionList.data);
                    else {
                        this.validationMessages = testRunSectionList.apiResponseMessages
                        return new TestSuiteSectionFailed(testRunSectionList.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestSuiteSectionException(err));
                })
            );
        })
    );

    @Effect()
    loadTestSuiteSectionListForRuns$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestSuiteSectionListForRunsTriggered>(TestSuiteSectionActionTypes.LoadTestSuiteSectionListForRunsTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestSuiteSectionList(getAction.sectionsForTestRuns).pipe(
                map((testSuiteSectionListForRuns: any) => {
                    if (testSuiteSectionListForRuns.success == true)
                        return new LoadTestSuiteSectionListForRunsCompleted(testSuiteSectionListForRuns.data);
                    else {
                        this.validationMessages = testSuiteSectionListForRuns.apiResponseMessages
                        return new TestSuiteSectionFailed(testSuiteSectionListForRuns.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new TestSuiteSectionException(err));
                })
            );
        })
    );

    @Effect()
    showValidationMessagesForTestSuite$: Observable<Action> = this.actions$.pipe(
        ofType<TestSuiteSectionFailed>(TestSuiteSectionActionTypes.TestSuiteSectionFailed),
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
        ofType<TestSuiteSectionException>(TestSuiteSectionActionTypes.TestSuiteSectionException),
        pipe(
            map(
                () =>
                    new ShowExceptionMessages({
                        message: this.exceptionMessage.message
                    })
            )
        )
    );

    changeDataOfTheSection(sectionData) {
        if (this.testSuiteSectionList.sections && this.testSuiteSectionList.sections.length > 0) {
            for (let i = 0; i < this.testSuiteSectionList.sections.length; i++) {
                if (this.testSuiteSectionList.sections[i].sectionId == sectionData.sectionId) {
                    let editSectionData = new TestSuiteSections();
                    editSectionData.sectionName = sectionData.sectionName;
                    editSectionData.description = sectionData.description;
                    editSectionData.parentSectionId = this.testSuiteSectionList.sections[i].parentSectionId;
                    editSectionData.sectionId = this.testSuiteSectionList.sections[i].sectionId;
                    editSectionData.subSections = this.testSuiteSectionList.sections[i].subSections;
                    editSectionData.casesCount = sectionData.casesCount;
                    editSectionData.timeStamp = sectionData.timeStamp;
                    let sectionTreeData = new TestSuiteCases();
                    sectionTreeData.testSuiteName = this.testSuiteSectionList.testSuiteName;
                    sectionTreeData.testSuiteId = this.testSuiteSectionList.testSuiteId;
                    sectionTreeData.description = this.testSuiteSectionList.description;
                    sectionTreeData.testRunSelectedCases = this.testSuiteSectionList.testRunSelectedCases;
                    sectionTreeData.testRunSelectedSections = this.testSuiteSectionList.testRunSelectedSections;
                    let sectionsList = [];
                    for (let j = 0; j < this.testSuiteSectionList.sections.length; j++) {
                        sectionsList.push(this.testSuiteSectionList.sections[j]);
                    }
                    sectionsList.splice(i, 1, editSectionData);
                    sectionTreeData.sections = sectionsList;
                    return sectionTreeData;
                }
                else {
                    let changedData = this.recursionChangeDataSection(this.testSuiteSectionList.sections[i], sectionData);
                    if (changedData != null && changedData != undefined) {
                        let sectionTreeData = new TestSuiteCases();
                        sectionTreeData.testSuiteName = this.testSuiteSectionList.testSuiteName;
                        sectionTreeData.testSuiteId = this.testSuiteSectionList.testSuiteId;
                        sectionTreeData.description = this.testSuiteSectionList.description;
                        sectionTreeData.testRunSelectedCases = this.testSuiteSectionList.testRunSelectedCases;
                        sectionTreeData.testRunSelectedSections = this.testSuiteSectionList.testRunSelectedSections;
                        let sectionsList = [];
                        for (let j = 0; j < this.testSuiteSectionList.sections.length; j++) {
                            sectionsList.push(this.testSuiteSectionList.sections[j]);
                        }
                        sectionsList.splice(i, 1, changedData);
                        sectionTreeData.sections = sectionsList;
                        return sectionTreeData;
                    }
                }
            }
        }
    }

    recursionChangeDataSection(sectionData, editSectionData) {
        if (sectionData.subSections && sectionData.subSections.length > 0) {
            for (let i = 0; i < sectionData.subSections.length; i++) {
                if (sectionData.subSections[i].sectionId == editSectionData.sectionId) {
                    let editableSectionData = new TestSuiteSections();
                    editableSectionData.sectionName = editSectionData.sectionName;
                    editableSectionData.description = editSectionData.description;
                    editableSectionData.parentSectionId = sectionData.subSections[i].parentSectionId;
                    editableSectionData.sectionId = sectionData.subSections[i].sectionId;
                    editableSectionData.subSections = sectionData.subSections[i].subSections;
                    editableSectionData.casesCount = editSectionData.casesCount;
                    editableSectionData.timeStamp = editSectionData.timeStamp;
                    let editingSectionData = new TestSuiteSections();
                    editingSectionData.sectionName = sectionData.sectionName;
                    editingSectionData.description = sectionData.description;
                    editingSectionData.parentSectionId = sectionData.parentSectionId;
                    editingSectionData.sectionId = sectionData.sectionId;
                    editingSectionData.casesCount = sectionData.casesCount;
                    editingSectionData.timeStamp = sectionData.timeStamp;
                    let sectionsList = [];
                    for (let j = 0; j < sectionData.subSections.length; j++) {
                        sectionsList.push(sectionData.subSections[j]);
                    }
                    sectionsList.splice(i, 1, editableSectionData);
                    editingSectionData.subSections = sectionsList;
                    return editingSectionData;
                }
                else {
                    let changedData = this.recursionChangeDataSection(sectionData.subSections[i], editSectionData);
                    if (changedData != null && changedData != undefined) {
                        let editingSectionData = new TestSuiteSections();
                        editingSectionData.sectionName = sectionData.sectionName;
                        editingSectionData.description = sectionData.description;
                        editingSectionData.parentSectionId = sectionData.parentSectionId;
                        editingSectionData.sectionId = sectionData.sectionId;
                        editingSectionData.casesCount = sectionData.casesCount;
                        editingSectionData.timeStamp = sectionData.timeStamp;
                        let sectionsList = [];
                        for (let j = 0; j < sectionData.subSections.length; j++) {
                            sectionsList.push(sectionData.subSections[j]);
                        }
                        sectionsList.splice(i, 1, changedData);
                        editingSectionData.subSections = sectionsList;
                        return editingSectionData;
                    }
                }
            }
        }
        else
            return null;
    }

    insertDataOfTheSection(sectionData) {
        if (this.testSuiteSectionList.sections == null || this.testSuiteSectionList.sections.length == 0) {
            let sectionsData = [];
            sectionsData.push(sectionData);
            this.testSuiteSectionList.sections = sectionsData;
            return this.testSuiteSectionList;
        }
        else if (sectionData.parentSectionId == null) {
            let sectionsData = [];
            for (let i = 0; i < this.testSuiteSectionList.sections.length; i++) {
                sectionsData.push(this.testSuiteSectionList.sections[i]);
            }
            sectionsData.push(sectionData);
            let sectionTreeData = new TestSuiteCases();
            sectionTreeData.testSuiteName = this.testSuiteSectionList.testSuiteName;
            sectionTreeData.testSuiteId = this.testSuiteSectionList.testSuiteId;
            sectionTreeData.description = this.testSuiteSectionList.description;
            sectionTreeData.testRunSelectedCases = this.testSuiteSectionList.testRunSelectedCases;
            sectionTreeData.testRunSelectedSections = this.testSuiteSectionList.testRunSelectedSections;
            sectionTreeData.sections = sectionsData;
            return sectionTreeData;
        }
        else if (this.testSuiteSectionList.sections && this.testSuiteSectionList.sections.length > 0) {
            for (let i = 0; i < this.testSuiteSectionList.sections.length; i++) {
                if (this.testSuiteSectionList.sections[i].sectionId == sectionData.parentSectionId) {
                    let sectionTreeData = new TestSuiteCases();
                    sectionTreeData.testSuiteName = this.testSuiteSectionList.testSuiteName;
                    sectionTreeData.testSuiteId = this.testSuiteSectionList.testSuiteId;
                    sectionTreeData.description = this.testSuiteSectionList.description;
                    sectionTreeData.testRunSelectedCases = this.testSuiteSectionList.testRunSelectedCases;
                    sectionTreeData.testRunSelectedSections = this.testSuiteSectionList.testRunSelectedSections;
                    let sectionsList = [];
                    for (let j = 0; j < this.testSuiteSectionList.sections.length; j++) {
                        sectionsList.push(this.testSuiteSectionList.sections[j]);
                    }
                    sectionTreeData.sections = sectionsList;
                    let editingSectionData = new TestSuiteSections();
                    editingSectionData.sectionName = this.testSuiteSectionList.sections[i].sectionName;
                    editingSectionData.description = this.testSuiteSectionList.sections[i].description;
                    editingSectionData.parentSectionId = this.testSuiteSectionList.sections[i].parentSectionId;
                    editingSectionData.sectionId = this.testSuiteSectionList.sections[i].sectionId;
                    editingSectionData.casesCount = this.testSuiteSectionList.sections[i].casesCount;
                    editingSectionData.timeStamp = this.testSuiteSectionList.sections[i].timeStamp;
                    let subSectionsList = [];
                    if (this.testSuiteSectionList.sections[i].subSections == null || this.testSuiteSectionList.sections[i].subSections.length == 0) {
                        subSectionsList.push(sectionData);
                        editingSectionData.subSections = subSectionsList;
                        sectionTreeData.sections.splice(i, 1, editingSectionData);
                    }
                    else {
                        for (let j = 0; j < this.testSuiteSectionList.sections[i].subSections.length; j++) {
                            subSectionsList.push(this.testSuiteSectionList.sections[i].subSections[j]);
                        }
                        subSectionsList.push(sectionData);
                        editingSectionData.subSections = subSectionsList;
                        sectionTreeData.sections.splice(i, 1, editingSectionData);
                    }
                    return sectionTreeData;
                }
                else {
                    let changedData = this.recursionInsertDataSection(this.testSuiteSectionList.sections[i], sectionData);
                    if (changedData != null && changedData != undefined) {
                        let sectionTreeData = new TestSuiteCases();
                        sectionTreeData.testSuiteName = this.testSuiteSectionList.testSuiteName;
                        sectionTreeData.testSuiteId = this.testSuiteSectionList.testSuiteId;
                        sectionTreeData.description = this.testSuiteSectionList.description;
                        sectionTreeData.testRunSelectedCases = this.testSuiteSectionList.testRunSelectedCases;
                        sectionTreeData.testRunSelectedSections = this.testSuiteSectionList.testRunSelectedSections;
                        let sectionsList = [];
                        for (let j = 0; j < this.testSuiteSectionList.sections.length; j++) {
                            sectionsList.push(this.testSuiteSectionList.sections[j]);
                        }
                        sectionsList.splice(i, 1, changedData);
                        sectionTreeData.sections = sectionsList;
                        return sectionTreeData;
                    }
                }
            }
        }
    }

    recursionInsertDataSection(sectionData, insertSectionData) {
        if (sectionData.subSections && sectionData.subSections.length > 0) {
            for (let i = 0; i < sectionData.subSections.length; i++) {
                if (sectionData.subSections[i].sectionId == insertSectionData.parentSectionId) {
                    let sectionTreeData = new TestSuiteSections();
                    sectionTreeData.sectionName = sectionData.sectionName;
                    sectionTreeData.description = sectionData.description;
                    sectionTreeData.parentSectionId = sectionData.parentSectionId;
                    sectionTreeData.sectionId = sectionData.sectionId;
                    sectionTreeData.casesCount = sectionData.casesCount;
                    sectionTreeData.timeStamp = sectionData.timeStamp;
                    let sectionsList = [];
                    for (let j = 0; j < sectionData.subSections.length; j++) {
                        sectionsList.push(sectionData.subSections[j]);
                    }
                    sectionTreeData.subSections = sectionsList;

                    let editingSectionData = new TestSuiteSections();
                    editingSectionData.sectionName = sectionData.subSections[i].sectionName;
                    editingSectionData.description = sectionData.subSections[i].description;
                    editingSectionData.parentSectionId = sectionData.subSections[i].parentSectionId;
                    editingSectionData.sectionId = sectionData.subSections[i].sectionId;
                    editingSectionData.casesCount = sectionData.subSections[i].casesCount;
                    editingSectionData.timeStamp = sectionData.subSections[i].timeStamp;
                    let subSectionsList = [];

                    if (sectionData.subSections[i].subSections == null || sectionData.subSections[i].subSections.length == 0) {
                        subSectionsList.push(insertSectionData);
                        editingSectionData.subSections = subSectionsList;
                        sectionTreeData.subSections.splice(i, 1, editingSectionData);
                    }
                    else {
                        for (let j = 0; j < sectionData.subSections[i].subSections.length; j++) {
                            subSectionsList.push(sectionData.subSections[i].subSections[j]);
                        }
                        subSectionsList.push(insertSectionData);
                        editingSectionData.subSections = subSectionsList;
                        sectionTreeData.subSections.splice(i, 1, editingSectionData);
                    }
                    return sectionTreeData;
                }
                else {
                    let changedData = this.recursionInsertDataSection(sectionData.subSections[i], insertSectionData);
                    if (changedData != null && changedData != undefined) {
                        let sectionTreeData = new TestSuiteSections();
                        sectionTreeData.sectionName = sectionData.sectionName;
                        sectionTreeData.description = sectionData.description;
                        sectionTreeData.parentSectionId = sectionData.parentSectionId;
                        sectionTreeData.sectionId = sectionData.sectionId;
                        sectionTreeData.casesCount = sectionData.casesCount;
                        sectionTreeData.timeStamp = sectionData.timeStamp;
                        let sectionsList = [];
                        for (let j = 0; j < sectionData.subSections.length; j++) {
                            sectionsList.push(sectionData.subSections[j]);
                        }
                        sectionsList.splice(i, 1, changedData);
                        sectionTreeData.subSections = sectionsList;
                        return sectionTreeData;
                    }
                }
            }
        }
        else
            return null;
    }

    deleteDataOfTheSection(sectionId) {
        if (this.testSuiteSectionList.sections && this.testSuiteSectionList.sections.length > 0) {
            for (let i = 0; i < this.testSuiteSectionList.sections.length; i++) {
                if (this.testSuiteSectionList.sections[i].sectionId == sectionId) {
                    let sectionsList = [];
                    for (let j = 0; j < this.testSuiteSectionList.sections.length; j++) {
                        sectionsList.push(this.testSuiteSectionList.sections[j]);
                    }
                    sectionsList.splice(i, 1);
                    let sectionTreeData = new TestSuiteCases();
                    sectionTreeData.testSuiteName = this.testSuiteSectionList.testSuiteName;
                    sectionTreeData.testSuiteId = this.testSuiteSectionList.testSuiteId;
                    sectionTreeData.description = this.testSuiteSectionList.description;
                    sectionTreeData.testRunSelectedCases = this.testSuiteSectionList.testRunSelectedCases;
                    sectionTreeData.testRunSelectedSections = this.testSuiteSectionList.testRunSelectedSections;
                    sectionTreeData.sections = sectionsList;
                    this.testSuiteSectionList = sectionTreeData;
                    return this.testSuiteSectionList;
                }
                else {
                    let changedData = this.recursionDeleteSection(this.testSuiteSectionList.sections[i], sectionId);
                    if (changedData != null && changedData != undefined) {
                        let sectionTreeData = new TestSuiteCases();
                        sectionTreeData.testSuiteName = this.testSuiteSectionList.testSuiteName;
                        sectionTreeData.testSuiteId = this.testSuiteSectionList.testSuiteId;
                        sectionTreeData.description = this.testSuiteSectionList.description;
                        sectionTreeData.testRunSelectedCases = this.testSuiteSectionList.testRunSelectedCases;
                        sectionTreeData.testRunSelectedSections = this.testSuiteSectionList.testRunSelectedSections;
                        let sectionsList = [];
                        for (let j = 0; j < this.testSuiteSectionList.sections.length; j++) {
                            sectionsList.push(this.testSuiteSectionList.sections[j]);
                        }
                        sectionsList.splice(i, 1, changedData);
                        sectionTreeData.sections = sectionsList;
                        this.testSuiteSectionList = sectionTreeData;
                        return this.testSuiteSectionList;
                    }
                }
            }
        }
    }

    recursionDeleteSection(sectionData, deleteSectionId) {
        if (sectionData.subSections && sectionData.subSections.length > 0) {
            for (let i = 0; i < sectionData.subSections.length; i++) {
                if (sectionData.subSections[i].sectionId == deleteSectionId) {
                    let sectionsList = [];
                    for (let j = 0; j < sectionData.subSections.length; j++) {
                        sectionsList.push(sectionData.subSections[j]);
                    }
                    sectionsList.splice(i, 1);
                    let sectionTreeData = new TestSuiteSections();
                    sectionTreeData.sectionName = sectionData.sectionName;
                    sectionTreeData.description = sectionData.description;
                    sectionTreeData.parentSectionId = sectionData.parentSectionId;
                    sectionTreeData.sectionId = sectionData.sectionId;
                    sectionTreeData.subSections = sectionsList;
                    sectionTreeData.casesCount = sectionData.casesCount;
                    sectionTreeData.timeStamp = sectionData.timeStamp;
                    return sectionTreeData;
                }
                else {
                    let changedData = this.recursionDeleteSection(sectionData.subSections[i], deleteSectionId);
                    if (changedData != null && changedData != undefined) {
                        let sectionTreeData = new TestSuiteSections();
                        sectionTreeData.sectionName = sectionData.sectionName;
                        sectionTreeData.description = sectionData.description;
                        sectionTreeData.parentSectionId = sectionData.parentSectionId;
                        sectionTreeData.sectionId = sectionData.sectionId;
                        sectionTreeData.casesCount = sectionData.casesCount;
                        sectionTreeData.timeStamp = sectionData.timeStamp;
                        let sectionsList = [];
                        for (let j = 0; j < sectionData.subSections.length; j++) {
                            sectionsList.push(sectionData.subSections[j]);
                        }
                        sectionsList.splice(i, 1, changedData);
                        sectionTreeData.subSections = sectionsList;
                        return sectionTreeData;
                    }
                }
            }
        }
        else
            return null;
    }
}