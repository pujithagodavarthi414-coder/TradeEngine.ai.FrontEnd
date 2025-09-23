import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import {
  NotificationsActionTypes,
  NewNotificationReceived,
  NotificationActions
} from "../actions/notifications.actions";
// import { Action } from "@ngrx/store";
// import { AppNotification } from "../../../shared/models/AppNotification";
import { NotificationOutputModel } from "../../models/NotificationsOutPutModel";

export interface State extends EntityState<NotificationOutputModel> {
  loadingNotifications: boolean;
}

export function sortByDateTime(a: NotificationOutputModel, b: NotificationOutputModel): any {
  return b.notificationCreatedDateTime - a.notificationCreatedDateTime
}

export const notificationsAdapter: EntityAdapter<
  NotificationOutputModel
> = createEntityAdapter<NotificationOutputModel>({
  selectId: (notifications: NotificationOutputModel) => notifications.notificationId,
  sortComparer: sortByDateTime
});

export const initialState: State = notificationsAdapter.getInitialState({
  loadingNotifications: false,
});

export function reducer(state: State = initialState, action: NotificationActions): State {
  switch (action.type) {
    case NotificationsActionTypes.NewNotificationReceived:
      return notificationsAdapter.addOne(
        (action as NewNotificationReceived).notification,
        state
      );
    case NotificationsActionTypes.ClearAllNotifications:
      return notificationsAdapter.removeAll(state);
    case NotificationsActionTypes.UpsertUnreadNotificationsCompleted:
      state = notificationsAdapter.removeOne(action.notificationId, state);
      return { ...state };
    case NotificationsActionTypes.ClearAllUnreadNotificationsCompleted:
      return notificationsAdapter.addMany(action.notifications, {
        ...state, loadingNotifications: false
      });
    case NotificationsActionTypes.ClearAllUnreadNotificationsTriggered:
      return notificationsAdapter.updateMany(
        [...state.ids].map((NotificationId: string) => ({
          id: NotificationId,
          changes: {
            isRead: false
          },
          loadingNotifications: true
        })),
        state
      );
    default:
      return state;
  }
}
