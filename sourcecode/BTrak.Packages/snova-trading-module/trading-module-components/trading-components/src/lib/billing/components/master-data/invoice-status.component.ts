import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ColorPickerService } from "ngx-color-picker";
import { ConstantVariables } from "../../constants/constant-variables";
import { InvoiceStatusModel } from "../../models/invoice-status.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
@Component({
    selector: "app-trading-component-invoice-status",
    templateUrl: "invoice-status.component.html",
    providers: [ColorPickerService ]
})
export class InvoiceStatusComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("invoiceStatusPopup") upsertInvoiceStatusPopover;
    @ViewChildren("deleteInvoiceStatusPopup") deleteInvoiceStatusPopup;

    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    invoiceStatusList: InvoiceStatusModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    invoiceStatus: string;
    invoiceStatusId: string;
    timeStamp: any;
    invoiceStatusName: string;
    statusName: string;
    isArchived: boolean;
    isInvoiceStatusArchived: boolean;
    invoiceStatusForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    invoiceStatusModel: InvoiceStatusModel;
    productList: any;
    public color = "";

    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
        private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllInvoiceStatuss();
    }

    getAllInvoiceStatuss() {
        let invoiceStatus = new InvoiceStatusModel();
        invoiceStatus.isArchived = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllInvoiceStatus(invoiceStatus)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.invoiceStatusList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }


    editInvoiceStatus(rowDetails, invoiceStatusPopup) {
        this.invoiceStatusForm.patchValue(rowDetails);
        this.invoiceStatusId = rowDetails.invoiceStatusId;
        this.color = rowDetails.invoiceStatusColor;
        this.statusName = rowDetails.statusName;

        // this.vessel = this.translateService.instant("BILLINGGRADE.EDITGRADE");
        this.invoiceStatus = this.translateService.instant("TRADEINVOICE.EDITINVOICESTATUS");
         invoiceStatusPopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((invoiceStatus) =>
            (invoiceStatus.invoiceStatusName.toLowerCase().indexOf(this.searchText) > -1)));
        this.invoiceStatusList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createInvoiceStatus(invoiceStatusPopup) {
        invoiceStatusPopup.openPopover();
        this.invoiceStatus = "Add status";
    }

    deleteInvoiceStatusPopUpOpen(row, deleteInvoiceStatusPopup) {
        this.invoiceStatusId = row.invoiceStatusId;
        this.invoiceStatusName = row.invoiceStatusName;
        this.timeStamp = row.timeStamp;
        this.isInvoiceStatusArchived = !this.isArchived;
        deleteInvoiceStatusPopup.openPopover();
    }

    upsertInvoiceStatus(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let invoiceStatus = new InvoiceStatusModel();
        invoiceStatus = this.invoiceStatusForm.value;
        invoiceStatus.invoiceStatusName = invoiceStatus.invoiceStatusName.trim();
        if(!this.invoiceStatusId) {
            invoiceStatus.statusName = invoiceStatus.invoiceStatusName.trim();
        }
        else {
            invoiceStatus.statusName = this.statusName;
        }
        invoiceStatus.invoiceStatusId = this.invoiceStatusId;
        invoiceStatus.timeStamp = this.timeStamp;
        this.BillingDashboardService.upsertInvoiceStatus(invoiceStatus).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertInvoiceStatusPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllInvoiceStatuss();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.invoiceStatusId = null;
        this.validationMessage = null;
        this.invoiceStatusName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.invoiceStatusModel = null;
        this.timeStamp = null;
        this.color = "";

        this.invoiceStatusForm = new FormGroup({
            invoiceStatusName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            invoiceStatusColor: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    closeUpsertInvoiceStatusPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertInvoiceStatusPopover.forEach((p) => p.closePopover());
    }

    closeDeleteInvoiceStatusPopup() {
        this.clearForm();
        this.deleteInvoiceStatusPopup.forEach((p) => p.closePopover());
    }

    deleteInvoiceStatus() {
        this.isAnyOperationIsInprogress = true;
        const invoiceStatusModel = new InvoiceStatusModel();
        invoiceStatusModel.invoiceStatusId = this.invoiceStatusId;
        invoiceStatusModel.invoiceStatusName = this.invoiceStatusName;
        invoiceStatusModel.timeStamp = this.timeStamp;
        invoiceStatusModel.isArchived = this.isInvoiceStatusArchived;
        this.BillingDashboardService.upsertInvoiceStatus(invoiceStatusModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteInvoiceStatusPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllInvoiceStatuss();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
    omit_special_char(event) {
      var inp = String.fromCharCode(event.keyCode);
      // Allow only alpahbets
      if (/[a-zA-Z]/.test(inp)) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
}