import { Component, ChangeDetectionStrategy, Input, OnInit, ViewChild, Output, EventEmitter, ElementRef, ViewChildren, QueryList } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';
import { SatPopover } from "@ncstate/sat-popover";

import "../../globaldependencies/helpers/fontawesome-icons";

import { State } from "../store/reducers/index";
import { TestRunActionTypes, LoadTestRunDeleteTriggered } from "../store/actions/testrun.actions";

import { Observable } from "rxjs/internal/Observable";
import { TestRun } from "../models/testrun";
import { Router, ActivatedRoute } from "@angular/router";
import { ReportActionTypes } from "../store/actions/reports.actions";
import { MatMenuTrigger } from "@angular/material/menu";
import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { GoogleAnalyticsService } from '../services/google-analytics.service';

@Component({
  selector: "testrun-item-summary",
  templateUrl: "./testrun-item-summary.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunItemSummaryComponent extends CustomAppFeatureBaseComponent implements OnInit {
  @Output() deleteId = new EventEmitter<string>();
  @Output() updateDescription = new EventEmitter<any>();
  @Output() updateId = new EventEmitter<string>();
  @Output() editedRunData = new EventEmitter<any>();
  @Output() editingTestRunId = new EventEmitter<any>();

  softLabels: SoftLabelConfigurationModel[];

  @ViewChild("editTestRun") editTestRuns: SatPopover;
  @ViewChild("deleteTestRun") deleteTestRuns: SatPopover;
  @ViewChild("addReport") addReportPopover: SatPopover;
  @ViewChild("testRunTitle") testRunTitleStatus: ElementRef;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;

  @Input("testRunData")
  set _testRunData(data: any) {
    if (data) {
      this.testRunData = data;
    }
  }

  contextMenuPosition = { x: '0px', y: '0px' };

  @Input("testRunSelectedId")
  set _testRunSelected(data: any) {
    if (data || data == false) {
      if (this.testRunData.testRunId == data)
        this.testRunSelected = true;
      else
        this.testRunSelected = false;
      if (!this.testRunSelected) {
        this.panelOpenState = false;
        this.expansionIcon = false;
      }
    }
    else {
      this.testRunSelected = false;
      this.panelOpenState = false;
      this.expansionIcon = false;
    }
  }

  public ngDestroyed$ = new Subject();

  deleteTestRun: TestRun;

  testRunData: any;
  editingTestRun: boolean = false;
  disableTestRunDelete: boolean = false;
  editedTestRunId: string;
  projectId: string;
  editedIsInclude: any;
  editedTestRunIsCompleted: boolean;
  hideMileStones: boolean = false;
  loadAddReport: boolean = false;
  isFromTestRun: boolean = true;
  showTitleTooltip: boolean = false;
  testRunSelected: boolean = false;
  expansionIcon: boolean = false;
  panelOpenState: boolean = false;

  constructor(private store: Store<State>, private actionUpdates$: Actions, private router: Router, private route: ActivatedRoute,
    public googleAnalyticsService: GoogleAnalyticsService) {
    super();

    this.route.params.subscribe(routeParams => {
      this.projectId = routeParams.id;
    });
    
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestRunActionTypes.LoadTestRunDeleteCompleted),
        tap(() => {
          this.closeDeleteTestRun();
          this.disableTestRunDelete = false;
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestRunActionTypes.TestRunEditCompletedWithInPlaceUpdate),
        tap(() => {
          if (this.editedTestRunId == this.testRunData.testRunId) {
            let editedTestRun = new TestRun();
            editedTestRun.testRunId = this.testRunData.testRunId;
            editedTestRun.testSuiteId = this.testRunData.testSuiteId;
            if (this.editedIsInclude == true || this.editedIsInclude == 'true')
              editedTestRun.isSectionsRequired = false;
            else
              editedTestRun.isSectionsRequired = true;
            editedTestRun.isCompleted = this.editedTestRunIsCompleted;
            this.editedRunData.emit(editedTestRun);
          }
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestRunActionTypes.TestRunFailed),
        tap(() => {
          this.disableTestRunDelete = false;
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
  }

  editTestRunData() {
    this.editingTestRun = true;
    this.editingTestRunId.emit(this.testRunData.testRunId);
    this.editTestRuns.open();
    (document.querySelector('.filter-data') as HTMLElement).parentElement.parentElement.style.overflow = 'auto';
  }

  getEditedRunData(value) {
    this.editedTestRunId = value.testRunId;
    this.editedIsInclude = value.isIncludeAllCases;
    this.editedTestRunIsCompleted = value.isCompleted;
  }

  closeEditTestRun() {
    this.editingTestRun = false;
    localStorage.removeItem('selectedTestCases');
    localStorage.removeItem('selectedSections');
    this.editTestRuns.close();
  }

  deleteTheTestRun() {
    this.disableTestRunDelete = true;
    this.deleteTestRun = new TestRun();
    this.deleteTestRun.testRunId = this.testRunData.testRunId;
    this.deleteTestRun.testRunName = this.testRunData.testRunName;
    this.deleteTestRun.projectId = this.testRunData.projectId;
    this.deleteTestRun.timeStamp = this.testRunData.timeStamp;
    this.store.dispatch(new LoadTestRunDeleteTriggered(this.deleteTestRun));
    this.deleteId.emit(this.testRunData.testRunId);
    this.googleAnalyticsService.eventEmitter("Test Management", "Deleted Test Run", this.deleteTestRun.testRunName, 1);
  }

  closeDeleteTestRun() {
    let popover = this.deleteTestRuns;
    if (popover)
      popover.close();
  }

  getUpdatedDescription(value) {
    this.updateDescription.emit(value);
  }

  getUpdatedId(value) {
    this.updateId.emit(value);
  }

  openReportDialog() {
    this.loadAddReport = true;
    this.addReportPopover.open();
  }
  closeReportDialog() {
    this.loadAddReport = false;
    this.addReportPopover.close();
  }

  checkTitleTooltipStatus() {
    if (this.testRunTitleStatus.nativeElement.scrollWidth > this.testRunTitleStatus.nativeElement.clientWidth) {
      this.showTitleTooltip = true;
    }
    else {
      this.showTitleTooltip = false;
    }
  }

  expandClick() {
    this.expansionIcon = !this.expansionIcon;
    this.panelOpenState = !this.panelOpenState;
  }

  openContextMenu(event: MouseEvent) {
    event.preventDefault();
    var contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      console.log(event);
      this.contextMenuPosition.x = (event.clientX) + 'px';
      this.contextMenuPosition.y = (event.clientY - 30) + 'px';
      contextMenu.openMenu();
    }
  }

  togglePanel() {
    this.panelOpenState = !this.panelOpenState;
    this.expansionIcon = !this.expansionIcon;
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}
