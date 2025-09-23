import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { LoadTestCasesBySectionIdForRunsTriggered, TestCaseActionTypes } from '../store/actions/testcaseadd.actions';
import * as testRailModuleReducer from "../store/reducers/index";

import { TestCase } from "../models/testcase";
import { TestCaseRunDetails } from "../models/testcaserundetails";

@Component({
    selector: "testsuite-select-test-case-view",
    templateUrl: "./testsuite-select-test-case-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuiteSelectTestCaseViewComponent {
    @Output() selectedCaseDetails = new EventEmitter<any>();
    @Output() selectedCaseDetailsAllNone = new EventEmitter<any>();
    @Output() unselectSection = new EventEmitter<any>();
    @Output() checkSection = new EventEmitter<any>();
    @Output() sectionCasesData = new EventEmitter<any>();
    @Input() checkFilterCases: any;
    @Input() projectId: any;

    @Input("selectAllNone")
    set _selectAllNone(data: any) {
        this.selectAllNone = data;
        if (this.selectAllNone) {
            if (this.testCasesForRuns != null && this.testCasesForRuns.length > 0) {
                this.sectionCasesData.emit(this.testCasesForRuns);
            }
        }
    }

    @Input("selectedSectionData")
    set _selectedSectionData(data: any) {
        if (data && data != 'none') {
            this.sectionData = data;
            this.selectedSectionId = data.sectionId;
            this.isSectionDataPresent = true;
            this.isCasesPresent = false;
            this.loadTestCases();
        }
        if (data == 'none') {
            this.isSectionDataPresent = false;
            this.isCasesPresent = true;
        }
    }

    @Input("selectedSection")
    set _selectedSection(data: any) {
        if (data) {
            this.selectedSectionIdData = data;
            this.cdRef.detectChanges();
        }
    }

    @Input("testSuitesId")
    set _testSuitesId(data: any) {
        if (data) {
            this.testSuiteId = data;
        }
    }

    testCasesForRuns$: Observable<TestCase[]>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    testCaseSearch: TestCase;
    testCasesForRuns: TestCase[];
    sectionData: any;
    selectedSectionIdData: any;
    selectCases: any;
    selectAllNone: any;
    testRunId: string;
    casesCount: number = 0;
    isCasesPresent: boolean = false;
    isSectionDataPresent: boolean = false;
    projectIdFromShiftCases: boolean = false;
    testSuiteId: string;
    testRunEdit: boolean = true;
    filterOpen: boolean = false;
    casesFilter: boolean = true;
    sectionName: string;
    selectedSectionId: string;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getTestCasesBySectionIdForRunsLoading));

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCasesBySectionIdForRunsTriggered),
            tap(() => {
                if (localStorage.getItem('selectedSectionFilter') != null && localStorage.getItem('selectedSectionFilter') != undefined) {
                    let sectionData = JSON.parse(localStorage.getItem('selectedSectionFilter'));
                    this.sectionName = sectionData.value;
                    localStorage.removeItem('selectedSectionFilter');
                    this.cdRef.detectChanges();
                }
                else {
                    this.sectionName = null;
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCasesBySectionIdForRunsCompleted),
            tap(() => {
                this.testCasesForRuns$.subscribe(result => {
                    this.casesCount = result.length;
                    this.cdRef.markForCheck();
                })
            })
        ).subscribe();
    }

    loadTestCases() {
        this.testCaseSearch = new TestCase();
        this.testCaseSearch.sectionId = this.sectionData.sectionId;
        this.testCaseSearch.testRunId = this.testRunId;
        this.testCaseSearch.isArchived = false;
        this.store.dispatch(new LoadTestCasesBySectionIdForRunsTriggered(this.testCaseSearch));
        this.testCasesForRuns$ = this.store.pipe(select(testRailModuleReducer.getTestCasesBySectionIdForRuns),
            tap(cases => {
                if (cases && cases.length > 0) {
                    this.testCasesForRuns = cases;
                }
                else
                    this.testCasesForRuns = [];
            }));
    }

    getSelectedCaseDetails(value) {
        this.selectedCaseDetails.emit(value);
    }

    getSelectedCaseDetailsAllNone(value) {
        this.selectedCaseDetailsAllNone.emit(value);
    }

    getUnselectedSection(value) {
        this.unselectSection.emit(value);
    }

    getSelectedSection(value) {
        let checkSelection = new TestCaseRunDetails();
        checkSelection.sectionId = value;
        checkSelection.casesSelected = this.casesCount;
        this.checkSection.emit(checkSelection);
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}
