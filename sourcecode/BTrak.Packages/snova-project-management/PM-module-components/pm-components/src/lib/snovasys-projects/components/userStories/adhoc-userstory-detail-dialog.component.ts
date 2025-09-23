import { Component, OnInit, Inject, Input, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { UserStory } from "../../models/userStory";

@Component({
    selector: "adhoc-userstory-detail-dialog",
    templateUrl: "adhoc-userstory-detail-dialog.component.html"
})
export class AdhocUserstoryDetailDialogComponent implements OnInit, OnDestroy {
    userStory: UserStory;
    toggleUserStory: string;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    id: any;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            if (this.matData) {
                this.currentDialogId = this.matData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                this.userStory = this.matData.userStory;
            }
        }
    }
    constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AdhocUserstoryDetailDialogComponent>) {
        if (Object.keys(data).length) {
            this.userStory = data.userStory;

            if (data.dialogId) {
                this.currentDialogId = this.data.dialogId;
                this.id = setTimeout(() => {
                    this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                }, 1200)
            }
        }
    }

    filterData: any;

    ngOnInit() {
        // this.dialogRef.updatePosition({ top: `0px`, right: `0px` });
    }

    ngOnDestroy() {
        if (this.id)
            clearInterval(this.id);
    }

    onNoClick(): void {
        if (this.currentDialog) this.currentDialog.close();
        if (this.dialogRef) this.dialogRef.close();
    }

    closeDialog() {
        if (this.currentDialog) this.currentDialog.close({ success: true });
        // if (this.dialogRef) this.dialogRef.close({ success: true });
    }

    userStoryCloseClicked(): void {
        if (this.currentDialog) this.currentDialog.close({ success: true });
        if (this.dialogRef) this.dialogRef.close({ success: true });
    }

    getToggleUserStory(value) {
        if (value == 'yes') {
            this.toggleUserStory = value;
            this.closeDialog();
        }
        else if (value == 'no') {
            this.toggleUserStory = value;
        }
    }
}
