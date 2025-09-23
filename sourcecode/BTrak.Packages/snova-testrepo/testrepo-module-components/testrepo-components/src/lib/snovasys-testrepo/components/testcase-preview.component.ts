import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { TestCase } from '../models/testcase';

import { TestCaseActionTypes, LoadSingleTestCaseBySectionIdTriggered } from '../store/actions/testcaseadd.actions';
import * as testRailModuleReducer from "../store/reducers/index";

import { ConstantVariables } from '../constants/constant-variables';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

const exploratorySession = ConstantVariables.ExploratorySession;
const testCaseSteps = ConstantVariables.TestCaseSteps;
const testCaseText = ConstantVariables.TestCaseText;

@Component({
    selector: 'testcase-preview',
    templateUrl: './testcase-preview.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestCasePreviewComponent {
    @Output() closePreview = new EventEmitter<any>();
    @Output() testCaseHistoryDetails = new EventEmitter<any>();

    @Input("testCaseDetails")
    set _testCaseDetails(data: any) {
        if (data) {
            this.testCaseDetails = data;
            this.loadCaseDetails(this.testCaseDetails);
        }
    }

    testCaseDetails$: Observable<TestCase>;
    anyOperationInProgress$: Observable<boolean>;

    softLabels: SoftLabelConfigurationModel[];

    public ngDestroyed$ = new Subject();

    testCaseDetails: any;
    singleTestCaseDetails: any;
    preFilePath = [];
    stepMostFilePath = [];
    expectedMostFilePath = [];
    testCaseMissionFilePath = [];
    testCaseGoalFilePath = [];
    testCaseFilePath = [];
    loadDetails: boolean = false;
    showExploratory: boolean = false;
    showSteps: boolean = false;
    showText: boolean = false;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef, private _sanitizer: DomSanitizer) {
        this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getSingleTestCaseDetailsLoading));

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadSingleTestCaseBySectionIdTriggered),
            tap(() => {
                this.loadDetails = false;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadSingleTestCaseBySectionIdCompleted),
            tap(() => {
                this.testCaseDetails$.subscribe(result => {
                    if (result) {
                        this.singleTestCaseDetails = result;
                        this.testCaseHistoryDetails.emit(result);
                        if (this.singleTestCaseDetails.testCaseFilePath != null)
                            this.testCaseFilePath = this.singleTestCaseDetails.testCaseFilePath.split(',');
                        else
                            this.testCaseFilePath = [];
                        if (this.singleTestCaseDetails.preConditionFilePath != null)
                            this.preFilePath = this.singleTestCaseDetails.preConditionFilePath.split(',');
                        else
                            this.preFilePath = [];
                        // if (this.singleTestCaseDetails.stepsFilePath != null)
                        //     this.stepMostFilePath = this.singleTestCaseDetails.stepsFilePath.split(',');
                        // else
                        //     this.stepMostFilePath = [];
                        if (this.singleTestCaseDetails.testCaseStepDescriptionFilePath != null)
                            this.stepMostFilePath = this.singleTestCaseDetails.testCaseStepDescriptionFilePath.split(',');
                        else
                            this.stepMostFilePath = [];
                        if (this.singleTestCaseDetails.expectedResultFilePath != null)
                            this.expectedMostFilePath = this.singleTestCaseDetails.expectedResultFilePath.split(',');
                        else
                            this.expectedMostFilePath = [];
                        if (this.singleTestCaseDetails.testCaseMissionFilePath != null)
                            this.testCaseMissionFilePath = this.singleTestCaseDetails.testCaseMissionFilePath.split(',');
                        else
                            this.testCaseMissionFilePath = [];
                        if (this.singleTestCaseDetails.testCaseGoalFilePath != null)
                            this.testCaseGoalFilePath = this.singleTestCaseDetails.testCaseGoalFilePath.split(',');
                        else
                            this.testCaseGoalFilePath = [];
                        this.checkTemplate();
                        this.loadDetails = true;
                        this.cdRef.markForCheck();
                    }
                })
            })
        ).subscribe();
    }

    ngOnInit() {
        this.getSoftLabels();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    checkTemplate() {
        if (this.singleTestCaseDetails.templateName == testCaseSteps) {
            this.showSteps = true;
            this.showText = false;
            this.showExploratory = false;
        }
        else if (this.singleTestCaseDetails.templateName == testCaseText) {
            this.showSteps = false;
            this.showText = true;
            this.showExploratory = false;
        }
        else if (this.singleTestCaseDetails.templateName == exploratorySession) {
            this.showSteps = false;
            this.showText = false;
            this.showExploratory = true;
        }
    }
    navigateToReferencePage(referenceUrl) {
        if (!referenceUrl.includes("http")) {
            referenceUrl = 'http://' + referenceUrl;
        }

        window.open(referenceUrl, '_blank');
    }

    validateUrl(value) {
        var expression = "[-a-zA-Z0-9@:%_\/+.~#?&=]{2,256}\.[a-z]{2,4}(\/[-a-zA-Z0-9@:%_\+.~#?&=]*)?";
        var regex = new RegExp(expression);
        if (value.match(regex)) {
            return true;
        } else {
            return false;
        }
    }

    loadCaseDetails(caseDetails) {
        let testCaseSearch = new TestCase();
        testCaseSearch.sectionId = caseDetails.sectionId;
        testCaseSearch.testCaseId = caseDetails.testCaseId;
        testCaseSearch.isArchived = false;
        this.store.dispatch(new LoadSingleTestCaseBySectionIdTriggered(testCaseSearch));
        this.testCaseDetails$ = this.store.pipe(select(testRailModuleReducer.getSingleTestCaseDetailsByCaseId));
    }

    getStepTextImagesArray(index) {
        let data = this.singleTestCaseDetails.testCaseSteps[index].stepTextFilePath;
        return data.split(',');
    }

    getStepResultImagesArray(index) {
        let data = this.singleTestCaseDetails.testCaseSteps[index].stepExpectedResultFilePath;
        return data.split(',');
    }

    sanitizeUrl(imgUrl) {
        return this._sanitizer.bypassSecurityTrustUrl(imgUrl);
    }

    closeTestCasePreviewDialog() {
        this.closePreview.emit('');
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}