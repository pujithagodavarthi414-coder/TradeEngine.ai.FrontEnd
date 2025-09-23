import { Component, Inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { State } from "../store/reducers/index";
import * as testRailModuleReducer from "../store/reducers/index";

import { LoadCopyOrMoveCasesTriggered, TestCaseActionTypes } from '../store/actions/testcaseadd.actions';
import { TestSuiteSectionActionTypes } from "../store/actions/testsuitesection.actions";
import { LoadTestCaseSectionListTriggered, LoadTestCaseSectionListForShiftTriggered } from '../store/actions/testcasesections.actions';

import { TestCaseDropdownList } from '../models/testcasedropdown';
import { TestSuiteList } from "../models/testsuite";
import { TestCasesShift } from '../models/testcaseshift';
import { TestCaseRunDetails } from '../models/testcaserundetails';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

import { ConstantVariables } from '../constants/constant-variables';
import { TestSuiteCases } from '../models/testsuitesection';

@Component({
    selector: 'testsuite-cases-copy-move',
    templateUrl: 'testsuite-cases-copy-move.component.html',
    styles: [`
    .sections-order-cases {
        text-overflow: ellipsis;
        overflow: hidden;
    }
    `]
})

export class TestSuiteCasesCopyMoveComponent {
    @ViewChild("sectionsSearch") sectionSearchElement: ElementRef;

    testsuitesList$: Observable<TestSuiteList[]>;
    // sectionsList$: Observable<TestCaseDropdownList[]>;
    sectionsList$: Observable<TestSuiteCases>;

    softLabels: SoftLabelConfigurationModel[];
    public ngDestroyed$ = new Subject();

    projectId: string;
    testSuiteId: string;

    selectedTestCases = [];
    selectedSections = [];
    sectionCasesCounts = [];
    filteredList = [];
    sectionsList = [];

    selectedTestSuite: any;
    selectedOptionForCopying: any;
    selectedSectionForAppending: any;
    selectAllNone: any;
    sectionData: any;
    selectedSectionIdData: any;
    unselectSectionId: any;
    sectionToCheck: any;
    filteredCasesData: any;
    searchText: string;
    sectionSelected: string;
    currentSectionId: string;
    unselectCasesCount: number = 0;
    specificCasesSelected: number = 0;

    isCopy: boolean = false;
    disableShift: boolean = false;
    showSelectAllNone: boolean = false;
    isHierarchical: boolean = false;
    isLinear: boolean = false;
    removeStorage: boolean = false;
    specificCasesIncluded: boolean = false;
    expandAll: boolean = false;

    constructor(private store: Store<State>, private route: ActivatedRoute, private actionUpdates$: Actions, private toastr: ToastrService, private translateService: TranslateService, private cdRef: ChangeDetectorRef, public dialogRef: MatDialogRef<TestSuiteCasesCopyMoveComponent>, @Inject(MAT_DIALOG_DATA) private data: any, public dialog: MatDialog) {
        this.searchText = this.data.testSuiteId;
        this.projectId = this.data.projectId;
        this.currentSectionId = this.data.currentSectionId;
        this.isHierarchical = this.data.isHierarchical;

        this.initializeTestSuiteCopyMoveForm();
        this.loadSections(this.searchText);

        this.testsuitesList$ = this.store.pipe(select(testRailModuleReducer.getTestSuiteAll));

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadCopyOrMoveCasesCompleted),
            tap(() => {
                this.disableShift = false;
                this.cancelShiftingCases();
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionListForRunsTriggered),
            tap(() => {
                this.showSelectAllNone = false;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionListForRunsCompleted),
            tap(() => {
                this.selectAllNone = null;
                this.showSelectAllNone = true;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCasesBySectionIdForRunsTriggered),
            tap(() => {
                this.unselectSectionId = null;
                this.sectionData = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCasesBySectionIdForRunsCompleted),
            tap(() => {
                this.unselectSectionId = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCasesByFilterForRunsCompleted),
            tap((result: any) => {
                if (result && result.filteredCasesForRuns && result.filteredCasesForRuns.length > 0) {
                    this.selectedTestCases = [];
                    this.selectedSections = [];
                    let filteredCases = [];
                    filteredCases = result.filteredCasesForRuns;
                    filteredCases.forEach(x => {
                        this.selectedTestCases.push(x);
                        if (x.isChecked && this.selectedSections.indexOf(x.sectionId) == -1)
                            this.selectedSections.push(x.sectionId);
                    });
                    if (this.selectedSections.length > 0)
                        localStorage.setItem('selectedSections', JSON.stringify(this.selectedSections));
                    localStorage.setItem('selectedTestCases', JSON.stringify(this.selectedTestCases));
                    this.filteredCasesData = this.selectedTestCases;
                    this.sectionToCheck = null;
                    this.unselectSectionId = null;
                    this.selectAllNone = null;
                    this.cdRef.markForCheck();
                }
                else if (result.filteredCasesForRuns.length == 0) {
                    this.selectAllNone = false;
                    this.selectedTestCases = [];
                    localStorage.removeItem('selectedTestCases');
                    this.selectedSections = [];
                    localStorage.removeItem('selectedSections');
                    this.filteredCasesData = [];
                    this.cdRef.markForCheck();
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCaseFailed),
            tap(() => {
                this.disableShift = false;
                this.cdRef.detectChanges();
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

    loadSectionsCases(testSuiteId) {
        this.testSuiteId = testSuiteId;
    }

    loadSections(testSuiteId) {
        // this.store.dispatch(new LoadTestCaseSectionListForShiftTriggered(testSuiteId));
        // this.sectionsList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseSectionListForShift));
        this.sectionsList$ = this.store.pipe(select(testRailModuleReducer.getTestSuiteSectionList));
        this.sectionsList$.subscribe(x => {
            // this.sectionsList = x.sections;
            this.sectionsList = [];
            if (x)
                this.buildSections(x.sections);
            this.filteredList = [];
            if (this.sectionsList)
                this.filteredList.push(...this.sectionsList);
            this.cdRef.markForCheck();
        });
    }

    copyTestCases() {
        this.disableShift = true;
        this.isCopy = true;
        this.copyOrMoveCases();
    }

    moveTestCases() {
        this.disableShift = true;
        this.isCopy = false;
        this.copyOrMoveCases();
    }

    copyOrMoveCases() {
        if (this.selectedTestCases.length > 0 || this.selectedSections.length > 0) {
            this.checkForDuplicateSectionCases();
            let copyOrMovecases = new TestCasesShift();
            copyOrMovecases.testSuiteId = this.searchText;
            copyOrMovecases.sourceTestSuiteId = this.selectedTestSuite.value;
            copyOrMovecases.testCasesList = this.selectedTestCases;
            copyOrMovecases.selectedSections = this.selectedSections;
            copyOrMovecases.isHierarchical = this.isHierarchical;
            copyOrMovecases.isCopy = this.isCopy;
            if (this.selectedOptionForCopying.value == '1') {
                copyOrMovecases.isCasesOnly = true;
                copyOrMovecases.isAllParents = false;
            }
            else if (this.selectedOptionForCopying.value == '2') {
                copyOrMovecases.isCasesOnly = false;
                copyOrMovecases.isAllParents = true;
            }
            copyOrMovecases.appendToSectionId = this.selectedSectionForAppending.value == '' ? null : this.selectedSectionForAppending.value;
            copyOrMovecases.currentSectionId = this.currentSectionId;
            this.store.dispatch(new LoadCopyOrMoveCasesTriggered(copyOrMovecases));
        }
        else {
            this.toastr.warning("", this.translateService.instant(ConstantVariables.SelectAtleastOneCase));
            this.disableShift = false;
        }
    }

    checkForDuplicateSectionCases() {
        this.selectedSections.forEach(x => {
            this.removeTestCasesBySectionId(x);
        });
    }

    getSelectedSectionData(data) {
        this.sectionData = data;
        this.sectionSelected = data.sectionId;
        this.cdRef.markForCheck();
    }

    getSelectedSectionId(value) {
        if (value && value.selectSection) {
            this.selectedSections.push(value.sectionId);
            localStorage.setItem('selectedSections', JSON.stringify(this.selectedSections));
            this.sectionToCheck = null;
            this.unselectSectionId = null;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
        if (value && value.unselectAllCases) {
            this.removeTestCasesBySectionId(value.sectionId);
            this.selectedSectionIdData = value;
            this.unselectSectionId = null;
            this.sectionToCheck = null;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
        if (value && value.sectionsAllNone) {
            let index = this.selectedSections.indexOf(value.sectionId);
            if (index == -1) {
                this.selectedSections.push(value.sectionId);
                this.sectionToCheck = null;
            }
            else {
                this.selectedSections.splice(index, 1);
                this.removeTestCasesBySectionId(value.sectionId);
            }
            localStorage.setItem('selectedSections', JSON.stringify(this.selectedSections));
            this.unselectSectionId = null;
            this.cdRef.detectChanges();
        }
        if (value && (value.unselectAllCases == undefined || value.unselectAllCases == false) && value.sectionCheckBoxClicked) {
            let index = this.selectedSections.indexOf(value.sectionId);
            if (index == -1) {
                this.selectedSections.push(value.sectionId);
                this.sectionToCheck = null;
            }
            else {
                this.selectedSections.splice(index, 1);
                this.removeTestCasesBySectionId(value.sectionId);
            }
            localStorage.setItem('selectedSections', JSON.stringify(this.selectedSections));
            this.selectedSectionIdData = value;
            this.unselectSectionId = null;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
        else {
            this.selectedSectionIdData = value;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
        if (value && value.unselectSection) {
            let index = this.selectedSections.indexOf(value.sectionId);
            this.selectedSections.splice(index, 1);
            localStorage.setItem('selectedSections', JSON.stringify(this.selectedSections));
            this.unselectSectionId = null;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
    }

    removeTestCasesBySectionId(sectionId) {
        let i = -1;
        while ((i = this.selectedTestCases.findIndex(x => x.sectionId == sectionId)) != -1) {
            let index = this.selectedTestCases.findIndex(x => x.sectionId == sectionId);
            this.selectedTestCases.splice(index, 1);
        }
        localStorage.setItem('selectedTestCases', JSON.stringify(this.selectedTestCases));
    }

    selectingAll() {
        if (this.showSelectAllNone) {
            this.selectAllNone = true;
            this.cdRef.markForCheck();
        }
    }

    selectingNone() {
        if (this.showSelectAllNone) {
            this.selectAllNone = false;
            this.selectedTestCases = [];
            this.selectedSections = [];
            this.cdRef.markForCheck();
        }
    }

    getSectionsData(data) {
        this.selectedSections = [];
        for (let i = 0; i < data.length; i++) {
            this.selectedSections.push(data[i].sectionId);
            if (data[i].subSections && data[i].subSections.length > 0) {
                this.recursiveSelectSections(data[i].subSections);
            }
        }
        localStorage.setItem('selectedSections', JSON.stringify(this.selectedSections));
    }

    recursiveSelectSections(subSectionsList) {
        for (let i = 0; i < subSectionsList.length; i++) {
            this.selectedSections.push(subSectionsList[i].sectionId);
            if (subSectionsList[i].subSections && subSectionsList[i].subSections.length > 0) {
                this.recursiveSelectSections(subSectionsList[i].subSections);
            }
        }
    }

    getSectionCasesData(data) {
        this.selectedTestCases = [];
        for (let i = 0; i < data.length; i++) {
            let selectedCaseDetails = new TestCaseRunDetails();
            selectedCaseDetails.testCaseId = data[i].testCaseId;
            selectedCaseDetails.sectionId = data[i].sectionId;
            this.selectedTestCases.push(selectedCaseDetails);
        }
        localStorage.setItem('selectedTestCases', JSON.stringify(this.selectedTestCases));
    }

    getListOfTestCases(value) {
        let index = this.selectedTestCases.findIndex(x => x.testCaseId == value.testCaseId);
        if (index == -1) {
            this.selectedTestCases.push(value);
        }
        else {
            this.selectedTestCases.splice(index, 1);
        }
        localStorage.setItem('selectedTestCases', JSON.stringify(this.selectedTestCases));
        this.unselectSectionId = null;
        this.selectAllNone = null;
        this.cdRef.detectChanges();
    }

    getListOfTestCasesAllNone(value) {
        let index = this.selectedTestCases.findIndex(x => x.testCaseId == value.testCaseId);
        if (index == -1) {
            this.selectedTestCases.push(value);
        }
        else {
            this.selectedTestCases.splice(index, 1);
        }
        localStorage.setItem('selectedTestCases', JSON.stringify(this.selectedTestCases));
        this.unselectSectionId = null;
        this.cdRef.detectChanges();
    }

    getUnselectedSection(value) {
        this.unselectSectionId = value;
        this.cdRef.detectChanges();
    }

    getSectionTocheck(value) {
        this.sectionToCheck = value;
        this.cdRef.detectChanges();
    }

    checkStatusDisabled() {
        if (this.selectedTestSuite.value)
            return false;
        else
            return true;
    }

    initializeTestSuiteCopyMoveForm() {
        this.selectedTestSuite = new FormControl('', []);
        this.selectedOptionForCopying = new FormControl('2', []);
        this.selectedSectionForAppending = new FormControl('', []);
    }

    cancelShiftingCases() {
        localStorage.removeItem('selectedTestCases');
        localStorage.removeItem('selectedSections');
        this.selectedTestCases = [];
        this.selectedSections = [];
        this.sectionCasesCounts = [];
        this.cdRef.markForCheck();
        this.onClose();
    }

    onClose() {
        this.dialogRef.close();
    }

    removeSearch() {
        this.sectionSearchElement.nativeElement.value = '';
        this.onKey(null);
    }

    onKey(value) {
        if (value && value.length > 0) {
            this.filteredList = this.sectionsList.filter(x => x.sectionName.toLowerCase().indexOf(value.toLowerCase()) >= 0);
            this.cdRef.markForCheck();
        }
        else {
            this.filteredList = [];
            if (this.sectionsList)
                this.filteredList.push(...this.sectionsList);
            this.cdRef.markForCheck();
        }
    }

    getSectionName(sectionData) {
        let name = '';
        for (let i = 0; i < sectionData.sectionLevel; i++) {
            name = name + ' ';
        }
        return name + sectionData.sectionName;
    }

    buildSections(sectionData) {
        if (sectionData == null)
            this.sectionsList = null;
        else {
            for (let i = 0; i < sectionData.length; i++) {
                this.sectionsList.push(sectionData[i]);
                this.cdRef.markForCheck();
                if (sectionData[i].subSections && sectionData[i].subSections.length > 0) {
                    this.recursiveBuildSelectSections(sectionData[i].subSections);
                }
            }
        }
    }

    recursiveBuildSelectSections(subSectionsList) {
        for (let i = 0; i < subSectionsList.length; i++) {
            this.sectionsList.push(subSectionsList[i]);
            this.cdRef.markForCheck();
            if (subSectionsList[i].subSections && subSectionsList[i].subSections.length > 0) {
                this.recursiveBuildSelectSections(subSectionsList[i].subSections);
            }
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}