import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";

import { GoalLevelReportsService } from "../../services/reports.service";
import { LoadSprintReplanHistoryItemsTriggered, SprintReplanHistoryActionTypes, LoadSprintReplanHistoryItemsCompleted, LoadSprintReplanHistoryItemsFailed, SprintReplanHistoryExceptionHandled } from "../actions/sprint-replan-history.action";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';


@Injectable()
export class SprintReplanHistoryEffects {

  @Effect()
  loadSprintReplanHistory$: Observable<Action> = this.actions$.pipe(
    ofType<LoadSprintReplanHistoryItemsTriggered>(SprintReplanHistoryActionTypes.LoadSprintReplanHistoryItemsTriggered),
    switchMap(searchAction => {
        return this.reportService
          .getSprintReplanHistory(searchAction.sprintId, searchAction.SprintReplanValue)
          .pipe(
            map((SprintReplanHistory: any) => {
              if (SprintReplanHistory.success === true) {
                return new LoadSprintReplanHistoryItemsCompleted(SprintReplanHistory.data);
              } else {
                return new LoadSprintReplanHistoryItemsFailed(SprintReplanHistory.apiResponseMessages);
              }
            }),
            catchError(error => {
              return of(new SprintReplanHistoryExceptionHandled(error));
            })
          );
    })
  );

  @Effect()
  showValidationMessagesForSprintReplanHistory$: Observable<Action> = this.actions$.pipe(
    ofType<LoadSprintReplanHistoryItemsFailed>(SprintReplanHistoryActionTypes.LoadSprintReplanHistoryItemsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  SprintReplanHistoryExceptionHandledForSprintReplanHistory$: Observable<Action> = this.actions$.pipe(
    ofType<SprintReplanHistoryExceptionHandled>(SprintReplanHistoryActionTypes.SprintReplanHistoryExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private reportService: GoalLevelReportsService
  ) { }
}