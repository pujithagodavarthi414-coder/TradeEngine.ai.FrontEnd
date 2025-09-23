import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SignatureModel } from '../../models/signature-model';

@Component({
    selector: "signature-dialog",
    templateUrl: "./signature-dialog.component.html"
})

export class SignatureDialogComponent extends CustomAppBaseComponent {
    @Output() closeMatDialog = new EventEmitter<boolean>();
    signatureReference: SignatureModel;
    canEdit = false;
    canDelete = false;

    constructor(
        public AppDialog: MatDialogRef<SignatureDialogComponent>,
        public routes: Router, @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
        this.signatureReference = data.signatureReference;
        this.canEdit = data.canEdit;
        this.canDelete = data.canDelete;
    }

    onNoClick(): void {
        this.closeMatDialog.emit(true);
        this.AppDialog.close();
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
