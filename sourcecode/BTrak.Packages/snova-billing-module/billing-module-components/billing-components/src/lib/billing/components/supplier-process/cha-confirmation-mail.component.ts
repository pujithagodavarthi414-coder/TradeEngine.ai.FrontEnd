import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogData } from "./stage-two-process.component";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { ToastrService } from "ngx-toastr";
import { ShipmentExecutionModel } from "../../models/shipment-execution.model";

@Component({
    selector: "app-billing-component-cha-confirmation",
    templateUrl: "cha-confirmation-mail.component.html"
})
export class ChaConfirmationMail {

    rowData: any;
    isAnyOperationIsInprogress: boolean = false;
    chaId: string;

    constructor(public dialogRef: MatDialogRef<ChaConfirmationMail>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private toastr: ToastrService,
        private BillingDashboardService: BillingDashboardService) {
        this.rowData = this.data.rowData;
    }

    closeDialog() {
        this.dialogRef.close();
    }

    sendMail() {
        let shipmentExecutionModel = new ShipmentExecutionModel();
        shipmentExecutionModel.blNumber = this.rowData.blNumber;
        shipmentExecutionModel.chaEmail = this.rowData.chaEmail;
        this.BillingDashboardService.sendChaMail(shipmentExecutionModel).subscribe((result: any) => {
            if (result.success) {
                this.chaId = result.data;
                this.isAnyOperationIsInprogress = false;
                this.toastr.success("", "Confirmation to CHA mail sent successfully");
            } else {
                this.isAnyOperationIsInprogress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }
}