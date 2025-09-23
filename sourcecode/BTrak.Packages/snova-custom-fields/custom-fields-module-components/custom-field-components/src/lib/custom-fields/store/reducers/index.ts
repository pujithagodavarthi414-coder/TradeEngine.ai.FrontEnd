import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap
} from "@ngrx/store";
import * as fromCustomField from "./custom-fields.reducers";
import * as fromCustomFieldHistory from "./custom-field-history.reducers";
import * as _ from 'underscore';
import * as fromRoot from './custom-fields.reducers';
import * as fromsoftLabels from './soft-labels.reducers';
import { MemoizedSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { CustomFieldHistoryModel } from '../../models/custom-field-history.model';
import { CustomFormFieldModel } from '../../models/custom-fileds-model';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';

export interface CommonState {
  customFields: fromCustomField.State;
  customFieldsHistory: fromCustomFieldHistory.State;
  softLabels: fromsoftLabels.State;

}

export interface State extends fromRoot.State {
  common: CommonState;

}

export const reducers: ActionReducerMap<CommonState> = {
  customFields: fromCustomField.reducer,
  customFieldsHistory: fromCustomFieldHistory.reducer,
  softLabels: fromsoftLabels.reducer
};

export const getCommonState = createFeatureSelector<State, CommonState>(
  "common"
);

// Custom field selectors

export const getCustomFieldsEntitiesState = createSelector(
  getCommonState,
  state => state.customFields
);

export const {
  selectIds: getCustomFieldsIds,
  selectEntities: getCustomFieldsEntities,
  selectAll: getCustomFieldsAll,
  selectTotal: getCustomFieldsTotal
} = fromCustomField.customFieldAdapter.getSelectors(
  getCustomFieldsEntitiesState
);

export const createCustomFieldLoading = createSelector(
  getCommonState,
  state => state.customFields.createingCustomForm
);

export const loadingSearchCustomFields = createSelector(
  getCommonState,
  state => state.customFields.loadingCustomFields
);

export const archiveCustomFields = createSelector(
  getCommonState,
  state => state.customFields.archiveCustomFieldLoading
);

// Custom Field History selectors

export const getCustomFieldHistoryEntitiesState = createSelector(
  getCommonState,
  state => state.customFieldsHistory
);


export const {
  selectIds: getCustomFieldHistoryIds,
  selectEntities: getCustomFieldHistoryEntities,
  selectAll: getCustomFieldHistoryAll,
  selectTotal: getCustomFieldHistoryTotal
} = fromCustomFieldHistory.custmFieldHistoryAdapter.getSelectors(
  getCustomFieldHistoryEntitiesState
);

export const loadingSearchCustomFieldsHistory = createSelector(
  getCommonState,
  state => state.customFieldsHistory.loadCustomFieldsHistory
);

//Softlabel selectors
export const getSoftLabelsEntitiesState = createSelector(
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

export const createSoftLabelsLoading = createSelector(
  getCommonState,
  state => state.softLabels.upsertsoftLabel
);

export const loadingSearchSoftLabels = createSelector(
  getCommonState,
  state => state.softLabels.loadingsoftLabels
);
