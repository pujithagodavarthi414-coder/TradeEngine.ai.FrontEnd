import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { Router } from "@angular/router";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { ShipmentExecutionModel } from "../../models/shipment-execution.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";

@Component({
    selector: "app-billing-component-shipment-execution-list",
    templateUrl: "shipment-execution-list.component.html"
})
export class ShipmentExecutionList extends AppBaseComponent implements OnInit {
    isInProgress: boolean = false;
    shipmentExecutionList: ShipmentExecutionModel[] = [];
    isArchived: boolean = false;
    searchText: string;
    temp: any;
    @ViewChildren("deleteShipmentPopup") deleteShipmentPopup;
    timeStamp: any;
    isShipementArchived: boolean;
    rowData: any;
    state: State = {
        skip: 0,
        take: 10,
    };
    sortBy: string;
    sortDirection: boolean = true;
    shipmentExecutionListData: { data: any; total: any; };
    constructor(private BillingDashboardService: BillingDashboardService,
        private toastr: ToastrService,
        private cdRef: ChangeDetectorRef,
        private router: Router) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getShipmentExecutionDetails();
    }

    getShipmentExecutionDetails() {
        this.isInProgress = true;
        let shipmentExecutionModel = new ShipmentExecutionModel();
        shipmentExecutionModel.isArchived = this.isArchived;
        shipmentExecutionModel.sortBy = this.sortBy;
        shipmentExecutionModel.sortDirectionAsc = this.sortDirection;
        shipmentExecutionModel.searchText = this.searchText;
        shipmentExecutionModel.pageNumber = (this.state.skip / this.state.take) + 1;
        shipmentExecutionModel.pageSize = this.state.take;
        this.BillingDashboardService.getShipmentExecutionList(shipmentExecutionModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.shipmentExecutionList = responseData.data;
                    this.temp = this.shipmentExecutionList;
                    this.shipmentExecutionListData = {
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

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
this.getShipmentExecutionDetails();
        // const temp = this.temp.filter(((shipment) =>

        //     (shipment.shipmentNumber ? shipment.shipmentNumber.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (shipment.shipmentQuantity ? shipment.shipmentQuantity.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (shipment.product ? shipment.product.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (shipment.grade ? shipment.grade.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (shipment.totalBlNumber ? shipment.totalBlNumber.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (shipment.vesselName ? shipment.vesselName.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (shipment.voyageNumber ? shipment.voyageNumber.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (shipment.etaDate ? shipment.etaDate.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (shipment.statusName ? shipment.statusName.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        // ));
        // this.shipmentExecutionList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    closedeleteShipmentPopUp() {
        this.deleteShipmentPopup.forEach((p) => p.closePopover());
    }

    deleteShipementPopUpOpen(row, deleteShipment) {
        this.timeStamp = row.timeStamp;
        this.isShipementArchived = !this.isArchived;
        this.rowData = row;
        deleteShipment.openPopover();
    }

    deleteShipement() {
        let shipmentExecutionModel = new ShipmentExecutionModel();
        shipmentExecutionModel.purchaseShipmentId = this.rowData.purchaseShipmentId;
        shipmentExecutionModel.contractId = this.rowData.contractId;
        shipmentExecutionModel.shipmentNumber = this.rowData.shipmentNumber;
        shipmentExecutionModel.shipmentQuantity = this.rowData.shipmentQuantity;
        shipmentExecutionModel.blQuantity = this.rowData.blQuantity;
        shipmentExecutionModel.vesselId = this.rowData.vesselId;
        shipmentExecutionModel.portLoadId = this.rowData.portLoadId;
        shipmentExecutionModel.portDischargeId = this.rowData.portDischargeId;
        shipmentExecutionModel.workEmployeeId = this.rowData.workEmployeeId;
        shipmentExecutionModel.etaDate = this.rowData.etaDate;
        shipmentExecutionModel.fillDueDate = this.rowData.fillDueDate;
        shipmentExecutionModel.timeStamp = this.rowData.timeStamp;
        shipmentExecutionModel.isArchived = this.isShipementArchived;
        this.BillingDashboardService.UpertShipmentExecution(shipmentExecutionModel).subscribe((result: any) => {
            if (result.success) {
                this.isInProgress = false;
                this.deleteShipmentPopup.forEach((p) => p.closePopover());
                this.getShipmentExecutionDetails();
            }
            else {
                this.isInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    editPurchaseExecution(dataItem) {
        this.router.navigate(["billingmanagement/shipmentExecution", dataItem.contractId, dataItem.purchaseShipmentId]);
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getShipmentExecutionDetails();
    }
}