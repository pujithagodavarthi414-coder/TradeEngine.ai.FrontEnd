import { Action } from '@ngrx/store';

import { VendorManagement } from '../../models/vendor-management';

export enum SupplierActionTypes {
    LoadSuppliersTriggered = '[Supplier Component] Initial Data Load Triggered',
    LoadSuppliersCompleted = '[Supplier Component] Initial Data Load Completed',
    LoadSuppliersFailed = '[Supplier Component] Initial Data Load Failed',
    CreateSupplierTriggered = '[Supplier Component] Create Supplier Triggered',
    CreateSupplierCompleted = '[Supplier Component] Create Supplier Completed',
    CreateSupplierFailed = '[Supplier Component] Create Supplier Failed',
    ExceptionHandled = '[Supplier Component] HandleException',
}

export class LoadSuppliersTriggered implements Action {
    type = SupplierActionTypes.LoadSuppliersTriggered;
    suppliers: VendorManagement[];
    supplier: VendorManagement;
    supplierId: string;
    validationMessages: any[];
    errorMessage: string;
    constructor(public supplierSearchResult: VendorManagement) { }
}

export class LoadSuppliersCompleted implements Action {
    type = SupplierActionTypes.LoadSuppliersCompleted;
    supplierSearchResult: VendorManagement;
    supplier: VendorManagement;
    supplierId: string;
    validationMessages: any[];
    errorMessage: string;
    constructor(public suppliers: VendorManagement[]) { }
}

export class LoadSuppliersFailed implements Action {
    type = SupplierActionTypes.LoadSuppliersFailed;
    supplierSearchResult: VendorManagement;
    suppliers: VendorManagement[];
    supplier: VendorManagement;
    supplierId: string;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateSupplierTriggered implements Action {
    type = SupplierActionTypes.CreateSupplierTriggered;
    supplierSearchResult: VendorManagement;
    suppliers: VendorManagement[];
    supplierId: string;
    validationMessages: any[];
    errorMessage: string;
    constructor(public supplier: VendorManagement) { }
}

export class CreateSupplierCompleted implements Action {
    type = SupplierActionTypes.CreateSupplierCompleted;
    supplierSearchResult: VendorManagement;
    suppliers: VendorManagement[];
    supplier: VendorManagement;
    validationMessages: any[];
    errorMessage: string;
    constructor(public supplierId: string) { }
}

export class CreateSupplierFailed implements Action {
    type = SupplierActionTypes.CreateSupplierFailed;
    supplierSearchResult: VendorManagement;
    suppliers: VendorManagement[];
    supplier: VendorManagement;
    supplierId: string;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = SupplierActionTypes.ExceptionHandled;
    supplierSearchResult: VendorManagement;
    suppliers: VendorManagement[];
    supplier: VendorManagement;
    supplierId: string;
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type SupplierActions = LoadSuppliersTriggered
    | LoadSuppliersCompleted
    | LoadSuppliersFailed
    | CreateSupplierTriggered
    | CreateSupplierCompleted
    | CreateSupplierFailed
    | ExceptionHandled;