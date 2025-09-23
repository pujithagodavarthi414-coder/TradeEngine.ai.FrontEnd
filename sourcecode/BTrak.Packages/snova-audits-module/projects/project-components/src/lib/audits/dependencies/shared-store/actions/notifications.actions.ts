import { Action } from "@ngrx/store";
import { AppNotification } from "../../models/AppNotification";
import { Update } from "@ngrx/entity";
import { ValidationModel } from "../../models/validation-messages";
import { NotificationOutputModel, UserNotificationReadModel } from "../../models/NotificationsOutPutModel";

export enum NotificationsActionTypes {
  NewNotificationReceived = "[SnovaAudisModule Notifications] New Notification Received",
  ClearAllNotifications = "[SnovaAudisModule Notifications] Clear All Notifications",
  ClearAllUnreadNotificationsTriggered = "[SnovaAudisModule Notifications] Clear All Unread Notifications",
  ClearAllUnreadNotificationsFailed = "[SnovaAudisModule Notifications] Clear All Unread Notifications failed",
  ClearAllUnreadNotificationsCompleted = "[SnovaAudisModule Notifications] Clear All Unread Notifications completed",
  UpsertUnreadNotificationsFailed = "[SnovaAudisModule Notifications] Upsert read Notifications failed",
  UpsertUnreadNotificationsTriggered = "[SnovaAudisModule Notifications] Upsert read Notifications",
  UpsertUnreadNotificationsCompleted = "[SnovaAudisModule Notifications] Upsert read Notifications completed",
  ExceptionHandled = "[SnovaAudisModule Project Component] HandleException",
}

export class NewNotificationReceived implements Action {
  type = NotificationsActionTypes.NewNotificationReceived;
  validationMessages: ValidationModel[];
  errorMessage: string;
  notifications: NotificationOutputModel[];
  notificationId: string

  constructor(public notification: NotificationOutputModel) { }
}

export class ClearAllNotifications implements Action {
  type = NotificationsActionTypes.ClearAllNotifications;
  notification: AppNotification;
  errorMessage: string;
  validationMessages: ValidationModel[];
  notifications: NotificationOutputModel[];
  upsertNotification: UserNotificationReadModel;
  notificationId: string

  constructor(public readNotifications: UserNotificationReadModel[]) { }
}

export class ClearAllUnreadNotificationsTriggered implements Action {
  type = NotificationsActionTypes.ClearAllUnreadNotificationsTriggered;
  errorMessage: string;
  validationMessages: ValidationModel[];
  notifications: NotificationOutputModel[];
  upsertNotification: UserNotificationReadModel;
  notificationId: string

  constructor(public notification: AppNotification) { }
}

export class ClearAllUnreadNotificationsCompleted implements Action {
  type = NotificationsActionTypes.ClearAllUnreadNotificationsCompleted;
  notification: AppNotification;
  errorMessage: string;
  validationMessages: ValidationModel[];
  upsertNotification: UserNotificationReadModel;
  notificationId: string

  constructor(public notifications: NotificationOutputModel[]) { }
}

export class ClearAllUnreadNotificationsFailed implements Action {
  type = NotificationsActionTypes.ClearAllUnreadNotificationsFailed;
  notification: AppNotification;
  errorMessage: string;
  notifications: NotificationOutputModel[];
  upsertNotification: UserNotificationReadModel;
  notificationId: string

  constructor(public validationMessages: ValidationModel[]) { }
}

export class UpsertUnreadNotificationsTriggered implements Action {
  type = NotificationsActionTypes.UpsertUnreadNotificationsTriggered;
  errorMessage: string;
  validationMessages: ValidationModel[];
  notifications: NotificationOutputModel[];
  notificationId: string

  constructor(public upsertNotification: UserNotificationReadModel[]) { }
}

export class UpsertUnreadNotificationsCompleted implements Action {
  type = NotificationsActionTypes.UpsertUnreadNotificationsCompleted;
  notification: AppNotification;
  errorMessage: string;
  validationMessages: ValidationModel[];
  notifications: NotificationOutputModel[];
  upsertNotification: UserNotificationReadModel;

  constructor(public notificationId: string) { }
}

export class UpsertUnreadNotificationsFailed implements Action {
  type = NotificationsActionTypes.UpsertUnreadNotificationsFailed;
  notification: AppNotification;
  errorMessage: string;
  notifications: NotificationOutputModel[];
  upsertNotification: UserNotificationReadModel;
  notificationId: string

  constructor(public validationMessages: ValidationModel[]) { }
}

export class ExceptionHandled implements Action {
  type = NotificationsActionTypes.ClearAllUnreadNotificationsFailed;
  notification: AppNotification;
  validationMessages: ValidationModel[];
  notifications: NotificationOutputModel[];
  upsertNotification: UserNotificationReadModel;
  notificationId: string

  constructor(public errorMessage: string) { }
}

export type NotificationActions =
  | NewNotificationReceived
  | ClearAllNotifications
  | ClearAllUnreadNotificationsTriggered
  | ClearAllUnreadNotificationsCompleted
  | ClearAllUnreadNotificationsFailed
  | UpsertUnreadNotificationsFailed
  | UpsertUnreadNotificationsTriggered
  | UpsertUnreadNotificationsCompleted
  | ExceptionHandled;
