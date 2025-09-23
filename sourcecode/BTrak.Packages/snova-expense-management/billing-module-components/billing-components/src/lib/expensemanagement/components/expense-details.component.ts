import { Component, Inject, ChangeDetectorRef, ViewChildren, NO_ERRORS_SCHEMA, Input, Output, EventEmitter } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { ExpenseManagementService } from "../expensemanagement.service";
import { ToastrService } from "ngx-toastr";
import { ExpenseManagementModel } from "../models/expenses-model";
import { Observable } from "rxjs";
import { DatePipe } from "@angular/common";
import { NgxGalleryImageSize, NgxGalleryImage, NgxGalleryOptions } from "ngx-gallery-9";
import { CookieService } from "ngx-cookie-service";
import { ComponentModel } from '@thetradeengineorg1/snova-comments';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { AppBaseComponent } from './componentbase';
import { ConstantVariables } from '../constants/constant-variables';
import { FileInputModel } from '../models/file-input-model';
import { StoreManagementService } from '../services/store-management.service';
import { FetchSizedAndCachedImagePipe } from '../pipes/fetchSizedAndCachedImage.pipe';
import '../../globaldependencies/helpers/fontawesome-icons'

@Component({
    selector: "app-expense-details",
    templateUrl: "expense-details.component.html",
    styles: [`
    .top-right-close-icon
    {
        position: fixed;
        top: 15%;
    }
    .custom-expense-dialog {
        position: relative;
        float: right;
        margin-top: -25px;
        margin-right: -32px;
    }

    .custom-expense-dialog .custom-close {
        width: 30px;
        background-color: #eaeaea;
        height: 30px;
        border-radius: 20px;
        transform: translate(50%, -50%);
        cursor: pointer;
    }
    
    .container-width
    {
        min-width:800px;
    }`]
})

export class ExpenseDetailsComponent extends AppBaseComponent {
    @ViewChildren("showReceiptsPopUp") showReceiptsPopover;
    @Output() editExpenseDetails = new EventEmitter<string>();

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.setData(this.matData);
            this.currentDialogId = data[0].formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

    matData: any;
    currentDialogId: any;
    currentDialog: any;
    selectedExpenseDetails: any;
    selectedExpenseConfigurationDetails: any;
    expenseHistoryDetails: any;
    expenseId: string;
    referenceTypeId = ConstantVariables.ExpenseReferenceTypeId;
    isAnyOperationIsInprogress: boolean = false;
    galleryImages: NgxGalleryImage[];
    categoryGalleryImages: NgxGalleryImage[];
    galleryOptions: NgxGalleryOptions[];
    imageExtensions: string[] = ["png", "jpeg", "jpg", "gif"];
    receiptsForAnOrder: any[] = [];
    receiptsPdfForAnOrder: any[] = [];
    categoryReceiptsForAnOrder: any[] = [];
    categoryReceiptsPdfForAnOrder: any[] = [];
    uploadedFiles$: Observable<FileInputModel[]>;
    getFilesInProgress$: Observable<boolean>;
    uploadedFilesLength$: Observable<number>;
    selectedTab = 0;
    isArchived: boolean;
    componentModel: ComponentModel = new ComponentModel();

    constructor(public dialogRef: MatDialogRef<ExpenseDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
        private expenseService: ExpenseManagementService, private cdRef: ChangeDetectorRef, private toastr: ToastrService,
        private datePipe: DatePipe, private storeManagementService: StoreManagementService, private imagePipe: FetchSizedAndCachedImagePipe,
        public dialog: MatDialog,
        private cookieService: CookieService,) {
        super();
        if (data && data.data) {
            this.setData(data);
        }
    }

    setData(data: any) {
        this.selectedExpenseDetails = data.data;
        this.isArchived = data.isArchived;
        this.expenseId = data.data.expenseId;
        this.selectedExpenseConfigurationDetails = this.selectedExpenseDetails.expenseCategoriesConfigurations;
        if (this.selectedExpenseConfigurationDetails && this.selectedExpenseConfigurationDetails.length == 1) {
            this.selectedExpenseDetails.description = this.selectedExpenseConfigurationDetails[0].description;
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.searchExpenseHistory();
        this.getFileDetails();
        this.galleryOptions = [
            { image: false, height: "50px", width: "300px", thumbnailsPercent: 20, thumbnailSize: NgxGalleryImageSize.Contain, thumbnailsMargin: 0, thumbnailsColumns: 4, thumbnailMargin: 5 },
        ];
        // setting component model to pass default variable values
        const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
        this.componentModel.backendApi = environment.apiURL;
        this.componentModel.parentComponent = this;
        this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
    }

    searchExpenseHistory() {
        this.isAnyOperationIsInprogress = true;
        var expenseModel = new ExpenseManagementModel();
        expenseModel.expenseId = this.selectedExpenseDetails.expenseId;
        this.expenseService.searchExpenseHistory(expenseModel).subscribe((response: any) => {
            if (response.success == true) {
                this.expenseHistoryDetails = response.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    getFileDetails() {
        if (this.selectedExpenseDetails && this.selectedExpenseDetails.receipts) {
            this.galleryImages = [];
            const receipts = this.selectedExpenseDetails.receipts.split(',');
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
                    const file = {
                        filePath: item,
                        fileName: item.split('/').pop()
                    }
                    this.receiptsPdfForAnOrder.push(file);
                }
            })
            this.galleryImages = this.receiptsForAnOrder;
        }
    }

    downloadFile(filePath) {
        const parts = filePath.split(".");
        const fileExtension = parts.pop();
        if (fileExtension == 'pdf') {
            this.downloadPdf(filePath);
        } else {
            const downloadLink = document.createElement("a");
            downloadLink.href = filePath;
            downloadLink.download = filePath.split(".").pop() + '-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-File' + fileExtension;
            downloadLink.click();
        }
    }

    downloadPdf(pdf) {
        const parts = pdf.split("/");
        const loc = parts.pop();
        this.storeManagementService.downloadFile(pdf).subscribe((responseData: any) => {
            const linkSource = 'data:application/pdf;base64,' + responseData;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = loc.split(".")[0] + '-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-File.pdf';
            downloadLink.click();
        })
    }

    closeExpenseDetailsForm() {
        this.currentDialog.close();
        // this.dialogRef.close();
    }

    editExpenseDetailsForm() {
        // this.dialogRef.close({ dataItem: this.selectedExpenseDetails, event: 'edit' });
        this.currentDialog.close();
        this.editExpenseDetails.emit(this.selectedExpenseDetails);
    }

    selectedMatTab(event) {
        this.selectedTab = event.index;
    }


    showReceiptsPopupOpen(row, showReceiptsPopUp) {
        this.categoryGalleryImages = [];
        debugger;
        let receipts;
        if(this.selectedExpenseConfigurationDetails.length===1){
            receipts = this.selectedExpenseDetails.expenseReceipts.split(',');
        } else{
           receipts = row.receipts.split(',');
        }
        receipts.forEach(item => {
            const result = item.split(".");
            const fileExtension = result.pop();
            if (this.imageExtensions.includes(fileExtension)) {
                const album = {
                    small: this.imagePipe.transform(item, "50", "50"),
                    big: this.imagePipe.transform(item, "", "")
                };
                this.categoryReceiptsForAnOrder.push(album);
            } else {
                const file = {
                    filePath: item,
                    fileName: item.split('/').pop()
                }
                this.categoryReceiptsPdfForAnOrder.push(file);
            }
        })
        this.categoryGalleryImages = this.categoryReceiptsForAnOrder;
        showReceiptsPopUp.openPopover();
    }

    closeReceiptsPopup() {
        this.categoryReceiptsForAnOrder = [];
        this.categoryReceiptsPdfForAnOrder = [];
        this.showReceiptsPopover.forEach((p) => p.closePopover());
    }

    receiptsCount(row) {
        if(this.selectedExpenseConfigurationDetails.length==1){
            const receipts = this.selectedExpenseDetails.expenseReceipts.split(',');
            return receipts.length;
        } else if (row.receipts) {
            const receipts = row.receipts.split(',');
            return receipts.length;
        }
        return 0;
    }
}