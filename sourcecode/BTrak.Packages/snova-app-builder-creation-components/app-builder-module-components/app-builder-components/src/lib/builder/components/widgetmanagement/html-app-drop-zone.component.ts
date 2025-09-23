import { Component, EventEmitter, Output, Input } from "@angular/core";
import { NgxGalleryOptions } from "ngx-gallery-9";
import { StoreConfigurationModel } from "../../models/store-configuration.model";
import { Observable } from "rxjs";
import { FileUploadService } from "../../services/fileUpload.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";
import { FileSizePipe } from "../../pipes/filesize-pipe";
import { DatePipe } from "@angular/common";
import { FileInputModel } from "../../models/file-input.model";

@Component({
    selector: "app-fm-component-html-app-drop-zone",
    templateUrl: "./html-app-drop-zone.component.html",
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
    `],
})
export class htmlAppDropZone {

    @Input("fileUrl") set _fileUrl(data: any) {
        if(data){
            this.isFileUploaded = true;
            this.fileDetails.filePath = data;
            this.fileDetails.fileName = data;
        }
    }

    filesPresent: boolean = false;
    fileIndex: number = 0;
    files: File[] = [];
    anyOperationInProgress: boolean = false;
    fileDetails: FileInputModel = new FileInputModel();
    isFileUploaded: boolean = false;

    @Output() filePath = new EventEmitter<string>();
    @Output() deleteFile = new EventEmitter<boolean>();

    galleryOptions: NgxGalleryOptions[];
    storeConfigurations: StoreConfigurationModel;

    storeConfigurations$: Observable<StoreConfigurationModel>;

    constructor(
        private fileUploadService: FileUploadService,
        private toastr: ToastrService, private translateService: TranslateService, private filesize: FileSizePipe, private datePipe: DatePipe
    ) {
    }

    ngOnInit() {
        this.galleryOptions = [
            { image: false, thumbnails: false, width: "0px", height: "0px" }
        ]
    }

    filesSelected(event) {
        if (this.files.length > 0) {
            this.toastr.error("", this.translateService.instant(ConstantVariables.MultipleFilesNotAllowed));
        }
        else {
            this.files.push(...event.addedFiles);
            if (event.rejectedFiles.length > 0) {
                if (event.rejectedFiles[0].size > 20971520) {
                    this.toastr.error("", this.translateService.instant(ConstantVariables.FileSizeShouldNotExceed) + ' ' + this.filesize.transform(20971520));
                } else if (event.rejectedFiles[0].type != "text/javascript") {
                    this.toastr.error("", this.translateService.instant(ConstantVariables.ThisFileTypeIsNotAllowed));
                }
            }
            if (this.files.length > 0) {
                this.filesPresent = true;
            }
        }
    }

    saveFiles() {
        const formData = new FormData();
        this.anyOperationInProgress = true;
        this.files.forEach((file: File) => {
            this.fileIndex = this.fileIndex + 1;
            const fileKeyName = "file" + this.fileIndex.toString();
            formData.append(fileKeyName, file);
        })

        this.fileUploadService.UploadFile(formData, 8).subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.fileDetails = responseData.data[0];
                this.filePath.emit(responseData.data[0].filePath);
                this.isFileUploaded = true;
            }
            else {
                this.toastr.error(responseData.apiResponseMessages[0].message);
                this.isFileUploaded = false;
            }
            this.anyOperationInProgress = false;
        });
    }

    removeAllFiles() {
        this.filesPresent = false;
        this.files = [];
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
        if (this.files.length > 0) {
            this.filesPresent = true;
        } else {
            this.filesPresent = false;
        }
    }

    downloadFile(file) {
        const parts = file.filePath.split("/");
        const loc = parts.pop();
        const downloadLink = document.createElement("a");
        downloadLink.href = file.filePath;
        downloadLink.download = loc.split(".")[0] + "-" + this.datePipe.transform(new Date(), "yyyy-MM-dd") + "-File" + file.fileExtension;
        downloadLink.click();
    }

    deleteSelectedFile() {
        this.filePath.emit(null);
        this.filesPresent = false;
        this.isFileUploaded = false;
        this.files = [];
    }

}