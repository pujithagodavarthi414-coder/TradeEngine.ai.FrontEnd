import { Action } from '@ngrx/store';

import { CanteenPurchaseItemModel } from '../../models/canteen-purchase-item-model';
import { CanteenPurchaseItemSearchModel } from '../../models/canteen-purchase-item-search-model';

export enum CanteenPurchaseItemActionTypes {
    LoadCanteenPurchaseItemsTriggered = '[Canteen Purchase Item Component] Initial Data Load Triggered',
    LoadCanteenPurchaseItemsCompleted = '[Canteen Purchase Item Component] Initial Data Load Completed',
    LoadCanteenPurchaseItemsFailed = '[Canteen Purchase Item Component] Initial Data Load Failed',
    LoadMyCanteenPurchasesTriggered = '[My Canteen Purchases Component] Initial Data Load Triggered',
    LoadMyCanteenPurchasesCompleted = '[My Canteen Purchases Component] Initial Data Load Completed',
    LoadMyCanteenPurchasesFailed = '[My Canteen Purchases Component] Initial Data Load Failed',
    CreateCanteenPurchaseItemTriggered = '[Canteen Purchase Item Component] Create Canteen Purchase Item Triggered',
    CreateCanteenPurchaseItemCompleted = '[Canteen Purchase Item Component] Create Canteen Purchase Item Completed',
    CreateCanteenPurchaseItemFailed = '[Canteen Purchase Item Component] Create Canteen Purchase Item Failed',
    CanteenExceptionHandled = '[Canteen Purchase Item Component] Handle Exception',
}

export class LoadCanteenPurchaseItemsTriggered implements Action {
    type = CanteenPurchaseItemActionTypes.LoadCanteenPurchaseItemsTriggered;
    canteenPurchaseItemsList: CanteenPurchaseItemModel[];
    canteenPurchaseItems: CanteenPurchaseItemModel[];
    myCanteenPurchasesList: CanteenPurchaseItemModel[];
    canteenPurchaseItemCreated: boolean;
    validationMessages: string[];
    errorMessage: string;
    constructor(public canteenPurchaseItemSearchResult: CanteenPurchaseItemSearchModel) { }
}

export class LoadCanteenPurchaseItemsCompleted implements Action {
    type = CanteenPurchaseItemActionTypes.LoadCanteenPurchaseItemsCompleted;
    canteenPurchaseItemSearchResult: CanteenPurchaseItemSearchModel;
    myCanteenPurchasesList: CanteenPurchaseItemModel[];
    canteenPurchaseItems: CanteenPurchaseItemModel[];
    canteenPurchaseItemCreated: boolean;
    validationMessages: string[];
    errorMessage: string;
    constructor(public canteenPurchaseItemsList: CanteenPurchaseItemModel[]) { }
}

export class LoadCanteenPurchaseItemsFailed implements Action {
    type = CanteenPurchaseItemActionTypes.LoadCanteenPurchaseItemsFailed;
    canteenPurchaseItemSearchResult: CanteenPurchaseItemSearchModel;
    canteenPurchaseItemsList: CanteenPurchaseItemModel[];
    myCanteenPurchasesList: CanteenPurchaseItemModel[];
    canteenPurchaseItems: CanteenPurchaseItemModel[];
    canteenPurchaseItemCreated: boolean;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class LoadMyCanteenPurchasesTriggered implements Action {
    type = CanteenPurchaseItemActionTypes.LoadMyCanteenPurchasesTriggered;
    canteenPurchaseItemsList: CanteenPurchaseItemModel[];
    myCanteenPurchasesList: CanteenPurchaseItemModel[];
    canteenPurchaseItems: CanteenPurchaseItemModel[];
    canteenPurchaseItemCreated: boolean;
    validationMessages: string[];
    errorMessage: string;
    constructor(public myCanteenPurchaseItemSearchResult: CanteenPurchaseItemSearchModel) { }
}

export class LoadMyCanteenPurchasesFailed implements Action {
    type = CanteenPurchaseItemActionTypes.LoadMyCanteenPurchasesFailed;
    canteenPurchaseItemSearchResult: CanteenPurchaseItemSearchModel;
    canteenPurchaseItemsList: CanteenPurchaseItemModel[];
    canteenPurchaseItems: CanteenPurchaseItemModel[];
    myCanteenPurchasesList: CanteenPurchaseItemModel[];
    canteenPurchaseItemCreated: boolean;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class LoadMyCanteenPurchasesCompleted implements Action {
    type = CanteenPurchaseItemActionTypes.LoadMyCanteenPurchasesCompleted;
    canteenPurchaseItemSearchResult: CanteenPurchaseItemSearchModel;
    canteenPurchaseItemsList: CanteenPurchaseItemModel[];
    canteenPurchaseItems: CanteenPurchaseItemModel[];
    canteenPurchaseItemCreated: boolean;
    validationMessages: string[];
    errorMessage: string;
    constructor(public myCanteenPurchasesList: CanteenPurchaseItemModel[]) { }
}

export class CreateCanteenPurchaseItemTriggered implements Action {
    type = CanteenPurchaseItemActionTypes.CreateCanteenPurchaseItemTriggered;
    canteenPurchaseItemSearchResult: CanteenPurchaseItemSearchModel;
    canteenPurchaseItemsList: CanteenPurchaseItemModel[];
    myCanteenPurchasesList: CanteenPurchaseItemModel[];
    canteenPurchaseItemCreated: boolean;
    validationMessages: string[];
    errorMessage: string;
    constructor(public canteenPurchaseItems: CanteenPurchaseItemModel[]) { }
}

export class CreateCanteenPurchaseItemCompleted implements Action {
    type = CanteenPurchaseItemActionTypes.CreateCanteenPurchaseItemCompleted;
    canteenPurchaseItemSearchResult: CanteenPurchaseItemSearchModel;
    canteenPurchaseItemsList: CanteenPurchaseItemModel[];
    myCanteenPurchasesList: CanteenPurchaseItemModel[];
    canteenPurchaseItems: CanteenPurchaseItemModel[];
    validationMessages: string[];
    errorMessage: string;
    constructor(public canteenPurchaseItemCreated: boolean) { }
}

export class CreateCanteenPurchaseItemFailed implements Action {
    type = CanteenPurchaseItemActionTypes.CreateCanteenPurchaseItemFailed;
    canteenPurchaseItemSearchResult: CanteenPurchaseItemSearchModel;
    canteenPurchaseItemsList: CanteenPurchaseItemModel[];
    myCanteenPurchasesList: CanteenPurchaseItemModel[];
    canteenPurchaseItems: CanteenPurchaseItemModel[];
    canteenPurchaseItemCreated: boolean;
    errorMessage: string;
    constructor(public validationMessages: string[]) { }
}

export class CanteenExceptionHandled implements Action {
    type = CanteenPurchaseItemActionTypes.CanteenExceptionHandled;
    canteenPurchaseItemSearchResult: CanteenPurchaseItemSearchModel;
    canteenPurchaseItemsList: CanteenPurchaseItemModel[];
    myCanteenPurchasesList: CanteenPurchaseItemModel[];
    canteenPurchaseItems: CanteenPurchaseItemModel[];
    canteenPurchaseItemCreated: boolean;
    validationMessages: string[];
    constructor(public errorMessage: string) { }
}

export type CanteenPurchaseItemActions = LoadCanteenPurchaseItemsTriggered
    | LoadCanteenPurchaseItemsCompleted
    | LoadCanteenPurchaseItemsFailed
    | LoadMyCanteenPurchasesTriggered
    | LoadMyCanteenPurchasesCompleted
    | LoadMyCanteenPurchasesFailed
    | CreateCanteenPurchaseItemTriggered
    | CreateCanteenPurchaseItemCompleted
    | CreateCanteenPurchaseItemFailed
    | CanteenExceptionHandled;