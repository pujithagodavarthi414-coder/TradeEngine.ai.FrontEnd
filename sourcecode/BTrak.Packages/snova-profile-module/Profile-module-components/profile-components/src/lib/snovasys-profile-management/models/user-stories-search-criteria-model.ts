export class UserStorySearchCriteriaOutputModel{
      projectId :string;
      projectName : string;
      projectResponsiblePersonId :string;

      goalId :string;
      goalName :string;
      goalShortName :string;
      onboardProcessDate :Date;
      isLocked :boolean;
      goalResponsibleUserName :string;
      goalResponsibleUserId :string;
      isProductiveBoard :boolean;
      isToBeTracked :boolean;
      considerEstimatedHoursId :string;
      considerHourName :string;

      boardTypeId :string;
      boardTypeName :string;

      boardTypeApiId :string;
      boardTypeApiName :string;

      configurationId :string;
      configurationTypeName :string;

      goalBudget :number;
      version :string;

      isArchived :  boolean;
      archivedDateTime : Date;
     
      parkedDateTime :Date;

      userStoryId :string;
      userStoryName :string;

      estimatedTime :number;
      deadLineDate :Date;;
      actualDeadLineDate :Date;;

      ownerUserId :string;
      ownerName :string;
      ownerProfileImage :string;
      dependencyUserId :string;
      dependencyName :string;
      dependencyProfileImage :string;

      order :number;

      bugPriorityId :string;
      bugPriority :string;
      bugPriorityDescription :string;
      bugPriorityColor :string;

      bugCausedUserId :string;
      bugCausedUserName :string;
      bugCausedUserProfileImage :string;      

      goalStatusId :string;
      goalStatusColor :string;

      userStoryStatusId :string;
      userStoryStatusName :string;
      userStoryStatusColor :string;

      userStoryTypeId :string;
      userStoryTypeName :string;

      projectFeatureId :string;
      projectFeatureName :string;

      workFlowId :string;
      isApproved :boolean;

      createdDateTime :Date;;
      createdOn :string;

      userStoryArchivedDateTime :Date;;
      userStoryParkedDateTime :Date;;

      remarks :string;

      userStoryExistedStatusId :string;

      userStoryIds :string[];
      userStoryIdsXml :string;

      userStoriesCount :number;
      totalCount :number;

      daysCount :number;
      absDaysCount :number;

      goalIds :string[];

      featureId :string;

      userStoryPriorityId :string;
      priorityName :string;
      userStoryPriorityOder :number;

      reviewerUserId :string;
      reviewerUserName :string;
      reviewerUserProfileImage :string;

      parentUserStoryId :string;

      description :string;
}