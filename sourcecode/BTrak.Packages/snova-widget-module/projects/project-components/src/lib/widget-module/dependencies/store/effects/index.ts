
import * as fromWidgets from './widgets.effects';
import * as fromWorkspaces from './workspaces.effects';
import * as fromDashboards from './dashboard.effects';
import * as fromBugPriority from './bug-priority.effects';
import * as fromUserStoryTypes from './user-story-types.effects';
import * as fromUserStoryStatus from './userStoryStatus.effects';
import * as fromNotifications from './notification.effects';
import * as fromSnackbar from './snackbar.effects';

export const allWidgetModuleEffects: any = [
  fromWidgets.WidgetEffects,
  fromWorkspaces.WorkspaceEffects,
  fromDashboards.DashboardEffects,
  fromBugPriority.BugPriorityTypesEffects,
  fromUserStoryTypes.UserStoryTypesEffects,
  fromUserStoryStatus.UserStoryStatusEffects,
  fromNotifications.NotificationValidatorEffects,
  fromSnackbar.SnackbarEffects
  ];