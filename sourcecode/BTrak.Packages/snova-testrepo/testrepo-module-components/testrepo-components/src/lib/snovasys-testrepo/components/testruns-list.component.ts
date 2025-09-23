import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, ViewChildren, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { SatPopover } from '@ncstate/sat-popover';

import { TestSuiteRunSections } from '../models/testsuitesection';
import { TestRunList, TestRun } from '../models/testrun';

import { State } from '../store/reducers/index';
import { LoadTestRunSectionListTriggered } from '../store/actions/testsuitesection.actions';
import { LoadTestRunListTriggered, TestRunActionTypes } from '../store/actions/testrun.actions';

import * as testRunModuleReducer from "../store/reducers/index";

import { TestSuiteList } from '../models/testsuite';

import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { ConstantVariables } from '../constants/constant-variables';

@Component({
    selector: 'testruns-list',
    templateUrl: './testruns-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunsListComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @ViewChildren("addRunPopover") addRunPopovers;
    @ViewChild("addTestRun") addTestRunPopover: SatPopover;
    @ViewChild("addNewTestRun") addNewTestRunPopover: SatPopover;

    @Output() loadedSections = new EventEmitter<boolean>();
    @Output() testRunId = new EventEmitter<string>();
    @Output() testRunDescription = new EventEmitter<any>();
    @Output() testSuiteId = new EventEmitter<string>();
    @Output() testRunDeleted = new EventEmitter<boolean>();
    @Output() loadRunSections = new EventEmitter<boolean>();
    @Output() isInclude = new EventEmitter<any>();
    @Output() requiredIds = new EventEmitter<any>();
    @Output() testRunIsCompleted = new EventEmitter<boolean>();

    @Input("fromCustomApp")
    set _fromCustomApp(fromCustomApp) {
        this.fromCustomApp = fromCustomApp;
    }
    @Input("testRunIdApp")
    set _testRunIdApp(testRunIdApp) {
        this.testRunIdApp = testRunIdApp;
    }

    testRunIdApp: string;
    fromCustomApp: boolean = false;

    @Input("projectId")
    set _projectId(data: string) {
        if (data) {
            this.projectId = data;
            if (localStorage.getItem('reportTestRunName') != undefined && localStorage.getItem('reportTestRunName') != null) {
                let runData = JSON.parse(localStorage.getItem('reportTestRunName'));
                this.loadParticularRun = runData.testRunId;
                this.searchText = runData.testRunName;
                if (runData.isCompleted) {
                    this.isCompleted = true;
                }
            }
        }
    }

    testRunsList$: Observable<TestRunList[]>;
    testsuitesList$: Observable<TestSuiteList[]>;
    anyOperationInProgress$: Observable<boolean>;
    public ngDestroyed$ = new Subject();

    softLabels: SoftLabelConfigurationModel[];
    newTestRun: TestRun;

    projectId: string;
    selectedTestRunId: string;
    selectedTestRunDescription: string;
    updatedId: string;
    updatedDescripion: string;
    updatedRunName: string;
    deletedId: string = null;
    searchText: string = '';
    runListFilter: string = ConstantVariables.CreatedDate;
    runsCount: number;
    testRunOccurance: number = 0;
    dateFrom: string;
    dateTo: string;
    maxDate = new Date();
    sortByName: string;
    loadRunId: string;
    editingTestRunId: string;
    loadParticularRun: string;
    selectedTestSuite: any;
    runsList = [];
    loadNewRun: boolean = false;
    isCompleted: boolean = false;
    loadAddTestRun: boolean = false;
    loadNewTestRun: boolean = false;

    constructor(private store: Store<State>, private route: ActivatedRoute, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        super();

        this.anyOperationInProgress$ = this.store.pipe(select(testRunModuleReducer.getTestRunListLoading));

        this.testsuitesList$ = this.store.pipe(select(testRunModuleReducer.getTestSuiteAll));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestRunActionTypes.LoadTestRunListCompleted),
                tap(() => {
                    this.testRunsList$ = this.store.pipe(select(testRunModuleReducer.getTestRunAll));
                    this.testRunsList$.subscribe(runs => {
                        this.testRunOccurance = this.testRunOccurance + 1;
                if (this.testRunOccurance <= 1) {
                    runs.forEach(x => {
                        this.runsList.push(x);
                    });
                }
                if (this.isCompleted == false && this.loadNewRun && this.loadRunId) {
                    let index = runs.findIndex(x => x.testRunId == this.loadRunId);
                    if (index != -1) {
                        this.runsList.push(runs[index]);
                        this.loadRunId = null;
                    }
                }
                if (this.isCompleted == false && runs.length > 0) {
                    this.runsList.forEach((item: any, index) => {
                        let ind = runs.findIndex(x => x.testRunId == item.testRunId);
                        if (ind != -1) {
                            this.runsList.splice(index, 1, runs[ind]);
                            if (this.runsList[index].isCompleted) {
                                this.runsList.splice(index, 1);
                            }
                        }
                    });
                    if (this.deletedId)
                        this.runsList.splice(this.runsList.findIndex(x => x.testRunId == this.deletedId), 1);
                }
                else if (this.isCompleted == false && runs.length == 0)
                    this.runsList = [];
                if (this.runsList.length == 0) {
                    this.selectedTestRunId = null;
                    this.deletedId = null;
                    this.loadRunSections.emit(false);
                    // this.testRunId.emit(null);
                    // this.testSuiteId.emit(null);
                    this.testRunDeleted.emit(false);
                    let requiredValues = new TestSuiteRunSections();
                    requiredValues.testSuiteId = null;
                    requiredValues.testRunId = null;
                    requiredValues.isIncludeAllCases = false;
                    this.requiredIds.emit(requiredValues);
                    this.cdRef.markForCheck();
                }
                else if (this.runsList && this.runsList.length > 0) {
                    let index = 0;
                    if (this.loadParticularRun && this.testRunOccurance <= 1 && this.runsList.findIndex(x => x.testRunId == this.loadParticularRun) != -1) {
                        index = this.runsList.findIndex(x => x.testRunId == this.loadParticularRun);
                        this.loadParticularRun = null;
                        this.cdRef.markForCheck();
                    }
                    let runCompleted = false;
                    if (this.isCompleted == false && this.selectedTestRunId && this.selectedTestRunId == this.editingTestRunId) {
                        let runIndex = runs.findIndex(x => x.testRunId == this.selectedTestRunId);
                        if (runIndex != -1 && runs[runIndex].isCompleted) {
                            runCompleted = true;
                            this.editingTestRunId = null;
                        }
                    }
                    if (this.testRunOccurance <= 1 || (this.selectedTestRunId === this.deletedId && this.selectedTestRunId && this.deletedId) || (this.isCompleted == false && runCompleted) || (this.isCompleted == false && this.loadNewRun == true && this.runsList.length == 1 && this.runsList[0].isCompleted == false)) {
                        this.selectedTestRunId = this.runsList[index].testRunId;
                        this.loadRunSections.emit(true);
                        // this.testRunId.emit(this.selectedTestRunId);
                        // this.testSuiteId.emit(this.runsList[index].testSuiteId);
                        // this.isInclude.emit(this.runsList[index].isIncludeAllCases);
                        let requiredValues = new TestSuiteRunSections();
                        requiredValues.testSuiteId = this.runsList[index].testSuiteId;
                        requiredValues.testRunId = this.selectedTestRunId;
                        requiredValues.isIncludeAllCases = this.runsList[index].isIncludeAllCases;
                        this.requiredIds.emit(requiredValues);
                        let runData = {
                            testRunName: this.runsList[index].testRunName,
                            description: this.runsList[index].description
                        }
                        this.testRunDescription.emit(runData);
                        this.testRunIsCompleted.emit(this.runsList[index].isCompleted);
                        this.deletedId = null;
                        this.loadNewRun = false;
                        this.cdRef.detectChanges();
                    }
                }
                        // this.getAssigneeValue(this.userStoryData.ownerUserId);
                        //this.cdRef.detectChanges();
                    });
                })
            ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestRunActionTypes.LoadTestRunListTriggered),
            tap(() => {
                this.testRunOccurance = 0;
                this.selectedTestRunId = null;
                this.editingTestRunId = null;
                this.deletedId = null;
                this.runsList = [];
                // localStorage.removeItem('reportTestRunName');
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestRunActionTypes.LoadTestRunCompleted),
            tap((result: any) => {
                if (result && result.testRunId) {
                    let index = this.runsList.findIndex(x => x.testRunId == result.testRunId);
                    if (index == -1) {
                        this.loadNewRun = true;
                        this.loadRunId = result.testRunId;
                        this.cdRef.markForCheck();
                    }
                    else {
                        this.loadNewRun = false;
                        this.loadRunId = null;
                        this.cdRef.markForCheck();
                    }
                }
            })
        ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.initializeTestRunForm();
        this.getSoftLabels();
        this.loadTestRuns();
        this.getTestRunsList();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    loadTestRuns() {
        this.newTestRun = new TestRun();
        this.newTestRun.projectId = this.projectId;
        if (this.fromCustomApp) {
            this.newTestRun.testRunIds = this.testRunIdApp;
        }
        this.newTestRun.isCompleted = this.isCompleted;
        this.store.dispatch(new LoadTestRunListTriggered(this.newTestRun));
    }

    getTestRunsList() {
        // this.testRunsList$ = this.store.pipe(select(testRunModuleReducer.getTestRunAll),
        //     tap(runs => {
        //         this.testRunOccurance = this.testRunOccurance + 1;
        //         if (this.testRunOccurance <= 1) {
        //             runs.forEach(x => {
        //                 this.runsList.push(x);
        //             });
        //         }
        //         if (this.isCompleted == false && this.loadNewRun && this.loadRunId) {
        //             let index = runs.findIndex(x => x.testRunId == this.loadRunId);
        //             if (index != -1) {
        //                 this.runsList.push(runs[index]);
        //                 this.loadRunId = null;
        //             }
        //         }
        //         if (this.isCompleted == false && runs.length > 0) {
        //             this.runsList.forEach((item: any, index) => {
        //                 let ind = runs.findIndex(x => x.testRunId == item.testRunId);
        //                 if (ind != -1) {
        //                     this.runsList.splice(index, 1, runs[ind]);
        //                     if (this.runsList[index].isCompleted) {
        //                         this.runsList.splice(index, 1);
        //                     }
        //                 }
        //             });
        //             if (this.deletedId)
        //                 this.runsList.splice(this.runsList.findIndex(x => x.testRunId == this.deletedId), 1);
        //         }
        //         else if (this.isCompleted == false && runs.length == 0)
        //             this.runsList = [];
        //         if (this.runsList.length == 0) {
        //             this.selectedTestRunId = null;
        //             this.deletedId = null;
        //             this.loadRunSections.emit(false);
        //             // this.testRunId.emit(null);
        //             // this.testSuiteId.emit(null);
        //             this.testRunDeleted.emit(false);
        //             let requiredValues = new TestSuiteRunSections();
        //             requiredValues.testSuiteId = null;
        //             requiredValues.testRunId = null;
        //             requiredValues.isIncludeAllCases = false;
        //             this.requiredIds.emit(requiredValues);
        //             this.cdRef.markForCheck();
        //         }
        //         else if (this.runsList && this.runsList.length > 0) {
        //             let index = 0;
        //             if (this.loadParticularRun && this.testRunOccurance <= 1 && this.runsList.findIndex(x => x.testRunId == this.loadParticularRun) != -1) {
        //                 index = this.runsList.findIndex(x => x.testRunId == this.loadParticularRun);
        //                 this.loadParticularRun = null;
        //                 this.cdRef.markForCheck();
        //             }
        //             let runCompleted = false;
        //             if (this.isCompleted == false && this.selectedTestRunId && this.selectedTestRunId == this.editingTestRunId) {
        //                 let runIndex = runs.findIndex(x => x.testRunId == this.selectedTestRunId);
        //                 if (runIndex != -1 && runs[runIndex].isCompleted) {
        //                     runCompleted = true;
        //                     this.editingTestRunId = null;
        //                 }
        //             }
        //             if (this.testRunOccurance <= 1 || (this.selectedTestRunId === this.deletedId && this.selectedTestRunId && this.deletedId) || (this.isCompleted == false && runCompleted) || (this.isCompleted == false && this.loadNewRun == true && this.runsList.length == 1 && this.runsList[0].isCompleted == false)) {
        //                 this.selectedTestRunId = this.runsList[index].testRunId;
        //                 this.loadRunSections.emit(true);
        //                 // this.testRunId.emit(this.selectedTestRunId);
        //                 // this.testSuiteId.emit(this.runsList[index].testSuiteId);
        //                 // this.isInclude.emit(this.runsList[index].isIncludeAllCases);
        //                 let requiredValues = new TestSuiteRunSections();
        //                 requiredValues.testSuiteId = this.runsList[index].testSuiteId;
        //                 requiredValues.testRunId = this.selectedTestRunId;
        //                 requiredValues.isIncludeAllCases = this.runsList[index].isIncludeAllCases;
        //                 this.requiredIds.emit(requiredValues);
        //                 let runData = {
        //                     testRunName: this.runsList[index].testRunName,
        //                     description: this.runsList[index].description
        //                 }
        //                 this.testRunDescription.emit(runData);
        //                 this.testRunIsCompleted.emit(this.runsList[index].isCompleted);
        //                 this.deletedId = null;
        //                 this.loadNewRun = false;
        //                 this.cdRef.detectChanges();
        //             }
        //         }
        //     }));
    }

    closeDateFilter() {
        this.dateFrom = '';
        this.dateTo = '';
    }

    changeDeadline(from, to) {
        if (from > to)
            this.dateTo = '';
    }

    getTestRunsOrderBy(sortValue) {
        this.sortByName = sortValue;
    }

    handleClickOnTestRunItem(testRun) {
        this.selectedTestRunId = testRun.testRunId;
        // this.testRunId.emit(this.selectedTestRunId);
        // this.testSuiteId.emit(testRun.testSuiteId);
        // this.isInclude.emit(testRun.isIncludeAllCases);
        let requiredValues = new TestSuiteRunSections();
        requiredValues.testSuiteId = testRun.testSuiteId;
        requiredValues.testRunId = testRun.testRunId;
        requiredValues.isIncludeAllCases = testRun.isIncludeAllCases;
        this.requiredIds.emit(requiredValues);
        let runData = {
            testRunName: testRun.testRunName,
            description: testRun.description
        }
        this.testRunDescription.emit(runData);
        this.testRunIsCompleted.emit(testRun.isCompleted);
    }

    getUpdatedDescription(value) {
        this.updatedDescripion = value.description;
        this.updatedRunName = value.testRunName;
        this.cdRef.markForCheck();
    }

    getUpdatedId(value) {
        if (this.selectedTestRunId == value) {
            let runData = {
                testRunName: this.updatedRunName,
                description: this.updatedDescripion
            }
            this.testRunDescription.emit(runData);
        }
    }

    getEditingTestRunId(value) {
        this.editingTestRunId = value;
        this.cdRef.markForCheck();
    }

    getDeletedId(value) {
        this.deletedId = value;
        this.testRunDeleted.emit(false);
        this.cdRef.markForCheck();
    }

    getEditedRunData(value) {
        if (this.selectedTestRunId == value.testRunId) {
            let sectionsList = new TestSuiteRunSections();
            sectionsList.testSuiteId = value.testSuiteId;
            sectionsList.testRunId = value.testRunId;
            sectionsList.isSectionsRequired = value.isSectionsRequired;
            sectionsList.includeRunCases = false;
            this.store.dispatch(new LoadTestRunSectionListTriggered(sectionsList));
            this.loadedSections.emit(false);
            this.testRunIsCompleted.emit(value.isCompleted);
        }
    }

    unLoadSectionsData() {
        this.testRunOccurance = 0;
        this.selectedTestRunId = null;
        this.loadRunSections.emit(false);
        this.cdRef.markForCheck();
    }

    closeSearch() {
        this.searchText = '';
        localStorage.removeItem('reportTestRunName');
        this.cdRef.markForCheck();
    }

    changeSearch(){
        localStorage.removeItem('reportTestRunName');
    }

    checkStatusDisabled() {
        if (this.selectedTestSuite.value)
            return false;
        else
            return true;
    }

    initializeTestRunForm() {
        this.selectedTestSuite = new FormControl('', [Validators.required]);
    }

    openTestRunDialog(addRunPopover) {
        this.initializeTestRunForm();
        addRunPopover.openPopover();
    }

    addTestRuns() {
        this.closeTestRunDialog();
        localStorage.removeItem('selectedTestCases');
        localStorage.removeItem('selectedSections');
        this.loadNewTestRun = true;
        this.addNewTestRunPopover.open();
        (document.querySelector('.card-filter-runs') as HTMLElement).parentElement.parentElement.style.overflow = 'auto';
    }

    closeTestRunDialog() {
        this.addRunPopovers.forEach(p => p.closePopover());
    }

    closeNewTestRunDialog() {
        this.loadNewTestRun = false;
        this.addNewTestRunPopover.close();
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}