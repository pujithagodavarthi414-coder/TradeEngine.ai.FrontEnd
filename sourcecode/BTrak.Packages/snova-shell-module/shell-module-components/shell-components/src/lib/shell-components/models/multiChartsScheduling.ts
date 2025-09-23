import { Guid } from "guid-typescript";
import { NotificationOutputModel } from "./NotificationsOutPutModel";

export class MultipleChartsScheduling extends NotificationOutputModel {
  notificationAssignedByUserGuid: Guid;
  notificationAssignedToUserGuid: Guid;
  cronExpressionId: Guid;
  cronExpressionName: string;

  loadFromCaseInsensitiveObject(appNotification: any) {
    this.notificationAssignedByUserGuid = appNotification.NotificationAssignedByUserGuid;
    this.notificationAssignedToUserGuid = appNotification.NotificationAssignedToUserGuid;
    this.cronExpressionId = appNotification.cronExpressionId;
    this.cronExpressionName = appNotification.ReportName;
    super.loadFromCaseInsensitiveObject(appNotification);
  }
}
