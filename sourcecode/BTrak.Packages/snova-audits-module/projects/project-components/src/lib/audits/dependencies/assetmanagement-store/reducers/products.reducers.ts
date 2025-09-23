import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Product } from '../../models/product';
import { ProductActionTypes, ProductActions } from '../actions/product.actions';


export interface State extends EntityState<Product> {
    loadingProducts: boolean;
    creatingProduct: boolean;
    createProductErrors: string[];
    selectedProductId: string | null;
    exceptionMessage: string;
}

export const productAdapter: EntityAdapter<
    Product
> = createEntityAdapter<Product>({
    selectId: (product: Product) => product.productId
});

export const initialState: State = productAdapter.getInitialState({
    loadingProducts: false,
    creatingProduct: false,
    createProductErrors: [''],
    selectedProductId: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: ProductActions
): State {
    switch (action.type) {
        case ProductActionTypes.LoadProductsTriggered:
            return { ...state, loadingProducts: true };
        case ProductActionTypes.LoadProductsCompleted:
            return productAdapter.addAll(action.productsList, { ...state, loadingProducts: false });
        case ProductActionTypes.LoadProductsFailed:
            return { ...state, loadingProducts: false };
        case ProductActionTypes.CreateProductTriggered:
            return { ...state, creatingProduct: true };
        case ProductActionTypes.CreateProductCompleted:
            return { ...state, creatingProduct: false };
        case ProductActionTypes.CreateProductFailed:
            return { ...state, creatingProduct: false, createProductErrors: action.validationMessages };
        case ProductActionTypes.ExceptionHandled:
            return { ...state, creatingProduct: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}