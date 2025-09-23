import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

@Component({
    selector: "reminder-dialog",
    templateUrl: "./reminder-dialog.component.html"
})

export class ReminderDialogComponent extends CustomAppBaseComponent {
    @Output() closeReminderPopup = new EventEmitter<any>();
    @Input("data")
    set _data(data: any) {

        if (data && data !== undefined) {
            this.matData = data[0];
            if(this.matData) {
                this.currentDialogId = this.matData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                this.refernceId = this.matData.referenceId;
                this.referenceTypeId = this.matData.referenceTypeId;
                this.hasReminderPermissions = this.matData.hasReminderPermissions;
                this.ofUser = this.matData.ofUser;
            }
        }
    }


    refernceId = null;
    referenceTypeId = null;
    hasReminderPermissions = false;
    ofUser: string;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    id: any;

    constructor(
        public reportsDialog: MatDialogRef<ReminderDialogComponent>,
        public dialog: MatDialog,
        public routes: Router,
        @Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute) {
        super();
        if (data.dialogId) {
            this.currentDialogId = this.data.reminderId;
            this.id = setTimeout(() => {
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }, 1200)
        }
        this.refernceId = data.referenceId;
        this.referenceTypeId = data.referenceTypeId;
        this.hasReminderPermissions = data.hasReminderPermissions;
        this.ofUser = data.ofUser;
        }
    closeDialog() {
        //this.AppDialog.close();
        if (this.currentDialog) {
            this.currentDialog.close();
            this.currentDialog.close({ redirection: true });
        } 
        else if(this.reportsDialog){
            this.reportsDialog.close();
          ///  this.closeReminderPopup.emit(true);
        }
        //this.closeReminderPopup.emit(true);
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
