import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Subject, Observable } from 'rxjs';
import { TestRailReport } from "../models/reports-list";
import { ActivatedRoute } from "@angular/router";

import "../../globaldependencies/helpers/fontawesome-icons";

import { TestCaseDropdownList } from '../models/testcasedropdown';

import * as testRailModuleReducer from "../store/reducers/index";
import { State } from "../store/reducers/index";

import { LoadReportTriggered, ReportActionTypes } from "../store/actions/reports.actions";
import { LoadMileStoneDropdownListTriggered } from '../store/actions/milestonedropdown.actions';
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: 'add-report',
    templateUrl: './add-report.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddReportComponent {
    @Output() closeReport = new EventEmitter<string>();

    @Input("hideMileStones")
    set _hideMileStones(data: boolean) {
        if (data || data === false) {
            this.hideMilestone = data;
            if (data)
                this.initializeReportForm();
            else
                this.reInitializeReportForm();
        }
    }

    @Input("milestoneId")
    set _milestoneId(data: string) {
        if (data != undefined && data) {
            this.milestoneIdForReport = data;
            this.reInitializeReportForm();
        }
    }

    @Input("testRunId")
    set _testRunId(data: string) {
        if (data != undefined && data) {
            this.testRunsId = data;
            this.reInitializeReportForm();
        }
    }


    @Input("isFromTestRun")
    set _isFromTestRun(data: boolean) {
        if (data || data == false) {
            this.isTestRun = data;
            this.reInitializeReportForm();
        }
    }

    mileStoneDropdownList$: Observable<TestCaseDropdownList[]>;
    softLabels: SoftLabelConfigurationModel[];

    public ngDestroyed$ = new Subject();

    report: TestRailReport;

    addReportForm: FormGroup;

    projectId: string;
    reportId: string;
    milestoneIdForReport: string;
    testRunsId: string;

    disableReport: boolean = false;
    hideMilestone: boolean;
    isTestRun: boolean = false;

    constructor(private store: Store<State>, private route: ActivatedRoute, private actionUpdates$: Actions,
        public googleAnalyticsService: GoogleAnalyticsService) {
        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.loadMileStonesList();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ReportActionTypes.LoadReportByIdCompleted),
                tap(() => {
                    this.closeReportDialog();
                    this.disableReport = false;
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ReportActionTypes.ReportFailed),
                tap(() => {
                    this.disableReport = false;
                })
            ).subscribe();
    }

    ngOnInit() {
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    loadMileStonesList() {
        this.store.dispatch(new LoadMileStoneDropdownListTriggered(this.projectId));
        this.mileStoneDropdownList$ = this.store.pipe(select(testRailModuleReducer.getMileStoneDropdownList));
    }

    addReport() {
        this.disableReport = true;
        this.report = new TestRailReport();
        this.report = this.addReportForm.value;
        this.report.projectId = this.projectId;
        if (this.isTestRun) {
            this.report.testRunId = this.testRunsId;
        }

        this.googleAnalyticsService.eventEmitter("Test Management", "Created Report", this.report.reportName, 1);
        this.store.dispatch(new LoadReportTriggered(this.report));
    }

    closeReportDialog() {
        this.closeReport.emit('');
    }

    initializeReportForm() {
        this.addReportForm = new FormGroup({
            reportName: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(150)])),
            description: new FormControl("", Validators.compose([Validators.maxLength(300)])),
            milestoneId: new FormControl("", Validators.compose([Validators.required]))
        });
    }

    reInitializeReportForm() {
        this.addReportForm = new FormGroup({
            reportName: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(150)])),
            description: new FormControl("", Validators.compose([Validators.maxLength(300)])),
            milestoneId: new FormControl(this.milestoneIdForReport, ([]))
        });
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}