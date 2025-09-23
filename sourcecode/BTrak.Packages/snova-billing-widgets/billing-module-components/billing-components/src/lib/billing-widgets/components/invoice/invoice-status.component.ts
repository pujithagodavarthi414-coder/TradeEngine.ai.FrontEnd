import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";


import { InvoiceService } from "../../services/invoice.service";

import { InvoiceInputModel } from '../../models/invoice-input-model';
import { AppBaseComponent } from '../componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
    selector: "invoice-status",
    templateUrl: "invoice-status.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoiceStatusComponent extends AppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    roleFeaturesIsInProgress$: Observable<boolean>;

    dashboardFilters: DashboardFilterModel;
    invoiceStatusList = [];

    invoiceDetails: any;
    deleteInvoiceDetails: any;
    take: number = 10;
    validationMessage: string;
    isEditInvoice: boolean = false;
    showFilters: boolean = false;
    isArchived: boolean = false;
    anyOperationIsInprogress: boolean = false;
    deleteOperationIsInprogress: boolean = false;

    constructor(private invoiceService: InvoiceService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
          if(this.canAccess_feature_ViewOrManageInvoiceStatus) {
            this.getInvoiceStatuses();
          }
    }

    getInvoiceStatuses() {
        this.anyOperationIsInprogress = true;
        let invoiceModel = new InvoiceInputModel();
        invoiceModel.isArchived = this.isArchived;
        this.invoiceService.getInvoiceStatuses(invoiceModel).subscribe((result: any) => {
            if (result.success) {
                this.invoiceStatusList = result.data;
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
}