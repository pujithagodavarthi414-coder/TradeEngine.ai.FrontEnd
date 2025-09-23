import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import 'rxjs/add/operator/takeUntil';
import { Subject, Subscription } from 'rxjs';
import { DragulaService } from "ng2-dragula";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import "../../globaldependencies/helpers/fontawesome-icons";

import { TestCase, TestCaseTitle } from '../models/testcase';

import { TestCaseActionTypes, LoadTestCaseTitleTriggered, LoadTestCaseReorderTriggered, LoadTestCasesAfterReorderCompleted, LoadTestCaseAfterEditTriggered, LoadTestCaseAfterReorderEditTriggered } from "../store/actions/testcaseadd.actions";

import * as testRailModuleReducer from "../store/reducers/index";

import { TestCaseRunDetails } from "../models/testcaserundetails";
import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';

@Component({
    selector: "hierarchical-cases",
    templateUrl: "./hierarchical-cases.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DragulaService]
})

export class HierarchicalCasesComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @Output() casePreviewDetails = new EventEmitter<any>();
    @Output() casesSelected = new EventEmitter<any>();
    @Output() caseSelection = new EventEmitter<any>();

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

    @Input("casesData")
    set _casesData(data: any) {
        if (data) {
            this.testCases = data;
            this.testCases$ = this.store.pipe(select(testRailModuleReducer.getHierarchicalTestCasesFilterBySectionId, { sectionId: this.hierarchicalData.sectionId }));
            this.testCases$.subscribe(result => {
                this.testCasesModel = result;
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

    testCases$: Observable<TestCase[]>;
    reOrderOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();
    subs = new Subscription();

    testCasesModel = [];
    testCases = [];

    hierarchicalData: any;
    testCaseFromPreview: any;
    selection: any;
    selectedCaseId: string;
    casesCount: number = 0;
    testCaseName: string = '';
    testSuiteId: string;
    hierarchicalSectionId: string;
    isAddTestCaseOpened: boolean = false;
    disableAddCase: boolean = false;
    isAnyOfCasesSelected: boolean = false;
    isMultiCasesSelected: boolean = false;
    reOrderOperationInProgress: boolean = false;
    totalEstimate: number = 0;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private dragulaService: DragulaService, private toastr: ToastrService, private translateService: TranslateService, private cdRef: ChangeDetectorRef) {
        super();

        this.reOrderOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getReorderTestCasesLoading));

        dragulaService.createGroup("testcases", {
            revertOnSpill: true
            // removeOnSpill: true
        });

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCasesBySectionIdTriggered),
            tap(() => {
                this.testCaseName = '';
                this.isAddTestCaseOpened = false;
                this.testCaseFromPreview = null;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadMultipleTestCasesBySectionIdCompleted),
            tap(() => {
                this.disableAddCase = false;
                this.testCaseName = '';
                this.isAddTestCaseOpened = false;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestCaseActionTypes.LoadTestCaseFailed),
                tap(() => {
                    this.disableAddCase = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadSingleTestCaseBySectionIdTriggered),
            tap(() => {
                this.testCaseFromPreview = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCaseReorderCompleted),
            tap(() => {
                this.dragulaService.find('testcases').drake.cancel(true);
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadMoveTestCasesCompleted),
            tap(() => {
                this.isMultiCasesSelected = false;
                this.isAnyOfCasesSelected = false;
                this.selection = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.subs.add(this.dragulaService.drag("testcases")
            .subscribe(({ el }) => {
                //console.log(el);
                this.reOrderOperationInProgress$.subscribe(x => this.reOrderOperationInProgress = x);
                if (this.reOrderOperationInProgress) {
                    this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
                    this.dragulaService.find('userStories').drake.cancel(true);
                }
                // this.reOrderOperationInProgress$.subscribe(x => {
                //     this.reOrderOperationInProgress = x;
                //     if (this.reOrderOperationInProgress) {
                //         this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
                //         this.dragulaService.find('testcases').drake.cancel(true);
                //     }
                // });
            })
        );

        this.subs.add(this.dragulaService.drop("testcases")
            .takeUntil(this.ngDestroyed$)
            .subscribe(({ name, el, target, source, sibling }) => {
                var orderedListLength = target.children.length;
                let orderedTestCaseList = [];
                let sourceId = el.attributes["data-testcaseid"].value;
                for (var i = 1; i < orderedListLength; i++) {
                    var testCaseId = target.children[i].attributes["data-testcaseid"].value;
                    orderedTestCaseList.push(testCaseId.toLowerCase());
                }
                let index = orderedTestCaseList.indexOf(sourceId);
                if (index != -1) {
                    let dataIndex = this.testCases.findIndex(x => x.testCaseId == sourceId);
                    if (dataIndex != -1) {
                        let data = this.testCases[dataIndex];
                        this.testCases.splice(dataIndex, 1);
                        if (index > 0) {
                            let resultIndex = this.testCases.findIndex(x => x.testCaseId == orderedTestCaseList[index - 1]);
                            this.testCases.splice(resultIndex + 1, 0, data);
                        }
                        else {
                            let resultIndex = this.testCases.findIndex(x => x.testCaseId == orderedTestCaseList[index + 1]);
                            this.testCases.splice(resultIndex - 1, 0, data);
                        }
                        this.store.dispatch(new LoadTestCasesAfterReorderCompleted(this.testCases));
                    }
                }
                // console.log(orderedTestCaseList.toString());
                this.store.dispatch(new LoadTestCaseReorderTriggered(orderedTestCaseList));
            })
        );
    }

    ngOnInit() {
        super.ngOnInit();
    }

    handleClick(data) {
        this.selectedCaseId = data.testCaseId;
        this.cdRef.markForCheck();
    }

    openAddTestCase() {
        this.testCaseName = '';
        this.isAddTestCaseOpened = !this.isAddTestCaseOpened;
    }

    addTestCase() {
        this.disableAddCase = true;
        let newCaseTitle = new TestCaseTitle();
        newCaseTitle.title = this.testCaseName;
        newCaseTitle.sectionId = this.hierarchicalData.sectionId;
        newCaseTitle.testSuiteId = this.testSuiteId;
        newCaseTitle.isHierarchical = true;
        newCaseTitle.hierarchicalSectionId = this.hierarchicalSectionId;
        this.store.dispatch(new LoadTestCaseTitleTriggered(newCaseTitle));
    }

    getCasePreviewDetails(data) {
        this.casePreviewDetails.emit(data);
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
        this.dragulaService.destroy("testcases");
    }
}