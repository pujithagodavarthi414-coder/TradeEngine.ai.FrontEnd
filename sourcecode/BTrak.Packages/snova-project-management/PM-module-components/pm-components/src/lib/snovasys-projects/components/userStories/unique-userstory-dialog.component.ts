import { Component, OnInit, Inject, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { UserStory } from "../../models/userStory";

@Component({
    selector: "unique-userstory-dialog",
    templateUrl: "unique-userstory-dialog.component.html"
})
export class UniqueUserstoryDialogComponent implements OnInit, OnDestroy {
    userStory: UserStory;
    toggleUserStory: string;
    isFromSprints: boolean;
    notFromAudits: boolean;
    isFromBugsCount: boolean;
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
                this.userStory = this.matData.userStory;
                this.notFromAudits = (this.matData.notFromAudits != null && this.matData.notFromAudits != undefined) ? this.matData.notFromAudits : true;
                this.isFromBugsCount = this.matData != null && this.matData != undefined ? this.matData.isFromBugsCount : false;
                if (this.userStory.isSprintUserStory == true) {
                    this.isFromSprints = true;
                } else {
                    this.isFromSprints = false;
                }
                if(this.matData.isFromSprints) {
                    this.isFromSprints = data.isFromSprints;
                }
            }
        }
    }
        @Output()  afterClosed = new EventEmitter<string>();

    constructor(public dialog : MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UniqueUserstoryDialogComponent>) {
     
        if(Object.keys(data).length){
            this.userStory = data.userStory;

            if (data.dialogId) {
                this.currentDialogId = this.data.dialogId;
                this.id = setTimeout(() => {
                    this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                }, 1200)
            }

            this.notFromAudits = (data.notFromAudits != null && data.notFromAudits != undefined) ? data.notFromAudits : true;
            this.isFromBugsCount = data != null && data != undefined ? data.isFromBugsCount : false;
            if (this.userStory && this.userStory.isSprintUserStory == true) {
                this.isFromSprints = true;
            } else {
                this.isFromSprints = false;
            }
            if(data.isFromSprints) {
                this.isFromSprints = data.isFromSprints;
            }
        }
    }

    filterData: any;

    ngOnInit() {
        // this.dialogRef.updatePosition({ top: `0px`, right: `0px` });
        this.userStory;
    }

    ngOnDestroy() {
        if (this.id)
            clearInterval(this.id);
    }

    onNoClick(): void {
        if(this.currentDialog) this.currentDialog.close();
        if(this.dialogRef) this.dialogRef.close();
    }

    closeDialog() {
        this.afterClosed.emit('');
        if(this.currentDialog) this.currentDialog.close({ success: this.toggleUserStory, redirection: false });
        // if(this.dialogRef)  this.dialogRef.close({ success: this.toggleUserStory });
       
    }

    getCloseUniqueUserStory() {
        if(this.currentDialog) this.currentDialog.close({ success: this.toggleUserStory, redirection: true });
        // if(this.dialogRef)  this.dialogRef.close({ success: this.toggleUserStory });
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
