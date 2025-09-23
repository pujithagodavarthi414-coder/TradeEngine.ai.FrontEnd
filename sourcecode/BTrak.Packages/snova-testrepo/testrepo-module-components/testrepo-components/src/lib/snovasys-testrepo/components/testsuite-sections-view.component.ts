import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import "../../globaldependencies/helpers/fontawesome-icons";

@Component({
    selector: 'testsuite-sections-view',
    templateUrl: './testsuite-sections-view.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuiteSectionsViewComponent {
    @Output() selectedSectionData = new EventEmitter<any>();
    @Output() selectedEditSectionData = new EventEmitter<any>();
    @Output() sectionCheckedDeleted = new EventEmitter<any>();
    @Output() isSectionDeleted = new EventEmitter<boolean>();
    @Input() section: any;
    @Input() sectionSelected: any;
    @Input() filterCases: any;

    @Input("testSuiteId")
    set _testSuiteId(data: string) {
        if (data)
            this.testSuiteId = data;
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

    testSuiteId: string;
    changeView: boolean = false;
    sectionCollapse: boolean;

    constructor(private cdRef: ChangeDetectorRef) { }

    getSelectedSectionData(data) {
        this.selectedSectionData.emit(data);
    }

    getSelectedEditSectionData(data) {
        this.selectedEditSectionData.emit(data);
    }

    getSectionCheckedDeleted(data) {
        this.sectionCheckedDeleted.emit(data);
    }

    getSectionDeleted(value) {
        this.isSectionDeleted.emit(value);
    }

    getStructure(value) {
        this.changeView = value;
        this.cdRef.detectChanges();
    }
}