import { Action } from '@ngrx/store';

import { Product } from '../../models/product';

export enum ProductActionTypes {
    LoadProductsTriggered = '[Product Component] Initial Data Load Triggered',
    LoadProductsCompleted = '[Product Component] Initial Data Load Completed',
    LoadProductsFailed = '[Product Component] Initial Data Load Failed',
    CreateProductTriggered = '[Product Component] Create Product Triggered',
    CreateProductCompleted = '[Product Component] Create Product Completed',
    CreateProductFailed = '[Product Component] Create Product Failed',
    ExceptionHandled = '[Product Component] HandleException',
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

export class ExceptionHandled implements Action {
    type = ProductActionTypes.ExceptionHandled;
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
    | ExceptionHandled;