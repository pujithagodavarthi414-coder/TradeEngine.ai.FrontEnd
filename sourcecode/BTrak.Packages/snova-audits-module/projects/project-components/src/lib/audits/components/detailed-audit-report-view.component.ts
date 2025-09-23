import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

import { State } from "../store/reducers/index";

import * as auditModuleReducer from "../store/reducers/index";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";

import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { AuditReport } from "../models/audit-report.model";
import { AuditReportActionTypes, LoadDetailedReportTriggered } from "../store/actions/audit-report.actions";
import { AuditService } from '../services/audits.service';
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

@Component({
    selector: "detailed-audit-report-view",
    templateUrl: "./detailed-audit-report-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DetailedAuditReportViewComponent {
    @Output() questionStatusPreviewDetails = new EventEmitter<any>();

    @Input("loadReport")
    set _loadReport(data: boolean) {
        if (data != null && data != undefined)
            this.loadReports = data;
    }

    @Input("selectedReport")
    set _selectedReport(data: any) {
        if (data) {
            this.selectedReport = data;
            this.loadReportById(this.selectedReport.auditReportId);
        }
    }

    @Input("selectedQuestion")
    set _selectedQuestion(data: any) {
        if (data) {
            this.questionFromPreview = data;
            this.cdRef.detectChanges();
            this.handleClick(data);
        }
        else {
            this.questionFromPreview = null;
            this.cdRef.detectChanges();
        }
    }

    detailedReport$: Observable<AuditReport>;
    anyOperationInProgress$: Observable<boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;

    public ngDestroyed$ = new Subject();

    reportById: any;
    detailedReport: any;
    questionFromPreview: any;
    softLabels: SoftLabelConfigurationModel[];

    selectedReport: any;
    projectId: string;
    reportId: string;
    selectedCaseId: string;
    loadReports: boolean = false;

    constructor(private store: Store<State>, private cdRef: ChangeDetectorRef, private actionUpdates$: Actions, private auditService: AuditService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService, private translateService: TranslateService) {
        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });
        
        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getDetailedReportLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditReportActionTypes.LoadDetailedReportCompleted),
                tap(() => {
                    this.detailedReport$.subscribe(result => {
                        this.detailedReport = result;
                    })
                })
            ).subscribe();
    }

    ngOnInit() {
        this.getSoftLabels();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    loadReportById(reportId) {
        let reportModel = new AuditReport();
        reportModel.auditReportId = reportId;
        reportModel.isArchived = false;
        this.store.dispatch(new LoadDetailedReportTriggered(reportModel));
        this.detailedReport$ = this.store.pipe(select(auditModuleReducer.getDetailedReport));
    }

    handleClick(data) {
        this.selectedCaseId = data.questionId;
        this.cdRef.markForCheck();
    }

    goToConducts() {
        if (!this.detailedReport.isConductArchived) {
            let data = {
                conductId: this.detailedReport.conductId,
                isArchived: this.detailedReport.isConductArchived
            };
            localStorage.setItem('ConductedAudit', this.detailedReport.conductId);
            // this.router.navigateByUrl('audits/auditsview/1');
            // this.auditService.redirectedConductId = this.detailedReport.conductId;
            this.router.navigateByUrl('projects/projectstatus/' + this.projectId + '/conducts');
        }
        else {
            this.toastr.warning("", this.translateService.instant(ConstantVariables.WarningMessageForConductArchived));
        }
    }

    getQuestionStatusPreviewDetails(data) {
        this.questionStatusPreviewDetails.emit(data);
    }
    canViewFilter(data) {
        return data.filter(i => i.canView == true);
    }
    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}