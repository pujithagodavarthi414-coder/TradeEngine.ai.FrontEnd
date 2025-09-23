import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from "@ngrx/store";

import * as _ from "underscore";
import * as fromFeedBacks from "../reducers/feedback.reducers";
import * as fromRoot from "../reducers/feedback.reducers";
import * as fromFileUpload from "./file-upload.reducers";
import * as fromFiles from "./file.reducers";
import * as fromAuthentication from "./authentication.reducers";


import { MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store/src/selector';
import { Dictionary } from '@ngrx/entity/src/models';
import { FeedBackModel } from '../../models/feedbackModel';
import { FileResultModel } from '../../models/file-result-model';

// tslint:disable-next-line: interface-name
export interface SharedModuleState {
  feedBacks: fromFeedBacks.State;
  fileUpload: fromFileUpload.State;
  file: fromFiles.State;
  authenticationRecord: fromAuthentication.State;

}

// tslint:disable-next-line: interface-name
export interface State extends fromRoot.State {
  shared: SharedModuleState;
}

export const reducers: ActionReducerMap<SharedModuleState> = {
  feedBacks: fromFeedBacks.reducer,
  fileUpload: fromFileUpload.reducer,
  file: fromFiles.reducer,
  authenticationRecord: fromAuthentication.reducer,

};

export const getSharedState = createFeatureSelector<State, SharedModuleState>(
  "shared"
);
// feedback selectors

export const getFeedBacks = createSelector(
  getSharedState,
  (state) => state.feedBacks
);

export const {
  selectIds: getFeedbackIds,
  selectEntities: getFeedbackEntities,
  selectAll: getFeedbackAll,
  selectTotal: geFeedbackTotal
} = fromFeedBacks.feedBackAdapter.getSelectors(getFeedBacks);

export const feedBacksLoading = createSelector(
  getSharedState,
  (state) => state.feedBacks.upsertFeedBack
);

export const getfeedBacksLoading = createSelector(
  getSharedState,
  (state) => state.feedBacks.loadingFeedbacks
);

export const submitBugfeedBacksLoading = createSelector(
  getSharedState,
  (state) => state.feedBacks.submitBugFeedback
);

export const getUpsertMissingFeatureId = createSelector(
  getSharedState,
  (state) => state.feedBacks.missingFeatureId
);

export const getSubmitFeddbackId = createSelector(
  getSharedState,
  (state) => state.feedBacks.userStoryId
);

//File selectors
export const getFileUploadState = createSelector(
  getSharedState,
  state => state.fileUpload
);

export const {
  selectIds: getFileUploadIds,
  selectEntities: getFileUploadEntities,
  selectAll: getFileUploadAll,
  selectTotal: getFileUploadTotal
} = fromFileUpload.fileUploadAdapter.getSelectors(getFileUploadState);

export const getFileUploadLoading = createSelector(
  getSharedState,
  state => state.fileUpload.isFileUploading
);

export const createFileLoading = createSelector(
  getSharedState,
  state => state.file.creatingFile
);

// Role Feature Selectors
export const getAuthenticationState: MemoizedSelector<State, fromAuthentication.State> = createSelector(
  getSharedState,
  (state) => state.authenticationRecord
);

export const doesUserHavePermission: MemoizedSelectorWithProps<State, any, boolean> = createSelector(
  getAuthenticationState,
  (authenticationRecord, props) => {
    return (
      // tslint:disable-next-line: only-arrow-functions
      authenticationRecord.roleFeatures.filter(function (
        roleFeatureModel: any
      ) {
        return (
          roleFeatureModel.featureId.toString().toLowerCase() ===
          props.featureId.toString().toLowerCase()
        );
      }).length > 0
    );
  }
);