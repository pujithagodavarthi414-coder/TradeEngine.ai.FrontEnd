import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, Input } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';

import "../../globaldependencies/helpers/fontawesome-icons";

import { TestCase } from "../models/testcase";

import { TestCaseActionTypes, LoadSingleTestRunCaseBySectionIdTriggered } from '../store/actions/testcaseadd.actions';
import * as testRailModuleReducer from "../store/reducers/index";

@Component({
    selector: "report-test-case-details",
    templateUrl: "./report-test-case-details.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
    .report-test-cases-preview {
        height: calc(100vh - 105px) !important;
    }

    .report-test-cases-preview-scroll {
        height: calc(100vh - 146px) !important;
        overflow-x: hidden !important;
        max-height: none !important;
    }
    `]
})

export class ReportTestCaseDetailsComponent {
    @Output() closePreview = new EventEmitter<any>();

    @Input("caseDetails")
    set _caseDetails(data: any) {
        if (data) {
            this.caseDetails = data;
            this.loadCaseDetails(this.caseDetails);
        }
    }

    @Input("reportId")
    set _reportId(data: string) {
        if (data != undefined && data) {
            this.reportId = data;
        }
    }

    testCaseDetails$: Observable<TestCase>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    caseDetails: any;
    testCaseDetails: any;
    position: any;
    projectId: string;
    testRunId: string;
    reportId: string;
    reportPreview: boolean;
    reportHistory: boolean;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getSingleTestRunCaseDetailsLoading));

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadSingleTestRunCaseBySectionIdCompleted),
            tap(() => {
                this.testCaseDetails$.subscribe(result => {
                    if (result) {
                        this.testCaseDetails = result;
                        this.cdRef.markForCheck();
                    }
                })
            })
        ).subscribe();
    }

    onTabSelect(event) { }

    loadCaseDetails(testCaseDetail) {
        let testCaseSearch = new TestCase();
        testCaseSearch.testCaseId = testCaseDetail.testCaseId;
        testCaseSearch.testRunId = testCaseDetail.testRunId;
        testCaseSearch.isArchived = false;
        this.store.dispatch(new LoadSingleTestRunCaseBySectionIdTriggered(testCaseSearch));
        this.testCaseDetails$ = this.store.pipe(select(testRailModuleReducer.getSingleTestRunCaseDetailsByCaseId));
    }

    closeTestCaseDialog() {
        this.closePreview.emit('');
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}
