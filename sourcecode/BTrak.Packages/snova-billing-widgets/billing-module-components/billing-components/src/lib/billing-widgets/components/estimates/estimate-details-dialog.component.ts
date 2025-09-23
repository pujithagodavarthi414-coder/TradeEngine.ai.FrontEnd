import { Component, ChangeDetectionStrategy, Inject, Input } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";

import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
    selector: "estimate-details-dialog",
    templateUrl: "estimate-details-dialog.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EstimateDetailsDialogComponent {

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            let matData = data[0];
            this.currentDialogId = matData.fromPhysicalId;
            this.estimateDetails = matData.estimateDetails;
            // let currDialog = this.dialog.openDialogs[0].id;
            // this.currentDialog = this.dialog.getDialogById(currDialog);
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

    selectedTab = 0;
    estimateDetails: any;
    currentDialogId: any;
    currentDialog: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private dialogRef: MatDialogRef<EstimateDetailsDialogComponent>) { 
        // this.estimateDetails = data.estimateDetails;
    }

    selectedMatTab(event) {
        this.selectedTab = event.index;
    }

    closeDialog() {
        this.currentDialog.close();
    }
}