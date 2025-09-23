export class NotificationOutputModel {
  notificationId: string;
  notificationTypeId: string;
  notificationTypeName: string;
  featureId: string;
  featureName: string;
  notificationJson: any;
  summary: any;
  createdByUserId: string;
  createdDateTime: any;
  isRead: boolean = false;
  public notificationSummary: string;
  public notificationCreatedDateTime: any;
  public notification: string;
  public icon: string = "assignment_ind";
  public route: string = "/inbox";
  public color: string = "primary";

  loadFromCaseInsensitiveObject(appNotification: any) {
    this.notificationId = appNotification.Id;
    this.notificationTypeId = appNotification.NotificationTypeGuid;
    this.notificationSummary = appNotification.Summary;
    this.notificationCreatedDateTime =
      appNotification.CreatedDateTime;
    this.notification = appNotification.Notification;
    this.notificationJson = appNotification.NotificationJson;
  }
}

export class UserNotificationReadModel {
  userNotificationReadId: string;
  notificationId: string;
  userId: string;
  readDateTime: Date;
  operationsPerformedBy: string;
  notificationTypeId: string;
  notificationSummary: string;
  notificationJson: any;
}

export class NotificationModel {
  id: any;
  notificationType: any;
  summary: any;
  createdByUserId: any;
  updatedByUserId: any;
  createdDateTime: any;
  updatedDateTime: any;
  readTime: any;
  inActiveDateTime: any;
  isArchived: any;
}
