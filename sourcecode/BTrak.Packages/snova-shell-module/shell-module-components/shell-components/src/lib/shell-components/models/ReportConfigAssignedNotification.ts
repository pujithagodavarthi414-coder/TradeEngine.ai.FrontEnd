import { Guid } from "guid-typescript";
import { NotificationOutputModel } from "./NotificationsOutPutModel";
export class ReportConfigAssignedNotification extends NotificationOutputModel {
  notificationAssignedByUserGuid: Guid;
  notificationAssignedToUserGuid: Guid;
  reportConfigurationId: Guid;
  reportName: string;

  loadFromCaseInsensitiveObject(appNotification: any) {
    this.notificationAssignedByUserGuid = appNotification.NotificationAssignedByUserGuid;
    this.notificationAssignedToUserGuid = appNotification.NotificationAssignedToUserGuid;
    this.reportConfigurationId = appNotification.ReportConfigurationId;
    this.reportName = appNotification.ReportName;
    super.loadFromCaseInsensitiveObject(appNotification);
  }
}
