import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map } from "rxjs/operators";
import { PermissionHistoryActionTypes, LoadPermissionHistoryUsersTriggered, LoadPermissionHistoryUsersCompleted, LoadPermissionHistoryUsersFailed } from "../actions/permission-history.action";
import { ShowValidationMessages } from '../actions/notification-validator.action';
import { TimeSheetService } from '../../services/timesheet.service';

@Injectable()
export class PermissionHistoryUsersEffects {
  @Effect()
  loadBoardTypes$: Observable<Action> = this.actions$.pipe(
    ofType<LoadPermissionHistoryUsersTriggered>(
      PermissionHistoryActionTypes.LoadPermissionHistoryUsersTriggered
    ),
    switchMap((triggeredAction) => {
      return this.timeSheetService.searchUsers(triggeredAction.userModel).pipe(
        map((response: any) => {
          if (response.success) {
            return new LoadPermissionHistoryUsersCompleted(response.data);
          }
          else {
            return new LoadPermissionHistoryUsersFailed(response.apiResponseMessages);
          }
        })
      );
    })
  );

  @Effect()
  showValidationMessagesForUsersList$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadPermissionHistoryUsersFailed>(
      PermissionHistoryActionTypes.LoadPermissionHistoryUsersFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private timeSheetService: TimeSheetService
  ) { }
}
