import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';

import { TestSuiteSectionActionTypes, LoadTestRunSectionListTriggered } from '../store/actions/testsuitesection.actions';
import { LoadTestCasesBySectionAndRunIdTriggered, TestCaseActionTypes, LoadTestCasesByFilterForSuitesCompleted } from '../store/actions/testcaseadd.actions';

import * as testSuiteSectionModuleReducer from "../store/reducers/index";
import { TestSuiteCases, TestSuiteRunSections } from '../models/testsuitesection';
import { TestCase } from '../models/testcase';

import { SoftLabelConfigurationModel } from '../models/softlabels-model';

@Component({
    selector: 'testruns-sections-list',
    templateUrl: './testruns-sections-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunsSectionsListComponent {
    @Output() loadedSections = new EventEmitter<boolean>();
    @Output() selectedSectionData = new EventEmitter<any>();
    @Output() hierarchicalCases = new EventEmitter<boolean>();
    @Input() sectionSelected: any;

    softLabels: SoftLabelConfigurationModel[];

    @Input("loadRunSections")
    set _loadRunSections(data: boolean) {
        if (data != null && data != undefined) {
            this.loadRunSections = data;
            if (data == false) {
                this.testRunSectionList = null;
                this.isSectionsListPresent = false;
                this.isSectionsPresent = false;
            }
        }
    }

    @Input("requiredIdValues")
    set _requiredIdValues(data: any) {
        if (data) {
            this.testRunId = data.testRunId;
            this.testSuiteId = data.testSuiteId;
            this.isIncludeOrNot = data.isIncludeAllCases;
            if (this.testRunId)
                this.loadSectionsList();
        }
    }

    @Input("selectedTestRunId")
    set _selectedTestRunId(data: string) {
        if (data) {
            this.testRunId = data;
        }
    }

    @Input("selectedTestSuiteId")
    set _selectedTestSuiteId(data: string) {
        if (data) {
            this.testSuiteId = data;
        }
    }

    @Input("isIncludeAllCases")
    set _isIncludeAllCases(data: any) {
        if (data) {
            this.isIncludeOrNot = data;
        }
    }

    testRunSectionList$: Observable<TestSuiteCases>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    sectionsList: TestSuiteCases;

    testRunId: string;
    testSuiteId: string;
    testRunSectionOccurance: number = 0;
    loadSections: boolean = false;
    loadRunSections: boolean;
    isSectionsPresent: boolean = false;
    isSectionsListPresent: boolean = false;
    expandAll: boolean = false;
    isSearching: boolean = false;
    sectionFilter: string = '1';
    searchText: string;
    testRunSectionList: any;
    isIncludeOrNot: any;
    hierarchicalSectionData: any;
    filterCases: any;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        this.anyOperationInProgress$ = this.store.pipe(select(testSuiteSectionModuleReducer.getTestRunSectionListLoading));

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadTestRunSectionListTriggered),
            tap(() => {
                this.sectionFilter = '1';
                this.hierarchicalSectionData = null;
                this.testRunSectionOccurance = 0;
                localStorage.removeItem("selectedSectionId");
                localStorage.removeItem('selectedSectionFilter');
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadTestRunSectionListCompleted),
            tap((result: any) => {
                // this.testRunSectionList$.subscribe(result => {
                if (result && result.testRunSectionList) {
                    this.isSearching = false;
                    this.searchText = null;
                    this.testRunSectionList = result.testRunSectionList;
                    this.loadSections = true;
                    this.loadRunSections = true;
                    this.testRunSectionOccurance = this.testRunSectionOccurance + 1;
                    this.loadedSections.emit(this.loadSections);
                    if (this.testRunSectionOccurance <= 1) {
                        if (this.testRunSectionList && this.testRunSectionList.sections != null && this.testRunSectionList.sections.length > 0) {
                            this.isSectionsListPresent = true;
                            this.isSectionsPresent = false;
                            this.hierarchicalCases.emit(false);
                            this.hierarchicalSectionData = this.testRunSectionList.sections[0];
                            this.selectedSectionData.emit(this.testRunSectionList.sections[0]);
                        }
                        else {
                            this.isSectionsListPresent = false;
                            this.isSectionsPresent = true;
                            this.selectedSectionData.emit('');
                        }
                        this.cdRef.markForCheck();
                    }
                    // })
                }
                else {
                    this.isSectionsListPresent = false;
                    this.isSectionsPresent = true;
                    this.selectedSectionData.emit('');
                }
            })).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCasesByFilterForSuitesCompleted),
            tap((result: any) => {
                if (result && result.filteredCasesForRuns) {
                    let data = { isFilter: false, filterCases: [] };
                    if (localStorage.getItem('selectedCasesFilter') != null && localStorage.getItem('selectedCasesFilter') != undefined) {
                        data.isFilter = true;
                        data.filterCases = result.filteredCasesForRuns;
                        this.filterCases = data;
                        this.cdRef.markForCheck();
                    }
                    else {
                        data.isFilter = false;
                        data.filterCases = result.filteredCasesForRuns;
                        this.filterCases = data;
                        this.cdRef.markForCheck();
                    }
                }
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
        this.loadSections = false;
        this.filterCases = null;
        let sectionsList = new TestSuiteRunSections();
        sectionsList.testSuiteId = this.testSuiteId;
        sectionsList.testRunId = this.testRunId;
        if (this.isIncludeOrNot == true)
            sectionsList.isSectionsRequired = false;
        else
            sectionsList.isSectionsRequired = true;
        sectionsList.includeRunCases = false;
        this.store.dispatch(new LoadTestRunSectionListTriggered(sectionsList));
        localStorage.removeItem('selectedCasesFilter');
        this.store.dispatch(new LoadTestCasesByFilterForSuitesCompleted([]));
        this.testRunSectionList$ = this.store.pipe(select(testSuiteSectionModuleReducer.getTestRunSectionList));
        this.loadedSections.emit(this.loadSections);
    }

    onChangeSectionFilter(value) {
        if (this.testRunSectionList && this.testRunSectionList.sections && this.testRunSectionList.sections.length > 0) {
            localStorage.removeItem('selectedSectionFilter');
            let selSectionId = localStorage.getItem("selectedSectionId");
            let testCaseSearch = new TestCase();
            testCaseSearch.sectionId = selSectionId;
            testCaseSearch.testRunId = this.testRunId;
            testCaseSearch.isArchived = false;
            localStorage.removeItem('selectedCasesFilter');
            this.store.dispatch(new LoadTestCasesByFilterForSuitesCompleted([]));
            this.filterCases = null;
            if (value == '1') {
                testCaseSearch.isHierarchical = false;
                this.store.dispatch(new LoadTestCasesBySectionAndRunIdTriggered(testCaseSearch));
                this.hierarchicalCases.emit(false);
            }
            else if (value == '2') {
                testCaseSearch.isHierarchical = true;
                this.hierarchicalCases.emit(true);
            }
            if (value == '2') {
                let sectionData = this.findIndexSectiondata(this.testRunSectionList.sections, selSectionId);
                let passingData = {
                    sectionId: sectionData.sectionId,
                    sectionName: sectionData.sectionName,
                    description: sectionData.description,
                    subSections: sectionData.subSections,
                    isHierarchical: true
                }
                this.selectedSectionData.emit(passingData);
            }
        }
    }

    getSelectedSectionData(data) {
        this.hierarchicalSectionData = data;
        this.selectedSectionData.emit(data);
        this.cdRef.detectChanges();
    }

    findIndexSectiondata(sectionsList, sectionId) {
        for (let i = 0; i < sectionsList.length; i++) {
            if (sectionsList[i].sectionId == sectionId) {
                return sectionsList[i];
            }
            else if (sectionsList[i].subSections && sectionsList[i].subSections.length > 0) {
                let checkSubSections = this.recursiveFindIndexSectiondata(sectionsList[i].subSections, sectionId);
                if (checkSubSections != undefined && checkSubSections != undefined)
                    return checkSubSections;
            }
        }
    }

    recursiveFindIndexSectiondata(childList, sectionId) {
        for (let i = 0; i < childList.length; i++) {
            if (childList[i].sectionId == sectionId) {
                return childList[i];
            }
            else if (childList[i].subSections && childList[i].subSections.length > 0) {
                let checkSubSections = this.recursiveFindIndexSectiondata(childList[i].subSections, sectionId);
                if (checkSubSections != undefined && checkSubSections != undefined)
                    return checkSubSections;
            }
        }
    }

    checkSearchText(event, text) {
        if (event.keyCode == 13) {
            this.searchText = (text != null) ? text.trim() : null;
            if (this.searchText) {
                this.isSearching = true;
            }
            else {
                this.isSearching = false;
            }
            this.sectionsList = new TestSuiteCases();
            this.sectionsList.description = this.testRunSectionList.description;
            this.sectionsList.sections = [];
            this.sectionsList.testRunSelectedCases = this.testRunSectionList.testRunSelectedCases;
            this.sectionsList.testRunSelectedSections = this.testRunSectionList.testRunSelectedSections;
            this.sectionsList.testSuiteId = this.testRunSectionList.testSuiteId;
            this.sectionsList.testSuiteName = this.testRunSectionList.testSuiteName;
            this.testRunSectionList.sections.forEach((element, i) => {
                // i = this.testSuiteSectionList.sections.findIndex(x => x.sectionName == element.sectionName);
                if (this.testRunSectionList.sections[i].sectionName.toLowerCase().includes(this.searchText.toLowerCase())) {
                    this.sectionsList.sections.push(Object.assign({}, this.testRunSectionList.sections[i]));
                }
                else if (this.testRunSectionList.sections[i].subSections && this.testRunSectionList.sections[i].subSections.length > 0) {
                    let childSections = this.checkSubSectionsList(this.testRunSectionList.sections[i].subSections);
                    if (childSections.length > 0) {
                        let parentSection = Object.assign({}, this.testRunSectionList.sections[i]);
                        parentSection.subSections = childSections
                        this.sectionsList.sections.push(parentSection);
                    }
                }
            });
        }
    }

    checkSubSectionsList(subSections): any {
        let subSectionsList = [];
        for (let j = 0; j < subSections.length; j++) {
            if (subSections[j].sectionName.toLowerCase().includes(this.searchText.toLowerCase())) {
                subSectionsList.push(Object.assign({}, subSections[j]));
            }
            else if (subSections[j].subSections && subSections[j].subSections.length > 0) {
                let childSubSections = this.checkSubSectionsList(subSections[j].subSections);
                if (childSubSections.length > 0) {
                    let parentSubSection = Object.assign({}, subSections[j]);
                    parentSubSection.subSections = childSubSections
                    subSectionsList.push(Object.assign({}, parentSubSection));
                }
            }
        }
        return subSectionsList;
    }

    closeSearch() {
        this.searchText = null;
        this.isSearching = false;
        this.cdRef.markForCheck();
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}