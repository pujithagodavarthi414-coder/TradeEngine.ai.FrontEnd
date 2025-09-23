import { Component, ChangeDetectionStrategy, EventEmitter, Output, ChangeDetectorRef, OnInit, ViewChildren } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";

import { State } from "../store/reducers/index";

import * as auditModuleReducer from "../store/reducers/index";

import { AuditReport } from '../models/audit-report.model';
import { AuditReportActionTypes, LoadReportListTriggered } from '../store/actions/audit-report.actions';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: 'audit-reports-list',
    templateUrl: './audit-reports-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditReportsListComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren("addReportPopover") addReportsPopover;
    @Output() selectedReport = new EventEmitter<any>();
    @Output() loadReport = new EventEmitter<boolean>();

    reportsList$: Observable<AuditReport[]>;
    anyOperationInProgress$: Observable<boolean>;

    report: AuditReport;

    projectId: string;
    selectedReportId: string;
    deletedId: string;
    reportOccurance: number = 0;

    searchText: string = '';
    dateFrom: string;
    dateTo: string;
    loadAddReport: boolean = false;
    isArchived: boolean = false;
    maxDate = new Date();
    softLabels: SoftLabelConfigurationModel[];

    softLabels$: Observable<SoftLabelConfigurationModel[]>;

    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, private route: ActivatedRoute, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        super();
        
        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });
        this.actionUpdates$
        .pipe(
            takeUntil(this.ngDestroyed$),
            ofType(AuditReportActionTypes.LoadReportListCompleted),
            tap(() => {
                this.reportsList$ = this.store.pipe(select(auditModuleReducer.getReportAll));
                this.reportsList$.subscribe(reports => {
                    if (reports && reports.length > 0) {
                        this.reportOccurance = this.reportOccurance + 1;
                        if (this.reportOccurance <= 1 || this.selectedReportId == this.deletedId) {
                            // if (localStorage.getItem('addedReportId') != null) {
                            //     let addedReportId = localStorage.getItem('addedReportId');
                            //     this.selectedReportId = addedReportId;
                            //     this.loadReport.emit(true);
                            //     this.selectedReport.emit(this.selectedReportId);
                            //     localStorage.removeItem('addedReportId');
                            // }
                            // else {
                            this.selectedReportId = reports[0].auditReportId;
                            this.cdRef.markForCheck();
                            this.cdRef.detectChanges();
                            this.loadReport.emit(true);
                            this.selectedReport.emit(reports[0]);
                            // }
                        }
                    }
                    else if (reports.length == 0) {
                        this.selectedReportId = null;
                        this.reportOccurance = 0;
                        this.loadReport.emit(false);
                        this.cdRef.markForCheck();
                        this.cdRef.detectChanges();
                    }
                    this.cdRef.markForCheck();
                    this.cdRef.detectChanges();
                });
            })
        ).subscribe();
        this.getSoftLabels();
        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getReportsListLoading));
        this.loadReports();
        this.getReports();
    }

    ngOnInit() {
        super.ngOnInit();
        //this.getSoftLabels();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    loadReports() {
        this.loadReport.emit(false);
        this.selectedReportId = null;
        this.reportOccurance = 0;
        this.report = new AuditReport();
        this.report.projectId = this.projectId;
        this.report.isArchived = this.isArchived;
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
        // this.reportsList$ = this.store.pipe(select(auditModuleReducer.getReportAll),
        //     tap(reports => {
        //         if (reports && reports.length > 0) {
        //             this.reportOccurance = this.reportOccurance + 1;
        //             if (this.reportOccurance <= 1 || this.selectedReportId == this.deletedId) {
        //                 // if (localStorage.getItem('addedReportId') != null) {
        //                 //     let addedReportId = localStorage.getItem('addedReportId');
        //                 //     this.selectedReportId = addedReportId;
        //                 //     this.loadReport.emit(true);
        //                 //     this.selectedReport.emit(this.selectedReportId);
        //                 //     localStorage.removeItem('addedReportId');
        //                 // }
        //                 // else {
        //                 this.selectedReportId = reports[0].auditReportId;
        //                 this.cdRef.markForCheck();
        //                 this.cdRef.detectChanges();
        //                 this.loadReport.emit(true);
        //                 this.selectedReport.emit(reports[0]);
        //                 // }
        //             }
        //         }
        //         else if (reports.length == 0) {
        //             this.selectedReportId = null;
        //             this.reportOccurance = 0;
        //             this.loadReport.emit(false);
        //             this.cdRef.markForCheck();
        //             this.cdRef.detectChanges();
        //         }
        //         this.cdRef.markForCheck();
        //         this.cdRef.detectChanges();
        //     }));
    }

    handleClickOnReportItem(report) {
        this.selectedReportId = report.auditReportId;
        this.selectedReport.emit(report);
    }

    getDeletedReportId(value) {
        this.deletedId = value;
    }

    openReportDialog(reportPopover) {
        this.loadAddReport = true;
        reportPopover.openPopover();
    }

    closeReportDialog() {
        this.loadAddReport = false;
        this.addReportsPopover.forEach(p => p.closePopover());
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}