import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { ClearAllUnreadNotificationsTriggered, NotificationsActionTypes, ClearAllUnreadNotificationsCompleted, ClearAllUnreadNotificationsFailed, ExceptionHandled, UpsertUnreadNotificationsTriggered, UpsertUnreadNotificationsCompleted, UpsertUnreadNotificationsFailed, ClearAllNotifications, ClearUnreadNotificationsTriggered } from "../actions/notifications.actions";
import { MenuItemService } from "../../services/feature.service";
import { ShowValidationMessages, ShowExceptionMessages } from "../actions/notification-validator.action";

@Injectable()
export class NotificationEffect {
  validationMessages: any[];
  exceptionMessage: any;

  @Effect()
  loadNotifications$: Observable<Action> = this.actions$.pipe(
    ofType<ClearAllUnreadNotificationsTriggered>(NotificationsActionTypes.ClearAllUnreadNotificationsTriggered),
    switchMap(searchAction => {
      {
        return this.menuItemService.getAllNotifications(searchAction.notification)
          .pipe(
            map((notifications: any) => {
              if (notifications.success) {
                return new ClearAllUnreadNotificationsCompleted(notifications.data)
              }
              else {
                return new ClearAllUnreadNotificationsFailed(notifications.apiResponseMessages);
              }
            }),
            catchError(err => {
              return of(new ExceptionHandled(err));
            })
          );
      }
    })
  );

  @Effect()
  loadAllNotifications$: Observable<Action> = this.actions$.pipe(
    ofType<ClearUnreadNotificationsTriggered>(NotificationsActionTypes.ClearUnreadNotificationsTriggered),
    switchMap(searchAction => {
      {
        return this.menuItemService.getAllNotifications(searchAction.notification)
          .pipe(
            map((notifications: any) => {
              if (notifications.success) {
                return new ClearAllUnreadNotificationsCompleted(notifications.data)
              }
              else {
                return new ClearAllUnreadNotificationsFailed(notifications.apiResponseMessages);
              }
            }),
            catchError(err => {
              return of(new ExceptionHandled(err));
            })
          );
      }
    })
  );


  @Effect()
  showValidationMessagesForProjectList$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ClearAllUnreadNotificationsFailed>(
      NotificationsActionTypes.ClearAllUnreadNotificationsFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );


  @Effect()
  exceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ExceptionHandled>(
      NotificationsActionTypes.ExceptionHandled
    ),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  @Effect()
  UpsertUnreadNotifications$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertUnreadNotificationsTriggered>(NotificationsActionTypes.UpsertUnreadNotificationsTriggered),
    switchMap(UpsertReadNotificationsTriggeredAction => {
      return this.menuItemService
        .upsertNotificationReadStatus(UpsertReadNotificationsTriggeredAction.upsertNotification)
        .pipe(
          map((notificationId: any) => {
            return new UpsertUnreadNotificationsCompleted(UpsertReadNotificationsTriggeredAction.upsertNotification[0].notificationId);
          }),
          catchError(error => {
            this.exceptionMessage = error;
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForCanteenFoodItem$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertUnreadNotificationsFailed>(NotificationsActionTypes.UpsertUnreadNotificationsFailed),
    pipe(
      map(() => {
        return new ShowValidationMessages({
          validationMessages: this.validationMessages, // TODO: Change to proper toast message
        })
      })
    )
  );

  @Effect()
  ClearAllUnreadNotifications$: Observable<Action> = this.actions$.pipe(
    ofType<ClearAllNotifications>(NotificationsActionTypes.ClearAllNotifications),
    switchMap(UpsertReadNotificationsTriggeredAction => {
      return this.menuItemService
        .upsertNotificationReadStatus(UpsertReadNotificationsTriggeredAction.readNotifications)
        .pipe(
          map((notificationId: any) => {
            if (notificationId.success === true) {
              return new UpsertUnreadNotificationsCompleted(UpsertReadNotificationsTriggeredAction.readNotifications[0].notificationId);
            } else {
              this.validationMessages = notificationId.apiResponseMessages
              return new UpsertUnreadNotificationsFailed(notificationId.apiResponseMessages);
            }
          }),
          catchError(error => {
            this.exceptionMessage = error;
            return of(new ExceptionHandled(error));
          })
        );
    })
  );


  constructor(
    private actions$: Actions,
    private menuItemService: MenuItemService,
    private translateService: TranslateService
  ) { }
}
