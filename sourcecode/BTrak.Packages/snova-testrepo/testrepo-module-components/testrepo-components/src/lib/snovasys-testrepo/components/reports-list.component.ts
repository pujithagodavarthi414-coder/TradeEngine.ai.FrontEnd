import { Component, ChangeDetectionStrategy, EventEmitter, Output, ChangeDetectorRef, ViewChildren, OnInit } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";

import { ReportsList, TestRailReport } from '../models/reports-list';

import { LoadReportListTriggered, ReportActionTypes } from '../store/actions/reports.actions';

import { State } from "../store/reducers/index";
import * as testSuiteModuleReducer from "../store/reducers/index";
import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import * as testRailModuleReducer from "../store/reducers/index";

@Component({
    selector: 'reports-list',
    templateUrl: './reports-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
    .reports-items-list {
        height: calc(100vh - 145px);
        overflow: auto !important;
    }
    `]
})

export class ReportsListComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @ViewChildren("addReportsPopover") addReportPopovers;
    @Output() reportId = new EventEmitter<string>();
    @Output() loadReport = new EventEmitter<boolean>();

    reportsList$: Observable<ReportsList[]>;
    anyOperationInProgress$: Observable<boolean>;

    report: TestRailReport;

    projectId: string;

    selectedReportId: string;
    deletedId: string;
    reportOccurance: number = 0;

    searchText: string = '';
    dateFrom: string;
    dateTo: string;
    loadAddReport: boolean = false;
    hideMileStones: boolean = true;
    maxDate = new Date();
    softLabels: SoftLabelConfigurationModel[];

    public ngDestroyed$ = new Subject();
    reportList: ReportsList[] = [];

    constructor(private store: Store<State>, private route: ActivatedRoute, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ReportActionTypes.LoadReportListCompleted),
                tap(() => {
                    this.reportsList$ = this.store.pipe(select(testRailModuleReducer.getReportAll));
                    this.reportsList$.subscribe(result => {
                        this.reportList = result;
                        if (this.reportList && this.reportList.length > 0) {
                            this.reportOccurance = this.reportOccurance + 1;
                            if (this.reportOccurance <= 1 || this.selectedReportId == this.deletedId) {
                                if (localStorage.getItem('addedReportId') != null) {
                                    let addedReportId = localStorage.getItem('addedReportId');
                                    this.selectedReportId = addedReportId;
                                    this.loadReport.emit(true);
                                    this.reportId.emit(this.selectedReportId);
                                    localStorage.removeItem('addedReportId');
                                }
                                else {
                                    this.selectedReportId = this.reportList[0].testRailReportId;
                                    this.loadReport.emit(true);
                                    this.reportId.emit(this.selectedReportId);
                                }
                            }
                        }
                        else if (this.reportList.length == 0) {
                            this.selectedReportId = null;
                        }
                        // this.getAssigneeValue(this.userStoryData.ownerUserId);
                        //this.cdRef.detectChanges();
                    });
                })
            ).subscribe();
        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.anyOperationInProgress$ = this.store.pipe(select(testSuiteModuleReducer.getReportsListLoading));

        this.loadReports();
        this.getReports();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    loadReports() {
        this.loadReport.emit(false);
        this.report = new TestRailReport();
        this.report.projectId = this.projectId;
        this.report.isArchived = false;
        this.store.dispatch(new LoadReportListTriggered(this.report));
    }

    closeDateFilter() {
        this.dateFrom = '';
        this.dateTo = '';
    }

    changeDeadline(from, to) {
        if (from > to)
            this.dateTo = '';
    }

    closeSearch() {
        this.searchText = '';
    }

    getReports() {
        // this.reportsList$ = this.store.pipe(select(testSuiteModuleReducer.getReportAll),
        //     tap(reports => {
        //         if (reports && reports.length > 0) {
        //             this.reportOccurance = this.reportOccurance + 1;
        //             if (this.reportOccurance <= 1 || this.selectedReportId == this.deletedId) {
        //                 if (localStorage.getItem('addedReportId') != null) {
        //                     let addedReportId = localStorage.getItem('addedReportId');
        //                     this.selectedReportId = addedReportId;
        //                     this.loadReport.emit(true);
        //                     this.reportId.emit(this.selectedReportId);
        //                     localStorage.removeItem('addedReportId');
        //                 }
        //                 else {
        //                     this.selectedReportId = reports[0].testRailReportId;
        //                     this.loadReport.emit(true);
        //                     this.reportId.emit(this.selectedReportId);
        //                 }
        //             }
        //         }
        //         else if (reports.length == 0) {
        //             this.selectedReportId = null;
        //         }
        //     }));
    }

    handleClickOnReportItem(report) {
        this.selectedReportId = report.testRailReportId;
        this.reportId.emit(this.selectedReportId);
    }

    getDeletedReportId(value) {
        this.deletedId = value;
        // this.loadReport.emit(false);
    }

    openReportsDialog(reportPopover) {
        this.loadAddReport = true;
        reportPopover.openPopover();
    }

    closeReportDialog() {
        this.loadAddReport = false;
        this.addReportPopovers.forEach(p => p.closePopover());
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}