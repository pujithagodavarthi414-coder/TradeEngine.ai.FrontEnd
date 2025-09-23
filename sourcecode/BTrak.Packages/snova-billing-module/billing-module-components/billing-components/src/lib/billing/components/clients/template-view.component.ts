import { Component, Input, SecurityContext } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: 'template-config-dialogue',
    templateUrl: 'template-view.component.html',
})
export class TemplateViewDialog {
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        if (this.matData) {
            this.currentDialogId = this.matData.dialogId;
            this.dataItem = this.matData.dataItem;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.templateConfiguration = this._sanitizer.sanitize(SecurityContext.HTML, this.matData.templateConfiguration);
        }
    }
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    templateConfiguration: any;
    dataItem: any;
    constructor(
        public dialogRef: MatDialogRef<TemplateViewDialog>
        , public dialog: MatDialog,private _sanitizer: DomSanitizer
    ) { }

    onNoClick(): void {
        if (this.currentDialog) {
            this.currentDialog.close();
        }
    }
}