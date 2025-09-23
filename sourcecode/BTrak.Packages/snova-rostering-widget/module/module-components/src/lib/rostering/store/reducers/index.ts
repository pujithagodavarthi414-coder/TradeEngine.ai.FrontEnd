
import { ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";

import * as fromRoot from "../../../../store/reducers/index";
import * as fromRequestReducer from "./roster-requests.reducers";
import * as fromPlanReducer from "./roster-plans.reducers";
import * as fromSolutionReducer from "./roster-solution.reducers";
import * as fromSolutionOutputReducer from "./roster-solutions-output.reducers";
import * as fromTemplatePlanReducer from "./roster-template-plan.reducer";
import * as fromRatesheetReducer from "./ratesheet-details.reducers";
import { EmployeeRateSheetModel } from '../../models/employee-ratesheet-model';
import { Dictionary } from '@ngrx/entity';
import { RosterRequestModel } from '../../models/roster-request-model';
import { RosterPlanOutputByRequestModel } from '../../models/roster-request-plan-model';
import { RosterPlanSolution } from '../../models/roster-plan-solution-model';
import { RosterTemplatePlanOutputByRequestModel } from '../../models/roster-request-template-plan-model';


export interface State extends fromRoot.State {
  rosterManagement: RosterManagementState;
}

export interface RosterManagementState {
  requestroster: fromRequestReducer.State;
  planRoster: fromPlanReducer.State;
  solutionRoster: fromSolutionReducer.State;
  rosterSolutionOutput: fromSolutionOutputReducer.State;
  templatePlanRoster: fromTemplatePlanReducer.State;
  rateSheet: fromRatesheetReducer.State;
}

export const reducers: ActionReducerMap<RosterManagementState> = {
  requestroster: fromRequestReducer.reducer,
  planRoster: fromPlanReducer.reducer,
  solutionRoster: fromSolutionReducer.reducer,
  rosterSolutionOutput: fromSolutionOutputReducer.reducer,
  templatePlanRoster: fromTemplatePlanReducer.reducer,
  rateSheet: fromRatesheetReducer.reducer
}

export const getRosterManagementState: MemoizedSelector<State, any> = createFeatureSelector<
  State,
  RosterManagementState
>("rosterManagement");

// Roster request Selectors
export const getRosterGetPlanRequestsEntitiesState: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  (state) => state.requestroster
);

export const {
  selectIds: getRosterRequestIds,
  selectEntities: getRosterRequestEntities,
  selectAll: getRosterRequestsAll,
  selectTotal: getRosterRequestsTotal
} = fromRequestReducer.rosterRequestAdapter.getSelectors(
  getRosterGetPlanRequestsEntitiesState
);

export const loadingEmployeeRoster: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  (state) => state.requestroster.loadingEmployeeRoster
);

// Roster Plan Selectors
export const getRosterGetPlanEntitiesState: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  (state) => state.planRoster
);

export const {
  selectIds: getRosterPlanIds,
  selectEntities: getRosterPlanEntities,
  selectAll: getRosterPlansAll,
  selectTotal: getRosterPlansTotal
} = fromPlanReducer.rosterPlanAdapter.getSelectors(
  getRosterGetPlanEntitiesState
);

export const EmployeeRosterPlansLoading: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  (state) => state.planRoster.loadingEmployeeRoster
);

// Roster Solution Selectors
export const getRosterGetSolutionEntitiesState: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  (state) => state.solutionRoster
);

export const {
  selectIds: getRosterSolutionIds,
  selectEntities: getRosterSolutionEntities,
  selectAll: getRosterSolutionsAll,
  selectTotal: getRosterSolutionsTotal
} = fromSolutionReducer.rosterSolutionAdapter.getSelectors(
  getRosterGetSolutionEntitiesState
);

export const createSolutionloading: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  (state) => state.solutionRoster.creatingEmployeeRoster
);

export const createSolutionErrors: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  (state) => state.solutionRoster.validationMessages
);

export const approvePlanloading: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  (state) => state.solutionRoster.approvingEmployeeRoster
);

// Roster Solutions by Request Selectors
export const getRosterGetSolutionOutputEntitiesState: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  (state) => state.rosterSolutionOutput
);

export const {
  selectIds: getRosterSolutionOutputIds,
  selectEntities: getRosterSolutionOutputEntities,
  selectAll: getRosterSolutionOutputAll,
  selectTotal: getRosterSolutionOutputTotal
} = fromSolutionOutputReducer.rosterRequestAdapter.getSelectors(
  getRosterGetSolutionOutputEntitiesState
);

export const createRosterSolutionOutputloading: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  (state) => state.rosterSolutionOutput.gettingRosterSolutionById
);

export const createRosterSolutionOutputErrors: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  (state) => state.rosterSolutionOutput.validationMessages
);


// Roster solution by request template selectors
export const getRosterTemplateOutputEntitiesState: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  (state) => state.templatePlanRoster
);

export const {
  selectIds: getRosterTemplatePlanIds,
  selectEntities: getRosterTemplatePlanEntities,
  selectAll: getRosterTemplatePlansAll,
  selectTotal: getRosterTemplatePlansTotal
} = fromTemplatePlanReducer.rosterPlanAdapter.getSelectors(
  getRosterTemplateOutputEntitiesState
);

export const templateLoading: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  (state) => state.templatePlanRoster.loadingEmployeeRoster
);


//Employee Rate Sheet Details Selectors
export const getEmployeeRateSheetDetailsEntitiesState: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  state => state.rateSheet
);

export const {
  selectIds: getEmployeeRateSheetDetailIds,
  selectEntities: getEmployeeRateSheetDetailEntities,
  selectAll: getEmployeeRateSheetDetailsAll,
  selectTotal: getEmployeeRateSheetDetailsTotal
} = fromRatesheetReducer.employeeRateSheetDetailsAdapter.getSelectors(
  getEmployeeRateSheetDetailsEntitiesState
);

export const getEmployeeRateSheetDetailLoading: MemoizedSelector<State, any> = createSelector(
  getRosterManagementState,
  state => state.rateSheet.loadingEmployeeRateSheetDetails
);