import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, ViewChildren } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions } from "ngx-gallery-9";
import { ToastrService } from "ngx-toastr";
import { BLModel } from "../../models/bl-model";
import { ClientSearchInputModel } from "../../models/client-search-input.model";
import { EmployeeListModel } from "../../models/employee-list-model";
import { PaymentTermModel, ShipmentBLModel } from "../../models/payment-term.model";
import { ShipmentExecutionModel } from "../../models/shipment-execution.model";
import { SoftLabelConfigurationModel } from "../../models/softlabels-model";
import { FetchSizedAndCachedImagePipe } from "../../pipes/fetchSizedAndCachedImage.pipe";
import { SoftLabelPipe } from "../../pipes/softlabels.pipes";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
import { ShipmentStageTwoForm } from "../supplier-process/stage-two-process.component";
import { BlListComponent } from "./bl-list.component";
export interface DialogData {
    rowData: any;
}

@Component({
    selector: "app-supplier-bl",
    templateUrl: "supplier-bl.component.html"
})

export class SupplierBlComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("deleteContractPopup") deleteContractPopup;
    @ViewChildren("showReceiptsPopUp") showReceiptsPopover;
    @Output() reloadPurchaseForm = new EventEmitter<any>();
    vesselId: any;
    portId: any;
    portDetailList: PaymentTermModel[] = [];
    softLabels: SoftLabelConfigurationModel[];
    isEdit: boolean = false;
    VesselList: any;
    supplierList: any;
    supplierListData: GridDataResult = {
        data: [],
        total: 0
    };
    temp: any;
    searchText: string;
    state: State = {
        skip: 0,
        take: 20,
    };
    sortBy: string;
    sortDirection: boolean = true;
    isArchived: any;
    blId: any;
    timeStamp: any;
    isBlArchived: boolean;
    rowData: any;
    purchaseShipmentBLId: string;
    purchaseShipmentId: string;
    isInProgress: boolean;
    galleryImages: NgxGalleryImage[];
    imageExtensions: string[] = ["png", "jpeg", "jpg", "gif"];
    receiptsForAnOrder: any[] = [];
    receiptsPdfForAnOrder: any[] = [];
    galleryOptions: NgxGalleryOptions[];
    @ViewChildren("documentPopover") documentPopover;
    isIntialDocuments: boolean;
    dataItem: any;
    shareDocumentsLoading: boolean = false;
    selectedChaUserId: string;
    documentText: string;
    clientData: any = null;

    constructor(private BillingDashboardService: BillingDashboardService, private imagePipe: FetchSizedAndCachedImagePipe,
        private translateService: TranslateService, @Inject(MAT_DIALOG_DATA) public data: DialogData, private toastr: ToastrService, private route: ActivatedRoute,
        public dialogRef: MatDialogRef<SupplierBlComponent>, private softLabelPipe: SoftLabelPipe, public dialog: MatDialog, private datePipe: DatePipe,
        private cdRef: ChangeDetectorRef) {
        super();
        this.route.params.subscribe(routeParams => {
            if (routeParams.id1 && routeParams.id2) {
                this.purchaseShipmentBLId = routeParams.id2;
            }
        })
    }
    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        // this.purchaseShipmentBLId = '506D69C9-AF07-46F2-8D8A-8D4AEDF12EFE';
        this.getAllBlDetails();
        this.getClients();
    }
    getAllPortDetails() {
        let portDetail = new PaymentTermModel();
        portDetail.isArchived = false;
        this.BillingDashboardService.GetAllPortDetails(portDetail)
            .subscribe((responseData: any) => {
                this.portDetailList = responseData.data;
            });
    }

    getClients() {
        let clientSearchInputModel = new ClientSearchInputModel();
        clientSearchInputModel.isArchived = false;
        clientSearchInputModel.clientType = 'Other';
        this.BillingDashboardService.getClients(clientSearchInputModel)
            .subscribe((responseData: any) => {
                this.clientData = responseData.data;
            })
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        if (this.softLabels && this.softLabels.length > 0) {
            this.cdRef.markForCheck();
        }
    }
    editFormComponent() {
        this.isEdit = !this.isEdit;
    }
    addblList() {
        this.editBlPopupOpen(null)
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
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getAllBlDetails();
    }
    editBlPopupOpen(dataItem) {
        const dialogRef = this.dialog.open(BlListComponent, {
            height: 'auto',
            width: '700px',
            disableClose: true,
            data: { rowData: dataItem }
        });
        dialogRef.afterClosed().subscribe((success: any) => {
            this.getAllBlDetails();
            this.reloadPurchaseForm.emit('');
        });
    }

    stageTwoBlPopupOpen(dataItem) {
        const dialogRef = this.dialog.open(ShipmentStageTwoForm, {
            maxWidth: "80vw",
            width: "75%",
            disableClose: true,
            data: { rowData: dataItem }
        });
        dialogRef.afterClosed().subscribe((success: any) => {
            this.getAllBlDetails();
        });
    }
    openDocument(dataItem, type) {
        const dialogRef = this.dialog.open(BlListComponent, {
            height: 'auto',
            width: '700px',
            disableClose: true,
            data: { rowData: dataItem, type: type }
        });
        dialogRef.afterClosed().subscribe((success: any) => {
            this.getAllBlDetails();
        });
    }
    getAllBlDetails() {
        let bldet = new ShipmentBLModel();
        bldet.isArchived = this.isArchived;
        bldet.purchaseShipmentId = this.purchaseShipmentBLId;
        bldet.searchText=this.searchText;
        this.BillingDashboardService.GetShipmentExecutionBLs(bldet)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.temp = responseData.data;
                    this.supplierList = responseData.data;

                    this.supplierListData = {
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
            })
    }
    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }
    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
        this.getAllBlDetails()
     
        // this.supplierList = temp;
        
        // const temp = this.temp.filter(((bl) =>
        //     (bl.blNumber.toLowerCase().indexOf(this.searchText) > -1)
        //     || (this.datePipe.transform(bl.blDate,"dd-MMM-yyyy").toString().toLowerCase().indexOf(this.searchText) > -1)
        //     || (bl.blQuantity.toString().toLowerCase().indexOf(this.searchText) > -1)
        //     || (bl.consignee.toLowerCase().indexOf(this.searchText) > -1)
        //     || (bl.consigner.toLowerCase().indexOf(this.searchText) > -1)
        //     || (bl.notifyParty.toLowerCase().indexOf(this.searchText) > -1)
        //     || (bl.packingDetails.toLowerCase().indexOf(this.searchText) > -1)
        // ));
        // this.supplierList = temp;
        // this.supplierListData = {
        //     data: this.supplierList,
        //     total: this.supplierList.length > 0 ? this.supplierList[0].totalCount : 0,
        // }
    }
    closedeleteContractPopUp() {
        this.deleteContractPopup.forEach((p) => p.closePopover());
    }

    deleteContractPopUpOpen(row, deleteContract) {
        this.blId = row.contractId;
        this.timeStamp = row.timeStamp;
        this.isBlArchived = !this.isArchived;
        this.purchaseShipmentId = row.purchaseShipmentId;
        this.rowData = row;
        deleteContract.openPopover();
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
    deleteShipBl() {
        this.isInProgress = true;
        let shipDet = new ShipmentExecutionModel();
        shipDet.timeStamp = this.timeStamp;
        shipDet = this.rowData;
        shipDet.isArchived = this.isBlArchived;
        shipDet.PurchaseExecutionId = this.purchaseShipmentId;
        this.BillingDashboardService.UpsertShipmentExecutionBL(shipDet).subscribe((result: any) => {
            if (result.success) {
                this.isInProgress = false;
                this.deleteContractPopup.forEach((p) => p.closePopover());
                this.getAllBlDetails();
                this.reloadPurchaseForm.emit('');
            }
            else {
                this.isInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    shareDocuments(dataItem, isIntialDocuments) {
        var blModel = new BLModel();
        blModel = dataItem;
        blModel.isInitialDocumentsMail = isIntialDocuments;
        blModel.chaId = this.selectedChaUserId;
        this.shareDocumentsLoading = true;
        this.BillingDashboardService.UpsertBL(blModel).subscribe((result: any) => {
            if (result.success) {
                this.purchaseShipmentBLId = result.data;
                this.shareDocumentsLoading = false;
                if (isIntialDocuments) {
                    this.toastr.success("", "Intial Documents Shared successfully");
                }
                else {
                    this.toastr.success("", "Final Documents Shared successfully");
                }
            } else {
                this.shareDocumentsLoading = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    closeSendEmailPopover() {
        this.documentPopover.forEach((p) => p.closePopover());
        this.selectedChaUserId = null;
    }

    openDocumentPopup(dataItem, popUp, isIntialDocuments) {
        this.dataItem = dataItem;
        this.isIntialDocuments = isIntialDocuments;
        this.selectedChaUserId = dataItem.chaId;
        if (this.isIntialDocuments) {
            this.documentText = "Assign CHA and share intial documents to CHA"
        }
        else {
            this.documentText = "Assign CHA and share final documents to CHA"
        }
        popUp.openPopover();
    }

    employeeSelection(event) {
        this.selectedChaUserId = event.value;
    }
}