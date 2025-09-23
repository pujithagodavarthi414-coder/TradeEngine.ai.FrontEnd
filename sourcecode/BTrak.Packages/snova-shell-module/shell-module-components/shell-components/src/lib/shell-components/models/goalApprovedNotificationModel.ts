import { NotificationOutputModel } from "./NotificationsOutPutModel";
import { Guid } from "guid-typescript";

export class GoalApprovedNotificationModel extends NotificationOutputModel {
    goalId: Guid;
    goalName: string;
    projectResponsiblePersonId : Guid

    loadFromCaseInsensitiveObject(newProjectNotification: any) {
      this.goalId= newProjectNotification.goalId;
      this.goalName= newProjectNotification.goalName;
      super.loadFromCaseInsensitiveObject(newProjectNotification);
    }
  }
