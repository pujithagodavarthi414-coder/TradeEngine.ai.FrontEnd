import { Component, ChangeDetectionStrategy, ViewChild, Input, Output, EventEmitter, OnInit, ViewChildren, ElementRef, ChangeDetectorRef, QueryList } from '@angular/core';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { SatPopover } from '@ncstate/sat-popover';

import { TestSuiteList, TestSuite } from '../models/testsuite';

import { State } from "../store/reducers/index";

import { TestRunActionTypes } from '../store/actions/testrun.actions';
import { LoadTestSuiteDeleteTriggered, TestSuiteActionTypes, LoadTestSuiteByIdTriggered } from "../store/actions/testsuiteslist.action";
import { LoadProjectRelatedCountsTriggered } from '../store/actions/testrailprojects.actions';
import { MatMenuTrigger } from '@angular/material/menu';

import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { GoogleAnalyticsService } from '../services/google-analytics.service';

@Component({
  selector: 'testsuite-item-summary',
  templateUrl: './testsuite-item-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuiteItemSummaryComponent extends CustomAppFeatureBaseComponent implements OnInit {
  @ViewChildren("addNewRunPopover") addNewRunPopovers;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild("addTestSuite") addTestSuitePopover: SatPopover;
  @ViewChild("testSuiteTitle") testSuiteTitleStatus: ElementRef;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @Output() updateDescription = new EventEmitter<any>();
  @Output() updateId = new EventEmitter<string>();
  @Output() deleteId = new EventEmitter<string>();
  // @Input() testSuiteSelected: boolean;
  softLabels: SoftLabelConfigurationModel[];

  @Input("testSuite")
  set _testSuite(data: TestSuiteList) {
    if (data) {
      this.testSuiteData = data;
    }
  }

  @Input("testSuiteSelected")
  set _testSuiteSelected(data: boolean) {
    if (data || data == false) {
      this.testSuiteSelected = data;
      if (!this.testSuiteSelected) {
        this.panelOpenState = false;
        this.expansionIcon = false;
      }
      this.cdRef.markForCheck();
    }
    else {
      this.testSuiteSelected = false;
      this.panelOpenState = false;
      this.expansionIcon = false;
      this.cdRef.markForCheck();
    }
  }

  @Input("testSuiteId")
  set _testSuiteId(data: string) {
    this.testSuiteId = data;
  }
  contextMenuPosition = { x: '0px', y: '0px' };
  public ngDestroyed$ = new Subject();

  testSuite: TestSuite;
  testSuiteData: TestSuiteList;
  editTestSuiteData: TestSuiteList;
  searchTestSuite: TestSuiteList;

  projectId: string;
  testSuiteId: string;
  testSuiteIdForRun: string;
  testSuiteNameForRun: string;
  disableTestSuiteDelete: boolean = false;
  isEditTestSuite: boolean = false;
  testSuiteSelected: boolean = false;
  loadNewTestRun: boolean = false;
  showTooltip: boolean = false;
  expansionIcon: boolean = false;
  panelOpenState: boolean = false;

  constructor(private store: Store<State>, private route: ActivatedRoute, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef,
    public googleAnalyticsService: GoogleAnalyticsService) {
    super();
    this.route.params.subscribe(routeParams => {
      this.projectId = routeParams.id;
    });

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestSuiteActionTypes.LoadTestSuiteDeleteCompleted),
        tap(() => {
          this.closeTestSuiteDialog();
          this.trigger.closeMenu();
          this.disableTestSuiteDelete = false;
        })
      ).subscribe();


    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestSuiteActionTypes.TestSuiteFailed),
        tap(() => {
          this.disableTestSuiteDelete = false;
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

  addTestRuns(addNewRunPopover, testSuiteData) {
    this.testSuiteIdForRun = testSuiteData.testSuiteId;
    this.testSuiteNameForRun = testSuiteData.testSuiteName;
    this.loadNewTestRun = true;
    addNewRunPopover.openPopover();
  }

  closeNewTestRunDialog() {
    this.loadNewTestRun = false;
    localStorage.removeItem('selectedTestCases');
    localStorage.removeItem('selectedSections');
    this.addNewRunPopovers.forEach(p => p.closePopover());
  }

  closeTestSuiteDialog() {
    this.trigger.closeMenu();
    let popover = this.addTestSuitePopover;
    if (popover)
      popover.close();
  }

  makeEditFalse() {
    this.isEditTestSuite = false;
  }

  detailsOpen() {
    this.isEditTestSuite = true;
    this.editTestSuiteData = this.testSuiteData;
    console.log(this.editTestSuiteData);
  }

  deleteSelectedTestSuite() {
    this.disableTestSuiteDelete = true;
    this.testSuite = new TestSuite();
    this.testSuite.testSuiteId = this.testSuiteData.testSuiteId;
    this.testSuite.testSuiteName = this.testSuiteData.testSuiteName;
    this.testSuite.projectId = this.testSuiteData.projectId;
    this.testSuite.timeStamp = this.testSuiteData.timeStamp;
    this.store.dispatch(new LoadTestSuiteDeleteTriggered(this.testSuite));
    this.deleteId.emit(this.testSuiteData.testSuiteId);
    this.checkTooltipStatus();
    this.googleAnalyticsService.eventEmitter("Test Management", "Deleted Test Suite", this.testSuite.testSuiteName, 1);
  }

  getUpdatedDescription(value) {
    this.updateDescription.emit(value);
  }

  getUpdatedId(value) {
    this.updateId.emit(value);
  }

  checkTooltipStatus() {
    if (this.testSuiteTitleStatus.nativeElement.scrollWidth > this.testSuiteTitleStatus.nativeElement.clientWidth) {
      this.showTooltip = true;
    }
    else {
      this.showTooltip = false;
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