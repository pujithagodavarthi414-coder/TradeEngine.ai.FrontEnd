import { Component, Inject, EventEmitter, Output, Input } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { CustomTagModel } from "../../models/custom-tags.model";

@Component({
    selector: "create-app-dialog",
    templateUrl: "create-app-dialog.component.html"
})

export class CreateAppDialogComponet extends CustomAppBaseComponent {

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.selectedAppIdForEdit = this.matData.appId;
            this.fromSearch = this.matData.fromSearch;
            this.tagSearchText = this.matData.tag;
            this.isHtmlApp = this.matData.isForHtmlApp;
            this.tagModel = this.matData.tagModel;
            this.appType = this.matData.appType;
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

    selectedAppIdForEdit: string;
    isHtmlApp: boolean;
    tagSearchText: string;
    fromSearch: string;
    tagModel: CustomTagModel;
    appType: number;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    @Output() isReloadRequired = new EventEmitter<boolean>();
    constructor(
        public dialog: MatDialog,
        public CreateAppDialog: MatDialogRef<CreateAppDialogComponet>,
        public routes: Router, @Inject(MAT_DIALOG_DATA) public data: any) {
        super();

    }

    ngOnInIt() {
        super.ngOnInit();
    }

    onNoClick(isReload): void {
        if (isReload === true) {
            this.isReloadRequired.emit(isReload);
        }
        this.currentDialog.close(isReload);

    }
}
