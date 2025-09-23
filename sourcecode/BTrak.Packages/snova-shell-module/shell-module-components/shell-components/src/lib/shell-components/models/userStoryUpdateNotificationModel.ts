import { NotificationOutputModel } from "./NotificationsOutPutModel";

export class UserStoryUpdateNotificationModel extends NotificationOutputModel {
  userStoryId: string;
  userStoryName: string;
  loadFromCaseInsensitiveObject(appNotification: any) {
    this.userStoryId = appNotification.UserStoryGuid;
    this.userStoryName = appNotification.UserStoryName;
    super.loadFromCaseInsensitiveObject(appNotification);
  }
}
