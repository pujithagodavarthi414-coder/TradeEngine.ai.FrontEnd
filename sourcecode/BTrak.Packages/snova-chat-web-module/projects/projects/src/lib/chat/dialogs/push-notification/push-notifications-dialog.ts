import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-push-notification-dialog',
    templateUrl: './push-notifications-dialog-template.html',
    styleUrls: ['./push-notifications-dialog-styles.css'],
})
export class PushNotificationDialog {
  constructor(public dialogRef: MatDialogRef<PushNotificationDialog>) {
    this.dialogRef.keydownEvents().subscribe(event => {
        if (event.key === "Escape" || event.key === "Enter") {
          this.closeDialog();
        }
    });
   }
  closeDialog() {
    this.dialogRef.close();
  }
}