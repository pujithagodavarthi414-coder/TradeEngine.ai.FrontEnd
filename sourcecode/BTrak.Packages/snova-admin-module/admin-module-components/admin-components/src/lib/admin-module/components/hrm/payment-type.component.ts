import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { PaymentTypeUpsertModel } from '../../models/hr-models/paymenttype-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-payment-type',
    templateUrl: `payment-type.component.html`
})

export class PaymentTypeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("paymentTypePopup") upsertPaymentTypePopover;
    @ViewChildren("deletePaymentTypePopup") deletePaymentTypePopup;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean = false;
    isFiltersVisible: boolean;
    isArchived: boolean = false;
    isThereAnError: boolean;
    validationMessage: any;
    paymentTypes: string;
    paymentTypeForm: FormGroup;
    paymentTypeId: string;
    paymenttypeModel: PaymentTypeUpsertModel;
    timeStamp: any;
    isPaymentArchived: boolean;
    paymentTypeName: string;
    searchText:string;
    temp:any;
    paymentEdit:string;
    constructor(private cdRef: ChangeDetectorRef, private translateService: TranslateService,public hrManagement: HRManagementService, private snackbar: MatSnackBar)  { super();
        
         }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getPaymentTypes();
    }

    getPaymentTypes() {
        this.isAnyOperationIsInprogress=true;
        var paymenttypeModel = new PaymentTypeUpsertModel();
        paymenttypeModel.isArchived = this.isArchived;

        this.hrManagement.getPaymentTypes(paymenttypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.paymentTypes = response.data;
                this.temp=this.paymentTypes;
                this.clearForm();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    createPaymentType(paymentTypePopup) {
        paymentTypePopup.openPopover();
        this.paymentEdit=this.translateService.instant('PAYMENTTYPE.ADDPAYMENTTYPE');
    }

    clearForm() {
        this.paymentTypeId = null;
        this.paymentTypeName=null;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.paymenttypeModel = null;
        this.searchText = null;
        this.paymentTypeForm = new FormGroup({
            paymentTypeName: new FormControl(null,
                Validators.compose([
                    Validators.min(0),
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
        })
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    upsertPaymentType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
     
        var paymentTypeModel = new PaymentTypeUpsertModel();
        paymentTypeModel = this.paymentTypeForm.value;
        paymentTypeModel.paymentTypeName=paymentTypeModel.paymentTypeName.trim();
        paymentTypeModel.paymentTypeId = this.paymentTypeId;
        paymentTypeModel.timeStamp = this.timeStamp;
        this.hrManagement.upsertPaymenttype(paymentTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertPaymentTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getPaymentTypes();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    editPaymentType(row, paymenttypePopup) {
        this.paymentTypeForm.patchValue(row);
        this.paymentTypeId = row.paymentTypeId;
        this.timeStamp = row.timeStamp;
        this.paymentEdit=this.translateService.instant('PAYMENTTYPE.EDITPAYMENTTYPE');
        paymenttypePopup.openPopover();
    }

    closeUpsertPaymentTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPaymentTypePopover.forEach((p) => p.closePopover());
    }

    deletePaymentTypePopUpOpen(row, deletePaymentTypePopup) {
        this.paymentTypeId = row.paymentTypeId;
        this.paymentTypeName = row.paymentTypeName;
        this.timeStamp = row.timeStamp;
        this.isPaymentArchived = !this.isArchived;
        deletePaymentTypePopup.openPopover();
    }

    closeDeletePaymentTypePopup() {
        this.clearForm();
        this.deletePaymentTypePopup.forEach((p) => p.closePopover());
    }

    deletePaymentType() {
        this.isAnyOperationIsInprogress = true;
        
        let paymenttypeModel = new PaymentTypeUpsertModel();
        paymenttypeModel.paymentTypeId = this.paymentTypeId;
        paymenttypeModel.paymentTypeName = this.paymentTypeName;
        paymenttypeModel.timeStamp = this.timeStamp;
        paymenttypeModel.isArchived = this.isPaymentArchived;

        this.hrManagement.upsertPaymenttype(paymenttypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deletePaymentTypePopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getPaymentTypes();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
     
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
    
        const temp = this.temp.filter((paymentType => (paymentType.paymentTypeName.toLowerCase().indexOf(this.searchText) > -1)));
        this.paymentTypes = temp;
    }
    
    closeSearch() {
        this.filterByName(null);
    }
}
