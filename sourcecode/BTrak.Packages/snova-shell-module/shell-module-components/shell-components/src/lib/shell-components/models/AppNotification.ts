export class AppNotification {
  public id: string;
  public notificationTypeGuid: string;
  public notificationSummary: string;
  public notificationCreatedDateTime: any;
  public notification: string;
  public icon: string = "assignment_ind";
  public route: string = "/inbox";
  public color: string = "primary";
  public isRead: boolean = false;

  loadFromCaseInsensitiveObject(appNotification: any) {
    this.id = appNotification.Id;
    this.notificationTypeGuid = appNotification.NotificationTypeGuid;
    this.notificationSummary = appNotification.Summary;
    this.notificationCreatedDateTime =
      appNotification.CreatedDateTime;
    this.notification = appNotification.Notification;
  }
}
