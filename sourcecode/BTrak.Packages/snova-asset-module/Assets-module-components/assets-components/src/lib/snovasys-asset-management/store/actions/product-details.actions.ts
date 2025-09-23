import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ProductDetails } from '../../models/product-details';

export enum ProductDetailsActionTypes {
    LoadProductDetailsTriggered = '[Asset Management Product Details Component] Initial Data Load Triggered',
    LoadProductDetailsCompleted = '[Asset Management Product Details Component] Initial Data Load Completed',
    LoadProductDetailsFailed = '[Asset Management Product Details Component] Initial Data Load Failed',
    CreateProductDetailsTriggered = '[Asset Management Product Details Component] Create Product Details Triggered',
    CreateProductDetailsCompleted = '[Asset Management Product Details Component] Create Product Details Completed',
    CreateProductDetailsFailed = '[Asset Management Product Details Component] Create Product Details Failed',
    GetProductDetailsByIdTriggered = '[Asset Management Product Details Component] Get Product Details By Id Triggered',
    GetProductDetailsByIdCompleted = '[Asset Management Product Details Component] Get Product Details By Id Completed',
    GetProductDetailsByIdFailed = '[Asset Management Product Details Component] Get Product Details By Id Failed',
    DeleteProductDetailsCompleted = '[Asset Management Product Details Component] Delete Product Details Completed',
    UpdateProductDetailsById = '[Asset Management Product Details Component] Update Product Details By Id',
    RefreshProductDetailsList = '[Asset Management Product Details Component] Refresh Product Details List',
    ProductDetailsExceptionHandled = '[Asset Management Product Details Component] HandleException',
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

export class ProductDetailsExceptionHandled implements Action {
    type = ProductDetailsActionTypes.ProductDetailsExceptionHandled;
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
    | ProductDetailsExceptionHandled;