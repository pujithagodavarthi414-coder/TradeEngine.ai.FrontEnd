import { Component, ChangeDetectionStrategy, Input, ViewChildren, ChangeDetectorRef, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { InvoiceService } from "../../services/invoice.service";

import { InvoiceLogPayment } from "../../models/invoice-log-payment.model";
import { PaymentMethodModel } from '../../models/payment-method-model';
import { HRManagementService } from '../../services/hr-management.service';
import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
    selector: "invoice-details-preview",
    templateUrl: "invoice-details-preview.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoiceDetailsPreviewComponent {
    @ViewChildren("paymentLogPopover") paymentLogsPopover;
    @Output() closeDetailsDialog = new EventEmitter<any>();

    @Input("invoiceDetails")
    set _invoiceDetails(data: any) {
        if (data) {
            this.invoiceDetails = data;
        }
    }

    logPaymentForm: FormGroup;

    accountTypeList = [];
    paymentTypeList = [];

    invoiceDetails: any;
    amountToBePaid: number;
    validationMessage: string;
    greaterThanZero: boolean = false;
    equalOrLessThanDue: boolean = false;
    anyOperationIsInprogress: boolean = false;

    constructor(private invoiceService: InvoiceService, private hrManagementService: HRManagementService, private toastr: ToastrService, private translateService: TranslateService, private cdRef: ChangeDetectorRef) {
        this.initializePaymentLog();
    }

    getAccountTypes() {
        let logModel = new InvoiceLogPayment();
        logModel.isArchived = false;
        this.invoiceService.getAccountTypes(logModel).subscribe((result: any) => {
            if (result.success) {
                this.accountTypeList = result.data;
                if (this.accountTypeList && this.accountTypeList.length > 0) {
                    this.logPaymentForm.get('paidAccountToId').setValue(this.accountTypeList[0].accountTypeId);
                    this.cdRef.markForCheck();
                }
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        });
    }

    getPaymentMethodTypes() {
        let paymentMethodModel = new PaymentMethodModel();
        paymentMethodModel.isArchived = false;
        this.hrManagementService.getAllPaymentMethods(paymentMethodModel).subscribe((result: any) => {
            if (result.success) {
                this.paymentTypeList = result.data;
                if (this.paymentTypeList && this.paymentTypeList.length > 0) {
                    this.logPaymentForm.get('paymentMethodId').setValue(this.paymentTypeList[0].paymentMethodId);
                    this.cdRef.markForCheck();
                }
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        });
    }

    calculateTaskTotal(task, rate) {
        return (task * rate).toFixed(2);
    }

    calculateItemTotal(price, quantity) {
        return (price * quantity).toFixed(2);
    }

    logPayment(logPopover) {
        this.initializePaymentLog();
        this.checkRemainingAmount();
        logPopover.openPopover();
        this.getAccountTypes();
        this.getPaymentMethodTypes();
    }

    checkRemainingAmount() {
        this.amountToBePaid = (this.invoiceDetails.dueAmount == null || this.invoiceDetails.dueAmount == '') ? 0 : this.invoiceDetails.dueAmount;
        this.logPaymentForm.get('amount').setValue(this.amountToBePaid);
        this.cdRef.markForCheck();
    }

    addLogPayment() {
        this.anyOperationIsInprogress = true;
        this.greaterThanZero = false;
        this.equalOrLessThanDue = false;
        let logPaymentModel = new InvoiceLogPayment();
        logPaymentModel = this.logPaymentForm.value;
        logPaymentModel.notes = logPaymentModel.notes == null ? null : logPaymentModel.notes.trim();
        logPaymentModel.invoiceId = this.invoiceDetails.invoiceId;
        if (logPaymentModel.amount == null || logPaymentModel.amount <= 0) {
            this.greaterThanZero = true;
            this.anyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        }
        else if (logPaymentModel.amount > this.amountToBePaid) {
            this.equalOrLessThanDue = true;
            this.anyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        }
        else {
            this.invoiceService.insertInvoiceLogPayment(logPaymentModel).subscribe((result: any) => {
                if (result.success) {
                    this.anyOperationIsInprogress = false;
                    this.closeLogPopover();
                    this.closeDetailsDialog.emit('');
                    this.cdRef.markForCheck();
                }
                else {
                    this.anyOperationIsInprogress = false;
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                    this.cdRef.markForCheck();
                }
            });
        }
    }

    closeLogPopover() {
        this.paymentLogsPopover.forEach((p) => p.closePopover());
    }

    initializePaymentLog() {
        this.logPaymentForm = new FormGroup({
            paidAccountToId: new FormControl(null, Validators.compose([Validators.required])),
            amount: new FormControl(0.00, []),
            date: new FormControl(new Date(), Validators.compose([Validators.required])),
            paymentMethodId: new FormControl(null, Validators.compose([Validators.required])),
            referenceNumber: new FormControl(null, Validators.compose([Validators.maxLength(50)])),
            notes: new FormControl(null, Validators.compose([Validators.maxLength(800)])),
            sendReceiptTo: new FormControl(false, [])
        });
    }
}