import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
  MemoizedSelector
} from "@ngrx/store";
import * as fromComments from "./comments.reducers";
import * as fromFileUpload from './file-upload.reducers';
import * as fromWorkflowStatus from '../../project-store/reducers/workflow-status.reducers';
import * as fromGoals from '../../project-store/reducers/goals.reducers'
import * as fromRoot from "../../../store/reducers/index";
import { WorkflowStatus } from "../../models/workflowStatus";
import * as fromProjectMembers from '../../project-store/reducers/project-members.reducers';
import * as fromLogTimeOptions from '../../project-store/reducers/logTime.reducers';
import * as fromUserStoryLogTime from "../../project-store/reducers/userStoryLogTime.reducers";
import * as fromUserstoryHistory from '../../project-store/reducers/userstory-history.reducers';
import * as fromProjectFeatures from '../../project-store/reducers/project-features.reducers';
// import * as fromBugPriorities from "../../project-store/reducers/bug-priority.reducers";
// import * as fromUserStory from '../../project-store/reducers/userstories.reducers';
import * as fromConfigurationsettings from "../../project-store/reducers/permissions.reducers";
import * as fromFiles from "../../documentmanagement-store/reducers/file.reducers";
import * as fromFolders from "../../documentmanagement-store/reducers/folder.reducers";
import * as fromStoreConfiguration from "./store-configurations.reducers";
import * as fromUploadedFiles from "../../project-store/reducers/fileUpload.reducers";
import * as fromUserStoryLinks from "../../project-store/reducers/userstory-links.reducers";
import * as fromCustomField from "./custom-fields.reducers";
// import * as fromsoftLabels from "./soft-labels.reducers";
import * as fromCustomFieldHistory from "./custom-field-history.reducers";
import * as _ from 'underscore';
import { ConfigurationSettingModel } from "../../models/configurationType";
import { MemoizedSelectorWithProps } from '@ngrx/store/src/selector';

export interface CommonState {
  comments: fromComments.State;
  fileUpload: fromFileUpload.State;
  workflowStatus: fromWorkflowStatus.State;
  goals: fromGoals.State;
  projectMembers: fromProjectMembers.State;
  logTimeOptions: fromLogTimeOptions.State;
  userStoryLogTime: fromUserStoryLogTime.State;
  userStoryHistory: fromUserstoryHistory.State;
  projectFeatures: fromProjectFeatures.State;
  // bugPriorities: fromBugPriorities.State;
  // userStories: fromUserStory.State;
  configurationSettings: fromConfigurationsettings.State;
  file: fromFiles.State;
  folder: fromFolders.State;
  storeConfiguration: fromStoreConfiguration.State;
  uploadedFiles: fromUploadedFiles.State;
  userStoryLinks: fromUserStoryLinks.State;
  customFields: fromCustomField.State;
  // softLabels: fromsoftLabels.State;
  customFieldsHistory: fromCustomFieldHistory.State;
}

export interface State extends fromRoot.State {
  common: CommonState;

}

export const reducers: ActionReducerMap<CommonState> = {
  comments: fromComments.reducer,
  fileUpload: fromFileUpload.reducer,
  workflowStatus: fromWorkflowStatus.reducer,
  goals: fromGoals.reducer,
  projectMembers: fromProjectMembers.reducer,
  logTimeOptions: fromLogTimeOptions.reducer,
  userStoryLogTime: fromUserStoryLogTime.reducer,
  userStoryHistory: fromUserstoryHistory.reducer,
  projectFeatures: fromProjectFeatures.reducer,
  // bugPriorities: fromBugPriorities.reducer,
  // userStories: fromUserStory.reducer,
  configurationSettings: fromConfigurationsettings.reducer,
  file: fromFiles.reducer,
  folder: fromFolders.reducer,
  storeConfiguration: fromStoreConfiguration.reducer,
  uploadedFiles: fromUploadedFiles.reducer,
  userStoryLinks: fromUserStoryLinks.reducer,
  customFields: fromCustomField.reducer,
  // softLabels: fromsoftLabels.reducer,
  customFieldsHistory: fromCustomFieldHistory.reducer
};

export const getCommonState = createFeatureSelector<State, CommonState>(
  "common"
);

//Comments Selectors
export const getCommentsState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.comments
);

export const {
  selectIds: getCommentIds,
  selectEntities: getCommentEntities,
  selectAll: getCommentAll,
  selectTotal: getCommentTotal
} : any = fromComments.commentsAdapter.getSelectors(getCommentsState);

export const getCommentsLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.comments.loadingCommentsByReceiverId
);


export const getCommentsCount: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.comments.commentsCount
);

export const getUserStoryLinksCount: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.comments.userStoryLinksCount
);

export const getBugsCountByUserStoryId: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.comments.bugsByUserStoryIdCount
);

export const getBugsCountByGoalId: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.comments.bugsByGoalIdCount
);

export const getUpsertCommentsProcessing: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.comments.upsertCommentOperationInProgress
);



export const anyOperationInProgress: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.comments.loadingCommentsByReceiverId
);

export const upsertCommentInProgress: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.comments.upsertCommentOperationInProgress
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
} : any = fromFileUpload.fileUploadAdapter.getSelectors(getFileUploadState);

export const getFileUploadLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.fileUpload.isFileUploading
);

export const getReferenceIdOfFile: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.fileUpload.referenceId
);

// File Upload Selectors

export const getfileUploadEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.uploadedFiles
);

export const {
  selectIds: getUploadFilesListIds,
  selectEntities: getUploadFilesListEntities,
  selectAll: getUploadFilesListAll,
  selectTotal: getUploadFilesListTotal
} : any = fromUploadedFiles.adapter.getSelectors(getfileUploadEntitiesState);

export const fileUploadLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.uploadedFiles.fileUploadstarted
);

export const fileUploadErrors: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.uploadedFiles.fileUploadErrors
);

export const getWorkflowStatusEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.workflowStatus
);

export const {
  selectIds: getworkflowStatusIds,
  selectEntities: getworkflowStatusEntities,
  selectAll: getworkflowStatusAll,
  selectTotal: getworkflowStatusTotal
} : any = fromWorkflowStatus.workflowStatusAdapter.getSelectors(
  getWorkflowStatusEntitiesState
);

export const getworkflowStatusLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.workflowStatus.loadingWorkflowstatus
);

export const getworkflowStatusAllByWorkflowId: MemoizedSelectorWithProps<State, any, any> = createSelector(
  getCommonState,
  (state, props) => {

    var filteredWorkflowStatuses = _.filter(state.workflowStatus.entities, function (workflowStatus: WorkflowStatus) {
      return workflowStatus.workFlowId.toUpperCase() == props.workflowId.toUpperCase()
    });
    return filteredWorkflowStatuses;
  }
);


export const getGoalsEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.goals
);

export const {
  selectIds: getgoalIds,
  selectEntities: getgoalEntities,
  selectAll: getgoalsAll,
  selectTotal: getgoalsTotal
} : any = fromGoals.adapter.getSelectors(getGoalsEntitiesState);

export const getProjectMembersEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.projectMembers
);

export const {
  selectIds: getProjectMembersIds,
  selectEntities: getProjectMembersEntities,
  selectAll: getProjectMembersAll,
  selectTotal: getProjectMembersTotal
} : any = fromProjectMembers.projectAdapter.getSelectors(
  getProjectMembersEntitiesState
);

export const getLogTimeOptionsEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.logTimeOptions
);

export const {
  selectIds: getlogTimeOptionsIds,
  selectEntities: getlogTimeOptionsEntities,
  selectAll: getlogTimeOptionsAll,
  selectTotal: getlogTimeOptionsTotal
}: any = fromLogTimeOptions.logTimeActionAdapter.getSelectors(
  getLogTimeOptionsEntitiesState
);

export const getlogTimeOptionsLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.logTimeOptions.loadingLogTimeOption
);


export const getuserStoryLogTimeEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLogTime
);

export const insertLogTimeLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLogTime.insertLogTime
);

export const insertAutoLogTimeLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLogTime.insertAutoLogTime
);


export const insertAutoLogTimeLoadingInProjects: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLogTime.insertAutoLogTime
);

export const insertLogTimeErrors: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLogTime.insertLogTimeErrors
);

export const exceptionHandlingForLogTime: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLogTime.exceptionMessage
);


export const getUserStoryLogTimeEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLogTime
);

export const {
  selectIds: getUserStorylogTimeIds,
  selectEntities: getUserStorylogTimeEntities,
  selectAll: getUserStorylogTimeAll,
  selectTotal: getUserStorylogTimeTotal
} : any = fromUserStoryLogTime.logTimeAdapter.getSelectors(
  getUserStoryLogTimeEntitiesState
);

export const getUserStorylogTimeLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLogTime.loadingUserStoryLogTime
);

// Userstory history selectors

export const getUserstoryHistoryEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryHistory
);

export const {
  selectIds: getUserstoryHistoryIds,
  selectEntities: getUserstoryHistoryEntities,
  selectAll: getUserstoryHisoryAll,
  selectTotal: getUserstoryHistoryTotal
} : any = fromUserstoryHistory.userstoryHistoryAdapter.getSelectors(
  getUserstoryHistoryEntitiesState
);

export const getuserStoryHistoryLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryHistory.loadUserStoryHistory
);


// BugPriority Selectors
// export const getBugPrioritiesEntitiesState: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state => state.bugPriorities
// );

// export const {
//   selectIds: getbugPriorityIds,
//   selectEntities: getBugPriorityEntities,
//   selectAll: getBugPriorityAll,
//   selectTotal: getBugPriorityTotal
// } : any = fromBugPriorities.bugPriorityAdapter.getSelectors(
//   getBugPrioritiesEntitiesState
// );

// export const getBugPrioritiesLoading: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state => state.bugPriorities.loadingBugPriority
// );

//Project Features
export const getProjectFeaturesEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.projectFeatures
);

export const {
  selectIds: getProjectFeaturesIds,
  selectEntities: getProjectFeaturesEntities,
  selectAll: getProjectFeaturesAll,
  selectTotal: getProjectFeaturesTotal
} : any = fromProjectFeatures.projectAdapter.getSelectors(
  getProjectFeaturesEntitiesState
);

//UserStory selectors


// export const getUserStoryEntitiesState: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state => state.userStories
// );


// export const createuserStoryLoading: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state => state.userStories.creatingUserStory
// );


// export const archiveUserStoryIsInProgress: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state =>
//     state.userStories.archiveUserStory
// );


// export const archiveSubTaskUserStoryIsInProgress: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state =>
//     state.userStories.archiveUniqueUserStory
// );

// export const parkSubTaskUserStoryIsInProgress: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state =>
//     state.userStories.parkUniqueUserStory
// );

// export const parkUserStoryInProgress: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state =>
//     state.userStories.parkUserStory
// );

// export const updateUserStoryGoalInProgress: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state =>
//     state.userStories.updateUserStoryGoal
// );

// export const getUserStoryByIdLoading: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state => state.userStories.getUserStoryById
// );

// export const getUserStoryById: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state => state.userStories.userStory
// );

// export const getUniqueUserStoryById: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state => state.userStories.getUniqueUserStoryById
// );

// export const getSubTasksLoading: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state => state.userStories.loadingSubTasks
// );

// export const upsertTagsLoading: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state => state.userStories.creatingUserStoryTags
// );


// export const getSubTasksList: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state => state.userStories.userStoriesList
// );

// export const getUserStoriesList: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state => state.userStories.autoCompleteUserStories
// );

// export const searchLoading: MemoizedSelector<State, any> = createSelector(
//   getCommonState,
//   state => state.userStories.loading
// );

//Configuration Settings

//configuration Types Selectors

export const getConfigurationPermissionsEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.configurationSettings
);

export const {
  selectIds: getConfigurationPermissionsIds,
  selectEntities: getConfigurationPermissionsEntities,
  selectAll: getConfigurationPermissionsAll,
  selectTotal: getConfigurationPermissionsTotal
}: any = fromConfigurationsettings.permissionConfigurationAdapter.getSelectors(
  getConfigurationPermissionsEntitiesState
);

export const getConfigurationPermissionsLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.configurationSettings.loadingpermissionConfigurations
);

export const getPermissionsConfigurationsByConfigurationTypeId: MemoizedSelectorWithProps<State, any, any> = createSelector(
  getCommonState,
  (state, props) => {

    var filteredPermissionsList = _.filter(state.configurationSettings.entities, function (permissions: ConfigurationSettingModel) {
      return permissions.configurationTypeId.toUpperCase() == props.configurationTypeId.toUpperCase()
    });
    return filteredPermissionsList;
  }
);

// UserStory Links

export const getUserStoryLinksEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLinks
);

export const {
  selectIds: getUserStoryLinksIds,
  selectEntities: getUserStoryLinksEntities,
  selectAll: getUserStoryLinksAll,
  selectTotal: getUserStoryLinksTotal
} : any = fromUserStoryLinks.userStoryLinkAdapter.getSelectors(
  getUserStoryLinksEntitiesState
);

export const getUserStoryLinksloading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLinks.loadUserStoryLinks
);

export const getUserStoryLinkTypes: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLinks.userStoryLinkTypes
);


export const getUserStoryLinkTypesLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLinks.loadingUserStoryLinkTypes
);

export const upsertUserStoryLinkLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLinks.creatingLink
);

export const exceptionHandling: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLinks.errorMessage
);

export const archiveUserStoryLinkLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.userStoryLinks.archiveUserStoryLink
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
} : any = fromFiles.fileAdapter.getSelectors(
  getFileEntitiesState
);

export const getFileLoading: MemoizedSelector<State, any> = createSelector(
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
} : any = fromFolders.folderAdapter.getSelectors(
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
} : any = fromStoreConfiguration.storeConfigurationAdapter.getSelectors(
  getStoreConfigurationEntitiesState
);

export const getStoreConfigurationLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.storeConfiguration.loadingStoreConfiguration
);

// Custom field selectors

export const getCustomFieldsEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.customFields
);


export const {
  selectIds: getCustomFieldsIds,
  selectEntities: getCustomFieldsEntities,
  selectAll: getCustomFieldsAll,
  selectTotal: getCustomFieldsTotal
} : any = fromCustomField.customFieldAdapter.getSelectors(
  getCustomFieldsEntitiesState
);

export const createCustomFieldLoading: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.customFields.createingCustomForm
);

export const loadingSearchCustomFields: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.customFields.loadingCustomFields
);

export const archiveCustomFields: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.customFields.archiveCustomFieldLoading
);

// Soft label selectors

// export const getSoftLabelsEntitiesState = createSelector(
//   getCommonState,
//   state => state.softLabels
// );


// export const {
//   selectIds: getSoftLabelsIds,
//   selectEntities: getSoftLabelsEntities,
//   selectAll: getSoftLabelsAll,
//   selectTotal: getSoftLabelsTotal
// } = fromsoftLabels.softLabelAdapter.getSelectors(
//   getSoftLabelsEntitiesState
// );

// export const createSoftLabelsLoading = createSelector(
//   getCommonState,
//   state => state.softLabels.upsertsoftLabel
// );

// export const loadingSearchSoftLabels = createSelector(
//   getCommonState,
//   state => state.softLabels.loadingsoftLabels
// );

// Custom Field History selectors

export const getCustomFieldHistoryEntitiesState: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.customFieldsHistory
);


export const {
  selectIds: getCustomFieldHistoryIds,
  selectEntities: getCustomFieldHistoryEntities,
  selectAll: getCustomFieldHistoryAll,
  selectTotal: getCustomFieldHistoryTotal
} : any = fromCustomFieldHistory.custmFieldHistoryAdapter.getSelectors(
  getCustomFieldHistoryEntitiesState
);

export const loadingSearchCustomFieldsHistory: MemoizedSelector<State, any> = createSelector(
  getCommonState,
  state => state.customFieldsHistory.loadCustomFieldsHistory
);
