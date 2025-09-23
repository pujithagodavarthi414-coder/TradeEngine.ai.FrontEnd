import { createSelector, createFeatureSelector, ActionReducerMap, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity/src/models';
import { WidgetList } from '../../models/widgetlist' ;
import { WorkspaceList } from '../../models/workspaceList';
import { DashboardList } from '../../models/dashboardList';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
//import * as fromRoot from '../../../../store/reducers/index';
import * as fromWidgets from './widgetlist.reducers';
import * as fromWorkspaces from './workspacelist.reducers';
import * as fromDashboards from './dashboardlist.reducers';
import * as fromRouter from "@ngrx/router-store";


export interface fromRouterState {
  router: fromRouter.RouterReducerState;
}

export interface WidgetManagementState {
  widgets: fromWidgets.State;
  workspaces: fromWorkspaces.State;
  dashboards: fromDashboards.State;
}

export interface State extends fromRouterState {
  widgetManagement: WidgetManagementState;
}

export const reducers: ActionReducerMap<WidgetManagementState> = {
  widgets: fromWidgets.reducer,
  workspaces: fromWorkspaces.reducer,
  dashboards: fromDashboards.reducer
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





