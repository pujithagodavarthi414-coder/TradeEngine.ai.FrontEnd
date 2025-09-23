import { createSelector, createFeatureSelector, ActionReducerMap, MemoizedSelector } from "@ngrx/store";
import * as fromCurrency from "./currency.reducers";
import * as fromBranches from "./branch.reducers";
import * as fromUsers from "./users.reducers";
import * as fromAuthentication from './authentication.reducers';
import * as fromsoftLabels from './soft-labels.reducers';
import * as fromEmployee from './employee-list.reducers';
import * as fromUsersDropDown from './users-dropdown.reducers';
import * as fromUsersList from "./users-list.reducers";
import * as _ from 'underscore';
import * as fromRoot from "../../../../lib/store/reducers.ts";

export interface State extends fromRoot.State {
  assetManagement: AssetManagementState;
}
export interface AssetManagementState {
  currency: fromCurrency.State;
  branches: fromBranches.State;
  users: fromUsers.State;
  authencation: fromAuthentication.State;
  softLabels: fromsoftLabels.State;
  employee: fromEmployee.State;
  usersDropDown: fromUsersDropDown.State;
  usersList: fromUsersList.State;
}

export const reducers: ActionReducerMap<AssetManagementState> = {
  currency: fromCurrency.reducer,
  branches: fromBranches.reducer,
  users: fromUsers.reducer,
  authencation: fromAuthentication.reducer,
  softLabels: fromsoftLabels.reducer,
  employee: fromEmployee.reducer,
  usersDropDown: fromUsersDropDown.reducer,
  usersList: fromUsersList.reducer,
}

export const getAssetManagementState = createFeatureSelector<
  State,
  AssetManagementState
>("assetManagement");

//Currency Selectors
export const getCurrencyEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.currency
);

export const {
  selectIds: getCurrencyId,
  selectEntities: getCurrencyEntities,
  selectAll: getCurrencyAll,
  selectTotal: getCurrencyTotal
}: any = fromCurrency.currencyAdapter.getSelectors(
  getCurrencyEntitiesState
);

export const getCurrencyLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.currency.loadingCurrency
);

export const currencyExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.currency.exceptionMessage
);

//Branch Selectors
export const getBranchEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.branches
);

export const {
  selectIds: getBranchId,
  selectEntities: getBranchEntities,
  selectAll: getBranchAll,
  selectTotal: getBranchTotal
}: any = fromBranches.branchAdapter.getSelectors(
  getBranchEntitiesState
);

export const getBranchLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.branches.loadingBranch
);

export const branchExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.branches.exceptionMessage
);

// Users Selectors
export const getUsersEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.users
);

export const {
  selectIds: getUsersIds,
  selectEntities: getUsersEntities,
  selectAll: getUsersAll,
  selectTotal: getUsersTotal
}: any = fromUsers.userAdapter.getSelectors(getUsersEntitiesState);

export const getUsersLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.users.loadingUsers
);

export const getLoggedUser: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.users.User
);

export const exceptionHandlingForUsers: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.users.exceptionMessage
);
export const getAuthenticationState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  (state) => state.authencation
);

export const getRoleFeaturesLoading: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.loadingRoleFeatures
);

// Soft label selectors
export const getSoftLabelsEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.softLabels
);

export const {
  selectIds: getSoftLabelsIds,
  selectEntities: getSoftLabelsEntities,
  selectAll: getSoftLabelsAll,
  selectTotal: getSoftLabelsTotal
}: any = fromsoftLabels.softLabelAdapter.getSelectors(
  getSoftLabelsEntitiesState
);

export const createSoftLabelsLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.softLabels.upsertsoftLabel
);

export const loadingSearchSoftLabels: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.softLabels.loadingsoftLabels
);

export const getEmployeeEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.employee
);

export const {
  selectIds: getEmployeeIds,
  selectEntities: getEmployeeEntities,
  selectAll: getEmployeeAll,
  selectTotal: getEmployeeTotal
}: any = fromEmployee.EmployeeListAdapter.getSelectors(
  getEmployeeEntitiesState
);

export const getEmployeeLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.employee.loadingEmployeeList
);

export const createEmployeeListDetailLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.employee.creatingEmployeeList
);

export const gettingEmployeeListDetailsIdLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.employee.gettingEmployeeListDetailsById
);

export const createEmployeeListDetailsErrors: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.employee.createEmployeeListErrors
);

export const getEmployeeListDetailsIdOfUpsertMembershipDetails: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.employee.employeeListDetailsById
);

export const getEmployeeListDetailsById: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.employee.employeeListDetailsData
);

export const employeeExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.employee.exceptionMessage
);

//User DropDown Selectors
export const getUserDropDownEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.usersDropDown
);

export const {
  selectIds: getUserDropDownIds,
  selectEntities: getUserDropDownEntities,
  selectAll: getUserDropDownAll,
  selectTotal: getUserDropDownTotal
}: any = fromUsersDropDown.usersAdapter.getSelectors(
  getUserDropDownEntitiesState
);

export const getUserDropDownLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.usersDropDown.loadingUsersList
);

export const userDropDownExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.usersDropDown.exceptionMessage
);

//Users list Selectors
export const getUsersListEntitiesState: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.usersList
);

export const {
  selectIds: getUsersListIds,
  selectEntities: getUsersListEntities,
  selectAll: getUsersListAll,
  selectTotal: getUsersListTotal
}: any = fromUsersList.usersListAdapter.getSelectors(getUsersListEntitiesState);

export const getUsersListLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.usersList.loadingUsersList
);

export const createUserLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.usersList.creatingUser
);

export const gettingUserByIdLoading: MemoizedSelector<State, any> = createSelector(
  getAssetManagementState,
  state => state.usersList.gettingUserById
);
