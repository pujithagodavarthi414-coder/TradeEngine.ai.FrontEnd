import { createSelector, createFeatureSelector, ActionReducerMap, MemoizedSelector } from "@ngrx/store";
import * as fromRoot from "../../../store/reducers.ts";
import * as fromTeamLeadsList from "./teamleads.reducers";
import * as fromUserProfile from "./user-profile.reducers";
import * as fromLeavesList from "./myleaves-myprofile.reducers";
import * as fromBranches from "./branch.reducers";
import * as fromAuthentication from './authentication.reducers';
import * as fromWorkspaces from './workspacelist.reducers';
import * as fromProjects from "./projects.reducers";
import * as fromLeaves from './leaves.reducers';
import * as fromLeaveType from "./leave-types.reducers";
import * as fromUserStoryTypes from "./userStoryTypes.reducers";
import * as fromBoardTypes from "./board-type.reducers";
import * as fromNotificationValidator from "./notification-validator.reducers";
import * as fromSnackbar from "./snackbar.reducers";
import * as fromChangePassword from "./change-password.reducers";
import * as fromCanteenPurchaseItems from "./cantenn-purchase.reducers";
import * as fromEmployee from "./employee-list.reducers";
import * as fromCanteenBalance from "./canteen-balance.reducers";

export interface DashboardState {
  fromTeamLeadsList: fromTeamLeadsList.State,
  userProfile: fromUserProfile.State,
  myLeaves: fromLeavesList.State,
  authencation: fromAuthentication.State;
  branches: fromBranches.State;
  workspaces: fromWorkspaces.State;
  projects: fromProjects.State;
  leaves: fromLeaves.State;
  leaveType: fromLeaveType.State;
  userStoryTypes: fromUserStoryTypes.State;
  boardTypes: fromBoardTypes.State;
  validationsState: fromNotificationValidator.State;
  snackbarState: fromSnackbar.State;
  changePassword: fromChangePassword.State;
  canteenPurchaseItem: fromCanteenPurchaseItems.State;
  employee: fromEmployee.State;
  canteenBalance: fromCanteenBalance.State;
}

export interface State extends fromRoot.State {
  Dashboard: DashboardState;
}

export const reducers: ActionReducerMap<DashboardState> = {
  fromTeamLeadsList: fromTeamLeadsList.reducer,
  userProfile: fromUserProfile.reducer,
  myLeaves: fromLeavesList.reducer,
  authencation: fromAuthentication.reducer,
  branches: fromBranches.reducer,
  workspaces: fromWorkspaces.reducer,
  projects: fromProjects.reducer,
  leaves: fromLeaves.reducer,
  leaveType: fromLeaveType.reducer,
  userStoryTypes: fromUserStoryTypes.reducer,
  boardTypes: fromBoardTypes.reducer,
  validationsState: fromNotificationValidator.reducer,
  snackbarState: fromSnackbar.reducer,
  changePassword: fromChangePassword.reducer,
  canteenPurchaseItem: fromCanteenPurchaseItems.reducer,
  employee: fromEmployee.reducer,
  canteenBalance: fromCanteenBalance.reducer,
}

export const getDashboardState: MemoizedSelector<State, any> = createFeatureSelector<
  State,
  DashboardState
>("Dashboard");

//TeamLeadsList
export const getTeamLeadsListEntitiesState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.fromTeamLeadsList
);

export const {
  selectIds: getTeamLeadsListIds,
  selectEntities: getTeamLeadsListEntities,
  selectAll: getTeamLeadsListAll,
  selectTotal: getTeamLeadsListTotal
}: any = fromTeamLeadsList.teamLeadsAdapter.getSelectors(
  getTeamLeadsListEntitiesState
);

export const getTeamLeadsListloading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.fromTeamLeadsList.loadingTeamLeads
);

//User Profile Selectors
export const getUserProfileTypeEntitiesState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.userProfile
);

export const {
  selectIds: getUserProfileTypeIds,
  selectEntities: getUserProfileTypeEntities,
  selectAll: getUserProfileTypeAll,
  selectTotal: getUserProfileTypeTotal
}: any = fromUserProfile.userProfileAdapter.getSelectors(
  getUserProfileTypeEntitiesState
);

export const getUserProfileLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.userProfile.loadingUserProfileDetails
);


export const getUserProfileDetails: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.userProfile.userProfileDetails
);

export const getUpsertProfileImageLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.userProfile.upsertingUserProfileImage
);

export const getUserProfileErrors: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.userProfile.userProfileErrors
);

export const userProfileExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.userProfile.exceptionMessage
);

export const getAuthenticationState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  (state) => state.authencation
);

export const getRoleFeaturesLoading: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.loadingRoleFeatures
);

export const getCompanySettings: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  authenticationRecord => authenticationRecord.companySettingsModel
);

//leave selectors
export const getLeaveApplicabilityEntitiesState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.myLeaves,
);

export const {
  selectIds: getLeavesIds,
  selectEntities: getMyLeavesEntities,
  selectAll: getMyLeavesAll,
  selectTotal: getMyLeavesTotal
}: any = fromLeavesList.leavesAdapter.getSelectors(
  getLeaveApplicabilityEntitiesState
);

export const loadingMyLeavesInprogress: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.myLeaves.loadingLeaves
);

//Branch Selectors
export const getBranchEntitiesState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
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
  getDashboardState,
  state => state.branches.loadingBranch
);

export const branchExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.branches.exceptionMessage
);

export const getWorkspacesListLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.workspaces.loadingWorkspaceList
);

export const getWorkspaces: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.workspaces
);

export const {
  selectIds: getWorkspaceIds,
  selectEntities: getWorkspaceEntities,
  selectAll: getWorkspaceAll,
  selectTotal: getWorkspaceTotal
}: any = fromWorkspaces.WorkspaceAdapter.getSelectors(getWorkspaces);

// Projects Selectors
export const getProjectEntitiesState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  (state) => state.projects
);

export const getSelectedProjectId: MemoizedSelector<State, any> = createSelector(
  getProjectEntitiesState,
  fromProjects.getSelectedId
);

export const getSelectedGoalOnProjectModule: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  (state) => state.projects.selectedGoal
);

export const {
  selectIds: getProjectsIds,
  selectEntities: getProjectsEntities,
  selectAll: getProjectsAll,
  selectTotal: getProjectsTotal
}: any = fromProjects.projectAdapter.getSelectors(getProjectEntitiesState);

export const getSelectedProject: MemoizedSelector<State, any> = createSelector(
  getProjectsEntities,
  getSelectedProjectId,
  (entities, selectedId) => {
    return selectedId && entities[selectedId];
  }
);

export const getProjectsLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  (state) => state.projects.loadingProjects
);

export const createProjectLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  (state) => state.projects.creatingProject
);

export const createProjectErrors: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  (state) => state.projects.createProjectErrors
);

export const exceptionHandling: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  (state) => state.projects.exceptionMessage
);

export const EditProjectById: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  (state) => state.projects.Project
);

//Leaves selectors
export const getLeavesEntitiesState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.leaves,
);

export const {
  selectIds: getLeaveIds,
  selectEntities: getLeaveEntities,
  selectAll: getLeavesAll,
  selectTotal: getLeavesTotal
}: any = fromLeaves.leavesAdapter.getSelectors(
  getLeavesEntitiesState
);

export const upsertLeaveInprogress: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.leaves.upsertLeaveInProgress
);

export const getLeavesInprogress: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.leaves.loadingLeaves
);


export const getLeaveFrequencyEntitiesState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.leaveType,
);

export const getLeaveTypesLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.leaveType.loadingLeaveTypesList
);

export const getLeaveTypeId: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.leaveType.leaveTypeId
);

export const getLeaveTypeById: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.leaveType.leaveTypeData
);

export const upsertLeaveTypeByIdLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.leaveType.upsertExistingLeaveTypeInProgress
);

export const upsertLeaveTypeByIdFailed: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.leaveType.leaveTypeErrors
);

export const getLeaveTypes: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.leaveType
);

export const getUpsertLeaveTypeInProgress: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.leaveType.upsertLeaveTypeInProgress
);

export const {
  selectIds: getLeaveTypesIds,
  selectEntities: getLeaveTypeEntities,
  selectAll: getLeaveTypesAll,
  selectTotal: getLeaveTypesTotal
}: any = fromLeaveType.leaveTypeAdapter.getSelectors(
  getLeaveFrequencyEntitiesState
);

// user story types Selectors

export const getUserStoryTypesEntitiesState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  (state) => state.userStoryTypes
);

export const {
  selectIds: getUserStoryTypesIds,
  selectEntities: getUserStoryTypesEntities,
  selectAll: getUserStoryTypesAll,
  selectTotal: getUserStoryTypesTotal
}: any = fromUserStoryTypes.userStoryTypesAdapter.getSelectors(
  getUserStoryTypesEntitiesState
);

export const getUserStoryTypesLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  (state) => state.userStoryTypes.loadingUserStoryTypes
);

// BoardTypes Selectors
export const getBoardTypesEntitiesState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  (state) => state.boardTypes
);

export const {
  selectIds: getboardTypeIds,
  selectEntities: getBoardTypeEntities,
  selectAll: getBoardTypesAll,
  selectTotal: getBoardTypesTotal
}: any = fromBoardTypes.boardTypeAdapter.getSelectors(getBoardTypesEntitiesState);

export const getBoardTypesLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  (state) => state.boardTypes.loadingBoardTypes
);
//Change Password selectors

export const getChangePasswordEntitiesState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.changePassword
);

export const changePasswordLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.changePassword.CreatingPassword
);

//Canteen Purchase Item Selectors
export const getCanteenPurchaseEntitiesState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.canteenPurchaseItem
);

export const {
  selectIds: getCanteenPurchaseItemIds,
  selectEntities: getCanteenPurchaseItemEntities,
  selectAll: getCanteenPurchaseItemsAll,
  selectTotal: getCanteenPurchaseItemTotal
}: any = fromCanteenPurchaseItems.canteenPurchaseItemAdapter.getSelectors(
  getCanteenPurchaseEntitiesState
);

export const getCanteenPurchaseItemLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.canteenPurchaseItem.loadingCanteenPurchaseItems
);

export const getMyCanteenPurchasesLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.canteenPurchaseItem.loadingMyCanteenPurchases
);

export const createCanteenPurchaseItemLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.canteenPurchaseItem.creatingCanteenPurchaseItem
);

export const createCanteenPurchaseItemErrors: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.canteenPurchaseItem.createCanteenPurchaseItemErrors
);

export const myCanteenPurchasesList: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.canteenPurchaseItem.myCanteenPurchasesList
);

export const canteenPurchaseItemExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.canteenPurchaseItem.exceptionMessage
);

//EmployeeSelectors
export const getEmployeeEntitiesState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
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
  getDashboardState,
  state => state.employee.loadingEmployeeList
);

export const createEmployeeListDetailLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.employee.creatingEmployeeList
);

export const gettingEmployeeListDetailsIdLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.employee.gettingEmployeeListDetailsById
);

export const createEmployeeListDetailsErrors: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.employee.createEmployeeListErrors
);

export const getEmployeeListDetailsIdOfUpsertMembershipDetails: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.employee.employeeListDetailsById
);

export const getEmployeeListDetailsById: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.employee.employeeListDetailsData
);

export const employeeExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.employee.exceptionMessage
);

//CanteenBalance Selectors
export const getCanteenBalanceEntitiesState: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.canteenBalance
);

export const {
  selectIds: getCanteenBalanceIds,
  selectEntities: getCanteenBalanceEntities,
  selectAll: getCanteenBalanceAll,
  selectTotal: getCanteenBalanceTotal
}: any = fromCanteenBalance.canteenBalanceAdapter.getSelectors(
  getCanteenBalanceEntitiesState
);

export const getCanteenBalanceLoading: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.canteenBalance.loadingCanteenBalance
);

export const canteenBalanceErrors: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.canteenBalance.canteenBalanceErrors
);

export const canteenBalanceExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getDashboardState,
  state => state.canteenBalance.exceptionMessage
);
