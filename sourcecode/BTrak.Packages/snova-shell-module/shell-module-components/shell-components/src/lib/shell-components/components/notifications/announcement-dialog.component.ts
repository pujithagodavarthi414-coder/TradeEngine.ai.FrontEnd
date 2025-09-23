import { Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "announcement-dialog",
    templateUrl: "./announcement-dialog.component.html"
})

export class AnnoucementDialogComponent extends CustomAppBaseComponent {
    @Output() closeMatDialog = new EventEmitter<string>();

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            let annoucementData = data[0];
            if (annoucementData) {
                this.currentDialogId = annoucementData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                this.announcementId = annoucementData.announcementId;
                this.announcement = annoucementData.announcement;
                this.announcedBy = annoucementData.announcedBy;
                this.announcedById = annoucementData.announcedById;
                this.announcedOn = annoucementData.announcedOn;
                this.announcedByUserImage = annoucementData.announcedByUserImage;
            }
        }
    }
    announcementId: string;
    announcement: string;
    announcedBy: string;
    announcedOn: string;
    announcedById: string;
    announcedByUserImage: string;
    currentDialogId: string;
    currentDialog: any;

    constructor(
        public AppDialog: MatDialogRef<AnnoucementDialogComponent>,
        public routes: Router, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) {
        super();
        this.announcementId = data.announcementId;
        this.announcement = data.announcement;
        this.announcedBy = data.announcedBy;
        this.announcedById = data.announcedById;
        this.announcedOn = data.announcedOn;
        this.announcedByUserImage = data.announcedByUserImage;
    }

    onNoClick(): void {
        this.closeMatDialog.emit("");
        this.currentDialog.close();
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
