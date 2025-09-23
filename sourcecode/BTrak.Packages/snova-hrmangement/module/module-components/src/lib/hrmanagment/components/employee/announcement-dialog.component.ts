import { Component, EventEmitter, Inject, Output, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "announcement-dialog",
    templateUrl: "./announcement-dialog.component.html"
})

export class AnnoucementDialogComponent extends CustomAppBaseComponent {
    @Output() closeMatDialog = new EventEmitter<string>();
    announcementId: string;
    announcement: string;
    announcedBy: string;
    announcedOn: string;
    announcedById: string;
    announcedByUserImage: string;

    constructor(
        public AppDialog: MatDialogRef<AnnoucementDialogComponent>,
        public routes: Router, @Inject(MAT_DIALOG_DATA) public data: any) {
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
        this.AppDialog.close();
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
