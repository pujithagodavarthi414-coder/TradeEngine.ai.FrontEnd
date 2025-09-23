import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

import "../../globaldependencies/helpers/fontawesome-icons";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";

@Component({
    selector: "audit-report-hierarchy-questions",
    templateUrl: "./audit-report-hierarchy-questions.component.html"
})

export class AuditReportHierarchyQuestionsComponent {
    @Output() questionStatusPreviewDetails = new EventEmitter<any>();
    @Input() subSection: any;

    @Input("selectedQuestion")
    set _selectedQuestion(data: any) {
        if (data) {
            this.questionFromPreview = data;
            this.cdRef.detectChanges();
            this.handleClick(data);
        }
        else {
            this.questionFromPreview = null;
            this.cdRef.detectChanges();
        }
    }

    selectedCaseId: any;
    questionFromPreview: any;
    softLabels: SoftLabelConfigurationModel[];

    constructor(private cdRef: ChangeDetectorRef, private softLabelsPipe: SoftLabelPipe) { 
        this.getSoftLabelConfigurations();
    }
  
    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    handleClick(data) {
        this.selectedCaseId = data.questionId;
        this.cdRef.markForCheck();
    }

    getQuestionStatusPreviewDetails(data) {
        this.questionStatusPreviewDetails.emit(data);
    }
}