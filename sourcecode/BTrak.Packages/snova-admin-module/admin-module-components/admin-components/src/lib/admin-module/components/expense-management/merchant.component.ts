import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { MerchantModel } from '../../models/merchant-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-merchant',
    templateUrl: `merchant.component.html`
})

export class MerchantDataComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertMerchantPopup") upsertMerchantPopup;
    @ViewChildren("deleteMerchantPopup") deleteMerchantPopup;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;

    isAnyOperationIsInprogress: boolean = false;
    isArchived: boolean = false;
    isThereAnError: boolean;
    validationMessage: any;
    merchantId: any;
    description: string;
    merchantForm: FormGroup;
    timeStamp: any;
    isFiltersVisible: boolean;
    merchantName: any;
    temp: any;
    searchText: string;
    isMerchantArchived: boolean;
    merchantTitle: string;
    merchants: any;

    constructor(private expenseService: MasterDataManagementService,
        private translateService: TranslateService, private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef) {
             super();
             
             
             }

    ngOnInit() {
        this.clearMerchantForm();
        super.ngOnInit();
        this.searchMerchants();
    }

    searchMerchants() {
        this.isAnyOperationIsInprogress = true;
        var merchantModel = new MerchantModel();
        merchantModel.isArchived = this.isArchived;
        this.expenseService.searchMerchants(merchantModel).subscribe((response: any) => {
            if (response.success == true) {
                this.merchants = response.data;
                this.temp = this.merchants;
                this.clearMerchantForm();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    createMerchant(upsertMerchantPopup) {
        upsertMerchantPopup.openPopover();
        this.merchantTitle = this.translateService.instant('MERCHANT.ADDMERCHANTTITLE');
    }

    editMerchant(row, upsertMerchantPopup) {
        this.merchantForm.patchValue(row);
        this.merchantId = row.merchantId;
        this.timeStamp = row.timeStamp;
        upsertMerchantPopup.openPopover();
        this.merchantTitle = this.translateService.instant('MERCHANT.EDITMERCHANTTITLE');
    }

    clearMerchantForm() {
        this.isAnyOperationIsInprogress = false;
        this.merchantId = null;
        this.merchantName = null;
        this.description = null;
        this.timeStamp = null;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.searchText = null;
        this.merchantForm = new FormGroup({
            merchantName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(ConstantVariables.DescriptionLength)
                ])
            ),
        })
    }

    upsertMerchant(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        let merchant = new MerchantModel();
        merchant = this.merchantForm.value;
        merchant.merchantId = this.merchantId;
        merchant.timeStamp = this.timeStamp;

        this.expenseService.upsertMerchant(merchant).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertMerchantPopup.forEach((p) => p.closePopover());
                this.clearMerchantForm();
                formDirective.resetForm();
                this.searchMerchants();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    closeupsertMerchantPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearMerchantForm();
        this.upsertMerchantPopup.forEach((p) => p.closePopover());
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    deleteExpenseCategoryPopupOpen(row, deleteMerchantPopup) {
        this.merchantId = row.merchantId;
        this.merchantName = row.merchantName;
        this.description = row.description;
        this.timeStamp = row.timeStamp;
        this.isMerchantArchived = !this.isArchived;
        deleteMerchantPopup.openPopover();
    }

    closedeleteMerchantPopup() {
        this.clearMerchantForm();
        this.deleteMerchantPopup.forEach((p) => p.closePopover());
    }

    deleteMerchant() {
        this.isAnyOperationIsInprogress = true;
        let merchant = new MerchantModel();
        merchant.merchantId = this.merchantId;
        merchant.merchantName = this.merchantName;
        merchant.description = this.description;
        merchant.timeStamp = this.timeStamp;
        merchant.isArchived = this.isMerchantArchived;
        this.expenseService.upsertMerchant(merchant).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteMerchantPopup.forEach((p) => p.closePopover());
                this.clearMerchantForm();
                this.searchMerchants();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }


    closeExpenseCategoryPopupOpen() {
        this.clearMerchantForm();
        this.deleteMerchantPopup.forEach((p) => p.closePopover());
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter((category => (category.merchantName.toLowerCase().indexOf(this.searchText) > -1)
            || (category.description == null ? null : (category.description.toLowerCase().indexOf(this.searchText) > -1))));

        this.merchants = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
