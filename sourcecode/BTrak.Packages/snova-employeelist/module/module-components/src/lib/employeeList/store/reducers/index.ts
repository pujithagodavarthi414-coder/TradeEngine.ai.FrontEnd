import * as fromRoot from "../../../../store/reducers/index";

import { Dictionary } from '@ngrx/entity';
import { ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import * as fromBranches from "./branch.reducers"
import * as fromJobCategory from "./job-category.reducers";
import * as fromsoftLabels from "./soft-labels.reducers"
import * as fromRoles from "./roles.reducers";
import * as fromShiftTiming from "./shift-timing.reducers";
import * as fromTimeZone from "./time-zone.reducers";
import * as fromCurrency from "./currency.reducers";
import * as fromSnackBar from "./snackbar.reducers";
import * as fromEmployee from "./employee-list.reducers";
import * as fromDepartment from "./department.reducers";
import * as fromDesignation from "./designation.reducers";
import * as fromEmploymentStatus from "./employee-status.reducers";

import { Branch } from "../../models/branch";
import { JobCategoryModel } from '../../models/job-category-model';
import { SoftLabelConfigurationModel } from '../../models/softLabels-model';
import { RoleModel } from '../../models/role-model';
import { ShiftTimingModel } from '../../models/shift-timing-model';
import { TimeZoneModel } from '../../models/time-zone';
import { EmployeeListModel } from '../../models/employee-model';
import { Currency } from '../../models/currency';
import { DepartmentModel } from '../../models/department-model';
import { DesignationModel } from '../../models/designations-model';
import { EmploymentStatusModel } from '../../models/employment-status-model';

export interface State extends fromRoot.State {
  employeeList: EmployeeListState;
}

export interface EmployeeListState {
  branches: fromBranches.State;
  jobCategory: fromJobCategory.State;
  softLabels: fromsoftLabels.State;
  roles: fromRoles.State;
  shiftTiming: fromShiftTiming.State;
  timeZone: fromTimeZone.State;
  currency: fromCurrency.State;
  snackBar: fromSnackBar.State;
  employee: fromEmployee.State;
  designation: fromDesignation.State;
  department: fromDepartment.State;
  employmentStatus: fromEmploymentStatus.State;
}

export const reducers: ActionReducerMap<EmployeeListState> = {
  branches: fromBranches.reducer,
  jobCategory: fromJobCategory.reducer,
  softLabels: fromsoftLabels.reducer,
  roles: fromRoles.reducer,
  shiftTiming: fromShiftTiming.reducer,
  timeZone: fromTimeZone.reducer,
  currency: fromCurrency.reducer,
  snackBar: fromSnackBar.reducer,
  employee: fromEmployee.reducer,
  department: fromDepartment.reducer,
  designation: fromDesignation.reducer,
  employmentStatus: fromEmploymentStatus.reducer
}

export const getEmployeeListState = createFeatureSelector<
  State,
  EmployeeListState
>("employeeList");


//Branch Selectors
export const getBranchEntitiesState = createSelector(
  getEmployeeListState,
  state => state.branches
);

export const {
  selectIds: getBranchId,
  selectEntities: getBranchEntities,
  selectAll: getBranchAll,
  selectTotal: getBranchTotal
} = fromBranches.branchAdapter.getSelectors(
  getBranchEntitiesState
);

export const getBranchLoading = createSelector(
  getEmployeeListState,
  state => state.branches.loadingBranch
);

export const branchExceptionHandling = createSelector(
  getEmployeeListState,
  state => state.branches.exceptionMessage
);

//Job Category Statuses Selectors
export const getJobCategoryEntitiesState = createSelector(
  getEmployeeListState,
  state => state.jobCategory
);

export const {
  selectIds: getJobCategoryIds,
  selectEntities: getJobCategoryEntities,
  selectAll: getJobCategoryAll,
  selectTotal: getJobCategoryTotal
} = fromJobCategory.jobCategoryAdapter.getSelectors(
  getJobCategoryEntitiesState
);

export const getJobCategoryLoading = createSelector(
  getEmployeeListState,
  state => state.jobCategory.loadingJobCategoryList
);

export const jobCategoryExceptionHandling = createSelector(
  getEmployeeListState,
  state => state.jobCategory.exceptionMessage
);


export const getSoftLabelsEntitiesState = createSelector(
  getEmployeeListState,
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
  getEmployeeListState,
  state => state.softLabels.upsertsoftLabel
);

export const loadingSearchSoftLabels = createSelector(
  getEmployeeListState,
  state => state.softLabels.loadingsoftLabels
);


//Roles Selectors
export const getRolesEntitiesState = createSelector(
  getEmployeeListState,
  state => state.roles
);

export const {
  selectIds: getRolesIds,
  selectEntities: getRolesEntities,
  selectAll: getRolesAll,
  selectTotal: getRolesTotal
} = fromRoles.RolesAdapter.getSelectors(
  getRolesEntitiesState
);

export const getRolesLoading = createSelector(
  getEmployeeListState,
  state => state.roles.loadingRolesList
);

export const RolesExceptionHandling = createSelector(
  getEmployeeListState,
  state => state.roles.exceptionMessage
);

//ShiftTiming Selectors
export const getShiftTimingEntitiesState = createSelector(
  getEmployeeListState,
  state => state.shiftTiming
);

export const {
  selectIds: getShiftTimingIds,
  selectEntities: getShiftTimingEntities,
  selectAll: getShiftTimingAll,
  selectTotal: getShiftTimingTotal
} = fromShiftTiming.ShiftTimingAdapter.getSelectors(
  getShiftTimingEntitiesState
);

export const getShiftTimingLoading = createSelector(
  getEmployeeListState,
  state => state.shiftTiming.loadingShiftTimingList
);

export const ShiftTimingExceptionHandling = createSelector(
  getEmployeeListState,
  state => state.shiftTiming.exceptionMessage
);

//TimeZone Selectors
export const getTimeZoneEntitiesState = createSelector(
  getEmployeeListState,
  state => state.timeZone
);

export const {
  selectIds: getTimeZoneIds,
  selectEntities: getTimeZoneEntities,
  selectAll: getTimeZoneAll,
  selectTotal: getTimeZoneTotal
} = fromTimeZone.TimeZoneAdapter.getSelectors(
  getTimeZoneEntitiesState
);

export const getTimeZoneLoading = createSelector(
  getEmployeeListState,
  state => state.timeZone.loadingTimeZoneList
);

export const TimeZoneExceptionHandling = createSelector(
  getEmployeeListState,
  state => state.timeZone.exceptionMessage
);

//Employee Selectors
export const getEmployeeEntitiesState = createSelector(
  getEmployeeListState,
  state => state.employee
);

export const {
  selectIds: getEmployeeIds,
  selectEntities: getEmployeeEntities,
  selectAll: getEmployeeAll,
  selectTotal: getEmployeeTotal
} = fromEmployee.EmployeeListAdapter.getSelectors(
  getEmployeeEntitiesState
);

export const getEmployeeLoading = createSelector(
  getEmployeeListState,
  state => state.employee.loadingEmployeeList
);

export const createEmployeeListDetailLoading = createSelector(
  getEmployeeListState,
  state => state.employee.creatingEmployeeList
);

export const gettingEmployeeListDetailsIdLoading = createSelector(
  getEmployeeListState,
  state => state.employee.gettingEmployeeListDetailsById
);

export const createEmployeeListDetailsErrors = createSelector(
  getEmployeeListState,
  state => state.employee.createEmployeeListErrors
);

export const getEmployeeListDetailsIdOfUpsertMembershipDetails = createSelector(
  getEmployeeListState,
  state => state.employee.employeeListDetailsById
);

export const getEmployeeListDetailsById = createSelector(
  getEmployeeListState,
  state => state.employee.employeeListDetailsData
);

export const employeeExceptionHandling = createSelector(
  getEmployeeListState,
  state => state.employee.exceptionMessage
);


//Currency Selectors
export const getCurrencyEntitiesState = createSelector(
  getEmployeeListState,
  state => state.currency
);

export const {
  selectIds: getCurrencyId,
  selectEntities: getCurrencyEntities,
  selectAll: getCurrencyAll,
  selectTotal: getCurrencyTotal
} = fromCurrency.currencyAdapter.getSelectors(
  getCurrencyEntitiesState
);

export const getCurrencyLoading = createSelector(
  getEmployeeListState,
  state => state.currency.loadingCurrency
);

export const currencyExceptionHandling = createSelector(
  getEmployeeListState,
  state => state.currency.exceptionMessage
);

//Department Selectors
export const getDepartmentEntitiesState = createSelector(
  getEmployeeListState,
  state => state.department
);

export const {
  selectIds: getDepartmentIds,
  selectEntities: getDepartmentEntities,
  selectAll: getDepartmentAll,
  selectTotal: getDepartmentTotal
} = fromDepartment.DepartmentAdapter.getSelectors(
  getDepartmentEntitiesState
);

export const getDepartmentLoading = createSelector(
  getEmployeeListState,
  state => state.department.loadingDepartmentList
);

export const departmentExceptionHandling = createSelector(
  getEmployeeListState,
  state => state.department.exceptionMessage
);

//Designation Selectors
export const getDesignationEntitiesState = createSelector(
  getEmployeeListState,
  state => state.designation
);

export const {
  selectIds: getDesignationIds,
  selectEntities: getDesignationEntities,
  selectAll: getDesignationAll,
  selectTotal: getDesignationTotal
} = fromDesignation.DesignationAdapter.getSelectors(
  getDesignationEntitiesState
);

export const getDesignationLoading = createSelector(
  getEmployeeListState,
  state => state.designation.loadingDesignationList
);

export const DesignationExceptionHandling = createSelector(
  getEmployeeListState,
  state => state.designation.exceptionMessage
);

//EmploymentStatus Selectors
export const getEmploymentStatusEntitiesState = createSelector(
  getEmployeeListState,
  state => state.employmentStatus
);

export const {
  selectIds: getEmploymentStatusIds,
  selectEntities: getEmploymentStatusEntities,
  selectAll: getEmploymentStatusAll,
  selectTotal: getEmploymentStatusTotal
} = fromEmploymentStatus.EmploymentStatusAdapter.getSelectors(
  getEmploymentStatusEntitiesState
);

export const getEmploymentStatusLoading = createSelector(
  getEmployeeListState,
  state => state.employmentStatus.loadingEmploymentList
);

export const EmploymentStatusExceptionHandling = createSelector(
  getEmployeeListState,
  state => state.employmentStatus.exceptionMessage
);
