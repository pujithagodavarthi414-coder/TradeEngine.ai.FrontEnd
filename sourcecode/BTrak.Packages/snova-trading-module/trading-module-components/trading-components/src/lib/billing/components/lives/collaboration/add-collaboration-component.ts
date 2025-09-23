import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, ViewChild, TemplateRef, EventEmitter, Output, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
// import '../../../globaldependencies/helpers/fontawesome-icons'
import { AppBaseComponent } from '../../componentbase';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Guid } from 'guid-typescript';
import { collaborationFormComponents } from "../../../models/collaboration-jsons.model";
@Component({
  selector: 'add-collaboration-component',
  templateUrl: './add-collaboration-component.html'
})

export class AddCollaborationComponent extends AppBaseComponent implements OnInit {
    collaborationDetails: any;
    isLoad: boolean;
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        if (this.matData) {
            this.currentDialogId = this.matData.dialogId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.collaborationId = this.matData.collaborationId;
            this.collaborationDetails = this.matData.collaborationDetails;
            this.formData = {data:{}}
            if(this.matData.isEdit == true)
            this.formData.data = this.collaborationDetails.formData;
            this.form = collaborationFormComponents;
            this.isLoad = true;
        }

    }
    id: any;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    collaborationId: string;
    formData: any = { data: {} };
    form: any;
    dataSetId: any;
    @Output() closeMatDialog = new EventEmitter<any>();
    constructor(public addcollaborationDialog: MatDialogRef<AddCollaborationComponent>, public dialog: MatDialog, private cdRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
        if (data.dialogId) {
            this.currentDialogId = this.data.dialogId;
            this.collaborationId = this.matData.collaborationId;
            this.id = setTimeout(() => {
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }, 1200)
        }
    }

    ngOnInit() {

    }

    onNoClick() {
            this.currentDialog.close({ success: false });
    }

    onChange(event) {
        console.log(event);
        if ((event?.detail.hasOwnProperty('changed') && (event?.detail?.changed != undefined)) || event?.detail.hasOwnProperty('changed') == false) {
            if (event.detail.data) {
                this.formData.data = event.detail.data;
            }
        }
    }

    submiData() {
        this.closeMatDialog.emit(this.formData.data);
        if (this.currentDialog) {
            this.currentDialog.close();
            this.currentDialog.close({ success: true, formData: this.formData.data });
        }
    }
}
