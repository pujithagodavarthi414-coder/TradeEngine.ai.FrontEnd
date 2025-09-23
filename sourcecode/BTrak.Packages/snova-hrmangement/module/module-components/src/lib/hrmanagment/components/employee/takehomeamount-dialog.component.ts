import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    templateUrl: 'take-home-amount-dialog.html',
    styles: [`
    .takehomeamount-dialog { width:450px },
  `]
})
export class TakeHomeAmountDialog {
    takeHomeAmount: string;
    constructor(public dialogRef: MatDialogRef<TakeHomeAmountDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.takeHomeAmount = data.takeHomeAmount;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
