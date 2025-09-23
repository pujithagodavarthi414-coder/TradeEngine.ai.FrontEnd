import { Component, ElementRef, EventEmitter, Inject, Output, ViewChildren } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SignatureModel } from '../../models/signature-model';
import { HRManagementService } from '../../services/hr-management.service';
import { UserService } from '../../services/user.Service';

@Component({
    selector: "signature-invitee-dialog",
    templateUrl: "./signature-invitee-dialog.component.html"
})

export class SignatureInviteeDialogComponent extends CustomAppBaseComponent {
    @ViewChildren("deleteInviteePopup") deleteInviteePopup;
    @Output() closeMatDialog = new EventEmitter<string>();
    referenceId = null;
    canEdit = false;
    canDelete = false;
    users: any[] = [];
    signatures: SignatureModel[] = [];
    inviteeUserId: string;
    inviteeName: string;
    validationMessage: string;
    isAnyOperationIsInprogress = false;
    signatureId: string;
    signatureUrl: string;
    inviteeId: string;

    constructor(
        public AppDialog: MatDialogRef<SignatureInviteeDialogComponent>, 
        public routes: Router, @Inject(MAT_DIALOG_DATA) public data: any, private translateService: TranslateService,
        private userService: UserService, private hrManagementService: HRManagementService, private toastr: ToastrService) {
        super();
        this.referenceId = data.referenceId;
        this.canEdit = data.canEdit;
        this.canDelete = data.canDelete;
        this.getSignatureBasedOnReference();
    }

    onNoClick(): void {
        this.AppDialog.close();
    }

    ngOnInit() {
        super.ngOnInit();
        this.userService.getUsersDropDown('').subscribe((response: any) => {
            this.users = response.data;
        });
    }

    getSignatureBasedOnReference() {
        this.isAnyOperationIsInprogress = true;
        const signature = new SignatureModel();
        signature.isArchived = false;
        signature.referenceId = this.referenceId;
        this.hrManagementService.getSignature(signature).subscribe((response: any) => {
            if (response.success === true) {
                this.signatures = response.data;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    openMenu() {
        this.inviteeUserId = "selectone";
        this.inviteeName = this.translateService.instant("FORMSUBMISSION.SELECTAUSER");
    }

    inviteeSelected(userId) {
        if (userId != "selectone") {
            this.inviteeUserId = userId;
            const index = this.users.findIndex((p) => p.id.toString().toLowerCase() == userId.toString().toLowerCase());
            this.inviteeName = this.users[index].fullName;
            const signature = new SignatureModel();
            signature.signatureId = null;
            signature.referenceId = this.referenceId;
            signature.signatureUrl = null;
            signature.inviteeId = userId;
            signature.isArchived = false;
            this.hrManagementService.upsertSignature(signature).subscribe((response: any) => {
                if (response.success === true) {
                    this.getSignatureBasedOnReference();
                } else {
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                }
                this.isAnyOperationIsInprogress = false;
            });
        }
    }

    openDeletePopup(row, deletePopover) {
        this.signatureId = row.signatureId;
        this.signatureUrl = row.signatureUrl;
        this.inviteeId = row.inviteeId;
        deletePopover.openPopover();
    }

    deleteInvitation() {
        const signature = new SignatureModel();
        signature.signatureId = this.signatureId;
        signature.referenceId = this.referenceId;
        signature.signatureUrl = this.signatureUrl;
        signature.inviteeId = this.inviteeId;
        signature.isArchived = true;
        this.hrManagementService.upsertSignature(signature).subscribe((response: any) => {
            if (response.success === true) {
                this.closeDeletePopup();
                this.getSignatureBasedOnReference();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    closeDeletePopup() {
        this.signatureUrl = null;
        this.signatureId = null;
        this.inviteeId = null;
        this.deleteInviteePopup.forEach((p) => { p.closePopover(); });
    }
}
