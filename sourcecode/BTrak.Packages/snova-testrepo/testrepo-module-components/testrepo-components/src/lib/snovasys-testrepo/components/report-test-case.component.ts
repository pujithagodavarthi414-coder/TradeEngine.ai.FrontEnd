import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, ViewChild, ElementRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";

import "../../globaldependencies/helpers/fontawesome-icons";

import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../constants/constant-variables';

@Component({
    selector: "report-test-case",
    templateUrl: "./report-test-case.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReportTestCaseComponent {
    @ViewChild("reportCaseTitle") reportCaseTitleStatus: ElementRef;
    @Output() caseStatusPreviewDetails = new EventEmitter<any>();

    @Input() caseSelected: boolean;

    @Input("caseDetails")
    set _caseDetails(data: any) {
        if (data)
            this.caseDetail = data;
    }

    caseDetail: any;
    width: any;
    showTitleTooltip: boolean = false;

    constructor(private toastr: ToastrService, private translateService: TranslateService) { }

    previewTestcase() {
        if (!this.caseDetail.isDeleted) {
            this.caseStatusPreviewDetails.emit(this.caseDetail);
        }
        else {
            this.toastr.error("", this.translateService.instant(ConstantVariables.TestCaseNotValid));
        }
    }

    checkTitleTooltipStatus() {
        if (this.reportCaseTitleStatus.nativeElement.scrollWidth > this.reportCaseTitleStatus.nativeElement.clientWidth)
            this.showTitleTooltip = true;
        else
            this.showTitleTooltip = false;
    }
}
