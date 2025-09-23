export class UserStorySearchCriteriaInputModel {
  public searchText: string;
  public searchGoal: string;
  public searchUserStory: string;
  public pageNumber: number;
  public pageSize: number;
  public orderByField: string;
  public orderByDirection: boolean;
  public isActive: boolean;

  public userStoryId: string;
  public goalId: string;
  public goalStatusId: string;
  public userStoryStatusId: string;

  public projectId: string;
  public userId: string;
  public goalResponsiblePersonId: string;
  public branchId: string;
  public deadLineDateFrom: string;
  public deadLineDateTo: string;
  public isRed: boolean;
  public isWarning: boolean;
  public bugPriorityId: string;

  public isToBeTracked: string;
  public isProductiveBoard: boolean;

  public isUserStoryArchived: boolean;
  public isGoalParked: boolean;
  public isUserStoryParked: boolean;
  public userStoryName: string;
  public dependencyText: string;

  //public bugPriorityId: string;

  public sortBy: string;
  public sortDirectionAsc: boolean;
  public sortDirection:string;
  public workflowId: string;
  public parkedDateTime: string;
  public archivedDateTime: string;
  public ownerUserId: string;
  public bugPriorityIds: string;
  public includeArchive :boolean;
  public includePark: boolean;
  public refreshUserStoriesCall:boolean;
  public isGoalsPage:boolean;
  public isStatusMultiselect:boolean;
  public userStoryStatusIds:string;
  public ownerUserIds:string;
  public isForUserStoryoverview:boolean;
  public userStoryIds:string;  
  public isActiveGoalsOnly:boolean;
  public parentUserStoryId : string;
  public templateId: string;
  public entityId : string;
  public sprintId: string;
  public isArchived: boolean;
  public isParked: boolean;
  public isSprintUserStories: boolean;
  public isAction: boolean;
  public goalName : string;
  public userStoryTags: string; 
  public userStoryTypeIds: string;
}
