import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';

import { TestCase } from '../models/testcase';
import { ConstantVariables } from '../constants/constant-variables';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

const exploratorySession = ConstantVariables.ExploratorySession;
const testCaseSteps = ConstantVariables.TestCaseSteps;
const testCaseText = ConstantVariables.TestCaseText;

@Component({
    selector: 'report-testcase-preview',
    templateUrl: './report-testcase-preview.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReportTestCasePreviewComponent {
    @Input("testCaseDetails")
    set _testCaseDetails(data: any) {
        if (data) {
            this.testCaseDetails = data;
            if (this.testCaseDetails.preConditionFilePath != null)
                this.preFilePath = this.testCaseDetails.preConditionFilePath.split(',');
            else
                this.preFilePath = [];
            if (this.testCaseDetails.stepsFilePath != null)
                this.stepMostFilePath = this.testCaseDetails.stepsFilePath.split(',');
            else
                this.stepMostFilePath = [];
            if (this.testCaseDetails.expectedResultFilePath != null)
                this.expectedMostFilePath = this.testCaseDetails.expectedResultFilePath.split(',');
            else
                this.expectedMostFilePath = [];
            this.checkTemplate();
        }
    }

    testCaseDetails$: Observable<TestCase[]>;
    anyOperationInProgress$: Observable<boolean>;

    softLabels: SoftLabelConfigurationModel[];

    public ngDestroyed$ = new Subject();

    testCaseSearch: TestCase;

    testCaseDetails: TestCase;
    preFilePath = [];
    stepMostFilePath = [];
    expectedMostFilePath = [];
    showExploratory: boolean = false;
    showSteps: boolean = false;
    showText: boolean = false;

    constructor(private _sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.getSoftLabels();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    checkTemplate() {
        if (this.testCaseDetails.templateName == testCaseSteps) {
            this.showSteps = true;
            this.showText = false;
            this.showExploratory = false;
        }
        else if (this.testCaseDetails.templateName == testCaseText) {
            this.showSteps = false;
            this.showText = true;
            this.showExploratory = false;
        }
        else if (this.testCaseDetails.templateName == exploratorySession) {
            this.showSteps = false;
            this.showText = false;
            this.showExploratory = true;
        }
    }

    getStepTextImagesArray(index) {
        let data = this.testCaseDetails.testCaseSteps[index].stepTextFilePath;
        return data.split(',');
    }

    getStepResultImagesArray(index) {
        let data = this.testCaseDetails.testCaseSteps[index].stepExpectedResultFilePath;
        return data.split(',');
    }

    sanitizeUrl(imgUrl) {
        return this._sanitizer.bypassSecurityTrustUrl(imgUrl);
    }

    navigateToReferencePage(referenceUrl) {
        if (!referenceUrl.includes("http")) {
            referenceUrl = 'http://' + referenceUrl;
        }

        window.open(referenceUrl, '_blank');
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}