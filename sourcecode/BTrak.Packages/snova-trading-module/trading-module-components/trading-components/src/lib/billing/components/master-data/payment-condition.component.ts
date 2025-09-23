import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ConstantVariables } from "../../constants/constant-variables";
import { PaymentConditionModel } from "../../models/payment-condition.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
@Component({
    selector: "app-trading-component-payment-condition",
    templateUrl: "payment-condition.component.html"
})
export class PaymentConditionComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("paymentConditionPopup") upsertPaymentConditionPopover;
    @ViewChildren("deletePaymentConditionPopup") deletePaymentConditionPopup;

    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    paymentConditionList: PaymentConditionModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    paymentCondition: string;
    paymentConditionId: string;
    timeStamp: any;
    paymentConditionName: string;
    isArchived: boolean;
    isPaymentConditionArchived: boolean;
    paymentConditionForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    paymentConditionModel: PaymentConditionModel;
    productList: any;

    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
        private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllPaymentConditions();
    }

    getAllPaymentConditions() {
        let paymentCondition = new PaymentConditionModel();
        paymentCondition.isArchived = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllPaymentConditions(paymentCondition)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.paymentConditionList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }


    editPaymentCondition(rowDetails, paymentConditionPopup) {
        this.paymentConditionForm.patchValue(rowDetails);
        this.paymentConditionId = rowDetails.paymentConditionId;
        // this.vessel = this.translateService.instant("BILLINGGRADE.EDITGRADE");
         this.paymentCondition = this.translateService.instant("PAYMENTCONDITION.EDITPAYMENTCONDITION");
         paymentConditionPopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((paymentCondition) =>
            (paymentCondition.paymentConditionName.toLowerCase().indexOf(this.searchText) > -1)));
        this.paymentConditionList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createPaymentCondition(paymentConditionPopup) {
        paymentConditionPopup.openPopover();
        //this.vessel = this.translateService.instant("BILLINGGRADE.ADDGRADE");
        this.paymentCondition = this.translateService.instant("PAYMENTCONDITION.CREATEPAYMENTCONDITION");
    }

    deletePaymentConditionPopUpOpen(row, deletePaymentConditionPopup) {
        this.paymentConditionId = row.paymentConditionId;
        this.paymentConditionName = row.paymentConditionName;
        this.timeStamp = row.timeStamp;
        this.isPaymentConditionArchived = !this.isArchived;
        deletePaymentConditionPopup.openPopover();
    }

    upsertPaymentCondition(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let paymentCondition = new PaymentConditionModel();
        paymentCondition = this.paymentConditionForm.value;
        paymentCondition.paymentConditionName = paymentCondition.paymentConditionName.trim();
        paymentCondition.paymentConditionId = this.paymentConditionId;
        paymentCondition.timeStamp = this.timeStamp;
        this.BillingDashboardService.upsertPaymentCondition(paymentCondition).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertPaymentConditionPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllPaymentConditions();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.paymentConditionId = null;
        this.validationMessage = null;
        this.paymentConditionName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.paymentConditionModel = null;
        this.timeStamp = null;
        this.paymentConditionForm = new FormGroup({
            paymentConditionName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    closeUpsertPaymentConditionPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPaymentConditionPopover.forEach((p) => p.closePopover());
    }

    closeDeletePaymentConditionPopup() {
        this.clearForm();
        this.deletePaymentConditionPopup.forEach((p) => p.closePopover());
    }

    deletePaymentCondition() {
        this.isAnyOperationIsInprogress = true;
        const paymentConditionModel = new PaymentConditionModel();
        paymentConditionModel.paymentConditionId = this.paymentConditionId;
        paymentConditionModel.paymentConditionName = this.paymentConditionName;
        paymentConditionModel.timeStamp = this.timeStamp;
        paymentConditionModel.isArchived = this.isPaymentConditionArchived;
        this.BillingDashboardService.upsertPaymentCondition(paymentConditionModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deletePaymentConditionPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllPaymentConditions();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
}