import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { PaymentMethodModel } from '../../models/hr-models/paymentMethodModel';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: "app-fm-component-payment-method",
    templateUrl: `payment-method.component.html`
})

export class PaymentMethodComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChildren("deletePaymentMethodPopUp") deletePaymentMethodPopover;
    @ViewChildren("upsertPaymentMethodPopUp") upsertPaymentMethodPopover;

    paymentMethodForm: FormGroup;
    isFiltersVisible = false;
    isArchivedTypes = false;
    isPaymentMethodArchived: boolean;
    isThereAnError = false;
    paymentMethodId: string;
    paymentMethodName: string;
    validationMessage: string;
    searchText: string;
    paymentMethod: PaymentMethodModel;
    isAnyOperationIsInprogress = true;
    paymentMethods: PaymentMethodModel[];
    timeStamp: any;
    temp: any;
    payment: string;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllPaymentMethods();
    }

    constructor(
        private cdref: ChangeDetectorRef,
        private translateService: TranslateService, private hrManagementService: HRManagementService,
        private snackbar: MatSnackBar) {
        super();
        
        
    }

    getAllPaymentMethods() {
        this.isAnyOperationIsInprogress = true;
        const paymentMethodModel = new PaymentMethodModel();
        paymentMethodModel.isArchived = this.isArchivedTypes;
        this.hrManagementService.getAllPaymentMethods(paymentMethodModel).subscribe((response: any) => {
            if (response.success === true) {
                this.paymentMethods = response.data;
                this.temp = this.paymentMethods;
                this.clearForm();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdref.detectChanges();
        });
    }

    deletePaymentMethodPopUpOpen(row, deletePaymentMethodPopUp) {
        this.paymentMethodId = row.paymentMethodId;
        this.paymentMethodName = row.paymentMethodName;
        if (this.isArchivedTypes) {
            this.isPaymentMethodArchived = row.isArchived;
        } else {
            this.isPaymentMethodArchived = !row.isArchived;
        }
        this.timeStamp = row.timeStamp;
        deletePaymentMethodPopUp.openPopover();
    }

    closeDeletePaymentMethodDialog() {
        this.clearForm();
        this.deletePaymentMethodPopover.forEach((p) => p.closePopover());
    }

    upsertPaymentMethod(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.paymentMethod = this.paymentMethodForm.value;
        this.paymentMethod.paymentMethodName = this.paymentMethod.paymentMethodName.toString().trim();
        this.paymentMethod.paymentMethodId = this.paymentMethodId;
        this.paymentMethod.timeStamp = this.timeStamp;
        this.hrManagementService.upsertPaymentMethod(this.paymentMethod).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertPaymentMethodPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllPaymentMethods();
            } else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdref.detectChanges();
        });

    }

    deletePaymentMethod() {
        this.isAnyOperationIsInprogress = true;
        this.paymentMethod = new PaymentMethodModel();
        this.paymentMethod.paymentMethodId = this.paymentMethodId;
        this.paymentMethod.paymentMethodName = this.paymentMethodName;
        this.paymentMethod.timeStamp = this.timeStamp;
        this.paymentMethod.isArchived = this.isPaymentMethodArchived;
        this.hrManagementService.upsertPaymentMethod(this.paymentMethod).subscribe((response: any) => {
            if (response.success === true) {
                this.deletePaymentMethodPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllPaymentMethods();
            } else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdref.detectChanges();
        });
    }

    editPaymentMethod(row, upsertPaymentMethodPopUp) {
        this.paymentMethodForm.patchValue(row);
        this.paymentMethodId = row.paymentMethodId;
        this.timeStamp = row.timeStamp;
        this.payment = this.translateService.instant("PAYMENTMETHOD.EDITPAYMENTMETHOD");
        upsertPaymentMethodPopUp.openPopover();
    }

    closeUpsertPaymentMethodPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPaymentMethodPopover.forEach((p) => p.closePopover());
    }

    createPaymentMethod(upsertPaymentMethodPopUp) {
        upsertPaymentMethodPopUp.openPopover();
        this.payment = this.translateService.instant("PAYMENTMETHOD.ADDPAYMENTMETHOD");
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.paymentMethod = null;
        this.paymentMethodId = null;
        this.paymentMethodName = null;
        this.timeStamp = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.paymentMethodForm = new FormGroup({
            paymentMethodName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
        const temp = this.temp.filter(((paymentMethod) => (paymentMethod.paymentMethodName.toLowerCase().indexOf(this.searchText) > -1)));
        this.paymentMethods = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
