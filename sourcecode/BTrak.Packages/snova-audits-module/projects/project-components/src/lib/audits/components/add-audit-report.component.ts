import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from "@angular/router";

import "../../globaldependencies/helpers/fontawesome-icons";

import * as auditModuleReducer from "../store/reducers/index";
import { State } from "../store/reducers/index";

import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { AuditReport } from '../models/audit-report.model';
import { AuditConduct } from '../models/audit-conduct.model';
import { LoadAuditConductListTriggered } from '../store/actions/conducts.actions';
import { AuditReportActionTypes, LoadReportTriggered } from '../store/actions/audit-report.actions';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: 'add-audit-report',
    templateUrl: './add-audit-report.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddAuditReportComponent {
    @Output() closeReport = new EventEmitter<string>();

    conductList$: Observable<AuditConduct[]>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];

    public ngDestroyed$ = new Subject();

    report: AuditReport;

    addReportForm: FormGroup;

    projectId: string;
    reportId: string;
    milestoneIdForReport: string;
    testRunsId: string;

    disableReport: boolean = false;
    hideMilestone: boolean;
    isTestRun: boolean = false;

    constructor(private store: Store<State>, private route: ActivatedRoute, private actionUpdates$: Actions) {
        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.loadConductList();
        this.initializeReportForm();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditReportActionTypes.LoadReportByIdCompleted),
                tap(() => {
                    this.closeReportDialog();
                    this.disableReport = false;
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditReportActionTypes.ReportFailed),
                tap(() => {
                    this.disableReport = false;
                })
            ).subscribe();
    }

    ngOnInit() {
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    loadConductList() {
        let auditConductModel = new AuditConduct();
        auditConductModel.isArchived = false;
        auditConductModel.projectId = this.projectId;
        this.store.dispatch(new LoadAuditConductListTriggered(auditConductModel));
        this.conductList$ = this.store.pipe(select(auditModuleReducer.getAuditConductAll));
    }

    addReport() {
        this.disableReport = true;
        this.report = new AuditReport();
        this.report = this.addReportForm.value;
        this.report.projectId = this.projectId;
        this.store.dispatch(new LoadReportTriggered(this.report));
    }

    closeReportDialog() {
        this.closeReport.emit('');
    }

    initializeReportForm() {
        this.addReportForm = new FormGroup({
            auditReportId: new FormControl(null, []),
            auditReportName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(150)])),
            auditReportDescription: new FormControl(null, Validators.compose([Validators.maxLength(800)])),
            conductId: new FormControl(null, Validators.compose([Validators.required])),
            timeStamp: new FormControl(null, [])
        });
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}