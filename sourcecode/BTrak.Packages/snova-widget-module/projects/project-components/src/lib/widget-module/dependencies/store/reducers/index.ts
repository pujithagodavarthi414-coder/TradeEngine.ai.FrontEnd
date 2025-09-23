import { createSelector, createFeatureSelector, ActionReducerMap, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity/src/models';
import { WidgetList } from '../../models/widgetlist' ;
import { WorkspaceList } from '../../models/workspaceList';
import { DashboardList } from '../../models/dashboardList';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { BugPriorityDropDownData } from '../../models/bugPriorityDropDown';
import { StatusesModel } from '../../models/workFlowStatusesModel';
import { UserStoryTypesModel } from '../../models/userStoryTypesModel';
//import * as fromRoot from '../../../../store/reducers/index';
import * as fromWidgets from './widgetlist.reducers';
import * as fromWorkspaces from './workspacelist.reducers';
import * as fromDashboards from './dashboardlist.reducers';
import * as fromHiddenWorkspaces from './hiddenworkspacelist.reducer';
import * as fromBugPriorities from './bug-priority.reducers';
import * as fromUserStoryTypes from './userStoryTypes.reducers';
import * as fromUserstoryStatus from './userStoryStatus.reducers';
import * as fromRouter from "@ngrx/router-store";
import * as fromNotifications from './notification.reducers';
import * as fromSnackbar from './snackbar.reducers';

export interface fromRouterState {
  router: fromRouter.RouterReducerState;
}

export interface WidgetManagementState {
  widgets: fromWidgets.State;
  workspaces: fromWorkspaces.State;
  hiddenWorkspaces: fromHiddenWorkspaces.State;
  dashboards: fromDashboards.State,
  bugPriorities: fromBugPriorities.State,
  userStoryTypes: fromUserStoryTypes.State,
  userStoryStatus: fromUserstoryStatus.State,
  notifications: fromNotifications.State,
  snackbar: fromSnackbar.State
}

export interface State extends fromRouterState {
  widgetManagement: WidgetManagementState;
}

export const reducers: ActionReducerMap<WidgetManagementState> = {
  widgets: fromWidgets.reducer,
  workspaces: fromWorkspaces.reducer,
  dashboards: fromDashboards.reducer,
  hiddenWorkspaces: fromHiddenWorkspaces.reducer,
  bugPriorities: fromBugPriorities.reducer,
  userStoryTypes: fromUserStoryTypes.reducer,
  userStoryStatus: fromUserstoryStatus.reducer,
  notifications: fromNotifications.reducer,
  snackbar: fromSnackbar.reducer
}

export const getWidgetsManagementState = createFeatureSelector<State, WidgetManagementState>('widgetManagement');

export const getWidgetsListLoading = createSelector(
  getWidgetsManagementState,
  state => state.widgets.loadingWidgetList
);

export const getWidgets = createSelector(
  getWidgetsManagementState,
  state => state.widgets
);

export const getWidgetsReorderLoading = createSelector(
  getWidgetsManagementState,
  state => state.widgets.loadingTagsReorder
);

export const {
  selectIds: getWidgetIds,
  selectEntities: getWidgetEntities,
  selectAll: getWidgetAll,
  selectTotal: getWidgetTotal
} = fromWidgets.widgetAdapter.getSelectors(getWidgets);

export const getWorkspacesListLoading = createSelector(
  getWidgetsManagementState,
  state => state.workspaces.loadingWorkspaceList
);

export const getWorkspacesLoading = createSelector(
  getWidgetsManagementState,
  state => state.workspaces.loadingWorkspace
);

export const getWorkspaces = createSelector(
  getWidgetsManagementState,
  state => state.workspaces
);

export const {
  selectIds: getWorkspaceIds,
  selectEntities: getWorkspaceEntities,
  selectAll: getWorkspaceAll,
  selectTotal: getWorkspaceTotal
} = fromWorkspaces.WorkspaceAdapter.getSelectors(getWorkspaces);

export const getDashboardsListLoading = createSelector(
  getWidgetsManagementState,
  state => state.dashboards.loadingDashboardList
);

export const getDashboards = createSelector(
  getWidgetsManagementState,
  state => state.dashboards
);

export const {
  selectIds: getDashboardsIds,
  selectEntities: getDashboardsEntities,
  selectAll: getDashboardAll,
  selectTotal: getDashboardTotal
} = fromDashboards.DashboardAdapter.getSelectors(getDashboards);

export const getHiddenWorkspacesListLoading = createSelector(
  getWidgetsManagementState,
  state => state.hiddenWorkspaces.loadingHiddenWorkspaceList
);

export const getHiddenWorkspaces = createSelector(
  getWidgetsManagementState,
  state => state.hiddenWorkspaces
);

export const {
  selectIds: getHiddenWorkspaceIds,
  selectEntities: getHiddenWorkspaceEntities,
  selectAll: getHiddenWorkspaceAll,
  selectTotal: getHiddenWorkspaceTotal
} = fromHiddenWorkspaces.HiddenWorkspaceAdapter.getSelectors(getHiddenWorkspaces);

//BugPriority Selectors
export const getBugPrioritiesEntitiesState = createSelector(
  getWidgetsManagementState,
  state => state.bugPriorities
 );
 
 export const {
  selectIds: getbugPriorityIds,
  selectEntities: getBugPriorityEntities,
  selectAll: getBugPriorityAll,
  selectTotal: getBugPriorityTotal
 }= fromBugPriorities.bugPriorityAdapter.getSelectors(
  getBugPrioritiesEntitiesState
 );
 
 export const getBugPrioritiesLoading = createSelector(
  getWidgetsManagementState,
  state => state.bugPriorities.loadingBugPriority
 );

 // UserStoryStatus Status Selectors

export const getUserStoryStatusEntitiesState = createSelector(
  getWidgetsManagementState,
  (state) => state.userStoryStatus
 );
 
 export const {
  selectIds: getUserStoryStatusIds,
  selectEntities: getUserStoryStatusEntities,
  selectAll: getUserStoryStatusAll,
  selectTotal: getUserStoryStatusTotal
 }= fromUserstoryStatus.userStoryStatusAdapter.getSelectors(
  getUserStoryStatusEntitiesState
 );
 
 export const getUserStoryStatusloading = createSelector(
  getWidgetsManagementState,
  (state) => state.userStoryStatus.loadingUserStoryStatus
 );

 //user story types Selectors

export const getUserStoryTypesEntitiesState = createSelector(
  getWidgetsManagementState,
  (state) => state.userStoryTypes
 );
 
 export const {
  selectIds: getUserStoryTypesIds,
  selectEntities: getUserStoryTypesEntities,
  selectAll: getUserStoryTypesAll,
  selectTotal: getUserStoryTypesTotal
 }= fromUserStoryTypes.userStoryTypesAdapter.getSelectors(
  getUserStoryTypesEntitiesState
 );
 
 export const getUserStoryTypesLoading = createSelector(
  getWidgetsManagementState,
  (state) => state.userStoryTypes.loadingUserStoryTypes
 );


 export const getHiddenDashboards = createSelector(
  getWidgetsManagementState,
  state => state.hiddenWorkspaces
);

export const {
  selectIds: getHiddenDashboardsIds,
  selectEntities: getHiddenDashboardsEntities,
  selectAll: getHiddenDashboardAll,
  selectTotal: getHiddenDashboardTotal
} = fromHiddenWorkspaces.HiddenWorkspaceAdapter.getSelectors(getHiddenDashboards);

export const getHiddenListLoading = createSelector(
  getWidgetsManagementState,
  state => state.hiddenWorkspaces.loadingHiddenWorkspaceList
);
