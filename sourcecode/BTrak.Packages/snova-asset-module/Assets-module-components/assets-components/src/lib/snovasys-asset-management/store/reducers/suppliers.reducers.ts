import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { VendorManagement } from '../../models/vendor-management';
import { SupplierActionTypes, SupplierActions } from '../actions/supplier.actions';

export interface State extends EntityState<VendorManagement> {
    loadingSuppliers: boolean;
    creatingSupplier: boolean;
    createSupplierErrors: string[];
    selectedSupplierId: string | null;
    exceptionMessage: string;
}

export const supplierAdapter: EntityAdapter<
    VendorManagement
> = createEntityAdapter<VendorManagement>({
    selectId: (supplier: VendorManagement) => supplier.supplierId
});

export const initialState: State = supplierAdapter.getInitialState({
    loadingSuppliers: false,
    creatingSupplier: false,
    createSupplierErrors: [''],
    selectedSupplierId: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: SupplierActions
): State {
    switch (action.type) {
        case SupplierActionTypes.LoadSuppliersTriggered:
            return { ...state, loadingSuppliers: true };
        case SupplierActionTypes.LoadSuppliersCompleted:
            return supplierAdapter.addAll(action.suppliers, {
                ...state,
                loadingSuppliers: false
            });
        case SupplierActionTypes.LoadSuppliersFailed:
            return { ...state, loadingSuppliers: false };
        case SupplierActionTypes.CreateSupplierTriggered:
            return { ...state, creatingSupplier: true };
        case SupplierActionTypes.CreateSupplierCompleted:
            return { ...state, creatingSupplier: false };
        case SupplierActionTypes.CreateSupplierFailed:
            return { ...state, creatingSupplier: false, createSupplierErrors: action.validationMessages };
        case SupplierActionTypes.SupplierExceptionHandled:
            return { ...state, creatingSupplier: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}