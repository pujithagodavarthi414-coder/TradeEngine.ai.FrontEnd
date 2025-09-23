import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { ScoModel } from "../../models/sco-model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { State } from "@progress/kendo-data-query";
import * as _ from 'underscore';
import { MatOption } from "@angular/material/core";
import { ContractModel } from "../../models/contract.model";
import { MatDialog } from "@angular/material/dialog";
import { ContractComponent } from "./contract.component";
import { AddLeadDialogComponent } from "../lead-templates/add-lead-dialog.component";
import { ToastrService } from "ngx-toastr";
import { AppBaseComponent } from "../componentbase";
import { NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions } from "ngx-gallery-9";
import { FetchSizedAndCachedImagePipe } from "../../pipes/fetchSizedAndCachedImage.pipe";
import { DatePipe } from "@angular/common";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
@Component({
    selector: "app-billing-component-contract-list",
    templateUrl: "contract-list.component.html"
})
export class ContractListComponent extends AppBaseComponent implements OnInit {
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChildren("mailSCOPopover") mailSCOPopover;
    @ViewChildren("deleteContractPopup") deleteContractPopup;
    @ViewChildren("showReceiptsPopUp") showReceiptsPopover;
    galleryImages: NgxGalleryImage[];

    contractList: any;
    contractListData: GridDataResult = {
        data: [],
        total: 0
    };
    temp: any;
    searchText: string;
    state: State = {
        skip: 0,
        take: 20,
    };
    isArchived: boolean = false;
    rowIndex: any;
    contractId: string;
    timeStamp: boolean;
    isContractArchived: boolean = false;
    rowData: any;
    isInProgress: boolean = false;
    imageExtensions: string[] = ["png", "jpeg", "jpg", "gif"];
    receiptsForAnOrder: any[] = [];
    receiptsPdfForAnOrder: any[] = [];
    galleryOptions: NgxGalleryOptions[];
    sortBy: string;
    sortDirection: boolean = true;

    constructor(private BillingDashboardService: BillingDashboardService, private imagePipe: FetchSizedAndCachedImagePipe,
        private cdRef: ChangeDetectorRef, public dialog: MatDialog, private toastr: ToastrService, private datePipe: DatePipe) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getContracts();
        this.galleryOptions = [
            { image: false, height: "50px", width: "100%", thumbnailsPercent: 20, thumbnailSize: NgxGalleryImageSize.Contain, thumbnailsMargin: 0, thumbnailsColumns: 4, thumbnailMargin: 5 },
        ]
    }

    getContracts() {
        this.isInProgress = true;
        let contractModel = new ContractModel();
        contractModel.isArchived = this.isArchived;
        contractModel.sortBy = this.sortBy;
        contractModel.sortDirectionAsc = this.sortDirection;
        contractModel.searchText = this.searchText;
        contractModel.pageNumber = (this.state.skip / this.state.take) + 1;
        contractModel.pageSize = this.state.take;
        this.BillingDashboardService.getContractList(contractModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.temp = responseData.data;
                    this.contractList = responseData.data;
                    this.contractListData = {
                        data: responseData.data,
                        total: responseData.data.length > 0 ? responseData.data[0].totalCount : 0,
                    }
                    this.isInProgress = false;
                    this.cdRef.detectChanges();
                }
                else {
                    this.isInProgress = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }

    searchByText() {
        if (this.searchText && this.searchText.trim().length <= 0) return;
        this.getContracts();
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        this.getContracts();

        // const temp = this.temp.filter(((contract) =>
        //     (contract.contractNumber.toLowerCase().indexOf(this.searchText) > -1)
        //     || (contract.counterParty.toLowerCase().indexOf(this.searchText) > -1)
        //     || (contract.product.toLowerCase().indexOf(this.searchText) > -1)
        //     || (contract.grade ? contract.grade.toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (contract.rateOrTon.toString().toLowerCase().indexOf(this.searchText) > -1)
        //     || (contract.contractQuantity.toString().toLowerCase().indexOf(this.searchText) > -1)
        //     || (contract.usedQuantity.toString().toLowerCase().indexOf(this.searchText) > -1)
        //     || (contract.remaningQuantity.toString().toLowerCase().indexOf(this.searchText) > -1)
        //     || (contract.contractDateFrom.toLowerCase().indexOf(this.searchText) > -1)
        //     || (contract.contractDateTo.toLowerCase().indexOf(this.searchText) > -1)
        // ));
        // this.contractList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    deleteContractPopUpOpen(row, deleteContract) {
        this.contractId = row.contractId;
        this.timeStamp = row.timeStamp;
        this.isContractArchived = !this.isArchived;
        this.rowData = row;
        deleteContract.openPopover();
    }

    deleteContract() {
        this.isInProgress = true;
        let contractModel = new ContractModel();
        contractModel.timeStamp = this.timeStamp;
        contractModel.contractId = this.contractId;
        contractModel = this.rowData;
        contractModel.isArchived = this.isContractArchived;

        this.BillingDashboardService.upertContract(contractModel).subscribe((result: any) => {
            if (result.success) {
                this.isInProgress = false;
                this.deleteContractPopup.forEach((p) => p.closePopover());
                this.getContracts();
            }
            else {
                this.isInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    closedeleteContractPopUp() {
        this.deleteContractPopup.forEach((p) => p.closePopover());
    }

    editContractPopupOpen(rowData) {
        const dialogRef = this.dialog.open(ContractComponent, {
            height: 'auto',
            width: '600px',
            disableClose: true,
            data: { rowData: rowData }
        });
        dialogRef.afterClosed().subscribe((success: any) => {
            this.getContracts();
        });
    }

    createLead(rowData) {
        const dialogRef = this.dialog.open(AddLeadDialogComponent, {
            height: 'auto',
            width: '600px',
            disableClose: true,
            data: { rowData: rowData }
        });
        dialogRef.afterClosed().subscribe((success: any) => {
            this.getContracts();
        });
    }

    receiptsCount(row) {
        if (row.receipts) {
            const receipts = row.receipts.split(',');
            return receipts.length;
        }
        return 0;
    }

    showReceiptsPopupOpen(row, showReceiptsPopUp) {
        this.galleryImages = [];
        const receipts = row.receipts.split(',');
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
        showReceiptsPopUp.openPopover();
    }

    closeReceiptsPopup() {
        this.receiptsForAnOrder = [];
        this.receiptsPdfForAnOrder = [];
        this.showReceiptsPopover.forEach((p) => p.closePopover());
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


    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getContracts();
    }
}