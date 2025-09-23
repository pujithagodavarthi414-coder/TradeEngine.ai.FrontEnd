import { Component, ChangeDetectionStrategy, Inject, Input } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";

import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
    selector: "invoice-details-dialog",
    templateUrl: "invoice-details-dialog.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoiceDetailsDialogComponent {

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            let matData = data[0];
            this.currentDialogId = matData.fromPhysicalId;
            this.invoiceDetails = matData.invoiceDetails;
            // let currDialog = this.dialog.openDialogs[0].id;
            // this.currentDialog = this.dialog.getDialogById(currDialog);
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

    selectedTab = 0;
    invoiceDetails: any;
    currentDialogId: any;
    currentDialog: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private dialogRef: MatDialogRef<InvoiceDetailsDialogComponent>) {
        // this.invoiceDetails = data.invoiceDetails;
    }

    selectedMatTab(event) {
        this.selectedTab = event.index;
    }

    getCloseDetailsDialog(value) {
        this.currentDialog.close({ success: true });
    }

    closeDialog() {
        this.currentDialog.close({ success: false });
    }
}