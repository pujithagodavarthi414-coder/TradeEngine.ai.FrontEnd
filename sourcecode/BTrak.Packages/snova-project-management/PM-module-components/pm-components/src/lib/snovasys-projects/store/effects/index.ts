import * as fromGoals from "./goals.effects";
import * as fromUserStories from "./userStories.effects";
import * as fromProjects from "./projects.effects";
import * as fromProjectMembers from "./project-members.effects";
import * as fromProjectTypes from "./project-types.effects";
import * as fromUsers from "./users.effects";
import * as fromSnackbar from "./snackbar.effects";
import * as fromRoles from "./roles.effects";
import * as fromProjectFeatures from "./project-features.effects";
import * as fromBoardTypes from "./boardTypes.effects";
import * as fromConfigurationTypes from "./configurationType.effects";
import * as fromBoardTypesApi from "./board-type-api.effects";
import * as fromWorkflowStatus from "./workflow-status.effects";
import * as fromBugPriorities from "./bug-priority.effects";
import * as fromLogTimeOptions from "./logTimeOptions.effects";
import * as fromUserStoryLogTime from "./userStoryLogTime.effects";
import * as fromGoalStatusEffects from "./goalStatus.effects";
import * as fromUserStoryStatusEffects from "./userStoryStatus.effects";
import * as fromWorkflowStatusTransitionEffects from "./workflow-status-transition.effects";
import * as fromBoardTypeUiEffects from "./board-types-ui.effects";
import * as fromWorkflowEffects from "./workflow-list.effects";
import * as fromUserStoryTypesEffects from "./userstory-types.effects";
import * as fromGoalReplanEffects from "./goal-replan-types.effects";
import * as fromPermissionEffects from "./permissions.effects";
import * as fromUserStorySpentTimeReport from "./userstory-spent-time-report.effects";
import * as fromProjectSummary from "./project-summary.effects";
import * as fromNotificationVlaidator from './notification-validator.effects';
import * as fromConsiderHours from './consider-hours.effects';
import * as fromEntityRoleEffects from './entity-roles.effects';
import * as fromUserstoryHistoryEffects from './userstory-history.effects';
import * as fromProcessDashboardStatusEffects from './process-dashboard-status.effects';
import * as fromGoalReplanHistory from './goal-replan-history.effects';
import * as fromGoalsFilter from './goal-filters.effects';
import * as fromTemplateeffects from './template.effects';
import * as fromWorkItemEffects from "./template-userstories.effects";
import * as fromSprintEffects from "./sprints.effects";
import * as fromSprintWorkItemEffects from "./sprint-userstories.effects";
import * as fromSprintReplanHistoryEffects from "./sprint-replan-history.effects";
import * as fromBugPriorityEffects from "./bug-priority.effects";
import * as fromEmployeeList from './feedTimeSheet.effects';
import * as fromTagsEffects from "./tags.effects"
import * as fromComments from "./comments.effects";
import * as fromCustomFieldHistory from "./custom-field-history.effects";
import * as fromUserStoryLinks from  "./userstory-links.effects"
import * as fromCustomFields from "./custom-fields.effects";
import * as fromTestrunUsers from "./testrunusers.effetcs";
import * as fromAdhocWorkEffects from "./adhoc-work.effects";
import * as fromAdhocUsersEffects from "./adhoc-users.effects";


export const allProjectModuleEffects: any = [
  fromGoals.GoalEffects,
  fromUserStories.UserStoryEffects,
  fromProjects.ProjectEffects,
  fromProjectMembers.ProjectMemberEffects,
  fromProjectTypes.ProjectTypeEffects,
  fromUsers.UserEffects,
  fromSnackbar.SnackbarEffects,
  fromRoles.RoleEffects,
  fromProjectFeatures.ProjectFeatureEffects,
  fromBoardTypes.BoardTypesEffects,
  fromConfigurationTypes.ConfigurationTypesEffects,
  fromBoardTypesApi.BoardTypesApiEffects,
  fromWorkflowStatus.WorkflowStatusEffects,
  fromBugPriorities.BugPriorityTypesEffects,
  fromLogTimeOptions.LogTimeEffects,
  fromUserStoryLogTime.UserStoryLogTimeEffects,
  fromGoalStatusEffects.GoalStatusEffects,
  fromUserStoryStatusEffects.UserStoryStatusEffects,
  fromBoardTypeUiEffects.BoardTypesUiEffects,
  fromWorkflowEffects.WorkflowListEffects,
  fromUserStoryTypesEffects.UserStoryTypesEffects,
  fromGoalReplanEffects.GoalReplanTypesEffects,
  fromPermissionEffects.permissionEffects,
  fromWorkflowStatusTransitionEffects.WorkflowStatusTransitionEffects,
  fromUserStorySpentTimeReport.userStorySpentTimeReportsEffects,
  fromProjectSummary.ProjectSummaryEffects,
  fromNotificationVlaidator.NotificationValidatorEffects,
  fromConsiderHours.ConsiderHoursEffects,
  fromEntityRoleEffects.EntityRoleEffects,
  fromUserstoryHistoryEffects.UserstoryHistoryEffects,
  fromProcessDashboardStatusEffects.ProcessDashboardStatusEffects,
  fromGoalReplanHistory.GoalReplanHistoryEffects,
  fromGoalsFilter.GoalFilterEffects,
  fromTemplateeffects.TemplateEffects,
  fromWorkItemEffects.WorkItemEffects,
  fromSprintEffects.SprintEffects,
  fromSprintWorkItemEffects.SprintWorkItemEffects,
  fromSprintReplanHistoryEffects.SprintReplanHistoryEffects,
  fromBugPriorityEffects.BugPriorityTypesEffects,
  fromEmployeeList.FeedTimeSheetUsersEffects,
  fromTagsEffects.TagsEffects,
  fromComments.CommentsApiEffects,
  fromCustomFieldHistory.CustomFieldHistoryEffects,
  fromUserStoryLinks.UserStoryLinksEffects,
  fromCustomFields.CustomFieldEffects,
  fromTestrunUsers.TestRunUserEffects,
  fromAdhocWorkEffects.AdhocWorkEffects,
  fromAdhocUsersEffects.AdhocUsersEffects

];
