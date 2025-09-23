import { EntityRoleFeatureModel } from "./entityRoleFeature";

export class UserStoryLinksModel {
  id: string;
  userStory: string;
  userStoryId: string;
  userStoryName: string;
  projectId: string;
  goalId: string;

  estimatedTime: any;
  eTime: string;

  deadLineDate: Date;
  deadLine: string;

  revisedDate: string;
  replanDate: string;
  reason: string;

  ownerUserId: string;
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

  boardTypeId: string;
  userStoriesCount: number;
  daysCount: number;
  absDaysCount: number;

  createdUserId: string;
  createdUserName: string;
  createdDate: string;
  startDate: string;
  endDate: string;

  goalStatusId: string;
  isEdit: boolean;
  isShow: boolean;

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
  parkedDateTime: Date;

  bugPriorityId: string;
  bugPriorityName: string;
  bugPriorityDescription: string;
  bugPriorityColor: string;
  icon: string;

  userStoryStatusId: string;
  UserStoryIds: any[];
  userStoryStatusColor: string;
  userStoryStatusName: string;
  boardTypeUiId:string;
  configurationId:string;
  userStoryTypeId: string;
  userStoryParkedDateTime: Date;
  userStoryArchivedDateTime: Date;
  isGoalChanged: boolean;
  isStatusChanged: boolean;
  isNewUserStory: boolean;
  description:string;
  workFlowId:string;
  onboardProcessDate:Date;
  entityFeaturesXml:string;
  entityFeaturesList:EntityRoleFeatureModel[];
  totalCount:number;
  isAssigneeChanged:boolean;
  timeStamp:any;
  isForQa: boolean;
  order: number;
  versionName: string;
  userStoryUniqueName:string;
  transitionDateTime:Date;
  oldGoalId:string;
  dependancyUserId:string;
  amendBy : number;
  tag : string;
  parentUserStoryId : string;
  goalArchivedDateTime : Date;
  goalParkedDateTime : Date;
  parentUserStoryIds : string[];
  linkUserStoryTypeId : string;
  linkUserStoryTypeName : string;
  linkUserStoryId : string;
  userStoryLabel: string;
}
