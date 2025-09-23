import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { ofType, Actions } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { Product } from "../models/product";
import * as assetModuleReducer from '../store/reducers/index';
import { State } from "../store/reducers/index";
import { CreateProductTriggered, ProductActionTypes } from '../store/actions/product.actions';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-am-component-product",
  templateUrl: "./product.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductComponent {

  @ViewChild("formDirective") formDirective:FormGroupDirective;

  @Output() closePopup = new EventEmitter<string>();
  @Input('selectedProductData')
  set _selectedProductData(data: Product) {
    this.clearProductForm();
    if (data) {
      this.productDetails = data;
      this.productForm.patchValue(data);
      this.isAddProduct = false;
    }
    else {
      this.isAddProduct = true;
    }
  }

  anyOperationInProgress$: Observable<boolean>;
  saveProductOperationInProgress$: Observable<boolean>;

  isAddProduct: boolean = true;

  private productData: Product;
  productDetails: Product;
  productForm: FormGroup;

  constructor(private store: Store<State>, private actionUpdates$: Actions, private toastr: ToastrService) {

    this.clearProductForm();
    this.actionUpdates$
      .pipe(
        ofType(ProductActionTypes.CreateProductCompleted),
        tap(() => {
          this.clearProductForm();
          this.formDirective.resetForm();
          this.closePopup.emit("");
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.anyOperationInProgress$ = this.store.pipe(
      select(assetModuleReducer.createProductLoading)
    );
  }

  clearProductForm() {
    this.productForm = new FormGroup({
      productName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)]))
    })
  }

  closeProductForm() {
    this.formDirective.resetForm();
    this.clearProductForm();
    this.closePopup.emit("");
  }

  saveProduct() {
    this.productData = this.productForm.value;
    if(this.productDetails){
      this.productData.productId = this.productDetails.productId;
      this.productData.timeStamp =  this.productDetails.timeStamp;
    }
    this.store.dispatch(new CreateProductTriggered(this.productData));
    this.saveProductOperationInProgress$ = this.store.pipe(select(assetModuleReducer.createProductLoading));
  }
}