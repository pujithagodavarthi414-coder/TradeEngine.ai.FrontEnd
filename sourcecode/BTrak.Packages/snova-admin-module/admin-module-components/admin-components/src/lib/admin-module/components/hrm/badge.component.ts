import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { BadgeModel } from "../../models/hr-models/badge-model";
import { HRManagementService } from "../../services/hr-management.service";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { ConstantVariables } from '../../helpers/constant-variables';
import { FileResultModel } from '../../models/file-result-model';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { FetchSizedAndCachedImagePipe } from '../../pipes/fetchSizedAndCachedImage.pipe';
import { NgxGalleryComponent, NgxGalleryImage, NgxGalleryOptions } from "ngx-gallery-9";

@Component({
    selector: "app-fm-component-badge",
    templateUrl: `badge.component.html`,
    styles: [`
    .custom-dropzone {
        height: 85px;
        border-radius: 5px;
        font-size: 20px;
    }
    .custom-dropzone .custom-dropzone-label {
        font-size: 10px;
        margin: 5px auto;
        overflow: hidden !important;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .custom-dropzone .custom-dropzone-preview {
        height: 58px !important;
        min-height: 58px !important;
        min-width: 75px !important;
        max-width: 75px !important;
        padding: 0px 5px !important;
        margin: 3px 5px !important;
    }
    .custom-dropzone-label:hover:before {
        background: #444;
        border-radius: 8px;
        color: #fff;
        content: attr(data-tip);
        font-size: 16px;
        padding: 13px;
    }
`]

})

export class BadgeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChild("onlyPreviewGallery") onlyPreviewGallery: NgxGalleryComponent;
    @ViewChild("onlyGallery") onlyGallery: NgxGalleryComponent;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }
    @ViewChildren("upsertBadgePopUp") upsertBadgePopover;
    @ViewChildren("deleteBadgePopUp") deleteBadgePopover;

    dashboardFilters: DashboardFilterModel;

    public isArchived = false;
    badges: BadgeModel[];
    isAnyOperationIsInprogress = false;
    badge: BadgeModel;
    badgeName: string;
    description: string;
    files: File[] = [];
    imageUrl: string;
    badgeId: string;
    isThereAnError = false;
    validationMessage: string;
    timeStamp: any;
    badgeEdit: string;
    badgeForm: FormGroup;
    isFiltersVisible: boolean;
    searchText: string;
    moduleTypeId = 1;
    filesPresent: boolean;
    temp: any;
    referenceTypeId = ConstantVariables.BadgeReferenceTypeId;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isFileExist: boolean;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    fileResultModel$: Observable<FileResultModel[]>;
    fileResultModel: FileResultModel[];
    public ngDestroyed$ = new Subject();
    canAccess_feature_ManageBadges: Boolean;

    constructor(
        private translateService: TranslateService, private hrManagementService: HRManagementService,
        public snackbar: MatSnackBar, private cdRef: ChangeDetectorRef, private imagePipe: FetchSizedAndCachedImagePipe,
        private toastr: ToastrService, private fileUploadService: MasterDataManagementService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        if (this.canAccess_feature_ManageBadges == true) {
            this.getAllBadges();
        }
        this.galleryOptions = [
            {
                image: false, thumbnails: false, width: "0px", height: "0px", previewFullscreen: true, previewSwipe: false,
                previewZoom: true, previewRotate: true, previewCloseOnEsc: true, previewKeyboardNavigation: true,
                imageArrows: false, previewArrows: false, previewCloseOnClick: true
            }
        ]
    }

    getAllBadges() {
        this.isAnyOperationIsInprogress = true;
        const badgeModel = new BadgeModel();
        badgeModel.isArchived = this.isArchived;
        this.hrManagementService.getBadges(badgeModel).subscribe((response: any) => {
            if (response.success === true) {
                this.badges = response.data;
                this.temp = this.badges;
                this.clearForm();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    filesSelected(event) {
        this.files = event.addedFiles;
        // this.files.push(...);
    }

    upsertBadge(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        if (this.files.length > 0) {
            const formData = new FormData();
            formData.append("file0", this.files[0]);
            this.fileUploadService.UploadFile(formData, this.moduleTypeId).subscribe((result: any) => {
                if (result.success === true) {
                    this.imageUrl = result.data ? result.data[0].filePath : null;
                    if (this.imageUrl) {
                        this.UpsertfileCompleted();
                        this.cdRef.detectChanges();
                    }
                } else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                    this.cdRef.detectChanges();
                }
                this.isAnyOperationIsInprogress = false;
            })
        } else {
            this.UpsertfileCompleted()
            this.cdRef.detectChanges();
        }
    }

    UpsertfileCompleted() {
        this.badge = this.badgeForm.value;
        this.badge.badgeName = this.badge.badgeName.trim();
        this.badge.badgeId = this.badgeId;
        this.badge.description = this.badge.description ? this.badge.description.trim() : null;
        this.badge.imageUrl = this.imageUrl;
        this.badge.timeStamp = this.timeStamp;
        this.hrManagementService.upsertBadge(this.badge).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertBadgePopover.forEach((p) => p.closePopover());
                this.isThereAnError = false;
                this.clearForm();
                this.getAllBadges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    deleteBadge() {
        this.isAnyOperationIsInprogress = true;
        this.badge = new BadgeModel();
        this.badge.badgeId = this.badgeId;
        this.badge.badgeName = this.badgeName;
        this.badge.description = this.description;
        this.badge.imageUrl = this.imageUrl;
        this.badge.timeStamp = this.timeStamp;
        this.badge.isArchived = !this.isArchived;
        this.hrManagementService.upsertBadge(this.badge).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteBadgePopover.forEach((p) => p.closePopover());
                this.isThereAnError = false;
                this.clearForm();
                this.getAllBadges();
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    filesExist(event) {
        this.isFileExist = event;
    }

    closeFilePopup() {
        // this.immigrationDetailsForm();
        // this.closePopover(this.formId);
    }

    createBadgePopupOpen(upsertBadgePopUp) {
        this.clearForm();
        upsertBadgePopUp.openPopover();
        this.badgeEdit = this.translateService.instant("BADGE.ADDBADGE");
    }

    closeUpsertBadgePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertBadgePopover.forEach((p) => p.closePopover());
    }

    editBadgePopupOpen(row, upsertBadgePopUp) {
        this.badgeForm.patchValue(row);
        this.badgeId = row.badgeId;
        this.badgeName = row.badgeName;
        this.description = row.description;
        this.badgeEdit = this.translateService.instant("BADGE.EDITBADGE");
        this.imageUrl = row.imageUrl;
        this.timeStamp = row.timeStamp;
        upsertBadgePopUp.openPopover();
    }

    deleteBadgePopUpOpen(row, deleteBadgePopUp) {
        this.badgeId = row.badgeId;
        this.badgeName = row.badgeName;
        this.description = row.description;
        this.imageUrl = row.imageUrl;
        this.timeStamp = row.timeStamp;
        deleteBadgePopUp.openPopover();
    }

    closeDeleteBadgeDialog() {
        this.isThereAnError = false;
        this.deleteBadgePopover.forEach((p) => p.closePopover());
    }

    openPreview(file, fromAdd) {
        const images = [];
        const album = {
            small: this.imagePipe.transform(file, "50", "50"),
            big: this.imagePipe.transform(file, "", "")
        };
        images.push(album);
        this.galleryImages = images;
        this.cdRef.detectChanges();
        if (fromAdd) {
            this.onlyPreviewGallery.openPreview(0);
        } else {
            this.onlyGallery.openPreview(0);
        }
    }

    deleteSelectedFile() {
        this.imageUrl = null;
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
    }

    clearForm() {
        this.badgeId = null;
        this.badge = null;
        this.isThereAnError = false;
        this.badgeName = null;
        this.description = null;
        this.imageUrl = null;
        this.validationMessage = null;
        this.files = [];
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.badgeForm = new FormGroup({
            badgeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(ConstantVariables.DescriptionLength)
                ])
            )
        })
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((badge) =>
            (badge.badgeName.toLowerCase().indexOf(this.searchText) > -1) ||
            (badge.description ? badge.description.toLowerCase().indexOf(this.searchText) > -1 : null)));
        this.badges = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
