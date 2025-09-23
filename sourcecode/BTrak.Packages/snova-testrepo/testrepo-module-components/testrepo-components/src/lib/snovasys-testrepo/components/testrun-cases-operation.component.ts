import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef } from "@angular/core";
import { Observable } from 'rxjs';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import 'rxjs/add/operator/take';
import { Subject } from 'rxjs';

import "../../globaldependencies/helpers/fontawesome-icons";

import { TestCase } from "../models/testcase";

import { State } from "../store/reducers/index";
import * as testRailModuleReducer from "../store/reducers/index";

import { TestCaseActionTypes, LoadSingleTestRunCaseBySectionIdTriggered } from '../store/actions/testcaseadd.actions';
import { TestCaseDropdownList } from "../models/testcasedropdown";
import { LoadTestCaseStatusListTriggered } from "../store/actions/testcaseStatuses.actions";

@Component({
  selector: "testrun-cases-operation",
  templateUrl: "./testrun-cases-operation.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .testrun-status-preview {
        height: calc(100vh - 105px) !important;
    }

    .testrun-preview-screen {
        height: calc(100vh - 156px);
        overflow-x: hidden !important;
    }
    `]
})

export class TestRunCasesOperationComponent {
  @Output() closePreview = new EventEmitter<any>();
  @Output() caseStatusPreviewDetails = new EventEmitter<any>();

  @Input("testCaseDetails")
  set _testCaseDetails(data: any) {
    if (data) {
      this.caseDetails = data;
      this.caseBugsCount = this.caseDetails.bugsCount;
      this.loadCaseDetails(this.caseDetails);
      this.getAllCases();
    }
  }

  @Input("projectId")
  set _projectId(data: string) {
    if (data)
      this.projectId = data;
  }

  @Input("testRunId")
  set _testRunId(data: string) {
    if (data)
      this.testRunId = data;
  }

  @Input("testRunCompleted")
  set _testRunCompleted(data: boolean) {
    if (data || data == false)
      this.testRunCompleted = data;
  }

  @Input("isHierarchical")
  set _isHierarchical(data: boolean) {
    if (data || data == false) {
      this.isHierarchical = data;
    }
  }

  testCases$: Observable<TestCase[]>;
  allTestCases$: Observable<TestCase[]>;
  testCaseStatusList$: Observable<TestCaseDropdownList[]>;
  testCaseDetails$: Observable<TestCase>;
  anyOperationInProgress$: Observable<boolean>

  public ngDestroyed$ = new Subject();

  allTestCases = [];
  caseDetails: any;
  singleTestRunCaseDetails: any;
  position: any;
  dropDownList: TestCaseDropdownList;
  statusList: TestCaseDropdownList[];
  projectId: string;
  testRunId: string;
  caseBugsCount: number = 0;
  testRunCompleted: boolean = false;
  loadDetails: boolean = false;
  isHierarchical: boolean = false;
  loadCasesDetails: boolean = true;

  constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
    this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getSingleTestRunCaseDetailsLoading));
    this.getStatuses();
    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCaseBySectionAndRunIdAfterStatusTriggered),
      tap(() => {
        this.loadDetails = false;
        this.cdRef.markForCheck();
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCaseBySectionAndRunIdAfterStatusCompleted),
      tap(() => {
        this.loadDetails = true;
        this.cdRef.markForCheck();
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadSingleTestRunCaseBySectionIdCompleted),
      tap(() => {
        this.testCaseDetails$.subscribe(result => {
          if (result) {
            this.singleTestRunCaseDetails = result;
            this.caseBugsCount = this.singleTestRunCaseDetails.bugsCount;
            this.loadDetails = true;
            this.cdRef.markForCheck();
          }
        })
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCaseBySectionAndRunIdAfterBugStatusCompleted),
      tap((result: any) => {
        if (result && result.searchCaseAfterStatusDetails) {
          let data = result.searchCaseAfterStatusDetails;
          this.caseBugsCount = data.bugsCount;
          this.cdRef.markForCheck();
        }
      })
    ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestCaseActionTypes.TestCaseStatusEditWithInPlaceUpdateForStatus),
        tap(() => {
          this.testCases$ = this.store.pipe(select(testRailModuleReducer.getTestRunStatusCasesByTestCaseId, { testCaseId: this.caseDetails.testCaseId }));
          this.testCases$.take(1).subscribe(result => {
            if (result && result.length > 0) {
              let caseData = result[0];
              this.loadCasesDetails = false;
              this.cdRef.detectChanges();
              this.singleTestRunCaseDetails = caseData;
              this.loadCasesDetails = true;
              this.caseBugsCount = this.singleTestRunCaseDetails.bugsCount;
              this.cdRef.detectChanges();
            }
          })
        })
      ).subscribe();
  }

  loadCaseDetails(caseDetails) {
    let testCaseSearch = new TestCase();
    testCaseSearch.testRunId = caseDetails.testRunId;
    testCaseSearch.testCaseId = caseDetails.testCaseId;
    testCaseSearch.sectionId = caseDetails.sectionId;
    testCaseSearch.isArchived = false;
    this.store.dispatch(new LoadSingleTestRunCaseBySectionIdTriggered(testCaseSearch));
    this.testCaseDetails$ = this.store.pipe(select(testRailModuleReducer.getSingleTestRunCaseDetailsByCaseId));
  }

  getAllCases() {
    this.allTestCases$ = this.store.pipe(select(testRailModuleReducer.getTestCasesInRunsAfterStatusAll));
    this.allTestCases$.subscribe((result: any) => {
      this.allTestCases = result;
      this.cdRef.markForCheck();
    });
  }

  onTabSelect(event) { }

  closeTestCaseDialog() {
    this.closePreview.emit('');
  }

  getStatuses() {
    this.dropDownList = new TestCaseDropdownList();
    this.dropDownList.isArchived = false;
    this.store.dispatch(new LoadTestCaseStatusListTriggered(this.dropDownList));
    this.testCaseStatusList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseStatusAll),
      tap(result => {
        if (result) {
          this.statusList = result;
          this.cdRef.markForCheck();
        }
      }));
  }

  goToPrevious(sectionId, testCaseId) {
    if (this.isHierarchical == false) {
      let index = this.allTestCases.findIndex(x => x.testCaseId.toLowerCase() == testCaseId.toLowerCase());
      if (index > 0) {
        let caseData = this.allTestCases[index - 1];
        let passingdata = {
          caseData: caseData,
          projectId: this.projectId,
          testRunId: this.testRunId,
          testRunCompleted: this.testRunCompleted
        }
        this.caseStatusPreviewDetails.emit(passingdata);
      }
    }
    else {
      let sectionCases = this.allTestCases.filter(function (x) {
        return x.sectionId.toLowerCase() == sectionId.toLowerCase();
      });
      let index = sectionCases.findIndex(x => x.testCaseId.toLowerCase() == testCaseId.toLowerCase());
      if (index > 0) {
        let caseData = sectionCases[index - 1];
        let passingdata = {
          caseData: caseData,
          projectId: this.projectId,
          testRunId: this.testRunId,
          testRunCompleted: this.testRunCompleted
        }
        this.caseStatusPreviewDetails.emit(passingdata);
      }
    }
  }

  goToNext(sectionId, testCaseId) {
    if (this.isHierarchical == false) {
      let index = this.allTestCases.findIndex(x => x.testCaseId.toLowerCase() == testCaseId.toLowerCase());
      if (index != -1 && index != this.allTestCases.length - 1) {
        let caseData = this.allTestCases[index + 1];
        let passingdata = {
          caseData: caseData,
          projectId: this.projectId,
          testRunId: this.testRunId,
          testRunCompleted: this.testRunCompleted
        }
        this.caseStatusPreviewDetails.emit(passingdata);
      }
    }
    else {
      let sectionCases = this.allTestCases.filter(function (x) {
        return x.sectionId.toLowerCase() == sectionId.toLowerCase();
      });
      let index = sectionCases.findIndex(x => x.testCaseId.toLowerCase() == testCaseId.toLowerCase());
      if (index != -1 && index != sectionCases.length - 1) {
        let caseData = sectionCases[index + 1];
        let passingdata = {
          caseData: caseData,
          projectId: this.projectId,
          testRunId: this.testRunId,
          testRunCompleted: this.testRunCompleted
        }
        this.caseStatusPreviewDetails.emit(passingdata);
      }
    }
  }
}
