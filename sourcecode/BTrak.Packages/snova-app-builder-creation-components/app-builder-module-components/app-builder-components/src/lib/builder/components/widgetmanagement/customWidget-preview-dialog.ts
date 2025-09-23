import { Component, Inject, OnInit, Input } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";


@Component({
    selector: "customwidget-preview-dialog",
    templateUrl: "./customWidget-preview-dialog.html"
})

export class CustomWidgetPreviewDialogComponent extends CustomAppBaseComponent implements OnInit {

    isChartTypeVisualization: any;
    gridData: any;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
  
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.gridData = { ...this.matData };
            this.isChartTypeVisualization = this.gridData.visualizationType === "table" ? false : true;
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

    constructor(
        public dialog: MatDialog,
        public widgetDialog: MatDialogRef<CustomWidgetPreviewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
    }

    onNoClick(): void {
        this.currentDialog.close();
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
