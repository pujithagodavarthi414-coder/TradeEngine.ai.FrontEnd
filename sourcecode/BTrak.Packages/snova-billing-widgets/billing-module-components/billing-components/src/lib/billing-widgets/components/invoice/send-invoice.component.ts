import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
    selector: "app-billing-component-invoice-sendinvoice",
    templateUrl: "send-invoice.component.html"
})

export class SendInvoiceComponent {

    constructor(public dialogRef: MatDialogRef<SendInvoiceComponent>) { }

    ngOnInit() { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}