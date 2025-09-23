import { NotificationOutputModel } from "./NotificationsOutPutModel";
import { Guid } from "guid-typescript";

export class SprintReplanStartedNotificationModel extends NotificationOutputModel {
    sprintGuid: Guid;
    sprintName: string;
   
    loadFromCaseInsensitiveObject(newProjectNotification: any) {
      this.sprintGuid = newProjectNotification.sprintGuid;
      this.sprintName= newProjectNotification.sprintName;
      super.loadFromCaseInsensitiveObject(newProjectNotification);
    }
  }
