import { Component, ChangeDetectorRef, ViewChildren, ViewChild, Input, Output, EventEmitter, OnInit, TemplateRef } from '@angular/core';

import { Subject } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { SearchFolderModel } from '../models/search-folder-model';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { StoreManagementService } from '../services/store-management.service';
import { FolderModel } from '../models/folder-model';
import { State } from "@progress/kendo-data-query";
import { Router, ActivatedRoute } from '@angular/router';
import { FileInputModel } from '../models/file-input-model';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryComponent } from 'ngx-gallery-9';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { FileModel } from '../models/file-model';
import { takeUntil, tap } from 'rxjs/operators';
import { ofType, Actions } from '@ngrx/effects';
import { FolderActionTypes } from '../store/actions/folder.actions';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../constants/constant-variables';
import { FetchSizedAndCachedImagePipe } from '../pipes/fetchSizedAndCachedImage.pipe';
import { StoreSearchModel } from '../models/store-search-model';
import { StoreModel } from '../models/store-model';
import "../../globaldependencies/helpers/fontawesome-icons";
import { FileActionTypes } from '@snovasys/snova-file-uploader';
import { FileActionTypes as FileDeleteActionTypes } from "../store/actions/file.actions";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { DomSanitizer } from '@angular/platform-browser';
import * as $_ from 'jquery';
const $ = $_;
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { MatDialog } from "@angular/material/dialog";



@Component({
    selector: "app-documents-folders-files",
    templateUrl: "folders-files-list.component.html",
    styles: [`
    .document-tree-panel-color
    {
        background-color : #fff !important;
    }
    
    .text-hover:hover {
        text-decoration: underline !important;
        color: #3da8b5 !important;
        font-size : 16px;
    }

    .pdf-height
    {
        height : calc(100vh - 180px) !important;
    }

    .video-panel-height
    {
        height: calc(100vh - 190px) !important;
    }

    .document-description-height
    {
        height:calc(100vh - 75px) !important;
    }`]
})

export class FoldresFilesListComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("reviewFilePopup") reviewFilePopup;
    @ViewChildren("upsertFolderPopup") upsertFolderPopup;
    @ViewChildren("deleteFolderPopup") deleteFolderPopup;
    @ViewChildren("deleteFilePopup") deleteFilePopup;
    @ViewChildren("renameFilePopup") upsertFileNamePopup;
    @ViewChild('previewPdfDialogComponent') previewpdfPopupComponentDialog: TemplateRef<any>;
    @ViewChild('previewofficeDialogComponent') previewOfficePopupComponentDialog: TemplateRef<any>;
    @ViewChild('previewcsvDialogComponent') previewCsvPopupComponentDialog: TemplateRef<any>;
    @ViewChild("formDirective") formDirective: FormGroupDirective;
    @ViewChild("onlyPreviewGallery") onlyPreviewGallery: NgxGalleryComponent;
    @ViewChildren("fileUploadDropzonePopup") fileUploadDropzonePopup;
    @Output() parentFolderId = new EventEmitter<boolean>();
    @Output() allStordetails = new EventEmitter<any>();
    @Output() showGrid = new EventEmitter<boolean>();

     @Input("userStoryId")
    set _userStoryId(data: string) {
        this.userStoryId = data;
    }

    @Input("selectedStoreId")
    set _selectedStoreId(data: any) {
        this.selectedStoreId = data;
    }

    @Input("isFileUploadCompleted")
    set _isFileUploadCompleted(data: any) {
        this.isFileUploadCompleted = data;
        if (this.isFileUploadCompleted) {
            if (this.fileDetailsData) {
                this.updatedFileId = null;
                this.updatedFileId = this.fileDetailsData.fileId;
            }
            this.showTreeView = true;
            this.closeUploadFilePopup(true);
        }
    }

    @Input("isFolderUploadCompleted")
    set _isFolderUploadCompleted(data: boolean) {
        this.isFolderUploadCompleted = data;
        if (this.isFolderUploadCompleted) {
            this.closeUpsertFolderPopup(true);
        }
    }

    @Input("selectedParentFolderId")
    set _selectedParentFolderId(data: any) {
        this.selectedParentFolderId = data;
    }

    @Input("folderReferenceId")
    set _folderReferenceId(data: any) {
        this.folderReferenceId = data;
    }

    @Input("folderReferenceTypeId")
    set _folderReferenceTypeId(data: any) {
        this.folderReferenceTypeId = data;
    }

    @Input("moduleTypeId")
    set _moduleTypeId(data: any) {
        this.moduleTypeId = data;
    }

    @Input("isFromDocumentsApp")
    set _isFromDocumentsApp(data: any) {
        this.isFromDocumentsApp = data;
    }

    @Input("isToNavigatecell")
    set _isToNavigatecell(data: any) {
        this.isToNavigatecell = data;
    }

    @Input("isGridView")
    set _isGridView(data: any) {
        this.isGrid = data;
        this.viewChange(this.isGrid);
    }

    @Input("searchText")
    set _searchText(data: any) {
        if (this.searchText != data) {
            this.searchText = data;
            this.getFoldersAndFiles();
        }
    }

    @Input("isReviewEnabled")
    set _isReviewEnabled(data: any) {
        this.isReviewEnabled = data;
    }

    @Input("permissionToUpload")
    set _permissionToUpload(data: any) {
        this.permissionToUpload = data;
    }

    @Input("permissionToDelete")
    set _permissionToDelete(data: any) {
        this.permissionToDelete = data;
    }

    @Input("isFromAudits")
    set _isFromAudits(data: any) {
        this.isFromAudits = data;
    }

    @Input("isFromConducts")
    set _isFromConducts(data: any) {
        this.isFromConducts = data;
    }

    @Input("isFromConductUnique")
    set _isFromConductUnique(data: any) {
        this.isFromConductUnique = data;
    }

    @Input("optionalParameters")
    set _optionalParameters(data: any) {
        if (data != null && data !== undefined) {
            this.optionalParameters = data;
        }
    }
    userStoryId: any;
    optionalParameters: any;
    isImagePreview: boolean = false;
    isAudioPreview: boolean = false;
    isPdfPreview: boolean = false;
    isVideoPreview: boolean = false;
    isOtherPreview: boolean = false;
    showTreeView: boolean = true;
    isDataExists: boolean = true;
    isButtonVisible: boolean = true;
    pageable: boolean = false;
    pageable1: boolean = false;
    isGrid: boolean = false;
    isFileRenameInprogress: boolean = false;
    isEnabled: boolean = true;
    isEditorVisible: boolean = false;
    isReviewInprogress: boolean;
    sortDirection: boolean = true;
    isFolder: boolean;
    isTreeviewExpanded: boolean;
    isFromDocumentsApp: boolean = true;
    isToNavigatecell: boolean = false;
    isReviewEnabled: boolean = false;
    permissionToUpload: boolean = false;
    permissionToDelete: boolean = false;
    isTreeviewPinned: boolean = false;
    isUserStore: boolean = false;
    isUsersParentStore: boolean = false;
    isFromAudits: boolean = false;
    isFromConducts: boolean = false;
    isFromConductUnique: boolean = false;
    anyOperationInProgress: boolean = false;
    loading: boolean = false;
    isFileUploadCompleted: boolean = false;
    isFolderUploadCompleted: boolean = false;
    removeFiles: boolean = false;
    isFromGoals: boolean = false;

    moduleTypeId: string;
    folderReferenceTypeId = ConstantVariables.DocumentStoreRefrenceTypeId.toLowerCase();
    selectedParentFolderId: string;
    selectedBreadcrumbFolderId: string;
    selectedStoreId: string;
    folderReferenceId: string;
    searchText: string;
    description: string;
    updatedFileId: string;
    updatedFolderId: string;
    deletedFileId: string;
    deletedFolderId: string;
    userStoreId: string;
    sortBy: string;
    folderParentId: string;
    folderName: string;

    fileDetailsData: FileInputModel;
    filesInput: SearchFolderModel;
    softLabels: SoftLabelConfigurationModel[];
    breadcrumb: FolderModel[];
    editFolderDetails: FolderModel;
    selectedFileDetails: FileModel;
    storeDetails: StoreModel;

    srcData: any;
    filesAndFoldersList: any;
    imagesList: any;
    deletedFolderDetail: any;
    selectedstoreDetails: any;
    pageSize: any = 10;
    pageNumber: any = 1;

    uploadFileForm: FormGroup;
    foldersListGridData: GridDataResult;
    filesListGridData: any;
    state1: State;
    public ngDestroyed$ = new Subject();
    //Variables Related to gallery
    galleryImages: NgxGalleryImage[];
    galleryOptions: NgxGalleryOptions[];
    pdf: any;
    office:any;
    csv:any;

    public initSettings = {
        plugins: 'paste print preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap textcolor emoticons autoresize',
        branding: false,
        auto_focus: true,
        link_assume_external_targets: true,
        max_chars: "800",
        height: "180",
        // powerpaste_allow_local_images: true,
        // powerpaste_word_import: 'prompt',
        // powerpaste_html_import: 'prompt',
        autoresize_bottom_margin: 20,
        max_height: 300,
        toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl'
    };

    constructor(private cdRef: ChangeDetectorRef, private sanitizer: DomSanitizer,
        private toastr: ToastrService, private storeManagementService: StoreManagementService,
        private router: Router, private snackbar: MatSnackBar, private datePipe: DatePipe,
        private translateService: TranslateService, private imagePipe: FetchSizedAndCachedImagePipe, private dialog: MatDialog,
        private actionUpdates$: Actions, private route: ActivatedRoute) {
        super();
        this.getSoftLabelConfigurations();
        this.state1 = {
            skip: 0,
            take: 10
        };
        this.galleryOptions = [
            {
                image: false, thumbnails: false, width: "100px", height: "100px", previewFullscreen: true, previewSwipe: true,
                previewZoom: true, previewRotate: true, previewCloseOnEsc: true, previewKeyboardNavigation: true,
            }
        ]

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FileActionTypes.CreateFileCompleted),
                tap(() => {
                    // this.filesInput = null;
                    if (this.fileDetailsData) {
                        this.updatedFileId = null;
                        this.updatedFileId = this.fileDetailsData.fileId;
                    }
                    this.showTreeView = true;
                    this.closeUploadFilePopup(true);
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FolderActionTypes.CreateFolderCompleted),
                tap(() => {

                    this.closeUpsertFolderPopup(true);
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FolderActionTypes.DeleteFolderCompleted),
                tap(() => {
                    // this.filesInput = null;
                    this.folderDeleteCompleted();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FileDeleteActionTypes.DeleteFileCompleted),
                tap(() => {
                    // this.filesInput = null;
                    this.fileDeleteCompleted();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FolderActionTypes.LoadFoldersAndFilesCompleted),
                tap(() => {
                    this.filesInput = null;
                    this.getFoldersAndFiles();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getUserStore();
        this.route.params.subscribe((routeParams) => {
            if (routeParams.storeId) {
                this.selectedStoreId = routeParams.storeId;
            }
            if (routeParams.folderId) {
                this.selectedParentFolderId = routeParams.folderId;
            }
            this.description = null;
            if ((this.userStoreId === this.selectedStoreId) && this.selectedParentFolderId) {
                this.checkIsItUserStore(this.selectedParentFolderId);
            }
        });
        this.initializeFileForm();
        // if (this.router.url.includes("/store")) {
        //     this.setFoldersInputModel();
        // } else {
        this.getFoldersAndFiles();
        // }
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    getUserStore() {
        this.storeManagementService.getStores(new StoreSearchModel()).subscribe((result: any) => {
            if (result.success) {
                this.userStoreId = result.data;
                this.selectedstoreDetails = result.data;
                this.allStordetails.emit(this.selectedstoreDetails);
                this.setUploadAndDeletePermissions();
            }
        });
    }

    setUploadAndDeletePermissions() {
        if (this.selectedStoreId && this.selectedstoreDetails && this.storeDetails) {
            this.selectedstoreDetails.forEach(element => {
                if (element.storeId == this.selectedStoreId && !element.isSystemLevel) {
                    this.permissionToUpload = ((this.canAccess_feature_EditStores) ? true : this.isUserStore) && this.storeDetails && !this.storeDetails.isCompany && !this.isUsersParentStore;
                }
            });
            this.permissionToDelete = (this.canAccess_feature_EditStores) && this.storeDetails && !this.storeDetails.isCompany;
        }
    }

    initializeFileForm() {
        this.uploadFileForm = new FormGroup({
            fileName: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(800)
                ])
            )
        });
    }

    editFileNamePopupOpen(upsertFileNamePopup, value) {
        this.selectedFileDetails = value;
        this.patchFolderForm(this.selectedFileDetails);
        upsertFileNamePopup.openPopover();
    }

    
    previewPdfPopup(filepath) {
    //this.pdf = filepath;
     this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(filepath);
     const dialogRef = this.dialog.open(this.previewpdfPopupComponentDialog, {
            width: "90vw",
            height: "90vh",
            maxWidth: "90vw",
            disableClose: true
        });
     }

     previewCsvPopup(filepath) {
        this.csv = filepath;
        const dialogRef = this.dialog.open(this.previewCsvPopupComponentDialog, {
               width: "90vw",
               height: "90vh",
               maxWidth: "90vw",
               disableClose: true
         });
        }

     previewOfficePopup(filepath) {
        this.office = filepath;
        const dialogRef = this.dialog.open(this.previewOfficePopupComponentDialog, {
               width: "90vw",
               height: "90vh",
               maxWidth: "90vw",
               disableClose: true
         });
        }

        closeDialog() {
            this.dialog.closeAll();
        }

    patchFolderForm(fileModel: FileModel) {
        this.uploadFileForm = new FormGroup({
            fileName: new FormControl(fileModel.name,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            )
        })
    }

    closeUpsertFilePopup() {
        this.upsertFileNamePopup.forEach((p) => p.closePopover());
        this.formDirective.resetForm();
        this.selectedFileDetails = null;
        this.isFileRenameInprogress = false;
    }

    upsertFileName() {
        this.isFileRenameInprogress = true;
        const fileModel = new FileModel();
        fileModel.fileId = this.selectedFileDetails.id;
        fileModel.fileExtension = this.selectedFileDetails.fileExtension;
        fileModel.fileName = this.uploadFileForm.get('fileName').value;
        fileModel.filePath = this.selectedFileDetails.filePath;
        fileModel.fileSize = this.selectedFileDetails.size;
        fileModel.timeStamp = this.selectedFileDetails.timeStamp;
        fileModel.isArchived = false;
        this.storeManagementService.upsertFileName(fileModel)
            .subscribe((responseData: any) => {
                const success = responseData.success;
                if (!success) {
                    this.isFileRenameInprogress = false;
                    this.toastr.warning("", responseData.apiResponseMessages[0].message);
                } else {
                    this.closeUpsertFilePopup();
                    this.updatedFileId = responseData.data;
                    // this.filesInput = null;
                    this.showTreeView = true;
                    this.getFoldersAndFiles();
                }
            })
    }

    getFoldersAndFiles() {
        this.loading = true;
        let searchFolderModel = this.setFoldersInputModel();
        this.storeManagementService.getFolders(searchFolderModel).subscribe((response: any) => {
            this.isFileUploadCompleted = false;
            if (response.success == true && response.data) {
                this.selectedBreadcrumbFolderId = null;
                this.filesAndFoldersList = response.data.foldersAndFiles ? JSON.parse(response.data.foldersAndFiles) : [];
                this.breadcrumb = response.data.breadCrumb ? JSON.parse(response.data.breadCrumb) : [];
                this.storeDetails = response.data.store ? JSON.parse(response.data.store) : null;
                this.folderName = response.data.folderName;
                this.setUploadAndDeletePermissions();
                if (this.isFromDocumentsApp || this.router.url.includes("/projects") || this.isFromAudits || this.isFromConducts || this.isFromConductUnique) {
                    if (this.breadcrumb && this.breadcrumb.length > 0) {
                        this.breadcrumb.splice(0, 1);
                    }
                }
                if (this.router.url.includes("/projects")) {
                    this.isFromGoals = true;
                }

                if (this.filesAndFoldersList) {
                    this.filesListGridData = {
                        data: this.filesAndFoldersList,
                        total: this.filesAndFoldersList.length > 0 ? this.filesAndFoldersList[0].totalCount : 0,
                    }
                }
                this.description = this.urlify(response.data.parentFolderDescription);
                this.loading = false;

                this.setAppHeight();

                this.cdRef.detectChanges();               
            }
            else {
                if (response.apiResponseMessages && response.apiResponseMessages.length > 0)
                    this.toastr.error(response.apiResponseMessages[0].message);
                this.loading = false;
            }
            this.cdRef.detectChanges();
        });
    }

    setFoldersInputModel() {
        const searchFolderModel = new SearchFolderModel();
        if (this.selectedStoreId) {
            searchFolderModel.storeId = this.selectedStoreId;
        }
        if (this.selectedParentFolderId) {
            searchFolderModel.parentFolderId = this.selectedParentFolderId;
        }
        if (this.folderReferenceId) {
            searchFolderModel.folderReferenceId = this.folderReferenceId;
        }
        if (this.folderReferenceTypeId) {
            searchFolderModel.folderReferenceTypeId = this.folderReferenceTypeId;
        }
        searchFolderModel.isArchived = false;
        searchFolderModel.sortDirectionAsc = this.sortDirection;
        searchFolderModel.sortBy = this.sortBy;
        searchFolderModel.isTreeView = false;
        searchFolderModel.pageSize = this.pageSize;
        searchFolderModel.pageNumber = this.pageNumber;
        searchFolderModel.searchText = this.searchText;
        searchFolderModel.userStoryId = this.userStoryId;
        if (!this.filesInput) {
            this.filesInput = searchFolderModel;
        }
        this.cdRef.markForCheck();
        return searchFolderModel;
    }

    urlify(text) {
        if (text) {
            let result = text.replace(/^<p>(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?<\/p>/img, '<p><a href="https://$1" target="_blank" style="cursor:pointer">$1</a>');
            result = result.replace(/>(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z09+&@#\/%=~_|]<\/a>)/img, ' target="_blank" style="cursor:pointer">$1</a>');
            result = result.replace(/>([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)<\/a>)/img, ' target="_blank" style="cursor:pointer">$1</a>');
            //let formattedString = result.replace(/^<p>((https?:\/\/(?:www\.)?)?[a-z0-9]+(?:[-.][a-z0-9]+)*\.[a-z]{2,5})[^<>]*<\/p>/img, '<p><a href="$1" target="_blank" style="cursor:pointer">$1</a>');
            // result = result.replace(/^<p>(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/img, '<p><a href=$1 target="_blank" style="cursor:pointer">$1</a>');
            // console.log(details);
            return result;
        } else {
            return text;
        }
    }

    handleDescriptionEvent(event) {
        this.upsertFolderDescription();
        if (this.description === "") {
            this.description = null;
        }
        this.description = this.urlify(this.description);
        this.isEditorVisible = false;
    }

    upsertFolderDescription() {
        const folderModel = new FolderModel();
        folderModel.folderId = this.selectedParentFolderId;
        folderModel.description = this.description === "" ? null : this.description;
        this.storeManagementService.upsertFolderDescription(folderModel)
            .subscribe((responseData: any) => {
                const success = responseData.success;
                if (!success) {
                    this.toastr.warning("", responseData.apiResponseMessages[0].message);
                }
            })
    }

    public dataStateChangeFiles(state: DataStateChangeEvent): void {
        this.state1 = state;
        this.pageSize = this.state1.take;
        this.pageNumber = (this.state1.skip / this.state1.take) + 1;
        if (this.state1.sort[0]) {
            this.sortBy = this.state1.sort[0].field;
            this.sortDirection = this.state1.sort[0].dir == "asc" ? true : false;
        }
        this.getFoldersAndFiles();
    }

    reviewFilePopupOpen(event, reviewFilePopup) {
        this.fileDetailsData = event;
        reviewFilePopup.openPopover();
        this.isFolder = false;
    }

    closeReviewFilePopup() {
        this.fileDetailsData = null;
        this.reviewFilePopup.forEach((p) => p.closePopover());
    }

    reviewFile() {
        this.isReviewInprogress = true;
        this.fileDetailsData.fileId = this.fileDetailsData.id;
        this.storeManagementService.reviewFile(this.fileDetailsData).subscribe((response: any) => {
            if (response.success == true) {
                this.isReviewInprogress = false;
                this.closeReviewFilePopup();
                this.getFoldersAndFiles();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.isReviewInprogress = false;
            }
        });
    }

    navigate(folder) {
        if (!folder.dataItem.fileExtension) {
            // if (!this.isToNavigatecell) {
            //     this.selectedBreadcrumbFolderId = folder.dataItem.folderId ? folder.dataItem.folderId : null;
            //     this.router.navigate(["document/store", this.selectedStoreId, folder.dataItem.folderId.toLowerCase()]);
            // } else {
            this.selectedBreadcrumbFolderId = folder.dataItem.id ? folder.dataItem.id : null;
            this.navigateTreeview(folder);
            // }
        }
    }

    navigateGrid(folder) {
        // if (!this.isToNavigatecell) {
        //     this.selectedBreadcrumbFolderId = folder.folderId ? folder.folderId : null;
        //     this.router.navigate(["document/store", this.selectedStoreId, folder.folderId.toLowerCase()]);
        // } else {
        folder.folderId = folder.id;
        this.selectedBreadcrumbFolderId = folder.folderId ? folder.folderId : null;
        this.navigateGridTreeview(folder);
        // }
    }

    navigateTreeview(folder) {
        if (folder.dataItem.id && folder.dataItem.isFolder) {
            this.selectedStoreId = this.selectedStoreId ? this.selectedStoreId : null;
            this.selectedParentFolderId = folder.dataItem ? folder.dataItem.id : null;
            this.description = null;
            this.resetStates();
            this.getFoldersAndFiles();
            this.parentFolderId.emit(folder);
        }
    }

    navigateGridTreeview(folder) {
        this.selectedStoreId = this.selectedStoreId ? this.selectedStoreId : null;
        this.selectedParentFolderId = folder ? folder.folderId : null;
        this.description = null;
        this.resetStates();
        this.getFoldersAndFiles();
        this.parentFolderId.emit(folder);
    }

    navigateParentFolder(folder) {
        this.selectedStoreId = this.selectedStoreId ? this.selectedStoreId : null;
        this.selectedParentFolderId = folder ? folder.folderId : null;
        this.description = null;
        this.resetStates();
        this.getFoldersAndFiles();
        // this.parentFolderId.emit(folder);
    }

    goTo(folderId) {
        // if (!this.isToNavigatecell) {
        //     this.router.navigate(["document/store", this.selectedStoreId, folderId.toLowerCase()]);
        // } else {
        if (folderId !== this.selectedParentFolderId) {
            this.isImagePreview = false;
            this.isAudioPreview = false;
            this.isVideoPreview = false;
            this.isPdfPreview = false;
            this.isOtherPreview = false;
            this.selectedStoreId = this.selectedStoreId ? this.selectedStoreId : null;
            this.selectedParentFolderId = folderId ? folderId : null;
            this.selectedBreadcrumbFolderId = folderId ? folderId : null;
            this.description = null;
            this.resetStates();
            this.getFoldersAndFiles();
            this.parentFolderId.emit(folderId);
            // }
        }
    }

    goToStore() {
        this.router.navigate(["document/store", this.selectedStoreId]);
    }

    addUpsertFolderPopup(upsertFolderPopover) {
        this.editFolderDetails = null;
        upsertFolderPopover.openPopover();
    }

    addFolderFromParent(dataItem, upsertFolderPopover) {
        this.folderParentId = dataItem.id;
        upsertFolderPopover.openPopover();
    }

    editUpsertFolderPopup(event, upsertFolderPopover) {
        let details = event;
        details.folderName = event.name != null ? event.name : event.folderName;
        details.folderId = event.id != null ? event.id : event.folderId;
        this.editFolderDetails = details;
        this.isFolderUploadCompleted = false;
        upsertFolderPopover.openPopover();
    }

    closeUpsertFolderPopup(isSuccess) {
        if (isSuccess) {
            if (this.editFolderDetails) {
                this.updatedFolderId = null;
                this.updatedFolderId = this.editFolderDetails.folderId;
            } else {
                this.filesInput = null;
            }
            this.showTreeView = true;
            this.isFolderUploadCompleted = true;
            this.isDataExists = true;
            this.getFoldersAndFiles();
        }
        this.upsertFolderPopup.forEach((p) => p.closePopover());
        this.editFolderDetails = null;
        this.folderParentId = null;
    }

    deleteFolderPopupOpen(event, deleteFolderPopup) {
        let details = event;
        details.folderName = event.name != null ? event.name : event.folderName;
        details.folderId = event.id != null ? event.id : event.folderId;
        this.editFolderDetails = details;
        deleteFolderPopup.openPopover();
        this.isFolder = true;
    }

    cancelFolderDelete(result) {
        if (result) {
            if (this.editFolderDetails) {
                this.deletedFolderId = null;
                this.deletedFolderId = this.editFolderDetails.folderId;
                this.resetStates();
                this.getFoldersAndFiles();
            } else if (this.deletedFolderDetail) {
                this.getFolderDetailsById(this.deletedFolderDetail.folderId);
            }
            this.showTreeView = true;
        }
        this.fileDetailsData = null;
        this.editFolderDetails = null;
        this.folderParentId = null;
        this.deleteFolderPopup.forEach((p) => p.closePopover());
    }

    deleteFilePopupOpen(event, deleteFilePopup) {
        let details = event;
        if (event.id) {
            details.fileId = event.id;
        }
        this.fileDetailsData = details;
        deleteFilePopup.openPopover();
        this.isFolder = false;
    }

    cancelFileDelete(result) {
        if (result) {
            if (this.fileDetailsData) {
                this.deletedFileId = null;
                this.deletedFileId = this.fileDetailsData.fileId;
            }
            if (this.deletedFolderDetail) {
                this.selectedParentFolderId = this.deletedFolderDetail.folderId;
                this.selectedBreadcrumbFolderId = this.deletedFolderDetail.folderId;
                this.isImagePreview = false;
                this.isPdfPreview = false;
                this.isOtherPreview = false;
                this.isAudioPreview = false;
                this.isVideoPreview = false;
            }
            this.resetStates();
            this.getFoldersAndFiles();
        }
        this.fileDetailsData = null;
        this.editFolderDetails = null;
        this.folderParentId = null;
        this.deleteFilePopup.forEach((p) => p.closePopover());
    }

    openPreview(file) 
    {
        let filesList = [];
        file.fileId = file.id;
        filesList.push(file);
        this.filesAndFoldersList.forEach(element => {
            if (!element.isFolder && element.id != file.id)
            {
                if (element.fileExtension.toLowerCase() == '.jpeg' || element.fileExtension.toLowerCase() == '.jpg' || element.fileExtension.toLowerCase() == '.png')
                    filesList.push(element);
            }
        });
        const images = [];
        filesList.forEach(element => {
            const album = {
                small: this.imagePipe.transform(element.filePath, "50", "50"),
                big: this.imagePipe.transform(element.filePath, "", "")
            };
            images.push(album);
        });

        this.galleryImages = images;
        this.cdRef.detectChanges();
        this.onlyPreviewGallery.openPreview(0);
}


    downloadFile(file) {
        file.extension = file.extension == null ? file.fileExtension : file.extension;
        file.name = file.name == null ? file.folderName : file.name;
        let extension = file.extension;
        if (extension == ".pdf") {
            this.downloadPdf(file.filePath, file.name, file.extension);
        }
        // else if (file.extension.toLowerCase() == ".jpg" || file.extension.toLowerCase() == ".jpeg" || file.extension.toLowerCase() == ".png") {
        //     // var downloadAttachmentJson = file;
        //     // var downloadLink = document.createElement("a");
        //     //     document.body.appendChild(downloadLink);
        //     //     downloadLink.target = "_blank";
        //     //    // downloadLink.style = "display: none";
        //     //     //blob = new Blob([jsonAttachmentDownload], {type: "octet/stream"}),
        //     //    // downloadLink.href = window.URL.createObjectURL(blob);  // For chrome,firefox,opera and safari
        //     //    downloadLink.href = file.filePath; 
        //     //    downloadLink.download = file.name;
        //     //     downloadLink.click();
        //     var downloadAttachmentJson = file;
        //     toolingService.attachementDownload(downloadAttachmentJson,function(jsonAttachmentDownload) {
        //         var blob=new Blob([jsonAttachmentDownload], {type: "octet/stream"});
        //         var url = URL.createObjectURL(blob);
                
        //        if (navigator.appVersion.toString().indexOf('.NET') > 0){
        //             window.navigator.msSaveBlob(blob, file.filePath); // For IE browser
        //         }else{
        //             var a = document.createElement("a");
        //             document.body.appendChild(a);
        //            // a.style = "display: none";
        //             blob = new Blob([jsonAttachmentDownload], {type: "octet/stream"}),
        //             a.href = window.URL.createObjectURL(blob);  // For chrome,firefox,opera and safari
        //             a.download = "fileName";
        //             a.click();
        //         }
        //     });
        // } 
        else {
            const downloadLink = document.createElement("a");
            downloadLink.href = file.filePath;
            downloadLink.target = "_blank";
            downloadLink.download = file.name + "-" + this.datePipe.transform(new Date(), "yyyy-MM-dd") + file.fileExtension;
            downloadLink.click();
        }
    }

    downloadPdf(pdf, fileName, extension) {
        let fileType;
        fileType = extension == ".pdf" ? "data:application/pdf;base64," : (extension == ".xls" || extension == ".xlsx") ?
            "data:application/vnd.ms-excel," : null;
        this.storeManagementService.downloadFile(pdf).subscribe((responseData: any) => {
            const linkSource = fileType + responseData;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = fileName + "-" + this.datePipe.transform(new Date(), "yyyy-MM-dd") + extension;
            downloadLink.click();
        })
    }

    // inviteeForSignature(dataItem) {
    //     const dialogRef = this.dialog.open(SignatureInviteeDialogComponent, {
    //         minWidth: "60vw",
    //         height: "80vh",
    //         data: {
    //             referenceId: dataItem.fileId,
    //             canEdit: false,
    //             canDelete: true
    //         }
    //     });
    // }

    copyFileUrl(dataItem) {
        const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        const copyText = environment.domain + environment.apiURL + ApiUrls.GetGenericFileDetails + "?fileId=" + dataItem.id;
        const selBox = document.createElement("textarea");
        selBox.value = copyText;
        document.body.appendChild(selBox);
        selBox.select();
        selBox.setSelectionRange(0, 99999)   // For Mobile
        document.execCommand("copy");
        document.body.removeChild(selBox);
        this.snackbar.open(this.translateService.instant("USERSTORY.LINKCOPIEDSUCCESSFULLY"), this.translateService.instant(ConstantVariables.success), { duration: 3000 });
    }

    fileDetailsLength(value) {
        if (value && value.length > 0) {
            this.showTreeView = true;
            this.cdRef.detectChanges();
        } else {
            this.showTreeView = false;
            this.isDataExists = false;
            this.cdRef.detectChanges();
        }
    }

    selectedFileDetailsPreview(fileDetails) {
        this.srcData = null;
        this.isVideoPreview = false;
        this.isAudioPreview = false;
        this.cdRef.detectChanges();
        if (fileDetails.extension == null) {
            this.selectedParentFolderId = fileDetails.folderId;
            this.isImagePreview = false;
            this.isAudioPreview = false;
            this.isVideoPreview = false;
            this.isPdfPreview = false;
            this.isOtherPreview = false;
            this.srcData = null;
            this.cdRef.detectChanges();
            this.navigateGridTreeview(fileDetails);
            this.parentFolderId.emit(fileDetails);
        } else if (fileDetails.extension.toLowerCase() == ".jpg" || fileDetails.extension.toLowerCase() == ".jpeg" || fileDetails.extension.toLowerCase() == ".png") {
            this.isImagePreview = true;
            this.isAudioPreview = false;
            this.isPdfPreview = false;
            this.isOtherPreview = false;
            this.isVideoPreview = false;
            this.srcData = fileDetails;
            // this.navigateParentFolder(fileDetails);
            this.selectedParentFolderId = fileDetails ? fileDetails.folderId : null;
            this.parentFolderId.emit(fileDetails);
        } else if (fileDetails.extension.toLowerCase() == ".m4a" || fileDetails.extension.toLowerCase() == ".mp3") {
            this.isAudioPreview = true;
            this.isImagePreview = false;
            this.isPdfPreview = false;
            this.isOtherPreview = false;
            this.isVideoPreview = false;
            this.srcData = fileDetails;
            // this.navigateParentFolder(fileDetails);
            this.selectedParentFolderId = fileDetails ? fileDetails.folderId : null;
            this.parentFolderId.emit(fileDetails);
        } else if (fileDetails.extension.toLowerCase() == ".mp4" || fileDetails.extension.toLowerCase() == ".ogg") {
            this.isAudioPreview = false;
            this.isPdfPreview = false;
            this.isOtherPreview = false;
            this.isVideoPreview = true;
            this.srcData = fileDetails;
            // this.navigateParentFolder(fileDetails);
            this.selectedParentFolderId = fileDetails ? fileDetails.folderId : null;
            this.parentFolderId.emit(fileDetails);
        } else if (fileDetails.extension.toLowerCase() == ".pdf") {
            this.isPdfPreview = true;
            this.isOtherPreview = false;
            this.isImagePreview = false;
            this.isAudioPreview = false;
            this.isVideoPreview = false;
            this.srcData = fileDetails;
            if (!(fileDetails.sanitizedFilePath && fileDetails.sanitizedFilePath.changingThisBreaksApplicationSecurity)) {
                this.srcData.sanitizedFilePath = this.sanitizer.bypassSecurityTrustResourceUrl(fileDetails.filePath);
            }
            // this.navigateParentFolder(fileDetails);
            this.selectedParentFolderId = fileDetails ? fileDetails.folderId : null;
            this.parentFolderId.emit(fileDetails);
        } else {
            this.isPdfPreview = false;
            this.isOtherPreview = true;
            this.isImagePreview = false;
            this.isAudioPreview = false;
            this.isVideoPreview = false;
            this.srcData = fileDetails;
            // this.navigateParentFolder(fileDetails);
            this.selectedParentFolderId = fileDetails ? fileDetails.folderId : null;
            this.parentFolderId.emit(fileDetails);
        }
        // if (fileDetails.extension && (fileDetails.extension.toLowerCase() == '.jpg' || fileDetails.extension.toLowerCase() == '.jpeg' || fileDetails.extension.toLowerCase() == '.png')) {
        //     let imagesinaFolder = [];
        //     if (fileDetails.filesList && fileDetails.filesList.length > 0) {
        //         imagesinaFolder.push(fileDetails.filePath);
        //         fileDetails.filesList.forEach(element => {
        //             if (element.extension && (element.extension.toLowerCase() == '.jpg' || element.extension.toLowerCase() == '.jpeg' || element.extension.toLowerCase() == '.png')) {
        //                 if (element.fileId != fileDetails.fileId) {
        //                     imagesinaFolder.push(element.filePath);
        //                 }
        //             }
        //         });
        //     } else {
        //         imagesinaFolder.push(fileDetails.filePath);
        //     }
        //     this.imagesList = imagesinaFolder;
        //     if (this.imagesList && this.imagesList.length > 0) {
        //         this.openImagesPreview();
        //     }
        // }
    }

    openImagesPreview() {
        let images = [];
        this.imagesList.forEach(item => {
            const result = item.split(".");
            const fileExtension = result.pop();
            const album = {
                small: this.imagePipe.transform(item, "50", "50"),
                big: this.imagePipe.transform(item, "", "")
            }
            images.push(album);
        })
        this.galleryImages = images;
        this.cdRef.detectChanges();
        this.onlyPreviewGallery.openPreview(0);
    }

    resetStates() {
        this.state1 = {
            skip: 0,
            take: 10
        };
        this.pageSize = this.state1.take;
        this.pageNumber = (this.state1.skip / this.state1.take) + 1;
    }

    openFolderMenu(event: MouseEvent, viewChild: MatMenuTrigger) {
        event.preventDefault();
        viewChild.openMenu();
    }

    openFileMenu(event: MouseEvent, viewChild: MatMenuTrigger) {
        event.preventDefault();
        viewChild.openMenu();
    }

    pinTreeView() {
        this.isTreeviewPinned = !this.isTreeviewPinned;
        if (!this.isTreeviewPinned) {
            this.selectedBreadcrumbFolderId = this.selectedParentFolderId;
        }
    }

    addUploadFilePopupOpen(fileUploadDropzonePopup) {
        fileUploadDropzonePopup.openPopover();
        this.removeFiles = true;
    }

    closeUploadFilePopup(isSuccess) {
        this.showTreeView = true;
        this.removeFiles = false;
        this.cdRef.detectChanges();
        this.fileUploadDropzonePopup.forEach((p) => p.closePopover());
        if (isSuccess) {
            this.isFileUploadCompleted = true;
            this.isDataExists = true;
            this.getFoldersAndFiles();
        }
    }

    closeDescriptionEditor() {
        this.isEditorVisible = false;
    }

    fileRenameCompleted(fileDetails) {
        if (fileDetails.folderId == this.selectedParentFolderId) {
            this.getFoldersAndFiles();
        }
    }

    setLabelNameForDropzone(fileName) {
        if (fileName) {
            if (fileName.length > 15) {
                return fileName.substring(0, 15) + "...";
            } else {
                return fileName;
            }
        }
    }

    getFolderDetailsById(folderId) {
        this.storeManagementService.getFolderDetailsById(folderId).subscribe((responseData: any) => {
            let details = responseData.data;
            this.selectedParentFolderId = details.parentFolderId;
            this.selectedBreadcrumbFolderId = details.parentFolderId;
            this.getFoldersAndFiles();
        });
    }

    deletedFolderDetails(event) {
        this.deletedFolderDetail = event;
    }

    checkIsItUserStore(folderId) {
        this.storeManagementService.isUsersStore(folderId).subscribe((responseData: any) => {
            const success = responseData.success;
            if (success) {
                this.isUserStore = responseData.data;
            }
        });
    }

    setParentFolderId(event) {
        if (!this.selectedParentFolderId) {
            this.selectedParentFolderId = event;
        }
    }

    isToExpandTreeview(isExpanded) {
        this.isTreeviewExpanded = isExpanded;
    }

    viewChange(event: boolean) {
        this.isGrid = event;
        this.showGrid.emit(event);
        
        if (this.isGrid) {
            this.pageSize = null;
            this.pageNumber = null;
        } else {
            this.pageSize = this.state1.take;
            this.pageNumber = (this.state1.skip / this.state1.take) + 1;
        }
        this.getFoldersAndFiles();
    }

    pdfApplicationLink(filePath): any {
        if (filePath) {
            let data = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
            return data;
        }
    }

    fileDeleteCompleted() {
        if (this.fileDetailsData) {
            this.deletedFileId = null;
            this.deletedFileId = this.fileDetailsData.fileId;
        }
        if (this.deletedFolderDetail) {
            this.selectedParentFolderId = this.deletedFolderDetail.folderId;
            this.selectedBreadcrumbFolderId = this.deletedFolderDetail.folderId;
            this.isImagePreview = false;
            this.isPdfPreview = false;
            this.isAudioPreview = false;
            this.isVideoPreview = false;
            this.isOtherPreview = false;
        }
        this.resetStates();
        this.getFoldersAndFiles();
    }

    folderDeleteCompleted() {
        if (this.editFolderDetails) {
            this.deletedFolderId = null;
            this.deletedFolderId = this.editFolderDetails.folderId;
            this.resetStates();
            this.getFoldersAndFiles();
        } else if (this.deletedFolderDetail) {
            this.getFolderDetailsById(this.deletedFolderDetail.folderId);
        }
        this.showTreeView = true;
    }

    ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    setAppHeight() {

        var optionalParameters = this.optionalParameters;

        var interval;
        var count = 0;

        if (optionalParameters) {
        if(optionalParameters['gridsterView']) {             

           interval = setInterval(() => {
                try {
        
                  if (count > 30) {
                    clearInterval(interval);
                  }
        
                  count++;
        
                    var viewSelector = optionalParameters['gridsterViewSelector'];
                    if ($(viewSelector + ' #document-store-system-app .folders-files-list-height .document-view').length > 0) {                          

                        var appHeight = $(viewSelector).height();
                        var appWidth = $(viewSelector).width();
                                                    
                        var documentHeight = (appWidth <= 500)? (appHeight - 128) : (appHeight - 100);                                                          
                        $(viewSelector + ' #document-store-system-app .folders-files-list-height').css({"height": documentHeight});
                    
                        if(this.isGrid){
                            var gridHeight = (appWidth <= 500)? (appHeight - 238) : (appHeight - 178);
                            $(viewSelector + ' #document-store-system-app .folders-files-list-height .document-view').css({"height": gridHeight});
                        }
                        else{

                            var contentHeight = (appWidth <= 500)? (appHeight - 308) : (appHeight - 250); 
                            var listHeight = contentHeight <= 42? 42 : contentHeight;
                            $(viewSelector + ' #document-store-system-app .folders-files-list-height .k-grid-content').css({"height": listHeight});
                            $(viewSelector + ' #document-store-system-app .folders-files-list-height .k-grid-content').addClass('widget-scroll');
                            $(viewSelector + ' #document-store-system-app .folders-files-list-height .k-grid-pager').css({"height": 35});                        
                        }
        
                        var treeHeight = (appWidth <= 500)? (appHeight - 158) : (appHeight - 118);
                        $(viewSelector + ' #document-store-system-app #treeview').css({"height": treeHeight});         
                                                     
                        clearInterval(interval);
                    }

        
                } catch (err) {
                  clearInterval(interval);
                }
              }, 1000);

        }}
    }

}
