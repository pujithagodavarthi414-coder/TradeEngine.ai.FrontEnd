import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { SignatureDialogComponent } from "./signature-dialog.component";
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryComponent } from "ngx-gallery-9";
import { DatePipe } from "@angular/common";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { HRManagementService } from '../../services/hr-management.service';
import { SignatureModel } from '../../models/signature-model';
import { FetchSizedAndCachedImagePipe } from '../../pipes/fetchSizedAndCachedImage.pipe';
import { EmployeeService } from '../../services/employee-service';

@Component({
    selector: "app-employee-signature",
    templateUrl: `employee-signature-invitations.component.html`
})

export class EmployeeSignatureComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChild("onlyPreviewGallery") onlyPreviewGallery: NgxGalleryComponent;
    isAnyOperationIsInprogress = false;
    profileUserId: string;
    permission: boolean;
    filteredList: any[] = [];
    galleryImages: NgxGalleryImage[];
    galleryOptions: NgxGalleryOptions[];
    validationMessage: string;
    invitations: GridDataResult = {
        data: [],
        total: 0
    };
    state: State = {
        skip: 0,
        take: 10
    };
    temp: any;
    searchText: string;
    loggedInUserId: string;
    roleFeaturesIsInProgress$: Observable<boolean>;

    constructor(
        private cookieService: CookieService, private toastr: ToastrService,
        private store: Store<State>, private cdRef: ChangeDetectorRef, private routes: Router, private dialog: MatDialog,
        private hrManagementService: HRManagementService, private translateService: TranslateService,
        private imagePipe: FetchSizedAndCachedImagePipe, private employeeService: EmployeeService,
        private datePipe: DatePipe) {
        super();
        if (this.routes.url.split("/")[3]) {
            this.profileUserId = this.routes.url.split("/")[3];
            this.loggedInUserId = this.routes.url.split("/")[3];
        } else {
            this.loggedInUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        }
        if (this.profileUserId &&
            this.profileUserId.toString().toLowerCase() ==
            this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase()) {
            this.permission = true;
        } else {
            this.permission = false;
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.getAllInvitations();
    }

    getAllInvitations() {
        this.state.skip = 0;
        this.state.take = 10;
        this.searchText = null;
        this.isAnyOperationIsInprogress = true;
        const signatureModel = new SignatureModel();
        signatureModel.inviteeId = this.loggedInUserId;
        signatureModel.isArchived = false;
        this.hrManagementService.getSignature(signatureModel).subscribe((response: any) => {
            if (response.success == true) {
                this.temp = response.data;
                this.filteredList = response.data;
                this.invitations = {
                    data: this.temp.slice(this.state.skip, this.state.take + this.state.skip),
                    total: this.temp.length
                }
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        let invitationsList = this.filteredList;
        if (this.state.sort) {
            invitationsList = orderBy(this.filteredList, this.state.sort);
        }
        this.invitations = {
            data: invitationsList.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.filteredList.length
        }
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        this.filteredList = this.temp.filter((signature) => signature.fileName.toLowerCase().indexOf(this.searchText) > -1);
        let invitationsList = this.filteredList;
        if (this.state.sort) {
            invitationsList = orderBy(this.filteredList, this.state.sort);
        }
        this.invitations = {
            data: invitationsList.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.filteredList.length
        }
    }

    viewSignature(row) {
        const signature = new SignatureModel();
        signature.referenceId = row.referenceId;
        signature.inviteeId = this.loggedInUserId;
        const dialogRef = this.dialog.open(SignatureDialogComponent, {
            minWidth: "60vw",
            minHeight: "80vh",
            disableClose: true,
            data: {
                signatureReference: signature,
                canEdit: this.permission,
                canDelete: true
            }
        });
        dialogRef.componentInstance.closeMatDialog.subscribe((isReload: boolean) => {
            if (isReload) { this.getAllInvitations(); }
        });
    }

    closeSearch() {
        this.filterByName(null);
    }

    goToUserProfile(selectedUserId) {
        this.routes.navigate(["dashboard/profile", selectedUserId, "overview"]);
    }

    openPreview(file) {
        this.galleryImages = [];
        this.galleryOptions = [
            {
                image: false, thumbnails: false, width: "100px", height: "100px", previewFullscreen: true, previewSwipe: true,
                previewZoom: true, previewRotate: true, previewCloseOnEsc: true, previewKeyboardNavigation: true,
                arrowPrevIcon: null, arrowNextIcon: null
            }
        ];
        this.cdRef.detectChanges();
        const images = [];
        const album = {
            small: this.imagePipe.transform(file.filePath, "50", "50"),
            big: this.imagePipe.transform(file.filePath, "", "")
        };
        images.push(album);
        this.galleryImages = images;
        this.cdRef.detectChanges();
        this.onlyPreviewGallery.openPreview(0);
    }

    downloadFile(file) {
        const parts = file.filePath.split("/");
        const loc = parts.pop();
        if (file.fileExtension == ".pdf") {
            this.downloadPdf(file.filePath);
        } else {
            const downloadLink = document.createElement("a");
            downloadLink.href = file.filePath;
            downloadLink.download = loc.split(".")[0] + "-" + this.datePipe.transform(new Date(), "yyyy-MM-dd") + "-File" + file.fileExtension;
            downloadLink.click();
        }
    }

    downloadPdf(pdf) {
        const parts = pdf.split("/");
        const loc = parts.pop();
        this.employeeService.downloadFile(pdf).subscribe((responseData: any) => {
            const linkSource = "data:application/pdf;base64," + responseData;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = loc.split(".")[0] + "-" + this.datePipe.transform(new Date(), "yyyy-MM-dd") + "-File.pdf";
            downloadLink.click();
        })
    }

}
