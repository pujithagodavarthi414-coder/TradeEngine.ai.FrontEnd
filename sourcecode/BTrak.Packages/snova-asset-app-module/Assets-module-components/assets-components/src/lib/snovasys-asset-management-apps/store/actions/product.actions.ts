import { Action } from '@ngrx/store';

import { Product } from '../../models/product';

export enum ProductActionTypes {
    LoadProductsTriggered = '[Asset Apps Product Component] Initial Data Load Triggered',
    LoadProductsCompleted = '[Asset Apps Product Component] Initial Data Load Completed',
    LoadProductsFailed = '[Asset Apps Product Component] Initial Data Load Failed',
    CreateProductTriggered = '[Asset Apps Product Component] Create Product Triggered',
    CreateProductCompleted = '[Asset Apps Product Component] Create Product Completed',
    CreateProductFailed = '[Asset Apps Product Component] Create Product Failed',
    ProductExceptionHandled = '[Asset Apps Product Component] HandleException',
}

export class LoadProductsTriggered implements Action {
    type = ProductActionTypes.LoadProductsTriggered;
    productsList: Product[];
    product: Product;
    productId: string;
    validationMessages: any[];
    errorMessage: string;
    constructor(public productSearchResult: Product) { }
}

export class LoadProductsCompleted implements Action {
    type = ProductActionTypes.LoadProductsCompleted;
    productSearchResult: Product;
    product: Product;
    productId: string;
    validationMessages: any[];
    errorMessage: string;
    constructor(public productsList: Product[]) { }
}

export class LoadProductsFailed implements Action {
    type = ProductActionTypes.LoadProductsFailed;
    productSearchResult: Product;
    productsList: Product[];
    product: Product;
    productId: string;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateProductTriggered implements Action {
    type = ProductActionTypes.CreateProductTriggered;
    productSearchResult: Product;
    productsList: Product[];
    productId: string;
    validationMessages: any[];
    errorMessage: string;
    constructor(public product: Product) { }
}

export class CreateProductCompleted implements Action {
    type = ProductActionTypes.CreateProductCompleted;
    productSearchResult: Product;
    productsList: Product[];
    product: Product;
    validationMessages: any[];
    errorMessage: string;
    constructor(public productId: string) { }
}

export class CreateProductFailed implements Action {
    type = ProductActionTypes.CreateProductFailed;
    productSearchResult: Product;
    productsList: Product[];
    product: Product;
    productId: string;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ProductExceptionHandled implements Action {
    type = ProductActionTypes.ProductExceptionHandled;
    productSearchResult: Product;
    productsList: Product[];
    product: Product;
    productId: string;
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type ProductActions = LoadProductsTriggered
    | LoadProductsCompleted
    | LoadProductsFailed
    | CreateProductTriggered
    | CreateProductCompleted
    | CreateProductFailed
    | ProductExceptionHandled;