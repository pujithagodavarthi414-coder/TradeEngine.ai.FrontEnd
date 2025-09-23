import { Component, ChangeDetectionStrategy, ViewChild, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { SatPopover } from '@ncstate/sat-popover';
import { DatePipe } from "@angular/common";

import { ReportsList, TestRailReport, ShareReport } from '../models/reports-list';

import "../../globaldependencies/helpers/fontawesome-icons";

import { State } from "../store/reducers/index";

import { ReportActionTypes, LoadShareReportTriggered, LoadReportDeleteTriggered } from "../store/actions/reports.actions";
import { LoadProjectRelatedCountsTriggered } from '../store/actions/testrailprojects.actions';
import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { GoogleAnalyticsService } from '../services/google-analytics.service';

@Component({
    selector: 'report-item-summary',
    templateUrl: './report-item-summary.component.html',
    providers: [DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReportItemSummaryComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @ViewChild("deleteReport") deleteReportPopover: SatPopover;
    @ViewChild("shareReport") shareReportPopover: SatPopover;
    @ViewChild("reportTitle") reportTitleStatus: ElementRef;
    @Output() deleteId = new EventEmitter<string>();

    @Input() reportSelected: boolean;

    softLabels: SoftLabelConfigurationModel[];

    @Input("report")
    set _report(data: ReportsList) {
        if (data) {
            this.reportData = data;
        }
    }

    @Input("reportId")
    set _reportId(data: string) {
        this.reportId = data;
    }

    public ngDestroyed$ = new Subject();

    report: TestRailReport;
    reportData: ReportsList;
    searchReport: TestRailReport;
    shareReport: ShareReport;
    deleteReport: TestRailReport;

    projectId: string;
    reportId: string;
    disableReportDelete: boolean = false;
    disableReportShare: boolean = false;
    showTitleTooltip: boolean = false;
    reportMail = new FormControl('', []);

    constructor(private store: Store<State>, private route: ActivatedRoute, private actionUpdates$: Actions, private datePipe: DatePipe, private cdRef: ChangeDetectorRef,
        public googleAnalyticsService: GoogleAnalyticsService) {
        super();
        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ReportActionTypes.LoadReportDeleteCompleted),
                tap(() => {
                    this.deleteReportPopover.close();
                    this.disableReportDelete = false;
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ReportActionTypes.LoadShareReportCompleted),
                tap(() => {
                    this.shareReportPopover.close();
                    this.disableReportShare = false;
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ReportActionTypes.ReportFailed),
                tap(() => {
                    this.disableReportDelete = false;
                    this.disableReportShare = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabelConfigurations();
    }

    downloadReport(reportData) {
        const downloadLink = document.createElement("a");
        downloadLink.href = reportData.pdfUrl;
        downloadLink.download = reportData.testRailReportName + this.datePipe.transform(new Date(), 'yyyy-MM-dd'); +'-Report.pdf';
        downloadLink.click();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.detectChanges();
    }

    deleteTestRailReport() {
        this.deleteReportPopover.open();
    }

    deleteSelectedReport(reportData) {
        this.disableReportDelete = true;
        this.deleteReport = new TestRailReport();
        this.deleteReport.projectId = reportData.projectId;
        this.deleteReport.testRailReportId = reportData.testRailReportId;
        this.deleteReport.reportName = reportData.testRailReportName;
        this.deleteReport.description = reportData.description;
        this.deleteReport.milestoneId = reportData.milestoneId;
        this.deleteReport.timeStamp = reportData.timeStamp;
        this.deleteReport.isArchived = true;
        this.store.dispatch(new LoadReportDeleteTriggered(this.deleteReport));
        this.deleteId.emit(this.deleteReport.testRailReportId);
        this.googleAnalyticsService.eventEmitter("Test Management", "Deleted Report", this.deleteReport.reportName, 1);
    }

    shareTestRailReport() {
        this.initializeReportMailForm();
        this.shareReportPopover.open();
    }

    shareSelectedReport(reportData) {
        this.disableReportShare = true;
        this.shareReport = new ShareReport();
        this.shareReport.reportId = reportData.testRailReportId;
        this.shareReport.reportName = reportData.testRailReportName;
        this.shareReport.toUsers = this.reportMail.value;
        this.store.dispatch(new LoadShareReportTriggered(this.shareReport));
    }

    validateMail() {
        if (this.reportMail)
            return false;
        else
            return true;
    }

    initializeReportMailForm() {
        this.reportMail = new FormControl('', []);
    }

    checkTitleTooltipStatus() {
        if (this.reportTitleStatus.nativeElement.scrollWidth > this.reportTitleStatus.nativeElement.clientWidth) {
            this.showTitleTooltip = true;
        }
        else {
            this.showTitleTooltip = false;
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}