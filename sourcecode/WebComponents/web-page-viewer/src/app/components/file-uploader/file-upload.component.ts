import { FormioCustomComponent } from 'angular-formio';
import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, TemplateRef } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject } from "rxjs";
import { DatePipe } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import { CookieService } from "ngx-cookie-service";
import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryComponent } from "ngx-gallery-9";
import { MatDialog } from '@angular/material/dialog';
import { FileSizePipe } from 'src/app/pipes/filesize-pipe';
import { FetchSizedAndCachedImagePipe } from 'src/app/pipes/fetchSizedAndCachedImage.pipe';
import { StoreManagementService } from 'src/app/services/store-management.service';
import { StoreConfigurationModel } from 'src/app/models/store-configuration-model';
import { FileResultModel } from 'src/app/models/fileResultModel';
import { FileModel } from 'src/app/models/file-model';
import { FileInputModel } from 'src/app/models/file-input-model';
import { UpsertFileModel } from 'src/app/models/upsert-file-model';
import { ExpenseManagementModel } from 'src/app/models/expenses-model';
import { LocalStorageProperties } from 'src/app/constants/localstorage-properties';

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
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
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
      .pdf-height
    {
        height : calc(100vh - 180px) !important;
    }
    .container {
        background-color: tomato;
        color: white;
        padding: 5px 10px 10px;
        width: 300px;
      }
      
      .title {
        height: 13px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
  `]
})
export class FileUploadComponent implements FormioCustomComponent<any> {
    @ViewChild("onlyPreviewGallery") onlyPreviewGallery: NgxGalleryComponent;
    @ViewChild('previewPdfDialogComponent') previewpdfPopupComponentDialog: TemplateRef<any>;
    @ViewChild('previewcsvDialogComponent') previewCsvPopupComponentDialog: TemplateRef<any>;
    @ViewChild('previewofficeDialogComponent') previewOfficePopupComponentDialog: TemplateRef<any>;
    isDescriptionRequired: any;
    required: any;
    tableViews: any;
    fileMinSizes: any;
    fileMaxSizes: any = 20971520;
    filePatterns: any = '*';
    pdf: any;
    csv: any;
    office: any;
    disableds: boolean;
    filesLength: number;
    

    @Input() set validate(data: any) {
        if (data) {
            this.required = data.required;
        }
    }
    @Input() set filePattern(data: any) {
        if (data) {
            this.filePatterns = data;
        }
    }
    @Input() set fileMinSize(data: any) {
        if (data) {
            this.fileMinSizes = data;
        }
    }
    @Input() set tableView(data: any) {
        this.tableViews = data;
    }
    @Input() set fileMaxSize(data: any) {
        if (data) {
            data = data.toString().toLowerCase().replace('mb', '');
            this.fileMaxSizes = Number(data) * 1000000;
        }
    }
    @Input() set value(data: any) {
        if (data) {
        }
    }
    @Output()
    valueChange = new EventEmitter<any>();

    @Input() set disabled(data: any) {
        this.disableds = data === 'disabled' || data === true ? true : false;
    }
    
    @Input() set uploadOnly(data: any) {
        this.isDescriptionRequired = data === true ? false : true;
    }
    @Input() set properties(data: any) {
        if (Object.keys(data).length > 0) {
            console.log("File Uploader Keys", data, Object.keys(data));
            this.referenceTypeId = data.referenceTypeId;
            this.referenceTypeName = data.referenceTypeName;
            if (data.folderReferenceId != undefined && data.folderReferenceId != '') {
                this.folderReferenceId = data.folderReferenceId;
            }
            this.searchFiles();
        }
    }
    folderReferenceId: string ='fd45f921-48f0-4b0b-b76e-cd2a92880437';
    @Input() fileTypeReferenceId: string;
    @Input() selectedStoreId: string;


    customFileName: any;
    fileModelList: any = [];
    fileIndex: number = 0;
    filesPresent: boolean;
    referenceFileId: string;
    description: string;
    referenceTypeId: any = null;
    referenceTypeName: string = null;
    moduleTypeId: any = 18;
    files: File[] = [];
    fileResultModel: FileResultModel[];
    storeConfigurations: StoreConfigurationModel;
    progressValue: number;
    fileCounter: number = 1;
    uploadedFileNames = [];
    uploadedFiles: FileInputModel[];
    fileNames: any;
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
    maxStoreSize: any;
    maxFileSize: any='123456789';
    fileExtensions: any='*';
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
    constructor(private actionUpdates$: Actions, private sanitizer: DomSanitizer, private dialog: MatDialog,
        private toastr: ToastrService, private translateService: TranslateService, private imagePipe: FetchSizedAndCachedImagePipe,
        private datePipe: DatePipe, private storeManagementService: StoreManagementService, private cdRef: ChangeDetectorRef,
        private filesize: FileSizePipe, private sanitization: DomSanitizer, private cookieService: CookieService,
    ) {
        this.getStoreConfigurations();
    }

    ngOnInit() {
        this.galleryOptions = [
            {
                image: false, thumbnails: false, width: "0px", height: "0px", previewFullscreen: true, previewSwipe: true,
                previewZoom: true, previewRotate: true, previewCloseOnEsc: true, previewKeyboardNavigation: true
            }
        ]
        this.progressValue = 0;
    }

    filesSelected(event) {
        this.files.push(...event.addedFiles);
        if (event.rejectedFiles.length > 0) {
            if (event.rejectedFiles[0].size > this.maxFileSize) {
                this.toastr.error("", "File should be less than " +
                    this.filesize.transform(this.maxFileSize));
            }
            else if (event.rejectedFiles[0].size < this.fileMinSizes) {
                this.toastr.error("", "File should not be less than " +
                    this.filesize.transform(this.fileMinSizes));
            }
            else if (this.storeConfigurations.fileExtensions.search(event.rejectedFiles[0].type)) {
                this.toastr.error("", "File type is not allowed");
            }

        }
        if (this.files.length > 0) {
            this.filesPresent = true;
        }
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
        if (this.files.length > 0) {
            this.filesPresent = true;
        } else {
            this.filesPresent = false;
        }
    }

    removeAllFiles() {
        this.filesPresent = false;
        this.files = [];
    }

    saveFiles() {
        this.anyOperationInProgress = true;
        this.cdRef.detectChanges();
        const formData = new FormData();
        this.filesLength=this.files.length;
        if (this.files.filter((f: any) => f.id != null).length > 0 && this.files.filter((f: any) => f.id == null).length > 0) {
            this.bothFiles = true;
        }
        if (this.filesPresent) {
            this.files.forEach((file: File) => {
                this.fileIndex = this.fileIndex + 1;
                const fileKeyName = "file" + this.fileIndex.toString();
                formData.append(fileKeyName, file);
                this.uploadEventHandler(file);
            });
            // this.uploadFiles();
            this.fileNames = this.files.map((x) => x.name);
            if (this.uploadedFiles && this.uploadedFiles.length > 0) {
                const existingFiles = this.uploadedFiles.filter((file) => this.fileNames.includes(file.fileName)).map((x) => x.fileName).join(",");
            }
            this.anyOperationInProgress = false;
        } else {
            this.files = [];
            this.customFileName = null;
            this.isTobeReviewed = false;
            this.anyOperationInProgress = false;
            this.fileResultModel = [];
        }
    }

    uploadFiles(file){
        let fileModelList=[];
        fileModelList.push(file);
        const upsertFileModel = new UpsertFileModel();
        this.customFileName = null;
        upsertFileModel.filesList = fileModelList;
        upsertFileModel.description = this.description;
        upsertFileModel.referenceTypeId = this.referenceTypeId;
        upsertFileModel.referenceTypeName = this.referenceTypeName;
        upsertFileModel.parentFolderNames = ['formuploads'];
        upsertFileModel.isFromFeedback = false;
        upsertFileModel.fileTypeReferenceId = this.fileTypeReferenceId;
        if (this.folderReferenceId) {
            upsertFileModel.referenceId = this.folderReferenceId;
        } else {
            this.referenceFileId = this.folderReferenceId;
            upsertFileModel.referenceId = this.referenceFileId;
        }
        upsertFileModel.fileType = this.moduleTypeId;
        if (this.selectedStoreId) {
            upsertFileModel.storeId = this.selectedStoreId;
        }
        this.storeManagementService.upsertMultipleFiles(upsertFileModel).subscribe((response1: any) => {
            this.anyOperationInProgress = false;
            this.progressValue = 0;
            if (response1.success) {
                this.filesLength=0;
                this.fileModelList=[];
                this.searchFiles()
                var data = {
                    data: response1.data,
                    key: '',
                    type: 'file Uload Emit Event'
                }
                console.log(data);
                this.valueChange.emit(data);
            } else {
                this.filesLength=0;
                this.fileModelList=[];
            }
                        this.files = [];
                        this.isTobeReviewed = false;
                        this.filesPresent = false;
                        this.fileResultModel = [];
                        this.cdRef.detectChanges();
            this.cdRef.detectChanges();
        })   
    }

    searchFiles() {
        if (this.folderReferenceId != null && this.folderReferenceId != '' && this.referenceTypeId != '' && this.referenceTypeId != null) {
            this.getFilesInProgress = true;
            this.storeManagementService.searchFiles(this.folderReferenceId,this.referenceTypeId, this.referenceTypeName).subscribe((result: any) => {
                if (result.success) {
                    this.uploadedFiles = result.data;
                    this.uploadedFilesLength = result.data.length;
                    if (this.moduleTypeId == 10)
                        this.setFileCountDetails(this.folderReferenceId, this.uploadedFilesLength);
                }
                this.getFilesInProgress = false;
                this.cdRef.detectChanges();
            });
        }
    }

    getStoreConfigurations() {
        this.storeManagementService.getStoreConfiguration().subscribe((result: any) => {
            if (result.success) {
                this.storeConfigurations = result.data;
                this.searchFiles();
            }
            if (this.storeConfigurations) {
                this.fileExtensions = this.filePatterns;
                var extensions = this.fileExtensions;
                while (extensions.indexOf('/*') != -1) {
                    extensions = extensions.replace('/*', '');
                }
                if (extensions.includes("*")) {
                    this.fileExtensions = "*";
                }
                this.maxStoreSize = this.storeConfigurations.maxStoreSize;
                this.maxFileSize = this.storeConfigurations.maxFileSize < this.fileMaxSizes ? this.storeConfigurations.maxFileSize : this.fileMaxSizes;
                if (this.moduleTypeId == 5 || this.moduleTypeId == 9) {
                    this.maxStoreSize = this.storeConfigurations.maxStoreSize;
                    this.cdRef.markForCheck();
                } else {
                    this.maxFileSize = this.storeConfigurations.maxFileSize < this.fileMaxSizes ? this.storeConfigurations.maxFileSize : this.fileMaxSizes;
                    this.cdRef.markForCheck();
                }
            } else {
                this.fileExtensions = '*';
                this.maxStoreSize = '10241024';
            }
        });
    }

    deleteSelectedFile(file) {
        this.storeManagementService.deleteFile(file.id).subscribe((result: any) => {
            if (result.success) {
                this.searchFiles();
            }
        });
        // this.store.dispatch(new DeleteFileTriggered(deleteFileInputModel));
    }

    downloadFile(file) {
        const parts = file.filePath.split("/");
        const loc = parts.pop();
        if (file.fileExtension == ".pdf") {
            this.downloadPdf(file.filePath);
        } else {
            const downloadLink = document.createElement("a");
            downloadLink.href = file.filePath;
            downloadLink.download = file.filePath.split(".").pop() + '-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-File' + file.fileExtension;
            downloadLink.click();
        }
        // else if ((file.fileExtension == '.jpeg') || (file.fileExtension == '.jpg') || (file.fileExtension == '.png') || (file.fileExtension == '.gif') || (file.fileExtension == '.JPEG') || (file.fileExtension == '.JPG') || (file.fileExtension == '.PNG') || (file.fileExtension == '.GIF')) {
        //     this.downloadImage(file);
        // } else {
        //     const downloadLink = document.createElement("a");
        //     downloadLink.href = file.filePath;
        //     downloadLink.download = loc.split(".")[0] + "-" + this.datePipe.transform(new Date(), "yyyy-MM-dd") +
        //         "-File" + file.fileExtension;
        //     downloadLink.click();
        // }
    }

    downloadPdf(pdf) {
        const parts = pdf.split("/");
        const loc = parts.pop();
        this.storeManagementService.downloadFile(pdf).subscribe((responseData: any) => {
            const fileType = "pdf" == "pdf" ? 'data:application/pdf;base64,' : 'data:text/plain;base64,';
            const linkSource = fileType + responseData.data;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = loc.split(".")[0] + '-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-File.pdf';
            downloadLink.click();
        })
    }
    downloadImage(file) {
        const parts = file.filePath.split("/");
        const loc = parts.pop();
        this.storeManagementService.downloadFile(file.filePath).subscribe((responseData: any) => {
            const linkSource = "data:application/image;base64," + responseData.data;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = loc.split(".")[0] + "-File" + file.fileExtension;
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
        return null;
    }


    // private UploaderOnInit(url: string): void {
    //     this.anyOperationInProgress = true;
    //     let progress = 0;
    //     const r = new Resumable({
    //         target: url,
    //         chunkSize: 1 * 1024 * 1024, //3 MB
    //         query: { moduleTypeId: this.moduleTypeId },
    //         headers: {
    //             // enctype: "multipart/form-data",
    //             // "Content-Type": "multipart/form-data",
    //             "Authorization": `Bearer ${this.cookieService.get(LocalStorageProperties.CurrentUser)}`
    //         },
    //     });
    //     r.addFiles(this.files.filter(a => a.size > 0));
    //     r.on('fileAdded', (file, event) => {
    //         if (!this.fileResultModel || this.fileResultModel.length > 0) {
    //             this.fileResultModel = [];
    //             this.cdRef.detectChanges();
    //         }
    //         r.upload();
    //     });
    //     r.on('complete', (event) => {
    //         r.files.pop();
    //         this.progressValue = 0;
    //         this.filesPresent = false;
    //         this.fileIndex = 0;
    //         this.uploadedFileNames = [];
    //         this.fileCounter = 1;
    //         if (this.fileResultModel.length > 0) {
    //                 this.upsertFiles(this.fileResultModel);
    //         }
    //     });
    //     r.on('progress', () => {
    //         progress = Math.round(r.progress() * 100);
    //         this.progressValue = progress;
    //         this.cdRef.detectChanges();
    //     });

    //     r.on('fileSuccess', (file, response) => {
    //         if (file && file.fileName) {
    //             if (!this.uploadedFileNames.find((x) => x == file.fileName)) {
    //                 this.uploadedFileNames.push(file.fileName)
    //                 this.fileCounter = this.uploadedFileNames.length;

    //                 let result = JSON.parse(response);
    //                 if (result && result.length > 0) {
    //                     if (!this.fileResultModel) {
    //                         this.fileResultModel = [];
    //                     }
    //                     let fileResult = new FileResultModel();
    //                     fileResult.fileExtension = result[0].FileExtension;
    //                     fileResult.fileName = result[0].FileName;
    //                     fileResult.filePath = result[0].FilePath;
    //                     fileResult.fileSize = result[0].FileSize;
    //                     this.fileResultModel.push(fileResult);
    //                 }
    //                 this.cdRef.detectChanges();
    //             }
    //         }
    //     });
    // }
    uploadEventHandler(files, isFileFromCopyPaste = false, fileNamefromCopy = null) {
        const fileModel = new FileModel();
        var file = files;
        var fileSize = file.size;
        var fileName = isFileFromCopyPaste == true ? fileNamefromCopy : file.name;
        var filetype = file.type;
        var blockSizeInKB = 1024;
        var blockSize = blockSizeInKB * 1024;
        var blocks = [];
        var offset = 0;
        var index = 0;
        var list = "";
        while (offset < fileSize) {
            var start = offset;
            var end = Math.min(offset + blockSize, fileSize);
            blocks.push({
                filetype: filetype,
                index: index,
                start: start,
                end: end,
                name: fileName
            });
            list += index + ",";
            offset = end;
            index++;
        }
        this.progressValue = 1;
        this.anyOperationInProgress = true;
        var putBlocks = [];
        var responseIndex = 0;
        let moduleTypeId = 1;
        var ser = this;

        blocks.sort().forEach((block) => {
            putBlocks.push(block);
            var blob = file.slice(block.start, block.end);
            var fd = new FormData();
            fd.append("file", blob);

            this.storeManagementService.uploadFileUrl(fd, block.index, moduleTypeId, fileName, filetype, null).subscribe((response: any) => {
                if (response.success) {
                    ser.anyOperationInProgress = true;
                    blocks[responseIndex]
                    this.progressValue = (blocks[responseIndex].end) / fileSize * 100;
                    responseIndex = responseIndex + 1;
                    if (putBlocks.length == responseIndex) {
                        var list = putBlocks.map(function (el) { return el.index }).join(',');
                        this.storeManagementService.getBlobUrl(moduleTypeId, fileName, list, filetype, null).subscribe((response1: any) => {
                            ser.anyOperationInProgress = false;
                            ser.progressValue = 0;
                            if (response1.success) {
                                const fileModel = new FileModel();
                                fileModel.fileName = fileName;
                                fileModel.fileSize = fileSize;
                                fileModel.filePath = response1.data;
                                
        const parts = fileName.split("/");
        const loc = parts.pop();
                                fileModel.fileExtension = '.'+loc.split(".")[1];
                                fileModel.description = this.description;
                                fileModel.isArchived = false;
                                fileModel.isQuestionDocuments = false;
                                fileModel.questionDocumentId = null;
                                this.fileModelList.push(file);
                                this.uploadFiles(fileModel);
                                if(this.filesLength===this.fileModelList.length){
                                    this.description=null;
                                }
                            } else {
                            }
                            ser.cdRef.detectChanges();
                        })
                    }
                } else {
                    this.anyOperationInProgress = false;
                }
                this.cdRef.detectChanges();
            })

        })
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }
    openPreview(file) {
        let filesList = [];
        file.fileId = file.id;
        filesList.push(file);
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
    copyFileUrl(dataItem) {
        const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        const copyText = dataItem.filePath;
        const selBox = document.createElement("textarea");
        selBox.value = copyText;
        document.body.appendChild(selBox);
        selBox.select();
        selBox.setSelectionRange(0, 99999)   // For Mobile
        document.execCommand("copy");
        document.body.removeChild(selBox);
        this.toastr.success("Link copied successfully");
    }
    onChangeEvent(event) {
        this.description = event.target.value;
    }

    calculateFileSizeinKB(value) {
        var value1 = value / 1024;
        return value1;
    }
}