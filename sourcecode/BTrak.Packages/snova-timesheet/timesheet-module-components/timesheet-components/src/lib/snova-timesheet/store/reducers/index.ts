import { createSelector, createFeatureSelector, ActionReducerMap, MemoizedSelector } from "@ngrx/store";
import { MemoizedSelectorWithProps } from '@ngrx/store/src/selector';
import { Dictionary } from '@ngrx/entity';

import * as fromEmployeeList from "./feedTimeSheet.reducers";
import * as fromPermissionHistory from "./permission-history.reducers";
import * as fromNotificationValidator from "./notification-validator.reducers";

import * as fromRoot from "../../../../store/reducers/index";

import { UserModel } from '../../models/user';

export interface State extends fromRoot.State {
    timeSheetManagement: TimeSheetManagementState;
}

export interface TimeSheetManagementState {
    employees: fromEmployeeList.State;
    permissionHistory: fromPermissionHistory.State;
    validationsState: fromNotificationValidator.State;
}

export const reducers: ActionReducerMap<TimeSheetManagementState> = {
    employees: fromEmployeeList.reducer,
    permissionHistory: fromPermissionHistory.reducer,
    validationsState: fromNotificationValidator.reducer
}

export const getTimeSheetManagementState = createFeatureSelector<State, TimeSheetManagementState>("timeSheetManagement");

export const getEmployeeEntitiesState = createSelector(
    getTimeSheetManagementState,
    state => state.employees
);

export const {
    selectIds: getEmployeeId,
    selectEntities: getEmployeeEntities,
    selectAll: getEmployeeAll,
    selectTotal: getEmployeeTotal
} = fromEmployeeList.feedTimeSheetAdapter.getSelectors(
    getEmployeeEntitiesState
);

export const getEmployeeLoading = createSelector(
    getTimeSheetManagementState,
    state => state.employees.loadingFeedTimeSheetUsers
);

export const getPermissionHistoryUsers = createSelector(
    getTimeSheetManagementState,
    state => state.permissionHistory
);

export const {
    selectIds: getUserId,
    selectEntities: getUserEntities,
    selectAll: getUserAll,
    selectTotal: getUserTotal
} = fromPermissionHistory.permissionHistoryAdapter.getSelectors(
    getPermissionHistoryUsers
);

export const getPermissionHistoryLoading = createSelector(
    getTimeSheetManagementState,
    state => state.permissionHistory.loadingPermissionHistoryUsers
);