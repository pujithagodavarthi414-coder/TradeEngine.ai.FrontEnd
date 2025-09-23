import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ProductDetails } from '../../models/product-details';

export enum ProductDetailsActionTypes {
    LoadProductDetailsTriggered = '[Product Details Component] Initial Data Load Triggered',
    LoadProductDetailsCompleted = '[Product Details Component] Initial Data Load Completed',
    LoadProductDetailsFailed = '[Product Details Component] Initial Data Load Failed',
    CreateProductDetailsTriggered = '[Product Details Component] Create Product Details Triggered',
    CreateProductDetailsCompleted = '[Product Details Component] Create Product Details Completed',
    CreateProductDetailsFailed = '[Product Details Component] Create Product Details Failed',
    GetProductDetailsByIdTriggered = '[Product Details Component] Get Product Details By Id Triggered',
    GetProductDetailsByIdCompleted = '[Product Details Component] Get Product Details By Id Completed',
    GetProductDetailsByIdFailed = '[Product Details Component] Get Product Details By Id Failed',
    DeleteProductDetailsCompleted = '[Product Details Component] Delete Product Details Completed',
    UpdateProductDetailsById = '[Product Details Component] Update Product Details By Id',
    RefreshProductDetailsList = '[Product Details Component] Refresh Product Details List',
    ExceptionHandled = '[Product Details Component] HandleException',
}

export class LoadProductDetailsTriggered implements Action {
    type = ProductDetailsActionTypes.LoadProductDetailsTriggered;
    productDetailsList: ProductDetails[];
    productDetails: ProductDetails;
    productDetailsId: string;
    productDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public productDetailsSearchResult: ProductDetails) { }
}

export class LoadProductDetailsCompleted implements Action {
    type = ProductDetailsActionTypes.LoadProductDetailsCompleted;
    productDetailsSearchResult: ProductDetails;
    productDetails: ProductDetails;
    productDetailsId: string;
    productDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public productDetailsList: ProductDetails[]) { }
}

export class LoadProductDetailsFailed implements Action {
    type = ProductDetailsActionTypes.LoadProductDetailsFailed;
    productDetailsSearchResult: ProductDetails;
    productDetailsList: ProductDetails[];
    productDetails: ProductDetails;
    productDetailsId: string;
    productDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateProductDetailsTriggered implements Action {
    type = ProductDetailsActionTypes.CreateProductDetailsTriggered;
    productDetailsSearchResult: ProductDetails;
    productDetailsList: ProductDetails[];
    productDetailsId: string;
    productDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public productDetails: ProductDetails) { }
}

export class CreateProductDetailsCompleted implements Action {
    type = ProductDetailsActionTypes.CreateProductDetailsCompleted;
    productDetailsSearchResult: ProductDetails;
    productDetailsList: ProductDetails[];
    productDetails: ProductDetails;
    productDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public productDetailsId: string) { }
}

export class CreateProductDetailsFailed implements Action {
    type = ProductDetailsActionTypes.CreateProductDetailsFailed;
    productDetailsSearchResult: ProductDetails;
    productDetailsList: ProductDetails[];
    productDetails: ProductDetails;
    productDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> };
    productDetailsId: string;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class DeleteProductDetailsCompleted implements Action {
    type = ProductDetailsActionTypes.DeleteProductDetailsCompleted;
    productDetailsSearchResult: ProductDetails;
    productDetailsList: ProductDetails[];
    productDetails: ProductDetails;
    productDetailsId: string;
    productDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public ProductDetailsId: string) { }
}

export class GetProductDetailsByIdTriggered implements Action {
    type = ProductDetailsActionTypes.GetProductDetailsByIdTriggered;
    productDetailsList: ProductDetails[];
    productDetails: ProductDetails;
    productDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> }
    validationMessages: any[];
    productDetailsId: string;
    errorMessage: string;
    constructor(public ProductDetailsId: string) { }
}

export class GetProductDetailsByIdCompleted implements Action {
    type = ProductDetailsActionTypes.GetProductDetailsByIdCompleted;
    productDetailsSearchResult: ProductDetails;
    productDetailsList: ProductDetails[];
    productDetailsId: string;
    productDetails: ProductDetails;
    productDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public ProductDetails: ProductDetails) { }
}

export class GetProductDetailsByIdFailed implements Action {
    type = ProductDetailsActionTypes.GetProductDetailsByIdFailed;
    productDetailsSearchResult: ProductDetails;
    productDetailsList: ProductDetails[];
    productDetails: ProductDetails;
    productDetailsId: string;
    productDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class UpdateProductDetailsById implements Action {
    type = ProductDetailsActionTypes.UpdateProductDetailsById;
    productDetailsSearchResult: ProductDetails;
    productDetailsList: ProductDetails[];
    productDetails: ProductDetails;
    productDetailsId: string;
    productDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public ProductDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> }) { }
}


export class RefreshProductDetailsList implements Action {
    type = ProductDetailsActionTypes.RefreshProductDetailsList;
    productDetailsSearchResult: ProductDetails;
    productDetailsList: ProductDetails[];
    productDetailsId: string;
    productDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> };
    validationMessages: any[];
    productDetails: ProductDetails;
    errorMessage: string;
    constructor(public ProductDetails: ProductDetails) { }
}

export class ExceptionHandled implements Action {
    type = ProductDetailsActionTypes.ExceptionHandled;
    productDetailsSearchResult: ProductDetails;
    productDetailsList: ProductDetails[];
    productDetails: ProductDetails;
    productDetailsUpdates: { ProductDetailsUpdate: Update<ProductDetails> };
    productDetailsId: string;
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type ProductDetailsActions = LoadProductDetailsTriggered
    | LoadProductDetailsCompleted
    | LoadProductDetailsFailed
    | CreateProductDetailsTriggered
    | CreateProductDetailsCompleted
    | CreateProductDetailsFailed
    | GetProductDetailsByIdTriggered
    | GetProductDetailsByIdCompleted
    | GetProductDetailsByIdFailed
    | DeleteProductDetailsCompleted
    | RefreshProductDetailsList
    | UpdateProductDetailsById
    | ExceptionHandled;