import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Store, select } from "@ngrx/store";

import { State } from "../store/reducers/index";

import { TestCaseDropdownList } from "../models/testcasedropdown";

import * as testRailModuleReducer from "../store/reducers/index";

import { LoadTestRunUsersListTriggered } from "../store/actions/testrunusers.actions";
import { LoadTestCasePriorityListTriggered } from "../store/actions/testcasepriorities.actions";
import { LoadTestCaseSectionListTriggered } from "../store/actions/testcasesections.actions";
import { LoadTestCaseTemplateListTriggered } from "../store/actions/testcasetemplates.actions";

import { TestCase } from "../models/testcase";
import { LoadTestCasesBySectionIdTriggered, LoadTestCasesBySectionAndRunIdTriggered, TestCaseActionTypes, LoadTestCasesBySectionIdForRunsTriggered, LoadTestCasesByFilterForRunsTriggered, LoadTestCasesByFilterForSuitesTriggered, LoadTestCasesByFilterForSuitesCompleted } from "../store/actions/testcaseadd.actions";
import { LoadTestCaseStatusListTriggered } from "../store/actions/testcaseStatuses.actions";

@Component({
    selector: "testcases-filter",
    templateUrl: "./testcases-filter.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestCasesFilterComponent {
    @Output() testCaseNameFiler = new EventEmitter<string>();

    @Input("isTestsuites")
    set _isTestsuites(data: boolean) {
        this.isTestSuite = data;
    }

    @Input("isTestCasesFilter")
    set _isTestCasesFilter(data: boolean) {
        this.isTestCasesFilter = data;
    }

    @Input("testSuitesId")
    set _testSuitesId(data: string) {
        if (data) {
            this.testSuiteId = data;
            this.clearFilters();
            // this.loadSections();
        }
    }

    @Input("testRunsId")
    set _testRunsId(data: string) {
        if (data) {
            this.testRunId = data;
            this.clearFilters();
            this.loadStatuses();
        }
    }

    @Input("selectedSectionData")
    set _selectedSectionData(data: any) {
        this.sectionData = data;
        //this.clearFilters();
    }

    @Input("testRunEdit")
    set _testRunEdit(data: boolean) {
        if (data || data == false) {
            this.isTestRunEdit = data;
            this.clearFilters();
            // this.loadSections();
        }
    }

    @Input("isHierarchical")
    set _isHierarchical(data: boolean) {
        if (data || data == false)
            this.isHierarchical = data;
    }

    @Input("projectId")
    set _projectId(data: any) {
        if (data) {
            this.projectId = data;
            this.loadDropdowns(this.projectId);
        }
    }

    usersList$: Observable<TestCaseDropdownList[]>;
    prioritiesList$: Observable<TestCaseDropdownList[]>;
    sectionsList$: Observable<TestCaseDropdownList[]>;
    templatesList$: Observable<TestCaseDropdownList[]>;
    statusList$: Observable<TestCaseDropdownList[]>;
    anyOperationInProgress$: Observable<boolean>;

    dropDownList: TestCaseDropdownList;

    testCaseSearch: TestCase;
    testCases: TestCase;

    public ngDestroyed$ = new Subject();

    projectId: string;
    testSuiteId: string;
    testRunId: string;
    isTestRunEdit: boolean = false;
    sectionData: any;
    filterCount: number = 0;
    selectedSectionName: string;
    selectedSectionDescription: string;
    isOpen: boolean = true;
    disableFilter: boolean = false;
    displayFilters: boolean = false;
    isTestSuite: boolean;
    isTestCasesFilter: boolean;
    isHierarchical: boolean;
    filterCall: boolean;

    createdOnFilter: string;
    createdByFilter = [];
    priorityFilter = [];
    sectionFilter: string;
    templateFilter = [];
    searchText: string;
    updatedOnFilter: string;
    updatedByFilter = [];
    sortByFilter: string;
    statusFilter = [];

    createdOnSearch: string;
    createdBySearch = [];
    prioritySearch = [];
    sectionSearch: string;
    templateSearch = [];
    searchTextSearch: string;
    updatedOnSearch: string;
    updatedBySearch = [];
    statusSearch = [];

    constructor(private route: ActivatedRoute, private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        this.route.params.subscribe(routeParams => {
            if (routeParams.id) {
                this.projectId = routeParams.id;
                this.loadDropdowns(this.projectId);
            }
        });

        this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getTestCasesByFiltersForRunsLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestCaseActionTypes.LoadTestCasesBySectionIdCompleted),
                tap(() => {
                    this.disableFilter = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestCaseActionTypes.LoadTestCasesBySectionAndRunIdCompleted),
                tap(() => {
                    this.disableFilter = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestCaseActionTypes.LoadTestCasesByFilterForRunsCompleted),
                tap(() => {
                    this.disableFilter = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestCaseActionTypes.LoadTestCaseFailed),
                tap(() => {
                    this.disableFilter = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    loadDropdowns(projectId) {
        this.dropDownList = new TestCaseDropdownList();
        this.dropDownList.isArchived = false;

        this.store.dispatch(new LoadTestRunUsersListTriggered(projectId));
        this.usersList$ = this.store.pipe(select(testRailModuleReducer.getTestRunUserAll));

        this.store.dispatch(new LoadTestCasePriorityListTriggered(this.dropDownList));
        this.prioritiesList$ = this.store.pipe(select(testRailModuleReducer.getTestCasePriorityAll));

        this.store.dispatch(new LoadTestCaseTemplateListTriggered(this.dropDownList));
        this.templatesList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseTemplateAll));
    }

    loadSections() {
        if (this.isTestSuite || this.isTestSuite == false || this.isTestRunEdit || this.isTestRunEdit == false) {
            this.store.dispatch(new LoadTestCaseSectionListTriggered(this.testSuiteId));
            this.sectionsList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseSectionAll));
        }
    }

    loadStatuses() {
        this.store.dispatch(new LoadTestCaseStatusListTriggered(this.dropDownList));
        this.statusList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseStatusAll));
    }

    applyCasesFilter() {
        this.filterCount = this.filterCount + 1;
        this.disableFilter = true;
        this.testCaseSearch = new TestCase();
        if (this.isTestCasesFilter)
            this.testCaseSearch.testSuiteId = this.testSuiteId;
        this.testCaseSearch.createdOn = this.createdOnFilter;
        this.testCaseSearch.createdByFilter = this.createdByFilter;
        this.testCaseSearch.priorityFilter = this.priorityFilter;
        if (!this.isTestCasesFilter)
            this.testCaseSearch.sectionId = this.sectionData;
        if (this.isHierarchical)
            this.testCaseSearch.isHierarchical = true;
        else
            this.testCaseSearch.isHierarchical = false;
        // if (this.sectionFilter) {
        //     this.testCaseSearch.sectionId = this.sectionFilter;
        //     if (!this.isTestCasesFilter) {
        //         let sectionFilter = new TestCaseDropdownList();
        //         sectionFilter.value = this.selectedSectionName;
        //         sectionFilter.description = this.selectedSectionDescription;
        //         sectionFilter.sectionId = this.sectionFilter;
        //         sectionFilter.isHierarchical = this.isHierarchical;
        //         this.sectionData = this.sectionFilter;
        //         localStorage.setItem('selectedSectionFilter', JSON.stringify(sectionFilter));
        //     }
        // }
        this.testCaseSearch.templateFilter = this.templateFilter;
        this.testCaseSearch.searchText = (this.searchText && this.searchText != '') ? this.searchText.trim() : null;
        this.testCaseSearch.updatedOn = this.updatedOnFilter;
        this.testCaseSearch.updatedByFilter = this.updatedByFilter;
        this.testCaseSearch.sortBy = this.sortByFilter;
        this.testCaseSearch.isFilter = true;
        this.testCaseSearch.isArchived = false;
        this.testCaseSearch.isFilterApplied = true;
        if(this.testRunId) {
            this.testCaseSearch.statusFilter = this.statusFilter;
        }
        localStorage.setItem('selectedCasesFilter', JSON.stringify(this.testCaseSearch));
        if (this.isTestSuite) {
            this.store.dispatch(new LoadTestCasesBySectionIdTriggered(this.testCaseSearch));
            this.testCaseSearch.multipleSectionIds = null;
            this.testCaseSearch.sectionId = null;
            this.testCaseSearch.testSuiteId = this.testSuiteId;
            this.testCaseSearch.isForRuns = false;
            this.store.dispatch(new LoadTestCasesByFilterForSuitesTriggered(this.testCaseSearch));
        }
        else if (this.isTestRunEdit) {
            this.testCaseSearch.clearFilter = false;
            let selectedSections = JSON.parse(localStorage.getItem('selectedSections'));
            if (selectedSections && selectedSections.length > 0) {
                this.testCaseSearch.multipleSectionIds = selectedSections.toString();
            }
            this.store.dispatch(new LoadTestCasesByFilterForRunsTriggered(this.testCaseSearch));
        }
        else {
            this.testCaseSearch.testRunId = this.testRunId;
            this.testCaseSearch.statusFilter = this.statusFilter;
            this.store.dispatch(new LoadTestCasesBySectionAndRunIdTriggered(this.testCaseSearch));
            this.testCaseSearch.isForRuns = true;
            this.testCaseSearch.multipleSectionIds = null;
            this.testCaseSearch.sectionId = null;
            this.store.dispatch(new LoadTestCasesByFilterForSuitesTriggered(this.testCaseSearch));
        }
    }

    checkFilterEnabled() {
        this.checkFilterEnabledExceptSortBy();
        if (this.createdOnFilter || this.createdByFilter.length > 0 || this.priorityFilter.length > 0
            || this.templateFilter.length > 0 || this.statusFilter.length > 0
            || this.searchText || this.updatedOnFilter || this.updatedByFilter.length > 0 || this.sortByFilter) {
            return false;
        }
        else
            return true;
    }

    checkFilterEnabledExceptSortBy() {
        if (this.createdOnFilter || this.createdByFilter.length > 0 || this.priorityFilter.length > 0
            || this.templateFilter.length > 0 || this.statusFilter.length > 0
            || this.searchText || this.updatedOnFilter || this.updatedByFilter.length > 0 || this.sortByFilter) {
            this.displayFilters = true;
        }
        else
            this.displayFilters = false;
    }

    clearFilters() {
        this.displayFilters = false;
        this.createdOnFilter = null;
        this.createdByFilter = [];
        this.priorityFilter = [];
        this.sectionFilter = null;
        this.templateFilter = [];
        this.searchText = null;
        this.updatedOnFilter = null;
        this.updatedByFilter = [];
        this.sortByFilter = null;
        this.statusFilter = [];
        this.createdOnSearch = null;
        this.createdBySearch = [];
        this.prioritySearch = [];
        this.sectionSearch = null;
        this.templateSearch = [];
        this.searchTextSearch = null;
        this.updatedOnSearch = null;
        this.updatedBySearch = [];
        this.statusSearch = [];
    }

    getTestCases() {
        this.disableFilter = true;
        this.testCases = new TestCase();
        this.testCases.sectionId = this.sectionData;
        if (this.isHierarchical)
            this.testCases.isHierarchical = true;
        else
            this.testCases.isHierarchical = false;
        this.testCaseSearch.isFilterApplied = false;
        localStorage.removeItem('selectedCasesFilter');
        if (this.isTestSuite) {
            this.store.dispatch(new LoadTestCasesBySectionIdTriggered(this.testCases));
            this.store.dispatch(new LoadTestCasesByFilterForSuitesCompleted([]));
        }
        else if (this.isTestRunEdit) {
            this.testCases.clearFilter = true;
            this.store.dispatch(new LoadTestCasesByFilterForRunsTriggered(this.testCases));
        }
        else {
            this.testCases.testRunId = this.testRunId;
            this.store.dispatch(new LoadTestCasesBySectionAndRunIdTriggered(this.testCases));
            this.store.dispatch(new LoadTestCasesByFilterForSuitesCompleted([]));
        }
    }

    onChangeCreatedOn(event: any) {
        this.createdOnSearch = event.source.selected._element.nativeElement.innerText.trim();
    }

    onChangeCreatedBy(event: any) {
        this.createdBySearch = [];
        let value = event.source.selected.length;
        for (let i = 0; i < value; i++) {
            this.createdBySearch.push(event.source.selected[i]._element.nativeElement.innerText.trim());
        }
    }

    onChangePriority(event: any) {
        this.prioritySearch = [];
        let value = event.source.selected.length;
        for (let i = 0; i < value; i++) {
            this.prioritySearch.push(event.source.selected[i]._element.nativeElement.innerText.trim());
        }
    }

    onChangeSection(event: any) {
        this.sectionSearch = event.source.selected._element.nativeElement.innerText.trim();
    }

    onChangeTemplate(event: any) {
        this.templateSearch = [];
        let value = event.source.selected.length;
        for (let i = 0; i < value; i++) {
            this.templateSearch.push(event.source.selected[i]._element.nativeElement.innerText.trim());
        }
    }

    onChangeUpdatedOn(event: any) {
        this.updatedOnSearch = event.source.selected._element.nativeElement.innerText.trim();
    }

    onChangeUpdatedBy(event: any) {
        this.updatedBySearch = [];
        let value = event.source.selected.length;
        for (let i = 0; i < value; i++) {
            this.updatedBySearch.push(event.source.selected[i]._element.nativeElement.innerText.trim());
        }
    }

    onChangeStatus(event: any) {
        this.statusSearch = [];
        let value = event.source.selected.length;
        for (let i = 0; i < value; i++) {
            this.statusSearch.push(event.source.selected[i]._element.nativeElement.innerText.trim());
        }
    }

    getSectionFilterdata(event: any, sectionData) {
        if (event.source.selected) {
            this.selectedSectionName = sectionData.value;
            this.selectedSectionDescription = sectionData.description;
        }
    }

    clearCreatedOnSearch() {
        this.createdOnSearch = null;
        this.createdOnFilter = null;
        this.applyCasesFilter()
    }

    clearCreatedBySearch() {
        this.createdBySearch = [];
        this.createdByFilter = [];
        this.applyCasesFilter()
    }

    clearPrioritySearch() {
        this.priorityFilter = [];
        this.prioritySearch = [];
        this.applyCasesFilter()
    }

    clearSectionSearch() {
        this.sectionFilter = null;
        this.sectionSearch = null;
        this.applyCasesFilter()
    }

    clearTemplateSearch() {
        this.templateFilter = [];
        this.templateSearch = [];
        this.applyCasesFilter()
    }

    closeSearch() {
        this.searchText = null;
        this.applyCasesFilter()
    }

    clearUpdatedOnsearch() {
        this.updatedOnSearch = null;
        this.updatedOnFilter = null;
        this.applyCasesFilter()
    }

    clearUpdatedBySearch() {
        this.updatedBySearch = [];
        this.updatedByFilter = [];
        this.applyCasesFilter()
    }

    clearSortFilter() {
        this.sortByFilter = null;
        this.applyCasesFilter();
    }

    clearStatusSearch() {
        this.statusSearch = [];
        this.statusFilter = [];
        this.applyCasesFilter()
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}