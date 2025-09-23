import { Component } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-notification-dialog',
    templateUrl: './notifications-dialog-template.html',
    styleUrls: ['./notifications-dialog-styles.css'],
})
export class NotificationDialog {
  constructor(public dialogRef: MatDialogRef<NotificationDialog>) {
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