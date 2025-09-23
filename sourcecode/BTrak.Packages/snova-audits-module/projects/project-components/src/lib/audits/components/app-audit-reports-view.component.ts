import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChildren, Output, EventEmitter, Input } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import * as auditModuleReducer from "../store/reducers/index";

import { AuditReportActionTypes } from "../store/actions/audit-report.actions";
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LoadAuditRelatedCountsTriggered } from '../store/actions/audits.actions';

import * as $_ from 'jquery';

import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

const $ = $_;

@Component({
    selector: "app-audit-reports-view",
    templateUrl: "./app-audit-reports-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditReportsViewComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren("addReportPopover") addReportsPopover;
    @Output() closePopUp = new EventEmitter<any>();

    @Input("dashboardFilters")
    set _dashboardFilters(data: any) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    reportsCount$: Observable<number>;
    activeAuditReportsCount$: Observable<number>;
    archivedAuditReportsCount$: Observable<number>;

    projectRelatedDataLoading$: Observable<boolean>;
    projectLabel: string;
    public ngDestroyed$ = new Subject();

    projectId: string;

    dashboardFilters: any;
    selectedQuestionFromPreview: any;
    selectedReport: string;
    screenWidth: number;
    isReport: boolean = false;
    loadAddReport: boolean = false;
    loadReport: boolean = false;
    isFromDashboard: boolean = false;
    hideMileStones: boolean = true;
    showQuestionStatusPreview: any;
    applyHeight: any;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
        super();

        if (!(this.routes.url.includes('projects'))) {
            this.isFromDashboard = true;
            this.cdRef.markForCheck();
        }

        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
            if (this.projectId && this.routes.url.includes('projects'))
                this.getAuditRelatedCounts();
        });

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditReportActionTypes.LoadDetailedReportTriggered),
                tap(() => {
                    this.showQuestionStatusPreview = null;
                    this.selectedQuestionFromPreview = null;
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

    getAuditRelatedCounts() {
        this.store.dispatch(new LoadAuditRelatedCountsTriggered(this.projectId));
        this.activeAuditReportsCount$ = this.store.pipe(select(auditModuleReducer.getActiveAuditReportsCount));
        this.archivedAuditReportsCount$ = this.store.pipe(select(auditModuleReducer.getArchivedAuditReportsCount));
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    openReportDialog(reportPopover) {
        this.loadAddReport = true;
        reportPopover.openPopover();
    }

    closeReportDialog() {
        this.loadAddReport = false;
        this.addReportsPopover.forEach(p => p.closePopover());
    }

    getLoadReportById(value) {
        this.loadReport = value;
        this.cdRef.detectChanges();
    }

    getReportData(value) {
        this.selectedReport = value;
        this.cdRef.detectChanges();
    }

    getQuestionStatusPreviewDetails(data) {
        this.closePreviewDialog();
        this.showQuestionStatusPreview = data;
        this.selectedQuestionFromPreview = data;
        this.isReport = true;
        this.cdRef.detectChanges();
    }

    closePreviewDialog() {
        this.showQuestionStatusPreview = null;
        this.selectedQuestionFromPreview = null;
        this.isReport = false;
        this.cdRef.detectChanges();
    }

    onResize() {
        this.screenWidth = window.innerWidth;
    }

    fitContent(optionalParameters: any) {
        if (optionalParameters['gridsterView']) {
            // $(optionalParameters['gridsterViewSelector'] + ' #contact-details-form').height($(optionalParameters['gridsterViewSelector']).height() - 90);
            var height = $(optionalParameters['gridsterViewSelector']).height();
            var counter = 0;
            this.applyHeight = setInterval(function () {
                // if (counter > 10) {
                //     clearInterval(applyHeight);
                // }
                counter++;
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-reports-list').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-reports-list').css('height', (height - 56) + 'px');
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-detailed-report').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-detailed-report').css('height', (height - 56) + 'px');
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-report-questions-height').length > 0) {
                    // $(optionalParameters['gridsterViewSelector'] + ' .fit-content-report-questions-height').css('height', (height - 94) + 'px');
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-report-questions-height').css("cssText", `max-height: ${height - 94}px !important;`);
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-testrun-status-preview').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-testrun-status-preview').css('height', (height - 60) + 'px');
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-testsuite-history-scroll').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-testsuite-history-scroll').css("cssText", `max-height: ${height - 180}px !important;`);
                    // clearInterval(applyHeight);
                }
            }, 2000);
        }
    }

    navigateToProjects() {
        this.closePopUp.emit(true);
        this.routes.navigateByUrl('/projects');
    }

    public ngOnDestroy() {
        if(this.applyHeight) {
            clearInterval(this.applyHeight);
        }
        this.ngDestroyed$.next();
    }
}