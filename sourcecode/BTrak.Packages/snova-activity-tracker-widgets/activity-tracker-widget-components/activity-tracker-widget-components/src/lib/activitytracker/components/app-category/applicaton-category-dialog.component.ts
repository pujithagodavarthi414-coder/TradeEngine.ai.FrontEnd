import { Component, Inject, OnInit, ViewEncapsulation, Input } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import * as _ from "underscore";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";

@Component({
    selector: "application-category-dailog",
    templateUrl: "applicaton-category-dialog.component.html",
    encapsulation: ViewEncapsulation.None,
})

export class AppCatogoryDialogComponent extends CustomAppBaseComponent implements OnInit {

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }
    
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    outputs: any;
    formTypeComponent: any;
    inputs: any;
    injector: any;

    constructor(
        public dialog: MatDialog,
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
