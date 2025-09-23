import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { SignatureDialogComponent } from "./signature-dialog.component";
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryComponent } from "ngx-gallery-9";
import { DatePipe } from "@angular/common";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { FetchSizedAndCachedImagePipe } from '../../pipes/fetchCachedImage.pipe';
import { SignatureModel } from '../../models/signature.model';
import '../../../globaldependencies/helpers/fontawesome-icons';
import * as introJs from 'intro.js/intro.js';
import { TranslateService } from '@ngx-translate/core';
import {SoftLabelPipe} from '../../pipes/soft-labels.pipe';
import {SoftLabelConfigurationModel} from '../../models/soft-labels.model';

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
    introJS = new introJs();
    multiPage: string = null;
    userId: string = '';
    isAssertModuleAccess: boolean = false;
    isTimeSheetModuleAccess: boolean = false;
    isHrModuleAccess: boolean = false;
    softLabels:SoftLabelConfigurationModel[];

    constructor(
        private cookieService: CookieService, private toastr: ToastrService,
        private cdRef: ChangeDetectorRef, private routes: Router, private dialog: MatDialog,
        private dashboardService: DashboardService, private imagePipe: FetchSizedAndCachedImagePipe,
        private datePipe: DatePipe,private route: ActivatedRoute,private translateService: TranslateService,private softLabel: SoftLabelPipe) {
        super();
        if (this.routes.url.split("/")[3]) {
            this.profileUserId = this.routes.url.split("/")[3];
            this.loggedInUserId = this.routes.url.split("/")[3];
        } else {
            this.loggedInUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        }
        if ((this.profileUserId &&
            this.profileUserId.toString().toLowerCase() ==
            this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase()) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
            this.permission = true;
        } else {
            this.permission = false;
        }
        this.route.queryParams.subscribe(params => {
            if (!this.multiPage) {
                this.multiPage = params['multipage'];
            }
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.getAllInvitations();
    }
    ngAfterViewInit() {
        this.introJS.setOptions({
            steps: [
                {
                    element: '#si-1',
                    intro: this.softLabel.transform(this.translateService.instant('INTROTEXT.SI-1'),this.softLabels),
                    position: 'bottom'
                },
                {
                    element: '#si-2',
                    intro: this.translateService.instant('INTROTEXT.SI-2'),
                    position: 'left'
                },
            ]
        });
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    getAllInvitations() {
        this.state.skip = 0;
        this.state.take = 10;
        this.searchText = null;
        this.isAnyOperationIsInprogress = true;
        const signatureModel = new SignatureModel();
        signatureModel.inviteeId = this.loggedInUserId;
        signatureModel.isArchived = false;
        this.dashboardService.getSignature(signatureModel).subscribe((response: any) => {
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
            if (this.multiPage == "true") {
                this.introStart();
                this.multiPage = null;
            }
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
        this.dashboardService.downloadFile(pdf).subscribe((responseData: any) => {
            const linkSource = "data:application/pdf;base64," + responseData;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = loc.split(".")[0] + "-" + this.datePipe.transform(new Date(), "yyyy-MM-dd") + "-File.pdf";
            downloadLink.click();
        })
    }
    public async introStart() {
        await this.delay(2000);
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
            //preserveQueryParams: true
        }

        this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
            this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase();
            let userModules = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModules));
            if (this.canAccess_feature_AssignAssetsToEmployee && (this.isAssertModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('26b9d4a9-5ac7-47d0-ab1f-0d6aaa9ec904') && x.isActive).length > 0)) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/assets"], navigationExtras);
            }
            else if (this.canAccess_feature_ViewHistoricalTimesheet && (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0)) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/timesheet-audit"], navigationExtras);
            }
            else if (this.canAccess_feature_ViewHistoricalTimesheet && (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0)) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/view-time-sheet"], navigationExtras);
            }
            else if (this.canAccess_feature_CanAccessPerformance && (this.isHrModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0)) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/performance"], navigationExtras);
            }
          });
    }
    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
