import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { StoreModel } from '../../models/store-model';
import { StoreSearchModel } from '../../models/store-search-model';

export enum StoreActionTypes {
    LoadStoreTriggered = '[Documents Store Component] Initial Data Load Triggered',
    LoadStoreCompleted = '[Documents Store Component] Initial Data Load Completed',
    LoadStoreFailed = '[Documents Store Component] Initial Data Load Failed',
    CreateStoreTriggered = '[Documents Store Component] Create Store Triggered',
    CreateStoreCompleted = '[Documents Store Component] Create Store Completed',
    DeleteStoreCompleted = '[Documents Store Component] Delete Store Completed',
    CreateStoreFailed = '[Documents Store Component] Create Store Failed',
    GetStoreByIdTriggered = '[Documents Store Component] Get Store By Id Triggered',
    GetStoreByIdCompleted = '[Documents Store Component] Get Store By Id Completed',
    UpdateStoreById = '[Documents Store Component] Update Store By Id',
    RefreshStoreList = '[Documents Store Component] Refresh Store List',
    StoreExceptionHandled = '[Documents Store Component] Handle Exception',
}

export class LoadStoreTriggered implements Action {
    type = StoreActionTypes.LoadStoreTriggered;
    storesList: StoreModel[];
    upsertStoreModel: StoreModel;
    upsertedStoreId: string;
    deletedStoreId: string;
    getStoreByIdSearchModel: StoreSearchModel;
    getStoreByIdStoreModel: StoreModel;
    storeDetailsUpdates: { storeDetailsUpdate: Update<StoreModel> };
    refreshStoreList: StoreModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public storeSearchModel: StoreSearchModel) { }
}

export class LoadStoreCompleted implements Action {
    type = StoreActionTypes.LoadStoreCompleted;
    storeSearchModel: StoreSearchModel;
    upsertStoreModel: StoreModel;
    upsertedStoreId: string;
    deletedStoreId: string;
    getStoreByIdSearchModel: StoreSearchModel;
    getStoreByIdStoreModel: StoreModel;
    storeDetailsUpdates: { storeDetailsUpdate: Update<StoreModel> };
    refreshStoreList: StoreModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public storesList: StoreModel[]) { }
}

export class LoadStoreFailed implements Action {
    type = StoreActionTypes.LoadStoreFailed;
    storeSearchModel: StoreSearchModel;
    storesList: StoreModel[];
    upsertStoreModel: StoreModel;
    upsertedStoreId: string;
    deletedStoreId: string;
    getStoreByIdSearchModel: StoreSearchModel;
    getStoreByIdStoreModel: StoreModel;
    storeDetailsUpdates: { storeDetailsUpdate: Update<StoreModel> };
    refreshStoreList: StoreModel;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateStoreTriggered implements Action {
    type = StoreActionTypes.CreateStoreTriggered;
    storeSearchModel: StoreSearchModel;
    storesList: StoreModel[];
    upsertedStoreId: string;
    deletedStoreId: string;
    getStoreByIdSearchModel: StoreSearchModel;
    getStoreByIdStoreModel: StoreModel;
    storeDetailsUpdates: { storeDetailsUpdate: Update<StoreModel> };
    refreshStoreList: StoreModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public upsertStoreModel: StoreModel) { }
}

export class CreateStoreCompleted implements Action {
    type = StoreActionTypes.CreateStoreCompleted;
    storeSearchModel: StoreSearchModel;
    storesList: StoreModel[];
    upsertStoreModel: StoreModel;
    deletedStoreId: string;
    getStoreByIdSearchModel: StoreSearchModel;
    getStoreByIdStoreModel: StoreModel;
    storeDetailsUpdates: { storeDetailsUpdate: Update<StoreModel> };
    refreshStoreList: StoreModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public upsertedStoreId: string) { }
}

export class DeleteStoreCompleted implements Action {
    type = StoreActionTypes.DeleteStoreCompleted;
    storeSearchModel: StoreSearchModel;
    storesList: StoreModel[];
    upsertStoreModel: StoreModel;
    upsertedStoreId: string;
    getStoreByIdSearchModel: StoreSearchModel;
    getStoreByIdStoreModel: StoreModel;
    storeDetailsUpdates: { storeDetailsUpdate: Update<StoreModel> };
    refreshStoreList: StoreModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public deletedStoreId: string) { }
}

export class CreateStoreFailed implements Action {
    type = StoreActionTypes.CreateStoreFailed;
    storeSearchModel: StoreSearchModel;
    storesList: StoreModel[];
    upsertStoreModel: StoreModel;
    upsertedStoreId: string;
    deletedStoreId: string;
    getStoreByIdSearchModel: StoreSearchModel;
    getStoreByIdStoreModel: StoreModel;
    storeDetailsUpdates: { storeDetailsUpdate: Update<StoreModel> };
    refreshStoreList: StoreModel;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class GetStoreByIdTriggered implements Action {
    type = StoreActionTypes.GetStoreByIdTriggered;
    storeSearchModel: StoreSearchModel;
    storesList: StoreModel[];
    upsertStoreModel: StoreModel;
    upsertedStoreId: string;
    deletedStoreId: string;
    getStoreByIdStoreModel: StoreModel;
    storeDetailsUpdates: { storeDetailsUpdate: Update<StoreModel> };
    refreshStoreList: StoreModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public getStoreByIdSearchModel: StoreSearchModel) { }
}

export class GetStoreByIdCompleted implements Action {
    type = StoreActionTypes.GetStoreByIdCompleted;
    storeSearchModel: StoreSearchModel;
    storesList: StoreModel[];
    upsertStoreModel: StoreModel;
    upsertedStoreId: string;
    deletedStoreId: string;
    getStoreByIdSearchModel: StoreSearchModel;
    storeDetailsUpdates: { storeDetailsUpdate: Update<StoreModel> };
    refreshStoreList: StoreModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public getStoreByIdStoreModel: StoreModel) { }
}

export class UpdateStoreById implements Action {
    type = StoreActionTypes.UpdateStoreById;
    storeSearchModel: StoreSearchModel;
    storesList: StoreModel[];
    upsertStoreModel: StoreModel;
    upsertedStoreId: string;
    deletedStoreId: string;
    getStoreByIdSearchModel: StoreSearchModel;
    getStoreByIdStoreModel: StoreModel;
    refreshStoreList: StoreModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public storeDetailsUpdates: { storeDetailsUpdate: Update<StoreModel> }) { }
}

export class RefreshStoreList implements Action {
    type = StoreActionTypes.RefreshStoreList;
    storeSearchModel: StoreSearchModel;
    storesList: StoreModel[];
    upsertStoreModel: StoreModel;
    upsertedStoreId: string;
    deletedStoreId: string;
    getStoreByIdSearchModel: StoreSearchModel;
    getStoreByIdStoreModel: StoreModel;
    storeDetailsUpdates: { storeDetailsUpdate: Update<StoreModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public refreshStoreList: StoreModel) { }
}

export class StoreExceptionHandled implements Action {
    type = StoreActionTypes.StoreExceptionHandled;
    storeSearchModel: StoreSearchModel;
    storesList: StoreModel[];
    upsertStoreModel: StoreModel;
    upsertedStoreId: string;
    deletedStoreId: string;
    getStoreByIdSearchModel: StoreSearchModel;
    getStoreByIdStoreModel: StoreModel;
    storeDetailsUpdates: { storeDetailsUpdate: Update<StoreModel> };
    refreshStoreList: StoreModel;
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type StoreActions = LoadStoreTriggered
    | LoadStoreCompleted
    | LoadStoreFailed
    | CreateStoreTriggered
    | CreateStoreCompleted
    | DeleteStoreCompleted
    | CreateStoreFailed
    | GetStoreByIdTriggered
    | GetStoreByIdCompleted
    | UpdateStoreById
    | RefreshStoreList
    | StoreExceptionHandled;