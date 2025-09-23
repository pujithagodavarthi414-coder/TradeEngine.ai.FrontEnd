import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, ViewChildren } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions } from "ngx-gallery-9";
import { FetchSizedAndCachedImagePipe } from "../../pipes/fetchSizedAndCachedImage.pipe";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
export interface DialogData {
    rowData: any; type: any;
}

@Component({
    selector: "app-receipts-component",
    templateUrl: "receipts.component.html"
})
export class ReceiptsComponent extends AppBaseComponent implements OnInit {
    receipts: any;
    receiptsForAnOrder: any[] = [];
    receiptsPdfForAnOrder: any[] = [];
    galleryImages: NgxGalleryImage[];
    galleryOptions: NgxGalleryOptions[];
    imageExtensions: string[] = ["png", "jpeg", "jpg", "gif"];
    isReceipts: boolean=false;

    constructor(private BillingDashboardService: BillingDashboardService, public dialogRef: MatDialogRef<ReceiptsComponent>, private imagePipe: FetchSizedAndCachedImagePipe, private translateService: TranslateService,
                private cdRef: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) public data: DialogData,private datePipe: DatePipe,public dialog: MatDialog ) {
        super();
            this.receipts = this.data.rowData.receipts;
            this.galleryImages = [];
        const receipts = this.receipts.split(',');
        receipts.forEach(item => {
            const result = item.split(".");
            const fileExtension = result.pop();
            if (this.imageExtensions.includes(fileExtension)) {
                const album = {
                    small: this.imagePipe.transform(item, "50", "50"),
                    big: this.imagePipe.transform(item, "", "")
                };
                this.receiptsForAnOrder.push(album);
            } else {
                let uploadedFileName = item.split('/').pop();
                let sortedFileName = uploadedFileName.split('-');
                let originalFileName = uploadedFileName.split('-');
                let fileName = "";
                for (let i = (sortedFileName.length - 1); i >= sortedFileName.length - 5; i--) {
                    originalFileName.splice(i, 1);
                }
                if (originalFileName.length > 0) {
                    for (let j = 0; j < (originalFileName.length - 1); j++) {
                        fileName = fileName + originalFileName[j] + '-'
                    }
                    fileName = fileName + originalFileName[originalFileName.length - 1] + '.' + fileExtension;
                } else {
                    fileName = originalFileName.toString() + '.' + fileExtension;
                }
                const file = {
                    filePath: item,
                    fileName: fileName
                }
                this.receiptsPdfForAnOrder.push(file);
            }
        })
        this.galleryImages = this.receiptsForAnOrder;
        if (this.galleryImages && this.galleryImages.length > 4) {
            this.galleryOptions = [
                { image: false, height: "50px", width: "100%", thumbnailsPercent: 20, thumbnailSize: NgxGalleryImageSize.Contain, thumbnailsMargin: 0, thumbnailsColumns: this.galleryImages.length, thumbnailMargin: 5 },
            ]
        }
        this.isReceipts=true;
    }
    ngOnInit() {
        super.ngOnInit();
    }
    
    closeReceiptsPopup() {
        this.receiptsForAnOrder = [];
        this.receiptsPdfForAnOrder = [];
        this.dialogRef.close();
    }
    downloadFile(filePath) {
        const parts = filePath.split(".");
        const fileExtension = parts.pop();
        if (fileExtension == 'pdf') {
            this.downloadPdf(filePath, fileExtension);
        } else {
            const downloadLink = document.createElement("a");
            downloadLink.href = filePath;
            downloadLink.download = filePath.split(".").pop() + '-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-File' + fileExtension;
            downloadLink.click();
        }
    }

    downloadPdf(pdf, fileExtension) {
        const parts = pdf.split("/");
        const loc = parts.pop();
        this.BillingDashboardService.downloadFile(pdf).subscribe((responseData: any) => {
            const fileType = fileExtension == "pdf" ? 'data:application/pdf;base64,' : 'data:text/plain;base64,';
            const linkSource = fileType + responseData;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = loc.split(".")[0] + '-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-File.pdf';
            downloadLink.click();
        })
    }
}