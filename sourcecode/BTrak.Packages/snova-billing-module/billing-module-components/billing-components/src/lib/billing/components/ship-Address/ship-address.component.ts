import { ChangeDetectorRef, Component, Input, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { State, process } from "@progress/kendo-data-query";
import { PaymentTermModel } from "../../models/payment-term.model";
import { ShipAddressModel } from "../../models/ship-address.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
import { DocumentsDescriptionComponent } from "../documents-description/documents-description.component";
import { ReceiptsComponent } from "../Receipts/receipts.component";
@Component({
    selector: "app-ship-address-list-component",
    templateUrl: "ship-address.component.html"
})

export class ShipAddressComponent extends AppBaseComponent implements OnInit {
    
    @ViewChildren("shipAddressPopup") upsertShipAddressPopover;
    @ViewChildren("deleteShipAddressPopup") deleteShipAddressPopup;
    ClientId: any;
    appType: any;
    isVerified: boolean;
    selectedShipAddress: any;
    shipAddressListData: { data: any; total: any; };
    shipAddressAppTitle: any;
    shipAddressCreateTitle: any;
    shipAddressEditTitle: any;
    shipAddressArchiveTitle: any;
    shipAddressUnarchiveTitle: any;
    @Input("clientId")
    set _clientId(data: any) {  
        this.ClientId = data;  
        this.getShipToAddresses();
    }
    @Input("appType")
    set _appType(data: any) {
        this.appType=data;  
        this.shipAddressAppTitle = this.appType!='shipToAddress'?this.translateService.instant("SHIPTOADDRESS.BILLTOADDRESS"):this.translateService.instant("SHIPTOADDRESS.SHIPTOADDRESS");
        this.shipAddressCreateTitle = this.appType!='shipToAddress'?this.translateService.instant("SHIPTOADDRESS.CREATEBILLTOADDRESS"):this.translateService.instant("SHIPTOADDRESS.CREATESHIPTOADDRESS");
        this.shipAddressEditTitle = this.appType!='shipToAddress'?this.translateService.instant("SHIPTOADDRESS.EDITBILLTOADDRESS"):this.translateService.instant("SHIPTOADDRESS.EDITSHIPTOADDRESS");
        this.shipAddressArchiveTitle = this.appType!='shipToAddress'?this.translateService.instant("SHIPTOADDRESS.ARCHIVEBILLTOADDRESS"):this.translateService.instant("SHIPTOADDRESS.ARCHIVESHIPTOADDRESS");
        this.shipAddressUnarchiveTitle = this.appType!='shipToAddress'?this.translateService.instant("SHIPTOADDRESS.UNARCHIVEBILLTOADDRESS"):this.translateService.instant("SHIPTOADDRESS.UNARCHIVESHIPTOADDRESS");
    }
    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    shipAddressList: PaymentTermModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    shipAddressTitle: string;
    id: string;
    timeStamp: any;
    addressName: string;;
    isArchived: boolean;
    shipAddressForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    sortBy: string;
    sortDirection: boolean = true;

    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
                private cdRef: ChangeDetectorRef, public dialog: MatDialog ) {
                    super();
                    this.isArchived=false;
    }

    ngOnInit() {
       super.ngOnInit();
        this.clearForm();
    }

    getShipToAddresses() {
        let shipAddressModel = new ShipAddressModel();
        shipAddressModel.clientId = this.ClientId;
        shipAddressModel.isArchived = this.isArchived;
        shipAddressModel.isShiptoAddress = this.appType=='shipToAddress'?true:false;
        shipAddressModel.sortBy = this.sortBy;
        shipAddressModel.sortDirectionAsc = this.sortDirection;
        shipAddressModel.searchText = this.searchText;
        shipAddressModel.pageNumber = (this.state.skip / this.state.take) + 1;
        shipAddressModel.pageSize = this.state.take;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.GetShipToAddresses(shipAddressModel)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.shipAddressList = responseData.data;
                this.shipAddressListData = {
                    data: responseData.data,
                    total: responseData.data.length > 0 ? responseData.data[0].totalCount : 0,
                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }

    
    editShipAddress(rowDetails, shipAddressPopup) {
        this.shipAddressForm.patchValue(rowDetails);
        this.selectedShipAddress = rowDetails;
        this.id=rowDetails.addressId;
        this.timeStamp=rowDetails.timeStamp;
        this.shipAddressTitle = this.appType!='shipToAddress'?this.translateService.instant("SHIPTOADDRESS.EDITBILLTOADDRESS"):this.translateService.instant("SHIPTOADDRESS.EDITSHIPTOADDRESS");
        shipAddressPopup.openPopover();
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
        this.getShipToAddresses();
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createShipAddress(shipAddressPopup) {
        shipAddressPopup.openPopover();
        this.shipAddressTitle = this.appType!='shipToAddress'?this.translateService.instant("SHIPTOADDRESS.CREATEBILLTOADDRESS"):this.translateService.instant("SHIPTOADDRESS.CREATESHIPTOADDRESS");
    }

    archiveShipAddressPopupOpen(row, deleteShipAddressPopup) {
        this.selectedShipAddress = row;
        deleteShipAddressPopup.openPopover();
    }

    upsertShipToAddress(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let shipAddressModel = new ShipAddressModel();
        shipAddressModel = this.shipAddressForm.value;
        shipAddressModel.addressName = shipAddressModel.addressName.trim();
        shipAddressModel.addressId = this.id;
        shipAddressModel.clientId = this.ClientId;
        shipAddressModel.isShiptoAddress = this.appType=='shipToAddress'?true:false;
        shipAddressModel.timeStamp = this.timeStamp;
        this.BillingDashboardService.UpsertShipToAddress(shipAddressModel).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertShipAddressPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getShipToAddresses();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.selectedShipAddress=[];
        this.id = null;
        this.validationMessage = null;
        this.addressName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.timeStamp = null;
        this.shipAddressForm = new FormGroup({
            addressName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            ),
            isVerified: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(250)
                ])
            ),
            comments: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(250)
                ])
            )
        })
    }

    closeUpsertShipAddressPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertShipAddressPopover.forEach((p) => p.closePopover());
    }

    closeArchiveShipAddressPopup() {
        this.clearForm();
        this.deleteShipAddressPopup.forEach((p) => p.closePopover());
    }

    archiveShipToAddress() {
        this.isAnyOperationIsInprogress = true;
        const shipAddressModel = new ShipAddressModel();
        shipAddressModel.addressId = this.selectedShipAddress.addressId;
        shipAddressModel.clientId = this.ClientId;
        shipAddressModel.addressName = this.selectedShipAddress.addressName;
        shipAddressModel.isVerified = this.selectedShipAddress.isVerified;
        shipAddressModel.description = this.selectedShipAddress.description;
        shipAddressModel.isShiptoAddress = this.appType=='shipToAddress'?true:false;
        shipAddressModel.timeStamp = this.selectedShipAddress.timeStamp;
        shipAddressModel.isArchived = !this.isArchived;
        this.BillingDashboardService.UpsertShipToAddress(shipAddressModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteShipAddressPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getShipToAddresses();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getShipToAddresses();
    }
    openDocumentPopup(dataItem) {
        const dialogRef = this.dialog.open(DocumentsDescriptionComponent, {
            height: 'auto',
            width: '700px',
            disableClose: true,
            data: { rowData: dataItem }
        });
        dialogRef.afterClosed().subscribe((success: any) => {
            this.getShipToAddresses();
        });
    }
    showReceiptsPopupOpen(row) {
        const dialogRef = this.dialog.open(ReceiptsComponent, {
            height: 'auto',
            width: '700px',
            disableClose: true,
            data: { rowData: row }
        });
        dialogRef.afterClosed().subscribe((success: any) => {
            this.getShipToAddresses();
        });
    }
    receiptsCount(row) {
        if (row.receipts) {
            const receipts = row.receipts.split(',');
            return receipts.length;
        }
        return 0;
    }
}