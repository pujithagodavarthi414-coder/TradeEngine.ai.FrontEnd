// tslint:disable-next-line: ordered-imports
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { map, switchMap } from "rxjs/operators";
import { BoardTypeService } from "../../services/boardType.service";
import {
  BoardTypesApiActionTypes,
  LoadBoardTypesExceptionHandled,
  LoadBoardTypesApiCompleted,
  LoadBoardTypesApiTriggered
} from "../actions/board-types-api.action";
import { ShowExceptionMessages } from "../actions/notification-validator.action";

@Injectable()
export class BoardTypesApiEffects {
  @Effect()
  loadBoardTypes$: Observable<Action> = this.actions$.pipe(
    ofType<LoadBoardTypesApiTriggered>(
      BoardTypesApiActionTypes.LoadBoardTypesApiTriggered
    ),
    switchMap(() => {
      return this.boardTypeService.GetAllBoardTypeApi("").pipe(
        map((boardTypesApi: any) => {
          // TODO: PLEASE GET RID OF ANY
          return new LoadBoardTypesApiCompleted(boardTypesApi.data);
        })
      );
    })
  );

  @Effect()
  exceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadBoardTypesExceptionHandled>(
      BoardTypesApiActionTypes.LoadBoardTypesExceptionHandled
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
