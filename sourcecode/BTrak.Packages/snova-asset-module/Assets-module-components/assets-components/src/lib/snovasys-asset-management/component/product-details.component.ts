import { Component, Output, EventEmitter, Input, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { ofType, Actions } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { SatPopover } from "@ncstate/sat-popover";
import { VendorManagement } from "../models/vendor-management";
import { Product } from "../models/product";
import * as assetModuleReducer from '../store/reducers/index';
import { State } from "../store/reducers/index";
import { ProductDetailsActionTypes, CreateProductDetailsTriggered } from "../store/actions/product-details.actions";
import { LoadSuppliersTriggered } from "../store/actions/supplier.actions";
import { LoadProductsTriggered } from "../store/actions/product.actions";
import { ProductDetails } from '../models/product-details';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-am-component-product-details",
  templateUrl: "./product-details.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductDetailsComponent extends CustomAppBaseComponent {
  @ViewChild('addNewSupplier') newSupplierPopover: SatPopover;
  @ViewChild('addNewProduct') newProductPopover: SatPopover;

  @Input('editProductDetailsData')
  set editProductDetailsData(data: ProductDetails) {
    if (!data) {
      this.productDetails = null;
      this.productDetailsId = null;
      this.clearProductDetailsForm();
    }
    else {
      this.productDetails = data;
      this.productDetailsId = data.productDetailsId;
      this.productDetailsForm.patchValue(data);
    }
  }
  @Output() closePopup = new EventEmitter<string>();

  productDetailsForm: FormGroup;
  formId: FormGroupDirective;

  editSupplier: boolean;
  productDetailsId: string;

  productDetails: ProductDetails;
  selectedSupplierDetails: VendorManagement;

  anyOperationInProgress$: Observable<boolean>;
  saveProductDetailsOperationInProgress$: Observable<boolean>;
  suppliersList$: Observable<VendorManagement[]>;
  productsList$: Observable<Product[]>;

  constructor(private store: Store<State>, private actionUpdates$: Actions, private toastr: ToastrService) {
    super();
    this.actionUpdates$
      .pipe(
        ofType(ProductDetailsActionTypes.CreateProductDetailsCompleted),
        tap(() => {
          this.clearProductDetailsForm();
          this.formId.resetForm();
          this.closePopup.emit("");
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.clearProductDetailsForm();
    this.anyOperationInProgress$ = this.store.pipe(
      select(assetModuleReducer.createProductDetailsLoading)
    );
    if (this.canAccess_feature_AddOrUpdateProduct) {
      this.getAllSuppliers();
      this.getAllProducts();
    }
  }

  clearProductDetailsForm() {
    this.productDetailsForm = new FormGroup({
      productId: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      ),
      productCode: new FormControl('',
        Validators.compose([
          Validators.maxLength(250)
        ])
      ),
      manufacturerCode: new FormControl('',
        Validators.compose([
          Validators.maxLength(100)
        ])
      ),
      supplierId: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      )
    })
  }

  closeProductDetailsForm(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    if (this.productDetailsId) 
      this.productDetailsForm.patchValue(this.productDetails);
    else 
      this.clearProductDetailsForm();
    this.closePopup.emit("");
  }

  saveProductDetails(formDirective: FormGroupDirective) {
    let productDetailsList = new ProductDetails;
    productDetailsList = this.productDetailsForm.value;
    if (this.productDetailsId) {
      productDetailsList.productDetailsId = this.productDetails.productDetailsId;
      productDetailsList.timeStamp = this.productDetails.timeStamp;
    }
    this.store.dispatch(new CreateProductDetailsTriggered(productDetailsList));
    this.saveProductDetailsOperationInProgress$ = this.store.pipe(select(assetModuleReducer.createProductDetailsLoading));
    this.formId = formDirective;
  }

  createSupplier() {
    this.editSupplier = false;
  }

  closeSupplierForm() {
    this.newSupplierPopover.close();
  }

  closeAddProductForm() {
    this.newProductPopover.close();
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
}