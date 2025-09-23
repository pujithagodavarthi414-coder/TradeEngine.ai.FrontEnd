import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from "@ngrx/store";
// tslint:disable-next-line: ordered-imports
import * as _ from "underscore";
import * as fromRoot from "../../main-store/reducers/index";
// tslint:disable-next-line: ordered-imports
import * as fromEmployeeList from "../../timesheet-store/reducers/feedTimeSheet.reducers";
import { GoalModel } from "../../models/GoalModel";
import { WorkflowStatus } from "../../models/workflowStatus";
// tslint:disable-next-line: ordered-imports
import * as fromBoardTypesApi from "./board-types-api.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromBoardTypesUi from "./board-types-ui.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromBoardTypes from "./boardTypes.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromBugPriorities from "./bug-priority.reducers";
import * as fromConfigurationTypes from "./configurationTypes.reducers";
// tslint:disable-next-line: import-spacing
import * as fromConsiderHours from "./consider-hours.reducers";
import * as fromEntityRoles from "./entity-roles.reducers";
import * as fromGoalFilters from "./goal-filters.reducers";
import * as fromGoalReplanHistory from "./goal-replan-history.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromGoalReplanTypes from "./goal-replan-types.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromGoals from "./goals.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromgoalStatus from "./goalStatus.reducers";
import * as fromLogTimeOptions from "./logTime.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromNotificationValidator from "./notification-validator.reducers";
import * as fromConfigurationsettings from "./permissions.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromProcessDashboardStatus from "./process-dashboard-status.reducers";
// tslint:disable-next-line: ordered-imports
// tslint:disable-next-line: ordered-imports
import * as fromProjectFeatures from "./project-features.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromProjectMembers from "./project-members.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromProjectSummary from "./project-summary.reducers";
import * as fromProjectTypes from "./project-types.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromProjects from "./projects.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromRoles from "./roles.reducers";
import * as fromSearch from "./search.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromSnackbar from "./snackbar.reducers";
import * as fromUsersList from "./users-list.reducers";
import * as fromUsers from "./users.reducers";
import * as fromUserStories from "./userstories.reducers";
import * as fromUserstoryHistory from "./userstory-history.reducers";
import * as fromSpentTimeReport from "./userstory-spent-time-report.reducers";
import * as fromUserStoryLogTime from "./userStoryLogTime.reducers";
import * as fromUserstoryStatus from "./userStoryStatus.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromUserStoryTypes from "./userStoryTypes.reducers";
// tslint:disable-next-line: ordered-imports
import * as fromWorkflowList from "./workflow-list.reducers";
import * as fromworkflowStatusTransition from "./workflow-status-transitions.reducers";
import * as fromWorkflowStatus from "./workflow-status.reducers";
import * as fromTemplates from "./templates.reducers";
import * as fromWorkItems from "./template-userstories.reducers";
import * as fromSprints from "./sprints.reducers";
import * as fromSprintWorkItems from "./sprint-userstories.reducers";
import * as fromSprintReplanHistory from "./sprint-replan-history.reducers";

// tslint:disable-next-line: interface-name
export interface ProjectManagementState {
  search: fromSearch.State;
  goals: fromGoals.State;
  userStories: fromUserStories.State;
  projects: fromProjects.State;
  projectMembers: fromProjectMembers.State;
  projectFeatures: fromProjectFeatures.State;
  projectTypes: fromProjectTypes.State;
  users: fromUsers.State;
  snackbarState: fromSnackbar.State;
  roles: fromRoles.State;
  boardTypes: fromBoardTypes.State;
  configurationTypes: fromConfigurationTypes.State;
  boardTypesApi: fromBoardTypesApi.State;
  WorkflowStatus: fromWorkflowStatus.State;
  bugPriorities: fromBugPriorities.State;
  logTimeOptions: fromLogTimeOptions.State;
  userStoryLogTime: fromUserStoryLogTime.State;
  goalStatus: fromgoalStatus.State;
  boardTypesUi: fromBoardTypesUi.State;
  workflowStatusTransition: fromworkflowStatusTransition.State;
  userStoryStatus: fromUserstoryStatus.State;
  workflowList: fromWorkflowList.State;
  userStoryTypes: fromUserStoryTypes.State;
  goalReplanTypes: fromGoalReplanTypes.State;
  ConfigurationSettingModel: fromConfigurationsettings.State;
  spentTimeReport: fromSpentTimeReport.State;
  projectSummary: fromProjectSummary.State;
  validationsState: fromNotificationValidator.State;
  considerHours: fromConsiderHours.State;
  entityRoles: fromEntityRoles.State;
  userstoryHistory: fromUserstoryHistory.State;
  processDashboardStatus: fromProcessDashboardStatus.State;
  usersList: fromUsersList.State,
  employeeList: fromEmployeeList.State,
  goalReplanHistory: fromGoalReplanHistory.State,
  goalFilters: fromGoalFilters.State,
  templates: fromTemplates.State,
  workItems: fromWorkItems.State,
  sprints: fromSprints.State,
  sprintWorkItems: fromSprintWorkItems.State,
  sprintReplanHistory: fromSprintReplanHistory.State
}

// tslint:disable-next-line: interface-name
export interface State extends fromRoot.State {
  projectManagement: ProjectManagementState;
}

export const reducers: ActionReducerMap<ProjectManagementState> = {
  search: fromSearch.reducer,
  goals: fromGoals.reducer,
  userStories: fromUserStories.reducer,
  projects: fromProjects.reducer,
  projectMembers: fromProjectMembers.reducer,
  projectFeatures: fromProjectFeatures.reducer,
  projectTypes: fromProjectTypes.reducer,
  users: fromUsers.reducer,
  snackbarState: fromSnackbar.reducer,
  roles: fromRoles.reducer,
  boardTypes: fromBoardTypes.reducer,
  configurationTypes: fromConfigurationTypes.reducer,
  boardTypesApi: fromBoardTypesApi.reducer,
  WorkflowStatus: fromWorkflowStatus.reducer,
  bugPriorities: fromBugPriorities.reducer,
  logTimeOptions: fromLogTimeOptions.reducer,
  userStoryLogTime: fromUserStoryLogTime.reducer,
  goalStatus: fromgoalStatus.reducer,
  userStoryStatus: fromUserstoryStatus.reducer,
  boardTypesUi: fromBoardTypesUi.reducer,
  workflowStatusTransition: fromworkflowStatusTransition.reducer,
  workflowList: fromWorkflowList.reducer,
  userStoryTypes: fromUserStoryTypes.reducer,
  goalReplanTypes: fromGoalReplanTypes.reducer,
  ConfigurationSettingModel: fromConfigurationsettings.reducer,
  spentTimeReport: fromSpentTimeReport.reducer,
  projectSummary: fromProjectSummary.reducer,
  validationsState: fromNotificationValidator.reducer,
  considerHours: fromConsiderHours.reducer,
  entityRoles: fromEntityRoles.reducer,
  userstoryHistory: fromUserstoryHistory.reducer,
  processDashboardStatus: fromProcessDashboardStatus.reducer,
  usersList: fromUsersList.reducer,
  employeeList: fromEmployeeList.reducer,
  goalReplanHistory: fromGoalReplanHistory.reducer,
  goalFilters: fromGoalFilters.reducer,
  templates: fromTemplates.reducer,
  workItems: fromWorkItems.reducer,
  sprints: fromSprints.reducer,
  sprintWorkItems: fromSprintWorkItems.reducer,
  sprintReplanHistory: fromSprintReplanHistory.reducer
};

export const getProjectManagementState = createFeatureSelector<
  State,
  ProjectManagementState
>("projectManagement");

export const getGoalEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.goals
);

export const getUserStoryEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.userStories
);

export const getSelectedGoalId = createSelector(
  getGoalEntitiesState,
  fromGoals.getSelectedId
);

export const getSelectedUserStoryId = createSelector(
  getUserStoryEntitiesState,
  fromUserStories.getSelectedId
);

export const {
  selectIds: getGoalIds,
  selectEntities: getGoalEntities,
  selectAll: getAllGoals,
  selectTotal: getTotalGoals
} = fromGoals.adapter.getSelectors(getGoalEntitiesState);

export const getSelectedGoal = createSelector(
  getGoalEntities,
  getSelectedGoalId,
  (entities, selectedId) => {
    return selectedId && entities[selectedId];
  }
);

export const getGoalSearchState = createSelector(
  getProjectManagementState,
  (state: ProjectManagementState) => state.search
);

export const getGoalSearchQuery = createSelector(
  getGoalSearchState,
  fromSearch.getQuery
);
export const getGoalSearchLoading = createSelector(
  getGoalSearchState,
  fromSearch.getLoading
);
export const getGoalSearchError = createSelector(
  getGoalSearchState,
  fromSearch.getError
);

export const createGoalLoading = createSelector(
  getProjectManagementState,
  (state) => state.goals.creatingGoal
);

export const archiveGoalLoading = createSelector(
  getProjectManagementState,
  (state) => state.goals.archivingGoal
);

export const parkGoalLoading = createSelector(
  getProjectManagementState,
  (state) => state.goals.parkingGoal
);

export const createGoalErrors = createSelector(
  getProjectManagementState,
  (state) => state.goals.createGoalErrors
);

export const exceptionHandlingForGoals = createSelector(
  getProjectManagementState,
  (state) => state.userStories.exceptionMessage
);

export const getUpdatedGoal = createSelector(
  getProjectManagementState,
  (state) => state.goals.goal
);

export const getUniqueGoalByIdLoading = createSelector(
  getProjectManagementState,
  (state) => state.goals.getUniqueGoalByIdLoading
);

export const getGoalUniqueDescriptionLoading = createSelector(
  getProjectManagementState,
  (state) => state.goals.creatingUniqueGoal
);

export const searchCustomApplicationTags = createSelector(
  getProjectManagementState,
  (state) => state.goals.customTagsModel
);

export const searchCustomApplicationTagsLoading = createSelector(
  getProjectManagementState,
  (state) => state.goals.loadingSearchTags
);

export const {
  selectIds: getUserStoryIds,
  selectEntities: getUserStoryEntities,
  selectAll: getAllUserStories,
  selectTotal: getTotalUserStories
} = fromUserStories.adapter.getSelectors(getUserStoryEntitiesState);

export const getSelectedUserStory = createSelector(
  getUserStoryEntities,
  getSelectedUserStoryId,
  (entities, selectedId) => {
    return selectedId && entities[selectedId];
  }
);

export const getUserStorySearchState = createSelector(
  getProjectManagementState,
  (state: ProjectManagementState) => state.userStories
);

export const userStoriesLoading = createSelector(
  getProjectManagementState,
  (state) => state.userStories.loadingUserStories
);

export const reOrderUserStoriesLoading = createSelector(
  getProjectManagementState,
  (state) => state.userStories.reOrderUserStoriesLoading
);

export const archiveUserStoriesLoading = createSelector(
  getProjectManagementState,
  (state) => state.userStories.archiveUserStoriesLoading
);

export const createMultipleUserStoriesLoading = createSelector(
  getProjectManagementState,
  (state) => state.userStories.creatingMultipleUserStories
);

export const getUserStorySearchIds = createSelector(
  getUserStorySearchState,
  fromUserStories.getIds
);

export const createuserStoryErrors = createSelector(
  getProjectManagementState,
  (state) => state.userStories.createUserStoryErrors
);

export const exceptionHandlingForUserStories = createSelector(
  getProjectManagementState,
  (state) => state.userStories.exceptionMessage
);

export const getUserStorySearchError = createSelector(
  getProjectManagementState,
  (state) => state.userStories.error
);

export const getUserStoryById = createSelector(
  getProjectManagementState,
  (state) => state.userStories.userStory
);

export const anyOperationInProgress = createSelector(
  getProjectManagementState,
  (state) =>
    state.userStories.creatingUserStory || state.userStories.loadingUserStories || state.userStories.amendDeadlineLoading
);

export const getGoalSearchGoalIds = createSelector(
  getGoalSearchState,
  fromSearch.getIds
);

export const goalsLoadingInProgress = createSelector(
  getProjectManagementState,
  (state) => state.goals.loadingGoals
);

export const goalTagsLoading = createSelector(
  getProjectManagementState,
  (state) => state.goals.loadingGoalTags
);

export const getUserStorySearchResults = createSelector(
  getUserStoryEntities,
  getUserStorySearchIds,
  (userStories, searchIds) => {
    return searchIds.map((id) => userStories[id]);
  }
);

export const getGoalSearchResults = createSelector(
  getGoalEntities,
  getGoalSearchGoalIds,
  (goals, searchIds) => {
    return searchIds.map((id) => goals[id]);
  }
);

export const getGoalsEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.goals
);

export const {
  selectIds: getgoalIds,
  selectEntities: getgoalEntities,
  selectAll: getgoalsAll,
  selectTotal: getgoalsTotal
} = fromGoals.adapter.getSelectors(getGoalsEntitiesState);

export const getGoalDetailsByGoalId = createSelector(
  getProjectManagementState,
  (state, props) => {
    // tslint:disable-next-line: only-arrow-functions
    // tslint:disable-next-line: prefer-const
    // tslint:disable-next-line: only-arrow-functions
    const filteredgoalDetails = _.filter(state.goals.entities, function (goals: GoalModel) {
      return goals.goalId.toUpperCase() === props.goalId.toUpperCase()
    });
    return filteredgoalDetails;
  }
);

// Projects Selectors
export const getProjectEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.projects
);

export const getSelectedProjectId = createSelector(
  getProjectEntitiesState,
  fromProjects.getSelectedId
);

export const getSelectedGoalOnProjectModule = createSelector(
  getProjectManagementState,
  (state) => state.projects.selectedGoal
);

export const {
  selectIds: getProjectsIds,
  selectEntities: getProjectsEntities,
  selectAll: getProjectsAll,
  selectTotal: getProjectsTotal
} = fromProjects.projectAdapter.getSelectors(getProjectEntitiesState);

export const getSelectedProject = createSelector(
  getProjectsEntities,
  getSelectedProjectId,
  (entities, selectedId) => {
    return selectedId && entities[selectedId];
  }
);

export const getProjectsLoading = createSelector(
  getProjectManagementState,
  (state) => state.projects.loadingProjects
);

export const createProjectLoading = createSelector(
  getProjectManagementState,
  (state) => state.projects.creatingProject
);

export const createProjectErrors = createSelector(
  getProjectManagementState,
  (state) => state.projects.createProjectErrors
);

export const exceptionHandling = createSelector(
  getProjectManagementState,
  (state) => state.projects.exceptionMessage
);

export const EditProjectById = createSelector(
  getProjectManagementState,
  (state) => state.projects.Project
);

// Project Members Selectors
export const getProjectMembersEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.projectMembers
);

export const {
  selectIds: getProjectMembersIds,
  selectEntities: getProjectMembersEntities,
  selectAll: getProjectMembersAll,
  selectTotal: getProjectMembersTotal
} = fromProjectMembers.projectAdapter.getSelectors(
  getProjectMembersEntitiesState
);

export const getProjectMembersLoading = createSelector(
  getProjectManagementState,
  (state) => state.projectMembers.loadingProjectMembers
);

export const CreateProjectMembersLoading = createSelector(
  getProjectManagementState,
  (state) => state.projectMembers.creatingProjectMember
);

export const createProjectMembersErrors = createSelector(
  getProjectManagementState,
  (state) => state.projectMembers.creatingProjectMemberErrors
);

export const exceptionHandlingForProjectMembers = createSelector(
  getProjectManagementState,
  (state) => state.projectMembers.exceptionMessage
);

// Project Features Selectors
export const getProjectFeaturesEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.projectFeatures
);

export const {
  selectIds: getProjectFeaturesIds,
  selectEntities: getProjectFeaturesEntities,
  selectAll: getProjectFeaturesAll,
  selectTotal: getProjectFeaturesTotal
} = fromProjectFeatures.projectAdapter.getSelectors(
  getProjectFeaturesEntitiesState
);

export const getProjectFeaturesLoading = createSelector(
  getProjectManagementState,
  (state) => state.projectFeatures.loadingProjectFeatures
);

export const CreateProjectFeaturesLoading = createSelector(
  getProjectManagementState,
  (state) => state.projectFeatures.creatingProjectFeature
);

export const createprojectFeatureErrors = createSelector(
  getProjectManagementState,
  (state) => state.projectFeatures.creatingProjectFeatureErrors
);

export const exceptionHandlingForProjectFeatures = createSelector(
  getProjectManagementState,
  (state) => state.projectFeatures.exceptionMessage
);

// Project Types Selectors
export const getProjectTypesEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.projectTypes
);

export const {
  selectIds: getProjectTypesIds,
  selectEntities: getProjectTypesEntities,
  selectAll: getProjectTypesAll,
  selectTotal: getProjectTypesTotal
} = fromProjectTypes.projectTypeAdapter.getSelectors(
  getProjectTypesEntitiesState
);

export const getProjectTypesLoading = createSelector(
  getProjectManagementState,
  (state) => state.projectTypes.loadingProjectTypes
);

export const exceptionHandlingForProjectTypes = createSelector(
  getProjectManagementState,
  (state) => state.projectTypes.exceptionMessage
);

// Users Selectors
export const getUsersEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.users
);

export const {
  selectIds: getUsersIds,
  selectEntities: getUsersEntities,
  selectAll: getUsersAll,
  selectTotal: getUsersTotal
} = fromUsers.userAdapter.getSelectors(getUsersEntitiesState);

export const getUsersLoading = createSelector(
  getProjectManagementState,
  (state) => state.users.loadingUsers
);

export const getLoggedUser = createSelector(
  getProjectManagementState,
  (state) => state.users.User
);

export const getlogg = createSelector(
  getProjectManagementState,
  (state) => state.users.User
);

export const exceptionHandlingForUsers = createSelector(
  getProjectManagementState,
  (state) => state.users.exceptionMessage
);

// BoardTypes Selectors
export const getBoardTypesEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.boardTypes
);

export const {
  selectIds: getboardTypeIds,
  selectEntities: getBoardTypeEntities,
  selectAll: getBoardTypesAll,
  selectTotal: getBoardTypesTotal
} = fromBoardTypes.boardTypeAdapter.getSelectors(getBoardTypesEntitiesState);

export const getBoardTypesLoading = createSelector(
  getProjectManagementState,
  (state) => state.boardTypes.loadingBoardTypes
);

// BoardTypesApi Selectors
export const getBoardTypesApiEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.boardTypesApi
);

export const {
  selectIds: getboardTypeApiIds,
  selectEntities: getBoardTypeApiEntities,
  selectAll: getBoardTypesApiAll,
  selectTotal: getBoardTypesApiTotal
} = fromBoardTypesApi.boardTypeApiAdapter.getSelectors(
  getBoardTypesApiEntitiesState
);

export const getBoardTypesApiLoading = createSelector(
  getProjectManagementState,
  (state) => state.boardTypesApi.loadingBoardTypesApi
);

// Configuration Types Selectors
export const getConfigurationTypesEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.configurationTypes
);

export const {
  selectIds: getConfigurationTypeIds,
  selectEntities: getConfigurationTypeEntities,
  selectAll: getConfigurationTypesAll,
  selectTotal: getConfigurationTypesTotal
} = fromConfigurationTypes.configurationTypeAdapter.getSelectors(
  getConfigurationTypesEntitiesState
);

export const getConfigurationTypesLoading = createSelector(
  getProjectManagementState,
  (state) => state.configurationTypes.loadingConfigurationTypes
);

// Roles Selectors
export const getRolesEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.roles
);

export const {
  selectIds: getRolesIds,
  selectEntities: getRolesEntities,
  selectAll: getRolesAll,
  selectTotal: getRolesTotal
} = fromRoles.roleAdapter.getSelectors(getRolesEntitiesState);

export const getRolesLoading = createSelector(
  getProjectManagementState,
  (state) => state.roles.loadingRoles
);

// Entity Roles Selectors
export const getEntityRolesEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.entityRoles
);

export const {
  selectIds: getEntityRolesIds,
  selectEntities: getEntityRolesEntities,
  selectAll: getEntityRolesAll,
  selectTotal: getEntityRolesTotal
} = fromEntityRoles.entityRoleAdapter.getSelectors(getEntityRolesEntitiesState);

export const getEntityRolesLoading = createSelector(
  getProjectManagementState,
  (state) => state.entityRoles.loadingEntityRoles
);

// WorkflowStatus Selectors

export const getWorkflowStatusEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.WorkflowStatus
);

export const {
  selectIds: getworkflowStatusIds,
  selectEntities: getworkflowStatusEntities,
  selectAll: getworkflowStatusAll,
  selectTotal: getworkflowStatusTotal
} = fromWorkflowStatus.workflowStatusAdapter.getSelectors(
  getWorkflowStatusEntitiesState
);

export const getworkflowStatusLoading = createSelector(
  getProjectManagementState,
  (state) => state.WorkflowStatus.loadingWorkflowstatus
);

export const getworkflowStatusAllByWorkflowId = createSelector(
  getProjectManagementState,
  (state, props) => {
    if (props.workflowId) {
      const filteredWorkflowStatuses = _.filter(state.WorkflowStatus.entities, function (workflowStatus: WorkflowStatus) {
        return workflowStatus.workFlowId.toUpperCase() === props.workflowId.toUpperCase()
      });
      return filteredWorkflowStatuses;
    }
    // tslint:disable-next-line: only-arrow-functions
  }
);

// WorkflowStatusTransition Selectors

export const getWorkflowStatusTransitionEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.workflowStatusTransition
);

export const {
  selectIds: getworkflowStatusTransitionIds,
  selectEntities: getworkflowStatusTransitionEntities,
  selectAll: getworkflowStatusTransitionAll,
  selectTotal: getworkflowStatusTransitionTotal
} = fromworkflowStatusTransition.workflowStatusTransitionAdapter.getSelectors(
  getWorkflowStatusTransitionEntitiesState
);

export const getworkflowStatusTransitionLoading = createSelector(
  getProjectManagementState,
  (state) => state.workflowStatusTransition.loadingWorkflowstatusTransition
);

// Goal Status Selectors

export const getgoalStatusEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.goalStatus
);

export const {
  selectIds: getgoalStatusIds,
  selectEntities: getgoalStatusEntities,
  selectAll: getgoalStatusAll,
  selectTotal: getgoalStatusTotal
} = fromgoalStatus.goalStatusAdapter.getSelectors(getgoalStatusEntitiesState);

export const getgoalStatusloading = createSelector(
  getProjectManagementState,
  (state) => state.goalStatus.loadinggoalStatus
);

// UserStoryStatus Status Selectors

export const getUserStoryStatusEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.userStoryStatus
);

export const {
  selectIds: getUserStoryStatusIds,
  selectEntities: getUserStoryStatusEntities,
  selectAll: getUserStoryStatusAll,
  selectTotal: getUserStoryStatusTotal
} = fromUserstoryStatus.userStoryStatusAdapter.getSelectors(
  getUserStoryStatusEntitiesState
);

export const getUserStoryStatusloading = createSelector(
  getProjectManagementState,
  (state) => state.userStoryStatus.loadingUserStoryStatus
);

// board type ui

export const getBoardTypeUiEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.boardTypesUi
);

export const {
  selectIds: getBoardTypeUiIds,
  selectEntities: getBoardTypeUiEntities,
  selectAll: getBoardTypeUiAll,
  selectTotal: getBoardTypeUiTotal
} = fromBoardTypesUi.boardTypeUiAdapter.getSelectors(
  getBoardTypeUiEntitiesState
);

export const getBoardTypeUiLoading = createSelector(
  getProjectManagementState,
  (state) => state.boardTypesUi.loadingBoardTypesUi
);

// workflow list reducer

export const getWorkflowEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.workflowList
);

export const {
  selectIds: getWorkflowListIds,
  selectEntities: getWorkflowListEntities,
  selectAll: getWorkflowListAll,
  selectTotal: getWorkflowListTotal
} = fromWorkflowList.workflowAdapter.getSelectors(getWorkflowEntitiesState);

export const getWorkflowListLoading = createSelector(
  getProjectManagementState,
  (state) => state.workflowList.loadingWorkflow
);

// user story types Selectors

export const getUserStoryTypesEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.userStoryTypes
);

export const {
  selectIds: getUserStoryTypesIds,
  selectEntities: getUserStoryTypesEntities,
  selectAll: getUserStoryTypesAll,
  selectTotal: getUserStoryTypesTotal
} = fromUserStoryTypes.userStoryTypesAdapter.getSelectors(
  getUserStoryTypesEntitiesState
);

export const getUserStoryTypesLoading = createSelector(
  getProjectManagementState,
  (state) => state.userStoryTypes.loadingUserStoryTypes
);

// Goal Replan Selectors

export const getGoalReplanTypesEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.goalReplanTypes
);

export const {
  selectIds: getGoalReplanTypesIds,
  selectEntities: getGoalReplanTypesEntities,
  selectAll: getGoalReplanTypesAll,
  selectTotal: getGoalReplanTypesTotal
} = fromGoalReplanTypes.goalReplanTypesAdapter.getSelectors(
  getGoalReplanTypesEntitiesState
);

export const getGoalReplanTypesLoading = createSelector(
  getProjectManagementState,
  (state) => state.goalReplanTypes.loadingGoalReplanTypes
);

export const getInsertGoalReplanLoading = createSelector(
  getProjectManagementState,
  (state) => state.goalReplanTypes.goalReplanStart
);

export const getUserStorySpentTimeReportEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.spentTimeReport
);

export const {
  selectIds: getUserStorySpentTimeReportIds,
  selectEntities: getUserStorySpentTimeReportEntities,
  selectAll: getUserStorySpentTimeReportAll,
  selectTotal: getUserStorySpentTimeReportTotal
} = fromSpentTimeReport.SpentTimeReportAdapter.getSelectors(
  getUserStorySpentTimeReportEntitiesState
);

export const getUserStorySpentTimeReportLoading = createSelector(
  getProjectManagementState,
  (state) => state.spentTimeReport.loadingSpentTimeReport
);

export const getSpentTimeReportException = createSelector(
  getProjectManagementState,
  (state) => state.spentTimeReport.exceptionMessage
);

// Project Summary

export const getCurrentActiveGoalsCount = createSelector(
  getProjectManagementState,
  (state) => state.projectSummary.activeGoalsCount
);

export const getBackLogGoalsCount = createSelector(
  getProjectManagementState,
  (state) => state.projectSummary.backLogGoalsCount
);

export const getUnderReplanGoalsCount = createSelector(
  getProjectManagementState,
  (state) => state.projectSummary.underReplanGoalsCount
);

export const getArchivedGoalsCount = createSelector(
  getProjectManagementState,
  (state) => state.projectSummary.archivedGoalsCount
);

export const getProjectMemberCount = createSelector(
  getProjectManagementState,
  (state) => state.projectSummary.projectMemberCount
);

export const getProjectFeatureCount = createSelector(
  getProjectManagementState,
  (state) => state.projectSummary.projectFeatureCount
);

export const getParkedGoalsCount = createSelector(
  getProjectManagementState,
  (state) => state.projectSummary.parkedGoalsCount
);

export const activeSprintsCount = createSelector(
  getProjectManagementState,
  (state) => state.projectSummary.activeSprintsCount
);

export const replanSprintsCount = createSelector(
  getProjectManagementState,
  (state) => state.projectSummary.replanSprintsCount
);

export const getProjectViewStatusLoading = createSelector(
  getProjectManagementState,
  (state) => state.projectSummary.loading
);

// ConsiderHours Selectors
export const getConsiderHoursEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.considerHours
);

export const {
  selectIds: getConsiderHoursIds,
  selectEntities: getConsiderHoursEntities,
  selectAll: getConsiderHoursAll,
  selectTotal: getConsiderHoursTotal
} = fromConsiderHours.considerHourAdapter.getSelectors(
  getConsiderHoursEntitiesState
);

export const getConsiderHoursLoading = createSelector(
  getProjectManagementState,
  (state) => state.considerHours.loadingConsiderHours
);

export const getProcessDashboardStatusEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.processDashboardStatus
);

export const {
  selectIds: getProcessDashboardStatusIds,
  selectEntities: getProcessDashboardStatusEntities,
  selectAll: getProcessDashboardStatusAll,
  selectTotal: getProcessDashboardStatusTotal
} = fromProcessDashboardStatus.processDashboardStatusAdapter.getSelectors(
  getProcessDashboardStatusEntitiesState
);

export const getProcessDashboardStatusLoading = createSelector(
  getProjectManagementState,
  (state) => state.processDashboardStatus.loadProcessDashboardStatus
);

// Users list selectors
export const getUserActiveStatus = createSelector(
  getProjectManagementState,
  (state) => state.usersList
);

export const getEmployeeEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.employeeList
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
  getProjectManagementState,
  (state) => state.employeeList.loadingFeedTimeSheetUsers
);

export const getGoalReplanHistoryEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.goalReplanHistory
);

export const {
  selectIds: getGoalReplanHistoryIds,
  selectEntities: getGoalReplanHistoryEntities,
  selectAll: getGoalReplanHistoryAll,
  selectTotal: getGoalReplanHistoryTotal
} = fromGoalReplanHistory.GoalReplanHistoryAdapter.getSelectors(
  getGoalReplanHistoryEntitiesState
);

export const getGoalReplanHistoryLoading = createSelector(
  getProjectManagementState,
  (state) => state.goalReplanHistory.loadingGoalReplanHistory
);

export const GoalReplanHistoryExceptionHandling = createSelector(
  getProjectManagementState,
  (state) => state.goalReplanHistory.exceptionMessage
);

// Goal Filters
export const getGoalFiltersEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.goalFilters
);

export const {
  selectIds: getGoalFiltersIds,
  selectEntities: getGoalFiltersEntities,
  selectAll: getGoalFiltersAll,
  selectTotal: getGoalFiltersTotal
} = fromGoalFilters.goalFiltersAdapter.getSelectors(
  getGoalFiltersEntitiesState
);

export const upsertGoalFiltersLoading = createSelector(
  getProjectManagementState,
  (state) => state.goalFilters.upsertGoalFilters
);

export const getGoalFiltersLoading = createSelector(
  getProjectManagementState,
  (state) => state.goalFilters.loadingGoalFilters
);

export const archiveGoalFiltersLoading = createSelector(
  getProjectManagementState,
  (state) => state.goalFilters.archiveGoalFilters
);

// Templates list

export const getTemplatesEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.templates
);

export const {
  selectIds: getTemplatesIds,
  selectEntities: getTemplatesEntities,
  selectAll: getTemplatesAll,
  selectTotal: getTemplatesTotal
} = fromTemplates.templateAdapter.getSelectors(
  getTemplatesEntitiesState
);

export const upsertTemplatesLoading = createSelector(
  getProjectManagementState,
  (state) => state.templates.upsertTemplate
);

export const getTemplatesLoading = createSelector(
  getProjectManagementState,
  (state) => state.templates.loadingTemplates
);

export const insertGoalTemplateLoading = createSelector(
  getProjectManagementState,
  (state) => state.templates.insertGoalTemplate
);
export const insertDuplicateTemplateLoading = createSelector(
  getProjectManagementState,
  (state) => state.templates.insertDuplicateTemplate
);
export const deleteTemplateLoading = createSelector(
  getProjectManagementState,
  (state) => state.templates.deleteTemplate
);

export const getTemplateById = createSelector(
  getProjectManagementState,
  (state) => state.templates.templateModel
);

// work items list

export const getWorkItemsEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.workItems
);

export const {
  selectIds: getWorkItemsIds,
  selectEntities: getWorkItemsEntities,
  selectAll: getWorkItemsAll,
  selectTotal: getWorkItemsTotal
} = fromWorkItems.workItemAdapter.getSelectors(
  getWorkItemsEntitiesState
);

export const upsertworkItemsLoading = createSelector(
  getProjectManagementState,
  (state) => state.workItems.upsertWorkItem
);

export const getWorkItemsLoading = createSelector(
  getProjectManagementState,
  (state) => state.workItems.loadingUserStories
);

export const getWorkItemById = createSelector(
  getProjectManagementState,
  (state) => state.workItems.workItem
);

// Sprints list

export const getSprintsEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.sprints
);

export const {
  selectIds: getSprintsIds,
  selectEntities: getSprintsEntities,
  selectAll: getSprintsAll,
  selectTotal: getSprintsTotal
} = fromSprints.sprintAdapter.getSelectors(
  getSprintsEntitiesState
);

export const upsertSprintsLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprints.upsertSprint
);

export const getSprintsLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprints.loadingSprints
);

export const deleteSprintLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprints.deleteSprint
);

export const sprintStartLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprints.startSprintLoading
);

export const replanSprintLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprints.replanSprintLoading
);

export const completeSprintLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprints.completeSprint
);

export const getSprintById = createSelector(
  getProjectManagementState,
  (state) => state.sprints.sprintModel
);

export const getUniqueSprintById = createSelector(
  getProjectManagementState,
  (state) => state.sprints.uniqueSprintModel
);

export const getUniqueSprintByIdLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprints.getUniqueSprintByid
);


// Sprint work items list

export const getSprintWorkItemsEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems
);

export const {
  selectIds: getSprintWorkItemsIds,
  selectEntities: getSprintWorkItemsEntities,
  selectAll: getSprintWorkItemsAll,
  selectTotal: getSprintWorkItemsTotal
} = fromSprintWorkItems.sprintWorkItemAdapter.getSelectors(
  getSprintWorkItemsEntitiesState
);

export const upsertSprintworkItemsLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.upsertWorkItem
);

export const getSprintWorkItemsLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.loadingUserStories
);

export const getSprintWorkItemById = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.workItem
);

export const archiveUserStoryLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.archiveWorkItem
);

export const parkUserStoryLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.parkWorkItem
);

export const getUniqueSprintWorkItem = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.uniqueWorkItem
);

export const getUniqueSprintWorkItemsLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.getWorkItemById
);

export const upsertTagsLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.upsertTagsLoading
);

export const getSprintsSubTasks = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.userStories
);

export const subTasksLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.loadingSubTasks
);

export const loadingUserStorySprint = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.moveUserStorySprint
);


export const creatingUserstorySprint = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.creatingMultipleUserStories
);

export const reOrderWorkItemsLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.reOrderUserStories
);

export const archiveWorkItemsLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprintWorkItems.archiveKanbanWorkItems
);

// Sprint replan history

export const getSprintReplanHistoryEntitiesState = createSelector(
  getProjectManagementState,
  (state) => state.sprintReplanHistory
);

export const {
  selectIds: getSprintReplanHistoryIds,
  selectEntities: getSprintReplanHistoryEntities,
  selectAll: getSprintReplanHistoryAll,
  selectTotal: getSprintReplanHistoryTotal
} = fromSprintReplanHistory.SprintReplanHistoryAdapter.getSelectors(
  getSprintReplanHistoryEntitiesState
);

export const getSprintReplanHistoryLoading = createSelector(
  getProjectManagementState,
  (state) => state.sprintReplanHistory.loadingSprintReplanHistory
);

export const SprintReplanHistoryExceptionHandling = createSelector(
  getProjectManagementState,
  (state) => state.sprintReplanHistory.exceptionMessage
);

