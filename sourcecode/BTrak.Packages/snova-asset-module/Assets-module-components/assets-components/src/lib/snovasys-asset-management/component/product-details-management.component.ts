import { Component, ViewChildren, ViewChild, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductDetails } from '../models/product-details';
import { VendorManagement } from "../models/vendor-management";
import { Product } from "../models/product";
import * as assetModuleReducer from '../store/reducers/index';
import { State } from "../store/reducers/index";
import { LoadSuppliersTriggered } from '../store/actions/supplier.actions';
import { LoadProductsTriggered } from '../store/actions/product.actions';
import { LoadProductDetailsTriggered, CreateProductDetailsTriggered } from '../store/actions/product-details.actions';
import { SatPopover } from '@ncstate/sat-popover';
import { ToastrService } from 'ngx-toastr';
import { Page } from '../models/page';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { AssetService } from '../services/assets.service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: 'app-am-component-product-details-management',
    templateUrl: 'product-details-management.component.html',
})

export class ProductDetailsManagementComponent extends CustomAppBaseComponent {
    @ViewChild('productNamePopover') productNamePopover: SatPopover;
    @ViewChild('supplierPopover') supplierPopover: SatPopover;
    @ViewChildren('deleteProductDetailsPopover') deleteProductDetailsPopover;
    @ViewChildren("editProductDetailsPopover") editProductDetailsPopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    suppliersList$: Observable<VendorManagement[]>;
    productsList$: Observable<Product[]>;
    productDetailsList$: Observable<ProductDetails[]>;
    productDetailsLoading$: Observable<boolean>;

    editProductDetailsData: ProductDetails;
    ProductDetails: ProductDetails;

    sortDirection: boolean = true;
    isOpen: boolean = true;
    searchByProductCodes: boolean = false;
    searchByManufactureCodes: boolean = false;
    searchByProductName: boolean = false;
    searchBySupplier: boolean = false;
    page = new Page();
    searchProductCode: string = '';
    searchManufactureCode: string = '';
    selectedProductId: string = '';
    selectedSupplierId: string = '';
    sortBy: string = 'productName';
    selectedEntity: string;
    validationMessage: string;
    entities: EntityDropDownModel[];

    constructor(private assetService: AssetService, private toaster: ToastrService, private store: Store<State>) {
        super();
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.productDetailsList$ = this.store.pipe(select(assetModuleReducer.getProductDetailsAll), tap(result => {
            this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
            this.page.totalPages = this.page.totalElements / this.page.size;
        })
        )
    }

    ngOnInit() {
        super.ngOnInit();
        if (this.canAccess_feature_ViewProductDetails) {
            this.getAllProducts();
            this.getAllSuppliers();
            this.getEntityDropDown();
            this.getProductDetailsList();
        }
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getProductDetailsList();
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        if (sort.dir === 'asc')
            this.sortDirection = true;
        else
            this.sortDirection = false;
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getProductDetailsList();
    }

    searchByProductCode() {
        if (this.searchProductCode.trim() == '')
            this.searchByProductCodes = false;
        else
            this.searchByProductCodes = true;
        if (this.searchProductCode.length > 0) {
            this.searchProductCode = this.searchProductCode.trim();
            if (this.searchProductCode.length <= 0) return;
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getProductDetailsList();
    }

    closeProductCodeSearch() {
        this.searchProductCode = '';
        this.searchByProductCodes = false;
        this.getProductDetailsList();
    }

    searchByManufactureCode() {
        if (this.searchManufactureCode.trim() == '')
            this.searchByManufactureCodes = false;
        else
            this.searchByManufactureCodes = true;
        if (this.searchManufactureCode.length > 0) {
            this.searchManufactureCode = this.searchManufactureCode.trim();
            if (this.searchManufactureCode.length <= 0) return;
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getProductDetailsList();
    }

    closeManufactureCodeSearch() {
        this.searchManufactureCode = '';
        this.searchByManufactureCodes = false;
        this.getProductDetailsList();
    }

    productSelected(productId) {
        if (productId == "all") {
            this.selectedProductId = productId;
            this.searchByProductName = false;
        }
        else {
            this.selectedProductId = productId;
            this.searchByProductName = true;
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        // this.productNamePopover.close();
        this.getProductDetailsList();
    }

    supplierSelected(supplierId) {
        if (supplierId == "all") {
            this.selectedSupplierId = supplierId;
            this.searchBySupplier = false;
        }
        else {
            this.selectedSupplierId = supplierId;
            this.searchBySupplier = true;
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        // this.supplierPopover.close();
        this.getProductDetailsList();
    }

    addProductDetail(editProductDetailsPopover) {
        this.editProductDetailsData = null;
        editProductDetailsPopover.openPopover();
    }

    getProductDetailsList() {
        const productDetailsResult = new ProductDetails();
        productDetailsResult.sortBy = this.sortBy;
        productDetailsResult.sortDirectionAsc = this.sortDirection;
        productDetailsResult.pageNumber = this.page.pageNumber + 1;
        productDetailsResult.pageSize = this.page.size;
        productDetailsResult.searchProductCode = this.searchProductCode;
        productDetailsResult.searchManufacturerCode = this.searchManufactureCode;
        productDetailsResult.productId = this.selectedProductId;
        productDetailsResult.supplierId = this.selectedSupplierId;
        productDetailsResult.entityId = this.selectedEntity;
        productDetailsResult.isArchived = false;
        this.store.dispatch(new LoadProductDetailsTriggered(productDetailsResult));
        this.productDetailsLoading$ = this.store.pipe(select(assetModuleReducer.getProductDetailsLoading));
    }

    deleteProductDetail() {
        let productDetails = new ProductDetails();
        productDetails.productId = this.ProductDetails.productId;
        productDetails.productCode = this.ProductDetails.productCode;
        productDetails.supplierId = this.ProductDetails.supplierId;
        productDetails.productDetailsId = this.ProductDetails.productDetailsId;
        productDetails.manufacturerCode = this.ProductDetails.manufacturerCode;
        productDetails.timeStamp = this.ProductDetails.timeStamp;
        productDetails.isArchived = true;
        this.store.dispatch(new CreateProductDetailsTriggered(productDetails));
        this.deleteProductDetailsPopover.forEach((p) => p.closePopover());
    }

    getAllSuppliers() {
        const supplierSearchResult = new VendorManagement();
        supplierSearchResult.isArchived = false;
        this.store.dispatch(new LoadSuppliersTriggered(supplierSearchResult));
        this.suppliersList$ = this.store.pipe(select(assetModuleReducer.getSuppliersAll));
    }

    getAllProducts() {
        const productSearchResult = new Product();
        productSearchResult.isArchived = false;
        this.store.dispatch(new LoadProductsTriggered(productSearchResult));
        this.productsList$ = this.store.pipe(select(assetModuleReducer.getProductsAll));
    }

    closeUpsertProductDetailsPopover() {
        this.editProductDetailsPopover.forEach((p) => p.closePopover());
    }

    editProductDetailsId(event, editProductDetailsPopover) {
        this.editProductDetailsData = event;
        editProductDetailsPopover.openPopover();
    }

    getProductDetailsId(event, deleteProductDetailsPopover) {
        this.ProductDetails = event;
        deleteProductDetailsPopover.openPopover();
    }

    cancelProductDetails() {
        this.ProductDetails = new ProductDetails();
        this.deleteProductDetailsPopover.forEach((p) => p.closePopover());
    }

    filterClick() {
        {
            this.isOpen = !this.isOpen;
        }
    }

    resetAllFilters() {
        this.selectedProductId = '';
        this.searchByProductName = false;
        this.selectedSupplierId = "";
        this.searchBySupplier = false;
        this.searchManufactureCode = '';
        this.searchByManufactureCodes = false;
        this.searchProductCode = '';
        this.searchByProductCodes = false;
        this.selectedEntity = "";
        this.getProductDetailsList();
    }

    getEntityDropDown() {
        let searchText = "";
        this.assetService.getEntityDropDown(searchText).subscribe((responseData: any) => {
            if (responseData.success === false) {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            else {
                this.entities = responseData.data;
            }
        });
    }

    entityValues(name) {
        this.selectedEntity = name;
        this.getProductDetailsList();
    }
}