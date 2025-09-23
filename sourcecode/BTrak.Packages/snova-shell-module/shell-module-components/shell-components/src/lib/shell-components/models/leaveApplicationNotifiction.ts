import { Guid } from "guid-typescript";
import { NotificationOutputModel } from "./NotificationsOutPutModel";

export class LeaveApplicationNotification extends NotificationOutputModel {
  notificationAssignedByUserGuid: Guid;
  notificationAssignedToUserGuid: Guid;

  loadFromCaseInsensitiveObject(appNotification: any) {
    this.notificationAssignedByUserGuid = appNotification.NotificationAssignedByUserGuid;
    this.notificationAssignedToUserGuid = appNotification.NotificationAssignedToUserGuid;
    super.loadFromCaseInsensitiveObject(appNotification);
  }
}
