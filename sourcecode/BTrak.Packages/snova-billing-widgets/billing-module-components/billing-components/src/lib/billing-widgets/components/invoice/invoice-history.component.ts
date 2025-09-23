import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from "@angular/core";
import { InvoiceService } from "../../services/invoice.service";
import { ToastrService } from "ngx-toastr";
import { InvoiceInputModel } from '../../models/invoice-input-model';
import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
    selector: "invoice-history",
    templateUrl: "invoice-history.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoiceHistoryComponent {
    @Input("invoiceId")
    set _invoiceId(data: any) {
        if (data) {
            this.invoiceId = data;
            this.loadHistory(this.invoiceId);
        }
    }

    invoiceHistory = [];

    invoiceId: string;
    validationMessage: string;
    anyOperationIsInprogress: boolean = false;

    constructor(private invoiceService: InvoiceService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) { }

    loadHistory(invoiceId) {
        this.anyOperationIsInprogress = true;
        let invoiceModel = new InvoiceInputModel();
        invoiceModel.invoiceId = invoiceId;
        this.invoiceService.getInvoiceHistory(invoiceModel).subscribe((result: any) => {
            if (result.success) {
                this.invoiceHistory = result.data;
                this.anyOperationIsInprogress = false;
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.anyOperationIsInprogress = false;
                this.cdRef.markForCheck();
            }
        });
    }

    convertValue(value) {
        if (value == '' || value == null)
            return '0.00';
        else
            return parseFloat(value).toFixed(2);
    }
}