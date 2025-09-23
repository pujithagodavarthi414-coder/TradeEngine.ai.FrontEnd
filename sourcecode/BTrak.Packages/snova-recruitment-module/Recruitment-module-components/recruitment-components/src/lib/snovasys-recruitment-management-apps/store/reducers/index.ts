import { createSelector, createFeatureSelector, ActionReducerMap, MemoizedSelector } from '@ngrx/store';
import * as fromCurrency from './currency.reducers';
import * as fromJobOpeningStatus from './job-opening-status.reducers';
import * as fromBranches from './branch.reducers';
import * as fromUsers from './users.reducers';
import * as fromAuthentication from './authentication.reducers';
import * as fromsoftLabels from './soft-labels.reducers';
import * as fromEmployee from './employee-list.reducers';
import * as fromUsersDropDown from './users-dropdown.reducers';
import * as fromUsersList from './users-list.reducers';
import * as fromHiringStatus from './hiring-status.reducers';
import * as fromJobOpening from './job-opening.reducers';
import * as fromCandidates from './candidate.reducers';
import * as _ from 'underscore';
import * as fromRoot from '../../../../lib/store/reducers.ts';
import { MemoizedSelectorWithProps } from '@ngrx/store/src/selector';
import { JobOpeningStatus } from '../../models/jobOpeningStatus';
// import { JobOpeningStatus } from 'project-components/lib/snovasys-recruitment-management-apps/models/jobOpeningStatus';

export interface State extends fromRoot.State {
  recruitmentManagement: RecruitmentManagementState;
}
export interface RecruitmentManagementState {
  currency: fromCurrency.State;
  jobOpeningStatus: fromJobOpeningStatus.State;
  branches: fromBranches.State;
  users: fromUsers.State;
  authencation: fromAuthentication.State;
  softLabels: fromsoftLabels.State;
  employee: fromEmployee.State;
  usersDropDown: fromUsersDropDown.State;
  usersList: fromUsersList.State;
  hiringStatus: fromHiringStatus.State;
  jobOpening: fromJobOpening.State;
  candidates: fromCandidates.State;
}

export const reducers: ActionReducerMap<RecruitmentManagementState> = {
  currency: fromCurrency.reducer,
  jobOpeningStatus: fromJobOpeningStatus.reducer,
  branches: fromBranches.reducer,
  users: fromUsers.reducer,
  authencation: fromAuthentication.reducer,
  softLabels: fromsoftLabels.reducer,
  employee: fromEmployee.reducer,
  usersDropDown: fromUsersDropDown.reducer,
  usersList: fromUsersList.reducer,
  hiringStatus: fromHiringStatus.reducer,
  jobOpening: fromJobOpening.reducer,
  candidates: fromCandidates.reducer
};

export const getRecruitmentManagementState = createFeatureSelector<
  State,
  RecruitmentManagementState
>('recruitmentManagement');

// Job Opening Status
export const getJobOpeningStatusEntitiesState: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.jobOpeningStatus
);

export const {
  selectIds: getJobOpeningStatus,
  selectEntities: getJobOpeningStatusEntities,
  selectAll: getAllJobOpeningStatus,
  selectTotal: getJobOpeningStatusTotal
}: any = fromJobOpeningStatus.jobOpeningStatusAdapter.getSelectors(
  getJobOpeningStatusEntitiesState
);

export const getJobOpeningStatusLoading: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.jobOpeningStatus.loadingJobOpeningStatus
);

export const jobOpeningStatusExceptionHandling: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.jobOpeningStatus.exceptionMessage
);

export const getJobOpeningStatusById: MemoizedSelectorWithProps<State, any, any> = createSelector(
  getRecruitmentManagementState,
  (state, props) => {
    // tslint:disable-next-line: only-arrow-functions
    const filteredJobStatusById = _.find(state.jobOpeningStatus.entities, function(jobOpeningStatus: JobOpeningStatus) {
      return jobOpeningStatus.jobOpeningStatusId.toUpperCase() === props.jobOpeningStatusId.toUpperCase();
    });
    return filteredJobStatusById;
  }
);

// Currency Selectors
export const getCurrencyEntitiesState: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
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
   getRecruitmentManagementState,
  state => state.currency.loadingCurrency
);

export const currencyExceptionHandling: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.currency.exceptionMessage
);

// Branch Selectors
export const getBranchEntitiesState: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
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
   getRecruitmentManagementState,
  state => state.branches.loadingBranch
);

export const branchExceptionHandling: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.branches.exceptionMessage
);

// Users Selectors
export const getUsersEntitiesState: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.users
);

export const {
  selectIds: getUsersIds,
  selectEntities: getUsersEntities,
  selectAll: getUsersAll,
  selectTotal: getUsersTotal
}: any = fromUsers.userAdapter.getSelectors(getUsersEntitiesState);

export const getUsersLoading: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.users.loadingUsers
);

export const getLoggedUser: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.users.User
);

export const exceptionHandlingForUsers: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.users.exceptionMessage
);

export const getAuthenticationState: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  (state) => state.authencation
);

export const getRoleFeaturesLoading: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.loadingRoleFeatures
);

// Soft label selectors
export const getSoftLabelsEntitiesState: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
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
   getRecruitmentManagementState,
  state => state.softLabels.upsertsoftLabel
);

export const loadingSearchSoftLabels: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.softLabels.loadingsoftLabels
);

export const getEmployeeEntitiesState: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
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
   getRecruitmentManagementState,
  state => state.employee.loadingEmployeeList
);

export const createEmployeeListDetailLoading: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.employee.creatingEmployeeList
);

export const gettingEmployeeListDetailsIdLoading: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.employee.gettingEmployeeListDetailsById
);

export const createEmployeeListDetailsErrors: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.employee.createEmployeeListErrors
);

export const getEmployeeListDetailsIdOfUpsertMembershipDetails: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.employee.employeeListDetailsById
);

export const getEmployeeListDetailsById: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.employee.employeeListDetailsData
);

export const employeeExceptionHandling: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.employee.exceptionMessage
);

// User DropDown Selectors
export const getUserDropDownEntitiesState: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
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
   getRecruitmentManagementState,
  state => state.usersDropDown.loadingUsersList
);

export const userDropDownExceptionHandling: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.usersDropDown.exceptionMessage
);

// Users list Selectors
export const getUsersListEntitiesState: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.usersList
);

export const {
  selectIds: getUsersListIds,
  selectEntities: getUsersListEntities,
  selectAll: getUsersListAll,
  selectTotal: getUsersListTotal
}: any = fromUsersList.usersListAdapter.getSelectors(getUsersListEntitiesState);

export const getUsersListLoading: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.usersList.loadingUsersList
);

export const createUserLoading: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.usersList.creatingUser
);

export const gettingUserByIdLoading: MemoizedSelector<State, any> = createSelector(
   getRecruitmentManagementState,
  state => state.usersList.gettingUserById
);

// Hiring status Selectors
export const getHiringStatusEntitiesState: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.hiringStatus
);

export const {
  selectIds: getHiringStatusIds,
  selectEntities: getHiringStatusEntities,
  selectAll: getHiringStatusAll,
  selectTotal: getHiringStatusTotal
}: any = fromHiringStatus.HiringStatusAdapter.getSelectors(
  getHiringStatusEntitiesState
);

export const getHiringStatusLoading: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.hiringStatus.loadingHiringList
);

export const hiringStatsHandling: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.hiringStatus.exceptionMessage
);

export const hiringStatusCreatedorUpsert: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.hiringStatus.hiringDetailsById
);

export const hiringStatusCreatedorUpsertFailed: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.hiringStatus.createHiringStatusListErrors
);

// Job opening Selectors
export const getJobOpeningEntitiesState: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.jobOpening
);

export const {
  selectIds: getJobOpeningIds,
  selectEntities: getJobOpeningEntities,
  selectAll: getJobOpeningAll,
  selectTotal: getJobOpeningTotal
}: any = fromJobOpening.JobOpeningAdapter.getSelectors(
  getJobOpeningEntitiesState
);

export const getJobOpeningLoading: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.jobOpening.loadingJobopeningList
);

export const jobOpeningHandling: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.jobOpening.exceptionMessage
);

export const jobOpeningCreatedorUpsert: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.jobOpening.jobopeningDetailsById
);

export const jobOpeningCreatedorUpsertFailed: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.jobOpening.createJobOpeningListErrors
);

// Candidates Selectors
export const getCandidatesEntitiesState: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.candidates
);

export const {
  selectIds: getCandidateIds,
  selectEntities: getCandidateEntities,
  selectAll: getCandidateAll,
  selectTotal: getCandidateTotal
}: any = fromCandidates.CandidateAdapter.getSelectors(
  getCandidatesEntitiesState
);

export const getCandidatesLoading: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.candidates.loadingCandidateList
);

export const candidatesHandling: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.candidates.exceptionMessage
);

export const candidatesCreatedorUpsert: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.candidates.candidateDetailsById
);

export const candidatesCreatedorUpsertFailed: MemoizedSelector<State, any> = createSelector(
  getRecruitmentManagementState,
  state => state.candidates.createCandidateListErrors
);
