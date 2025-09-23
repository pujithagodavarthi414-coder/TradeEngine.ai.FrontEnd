import { NotificationOutputModel } from "./NotificationsOutPutModel";

export class UserStoryAssignedNotification extends NotificationOutputModel {
  notificationAssignedByUserGuid: string;
  notificationAssignedToUserGuid: string;
  userStoryGuid: string;
  userStoryName: string;
  loadFromCaseInsensitiveObject(appNotification: any) {
    this.notificationAssignedByUserGuid =
      appNotification.NotificationAssignedByUserGuid;
    this.notificationAssignedToUserGuid =
      appNotification.NotificationAssignedToUserGuid;
    this.userStoryGuid = appNotification.UserStoryGuid;
    this.userStoryName = appNotification.UserStoryName;
    super.loadFromCaseInsensitiveObject(appNotification);
  }
}
