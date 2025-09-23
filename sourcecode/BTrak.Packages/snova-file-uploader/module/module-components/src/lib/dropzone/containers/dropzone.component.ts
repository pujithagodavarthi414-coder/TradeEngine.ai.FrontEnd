import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject, combineLatest, EMPTY } from "rxjs";
import { DatePipe } from "@angular/common";

import { FileSizePipe } from "../pipes/filesize-pipe";
import { FetchSizedAndCachedImagePipe } from "../pipes/fetchSizedAndCachedImage.pipe";

import { FileResultModel } from "../models/fileResultModel";
import { FileModel } from "../models/file-model";
import { DeleteFileInputModel } from "../models/delete-file-input-model";
import { FileInputModel } from "../models/file-input-model";
import { SearchFileModel } from "../models/search-file-model";
import { UpsertFileModel } from "../models/upsert-file-model";
import { StoreConfigurationModel } from "../models/store-configuration-model";

import { StoreManagementService } from "../services/store-management.service";

import { DomSanitizer } from "@angular/platform-browser";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { CookieService } from "ngx-cookie-service";
import { ExpenseManagementModel } from "../models/expenses-model";
import Resumable from "resumablejs";
import { ApiUrls } from "../../globaldependencies/constants/api-urls";
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryComponent } from "ngx-gallery-9";
// import { AuthService, GoogleLoginProvider, SocialUser } from "angular-6-social-login";

let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

export class File extends Blob {
    readonly lastModified: number;
    _name: string;
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    setName(name) {
        this.name = name;
    }
}
@Component({
    selector: "app-dropzone",
    templateUrl: "./dropzone.component.html",
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

export class DropZoneComponent {
    @ViewChild("onlyPreviewGallery") onlyPreviewGallery: NgxGalleryComponent;
    @Input() isQuestionDocuments: boolean;
    @Input() questionDocumentId: any;
    @Input() userStoryId: string;
    @Input() referenceTypeId: string;
    @Input() fileTypeReferenceId: string;
    @Input() selectedStoreId: string;
    @Input() isButtonVisible: boolean;
    @Input() isFromFeedback: boolean;
    @Input() getFilesByReferenceId: boolean;
    @Output() isFilesExist = new EventEmitter<boolean>();
    @Output() closeFilePopup = new EventEmitter<any>();
    @Output() getFiles = new EventEmitter<string>();

    @Input("isFileUploaded")
    set _isFileUploaded(data: boolean) {
        this.isFileUploaded = data;
    }

    @Input("moduleTypeId")
    set _moduleTypeId(data: any) {
        if (data) {
            this.moduleTypeId = data;
            if (this.storeConfigurations && (this.moduleTypeId == 5 || this.moduleTypeId == 9)) {
                this.maxStoreSize = this.storeConfigurations.maxStoreSize;
                this.cdRef.markForCheck();
            }
            if (this.storeConfigurations) {
                this.maxStoreSize = this.storeConfigurations.maxStoreSize;
                this.maxFileSize = this.storeConfigurations.maxFileSize;
                this.cdRef.markForCheck();
            }
        }
    }

    @Input("referenceId")
    set referenceId(data: string) {
        this.folderReferenceId = data;
        this.getStoreConfigurations();
        if (data && this.getFilesByReferenceId) {
            this.getUploadedFilesDetails(data);
        } else {
            this.files = [];
            this.uploadedFiles$ = EMPTY;
        }
    }

    @Input("placeHolder")
    set placeHolder(data: string) {
        if (data) {
            this.placeholder = this.translateService.instant(data);
        } else {
            this.placeholder = this.translateService.instant(ConstantVariables.DragAndDropFilesHere);
        }
    }

    @Input("selectedParentFolderId")
    set _selectedParentFolderId(data: string) {
        if (data) {
            this.selectedParentFolderId = data;
        }
    }

    @Input("isToUploadFiles")
    set _isToUploadFiles(data: boolean) {
        if (data) {
            this.saveFiles();
        }
    }

    @Input("removeFiles")
    set _removeFiles(data: boolean) {
        if (data) {
            this.removeAllFiles();
        }
    }

    @Input("isAcceptSingleFile")
    set _isAcceptSingleFile(data: boolean) {
        this.isAcceptSingleFile = data;
        if (this.isAcceptSingleFile == true) {
            this.isMultiple = false;
        } else {
            this.isMultiple = true;
        }
    }

    
    customFileName: any;
    driveFiles: any = [];
    fileIndex: number = 0;
    filesPresent: boolean;
    isFileUploaded : boolean;
    referenceFileId: string;
    folderReferenceId: string;
    selectedParentFolderId: string;
    moduleTypeId: any;
    files: File[] = [];
    fileResultModel: FileResultModel[];
    storeConfigurations: StoreConfigurationModel;
    progressValue: number;
    fileCounter: number = 1;
    uploadedFileNames = [];
    uploadedFiles: FileInputModel[];
    fileNames: any;
    isLoading : boolean;
    isAcceptSingleFile: boolean;
    isMultiple: boolean;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    storeConfigurations$: Observable<StoreConfigurationModel[]>;
    fileResultModel$: Observable<FileResultModel[]>;
    anyOperationInProgress: boolean;
    uploadedFiles$: Observable<FileInputModel[]>;
    getFilesInProgress: boolean;
    uploadedFilesLength$: Observable<number>;
    uploadedFilesLength: number;
    imageExtensions = [".jpeg", ".jpg", ".png", ".gif"]
    videoExtensions = ['.m4v', '.avi', '.mpg', '.mp4', '.webm']
    isTobeReviewed: boolean = false;
    public ngDestroyed$ = new Subject();
    placeholder: string = this.translateService.instant(ConstantVariables.DragAndDropFilesHere);
    maxStoreSize: any;
    maxFileSize: any;
    fileExtensions: any;
    apiKey = 'AIzaSyAX9gZ8mIMVaQEZnhOOWwZKj8R1Df9SV1w'
    clientId = '1048031466236-8l9kbtb0oo2q121247a1ljgl14hmpatu.apps.googleusercontent.com'
    projectId = '1048031466236'
    scope = 'https://www.googleapis.com/auth/drive'
    DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
    pickerApiLoaded = false;
    oauthToken;
    token: any;
    bothFiles: boolean;
    enableDrive: boolean = false;
    // tslint:disable-next-line: max-line-length
    constructor(private actionUpdates$: Actions,
        private toastr: ToastrService, private translateService: TranslateService, private imagePipe: FetchSizedAndCachedImagePipe,
        private datePipe: DatePipe, private storeManagementService: StoreManagementService, private cdRef: ChangeDetectorRef,
        private filesize: FileSizePipe, private sanitization: DomSanitizer, private cookieService: CookieService,
    ) {
        this.moduleTypeId = 9;
    }

    ngOnInit() {
        this.galleryOptions = [
            {
                image: false, thumbnails: false, width: "0px", height: "0px", previewFullscreen: true, previewSwipe: true,
                previewZoom: true, previewRotate: true, previewCloseOnEsc: true, previewKeyboardNavigation: true
            }
        ]
    }

    // selectFromDrive() {
    //     this.showPickerDailog();
    //     this.handleClientLoad();
    // }
    // showPickerDailog() {
    //     //this.loadPicker()
    //     this.userSignIn();
    // }

    // userSignIn() {
    //     let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    //     this.socialAuthService.signIn(socialPlatformProvider).then(userData =>  {
    //         console.log(socialPlatformProvider+" sign in data : " , userData);
    //         this.loadPicker();
    //       }
    //     );
    // }

    // // Use the Google API Loader script to load the google.picker script.
    // loadPicker() {
    //     gapi.load('auth', { 'callback': () => this.onAuthApiLoad() });
    //     gapi.load('picker', { 'callback': () => this.onPickerApiLoad() });
    // }

    // onAuthApiLoad() {
    //     gapi.auth.authorize(
    //         {
    //             'client_id': '1048031466236-8l9kbtb0oo2q121247a1ljgl14hmpatu.apps.googleusercontent.com',
    //             'scope': ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.readonly'],
    //             'immediate': true
    //         },
    //         (res) => this.handleAuthResult(res));
    // }

    // onPickerApiLoad() {
    //     this.pickerApiLoaded = true;
    //     this.createPicker();
    // }

    // handleAuthResult(authResult) {
    //     if (authResult && !authResult.error) {
    //         this.oauthToken = authResult.access_token;
    //         this.createPicker();
    //     }
    // }

    // // Create and render a Picker object for searching images.
    // createPicker() {
    //     if (this.pickerApiLoaded && this.oauthToken) {
    //         //var view = new google.picker.View(google.picker.ViewId.DOCS);
    //         //view.setMimeTypes("image/png,image/jpeg,image/jpg");
    //         var picker = new google.picker.PickerBuilder()
    //             .enableFeature(google.picker.Feature.NAV_HIDDEN)
    //             .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
    //             .setAppId(this.projectId)
    //             .setOAuthToken(this.oauthToken)
    //             .addView(new google.picker.DocsView())
    //             .addView(new google.picker.DocsUploadView())
    //             .setDeveloperKey(this.apiKey)
    //             .setCallback((res) => this.pickerCallback(res))
    //             .build();
    //         picker.setVisible(true);
    //     }
    // }

    // // A simple callback implementation.
    // pickerCallback(data) {
    //     if (data.action == google.picker.Action.PICKED) {
    //         this.files.push(...data.docs);
    //         data.docs.forEach(element => {
    //             gapi.client.drive.files.get({
    //                 fileId: element.id,
    //                 'fields': "webContentLink, id, name"
    //             }).then((resp) => {
    //                 resp.result['moduleTypeId'] = this.moduleTypeId;
    //                 this.driveFiles.push(resp.result);
    //                 if (this.files.length > 0) {
    //                     this.filesPresent = true;
    //                     this.isFilesExist.emit(true);
    //                 }
    //                 this.cdRef.detectChanges();
    //             });
    //         });
    //         // var request = gapi.client.drive.files.get({
    //         //     fileId: data.docs[0].id,
    //         //     'fields': "webContentLink"
    //         //   }).then(function(resp) {
    //         //         console.log(resp);
    //         // });
    //         this.cdRef.detectChanges();
    //     }
    // }

    // handleClientLoad() {
    //     gapi.load('client:auth2', () => {
    //         gapi.client.init({
    //             apiKey: 'AIzaSyAX9gZ8mIMVaQEZnhOOWwZKj8R1Df9SV1w',
    //             clientId: '1048031466236-8l9kbtb0oo2q121247a1ljgl14hmpatu.apps.googleusercontent.com',
    //             discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    //             scope: 'https://www.googleapis.com/auth/drive',
    //         }).then(() => {
    //             if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
    //                 this.token = gapi.client.getToken();
    //                 gapi.client.drive.files.list({
    //                     'pageSize': 10,
    //                     'fields': "nextPageToken, files(id, name)"
    //                 }).then((response) => {
    //                     let files: any[] = [];
    //                     response.result.files.forEach((file) => files.push((file)));
    //                     //this.createPicker();
    //                     //return files;
    //                 });
    //             }
    //         }, (error) => {
    //         });
    //     });
    // }

    filesSelected(event) {
        if (this.isAcceptSingleFile == true && (this.uploadedFiles && this.uploadedFiles.length >= 1 || this.files && this.files.length >= 1)) {
            this.toastr.warning("", 'Single file is allowed');
            this.filesPresent = true;
            this.isFilesExist.emit(true);
            return;
        } else {
            this.files.push(...event.addedFiles);
            if (event.rejectedFiles.length > 0) {
                if (event.rejectedFiles[0].size > this.maxFileSize) {
                    this.toastr.error("", this.translateService.instant(ConstantVariables.FileSizeShouldNotExceed) + " " +
                        this.filesize.transform(this.maxFileSize));
                }
                else if (this.storeConfigurations.fileExtensions.search(event.rejectedFiles[0].type)) {
                    this.toastr.error("", this.translateService.instant(ConstantVariables.ThisFileTypeIsNotAllowed));
                }

            }
            if (this.files.length > 0) {
                this.filesPresent = true;
                this.isFilesExist.emit(true);
            }
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

    removeAllFiles() {
        this.filesPresent = false;
        this.files = [];
    }

    saveFiles() {
        if (this.isQuestionDocuments) {
            if (this.files && this.files.length > 1) {
                this.toastr.warning("You can select only one file.");
                return;
            }
            // if(this.customFileName.trim() && this.files && this.files.length > 0) {
            //     Object.defineProperty(this.files[0], 'name', {
            //         value: this.customFileName,
            //         writable: true,
            //         configurable: true

            //       });
            //     this.customFileName = null;
            // }
        }
        this.anyOperationInProgress = true;
        const formData = new FormData();
        if (this.files.filter((f: any) => f.id != null).length > 0 && this.files.filter((f: any) => f.id == null).length > 0) {
            this.bothFiles = true;
        }
        if (this.filesPresent) {
            this.files.forEach((file: File) => {
                this.fileIndex = this.fileIndex + 1;
                const fileKeyName = "file" + this.fileIndex.toString();
                formData.append(fileKeyName, file);
            });
            this.fileNames = this.files.map((x) => x.name);
            if (this.uploadedFiles && this.uploadedFiles.length > 0) {
                const existingFiles = this.uploadedFiles.filter((file) => this.fileNames.includes(file.fileName)).map((x) => x.fileName).join(",");
                // if (existingFiles) {
                //     this.anyOperationInProgress = false;
                //     this.toastr.error("", existingFiles + " " + this.translateService.instant(ConstantVariables.FileNameAlreadyExists));
                //     return;
                // }
            }
            this.cdRef.detectChanges();
            this.anyOperationInProgress = false;
            this.UploaderOnInit(environment.apiURL + ApiUrls.UploadFileChunks);
        } else {
            this.files = [];
            this.customFileName = null;
            this.isTobeReviewed = false;
            this.anyOperationInProgress = false;
            this.fileResultModel = [];
            this.closeFilePopup.emit("");
        }
        // this.commonStore.dispatch(new FileUploadActionTriggered(formData, this.moduleTypeId));
    }

    upsertFiles(fileResultModel) {
        const upsertFileModel = new UpsertFileModel();
        const fileModelList = [];
        fileResultModel.forEach((element: any) => {
            const fileModel = new FileModel();
            fileModel.fileName = this.customFileName && this.customFileName.trim() && this.isQuestionDocuments ? this.customFileName : element.FileName ? element.FileName : element.fileName;
            fileModel.fileSize = element.FileSize ? element.FileSize : element.fileSize;
            fileModel.filePath = element.FilePath ? element.FilePath : element.filePath;
            fileModel.fileExtension = element.FileExtension ? element.FileExtension : element.fileExtension;
            fileModel.isArchived = false;
            fileModel.isQuestionDocuments = this.isQuestionDocuments ? true : false;
            fileModel.questionDocumentId = this.isQuestionDocuments ? this.questionDocumentId : null;
            fileModelList.push(fileModel);
        });
        this.customFileName = null;
        upsertFileModel.filesList = fileModelList;
        upsertFileModel.referenceTypeId = this.referenceTypeId;
        upsertFileModel.isFromFeedback = this.isFromFeedback;
        upsertFileModel.fileTypeReferenceId = this.fileTypeReferenceId;
        upsertFileModel.isFileReUploaded = this.isFileUploaded;
        if (this.isButtonVisible && this.folderReferenceId) {
            upsertFileModel.referenceId = this.folderReferenceId;
        } else {
            this.referenceFileId = this.folderReferenceId;
            upsertFileModel.referenceId = this.referenceFileId;
        }
        upsertFileModel.fileType = this.moduleTypeId;
        // upsertFileModel.isToBeReviewed = this.isTobeReviewed;
        if (this.selectedParentFolderId) {
            upsertFileModel.folderId = this.selectedParentFolderId;
        }
        if (this.selectedStoreId) {
            upsertFileModel.storeId = this.selectedStoreId;
        }
        // this.store.dispatch(new CreateFileTriggered(upsertFileModel));
        this.uploadFilesFromApp(upsertFileModel);
    }

    uploadFilesFromApp(upsertFileModel: UpsertFileModel) {
        this.isLoading = true;
        this.storeManagementService.upsertMultipleFiles(upsertFileModel).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success == true) {
                this.files = [];
                this.isTobeReviewed = false;
                this.fileResultModel = [];
                this.driveFiles = [];
                this.closeFilePopup.emit(upsertFileModel);
                this.getUploadedFilesDetails(this.folderReferenceId);
                this.toastr.success("File uploaded successfully");
                // if (this.moduleTypeId == 10) {
                //     this.getUploadedFilesDetails(this.folderReferenceId);
                // }
                this.cdRef.detectChanges();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.removeAllFiles();
            }
            this.anyOperationInProgress = false;
            this.cdRef.detectChanges();
        });
    }

    getUploadedFilesDetails(referenceId) {
        this.getFilesInProgress = true;
        const searchFolderModel = new SearchFileModel();
        searchFolderModel.referenceId = referenceId;
        searchFolderModel.referenceTypeId = this.referenceTypeId;
        searchFolderModel.isArchived = false;
        searchFolderModel.sortDirectionAsc = true;
        searchFolderModel.userStoryId = this.userStoryId;
        this.storeManagementService.getFiles(searchFolderModel).subscribe((result: any) => {
            if (result.success) {
                this.uploadedFiles = result.data;
                this.uploadedFilesLength = result.data.length;
                if (this.moduleTypeId == 10)
                    this.setFileCountDetails(this.folderReferenceId, this.uploadedFilesLength);
            }
            this.getFilesInProgress = false;
            this.cdRef.detectChanges();
        });
        // this.store.dispatch(new LoadFilesTriggered(searchFolderModel));
        // this.uploadedFiles$ = this.store.pipe(select(commonModuleReducers.getFileAll));
        // this.uploadedFiles$.subscribe((result) => {
        //     this.uploadedFiles = result;
        // });
        // this.uploadedFilesLength$ = this.store.pipe(select(commonModuleReducers.getFileTotal));
    }

    getStoreConfigurations() {
        // this.store.dispatch(new LoadStoreConfigurationsTriggered());
        this.storeManagementService.getStoreConfiguration().subscribe((result: any) => {
            if (result.success)
                this.storeConfigurations = result.data;
            if (this.storeConfigurations) {
                if(this.isFileUploaded == true) {
                    this.storeConfigurations.fileExtensions = ".pdf"
                } else if(this.moduleTypeId == 20 || this.moduleTypeId == 19) {
                    this.storeConfigurations.fileExtensions = ".jpeg, .jpg, .png, .gif"
                }
                this.fileExtensions = this.storeConfigurations.fileExtensions;
                var extensions = this.fileExtensions;//.replace('/*', '');
                while (extensions.indexOf('/*') != -1) {
                    extensions = extensions.replace('/*', '');
                }
                if (extensions.includes("*")) {
                    this.fileExtensions = "*";
                }
                // if(this.isFileUploaded == true) {
                //     this.fileExtensions = [".pdf"];
                // }
                this.maxStoreSize = this.storeConfigurations.maxStoreSize;
                this.maxFileSize = this.storeConfigurations.maxFileSize;
                if (this.moduleTypeId == 5 || this.moduleTypeId == 9) {
                    this.maxStoreSize = this.storeConfigurations.maxStoreSize;
                    this.cdRef.markForCheck();
                } else {
                    this.maxFileSize = this.storeConfigurations.maxFileSize;
                    this.cdRef.markForCheck();
                }
            }
        });
    }

    deleteSelectedFile(file) {
        const deleteFileInputModel = new DeleteFileInputModel();
        deleteFileInputModel.fileId = file.fileId;
        deleteFileInputModel.timeStamp = file.timeStamp;
        this.storeManagementService.deleteFile(deleteFileInputModel).subscribe((result: any) => {
            if (result.success) {
                this.getUploadedFilesDetails(this.folderReferenceId);
            }
        });
        // this.store.dispatch(new DeleteFileTriggered(deleteFileInputModel));
    }

    openPreview(file) {
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
            downloadLink.download = loc.split(".")[0] + "-" + this.datePipe.transform(new Date(), "yyyy-MM-dd") +
                "-File" + file.fileExtension;
            downloadLink.click();
        }
    }

    downloadPdf(pdf) {
        const parts = pdf.split("/");
        const loc = parts.pop();
        this.storeManagementService.downloadFile(pdf).subscribe((responseData: any) => {
            const linkSource = "data:application/pdf;base64," + responseData;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = loc.split(".")[0] + "-" + this.datePipe.transform(new Date(), "yyyy-MM-dd") + "-File.pdf";
            downloadLink.click();
        })
    }

    setFileCountDetails(referenceId, filesCount) {
        let fileDetails = this.cookieService.get(LocalStorageProperties.ExpensesFileCount);
        let fileCountDetails: any;
        if (fileDetails && fileDetails != "") {
            fileCountDetails = JSON.parse(fileDetails);
        }
        fileCountDetails = (fileCountDetails && fileCountDetails.length > 0) ? fileCountDetails : [];
        let index = fileCountDetails.findIndex((x) => x.expenseId == referenceId);
        if (index != -1) {
            fileCountDetails.forEach((element) => {
                if (element.expenseId == referenceId) {
                    element.filesCount = filesCount;
                }
            });
        } else if (index == -1) {
            let expenseFilesCount = new ExpenseManagementModel();
            expenseFilesCount.expenseId = referenceId;
            expenseFilesCount.filesCount = filesCount;
            fileCountDetails.push(expenseFilesCount);
        }
        this.cookieService.set(LocalStorageProperties.ExpensesFileCount, JSON.stringify(fileCountDetails));
    }

    setAllowedFileExtensions() {
        if (this.storeConfigurations) {
            let extensions = this.storeConfigurations.fileExtensions;
            if(this.isFileUploaded == true) {
                extensions = ".pdf";
            }
            while (extensions.indexOf('/*') != -1) {
                extensions = extensions.replace('/*', '');
            }
            extensions = extensions.replace('.*,', '*');
            extensions = extensions.replace(', .*', ', *');
            var splitted = extensions.split(",");
            extensions = "";
            for (var i = 0; i < splitted.length; i++) {
                if (i != 0) {
                    extensions += ", "
                }
                var trimmedtoken = splitted[i].trim();
                var token = this.translateService.instant("EXTENSIONS." + trimmedtoken);
                if (token.indexOf("EXTENSIONS.") != -1) {
                    extensions += splitted[i];
                }
                else {
                    extensions += token;
                }
            }
            return extensions;
        }
    }

    uploadDrive() {
        this.storeManagementService.uploadFromDrive(this.driveFiles)
            .subscribe(res => {
                let result = (res);
                if (result && result.length > 0) {
                    if (!this.fileResultModel) {
                        this.fileResultModel = [];
                    }
                    this.fileResultModel.push(...result);
                    result.forEach(file => {
                        if (!this.uploadedFileNames.find((x) => x == file.fileName)) {
                            this.uploadedFileNames.push(file.fileName)
                            this.fileCounter = this.uploadedFileNames.length;
                        }
                    });
                    this.upsertFiles(this.fileResultModel);
                }
                this.cdRef.detectChanges();

            });
    }

    private UploaderOnInit(url: string): void {
        this.anyOperationInProgress = true;
        if (this.driveFiles.length > 0 && !this.bothFiles) {
            this.uploadDrive();
        }
        let progress = 0;
        const r = new Resumable({
            target: url,
            chunkSize: 1 * 1024 * 1024, //3 MB
            query: { moduleTypeId: this.moduleTypeId },
            headers: {
                "Authorization": `Bearer ${this.cookieService.get(LocalStorageProperties.CurrentUser)}`
            },
        });
        r.addFiles(this.files.filter(a => a.size > 0));
        r.on('fileAdded', (file, event) => {
            if (!this.fileResultModel || this.fileResultModel.length > 0) {
                this.fileResultModel = [];
                this.cdRef.detectChanges();
            }
            r.upload();
        });
        r.on('complete', (event) => {
            r.files.pop();
            this.progressValue = 0;
            this.filesPresent = false;
            this.fileIndex = 0;
            this.uploadedFileNames = [];
            this.fileCounter = 1;
            if (this.fileResultModel.length > 0) {
                if (this.driveFiles.length > 0 && this.bothFiles) {
                    this.uploadDrive();
                } else {
                    this.upsertFiles(this.fileResultModel);
                }
            }
        });
        r.on('progress', () => {
            progress = Math.round(r.progress() * 100);
            this.progressValue = progress;
            this.cdRef.detectChanges();
        });

        r.on('fileSuccess', (file, response) => {
            if (file && file.fileName) {
                if (!this.uploadedFileNames.find((x) => x == file.fileName)) {
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

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }
}
