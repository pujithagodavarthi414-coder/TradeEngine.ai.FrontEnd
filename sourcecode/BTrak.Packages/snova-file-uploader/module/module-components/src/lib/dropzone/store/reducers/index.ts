import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
  MemoizedSelector
} from "@ngrx/store";
import * as fromFileUpload from './file-upload.reducers';
import * as fromRoot from "../../store/reducers";
import * as fromFiles from "../../store/reducers/file.reducers";
import * as fromFolders from "../../store/reducers/folder.reducers";
import * as fromStoreConfiguration from "./store-configurations.reducers";
import * as fromStores from "./store.reducers";
import * as fromSnackbar from "./snackbar.reducers";
import * as fromsoftLabels from "./soft-labels.reducers"
import * as _ from 'underscore';
import { StoreModel } from '../../models/store-model';
import { FileResultModel } from "../../models/fileResultModel";
import { FolderModel } from "../../models/folder-model";
import { StoreConfigurationModel } from "../../models/store-configuration-model";
import { Dictionary } from '@ngrx/entity';
import {FileInputModel} from "../../models/file-input-model";
import {SoftLabelConfigurationModel} from "../../models/softlabels-model";

export interface CommonState {
  fileUpload: fromFileUpload.State;
  file: fromFiles.State;
  folder: fromFolders.State;
  storeConfiguration: fromStoreConfiguration.State;
  store: fromStores.State;
  snackbarState: fromSnackbar.State;
  softLabels: fromsoftLabels.State;
}

export interface State {
  common: CommonState;
}

export const reducers: ActionReducerMap<CommonState> = {
  fileUpload: fromFileUpload.reducer,
  file: fromFiles.reducer,
  folder: fromFolders.reducer,
  storeConfiguration: fromStoreConfiguration.reducer,
  snackbarState: fromSnackbar.reducer,
  store: fromStores.reducer,
  softLabels: fromsoftLabels.reducer
};

export const getCommonState: MemoizedSelector<State, any> = createFeatureSelector<State, CommonState>(
  "common"
);

//FileUpload selectors

export const getFileUploadState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.fileUpload
);

export const {
  selectIds: getFileUploadIds,
  selectEntities: getFileUploadEntities,
  selectAll: getFileUploadAll,
  selectTotal: getFileUploadTotal
} = fromFileUpload.fileUploadAdapter.getSelectors(getFileUploadState);

export const getFileUploadLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.fileUpload.isFileUploading
);

export const getReferenceIdOfFile: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.fileUpload.referenceId
);

//File Selectors
export const getFileEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.file
);

export const {
  selectIds: getFileIds,
  selectEntities: getFileEntities,
  selectAll: getFileAll,
  selectTotal: getFileTotal
} = fromFiles.fileAdapter.getSelectors(
  getFileEntitiesState
);

export const getFileLoading = createSelector(
  getCommonState,
  state => state.file.loadingFile
);

export const createFileLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.file.creatingFile
);

export const gettingFileIdLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.file.gettingFileById
);

export const getFileIdOfUpsertFile: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.file.upsertFileId
);

export const getFileById: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.file.fileDetailsData
);

export const exceptionHandled: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.file.exceptionMessage
);

//Folder Selectors
export const getFolderEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.folder
);

export const {
  selectIds: getFolderIds,
  selectEntities: getFolderEntities,
  selectAll: getFolderAll,
  selectTotal: getFolderTotal
} = fromFolders.folderAdapter.getSelectors(
  getFolderEntitiesState
);

export const getFoldersAndFilesLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.folder.loadingFolderAndFiles
);

export const getStatusOfThisStorePage: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.folder.storeOrFolderDataNotFound
);

export const createFolderLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.folder.creatingFolder
);

export const gettingFolderIdLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.folder.gettingFolderById
);

export const createFolderErrors: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.folder.createFolderErrors
);

export const getFolderIdOfUpsertFolder: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.folder.upsertFolderId
);

export const getFolderById: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.folder.folderDetailsData
);

export const folderExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.folder.exceptionMessage
);

export const getBreadCrumb: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.folder.breadCrumb
);

export const getStoreDetails: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.folder.storeDetails
);

export const getFolderDescription: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.folder.folderDescription
);

//Store Configuration Selectors
export const getStoreConfigurationEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.storeConfiguration
);

export const {
  selectIds: getStoreConfigurationIds,
  selectEntities: getStoreConfigurationEntities,
  selectAll: getStoreConfigurationAll,
  selectTotal: getStoreConfigurationTotal
} = fromStoreConfiguration.storeConfigurationAdapter.getSelectors(
  getStoreConfigurationEntitiesState
);

export const getStoreConfigurationLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.storeConfiguration.loadingStoreConfiguration
);


//Store Selectors
export const getStoreEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.store
);

export const {
  selectIds: getStoreIds,
  selectEntities: getStoreEntities,
  selectAll: getStoreAll,
  selectTotal: getStoreTotal
} = fromStores.StoreAdapter.getSelectors(
  getStoreEntitiesState
);

export const getStoreLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.store.loadingStore
);

export const createStoreLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.store.creatingStore
);

export const gettingStoreIdLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.store.gettingStoreById
);

export const getCompanyStoreId = createSelector(
  getCommonState,
  (state) => {
    const companyStoreId = _.find(state.store.entities, function (store: StoreModel) {
      return (store.isDefault === true && store.isCompany === true && store.isArchived === false)
    });
    return companyStoreId.storeId;
  }
);


// Soft label selectors

export const getSoftLabelsEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.softLabels
);


export const {
  selectIds: getSoftLabelsIds,
  selectEntities: getSoftLabelsEntities,
  selectAll: getSoftLabelsAll,
  selectTotal: getSoftLabelsTotal
} = fromsoftLabels.softLabelAdapter.getSelectors(
  getSoftLabelsEntitiesState
);

export const createSoftLabelsLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.softLabels.upsertsoftLabel
);

export const loadingSearchSoftLabels: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.softLabels.loadingsoftLabels
);
