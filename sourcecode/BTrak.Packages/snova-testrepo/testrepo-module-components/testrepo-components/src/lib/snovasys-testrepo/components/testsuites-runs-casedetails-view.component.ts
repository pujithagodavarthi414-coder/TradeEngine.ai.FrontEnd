import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import "../../globaldependencies/helpers/fontawesome-icons";

import { ConstantVariables } from '../constants/constant-variables';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

const exploratorySession = ConstantVariables.ExploratorySession;
const testCaseSteps = ConstantVariables.TestCaseSteps;
const testCaseText = ConstantVariables.TestCaseText;

@Component({
    selector: 'testsuites-runs-casedetails-view',
    templateUrl: './testsuites-runs-casedetails-view.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuitesRunsCaseDetailsViewComponent {
    @Input("testCaseDetails")
    set _testCaseDetails(data: any) {
        this.testCaseDetail = data;
        if (this.testCaseDetail.testCaseFilePath != null)
            this.testCaseFilePath = this.testCaseDetail.testCaseFilePath.split(',');
        else
            this.testCaseFilePath = [];
        if (this.testCaseDetail.preConditionFilePath != null)
            this.preFilePath = this.testCaseDetail.preConditionFilePath.split(',');
        else
            this.preFilePath = [];
        // if (this.testCaseDetail.stepsFilePath != null)
        //     this.stepMostFilePath = this.testCaseDetail.stepsFilePath.split(',');
        // else
        //     this.stepMostFilePath = [];
        if (this.testCaseDetail.testCaseStepDescriptionFilePath != null)
            this.stepMostFilePath = this.testCaseDetail.testCaseStepDescriptionFilePath.split(',');
        else
            this.stepMostFilePath = [];
        if (this.testCaseDetail.expectedResultFilePath != null)
            this.expectedMostFilePath = this.testCaseDetail.expectedResultFilePath.split(',');
        else
            this.expectedMostFilePath = [];
        if (this.testCaseDetail.testCaseMissionFilePath != null)
            this.testCaseMissionFilePath = this.testCaseDetail.testCaseMissionFilePath.split(',');
        else
            this.testCaseMissionFilePath = [];
        if (this.testCaseDetail.testCaseGoalFilePath != null)
            this.testCaseGoalFilePath = this.testCaseDetail.testCaseGoalFilePath.split(',');
        else
            this.testCaseGoalFilePath = [];
        if (this.testCaseDetail.templateName == testCaseSteps) {
            this.showSteps = true;
            this.showText = false;
            this.showExploratory = false;
        }
        else if (this.testCaseDetail.templateName == testCaseText) {
            this.showSteps = false;
            this.showText = true;
            this.showExploratory = false;
        }
        else if (this.testCaseDetail.templateName == exploratorySession) {
            this.showSteps = false;
            this.showText = false;
            this.showExploratory = true;
        }
    }

    testCaseDetail: any;
    preFilePath = [];
    stepMostFilePath = [];
    expectedMostFilePath = [];
    testCaseMissionFilePath = [];
    testCaseGoalFilePath = [];
    testCaseFilePath = [];
    showExploratory: boolean = false;
    showSteps: boolean = false;
    showText: boolean = false;

    softLabels: SoftLabelConfigurationModel[];

    constructor(private _sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.getSoftLabels();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    getStepTextImagesArray(index) {
        let data = this.testCaseDetail.testCaseSteps[index].stepTextFilePath;
        return data.split(',');
    }

    getStepResultImagesArray(index) {
        let data = this.testCaseDetail.testCaseSteps[index].stepExpectedResultFilePath;
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
}