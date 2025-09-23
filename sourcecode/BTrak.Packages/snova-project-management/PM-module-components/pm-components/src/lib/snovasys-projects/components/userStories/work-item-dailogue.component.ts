import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
@Component({
    selector: "work-item-dailogue",
    templateUrl: "work-item-dialogue.component.html"
})

export class WorkItemDialogComponent extends CustomAppBaseComponent implements OnInit {
    @Output() closeReportsSheetPopup = new EventEmitter<any>();
    isPopup: boolean = true;

    constructor(
        public reportsDialog: MatDialogRef<WorkItemDialogComponent>,
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
