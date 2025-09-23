import { Component, Input } from "@angular/core";
import { HistoryModel } from "../models/history";
import { Store, select } from '@ngrx/store';
import { State as TestRailState } from "../../snovasys-testrepo/store/reducers/index";
import * as testRailModuleReducer from "../../snovasys-testrepo/store/reducers/index";
import { Observable, Subject } from "rxjs";
import { LoadHistoryByUserStoryIdTriggered } from "../store/actions/testcaseadd.actions";
import { TestCaseHistoryModel } from "../models/testcase";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";
import { TestRunActionTypes } from "../store/actions/testrun.actions";

@Component({
    selector: "testsuite-case-history",
    templateUrl: "./testsuite-case-history.component.html"
})

export class TestSuiteCaseHistoryComponent {
    @Input("testCaseDetail")
    set _testCaseDetail(data: any) {
        if (data) {
            this.testCaseDetail = data;
            this.loadHistory();
        }
    }

    testCaseDetail: any;
    testSuiteId: string;
    caseHistory: boolean = false;
    isCaseViewed: boolean = false;
    anyOperationInProgress$: Observable<boolean>;
    testCaseHistory$: Observable<TestCaseHistoryModel[]>;

    public ngDestroyed$ = new Subject();

    constructor(private testrailStore: Store<TestRailState>,  private actionUpdates$: Actions) {

        this.anyOperationInProgress$ = this.testrailStore.pipe(select(testRailModuleReducer.getHistoryByUserStoryIdLoading));
        this.actionUpdates$
        .pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestRunActionTypes.LoadTestRunTriggered),
            tap((result: any) => {
                if(result.testRun) {
                    this.testSuiteId = result.testRun.testSuiteId;
                }
            })
        )
        .subscribe();

        this.actionUpdates$
        .pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestRunActionTypes.LoadTestRunCompleted),
            tap((result: any) => {
                if(result.testRunId && this.testSuiteId && this.testSuiteId == this.testCaseDetail.testSuiteId) {
                    this.loadHistory();
                }
            })
        )
        .subscribe();
    }

    loadHistory() {
        let userstoryHistory = new HistoryModel();
        userstoryHistory.testCaseId = this.testCaseDetail.testCaseId
        this.testrailStore.dispatch(new LoadHistoryByUserStoryIdTriggered(userstoryHistory));
        this.testrailStore.pipe(select(testRailModuleReducer.getHistoryByUserStoryId));
        this.testCaseHistory$ = this.testrailStore.pipe(select(testRailModuleReducer.getHistoryByUserStoryId));
    }
}
