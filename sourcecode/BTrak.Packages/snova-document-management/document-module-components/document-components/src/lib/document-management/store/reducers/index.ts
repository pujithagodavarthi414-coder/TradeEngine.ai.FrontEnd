import { createFeatureSelector, ActionReducerMap, createSelector } from "@ngrx/store";
import * as fromFolders from "./folder.reducers";
import * as fromFiles from "./file.reducers";
import * as fromFileUpload from "./file-upload.reducers";
import * as fromUploadedFiles from "./fileUpload.reducers";
import * as fromStore from "./store.reducers";
import * as fromRoot from './store.reducers';
import * as fromsoftLabels from './soft-labels.reducers';
import * as _ from "underscore";
import { StoreModel } from "../../models/store-model";
import { MemoizedSelector } from '@ngrx/store/src/selector';
import { ValidationModel } from '../../models/validation-messages';
import { Dictionary } from '@ngrx/entity/src/models';
import { FileResultModel } from '../../models/fileResultModel';
import { FileInputModel } from '../../models/file-input-model';
import { FolderModel } from '../../models/folder-model';
import { fileModel } from '../../models/fileModel';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';

export interface State extends fromRoot.State {
  documentManagement: DocumentManagementState;
}

export interface DocumentManagementState {
  folder: fromFolders.State;
  file: fromFiles.State;
  store: fromStore.State;
  fileUpload: fromFileUpload.State;
  uploadedFiles: fromUploadedFiles.State;
  softLabels: fromsoftLabels.State;
}

export const reducers: ActionReducerMap<DocumentManagementState> = {
  folder: fromFolders.reducer,
  file: fromFiles.reducer,
  store: fromStore.reducer,
  fileUpload: fromFileUpload.reducer,
  uploadedFiles: fromUploadedFiles.reducer,
  softLabels: fromsoftLabels.reducer
}

export const getDocumentManagementState = createFeatureSelector<
  State,
  DocumentManagementState
>("documentManagement");

//Folder Selectors
export const getFolderEntitiesState = createSelector(
  getDocumentManagementState,
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

export const getFoldersAndFilesLoading = createSelector(
  getDocumentManagementState,
  state => state.folder.loadingFolderAndFiles
);

export const getStatusOfThisStorePage = createSelector(
  getDocumentManagementState,
  state => state.folder.storeOrFolderDataNotFound
);

export const createFolderLoading = createSelector(
  getDocumentManagementState,
  state => state.folder.creatingFolder
);

export const gettingFolderIdLoading = createSelector(
  getDocumentManagementState,
  state => state.folder.gettingFolderById
);

export const createFolderErrors = createSelector(
  getDocumentManagementState,
  state => state.folder.createFolderErrors
);

export const getFolderIdOfUpsertFolder = createSelector(
  getDocumentManagementState,
  state => state.folder.upsertFolderId
);

export const getFolderById = createSelector(
  getDocumentManagementState,
  state => state.folder.folderDetailsData
);

export const folderExceptionHandling = createSelector(
  getDocumentManagementState,
  state => state.folder.exceptionMessage
);

export const getBreadCrumb = createSelector(
  getDocumentManagementState,
  state => state.folder.breadCrumb
);

export const getStoreDetails = createSelector(
  getDocumentManagementState,
  state => state.folder.storeDetails
);

export const getFolderDescription = createSelector(
  getDocumentManagementState,
  state => state.folder.folderDescription
);

//File Selectors
export const getFileEntitiesState = createSelector(
  getDocumentManagementState,
  state => state.file
);

export const {
  selectIds: getFileIds,
  selectEntities: getFileEntities,
  selectAll: getFileAll,
  selectTotal: getFileTotal
} = fromFiles.fileAdapter.getSelectors(getFileEntitiesState);

export const getFileLoading = createSelector(
  getDocumentManagementState,
  state => state.file.loadingFile
);

export const createFileLoading = createSelector(
  getDocumentManagementState,
  state => state.file.creatingFile
);

export const gettingFileIdLoading = createSelector(
  getDocumentManagementState,
  state => state.file.gettingFileById
);

export const createFileErrors = createSelector(
  getDocumentManagementState,
  state => state.file.createFileErrors
);

export const getFileIdOfUpsertFile = createSelector(
  getDocumentManagementState,
  state => state.file.upsertFileId
);

export const getFileById = createSelector(
  getDocumentManagementState,
  state => state.file.fileDetailsData
);

export const fileExceptionHandling = createSelector(
  getDocumentManagementState,
  state => state.file.exceptionMessage
);

//Store Selectors
export const getStoreEntitiesState = createSelector(
  getDocumentManagementState,
  state => state.store
);

export const {
  selectIds: getStoreIds,
  selectEntities: getStoreEntities,
  selectAll: getStoreAll,
  selectTotal: getStoreTotal
} = fromStore.StoreAdapter.getSelectors(
  getStoreEntitiesState
);

export const getStoreLoading = createSelector(
  getDocumentManagementState,
  state => state.store.loadingStore
);

export const createStoreLoading = createSelector(
  getDocumentManagementState,
  state => state.store.creatingStore
);

export const gettingStoreIdLoading = createSelector(
  getDocumentManagementState,
  state => state.store.gettingStoreById
);

export const getCompanyStoreId = createSelector(
  getDocumentManagementState,
  (state) => {
    const companyStoreId = _.find(state.store.entities, function (store: StoreModel) {
      return (store.isDefault === true && store.isCompany === true && store.isArchived === false)
    });
    return companyStoreId.storeId;
  }
);

//File upload selectors
export const getFileUploadState = createSelector(
  getDocumentManagementState,
  state => state.fileUpload
);

export const {
  selectIds: getFileUploadIds,
  selectEntities: getFileUploadEntities,
  selectAll: getFileUploadAll,
  selectTotal: getFileUploadTotal
} = fromFileUpload.fileUploadAdapter.getSelectors(getFileUploadState);

export const getFileUploadLoading = createSelector(
  getDocumentManagementState,
  state => state.fileUpload.isFileUploading
);

export const getReferenceIdOfFile = createSelector(
  getDocumentManagementState,
  state => state.fileUpload.referenceId
);

export const getfileUploadEntitiesState = createSelector(
  getDocumentManagementState,
  state => state.uploadedFiles
);

export const {
  selectIds: getUploadFilesListIds,
  selectEntities: getUploadFilesListEntities,
  selectAll: getUploadFilesListAll,
  selectTotal: getUploadFilesListTotal
} = fromUploadedFiles.adapter.getSelectors(getfileUploadEntitiesState);

export const fileUploadLoading = createSelector(
  getDocumentManagementState,
  state => state.uploadedFiles.fileUploadstarted
);

export const fileUploadErrors = createSelector(
  getDocumentManagementState,
  state => state.uploadedFiles.fileUploadErrors
);
//Softlabel selectors
export const getSoftLabelsEntitiesState = createSelector(
  getDocumentManagementState,
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

export const createSoftLabelsLoading = createSelector(
  getDocumentManagementState,
  state => state.softLabels.upsertsoftLabel
);

export const loadingSearchSoftLabels = createSelector(
  getDocumentManagementState,
  state => state.softLabels.loadingsoftLabels
);
