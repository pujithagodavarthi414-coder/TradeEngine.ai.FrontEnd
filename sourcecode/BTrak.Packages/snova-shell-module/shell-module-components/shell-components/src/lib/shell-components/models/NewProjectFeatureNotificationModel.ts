import { NotificationOutputModel } from "./NotificationsOutPutModel";
import { Guid } from "guid-typescript";

export class NewProjectFeatureCreatedNotificationModel extends NotificationOutputModel {
    projectFeatureId: Guid;
    projectFeatureName: string;
    projectFeatureResponsiblePersonId : Guid

    loadFromCaseInsensitiveObject(newProjectNotification: any) {
      this.projectFeatureId= newProjectNotification.ProjectFeatureId;
      this.projectFeatureName= newProjectNotification.ProjectFeatureName;
      this.projectFeatureResponsiblePersonId = newProjectNotification.ProjectId;
      super.loadFromCaseInsensitiveObject(newProjectNotification);
    }
  }
