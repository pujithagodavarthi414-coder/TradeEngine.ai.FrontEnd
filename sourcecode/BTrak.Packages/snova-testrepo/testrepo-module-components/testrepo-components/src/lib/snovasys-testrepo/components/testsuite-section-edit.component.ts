import { Component, ChangeDetectionStrategy, ViewChild, Inject, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { SatPopover } from '@ncstate/sat-popover';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TestSuiteSection } from '../models/testsuitesection';
import { TestSuiteList } from '../models/testsuite';

import { LoadTestSuiteSectionTriggered, TestSuiteSectionActionTypes } from '../store/actions/testsuitesection.actions';
import { LoadTestSuiteByIdTriggered } from '../store/actions/testsuiteslist.action';
import { LoadTestCaseSectionListTriggered } from '../store/actions/testcasesections.actions';

@Component({
    selector: 'testsuite-section-edit',
    templateUrl: './testsuite-section-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuiteSectionEditComponent {
    @Output() closeSection = new EventEmitter<string>();
    @Output() isSectionEdit = new EventEmitter<boolean>();
    @Output() editingSectionData = new EventEmitter<any>();
    
    @Input("testSuiteId")
    set _testSuiteId(data: string) {
        if (data)
            this.testSuiteId = data;
        console.log(data);
    }

    @Input("sectionData")
    set _sectionData(data: any) {
        if (data)
            this.sectionData = data;
    }

    @Input("editingSection")
    set _editingSection(data: any) {
        if (data) {
            if (data == 'false') {
                this.initializeSectionForm();
                this.editingSection = false;
                this.parentSectionId = this.sectionData.sectionId;
            }
            else if (data == 'true') {
                this.editingSection = true;
                this.addSectionForm.patchValue({
                    sectionName: this.sectionData.sectionName,
                    description: this.sectionData.description
                });
            }
            else if (data == 'notedit') {
                this.initializeSectionForm();
                this.editingSection = false;
            }
        }
    }

    public ngDestroyed$ = new Subject();

    addSectionForm: FormGroup;

    newSection: TestSuiteSection;
    searchTestSuite: TestSuiteList;

    sectionData: any;
    testSuiteId: string;
    editingSection: boolean = false;
    disableSection: boolean = false;
    parentSectionId: string = null;

    constructor(private route: ActivatedRoute, private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        this.initializeSectionForm();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionListCompleted),
            tap(() => {
                this.closeSectionDialog();
                this.disableSection = false;
                this.initializeSectionForm();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadSingleTestSuiteSectionCompleted),
            tap(() => {
                this.closeSectionDialog();
                this.disableSection = false;
                this.initializeSectionForm();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.TestSuiteSectionFailed),
            tap(() => {
                this.disableSection = false;
                this.isSectionEdit.emit(true);
                this.cdRef.detectChanges();
            })
        ).subscribe();
    }

    closeSectionDialog() {
        this.closeSection.emit('');
    }

    addNewSection() {
        this.disableSection = true;
        this.newSection = new TestSuiteSection();
        this.newSection = this.addSectionForm.value;
        this.newSection.testSuiteId = this.testSuiteId;
        this.newSection.parentSectionId = this.parentSectionId;
        if (this.editingSection) {
            this.newSection.testSuiteSectionId = this.sectionData.sectionId;
            this.newSection.timeStamp = this.sectionData.timeStamp;
            this.newSection.parentSectionId = this.sectionData.parentSectionId;
        }
        this.store.dispatch(new LoadTestSuiteSectionTriggered(this.newSection));
        // this.isSectionEdit.emit(false);
        if (this.editingSection)
            this.editingSectionData.emit(this.newSection);
    }

    initializeSectionForm() {
        this.addSectionForm = new FormGroup({
            sectionName: new FormControl("", Validators.compose([Validators.maxLength(100), Validators.required])),
            description: new FormControl("", Validators.compose([Validators.maxLength(150)]))
        });
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}