import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';

import { TestSuiteSectionActionTypes, LoadTestSuiteSectionListForRunsTriggered } from '../store/actions/testsuitesection.actions';

import * as testSuiteSectionModuleReducer from "../store/reducers/index";
import { TestSuiteCases, TestSuiteRunSections } from "../models/testsuitesection";
import { TestCaseRunDetails } from "../models/testcaserundetails";
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

@Component({
    selector: "testsuite-sections-list-shift",
    templateUrl: "./testsuite-sections-list-shift.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuiteSectionsListShiftComponent {
    @Output() selectedSectionData = new EventEmitter<any>();
    @Output() selectedSections = new EventEmitter<any>();
    @Output() casesSelected = new EventEmitter<any>();
    @Output() sectionsSelected = new EventEmitter<any>();
    @Output() sectionCasesCount = new EventEmitter<any>();
    @Output() sectionsData = new EventEmitter<any>();
    @Input() unSelectSectionId: any;
    @Input() sectionToCheck: any;
    @Input() sectionSelected: any;
    @Input() checkFilterCases: any;
    @Input() sectionCollapse: boolean;

    softLabels: SoftLabelConfigurationModel[];

    @Input("selectAllNone")
    set _selectAllNone(data: any) {
        this.selectAllNone = data;
        if (this.selectAllNone) {
            if (this.testSuiteSectionsList.sections != null && this.testSuiteSectionsList.sections.length > 0) {
                this.sectionsData.emit(this.testSuiteSectionsList.sections);
            }
        }
    }

    @Input("testSuiteId")
    set _testSuiteId(data: any) {
        if (data) {
            this.testSuiteId = data;
            this.loadSectionsList();
        }
    }

    testSuiteSectionList$: Observable<TestSuiteCases>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    testSuiteId: string;
    isSectionsPresent: boolean = false;
    isSectionsListPresent: boolean = false;
    testSuiteSectionList: any;
    testSuiteSectionsList: any;
    selectAllNone: any;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        this.anyOperationInProgress$ = this.store.pipe(select(testSuiteSectionModuleReducer.getTestSuiteSectionListForRunsLoading));

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionListForRunsCompleted),
            tap(() => {
                this.testSuiteSectionList$.subscribe(result => {
                    this.testSuiteSectionsList = result;
                    if (this.testSuiteSectionsList && this.testSuiteSectionsList.sections != null && this.testSuiteSectionsList.sections.length > 0) {
                        this.testSuiteSectionList = result;
                        this.isSectionsListPresent = true;
                        this.isSectionsPresent = false;
                        this.selectedSectionData.emit(this.testSuiteSectionsList.sections[0]);
                    }
                    else {
                        this.isSectionsListPresent = false;
                        this.isSectionsPresent = true;
                        this.selectedSectionData.emit('none');
                    }
                    this.testSuiteSectionList = result;
                })
            })
        ).subscribe();
    }

    ngOnInit() {
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    loadSectionsList() {
        let sectionsList = new TestSuiteRunSections();
        sectionsList.testSuiteId = this.testSuiteId;
        sectionsList.includeRunCases = false;
        this.store.dispatch(new LoadTestSuiteSectionListForRunsTriggered(sectionsList));
        this.testSuiteSectionList$ = this.store.pipe(select(testSuiteSectionModuleReducer.getTestSuiteSectionListForRuns));
    }

    getSelectedSectionData(data) {
        this.selectedSectionData.emit(data);
        this.cdRef.detectChanges();
    }

    getSelectedSectionId(data) {
        this.selectedSections.emit(data);
        this.cdRef.detectChanges();
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}