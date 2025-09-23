import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import {
  BoardTypesActionTypes,
  ExceptionHandled,
  LoadBoardTypesCompleted,
  LoadBoardTypesTriggered
} from "../actions/board-types.actions";
import { ShowExceptionMessages } from "../actions/notification-validator.action";
import { DashboardService } from '../../services/dashboard.service';

@Injectable()
export class BoardTypesEffects {
  @Effect()
  loadBoardTypes$: Observable<Action> = this.actions$.pipe(
    ofType<LoadBoardTypesTriggered>(
      BoardTypesActionTypes.LoadBoardTypesTriggered
    ),
    switchMap(() => {
      return this.dashboardService.GetAllBoardTypes().pipe(
        map((user: any) => new LoadBoardTypesCompleted(user.data)),
        catchError((err) => {
          return of(new ExceptionHandled(err));
        })
      );
    })
  );

  @Effect()
  exceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ExceptionHandled>(
      BoardTypesActionTypes.ExceptionHandled
    ),
    switchMap((searchAction) => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService
  ) {}
}
