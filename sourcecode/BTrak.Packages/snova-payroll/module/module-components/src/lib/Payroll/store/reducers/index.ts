import { createSelector, createFeatureSelector, ActionReducerMap, MemoizedSelector } from "@ngrx/store";

import * as fromBranch from "./branch.reducers"
import * as _ from 'underscore';
import * as fromRoot from "../../../../store/reducers/index";
import {Dictionary} from "@ngrx/entity";
import  {Branch} from "../../models/branch";

export interface PayRollManagementState {
  fromBranch: fromBranch.State;
}

export interface State extends fromRoot.State {
  payRollManagement: PayRollManagementState;
}

export const reducers: ActionReducerMap<PayRollManagementState> = {
  fromBranch: fromBranch.reducer
};

export const getPayRollManagementState: MemoizedSelector<State, any> = createFeatureSelector<State, PayRollManagementState>(
  "payRollManagement"
);

//Branch Selectors
export const getBranchEntitiesState: MemoizedSelector<State, any> = createSelector(
  getPayRollManagementState,
  state => state.fromBranch
);

export const {
  selectIds: getBranchId,
  selectEntities: getBranchEntities,
  selectAll: getBranchAll,
  selectTotal: getBranchTotal
} = fromBranch.branchAdapter.getSelectors(
  getBranchEntitiesState
);

export const getBranchLoading: MemoizedSelector<State, any> = createSelector(
  getPayRollManagementState,
  state => state.fromBranch.loadingBranch
);

export const branchExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getPayRollManagementState,
  state => state.fromBranch.exceptionMessage
);
