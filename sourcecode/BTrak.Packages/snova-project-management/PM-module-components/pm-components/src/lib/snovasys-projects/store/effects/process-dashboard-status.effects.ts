import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import {LoadProcessDashboardStatusTriggered,LoadProcessDashboardStatusCompleted,LoadProcessDashboardStatusFailed,ProcessDashboardStatusExceptionHandled,ProcessDashboardStatusActions,ProcessDashboardStatusActionTypes}from '../actions/process-dashboard-status.action';
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { ProcessDashboardStatusService } from "../../services/processDashboard.service";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";
import { processDashboard } from "../../models/processDashboard";

@Injectable()
export class ProcessDashboardStatusEffects {
    @Effect()
    loadProcessDashboardStatus$: Observable<Action> = this.actions$.pipe(
        ofType<LoadProcessDashboardStatusTriggered>(ProcessDashboardStatusActionTypes.LoadProcessDashboardStatusTriggered),
        switchMap(userStoryTriggeredAction => {
            var dashboard = new processDashboard();
          return this.processDashboardService
            .GetAllProcessDashboardStatus(dashboard)
            .pipe(
              map((result: any) => {
                if (result.success === true) {
                  return new LoadProcessDashboardStatusCompleted(result.data);
                } else {
                  return new LoadProcessDashboardStatusFailed(result.apiResponseMessages);
                }
              }),
              catchError(err => {
                return of(new ProcessDashboardStatusExceptionHandled(err));
              })
            );
        })
      );

      @Effect()
  showValidationMessagesForUserStoryHistory$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadProcessDashboardStatusFailed>(
      ProcessDashboardStatusActionTypes.LoadProcessDashboardStatusFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  
  @Effect()
  ProcessDashboardStatusExceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ProcessDashboardStatusExceptionHandled>(
        ProcessDashboardStatusActionTypes.ProcessDashboardStatusExceptionHandled
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
        private processDashboardService:ProcessDashboardStatusService
      ) {}
}