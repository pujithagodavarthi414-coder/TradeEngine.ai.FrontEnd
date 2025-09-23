import { Component, OnInit, ViewChildren } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Product } from '../models/product';
import { State } from '../store/reducers/products.reducers';
import * as assetModuleReducer from '../store/reducers/index';
import { LoadProductsTriggered, ProductActionTypes } from '../store/actions/product.actions';
import { Page } from '../models/page';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-am-component-product-management',
  templateUrl: `product-management.component.html`,
})

export class ProductManagementComponent extends CustomAppBaseComponent {
  @ViewChildren('upsertProductPopup') upsertProductsPopup;

  productList: Product[];

  searchText: string = '';
  sortBy: string;
  sortDirection: boolean;
  isProduct: boolean;
  page = new Page();

  productList$: Observable<Product[]>;
  loadProductsListInProgress$: Observable<boolean>;

  selectedProductDetails: any;

  constructor(private actionUpdates$: Actions, private store: Store<State>) {
    super();
    this.page.size = 10;
    this.page.pageNumber = 0;
    this.getAllProducts();

    this.actionUpdates$
      .pipe(
        ofType(ProductActionTypes.LoadProductsCompleted),
        tap(() => {
          this.productList$ = this.store.pipe(select(assetModuleReducer.getProductsAll));
          this.productList$.subscribe((result) => {
            this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
            this.page.totalPages = this.page.totalElements / this.page.size;
          });
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  searchProducts() {
    this.page.pageNumber = 0;
    this.getAllProducts();
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getAllProducts();
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    if (sort.dir === 'asc')
      this.sortDirection = true;
    else
      this.sortDirection = false;
    this.getAllProducts();
  }

  closeSearch() {
    this.searchText = '';
    this.getAllProducts();
  }

  closeAddProductForm() {
    this.isProduct = false;
    this.upsertProductsPopup.forEach((p) => p.closePopover());
  }

  upsertProductPopUpOpen(row, upsertProductPopup) {
    this.isProduct = true;
    this.selectedProductDetails = row;
    upsertProductPopup.openPopover();
  }

  upsertProductPopoverOpen(upsertProductPopup) {
    this.isProduct = true;
    this.selectedProductDetails = null;
    upsertProductPopup.openPopover();
  }

  getAllProducts() {
    const productSearchResult = new Product();
    productSearchResult.pageNumber = this.page.pageNumber + 1;
    productSearchResult.pageSize = this.page.size;
    productSearchResult.searchText = this.searchText;
    productSearchResult.sortBy = this.sortBy;
    productSearchResult.sortDirectionAsc = this.sortDirection;
    productSearchResult.isArchived = false;
    this.store.dispatch(new LoadProductsTriggered(productSearchResult));
    this.loadProductsListInProgress$ = this.store.pipe(select(assetModuleReducer.getProductLoading));
  }
}