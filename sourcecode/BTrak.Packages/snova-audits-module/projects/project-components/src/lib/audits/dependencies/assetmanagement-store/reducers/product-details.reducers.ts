import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { ProductDetails } from '../../models/product-details';
import { ProductDetailsActions, ProductDetailsActionTypes } from '../actions/product-details.actions';

export interface State extends EntityState<ProductDetails> {
    loadingProductDetails: boolean;
    creatingProductDetails: boolean;
    createProductDetailsErrors: string[];
    gettingProductDetailsById: boolean;
    selectedProductDetailsId: string | null;
    exceptionMessage: string;
    productDetailsData: ProductDetails;
    productDetailsId: string;
}

export const productDetailsAdapter: EntityAdapter<
    ProductDetails
> = createEntityAdapter<ProductDetails>({
    selectId: (productDetails: ProductDetails) => productDetails.productDetailsId
});

export const initialState: State = productDetailsAdapter.getInitialState({
    loadingProductDetails: false,
    creatingProductDetails: false,
    createProductDetailsErrors: [''],
    gettingProductDetailsById: false,
    selectedProductDetailsId: null,
    exceptionMessage: '',
    productDetailsData: null,
    productDetailsId: ''
});

export function reducer(
    state: State = initialState,
    action: ProductDetailsActions
): State {
    switch (action.type) {
        case ProductDetailsActionTypes.LoadProductDetailsTriggered:
            return { ...state, loadingProductDetails: true };
        case ProductDetailsActionTypes.LoadProductDetailsCompleted:
            return productDetailsAdapter.addAll(action.productDetailsList, {
                ...state, loadingProductDetails: false
            });
        case ProductDetailsActionTypes.LoadProductDetailsFailed:
            return { ...state, loadingProductDetails: false };
        case ProductDetailsActionTypes.CreateProductDetailsTriggered:
            return { ...state, creatingProductDetails: true };
        case ProductDetailsActionTypes.CreateProductDetailsCompleted:
            return { ...state, creatingProductDetails: false };
        case ProductDetailsActionTypes.CreateProductDetailsFailed:
            return { ...state, creatingProductDetails: false, createProductDetailsErrors: action.validationMessages };
        case ProductDetailsActionTypes.DeleteProductDetailsCompleted:
            return productDetailsAdapter.removeOne(action.productDetailsId, { ...state, creatingProductDetails: false });
        case ProductDetailsActionTypes.GetProductDetailsByIdTriggered:
            return { ...state, gettingProductDetailsById: true };
        case ProductDetailsActionTypes.GetProductDetailsByIdCompleted:
            return { ...state, gettingProductDetailsById: false, productDetailsData: action.productDetails };
        case ProductDetailsActionTypes.GetProductDetailsByIdFailed:
            return { ...state, gettingProductDetailsById: false };
        case ProductDetailsActionTypes.UpdateProductDetailsById:
            return productDetailsAdapter.updateOne(action.productDetailsUpdates.ProductDetailsUpdate, state);
        case ProductDetailsActionTypes.RefreshProductDetailsList:
            return productDetailsAdapter.upsertOne(action.productDetails, state);
        case ProductDetailsActionTypes.ExceptionHandled:
            return { ...state, creatingProductDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}