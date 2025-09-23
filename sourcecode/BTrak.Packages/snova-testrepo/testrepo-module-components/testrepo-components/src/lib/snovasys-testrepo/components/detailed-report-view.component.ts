import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

import { State } from "../store/reducers/index";
import * as testSuiteModuleReducer from "../store/reducers/index";

import { TestRailReport, ReportsList } from "../models/reports-list";

import { LoadDetailedReportTriggered, ReportActionTypes } from "../store/actions/reports.actions";

import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../constants/constant-variables';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

@Component({
    selector: "detailed-report-view",
    templateUrl: "./detailed-report-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DetailedReportViewComponent {
    @Output() caseStatusPreviewDetails = new EventEmitter<any>();

    @Input("loadReport")
    set _loadReport(data: boolean) {
        if (data != null && data != undefined)
            this.loadReports = data;
    }

    @Input("reportId")
    set _reportId(data: string) {
        if (data != undefined && data) {
            this.reportId = data;
            this.loadReportById(this.reportId);
        }
    }

    detailedReport$: Observable<ReportsList>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    reportById: TestRailReport;
    detailedReport: ReportsList;
    softLabels: SoftLabelConfigurationModel[];

    projectId: string;
    reportId: string;
    selectedCaseId: string;
    loadReports: boolean = false;

    constructor(private store: Store<State>, private cdRef: ChangeDetectorRef,private actionUpdates$: Actions, private route: ActivatedRoute, private router: Router, private toastr: ToastrService, private translateService: TranslateService) {
        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.anyOperationInProgress$ = this.store.pipe(select(testSuiteModuleReducer.getDetailedReportLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ReportActionTypes.LoadDetailedReportCompleted),
                tap(() => {
                    this.detailedReport$ = this.store.pipe(select(testSuiteModuleReducer.getDetailedReport));
                    this.detailedReport$.subscribe(result => {
                        this.detailedReport = result;
                        this.cdRef.detectChanges();
                    })
                })
            ).subscribe();
    }

    ngOnInit() {
        this.getSoftLabels();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    loadReportById(reportId) {
        this.reportById = new TestRailReport();
        this.reportById.reportId = reportId;
        this.reportById.isArchived = false;
        this.store.dispatch(new LoadDetailedReportTriggered(this.reportById));
        this.detailedReport$ = this.store.pipe(select(testSuiteModuleReducer.getDetailedReport));
    }

    handleClick(data) {
        this.selectedCaseId = data.testCaseId;
    }

    goToTestRuns(testRunName) {
        if (!testRunName.isArchived) {
            let data = {
                testRunId: testRunName.testRunId,
                testRunName: testRunName.testRunName,
                isCompleted: testRunName.isCompleted
            };
            localStorage.setItem('reportTestRunName', JSON.stringify(data));
            this.router.navigateByUrl('projects/projectstatus/' + this.projectId + '/runs');
        }
        else {
            this.toastr.warning("", this.translateService.instant(ConstantVariables.TestRunDeleted));
        }
    }

    getCaseStatusPreviewDetails(data) {
        this.caseStatusPreviewDetails.emit(data);
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}