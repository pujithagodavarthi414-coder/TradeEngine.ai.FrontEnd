import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import "../../globaldependencies/helpers/fontawesome-icons"
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

@Component({
    selector: "status-reporting-dialog",
    templateUrl: "./status-reporting-dialog.component.html"
})

export class StatusReportingDialogComponent extends CustomAppBaseComponent implements OnInit {
    @Output() closeReportsSheetPopup = new EventEmitter<any>();

    constructor(
        public reportsDialog: MatDialogRef<StatusReportingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute) {
        super();
    }

    onNoClick(): void {
        this.reportsDialog.close();
        this.closeReportsSheetPopup.emit(true);
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
