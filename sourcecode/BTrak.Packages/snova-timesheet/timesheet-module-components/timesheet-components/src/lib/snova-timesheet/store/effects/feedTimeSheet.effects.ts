import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map } from "rxjs/operators";
import {
  FeedTimeSheetUsersActionTypes,
  LoadFeedTimeSheetUsersTriggered,
  LoadFeedTimeSheetUsersCompleted,
  LoadFeedTimeSheetUsersFailed
} from "../actions/feedTimeSheet.action";
import { TimeSheetService } from '../../services/timesheet.service';
import { ShowValidationMessages } from '../actions/notification-validator.action';

@Injectable()
export class FeedTimeSheetUsersEffects {
  @Effect()
  loadBoardTypes$: Observable<Action> = this.actions$.pipe(
    ofType<LoadFeedTimeSheetUsersTriggered>(
      FeedTimeSheetUsersActionTypes.LoadFeedTimeSheetUsersTriggered
    ),
    switchMap((triggeredAction) => {
      return this.timeSheetService.searchUsers(triggeredAction.userModel).pipe(
        map((response: any) => {
          if (response.success) {
            return new LoadFeedTimeSheetUsersCompleted(response.data);
          }
          else {
            return new LoadFeedTimeSheetUsersFailed(response.apiResponseMessages);
          }
        })
      );
    })
  );

  @Effect()
  showValidationMessagesForUsersList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadFeedTimeSheetUsersFailed>(
      FeedTimeSheetUsersActionTypes.LoadFeedTimeSheetUsersFailed
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
