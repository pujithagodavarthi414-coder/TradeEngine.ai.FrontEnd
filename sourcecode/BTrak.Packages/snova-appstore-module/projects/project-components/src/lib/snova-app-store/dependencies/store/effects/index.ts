
import * as fromWidgets from './widgets.effects';
import * as fromWorkspaces from './workspaces.effects';
import * as fromDashboards from './dashboard.effects';


export const allWidgetModuleEffects: any = [
  fromWidgets.WidgetEffects,
  fromWorkspaces.WorkspaceEffects,
  fromDashboards.DashboardEffects
  ];