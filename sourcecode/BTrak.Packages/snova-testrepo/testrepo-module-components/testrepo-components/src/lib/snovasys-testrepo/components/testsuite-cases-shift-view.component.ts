import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "testsuite-cases-shift-view",
  templateUrl: "./testsuite-cases-shift-view.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuiteCasesShiftViewComponent {
  @Output() selectedSectionData = new EventEmitter<any>();
  @Output() selectedSections = new EventEmitter<any>();
  @Output() sectionCasesCount = new EventEmitter<any>();
  @Input() section: any;
  @Input() unSelectSectionId: any;
  @Input() sectionToCheck: any;
  @Input() sectionSelected: any;
  @Input() selectAllNone: any;
  @Input() checkFilterCases: any;

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
}
