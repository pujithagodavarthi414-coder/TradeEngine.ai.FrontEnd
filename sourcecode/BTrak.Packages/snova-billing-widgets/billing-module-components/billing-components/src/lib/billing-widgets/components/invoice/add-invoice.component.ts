import { Component, ChangeDetectionStrategy, OnInit, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddInvoiceDialogComponent } from "./add-invoice-dialog.component";
import { AppBaseComponent } from '../componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
    selector: "add-invoice",
    templateUrl: "add-invoice.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddInvoiceComponent extends AppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;

    constructor(private dialog: MatDialog) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    addInvoice() {
        const dialogRef = this.dialog.open(AddInvoiceDialogComponent, {
            height: "95%",
            width: "90%",
            direction: 'ltr',
            data: { editInvoice: false, invoiceDetails: null },
            disableClose: true,
            panelClass: 'invoice-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => { });
    }
}