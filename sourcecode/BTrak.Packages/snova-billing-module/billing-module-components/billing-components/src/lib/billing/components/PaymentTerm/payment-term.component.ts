import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ConstantVariables } from "../../constants/constant-variables";
import { PaymentTermModel } from "../../models/payment-term.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
@Component({
    selector: "app-payment-term-component",
    templateUrl: "payment-term.component.html"
})

export class PaymentTermComponent extends AppBaseComponent implements OnInit {
    
    @ViewChildren("paymentTermPopup") upsertPaymentTermPopover;
    @ViewChildren("deletePaymentTermPopup") deletePaymentTermPopup;

    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    paymentTermList: PaymentTermModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    paymentTerm: string;
    id: string;
    timeStamp: any;
    paymentTermName: string;;
    isArchived: boolean;
    isPaymentTermArchived: boolean;
    paymentTermForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    paymentTermModel: PaymentTermModel;

    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
                private cdRef: ChangeDetectorRef) {
                    super();
                    this.isArchived=false;
    }

    ngOnInit() {
       super.ngOnInit();
        this.clearForm();
        this.getAllPaymentTerms();
    }

    getAllPaymentTerms() {
        let paymentTerm = new PaymentTermModel();
        paymentTerm.isArchived = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllPaymentTerms(paymentTerm)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.paymentTermList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }

    
    editPaymentTerm(rowDetails, paymentTermPopup) {
        this.paymentTermForm.patchValue(rowDetails);
        this.id = rowDetails.id;
        this.paymentTerm = this.translateService.instant("PAYMENTTERM.EDITPAYMENTTERM");
        paymentTermPopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((paymentTerm) =>
            (paymentTerm.name.toLowerCase().indexOf(this.searchText) > -1)));
        this.paymentTermList =temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createPaymentTerm(paymentTermPopup) {
        paymentTermPopup.openPopover();
        this.paymentTerm = this.translateService.instant("PAYMENTTERM.ADDPAYMENTTERM");
    }

    deletePaymentTermPopUpOpen(row, deletePaymentTermPopup) {
        this.id = row.id;
        this.paymentTermName = row.name;
        this.timeStamp = row.timeStamp;
        this.isPaymentTermArchived = !this.isArchived;
        deletePaymentTermPopup.openPopover();
    }

    upsertPaymentTerm(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let paymentTerm = new PaymentTermModel();
        paymentTerm = this.paymentTermForm.value;
        paymentTerm.name = paymentTerm.name.trim();
        paymentTerm.id = this.id;
        paymentTerm.timeStamp = this.timeStamp;
        this.BillingDashboardService.upsertPaymentTerm(paymentTerm).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertPaymentTermPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllPaymentTerms();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.id = null;
        this.validationMessage = null;
        this.paymentTermName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.paymentTermModel = null;
        this.timeStamp = null;
        this.paymentTermForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    closeUpsertPaymentTermPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPaymentTermPopover.forEach((p) => p.closePopover());
    }

    closeDeletePaymentTermPopup() {
        this.clearForm();
        this.deletePaymentTermPopup.forEach((p) => p.closePopover());
    }

    deletePaymentTerm() {
        this.isAnyOperationIsInprogress = true;
        const paymentTermModel = new PaymentTermModel();
        paymentTermModel.id = this.id;
        paymentTermModel.name = this.paymentTermName;
        paymentTermModel.timeStamp = this.timeStamp;
        paymentTermModel.isArchived = this.isPaymentTermArchived;
        this.BillingDashboardService.upsertPaymentTerm(paymentTermModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deletePaymentTermPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllPaymentTerms();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
}