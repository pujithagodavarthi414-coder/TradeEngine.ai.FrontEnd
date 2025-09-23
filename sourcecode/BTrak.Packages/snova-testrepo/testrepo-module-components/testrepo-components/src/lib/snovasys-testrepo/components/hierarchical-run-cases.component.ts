import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ViewChildren, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SatPopover } from "@ncstate/sat-popover";

import "../../globaldependencies/helpers/fontawesome-icons";

import { TestCase } from "../models/testcase";
import { TestCaseDropdownList } from "../models/testcasedropdown";
import { TestCaseRunDetails } from "../models/testcaserundetails";
import { UpdateMultiple } from "../models/updatemultiple";

import { TestCaseActionTypes, LoadMultipleTestRunResultTriggered } from "../store/actions/testcaseadd.actions";

import * as testRailModuleReducer from "../store/reducers/index";
import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';

@Component({
    selector: "hierarchical-run-cases",
    templateUrl: "./hierarchical-run-cases.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HierarchicalRunCasesComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @ViewChild("updateAssigneePopover") updateAssigneesPopover: SatPopover;
    @ViewChild("updateStatusPopover") updateStatusesPopover: SatPopover;
    @ViewChildren("updateAssigneesPopover") updateAssigneePopover;
    @ViewChildren("updateStatusesPopover") updateStatusPopover;
    @Output() caseStatusPreviewDetails = new EventEmitter<any>();
    @Output() casesSelected = new EventEmitter<any>();
    @Output() caseSelection = new EventEmitter<any>();

    @Input() isBugBoardEnable: boolean;

    @Input("hierarchicalData")
    set _hierarchicalData(data: any) {
        if (data) {
            this.hierarchicalData = data;
        }
    }

    @Input("testSuiteId")
    set _testSuiteId(data: string) {
        if (data)
            this.testSuiteId = data;
    }

    @Input("testRunId")
    set _testRunId(data: string) {
        if (data)
            this.testRunId = data;
    }

    @Input("casesData")
    set _casesData(data: any) {
        if (data) {
            this.testCases = data;
            // this.testCases$ = this.store.pipe(select(testRailModuleReducer.getHierarchicalTestCasesFilterBySectionId, { sectionId: this.hierarchicalData.sectionId }));
            this.testCases$ = this.store.pipe(select(testRailModuleReducer.getHierarchicalTestRunCasesFilterBySectionId, { sectionId: this.hierarchicalData.sectionId }));
            this.testCases$.subscribe(result => {
                this.casesCount = result.length;
                this.totalEstimateCount(result);
                this.cdRef.markForCheck();
            });
        }
    }

    @Input("hierarchicalSectionId")
    set _hierarchicalSectionId(data: string) {
        if (data)
            this.hierarchicalSectionId = data;
    }

    @Input("testRunCompleted")
    set _testRunCompleted(data: boolean) {
        if (data || data == false)
            this.testRunCompleted = data;
    }

    @Input("projectId")
    set _projectId(data: string) {
        if (data)
            this.projectId = data;
    }

    @Input("allCasesSelect")
    set _allCasesSelect(data: any) {
        if (data) {
            this.selection = data;
            if (data.sectionCheckBoxClicked && data.sectionSelected && (this.isMultiCasesSelected == false || this.isMultiCasesSelected == undefined))
                this.isMultiCasesSelected = true;
            else if (data.sectionCheckBoxClicked && data.sectionSelected == false && this.isMultiCasesSelected)
                this.isMultiCasesSelected = false;
        }
    }

    @Input("selectedCase")
    set _selectedCase(data: any) {
        if (data) {
            this.testCaseFromPreview = data;
            this.handleClick(data);
        }
        else {
            this.testCaseFromPreview = null;
        }
    }

    testCases$: Observable<TestCase[]>;
    usersList$: Observable<TestCaseDropdownList[]>;
    statusList$: Observable<TestCaseDropdownList[]>;

    public ngDestroyed$ = new Subject();

    public initSettings = {
        plugins: "paste",
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };

    assignToForm: FormGroup;
    statusForm: FormGroup;

    testCases: any;
    hierarchicalData: any;
    selection: any;
    testCaseFromPreview: any;
    selectedCaseId: string;
    casesCount: number = 0;
    testCaseName: string = '';
    testSuiteId: string;
    testRunId: string;
    hierarchicalSectionId: string;
    projectId: string;
    isAddTestCaseOpened: boolean = false;
    disableAddCase: boolean = false;
    // casesSelected = [];
    testRunCompleted: boolean = false;
    isAnyOfCasesSelected: boolean = false;
    isMultiCasesSelected: boolean = false;
    disableUpdate: boolean = false;
    loadAssignForm: boolean = false;
    loadStatusForm: boolean = false;
    totalEstimate: number = 0;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        super();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCasesBySectionAndRunIdTriggered),
            tap(() => {
                // this.casesSelected = [];
                this.testCaseFromPreview = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadSingleTestRunCaseBySectionIdTriggered),
            tap(() => {
                this.testCaseFromPreview = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadMultipleTestRunResultCompleted),
            tap(() => {
                this.disableUpdate = false;
                this.updateAssigneePopover.forEach(p => p.closePopover());
                this.updateStatusPopover.forEach(p => p.closePopover());
                // this.casesSelected = [];
                this.isMultiCasesSelected = false;
                this.isAnyOfCasesSelected = false;
                this.loadAssignForm = false;
                this.loadStatusForm = false;
                this.selection = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestCaseActionTypes.LoadTestCaseFailed),
                tap(() => {
                    this.disableUpdate = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    handleClick(data) {
        this.selectedCaseId = data.testCaseId;
        this.cdRef.markForCheck();
    }

    getCaseSelection(data) {
        this.caseSelection.emit(data);
    }

    getCasesSelected(data) {
        this.casesSelected.emit(data);
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

    openAssigneePopover(updateAssigneesPopover) {
        this.loadAssignForm = true;
        this.clearAssignToForm();
        updateAssigneesPopover.openPopover();
    }

    openStatusPopover(updateStatusesPopover) {
        this.loadStatusForm = true;
        this.clearStatusForm();
        updateStatusesPopover.openPopover();
    }

    closeAssigneePopover() {
        this.updateAssigneePopover.forEach(p => p.closePopover());
        this.loadAssignForm = false;
    }

    closeStatusPopover() {
        this.updateStatusPopover.forEach(p => p.closePopover());
        this.loadStatusForm = false;
    }

    clearAssignToForm() {
        this.disableUpdate = false;
        this.loadUsersList();
        this.assignToForm = new FormGroup({
            assignToId: new FormControl("", Validators.compose([Validators.required]))
        });
    }

    clearStatusForm() {
        this.disableUpdate = false;
        this.loadStatuses();
        this.statusForm = new FormGroup({
            statusId: new FormControl("", Validators.compose([Validators.required])),
            statusComment: new FormControl("", ([]))
        });
    }

    loadUsersList() {
        this.usersList$ = this.store.pipe(select(testRailModuleReducer.getTestRunUserAll));
    }

    loadStatuses() {
        this.statusList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseStatusAll));
    }

    updateMultipleAssignTo() {
        this.disableUpdate = true;
        let multiple = new UpdateMultiple();
        multiple = this.assignToForm.value;
        multiple.testRunId = this.testRunId;
        // multiple.testCaseIds = this.casesSelected;
        multiple.sectionId = this.hierarchicalData.sectionId;
        multiple.isHierarchical = true;
        multiple.hierarchicalSectionId = this.hierarchicalSectionId;
        this.store.dispatch(new LoadMultipleTestRunResultTriggered(multiple));
    }

    updateMultipleStatus() {
        this.disableUpdate = true;
        let multiple = new UpdateMultiple();
        multiple = this.statusForm.value;
        multiple.testRunId = this.testRunId;
        // multiple.testCaseIds = this.casesSelected;
        multiple.sectionId = this.hierarchicalData.sectionId;
        multiple.isHierarchical = true;
        multiple.hierarchicalSectionId = this.hierarchicalSectionId;
        this.store.dispatch(new LoadMultipleTestRunResultTriggered(multiple));
    }

    getCaseStatusPreviewDetails(data) {
        this.caseStatusPreviewDetails.emit(data);
    }

    totalEstimateCount(data) {
        this.totalEstimate = 0;
        data.forEach((x) => {
            if (x.estimate != null) {
                this.totalEstimate = this.totalEstimate + x.estimate;
            }
        })
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}