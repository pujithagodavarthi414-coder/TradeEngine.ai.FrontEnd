import { NotificationOutputModel } from "./NotificationsOutPutModel";
import { Guid } from "guid-typescript";

export class NewProjectCreatedNotificationModel extends NotificationOutputModel {
    projectGuid: Guid;
    projectName: string;
    projectResponsiblePersonId : Guid

    loadFromCaseInsensitiveObject(newProjectNotification: any) {
      this.projectGuid= newProjectNotification.projectGuid;
      this.projectName= newProjectNotification.projectName;
      this.projectResponsiblePersonId = newProjectNotification.projectResponsiblePersonId;
      super.loadFromCaseInsensitiveObject(newProjectNotification);
    }
  }
