import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { AppBaseComponent } from '../componentbase';
import { ProductTableModel } from '../../models/product-table.model';
import { BillingDashboardService } from '../../services/billing-dashboard.service';

@Component({
    selector: 'app-product-table',
    templateUrl: `product-table.component.html`
})

export class ProductTableComponent extends AppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    @Input("fromRoute")
    set _fromRoute(data: boolean) {
        if (data || data == false)
            this.isFromRoute = data;
        else
            this.isFromRoute = true;
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChildren("upsertProductPopUp") upsertProductPopover: any[];
    @ViewChildren("deleteProductPopup") deleteProductPopover;

    isAnyOperationIsInprogress: boolean = true;
    isArchived: boolean = false;
    toastr: any;
    products: ProductTableModel[];
    validationMessage: string;
    isFiltersVisible: boolean = false;
    isFromRoute: boolean = false;
    isThereAnError: boolean;
    ipAddressForm: FormGroup;
    IpAddress: string;
    timeStamp: any;
    temp: any;
    searchText: string;
    productId: string;
    productName: string;
    loading: boolean = false;
    // roleFeaturesIsInProgress$:Observable<boolean>;
    productTitle: string;
    ipPattern: string;

    constructor(
        private masterDataManagementService: BillingDashboardService, private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef
        , private translateService: TranslateService) {
        super();
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getProducts();
    }

    getProducts() {
        this.isAnyOperationIsInprogress = true;
        var ipAddressModel = new ProductTableModel();
        ipAddressModel.isArchived = this.isArchived;
        this.masterDataManagementService.getProducts(ipAddressModel).subscribe((response: any) => {
            if (response.success == true) {
                this.isThereAnError = false;
                this.clearForm();
                this.products = response.data;
                this.temp = this.products;
                this.isAnyOperationIsInprogress = false;
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

    createProduct(upsertProductPopUp) {
        upsertProductPopUp.openPopover();
        this.productTitle = this.translateService.instant('PRODUCT.PRODUCTTITLE');
    }

    closeupsertPopUpPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertProductPopover.forEach((p) => p.closePopover());
    }

    editproducts(row, upsertProductPopUp) {
        this.ipAddressForm.patchValue(row);
        this.productId = row.productId;
        this.timeStamp = row.timeStamp;
        this.productTitle = this.translateService.instant('PRODUCT.EDITIPRODUCT');
        upsertProductPopUp.openPopover();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    UpsertProduct(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        let producList = new ProductTableModel();
        producList = this.ipAddressForm.value;
        producList.productName = producList.productName.toString().trim();
        producList.productId = this.productId;
        producList.timeStamp = this.timeStamp;

        this.masterDataManagementService.upsertproducts(producList).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertProductPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getProducts();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });

    }

    clearForm() {
        this.productName = null;
        this.productId = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.ipAddressForm = new FormGroup({
            productName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            )
        })
    }

    deleteProductPopupOpen(row, deleteProductPopup) {
        this.productId = row.productId;
        this.productName = row.productName;
        this.timeStamp = row.timeStamp;
        deleteProductPopup.openPopover();
    }

    closedeletePopup() {
        this.clearForm();
        this.deleteProductPopover.forEach((p) => p.closePopover());
    }

    deleteProducts() {
        this.isAnyOperationIsInprogress = true;

        let productModel = new ProductTableModel();
        productModel.productId = this.productId;
        productModel.productName = this.productName;
        productModel.timeStamp = this.timeStamp;
        productModel.isArchived = !this.isArchived;

        this.masterDataManagementService.upsertproducts(productModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteProductPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getProducts();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
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
        const temp = this.temp.filter(address => (address.productName.toLowerCase().indexOf(this.searchText) > -1));

        this.products = temp;
    }

    closeSearch() {
        this.searchText = '';
        this.filterByName(null);
    }
}
