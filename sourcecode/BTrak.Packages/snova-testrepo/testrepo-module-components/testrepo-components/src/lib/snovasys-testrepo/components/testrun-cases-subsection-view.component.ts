import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { TestCaseRunDetails } from "../models/testcaserundetails";

@Component({
  selector: "testrun-cases-subsection-view",
  templateUrl: "./testrun-cases-subsection-view.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunCasesSubsectionViewComponent {
  @Output() selectedSectionData = new EventEmitter<any>();
  @Output() selectedSections = new EventEmitter<any>();
  @Output() sectionCasesCount = new EventEmitter<any>();
  @Input() subSection: any;
  @Input() unSelectSectionId: any;
  @Input() sectionToCheck: any;
  @Input() sectionSelected: any;
  @Input() selectAllNone: any;
  @Input() checkFilterCases: any;

  @Input("inputMultiSections")
  set _inputMultiSections(data: any) {
    if (data) {
      let selectedSection = new TestCaseRunDetails();
      if (this.subSection.subSections && this.subSection.subSections.length > 0)
        selectedSection.sectionId = this.subSection.sectionId;
      else
        selectedSection.sectionId = data.sectionId;
      selectedSection.sectionSelected = data.sectionSelected;
      selectedSection.sectionCheckBoxClicked = data.sectionCheckBoxClicked;
      selectedSection.unselectSection = data.unselectSection;
      selectedSection.selectSection = data.selectSection;
      this.multiSections = selectedSection;
    }
  }

  @Input("sectionCollapse")
  set _sectionCollapse(data: boolean) {
    if (data || data == false) {
      this.sectionCollapse = data;
      if (data == false)
        this.changeView = true;
      else
        this.changeView = false;
    }
  }

  multiSections: any;
  changeView: boolean = false;
  sectionCollapse: boolean;

  constructor(private cdRef: ChangeDetectorRef) { }

  getSelectedSectionData(data) {
    this.selectedSectionData.emit(data);
    this.cdRef.detectChanges();
  }

  getSelectedSectionId(data) {
    this.selectedSections.emit(data);
    this.cdRef.detectChanges();
  }

  getMultiSections(value) {
    this.multiSections = value;
    this.cdRef.detectChanges();
  }

  getStructure(value) {
    this.changeView = value;
    this.cdRef.detectChanges();
  }

  getSectionCasesCount(value) {
    this.sectionCasesCount.emit(value);
  }
}