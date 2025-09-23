import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChildren } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";

import { ReportActionTypes } from "../store/actions/reports.actions";

import { State } from "../store/reducers/index";
import * as testSuiteModuleReducer from "../store/reducers/index";
import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { ActivatedRoute } from '@angular/router';
import { LoadProjectRelatedCountsTriggered } from '../store/actions/testrailprojects.actions';

@Component({
    selector: "app-testrail-reports-view",
    templateUrl: "./reports-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReportsViewComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @ViewChildren("addReportPopover") addReportsPopover;
    @ViewChildren("addReportsPopover") addReportPopovers;

    softLabels: SoftLabelConfigurationModel[];
    reportsCount$: Observable<number>;
    projectRelatedDataLoading$: Observable<boolean>;
    projectLabel: string;
    public ngDestroyed$ = new Subject();

    reportId: string;
    screenWidth: number;
    isReport: boolean = false;
    loadAddReport: boolean = false;
    loadReport: boolean = false;
    hideMileStones: boolean = true;
    showCaseStatusPreview: any;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef, private route: ActivatedRoute) {
        super();

        this.route.params.subscribe(routeParams => {
            let projectId = routeParams.id;
            this.store.dispatch(new LoadProjectRelatedCountsTriggered(projectId));
        });

        this.reportsCount$ = this.store.pipe(select(testSuiteModuleReducer.getReportsCount));
        this.projectRelatedDataLoading$ = this.store.pipe(select(testSuiteModuleReducer.getProjectRelatedDataLoading));

        this.reportsCount$.subscribe(result => {
            if (result <= 0) {
                this.reportId = null;
                this.cdRef.markForCheck();
            }
        })

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ReportActionTypes.LoadDetailedReportTriggered),
                tap(() => {
                    this.showCaseStatusPreview = null;
                    this.isReport = false;
                    this.cdRef.markForCheck();
                })
            ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.screenWidth = window.innerWidth;
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    openReportDialog(reportPopover) {
        this.loadAddReport = true;
        reportPopover.openPopover();
    }

    openReportsDialog(reportPopover) {
        this.loadAddReport = true;
        reportPopover.openPopover();
    }

    closeReportDialog() {
        this.loadAddReport = false;
        this.addReportsPopover.forEach(p => p.closePopover());
        this.addReportPopovers.forEach(p => p.closePopover());
    }

    getLoadReportById(value) {
        this.loadReport = value;
        this.cdRef.detectChanges();
    }

    getReportId(value) {
        this.reportId = value;
        this.cdRef.detectChanges();
    }

    getCaseStatusPreviewDetails(data) {
        this.closePreviewDialog();
        this.showCaseStatusPreview = data;
        this.isReport = true;
        this.cdRef.detectChanges();
    }

    closePreviewDialog() {
        this.showCaseStatusPreview = null;
        this.isReport = false;
        this.cdRef.detectChanges();
    }

    onResize() {
        this.screenWidth = window.innerWidth;
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}