import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, ViewChild, ElementRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import "../../globaldependencies/helpers/fontawesome-icons";

import { TestCaseRunDetails } from "../models/testcaserundetails";

@Component({
  selector: "testrun-select-case",
  templateUrl: "./testrun-select-case.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunSelectCaseComponent {
  @ViewChild("testRunCasesTitle") testRunCaseTitleStatus: ElementRef;
  @Output() selectedCase = new EventEmitter<any>();
  @Output() selectedCaseAllNone = new EventEmitter<any>();
  @Output() unselectSection = new EventEmitter<any>();
  @Output() checkSection = new EventEmitter<any>();
  
  @Input("caseDetails")
  set _caseDetails(data: any) {
    if (data) {
      this.caseDetail = data;
      this.checkSelectedOrNot();
    }
  }

  @Input("selectedSection")
  set _selectedSection(data: any) {
    if (data != undefined && data != null && (data.sectionSelected == false || data.sectionSelected == true)) {
      this.checkCaseSelectBySection(data);
    }
  }

  @Input("selectAllNone")
  set _selectAllNone(data: any) {
    if (data == true || data == false) {
      if (data && (this.isCaseSelected == false || this.isCaseSelected == undefined))
        this.isCaseSelected = true;
      else if (data == false && this.isCaseSelected)
        this.isCaseSelected = false;
    }
  }

  @Input("checkFilterCases")
  set _checkFilterCases(data: any) {
    if (data && data.length > 0) {
      let selectedCases = [];
      selectedCases = data;
      if (selectedCases.findIndex(x => x.testCaseId == this.caseDetail.testCaseId) != -1)
        this.isCaseSelected = true;
      else
        this.isCaseSelected = false;
    }
    else if (data != undefined && data.length == 0) {
      this.isCaseSelected = false;
    }
  }

  selectedCaseDetails: TestCaseRunDetails;

  caseDetail: any;
  casesForAddRun: any;
  isCaseSelected: boolean;
  showTitleTooltip: boolean = false;

  constructor(public dialog: MatDialog) { }

  checkSelectedOrNot() {
    if (localStorage.getItem('selectedTestCases') != null) {
      let selectedCases = JSON.parse(localStorage.getItem('selectedTestCases'));
      if (selectedCases.findIndex(x => x.testCaseId == this.caseDetail.testCaseId) != -1)
        this.isCaseSelected = true;
      else
        this.isCaseSelected = false;
    }
  }

  checkCaseSelectBySection(data) {
    if (this.caseDetail && data.sectionSelected && data.sectionId == this.caseDetail.sectionId && (this.isCaseSelected == undefined || this.isCaseSelected == false)) {
      this.isCaseSelected = true;
      this.changeStatusForCase(this.isCaseSelected);
    }
    else if (this.caseDetail && data.sectionCheckBoxClicked && data.sectionSelected == false && data.sectionId == this.caseDetail.sectionId && this.isCaseSelected) {
      this.isCaseSelected = false;
    }
  }

  changeStatusForCase(value) {
    this.isCaseSelected = value;
    this.selectedCaseDetails = new TestCaseRunDetails();
    this.selectedCaseDetails.testCaseId = this.caseDetail.testCaseId;
    this.selectedCaseDetails.sectionId = this.caseDetail.sectionId;
    this.selectedCaseAllNone.emit(this.selectedCaseDetails);
  }

  changeStatus(value) {
    this.isCaseSelected = value;
    this.selectedCaseDetails = new TestCaseRunDetails();
    this.selectedCaseDetails.testCaseId = this.caseDetail.testCaseId;
    this.selectedCaseDetails.sectionId = this.caseDetail.sectionId;
    this.selectedCase.emit(this.selectedCaseDetails);
    if (this.isCaseSelected == false) {
      this.unselectSection.emit(this.caseDetail.sectionId);
    }
    if (this.isCaseSelected)
      this.checkSection.emit(this.caseDetail.sectionId);
  }

  checkTitleTooltipStatus() {
    if (this.testRunCaseTitleStatus.nativeElement.scrollWidth > this.testRunCaseTitleStatus.nativeElement.clientWidth)
      this.showTitleTooltip = true;
    else
      this.showTitleTooltip = false;
  }
}