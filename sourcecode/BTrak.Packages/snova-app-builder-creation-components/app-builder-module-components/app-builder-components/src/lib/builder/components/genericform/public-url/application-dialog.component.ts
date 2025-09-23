import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'application-dialog',
    templateUrl: 'application-dialog.component.html',
})

export class ApplicationDialogComponent {
    publicMessage: string;
    uniqueNumber: string;

    constructor(public dialogRef: MatDialogRef<ApplicationDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, public dialog: MatDialog) {
        this.publicMessage = this.data.publicMessage;
        this.uniqueNumber = this.data.uniqueNumber;
    }

    onClose() {
        this.dialogRef.close();
    }
}