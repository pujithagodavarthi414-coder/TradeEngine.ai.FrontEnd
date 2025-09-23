import { Component, ChangeDetectionStrategy, ViewChild, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { SatPopover } from '@ncstate/sat-popover';
import { DatePipe } from "@angular/common";
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from "@ngx-translate/core";

import "../../globaldependencies/helpers/fontawesome-icons";

import { State } from "../store/reducers/index";
import { AuditReport } from '../models/audit-report.model';
import { AuditReportActionTypes, LoadReportDeleteTriggered, LoadReportTriggered } from '../store/actions/audit-report.actions';
import { AuditService } from '../services/audits.service';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import * as auditManagementReducers from "../store/reducers/index";
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';


@Component({
    selector: 'audit-report-item-summary',
    templateUrl: './audit-report-item-summary.component.html',
    providers: [DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditReportItemSummaryComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChild("deleteReport") deleteReportPopover: SatPopover;
    @ViewChild("reportTitle") reportTitleStatus: ElementRef;
    @ViewChild("shareReport") shareReportPopover: SatPopover;

    @Output() deleteId = new EventEmitter<string>();
    @Input() reportSelected: boolean;

    @Input("report")
    set _report(data: any) {
        if (data) {
            this.reportData = data;
        }
    }

    @Input("selectedReport")
    set _selectedReport(data: any) {
        if (data)
            this.selectedReport = data;
    }

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];

    public ngDestroyed$ = new Subject();

    projectId: string;

    selectedReport: any;
    reportData: any;
    searchReport: any;
    deleteReport: any;
    questionsForReport: any;

    reportId: string;
    to: string;
    cc: string;
    bcc: string;
    selectedDwnldId: string;
    validationMessage: string;
    disableReportDelete: boolean = false;
    disableReportShare: boolean = false;
    showTitleTooltip: boolean = false;
    downldInProgress: boolean = false;
    isToSendMail: boolean = false;
    reportMail = new FormControl('', []);

    constructor(private store: Store<State>, private auditService: AuditService, private translateService: TranslateService, private toastr: ToastrService, private route: ActivatedRoute, private actionUpdates$: Actions, private datePipe: DatePipe, private cdRef: ChangeDetectorRef) {
        super();

        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditReportActionTypes.LoadReportDeleteCompleted),
                tap(() => {
                    this.deleteReportPopover.close();
                    this.disableReportDelete = false;
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditReportActionTypes.LoadReportListTriggered),
                tap(() => {
                    this.selectedDwnldId = null;
                    this.cdRef.markForCheck();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditReportActionTypes.LoadShareReportCompleted),
                tap(() => {
                    this.shareReportPopover.close();
                    this.disableReportShare = false;
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditReportActionTypes.LoadDetailedReportTriggered),
                tap((result: any) => {
                    if (result && result.reportById) {
                        this.questionsForReport = null;
                        this.cdRef.markForCheck();
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditReportActionTypes.LoadDetailedReportCompleted),
                tap((result: any) => {
                    if (result && result.detailedReport && this.reportData) {
                        let data = result.detailedReport;
                        if (this.reportData.auditReportId == data.auditReportId) {
                            this.questionsForReport = data.questionsForReport ? data.questionsForReport : [];
                            this.cdRef.markForCheck();
                        }
                        else {
                            this.questionsForReport = [];
                            this.cdRef.markForCheck();
                        }
                    }
                    else {
                        this.questionsForReport = [];
                        this.cdRef.markForCheck();
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditReportActionTypes.ReportFailed),
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

    getSoftLabelConfigurations() {
        // this.softLabels$ = this.store.pipe(select(auditManagementReducers.getSoftLabelsAll));
        // this.softLabels$.subscribe((x) => this.softLabels = x);
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    downloadReport(reportData) {
        this.selectedDwnldId = reportData.auditReportId;
        this.isToSendMail = false;
        this.shareReport();
        this.cdRef.markForCheck();
    }

    shareAsAuditReport() {
        this.isToSendMail = true;
        this.shareReport();
        this.cdRef.markForCheck();
    }

    deleteTestRailReport() {
        this.deleteReportPopover.open();
    }

    deleteSelectedReport(reportData) {
        this.disableReportDelete = true;
        let deleteReport = new AuditReport();
        deleteReport = Object.assign({}, reportData);
        deleteReport.isArchived = true;
        deleteReport.projectId = this.projectId;
        this.store.dispatch(new LoadReportTriggered(deleteReport));
        this.deleteId.emit(deleteReport.auditReportId);
    }

    shareAuditReport() {
        this.to = null;
        this.cc = null;
        this.bcc = null;
        this.shareReportPopover.open();
    }

    shareReport() {
        if (this.isToSendMail)
            this.disableReportShare = true;
        else
            this.downldInProgress = true;
        let shareModel = new AuditReport();
        shareModel = Object.assign({}, this.reportData);
        shareModel.questionsForReport = this.questionsForReport;
        shareModel.isToSendMail = this.isToSendMail;
        shareModel.to = (this.to && this.to.trim() != '') ? this.to : null;
        shareModel.cc = (this.cc && this.cc.trim() != '') ? this.cc : null;
        shareModel.bcc = (this.bcc && this.bcc.trim() != '') ? this.bcc : null;
        this.auditService.downloadOrSendPdfAuditReport(shareModel).subscribe((result: any) => {
            if (result.success) {
                this.disableReportShare = false;
                this.downldInProgress = false;
                if (!this.isToSendMail) {
                    let pdfName = 'report-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '.pdf';
                    const downloadLink = document.createElement("a");
                    downloadLink.href = result.data;
                    downloadLink.download = pdfName;
                    downloadLink.target = "_blank";
                    downloadLink.click();
                }
                else {
                    this.shareReportPopover.close();
                    this.toastr.success(this.translateService.instant(ConstantVariables.InvoiceMailSentSuccessfully));
                }
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.disableReportShare = false;
                this.downldInProgress = false;
                this.cdRef.markForCheck();
            }
        });
    }

    closeSendReportPopover() {
        this.disableReportShare = false;
        this.shareReportPopover.close();
    }

    validateMail() {
        if ((this.to && this.to.trim() != '') || (this.cc && this.cc.trim() != '') || (this.bcc && this.bcc.trim() != ''))
            return false;
        else
            return true;
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