import { NotificationOutputModel } from "./NotificationsOutPutModel";

export class UserStoryCommentNotificationModel extends NotificationOutputModel {
  userStoryId: string;
  userStoryName: string;
  loadFromCaseInsensitiveObject(appNotification: any) {
    this.userStoryId = appNotification.UserStoryGuid;
    this.userStoryName = appNotification.UserStoryName;
    super.loadFromCaseInsensitiveObject(appNotification);
  }
}
