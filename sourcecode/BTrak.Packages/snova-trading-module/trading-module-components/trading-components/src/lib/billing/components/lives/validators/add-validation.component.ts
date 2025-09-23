import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, ViewChild, TemplateRef, EventEmitter, Output, Inject } from '@angular/core';
import { AppBaseComponent } from '../../componentbase';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'add-validation-component',
  templateUrl: './add-validation.component.html'
})

export class AddValidationComponent extends AppBaseComponent implements OnInit {
    validationDetails: any;
    isLoad: boolean;
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        if (this.matData) {
            this.currentDialogId = this.matData.dialogId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.validationId = this.matData.validationId;
            this.validationDetails = this.matData.validationDetails;
            this.formData = {data:{}}
            if(this.matData.isEdit == true)
            this.formData.data = this.validationDetails.formData;
            this.form = this.matData.formJson;
            this.isLoad = true;
        }

    }
    id: any;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    validationId: string;
    formData: any = { data: {} };
    form: any;
    dataSetId: any;
    @Output() closeMatDialog = new EventEmitter<any>();
    constructor(public addValidationDialog: MatDialogRef<AddValidationComponent>, public dialog: MatDialog, private cdRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
        if (data.dialogId) {
            this.currentDialogId = this.data.dialogId;
            this.validationId = this.matData.validationId;
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
