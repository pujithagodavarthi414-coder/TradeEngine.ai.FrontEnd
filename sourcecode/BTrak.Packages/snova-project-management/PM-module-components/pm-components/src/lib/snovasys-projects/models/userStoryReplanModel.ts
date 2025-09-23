export class UserStoryReplanModel {
  public userStoryReplanId: string;
  public userStoryId: string;
  public userStoryReplanTypeId: string;
  public goalReplanId: string;
  public estimatedTime: any;
  public userStoryName: string;
  public userStoryDeadLine: Date;
  public userStoryOwnerId: string;
  public userStoryDependencyId: string;
  public goalId:string;
  public timeStamp:any;
  public order: number;
  public parentUserStoryId : string;
  public userStoryLabel: string;
  public isFromSprint: boolean;
  public sprintId: string;
  public sprintEstimatedTime: any;
  public userStoryStartDate: Date;
  deadLine: any;
  timeZoneOffSet: number;
}
