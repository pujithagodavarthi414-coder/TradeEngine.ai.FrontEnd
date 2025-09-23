import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import {LoadUserstoryHistoryTriggered,LoadUserstoryHistoryCompleted,LoadUserstoryHistoryFailed,UserStoryHistoryExceptionHandled,UserstoryHistoryActionTypes,UserstoryHistoryActions}from '../actions/userstory-history.action';
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { UserstoryHistoryService } from "../../services/userstory-history.service";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";

@Injectable()
export class UserstoryHistoryEffects {
    
    @Effect()
    loadUserstoryHistory$: Observable<Action> = this.actions$.pipe(
        ofType<LoadUserstoryHistoryTriggered>(UserstoryHistoryActionTypes.LoadUserstoryHistoryTriggered),
        switchMap(userStoryTriggeredAction => {
          return this.historyService
            .getUserStoryHistory(userStoryTriggeredAction.userstoryId)
            .pipe(
              map((result: any) => {
                if (result.success === true) {
                  return new LoadUserstoryHistoryCompleted(result.data);
                } else {
                  return new LoadUserstoryHistoryFailed(result.apiResponseMessages);
                }
              }),
              catchError(err => {
                return of(new UserStoryHistoryExceptionHandled(err));
              })
            );
        })
      );

      @Effect()
  showValidationMessagesForUserStoryHistory$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadUserstoryHistoryFailed>(
      UserstoryHistoryActionTypes.LoadUserstoryHistoryFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );
  
  @Effect()
  UserStoryHistoryExceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UserStoryHistoryExceptionHandled>(
      UserstoryHistoryActionTypes.UserStoryHistoryExceptionHandled
    ),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

      constructor(
        private actions$: Actions,
        private historyService:UserstoryHistoryService
      ) {}
}