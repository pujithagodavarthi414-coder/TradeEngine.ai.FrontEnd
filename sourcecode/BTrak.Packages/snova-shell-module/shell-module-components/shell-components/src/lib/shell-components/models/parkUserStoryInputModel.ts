import { NotificationOutputModel } from "./NotificationsOutPutModel";

export class UserStoryParkNotificationModel extends NotificationOutputModel {
  userStoryId: string;
  userStoryName: string;
  ownerGuid: string;
  loadFromCaseInsensitiveObject(appNotification: any) {
    this.userStoryId = appNotification.UserStoryGuid;
    this.userStoryName = appNotification.UserStoryName;
    this.ownerGuid = appNotification.UserStoryOwnerId;
    super.loadFromCaseInsensitiveObject(appNotification);
  }
}
