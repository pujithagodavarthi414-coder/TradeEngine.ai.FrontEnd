import { Component, ChangeDetectionStrategy, Input, ViewChildren, Output, EventEmitter, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import "../../globaldependencies/helpers/fontawesome-icons";

import { TestSuiteSection } from '../models/testsuitesection';
import { TestSuiteList } from '../models/testsuite';

import { LoadTestSuiteSectionDeleteTriggered, TestSuiteSectionActionTypes } from '../store/actions/testsuitesection.actions';
import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { TestCaseActionTypes } from '../store/actions/testcaseadd.actions';

@Component({
    selector: 'testsuite-section-operations',
    templateUrl: './testsuite-section-operations.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuiteSectionOperationsComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @ViewChildren('addSectionPopover') addSectionsPopover;
    @ViewChildren('editSectionPopover') editSectionsPopover;
    @ViewChildren('deleteSectionPopover') deleteSectionsPopover;
    @ViewChildren('confimationPopover') confimationDeletePopover;
    @ViewChild("sectionName") sectionNameStatus: ElementRef;
    @Output() selectedSectionData = new EventEmitter<any>();
    @Output() selectedEditSectionData = new EventEmitter<any>();
    @Output() sectionCheckedDeleted = new EventEmitter<any>();
    @Output() isSectionDeleted = new EventEmitter<boolean>();
    @Output() changeTreeStructre = new EventEmitter<boolean>();

    @Input("testSuiteId")
    set _testSuiteId(data: string) {
        if (data)
            this.testSuiteId = data;
    }

    @Input("sectionData")
    set _sectionData(data: any) {
        if (data) {
            this.sectionData = data;
            if (this.sectionData.subSections && this.sectionData.subSections.length != 0)
                this.isChildsPresent = true;
            else
                this.isChildsPresent = false;
        }
    }

    @Input("sectionSelected")
    set _sectionSelected(data: any) {
        if (data) {
            if (data == this.sectionData.sectionId) {
                this.isSectionSelectedOrNot = true;
                this.selectedSectionId = this.sectionData.sectionId;
                localStorage.setItem("selectedSectionId", this.selectedSectionId);
            }
            else {
                this.isSectionSelectedOrNot = false;
                this.selectedSectionId = null;
            }
        }
    }

    @Input("sectionCollapse")
    set _sectionCollapse(data: boolean) {
        if (data || data == false) {
            this.treeStructure = data;
        }
    }

    @Input("filterCases")
    set _filterCases(data: any) {
        if (data) {
            let cases = [];
            cases = data.filterCases;
            this.casesVisible = data.isFilter;
            if (this.casesVisible && cases && cases.length > 0) {
                let index = cases.findIndex(x => x.sectionId == this.sectionData.sectionId);
                if (index != -1) {
                    this.noOfCasesSelected = cases[index].testCasesCount;
                    this.cdRef.markForCheck();
                }
                else {
                    this.noOfCasesSelected = 0;
                    this.cdRef.markForCheck();
                }
            } else if(cases.length == 0 && data.isFilter) {
                this.casesVisible = true;
                this.noOfCasesSelected = 0;
                this.cdRef.markForCheck();
            }
            else {
                this.casesVisible = false;
                this.noOfCasesSelected = 0;
                this.cdRef.markForCheck();
            }
        }
        else {
            this.casesVisible = false;
            this.cdRef.markForCheck();
        }
    }

    public ngDestroyed$ = new Subject();

    addSectionForm: FormGroup;

    newSection: TestSuiteSection;
    searchTestSuite: TestSuiteList;

    sectionData: any;
    noOfCasesSelected: number = 0;
    testSuiteId: string;
    sectionEdit: string = '';
    selectedSectionId: string = null;
    editingSection: boolean = false;
    isOpenConfirmPopus: boolean = false;
    disableSection: boolean = false;
    disableSectionDelete: boolean = false;
    loadSection: boolean = false;
    treeStructure: boolean = false;
    isChildsPresent: boolean = false;
    isSectionSelectedOrNot: boolean = false;
    showTitleTooltip: boolean = false;
    casesVisible: boolean = false;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        super();
        this.initializeSectionForm();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionDeleteCompleted),
            tap(() => {
                this.disableSectionDelete = false;
            })
        ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.isOpenConfirmPopus = false;
    }

    openSectionPopOver(sectionPopover) {
        this.editingSection = false;
        this.loadSection = true;
        this.sectionEdit = 'false';
        sectionPopover.openPopover();
    }

    closeSectionDialog() {
        this.loadSection = false;
        this.addSectionsPopover.forEach((p) => p.closePopover());
        this.editSectionsPopover.forEach((p) => p.closePopover());
    }

    openDeleteSectionPopOver(deleteSectionPopover) {
        deleteSectionPopover.openPopover();
    }

    openDeleteConfimationPopOver(confimationPopover) {
        if (this.isOpenConfirmPopus == true) {
            confimationPopover.openPopover();
        }
    }

    closeDeleteConfimationDialog() {
        this.confimationDeletePopover.forEach((p) => p.closePopover());
    }

    closeDeleteSectionDialog() {
        this.deleteSectionsPopover.forEach((p) => p.closePopover());
    }

    editSection(sectionPopover) {
        this.editingSection = true;
        this.sectionEdit = 'true';
        this.loadSection = true;
        sectionPopover.openPopover();
    }

    mainDelete() {
        // if (this.sectionData.subSections == null || this.sectionData.subSections == [] || this.sectionData.subSections.length == 0) 
        if (!this.isChildsPresent) {
            //this.removeSection()
            this.isOpenConfirmPopus = false;
            this.disableSectionDelete = true;
            this.newSection = new TestSuiteSection();
            this.newSection.testSuiteId = this.testSuiteId;
            this.newSection.testSuiteSectionId = this.sectionData.sectionId;
            this.newSection.sectionName = this.sectionData.sectionName;
            this.newSection.timeStamp = this.sectionData.timeStamp;
            this.store.dispatch(new LoadTestSuiteSectionDeleteTriggered(this.newSection));
            this.sectionCheckedDeleted.emit(this.newSection.testSuiteSectionId);
        }
        else {
            this.isOpenConfirmPopus = true;
        }
    }

    removeSection() {
        this.disableSectionDelete = true;
        this.newSection = new TestSuiteSection();
        this.newSection.testSuiteId = this.testSuiteId;
        this.newSection.testSuiteSectionId = this.sectionData.sectionId;
        this.newSection.sectionName = this.sectionData.sectionName;
        this.newSection.timeStamp = this.sectionData.timeStamp;
        this.store.dispatch(new LoadTestSuiteSectionDeleteTriggered(this.newSection));
        this.sectionCheckedDeleted.emit(this.newSection.testSuiteSectionId);
    }

    getTestCase() {
        this.selectedSectionData.emit(this.sectionData);
    }

    getUpdatedSection(value) {
        this.isSectionDeleted.emit(value);
    }

    initializeSectionForm() {
        this.addSectionForm = new FormGroup({
            sectionName: new FormControl("", Validators.compose([Validators.maxLength(100), Validators.required])),
            description: new FormControl("", Validators.compose([Validators.maxLength(150)]))
        });
    }

    showTreeView() {
        this.treeStructure = !this.treeStructure;
        this.changeTreeStructre.emit(false);
    }

    hideTreeView() {
        this.treeStructure = !this.treeStructure;
        this.changeTreeStructre.emit(true);
    }

    treeView() {
        this.treeStructure = !this.treeStructure;
        if (this.treeStructure)
            this.changeTreeStructre.emit(false);
        else
            this.changeTreeStructre.emit(true);
    }

    getEditingSectionData(value) {
        if (value.testSuiteSectionId == this.selectedSectionId) {
            this.selectedEditSectionData.emit(value);
        }
    }

    checkTitleTooltipStatus() {
        if (this.sectionNameStatus.nativeElement.scrollWidth > this.sectionNameStatus.nativeElement.clientWidth) {
            this.showTitleTooltip = true;
        }
        else {
            this.showTitleTooltip = false;
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}