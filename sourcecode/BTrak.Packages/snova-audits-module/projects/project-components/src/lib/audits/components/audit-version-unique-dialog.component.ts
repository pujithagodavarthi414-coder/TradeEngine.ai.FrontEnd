import { Component, OnInit, Inject, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";

@Component({
    selector: "audit-version-unique-dialog",
    templateUrl: "audit-version-unique-dialog.component.html"
})

export class AuditVersionUniqueDialogComponent {
    auditVersionId: string;
    projectId: string;
    matData: any;
    currentDialogId: any;
    currentDialog: any;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            if (this.matData) {
                this.currentDialogId = this.matData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                this.auditVersionId = this.matData.auditId;
                this.projectId = this.matData.projectId;
            }
        }
    }

    constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AuditVersionUniqueDialogComponent>) { }

    closeDialog() {
        if (this.currentDialog) this.currentDialog.close();
    }
}
