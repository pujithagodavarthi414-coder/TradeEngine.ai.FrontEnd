import { UserStoryCustomFieldsModel } from "./userstory-custom-fields.model";
import { EntityRoleFeatureModel } from './entityRoleFeature';

export class UserStory {
  [x: string]: any;
  id: string;
  unLinkActionId: string;
  userStory: string;
  userStoryId: string;
  parentUserStoryId: string;
  parentUserStoryGoalId: string;
  userStoryName: string;
  projectId: string;
  goalId: string;
  goalIdForBug: string;

  estimatedTime: any;
  eTime: string;

  deadLineDate: Date;
  deadLine: string;

  revisedDate: string;
  replanDate: string;

  reason: string;

  ownerUserId: string;
  oldOwnerUserId: string;
  ownerName: string;
  owner: string;
  ownerImage: string;
  ownerProfileImage: string;

  dependencyUserId: string;
  dependency: string;
  dependencyProfileImage: string;
  dependencyName: string;

  bugCausedUserId: string;
  bugCausedUser: string;
  bugCausedUserProfileImage: string;

  statusId: string;
  statusName: string;
  statusTracker: string;
  testSuiteId: string;
  testSuiteSectionId: string;
  testSuiteSectionName: string;
  testCaseId: string;
  testRunId: string;
  isInductionGoal: boolean;

  auditConductQuestionId: string;
  questionName: string;
  auditProjectId: string;
  actionCategoryId: string;
  questionId: string;
  conductId: string;
  loadBugs: boolean;

  boardTypeId: string;
  userStoriesCount: number;
  daysCount: number;
  absDaysCount: number;

  createdUserId: string;
  createdUserName: string;
  createdDate: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;

  goalStatusId: string;
  isEdit: boolean;
  isShow: boolean;
  isAction: boolean;
  isUserActions: boolean;

  isOwnerEditable: boolean;
  isUserStoryEditable: boolean;
  isEstimatedTimeEditable: boolean;
  isDeadLineEditable: boolean;
  isDependencyEditable: boolean;
  isStatusEditable: boolean;

  isArchived: boolean;
  archivedDateTime: Date;

  permissionConfigurationId: string;
  projectFeatureName: string;
  projectFeatureId: string;

  canUserStoryPark: boolean;
  isAutoLog: boolean
  parkedDateTime: Date;

  bugPriorityId: string;
  bugPriorityName: string;
  bugPriorityDescription: string;
  bugPriorityColor: string;
  bugsCount: any;
  icon: string;

  userStoryStatusId: string;
    userStoryIds: string;
    workspaceDashboardId: string;
  userStoryStatusColor: string;
  userStoryStatusName: string;
  boardTypeUiId: string;
  isBugBoard: boolean;
  configurationId: string;
  userStoryTypeId: string;
  isBug: boolean;
  userStoryParkedDateTime: Date;
  userStoryArchivedDateTime: Date;
  isGoalChanged: boolean;
  isStatusChanged: boolean;
  isNewUserStory: boolean;
  description: string;
  workFlowId: string;
  workFlowStatusId: string;
  onboardProcessDate: Date;
  entityFeaturesXml: string;
  entityFeaturesList: EntityRoleFeatureModel[];
  totalCount: number;
  isAssigneeChanged: boolean;
  timeStamp: any;
  isForQa: boolean;
  isOnTrack: boolean;
  order: any;
  versionName: string;
  transitionDateTime: Date;
  oldGoalId: string;
  dependancyUserId: string;
  amendBy: number;
  tag: string;
  isReplan: boolean;
  goalReplanId: string;
  goalArchivedDateTime: Date;
  goalParkedDateTime: Date;
  userStoryUniqueName: string;
  descriptionSlug: string;
  subUserStories: string;
  subUserStoriesList: UserStory[];
  parentUserStoryIds: string[];
  linkUserStoryTypeId: string;
  linkUserStoryTypeName: string;
  linkUserStoryId: string;
  totalEstimatedTime: any;
  isUniqueDetailsPage: boolean;
  taskStatusId: string;
  amendedDaysCount: number;
  isFileUplaod: boolean;
  createdDateTime: any;
  userStoryLabel: string;
  templateId: string;
  isFillForm: boolean;
  customApplicationId: string;
  genericFormSubmittedId: string;
  workFlowTaskId: string;
  isFromTemplate: boolean;
  isLogTimeRequired: boolean;
  isQaRequired: boolean;
  userStoryTypeName: string;
  userStoryTypeColor: string;
  isDateTimeConfiguration: boolean;
  isAdhocUserStory: boolean;
  pageSize: number;
  pageNumber: number;
  calenderDescription: string;
  searchText: string;
  tags: string;
  bugPriorityIds: string;
  userIds: string;
  userStoryStatusIds: string;
  userStoryTypeIds: string;
  branchIds: string;
  actionCategoryIds: string;
  isIncludeUnAssigned: boolean;
  isFromSprint: boolean;
  sprintEstimatedTime: any;
  totalSprintEstimatedTime: any;
  sprintStartDate: any;
  sprintName: string;
  sprintEndDate: Date;
  oldSprintId: string;
  isSprintsConfiguration: boolean;
  sprintInActiveDateTime: Date;
  isSprintUserStory: boolean;
  isExcludeOtherUs: boolean;
  isFromSprints: boolean;
  customWidgetId: string;
  cronExpression: string;
  cronExpressionId: string;
  cronExpressionTimestamp: any;
  jobId: any;
  isPaused: boolean;
  isRecurringWorkItem: boolean;
  scheduleEndDate: any;

  userStoryCustomFields: UserStoryCustomFieldsModel[];
  autoLog: boolean;
  breakType: boolean;
  isBacklog: boolean;
  rAGStatus: string;
  ragStatus: string;
  taskStatusOrder: number;
  isComplete: boolean;
  isEnableTestRepo: boolean;
  isEnableBugBoards: boolean;
  isFromBugs: boolean;
  formId : string;
  isEnableStartStop : boolean;
  isSameUser : boolean;
  isChildUserStory: string;
  isSuperAgileBoard: boolean;
  isGoalsPage: boolean;
  isGoalUniquePage: boolean;
  referenceId: string;
  referenceTypeId: string;
  isWorkflowStatus: boolean;
  userStoryStartDate: Date;
  isMyWork: boolean;
}
