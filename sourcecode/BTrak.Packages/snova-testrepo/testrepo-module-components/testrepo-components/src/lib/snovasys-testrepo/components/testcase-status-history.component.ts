import { Component, Input } from "@angular/core";

import { HistoryModel } from "../models/history";
import { Store, select } from '@ngrx/store';
import { State as TestRailState } from "../../snovasys-testrepo/store/reducers/index";
import * as testRailModuleReducer from "../../snovasys-testrepo/store/reducers/index";

import { Observable } from "rxjs";
import { LoadHistoryByUserStoryIdTriggered } from "../store/actions/testcaseadd.actions";
import { TestCaseHistoryModel } from "../models/testcase";

import { ConstantVariables } from '../constants/constant-variables';

const testCaseSteps = ConstantVariables.TestCaseSteps;

@Component({
    selector: "testcase-status-history",
    templateUrl: "./testcase-status-history.component.html"
})

export class TestcaseStatusHistoryComponent {
    @Input("testCaseDetail")
    set _testCaseDetail(data: any) {
        if (data) {
            this.testCaseDetails = data;
            if (this.testCaseDetails.templateName == testCaseSteps)
                this.showSteps = true;
            else
                this.showSteps = false;
            // if (this.testCaseDetails.testCaseHistory && this.testCaseDetails.testCaseHistory.length > 0)
            //     this.caseHistory = true;
            // else
            //     this.caseHistory = false;
        }
    }

    @Input("reportId")
    set _reportId(data: string) {
        if (data != undefined && data) {
            this.reportId = data;
        }
        else {
            this.reportId = null;
        }
    }

    testCaseDetails: any;
    reportId: string;
    showSteps: boolean = false;
    caseHistory: boolean = false;
    isCaseViewed: boolean = false;

    testCaseHistory$: Observable<TestCaseHistoryModel[]>;
    anyOperationInProgress$: Observable<boolean>;

    constructor(private testrailStore: Store<TestRailState>) {
        this.anyOperationInProgress$ = this.testrailStore.pipe(select(testRailModuleReducer.getHistoryByUserStoryIdLoading));
    }

    ngOnInit() {
        this.loadHistory();
    }

    loadHistory() {
        let userstoryHistory = new HistoryModel();
        userstoryHistory.testCaseId = this.testCaseDetails.testCaseId;
        userstoryHistory.testRunId = this.testCaseDetails.testRunId;
        if (this.reportId)
            userstoryHistory.reportId = this.reportId;
        this.testrailStore.dispatch(new LoadHistoryByUserStoryIdTriggered(userstoryHistory));
        this.testrailStore.pipe(select(testRailModuleReducer.getHistoryByUserStoryId));
        this.testCaseHistory$ = this.testrailStore.pipe(select(testRailModuleReducer.getHistoryByUserStoryId));
    }

    checkPermission(description, userStoryId) {
        if (userStoryId == null) {
            if (description != 'AddedToTestRun' && description != 'RemovedFromTestRun') {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
}