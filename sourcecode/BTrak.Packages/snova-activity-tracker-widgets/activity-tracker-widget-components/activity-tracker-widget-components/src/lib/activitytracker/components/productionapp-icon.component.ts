import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: "app-fm-component-activitytracker-productiveapps-icon",
    templateUrl: "productionapp-icon.component.html",
})

export class ProductiveAppIconComponent {

    imageUrl: string = null;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    id: any;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            if(this.matData){
                this.currentDialogId = this.matData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                this.imageUrl = this.matData.imageUrl;
            }
        }
    }

    constructor(public dialog: MatDialog, private dialogRef: MatDialogRef<ProductiveAppIconComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
        if (Object.keys(data).length) {
            if (data.dialogId) {
                this.currentDialogId = this.data.dialogId;
                this.id = setTimeout(() => {
                    this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                }, 1200)
            }
            this.imageUrl = data.imageUrl;
        }
    }

    close() {
        // this.dialogRef.close();
        if (this.currentDialog) this.currentDialog.close();
        else if (this.dialogRef) this.dialogRef.close();
    }
}