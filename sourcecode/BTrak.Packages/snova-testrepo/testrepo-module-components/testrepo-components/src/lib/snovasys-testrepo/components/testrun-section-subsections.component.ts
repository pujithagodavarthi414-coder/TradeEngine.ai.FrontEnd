import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";

import "../../globaldependencies/helpers/fontawesome-icons";

@Component({
  selector: "testrun-section-subsections",
  templateUrl: "./testrun-section-subsections.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunSectionSubsectionsComponent {
  @ViewChild("testRunSectionName") testRunSectionNameStatus: ElementRef;
  @Output() selectedSectionData = new EventEmitter<any>();
  @Output() changeTreeStructre = new EventEmitter<boolean>();

  @Input("sectionData")
  set _sectionData(data: any) {
    if (data) {
      this.sectionsData = data;
      if (this.sectionsData.subSections && this.sectionsData.subSections.length != 0)
        this.isChildsPresent = true;
      else
        this.isChildsPresent = false;
    }
  }

  @Input("sectionSelected")
  set _sectionSelected(data: any) {
    if (data) {
      if (data == this.sectionsData.sectionId) {
        this.isSectionSelectedOrNot = true;
        localStorage.setItem("selectedSectionId", this.sectionsData.sectionId);
      }
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

  @Input("filterCases")
  set _filterCases(data: any) {
    if (data) {
      let cases = [];
      cases = data.filterCases;
      this.casesVisible = data.isFilter;
      if (this.casesVisible && cases && cases.length > 0) {
        let index = cases.findIndex(x => x.sectionId == this.sectionsData.sectionId);
        if (index != -1) {
          this.noOfCasesSelected = cases[index].testCasesCount;
          this.cdRef.markForCheck();
        }
        else {
          this.noOfCasesSelected = 0;
          this.cdRef.markForCheck();
        }
      }
      else {
        this.casesVisible = false;
        this.noOfCasesSelected = 0;
        this.cdRef.markForCheck();
      }
    }
    else {
      this.casesVisible = false;
      this.cdRef.markForCheck();
    }
  }

  sectionsData: any;
  noOfCasesSelected: number = 0;
  treeStructure: boolean = false;
  isChildsPresent: boolean = false;
  isSectionSelectedOrNot: boolean = false;
  showTitleTooltip: boolean = false;
  casesVisible: boolean = false;

  constructor(private cdRef: ChangeDetectorRef) { }

  getTestCase() {
    this.selectedSectionData.emit(this.sectionsData);
  }

  showTreeView() {
    this.treeStructure = !this.treeStructure;
    this.changeTreeStructre.emit(false);
  }

  hideTreeView() {
    this.treeStructure = !this.treeStructure;
    this.changeTreeStructre.emit(true);
  }

  treeView() {
    this.treeStructure = !this.treeStructure;
    if (this.treeStructure)
      this.changeTreeStructre.emit(false);
    else
      this.changeTreeStructre.emit(true);
  }

  checkTitleTooltipStatus() {
    if (this.testRunSectionNameStatus.nativeElement.scrollWidth > this.testRunSectionNameStatus.nativeElement.clientWidth) {
      this.showTitleTooltip = true;
    }
    else {
      this.showTitleTooltip = false;
    }
  }
}
