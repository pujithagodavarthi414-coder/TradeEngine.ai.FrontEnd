import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";

import "../../globaldependencies/helpers/fontawesome-icons";

@Component({
    selector: "report-hierarchy-cases",
    templateUrl: "./report-hierarchy-cases.component.html"
})

export class ReportHierarchyCasesComponent {
    @Output() caseStatusPreviewDetails = new EventEmitter<any>();
    @Input() subSection: any;

    selectedCaseId: any;

    handleClick(data) { }

    getCaseStatusPreviewDetails(data) {
        this.caseStatusPreviewDetails.emit(data);
    }
}