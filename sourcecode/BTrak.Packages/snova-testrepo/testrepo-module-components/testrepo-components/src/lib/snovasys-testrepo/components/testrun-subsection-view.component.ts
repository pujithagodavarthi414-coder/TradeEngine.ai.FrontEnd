import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'testrun-subsection-view',
    templateUrl: './testrun-subsection-view.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunSubsectionViewComponent {
    @Output() selectedSectionData = new EventEmitter<any>();
    @Input() subSection: any;
    @Input() sectionSelected: any;
    @Input() filterCases: any;

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

    changeView: boolean = false;
    sectionCollapse: boolean;

    constructor(private cdRef: ChangeDetectorRef) { }

    getSelectedSectionData(data) {
        this.selectedSectionData.emit(data);
    }

    getStructure(value) {
        this.changeView = value;
        this.cdRef.detectChanges();
    }
}