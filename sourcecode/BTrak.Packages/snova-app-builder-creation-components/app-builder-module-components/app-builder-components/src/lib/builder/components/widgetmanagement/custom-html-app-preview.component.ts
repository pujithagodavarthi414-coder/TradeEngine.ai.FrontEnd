import { Component, ChangeDetectorRef, Inject, Input } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";

export interface DialogData {
    widgetQuery: string;
    fileUrl: string;
}

@Component({
    selector: "app-fm-component-custom-html-preview-app-details",
    templateUrl: `custom-html-app-preview.component.html`
})

export class CustomHtmlAppPreviewComponent {

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.id = "frameId";
            this.matData = data[0];
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.htmlCodeString = this.matData.widgetQuery;
            if (this.matData.fileUrl) {
                this.htmlCodeString = this.htmlCodeString + '<script src="' + this.matData.fileUrl + '"></script>';
            }
            this.cdRef.detectChanges();
            this.method();
        }
    }

    matData: any;
    currentDialogId: any;
    currentDialog: any;
    htmlCodeString: any;
    customWidgetId: string;
    id: string;
    sample: boolean = true;

    constructor(public dialog: MatDialog, private cdRef: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) public data: DialogData, public sanitizer: DomSanitizer, public widgetDialog: MatDialogRef<CustomHtmlAppPreviewComponent>,) {

    }

    ngOnInit() {
        this.id = "frameId";
        this.cdRef.detectChanges();
    }

    onNoClick(): void {
        this.currentDialog.close();
    }

    method() {
        var iframeSelector: HTMLIFrameElement = document.querySelector('iframe[id=' + this.id + ']');
        var code = this.htmlCodeString;
        iframeSelector.src = 'data:text/html,' + encodeURIComponent(code);
        this.cdRef.detectChanges();
    }

}