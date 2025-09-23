import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChildren, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';

import { LoadTestSuiteSectionListTriggered, TestSuiteSectionActionTypes } from '../store/actions/testsuitesection.actions';
import { LoadTestCasesBySectionIdTriggered, LoadTestCasesByFilterForSuitesTriggered, LoadTestCasesByFilterForSuitesCompleted, TestCaseActionTypes } from '../store/actions/testcaseadd.actions';

import * as testSuiteSectionModuleReducer from "../store/reducers/index";

import { TestCase } from '../models/testcase';
import { TestSuiteCases, TestSuiteRunSections } from '../models/testsuitesection';

import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

@Component({
    selector: 'testsuites-sections-list',
    templateUrl: './testsuites-sections-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuitesSectionsListComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @ViewChildren('addSectionPopover') addSectionsPopover;
    @Output() selectedSectionData = new EventEmitter<any>();
    @Output() selectedEditSectionData = new EventEmitter<any>();
    @Output() loadedSections = new EventEmitter<boolean>();
    @Output() hierarchicalCases = new EventEmitter<boolean>();
    @Input() sectionSelected: any;

    softLabels: SoftLabelConfigurationModel[];

    @Input("selectedTestSuiteId")
    set _selectedTestSuiteId(data: string) {
        if (data && data != undefined) {
            this.testSuiteId = data;
            this.loadSectionsList();
        }
    }

    @Input("loadSectionsOnSuiteDelete")
    set _loadSectionsOnSuiteDelete(data: boolean) {
        if (data != null && data != undefined)
            this.sectionsLoadedOnDelete = data;
    }

    testSuiteSectionList$: Observable<TestSuiteCases>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    testSuiteSectionList: any;

    testSuiteId: string;
    sectionEdit: string = 'notedit';
    sectionFilter: string = '1';
    deletedSectionId: string;
    hierarchicalSectionData: any;
    filterCases: any;
    testSuiteSectionOccurance: number = 0;
    isSectionsPresent: boolean = false;
    isSectionPresent: boolean = false;
    isSectionsListPresent: boolean = false;
    loadSections: boolean = false;
    sectionsLoadedOnDelete: boolean = false;
    editingSection: boolean = false;
    loadSection: boolean = false;
    expandAll: boolean = false;
    searchText: string;
    sectionsList: TestSuiteCases;
    isSearching: boolean = false;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        super();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionListTriggered),
            tap(() => {
                this.sectionFilter = '1';
                this.testSuiteSectionOccurance = 0;
                this.hierarchicalSectionData = null;
                this.deletedSectionId = null;
                localStorage.removeItem("selectedSectionId");
                localStorage.removeItem('selectedSectionFilter');
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionListCompleted),
            tap(() => {
                this.testSuiteSectionList$.subscribe(result => {
                    this.isSearching = false;
                    this.searchText = null;
                    this.testSuiteSectionOccurance = this.testSuiteSectionOccurance + 1;
                    if (this.testSuiteSectionOccurance > 1 && this.testSuiteSectionList && this.testSuiteSectionList.sections && this.testSuiteSectionList.sections.length > 0 && this.deletedSectionId) {
                        let selSectionId = localStorage.getItem("selectedSectionId");
                        if (selSectionId != this.deletedSectionId) {
                            let sectionSub = this.checkSubData(this.testSuiteSectionList.sections, this.deletedSectionId);
                            if (sectionSub != undefined && sectionSub != null && sectionSub.length > 0) {
                                let checkRefresh = this.checkDeleteRefresh(sectionSub, selSectionId);
                                if (checkRefresh && checkRefresh != undefined) {
                                    this.testSuiteSectionList = result;
                                    this.hierarchicalSectionData = this.testSuiteSectionList.sections[0];
                                    this.selectedSectionData.emit(this.testSuiteSectionList.sections[0]);
                                }
                            }
                        }
                        else if (selSectionId == this.deletedSectionId) {
                            this.testSuiteSectionList = result;
                            this.hierarchicalSectionData = this.testSuiteSectionList.sections[0];
                            this.selectedSectionData.emit(this.testSuiteSectionList.sections[0]);
                        }
                    }
                    this.testSuiteSectionList = result;
                    this.loadSections = true;
                    this.loadSection = false;
                    this.loadedSections.emit(this.loadSections);
                    if (this.testSuiteSectionOccurance <= 1 && this.testSuiteSectionList && this.testSuiteSectionList.sections) {
                        this.hierarchicalCases.emit(false);
                        this.hierarchicalSectionData = this.testSuiteSectionList.sections[0];
                        this.selectedSectionData.emit(this.testSuiteSectionList.sections[0]);
                    }
                    if (this.testSuiteSectionList != null && this.testSuiteSectionList.sections != null && this.testSuiteSectionList.sections.length > 0) {
                        this.isSectionsListPresent = true;
                        this.isSectionsPresent = false;
                    }
                    else {
                        this.isSectionsListPresent = false;
                        this.isSectionsPresent = true;
                        this.selectedSectionData.emit('');
                    }
                    if (this.testSuiteSectionList != null && this.testSuiteSectionList.sections != null && this.testSuiteSectionList.sections.length >= 1) {
                        this.isSectionPresent = true;
                        this.cdRef.markForCheck();
                    }
                    else {
                        this.isSectionPresent = false;
                        this.cdRef.markForCheck();
                    }
                })
            })
        ).subscribe();

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

        this.anyOperationInProgress$ = this.store.pipe(select(testSuiteSectionModuleReducer.getTestSuiteSectionListLoading));
    }

    ngOnInit() {
        this.getSoftLabelConfigurations();
        super.ngOnInit();
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
        sectionsList.includeRunCases = false;
        this.store.dispatch(new LoadTestSuiteSectionListTriggered(sectionsList));
        localStorage.removeItem('selectedCasesFilter');
        this.store.dispatch(new LoadTestCasesByFilterForSuitesCompleted([]));
        this.testSuiteSectionList$ = this.store.pipe(select(testSuiteSectionModuleReducer.getTestSuiteSectionList));
        this.loadedSections.emit(this.loadSections);
    }

    onChangeSectionFilter(value) {
        if (this.testSuiteSectionList && this.testSuiteSectionList.sections && this.testSuiteSectionList.sections.length > 0) {
            localStorage.removeItem('selectedSectionFilter');
            let selSectionId = localStorage.getItem("selectedSectionId");
            let testCaseSearch = new TestCase();
            testCaseSearch.sectionId = selSectionId;
            testCaseSearch.isArchived = false;
            localStorage.removeItem('selectedCasesFilter');
            this.store.dispatch(new LoadTestCasesByFilterForSuitesCompleted([]));
            this.filterCases = null;
            if (value == '1') {
                testCaseSearch.isHierarchical = false;
                testCaseSearch.isFilter = false;
                this.store.dispatch(new LoadTestCasesBySectionIdTriggered(testCaseSearch));
                this.hierarchicalCases.emit(false);
            }
            else if (value == '2') {
                testCaseSearch.isHierarchical = true;
                // this.store.dispatch(new LoadHierarchicalTestCasesBySectionIdTriggered(testCaseSearch));
                this.hierarchicalCases.emit(true);
            }
            if (value == '2') {
                let sectionData = this.findIndexSectiondata(this.testSuiteSectionList.sections, selSectionId);
                let passingData = {
                    sectionId: sectionData.sectionId,
                    sectionName: sectionData.sectionName,
                    description: sectionData.description,
                    subSections: sectionData.subSections,
                    isHierarchical: true
                }
                this.selectedSectionData.emit(passingData);
                this.cdRef.detectChanges();
            }
        }
    }

    getSelectedSectionData(data) {
        this.hierarchicalSectionData = data;
        this.selectedSectionData.emit(data);
        this.cdRef.detectChanges();
    }

    getSelectedEditSectionData(data) {
        this.selectedEditSectionData.emit(data);
    }

    getSectionCheckedDeleted(data) {
        this.deletedSectionId = data;
        this.cdRef.detectChanges();
    }

    openSectionPopover(sectionPopover) {
        this.loadSection = true;
        sectionPopover.openPopover();
    }

    closeSectionPopover() {
        this.loadSection = false;
        this.addSectionsPopover.forEach((p) => p.closePopover());
    }

    getSectionDeleted(value) {
        this.loadedSections.emit(value);
    }

    getUpdatedSection(value) {
        this.loadedSections.emit(value);
    }

    checkSubData(sectionsList, sectionId) {
        for (let i = 0; i < sectionsList.length; i++) {
            if (sectionsList[i].sectionId == sectionId) {
                return sectionsList[i].subSections;
            }
            else if (sectionsList[i].subSections && sectionsList[i].subSections.length > 0) {
                let checkSubSections = this.recursivecheckSubData(sectionsList[i].subSections, sectionId);
                if (checkSubSections != undefined && checkSubSections != undefined)
                    return checkSubSections;
            }
        }
    }

    recursivecheckSubData(childList, sectionId) {
        for (let i = 0; i < childList.length; i++) {
            if (childList[i].sectionId == sectionId) {
                return childList[i].subSections;
            }
            else if (childList[i].subSections && childList[i].subSections.length > 0) {
                let checkSubSections = this.recursivecheckSubData(childList[i].subSections, sectionId);
                if (checkSubSections != undefined && checkSubSections != undefined)
                    return checkSubSections;
            }
        }
    }

    checkDeleteRefresh(sectionsList, sectionId) {
        for (let i = 0; i < sectionsList.length; i++) {
            if (sectionsList[i].sectionId == sectionId) {
                return true;
            }
            else if (sectionsList[i].subSections && sectionsList[i].subSections.length > 0) {
                let checkDelete = this.recursivecheckDeleteRefresh(sectionsList[i].subSections, sectionId);
                if (checkDelete != undefined && checkDelete != undefined)
                    return true;
            }
        }
    }

    recursivecheckDeleteRefresh(childList, sectionId) {
        for (let i = 0; i < childList.length; i++) {
            if (childList[i].sectionId == sectionId) {
                return true;
            }
            else if (childList[i].subSections && childList[i].subSections.length > 0) {
                let checkDelete = this.recursivecheckDeleteRefresh(childList[i].subSections, sectionId);
                if (checkDelete != undefined && checkDelete != undefined)
                    return true;
            }
        }
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
            this.sectionsList.description = this.testSuiteSectionList.description;
            this.sectionsList.sections = [];
            this.sectionsList.testRunSelectedCases = this.testSuiteSectionList.testRunSelectedCases;
            this.sectionsList.testRunSelectedSections = this.testSuiteSectionList.testRunSelectedSections;
            this.sectionsList.testSuiteId = this.testSuiteSectionList.testSuiteId;
            this.sectionsList.testSuiteName = this.testSuiteSectionList.testSuiteName;
            this.testSuiteSectionList.sections.forEach((element, i) => {
                // i = this.testSuiteSectionList.sections.findIndex(x => x.sectionName == element.sectionName);
                if (this.testSuiteSectionList.sections[i].sectionName.toLowerCase().includes(this.searchText.toLowerCase())) {
                    this.sectionsList.sections.push(Object.assign({}, this.testSuiteSectionList.sections[i]));
                }
                else if (this.testSuiteSectionList.sections[i].subSections && this.testSuiteSectionList.sections[i].subSections.length > 0) {
                    let childSections = this.checkSubSectionsList(this.testSuiteSectionList.sections[i].subSections);
                    if (childSections.length > 0) {
                        let parentSection = Object.assign({}, this.testSuiteSectionList.sections[i]);
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

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    closeSearch() {
        this.searchText = null;
        this.isSearching = false;
        this.cdRef.markForCheck();
    }
}
