import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";

import { FolderModel } from "../../models/folder-model";
import { StoreModel } from "../../models/store-model";

import { FolderActionTypes, FolderActions } from "../../store/actions/folder.actions";

export interface State extends EntityState<FolderModel> {
    loadingFolderAndFiles: boolean;
    storeOrFolderDataNotFound: boolean;
    loadingFolder: boolean;
    loadFolderErrors: string[];
    creatingFolder: boolean;
    upsertFolderId: string;
    createFolderErrors: string[];
    gettingFolderById: boolean;
    folderDetailsData: FolderModel;
    exceptionMessage: string;
    breadCrumb: FolderModel[];
    storeDetails: StoreModel;
    folderDescription: string;
}

export const folderAdapter: EntityAdapter<
    FolderModel
> = createEntityAdapter<FolderModel>({
    selectId: (folderModel: FolderModel) => folderModel.folderId
});

export const initialState: State = folderAdapter.getInitialState({
    loadingFolderAndFiles: false,
    storeOrFolderDataNotFound: false,
    loadingFolder: false,
    loadFolderErrors: [""],
    creatingFolder: false,
    upsertFolderId: "",
    createFolderErrors: [""],
    gettingFolderById: false,
    folderDetailsData: null,
    exceptionMessage: "",
    breadCrumb: null,
    storeDetails: null,
    folderDescription: null
});

export function reducer(
    state: State = initialState,
    action: FolderActions
): State {
    switch (action.type) {
        case FolderActionTypes.LoadFoldersAndFilesTriggered:
            return { ...state, loadingFolderAndFiles: true, storeOrFolderDataNotFound: false };
        case FolderActionTypes.LoadFoldersAndFilesCompleted:
            return { ...state, loadingFolderAndFiles: false, storeOrFolderDataNotFound: false };
        case FolderActionTypes.LoadFoldersAndFilesFailed:
            return { ...state, loadingFolderAndFiles: false, storeOrFolderDataNotFound: true };
        case FolderActionTypes.LoadBreadcrumbCompleted:
            return { ...state, breadCrumb: action.breadCrumbModel };
        case FolderActionTypes.LoadStoreDataCompleted:
            return { ...state, storeDetails: action.storeModel };
        case FolderActionTypes.LoadFolderDescriptionCompleted:
            return { ...state, folderDescription: action.folderDescription };
        case FolderActionTypes.LoadFoldersCompleted:
            return folderAdapter.addAll(action.foldersList, {
                ...state
            });
        case FolderActionTypes.LoadFoldersFailed:
            return { ...state, loadingFolder: false, loadFolderErrors: action.validationMessages };
        case FolderActionTypes.CreateFolderTriggered:
            return { ...state, creatingFolder: true };
        case FolderActionTypes.CreateFolderCompleted:
            return { ...state, creatingFolder: false, upsertFolderId: action.upsertFolderId };
        case FolderActionTypes.DeleteFolderCompleted:
            return folderAdapter.removeOne(action.deletedFolderId.toUpperCase(), { ...state, creatingFolder: false });
        case FolderActionTypes.CreateFolderFailed:
            return { ...state, creatingFolder: false, createFolderErrors: action.validationMessages };
        case FolderActionTypes.GetFolderByIdTriggered:
            return { ...state, gettingFolderById: true };
        case FolderActionTypes.GetFolderByIdCompleted:
            return { ...state, gettingFolderById: false, folderDetailsData: action.folderDetailsById };
        case FolderActionTypes.UpdateFolderById:
            return folderAdapter.updateOne(action.folderDetailsUpdates.folderDetailsUpdate, state);
        case FolderActionTypes.RefreshFolderList:
            return folderAdapter.upsertOne(action.refreshFolderDetails, state);
        case FolderActionTypes.ExceptionHandled:
            return { ...state, loadingFolder: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}