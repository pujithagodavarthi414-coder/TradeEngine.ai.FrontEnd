import { Action } from "@ngrx/store";
import { Update } from "@ngrx/entity";
import { ValidationModel } from '../../models/validation.model';
import { NotificationOutputModel, UserNotificationReadModel } from '../../models/NotificationsOutPutModel';
import { AppNotification } from '../../models/AppNotification';

export enum NotificationsActionTypes {
  NewNotificationReceived = "[Snovasys-Shell] [Notifications] New Notification Received",
  ClearAllNotifications = "[Snovasys-Shell] [Notifications] Clear All Notifications",
  ClearAllUnreadNotificationsTriggered = "[Snovasys-Shell] [Notifications] Clear All Unread Notifications",
  ClearUnreadNotificationsTriggered = "[Snovasys-Shell] [Notifications] Clear  Unread Notifications",
  ClearAllUnreadNotificationsFailed = "[Snovasys-Shell] [Notifications] Clear All Unread Notifications failed",
  ClearAllUnreadNotificationsCompleted = "[Snovasys-Shell] [Notifications] Clear All Unread Notifications completed",
  UpsertUnreadNotificationsFailed = "[Snovasys-Shell] [Notifications] Upsert read Notifications failed",
  UpsertUnreadNotificationsTriggered = "[Snovasys-Shell] [Notifications] Upsert read Notifications",
  UpsertUnreadNotificationsCompleted = "[Snovasys-Shell] [Notifications] Upsert read Notifications completed",
  ExceptionHandled = "[Project Component] HandleException",
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


export class ClearUnreadNotificationsTriggered implements Action {
  type = NotificationsActionTypes.ClearUnreadNotificationsTriggered;
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
  | ClearUnreadNotificationsTriggered
  | ExceptionHandled;
