// tslint:disable-next-line: ordered-imports
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { map, switchMap } from "rxjs/operators";
import { BoardTypeService } from "../../services/boardType.service";
import {
  BoardTypesUiActionTypes,
  LoadBoardTypesUiCompleted,
  LoadBoardTypesUiTriggered
} from "../actions/board-types-ui.action";

@Injectable()
export class BoardTypesUiEffects {
  @Effect()
  loadBoardTypes$: Observable<Action> = this.actions$.pipe(
    ofType<LoadBoardTypesUiTriggered>(
      BoardTypesUiActionTypes.LoadBoardTypesUiTriggered
    ),
    switchMap(() => {
      return this.boardTypeService.GetAllBoardTypesUI().pipe(
        map((boardTypes: any) => {
          // TODO: PLEASE GET RID OF ANY
          return new LoadBoardTypesUiCompleted(boardTypes.data);
        })
      );
    })
  );
  constructor(
    private actions$: Actions,
    private boardTypeService: BoardTypeService
  ) {}
}
