import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, OnInit, ViewChild, Output, EventEmitter, ViewChildren } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SatPopover } from "@ncstate/sat-popover";

import { LoadTestCasesBySectionAndRunIdTriggered, TestCaseActionTypes, LoadMultipleTestRunResultTriggered, LoadTestCaseViewTriggered } from '../store/actions/testcaseadd.actions';
import { LoadTestRunUsersListTriggered } from "../store/actions/testrunusers.actions";
import { LoadTestCaseStatusListTriggered } from "../store/actions/testcaseStatuses.actions";
import { TestSuiteSectionActionTypes } from "../store/actions/testsuitesection.actions";

import * as testRailModuleReducer from "../store/reducers/index";

import { TestCase } from "../models/testcase";
import { TestCaseDropdownList } from "../models/testcasedropdown";
import { TestCaseRunDetails } from "../models/testcaserundetails";
import { UpdateMultiple } from "../models/updatemultiple";
import { TestSuiteCases } from "../models/testsuitesection";

import { ConstantVariables } from '../constants/constant-variables';
import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { TimeConfiguration } from '../models/time-configuration-model';
import { MaterSettingService } from '../services/master-setting.services';
import { CompanysettingsModel } from '../models/company-model';

const failedStatusId = ConstantVariables.FailedStatusId;
const failedStatusShortName = ConstantVariables.FailedStatusShortName;

@Component({
  selector: "testrun-section-cases-view",
  templateUrl: "./testrun-section-cases-view.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunSectionCasesViewComponent extends CustomAppFeatureBaseComponent implements OnInit {
  @ViewChild("updateAssigneePopover") updateAssigneesPopover: SatPopover;
  @ViewChild("updateStatusPopover") updateStatusesPopover: SatPopover;
  @ViewChildren('addBugPopover') addBugsPopover;
  @Output() caseStatusPreviewDetails = new EventEmitter<any>();
  @Input() projectId: string;

  softLabels: SoftLabelConfigurationModel[];

  @Input("loadSections")
  set _loadSections(data: boolean) {
    if (data != null && data != undefined)
      this.sectionsLoaded = data;
  }

  @Input("typeOfRun")
  set _typeOfRun(data) {
    if (data) {
      this.runStatus = data;
    }
  }
  runStatus: string;

  @Input("selectedTestSuiteId")
  set _selectedTestSuiteId(data: string) {
    if (data)
      this.testSuiteId = data;
  }

  @Input("selectedTestRunId")
  set _selectedTestRunId(data: string) {
    if (data)
      this.testRunId = data;
  }

  @Input("testRunCompleted")
  set _testRunCompleted(data: boolean) {
    if (data || data == false)
      this.testRunCompleted = data;
  }

  @Input("selectedTestRunDescription")
  set _selectedTestRunDescription(data: any) {
    if (data) {
      this.runDescription = data.description;
      this.runName = data.testRunName;
      this.visibleDescription = true;
    }
  }

  @Input("selectedSectionData")
  set _selectedSectionData(data: any) {
    if (data == '' || data == null || data == undefined) {
      this.sectionData = data;
      this.isSectionDataPresent = false;
      this.isSectionsPresent = true;
      this.cdRef.markForCheck();
    }
    else {
      this.sectionData = data;
      this.isSectionDataPresent = true;
      this.isSectionsPresent = false;
      if (this.isHierarchical) {
        this.hierarchicalSectionsData = data;
      }
      this.loadTestCases();
      // this.filterOpen = false;
      this.cdRef.markForCheck();
    }
  }

  @Input("sectionTemporaryData")
  set _sectionTemporaryData(data: any) {
    if (data) {
      this.sectionData = data;
      this.filterOpen = false;
      this.cdRef.markForCheck();
    }
  }

  @Input("isHierarchical")
  set _isHierarchical(data: boolean) {
    if (data || data == false) {
      this.isHierarchical = data;
      this.filterOpen = false;
      this.openFilter = false;
      localStorage.removeItem('selectedCasesFilter');
    }
  }

  @Input("selectedCase")
  set _selectedCase(data: any) {
    if (data) {
      this.testCaseFromPreview = data;
      this.cdRef.detectChanges();
      this.handleClick(data);
    }
    else {
      this.testCaseFromPreview = null;
      this.cdRef.detectChanges();
    }
  }

  public initSettings = {
    plugins: "paste,lists advlist",
    //powerpaste_allow_local_images: true,
    //powerpaste_word_import: 'prompt',
    //powerpaste_html_import: 'prompt',
    toolbar: 'link image code',
    max_height: 150
  };

  testCases$: Observable<TestCase[]>;
  testRunSectionList$: Observable<TestSuiteCases>;
  usersList$: Observable<TestCaseDropdownList[]>;
  statusList$: Observable<TestCaseDropdownList[]>;
  anyOperationInProgress$: Observable<boolean>;

  public ngDestroyed$ = new Subject();

  testCaseSearch: TestCase;
  selection: any;
  testCaseFromPreview: any;
  configurations: TimeConfiguration[];

  assignToForm: FormGroup;
  statusForm: FormGroup;

  projectsId: string;
  runDescription: string;
  runName: string;
  testSuiteId: string;
  testRunId: string;
  selectedCaseId: string;
  sectionId: string;
  sectionName: string;
  sectionDescription: string;
  caseViewFieldName: string = ConstantVariables.CaseViewFieldName;
  caseViewConfigurationId: string = ConstantVariables.CaseViewConfigurationId;
  casesCount: number = 0;
  hierarchicalOccurence: number = 0;
  casesSelected = [];
  visibleDescription: boolean = false;
  sectionsLoaded: boolean = false;
  isSectionDataPresent: boolean = false;
  isSectionsPresent: boolean = false;
  isTestSuiteOrNot: boolean = false;
  isAnyOfCasesSelected: boolean = false;
  isMultiCasesSelected: boolean = false;
  disableUpdate: boolean = false;
  loadAssignForm: boolean = false;
  loadStatusForm: boolean = false;
  filterOpen: boolean = false;
  openFilter: boolean = false;
  sectionData: any;
  hierarchicalSectionsData: any;
  multipleSectionsData: any;
  testRunCompleted: boolean = false;
  isHierarchical: boolean = false;
  loadHierarchicalCases: boolean = false;
  casesFilter: boolean = false;
  totalEstimate: number = 0;
  isCaseFailed: boolean = false;
  loadBug: boolean = false;
  isBugBoardEnable: boolean;
  isBugFromTestRail: boolean = true;
  isBugFromUserStory: boolean = false;
  statusFailedId: string = failedStatusId;
  statusFailedShortName: string = failedStatusShortName;
  selectedTestCase: any = [];

  constructor(private store: Store<State>, private route: ActivatedRoute, private actionUpdates$: Actions,
    private cdRef: ChangeDetectorRef, private masterSettingsService: MaterSettingService) {
    super();

    this.route.params.subscribe(routeParams => {
      this.projectsId = routeParams.id;
    });

    this.clearAssignToForm();
    this.clearStatusForm();

    this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getTestCasesBySectionAndRunIdForRunsLoading));
    this.selectedCaseId = null;
    this.store.dispatch(new LoadTestRunUsersListTriggered(this.projectsId));

    let dropDownList = new TestCaseDropdownList();
    dropDownList.isArchived = false;
    this.store.dispatch(new LoadTestCaseStatusListTriggered(dropDownList));

    this.testRunSectionList$ = this.store.pipe(select(testRailModuleReducer.getTestRunSectionList));

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCasesBySectionAndRunIdTriggered),
      tap(() => {
        this.loadHierarchicalCases = false;
        this.testCaseFromPreview = null;
        this.selectedCaseId = null;
        if (this.hierarchicalOccurence == 0) {
          if (localStorage.getItem('selectedSectionFilter') != null && localStorage.getItem('selectedSectionFilter') != undefined) {
            this.hierarchicalOccurence = this.hierarchicalOccurence + 1;
            let sectionData = JSON.parse(localStorage.getItem('selectedSectionFilter'));
            if (!sectionData.isHierarchical) {
              this.sectionName = sectionData.value;
              this.sectionDescription = sectionData.description;
              this.sectionId = sectionData.sectionId;
              this.cdRef.detectChanges();
            }
            else if (sectionData.isHierarchical && this.hierarchicalSectionsData) {
              let sectionId = sectionData.sectionId;
              let sectionsData = this.checkSubData(this.multipleSectionsData.sections, sectionId);
              this.hierarchicalSectionsData = sectionsData;
              this.cdRef.markForCheck();
            }
            this.casesSelected = [];
            this.selectedTestCase = [];
            localStorage.removeItem('selectedSectionFilter');
          }
          else {
            this.sectionId = null;
            this.sectionName = null;
            this.sectionDescription = null;
            this.casesSelected = [];
            this.selectedTestCase = [];
            if (this.isHierarchical && this.hierarchicalSectionsData) {
              let sectionId = this.hierarchicalSectionsData.sectionId;
              let sectionData = this.checkSubData(this.multipleSectionsData.sections, sectionId);
              this.hierarchicalSectionsData = sectionData;
            }
            this.cdRef.markForCheck();
          }
        }
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestSuiteSectionActionTypes.LoadTestRunSectionListTriggered),
      tap(() => {
        this.openFilter = false;
        localStorage.removeItem('selectedCasesFilter');
        this.cdRef.markForCheck();
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestSuiteSectionActionTypes.LoadTestRunSectionListCompleted),
      tap(() => {
        this.testRunSectionList$.subscribe(result => {
          this.multipleSectionsData = result;
        })
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadMultipleTestRunResultCompleted),
      tap(() => {
        this.disableUpdate = false;
        if (!this.isHierarchical) {
          this.updateAssigneesPopover.close();
          this.updateStatusesPopover.close();
        }
        this.casesSelected = [];
        this.selectedTestCase = [];
        this.isMultiCasesSelected = false;
        this.isAnyOfCasesSelected = false;
        this.loadAssignForm = false;
        this.loadStatusForm = false;
        this.selection = null;
        this.openFilter = false;
        localStorage.removeItem('selectedCasesFilter');
        this.cdRef.detectChanges();
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCasesBySectionAndRunIdCompleted),
      tap(() => {
        this.testCases$ = this.store.pipe(select(testRailModuleReducer.getTestCasesInRunsAfterStatusAll));
        this.testCases$.subscribe(result => {
          this.casesCount = result.length;
          this.totalEstimateCount(result);
        })
        if (this.isHierarchical)
          this.loadHierarchicalCases = true;
        this.hierarchicalOccurence = 0;
        this.openFilter = true;
        this.cdRef.markForCheck();
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadSingleTestRunCaseBySectionIdTriggered),
      tap(() => {
        this.testCaseFromPreview = null;
        this.cdRef.detectChanges();
      })
    ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestCaseActionTypes.LoadTestCaseFailed),
        tap(() => {
          this.disableUpdate = false;
          this.cdRef.detectChanges();
        })
      ).subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getCompanySettings();
    this.loadTestRailConfigurations();
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  getCompanySettings() {
    var companysettingsModel = new CompanysettingsModel();
    companysettingsModel.isArchived = false;
    this.masterSettingsService.getAllCompanySettingsDetails(companysettingsModel).subscribe((response: any) => {
      if (response.success == true && response.data.length > 0) {
        let companyResult = response.data.filter(item => item.key.trim() == "EnableBugBoard");
        if (companyResult.length > 0) {
          this.isBugBoardEnable = companyResult[0].value == "1" ? true : false;
          this.cdRef.markForCheck();
        }
      }
    });
  }

  loadTestCases() {
    this.isAnyOfCasesSelected = false;
    this.isMultiCasesSelected = false;
    this.selection = null;
    this.testCaseSearch = new TestCase();
    if (localStorage.getItem('selectedCasesFilter') != null && localStorage.getItem('selectedCasesFilter') != undefined) {
      let searchData = JSON.parse(localStorage.getItem('selectedCasesFilter'));
      this.testCaseSearch = Object.assign({}, searchData);
    }
    this.testCaseSearch.sectionId = this.sectionData.sectionId;
    this.testCaseSearch.testRunId = this.testRunId;
    this.testCaseSearch.isArchived = false;
    this.testCaseSearch.isHierarchical = this.isHierarchical;
    this.testCaseSearch.statusId = this.runStatus;
    this.store.dispatch(new LoadTestCasesBySectionAndRunIdTriggered(this.testCaseSearch));
    this.testCases$ = this.store.pipe(select(testRailModuleReducer.getTestCasesInRunsAfterStatusAll));
  }

  handleClick(data) {
    this.selectedCaseId = data.testCaseId;
    // this.selectedTestCase.push(data);
    this.cdRef.markForCheck();
  }

  getCaseSelection(data) {
    let index = this.casesSelected.indexOf(data.testCaseId);
    if (index != -1) {
      this.casesSelected.splice(index, 1);
      this.selectedTestCase.splice(index, 1);
    }
    else {
      this.casesSelected.push(data.testCaseId);
      this.selectedTestCase.push(data);
    }
    if (this.casesSelected.length > 0)
      this.isAnyOfCasesSelected = true;
    else
      this.isAnyOfCasesSelected = false;
  }

  getCasesSelected(data) {
    let index = this.casesSelected.indexOf(data.testCaseId);
    if (index != -1) {
      this.casesSelected.splice(index, 1);
      this.selectedTestCase.splice(index, 1);
    }
    else {
      this.casesSelected.push(data.testCaseId);
      this.selectedTestCase.push(data);
    }
    // if (this.casesSelected.length == this.casesCount)
    //   this.isMultiCasesSelected = true;
    // else
    //   this.isMultiCasesSelected = false;
    if (this.casesSelected.length > 0)
      this.isAnyOfCasesSelected = true;
    else
      this.isAnyOfCasesSelected = false;
    this.selection = null;
  }

  changeStatus(value) {
    this.isMultiCasesSelected = value;
    if (value)
      this.isAnyOfCasesSelected = true;
    else
      this.isAnyOfCasesSelected = false;
    let selections = new TestCaseRunDetails();
    selections.sectionCheckBoxClicked = true;
    selections.sectionSelected = value;
    this.selection = selections;
  }

  openAssigneePopover() {
    this.loadAssignForm = true;
    this.clearAssignToForm();
    this.updateAssigneesPopover.open();
  }

  openStatusPopover() {
    this.loadStatusForm = true;
    this.clearStatusForm();
    this.checkIsFailed(null);
    this.updateStatusesPopover.open();
  }

  closeAssigneePopover() {
    this.updateAssigneesPopover.close();
    this.loadAssignForm = false;
  }

  closeStatusPopover() {
    this.updateStatusesPopover.close();
    this.loadStatusForm = false;
  }

  clearAssignToForm() {
    this.disableUpdate = false;
    this.loadUsersList();
    this.assignToForm = new FormGroup({
      assignToId: new FormControl("", Validators.compose([Validators.required]))
    });
  }

  clearStatusForm() {
    this.disableUpdate = false;
    this.loadStatuses();
    this.statusForm = new FormGroup({
      statusId: new FormControl("", Validators.compose([Validators.required])),
      statusComment: new FormControl("", ([]))
    });
  }

  loadUsersList() {
    this.usersList$ = this.store.pipe(select(testRailModuleReducer.getTestRunUserAll));
  }

  loadStatuses() {
    this.statusList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseStatusAll));
  }

  loadTestRailConfigurations() {
    let configurationModel = new TimeConfiguration();
    configurationModel.isArchived = false;
    this.masterSettingsService.getTimeConfigurationSettings(configurationModel).subscribe((response: any) => {
      if (response.success == true) {
        this.configurations = response.data;
      }
    });
  }

  updateMultipleAssignTo() {
    this.disableUpdate = true;
    let multiple = new UpdateMultiple();
    multiple = this.assignToForm.value;
    multiple.testRunId = this.testRunId;
    multiple.testCaseIds = this.casesSelected;
    if (this.sectionId)
      multiple.sectionId = this.sectionId;
    else
      multiple.sectionId = this.sectionData.sectionId;
    multiple.isHierarchical = this.isHierarchical;
    multiple.hierarchicalSectionId = this.sectionData.sectionId;
    this.store.dispatch(new LoadMultipleTestRunResultTriggered(multiple));
  }

  updateMultipleStatus() {
    this.disableUpdate = true;
    let multiple = new UpdateMultiple();
    multiple = this.statusForm.value;
    multiple.testRunId = this.testRunId;
    multiple.testCaseIds = this.casesSelected;
    if (this.sectionId)
      multiple.sectionId = this.sectionId;
    else
      multiple.sectionId = this.sectionData.sectionId;
    multiple.isHierarchical = this.isHierarchical;
    multiple.hierarchicalSectionId = this.sectionData.sectionId;
    this.store.dispatch(new LoadMultipleTestRunResultTriggered(multiple));
    this.selectedTestCase = [];
  }

  checkSubData(sectionsList, sectionId) {
    for (let i = 0; i < sectionsList.length; i++) {
      if (sectionsList[i].sectionId == sectionId) {
        return sectionsList[i];
      }
      else if (sectionsList[i].subSections && sectionsList[i].subSections.length > 0) {
        let checkSubSections = this.recursivecheckSubData(sectionsList[i].subSections, sectionId);
        if (checkSubSections != undefined && checkSubSections != undefined)
          return checkSubSections;
      }
    }
  }

  recursivecheckSubData(childList, sectionId) {
    for (let i = 0; i < childList.length; i++) {
      if (childList[i].sectionId == sectionId) {
        return childList[i];
      }
      else if (childList[i].subSections && childList[i].subSections.length > 0) {
        let checkSubSections = this.recursivecheckSubData(childList[i].subSections, sectionId);
        if (checkSubSections != undefined && checkSubSections != undefined)
          return checkSubSections;
      }
    }
  }

  getCaseStatusPreviewDetails(data) {
    this.caseStatusPreviewDetails.emit(data);
  }

  totalEstimateCount(data) {
    this.totalEstimate = 0;
    data.forEach((x) => {
      if (x.estimate != null) {
        this.totalEstimate = this.totalEstimate + x.estimate;
      }
    })
  }

  checkIsFailed(value) {
    let testCaseStatusId = value;
    var listVal = [];
    this.statusList$.subscribe((response: any) => listVal = response);
    if (listVal && listVal.length > 0) {
      let index = listVal.findIndex(x => x.id == testCaseStatusId);
      if (index != -1) {
        let selectedCase = listVal[index].statusShortName;
        if (selectedCase) {
          if (selectedCase.toLowerCase() == this.statusFailedShortName.toLowerCase())
            this.isCaseFailed = true;
          else
            this.isCaseFailed = false;
          this.cdRef.markForCheck();
        }
      }
      else {
        this.isCaseFailed = false;
        this.cdRef.markForCheck();
      }
    }
  }

  openBugPopover(addBugPopover) {
    this.loadBug = true;
    addBugPopover.openPopover();
  }


  closeBugPopover() {
    this.loadBug = false;
    this.addBugsPopover.forEach((p) => p.closePopover());
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }

}