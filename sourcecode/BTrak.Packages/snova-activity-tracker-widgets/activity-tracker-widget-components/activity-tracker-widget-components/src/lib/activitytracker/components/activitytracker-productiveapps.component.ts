import { Component, OnInit, ViewChildren, ViewChild, ElementRef, Input, ChangeDetectorRef, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';

import { TranslateService } from '@ngx-translate/core';

import { ProductiveAppIconComponent } from './productionapp-icon.component';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { ActivityTrackerService } from '../services/activitytracker-services';
import { FetchSizedAndCachedImagePipe } from '../../globaldependencies/pipes/fetchSizedAndCachedImage.pipe';
import { FileSizePipe } from '../../globaldependencies/pipes/filesize-pipe';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { RolesModel } from '../models/role-model';
import { Page } from '../models/Page';
import { FileDetails } from '../models/all-food-orders';
import { fileModel } from '../models/fileModel';
import { GetAppUrlsModel } from '../models/get-app-urls-model';
import { AddAppUrlModel } from '../models/add-app-url-model';
import * as $_ from 'jquery';
import { ApplicationCategoryModel } from '../models/application-category.model';
import { AppCatogoryDialogComponent } from "./app-category/applicaton-category-dialog.component";
const $ = $_;


@Component({
    selector: 'app-fm-component-activitytracker-productiveapps',
    templateUrl: `activitytracker-productiveapps.component.html`
})

export class ActivityTrackerProductiveAppsComponent extends CustomAppBaseComponent {
    @ViewChild("myModal") divView: ElementRef;
    @ViewChildren("addIsProductivePopup") upsertIsProductivePopover;
    @ViewChildren("deleteIsProductivePopup") deleteIsProductivePopover;
    @ViewChildren("updateIsProductivePopup") updateIsProductivePopup;
    @ViewChild("passwordFormDirective") passwordFormDirective: FormGroupDirective;
    @ViewChild("psFormDirective") psFormDirective: FormGroupDirective;
    @ViewChildren("showReceiptsPopUp") showReceiptsPopover;
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("allSelected1") private allSelected1: MatOption;
    @ViewChild('fileDropzone') fileDropzone: any;
    @ViewChild("uniqueAppIcon") private uniqueAppIconDialog: TemplateRef<any>;

    @ViewChild("AppCatogoryDialogComponent") private appCategoryComponent: TemplateRef<any>;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    page = new Page();
    rowData: any[] = [];
    Roles: RolesModel[];
    productiveRoles: any;
    unProductiveRoles: any;
    // roleIds: any[];
    receiptsForAnOrder: any[] = [];
    FileResultModel: FileDetails[];
    fileDetails = new fileModel();
    selectedFiles: File[] = [];
    dummyFiles: File[] = [];
    validationMessage: string;
    // appUrlName: string;
    appUrlLogoFormData = new FormData();
    addProductiveAppForm: FormGroup;
    type: boolean;
    isProductive: boolean = false;
    productive: boolean = false;
    application: string;
    imageUrl: string;
    isRequired: boolean = true;
    isChecked: boolean = false;
    saveOrUpdate: string;
    appUrlNameId: string;
    selectedRoleIds: string[] = [];
    selectedRoleIdsUnproductive: string[] = [];
    isDropzone: boolean = true;
    isSelectAll: boolean = false;
    isSelectAllUnproductive: boolean = false;
    savingInProgress: boolean = false;
    screenImg: string;
    loading: boolean = false;
    searchText: string = '';
    temp: any;
    productiveRequired: boolean = true;
    unproductiveRequired: boolean = true;
    applicationCategories: any[];

    constructor(
        private cdRef: ChangeDetectorRef,
        private translateService: TranslateService,
        private activitytracker: ActivityTrackerService,
        private toastr: ToastrService,
        private imagePipe: FetchSizedAndCachedImagePipe,
        private filesize: FileSizePipe,
        public dialog: MatDialog) {
        super();
        // this.page.size = 10;
        // this.page.pageNumber = 0;
        // this.temp = [];
        // this.getActTrackerAppUrls();
    }

    ngOnInit() {
        super.ngOnInit();
        this.loading = true;
        this.formValidate();
        this.getAllRoles();
        this.type = null;
        this.page.size = 10;
        this.page.pageNumber = 0;
        this.temp = [];
        this.getAllApplicationCategories();
        this.getActTrackerAppUrls();
    }

    getAllApplicationCategories() {
        var genericApplicationCategoryModel = new ApplicationCategoryModel();
        genericApplicationCategoryModel.isArchived = false;
        this.activitytracker.getAllApplicationCategories(genericApplicationCategoryModel).subscribe((response: any) => {
            if (response.success == true) {
                this.applicationCategories = response.data;
                this.cdRef.detectChanges();
            }
        });
    }

    createAppCategory() {
        let dialogId = "application-category-create-dailog";
        const dialogRef = this.dialog.open(this.appCategoryComponent, {
            minWidth: "85vw",
            minHeight: "85vh",
            height: "70%",
            id: dialogId,
            data: { formPhysicalId: dialogId }
        });

        dialogRef.afterClosed().subscribe(() => {
            this.getAllApplicationCategories();
        });
    }

    formValidate() {
        this.appUrlLogoFormData = new FormData();
        this.resetFiles();
        this.productive = false;
        // this.appUrlName = null;
        // this.roleIds = null;
        this.isRequired = false;
        this.isChecked = false;
        this.addProductiveAppForm = new FormGroup({
            appUrlName: new FormControl({value: '', disabled: true},
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            applicationCategoryId: new FormControl('', null
            ),
            productiveRoleIds: new FormControl('',
                Validators.compose([
                    Validators.required
                ])
            ),
            // isApp: new FormControl('',
            //     Validators.compose([
            //         Validators.required
            //     ])
            // ),
            // isProductive: new FormControl('',
            //     Validators.compose([

            //     ])
            // ),
            unproductiveRoleIds: new FormControl('',
                Validators.compose([
                    Validators.required
                ])
            ),

        })
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
    }

    onFilesAdded(files: File[]) {
        if (files.length >= 2) {
            this.resetFiles();
            this.toastr.error("more than 1 logo can't be uploaded");
        } else {
            this.selectedFiles = files;
        }
    }

    onSelect(event) {
        if (event.addedFiles.length > 0) {
            if (this.selectedFiles.length == 0) {
                this.selectedFiles.push(...event.addedFiles);
            } else {
                this.toastr.error("", this.translateService.instant('ACTIVITYAPPS.CANNOTUPLOADMORETHAN1LOGO'));
            }
        } else {
            if (event.rejectedFiles[0].size > 5514432) {
                this.toastr.error("", this.translateService.instant('ACTIVITYAPPS.APPICONSHOULDNOTEXCEED') + " " +
                    this.filesize.transform(5514432));
            }
        }
    }

    onRemove(event) {
        console.log(event);
        this.selectedFiles.splice(this.selectedFiles.indexOf(event), 1);
        this.selectedFiles = [];
    }

    closeUpsertAddAppUrl(passwordFormDirective: FormGroupDirective) {
        passwordFormDirective.resetForm();
        this.resetFiles();
        //this.formValidate();
        this.isRequired = false;
        this.isChecked = false;
        setTimeout(() => this.passwordFormDirective.resetForm(), 0)
        this.addProductiveAppForm.clearValidators();
        this.upsertIsProductivePopover.forEach((p) => p.closePopover());
    }

    resetFiles() {
        this.selectedFiles = [];
        this.dummyFiles = null;
        // this.fileDropzone.service.fileCache = null;
        //this.fileDropzone.service.previews.length = 0;
        this.fileDropzone = null;
    }

    addProductiveAppPopup(addIsProductivePopup) {
        this.addProductiveAppForm.reset();
        this.resetFiles();
        this.changeValidators(1, false);
        this.changeValidators(2, false);
        this.productiveRoles = this.Roles;
        this.unProductiveRoles = this.Roles;
        this.isSelectAll = false;
        this.isSelectAllUnproductive = false;
        this.selectedRoleIdsUnproductive = [];
        this.selectedRoleIds = [];
        this.isRequired = false;
        this.isChecked = false;
        this.application = this.translateService.instant('ACTIVITYTRACKER.ADDAPPLICATION');
        this.saveOrUpdate = this.translateService.instant('ACTIVITYTRACKER.SAVE');
        this.appUrlNameId = null;
        this.imageUrl = null;
        this.isDropzone = true;
        addIsProductivePopup.openPopover();
    }

    onChange(mrChange: MatRadioChange) {
        if (mrChange.value == 1)
            this.type = true;
        else
            this.type = false;
        this.isChecked = true;
        this.isRequired = false;
    }

    search(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
        const temp = this.temp.filter(data =>
            (data.appUrlName == null ? null : data.appUrlName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.productiveValue == null ? null : data.productiveValue.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.applicationCategoryName == null ? null : data.applicationCategoryName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.roles == null ? null : data.roles.toString().toLowerCase().indexOf(this.searchText) > -1))
        this.rowData = temp;
    }

    closeSearch() {
        this.searchText = '';
        this.search(null);
    }

    closeDialog() {
        this.formValidate();
        this.resetFiles();
        this.upsertIsProductivePopover.forEach((p) => p.closePopover());
    }

    editAppUrls(rowDetails, appUrlsPopup) {
        this.resetFiles();
        this.productiveRoles = this.Roles;
        this.unProductiveRoles = this.Roles;
        this.addProductiveAppForm.patchValue(rowDetails);
        this.addProductiveAppForm.controls['appUrlName'].setValue(rowDetails.appUrlName);
        // if (rowDetails.isApp == true) {
        //     this.addProductiveAppForm.get('isApp').patchValue("1");
        // } else {
        //     this.addProductiveAppForm.get('isApp').patchValue("0");
        // }
        this.isRequired = false;
        this.isChecked = true;
        this.appUrlNameId = rowDetails.appUrlNameId;
        this.isDropzone = true;
        this.imageUrl = rowDetails.appUrlImage;
        if (this.imageUrl != null) {
            this.isDropzone = false;
        }
        // this.selectedFiles.push(rowDetails.appUrlImage);
        this.application = this.translateService.instant('ACTIVITYTRACKER.EDITAPPLIACTION');
        this.saveOrUpdate = this.translateService.instant('ACTIVITYTRACKER.UPDATE');
        if (this.addProductiveAppForm.get("productiveRoleIds").value != null && this.addProductiveAppForm.get("productiveRoleIds").value.length === this.Roles.length) {
            this.allSelected.select();
            this.isSelectAll = true;
            this.unproductiveRequired = false;
            this.productiveRequired = true;
            this.unProductiveRoles = [];
            this.changeValidators(1, false);
            this.changeValidators(2, true);
        } else if (this.addProductiveAppForm.get("productiveRoleIds").value != null && this.addProductiveAppForm.get("productiveRoleIds").value.length > 0) {
            this.allSelected.deselect();
            this.isSelectAll = false;
            if (this.addProductiveAppForm.value.productiveRoleIds) {
                var sRoles = this.addProductiveAppForm.value.productiveRoleIds;
                if (sRoles.length > 0) {
                    this.unProductiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
                } else {
                    this.unProductiveRoles = this.Roles;
                }
            }
            if ((this.addProductiveAppForm.get("productiveRoleIds").value != null && this.addProductiveAppForm.get("productiveRoleIds").value.length < this.Roles.length)
                || (this.addProductiveAppForm.get("productiveRoleIds").value == null &&
                    this.addProductiveAppForm.get("unproductiveRoleIds").value != null && this.addProductiveAppForm.get("unproductiveRoleIds").value.length < this.Roles.length)) {
                this.unproductiveRequired = true;
            }
            this.changeValidators(1, false);
            this.changeValidators(2, false);
        }

        if (this.addProductiveAppForm.get("unproductiveRoleIds").value != null && this.addProductiveAppForm.get("unproductiveRoleIds").value.length === this.Roles.length) {
            this.allSelected1.select();
            this.isSelectAllUnproductive = true;
            this.unproductiveRequired = true;
            this.productiveRequired = false;
            this.productiveRoles = [];
            this.changeValidators(1, true);
            this.changeValidators(2, false);
        } else if (this.addProductiveAppForm.get("unproductiveRoleIds").value != null && this.addProductiveAppForm.get("unproductiveRoleIds").value.length > 0) {
            this.allSelected1.deselect();
            this.isSelectAllUnproductive = false;
            if (this.addProductiveAppForm.value.unproductiveRoleIds != null) {
                var sRoles = this.addProductiveAppForm.value.unproductiveRoleIds;
                if (sRoles.length > 0) {
                    this.productiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
                } else {
                    this.productiveRoles = this.Roles;
                }
            }
            if ((this.addProductiveAppForm.get("unproductiveRoleIds").value != null && this.addProductiveAppForm.get("unproductiveRoleIds").value.length < this.Roles.length)
                || (this.addProductiveAppForm.get("unproductiveRoleIds").value == null &&
                    this.addProductiveAppForm.get("productiveRoleIds").value != null && this.addProductiveAppForm.get("productiveRoleIds").value.length < this.Roles.length)) {
                this.productiveRequired = true;
            }
            this.changeValidators(1, false);
            this.changeValidators(2, false);
        }

        appUrlsPopup.openPopover();
        this.cdRef.detectChanges();
    }

    enableDropZone() {
        this.isDropzone = true;
        this.imageUrl = null;
    }

    showReceiptsPopupOpen(row, showReceiptsPopUp) {
        if (row.appUrlImage != null) {
            let receipts = row.appUrlImage;
            const album = {
                small: this.imagePipe.transform(receipts, '50', '50'),
                big: this.imagePipe.transform(receipts, '', ''),
            };
            this.receiptsForAnOrder.push(album);
            this.receiptsForAnOrder = [];
        }
        showReceiptsPopUp.openPopover();
    }

    showAppIcon(row) {
        if (row.appUrlImage != null) {
            let receipts = row.appUrlImage;
            const album = {
                small: this.imagePipe.transform(receipts, '50', '50'),
                big: this.imagePipe.transform(receipts, '', ''),
            };
            this.receiptsForAnOrder.push(album);
            this.receiptsForAnOrder = [];
            return true;
        }
        // showReceiptsPopUp.openPopover();
    }

    openModal(value) {
        // (document.querySelector('.custom-application-modal') as HTMLElement).style.display = "block";
        // this.showSlides(value);
        console.log(value);
        let dialogId = "unique-app-icon-dialog";
        const dialogRef = this.dialog.open(this.uniqueAppIconDialog, {
            // height: "88%",
            // width: "45%",
            width: "auto",
            hasBackdrop: true,
            direction: "ltr",
            id: dialogId,
            data: { imageUrl: value, dialogId: dialogId },
            //data: value,
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe(() => {
            console.log("The dialog was closed");
        });
    }

    closeModal() {
        (document.querySelector('.custom-application-modal') as HTMLElement).style.display = "none";
    }

    showSlides(value) {
        (document.querySelector('.mySlides') as HTMLElement).style.display = "none";
        this.screenImg = value;
        (document.querySelector('.mySlides') as HTMLElement).style.display = "block";
    }

    closeReceiptsPopup() {
        this.receiptsForAnOrder = [];
        this.showReceiptsPopover.forEach((p) => p.closePopover());
    }

    getAllRoles() {
        var role = new RolesModel();
        role.isArchived = false;
        this.activitytracker.getAllRoles(role).subscribe((responseData: any) => {
            this.Roles = JSON.parse(JSON.stringify(responseData.data));
            this.productiveRoles = this.Roles;
            this.unProductiveRoles = this.Roles;
        });
    }

    addProductiveApp(formDirective: FormGroupDirective) {
        if (this.addProductiveAppForm.valid) {
            this.upsertFileForAppUrl(formDirective);
        }
        else {
            if (this.isChecked == false) {
                this.isRequired = true;
            }
        }

    }

    toggleRolesPerOne() {
        this.allSelected1.deselect();
        this.isSelectAllUnproductive = false;
        if (this.addProductiveAppForm.value.unproductiveRoleIds != null && this.addProductiveAppForm.value.unproductiveRoleIds.length > 0) {
            var index = this.addProductiveAppForm.value.unproductiveRoleIds.indexOf(0);
            if (index > -1) {
                var roles = this.addProductiveAppForm.value.unproductiveRoleIds;
                roles.splice(index, 1);
                this.addProductiveAppForm.get("unproductiveRoleIds").patchValue([]);
                this.addProductiveAppForm.get("unproductiveRoleIds").patchValue(roles);
            }
        }

        if (this.allSelected.selected) {
            this.allSelected.deselect();
            this.isSelectAll = false;
            var index = this.addProductiveAppForm.value.productiveRoleIds.indexOf(0);
            if (index > -1) {
                var roles = this.addProductiveAppForm.value.productiveRoleIds;
                roles.splice(index, 1);
                this.addProductiveAppForm.get("productiveRoleIds").patchValue([]);
                this.addProductiveAppForm.get("productiveRoleIds").patchValue(roles);
            }

            var sRoles = this.addProductiveAppForm.value.productiveRoleIds;
            if (sRoles.length > 0) {
                this.unProductiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
            } else {
                this.unProductiveRoles = this.Roles;
            }
            this.changeValidators(1, false);
            this.changeValidators(2, false);
            this.cdRef.detectChanges();
            return false;
        }
        if (
            this.addProductiveAppForm.get("productiveRoleIds").value.length === this.productiveRoles.length
        ) {
            this.allSelected.select();
            this.isSelectAll = true;
            if (this.productiveRoles.length == this.Roles.length) {
                this.unProductiveRoles = [];
                this.changeValidators(1, false);
                this.changeValidators(2, true);
            } else {
                var sRoles = this.addProductiveAppForm.value.productiveRoleIds;
                if (sRoles.length > 0) {
                    this.unProductiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
                } else {
                    this.unProductiveRoles = this.Roles;
                }
                this.changeValidators(1, false);
                this.changeValidators(2, false);
            }
            this.cdRef.detectChanges();
        } else if (this.addProductiveAppForm.get("productiveRoleIds").value.length < this.productiveRoles.length &&
            this.addProductiveAppForm.get("productiveRoleIds").value.length < this.Roles.length) {
            this.isSelectAll = false;
            var sRoles = this.addProductiveAppForm.value.productiveRoleIds;
            if (sRoles.length > 0) {
                this.unProductiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
            } else {
                this.unProductiveRoles = this.Roles;
            }
            this.cdRef.detectChanges();
        }
    }

    toggleAllRolesSelected() {
        if (this.allSelected.selected && this.isSelectAll == false) {
            this.addProductiveAppForm.get("productiveRoleIds").patchValue([
                ...this.productiveRoles.map((item) => item.roleId),
                0
            ]);
            this.selectedRoleIds = this.productiveRoles.map((item) => item.roleId);
            this.isSelectAll = true;
            var sRoles = this.addProductiveAppForm.value.productiveRoleIds;
            if (this.productiveRoles.length == this.Roles.length) {
                this.unProductiveRoles = [];
                this.changeValidators(1, false);
                this.changeValidators(2, true);
            } else {
                if (sRoles.length > 0) {
                    this.unProductiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
                } else {
                    this.unProductiveRoles = this.Roles;
                }
                this.changeValidators(1, false);
                this.changeValidators(2, false);
            }
            this.cdRef.detectChanges();
        } else {
            this.addProductiveAppForm.get("productiveRoleIds").patchValue([]);
            this.isSelectAll = false;
            this.unProductiveRoles = this.Roles;
            this.changeValidators(1, false);
            this.changeValidators(2, false);
            this.cdRef.detectChanges();
        }
    }

    changeValidators(n, set) {
        if (set) {
            if (n == 1) {
                // this.addProductiveAppForm.controls['productiveRoleIds'].clearValidators();
                this.addProductiveAppForm.controls["productiveRoleIds"].clearValidators();
                this.addProductiveAppForm.get("productiveRoleIds").updateValueAndValidity();
                this.productiveRequired = false;
            } else {
                // this.addProductiveAppForm.controls['unproductiveRoleIds'].clearValidators();
                this.addProductiveAppForm.controls["unproductiveRoleIds"].clearValidators();
                this.addProductiveAppForm.get("unproductiveRoleIds").updateValueAndValidity();
                this.unproductiveRequired = false;
            }
        } else {
            if (n == 1) {
                this.addProductiveAppForm.controls['productiveRoleIds'].setValidators([Validators.required]);
                this.productiveRequired = true;
            } else {
                this.addProductiveAppForm.controls['unproductiveRoleIds'].setValidators([Validators.required]);
                this.unproductiveRequired = true;
            }
        }
        this.addProductiveAppForm.updateValueAndValidity();
        this.cdRef.detectChanges();
    }

    toggleRolesPerOneUnproductive() {
        this.allSelected.deselect();
        this.isSelectAll = false;
        if (this.addProductiveAppForm.value.productiveRoleIds != null && this.addProductiveAppForm.value.productiveRoleIds.length > 0) {
            var index = this.addProductiveAppForm.value.productiveRoleIds.indexOf(0);
            if (index > -1) {
                var roles = this.addProductiveAppForm.value.productiveRoleIds;
                roles.splice(index, 1);
                this.addProductiveAppForm.get("productiveRoleIds").patchValue([]);
                this.addProductiveAppForm.get("productiveRoleIds").patchValue(roles);
            }
        }

        if (this.allSelected1.selected) {
            this.allSelected1.deselect();
            this.isSelectAllUnproductive = false;
            var index = this.addProductiveAppForm.value.unproductiveRoleIds.indexOf(0);
            if (index > -1) {
                var roles = this.addProductiveAppForm.value.unproductiveRoleIds;
                roles.splice(index, 1);
                this.addProductiveAppForm.get("unproductiveRoleIds").patchValue([]);
                this.addProductiveAppForm.get("unproductiveRoleIds").patchValue(roles);
            }

            var sRoles = this.addProductiveAppForm.value.unproductiveRoleIds;
            if (sRoles.length > 0) {
                this.productiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
            } else {
                this.productiveRoles = this.Roles;
            }
            this.changeValidators(1, false);
            this.changeValidators(2, false);
            this.cdRef.detectChanges();
            return false;
        }
        if (
            this.addProductiveAppForm.get("unproductiveRoleIds").value.length === this.unProductiveRoles.length
        ) {
            this.allSelected1.select();
            this.isSelectAllUnproductive = true;
            var sRoles = this.addProductiveAppForm.value.unproductiveRoleIds;
            if (sRoles.length == this.Roles.length) {
                this.productiveRoles = [];
                this.changeValidators(1, true);
                this.changeValidators(2, false);
            } else {
                if (sRoles.length > 0) {
                    this.productiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
                } else {
                    this.productiveRoles = this.Roles;
                }
                this.changeValidators(1, false);
                this.changeValidators(2, false);
            }
            this.cdRef.detectChanges();
        } else if (this.addProductiveAppForm.get("unproductiveRoleIds").value.length < this.unProductiveRoles.length &&
            this.addProductiveAppForm.get("unproductiveRoleIds").value.length < this.Roles.length) {
            this.isSelectAllUnproductive = false;
            var sRoles = this.addProductiveAppForm.value.unproductiveRoleIds;
            if (sRoles.length > 0) {
                this.productiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
            } else {
                this.productiveRoles = this.Roles;
            }
            this.changeValidators(1, false);
            this.changeValidators(2, false);
            this.cdRef.detectChanges();
        }
    }

    toggleAllRolesSelectedUnproductive() {
        if (this.allSelected1.selected && this.isSelectAllUnproductive == false) {
            this.addProductiveAppForm.get("unproductiveRoleIds").patchValue([
                ...this.unProductiveRoles.map((item) => item.roleId),
                0
            ]);
            this.selectedRoleIdsUnproductive = this.unProductiveRoles.map((item) => item.roleId);
            this.isSelectAllUnproductive = true;
            if (this.unProductiveRoles.length == this.Roles.length) {
                this.productiveRoles = [];
                this.changeValidators(1, true);
                this.changeValidators(2, false);
            } else {
                var sRoles = this.addProductiveAppForm.value.unproductiveRoleIds;
                if (sRoles.length > 0) {
                    this.productiveRoles = this.Roles.filter(f => !sRoles.includes(f.roleId));
                } else {
                    this.productiveRoles = this.Roles;
                }
                this.changeValidators(1, false);
                this.changeValidators(2, false);
            }
        } else {
            this.addProductiveAppForm.get("unproductiveRoleIds").patchValue([]);
            this.isSelectAllUnproductive = false;
            this.productiveRoles = this.Roles;
            this.changeValidators(1, true);
            this.changeValidators(2, false);
        }
        this.cdRef.detectChanges();
    }

    getActTrackerAppUrls() {
        let getAppUrlsModel = new GetAppUrlsModel();
        this.activitytracker.getActTrackerAppUrls(getAppUrlsModel).subscribe((response: any) => {
            if (response.success) {
                this.rowData = response.data;
                this.temp = this.rowData;
                this.page.totalElements = this.rowData.length;
                this.alingPageCount();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.loading = false;
            this.cdRef.detectChanges();
        });
    }

    upsertFileForAppUrl(formDirective: FormGroupDirective) {
        this.savingInProgress = true;
        var moduleTypeId = 5;
        if (this.selectedFiles.length == 0) {
            this.selectedFiles = [];
            this.upsertAppUrl(formDirective);
        }
        else {
            Array.from(this.selectedFiles).forEach(f => {
                let fileKeyName = "file";
                this.appUrlLogoFormData.append(fileKeyName, f)
                this.appUrlLogoFormData.append("isFromTracker", 'true');
            });
            this.activitytracker.UploadFile(this.appUrlLogoFormData, moduleTypeId).subscribe((response: any) => {
                if (response.success) {
                    this.FileResultModel = response.data;
                    var localimage = response.data[0].filePath;
                    this.imageUrl = localimage;
                    this.upsertAppUrl(formDirective);
                }
            });
        }
    }

    upsertAppUrl(formDirective: FormGroupDirective) {
        this.loading = true;
        let appProductive = new AddAppUrlModel();
        appProductive.AppUrlImage = this.imageUrl;
        appProductive.AppUrlName = this.addProductiveAppForm.controls['appUrlName'].value;
        appProductive.IsApp = this.type;
        appProductive.IsProductive = this.isProductive;
        appProductive.AppUrlNameId = this.appUrlNameId;
        appProductive.applicationCategoryId = this.addProductiveAppForm.value.applicationCategoryId;
        appProductive.ProductiveRoleIds = this.addProductiveAppForm.value.productiveRoleIds;
        appProductive.UnproductiveRoleIds = this.addProductiveAppForm.value.unproductiveRoleIds;
        this.activitytracker.upsertActTrackerAppUrls(appProductive).subscribe((response: any) => {
            if (response.success) {
                this.savingInProgress = false;
                formDirective.resetForm();
                this.resetFiles();
                this.formValidate();
                this.upsertIsProductivePopover.forEach((p) => p.closePopover());
                this.getActTrackerAppUrls();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.savingInProgress = false;
                this.toastr.error(response.apiResponseMessages[0].message);
            }
            this.imageUrl = null;
            this.loading = false;
        });
    }

    deleteAppUrls(rowDetails, deleteIsProductivePopup) {
        this.resetFiles();
        this.addProductiveAppForm.patchValue(rowDetails);
        this.isRequired = false;
        this.isChecked = true;
        this.appUrlNameId = rowDetails.appUrlNameId;
        this.changeValidators(1, true);
        this.changeValidators(2, true);
        this.cdRef.detectChanges();
        deleteIsProductivePopup.openPopover();
    }

    closedeleteAddAppUrl(psFormDirective: FormGroupDirective) {
        psFormDirective.resetForm();
        this.resetFiles();
        this.isRequired = false;
        this.isChecked = false;
        setTimeout(() => this.psFormDirective.resetForm(), 0)
        this.addProductiveAppForm.clearValidators();
        this.deleteIsProductivePopover.forEach((p) => p.closePopover());
        this.loading = false;
    }

    deleteAppUrl(formDirective: FormGroupDirective) {
        this.loading = true;
        let appProductive = new AddAppUrlModel();
        appProductive.AppUrlImage = this.imageUrl;
        appProductive.AppUrlName = this.addProductiveAppForm.controls['appUrlName'].value;
        appProductive.IsApp = this.type;
        appProductive.IsProductive = this.isProductive;
        appProductive.AppUrlNameId = this.appUrlNameId;
        appProductive.ProductiveRoleIds = this.addProductiveAppForm.value.productiveRoleIds;
        appProductive.UnproductiveRoleIds = this.addProductiveAppForm.value.unproductiveRoleIds;
        appProductive.IsArchive = true;
        this.activitytracker.upsertActTrackerAppUrls(appProductive).subscribe((response: any) => {
            if (response.success) {
                this.savingInProgress = false;
                formDirective.resetForm();
                this.resetFiles();
                this.formValidate();
                this.deleteIsProductivePopover.forEach((p) => p.closePopover());
                this.getActTrackerAppUrls();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.savingInProgress = false;
                this.toastr.error(response.apiResponseMessages[0].message);
            }
            this.imageUrl = null;
            this.loading = false;
        });
    }

    alingPageCount() {
        // var widthValue = $('datatable-footer .datatable-footer-inner .datatable-pager .pager').width();
        // var width = widthValue + 50 + "px";
        // $('app-fm-component-activitytracker-productiveapps datatable-footer .page-count').css("left", width);
    }
}
