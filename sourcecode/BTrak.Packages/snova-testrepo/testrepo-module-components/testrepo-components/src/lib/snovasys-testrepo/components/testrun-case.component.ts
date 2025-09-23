import { Component, ChangeDetectionStrategy, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from "@angular/material/dialog";
import { SatPopover } from "@ncstate/sat-popover";
import * as _ from 'underscore';
import "../../globaldependencies/helpers/fontawesome-icons";

import * as testRailModuleReducer from "../store/reducers/index";

import { TestCaseDropdownList } from "../models/testcasedropdown";
import { UpdateMultiple } from "../models/updatemultiple";
import { TestCase } from "../models/testcase";

import { LoadUpdateTestRunResultTriggered, TestCaseActionTypes, LoadBugsByUserStoryIdTriggered, LoadBugsByTestCaseIdTriggered } from "../store/actions/testcaseadd.actions";

import { ConstantVariables } from '../constants/constant-variables';
import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { MaterSettingService } from '../services/master-setting.services';
import { CompanysettingsModel } from '../models/company-model';

const failedStatusId = ConstantVariables.FailedStatusId;
const failedStatusShortName = ConstantVariables.FailedStatusShortName;

@Component({
  selector: "testrun-case",
  templateUrl: "./testrun-case.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunCaseComponent extends CustomAppFeatureBaseComponent implements OnInit {
  @ViewChildren('scenarioBugsPopover') scenarioBugPopover;
  @ViewChildren("fileUploadPopup") fileUploadPopover;
  @ViewChildren('addBugPopover') addBugsPopover;
  @ViewChild("updateAssigneePopover") updateAssigneesPopover: SatPopover;
  @ViewChild("updateStatusPopover") updateStatusesPopover: SatPopover;
  @ViewChild("testRunCaseTitle") testRunCaseTitleStatus: ElementRef;

  @Output() casesSelected = new EventEmitter<any>();
  @Output() caseSelection = new EventEmitter<any>();
  @Output() caseStatusPreviewDetails = new EventEmitter<any>();
  @Input() caseSelected: boolean;

  @Input("projectId")
  set _projectId(data: string) {
    if (data)
      this.projectsId = data;
  }

  @Input("testRunId")
  set _testRunId(data: string) {
    if (data)
      this.testRunsId = data;
  }

  @Input("caseDetails")
  set _caseDetails(data: any) {
    if (data)
      this.caseDetail = data;
  }

  @Input("allCasesSelect")
  set _allCasesSelect(data: any) {
    if (data && data.sectionCheckBoxClicked && data.sectionSelected && (this.isCaseSelected == false || this.isCaseSelected == undefined))
      this.changeSelectStatus(true);
    else if (data && data.sectionCheckBoxClicked && data.sectionSelected == false && this.isCaseSelected)
      this.changeSelectStatus(false);
  }

  @Input("testRunIsCompleted")
  set testRunIsCompleted(data: boolean) {
    if (data || data == false)
      this.testRunCompleted = data;
  }

  @Input("isBugBoardEnable")
  set _isBugBoardEnable(data: boolean) {
    if (data || data == false)
      this.isBugBoardEnable = data;
    else
      this.isBugBoardEnable = false;
  }

  usersList$: Observable<TestCaseDropdownList[]>;
  usersList: TestCaseDropdownList[];
  statusList$: Observable<TestCaseDropdownList[]>;
  scenarioBugs$: Observable<TestCase[]>;
  anyOperationInProgress$: Observable<boolean>;
  bugsInTestCaseProgress$: Observable<boolean>;
  testRunStatusReferenceTypeId = ConstantVariables.TestRunStatusCommentReferenceTypeId;
  testRunAssigneeReferenceTypeId = ConstantVariables.TestRunAssigneeCommentReferenceTypeId;
  testRunActualResultReferenceTypeId = ConstantVariables.TestRunActualResultReferenceTypeId;
  referenceTypeId: string;
  referenceId: string;
  selectedAssignee: string;
  moduleTypeId: number = 7;


  public ngDestroyed$ = new Subject();

  public initSettings = {
    plugins: "paste,lists advlist",
    //powerpaste_allow_local_images: true,
    //powerpaste_word_import: 'prompt',
    //powerpaste_html_import: 'prompt',
    toolbar: 'link image code',
    max_height: 150
  };

  projectsId: string;
  testRunsId: string;
  updatedAssigneeValue: string;
  updatedStatusValue: string;
  updatedStatusComment: string;
  dropDownList: TestCaseDropdownList;
  caseDetail: any;
  width: any;
  isCaseSelected: boolean = false;
  disableUpdate: boolean = false;
  testRunCompleted: boolean = false;
  loadStatus: boolean = false;
  showTitleTooltip: boolean = false;
  isFileUploadPopover: boolean;
  isButtonVisible: boolean = true;
  selectedStoreId: null;
  isCaseFailed: boolean = false;
  loadBug: boolean = false;
  isBugBoardEnable: boolean;
  isBugFromTestRail: boolean = true;
  isBugFromUserStory: boolean = false;
  statusFailedId: string = failedStatusId;
  statusFailedShortName: string = failedStatusShortName;
  selectedTestCase: any = [];


  constructor(private store: Store<State>, private actionUpdates$: Actions, public dialog: MatDialog, private masterSettingsService: MaterSettingService,
    private cdRef: ChangeDetectorRef) {
    super();

    this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getSingleTestCaseBySectionAndRunIdForRunsLoading));
    this.bugsInTestCaseProgress$ = this.store.pipe(select(testRailModuleReducer.getBugsByTestCaseScenarioIdLoading));

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.TestCaseStatusEditWithInPlaceUpdateForStatus),
      tap(() => {
        this.updateAssigneesPopover.close();
        this.updateStatusesPopover.close();
        this.disableUpdate = false;
      })
    ).subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  previewTestcase() {
    let passingdata = {
      caseData: this.caseDetail,
      projectId: this.projectsId,
      testRunId: this.testRunsId,
      testRunCompleted: this.testRunCompleted
    }
    this.caseStatusPreviewDetails.emit(passingdata);
  }

  changeSelectStatus(value) {
    this.isCaseSelected = value;
    // this.caseSelection.emit(this.caseDetail.testCaseId);
    this.caseSelection.emit(this.caseDetail);
  }

  changeStatus(value) {
    this.isCaseSelected = value;
    // this.casesSelected.emit(this.caseDetail.testCaseId);
    this.casesSelected.emit(this.caseDetail);
  }

  loadUsersList() {
    this.usersList$ = this.store.pipe(select(testRailModuleReducer.getTestRunUserAll));
    this.usersList$.subscribe((x) => this.usersList = x);
  }

  loadStatuses() {
    let dropDownList = new TestCaseDropdownList();
    dropDownList.isArchived = false;
    this.statusList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseStatusAll));
  }

  updateAssignTo(value) {
    let single = new UpdateMultiple();
    single.assignToId = value;
    single.testRunId = this.testRunsId;
    let caseIds = [];
    caseIds.push(this.caseDetail.testCaseId);
    single.testCaseIds = caseIds;
    var projectMembers = this.usersList;

    var ownerFilteredList = _.find(projectMembers, function (member) {
      return member.id == value;
    })
    if (ownerFilteredList) {
      this.selectedAssignee = ownerFilteredList.value;
      this.cdRef.markForCheck();
    }
    else {
      this.selectedAssignee = null;
    }
    this.store.dispatch(new LoadUpdateTestRunResultTriggered(single));
  }

  updateStatus() {
    this.disableUpdate = true;
    let single = new UpdateMultiple();
    single.statusId = this.updatedStatusValue;
    single.statusComment = this.updatedStatusComment;
    single.testRunId = this.testRunsId;
    let caseIds = [];
    caseIds.push(this.caseDetail.testCaseId);
    single.testCaseIds = caseIds;
    this.store.dispatch(new LoadUpdateTestRunResultTriggered(single));
  }

  openUpdateAssigneePopover(value) {
    if (value == "true" && !this.testRunCompleted) {
      this.loadUsersList();
      this.selectedAssignee = this.caseDetail.assignToName;
      this.cdRef.detectChanges();
      this.updatedAssigneeValue = this.caseDetail.assignToId;
      this.updateAssigneesPopover.open();
    }
  }

  openUpdateStatusPopover(value) {
    if (value == "true" && !this.testRunCompleted) {
      this.loadStatuses();
      this.disableUpdate = false;
      this.loadStatus = true;
      this.updatedStatusValue = this.caseDetail.statusId;
      this.checkIsFailed(this.updatedStatusValue);
      this.updatedStatusComment = this.caseDetail.statusComment;
      this.updateStatusesPopover.open();
    }
    else
      this.loadStatus = false;
  }

  loadBugs() {
    let testCaseSearch = new TestCase();
    testCaseSearch.scenarioId = this.caseDetail.testCaseId;
    this.store.dispatch(new LoadBugsByTestCaseIdTriggered(testCaseSearch));
    this.scenarioBugs$ = this.store.pipe(select(testRailModuleReducer.getBugsByTestCaseScenarioId));
  }

  openBugsPopover(bugPopover) {
    this.loadBugs();
    bugPopover.openPopover();
  }

  setColorForBugPriorityTypes(color) {
    let styles = {
      "color": color
    };
    return styles;
  }

  closeBugPopover() {
    this.scenarioBugPopover.forEach((p) => p.closePopover());
  }

  checkTitleTooltipStatus() {
    if (this.testRunCaseTitleStatus.nativeElement.scrollWidth > this.testRunCaseTitleStatus.nativeElement.clientWidth)
      this.showTitleTooltip = true;
    else
      this.showTitleTooltip = false;
  }


  openFileUploadPopover(referenceTypeId, fileUploadPopup) {
    this.isFileUploadPopover = !this.isFileUploadPopover;
    fileUploadPopup.openPopover();
    this.referenceTypeId = referenceTypeId;
    this.referenceId = this.caseDetail.testRunSelectedCaseId;
  }


  closeFileUploadPopover() {
    this.fileUploadPopover.forEach((p) => p.closePopover());
    this.isFileUploadPopover = !this.isFileUploadPopover;
    this.referenceTypeId = null;
    this.referenceId = null;
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
        }
      }
      else {
        this.isCaseFailed = false;
      }
    }
  }

  openBugPopover(addBugPopover) {
    this.loadBug = true;
    addBugPopover.openPopover();
  }


  closeBugsPopover() {
    this.loadBug = false;
    this.addBugsPopover.forEach((p) => p.closePopover());
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}