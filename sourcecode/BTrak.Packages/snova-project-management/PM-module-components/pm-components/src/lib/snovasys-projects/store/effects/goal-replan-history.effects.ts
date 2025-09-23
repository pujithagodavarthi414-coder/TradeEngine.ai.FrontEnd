import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { LoadGoalReplanHistoryItemsTriggered, GoalReplanHistoryActionTypes, GoalReplanHistoryExceptionHandled, LoadGoalReplanHistoryItemsCompleted, LoadGoalReplanHistoryItemsFailed } from "../actions/goal-replan-history.action";
import { GoalLevelReportsService } from "../../services/reports.service";
import { ShowExceptionMessages, ShowValidationMessages } from '../actions/notification-validator.action';


@Injectable()
export class GoalReplanHistoryEffects {

  @Effect()
  loadGoalReplanHistory$: Observable<Action> = this.actions$.pipe(
    ofType<LoadGoalReplanHistoryItemsTriggered>(GoalReplanHistoryActionTypes.LoadGoalReplanHistoryItemsTriggered),
    switchMap(searchAction => {
        return this.reportService
          .getGoalReplanHistory(searchAction.goalId, searchAction.goalReplanValue)
          .pipe(
            map((GoalReplanHistory: any) => {
              if (GoalReplanHistory.success === true) {
                return new LoadGoalReplanHistoryItemsCompleted(GoalReplanHistory.data);
              } else {
                return new LoadGoalReplanHistoryItemsFailed(GoalReplanHistory.apiResponseMessages);
              }
            }),
            catchError(error => {
              return of(new GoalReplanHistoryExceptionHandled(error));
            })
          );
    })
  );

  @Effect()
  showValidationMessagesForGoalReplanHistory$: Observable<Action> = this.actions$.pipe(
    ofType<LoadGoalReplanHistoryItemsFailed>(GoalReplanHistoryActionTypes.LoadGoalReplanHistoryItemsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  GoalReplanHistoryExceptionHandledForGoalReplanHistory$: Observable<Action> = this.actions$.pipe(
    ofType<GoalReplanHistoryExceptionHandled>(GoalReplanHistoryActionTypes.GoalReplanHistoryExceptionHandled),
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