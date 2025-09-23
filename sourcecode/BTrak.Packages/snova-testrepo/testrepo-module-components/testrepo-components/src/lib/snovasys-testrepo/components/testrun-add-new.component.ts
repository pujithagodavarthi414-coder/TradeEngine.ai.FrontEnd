import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { State } from "../store/reducers/index";
import { LoadTestRunTriggered, TestRunActionTypes } from "../store/actions/testrun.actions";
import { LoadTestRunUsersListTriggered } from "../store/actions/testrunusers.actions";
import { LoadMileStoneDropdownListTriggered } from "../store/actions/milestonedropdown.actions";
import { TestSuiteSectionActionTypes } from "../store/actions/testsuitesection.actions";
import { TestCaseActionTypes } from "../store/actions/testcaseadd.actions";

import * as testRailModuleReducer from "../store/reducers/index";

import { TestRun } from "../models/testrun";
import { TestCaseDropdownList } from "../models/testcasedropdown";
import { TestCaseRunDetails } from "../models/testcaserundetails";
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { GoogleAnalyticsService } from '../services/google-analytics.service';

@Component({
  selector: "testrun-add-new",
  templateUrl: "./testrun-add-new.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunAddNewComponent {
  @Output() closeTestRun = new EventEmitter<string>();
  @Output() updatedDescription = new EventEmitter<any>();
  @Output() updatedId = new EventEmitter<string>();
  @Output() editedRunData = new EventEmitter<any>();

  softLabels: SoftLabelConfigurationModel[];

  @Input("editTestRunData")
  set _editTestRunData(data: any) {
    if (data) {
      this.editTestRun = true;
      this.editData = data;
      this.loadMileStonesList(data.projectId);
      this.loadUsersList(data.projectId);
      this.testSuiteName = data.testSuiteName;
      this.testSuiteId = data.testSuiteId;
      this.testRunId = data.testRunId;
      if (this.editData.isIncludeAllCases) {
        this.disableTestRun = false;
        this.isCompleted = false;
        this.specificCasesIncluded = false;
      }
      else {
        this.unselectCasesCount = 1;
        this.disableTestRun = true;
        this.isCompleted = true;
        this.specificCasesIncluded = true;
      }
      this.initializeTestRunAddForm();
      this.addTestRunForm.patchValue(data);
    }
  }

  @Input("selectedTestSuite")
  set _selectedTestSuite(data: any) {
    if (data.value) {
      this.editTestRun = false;
      this.testSuiteName = data.value.testSuiteName;
      this.testSuiteId = data.value.testSuiteId;
      this.initializeTestRunAddForm();
    }
  }

  @Input("selectedTestSuiteIdForRun")
  set _selectedTestSuiteIdForRun(data: any) {
    if (data) {
      this.editTestRun = false;
      this.testSuiteId = data;
    }
  }

  @Input("selectedTestSuiteNameForRun")
  set _selectedTestSuiteNameForRun(data: any) {
    if (data) {
      this.editTestRun = false;
      this.testSuiteName = data;
      this.initializeTestRunAddForm();
    }
  }

  @Input("projectId")
  set _projectId(data: string) {
    if (data) {
      this.projectId = data;
      this.loadMileStonesList(this.projectId);
      this.loadUsersList(this.projectId);
    }
  }

  public ngDestroyed$ = new Subject();

  usersList$: Observable<TestCaseDropdownList[]>;
  mileStoneDropdownList$: Observable<TestCaseDropdownList[]>;

  addTestRunForm: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  testRun: TestRun;

  projectId: string;
  testSuiteId: string;
  testRunId: string;

  selectedTestCases = [];
  selectedSections = [];
  sectionCasesCounts = [];
  editData: any;
  testSuiteName: string = null;
  isLinear: boolean = false;
  disableTestRun: boolean = false;
  editTestRun: boolean = false;
  isCompleted: boolean = false;
  removeStorage: boolean = false;
  showSelectAllNone: boolean = false;
  specificCasesIncluded: boolean = false;
  expandAll: boolean = false;
  sectionSelected: string;
  unselectCasesCount: number = 0;
  specificCasesSelected: number = 0;
  sectionData: any;
  selectedSectionIdData: any;
  unselectSectionId: any;
  sectionToCheck: any;
  selectAllNone: any;
  filteredCasesData: any;

  constructor(private _formBuilder: FormBuilder, private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef,
    public googleAnalyticsService: GoogleAnalyticsService) {
    this.initializeTestRunAddForm();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestRunActionTypes.LoadTestRunByIdCompleted),
        tap(() => {
          localStorage.removeItem('selectedTestCases');
          localStorage.removeItem('selectedSections');
          localStorage.removeItem('reportTestRunName');
          this.cancelTestRun();
          let runData = {
            testRunName: this.addTestRunForm.value.testRunName,
            description: this.addTestRunForm.value.description
          }
          this.updatedDescription.emit(runData);
          if (this.testRun.testRunId != undefined)
            this.updatedId.emit(this.testRun.testRunId);
          this.disableTestRun = false;
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestRunActionTypes.TestRunFailed),
        tap(() => {
          this.disableTestRun = false;
          this.cdRef.detectChanges();
        })
      ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCasesBySectionIdForRunsTriggered),
      tap(() => {
        this.unselectSectionId = null;
        this.sectionData = null;
        this.cdRef.detectChanges();
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCasesBySectionIdForRunsCompleted),
      tap(() => {
        this.unselectSectionId = null;
        this.cdRef.detectChanges();
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionListForRunsTriggered),
      tap(() => {
        this.sectionSelected = null;
        this.showSelectAllNone = false;
        this.cdRef.detectChanges();
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionListForRunsCompleted),
      tap(() => {
        this.selectAllNone = null;
        this.showSelectAllNone = true;
        this.cdRef.detectChanges();
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCasesBySectionIdForRunsTriggered),
      tap(() => {
        if (localStorage.getItem('selectedSectionFilter') != null && localStorage.getItem('selectedSectionFilter') != undefined) {
          let sectionData = JSON.parse(localStorage.getItem('selectedSectionFilter'));
          this.sectionSelected = sectionData.sectionId;
          let selectedCaseDetails = new TestCaseRunDetails();
          selectedCaseDetails.sectionId = sectionData.sectionId;
          let selectedSections = [];
          selectedSections = JSON.parse(localStorage.getItem('selectedSections'));
          if (selectedSections && selectedSections.length > 0 && selectedSections.indexOf(sectionData.sectionId) != -1)
            selectedCaseDetails.sectionSelected = true;
          else
            selectedCaseDetails.sectionSelected = false;
          selectedCaseDetails.sectionCheckBoxClicked = false;
          selectedCaseDetails.unselectSection = false;
          selectedCaseDetails.selectSection = false;
          selectedCaseDetails.unselectAllCases = false;
          selectedCaseDetails.sectionsAllNone = false;
          this.selectedSectionIdData = selectedCaseDetails;
          let section = {
            sectionId: sectionData.sectionId,
            sectionName: sectionData.value
          }
          this.sectionData = section;
          this.cdRef.detectChanges();
        }
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCasesByFilterForRunsCompleted),
      tap((result: any) => {
        if (result && result.filteredCasesForRuns && result.filteredCasesForRuns.length > 0) {
          this.selectedTestCases = [];
          this.selectedSections = [];
          let filteredCases = [];
          filteredCases = result.filteredCasesForRuns;
          filteredCases.forEach(x => {
            this.selectedTestCases.push(x);
            if (x.isChecked && this.selectedSections.indexOf(x.sectionId) == -1)
              this.selectedSections.push(x.sectionId);
          });
          if (this.selectedSections.length > 0)
            localStorage.setItem('selectedSections', JSON.stringify(this.selectedSections));
          else
            localStorage.removeItem('selectedSections');
          localStorage.setItem('selectedTestCases', JSON.stringify(this.selectedTestCases));
          this.filteredCasesData = this.selectedTestCases;
          this.sectionToCheck = null;
          this.unselectSectionId = null;
          this.selectAllNone = null;
          this.cdRef.markForCheck();
        }
        else if (result.filteredCasesForRuns.length == 0) {
          this.selectAllNone = false;
          this.selectedTestCases = [];
          localStorage.removeItem('selectedTestCases');
          this.selectedSections = [];
          localStorage.removeItem('selectedSections');
          this.filteredCasesData = [];
          this.cdRef.markForCheck();
        }
      })
    ).subscribe();
  }

  ngOnInit() {
    this.getSoftLabelConfigurations();
    this.firstFormGroup = this._formBuilder.group({ firstCtrl: ["", Validators.required] });
    this.secondFormGroup = this._formBuilder.group({ secondCtrl: ["", Validators.required] });
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  loadMileStonesList(projectId) {
    this.store.dispatch(new LoadMileStoneDropdownListTriggered(projectId));
    this.mileStoneDropdownList$ = this.store.pipe(select(testRailModuleReducer.getMileStoneDropdownList));
  }

  loadUsersList(projectId) {
    this.store.dispatch(new LoadTestRunUsersListTriggered(projectId));
    this.usersList$ = this.store.pipe(select(testRailModuleReducer.getTestRunUserAll));
  }

  addNewTestRun() {
    this.disableTestRun = true;
    this.checkForDuplicateSectionCases();
    this.testRun = new TestRun();
    this.testRun = this.addTestRunForm.value;
    this.testRun.projectId = this.projectId;
    this.testRun.testSuiteId = this.testSuiteId;
    this.testRun.selectedCases = this.selectedTestCases;
    this.testRun.selectedSections = this.selectedSections;
    if (this.editTestRun) {
      let editedTestRun = new TestRun();
      editedTestRun.testRunId = this.editData.testRunId;
      editedTestRun.testSuiteId = this.editData.testSuiteId;
      editedTestRun.isIncludeAllCases = this.testRun.isIncludeAllCases;
      editedTestRun.isCompleted = this.testRun.isCompleted;
      this.editedRunData.emit(editedTestRun);
      this.testRun.projectId = this.editData.projectId;
      this.testRun.testRunId = this.editData.testRunId;
      this.testRun.timeStamp = this.editData.timeStamp;
      this.googleAnalyticsService.eventEmitter("Test Management", "Updated Run", this.testRun.testRunName, 1);
    }
    else
      this.googleAnalyticsService.eventEmitter("Test Management", "Created Run", this.testRun.testRunName, 1);
    this.store.dispatch(new LoadTestRunTriggered(this.testRun));
  }

  checkForDuplicateSectionCases() {
    this.selectedSections.forEach(x => {
      this.removeTestCasesBySectionId(x);
    });
  }

  cancelTestRun() {
    localStorage.removeItem('selectedTestCases');
    localStorage.removeItem('selectedSections');
    this.selectedTestCases = [];
    this.selectedSections = [];
    this.sectionCasesCounts = [];
    this.removeStorage = false;
    this.closeTestRun.emit("");
  }

  initializeTestRunAddForm() {
    this.addTestRunForm = new FormGroup({
      testRunName: new FormControl(this.testSuiteName, Validators.compose([Validators.required, Validators.maxLength(150)])),
      milestoneId: new FormControl("", []),
      assignToId: new FormControl("", []),
      description: new FormControl("", Validators.compose([Validators.maxLength(300)])),
      isIncludeAllCases: new FormControl(true, []),
      isCompleted: new FormControl(false, [])
    });
  }

  getSelectedSectionData(data) {
    this.sectionData = data;
    this.sectionSelected = data.sectionId;
    this.cdRef.detectChanges();
  }

  getSelectedSectionId(value) {
    if (value && value.selectSection) {
      this.selectedSections.push(value.sectionId);
      localStorage.setItem('selectedSections', JSON.stringify(this.selectedSections));
      this.sectionToCheck = null;
      this.unselectSectionId = null;
      this.selectAllNone = null;
      this.cdRef.detectChanges();
    }
    if (value && value.unselectAllCases) {
      this.removeTestCasesBySectionId(value.sectionId);
      this.selectedSectionIdData = value;
      this.unselectSectionId = null;
      this.sectionToCheck = null;
      this.selectAllNone = null;
      this.cdRef.detectChanges();
    }
    if (value && value.sectionsAllNone) {
      let index = this.selectedSections.indexOf(value.sectionId);
      if (index == -1) {
        this.selectedSections.push(value.sectionId);
        this.sectionToCheck = null;
      }
      else {
        this.selectedSections.splice(index, 1);
        this.removeTestCasesBySectionId(value.sectionId);
      }
      localStorage.setItem('selectedSections', JSON.stringify(this.selectedSections));
      this.unselectSectionId = null;
      this.cdRef.detectChanges();
    }
    if (value && (value.unselectAllCases == undefined || value.unselectAllCases == false) && value.sectionCheckBoxClicked) {
      let index = this.selectedSections.indexOf(value.sectionId);
      if (index == -1) {
        this.selectedSections.push(value.sectionId);
        this.sectionToCheck = null;
      }
      else {
        this.selectedSections.splice(index, 1);
        this.removeTestCasesBySectionId(value.sectionId);
      }
      localStorage.setItem('selectedSections', JSON.stringify(this.selectedSections));
      this.selectedSectionIdData = value;
      this.unselectSectionId = null;
      this.selectAllNone = null;
      this.cdRef.detectChanges();
    }
    else {
      this.selectedSectionIdData = value;
      this.selectAllNone = null;
      this.cdRef.detectChanges();
    }
    if (value && value.unselectSection) {
      let index = this.selectedSections.indexOf(value.sectionId);
      this.selectedSections.splice(index, 1);
      localStorage.setItem('selectedSections', JSON.stringify(this.selectedSections));
      this.unselectSectionId = null;
      this.selectAllNone = null;
      this.cdRef.detectChanges();
    }
  }

  removeTestCasesBySectionId(sectionId) {
    let i = -1;
    while ((i = this.selectedTestCases.findIndex(x => x.sectionId == sectionId)) != -1) {
      let index = this.selectedTestCases.findIndex(x => x.sectionId == sectionId);
      this.selectedTestCases.splice(index, 1);
    }
    localStorage.setItem('selectedTestCases', JSON.stringify(this.selectedTestCases));
  }

  selectingAll() {
    this.selectAllNone = true;
    this.cdRef.markForCheck();
  }

  selectingNone() {
    this.selectAllNone = false;
    this.selectedTestCases = [];
    localStorage.removeItem('selectedTestCases');
    this.selectedSections = [];
    localStorage.removeItem('selectedSections');
    this.cdRef.markForCheck();
  }

  getSectionsData(data) {
    this.selectedSections = [];
    for (let i = 0; i < data.length; i++) {
      this.selectedSections.push(data[i].sectionId);
      if (data[i].subSections && data[i].subSections.length > 0) {
        this.recursiveSelectSections(data[i].subSections);
      }
    }
    localStorage.setItem('selectedSections', JSON.stringify(this.selectedSections));
  }

  recursiveSelectSections(subSectionsList) {
    for (let i = 0; i < subSectionsList.length; i++) {
      this.selectedSections.push(subSectionsList[i].sectionId);
      if (subSectionsList[i].subSections && subSectionsList[i].subSections.length > 0) {
        this.recursiveSelectSections(subSectionsList[i].subSections);
      }
    }
  }

  getSectionCasesData(data) {
    this.selectedTestCases = [];
    for (let i = 0; i < data.length; i++) {
      let selectedCaseDetails = new TestCaseRunDetails();
      selectedCaseDetails.testCaseId = data[i].testCaseId;
      selectedCaseDetails.sectionId = data[i].sectionId;
      this.selectedTestCases.push(selectedCaseDetails);
    }
    localStorage.setItem('selectedTestCases', JSON.stringify(this.selectedTestCases));
  }

  getCasesSelected(value) {
    if (value != undefined && value && value.length > 0 && this.unselectCasesCount <= 1) {
      this.selectedTestCases = [];
      for (let i = 0; i < value.length; i++) {
        let selectedCaseDetails = new TestCaseRunDetails();
        selectedCaseDetails.testCaseId = value[i].testCaseId;
        selectedCaseDetails.sectionId = value[i].sectionId;
        this.selectedTestCases.push(selectedCaseDetails);
      }
      localStorage.setItem('selectedTestCases', JSON.stringify(this.selectedTestCases));
    }
    if (this.removeStorage == true) {
      this.selectedTestCases = [];
      localStorage.removeItem('selectedTestCases');
      this.selectedSections = [];
      localStorage.removeItem('selectedSections');
    }
    this.disableTestRun = false;

    this.checkSpecificCasesSelected();
  }

  getSectionsSelected(value) {
    if (value != undefined && value && value.length > 0 && this.unselectCasesCount <= 1) {
      this.selectedSections = [];
      for (let i = 0; i < value.length; i++) {
        this.selectedSections.push(value[i]);
      }
      localStorage.setItem('selectedSections', JSON.stringify(this.selectedSections));
    }
    if (this.removeStorage == true) {
      this.selectedTestCases = [];
      localStorage.removeItem('selectedTestCases');
      this.selectedSections = [];
      localStorage.removeItem('selectedSections');
    }
    this.disableTestRun = false;
  }

  getListOfTestCases(value) {
    let index = this.selectedTestCases.findIndex(x => x.testCaseId == value.testCaseId);
    if (index == -1) {
      this.selectedTestCases.push(value);
    }
    else {
      this.selectedTestCases.splice(index, 1);
    }
    localStorage.setItem('selectedTestCases', JSON.stringify(this.selectedTestCases));
    this.unselectSectionId = null;
    this.selectAllNone = null;
    this.cdRef.detectChanges();
  }

  getListOfTestCasesAllNone(value) {
    let index = this.selectedTestCases.findIndex(x => x.testCaseId == value.testCaseId);
    if (index == -1) {
      this.selectedTestCases.push(value);
    }
    else {
      this.selectedTestCases.splice(index, 1);
    }
    localStorage.setItem('selectedTestCases', JSON.stringify(this.selectedTestCases));
    this.unselectSectionId = null;
    this.cdRef.detectChanges();
  }

  getUnselectedSection(value) {
    this.unselectSectionId = value;
    this.cdRef.detectChanges();
  }

  getSectionTocheck(value) {
    this.sectionToCheck = value;
    this.cdRef.detectChanges();
  }

  selectAllCases() {
    this.specificCasesIncluded = false;
    this.isCompleted = false;
    this.removeStorage = false;
    this.disableTestRun = false;
  }

  unSelectAllCases() {
    this.specificCasesIncluded = true;
    this.sectionData = null;
    this.selectedSectionIdData = null;
    this.isCompleted = true;
    this.unselectCasesCount = this.unselectCasesCount + 1;
    if (this.editTestRun && this.unselectCasesCount <= 1)
      this.removeStorage = true;
    else
      this.removeStorage = false;
    this.checkSpecificCasesSelected();
  }

  getSectionCasesCount(value) {
    let index = this.sectionCasesCounts.findIndex(x => x.sectionId == value.sectionId);
    if (index == -1) {
      this.sectionCasesCounts.push(value);
    }
    else {
      this.sectionCasesCounts[index].casesCount = value.casesCount;
    }
  }

  checkSpecificCasesSelected() {
    if (this.editTestRun && this.unselectCasesCount <= 1 && this.sectionCasesCounts.length == 0) {
      if (localStorage.getItem('selectedTestCases') != 'undefined' && localStorage.getItem('selectedTestCases') != null) {
        let cases = JSON.parse(localStorage.getItem('selectedTestCases'));
        this.specificCasesSelected = cases.length;
        this.cdRef.markForCheck();
      }
      else {
        this.specificCasesSelected = 0;
        this.cdRef.markForCheck();
      }
    }
    else if (this.unselectCasesCount > 0) {
      if (this.sectionCasesCounts.length > 0) {
        let count = 0;
        this.sectionCasesCounts.forEach(x => {
          count = count + x.casesCount;
        });
        this.specificCasesSelected = count;
        this.cdRef.markForCheck();
      }
      else {
        this.specificCasesSelected = 0;
        this.cdRef.markForCheck();
      }
    }
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}