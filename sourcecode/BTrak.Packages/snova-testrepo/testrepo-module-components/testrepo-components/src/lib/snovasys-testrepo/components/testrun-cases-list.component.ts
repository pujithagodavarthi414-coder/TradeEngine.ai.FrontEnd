import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { TestSuiteSectionActionTypes, LoadTestSuiteSectionListForRunsTriggered } from '../store/actions/testsuitesection.actions';

import * as testSuiteSectionModuleReducer from "../store/reducers/index";

import { TestSuiteCases, TestSuiteRunSections } from "../models/testsuitesection";
import { TestCaseRunDetails } from "../models/testcaserundetails";
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

@Component({
  selector: "testrun-cases-list",
  templateUrl: "./testrun-cases-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunCasesListComponent {
  @Output() selectedSectionData = new EventEmitter<any>();
  @Output() selectedSections = new EventEmitter<any>();
  @Output() casesSelected = new EventEmitter<any>();
  @Output() sectionsSelected = new EventEmitter<any>();
  @Output() sectionCasesCount = new EventEmitter<any>();
  @Output() sectionsData = new EventEmitter<any>();
  @Input() unSelectSectionId: any;
  @Input() sectionToCheck: any;
  @Input() sectionSelected: any;
  @Input() checkFilterCases: any;
  @Input() sectionCollapse: boolean;

  softLabels: SoftLabelConfigurationModel[];

  @Input("selectAllNone")
  set _selectAllNone(data: any) {
    this.selectAllNone = data;
    if (this.selectAllNone) {
      if (this.testRunSectionsList.sections != null && this.testRunSectionsList.sections.length > 0) {
        this.sectionsData.emit(this.testRunSectionsList.sections);
      }
    }
  }

  @Input("testSuiteId")
  set _testSuiteId(data: any) {
    this.testSuiteId = data;
    this.loadSectionsList();
  }

  @Input("testRunId")
  set _testRunId(data: any) {
    if (data != undefined && data) {
      this.testRunId = data;
      this.loadSectionsList();
    }
    else
      this.testRunId = null;
  }

  testRunSectionList$: Observable<TestSuiteCases>;
  anyOperationInProgress$: Observable<boolean>;

  public ngDestroyed$ = new Subject();

  testSuiteId: string;
  testRunId: string;
  isSectionsPresent: boolean = false;
  isSectionsListPresent: boolean = false;
  testRunSectionList: any;
  testRunSectionsList: any;
  selectAllNone: any;

  constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
    this.anyOperationInProgress$ = this.store.pipe(select(testSuiteSectionModuleReducer.getTestSuiteSectionListForRunsLoading));

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionListForRunsCompleted),
      tap(() => {
        this.testRunSectionList$.subscribe(result => {
          this.testRunSectionsList = result;
          if (this.testRunId != null && this.testRunSectionsList) {
            this.sectionsSelected.emit(this.testRunSectionsList.testRunSelectedSections);
            this.casesSelected.emit(this.testRunSectionsList.testRunSelectedCases);
          }
          if (this.testRunSectionsList && this.testRunSectionsList.sections != null && this.testRunSectionsList.sections.length > 0) {
            this.testRunSectionList = result;
            this.isSectionsListPresent = true;
            this.isSectionsPresent = false;
            this.selectedSectionData.emit(this.testRunSectionsList.sections[0]);
            if (localStorage.getItem('selectedSections') != 'undefined' && localStorage.getItem('selectedSections') != null) {
              let selectedSections = JSON.parse(localStorage.getItem('selectedSections'));
              let selectedCases = JSON.parse(localStorage.getItem('selectedTestCases'));
              if (selectedSections.indexOf(this.testRunSectionsList.sections[0].sectionId) != -1
                && selectedCases.findIndex(x => x.sectionId == this.testRunSectionsList.sections[0].sectionId) == -1) {
                let selectedCaseDetails = new TestCaseRunDetails();
                selectedCaseDetails.sectionId = this.testRunSectionsList.sections[0].sectionId;
                selectedCaseDetails.sectionSelected = true;
                selectedCaseDetails.sectionCheckBoxClicked = true;
                selectedCaseDetails.unselectSection = false;
                selectedCaseDetails.selectSection = false;
                selectedCaseDetails.unselectAllCases = true;
                this.selectedSections.emit(selectedCaseDetails);
              }
            }
          }
          else {
            this.isSectionsListPresent = false;
            this.isSectionsPresent = true;
            this.selectedSectionData.emit('none');
            this.selectedSections.emit(null);
          }
          this.testRunSectionList = result;
        })
      })
    ).subscribe();
  }
  ngOnInit() {

    this.getSoftLabelConfigurations();

  }
  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }


  loadSectionsList() {
    let sectionsList = new TestSuiteRunSections();
    sectionsList.testSuiteId = this.testSuiteId;
    sectionsList.testRunId = this.testRunId;
    sectionsList.isSectionsRequired = false;
    sectionsList.includeRunCases = true;
    this.store.dispatch(new LoadTestSuiteSectionListForRunsTriggered(sectionsList));
    this.testRunSectionList$ = this.store.pipe(select(testSuiteSectionModuleReducer.getTestSuiteSectionListForRuns));
  }

  getSelectedSectionData(data) {
    this.selectedSectionData.emit(data);
    this.cdRef.detectChanges();
  }

  getSelectedSectionId(data) {
    this.selectedSections.emit(data);
    this.cdRef.detectChanges();
  }

  getSectionCasesCount(value) {
    this.sectionCasesCount.emit(value);
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}