import { ChangeDetectionStrategy, Component, ChangeDetectorRef, Input, Output, EventEmitter, ViewChildren, OnInit, ViewChild, ElementRef, QueryList } from "@angular/core";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { State } from "../store/reducers/index";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from 'rxjs';
import { SatPopoverAnchor, SatPopover } from "@ncstate/sat-popover";

import "../../globaldependencies/helpers/fontawesome-icons";

import { MileStoneActionTypes, LoadTestRunsByMileStoneTriggered, LoadMileStoneDeleteTriggered } from "../store/actions/milestones.actions";
import * as testRailModuleReducer from "../store/reducers/index";

import { MileStone, MileStoneWithCount } from "../models/milestone";
import { TestRunList } from "../models/testrun";
import { LoadProjectRelatedCountsTriggered } from "../store/actions/testrailprojects.actions";

import { ReportActionTypes } from "../store/actions/reports.actions";
import { MatDialog } from "@angular/material/dialog";
import {  MatMenuTrigger } from "@angular/material/menu";
import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { SoftLabelPipe } from '../pipes/softlabels.pipes';

@Component({
    selector: 'app-testrail-component-milestoneview',
    templateUrl: './milestone-view.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestrailMileStoneViewComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @ViewChildren(SatPopoverAnchor) MileStonesPopover;
    @ViewChild("addReport") addReportPopover: SatPopover;
    @ViewChild("milestoneTitle") milestoneTitleStatus: ElementRef;
    @ViewChild("milestoneDescription") milestoneDescriptionStatus: ElementRef;
    @Output() refreshList: EventEmitter<boolean> = new EventEmitter();
    @Output() mileStoneForEditing: EventEmitter<any> = new EventEmitter();
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;

    testRunList$: Observable<TestRunList[]>;
    softLabels: SoftLabelConfigurationModel[];

    @Input("viewMilestone")
    set _viewMilestone(data: any) {
        if (data) {
            this.milestone = data;
        }
    }

    @Input("fromCustomApp")
    set _fromCustomApp(fromCustomApp) {
        this.fromCustomApp = fromCustomApp;
    }

    @Input("projectId")
    set _projectId(data) {
        this.projectId = data;
    }

    contextMenuPosition = { x: '0px', y: '0px' };
    public ngDestroyed$ = new Subject();

    milestone: MileStoneWithCount;
    hideme = false;
    fromCustomApp = false;
    projectId: string;
    deleteMilestone: boolean = false;
    loadAddReport: boolean = false;
    hideMileStones: boolean = false;
    showTitleTooltip: boolean = false;
    showDescriptionTooltip: boolean = false;
    public dataObject = { passed: 45, blocked: 12, untested: 23, retest: 14, failed: 6 };

    constructor(private store: Store<State>, private dialog: MatDialog, private actionUpdates$: Actions, private route: ActivatedRoute, private router: Router, private cdRef: ChangeDetectorRef,
        public googleAnalyticsService: GoogleAnalyticsService, private softLabelPipe: SoftLabelPipe) {
        super();
        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(MileStoneActionTypes.LoadMileStoneDeleteCompleted),
            tap(() => {
                this.deleteMilestone = false;
                this.closeMileStoneDialog();
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(MileStoneActionTypes.MileStoneFailed),
                tap(() => {
                    this.deleteMilestone = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ReportActionTypes.LoadReportCompleted),
                tap((result: any) => {
                    let addedReportId = result.reportId;
                    localStorage.setItem('addedReportId', addedReportId);
                    this.router.navigateByUrl('projects/projectstatus/' + this.projectId + '/test-reports');
                })
            ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    deleteMileStone(milestone: MileStone) {
        this.deleteMilestone = true;
        let milestoneObject = new MileStone();
        milestoneObject = Object.assign({}, milestone);
        this.store.dispatch(new LoadMileStoneDeleteTriggered(milestoneObject));
        this.googleAnalyticsService.eventEmitter("Test Management", "Deleted Milestone", milestoneObject.milestoneTitle, 1);
    }

    closeMileStoneDialog() {
        this.MileStonesPopover.forEach((p) => {
            if (p.isPopoverOpen()) {
                p.closePopover();
            }
        });
    }

    editMilestone(milestone) {
        this.mileStoneForEditing.emit(milestone);
    }

    showTestRuns(milestone) {
        this.hideme = !this.hideme;
        this.store.dispatch(new LoadTestRunsByMileStoneTriggered(milestone));
        this.testRunList$ = this.store.pipe(select(testRailModuleReducer.getTestRunsByMileStone));
    }

    openAddReport() {
        this.loadAddReport = true;
        this.addReportPopover.open();
    }

    closeReportDialog() {
        this.loadAddReport = false;
        this.addReportPopover.close();
    }

    goToRelatedTestRun(testRunName) {
        let data = {
            testRunId: testRunName.testRunId,
            testRunName: testRunName.testRunName,
            isCompleted: testRunName.isCompleted
        };
        localStorage.setItem('reportTestRunName', JSON.stringify(data));
        this.router.navigateByUrl('projects/projectstatus/' + this.projectId + '/runs');
        if (this.fromCustomApp) {
            this.dialog.closeAll();
        }
    }

    checkTitleTooltipStatus() {
        if (this.milestoneTitleStatus.nativeElement.scrollWidth > this.milestoneTitleStatus.nativeElement.clientWidth) {
            this.showTitleTooltip = true;
        }
        else {
            this.showTitleTooltip = false;
        }
    }

    checkDescriptionTooltipStatus() {
        if (this.milestoneDescriptionStatus.nativeElement.scrollWidth > this.milestoneDescriptionStatus.nativeElement.clientWidth) {
            this.showDescriptionTooltip = true;
        }
        else {
            this.showDescriptionTooltip = false;
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    openContextMenu(event: MouseEvent, milestone) {
        event.preventDefault();
        this.showTestRuns(milestone);
        var contextMenu = this.triggers.toArray()[0];
        if (contextMenu) {
            console.log(event);
            this.contextMenuPosition.x = (event.clientX) + 'px';
            this.contextMenuPosition.y = (event.clientY - 30) + 'px';
            contextMenu.openMenu();
        }
    }
}