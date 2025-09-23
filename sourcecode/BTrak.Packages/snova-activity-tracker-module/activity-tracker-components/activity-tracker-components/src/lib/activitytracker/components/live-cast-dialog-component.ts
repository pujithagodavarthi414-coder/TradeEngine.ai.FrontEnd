import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: 'app-fm-component-live-cast-dialog',
    templateUrl: `live-cast-dialog-component.html`
})

export class LiveCastDialogComponent {

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            if(this.matData){
                this.currentDialogId = this.matData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                this.liveImageUserName = this.matData.liveImageUserName;
                this.liveImageUserProfileImage = this.matData.liveImageUserProfileImage;
                this.liveImageroleName = this.matData.liveImageroleName;
                this.liveScreentimeZoneName = this.matData.liveScreentimeZoneName;
                this.livescreenShotDateTime = this.matData.livescreenShotDateTime;
            }
        }
    }

    @Input("liveImageUrl")
    set _liveImageUrl(data: any) {
        if (data && data !== undefined) {
            this.liveImageUrl = data;
        }
    }
    

    matData: any;
    currentDialogId: any;
    currentDialog: any;
    liveImageUrl: string;
    liveImageUserName: string;
    liveImageUserProfileImage: string;
    liveImageroleName: string;
    liveScreentimeZoneName: string;
    livescreenShotDateTime: string;

    constructor(public dialog: MatDialog) {
        
    }

    onNoClick() {
        if (this.currentDialog)
            this.currentDialog.close();
    }
}