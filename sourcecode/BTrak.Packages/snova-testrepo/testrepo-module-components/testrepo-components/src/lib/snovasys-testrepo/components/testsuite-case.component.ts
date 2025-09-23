import { Component, ChangeDetectionStrategy, Input, ViewChildren, Output, EventEmitter, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { TestCaseTitle } from '../models/testcase';
import { TestSuiteList } from '../models/testsuite';

import { TestCaseActionTypes, LoadTestCaseTitleDeleteTriggered } from '../store/actions/testcaseadd.actions';
import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';

@Component({
    selector: 'testsuite-case',
    templateUrl: './testsuite-case.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuiteCaseComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @ViewChildren('deleteCasePopover') deleteCasesPopover;
    @ViewChild("testSuiteCaseTitle") testSuiteCaseTitleStatus: ElementRef;
    @Output() casePreviewDetails = new EventEmitter<any>();
    @Output() casesSelected = new EventEmitter<any>();
    @Output() caseSelection = new EventEmitter<any>();
    @Input() caseSelected: boolean;

    @Input("caseDetails")
    set _caseDetails(data: any) {
        if (data)
            this.caseDetail = data;
    }

    @Input("allCasesSelect")
    set _allCasesSelect(data: any) {
        if (data && data.sectionCheckBoxClicked && data.sectionSelected && (this.isCaseSelected == false || this.isCaseSelected == undefined))
            this.changeSelectStatus(true);
        else if (data && data.sectionCheckBoxClicked && data.sectionSelected == false && this.isCaseSelected)
            this.changeSelectStatus(false);
    }

    public ngDestroyed$ = new Subject();

    deleteCase: TestCaseTitle;
    searchTestSuite: TestSuiteList;
    caseDetail: any;
    width: any;

    disableDeleteTestCase: boolean = false;
    showTitleTooltip: boolean = false;
    isCaseSelected: boolean = false;

    constructor(private store: Store<State>, private actionUpdates$: Actions, public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
        super();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCaseTitleDeleteCompleted),
            tap(() => {
                if (this.deleteCase != undefined && this.deleteCase.testCaseId == this.caseDetail.testCaseId) {
                    this.disableDeleteTestCase = false;
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCaseFailed),
            tap(() => {
                this.disableDeleteTestCase = false;
                this.cdRef.detectChanges();
            })
        ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    previewTestcase(cases) {
        // if (window.matchMedia("(min-width: 1024px) and (max-width: 1359px)").matches) {
        //     this.width = '60%'
        // }
        // else if (window.matchMedia("(min-width: 1360px)").matches) {
        //     this.width = '40%'
        // }
        // else {
        //     this.width = '100%'
        // }
        // const dialogRef = this.dialog.open(TestCasePreviewComponent, {
        //     width: this.width,
        //     height: '100%',
        //     position: {
        //         right: '0',
        //         top: '0'
        //     },
        //     hasBackdrop: true,
        //     panelClass: "filter-popup",
        //     data: { case: cases },
        // });
        // dialogRef.afterClosed().subscribe(() => {
        //     console.log('The dialog was closed');
        // });
        let passingdata = {
            caseData: cases,
            previewCase: true,
            editCase: false
        }
        this.casePreviewDetails.emit(passingdata);
    }

    editTestCase(cases) {
        // if (window.matchMedia("(min-width: 1024px) and (max-width: 1359px)").matches) {
        //     this.width = '60%'
        // }
        // else if (window.matchMedia("(min-width: 1360px)").matches) {
        //     this.width = '40%'
        // }
        // else {
        //     this.width = '100%'
        // }
        // const dialogRef = this.dialog.open(TestCaseEditComponent, {
        //     width: this.width,
        //     height: '100%',
        //     position: {
        //         right: '0',
        //         top: '0'
        //     },
        //     hasBackdrop: true,
        //     disableClose: true,
        //     panelClass: "filter-popup",
        //     data: { case: cases }
        // });

        // dialogRef.afterClosed().subscribe(result => {
        //     console.log('The dialog was closed');
        // });
        let passingdata = {
            caseData: cases,
            previewCase: false,
            editCase: true
        }
        this.casePreviewDetails.emit(passingdata);
    }

    deleteCases(cases, deleteCasePopover) {
        deleteCasePopover.openPopover();
        this.deleteCase = new TestCaseTitle();
        this.deleteCase.multipleTestCaseIds = cases.testCaseId;
        this.deleteCase.title = cases.title;
        this.deleteCase.testSuiteId = cases.testSuiteId;
        this.deleteCase.timeStamp = cases.timeStamp;
    }

    removeTestCase() {
        this.disableDeleteTestCase = true;
        this.store.dispatch(new LoadTestCaseTitleDeleteTriggered(this.deleteCase));
    }

    closeDeleteCaseDialog() {
        this.deleteCasesPopover.forEach((p) => p.closePopover());
    }

    changeSelectStatus(value) {
        this.isCaseSelected = value;
        this.caseSelection.emit(this.caseDetail.testCaseId);
    }

    changeStatus(value) {
        this.isCaseSelected = value;
        this.casesSelected.emit(this.caseDetail.testCaseId);
    }

    checkTitleTooltipStatus() {
        if (this.testSuiteCaseTitleStatus.nativeElement.scrollWidth > this.testSuiteCaseTitleStatus.nativeElement.clientWidth)
            this.showTitleTooltip = true;
        else
            this.showTitleTooltip = false;
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}