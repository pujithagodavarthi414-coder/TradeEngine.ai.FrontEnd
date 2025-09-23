import { Component, ChangeDetectionStrategy, ViewChildren, Input, ChangeDetectorRef, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DragulaService } from "ng2-dragula";
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { SatPopover } from '@ncstate/sat-popover';

import "../../globaldependencies/helpers/fontawesome-icons";

import { LoadTestCasesBySectionIdTriggered, LoadTestCaseTitleTriggered, TestCaseActionTypes, LoadTestCaseViewTriggered, LoadTestCaseReorderTriggered, LoadMoveTestCasesTriggered, LoadTestCasesAfterReorderCompleted, LoadTestCaseAfterEditTriggered, LoadTestCaseTitleDeleteTriggered, LoadMultipleTestCasesDelete } from '../store/actions/testcaseadd.actions';
import { TestSuiteSectionActionTypes } from '../store/actions/testsuitesection.actions';

import * as testRailModuleReducer from "../store/reducers/index";

import { TestSuiteList } from '../models/testsuite';
import { TestCase, TestCaseTitle } from '../models/testcase';
import { TestSuiteCases } from '../models/testsuitesection';

import { TestSuiteCasesCopyMoveComponent } from './testsuite-cases-copy-move.component';

import { TestCaseDropdownList } from '../models/testcasedropdown';
import { LoadTestCaseSectionListTriggered } from '../store/actions/testcasesections.actions';
import { MoveTestCasesModel } from '../models/testcaseshift';
import { TestCaseRunDetails } from '../models/testcaserundetails';
import { thresholdFreedmanDiaconis } from 'd3';

import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { ConstantVariables } from '../constants/constant-variables';

@Component({
    selector: 'testsuite-section-cases-view',
    templateUrl: './testsuite-section-cases-view.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DragulaService],
    styles: [`
    .sections-order-cases {
        text-overflow: ellipsis;
        overflow: hidden;
    }
    `]
})

export class TestSuiteSectionCasesViewComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @ViewChild("moveCasesPopover") moveCasePopover: SatPopover;
    @ViewChild("deleteCasePopover") deleteCasesPopover: SatPopover;
    @ViewChild("sectionSearch") sectionSearchElement: ElementRef;
    @Output() casePreviewDetails = new EventEmitter<any>();

    softLabels: SoftLabelConfigurationModel[];

    @Input("loadSections")
    set _loadSections(data: boolean) {
        if (data != null && data != undefined)
            this.sectionsLoaded = data;
        if (this.sectionsLoaded == false) {
            this.testCaseName = '';
            this.isAddTestCaseOpened = false;
        }
    }

    @Input("fromCustomApp")
    set _fromCustomApp(fromCustomApp) {
        this.fromCustomApp = fromCustomApp;
    }

    @Input("loadSectionsOnSuiteDelete")
    set _loadSectionsOnSuiteDelete(data: boolean) {
        if (data != null && data != undefined)
            this.sectionsLoadedOnDelete = data;
        if (this.sectionsLoadedOnDelete == false) {
            this.testCaseName = '';
            this.isAddTestCaseOpened = false;
        }
    }

    @Input("selectedTestSuiteId")
    set _selectedTestSuiteId(data: string) {
        if (data)
            this.testSuiteId = data;
    }

    @Input("selectedTestSuiteDescription")
    set _selectedTestSuiteDescription(data: any) {
        if (data) {
            this.suiteName = data.testSuiteName;
            this.suiteDescription = data.description;
            this.visibleDescription = true;
        }
    }

    @Input("selectedSectionData")
    set _selectedSectionData(data: any) {
        if (data != undefined) {
            this.sectionName = null;
            this.sectionDescription = null;
            this.sectionData = data;
        }
        if (data && data != undefined) {
            this.isTestCasePresent = true;
            this.isSectionsPresent = false;
            if (this.isHierarchical) {
                this.hierarchicalSectionsData = data;
            }
            // this.filterOpen = false;
            this.loadTestCases();
            this.cdRef.markForCheck();
        }
        else {
            if (this.testSuiteId && (this.sectionData == null || this.sectionData == ''))
                this.isSectionsPresent = true;
            this.isTestCasePresent = false;
        }
    }

    @Input("sectionTemporaryData")
    set _sectionTemporaryData(data: any) {
        if (data) {
            this.sectionData = data;
            this.filterOpen = false;
            this.cdRef.markForCheck();
        }
    }

    @Input("editableSectionData")
    set _editableSectionData(data: any) {
        if (data) {
            this.sectionName = data.sectionName;
            this.sectionDescription = data.description;
        }
        else {
            this.sectionName = null;
            this.sectionDescription = null;
        }
    }

    @Input("isHierarchical")
    set _isHierarchical(data: boolean) {
        if (data || data == false) {
            this.isHierarchical = data;
            this.filterOpen = false;
            this.openFilter = false;
            localStorage.removeItem('selectedCasesFilter');
        }
    }

    @Input("selectedCase")
    set _selectedCase(data: any) {
        if (data) {
            this.testCaseFromPreview = data;
            this.cdRef.detectChanges();
            this.handleClick(data);
        }
        else {
            this.testCaseFromPreview = null;
            this.cdRef.detectChanges();
        }
    }

    testCases$: Observable<TestCase[]>;
    testSuiteSectionList$: Observable<TestSuiteCases>;
    sectionsList$: Observable<TestSuiteCases>;
    anyOperationInProgress$: Observable<boolean>;
    reOrderOperationInProgress$: Observable<boolean>;
    moveOperationInProgress$: Observable<boolean>;
    fromCustomApp = false;
    public ngDestroyed$ = new Subject();
    subs = new Subscription();

    testCaseSearch: TestCase;
    newCaseTitle: TestCaseTitle;

    testCasesModel = [];
    casesSelected = [];
    testCasesData = [];
    filteredList = [];
    sectionsList = [];

    testCaseFromPreview: any;
    selection: any;

    projectId: string;

    suiteDescription: string;
    suiteName: string;
    testSuiteId: string;
    selectedCaseId: string;
    sectionName: string;
    sectionDescription: string;
    casesCount: number = 0;
    hierarchicalOccurence: number = 0;
    visibleDescription: boolean = false;
    isCasesPresent: boolean = false;
    isSectionsPresent: boolean = false;
    isTestCasePresent: boolean = false;
    sectionsLoaded: boolean = false;
    sectionsLoadedOnDelete: boolean = false;
    disableAddCase: boolean = false;
    filterOpen: boolean = false;
    openFilter: boolean = false;
    isOpen: boolean = true;
    isHierarchical: boolean = false;
    disableMoveCases: boolean = false;
    loadMoveCases: boolean = false;
    loadCopyCases: boolean = false;
    sectionSameError: boolean = false;
    isAnyOfCasesSelected: boolean = false;
    isMultiCasesSelected: boolean = false;
    reOrderOperationInProgress: boolean = false;
    disableDeleteTestCase: boolean = false;

    addTestCaseForm: FormGroup;
    moveCasesForm: FormGroup;

    searchTestSuite: TestSuiteList;

    testCaseName: string;
    sectionData: any;
    hierarchicalSectionsData: any;
    multipleSectionsData: any;
    isAddTestCaseOpened: boolean = false;
    isTestSuiteOrNot: boolean = true;
    loadHierarchicalCases: boolean = false;
    casesFilter: boolean = false;
    totalEstimate: number = 0;
    caseViewFieldName: string = ConstantVariables.CaseViewFieldName;

    constructor(private route: ActivatedRoute, private dragulaService: DragulaService, private toastr: ToastrService, private translateService: TranslateService, public dialog: MatDialog, private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        super();

        dragulaService.createGroup("testcases", {
            revertOnSpill: true
            // removeOnSpill: true
        });

        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getTestCasesBySectionIdLoading));

        this.reOrderOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getReorderTestCasesLoading));

        this.moveOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getMoveTestCasesLoading));

        this.selectedCaseId = null;

        this.testSuiteSectionList$ = this.store.pipe(select(testRailModuleReducer.getTestSuiteSectionList));

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadMultipleTestCasesBySectionIdCompleted),
            tap(() => {
                this.disableAddCase = false;
                this.testCaseName = '';
                this.isAddTestCaseOpened = false;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCasesBySectionIdTriggered),
            tap((result) => {
                this.testCaseName = '';
                this.isAddTestCaseOpened = false;
                this.loadHierarchicalCases = false;
                this.testCaseFromPreview = null;
                this.selectedCaseId = null;
                this.casesSelected = [];
                if (this.hierarchicalOccurence == 0) {
                    if (localStorage.getItem('selectedSectionFilter') != null && localStorage.getItem('selectedSectionFilter') != undefined) {
                        this.hierarchicalOccurence = this.hierarchicalOccurence + 1;
                        let sectionData = JSON.parse(localStorage.getItem('selectedSectionFilter'));
                        if (!sectionData.isHierarchical) {
                            this.sectionName = sectionData.value;
                            this.sectionDescription = sectionData.description;
                            this.cdRef.detectChanges();
                        }
                        localStorage.removeItem('selectedSectionFilter');
                    }
                    else {
                        this.sectionName = null;
                        this.sectionDescription = null;
                        this.casesSelected = [];
                        if (this.isHierarchical && this.hierarchicalSectionsData) {
                            let sectionId = this.hierarchicalSectionsData.sectionId;
                            let sectionData = this.checkSubData(this.multipleSectionsData.sections, sectionId);
                            this.hierarchicalSectionsData = sectionData;
                        }
                        this.cdRef.detectChanges();
                    }
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCasesBySectionIdCompleted),
            tap(() => {
                if (this.isHierarchical)
                    this.loadHierarchicalCases = true;
                this.testCases$ = this.store.pipe(select(testRailModuleReducer.getTestCasesBySectionAll));
                this.testCases$.subscribe(result => {
                    this.casesCount = result.length;
                    this.testCasesData = result;
                    this.cdRef.markForCheck();
                    this.totalEstimateCount(result);
                })
                this.openFilter = true;
                this.hierarchicalOccurence = 0;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionListTriggered),
            tap(() => {
                this.openFilter = false;
                localStorage.removeItem('selectedCasesFilter');
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionListCompleted),
            tap(() => {
                this.testSuiteSectionList$.subscribe(result => {
                    this.multipleSectionsData = result;
                    if (this.hierarchicalSectionsData && this.multipleSectionsData && this.multipleSectionsData.sections && this.multipleSectionsData.sections.length > 0) {
                        let sectionsResult = result;
                        let sectionId = this.hierarchicalSectionsData.sectionId;
                        let sectionData = this.checkSubData(sectionsResult.sections, sectionId);
                        this.hierarchicalSectionsData = sectionData;
                        this.cdRef.markForCheck();
                    }
                    else if (this.multipleSectionsData == null || this.multipleSectionsData.sections == null || this.multipleSectionsData.sections.length == 0) {
                        this.hierarchicalSectionsData = null;
                        this.isHierarchical = false;
                        this.sectionData = null;
                        this.isTestCasePresent = false;
                        this.isSectionsPresent = true
                        this.cdRef.markForCheck();
                    }
                })
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadSingleTestCaseBySectionIdTriggered),
            tap(() => {
                this.testCaseFromPreview = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCaseReorderCompleted),
            tap(() => {
                this.dragulaService.find('testcases').drake.cancel(true);
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadMoveTestCasesCompleted),
            tap((result: any) => {
                if (result && result.moveSectionId) {
                    let sectionId = result.moveSectionId;
                    this.casesSelected = [];
                    this.selection = null;
                    this.isMultiCasesSelected = false;
                    this.isAnyOfCasesSelected = false;
                    // if (this.isHierarchical || (this.loadCopyCases && sectionId == this.sectionData.sectionId)) {
                    if (this.isHierarchical || this.loadCopyCases) {
                        this.openFilter = false;
                        localStorage.removeItem('selectedCasesFilter');
                        this.loadTestCases();
                    }
                    this.cdRef.detectChanges();
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.DeleteMultipleTestCases),
            tap(() => {
                this.disableDeleteTestCase = false;
                this.casesSelected = [];
                this.selection = null;
                this.isMultiCasesSelected = false;
                this.isAnyOfCasesSelected = false;
                this.closeDeleteCaseDialog();
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCaseFailed),
            tap(() => {
                this.disableAddCase = false;
                this.disableDeleteTestCase = false;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.subs.add(this.dragulaService.drag("testcases")
            .subscribe(({ el }) => {
                //console.log(el);
                this.reOrderOperationInProgress$.subscribe(x => this.reOrderOperationInProgress = x);
                if (this.reOrderOperationInProgress) {
                    this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
                    this.dragulaService.find('userStories').drake.cancel(true);
                }
                // this.reOrderOperationInProgress$.subscribe(x => {
                //     this.reOrderOperationInProgress = x;
                //     if (this.reOrderOperationInProgress) {
                //         this.dragulaService.find('testcases').drake.cancel(true);
                //     }
                // });
            })
        );

        this.subs.add(this.dragulaService.drop("testcases")
            .takeUntil(this.ngDestroyed$)
            .subscribe(({ name, el, target, source, sibling }) => {
                var orderedListLength = target.children.length;
                let orderedTestCaseList = [];
                let sourceId = el.attributes["data-testcaseid"].value;
                for (var i = 1; i < orderedListLength; i++) {
                    var testCaseId = target.children[i].attributes["data-testcaseid"].value;
                    orderedTestCaseList.push(testCaseId.toLowerCase());
                }
                let index = orderedTestCaseList.indexOf(sourceId);
                if (index != -1) {
                    let dataIndex = this.testCasesData.findIndex(x => x.testCaseId == sourceId);
                    if (dataIndex != -1) {
                        let data = this.testCasesData[dataIndex];
                        this.testCasesData.splice(dataIndex, 1);
                        this.testCasesData.splice(index, 0, data);
                        this.store.dispatch(new LoadTestCasesAfterReorderCompleted(this.testCasesData));
                    }
                }
                // console.log(orderedTestCaseList.toString());
                this.store.dispatch(new LoadTestCaseReorderTriggered(orderedTestCaseList));
            })
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    openAddTestCase() {
        this.testCaseName = '';
        this.isAddTestCaseOpened = !this.isAddTestCaseOpened;
    }

    addTestCase() {
        this.disableAddCase = true;
        this.newCaseTitle = new TestCaseTitle();
        this.newCaseTitle.title = this.testCaseName;
        this.newCaseTitle.sectionId = this.sectionData.sectionId;
        this.newCaseTitle.testSuiteId = this.testSuiteId;
        this.newCaseTitle.isHierarchical = false;
        this.store.dispatch(new LoadTestCaseTitleTriggered(this.newCaseTitle));
    }

    loadTestCases() {
        this.selection = null;
        this.isMultiCasesSelected = false;
        this.isAnyOfCasesSelected = false;
        this.selection = null;
        this.casesSelected = [];
        this.testCaseSearch = new TestCase();
        if (localStorage.getItem('selectedCasesFilter') != null && localStorage.getItem('selectedCasesFilter') != undefined) {
            let searchData = JSON.parse(localStorage.getItem('selectedCasesFilter'));
            this.testCaseSearch = Object.assign({}, searchData);
        }
        this.testCaseSearch.sectionId = this.sectionData.sectionId;
        this.testCaseSearch.isArchived = false;
        this.testCaseSearch.isFilter = false;
        this.testCaseSearch.isHierarchical = this.isHierarchical;
        this.store.dispatch(new LoadTestCasesBySectionIdTriggered(this.testCaseSearch));
        this.testCases$ = this.store.pipe(select(testRailModuleReducer.getTestCasesBySectionAll), tap(result => {
            this.testCasesModel = result;
        }));
    }

    initializeTestCaseForm() {
        this.addTestCaseForm = new FormGroup({
            title: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(500)]))
        })
    }

    handleClick(data) {
        this.selectedCaseId = data.testCaseId;
        this.cdRef.markForCheck();
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    checkSubData(sectionsList, sectionId) {
        for (let i = 0; i < sectionsList.length; i++) {
            if (sectionsList[i].sectionId == sectionId) {
                return sectionsList[i];
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
                return childList[i];
            }
            else if (childList[i].subSections && childList[i].subSections.length > 0) {
                let checkSubSections = this.recursivecheckSubData(childList[i].subSections, sectionId);
                if (checkSubSections != undefined && checkSubSections != undefined)
                    return checkSubSections;
            }
        }
    }

    getCasePreviewDetails(data) {
        this.casePreviewDetails.emit(data);
    }

    copyOrMoveCasesDailogOpen() {
        let currentSectionIdForShift;
        if (this.sectionData && this.sectionData.sectionId)
            currentSectionIdForShift = this.sectionData.sectionId;
        else
            currentSectionIdForShift = null;
        const dialogRef = this.dialog.open(TestSuiteCasesCopyMoveComponent, {
            height: '62%',
            width: '60%',
            hasBackdrop: true,
            direction: 'ltr',
            data: { testSuiteId: this.testSuiteId, projectId: this.projectId, isHierarchical: this.isHierarchical, currentSectionId: currentSectionIdForShift },
            disableClose: true,
            panelClass: 'custom-modal-container'
        });
        dialogRef.afterClosed().subscribe(() => { })
    }

    totalEstimateCount(data) {
        this.totalEstimate = 0;
        data.forEach((x) => {
            if (x.estimate != null) {
                this.totalEstimate = this.totalEstimate + x.estimate;
            }
        })
    }

    getCaseSelection(data) {
        let index = this.casesSelected.indexOf(data);
        if (index != -1) {
            this.casesSelected.splice(index, 1);
        }
        else {
            this.casesSelected.push(data);
        }
        if (this.casesSelected.length > 0)
            this.isAnyOfCasesSelected = true;
        else
            this.isAnyOfCasesSelected = false;
    }

    getCasesSelected(data) {
        let index = this.casesSelected.indexOf(data);
        if (index != -1) {
            this.casesSelected.splice(index, 1);
        }
        else {
            this.casesSelected.push(data);
        }
        if (this.casesSelected.length > 0)
            this.isAnyOfCasesSelected = true;
        else
            this.isAnyOfCasesSelected = false;
        this.selection = null;
    }

    changeStatus(value) {
        this.isMultiCasesSelected = value;
        if (value)
            this.isAnyOfCasesSelected = true;
        else
            this.isAnyOfCasesSelected = false;
        let selections = new TestCaseRunDetails();
        selections.sectionCheckBoxClicked = true;
        selections.sectionSelected = value;
        this.selection = selections;
    }

    openMoveCasesPopover() {
        this.loadMoveCases = true;
        this.loadCopyCases = false;
        this.clearMoveCasesForm();
        this.moveCasePopover.open();
    }

    openCopyCasesPopover() {
        this.loadMoveCases = true;
        this.loadCopyCases = true;
        this.clearMoveCasesForm();
        this.moveCasePopover.open();
    }

    clearMoveCasesForm() {
        this.disableMoveCases = false;
        this.sectionSameError = false;
        this.loadSectionsList();
        this.moveCasesForm = new FormGroup({
            sectionId: new FormControl("", Validators.compose([Validators.required]))
        });
    }

    loadSectionsList() {
        // this.store.dispatch(new LoadTestCaseSectionListTriggered(this.testSuiteId));
        // this.sectionsList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseSectionAll));
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

    moveCasesToSection() {
        this.disableMoveCases = true;
        let moveCasesModel = new MoveTestCasesModel();
        moveCasesModel = this.moveCasesForm.value;
        moveCasesModel.testCaseIds = this.casesSelected;
        moveCasesModel.isHierarchical = this.isHierarchical;
        moveCasesModel.isCopy = this.loadCopyCases;
        moveCasesModel.testSuiteId = this.testSuiteId;
        if (this.isHierarchical == false && moveCasesModel.sectionId.toLowerCase() == this.sectionData.sectionId.toLowerCase() && !this.loadCopyCases) {
            this.sectionSameError = true;
            this.disableMoveCases = false;
            this.cdRef.detectChanges();
        }
        else {
            this.sectionSameError = false;
            this.store.dispatch(new LoadMoveTestCasesTriggered(moveCasesModel));
        }
    }

    closeMoveCasesPopover() {
        this.moveCasePopover.close();
        this.loadMoveCases = false;
        this.loadCopyCases = false;
    }

    openDeleteCasesPopover() {
        this.deleteCasesPopover.open();
    }

    removeTestCase() {
        this.disableDeleteTestCase = true;
        let deleteCase = new TestCaseTitle();
        deleteCase.multipleTestCaseIds = (this.casesSelected && this.casesSelected.length > 0) ? this.casesSelected.toString() : null;
        deleteCase.testSuiteId = this.testSuiteId;
        this.store.dispatch(new LoadMultipleTestCasesDelete(deleteCase));
    }

    closeDeleteCaseDialog() {
        this.deleteCasesPopover.close();
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
        this.dragulaService.destroy("testcases");
    }
}