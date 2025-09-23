// tslint:disable-next-line: ordered-imports
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { catchError, map, switchMap } from "rxjs/operators";
import { BoardTypeService } from "../../services/boardType.service";
import {
  BoardTypesActionTypes,
  BoardTypesExceptionHandled,
  LoadBoardTypesCompleted,
  LoadBoardTypesTriggered
} from "../actions/board-types.action";
import { ShowExceptionMessages } from "../actions/notification-validator.action";

@Injectable()
export class BoardTypesEffects {
  @Effect()
  loadBoardTypes$: Observable<Action> = this.actions$.pipe(
    ofType<LoadBoardTypesTriggered>(
      BoardTypesActionTypes.LoadBoardTypesTriggered
    ),
    switchMap(() => {
      return this.boardTypeService.GetAllBoardTypes().pipe(
        map((user: any) => new LoadBoardTypesCompleted(user.data)),
        catchError((err) => {
          return of(new BoardTypesExceptionHandled(err));
        })
      );
    })
  );

  @Effect()
  exceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<BoardTypesExceptionHandled>(
      BoardTypesActionTypes.BoardTypesExceptionHandled
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
    private boardTypeService: BoardTypeService
  ) {}
}
