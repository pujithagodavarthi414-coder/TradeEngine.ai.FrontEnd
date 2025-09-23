import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { Store, select } from "@ngrx/store";

import { State } from "../store/reducers/index";
import * as testRailModuleReducer from "../store/reducers/index";

import { TestCase } from "../models/testcase";

@Component({
    selector: "testsuite-cases-operation",
    templateUrl: "./testsuite-cases-operation.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
    .testrun-status-preview {
        height: calc(100vh - 102px) !important;
    }

    .testrun-tab {
        height: calc(100vh - 156px);
        overflow-x: hidden !important;
    }
    `]
})

export class TestSuiteCasesOperationComponent {
    @Output() closePreview = new EventEmitter<any>();
    @Output() caseDataPreviewDetails = new EventEmitter<any>();

    @Input("testCaseDetails")
    set _testCaseDetails(data: any) {
        if (data) {
            this.testCaseDetails = data;
            this.getAllCases();
        }
    }

    @Input("isHierarchical")
    set _isHierarchical(data: boolean) {
        if (data || data == false) {
            this.isHierarchical = data;
        }
    }

    anyOperationInProgress$: Observable<boolean>
    allTestCases$: Observable<TestCase[]>;

    public ngDestroyed$ = new Subject();

    allTestCases = [];

    testCaseDetails: any;
    position: any;
    loadDetails: boolean = false;
    isHierarchical: boolean = false;
    testCaseHistoryDetails: any;

    constructor(private store: Store<State>, private cdRef: ChangeDetectorRef) {
        this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getSingleTestCaseDetailsLoading));
    }

    getAllCases() {
        this.allTestCases$ = this.store.pipe(select(testRailModuleReducer.getTestCasesBySectionAll));
        this.allTestCases$.subscribe((result: any) => {
            this.allTestCases = result;
            this.cdRef.markForCheck();
        });
    }

    onTabSelect(event) { }

    closeTestCaseDialog() {
        this.closePreview.emit("");
    }

    testCaseHistory(event) {
        this.testCaseHistoryDetails = event;
    }

    goToPrevious(sectionId, testCaseId) {
        if (this.isHierarchical == false) {
            let index = this.allTestCases.findIndex(x => x.testCaseId.toLowerCase() == testCaseId.toLowerCase());
            if (index > 0) {
                let caseData = this.allTestCases[index - 1];
                let passingdata = {
                    caseData: caseData,
                    previewCase: true,
                    editCase: false
                }
                this.caseDataPreviewDetails.emit(passingdata);
            }
        }
        else {
            let sectionCases = this.allTestCases.filter(function (x) {
                return x.sectionId.toLowerCase() == sectionId.toLowerCase();
            });
            let index = sectionCases.findIndex(x => x.testCaseId.toLowerCase() == testCaseId.toLowerCase());
            if (index > 0) {
                let caseData = sectionCases[index - 1];
                let passingdata = {
                    caseData: caseData,
                    previewCase: true,
                    editCase: false
                }
                this.caseDataPreviewDetails.emit(passingdata);
            }
        }
    }

    goToNext(sectionId, testCaseId) {
        if (this.isHierarchical == false) {
            let index = this.allTestCases.findIndex(x => x.testCaseId.toLowerCase() == testCaseId.toLowerCase());
            if (index != -1 && index != this.allTestCases.length - 1) {
                let caseData = this.allTestCases[index + 1];
                let passingdata = {
                    caseData: caseData,
                    previewCase: true,
                    editCase: false
                }
                this.caseDataPreviewDetails.emit(passingdata);
            }
        }
        else {
            let sectionCases = this.allTestCases.filter(function (x) {
                return x.sectionId.toLowerCase() == sectionId.toLowerCase();
            });
            let index = sectionCases.findIndex(x => x.testCaseId.toLowerCase() == testCaseId.toLowerCase());
            if (index != -1 && index != sectionCases.length - 1) {
                let caseData = sectionCases[index + 1];
                let passingdata = {
                    caseData: caseData,
                    previewCase: true,
                    editCase: false
                }
                this.caseDataPreviewDetails.emit(passingdata);
            }
        }
    }
}
