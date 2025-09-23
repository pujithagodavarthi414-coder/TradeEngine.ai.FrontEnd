import { createSelector, createFeatureSelector, ActionReducerMap } from "@ngrx/store";
import * as fromLeaveFrequency from "./leave-frequency.reducers";
import * as fromLeaveType from "./leave-types.reducers";
import * as fromLeaveApplicability from "./leave-applicability.reducers";
import * as fromLeaves from './leaves.reducers';
import * as fromleaveOverviewList from './leave-overview.reducer';
import * as fromRoot from "../../rootStore/reducers";
import { MemoizedSelector } from '@ngrx/store/src/selector';
import { LeaveOverviewModel } from '../../models/leave-overview-model';
import { Dictionary } from '@ngrx/entity/src/models';
import { LeaveModel } from '../../models/leave-model';
import { LeaveApplicabilityModel } from '../../models/leave-applicability-model';
import { LeaveFrequencyTypeModel } from '../../models/leave-frequency-type-model';

import * as _ from 'underscore';

export interface State extends fromRoot.State {
  leaveManagement: LeaveManagementState;
}

export interface LeaveManagementState {
  leaveFrequency: fromLeaveFrequency.State,
  leaveType: fromLeaveType.State,
  leaveApplicability: fromLeaveApplicability.State,
  leaves: fromLeaves.State,
  leaveOverviewList: fromleaveOverviewList.State,
}

export const reducers: ActionReducerMap<LeaveManagementState> = {
  leaveFrequency: fromLeaveFrequency.reducer,
  leaveType: fromLeaveType.reducer,
  leaveApplicability: fromLeaveApplicability.reducer,
  leaves: fromLeaves.reducer,
  leaveOverviewList: fromleaveOverviewList.reducer,
}

export const getLeaveManagementState = createFeatureSelector<
  State,
  LeaveManagementState
>("leaveManagement");

//Leave Frequency Types Selectors
export const getLeaveManagementEntitiesState = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency,
);

export const getLeaveFrequencyEntitiesState = createSelector(
  getLeaveManagementState,
  state => state.leaveType,
);

export const getLeaveOverviewEntitiesState = createSelector(
  getLeaveManagementState,
  state => state.leaveOverviewList
);

export const {
  selectIds: getLeaveFrequencyTypesIds,
  selectEntities: getLeaveFrequencyEntities,
  selectAll: getLeaveFrequencyAll,
  selectTotal: getLeaveFrequencyTotal
} = fromLeaveFrequency.leaveFrequnecyAdapter.getSelectors(
  getLeaveManagementEntitiesState
);

export const getLeaveFrequencyTypesLoading = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency.loadingLeaveFrequencyTypesList
);

export const getEncashmentTypesLoading = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency.loadEncashmentTypesInprogress
);

export const getEncashmentTypesList = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency.encashmentTypes
);


export const getLeaveFormulasLoading = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency.loadLeaveFormulasInprogress
);

export const getLeaveFormulasList = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency.leaveFormulas
);

export const getRestrictionTypesList = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency.restrictionTypes
);

export const getLeaveTypesLoading = createSelector(
  getLeaveManagementState,
  state => state.leaveType.loadingLeaveTypesList
);

export const getLeaveTypeId = createSelector(
  getLeaveManagementState,
  state => state.leaveType.leaveTypeId
);

export const getLeaveFrequencyTypeById = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency.leaveFrequencyType
);

export const getLeaveTypeById = createSelector(
  getLeaveManagementState,
  state => state.leaveType.leaveTypeData
);

export const upsertLeaveTypeByIdLoading = createSelector(
  getLeaveManagementState,
  state => state.leaveType.upsertExistingLeaveTypeInProgress
);

export const upsertLeaveTypeByIdFailed = createSelector(
  getLeaveManagementState,
  state => state.leaveType.leaveTypeErrors
);

export const getLeaveTypes = createSelector(
  getLeaveManagementState,
  state => state.leaveType
);

export const getUpsertLeaveTypeInProgress = createSelector(
  getLeaveManagementState,
  state => state.leaveType.upsertLeaveTypeInProgress
);

export const getLoadLeaveFrequencyDetailsInProgress = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency.loadFrequencyDetailsInprogress
);

export const getLeaveFrequencyDetails = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency.leaveFrequencyDetails
);

export const getupsertLeaveFrequencyInProgress = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency.upsertLeaveFrequencyInProgress
);

export const getupsertexistingLeaveFrequencyInProgress = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency.upsertexistingLeaveFrequencyInProgress
);

export const LeaveFrequencyTypesExceptionHandling = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency.exceptionMessage
);

export const {
  selectIds: getLeaveTypesIds,
  selectEntities: getLeaveTypeEntities,
  selectAll: getLeaveTypesAll,
  selectTotal: getLeaveTypesTotal
} = fromLeaveType.leaveTypeAdapter.getSelectors(
  getLeaveFrequencyEntitiesState
);

//LeaveApplicability selectors
export const getLeaveApplicabilityEntitiesState = createSelector(
  getLeaveManagementState,
  state => state.leaveApplicability,
);

export const {
  selectIds: getLeaveApplicabilityIds,
  selectEntities: getLeaveApplicabilityEntities,
  selectAll: getLeaveApplicabilityAll,
  selectTotal: getLeaveApplicabilityTotal
} = fromLeaveApplicability.leaveApplicabilityAdapter.getSelectors(
  getLeaveApplicabilityEntitiesState
);

export const upsertLeaveApplicabilityInprogress = createSelector(
  getLeaveManagementState,
  state => state.leaveApplicability.upsertLeaveApplicabilityInProgress
);

export const getLeaveApplicabilityInprogress = createSelector(
  getLeaveManagementState,
  state => state.leaveApplicability.loadingLeaveApplicability
);

export const upsertLeaveApplicabilityFailedError = createSelector(
  getLeaveManagementState,
  state => state.leaveFrequency.leaveFrequencyTypeErrors
);

//Leaves selectors
export const getLeavesEntitiesState = createSelector(
  getLeaveManagementState,
  state => state.leaves,
);

export const {
  selectIds: getLeaveIds,
  selectEntities: getLeaveEntities,
  selectAll: getLeavesAll,
  selectTotal: getLeavesTotal
} = fromLeaves.leavesAdapter.getSelectors(
  getLeavesEntitiesState
);

export const {
  selectIds: getLeaveOverviewIds,
  selectEntities: getLeaveOverviewEntities,
  selectAll: getLeaveOverviewAll,
  selectTotal: getLeaveOverviewTotal
} = fromleaveOverviewList.leaveOverviewAdapter.getSelectors(
  getLeaveOverviewEntitiesState
);

export const upsertLeaveInprogress = createSelector(
  getLeaveManagementState,
  state => state.leaves.upsertLeaveInProgress
);

export const getLeavesInprogress = createSelector(
  getLeaveManagementState,
  state => state.leaves.loadingLeaves
);