import { Guid } from "guid-typescript";
import { NotificationOutputModel } from "./NotificationsOutPutModel";
export class ReportSubmittedNotification extends NotificationOutputModel {
  notificationAssignedByUserGuid: Guid;
  notificationAssignedToUserGuid: Guid;
  reportId: Guid;
  reportName: string;
  submittedBy: string;

  loadFromCaseInsensitiveObject(appNotification: any) {
    this.notificationAssignedByUserGuid = appNotification.NotificationAssignedByUserGuid;
    this.notificationAssignedToUserGuid = appNotification.NotificationAssignedToUserGuid;
    this.reportId = appNotification.ReportId;
    this.reportName = appNotification.ReportName;
    this.submittedBy = appNotification.SubmittedBy;
    super.loadFromCaseInsensitiveObject(appNotification);
  }
}
