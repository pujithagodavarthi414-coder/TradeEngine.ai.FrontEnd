import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { FolderModel } from '../../models/folder-model';
import { SearchFolderModel } from '../../models/search-folder-model';
import { StoreModel } from '../../models/store-model';
import { FoldersAndFilesInputModel } from '../../models/folders-and-files-input-model';

export enum FolderActionTypes {
    LoadFoldersAndFilesTriggered = '[SnovaAudisModule Folder Component] Initial Data Folders and Files Load Triggered',
    LoadFoldersAndFilesCompleted = '[SnovaAudisModule Folder Component] Initial Data Folders and Files Load Completed',
    LoadFoldersAndFilesFailed = '[SnovaAudisModule Folder Component] Initial Data Folders and Files Load Failed',
    // LoadFoldersTriggered = '[SnovaAudisModule Folder Component] Initial Data Load Triggered',
    LoadFoldersCompleted = '[SnovaAudisModule Folder Component] Initial Data Load Completed',
    LoadBreadcrumbCompleted = '[SnovaAudisModule Folder Component] Initial Breadcrumb Data Load Completed',
    LoadStoreDataCompleted = '[SnovaAudisModule Folder Component] Initial Store Data Load Completed',
    LoadFolderDescriptionCompleted = '[SnovaAudisModule Folder Component] Initial Load Folder Description Completed',
    LoadFoldersFailed = '[SnovaAudisModule Folder Component] Initial Data Load Failed',
    CreateFolderTriggered = '[SnovaAudisModule Folder Component] Create Folder Triggered',
    CreateFolderCompleted = '[SnovaAudisModule Folder Component] Create Folder Completed',
    DeleteFolderCompleted = '[SnovaAudisModule Folder Component] Delete Folder Completed',
    CreateFolderFailed = '[SnovaAudisModule Folder Component] Create Folder Failed',
    GetFolderByIdTriggered = '[SnovaAudisModule Folder Component] Get Folder By Id Triggered',
    GetFolderByIdCompleted = '[SnovaAudisModule Folder Component] Get Folder By Id Completed',
    UpdateFolderById = '[SnovaAudisModule Folder Component] Update Folder By Id',
    RefreshFolderList = '[SnovaAudisModule Folder Component] Refresh Folder List',
    ExceptionHandled = '[SnovaAudisModule Folder Component] Handle Exception',
}

export class LoadFoldersAndFilesTriggered implements Action {
    type = FolderActionTypes.LoadFoldersAndFilesTriggered;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public searchFolderModel: SearchFolderModel) { }
}

export class LoadFoldersAndFilesCompleted implements Action {
    type = FolderActionTypes.LoadFoldersAndFilesCompleted;
    searchFolderModel: SearchFolderModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public foldersAndFilesInputModel: FoldersAndFilesInputModel) { }
}

export class LoadFoldersAndFilesFailed implements Action {
    type = FolderActionTypes.LoadFoldersAndFilesFailed;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}
// export class LoadFoldersTriggered implements Action {
//     type = FolderActionTypes.LoadFoldersTriggered;
//     foldersList :FolderModel[];
//     breadCrumbModel :FolderModel[];
//     storeModel :StoreModel;
//     upsertFolderDetails :FolderModel;
//     upsertFolderId: string;
//     deletedFolderId: string;
//     searchFolderByIdModel: SearchFolderModel;
//     folderDetailsById :FolderModel
//     folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
//     refreshFolderDetails: FolderModel;
//     validationMessages: any[];
//     errorMessage: string;
//     constructor(public searchFolderModel: SearchFolderModel) { }
// }

export class LoadFoldersCompleted implements Action {
    type = FolderActionTypes.LoadFoldersCompleted;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public foldersList: FolderModel[]) { }
}

export class LoadBreadcrumbCompleted implements Action {
    type = FolderActionTypes.LoadBreadcrumbCompleted;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public breadCrumbModel: FolderModel[]) { }
}

export class LoadStoreDataCompleted implements Action {
    type = FolderActionTypes.LoadStoreDataCompleted;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public storeModel: StoreModel) { }
}

export class LoadFolderDescriptionCompleted implements Action {
    type = FolderActionTypes.LoadFolderDescriptionCompleted;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    storeModel: StoreModel
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public folderDescription: string) { }
}

export class LoadFoldersFailed implements Action {
    type = FolderActionTypes.LoadFoldersFailed;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateFolderTriggered implements Action {
    type = FolderActionTypes.CreateFolderTriggered;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderId: string;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public upsertFolderDetails: FolderModel) { }
}

export class CreateFolderCompleted implements Action {
    type = FolderActionTypes.CreateFolderCompleted;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public upsertFolderId: string) { }
}

export class DeleteFolderCompleted implements Action {
    type = FolderActionTypes.DeleteFolderCompleted;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public deletedFolderId: string) { }
}

export class CreateFolderFailed implements Action {
    type = FolderActionTypes.CreateFolderFailed;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class GetFolderByIdTriggered implements Action {
    type = FolderActionTypes.GetFolderByIdTriggered;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public searchFolderByIdModel: SearchFolderModel) { }
}

export class GetFolderByIdCompleted implements Action {
    type = FolderActionTypes.GetFolderByIdCompleted;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public folderDetailsById: FolderModel) { }
}

export class UpdateFolderById implements Action {
    type = FolderActionTypes.UpdateFolderById;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    refreshFolderDetails: FolderModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> }) { }
}

export class RefreshFolderList implements Action {
    type = FolderActionTypes.RefreshFolderList;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public refreshFolderDetails: FolderModel) { }
}

export class ExceptionHandled implements Action {
    type = FolderActionTypes.ExceptionHandled;
    searchFolderModel: SearchFolderModel;
    foldersAndFilesInputModel: FoldersAndFilesInputModel;
    foldersList: FolderModel[];
    breadCrumbModel: FolderModel[];
    storeModel: StoreModel;
    folderDescription: string;
    upsertFolderDetails: FolderModel;
    upsertFolderId: string;
    deletedFolderId: string;
    searchFolderByIdModel: SearchFolderModel;
    folderDetailsById: FolderModel
    folderDetailsUpdates: { folderDetailsUpdate: Update<FolderModel> };
    refreshFolderDetails: FolderModel;
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type FolderActions = LoadFoldersAndFilesTriggered
    | LoadFoldersAndFilesCompleted
    | LoadFoldersAndFilesFailed
    // | LoadFoldersTriggered
    | LoadFoldersCompleted
    | LoadBreadcrumbCompleted
    | LoadStoreDataCompleted
    | LoadFolderDescriptionCompleted
    | LoadFoldersFailed
    | CreateFolderTriggered
    | CreateFolderCompleted
    | DeleteFolderCompleted
    | CreateFolderFailed
    | GetFolderByIdTriggered
    | GetFolderByIdCompleted
    | UpdateFolderById
    | RefreshFolderList
    | ExceptionHandled;