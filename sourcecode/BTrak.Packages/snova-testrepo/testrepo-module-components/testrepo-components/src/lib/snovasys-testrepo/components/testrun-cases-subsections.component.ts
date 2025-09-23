import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TestCaseActionTypes } from '../store/actions/testcaseadd.actions';

import "../../globaldependencies/helpers/fontawesome-icons";

import { TestCaseRunDetails } from "../models/testcaserundetails";

@Component({
  selector: "testrun-cases-subsections",
  templateUrl: "./testrun-cases-subsections.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunCasesSubsectionsComponent {
  @ViewChild("testRunCaseSectionName") testRunCaseSectionNameStatus: ElementRef;
  @Output() selectedSectionData = new EventEmitter<any>();
  @Output() selectedSections = new EventEmitter<any>();
  @Output() multiSections = new EventEmitter<any>();
  @Output() changeTreeStructre = new EventEmitter<boolean>();
  @Output() sectionCasesCount = new EventEmitter<any>();

  @Input("unSelectSectionId")
  set _unSelectSectionId(data: any) {
    if (data) {
      this.unselectSectionId = data;
      if (this.sectionsData && this.unselectSectionId == this.sectionsData.sectionId)
        this.checkToUnselectSection();
    }
  }

  @Input("sectionToCheck")
  set _sectionToCheck(data: any) {
    if (data) {
      this.sectionToCheck = data;
      if (this.sectionsData && this.sectionToCheck.sectionId == this.sectionsData.sectionId)
        this.checkToSelectSection();
    }
  }

  @Input("sectionData")
  set _sectionData(data: any) {
    if (data) {
      this.sectionsData = data;
      if (this.sectionsData.subSections && this.sectionsData.subSections.length != 0)
        this.isChildsPresent = true;
      else
        this.isChildsPresent = false;
      this.checkSelectedOrNot();
    }
  }

  @Input("sectionSelected")
  set _sectionSelected(data: any) {
    if (data) {
      if (this.sectionsData && data == this.sectionsData.sectionId)
        this.isSectionSelectedOrNot = true;
      else
        this.isSectionSelectedOrNot = false;
    }
  }

  @Input("sectionCollapse")
  set _sectionCollapse(data: boolean) {
    if (data || data == false) {
      this.treeStructure = data;
    }
  }

  @Input("inputMultiSections")
  set _inputMultiSections(data: any) {
    if (data) {
      if (data.sectionId == this.sectionsData.parentSectionId && data.sectionCheckBoxClicked && data.sectionSelected != this.isSectionSelected) {
        this.checkMultiSections(data.sectionSelected);
      }
      else if (data.sectionId == this.sectionsData.sectionId && data.sectionCheckBoxClicked && data.sectionSelected != this.isSectionSelected
        && this.sectionsData.subSections && this.sectionsData.subSections.length > 0) {
        this.checkMultiSections(data.sectionSelected);
      }
      else if (data.sectionId != this.sectionsData.sectionId && data.sectionCheckBoxClicked && data.sectionSelected == false
        && (this.isSectionSelected == false || this.isSectionSelected == undefined)) {
        if (localStorage.getItem('selectedTestCases') != null && localStorage.getItem('selectedTestCases') != 'undefined') {
          let selectedCases = JSON.parse(localStorage.getItem('selectedTestCases'));
          if (selectedCases.findIndex(x => x.sectionId == this.sectionsData.sectionId) != -1) {
            this.unselectAllCasesByChangingParent();
          }
        }
      }
    }
  }

  @Input("selectAllNone")
  set _selectAllNone(data: any) {
    if (data == true || data == false) {
      if (data && (this.isSectionSelected == false || this.isSectionSelected == undefined)) {
        this.isSectionSelected = true;
        this.countCasesSelected(this.isSectionSelected, true);
      }
      else if (data == false && this.isSectionSelected) {
        this.isSectionSelected = false;
        this.countCasesSelected(this.isSectionSelected, true);
      }
      else if (data == false && (this.isSectionSelected == false || this.isSectionSelected == undefined)) {
        this.isSectionSelected = false;
        this.countCasesSelected(this.isSectionSelected, true);
      }
    }
  }

  @Input("checkFilterCases")
  set _checkFilterCases(data: any) {
    if (data && data.length > 0) {
      let selectedCases = [];
      selectedCases = data;
      let index = selectedCases.findIndex(x => x.sectionId == this.sectionsData.sectionId);
      if (index != -1 && selectedCases[index].isChecked) {
        this.isSectionSelected = true;
        this.countCasesSelected(this.isSectionSelected, true);
      }
      else {
        this.isSectionSelected = false;
        this.countCasesSelected(false, false);
      }
    }
    else if (data != undefined && data.length == 0) {
      this.isSectionSelected = false;
      this.countCasesSelected(false, true);
    }
  }

  public ngDestroyed$ = new Subject();

  sectionsData: any;
  unselectSectionId: any;
  sectionToCheck: any;
  noOfCasesSelected: number = 0;
  isSectionSelected: boolean;
  checkDisable: boolean;
  treeStructure: boolean = false;
  isChildsPresent: boolean = false;
  isSectionSelectedOrNot: boolean = false;
  showTitleTooltip: boolean = false;

  constructor(private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCasesBySectionIdForRunsTriggered),
      tap(() => {
        this.checkDisable = true;
        this.cdRef.detectChanges();
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCasesBySectionIdForRunsCompleted),
      tap(() => {
        this.checkDisable = false;
        this.cdRef.detectChanges();
      })
    ).subscribe();
  }

  getTestCase() {
    let selectedCaseDetails = new TestCaseRunDetails();
    selectedCaseDetails.sectionId = this.sectionsData.sectionId;
    selectedCaseDetails.sectionSelected = this.isSectionSelected;
    selectedCaseDetails.sectionCheckBoxClicked = false;
    selectedCaseDetails.unselectSection = false;
    selectedCaseDetails.selectSection = false;
    selectedCaseDetails.unselectAllCases = false;
    selectedCaseDetails.sectionsAllNone = false;
    this.selectedSectionData.emit(this.sectionsData);
    this.selectedSections.emit(selectedCaseDetails);
    this.multiSections.emit(null);
  }

  checkSelectedOrNot() {
    if (localStorage.getItem('selectedSections') != 'undefined' && localStorage.getItem('selectedSections') != null) {
      let selectedSections = JSON.parse(localStorage.getItem('selectedSections'));
      if (selectedSections.indexOf(this.sectionsData.sectionId) != -1) {
        this.isSectionSelected = true;
        this.countCasesSelected(this.isSectionSelected, true);
      }
      else {
        this.isSectionSelected = false;
        this.countCasesSelected(this.isSectionSelected, false);
      }
    }
  }

  checkToUnselectSection() {
    if (this.sectionsData && this.unselectSectionId && this.unselectSectionId == this.sectionsData.sectionId && this.isSectionSelected) {
      this.isSectionSelected = false;
      let selectedCaseDetails = new TestCaseRunDetails();
      selectedCaseDetails.sectionId = this.sectionsData.sectionId;
      selectedCaseDetails.sectionCheckBoxClicked = false;
      selectedCaseDetails.unselectSection = true;
      selectedCaseDetails.selectSection = false;
      selectedCaseDetails.unselectAllCases = false;
      selectedCaseDetails.sectionsAllNone = false;
      this.selectedSections.emit(selectedCaseDetails);
    }
    if (this.sectionsData && this.unselectSectionId && this.unselectSectionId == this.sectionsData.sectionId) {
      this.countCasesSelected(this.isSectionSelected, false);
    }
  }

  checkToSelectSection() {
    if (this.sectionsData && this.sectionToCheck && this.sectionToCheck.sectionId == this.sectionsData.sectionId && (this.isSectionSelected == undefined || this.isSectionSelected == false)) {
      if (localStorage.getItem('selectedTestCases') != 'undefined' && localStorage.getItem('selectedTestCases') != null) {
        let selectedCases = [];
        selectedCases = JSON.parse(localStorage.getItem('selectedTestCases'));
        let count = 0;
        selectedCases.forEach(x => {
          if (x.sectionId == this.sectionToCheck.sectionId)
            count = count + 1;
        })
        if (count == this.sectionToCheck.casesSelected) {
          this.isSectionSelected = true;
          this.countCasesSelected(this.isSectionSelected, true);
          let selectedCaseDetails = new TestCaseRunDetails();
          selectedCaseDetails.sectionId = this.sectionsData.sectionId;
          selectedCaseDetails.sectionCheckBoxClicked = false;
          selectedCaseDetails.unselectSection = false;
          selectedCaseDetails.selectSection = true;
          selectedCaseDetails.unselectAllCases = false;
          selectedCaseDetails.sectionsAllNone = false;
          this.selectedSections.emit(selectedCaseDetails);
        }
        else
          this.countCasesSelected(false, false);
      }
    }
  }

  changeStatus(value) {
    this.isSectionSelected = value;
    this.countCasesSelected(value, true);
    let selectedCaseDetails = new TestCaseRunDetails();
    selectedCaseDetails.sectionId = this.sectionsData.sectionId;
    selectedCaseDetails.sectionSelected = value;
    selectedCaseDetails.sectionCheckBoxClicked = true;
    selectedCaseDetails.unselectSection = false;
    selectedCaseDetails.selectSection = false;
    selectedCaseDetails.unselectAllCases = false;
    selectedCaseDetails.sectionsAllNone = false;
    this.selectedSections.emit(selectedCaseDetails);
    this.multiSections.emit(selectedCaseDetails);
    this.cdRef.detectChanges();
  }

  checkMultiSections(value) {
    this.isSectionSelected = value;
    this.countCasesSelected(this.isSectionSelected, true);
    let selectedCaseDetails = new TestCaseRunDetails();
    selectedCaseDetails.sectionId = this.sectionsData.sectionId;
    selectedCaseDetails.sectionSelected = value;
    selectedCaseDetails.multiSections = false;
    selectedCaseDetails.sectionCheckBoxClicked = true;
    selectedCaseDetails.unselectSection = false;
    selectedCaseDetails.selectSection = false;
    selectedCaseDetails.unselectAllCases = false;
    selectedCaseDetails.sectionsAllNone = false;
    this.selectedSections.emit(selectedCaseDetails);
  }

  unselectAllCasesByChangingParent() {
    let selectedCaseDetails = new TestCaseRunDetails();
    selectedCaseDetails.sectionId = this.sectionsData.sectionId;
    selectedCaseDetails.sectionSelected = false;
    selectedCaseDetails.multiSections = false;
    selectedCaseDetails.sectionCheckBoxClicked = true;
    selectedCaseDetails.unselectSection = false;
    selectedCaseDetails.selectSection = false;
    selectedCaseDetails.unselectAllCases = true;
    selectedCaseDetails.sectionsAllNone = false;
    this.selectedSections.emit(selectedCaseDetails);
  }

  showTreeView() {
    this.treeStructure = !this.treeStructure;
    this.changeTreeStructre.emit(false);
  }

  hideTreeView() {
    this.treeStructure = !this.treeStructure;
    this.changeTreeStructre.emit(true);
  }

  countCasesSelected(value, check) {
    if (value && check) {
      this.noOfCasesSelected = this.sectionsData.casesCount;
      this.cdRef.markForCheck();
    }
    else if ((value == undefined || value == false) && check) {
      this.noOfCasesSelected = 0;
      this.cdRef.markForCheck();
    }
    else if (check == false) {
      if (localStorage.getItem('selectedTestCases') != 'undefined' && localStorage.getItem('selectedTestCases') != null) {
        let selectedCases = JSON.parse(localStorage.getItem('selectedTestCases'));
        let count = 0;
        selectedCases.forEach(x => {
          if (x.sectionId == this.sectionsData.sectionId)
            count = count + 1;
        });
        this.noOfCasesSelected = count;
        this.cdRef.markForCheck();
      }
      else {
        this.noOfCasesSelected = 0;
        this.cdRef.markForCheck();
      }
    }
    let selectedCases = new TestCaseRunDetails();
    selectedCases.sectionId = this.sectionsData.sectionId;
    selectedCases.casesCount = this.noOfCasesSelected;
    this.sectionCasesCount.emit(selectedCases);
  }

  checkTitleTooltipStatus() {
    if (this.testRunCaseSectionNameStatus.nativeElement.scrollWidth > this.testRunCaseSectionNameStatus.nativeElement.clientWidth) {
      this.showTitleTooltip = true;
    }
    else {
      this.showTitleTooltip = false;
    }
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}