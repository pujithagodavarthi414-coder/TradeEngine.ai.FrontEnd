import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-message-dialog-content',
  template: `
    <div class="dialog-content">
      <button mat-icon-button class="close-button" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
      <div class="custom-message-container">
        <span [style.font-size.px]="customMessageFontSize">{{ customMessage }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-content {
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .close-button {
        position: absolute;
        top: -24px;
        right: -20px;
        color: #000;
      }

      .custom-message-container {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class CustomMessageDialogContentComponent {
  customMessage: string;
  customMessageFontSize:number = null;

  constructor(public dialogRef: MatDialogRef<CustomMessageDialogContentComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    // You can access any data passed to the dialog via MAT_DIALOG_DATA
    this.customMessage = data.customMessage;
    this.customMessageFontSize =data.customMessageFontSize;
  }

  closeDialog() {
    // You can perform any additional logic before closing the dialog
    // For example, emit an event, perform an action, etc.
    // ...

    // Close the dialog using the injected MatDialogRef
    this.dialogRef.close();
  }
}
