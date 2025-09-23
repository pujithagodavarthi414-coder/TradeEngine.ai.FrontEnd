import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { SignatureBaseComponent } from "./signature-base.component";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SignatureModel } from '../../models/signature.model';
import { DashboardService } from '../../services/dashboard.service';
import { FileResultModel } from '../../models/file-result.model';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-signature",
    templateUrl: `signature.component.html`
})

export class SignatureComponent extends CustomAppBaseComponent implements OnInit {

    @Input("signatureReference")
    set _signatureReference(data: SignatureModel) {
        if (data && data !== undefined) {
            this.referenceId = data.referenceId;
            this.inviteeId = data.inviteeId;
            this.signatureEdit = false;
            this.getSignatureBasedOnReference();
        }
    }

    @Input("canEdit")
    set _canEdit(data: boolean) {
        if (data && data !== undefined) {
            this.canEdit = data;
        }
    }

    @Input("canDelete")
    set _canDelete(data: boolean) {
        if (data && data !== undefined) {
            this.canDelete = data;
        }
    }
    @ViewChildren("deleteSignaturePopup") deleteSignaturePopup;

    roleFeaturesIsInProgress$: Observable<boolean>;
    isAnyOperationIsInprogress = false;
    validationMessage: string;
    moduleTypeId = 13;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isFileExist: boolean;

    public form: FormGroup;

    @ViewChildren(SignatureBaseComponent) public sigs: QueryList<SignatureBaseComponent>;
    @ViewChildren("sigContainer") public sigContainer: QueryList<ElementRef>;

    referenceId: string = null;
    signatureId: string;
    signatureUrl: string;
    inviteeId: string;
    signatureEdit = false;
    canEdit = false;
    canDelete = false;

    fileResultModel$: Observable<FileResultModel[]>;
    fileResultModel: FileResultModel[];
    public ngDestroyed$ = new Subject();

    constructor(
        private dashboardService: DashboardService,
        public snackbar: MatSnackBar, private toastr: ToastrService, private fb: FormBuilder) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.form = this.fb.group({
            signatureField: ["", Validators.required]
        });
    }

    getSignatureBasedOnReference() {
        this.isAnyOperationIsInprogress = true;
        const signature = new SignatureModel();
        signature.isArchived = false;
        signature.referenceId = this.referenceId;
        signature.inviteeId = this.inviteeId;
        this.dashboardService.getSignature(signature).subscribe((response: any) => {
            if (response.success === true) {
                if (response.data && response.data.length == 0) {
                    this.signatureUrl = null;
                    this.signatureId = null;
                    this.inviteeId = null;
                } else {
                    this.signatureUrl = response.data[0].signatureUrl;
                    this.signatureId = response.data[0].signatureId;
                    this.inviteeId = response.data[0].inviteeId;
                }
                if (!this.signatureUrl && this.canEdit) {
                    this.editSignature();
                }
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    UpsertfileCompleted() {
        this.signatureEdit = false;
        const signature = new SignatureModel();
        signature.signatureId = this.signatureId;
        signature.referenceId = this.referenceId;
        signature.signatureUrl = this.signatureUrl;
        signature.inviteeId = this.inviteeId;
        signature.isArchived = false;
        this.dashboardService.upsertSignature(signature).subscribe((response: any) => {
            if (response.success === true) {
                if (!this.inviteeId) {
                    this.getSignatureBasedOnReference();
                }
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    deleteSignature() {
        this.isAnyOperationIsInprogress = true;
        this.signatureUrl = null;
        this.UpsertfileCompleted();
    }

    deleteSignaturePopUpOpen(deleteSignaturePopUp) {
        deleteSignaturePopUp.openPopover();
    }

    closeDeleteSignatureDialog() {
        this.deleteSignaturePopup.forEach((p) => p.closePopover());
    }

    async editSignature() {
        this.isAnyOperationIsInprogress = true;
        this.form = this.fb.group({
            signatureField: ["", Validators.required]
        });
        this.signatureEdit = true;
        await this.delay(200);
        this.setOptions();
        this.beResponsive();
        this.isAnyOperationIsInprogress = false;
    }

    public beResponsive() {
        this.size(this.sigContainer.first, this.sigs.first);
    }

    public size(container: ElementRef, sig: SignatureBaseComponent) {
        sig.signaturePad.set("canvasWidth", container.nativeElement.clientWidth);
        sig.signaturePad.set("canvasHeight", container.nativeElement.clientHeight);
        this.setOptions();
    }

    delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    public setOptions() {
        this.sigs.first.signaturePad.set("penColor", "rgb(6, 12, 46)");
        this.sigs.first.signaturePad.set("backgroundColor", "rgb(230, 233, 250)");
        this.sigs.first.signaturePad.clear();
    }

    public submit() {
        this.isAnyOperationIsInprogress = true;
        var blob = this.dataURItoBlob(this.sigs.first.signature);
        const formData = new FormData();
        formData.append("file0", blob);
        this.dashboardService.UploadFile(formData, this.moduleTypeId).subscribe((result: any) => {
            if (result.success === true) {
                this.signatureUrl = result.data ? result.data[0].filePath : null;
                if (this.signatureUrl) {
                    this.UpsertfileCompleted();
                }
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        })
    }

    cancel() {
        this.signatureEdit = false;
    }

    dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(",")[0].indexOf("base64") >= 0) {
            byteString = atob(dataURI.split(",")[1]);
        } else {
            byteString = unescape(dataURI.split(",")[1]);
        }
        // separate out the mime component
        var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }

    public clear() {
        this.sigs.first.clear();
    }
}
