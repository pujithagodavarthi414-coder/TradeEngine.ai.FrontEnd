import { Component, Input, ChangeDetectorRef, ViewChildren, Output, EventEmitter } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject, Observable } from "rxjs";
import { SearchFolderModel } from "../models/search-folder-model";
import { ToastrService } from "ngx-toastr";
import { FolderModel } from "../models/folder-model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { map, takeUntil, tap } from "rxjs/operators";

import * as DocumentStore from "../store/reducers/index";
import { StoreConfigurationModel } from "../models/store-configuration-model";
import { Actions, ofType } from "@ngrx/effects";
import { UpsertFileModel } from "../models/upsert-file-model";
import { FileModel } from "../models/file-model";
import   Resumable from "resumablejs";
import { CookieService } from "ngx-cookie-service";
import { ActivatedRoute } from "@angular/router";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { DashboardFilterModel } from "../models/dashboardFilterModel";
import { ConstantVariables } from "../constants/constant-variables";
import { FileSizePipe } from "../pipes/filesize-pipe";
import { SoftLabelPipe } from "../pipes/softlabels.pipes";
import { ApiUrls } from "../../globaldependencies/constants/api-urls";
import { SoftLabelConfigurationModel, WorkspaceDashboardFilterModel, WorkspaceDashboardFilterDropdown } from '../models/softlabels-model';
import { Dashboard } from '../models/dashboard';
import { StoreManagementService } from '../services/store-management.service';
import "../../globaldependencies/helpers/fontawesome-icons";
import { FileResultModel } from '../models/fileResultModel';
import { FileActionTypes, CreateFileTriggered } from '@snovasys/snova-file-uploader';
import * as $_ from 'jquery';
const $ = $_;
import   cloneDeep_ from 'lodash/cloneDeep';
const cloneDeep = cloneDeep_;

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

@Component({
    selector: "app-document-store-system-app",
    templateUrl: "./document-store-app.component.html",
    styles: [`
    .documents-search-close {
        right: 12px!important;
        top: 12px!important;
    }
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
            height: 65px !important;
            min-height: 65px !important;
            min-width: 75px !important;
            max-width: 75px !important;
            padding: 0px 5px !important;
            margin: 3px 5px !important;
        }
    `]
})

export class DocumentStoreAppComponent extends CustomAppBaseComponent {
    @ViewChildren("upsertFolderPopup") upsertFolderPopup;
    @ViewChildren("fileUploadDropzonePopup") fileUploadDropzonePopup;
    @Output() isFilesExist = new EventEmitter<boolean>();

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data != null && data !== undefined && data !== this.dashboardId) {
            this.dashboardId = data;
            if (this.dashboardId) {
                this.folderReferenceId = this.dashboardId;
                this.getWorkspaceDashboardsFilter();
            } else {
                this.folderReferenceId = null;
            }
        }
    }

    @Input("dashboardName")
    set _dashboardName(data: string) {
        if (data != null && data !== undefined) {
            this.dashboardName = data;
        } else {
            this.dashboardName = "Documents";
        }
    }

    optionalParameters: any;
    dashboardId: string;
    dashboardName: string;
    workspaceDashboardFilterId: string;
    changedAppName: string;
    isEditAppName: boolean = false;
    isComponentRefresh: boolean;
    dashboardFilters: DashboardFilterModel;
    moduleTypeId = 9;
    folderReferenceTypeId = ConstantVariables.DocumentStoreRefrenceTypeId.toLowerCase();
    selectedParentFolderId: string;
    selectedStoreId: string;
    folderReferenceId: string;
    isButtonVisible: boolean = true;
    isReviewEnabled: boolean;
    filesInput: SearchFolderModel;
    isGrid: boolean = false;
    editFolderDetails: FolderModel;
    searchText: string;
    searchTextInput: string;
    isFolder: boolean;
    storeConfigurations: StoreConfigurationModel;
    workspaceFilterModel = new WorkspaceDashboardFilterDropdown();
    files: File[] = [];
    filesPresent: boolean;
    isFileUploadCompleted: boolean = false;
    isFolderUploadCompleted: boolean = false;
    fileIndex: number = 0;
    fileResultModel: FileResultModel[];
    storeConfigurations$: Observable<StoreConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    anyOperationInProgress: boolean;
    isTobeReviewed: boolean;
    progressValue: number;
    fileCounter: number = 1;
    uploadedFileNames = [];

    public ngDestroyed$ = new Subject();

    constructor(private cdRef: ChangeDetectorRef, private softLabelPipe: SoftLabelPipe,
        private toastr: ToastrService, private snackbar: MatSnackBar,
        private documentStore: Store<DocumentStore.State>, private actionUpdates$: Actions,
        private translateService: TranslateService, private filesize: FileSizePipe,
        private storeManagementService: StoreManagementService,
        private cookieService: CookieService, private route: ActivatedRoute) {
        super();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FileActionTypes.CreateFileCompleted),
                tap(() => {
                    this.anyOperationInProgress = false;
                    this.filesPresent = false;
                    this.closeUploadFilePopup();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FileActionTypes.CreateFileFailed),
                tap(() => {
                    this.anyOperationInProgress = false;
                })
            )
            .subscribe();

        let isFromSearch = false;
        this.getStoreConfigurations();
        this.route.url.subscribe((url) => {
            url.toString().includes('widgets') ? isFromSearch = true : isFromSearch = false;
        });
        if (isFromSearch) {
            this.route.params.subscribe((params) => {
                if (params["id"] !== undefined) {
                    this.folderReferenceId = params["id"];
                }
            });
        }
        // this.folderReferenceId = "defe7467-2c67-408f-b165-4837dcd84361";
    }

    ngOnInit() {
        super.ngOnInit();
    }

    getStoreConfigurations() {
        this.storeManagementService.getStoreConfiguration().subscribe((result: any) => {
            if (result.success) {
                this.storeConfigurations = result.data;
            }
        });
    }

    filesSelected(event) {
        this.files.push(...event.addedFiles);
        if (event.rejectedFiles.length > 0) {
            if (event.rejectedFiles[0].size > this.storeConfigurations.maxStoreSize) {
                this.toastr.error("", this.translateService.instant(ConstantVariables.FileSizeShouldNotExceed) + " " +
                    this.filesize.transform(this.storeConfigurations.maxStoreSize));
            } else if (this.storeConfigurations.fileExtensions.search(event.rejectedFiles[0].type)) {
                this.toastr.error("", this.translateService.instant(ConstantVariables.ThisFileTypeIsNotAllowed));
            }
        }
        if (this.files.length > 0) {
            this.filesPresent = true;
            this.isFilesExist.emit(true);
        }
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
        if (this.files.length > 0) {
            this.filesPresent = true;
            this.isFilesExist.emit(true);
        } else {
            this.filesPresent = false;
            this.isFilesExist.emit(false);
        }
    }

    editAppName() {
        this.isEditAppName = true;
        this.changedAppName = this.dashboardName;
    }

    keyUpFunction(event) {
        if (event.keyCode == 13) {
            this.updateAppName();
        }
    }

    updateAppName() {
        if (this.changedAppName) {
            const dashBoardModel = new Dashboard();
            dashBoardModel.dashboardId = this.dashboardId;
            dashBoardModel.dashboardName = this.changedAppName;
            this.storeManagementService.updateDashboardName(dashBoardModel)
                .subscribe((responseData: any) => {
                    const success = responseData.success;
                    if (success) {
                        this.snackbar.open("App name updated successfully", this.translateService.instant(ConstantVariables.success), { duration: 3000 });
                        this.dashboardName = JSON.parse(JSON.stringify(this.changedAppName));
                        this.changedAppName = '';
                        this.isEditAppName = false;
                        this.cdRef.detectChanges();
                    } else {
                        this.toastr.warning("", responseData.apiResponseMessages[0].message);
                    }
                });
        } else {
            const message = this.softLabelPipe.transform("Please enter app name", this.softLabels);
            this.toastr.warning("", message);
        }
    }

    searchByInput(event) {
        if (event.keyCode == 13) {
            this.searchTextInput = this.searchText;
        }
    }

    addUpsertFolderPopup(upsertFolderPopover, folderDetails) {
        this.editFolderDetails = folderDetails;
        upsertFolderPopover.openPopover();
        this.isFolderUploadCompleted = false;
    }

    closeUpsertFolderPopup() {
        this.upsertFolderPopup.forEach((p) => p.closePopover());
        this.editFolderDetails = null;
        this.isFolderUploadCompleted = true;
    }

    closeSearch() {
        this.searchText = null;
        this.searchTextInput = this.searchText;
    }

    selectView(e) {
        this.isGrid = e; 
        //this.setAppHeight();     
    }

    setLabelNameForDropzone(fileName) {
        return fileName.substring(0, 20) + "...";
    }

    addUploadFilePopupOpen(fileUploadDropzonePopup) {
        fileUploadDropzonePopup.openPopover();
        this.isFileUploadCompleted = false;
    }

    closeUploadFilePopup() {
        this.fileUploadDropzonePopup.forEach((p) => p.closePopover());
        this.isTobeReviewed = false;
        this.files = [];
        this.fileResultModel = [];
    }

    saveFiles() {
        this.anyOperationInProgress = true;
        const formData = new FormData();
        this.files.forEach((file: File) => {
            this.fileIndex = this.fileIndex + 1;
            const fileKeyName = "file" + this.fileIndex.toString();
            formData.append(fileKeyName, file);
        });

        this.UploaderOnInit(environment.apiURL + ApiUrls.UploadFileChunks);
    }

    upsertFiles(fileResultModel) {
        this.anyOperationInProgress = true;
        const upsertFileModel = new UpsertFileModel();
        const fileModelList = [];
        fileResultModel.forEach((element: FileResultModel) => {
            const fileModel = new FileModel();
            fileModel.fileName = element.fileName;
            fileModel.fileSize = element.fileSize;
            fileModel.filePath = element.filePath;
            fileModel.fileExtension = element.fileExtension;
            fileModel.isArchived = false;
            fileModelList.push(fileModel);
        });
        upsertFileModel.filesList = fileModelList;
        upsertFileModel.referenceTypeId = ConstantVariables.DocumentStoreRefrenceTypeId;
        upsertFileModel.isFromFeedback = false;
        upsertFileModel.referenceId = this.dashboardId != null ? this.dashboardId : this.folderReferenceId;
        upsertFileModel.fileType = this.moduleTypeId;
        upsertFileModel.isToBeReviewed = this.isTobeReviewed;
        if (this.selectedParentFolderId) {
            upsertFileModel.folderId = this.selectedParentFolderId;
        }
        if (this.selectedStoreId) {
            upsertFileModel.storeId = this.selectedStoreId;
        }
        // this.documentStore.dispatch(new CreateFileTriggered(upsertFileModel));
        this.storeManagementService.upsertMultipleFiles(upsertFileModel).subscribe((result: any) => {
            if (result.success) {
                this.snackbar.open(this.translateService.instant(ConstantVariables.FilesUploadedSuccessfully), "ok", {
                    duration: 3000
                });
                this.anyOperationInProgress = false;
                this.isFileUploadCompleted = true;
                this.filesPresent = false;
                this.closeUploadFilePopup();

            } else {
                this.toastr.error("", result.apiResponseMessages[0].message);
                this.anyOperationInProgress = false;
            }
        });
        this.anyOperationInProgress = false;
    }

    setParentFolderDetails(fileDetails) {
        if (fileDetails.dataItem) {
            this.selectedParentFolderId = fileDetails.dataItem.folderId;
        } else if (fileDetails.folderId) {
            this.selectedParentFolderId = fileDetails.folderId;
        }
        else {
            this.selectedParentFolderId = fileDetails;
        }
    }

    reviewFileChanged() {
        this.workspaceFilterModel.isReviewEnabled = this.isReviewEnabled;
        if (this.dashboardId) {
            this.updateWorkspaceDashboardFilters();
        }
    }

    updateWorkspaceDashboardFilters() {
        let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
        workspaceDashboardFilterModel.workspaceDashboardId = this.dashboardId;
        workspaceDashboardFilterModel.workspaceDashboardFilterId = this.workspaceDashboardFilterId;
        workspaceDashboardFilterModel.filterJson = JSON.stringify(this.workspaceFilterModel);
        this.storeManagementService.updateworkspaceDashboardFilter(workspaceDashboardFilterModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.workspaceDashboardFilterId = responseData.data;
                    this.cdRef.detectChanges();
                } else {
                    this.toastr.warning("", responseData.apiResponseMessages[0].message);
                    this.cdRef.markForCheck();
                }
            });
    }

    getWorkspaceDashboardsFilter() {
        this.anyOperationInProgress = true;
        let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
        workspaceDashboardFilterModel.workspaceDashboardId = this.dashboardId;
        this.storeManagementService.getWorkspaceDashboardFilter(workspaceDashboardFilterModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    if (responseData.data && responseData.data.length > 0) {
                        let dashboardFilters = responseData.data[0];
                        this.workspaceDashboardFilterId = dashboardFilters.workspaceDashboardFilterId;
                        let filters = JSON.parse(dashboardFilters.filterJson);
                        this.workspaceFilterModel = filters;
                        this.isReviewEnabled = filters.isReviewEnabled;
                    }
                }
            });
        this.anyOperationInProgress = false;
    }

    setAllowedFileExtensions() {
        if (this.storeConfigurations) {
            let extensions = this.storeConfigurations.fileExtensions;
            while (extensions.indexOf('/*') != -1) {
                extensions = extensions.replace('/*', ' ');
            }

            extensions = extensions.replace('.*', '');
            return extensions;
        }
    }


    private UploaderOnInit(url: string): void {
        let progress = 0;
        const r = new Resumable({
            target: url,
            chunkSize: 1 * 1024 * 1024, //3 MB
            query: { moduleTypeId: this.moduleTypeId },
            headers: {
                // enctype: "multipart/form-data",
                // "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${this.cookieService.get(LocalStorageProperties.CurrentUser)}`
            },
        });
        r.addFiles(this.files);
        r.on('fileAdded', (file, event) => {
            if (!this.fileResultModel || this.fileResultModel.length > 0) {
                this.fileResultModel = [];
                this.cdRef.detectChanges();
            }
            r.upload()
        });
        r.on('complete', (event) => {
            r.files.pop();
            this.progressValue = 0;
            this.filesPresent = false;
            this.uploadedFileNames = [];
            this.fileCounter = 1;
            this.fileIndex = 0;
            this.anyOperationInProgress = false;
            if (this.fileResultModel.length > 0) {
                this.upsertFiles(this.fileResultModel);
            }
        });
        r.on('progress', () => {
            progress = Math.round(r.progress() * 100);
            this.progressValue = progress;
            this.cdRef.detectChanges();
        });
        r.on('fileSuccess', (file, response) => {
            if (file && file.fileName) {
                if (!this.uploadedFileNames.find(x => x == file.fileName)) {
                    this.uploadedFileNames.push(file.fileName)
                    this.fileCounter = this.uploadedFileNames.length;

                    let result = JSON.parse(response);
                    if (result && result.length > 0) {
                        if (!this.fileResultModel) {
                            this.fileResultModel = [];
                        }
                        let fileResult = new FileResultModel();
                        fileResult.fileExtension = result[0].FileExtension;
                        fileResult.fileName = result[0].FileName;
                        fileResult.filePath = result[0].FilePath;
                        fileResult.fileSize = result[0].FileSize;
                        this.fileResultModel.push(fileResult);
                    }
                    this.cdRef.detectChanges();
                }
            }
        });
    }

    removeAllFiles() {
        this.filesPresent = false;
        this.files = [];
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
    
    fitContent(optionalParameters : any) {

        if(optionalParameters['gridsterView']) {   

            this.optionalParameters = optionalParameters; 
            //this.setAppHeight();
        }

    }
    

}
